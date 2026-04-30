/**
 * @file interviewSession.js
 * @description Per-session interview orchestrator — the heart of the AI interview engine.
 *
 * Each InterviewSession instance manages:
 *   - The FSM state machine (LISTENING → PROCESSING → SPEAKING).
 *   - Multiple attached WebSocket clients (via addClient/removeClient).
 *   - The full STT → LLM → TTS pipeline for each conversation turn.
 *   - Conversation history persistence to the database (Prisma).
 *   - Turn cancellation and cleanup on disconnect.
 *
 * Lifecycle:
 *   1. Created by SessionManager when a new sessionId connects.
 *   2. Clients attach/detach as WebSocket connections open/close.
 *   3. Audio chunks flow in → STT transcription → LLM generates response →
 *      SentenceBuffer batches into sentences → TTS streams audio back.
 *   4. Each turn's messages are committed to the Interview/Message tables.
 *   5. Destroyed when the last client disconnects (after cleanup timeout).
 */

const { randomUUID } = require("crypto");
const { WebSocket } = require("ws");
const { SentenceBuffer } = require("./sentenceBuffer");
const { InterviewStateMachine } = require("./stateMachine");
const { INTERVIEW_MODES, INTERVIEW_STATES, WS_EVENTS } = require("./constants");

/**
 * Manages the state, WebSocket connections, and data flow for a single AI interview session.
 * Coordinates STT (Speech-to-Text), LLM (Language Model), and TTS (Text-to-Speech) pipelines.
 */
