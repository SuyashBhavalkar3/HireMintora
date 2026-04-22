"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Square, Loader2, Play, AlertCircle } from "lucide-react";

type Message = {
  id: string;
  role: "bot" | "user";
  text: string;
  isPartial?: boolean;
};

export default function InterviewUI({ tokenId }: { tokenId: string }) {
  const [status, setStatus] = useState<"DISCONNECTED" | "CONNECTING" | "LISTENING" | "PROCESSING" | "SPEAKING">("DISCONNECTED");
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
        type: "text_answer",
        payload: {
          text: "Hello, I am ready. Please introduce yourself and start the interview."
        }
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

  const handleSocketMessage = (message: any) => {
    const { type, payload, state } = message;
    
    if (type === "state_change") {
      setStatus(payload.state as any);
      setIsFinishing(false);
      
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
      // The server will respond with a state_change to LISTENING, which will trigger startRecording
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
      <div className="flex flex-col h-screen bg-[#f9fafb] items-center justify-center p-6">
        <div className="bg-white p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Mic className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">Ready for your Interview?</h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            The AI interviewer will greet you when you start. Please ensure your microphone is working and you are in a quiet environment.
          </p>
          <button
            onClick={() => setHasStarted(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md"
          >
            <Play className="w-5 h-5" />
            Start Interview
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#f9fafb]">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-white border-b border-[#e5e7eb] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="brand">HireMintora Interview</div>
          {status === "LISTENING" && (
            <span className="flex items-center gap-2 text-xs font-semibold px-3 py-1 bg-green-100 text-green-700 rounded-full">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Listening
            </span>
          )}
          {status === "PROCESSING" && (
            <span className="flex items-center gap-2 text-xs font-semibold px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
              <Loader2 className="w-3 h-3 animate-spin" />
              Thinking
            </span>
          )}
          {status === "SPEAKING" && (
            <span className="flex items-center gap-2 text-xs font-semibold px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
              <Play className="w-3 h-3" />
              Speaking
            </span>
          )}
        </div>
        
        {/* Interrupt Button */}
        {(status === "SPEAKING" || status === "PROCESSING") && (
          <button 
            onClick={handleInterrupt}
            className="btn btn-danger"
          >
            <Square className="w-4 h-4" /> Stop AI
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 max-w-4xl w-full mx-auto">
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start gap-3 border border-red-200">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Error</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {messages.length === 0 && status === "LISTENING" && (
          <div className="flex flex-col items-center justify-center flex-1 text-center opacity-50">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-4">
              <Mic className="w-8 h-8 text-gray-400" />
            </div>
            <p className="font-medium text-gray-500">I'm listening. Please introduce yourself.</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={`${msg.id}-${i}`} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-5 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-gradient-to-br from-[#6ee7b7] to-[#34d399] text-gray-900 rounded-br-sm' 
                : 'bg-white border border-[#e5e7eb] rounded-bl-sm'
            }`}>
              <div className="flex items-center gap-2 mb-2 opacity-70 text-xs font-bold uppercase tracking-wider">
                {msg.role === 'user' ? 'You' : 'AI Interviewer'}
                {msg.isPartial && msg.role === 'user' && <Loader2 className="w-3 h-3 animate-spin inline ml-1" />}
              </div>
              <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        
        {/* Dummy div to scroll to bottom */}
        <div className="h-10"></div>
      </div>

      {/* Footer Visualizer Area */}
      <div className="p-6 bg-white border-t border-[#e5e7eb] flex justify-center items-center h-24 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10 relative">
        {status === "LISTENING" ? (
          isRecording ? (
            <div className="flex items-center gap-6 w-full max-w-lg justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 animate-pulse shadow-sm">
                  <Mic className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-gray-600">
                  Recording your voice...
                </p>
              </div>
              
              <button 
                onClick={handleDoneSpeaking} 
                className="btn btn-primary bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Square className="w-4 h-4" />
                Stop & Submit
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-6 w-full max-w-lg justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                  <Mic className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-gray-600">
                  {isFinishing ? "Processing..." : "Ready to speak"}
                </p>
              </div>
              
              <button 
                onClick={handleStartSpeaking} 
                disabled={isFinishing}
                className="btn btn-primary bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Mic className="w-4 h-4" />
                Press to Speak
              </button>
            </div>
          )
        ) : status === "SPEAKING" ? (
          <div className="flex items-center gap-2">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="w-1.5 bg-purple-400 rounded-full animate-pulse" 
                   style={{ height: `${Math.random() * 20 + 10}px`, animationDelay: `${i*0.1}s` }}></div>
            ))}
            <p className="text-sm font-semibold text-purple-600 ml-3">AI is talking</p>
          </div>
        ) : (
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
              <MicOff className="w-4 h-4" />
            </div>
            <p className="text-sm font-medium text-gray-400">Microphone muted</p>
          </div>
        )}
      </div>
    </div>
  );
}
