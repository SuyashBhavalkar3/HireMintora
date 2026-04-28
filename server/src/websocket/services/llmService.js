/**
 * @file llmService.js
 * @description Multi-provider LLM service for generating AI interview responses.
 *
 * Supports three LLM backends (configurable via the `LLM_PROVIDER` env var):
 *   - **Groq** (default) — Fast inference via Llama models.
 *   - **OpenAI** — GPT-4o-mini or any OpenAI-compatible model.
 *   - **Gemini** — Google's Generative AI API.
 *
 * All providers stream their responses via Server-Sent Events (SSE), which
 * this service parses and yields as individual text tokens. The tokens flow
 * into the SentenceBuffer for TTS batching.
 *
 * Two generation modes:
 *   1. `streamInterviewResponse` — Conversational Q&A with the candidate.
 *   2. `streamCodeEvaluation`    — Code review and follow-up question.
 *
 * @see SentenceBuffer — Consumes the token stream from this service.
 * @see InterviewSession._processTurnFromTranscript — Orchestrates this service.
 */

/**
 * Builds an array of message objects compatible with standard LLM APIs (OpenAI format).
 * Integrates conversation history and ensures the most recent transcript is included.
 *
 * @param {string} transcript - The latest user input or code submission.
 * @param {string} systemPrompt - Optional custom system instructions.
 * @param {Array<{role: string, content: string}>} history - Previous messages from the database.
 * @param {boolean} isCode - Flag indicating if this is a coding evaluation turn.
 * @returns {Array<{role: string, content: string}>} The assembled message history array.
 */
function buildMessageHistory(transcript, systemPrompt, history, isCode) {
  const defaultPrompt = isCode
    ? "You are a senior coding interviewer. Give a brief evaluation in 3-5 sentences covering correctness, complexity, and improvements. End with one follow-up coding question."
    : "You are a senior technical interviewer. Respond conversationally in 2-4 concise sentences. Ask one useful follow-up question at the end.";

  const messages = [
    { role: "system", content: systemPrompt || defaultPrompt }
  ];

  for (const msg of history || []) {
    messages.push({
      role: msg.role === "llm" ? "assistant" : "user",
      content: msg.content
    });
  }

  const userTranscriptStr = isCode ? `[Code Submission]\n${transcript || ""}` : (transcript || "");
  
  const lastMsg = messages[messages.length - 1];
  if (!lastMsg || lastMsg.role !== "user" || lastMsg.content !== userTranscriptStr) {
    if (userTranscriptStr) {
      messages.push({
        role: "user",
        content: userTranscriptStr
      });
    }
  }

  return messages;
}

function readEnv(name, fallback = "") {
  const value = process.env[name];
  if (typeof value !== "string") {
    return fallback;
  }
  return value.trim() || fallback;
}

/**
 * Parses a Server-Sent Events (SSE) stream commonly used by LLM providers.
 * Yields parsed JSON objects as they arrive.
 *
 * @param {ReadableStream} stream - The SSE fetch response body stream.
 * @param {AbortSignal} signal - Optional abort signal to cancel reading.
 * @yields {Object} Parsed JSON data object from the stream.
 */
async function* parseSseStream(stream, signal) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    if (signal?.aborted) {
      return;
    }

    const { value, done } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop() || "";

    for (const event of events) {
      const lines = event
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).trim())
        .filter(Boolean);

      if (lines.length === 0) {
        continue;
      }

      const data = lines.join("\n");
      if (data === "[DONE]") {
        return;
      }

      let json;
      try {
        json = JSON.parse(data);
      } catch (_error) {
        continue;
      }

      yield json;
    }
  }
}

/**
 * A service class for interacting with various Large Language Model (LLM) providers.
 * Supports streaming responses for standard technical interviews and code evaluations.
 * Automatically handles provider selection and API key management based on environment variables.
 */
class ConfigurableLlmService {
  constructor(options = {}) {
    this.provider = (options.provider || readEnv("LLM_PROVIDER", "groq")).toLowerCase();
    this.temperature = Number(options.temperature || readEnv("LLM_TEMPERATURE", "0.5"));

    this.groqApiKey = options.groqApiKey || readEnv("GROQ_API_KEY");
    this.groqModel = options.groqModel || readEnv("GROQ_MODEL", "llama-3.3-70b-versatile");

    this.openaiApiKey = options.openaiApiKey || readEnv("OPENAI_API_KEY");
    this.openaiModel = options.openaiModel || readEnv("OPENAI_MODEL", "gpt-4o-mini");

    this.geminiApiKey = options.geminiApiKey || readEnv("GEMINI_API_KEY");
    this.geminiModel = options.geminiModel || readEnv("GEMINI_MODEL", "gemini-1.5-flash");
  }

