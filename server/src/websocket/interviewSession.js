const { randomUUID } = require("crypto");
const { WebSocket } = require("ws");
const { SentenceBuffer } = require("./sentenceBuffer");
const { InterviewStateMachine } = require("./stateMachine");
const { INTERVIEW_MODES, INTERVIEW_STATES, WS_EVENTS } = require("./constants");

class InterviewSession {
  constructor(sessionId, dependencies = {}, options = {}) {
    this.sessionId = sessionId;
    this.tokenId = options.tokenId || null;
    this.mode = options.mode || INTERVIEW_MODES.DEFAULT;
    this.systemPrompt = options.systemPrompt || "You are a senior technical interviewer. Respond conversationally in 2-4 concise sentences. Ask one useful follow-up question at the end.";
    this.connections = new Set();
    this.stateMachine = new InterviewStateMachine();
    this.sentenceBuffer = new SentenceBuffer();

    this.sttService = dependencies.sttService;
    this.ttsService = dependencies.ttsService;
    this.llmService = dependencies.llmService;
    this.prisma = dependencies.prisma;

    this.activeAudioInput = null;
    this.activeTurn = null;
    this.activeSttTurnId = null; // Track active STT stream to prevent orphaned callbacks
    this.sttStreamBlocked = false;

    this.interviewId = null;
  }

  async attachConnection(ws) {
    this.connections.add(ws);
    this._emitStateChange(null, "connected");

    // Ensure we have an interview record as soon as someone connects
    await this._ensureInterviewRecord();
  }

  detachConnection(ws) {
    this.connections.delete(ws);
  }

  hasConnections() {
    return this.connections.size > 0;
  }

  setMode(mode) {
    if (!mode) {
      return;
    }
    this.mode = mode;
    this._emitStateChange(this.activeTurn?.turnId || null, "mode_updated");
  }

  setSystemPrompt(prompt) {
    if (prompt) {
      this.systemPrompt = prompt;
    }
  }

  async handleAudioChunk(payload = {}) {
    if (this.mode === INTERVIEW_MODES.CODING) {
      return;
    }

    if (!this.stateMachine.isListening()) {
      return;
    }

    if (this.sttStreamBlocked) {
      return;
    }

    try {
      if (!this.activeAudioInput) {
        this.activeAudioInput = this._createAudioInputStream();
      }

      await this.activeAudioInput.stream.pushAudioChunk(payload);
    } catch (error) {
      this.sttStreamBlocked = true;
      this.activeAudioInput = null;
    }
  }

  async handleAudioEnd() {
    if (this.mode === INTERVIEW_MODES.CODING) {
      return;
    }

    this.sttStreamBlocked = false;

    if (!this.activeAudioInput) {
      return;
    }

    const activeInput = this.activeAudioInput;
    this.activeAudioInput = null;
    await activeInput.stream.endStream();
  }

  async handleStartInterview() {
    if (!this.stateMachine.isListening()) {
      return;
    }

    const turnId = randomUUID();
    // Start the AI's first turn silently without emitting a user transcript message
    // or saving a user message to the database.
    const hiddenPrompt = "Hello, I am ready. Please introduce yourself and start the interview.";
    await this._processTurnFromTranscript(turnId, hiddenPrompt);
  }

  async handleTextAnswer(payload = {}) {
    if (!this.stateMachine.isListening()) {
      return;
    }

    const text = typeof payload.text === "string" ? payload.text.trim() : "";
    if (!text) {
      return;
    }

    const turnId = randomUUID();
    this._emit(WS_EVENTS.TRANSCRIPT_FINAL, { transcript: text, turnId });
    
    // Commit user message
    await this._commitMessage("user", text);
    
    await this._processTurnFromTranscript(turnId, text);
  }

  async handleCodeSubmission(payload = {}) {
    if (this.mode !== INTERVIEW_MODES.CODING) {
      return;
    }

    if (!this.stateMachine.isListening()) {
      return;
    }

    const code = typeof payload.code === "string" ? payload.code : "";
    const turnId = randomUUID();

    // Commit code submission as a user message
    await this._commitMessage("user", `[Code Submission]\n${code}`);

    await this._processCodeTurn(turnId, code);
  }

