/**
 * @file constants.js
 * @description Shared constants for the WebSocket interview protocol.
 *
 * These constants define the contract between server and client.
 * Any change here must be mirrored on the client side
 * (see `interview_client/components/InterviewUI.tsx`).
 */

// ─── WebSocket Event Types ───────────────────────────────────────────────────
// Events prefixed with AUDIO/TEXT/CODE/CANCEL/START are client → server.
// Events prefixed with TRANSCRIPT/AI_TEXT/TTS/STATE are server → client.

const WS_EVENTS = {
  // Client → Server: raw PCM audio chunk (base64-encoded)
  AUDIO_CHUNK: "audio_chunk",
  // Client → Server: signals the end of a recording segment
  AUDIO_END: "audio_end",
  // Client → Server: manual text answer (fallback when mic is unavailable)
  TEXT_ANSWER: "text_answer",
  // Client → Server: code submission during coding interview mode
  CODE_SUBMISSION: "code_submission",
  // Client → Server: cancel/interrupt the current AI turn
  CANCEL_TURN: "cancel_turn",
  // Client → Server: explicit trigger to begin the AI interview
  START_INTERVIEW: "start_interview",

  // Server → Client: partial (live updating) STT transcription
  TRANSCRIPT_PARTIAL: "transcript_partial",
  // Server → Client: finalized STT transcription for the turn
  TRANSCRIPT_FINAL: "transcript_final",
  // Server → Client: streaming LLM response token
  AI_TEXT_CHUNK: "ai_text_chunk",
  // Server → Client: base64-encoded TTS audio for playback
  TTS_AUDIO_CHUNK: "tts_audio_chunk",
  // Server → Client: FSM state transition notification
  STATE_CHANGE: "state_change",
};

// ─── Interview State Machine States ──────────────────────────────────────────
// The session FSM enforces valid transitions:
//   LISTENING  → PROCESSING (user finishes speaking, AI starts thinking)
//   PROCESSING → SPEAKING   (LLM output starts being spoken)
//   PROCESSING → LISTENING  (LLM finished, no audio to speak)
//   SPEAKING   → LISTENING  (TTS playback complete)
//   SPEAKING   → PROCESSING (edge case: more LLM tokens arrive while speaking)

const INTERVIEW_STATES = {
  /** Server is ready to accept candidate audio/text input. */
  LISTENING: "LISTENING",
  /** STT transcription received; LLM is generating a response. */
  PROCESSING: "PROCESSING",
  /** TTS audio is being streamed to the candidate. */
  SPEAKING: "SPEAKING",
};

// ─── Interview Modes ─────────────────────────────────────────────────────────

const INTERVIEW_MODES = {
  /** Standard conversational interview (voice-based Q&A). */
  DEFAULT: "default",
  /** Coding interview mode — candidate submits code, AI evaluates. */
  CODING: "coding",
};

module.exports = {
  WS_EVENTS,
  INTERVIEW_STATES,
  INTERVIEW_MODES,
};
