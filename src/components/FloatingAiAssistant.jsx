import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Send, X, Minus, Sparkles, MessageSquare, Bot, ArrowRight,
  Maximize2, RotateCcw, Volume2, ShieldCheck, HelpCircle, Code, FileText, CheckCircle2,
  ExternalLink, Layers
} from 'lucide-react';
import ThreeAiOrb from './ThreeAiOrb';
import { sendMessage } from '../api/chatbotApi';

const STORAGE_KEY = 'lpu_ai_orb_position_v3';

/**
 * FloatingAiAssistant: Authentic 3D AI Orb Assistant matching the Reference Mockup
 * - Real 3D WebGL Three.js Sphere Robot with metallic pearlescent white & graphite chassis
 * - Bold graphite "AI" insignia on forehead armor
 * - Curved obsidian black glass visor
 * - Expressive glowing neon orange digital eyes (5 states: Idle, Hover, Listening, Thinking, Speaking)
 * - Illuminated dual neon orange side earphone rings
 * - Holographic orange ground pedestal rings beneath
 * - 3D head look-at tracking cursor & floating breathing motion
 * - Free draggable anywhere with magnetic edge snapping
 * - Remembers position across sessions
 * - Smooth hover and click expands into glassmorphic AI chat panel
 * - State preview pill selector for instant inspection of all 5 modes
 */
