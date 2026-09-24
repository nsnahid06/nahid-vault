import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, X, Sparkles, Radio, MessageSquare, AlertCircle, RefreshCw } from 'lucide-react';

interface VoiceConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToast?: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

interface TranscriptItem {
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

const PRESET_PROMPTS = [
  "What is the best outfit for a summer rooftop party?",
  "Recommend a complete luxury suit combination.",
  "How should I care for Italian linen shirts?",
  "What size should I pick for a tailored fit?"
];

export const VoiceConversationModal: React.FC<VoiceConversationModalProps> = ({
  isOpen,
  onClose,
  onAddToast
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMicActive, setIsMicActive] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([
    {
      sender: 'assistant',
      text: "Welcome to NAHID VAULT. I'm Zephyr, your personal AI Stylist. How can I curate your look today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');

  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const nextStartTimeRef = useRef<number>(0);
  const isMicActiveRef = useRef(true);
  const isAudioMutedRef = useRef(false);
  const transcriptContainerRef = useRef<HTMLDivElement | null>(null);

  isMicActiveRef.current = isMicActive;
  isAudioMutedRef.current = isAudioMuted;

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
    }
  }, [transcripts]);

  // Handle modal open/close connection lifecycle
  useEffect(() => {
    if (isOpen) {
      connectLiveSession();
    } else {
      disconnectLiveSession();
    }

    return () => {
      disconnectLiveSession();
    };
  }, [isOpen]);

  const floatTo16BitPCM = (input: Float32Array): ArrayBuffer => {
    const output = new DataView(new ArrayBuffer(input.length * 2));
    for (let i = 0; i < input.length; i++) {
      const s = Math.max(-1, Math.min(1, input[i]));
      output.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return output.buffer;
  };

  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const base64ToAudioBuffer = (base64: string, ctx: AudioContext): AudioBuffer => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const dataView = new DataView(bytes.buffer);
    const numSamples = Math.floor(len / 2);
    const audioBuffer = ctx.createBuffer(1, numSamples, 24000);
    const channelData = audioBuffer.getChannelData(0);
    for (let i = 0; i < numSamples; i++) {
      const int16 = dataView.getInt16(i * 2, true);
      channelData[i] = int16 / (int16 < 0 ? 32768 : 32767);
    }
    return audioBuffer;
  };

  const stopAllAudioPlayback = () => {
    activeSourcesRef.current.forEach(source => {
      try {
        source.stop();
      } catch (e) {
        // ignore
      }
    });
    activeSourcesRef.current = [];
    nextStartTimeRef.current = 0;
    setIsSpeaking(false);
  };

  const playAudioChunk = (base64PCM: string) => {
    if (isAudioMutedRef.current) return;

    if (!outputAudioCtxRef.current) {
      outputAudioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 24000
      });
    }

    const ctx = outputAudioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    try {
      const buffer = base64ToAudioBuffer(base64PCM, ctx);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);

      const currentTime = ctx.currentTime;
      if (nextStartTimeRef.current < currentTime) {
        nextStartTimeRef.current = currentTime;
      }

      source.start(nextStartTimeRef.current);
      nextStartTimeRef.current += buffer.duration;

      activeSourcesRef.current.push(source);
      setIsSpeaking(true);

