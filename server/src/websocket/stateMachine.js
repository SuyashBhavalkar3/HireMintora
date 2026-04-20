const { INTERVIEW_STATES } = require("./constants");

class InterviewStateMachine {
  constructor() {
    this.state = INTERVIEW_STATES.LISTENING;
  }

  getState() {
    return this.state;
  }

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

  isListening() {
    return this.state === INTERVIEW_STATES.LISTENING;
  }

  isProcessing() {
    return this.state === INTERVIEW_STATES.PROCESSING;
  }

  isSpeaking() {
    return this.state === INTERVIEW_STATES.SPEAKING;
  }
}

module.exports = {
  InterviewStateMachine,
};
