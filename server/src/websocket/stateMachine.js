/**
 * @file stateMachine.js
 * @description Finite State Machine (FSM) governing interview session states.
 *
 * The FSM enforces valid state transitions and prevents illegal operations
 * (e.g., accepting audio input while the AI is still generating a response).
 *
 * Valid Transition Graph:
 *
 *   ┌───────────┐     ┌────────────┐     ┌──────────┐
 *   │ LISTENING │────→│ PROCESSING │────→│ SPEAKING │
 *   └───────────┘     └────────────┘     └──────────┘
 *        ↑                  │                  │
 *        │                  │                  │
 *        └──────────────────┴──────────────────┘
 *
 * - LISTENING  → PROCESSING : User finishes speaking/typing, system begins AI generation.
 * - PROCESSING → SPEAKING   : LLM output sentences are being spoken via TTS.
 * - PROCESSING → LISTENING  : LLM finished without needing to speak (e.g., empty response).
 * - SPEAKING   → LISTENING  : TTS playback complete, ready for next candidate input.
 * - SPEAKING   → PROCESSING : More LLM tokens arrive while TTS is still active.
 */

const { INTERVIEW_STATES } = require("./constants");

class InterviewStateMachine {
  constructor() {
    /** @type {string} Current state — always one of INTERVIEW_STATES values. */
    this.state = INTERVIEW_STATES.LISTENING;
  }

  /**
   * Returns the current state of the machine.
   * @returns {string}
   */
  getState() {
    return this.state;
  }

  /**
   * Attempts to transition to a new state.
   * Throws if the transition is not allowed by the graph.
   *
   * @param {string} nextState - The target state to transition to.
   * @returns {string} The new current state after transition.
   * @throws {Error} If the transition is invalid.
   */
  transition(nextState) {
    if (this.state === nextState) {
      return this.state;
    }

    const allowedTransitions = {
      [INTERVIEW_STATES.LISTENING]: [INTERVIEW_STATES.PROCESSING],
      [INTERVIEW_STATES.PROCESSING]: [INTERVIEW_STATES.SPEAKING, INTERVIEW_STATES.LISTENING],
      [INTERVIEW_STATES.SPEAKING]: [INTERVIEW_STATES.LISTENING, INTERVIEW_STATES.PROCESSING],
    };

    const canTransition = allowedTransitions[this.state]?.includes(nextState);
    if (!canTransition) {
      throw new Error(`Invalid state transition: ${this.state} -> ${nextState}`);
    }

    this.state = nextState;
    return this.state;
  }

  /** @returns {boolean} True if the session is currently accepting candidate input. */
  isListening() {
    return this.state === INTERVIEW_STATES.LISTENING;
  }

  /** @returns {boolean} True if the LLM is actively generating a response. */
  isProcessing() {
    return this.state === INTERVIEW_STATES.PROCESSING;
  }

  /** @returns {boolean} True if TTS audio is being streamed to the candidate. */
  isSpeaking() {
    return this.state === INTERVIEW_STATES.SPEAKING;
  }
}

module.exports = {
  InterviewStateMachine,
};
