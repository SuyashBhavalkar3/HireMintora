# Implementation Plan: Dynamic Monaco Editor Integration (Option 2)

This document outlines the robust, foolproof implementation of a 50/50 split-screen interview interface where the Monaco Editor is always visible but conditionally enabled based on the AI's intent.

## 1. The Core Strategy: Control Tokens & Stream Interception
To guarantee the frontend UI stays perfectly in sync with the AI's conversational state, we will use **Control Tokens**. 

Since your LLM streams text directly to a TTS (Text-to-Speech) service, we cannot simply rely on the AI to "know" when to switch modes without a structured bridge. 
1. We will instruct the LLM to output specific string tokens (e.g., `<ENABLE_EDITOR>` or `<DISABLE_EDITOR>`) when transitioning states.
2. The Node.js backend will **intercept and strip** these tokens *before* they reach the TTS service (so the AI doesn't speak them out loud).
3. Upon intercepting a token, the backend will immediately push a WebSocket event to the client to lock/unlock the editor.

---

## 2. Backend Implementation (Node.js)

### Step 2.1: Tightening the System Prompt
We must update the base system prompt in `websocketServer.js` or `interviewSession.js` to strictly enforce the rules of engagement.

```javascript
const systemPrompt = `
You are a senior technical interviewer. You conduct both behavioral and coding rounds.
CRITICAL RULES FOR CODING QUESTIONS:
1. When you ask a coding question, you MUST append the exact token <ENABLE_EDITOR> to the very end of your response.
2. When the coding exercise is finished and you transition back to behavioral questions, you MUST append <DISABLE_EDITOR>.
3. If the candidate complains that they cannot type, or the editor is locked, apologize and append <ENABLE_EDITOR>.

Example: "Let's test your algorithmic skills. Please write a function to reverse a binary tree. <ENABLE_EDITOR>"
`;
```

### Step 2.2: Intercepting Tokens in `InterviewSession.js`
In your `_processTurnFromTranscript` method, you are currently pushing chunks into the `SentenceBuffer`. We need to intercept the stream, extract the control tokens, and emit a state change to the frontend.

```javascript
// Inside _processTurnFromTranscript (Simplified for illustration)
let fullAiResponse = "";
let editorModeChanged = null; // 'enabled' | 'disabled'

for await (const token of this.llmService.streamInterviewResponse(...)) {
  fullAiResponse += token;
  
  // 1. Detect Control Tokens
  if (fullAiResponse.includes("<ENABLE_EDITOR>")) {
    editorModeChanged = "enabled";
    fullAiResponse = fullAiResponse.replace("<ENABLE_EDITOR>", ""); // Strip it
    this.mode = INTERVIEW_MODES.CODING; // Update backend state
    this._emit("EDITOR_STATE_CHANGE", { enabled: true });
  } else if (fullAiResponse.includes("<DISABLE_EDITOR>")) {
    editorModeChanged = "disabled";
    fullAiResponse = fullAiResponse.replace("<DISABLE_EDITOR>", "");
    this.mode = INTERVIEW_MODES.DEFAULT;
    this._emit("EDITOR_STATE_CHANGE", { enabled: false });
  }

  // 2. Only push CLEAN text to the TTS/Frontend Text stream
  // (Requires a slight buffer delay or regex check in reality to prevent partial token matching)
}
```

### Step 2.3: Fallback Rule-Based Override
If the LLM hallucinates and forgets the token, but asks a coding question anyway, candidates will complain ("I can't type"). 
To make it bulletproof, add a simple Regex rule check on the *user's* transcript in `handleAudioChunk` / `handleTextAnswer`:

```javascript
// Quick fallback in handleTextAnswer / STT onFinal
const triggerPhrases = /can't type|cannot type|editor is locked|enable the editor|where do i code/i;
if (triggerPhrases.test(userTranscript) && this.mode !== INTERVIEW_MODES.CODING) {
   this.mode = INTERVIEW_MODES.CODING;
   this._emit("EDITOR_STATE_CHANGE", { enabled: true, reason: "fallback_override" });
   // Optionally skip passing this message to the LLM and just unlock it.
}
```

---

## 3. Frontend Implementation (Next.js & Monaco)

### Step 3.1: State Management
In your main Interview Room component, track the editor state.

```javascript
const [isEditorEnabled, setIsEditorEnabled] = useState(false);

// Inside your WebSocket event listener
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === "EDITOR_STATE_CHANGE") {
    setIsEditorEnabled(data.payload.enabled);
  }
};
```

### Step 3.2: 50/50 UI Layout
Use a CSS Grid or Flexbox to lock the layout so it never shifts.

```jsx
<div className="flex h-screen w-full">
  {/* Left Half: Conversation / Video / Avatars */}
  <div className="w-1/2 h-full border-r border-gray-700">
    <ChatInterface />
  </div>

  {/* Right Half: Monaco Editor */}
  <div className="w-1/2 h-full relative bg-[#1e1e1e]">
    
    {/* The Lock Overlay (Only renders when disabled) */}
    {!isEditorEnabled && (
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
        <LockIcon className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-gray-300 font-medium">Editor is currently locked.</p>
        <p className="text-gray-500 text-sm">It will activate when a coding question is asked.</p>
      </div>
    )}

    <MonacoEditor
      height="100%"
      theme="vs-dark"
      defaultLanguage="javascript"
      options={{
        readOnly: !isEditorEnabled, // Double security measure
        minimap: { enabled: false }
      }}
      onChange={(value) => setCodeBlob(value)}
    />
    
    <button 
      disabled={!isEditorEnabled}
      onClick={() => submitCode(codeBlob)}
      className="absolute bottom-4 right-4 z-20..."
    >
      Submit Code
    </button>
  </div>
</div>
```

---

## 4. Reporting & Database Architecture
Because we explicitly enforce the `this.mode = INTERVIEW_MODES.CODING` transition on the backend, any `CODE_SUBMISSION` WebSocket event we receive is 100% legitimate.

When saving to Prisma:
```javascript
await prisma.message.create({
  data: {
    interviewId: this.interviewId,
    role: "user",
    content: codeBlob,
    type: "CODE_SUBMISSION" // Add a type enum to your Prisma schema
  }
});
```
When generating the candidate report, you simply filter the DB for `type: "CODE_SUBMISSION"` to accurately grade their technical execution, completely separated from their verbal behavioral answers.
