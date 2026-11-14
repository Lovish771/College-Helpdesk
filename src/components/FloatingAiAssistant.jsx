import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X, Maximize2, Send, MessageSquare, ChevronRight,
  HelpCircle, ArrowUpRight, Zap, Bot
} from 'lucide-react';
import LpuLogo from './LpuLogo';
import { sendMessage } from '../api/chatbotApi';

const STORAGE_KEY = 'lpu_ai_assistant_pos';

/**
 * Format markdown bold, bullets, and strip unwanted raw code fences or JSON
 */
function FormatMiniMessage({ text }) {
  if (!text) return null;

  // Clean out any raw json or markdown code fences that might leak
  let cleanText = text
    .replace(/```[a-z]*\n[\s\S]*?```/gi, '')
    .replace(/^```[a-z]*/gim, '')
    .replace(/```$/gim, '')
    .trim();

  // If text looks like a raw JSON object string, extract the message/reply if possible
  if (cleanText.startsWith('{') && cleanText.endsWith('}')) {
    try {
      const parsed = JSON.parse(cleanText);
      cleanText = parsed.reply || parsed.text || parsed.message || cleanText;
    } catch {}
  }

  const lines = cleanText.split('\n');

  return (
    <div className="space-y-1.5 leading-relaxed font-sans text-xs">
      {lines.map((line, idx) => {
        if (!line.trim()) return <div key={idx} className="h-1" />;
        const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
        const content = isBullet ? line.trim().replace(/^[•\-]\s*/, '') : line;

        const parts = content.split(/(\*\*.*?\*\*)/g);
        const rendered = parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={pIdx} className="font-bold text-slate-900 dark:text-white">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        });

        if (isBullet) {
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-1">
              <span className="text-orange-500 font-bold shrink-0 mt-0.5">•</span>
              <span className="flex-1">{rendered}</span>
            </div>
          );
        }

        return <p key={idx}>{rendered}</p>;
      })}
    </div>
  );
}

