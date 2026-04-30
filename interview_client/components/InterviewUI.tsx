/**
 * @file InterviewUI.tsx
 * @description Full AI interview experience for candidates.
 *
 * This is the core interactive component of the interview_client app.
 * It manages the complete lifecycle of an AI interview session:
 *
 * 1. **Pre-Start**: Shows a "Ready for your Interview?" card with a start button.
 * 2. **WebSocket Connection**: Connects to `ws://<server>/ws/interview` with the
 *    candidate's tokenId and a randomly generated sessionId.
 * 3. **Audio Recording**: Uses AudioWorklet API (pcm-processor) to capture
 *    16kHz PCM16 mono audio, base64-encodes it, and streams it to the server.
 * 4. **Message Rendering**: Displays a chat-like UI with user/bot message bubbles,
 *    updating in real-time as partial transcripts and AI text chunks arrive.
 * 5. **Audio Playback**: Manages a sequential audio queue for TTS playback,
 *    preventing overlapping audio and handling errors gracefully.
 *
 * State Machine (mirrors server-side FSM):
 *   DISCONNECTED → CONNECTING → LISTENING ↔ PROCESSING ↔ SPEAKING
 *
 * Key refs:
 * - ws.current           — WebSocket connection instance.
 * - audioContext.current  — Web Audio API context for recording.
 * - audioQueue.current    — FIFO queue of base64 audio chunks for playback.
 * - isPlayingAudio.current — Lock to prevent concurrent audio playback.
 *
 * @param {string} tokenId — The candidate's unique access token (from URL query).
 */

"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Square, Loader2, Play, AlertCircle } from "lucide-react";
import CodeEditor from "./CodeEditor";

type Message = {
  id: string;
  role: "bot" | "user";
  text: string;
  isPartial?: boolean;
};

