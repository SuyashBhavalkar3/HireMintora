const { InterviewSession } = require("./interviewSession");

class SessionManager {
  constructor(dependencies) {
    this.dependencies = dependencies;
    this.sessions = new Map();
  }

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

  attachConnection(sessionId, ws, options = {}) {
    const session = this.getOrCreateSession(sessionId, options);
    session.attachConnection(ws);
    return session;
  }

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
