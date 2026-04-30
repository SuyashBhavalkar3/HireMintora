/**
 * @file websocketServer.js
 * @description WebSocket server factory for the AI interview engine.
 *
 * Creates a `ws` WebSocketServer that upgrades HTTP connections at `/ws/interview`.
 * On each new connection:
 *   1. Parses query params (sessionId, tokenId, mode).
 *   2. Creates or retrieves an InterviewSession via SessionManager.
 *   3. Instantiates STT, LLM, and TTS service singletons (shared across sessions).
 *   4. Routes incoming messages (audio_chunk, audio_end, text_answer, etc.)
 *      to the appropriate session method.
 *   5. Handles disconnect and cleanup.
 *
 * Called from server.js after the HTTP server is created.
 */

const { WebSocketServer } = require("ws");
const { SessionManager } = require("./sessionManager");
const { ConfigurableLlmService } = require("./services/llmService");
const { SarvamSttService } = require("./services/sttService");
const { SarvamTtsService } = require("./services/ttsService");
const { prisma } = require("../lib/prismaClient");
const { INTERVIEW_MODES, WS_EVENTS } = require("./constants");

/**
 * Validates and parses the requested interview mode.
 * Defaults to DEFAULT mode if an invalid mode is provided.
 *
 * @param {string} rawMode - The raw mode string from the client.
 * @returns {string} The validated interview mode.
 */
function parseMode(rawMode) {
  return rawMode === INTERVIEW_MODES.CODING ? INTERVIEW_MODES.CODING : INTERVIEW_MODES.DEFAULT;
}

/**
 * Safely parses incoming JSON messages from the WebSocket.
 *
 * @param {Buffer|string} raw - The raw message buffer or string.
 * @returns {Object|null} The parsed JSON object, or null if invalid.
 */
function parseIncomingMessage(raw) {
  try {
    const parsed = JSON.parse(raw.toString());
    if (!parsed || typeof parsed !== "object") {
      return null;
    }
    return parsed;
  } catch (_error) {
    return null;
  }
}

/**
 * Creates and configures the WebSocket server for AI interviews.
 * Sets up routing, attaches the service dependencies, and manages client connections.
 *
 * @param {http.Server} httpServer - The underlying HTTP server to attach to.
 * @param {Object} options - Optional configuration overrides and dependencies.
 * @returns {Object} An object containing the WebSocket server and the SessionManager.
 */
function createInterviewWebSocketServer(httpServer, options = {}) {
  const wss = new WebSocketServer({
    server: httpServer,
    path: options.path || "/ws/interview",
  });

  const sttService = options.sttService || new SarvamSttService();
  const ttsService = options.ttsService || new SarvamTtsService();
  const llmService = options.llmService || new ConfigurableLlmService();

  const sessionManager = new SessionManager({
    sttService,
    ttsService,
    llmService,
    prisma,
  });

  wss.on("connection", async (ws, req) => {
    const requestUrl = new URL(req.url, "http://localhost");
    const sessionId = requestUrl.searchParams.get("sessionId");
    const tokenId = requestUrl.searchParams.get("tokenId");
    const mode = parseMode(requestUrl.searchParams.get("mode"));

    if (!sessionId) {
      ws.close(1008, "sessionId is required");
      return;
    }

    // Currently passing a default prompt. In the future, this can be dynamically 
    // fetched from the database using the tokenId to give candidate-specific context.
    const systemPrompt = "You are a senior technical interviewer. Respond conversationally in 2-4 concise sentences. Ask one useful follow-up question at the end.";

    let activeSession = await sessionManager.attachConnection(sessionId, ws, { 
      mode,
      tokenId: tokenId || null,
      systemPrompt
    });

    ws.on("message", async (rawMessage) => {
      const message = parseIncomingMessage(rawMessage);
      if (!message || !message.type) {
        return;
      }

      const targetSessionId = message.sessionId || sessionId;
      if (targetSessionId !== activeSession.sessionId) {
        sessionManager.detachConnection(activeSession.sessionId, ws);
        activeSession = sessionManager.attachConnection(targetSessionId, ws, {
          mode: parseMode(message.mode || mode),
          tokenId: tokenId || null,
          systemPrompt
        });
      }

      const payload = message.payload || {};

      switch (message.type) {
        case WS_EVENTS.AUDIO_CHUNK:
          await activeSession.handleAudioChunk(payload);
          break;
        case WS_EVENTS.AUDIO_END:
          await activeSession.handleAudioEnd(payload);
          break;
        case WS_EVENTS.TEXT_ANSWER:
          await activeSession.handleTextAnswer(payload);
          break;
        case WS_EVENTS.CODE_SUBMISSION:
          await activeSession.handleCodeSubmission(payload);
          break;
        case WS_EVENTS.START_INTERVIEW:
          await activeSession.handleStartInterview();
          break;
        case WS_EVENTS.CANCEL_TURN:
          activeSession.cancelCurrentTurn("client_cancelled");
          break;
        default:
          break;
      }
    });

    ws.on("close", () => {
      sessionManager.detachConnection(activeSession.sessionId, ws);
    });

    ws.on("error", () => {
      sessionManager.detachConnection(activeSession.sessionId, ws);
    });
  });

  return {
    wss,
    sessionManager,
  };
}

module.exports = {
  createInterviewWebSocketServer,
};
