const { InterviewSession } = require("./interviewSession");

/**
 * Manages active interview sessions across the WebSocket server.
 * Ensures that multiple WebSocket connections for the same session ID share the same state.
 */
class SessionManager {
  /**
   * Initializes the SessionManager.
   *
   * @param {Object} dependencies - Core services (sttService, ttsService, llmService, prisma).
   */
  constructor(dependencies) {
    this.dependencies = dependencies;
    this.sessions = new Map();
  }

  /**
   * Retrieves an existing session or creates a new one if it does not exist.
   * Updates session options (mode, systemPrompt, tokenId) if provided.
   *
   * @param {string} sessionId - The unique identifier for the session.
   * @param {Object} options - Optional configuration to update or initialize the session.
   * @returns {InterviewSession} The active interview session instance.
   */
  getOrCreateSession(sessionId, options = {}) {
    if (!sessionId) {
      throw new Error("sessionId is required");
    }

    if (!this.sessions.has(sessionId)) {
      const session = new InterviewSession(sessionId, this.dependencies, options);
      this.sessions.set(sessionId, session);
      return session;
    }

    const existingSession = this.sessions.get(sessionId);
    if (options.mode) {
      existingSession.setMode(options.mode);
    }
    if (options.systemPrompt) {
      existingSession.setSystemPrompt(options.systemPrompt);
    }
    if (options.tokenId && !existingSession.tokenId) {
      existingSession.tokenId = options.tokenId;
    }
    return existingSession;
  }

  /**
   * Attaches a WebSocket client connection to a specific session.
   *
   * @param {string} sessionId - The target session ID.
   * @param {WebSocket} ws - The client WebSocket connection.
   * @param {Object} options - Optional configuration for the session.
   * @returns {InterviewSession} The active interview session instance.
   */
  attachConnection(sessionId, ws, options = {}) {
    const session = this.getOrCreateSession(sessionId, options);
    session.attachConnection(ws);
    return session;
  }

  /**
   * Detaches a WebSocket client connection from a session.
   * If the session has no more active connections, it cleans up and deletes the session.
   *
   * @param {string} sessionId - The session ID to detach from.
   * @param {WebSocket} ws - The client WebSocket connection.
   */
  detachConnection(sessionId, ws) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return;
    }

    session.detachConnection(ws);
    if (!session.hasConnections()) {
      session.cancelCurrentTurn("session_closed");
      this.sessions.delete(sessionId);
    }
  }
}

module.exports = {
  SessionManager,
};
