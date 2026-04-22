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
  
  const ws = useRef<WebSocket | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const audioQueue = useRef<string[]>([]);
  const isPlayingAudio = useRef<boolean>(false);
  const nextAudioElement = useRef<HTMLAudioElement | null>(null);

  // Auto-connect on mount
  useEffect(() => {
    connectWebSocket();
    return () => {
      disconnect();
    };
  }, [tokenId]);

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
      startRecording();
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
      if (payload.state === "LISTENING") {
        startRecording();
      } else {
        stopRecording();
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
          return prev.map(m => m.id === payload.turnId ? { ...m, text: m.text + payload.text } : m);
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
      const existing = prev.find(m => m.id === id);
      if (existing) {
        return prev.map(m => m.id === id ? { ...m, text, isPartial } : m);
      }
      return [...prev, { id, role, text, isPartial }];
    });
  };

  const startRecording = async () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = 'audio/webm;codecs=opus';
      
      const recorder = new MediaRecorder(stream, { mimeType });
      
      recorder.ondataavailable = async (e) => {
        if (e.data.size > 0 && ws.current?.readyState === WebSocket.OPEN) {
          const buffer = await e.data.arrayBuffer();
          const base64Audio = btoa(String.fromCharCode(...new Uint8Array(buffer)));
          
          ws.current.send(JSON.stringify({
            type: "audio_chunk",
            payload: {
              audio: base64Audio,
              encoding: mimeType,
              sampleRate: 48000
            }
          }));
        }
      };
      
      recorder.start(250); // Send chunk every 250ms
      mediaRecorder.current = recorder;
    } catch (err) {
      console.error("Mic access denied", err);
      setError("Please allow microphone access to proceed with the interview.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(t => t.stop());
      mediaRecorder.current = null;
      
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
      <div className="p-6 bg-white border-t border-[#e5e7eb] flex justify-center items-center h-24 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
        {status === "LISTENING" ? (
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 animate-pulse shadow-sm">
              <Mic className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-gray-600">Recording your voice...</p>
          </div>
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