export default function InterviewUI({ tokenId }: { tokenId: string }) {
  const [status, setStatus] = useState<"DISCONNECTED" | "CONNECTING" | "LISTENING" | "PROCESSING" | "SPEAKING">("DISCONNECTED");
  const [mode, setMode] = useState<"default" | "coding">("default");
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  const ws = useRef<WebSocket | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const audioQueue = useRef<string[]>([]);
  const isPlayingAudio = useRef<boolean>(false);
  const nextAudioElement = useRef<HTMLAudioElement | null>(null);

  // Connect when user starts the interview
  useEffect(() => {
    if (hasStarted) {
      connectWebSocket();
    }
    return () => {
      disconnect();
    };
  }, [hasStarted, tokenId]);

  /**
   * Establishes a WebSocket connection to the interview server.
   * Once connected, sends a `start_interview` event to trigger the AI's opening message.
   * All incoming server events are routed through handleSocketMessage().
   */
  const connectWebSocket = () => {
    if (ws.current) return;
    
    setStatus("CONNECTING");
    setError(null);
    
    // Generate a session ID if needed, or backend can handle it if we pass tokenId
    const sessionId = Math.random().toString(36).substring(7);
    const wsUrl = `ws://localhost:3000/ws/interview?sessionId=${sessionId}&tokenId=${tokenId}`;
    
    const socket = new WebSocket(wsUrl);
    
    socket.onopen = () => {
      setStatus("LISTENING");
      // Trigger AI to start the conversation
      socket.send(JSON.stringify({
        type: "start_interview"
      }));
    };
    
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleSocketMessage(data);
      } catch (err) {
        console.error("Failed to parse websocket message", err);
      }
    };
    
    socket.onclose = () => {
      setStatus("DISCONNECTED");
      ws.current = null;
      stopRecording();
    };
    
    socket.onerror = () => {
      setError("WebSocket connection failed.");
      setStatus("DISCONNECTED");
    };
    
    ws.current = socket;
  };

  const disconnect = () => {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
    stopRecording();
  };

  /**
   * Routes incoming WebSocket messages to the appropriate state/UI update handler.
   * Message types mirror the server's WS_EVENTS constants.
   */
  const handleSocketMessage = (message: any) => {
    const { type, payload } = message;
    
    if (type === "state_change") {
      setStatus(payload.state as any);
      setIsFinishing(false);

      if (payload.mode) {
        setMode(payload.mode);
      }
      
      if (payload.error) {
        setError(payload.error);
      } else if (payload.reason !== "stt_error" && payload.reason !== "processing_error" && payload.reason !== "code_evaluation_error") {
        setError(null);
      }

      if (payload.state !== "LISTENING") {
        stopRecording();
        setIsRecording(false);
      }
    }
    
    if (type === "transcript_partial") {
      updateMessage(payload.turnId, "user", payload.transcript, true);
    }
    
    if (type === "transcript_final") {
      updateMessage(payload.turnId, "user", payload.transcript, false);
    }
    
    if (type === "ai_text_chunk") {
      // Append chunk to the bot's turn
      setMessages(prev => {
        const existing = prev.find(m => m.id === payload.turnId && m.role === "bot");
        if (existing) {
          return prev.map(m => (m.id === payload.turnId && m.role === "bot") ? { ...m, text: m.text + payload.text } : m);
        } else {
          return [...prev, { id: payload.turnId, role: "bot", text: payload.text, isPartial: true }];
        }
      });
    }

    if (type === "tts_audio_chunk") {
      playAudio(payload.audio);
    }
  };

  const updateMessage = (id: string, role: "bot"|"user", text: string, isPartial: boolean) => {
    setMessages(prev => {
      const existing = prev.find(m => m.id === id && m.role === role);
      if (existing) {
        return prev.map(m => (m.id === id && m.role === role) ? { ...m, text, isPartial } : m);
      }
      return [...prev, { id, role, text, isPartial }];
    });
  };

  /**
   * Initializes the microphone and creates an AudioWorklet pipeline.
   */
  const startRecording = async () => {
    if (audioContext.current) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContext.current = audioCtx;
      
      await audioCtx.audioWorklet.addModule('/audio-processor.js');
      
      const source = audioCtx.createMediaStreamSource(stream);
      const processor = new AudioWorkletNode(audioCtx, 'pcm-processor');
      
      processor.port.onmessage = (e) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
          const buffer = new Uint8Array(e.data);
          let binary = '';
          for (let i = 0; i < buffer.byteLength; i++) {
            binary += String.fromCharCode(buffer[i]);
          }
          const base64Audio = btoa(binary);
          
          ws.current.send(JSON.stringify({
            type: "audio_chunk",
            payload: {
              audio: base64Audio,
              encoding: "pcm_s16le",
              sampleRate: 16000
            }
          }));
        }
      };
      
      source.connect(processor);
      processor.connect(audioCtx.destination);
      
      mediaRecorder.current = {
        state: "recording",
        stream: stream,
        source: source,
        processor: processor
      } as any;
    } catch (err) {
      console.error("Mic access denied or worklet error", err);
      setError("Failed to access microphone or load audio processor.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      const { stream, source, processor } = mediaRecorder.current as any;
      if (processor) processor.disconnect();
      if (source) source.disconnect();
      if (stream) stream.getTracks().forEach((t: any) => t.stop());
      mediaRecorder.current = null;
      
      if (audioContext.current) {
        audioContext.current.close();
        audioContext.current = null;
      }
      
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ type: "audio_end" }));
      }
    }
  };

  const handleInterrupt = () => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: "cancel_turn" }));
      audioQueue.current = []; // Clear any pending TTS
      if (nextAudioElement.current) {
        nextAudioElement.current.pause();
      }
    }
  };

  const handleStartSpeaking = () => {
    setIsRecording(true);
    startRecording();
  };

  const handleDoneSpeaking = () => {
    setIsRecording(false);
    setIsFinishing(true);
    stopRecording();
  };

  const handleSubmitCode = (code: string, language: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: "code_submission",
        payload: { code, language }
      }));
    }
  };

  /**
   * Enqueues a base64 audio chunk for sequential playback.
   */
  const playAudio = (base64Audio: string) => {
    audioQueue.current.push(base64Audio);
    processAudioQueue();
  };

  const processAudioQueue = () => {
    if (isPlayingAudio.current || audioQueue.current.length === 0) return;
    
    isPlayingAudio.current = true;
    const base64Audio = audioQueue.current.shift();
    
    if (!base64Audio) {
      isPlayingAudio.current = false;
      return;
    }
    
    try {
      const audioUrl = `data:audio/wav;base64,${base64Audio}`;
      const audio = new Audio(audioUrl);
      nextAudioElement.current = audio;
      
      audio.onended = () => {
        isPlayingAudio.current = false;
        processAudioQueue();
      };
      
      audio.onerror = () => {
        isPlayingAudio.current = false;
        processAudioQueue();
      };
      
      audio.play().catch(e => {
        console.error("Audio playback failed", e);
        isPlayingAudio.current = false;
        processAudioQueue();
      });
    } catch (e) {
      isPlayingAudio.current = false;
      processAudioQueue();
    }
  };

  if (!hasStarted) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="bg-white p-12 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 max-w-md w-full text-center relative overflow-hidden animate-slide-up">
          <div className="absolute top-0 left-0 w-full h-1 bg-slate-50"></div>
          <div className="w-20 h-20 bg-emerald-50 text-[#10b981] rounded-[24px] flex items-center justify-center mx-auto mb-8 shadow-sm">
            <Mic className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-4 tracking-tight">Ready for your Interview?</h1>
          <p className="text-slate-500 mb-10 leading-relaxed text-[15px] px-2">
            The AI interviewer will guide you. Please ensure your microphone is active and you are in a quiet space.
          </p>
          <button
            onClick={() => setHasStarted(true)}
            className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-semibold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_8px_20px_-8px_rgba(16,185,129,0.3)] hover:shadow-[0_12px_25px_-8px_rgba(16,185,129,0.4)] text-[15px]"
          >
            <Play className="w-5 h-5 fill-current" />
            Start Interview
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex bg-[#f8fafc] overflow-hidden">
      {/* Left Column: Chat Experience */}
      <div className="flex-1 flex flex-col border-r border-slate-100 bg-white min-w-0">
        {/* Interview Sub-header */}
        <div className="bg-white/70 backdrop-blur-md border-b border-slate-100 z-10 relative">
          <div className="w-full px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {status === "LISTENING" && (
                <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Listening
                </span>
              )}
              {status === "PROCESSING" && (
                <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] px-4 py-2 bg-slate-50 text-slate-500 rounded-full border border-slate-100">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Thinking
                </span>
              )}
              {status === "SPEAKING" && (
                <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] px-4 py-2 bg-indigo-50 text-indigo-500 rounded-full border border-indigo-100/50">
                  <div className="flex gap-0.5 items-center justify-center">
                     <span className="w-0.5 h-2.5 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: "0ms"}}></span>
                     <span className="w-0.5 h-3 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: "150ms"}}></span>
                     <span className="w-0.5 h-2.5 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: "300ms"}}></span>
                  </div>
                  Speaking
                </span>
              )}
            </div>
            
            {/* Interrupt Button */}
            {(status === "SPEAKING" || status === "PROCESSING") && (
              <button 
                onClick={handleInterrupt}
                className="flex items-center gap-2 text-[12px] font-semibold px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl transition-all border border-rose-100"
              >
                <Square className="w-3 h-3 fill-current" /> Stop AI
              </button>
            )}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-8 scroll-smooth">
          {error && (
            <div className="bg-rose-50 text-rose-700 p-5 rounded-2xl flex items-start gap-3 border border-rose-100 animate-slide-up">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-500" />
              <div>
                <p className="font-bold text-sm tracking-tight">Something went wrong</p>
                <p className="text-sm mt-1 opacity-80">{error}</p>
              </div>
            </div>
          )}

          {messages.length === 0 && status === "LISTENING" && (
            <div className="flex flex-col items-center justify-center flex-1 text-center opacity-40 animate-slide-up mt-12">
              <div className="w-20 h-20 rounded-[28px] bg-slate-100 flex items-center justify-center mb-6">
                <Mic className="w-8 h-8 text-slate-400" />
              </div>
              <p className="font-semibold text-slate-500 text-[15px]">Waiting for your introduction...</p>
            </div>
          )}

          <div className="flex flex-col gap-8">
            {messages.map((msg, i) => (
              <div key={`${msg.id}-${i}`} className={`flex w-full animate-slide-up ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-4 max-w-[90%] md:max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center shadow-sm border ${
                    msg.role === 'user' ? 'bg-white border-slate-100 text-emerald-500' : 'bg-emerald-500 border-emerald-500 text-white shadow-emerald-100 shadow-md'
                  }`}>
                    {msg.role === 'user' ? <span className="font-bold text-[9px] tracking-widest uppercase">Me</span> : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                  </div>
                  <div className={`rounded-[20px] px-5 py-4 relative ${
                    msg.role === 'user' 
                      ? 'bg-[#10b981] text-white' 
                      : 'bg-[#f8fafc] border border-slate-100 text-slate-700 shadow-sm'
                  }`}>
                    <div className={`flex items-center gap-2 mb-1 text-[9px] font-bold uppercase tracking-[0.15em] ${
                      msg.role === 'user' ? 'text-emerald-100' : 'text-slate-400'
                    }`}>
                      {msg.role === 'user' ? 'Candidate' : 'HireMintora AI'}
                    </div>
                    <p className="text-[15px] leading-relaxed font-medium whitespace-pre-wrap">
                      {/* 
                         * CONTROL LOGIC: We scan bot messages for [ENABLE_EDITOR] or [DISABLE_EDITOR] tags.
                         * These tags are used by the server to switch between conversational and coding modes.
                         * We strip them from the UI to keep the candidate experience clean.
                         */}
                      {msg.role === "bot" 
                        ? msg.text.replace(/\[(ENABLE|DISABLE)_EDITOR\]/g, "").trim() 
                        : msg.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="h-4"></div>
        </div>

        {/* Footer: Recording Controls */}
        <div className="px-6 py-6 bg-white border-t border-slate-100 z-20">
          {status === "LISTENING" ? (
            isRecording ? (
              <div className="flex items-center justify-between bg-emerald-50/50 border border-emerald-100 rounded-2xl p-3 pl-6 pr-3 transition-all animate-slide-up">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center animate-pulse-ring relative">
                    <Mic className="w-5 h-5 relative z-10" />
                  </div>
                  <p className="text-[15px] font-bold text-emerald-800">Recording...</p>
                </div>
                <button onClick={handleDoneSpeaking} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-100 transition-all text-sm">
                  <Square className="w-3.5 h-3.5 fill-current" /> Submit
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-6 animate-slide-up">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-[15px] font-bold text-slate-800">{isFinishing ? "Processing..." : "Speak whenever ready"}</p>
                    <p className="text-[12px] text-slate-400 font-medium">Click to record response</p>
                  </div>
                </div>
                <button onClick={handleStartSpeaking} disabled={isFinishing} className="flex-1 sm:flex-none bg-[#10b981] hover:bg-[#059669] text-white font-bold px-6 py-3.5 rounded-xl flex items-center justify-center gap-3 transition-all shadow-md disabled:opacity-30 text-sm">
                  <Mic className="w-4 h-4" /> Record Answer
                </button>
              </div>
            )
          ) : status === "SPEAKING" ? (
            <div className="flex flex-col items-center justify-center gap-3 animate-slide-up">
               <div className="flex items-end justify-center gap-1 h-8">
                {[1,2,3,4,5,6,7,8].map(i => (
                  <div key={i} className="w-1 bg-[#10b981] rounded-full animate-pulse" 
                       style={{ height: `${Math.random() * 60 + 40}%`, animationDelay: `${i*0.1}s`, animationDuration: '0.6s' }}></div>
                ))}
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">AI is speaking</p>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4 px-6 py-3 bg-slate-50/50 rounded-xl border border-slate-100 animate-slide-up">
               <MicOff className="w-4 h-4 text-slate-300" />
               <p className="text-[13px] font-semibold text-slate-400">Microphone inactive</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Code Editor */}
      <div className="flex-1 min-w-0 bg-[#1e1e1e]">
        <CodeEditor 
          isEnabled={mode === "coding"} 
          onSubmitCode={handleSubmitCode}
          isProcessing={status === "PROCESSING"}
        />
      </div>
    </div>
  );
}
