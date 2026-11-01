import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, MessageSquare } from 'lucide-react';

const STORAGE_KEY = 'lpu_ai_assistant_pos';

export default function FloatingAiAssistant({ go, page }) {
  // If user is already on the full chat page, hide the floating button
  if (page === 'chat') return null;

  const buttonRef = useRef(null);
  const [pos, setPos] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragInfoRef = useRef({
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
    hasMoved: false,
  });

  // Calculate default bottom-right position
  const getDefaultPos = useCallback(() => {
    const btnWidth = 160;
    const btnHeight = 48;
    const padding = 24;
    return {
      x: Math.max(16, window.innerWidth - btnWidth - padding),
      y: Math.max(16, window.innerHeight - btnHeight - padding),
    };
  }, []);

  // Initialize position from sessionStorage or default to bottom-right
  useEffect(() => {
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
          setPos(parsed);
          return;
        }
      }
    } catch {}

    setPos(getDefaultPos());
  }, [getDefaultPos]);

  // Adjust position if window is resized to prevent off-screen drifting
  useEffect(() => {
    const handleResize = () => {
      setPos((prev) => {
        if (!prev) return getDefaultPos();
        const btnWidth = buttonRef.current?.offsetWidth || 160;
        const btnHeight = buttonRef.current?.offsetHeight || 48;
        return {
          x: Math.min(Math.max(12, prev.x), Math.max(12, window.innerWidth - btnWidth - 12)),
          y: Math.min(Math.max(12, prev.y), Math.max(12, window.innerHeight - btnHeight - 12)),
        };
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getDefaultPos]);

  // Pointer drag event handlers
  const handlePointerDown = (e) => {
    // Only primary mouse button or touch
    if (e.button !== undefined && e.button !== 0) return;

    const currentX = pos?.x ?? getDefaultPos().x;
    const currentY = pos?.y ?? getDefaultPos().y;

    dragInfoRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: currentX,
      origY: currentY,
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

      setPos({ x: newX, y: newY });
    }
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);

    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    } catch {}

    if (dragInfoRef.current.hasMoved) {
      // Save position to sessionStorage so it stays in same window
      if (pos) {
        try {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(pos));
        } catch {}
      }
    } else {
      // Was a click/tap without moving
      go('chat');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      go('chat');
    }
  };

  // If pos not yet calculated, don't flash
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
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        zIndex: 45,
        touchAction: 'none',
        userSelect: 'none',
      }}
      className={`group flex items-center gap-2.5 px-4 py-2.5 rounded-full font-bold text-xs sm:text-sm text-white shadow-2xl transition-all cursor-grab active:cursor-grabbing select-none backdrop-blur-md
        bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-500
        border border-white/20 shadow-[0_10px_30px_rgba(249,115,22,0.4)] hover:shadow-[0_12px_35px_rgba(249,115,22,0.55)]
        ${isDragging ? 'scale-105 shadow-2xl opacity-95' : 'hover:scale-[1.03]'}`}
    >
      {/* Glowing pulsating radar badge */}
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
      </span>

      {/* Sparkles Icon */}
      <div className="p-1 rounded-full bg-white/20 text-white group-hover:rotate-12 transition-transform duration-300">
        <Sparkles size={14} className="shrink-0" />
      </div>

      {/* Label */}
      <span className="tracking-tight whitespace-nowrap font-extrabold pr-0.5">
        AI Assistant
      </span>
    </div>
  );
}
