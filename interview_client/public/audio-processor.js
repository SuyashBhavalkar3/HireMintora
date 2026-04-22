class PcmProcessor extends AudioWorkletProcessor {
  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (!input || input.length === 0) return true;

    const inputChannel = input[0];
    const pcm16 = new Int16Array(inputChannel.length);
    
    for (let i = 0; i < inputChannel.length; i++) {
      const s = Math.max(-1, Math.min(1, inputChannel[i]));
      pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }

    this.port.postMessage(pcm16.buffer, [pcm16.buffer]);
    return true;
  }
}

registerProcessor("pcm-processor", PcmProcessor);
