const { WebSocket } = require("ws");
const { StreamingAdapter, readEnv } = require("./streamingAdapter");

class AsyncQueue {
  constructor() {
    this.items = [];
    this.waiters = [];
    this.closed = false;
  }

  push(item) {
    if (this.closed) {
      return;
    }
    if (this.waiters.length > 0) {
      const waiter = this.waiters.shift();
      waiter({ value: item, done: false });
      return;
    }
    this.items.push(item);
  }

  close() {
    this.closed = true;
    while (this.waiters.length > 0) {
      const waiter = this.waiters.shift();
      waiter({ value: undefined, done: true });
    }
  }

  next() {
    if (this.items.length > 0) {
      return Promise.resolve({ value: this.items.shift(), done: false });
    }
    if (this.closed) {
      return Promise.resolve({ value: undefined, done: true });
    }
    return new Promise((resolve) => {
      this.waiters.push(resolve);
    });
  }
}

class SarvamTtsService extends StreamingAdapter {
  constructor(options = {}) {
    super({
      serviceName: "tts",
      debugEnabled: options.debugEnabled,
      connectTimeoutMs:
        options.connectTimeoutMs || readEnv("SARVAM_TTS_CONNECT_TIMEOUT_MS", "7000"),
    });

    this.apiKey = options.apiKey || readEnv("SARVAM_API_KEY");
    this.endpoint =
      options.endpoint || readEnv("SARVAM_TTS_WS_URL", "wss://api.sarvam.ai/text-to-speech/ws");
    this.model = options.model || readEnv("SARVAM_TTS_MODEL", "bulbul:v3");
    this.targetLanguageCode =
      options.targetLanguageCode || readEnv("SARVAM_TTS_LANGUAGE_CODE", "en-IN");
    this.speaker = options.speaker || readEnv("SARVAM_TTS_SPEAKER", "shubh");
    this.pace = Number(options.pace || readEnv("SARVAM_TTS_PACE", "1.0"));
    this.outputAudioCodec =
      options.outputAudioCodec || readEnv("SARVAM_TTS_OUTPUT_AUDIO_CODEC", "mp3");
    this.outputAudioBitrate =
      options.outputAudioBitrate || readEnv("SARVAM_TTS_OUTPUT_AUDIO_BITRATE", "128k");
    this.minBufferSize = Number(options.minBufferSize || readEnv("SARVAM_TTS_MIN_BUFFER_SIZE", "30"));
    this.maxChunkLength = Number(
      options.maxChunkLength || readEnv("SARVAM_TTS_MAX_CHUNK_LENGTH", "200"),
    );
    this.finalizeWaitMs = Number(
      options.finalizeWaitMs || readEnv("SARVAM_TTS_FINALIZE_WAIT_MS", "12000"),
    );
  }

  createStream(handlers = {}) {
    if (!this.apiKey) {
      throw new Error("SARVAM_API_KEY is required for TTS service");
    }

    let openResolve;
    let openReject;
    let doneResolve;
    let doneReject;
    const openPromise = new Promise((resolve, reject) => {
      openResolve = resolve;
      openReject = reject;
    });
    const donePromise = new Promise((resolve, reject) => {
      doneResolve = resolve;
      doneReject = reject;
    });

    return this.createStreamWithAdapter(handlers, {
      open: async (ctx) => {
        const url = new URL(this.endpoint);
        url.searchParams.set("model", this.model);
        url.searchParams.set("send_completion_event", "true");

        const socket = new WebSocket(url.toString(), {
          headers: {
            "Api-Subscription-Key": this.apiKey,
          },
        });

        socket.on("open", () => {
          openResolve();
          socket.send(
            JSON.stringify({
              type: "config",
              data: {
                speaker: this.speaker,
                target_language_code: this.targetLanguageCode,
                pace: this.pace,
                min_buffer_size: this.minBufferSize,
                max_chunk_length: this.maxChunkLength,
                output_audio_codec: this.outputAudioCodec,
                output_audio_bitrate: this.outputAudioBitrate,
              },
            }),
          );
        });

        socket.on("message", (rawMessage) => {
          ctx.markProviderMessage();
          let parsed;
          try {
            parsed = JSON.parse(rawMessage.toString());
          } catch (_error) {
            return;
          }

          if (parsed?.type === "audio" && parsed?.data?.audio) {
            const codec = (parsed?.data?.output_audio_codec || this.outputAudioCodec || "mp3").toLowerCase();
            const contentType = codec === "wav" ? "audio/wav" : "audio/mpeg";
            if (handlers.onAudio) {
              handlers.onAudio({
                audio: parsed.data.audio,
                contentType,
              });
            }
            return;
          }

          const eventType = parsed?.data?.event_type || parsed?.event_type || parsed?.type;
          if (eventType === "error") {
            const message = parsed?.data?.error || parsed?.error || "TTS provider error";
            ctx.emitError(new Error(String(message)));
            if (doneReject) {
              doneReject(new Error(String(message)));
            }
            return;
          }

          if (eventType === "final" || eventType === "completed" || eventType === "complete") {
            if (doneResolve) {
              doneResolve();
            }
            if (handlers.onDone) {
              handlers.onDone();
            }
          }
        });

        socket.on("error", (error) => {
          openReject(error);
          ctx.emitError(error);
          if (doneReject) {
            doneReject(error);
          }
        });

        socket.on("close", () => {
          if (doneResolve) {
            doneResolve();
          }
          if (handlers.onDone) {
            handlers.onDone();
          }
        });

        await openPromise;
        return socket;
      },
      pushChunk: async (socket, chunkPayload) => {
        const normalized =
          typeof chunkPayload === "string"
            ? { text: chunkPayload }
            : chunkPayload || {};
        const text = typeof normalized.text === "string" ? normalized.text.trim() : "";
        if (!text) {
          return;
        }

        socket.send(
          JSON.stringify({
            type: "text",
            data: {
              text,
            },
          }),
        );
      },
      endStream: async (socket) => {
        socket.send(JSON.stringify({ type: "flush" }));
        await Promise.race([
          donePromise.catch(() => undefined),
          new Promise((resolve) => setTimeout(resolve, this.finalizeWaitMs)),
        ]);
      },
      close: async (socket) => {
        if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
          socket.close();
        }
      },
    });
  }

  createStreamWithAdapter(handlers, factory) {
    return super.createStream(handlers, factory);
  }

  async *streamSpeech(text, signal, options = {}) {
    const cleanText = typeof text === "string" ? text.trim() : "";
    if (!cleanText) {
      return;
    }

    const queue = new AsyncQueue();
    const stream = this.createStream({
      turnId: options.turnId || null,
      onAudio: (audioChunk) => queue.push(audioChunk),
      onDone: () => queue.close(),
      onError: () => queue.close(),
    });

    await stream.pushChunk({ text: cleanText });
    await stream.endStream();

    while (true) {
      if (signal?.aborted) {
        queue.close();
        return;
      }

      const { value, done } = await queue.next();
      if (done) {
        return;
      }

      yield value;
    }
  }
}

module.exports = {
  SarvamTtsService,
};