class InterviewSession {
  /**
   * Initializes a new Interview Session.
   *
   * @param {string} sessionId - Unique identifier for the active WebSocket session.
   * @param {Object} dependencies - Core services required (sttService, ttsService, llmService, prisma).
   * @param {Object} options - Interview specific configurations (tokenId, mode, systemPrompt).
   */
  constructor(sessionId, dependencies = {}, options = {}) {
    this.sessionId = sessionId;
    this.tokenId = options.tokenId || null;
    this.mode = options.mode || INTERVIEW_MODES.DEFAULT;
    this.systemPrompt = options.systemPrompt || `You are a senior technical interviewer. Respond conversationally in 2-4 concise sentences. Ask one useful follow-up question at the end.
    
    SPECIAL CONTROLS:
    - To ENABLE the code editor for a coding task, include the tag [ENABLE_EDITOR] in your response.
    - To DISABLE the code editor once the task is finished, include the tag [DISABLE_EDITOR] in your response.`;
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

  /**
   * Attaches a new WebSocket connection to this session.
   * Also ensures an interview database record is created if none exists.
   *
   * @param {WebSocket} ws - The WebSocket client connection.
   */
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

  /**
   * Handles incoming audio chunks from the client.
   * Forwards them to the active STT (Speech-to-Text) stream.
   *
   * @param {Object} payload - The payload containing the audio chunk.
   */
  async handleAudioChunk(payload = {}) {
    // We now allow audio in CODING mode to support "think-aloud" behavior.
    // However, we still enforce the state machine being in LISTENING state.

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
    // We now allow audio in CODING mode.

    this.sttStreamBlocked = false;

    if (!this.activeAudioInput) {
      return;
    }

    const activeInput = this.activeAudioInput;
    this.activeAudioInput = null;
    await activeInput.stream.endStream();
  }

  /**
   * Explicit trigger to start the AI interview.
   * Generates a hidden prompt to force the AI to introduce itself.
   */
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

  /**
   * Handles manual text answers submitted by the candidate (fallback or text mode).
   * Commits the message to DB and triggers AI processing.
   *
   * @param {Object} payload - The payload containing the text answer.
   */
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

  /**
   * Handles code submitted by the candidate during coding rounds.
   * Commits the code to DB and triggers specialized code evaluation.
   *
   * @param {Object} payload - The payload containing the submitted code.
   */
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

  /**
   * Core orchestrator for conversational turns.
   * 1. Fetches interview history.
   * 2. Streams the transcript and history to the LLM.
   * 3. Buffers the LLM text output into complete sentences.
   * 4. Streams complete sentences to the TTS pipeline for speech generation.
   *
   * @param {string} turnId - Unique ID for this conversation turn.
   * @param {string} transcript - The user's input text to be processed.
   * @private
   */
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
      const history = await this._getInterviewHistory();
      const dynamicSystemPrompt = `${this.systemPrompt}\n\n[SYSTEM_NOTE: The code editor is currently ${this.mode === INTERVIEW_MODES.CODING ? 'ENABLED' : 'LOCKED'}. If you are starting a coding task and it is LOCKED, you MUST include the [ENABLE_EDITOR] tag in your response. if the task is done, use [DISABLE_EDITOR].]`;

      for await (const token of this.llmService.streamInterviewResponse({
        transcript,
        systemPrompt: dynamicSystemPrompt,
        signal: abortController.signal,
        history,
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
        this._handleTriggers(fullAiResponse);
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

  /**
   * Core orchestrator for coding evaluation turns.
   * Similar to _processTurnFromTranscript but utilizes the specialized code evaluation LLM pipeline.
   *
   * @param {string} turnId - Unique ID for this evaluation turn.
   * @param {string} code - The code snippet submitted by the candidate.
   * @private
   */
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
      const history = await this._getInterviewHistory();

      for await (const token of this.llmService.streamCodeEvaluation({
        code,
        signal: abortController.signal,
        history,
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
        this._handleTriggers(fullAiResponse);
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

  /**
   * Scans AI text for special control tags to update the interview mode.
   * [ENABLE_EDITOR] -> Switch to CODING mode.
   * [DISABLE_EDITOR] -> Switch to DEFAULT mode.
   *
   * @param {string} text - The full AI response text.
   * @private
   */
  _handleTriggers(text) {
    // 1. Explicit Tag Detection (Primary)
    if (text.includes("[ENABLE_EDITOR]")) {
      this.setMode(INTERVIEW_MODES.CODING);
      return;
    } 
    
    if (text.includes("[DISABLE_EDITOR]")) {
      this.setMode(INTERVIEW_MODES.DEFAULT);
      return;
    }

    // 2. Heuristic Intent Detection (Fallback)
    // If the editor is locked but the AI clearly asked for a coding solution, auto-enable it.
    if (this.mode === INTERVIEW_MODES.DEFAULT) {
      const codingIntents = [
        /write a (python|javascript|java|c\+\+|go|rust) function/i,
        /coding problem/i,
        /implement a solution/i,
        /write code to/i,
        /in the code editor/i
      ];

      const hasCodingIntent = codingIntents.some(regex => regex.test(text));
      if (hasCodingIntent) {
        console.log(`[InterviewSession] Heuristic detected coding intent in turn ${this.activeTurn?.turnId}. Enabling editor.`);
        this.setMode(INTERVIEW_MODES.CODING);
      }
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
    /**
     * Notify all attached clients about a state or mode change.
     * The 'mode' (default vs coding) specifically controls Monaco Editor interactivity.
     */
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

  /**
   * Commits a single conversation message (user or LLM) to the database.
   *
   * @param {string} role - The role of the sender ("user" or "llm").
   * @param {string} content - The actual text content.
   * @private
   */
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

  /**
   * Retrieves the full chronological conversation history for the current interview.
   * Used to provide context to the LLM during generation.
   *
   * @returns {Promise<Array<{role: string, content: string}>>} Array of past messages.
   * @private
   */
  async _getInterviewHistory() {
    if (!this.interviewId || !this.prisma) {
      return [];
    }
    try {
      const messages = await this.prisma.message.findMany({
        where: { interviewId: this.interviewId },
        orderBy: { timestamp: "asc" },
      });
      return messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));
    } catch (error) {
      console.error("[InterviewSession] Failed to fetch history:", error);
      return [];
    }
  }
}

module.exports = {
  InterviewSession,
};
