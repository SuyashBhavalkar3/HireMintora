const { SarvamAIClient } = require("sarvamai");
const { StreamingAdapter, readEnv } = require("./streamingAdapter");

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

function normalizeAudioPayload(audioBase64, encoding, sampleRate) {
  const normalizedEncoding = String(encoding || "").toLowerCase();
  const isPcm =
    normalizedEncoding === "pcm_s16le" ||
    normalizedEncoding === "pcm_l16" ||
    normalizedEncoding === "pcm_raw";

  if (!isPcm) {
    return {
      audio: audioBase64,
      encoding: normalizedEncoding || "audio/wav",
      sampleRate,
    };
  }

  try {
    const pcmBuffer = Buffer.from(audioBase64, "base64");
    const wavBuffer = buildWavFromPcm16Mono(pcmBuffer, sampleRate);
    return {
      audio: wavBuffer.toString("base64"),
      encoding: "audio/wav",
      sampleRate,
    };
  } catch (_error) {
    return {
      audio: audioBase64,
      encoding: "audio/wav",
      sampleRate,
    };
  }
}

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

class SarvamSttService extends StreamingAdapter {
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
