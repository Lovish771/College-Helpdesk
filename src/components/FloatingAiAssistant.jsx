import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Send, X, Minus, MessageSquare, Bot, ArrowRight,
  Maximize2, RotateCcw, Volume2, ShieldCheck, HelpCircle, FileText, CheckCircle2,
  ExternalLink, Layers, Wallet, Award, BedDouble, GraduationCap, UserCheck
} from 'lucide-react';
import ThreeAiOrb from './ThreeAiOrb';
import OrbAvatar from './OrbAvatar';
import { sendMessage } from '../api/chatbotApi';

const STORAGE_KEY = 'lpu_ai_orb_position_v3';

function renderBotText(raw) {
  if (!raw) return null;
  const lines = String(raw).split('\n');
  return (
    <div className="space-y-1.5 leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;
        if (/^-{3,}$/.test(trimmed)) {
          return <hr key={idx} className="border-slate-200 dark:border-slate-800 my-1.5" />;
        }
        const isHeading = /^#{1,4}\s+/.test(trimmed);
        const clean = trimmed.replace(/^#{1,4}\s+/, '').replace(/^[•\-]\s*/, '');
        const isBullet = !isHeading && (trimmed.startsWith('•') || trimmed.startsWith('- '));
        const parts = clean.split(/(\*\*.*?\*\*)/g).map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
            return <strong key={pIdx} className="font-bold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
          }
          return part;
        });
        if (isHeading) {
          return <p key={idx} className="font-bold text-slate-900 dark:text-white text-xs pt-1">{parts}</p>;
        }
        if (isBullet) {
          return (
            <div key={idx} className="flex items-start gap-1.5">
              <span className="text-orange-500 font-bold shrink-0">•</span>
              <span className="flex-1">{parts}</span>
            </div>
          );
        }
        return <p key={idx}>{parts}</p>;
      })}
    </div>
  );
}

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
  const panelRef = useRef(null);
  const chatBottomRef = useRef(null);
  const inputRef = useRef(null);

  // Widget state
  const [isOpen, setIsOpen] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);
  const [orbState, setOrbState] = useState('idle'); // 'idle' | 'hover' | 'listening' | 'thinking' | 'speaking'
  const [isEdgeSnapped, setIsEdgeSnapped] = useState(false);
  const [snapSide, setSnapSide] = useState('right'); // 'left' | 'right'

  // Free-stretch size & draggable position for open chat box
  const [panelDim, setPanelDim] = useState({ w: 420, h: 460 });
  const [panelPos, setPanelPos] = useState({ x: 20, y: 80 });
  const closeTimerRef = useRef(null);

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
      text: "Hello! I'm your Student Helpdesk Assistant 👋\nAsk me anything about programmes, semester fees, scholarships, or hostel life.",
      time: 'Just now',
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

  const hasCustomPosRef = useRef(false);

  // Initialize position (always start in bottom-right corner)
  useEffect(() => {
    const initialPos = getDefaultPos();
    posRef.current = initialPos;
    setPos(initialPos);
  }, [getDefaultPos]);

  // Screen resize: stay anchored to bottom-right if not manually dragged, otherwise clamp
  useEffect(() => {
    const handleResize = () => {
      const next = hasCustomPosRef.current
        ? {
            x: Math.min(Math.max(12, posRef.current.x), Math.max(12, window.innerWidth - 132)),
            y: Math.min(Math.max(12, posRef.current.y), Math.max(12, window.innerHeight - 132)),
          }
        : getDefaultPos();
      posRef.current = next;
      setPos(next);
      if (widgetRef.current) {
        widgetRef.current.style.transform = `translate3d(${next.x}px, ${next.y}px, 0)`;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getDefaultPos]);

  // Open / close with smooth 60fps transition
  const openPanel = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
    const w = Math.min(Math.max(310, panelDim.w), vw - 24);
    const h = Math.min(Math.max(300, panelDim.h), vh - 96);
    const x = Math.max(12, vw - w - 20);
    const y = Math.max(76, vh - h - 20);
    setPanelDim({ w, h });
    setPanelPos({ x, y });
    setIsOpen(true);
    setPanelVisible(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setPanelVisible(true));
    });
  }, [panelDim.w, panelDim.h]);

  const closePanel = useCallback(() => {
    setPanelVisible(false);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
      closeTimerRef.current = null;
    }, 220);
  }, []);

  // Click outside to minimize
  useEffect(() => {
    if (!isOpen) return;
    const handleOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target) && (!widgetRef.current || !widgetRef.current.contains(e.target))) {
        closePanel();
      }
    };
    document.addEventListener('pointerdown', handleOutside);
    return () => document.removeEventListener('pointerdown', handleOutside);
  }, [isOpen, closePanel]);

  // Free-move drag for open panel header
  const startPanelDrag = (e) => {
    if (e.target.closest('button, input, textarea, a')) return;
    if (e.button !== undefined && e.button !== 0) return;
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const origX = panelPos.x;
    const origY = panelPos.y;

    const onMove = (ev) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const nx = Math.min(Math.max(12, origX + (ev.clientX - startX)), Math.max(12, vw - panelDim.w - 12));
      const ny = Math.min(Math.max(72, origY + (ev.clientY - startY)), Math.max(72, vh - panelDim.h - 12));
      setPanelPos({ x: nx, y: ny });
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  // Free-stretch resize from any edge or corner
  const startPanelResize = (dir) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const orig = { x: panelPos.x, y: panelPos.y, w: panelDim.w, h: panelDim.h };

    const onMove = (ev) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let { x, y, w, h } = orig;

      if (dir.includes('e')) {
        w = Math.min(Math.max(310, orig.w + dx), vw - orig.x - 12);
      }
      if (dir.includes('s')) {
        h = Math.min(Math.max(290, orig.h + dy), vh - orig.y - 12);
      }
      if (dir.includes('w')) {
        const nextW = Math.min(Math.max(310, orig.w - dx), orig.x + orig.w - 12);
        x = orig.x + (orig.w - nextW);
        w = nextW;
      }
      if (dir.includes('n')) {
        const nextH = Math.min(Math.max(290, orig.h - dy), orig.y + orig.h - 72);
        y = orig.y + (orig.h - nextH);
        h = nextH;
      }

      setPanelPos({ x, y });
      setPanelDim({ w, h });
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

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
        openPanel();
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
      Fees: 'What are the semester tuition fee structures and examination charges at LPU?',
      Scholarships: 'How do the LPUNEST Category 1, 2, and 3 scholarship fee concessions work?',
      Hostels: 'What are the 1-seater, 2-seater, 3-seater, and 4-seater AC hostel tariffs and mess charges?',
      'B.Tech CSE': 'What specializations, eligibility, and curriculum tracks are offered in B.Tech CSE?',
      Admissions: 'What are the key steps, documents required, and deadlines for LPU admission?',
    };
    handleSendMessage(promptMap[chipLabel] || chipLabel);
  };

  if (!pos) return null;

  return (
    <>
      {isOpen ? (
        /* ── MODE 1: FREELY MOVABLE & STRETCHABLE CHAT PANEL ── */
        <div
          ref={panelRef}
          role="dialog"
          aria-label="AI Assistant"
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'fixed',
            left: `${panelPos.x}px`,
            top: `${panelPos.y}px`,
            width: `${panelDim.w}px`,
            height: `${panelDim.h}px`,
            zIndex: 55,
            transformOrigin: 'bottom right',
            transform: panelVisible ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(14px)',
            opacity: panelVisible ? 1 : 0,
            transition: 'transform 220ms cubic-bezier(0.16, 1, 0.3, 1), opacity 180ms ease',
          }}
          className="flex flex-col rounded-3xl overflow-hidden select-none
            bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800
            shadow-[0_24px_60px_-15px_rgba(15,23,42,0.22)] dark:shadow-[0_24px_60px_-15px_rgba(0,0,0,0.85)]
            text-slate-800 dark:text-slate-100"
        >
          {/* Free-stretch edge & corner resize handles */}
          <div onPointerDown={startPanelResize('n')} className="absolute inset-x-3 top-0 h-1.5 cursor-ns-resize z-30" />
          <div onPointerDown={startPanelResize('s')} className="absolute inset-x-3 bottom-0 h-1.5 cursor-ns-resize z-30" />
          <div onPointerDown={startPanelResize('w')} className="absolute inset-y-3 left-0 w-1.5 cursor-ew-resize z-30" />
          <div onPointerDown={startPanelResize('e')} className="absolute inset-y-3 right-0 w-1.5 cursor-ew-resize z-30" />
          <div onPointerDown={startPanelResize('nw')} className="absolute top-0 left-0 w-3.5 h-3.5 cursor-nwse-resize z-30" />
          <div onPointerDown={startPanelResize('ne')} className="absolute top-0 right-0 w-3.5 h-3.5 cursor-nesw-resize z-30" />
          <div onPointerDown={startPanelResize('sw')} className="absolute bottom-0 left-0 w-3.5 h-3.5 cursor-nesw-resize z-30" />
          <div onPointerDown={startPanelResize('se')} className="absolute bottom-0 right-0 w-3.5 h-3.5 cursor-nwse-resize z-30" />

          {/* ── Draggable Header: 3D AI Orb + Title + Window Controls ── */}
          <div
            onPointerDown={startPanelDrag}
            className="px-4 py-3 flex items-center justify-between shrink-0 relative z-10 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 cursor-grab active:cursor-grabbing"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative w-10 h-10 -my-1 shrink-0">
                <ThreeAiOrb
                  size={44}
                  state={orbState}
                  enableLookAt={false}
                />
              </div>

              <div className="min-w-0">
                <span className="font-display tracking-tight text-slate-900 dark:text-white font-bold text-sm block truncate">
                  Student Helpdesk
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  Student Helpdesk Assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 shrink-0">
              {go && (
                <button
                  type="button"
                  onClick={() => {
                    closePanel();
                    go('chat');
                  }}
                  className="p-1.5 rounded-lg hover:text-orange-600 dark:hover:text-orange-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Open full chat"
                >
                  <Maximize2 size={14} />
                </button>
              )}
              <button
                type="button"
                onClick={closePanel}
                className="p-1.5 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Minimize"
              >
                <Minus size={15} />
              </button>
              <button
                type="button"
                onClick={closePanel}
                className="p-1.5 rounded-lg hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                title="Close"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* ── Messages Transcript Area ── */}
          <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3.5 space-y-3 text-xs relative z-10 bg-[#F8FAFC]/60 dark:bg-slate-950/40 select-text">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <OrbAvatar size={28} className="mt-0.5" />
                )}
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl leading-relaxed break-words ${
                    m.sender === 'user'
                      ? 'bg-orange-600 text-white rounded-tr-xs shadow-xs font-medium'
                      : 'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-xs shadow-2xs'
                  }`}
                >
                  {m.sender === 'bot' ? renderBotText(m.text) : <p className="whitespace-pre-wrap">{m.text}</p>}

                  {m.suggestions && m.suggestions.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1.5">
                      {m.suggestions.map((sug, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSendMessage(sug)}
                          className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800/60 hover:bg-orange-100 dark:hover:bg-orange-900/60 transition-all cursor-pointer"
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
              <div className="flex gap-2 items-center text-slate-500 dark:text-slate-400 text-xs py-1">
                <OrbAvatar size={26} className="animate-pulse" />
                <div className="flex items-center gap-2 px-3 py-2 rounded-2xl rounded-tl-xs bg-white dark:bg-slate-900 border border-orange-200/70 dark:border-orange-900/50 text-[11px] shadow-2xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">Thinking</span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce [animation-delay:0.4s]" />
                  </span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* ── Input Box & Quick Chips ── */}
          <div className="p-3.5 relative z-10 space-y-2.5 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative flex items-center rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all px-3 py-1"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onFocus={() => setOrbState('listening')}
                onBlur={() => !isSending && setOrbState('hover')}
                placeholder="Ask about fees, courses, hostels, scholarships..."
                className="w-full bg-transparent py-2 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
              />

              <button
                type="submit"
                disabled={!inputText.trim() || isSending}
                className="w-7 h-7 rounded-lg bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white flex items-center justify-center shadow-xs shrink-0 transition-transform active:scale-95 cursor-pointer ml-2"
                aria-label="Send"
              >
                <Send size={13} />
              </button>
            </form>

            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
              {[
                { label: 'Fees', icon: Wallet },
                { label: 'Scholarships', icon: Award },
                { label: 'Hostels', icon: BedDouble },
                { label: 'B.Tech CSE', icon: GraduationCap },
                { label: 'Admissions', icon: UserCheck },
              ].map(({ label, icon: ChipIcon }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleQuickChip(label)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-950/40 border border-slate-200/80 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-700 text-slate-600 dark:text-slate-300 hover:text-orange-700 dark:hover:text-orange-300 transition-all whitespace-nowrap cursor-pointer active:scale-95"
                >
                  <ChipIcon size={11} className="text-orange-500" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ── MODE 2: PURE 3D FLOATING ROBOTIC ORB ONLY ── */
        <div
          ref={widgetRef}
          role="button"
          tabIndex={0}
          aria-label="AI Assistant"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onMouseEnter={() => setOrbState('hover')}
          onMouseLeave={() => setOrbState('idle')}
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
            willChange: 'transform',
            transition: isDragging ? 'none' : 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
            zIndex: 40,
            touchAction: 'none',
            userSelect: 'none',
          }}
          className={`relative group cursor-grab active:cursor-grabbing ${
            isDragging ? 'scale-105' : 'hover:scale-105'
          } transition-transform duration-200 select-none`}
        >
          <div className="relative filter drop-shadow-[0_12px_24px_rgba(15,23,42,0.18)] dark:drop-shadow-[0_12px_24px_rgba(249,115,22,0.28)]">
            <ThreeAiOrb
              size={116}
              state={orbState}
              enableLookAt={true}
            />
          </div>
        </div>
      )}
    </>
  );
}
