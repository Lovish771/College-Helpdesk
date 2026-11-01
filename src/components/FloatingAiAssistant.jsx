import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles } from 'lucide-react';

const STORAGE_KEY = 'lpu_ai_assistant_pos';

export default function FloatingAiAssistant({ go, page }) {
  // If user is already on the full chat page, hide the floating button
  if (page === 'chat') return null;

  const buttonRef = useRef(null);
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
  });

  // Calculate default bottom-right position (compact on phones)
  const getDefaultPos = useCallback(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const btnWidth = isMobile ? 130 : 160;
    const btnHeight = isMobile ? 42 : 48;
    const padding = isMobile ? 14 : 24;
    return {
      x: Math.max(10, window.innerWidth - btnWidth - padding),
      y: Math.max(10, window.innerHeight - btnHeight - padding),
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
          parsed.y <= window.innerHeight - 40
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
      const btnWidth = buttonRef.current?.offsetWidth || 160;
      const btnHeight = buttonRef.current?.offsetHeight || 48;
      const current = posRef.current;
      const clamped = {
        x: Math.min(Math.max(12, current.x), Math.max(12, window.innerWidth - btnWidth - 12)),
        y: Math.min(Math.max(12, current.y), Math.max(12, window.innerHeight - btnHeight - 12)),
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

  // Direct 60/120fps hardware-accelerated pointer drag handlers
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

    if (!dragInfoRef.current.hasMoved && Math.hypot(dx, dy) > 3) {
      dragInfoRef.current.hasMoved = true;
    }

    if (dragInfoRef.current.hasMoved) {
      const btnWidth = buttonRef.current?.offsetWidth || 160;
      const btnHeight = buttonRef.current?.offsetHeight || 48;

      const newX = Math.min(
        Math.max(12, dragInfoRef.current.origX + dx),
        window.innerWidth - btnWidth - 12
      );
      const newY = Math.min(
        Math.max(12, dragInfoRef.current.origY + dy),
        window.innerHeight - btnHeight - 12
      );

      posRef.current = { x: newX, y: newY };

      // Instantaneous hardware-accelerated transformation with zero React render delay
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
      // Direct click/tap without drag
      go('chat');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      go('chat');
    }
  };

  if (!pos) return null;

  return (
    <div
      ref={buttonRef}
      role="button"
      tabIndex={0}
      aria-label="Open AI Helpdesk Assistant (Drag to move)"
      title="Open AI Assistant • Drag to reposition"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onKeyDown={handleKeyDown}
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
      className={`group flex items-center gap-2 sm:gap-2.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm text-white select-none backdrop-blur-md
        bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-500
        border border-white/20 shadow-[0_10px_30px_rgba(249,115,22,0.4)] hover:shadow-[0_12px_35px_rgba(249,115,22,0.55)]
        ${isDragging ? 'cursor-grabbing scale-105 shadow-2xl opacity-95' : 'cursor-grab hover:scale-[1.03]'}`}
    >
      {/* Glowing pulsating radar badge */}
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
      </span>

      {/* Sparkles Icon */}
      <div className="p-1 rounded-full bg-white/20 text-white group-hover:rotate-12 transition-transform duration-200">
        <Sparkles size={14} className="shrink-0" />
      </div>

      {/* Label */}
      <span className="tracking-tight whitespace-nowrap font-extrabold pr-0.5">
        AI Assistant
      </span>
    </div>
  );
}