      source.onended = () => {
        activeSourcesRef.current = activeSourcesRef.current.filter(s => s !== source);
        if (activeSourcesRef.current.length === 0) {
          setIsSpeaking(false);
        }
      };
    } catch (err) {
      console.error('Error playing audio chunk:', err);
    }
  };

  const connectLiveSession = async () => {
    setErrorMessage(null);
    setIsConnecting(true);

    try {
      // 1. Setup Microphone input
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true
        }
      });
      mediaStreamRef.current = stream;

      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000
      });
      inputAudioCtxRef.current = inputCtx;

      const source = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      source.connect(processor);
      processor.connect(inputCtx.destination);

      processor.onaudioprocess = (e) => {
        if (!isMicActiveRef.current || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
          return;
        }

        const inputData = e.inputBuffer.getChannelData(0);
        const pcmBuffer = floatTo16BitPCM(inputData);
        const base64Audio = arrayBufferToBase64(pcmBuffer);

        wsRef.current.send(JSON.stringify({ audio: base64Audio }));
      };

      // 2. Setup WebSocket connection
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      let currentAssistantTurnText = '';

      ws.onopen = () => {
        console.log('WebSocket connection established with /live');
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.type === 'status' && msg.status === 'connected') {
            setIsConnected(true);
            setIsConnecting(false);
            if (onAddToast) {
              onAddToast('Live Stylist Connected', 'You are now live with Gemini Voice Assistant.', 'success');
            }
          }

          if (msg.type === 'audio' && msg.data) {
            playAudioChunk(msg.data);
          }

          if (msg.type === 'text' && msg.text) {
            currentAssistantTurnText += msg.text;
            setTranscripts(prev => {
              const last = prev[prev.length - 1];
              if (last && last.sender === 'assistant' && last.text === currentAssistantTurnText.slice(0, -msg.text.length)) {
                return [...prev.slice(0, -1), { ...last, text: currentAssistantTurnText }];
              } else {
                return [
                  ...prev,
                  {
                    sender: 'assistant',
                    text: currentAssistantTurnText,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  }
                ];
              }
            });
          }

          if (msg.type === 'turnComplete') {
            currentAssistantTurnText = '';
          }

          if (msg.type === 'interrupted') {
            stopAllAudioPlayback();
            currentAssistantTurnText = '';
          }

          if (msg.type === 'error') {
            setErrorMessage(msg.error);
            setIsConnecting(false);
            setIsConnected(false);
          }
        } catch (e) {
          console.error('Error parsing WebSocket message:', e);
        }
      };

      ws.onerror = (e) => {
        console.error('WebSocket error:', e);
        setErrorMessage('WebSocket connection error. Make sure your server is running.');
        setIsConnecting(false);
        setIsConnected(false);
      };

      ws.onclose = () => {
        setIsConnected(false);
        setIsConnecting(false);
      };
    } catch (err: any) {
      console.error('Failed to access microphone or connect:', err);
      setErrorMessage(
        err?.message || 'Microphone access denied or Audio API unavailable in this browser.'
      );
      setIsConnecting(false);
      setIsConnected(false);
    }
  };

  const disconnectLiveSession = () => {
    stopAllAudioPlayback();

    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }

    if (inputAudioCtxRef.current) {
      inputAudioCtxRef.current.close();
      inputAudioCtxRef.current = null;
    }

    if (outputAudioCtxRef.current) {
      outputAudioCtxRef.current.close();
      outputAudioCtxRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnected(false);
    setIsConnecting(false);
  };

  const handleSendTextPrompt = (textToSend?: string) => {
    const text = textToSend || inputText.trim();
    if (!text) return;

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ text }));
      setTranscripts(prev => [
        ...prev,
        {
          sender: 'user',
          text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      if (!textToSend) setInputText('');
    } else {
      if (onAddToast) {
        onAddToast('Not Connected', 'Voice session is reconnecting...', 'warning');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 transition-all">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 relative">
              <Sparkles className="w-5 h-5 animate-pulse" />
              {isConnected && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-neutral-900" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                  NAHID VAULT Live AI Stylist
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                  Gemini Live
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                {isConnecting ? (
                  <span className="text-amber-400 flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin inline" /> Connecting real-time audio...
                  </span>
                ) : isConnected ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Radio className="w-3 h-3 animate-pulse inline" /> Live Audio Stream Active
                  </span>
                ) : (
                  <span className="text-neutral-500">Disconnected</span>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-all"
            title="Close Voice Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sound Wave & Visualizer Box */}
        <div className="p-6 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 flex flex-col items-center justify-center border-b border-neutral-800 relative overflow-hidden">
          
          {/* Animated Glow Halo */}
          <div className={`absolute w-48 h-48 rounded-full blur-3xl transition-all duration-700 ${
            isSpeaking
              ? 'bg-amber-500/30 scale-125'
              : isConnected
              ? 'bg-emerald-500/15 scale-100'
              : 'bg-neutral-800/20 scale-75'
          }`} />

          {/* Sound Wave Bars */}
          <div className="relative z-10 flex items-center justify-center gap-1.5 h-16 my-2">
            {[40, 75, 55, 90, 60, 100, 45, 80, 50, 95, 65, 40].map((height, i) => (
              <div
                key={i}
                className={`w-1.5 rounded-full transition-all duration-300 ${
                  isSpeaking
                    ? 'bg-gradient-to-t from-amber-500 to-amber-200 animate-bounce'
                    : isConnected && isMicActive
                    ? 'bg-emerald-500/80 animate-pulse'
                    : 'bg-neutral-800'
                }`}
                style={{
                  height: isSpeaking
                    ? `${Math.max(15, Math.random() * height)}px`
                    : isConnected
                    ? `${height * 0.4}px`
                    : '12px',
                  animationDelay: `${i * 80}ms`
                }}
              />
            ))}
          </div>

          <div className="relative z-10 flex items-center gap-2 mt-2">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
              isSpeaking
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : isConnected && isMicActive
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-neutral-800 text-neutral-400 border-neutral-700'
            }`}>
              {isSpeaking ? 'Zephyr is Speaking...' : isConnected ? (isMicActive ? 'Listening...' : 'Mic Muted') : 'Connecting...'}
            </span>
          </div>

          {errorMessage && (
            <div className="mt-3 text-xs text-rose-400 bg-rose-950/60 border border-rose-800/60 px-3 py-2 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
              <button
                onClick={connectLiveSession}
                className="underline font-bold hover:text-white ml-2"
              >
                Retry
              </button>
            </div>
          )}
        </div>

        {/* Live Conversation Transcript */}
        <div
          ref={transcriptContainerRef}
          className="flex-1 p-6 overflow-y-auto space-y-4 min-h-[180px] max-h-[300px] bg-neutral-900/50"
        >
          {transcripts.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                item.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                  {item.sender === 'user' ? 'You' : 'Zephyr (AI Stylist)'}
                </span>
                <span className="text-[9px] text-neutral-600">{item.time}</span>
              </div>
              <div
                className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                  item.sender === 'user'
                    ? 'bg-stone-200 text-neutral-900 font-medium rounded-br-none'
                    : 'bg-neutral-800 text-neutral-200 border border-neutral-700/60 rounded-bl-none'
                }`}
              >
                {item.text}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Presets */}
        <div className="px-6 py-2 bg-neutral-950/80 border-t border-neutral-800/80 overflow-x-auto flex gap-2 no-scrollbar">
          {PRESET_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendTextPrompt(prompt)}
              className="px-3 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[11px] text-neutral-300 hover:text-amber-300 whitespace-nowrap transition-all flex items-center gap-1.5"
            >
              <MessageSquare className="w-3 h-3 text-amber-500/70" />
              <span>{prompt}</span>
            </button>
          ))}
        </div>

        {/* Controls Footer */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between gap-3">
          
          {/* Mute/Mic Toggle Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMicActive(!isMicActive)}
              className={`p-3 rounded-full border transition-all ${
                isMicActive
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border-rose-500/40 hover:bg-rose-500/30'
              }`}
              title={isMicActive ? 'Mute Microphone' : 'Unmute Microphone'}
            >
              {isMicActive ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            <button
              type="button"
              onClick={() => {
                if (!isAudioMuted) {
                  stopAllAudioPlayback();
                }
                setIsAudioMuted(!isAudioMuted);
              }}
              className={`p-3 rounded-full border transition-all ${
                !isAudioMuted
                  ? 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700'
                  : 'bg-rose-500/20 text-rose-400 border-rose-500/40 hover:bg-rose-500/30'
              }`}
              title={isAudioMuted ? 'Unmute Audio Speaker' : 'Mute Audio Speaker'}
            >
              {!isAudioMuted ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>

          {/* Text input fallback */}
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendTextPrompt()}
              placeholder="Or type a question for Zephyr..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-full px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/60"
            />
            <button
              type="button"
              onClick={() => handleSendTextPrompt()}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-full transition-all"
            >
              Ask
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
