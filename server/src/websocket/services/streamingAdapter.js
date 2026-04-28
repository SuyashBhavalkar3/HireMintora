/**
 * @file streamingAdapter.js
 * @description Base abstraction for all streaming AI services (STT, TTS).
 *
 * Provides a reusable lifecycle for managing external WebSocket/streaming connections:
 *   1. open()      — Establish the connection to the external provider.
 *   2. pushChunk() — Send data chunks (audio or text) to the provider.
 *   3. endStream() — Signal that no more data will be sent; wait for finalization.
 *   4. close()     — Tear down the connection and release resources.
 *
 * Features:
 * - Automatic connection timeout handling (prevents hanging on provider failures).
 * - Chunk queuing during connection setup (no data loss if pushChunk is called before open completes).
 * - Performance metrics tracking (chunks sent/received, latency measurements).
 * - Structured debug logging (enable via SARVAM_STREAMING_DEBUG=true env var).
 *
 * Both SarvamSttService and SarvamTtsService extend this class and implement
 * their own `open`, `pushChunk`, `endStream`, and `close` factory methods.
 */

/**
 * Reads an environment variable with a fallback default.
 * @param {string} name - The env var name.
 * @param {string} [fallback=""] - Default value if the env var is missing or empty.
 * @returns {string}
 */
function readEnv(name, fallback = "") {
  const value = process.env[name];
  if (typeof value !== "string") {
    return fallback;
  }
  return value.trim() || fallback;
}

/**
 * Normalizes any error-like value into a proper Error instance.
 * Handles strings, Error objects, and arbitrary objects (JSON-serialized).
 * @param {*} errorLike
 * @returns {Error}
 */
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

/**
 * Base class for streaming AI service adapters.
 * Subclasses (SarvamSttService, SarvamTtsService) provide concrete
 * `open`, `pushChunk`, `endStream`, and `close` factory implementations.
 */
class StreamingAdapter {
  /**
   * @param {Object} options
   * @param {string} [options.serviceName='stream'] - Label for debug logs.
   * @param {boolean} [options.debugEnabled] - Override to enable/disable debug logging.
   * @param {number} [options.connectTimeoutMs=7000] - Max ms to wait for provider connection.
   */
  constructor(options = {}) {
    this.serviceName = options.serviceName || "stream";
    this.debugEnabled =
      options.debugEnabled ??
      String(readEnv("SARVAM_STREAMING_DEBUG", "false")).toLowerCase() === "true";
    this.connectTimeoutMs = Number(
      options.connectTimeoutMs || readEnv("SARVAM_STREAMING_CONNECT_TIMEOUT_MS", "7000"),
    );
  }

  /**
   * Creates a managed streaming session with automatic lifecycle handling.
   *
   * @param {Object} handlers - Callback handlers from the consumer.
   * @param {string} [handlers.turnId] - Correlation ID for this stream.
   * @param {Function} [handlers.onPartial] - Called with partial results (e.g., interim STT text).
   * @param {Function} [handlers.onFinal] - Called with the final result.
   * @param {Function} [handlers.onError] - Called on any error.
   * @param {Object} factory - Provider-specific lifecycle implementations.
   * @param {Function} factory.open - Establishes provider connection; must return the connection object.
   * @param {Function} factory.pushChunk - Sends a data chunk to the provider.
   * @param {Function} [factory.endStream] - Signals end-of-input to the provider.
   * @param {Function} [factory.close] - Tears down the provider connection.
   * @returns {{ pushChunk: Function, endStream: Function }} Stream control interface.
   */
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

  /**
   * Creates a snapshot of the current streaming metrics for debug output.
   * @param {Object} metrics - The metrics object to snapshot.
   * @returns {Object}
   * @private
   */
  _metricsSnapshot(metrics) {
    return {
      chunksSent: metrics.chunksSent,
      chunksReceived: metrics.chunksReceived,
      firstResponseLatencyMs: metrics.firstResponseLatencyMs,
      finalizeLatencyMs: metrics.finalizeLatencyMs,
    };
  }

  /**
   * Logs a structured debug event if debug mode is enabled.
   * Enable via env var: SARVAM_STREAMING_DEBUG=true
   * @param {string} event - Event label (e.g., 'open', 'end', 'error').
   * @param {Object} data - Additional data to include in the log.
   * @private
   */
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
