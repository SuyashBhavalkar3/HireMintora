const { WebSocketServer } = require("ws");
const { SessionManager } = require("./sessionManager");
const { ConfigurableLlmService } = require("./services/llmService");
const { SarvamSttService } = require("./services/sttService");
const { SarvamTtsService } = require("./services/ttsService");
const { INTERVIEW_MODES, WS_EVENTS } = require("./constants");

function parseMode(rawMode) {
  return rawMode === INTERVIEW_MODES.CODING ? INTERVIEW_MODES.CODING : INTERVIEW_MODES.DEFAULT;
}

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
  });

  wss.on("connection", (ws, req) => {
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

    let activeSession = sessionManager.attachConnection(sessionId, ws, { 
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
