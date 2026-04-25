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

  async *streamInterviewResponse({ transcript, systemPrompt, signal, history = [] }) {
    const messagesArray = buildMessageHistory(transcript, systemPrompt, history, false);
    yield* this._streamByProvider(messagesArray, signal);
  }

  async *streamCodeEvaluation({ code, signal, history = [] }) {
    const messagesArray = buildMessageHistory(code, "", history, true);
    yield* this._streamByProvider(messagesArray, signal);
  }

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