  /**
   * Streams an AI response for a standard conversational interview turn.
   *
   * @param {Object} options - Configuration for the generation.
   * @param {string} options.transcript - The candidate's latest verbal response (transcribed).
   * @param {string} options.systemPrompt - System instruction modifying the AI's behavior.
   * @param {AbortSignal} options.signal - Signal to abort the stream.
   * @param {Array} options.history - The conversation history prior to this turn.
   * @yields {string} Chunks of the AI's text response.
   */
  async *streamInterviewResponse({ transcript, systemPrompt, signal, history = [] }) {
    const messagesArray = buildMessageHistory(transcript, systemPrompt, history, false);
    yield* this._streamByProvider(messagesArray, signal);
  }

  /**
   * Streams an AI evaluation and follow-up for a candidate's code submission.
   *
   * @param {Object} options - Configuration for the generation.
   * @param {string} options.code - The code submitted by the candidate.
   * @param {AbortSignal} options.signal - Signal to abort the stream.
   * @param {Array} options.history - The conversation history prior to this turn.
   * @yields {string} Chunks of the AI's text response.
   */
  async *streamCodeEvaluation({ code, signal, history = [] }) {
    const messagesArray = buildMessageHistory(code, "", history, true);
    yield* this._streamByProvider(messagesArray, signal);
  }

  /**
   * Internal router to dispatch the stream request to the configured provider.
   *
   * @param {Array<{role: string, content: string}>} messagesArray - The full message context array.
   * @param {AbortSignal} signal - Signal to abort the stream.
   * @yields {string} Chunks of text from the selected LLM provider.
   * @private
   */
  async *_streamByProvider(messagesArray, signal) {
    switch (this.provider) {
      case "groq":
        yield* this._streamOpenAiCompatible({
          url: "https://api.groq.com/openai/v1/chat/completions",
          apiKey: this.groqApiKey,
          model: this.groqModel,
          messagesArray,
          signal,
        });
        return;
      case "openai":
        yield* this._streamOpenAiCompatible({
          url: "https://api.openai.com/v1/chat/completions",
          apiKey: this.openaiApiKey,
          model: this.openaiModel,
          messagesArray,
          signal,
        });
        return;
      case "gemini":
        yield* this._streamGemini({
          apiKey: this.geminiApiKey,
          model: this.geminiModel,
          messagesArray,
          signal,
        });
        return;
      default:
        throw new Error(`Unsupported LLM_PROVIDER: ${this.provider}`);
    }
  }

  async *_streamOpenAiCompatible({ url, apiKey, model, messagesArray, signal }) {
    if (!apiKey) {
      throw new Error("Missing API key for selected LLM provider");
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        stream: true,
        temperature: this.temperature,
        messages: messagesArray,
      }),
      signal,
    });

    if (!response.ok || !response.body) {
      const details = await response.text();
      throw new Error(`LLM stream failed (${response.status}): ${details}`);
    }

    for await (const chunk of parseSseStream(response.body, signal)) {
      const text = chunk?.choices?.[0]?.delta?.content;
      if (typeof text === "string" && text.length > 0) {
        yield text;
      }
    }
  }

  async *_streamGemini({ apiKey, model, messagesArray, signal }) {
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY");
    }

    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}` +
      `:streamGenerateContent?alt=sse&key=${encodeURIComponent(apiKey)}`;

    const contents = [];
    let systemInstruction = null;

    for (const msg of messagesArray) {
      if (msg.role === "system") {
        systemInstruction = {
          parts: [{ text: msg.content }],
        };
      } else {
        contents.push({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        });
      }
    }

    const requestBody = {
      contents,
      generationConfig: {
        temperature: this.temperature,
      },
    };

    if (systemInstruction) {
      requestBody.systemInstruction = systemInstruction;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      signal,
    });

    if (!response.ok || !response.body) {
      const details = await response.text();
      throw new Error(`Gemini stream failed (${response.status}): ${details}`);
    }

    for await (const chunk of parseSseStream(response.body, signal)) {
      const parts = chunk?.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (typeof part?.text === "string" && part.text.length > 0) {
          yield part.text;
        }
      }
    }
  }
}

module.exports = {
  ConfigurableLlmService,
};