  cancelCurrentTurn(reason = "cancelled") {
    if (this.activeTurn?.abortController) {
      this.activeTurn.abortController.abort();
    }

    this.activeTurn = null;
    this.sentenceBuffer.reset();
    this.activeAudioInput = null;
    this.activeSttTurnId = null; // Invalidate any pending STT callbacks
    this.sttStreamBlocked = false;

    if (!this.stateMachine.isListening()) {
      this.stateMachine.transition(INTERVIEW_STATES.LISTENING);
    }

    this._emitStateChange(null, reason);
  }

  _createAudioInputStream() {
    const turnId = randomUUID();
    this.activeSttTurnId = turnId;

    const stream = this.sttService.createStream({
      turnId,
      onPartial: (partialText) => {
        if (this.activeSttTurnId !== turnId) return; // Ignore if cancelled
        this._emit(WS_EVENTS.TRANSCRIPT_PARTIAL, {
          transcript: partialText,
          turnId,
        });
      },
      onFinal: async (finalText) => {
        if (this.activeSttTurnId !== turnId) return; // Ignore if cancelled
        this.activeSttTurnId = null;
        
        this._emit(WS_EVENTS.TRANSCRIPT_FINAL, {
          transcript: finalText,
          turnId,
        });

        // Commit user message
        await this._commitMessage("user", finalText);

        await this._processTurnFromTranscript(turnId, finalText);
      },
      onError: (error) => {
        if (this.activeSttTurnId !== turnId) return; // Ignore if cancelled
        this.activeSttTurnId = null;
        this._emitStateChange(turnId, "stt_error", error.message);
      },
    });

    return { turnId, stream };
  }

  async _processTurnFromTranscript(turnId, transcript) {
    const abortController = new AbortController();
    this.activeTurn = {
      turnId,
      abortController,
    };

    this.stateMachine.transition(INTERVIEW_STATES.PROCESSING);
    this._emitStateChange(turnId, "processing");

    let fullAiResponse = "";

    try {
      for await (const token of this.llmService.streamInterviewResponse({
        transcript,
        systemPrompt: this.systemPrompt,
        signal: abortController.signal,
      })) {
        if (abortController.signal.aborted) {
          return;
        }

        fullAiResponse += token;
        this._emit(WS_EVENTS.AI_TEXT_CHUNK, { text: token, turnId });
        const completeSentences = this.sentenceBuffer.pushToken(token);
        await this._speakSentences(turnId, completeSentences, abortController.signal);
      }

      const remainingSentences = this.sentenceBuffer.flushRemainder();
      await this._speakSentences(turnId, remainingSentences, abortController.signal);

      // Commit full AI response
      if (fullAiResponse.trim()) {
        await this._commitMessage("llm", fullAiResponse.trim());
      }
    } catch (error) {
      this._emitStateChange(turnId, "processing_error", error.message);
    } finally {
      if (this.activeTurn?.turnId === turnId) {
        this.activeTurn = null;
      }
      this.sentenceBuffer.reset();
      if (!this.stateMachine.isListening()) {
        this.stateMachine.transition(INTERVIEW_STATES.LISTENING);
      }
      this._emitStateChange(turnId, "listening");
    }
  }