export default function FloatingAiAssistant({ go, page, ask, chat }) {
  // If user is already on the dedicated chat page, hide the floating widget
  if (page === 'chat') return null;

  const buttonRef = useRef(null);
  const [pos, setPos] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [miniMessages, setMiniMessages] = useState([
    {
      id: 'welcome',
      role: 'bot',
      text: 'Hey! Hi, can I help you today? Ask me anything about fees, hostel rooms, LPUNEST scholarships, or attendance rules!'
    }
  ]);
  const [sending, setSending] = useState(false);
  const chatBottomRef = useRef(null);
  const inputRef = useRef(null);

  const posRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  const dragInfoRef = useRef({
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
    hasMoved: false,
  });

  // Calculate default bottom-right position
  const getDefaultPos = useCallback(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const btnWidth = isMobile ? 54 : 60;
    const btnHeight = isMobile ? 54 : 60;
    const padding = isMobile ? 16 : 24;
    return {
      x: Math.max(12, window.innerWidth - btnWidth - padding),
      y: Math.max(12, window.innerHeight - btnHeight - padding),
    };
  }, []);

  // Initialize position from sessionStorage or default to bottom-right
  useEffect(() => {
    let initialPos = getDefaultPos();
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
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
  }, [getDefaultPos]);

  // Adjust position if window is resized to prevent off-screen drifting
  useEffect(() => {
    const handleResize = () => {
      const btnSize = 60;
      const current = posRef.current;
      const clamped = {
        x: Math.min(Math.max(12, current.x), Math.max(12, window.innerWidth - btnSize - 12)),
        y: Math.min(Math.max(12, current.y), Math.max(12, window.innerHeight - btnSize - 12)),
      };
      posRef.current = clamped;
      setPos(clamped);
      if (buttonRef.current) {
        buttonRef.current.style.transform = `translate3d(${clamped.x}px, ${clamped.y}px, 0)`;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll mini-chat to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [miniMessages, isOpen]);

  // Direct pointer drag handlers
  const handlePointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;

    dragInfoRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: posRef.current.x,
      origY: posRef.current.y,
      hasMoved: false,
    };

    setIsDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;

    const dx = e.clientX - dragInfoRef.current.startX;
    const dy = e.clientY - dragInfoRef.current.startY;

    if (!dragInfoRef.current.hasMoved && Math.hypot(dx, dy) > 4) {
      dragInfoRef.current.hasMoved = true;
    }

    if (dragInfoRef.current.hasMoved) {
      const btnSize = 60;
      const newX = Math.min(
        Math.max(12, dragInfoRef.current.origX + dx),
        window.innerWidth - btnSize - 12
      );
      const newY = Math.min(
        Math.max(12, dragInfoRef.current.origY + dy),
        window.innerHeight - btnSize - 12
      );

      posRef.current = { x: newX, y: newY };

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (buttonRef.current) {
          buttonRef.current.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;
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

    if (dragInfoRef.current.hasMoved) {
      const finalPos = posRef.current;
      setPos(finalPos);
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(finalPos));
      } catch {}
    } else {
      // Direct click toggles the mini writing/chat window
      setIsOpen((prev) => !prev);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // Send message from mini-chat
  const handleSend = async (textToSend) => {
    const q = (textToSend || inputVal).trim();
    if (!q || sending) return;

    setInputVal('');
    const userMsg = { id: `u-${Date.now()}`, role: 'user', text: q };
    setMiniMessages((prev) => [...prev, userMsg]);
    setSending(true);

    try {
      const res = await sendMessage(q);
      if (res && res.reply) {
        setMiniMessages((prev) => [
          ...prev,
          { id: `b-${Date.now()}`, role: 'bot', text: res.reply }
        ]);
      } else {
        setMiniMessages((prev) => [
          ...prev,
          {
            id: `b-${Date.now()}`,
            role: 'bot',
            text: 'I can help you with LPU programmes, fee structures, eligibility, and scholarships. Click "Open dedicated AI area" below for full breakdown tables!'
          }
        ]);
      }
    } catch (err) {
      setMiniMessages((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          role: 'bot',
          text: 'Thank you for reaching out! You can open the dedicated AI helpdesk area for comprehensive details.'
        }
      ]);
    } finally {
      setSending(false);
    }
  };

  const openDedicatedChat = (initialQuery) => {
    setIsOpen(false);
    if (initialQuery && ask) {
      ask(initialQuery);
    } else {
      go('chat');
    }
  };

  if (!pos) return null;

  // Smart responsive window positioning to never open outside visible screen
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const modalWidth = isMobile ? Math.min(360, window.innerWidth - 24) : 380;
  const modalHeight = isMobile ? 480 : 520;

  // Compute position relative to screen bounds
  let modalLeft = pos.x - modalWidth + 60;
  if (modalLeft < 12) modalLeft = 12;
  if (modalLeft + modalWidth > window.innerWidth - 12) {
    modalLeft = window.innerWidth - modalWidth - 12;
  }

  let modalTop = pos.y - modalHeight - 12;
  if (modalTop < 60) {
    // If not enough room on top, open below the robot
    modalTop = pos.y + 70;
    if (modalTop + modalHeight > window.innerHeight - 12) {
      modalTop = Math.max(60, window.innerHeight - modalHeight - 12);
    }
  }

  return (
    <>
      {/* ── TRANSLUCENT SPEECH BUBBLE CLOUD (HOVER ONLY) ── */}
      {isHovered && !isOpen && !isDragging && (
        <div
          style={{
            position: 'fixed',
            left: Math.max(12, Math.min(window.innerWidth - 280, pos.x - 110)),
            top: Math.max(12, pos.y - 82),
            zIndex: 46,
            pointerEvents: 'none',
          }}
          className="animate-scale-up"
        >
          <div className="relative px-4 py-2.5 rounded-2xl backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border border-orange-200/80 dark:border-orange-500/30 shadow-[0_10px_25px_-5px_rgba(249,115,22,0.3)] text-slate-800 dark:text-slate-100 min-w-[220px]">
            <p className="text-xs font-bold flex items-center gap-1.5 text-orange-600 dark:text-orange-400">
              <span>Hey! Hi, can I help you today?</span>
              <span>👋</span>
            </p>
            <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
              Have any query? Ask me!
            </p>
            {/* Triangular cloud pointer */}
            <div className="absolute -bottom-1.5 right-12 w-3 h-3 rotate-45 bg-white dark:bg-slate-900 border-r border-b border-orange-200/80 dark:border-orange-500/30" />
          </div>
        </div>
      )}

      {/* ── FLOATING 3D ROBOT ASSISTANT BUTTON ── */}
      <div
        ref={buttonRef}
        role="button"
        tabIndex={0}
        aria-label="Open AI Helpdesk Assistant"
        title="Open AI Assistant • Drag to reposition"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
          willChange: 'transform',
          transition: isDragging ? 'none' : 'transform 0.12s cubic-bezier(0.2, 0.8, 0.2, 1)',
          zIndex: 45,
          touchAction: 'none',
          userSelect: 'none',
        }}
        className={`group flex items-center justify-center w-14 h-14 sm:w-15 sm:h-15 rounded-full select-none backdrop-blur-xl
          bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-500
          border-2 border-white/60 dark:border-white/20
          shadow-[0_10px_30px_rgba(249,115,22,0.5)] hover:shadow-[0_15px_40px_rgba(249,115,22,0.7)]
          ${isDragging ? 'cursor-grabbing scale-110 shadow-2xl' : 'cursor-grab hover:scale-105 active:scale-95'}`}
      >
        {/* Pulsing outer aura ring */}
        <span className="absolute -inset-1 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 opacity-40 blur-xs animate-pulse" />

        {/* Robot Icon */}
        <div className="relative z-10 flex items-center justify-center text-white">
          <Bot size={28} className="group-hover:rotate-6 transition-transform duration-200" />
        </div>

        {/* Status radar indicator badge */}
        <span className="absolute top-0.5 right-0.5 flex h-3 w-3 z-20">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white dark:border-slate-900" />
        </span>
      </div>

      {/* ── RESPONSIVE FLOATING MINI-CHAT & WRITING WINDOW ── */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            left: modalLeft,
            top: modalTop,
            width: modalWidth,
            height: modalHeight,
            zIndex: 50,
          }}
          className="flex flex-col rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.25)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden animate-scale-up"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-xs">
                <Bot size={17} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  LPU Student Helpdesk AI
                </h3>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Online • Instant Answers
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Button to open dedicated full AI area */}
              <button
                type="button"
                onClick={() => openDedicatedChat()}
                title="Open Dedicated Full-Screen AI Area"
                className="p-1.5 rounded-xl text-slate-500 hover:text-orange-600 dark:text-slate-400 dark:hover:text-orange-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Expand to dedicated chat page"
              >
                <Maximize2 size={15} />
              </button>

              {/* Close / Minimize */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close assistant"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {miniMessages.map((m) => {
              const isBot = m.role === 'bot';
              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-2 ${isBot ? 'justify-start' : 'justify-end'}`}
                >
                  {isBot && (
                    <div className="shrink-0 mt-0.5">
                      <LpuLogo size={22} variant="light" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed font-medium ${
                      isBot
                        ? 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60'
                        : 'bg-orange-600 text-white shadow-xs'
                    }`}
                  >
                    {isBot ? <FormatMiniMessage text={m.text} /> : m.text}
                  </div>
                </div>
              );
            })}

            {sending && (
              <div className="flex items-center gap-2 text-slate-400 text-xs pl-8">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                <span>Thinking...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="px-3 pt-2 pb-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-t border-slate-100 dark:border-slate-800/80">
            {[
              'B.Tech CSE Fee',
              'Hostel 2-Seater AC',
              'LPUNEST Slabs',
              '75% Attendance'
            ].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleSend(chip)}
                className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/60 hover:bg-orange-50 dark:hover:bg-orange-950/40 text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 text-[11px] font-semibold border border-slate-200/70 dark:border-slate-700 whitespace-nowrap transition-colors cursor-pointer shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Writing Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-slate-900"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask any question..."
              className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 px-3.5 py-2 rounded-xl text-xs outline-none focus:ring-1 focus:ring-orange-500"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || sending}
              className="p-2 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold transition-all cursor-pointer shrink-0"
              aria-label="Send message"
            >
              <Send size={14} />
            </button>
          </form>

          {/* Bottom Link to Dedicated AI Area */}
          <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-center">
            <button
              type="button"
              onClick={() => openDedicatedChat()}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer"
            >
              <span>Open in dedicated full-screen AI chat area</span>
              <ArrowUpRight size={12} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