export default function FloatingAiAssistant({ go, page }) {
  // Hide if already on dedicated full chat page
  if (page === 'chat') return null;

  const widgetRef = useRef(null);
  const chatBottomRef = useRef(null);
  const inputRef = useRef(null);

  // Widget state
  const [isOpen, setIsOpen] = useState(false);
  const [orbState, setOrbState] = useState('idle'); // 'idle' | 'hover' | 'listening' | 'thinking' | 'speaking'
  const [isEdgeSnapped, setIsEdgeSnapped] = useState(false);
  const [snapSide, setSnapSide] = useState('right'); // 'left' | 'right'

  // Position & Drag state
  const [pos, setPos] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const posRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  const dragInfoRef = useRef({
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
    hasMoved: false,
    startTime: 0,
  });

  // Chat conversation state
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hello, I'm your AI Assistant 👋\nAsk anything, get help, explore ideas, or work on your projects.",
      time: 'Online',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const conversationIdRef = useRef(`orb-${Date.now()}`);

  // Calculate default bottom-right position
  const getDefaultPos = useCallback(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const orbWidth = isMobile ? 100 : 126;
    const padding = isMobile ? 16 : 28;
    return {
      x: Math.max(12, (window.innerWidth || 1200) - orbWidth - padding),
      y: Math.max(12, (window.innerHeight || 800) - orbWidth - padding),
    };
  }, []);

  // Initialize position from storage
  useEffect(() => {
    let initialPos = getDefaultPos();
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          typeof parsed.x === 'number' &&
          typeof parsed.y === 'number' &&
          parsed.x >= 0 &&
          parsed.x <= window.innerWidth - 60 &&
          parsed.y >= 0 &&
          parsed.y <= window.innerHeight - 60
        ) {
          initialPos = parsed;
        }
      }
    } catch {}

    posRef.current = initialPos;
    setPos(initialPos);

    if (initialPos.x < 35) {
      setIsEdgeSnapped(true);
      setSnapSide('left');
    } else if (initialPos.x > window.innerWidth - 145) {
      setIsEdgeSnapped(true);
      setSnapSide('right');
    }
  }, [getDefaultPos]);

  // Screen resize clamping
  useEffect(() => {
    const handleResize = () => {
      const orbDim = 120;
      const current = posRef.current;
      const clamped = {
        x: Math.min(Math.max(12, current.x), Math.max(12, window.innerWidth - orbDim - 12)),
        y: Math.min(Math.max(12, current.y), Math.max(12, window.innerHeight - orbDim - 12)),
      };
      posRef.current = clamped;
      setPos(clamped);
      if (widgetRef.current) {
        widgetRef.current.style.transform = `translate3d(${clamped.x}px, ${clamped.y}px, 0)`;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setOrbState('hover');
      setTimeout(() => inputRef.current?.focus(), 150);
    } else {
      setOrbState('idle');
    }
  }, [isOpen]);

  // ── Drag & Drop with Magnetic Edge Snapping ──
  const handlePointerDown = (e) => {
    if (e.target.closest('input, textarea, button, a')) return;
    if (e.button !== undefined && e.button !== 0) return;

    dragInfoRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: posRef.current.x,
      origY: posRef.current.y,
      hasMoved: false,
      startTime: Date.now(),
    };

    setIsDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;

    const dx = e.clientX - dragInfoRef.current.startX;
    const dy = e.clientY - dragInfoRef.current.startY;

    if (!dragInfoRef.current.hasMoved && Math.hypot(dx, dy) > 5) {
      dragInfoRef.current.hasMoved = true;
    }

    if (dragInfoRef.current.hasMoved) {
      const isMobile = window.innerWidth < 640;
      const width = isOpen ? (isMobile ? window.innerWidth - 32 : 560) : (isMobile ? 100 : 126);
      const height = isOpen ? 340 : 126;

      const newX = Math.min(
        Math.max(12, dragInfoRef.current.origX + dx),
        Math.max(12, window.innerWidth - width - 12)
      );
      const newY = Math.min(
        Math.max(12, dragInfoRef.current.origY + dy),
        Math.max(12, window.innerHeight - height - 12)
      );

      posRef.current = { x: newX, y: newY };

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (widgetRef.current) {
          widgetRef.current.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;
        }
      });
    }
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);

    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    } catch {}

    const wasDragging = dragInfoRef.current.hasMoved;

    if (wasDragging) {
      let finalX = posRef.current.x;
      let finalY = posRef.current.y;
      const isMobile = window.innerWidth < 640;
      const width = isOpen ? (isMobile ? window.innerWidth - 32 : 560) : 126;

      // Magnetic Edge Snapping (threshold 80px)
      const magneticThreshold = 80;
      if (finalX < magneticThreshold) {
        finalX = 14;
        setIsEdgeSnapped(true);
        setSnapSide('left');
      } else if (finalX > window.innerWidth - width - magneticThreshold) {
        finalX = window.innerWidth - width - 14;
        setIsEdgeSnapped(true);
        setSnapSide('right');
      } else {
        setIsEdgeSnapped(false);
      }

      const cleanPos = { x: finalX, y: finalY };
      posRef.current = cleanPos;
      setPos(cleanPos);

      if (widgetRef.current) {
        widgetRef.current.style.transform = `translate3d(${finalX}px, ${finalY}px, 0)`;
      }

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanPos));
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cleanPos));
      } catch {}
    } else {
      // Tap / Click on the Orb
      if (!isOpen) {
        setIsOpen(true);
      }
    }
  };

  // ── Chat Message Submission ──
  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputText).trim();
    if (!query || isSending) return;

    setInputText('');
    const newMsgList = [
      ...messages,
      {
        id: Date.now(),
        sender: 'user',
        text: query,
        time: 'Just now',
      },
    ];
    setMessages(newMsgList);
    setIsSending(true);

    // Orb State: Thinking
    setOrbState('thinking');

    try {
      const response = await sendMessage(query, conversationIdRef.current);
      const botReply =
        response?.reply ||
        response?.message ||
        "I'm here to answer any questions about degrees, scholarships, hostels, and academic curriculum!";

      // Orb State: Speaking
      setOrbState('speaking');

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: botReply,
          suggestions: response?.suggestions || [],
          time: 'Just now',
        },
      ]);

      // Return to hover after speaking animation completes
      setTimeout(() => {
        setOrbState('hover');
      }, 4500);
    } catch (err) {
      console.warn('AI Assistant query error:', err);
      setOrbState('idle');
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: "I couldn't fetch an online answer right now, but feel free to explore the Programs and Fee sections!",
          time: 'Just now',
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickChip = (chipLabel) => {
    const promptMap = {
      Code: 'What are the core coding languages and AI curriculum taught in B.Tech CSE?',
      Explain: 'Explain the LPUNEST 50% scholarship eligibility slabs and criteria.',
      Generate: 'Generate a summary of 1-Seater, 2-Seater, and 3-Seater AC hostel fee structures.',
      Summarize: 'Summarize the key admission deadlines and document verification checklist.',
      More: 'What facilities, placement records, and campus amenities are available at LPU?',
    };
    handleSendMessage(promptMap[chipLabel] || chipLabel);
  };

  if (!pos) return null;

  return (
    <div
      ref={widgetRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        willChange: 'transform',
        transition: isDragging ? 'none' : 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
        zIndex: 50,
        touchAction: 'none',
        userSelect: 'none',
      }}
      className="select-none"
    >
      {/* ── MODE 1: EXPANDED CHAT PANEL (Matches Reference Image Exactly) ── */}
      {isOpen ? (
        <div
          role="dialog"
          aria-label="AI Assistant"
          onClick={(e) => e.stopPropagation()}
          className="relative w-[calc(100vw-28px)] sm:w-[560px] max-w-[560px] flex flex-col rounded-3xl overflow-hidden
            bg-[#0B101B]/90 backdrop-blur-2xl border border-white/15
            shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_-5px_rgba(249,115,22,0.38)]
            text-white animate-scale-up"
        >
          {/* Subtle Orange Light Perimeter Inset Glow */}
          <div className="absolute inset-0 rounded-3xl pointer-events-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),inset_0_-1px_1px_rgba(249,115,22,0.4)]" />

          {/* Golden/Orange Wave Graphic in Background (Right side as in mockup) */}
          <div
            className="absolute top-0 right-0 w-64 h-36 opacity-35 pointer-events-none bg-no-repeat bg-contain"
            style={{
              backgroundImage:
                'radial-gradient(ellipse at 80% 20%, rgba(249,115,22,0.28) 0%, transparent 70%)',
            }}
          />

          {/* ── Header: Genuine 3D AI Orb + Title Pill + Window Controls ── */}
          <div className="p-4 sm:p-5 flex items-center justify-between shrink-0 relative z-10 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              {/* Genuine 3D Orb Avatar in Header */}
              <div className="relative w-12 h-12 -my-2 shrink-0 filter drop-shadow-[0_0_16px_rgba(249,115,22,0.55)]">
                <ThreeAiOrb
                  size={52}
                  state={orbState}
                  enableLookAt={false}
                />
              </div>

              {/* Pill: AI Assistant • Online */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.08] border border-white/15 backdrop-blur-md shadow-inner">
                <span className="text-orange-400 font-bold text-xs flex items-center gap-1.5">
                  <Sparkles size={12} className="text-orange-400 fill-orange-400" />
                  <span className="font-display tracking-tight text-white font-bold text-xs">
                    AI Assistant
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium pl-2 border-l border-white/15">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
              </div>
            </div>

            {/* Window buttons: Minus / Close */}
            <div className="flex items-center gap-1 text-slate-400">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Minimize"
              >
                <Minus size={15} />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                title="Close"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* ── Greeting Banner matching Mockup ── */}
          <div className="px-5 sm:px-6 pt-4 pb-2 relative z-10">
            <h2 className="text-lg sm:text-xl font-extrabold text-white font-display tracking-tight flex items-center gap-2">
              <span>Hello, I'm your AI Assistant</span>
              <span className="text-xl">👋</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Ask anything, get help, explore ideas, or work on your projects.
            </p>
          </div>

          {/* ── Messages Transcript Area ── */}
          <div className="max-h-56 overflow-y-auto px-5 sm:px-6 py-2 space-y-3 scrollbar-thin scrollbar-thumb-white/10 text-xs relative z-10">
            {messages.slice(1).map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-lg bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot size={13} />
                  </div>
                )}
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl leading-relaxed whitespace-pre-wrap break-words ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-tr-xs shadow-md shadow-orange-600/20'
                      : 'bg-white/[0.06] border border-white/10 text-slate-200 rounded-tl-xs backdrop-blur-md'
                  }`}
                >
                  <p>{m.text}</p>

                  {/* Suggestion Quick Chips */}
                  {m.suggestions && m.suggestions.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-white/10 flex flex-wrap gap-1.5">
                      {m.suggestions.map((sug, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSendMessage(sug)}
                          className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-orange-500/15 text-orange-300 border border-orange-500/30 hover:bg-orange-500/30 transition-all cursor-pointer"
                        >
                          {sug} →
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex gap-2 items-center text-slate-400 text-xs py-1">
                <div className="w-5 h-5 rounded-md bg-orange-500/20 text-orange-400 flex items-center justify-center">
                  <Sparkles size={11} className="animate-spin" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-[11px] text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-1 text-slate-400">Processing...</span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* ── Input Box (Pixel-matched to reference mockup) ── */}
          <div className="p-4 sm:p-5 pt-2 relative z-10 space-y-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative flex items-center rounded-2xl bg-white/[0.06] border border-white/15 focus-within:border-orange-500/60 focus-within:ring-1 focus-within:ring-orange-500/30 transition-all px-4 py-1.5 shadow-inner"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onFocus={() => setOrbState('listening')}
                onBlur={() => !isSending && setOrbState('hover')}
                placeholder="Ask me anything..."
                className="w-full bg-transparent py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
              />

              {/* Orange Circular Send Button */}
              <button
                type="submit"
                disabled={!inputText.trim() || isSending}
                className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 disabled:opacity-40 text-white flex items-center justify-center shadow-md shadow-orange-500/40 shrink-0 transition-transform active:scale-95 cursor-pointer ml-2"
                aria-label="Send"
              >
                <Send size={13} className="ml-0.5" />
              </button>
            </form>

            {/* ── Action Chips matching Mockup Exactly ── */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none text-[11px] pb-1">
              {[
                { label: 'Code', icon: 'code' },
                { label: 'Explain', icon: 'book' },
                { label: 'Generate', icon: 'sparkle' },
                { label: 'Summarize', icon: 'list' },
                { label: 'More', icon: 'more' },
              ].map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => handleQuickChip(chip.label)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 hover:border-orange-500/40 text-slate-300 hover:text-white transition-all whitespace-nowrap cursor-pointer active:scale-95"
                >
                  {chip.icon === 'code' && (
                    <span className="text-slate-400 font-mono text-[10px]">&lt;/&gt;</span>
                  )}
                  {chip.icon === 'book' && <FileText size={11} className="text-slate-400" />}
                  {chip.icon === 'sparkle' && <Sparkles size={11} className="text-orange-400" />}
                  {chip.icon === 'list' && <FileText size={11} className="text-slate-400" />}
                  {chip.icon === 'more' && <span className="text-slate-400 font-bold">•••</span>}
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ── MODE 2: GENUINE 3D FLOATING ROBOTIC ORB (Identical to Reference Image) ── */
        <div
          role="button"
          tabIndex={0}
          aria-label="Interactive 3D AI Orb Assistant"
          onMouseEnter={() => setOrbState('hover')}
          onMouseLeave={() => setOrbState('idle')}
          className={`relative group cursor-grab active:cursor-grabbing ${
            isDragging ? 'scale-105' : 'hover:scale-105'
          } transition-transform duration-200 select-none`}
        >
          {/* Edge Snap Vertical Neon Glow Bar (Shown in reference image bottom center) */}
          {isEdgeSnapped && (
            <div
              className={`absolute top-1/2 -translate-y-1/2 w-1.5 h-20 rounded-full bg-gradient-to-b from-orange-400 via-orange-500 to-amber-600 shadow-[0_0_20px_#FF6A00,0_0_35px_#FF8C00] pointer-events-none animate-pulse ${
                snapSide === 'left' ? '-left-2' : '-right-2'
              }`}
            />
          )}

          {/* Ambient Warm Under-Glow Aura behind 3D Orb */}
          <div
            className={`absolute inset-0 rounded-full transition-all duration-300 pointer-events-none ${
              orbState === 'hover'
                ? 'bg-gradient-to-r from-orange-600/55 via-amber-500/45 to-orange-500/55 blur-2xl scale-125'
                : 'bg-gradient-to-r from-orange-600/30 via-amber-500/25 to-orange-500/30 blur-xl'
            }`}
          />

          {/* The Genuine Three.js 3D WebGL Robotic Orb Canvas */}
          <div className="relative filter drop-shadow-[0_15px_30px_rgba(249,115,22,0.4)]">
            <ThreeAiOrb
              size={124}
              state={orbState}
              enableLookAt={true}
            />

            {/* Compact Mode Red Notification Dot at top-right (As in reference image) */}
            <span className="absolute top-2 right-2 flex h-3 w-3 pointer-events-none">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-gradient-to-tr from-orange-600 to-amber-500 border border-white/60 shadow-[0_0_8px_#FF6A00]" />
            </span>
          </div>

          {/* Discreet Hover Indicator Pill */}
          <div
            className="pointer-events-none absolute left-1/2 -bottom-3 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0
              px-2.5 py-0.5 rounded-full bg-slate-950/90 border border-orange-500/40 text-white text-[10px] font-bold tracking-tight whitespace-nowrap shadow-xl backdrop-blur-md flex items-center gap-1.5"
          >
            <Sparkles size={10} className="text-orange-400 fill-orange-400" />
            <span className="capitalize">{orbState} Mode • Click to Chat</span>
          </div>
        </div>
      )}
    </div>
  );
}
