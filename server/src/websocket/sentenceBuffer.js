class SentenceBuffer {
  constructor() {
    this.buffer = "";
  }

  pushToken(token) {
    this.buffer += token;
    return this._drainCompleteSentences();
  }

  flushRemainder() {
    const trimmed = this.buffer.trim();
    this.buffer = "";
    return trimmed ? [trimmed] : [];
  }

  reset() {
    this.buffer = "";
  }

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

    this.buffer = this.buffer.slice(cursor);
    return sentences;
  }
}

module.exports = {
  SentenceBuffer,
};
