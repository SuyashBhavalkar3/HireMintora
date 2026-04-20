function readEnv(name, fallback = "") {
  const value = process.env[name];
  if (typeof value !== "string") {
    return fallback;
  }
  return value.trim() || fallback;
}

function toError(errorLike) {
  if (errorLike instanceof Error) {
    return errorLike;
  }
  if (typeof errorLike === "string") {
    return new Error(errorLike);
  }
  try {
    return new Error(JSON.stringify(errorLike));
  } catch (_error) {
    return new Error("Unknown streaming error");
  }
}

function nowMs() {
  return Date.now();
}

class StreamingAdapter {
  constructor(options = {}) {
    this.serviceName = options.serviceName || "stream";
    this.debugEnabled =
      options.debugEnabled ??
      String(readEnv("SARVAM_STREAMING_DEBUG", "false")).toLowerCase() === "true";
    this.connectTimeoutMs = Number(
      options.connectTimeoutMs || readEnv("SARVAM_STREAMING_CONNECT_TIMEOUT_MS", "7000"),
    );
  }

  createStream(handlers = {}, factory = {}) {
    const turnId = handlers.turnId || null;
    const startedAt = nowMs();
    const metrics = {
      chunksSent: 0,
      chunksReceived: 0,
      firstResponseLatencyMs: null,
      finalizeLatencyMs: null,
      startedAt,
    };

    const queuedChunks = [];
    let opening = false;
    let opened = false;
    let ended = false;
    let openingPromise = null;
    let endPromise = null;
    let connection = null;
    let closing = false;

    const emitError = (errorLike) => {
      const error = toError(errorLike);
      this._debug("error", { turnId, error: error.message, ...this._metricsSnapshot(metrics) });
      if (handlers.onError) {
        handlers.onError(error);
      }
    };

    const markProviderMessage = () => {
      metrics.chunksReceived += 1;
      if (metrics.firstResponseLatencyMs === null) {
        metrics.firstResponseLatencyMs = nowMs() - startedAt;
      }
    };

    const context = {
      serviceName: this.serviceName,
      metrics,
      markProviderMessage,
      emitError,
      emitPartial: (value) => {
        if (handlers.onPartial) {
          handlers.onPartial(value);
        }
      },
      emitFinal: async (value) => {
        if (handlers.onFinal) {
          await handlers.onFinal(value);
        }
      },
      debug: (event, extra = {}) => {
        this._debug(event, { turnId, ...extra, ...this._metricsSnapshot(metrics) });
      },
    };

    const withTimeout = (promise) =>
      new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error(`${this.serviceName} open timeout (${this.connectTimeoutMs}ms)`));
        }, this.connectTimeoutMs);

        promise
          .then((value) => {
            clearTimeout(timeout);
            resolve(value);
          })
          .catch((error) => {
            clearTimeout(timeout);
            reject(error);
          });
      });

    const flushQueued = async () => {
      while (queuedChunks.length > 0) {
        const chunk = queuedChunks.shift();
        await factory.pushChunk(connection, chunk, context);
      }
    };

    const ensureOpen = async () => {
      if (opened) {
        return;
      }

      if (openingPromise) {
        await openingPromise;
        return;
      }

      opening = true;
      openingPromise = withTimeout(Promise.resolve(factory.open(context)))
        .then(async (conn) => {
          connection = conn;
          opened = true;
          opening = false;
          this._debug("open", { turnId, ...this._metricsSnapshot(metrics) });
          await flushQueued();
        })
        .catch((error) => {
          opening = false;
          emitError(error);
          throw error;
        });

      await openingPromise;
    };

    const closeConnection = async () => {
      if (!connection || closing) {
        return;
      }
      closing = true;
      try {
        if (factory.close) {
          await factory.close(connection, context);
        }
      } catch (error) {
        emitError(error);
      }
    };

    return {
      pushChunk: async (chunk) => {
        if (ended) {
          throw new Error(`${this.serviceName} stream is already finalized`);
        }

        metrics.chunksSent += 1;

        if (!opened && opening) {
          queuedChunks.push(chunk);
          return;
        }

        if (!opened) {
          queuedChunks.push(chunk);
          await ensureOpen();
          return;
        }

        await factory.pushChunk(connection, chunk, context);
      },

      endStream: async () => {
        if (endPromise) {
          return endPromise;
        }

        ended = true;
        const endStart = nowMs();

        endPromise = (async () => {
          try {
            if (!opened) {
              if (!openingPromise) {
                await ensureOpen();
              } else {
                await openingPromise;
              }
            }

            await flushQueued();
            if (factory.endStream) {
              await factory.endStream(connection, context);
            }
          } catch (error) {
            emitError(error);
          } finally {
            metrics.finalizeLatencyMs = nowMs() - endStart;
            await closeConnection();
            this._debug("end", { turnId, ...this._metricsSnapshot(metrics) });
          }
        })();

        return endPromise;
      },
    };
  }

  _metricsSnapshot(metrics) {
    return {
      chunksSent: metrics.chunksSent,
      chunksReceived: metrics.chunksReceived,
      firstResponseLatencyMs: metrics.firstResponseLatencyMs,
      finalizeLatencyMs: metrics.finalizeLatencyMs,
    };
  }

  _debug(event, data = {}) {
    if (!this.debugEnabled) {
      return;
    }
    // eslint-disable-next-line no-console
    console.log(
      `[stream:${this.serviceName}] ${JSON.stringify({
        event,
        ...data,
      })}`,
    );
  }
}

module.exports = {
  StreamingAdapter,
  readEnv,
};
