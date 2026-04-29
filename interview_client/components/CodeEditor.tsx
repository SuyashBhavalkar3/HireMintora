/**
 * @file CodeEditor.tsx
 * @description Monaco-powered code editor panel for the AI interview experience.
 *
 * This component renders the right-half of the 50/50 interview split-screen.
 * It is ALWAYS visible to set candidate expectations, but conditionally interactive:
 *
 *   - **Locked (isEnabled=false):** A translucent overlay covers the editor with a
 *     lock icon and instructions. Monaco is set to `readOnly: true`. The submit
 *     button is disabled. This prevents accidental code input during behavioral questions.
 *
 *   - **Unlocked (isEnabled=true):** The overlay fades away, Monaco becomes editable,
 *     and the submit button activates. The candidate can write code and submit it.
 *
 * State is controlled entirely by the parent component (InterviewUI), which
 * receives EDITOR_STATE_CHANGE events from the WebSocket server.
 *
 * @param {boolean} isEnabled - Whether the editor is interactive (unlocked).
 * @param {function} onSubmitCode - Callback fired with (code, language) when the candidate submits.
 * @param {boolean} isProcessing - Whether the AI is currently processing (disables submit to prevent double-sends).
 */

"use client";

import React, { useState, useRef, useCallback } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { Lock, Unlock, Send, ChevronDown, Code2 } from "lucide-react";

// ─── Supported Languages ─────────────────────────────────────────────────────
// These map to Monaco's language identifiers. Extend as needed.
const SUPPORTED_LANGUAGES = [
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "python", label: "Python" },
  { id: "java", label: "Java" },
  { id: "cpp", label: "C++" },
  { id: "c", label: "C" },
  { id: "go", label: "Go" },
  { id: "rust", label: "Rust" },
] as const;

type SupportedLanguageId = (typeof SUPPORTED_LANGUAGES)[number]["id"];

// ─── Default Starter Templates ──────────────────────────────────────────────
const STARTER_TEMPLATES: Record<SupportedLanguageId, string> = {
  javascript: `// Write your solution here\nfunction solution() {\n  \n}\n`,
  typescript: `// Write your solution here\nfunction solution(): void {\n  \n}\n`,
  python: `# Write your solution here\ndef solution():\n    pass\n`,
  java: `// Write your solution here\npublic class Solution {\n    public static void main(String[] args) {\n        \n    }\n}\n`,
  cpp: `// Write your solution here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}\n`,
  c: `// Write your solution here\n#include <stdio.h>\n\nint main() {\n    \n    return 0;\n}\n`,
  go: `// Write your solution here\npackage main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello")\n}\n`,
  rust: `// Write your solution here\nfn main() {\n    \n}\n`,
};

interface CodeEditorProps {
  isEnabled: boolean;
  onSubmitCode: (code: string, language: string) => void;
  isProcessing: boolean;
}

