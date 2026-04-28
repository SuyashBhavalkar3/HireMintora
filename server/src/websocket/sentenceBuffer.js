/**
 * @file sentenceBuffer.js
 * @description Accumulates streaming LLM tokens into complete sentences for TTS.
 *
 * WHY THIS EXISTS:
 * The LLM streams one token at a time (e.g., "Hello", " ,", " my", " name", …).
 * Sending individual tokens to TTS produces choppy, unnatural speech.
 * Waiting for the full response introduces unacceptable latency.
 *
 * The SentenceBuffer sits between the LLM stream and the TTS pipeline:
 *   LLM tokens → SentenceBuffer → complete sentences → TTS
 *
 * It splits on sentence-ending punctuation (. ! ? \n) and emits each
 * complete sentence as soon as it's detected, giving the TTS engine
 * enough context for natural intonation while keeping latency low.
 */

class SentenceBuffer {
  constructor() {
    /** @type {string} Internal buffer accumulating partial sentence text. */
    this.buffer = "";
  }

  /**
   * Appends a new LLM token to the buffer and drains any complete sentences.
   *
   * @param {string} token - A single token from the LLM stream.
   * @returns {string[]} Array of complete sentences ready for TTS (may be empty).
   */
  pushToken(token) {
    this.buffer += token;
    return this._drainCompleteSentences();
  }

  /**
   * Flushes whatever remains in the buffer as a final sentence.
   * Called after the LLM stream ends to capture any trailing text
   * that didn't end with sentence-ending punctuation.
   *
   * @returns {string[]} Array containing the remaining text (0 or 1 items).
   */
  flushRemainder() {
    const trimmed = this.buffer.trim();
    this.buffer = "";
    return trimmed ? [trimmed] : [];
  }

  /**
   * Resets the buffer to empty. Called on turn cancellation or cleanup.
   */
  reset() {
    this.buffer = "";
  }

  /**
   * Scans the buffer for sentence-ending characters and extracts
   * all complete sentences, leaving any trailing partial sentence
   * in the buffer for the next token push.
   *
   * @returns {string[]} Array of complete sentences found.
   * @private
   */
  _drainCompleteSentences() {
    const sentences = [];
    let cursor = 0;

    for (let i = 0; i < this.buffer.length; i += 1) {
      const char = this.buffer[i];
      const isSentenceEnd = char === "." || char === "!" || char === "?" || char === "\n";
      if (!isSentenceEnd) {
        continue;
      }

      const sentence = this.buffer.slice(cursor, i + 1).trim();
      if (sentence) {
        sentences.push(sentence);
      }
      cursor = i + 1;
    }

    // Keep only the un-terminated trailing text in the buffer
    this.buffer = this.buffer.slice(cursor);
    return sentences;
  }
}

module.exports = {
  SentenceBuffer,
};