  async _processCodeTurn(turnId, code) {
    const abortController = new AbortController();
    this.activeTurn = {
      turnId,
      abortController,
    };

    this.stateMachine.transition(INTERVIEW_STATES.PROCESSING);
    this._emitStateChange(turnId, "processing");

    let fullAiResponse = "";

    try {
      for await (const token of this.llmService.streamCodeEvaluation({
        code,
        signal: abortController.signal,
      })) {
        if (abortController.signal.aborted) {
          return;
        }

        fullAiResponse += token;
        this._emit(WS_EVENTS.AI_TEXT_CHUNK, { text: token, turnId });
        const completeSentences = this.sentenceBuffer.pushToken(token);
        await this._speakSentences(turnId, completeSentences, abortController.signal);
      }

      const remainingSentences = this.sentenceBuffer.flushRemainder();
      await this._speakSentences(turnId, remainingSentences, abortController.signal);

      // Commit full AI evaluation
      if (fullAiResponse.trim()) {
        await this._commitMessage("llm", fullAiResponse.trim());
      }
    } catch (error) {
      this._emitStateChange(turnId, "code_evaluation_error", error.message);
    } finally {
      if (this.activeTurn?.turnId === turnId) {
        this.activeTurn = null;
      }
      this.sentenceBuffer.reset();
      if (!this.stateMachine.isListening()) {
        this.stateMachine.transition(INTERVIEW_STATES.LISTENING);
      }
      this._emitStateChange(turnId, "listening");
    }
  }

  async _speakSentences(turnId, sentences, signal) {
    if (!sentences || sentences.length === 0) {
      return;
    }

    if (signal?.aborted) {
      return;
    }

    if (!this.stateMachine.isSpeaking()) {
      this.stateMachine.transition(INTERVIEW_STATES.SPEAKING);
      this._emitStateChange(turnId, "speaking");
    }

    for (const sentence of sentences) {
      for await (const audioChunk of this.ttsService.streamSpeech(sentence, signal, { turnId })) {
        if (signal.aborted) {
          return;
        }

        const audioPayload =
          typeof audioChunk === "string"
            ? { audio: audioChunk, contentType: "audio/wav" }
            : {
                audio: audioChunk.audio,
                contentType: audioChunk.contentType || "audio/wav",
              };

        this._emit(WS_EVENTS.TTS_AUDIO_CHUNK, {
          audio: audioPayload.audio,
          contentType: audioPayload.contentType,
          turnId,
        });
      }
    }

    if (!this.stateMachine.isProcessing()) {
      this.stateMachine.transition(INTERVIEW_STATES.PROCESSING);
      this._emitStateChange(turnId, "processing");
    }
  }

  _emitStateChange(turnId, reason, errorMessage = null) {
    this._emit(WS_EVENTS.STATE_CHANGE, {
      state: this.stateMachine.getState(),
      reason,
      error: errorMessage,
      turnId,
      mode: this.mode,
      sessionId: this.sessionId,
    });
  }

  _emit(type, payload) {
    const envelope = {
      type,
      sessionId: this.sessionId,
      turnId: payload.turnId || null,
      payload,
      timestamp: Date.now(),
    };

    const message = JSON.stringify(envelope);
    for (const ws of this.connections) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      }
    }
  }

  async _ensureInterviewRecord() {
    if (this.interviewId || !this.tokenId || !this.prisma) {
      return;
    }

    try {
      // Find the candidate by token
      const candidate = await this.prisma.driveCandidate.findUnique({
        where: { token: this.tokenId },
      });

      if (!candidate) {
        console.error(`[InterviewSession] Candidate not found for token: ${this.tokenId}`);
        return;
      }

      // Check if there's an active (STARTED) interview for this candidate
      // For now, we'll just create a new one each time they connect if none is active,
      // or we can reuse the last one.
      const existingInterview = await this.prisma.interview.findFirst({
        where: {
          candidateId: candidate.id,
          status: "STARTED",
        },
        orderBy: { createdAt: "desc" },
      });

      if (existingInterview) {
        this.interviewId = existingInterview.id;
      } else {
        const newInterview = await this.prisma.interview.create({
          data: {
            candidateId: candidate.id,
            status: "STARTED",
          },
        });
        this.interviewId = newInterview.id;
      }
    } catch (error) {
      console.error("[InterviewSession] Failed to ensure interview record:", error);
    }
  }

  async _commitMessage(role, content) {
    if (!this.interviewId || !this.prisma || !content) {
      return;
    }

    try {
      await this.prisma.message.create({
        data: {
          interviewId: this.interviewId,
          role,
          content,
        },
      });
    } catch (error) {
      console.error(`[InterviewSession] Failed to commit ${role} message:`, error);
    }
  }
}

module.exports = {
  InterviewSession,
};
