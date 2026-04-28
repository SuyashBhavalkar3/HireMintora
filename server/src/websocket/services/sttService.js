/**
 * @file sttService.js
 * @description Sarvam AI Speech-to-Text (STT) streaming service.
 *
 * This service connects to Sarvam's real-time STT WebSocket API to transcribe
 * live candidate audio into text. It extends StreamingAdapter to handle the
 * connection lifecycle, chunk buffering, and error recovery.
 *
 * Audio Flow:
 *   Browser mic → PCM16 base64 chunks → this service → Sarvam STT WebSocket
 *   → partial transcriptions (live) → final transcription (on audio_end)
 *
 * Configuration: All settings are read from env vars (SARVAM_STT_*).
 * See `.env.example` for the full list.
 */

const { SarvamAIClient } = require("sarvamai");
const { StreamingAdapter, readEnv } = require("./streamingAdapter");

/**
 * Constructs a minimal WAV file header for raw PCM16 mono audio.
 * Used when the upstream provider expects audio/wav encoding.
 *
 * @param {Buffer} pcmBuffer - Raw PCM16 audio data.
 * @param {number} sampleRate - Sample rate in Hz (e.g., 16000).
 * @returns {Buffer} A valid WAV file (44-byte header + PCM data).
 */
function buildWavFromPcm16Mono(pcmBuffer, sampleRate) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const byteRate = sampleRate * blockAlign;
  const dataSize = pcmBuffer.length;
  const header = Buffer.alloc(44);

  header.write("RIFF", 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, pcmBuffer]);
}

/**
 * Normalizes the audio payload for Sarvam's STT API.
 *
 * WORKAROUND: Sarvam's backend has a strict Pydantic validation that requires
 * `encoding: 'audio/wav'` in the JSON payload, even when the WebSocket
 * connection was established with `input_audio_codec: 'pcm_s16le'`.
 * We send the raw PCM data but label it as 'audio/wav' to bypass this.
 *
 * @param {string} audioBase64 - Base64-encoded audio data.
 * @param {string} encoding - Original encoding label (ignored in practice).
 * @param {number} sampleRate - Audio sample rate.
 * @returns {{ audio: string, encoding: string, sampleRate: number }}
 */
function normalizeAudioPayload(audioBase64, encoding, sampleRate) {
  return {
    audio: audioBase64,
    encoding: "audio/wav",
    sampleRate,
  };
}

/**
 * Extracts a human-readable error message from Sarvam provider responses.
 * Handles various response shapes (nested data objects, direct fields, etc.).
 *
 * @param {Object} message - The raw provider message object.
 * @returns {string} Extracted error string, or empty string if none found.
 */
function extractProviderError(message) {
  if (!message || typeof message !== "object") {
    return "";
  }

  const fromData =
    typeof message.data === "object" && message.data
      ? message.data.error || message.data.message || message.data.code
      : "";
  const direct = message.error || message.message || message.code || "";
  const picked = fromData || direct;

  if (typeof picked === "string" && picked.trim()) {
    return picked.trim();
  }

  try {
    return JSON.stringify(message);
  } catch (_error) {
    return "";
  }
}

/**
 * Sarvam STT streaming service.
 * Creates a real-time WebSocket connection to Sarvam's STT API,
 * accumulates partial transcriptions, and delivers the final transcript.
 *
 * Usage:
 *   const stt = new SarvamSttService();
 *   const stream = stt.createStream({ onPartial, onFinal, onError });
 *   await stream.pushAudioChunk(base64AudioPayload);
 *   await stream.endStream(); // triggers final transcript delivery
 *
 * @extends StreamingAdapter
 */
