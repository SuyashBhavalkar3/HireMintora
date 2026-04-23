const WS_EVENTS = {
  AUDIO_CHUNK: "audio_chunk",
  AUDIO_END: "audio_end",
  TEXT_ANSWER: "text_answer",
  CODE_SUBMISSION: "code_submission",
  CANCEL_TURN: "cancel_turn",
  TRANSCRIPT_PARTIAL: "transcript_partial",
  TRANSCRIPT_FINAL: "transcript_final",
  AI_TEXT_CHUNK: "ai_text_chunk",
  TTS_AUDIO_CHUNK: "tts_audio_chunk",
  STATE_CHANGE: "state_change",
  START_INTERVIEW: "start_interview",
};

const INTERVIEW_STATES = {
  LISTENING: "LISTENING",
  PROCESSING: "PROCESSING",
  SPEAKING: "SPEAKING",
};

const INTERVIEW_MODES = {
  DEFAULT: "default",
  CODING: "coding",
};

module.exports = {
  WS_EVENTS,
  INTERVIEW_STATES,
  INTERVIEW_MODES,
};