export default function CodeEditor({ isEnabled, onSubmitCode, isProcessing }: CodeEditorProps) {
  const [language, setLanguage] = useState<SupportedLanguageId>("javascript");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const editorRef = useRef<any>(null);
  const [code, setCode] = useState(STARTER_TEMPLATES.javascript);

  /**
   * Called once when Monaco finishes mounting.
   * Stores the editor instance ref for programmatic access (e.g., getValue).
   */
  const handleEditorMount: OnMount = useCallback((editor) => {
    editorRef.current = editor;
  }, []);

  /**
   * Switches the active language, updates Monaco, and resets the editor
   * content to the new language's starter template.
   */
  const handleLanguageChange = useCallback((langId: SupportedLanguageId) => {
    setLanguage(langId);
    setCode(STARTER_TEMPLATES[langId]);
    setIsDropdownOpen(false);
  }, []);

  /**
   * Submits the current editor content to the parent for WebSocket delivery.
   * Prevents empty submissions and double-sends while the AI is processing.
   */
  const handleSubmit = useCallback(() => {
    const currentCode = editorRef.current?.getValue() || code;
    if (!currentCode.trim() || isProcessing) {
      return;
    }
    onSubmitCode(currentCode, language);
  }, [code, language, isProcessing, onSubmitCode]);

  const currentLangLabel = SUPPORTED_LANGUAGES.find((l) => l.id === language)?.label || "JavaScript";

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] relative overflow-hidden">

      {/* ── Editor Toolbar ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#252526] border-b border-[#3c3c3c] z-20 relative">
        <div className="flex items-center gap-3">
          {/* Status Indicator */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-[0.1em] border transition-all duration-300 ${
            isEnabled
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-[#3c3c3c] text-[#808080] border-[#4a4a4a]"
          }`}>
            {isEnabled ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
            {isEnabled ? "Editor Active" : "Editor Locked"}
          </div>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => isEnabled && setIsDropdownOpen(!isDropdownOpen)}
              disabled={!isEnabled}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all border ${
                isEnabled
                  ? "bg-[#3c3c3c] text-[#cccccc] border-[#4a4a4a] hover:bg-[#4a4a4a] cursor-pointer"
                  : "bg-[#2d2d2d] text-[#555555] border-[#3c3c3c] cursor-not-allowed"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              {currentLangLabel}
              <ChevronDown className={`w-3 h-3 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown */}
            {isDropdownOpen && isEnabled && (
              <div className="absolute top-full left-0 mt-1 bg-[#2d2d30] border border-[#3c3c3c] rounded-lg shadow-2xl z-50 min-w-[160px] py-1 animate-slide-up">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => handleLanguageChange(lang.id)}
                    className={`w-full text-left px-4 py-2 text-[13px] font-medium transition-colors ${
                      language === lang.id
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "text-[#cccccc] hover:bg-[#3c3c3c]"
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!isEnabled || isProcessing}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[12px] font-bold uppercase tracking-[0.05em] transition-all duration-300 ${
            isEnabled && !isProcessing
              ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 cursor-pointer"
              : "bg-[#3c3c3c] text-[#555555] cursor-not-allowed"
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          Submit Code
        </button>
      </div>

      {/* ── Monaco Editor ───────────────────────────────────────────────── */}
      <div className="flex-1 relative" onScroll={(e) => e.stopPropagation()}>
        <Editor
          height="100%"
          language={language}
          value={code}
          theme="vs-dark"
          onChange={(value) => setCode(value || "")}
          onMount={handleEditorMount}
          options={{
            readOnly: !isEnabled,
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
            lineNumbers: "on",
            roundedSelection: true,
            scrollBeyondLastLine: false,
            padding: { top: 16 },
            automaticLayout: true,
            tabSize: 2,
            wordWrap: "on",
            suggestOnTriggerCharacters: isEnabled,
            quickSuggestions: isEnabled,
            contextmenu: isEnabled,
            cursorStyle: isEnabled ? "line" : "underline-thin",
            renderLineHighlight: isEnabled ? "all" : "none",
          }}
        />

        {/* ── Lock Overlay ─────────────────────────────────────────────── */}
        {/* Covers the editor with a semi-transparent glass layer when locked. */}
        {/* Uses pointer-events-none on the inner content so the overlay itself */}
        {/* blocks all mouse events on the editor below.                       */}
        {!isEnabled && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/50 backdrop-blur-[2px] transition-opacity duration-500">
            <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-[#1e1e1e]/80 border border-[#3c3c3c] shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-[#2d2d2d] flex items-center justify-center border border-[#4a4a4a]">
                <Lock className="w-8 h-8 text-[#666666]" />
              </div>
              <div className="text-center">
                <p className="text-[#cccccc] font-semibold text-[15px] mb-1">Editor Locked</p>
                <p className="text-[#808080] text-[13px] max-w-[280px] leading-relaxed">
                  The code editor will activate automatically when the AI asks a coding question.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