class SarvamSttService extends StreamingAdapter {
  /**
   * @param {Object} [options] - Override defaults from env vars.
   * @param {string} [options.apiKey] - Sarvam API key (default: SARVAM_API_KEY env var).
   * @param {string} [options.languageCode] - BCP-47 language code (default: 'en-IN').
   * @param {string} [options.model] - STT model name (default: 'saaras:v3').
   */
  constructor(options = {}) {
    super({
      serviceName: "stt",
      debugEnabled: options.debugEnabled,
      connectTimeoutMs:
        options.connectTimeoutMs || readEnv("SARVAM_STT_CONNECT_TIMEOUT_MS", "7000"),
    });

    this.apiKey = options.apiKey || readEnv("SARVAM_API_KEY");
    this.languageCode = options.languageCode || readEnv("SARVAM_STT_LANGUAGE_CODE", "en-IN");
    this.model = options.model || readEnv("SARVAM_STT_MODEL", "saaras:v3");
    this.mode = options.mode || readEnv("SARVAM_STT_MODE", "transcribe");
    this.sampleRate = Number(options.sampleRate || readEnv("SARVAM_STT_SAMPLE_RATE", "16000"));
    this.inputAudioCodec =
      options.inputAudioCodec || readEnv("SARVAM_STT_INPUT_AUDIO_CODEC", "pcm_s16le");
    this.highVadSensitivity =
      String(
        options.highVadSensitivity ??
          readEnv("SARVAM_STT_HIGH_VAD_SENSITIVITY", "true"),
      ).toLowerCase() === "true";
    this.vadSignals =
      String(options.vadSignals ?? readEnv("SARVAM_STT_VAD_SIGNALS", "true")).toLowerCase() ===
      "true";
    this.flushSignal =
      String(options.flushSignal ?? readEnv("SARVAM_STT_FLUSH_SIGNAL", "true")).toLowerCase() ===
      "true";
    this.finalizeWaitMs = Number(
      options.finalizeWaitMs || readEnv("SARVAM_STT_FINALIZE_WAIT_MS", "1500"),
    );
    this.noSpeechText = options.noSpeechText || readEnv("SARVAM_STT_NO_SPEECH_TEXT", "No speech recognized.");

    this.client =
      options.client ||
      new SarvamAIClient({
        apiSubscriptionKey: this.apiKey,
      });
  }

  createStream(handlers = {}) {
    if (!this.apiKey) {
      throw new Error("SARVAM_API_KEY is required for STT service");
    }

    let accumulatedTranscript = "";
    let finalDelivered = false;

    const stream = this.createStreamWithAdapter(handlers, {
      open: async (ctx) => {
        const socket = await this.client.speechToTextStreaming.connect({
          "language-code": this.languageCode,
          model: this.model,
          sample_rate: String(this.sampleRate),
          input_audio_codec: this.inputAudioCodec,
          high_vad_sensitivity: this.highVadSensitivity,
          vad_signals: this.vadSignals,
          flush_signal: this.flushSignal,
        });

        socket.on("message", (message) => {
          ctx.markProviderMessage();

          if (!message || typeof message !== "object") {
            return;
          }

          if (message.type === "error") {
            const errorMessage = extractProviderError(message) || "STT provider returned an unknown error";
            ctx.emitError(new Error(errorMessage));
            return;
          }

          if (message.type === "events") {
            return;
          }

          if (message.type === "data" && message.data && typeof message.data.transcript === "string") {
            const chunk = message.data.transcript.trim();
            if (chunk) {
              accumulatedTranscript = accumulatedTranscript ? accumulatedTranscript + " " + chunk : chunk;
              ctx.emitPartial(accumulatedTranscript);
            }
          }
        });

        socket.on("error", (error) => {
          ctx.emitError(error);
        });

        await socket.waitForOpen();
        return socket;
      },
      pushChunk: async (socket, chunkPayload) => {
        const normalized =
          typeof chunkPayload === "string"
            ? { audio: chunkPayload }
            : chunkPayload || {};

        const audio =
          typeof normalized.audio === "string"
            ? normalized.audio
            : typeof normalized.data === "string"
              ? normalized.data
              : "";

        if (!audio) {
          return;
        }

        const sampleRate = Number(normalized.sampleRate || normalized.sample_rate || this.sampleRate);
        const encoding = normalized.encoding || this.inputAudioCodec;
        const normalizedAudio = normalizeAudioPayload(audio, encoding, sampleRate);
        socket.transcribe({
          audio: normalizedAudio.audio,
          sample_rate: normalizedAudio.sampleRate,
          encoding: normalizedAudio.encoding,
        });
      },
      endStream: async (socket, ctx) => {
        if (this.flushSignal) {
          socket.flush();
        }

        await new Promise((resolve) => setTimeout(resolve, this.finalizeWaitMs));
        const finalTranscript = accumulatedTranscript.trim() || this.noSpeechText;
        finalDelivered = true;
        await ctx.emitFinal(finalTranscript);
      },
      close: async (socket, ctx) => {
        if (!finalDelivered) {
          ctx.emitError(new Error("STT stream closed before final transcript"));
        }
        try {
          socket.close();
        } catch (error) {
          ctx.emitError(error);
        }
      },
    });

    return {
      pushChunk: stream.pushChunk,
      pushAudioChunk: stream.pushChunk,
      endStream: stream.endStream,
    };
  }

  createStreamWithAdapter(handlers, factory) {
    return super.createStream(handlers, factory);
  }
}

module.exports = {
  SarvamSttService,
};
