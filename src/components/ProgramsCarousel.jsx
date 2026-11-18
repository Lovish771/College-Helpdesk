import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Pause, Play, Compass } from 'lucide-react';
import ProgramCard from './ProgramCard';
import { getDegreeTheme, getMainDegree } from '../utils/degreeUtils';

/**
 * ProgramsCarousel: Clean, Premium 3D-Uplifted Horizontal Carousel
 * - No cluttered '<' and '>' buttons (clean swipe & card-click navigation)
 * - Autoplay strictly set to 5 seconds per card
 * - Exactly 3 clean pagination dots below the visible cards
 * - 60 FPS GPU-accelerated smooth transforms (translate3d, scale)
 * - Premium 3D depth and soft elevation on the active center card
 */
export default function ProgramsCarousel({
  programs = [],
  onView,
  onAsk,
  onCompare,
  compareQueue = [],
}) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  const [containerWidth, setContainerWidth] = useState(1200);
  const [isHovered, setIsHovered] = useState(false);
  const [isPausedManually, setIsPausedManually] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Dynamically observe container width
  useEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const N = programs.length;

  // Responsive card dimension calculations
  const { cardWidth, gap } = useMemo(() => {
    if (containerWidth < 640) {
      return { cardWidth: Math.min(320, containerWidth - 48), gap: 16 };
    }
    if (containerWidth < 1024) {
      return { cardWidth: 350, gap: 24 };
    }
    return { cardWidth: 380, gap: 28 };
  }, [containerWidth]);

  const stepSize = cardWidth + gap;

  // Multiple cycles to ensure infinite looping without edge boundaries
  const repeatCount = useMemo(() => {
    if (N <= 1) return 1;
    const needed = Math.max(7, Math.ceil(35 / N));
    return needed % 2 === 0 ? needed + 1 : needed;
  }, [N]);

  const middleCycle = Math.floor(repeatCount / 2);
  const baseIndex = middleCycle * N;

  const [currentIndex, setCurrentIndex] = useState(baseIndex);

  // Reset index when program list changes
  useEffect(() => {
    setCurrentIndex(baseIndex);
    setIsTransitioning(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsTransitioning(true);
      });
    });
  }, [baseIndex, N]);

  // Track cloned items array
  const trackItems = useMemo(() => {
    if (N === 0) return [];
    const items = [];
    for (let r = 0; r < repeatCount; r++) {
      for (let i = 0; i < N; i++) {
        items.push({
          program: programs[i],
          cycle: r,
          originalIndex: i,
          virtualId: `${r}-${programs[i].id}-${i}`,
        });
      }
    }
    return items;
  }, [programs, repeatCount, N]);

  // Normalized active original index
  const activeNormalizedIndex = N > 0 ? ((currentIndex % N) + N) % N : 0;

  // Active dot index out of 3 total visible dots
  const activeDotIndex = activeNormalizedIndex % 3;

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (N <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, [N]);

  const handlePrev = useCallback(() => {
    if (N <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  }, [N]);

  // Jump to specific 3-dot group
  const handleJumpToDot = useCallback((dotTargetIndex) => {
    if (N <= 1) return;
    setIsTransitioning(true);
    const currentDot = activeNormalizedIndex % 3;
    const diff = dotTargetIndex - currentDot;
    setCurrentIndex((prev) => prev + diff);
  }, [activeNormalizedIndex, N]);

  // Clicking any card smoothly slides that card into the center!
  const handleCardClick = useCallback((targetTrackIndex) => {
    if (hasDraggedRef.current) return;
    if (targetTrackIndex !== currentIndex) {
      setIsTransitioning(true);
      setCurrentIndex(targetTrackIndex);
    }
  }, [currentIndex]);

  // Seamless cycle wrap when reaching boundaries
  const handleTransitionEnd = useCallback((e) => {
    if (e.target !== trackRef.current || e.propertyName !== 'transform') return;
    if (N <= 1) return;

    const norm = ((currentIndex % N) + N) % N;
    const safeIndex = baseIndex + norm;

    if (currentIndex !== safeIndex) {
      setIsTransitioning(false);
      setCurrentIndex(safeIndex);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      });
    }
  }, [currentIndex, N, baseIndex]);

  // Autoplay strictly set to 5 SECONDS per card (per user requirement)
  useEffect(() => {
    if (
      prefersReducedMotion ||
      isHovered ||
      isDragging ||
      isPausedManually ||
      N <= 1
    ) {
      return;
    }
    const timer = setInterval(() => {
      handleNext();
    }, 5000); // Exactly 5 seconds
    return () => clearInterval(timer);
  }, [
    prefersReducedMotion,
    isHovered,
    isDragging,
    isPausedManually,
    N,
    handleNext,
  ]);

  // Pointer dragging & touch swiping
  const pointerStartRef = useRef({ x: 0, y: 0, time: 0 });
  const hasDraggedRef = useRef(false);

  const handlePointerDown = (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    hasDraggedRef.current = false;
    pointerStartRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
    setIsDragging(true);
    setIsTransitioning(false);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - pointerStartRef.current.x;
    if (Math.abs(deltaX) > 6 || hasDraggedRef.current) {
      hasDraggedRef.current = true;
      setDragOffset(deltaX);
    }
  };

  const handlePointerEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const endDeltaX = dragOffset;
    const deltaTime = Date.now() - pointerStartRef.current.time;
    const velocity = Math.abs(endDeltaX) / (deltaTime || 1);

    setIsTransitioning(true);
    setDragOffset(0);

    // Swipe threshold: 40px or high-velocity flick
    if (Math.abs(endDeltaX) > 40 || velocity > 0.4) {
      if (endDeltaX < 0) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setCurrentIndex((prev) => prev - 1);
      }
    }

    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 120);
  };

  // Keyboard left/right arrow controls
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  const handleClickCapture = (e) => {
    if (hasDraggedRef.current) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  // Center coordinate math: puts active card exactly in center
  const translateX =
    containerWidth / 2 - cardWidth / 2 - currentIndex * stepSize + dragOffset;

  if (N === 0) return null;

  return (
    <section
      ref={containerRef}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={0}
      aria-label="Flagship Programmes Carousel"
      className="relative w-full select-none outline-none py-4 sm:py-6 overflow-hidden transition-colors"
    >
      {/* ── Top Bar with Clean Status & Autoplay Toggle ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-4 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-xs uppercase tracking-wider text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60 px-3 py-1 rounded-full border border-orange-200 dark:border-orange-800/60">
            Featured Programmes
          </span>
          <span className="text-slate-400 dark:text-slate-500 font-medium hidden sm:inline">
            Swipe or click any card to center
          </span>
        </div>

        {/* Autoplay Pause / Resume toggle button */}
        <button
          type="button"
          onClick={() => setIsPausedManually((p) => !p)}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
          title={isPausedManually ? 'Resume automatic sliding' : 'Pause automatic sliding'}
        >
          {isPausedManually ? (
            <>
              <Play size={11} className="text-orange-500 fill-orange-500" />
              <span>Resume (5s)</span>
            </>
          ) : (
            <>
              <Pause size={11} className="text-orange-500" />
              <span>Autoplay (5s)</span>
            </>
          )}
        </button>
      </div>

      {/* ── Main Sliding Viewport Container (Arrows '<' and '>' Removed) ── */}
      <div
        className="relative w-full py-4 overflow-hidden cursor-grab active:cursor-grabbing touch-pan-y"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onClickCapture={handleClickCapture}
      >
        {/* Soft Ambient Left Gradient Fade */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-28 z-20 bg-gradient-to-r from-[#F8FAFC] dark:from-slate-950 via-[#F8FAFC]/80 dark:via-slate-950/80 to-transparent"
        />

        {/* Soft Ambient Right Gradient Fade */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-28 z-20 bg-gradient-to-l from-[#F8FAFC] dark:from-slate-950 via-[#F8FAFC]/80 dark:via-slate-950/80 to-transparent"
        />

        {/* Continuous GPU-Accelerated Track (60 FPS) */}
        <div
          ref={trackRef}
          onTransitionEnd={handleTransitionEnd}
          style={{
            transform: `translate3d(${translateX}px, 0, 0)`,
            transition: isTransitioning
              ? prefersReducedMotion
                ? 'transform 150ms ease'
                : 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1)'
              : 'none',
          }}
          className="flex items-center will-change-transform py-4"
        >
          {trackItems.map((item, idx) => {
            const distance = Math.abs(idx - currentIndex);
            const isVisible = distance <= 3;
            const isCentered = distance === 0;
            const cardTheme = getDegreeTheme(getMainDegree(item.program));

            // Premium 3D uplifted scaling & opacity
            let cardScale = 0.88;
            let cardOpacity = 0.65;
            let zIndex = 10;

            if (distance === 0) {
              cardScale = 1.05;
              cardOpacity = 1.0;
              zIndex = 30;
            } else if (distance === 1) {
              cardScale = 0.94;
              cardOpacity = 0.88;
              zIndex = 20;
            }

            return (
              <div
                key={item.virtualId}
                onClick={() => handleCardClick(idx)}
                style={{
                  width: `${cardWidth}px`,
                  marginRight: `${gap}px`,
                  transform: `scale(${cardScale}) translate3d(0, 0, 0)`,
                  opacity: cardOpacity,
                  zIndex,
                  transition: prefersReducedMotion
                    ? 'none'
                    : 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1), opacity 500ms cubic-bezier(0.16, 1, 0.3, 1)',
                  willChange: 'transform, opacity',
                }}
                className={`shrink-0 cursor-pointer relative ${
                  isCentered ? '' : 'hover:opacity-90'
                }`}
                aria-hidden={!isVisible}
              >
                {isVisible && (
                  <div className="relative">
                    {/* Glowing highlight ring around center active card */}
                    {isCentered && (
                      <div className={`absolute -inset-1 rounded-3xl bg-gradient-to-r ${cardTheme.gradient} opacity-45 blur-sm pointer-events-none -z-10`} />
                    )}

                    <ProgramCard
                      p={item.program}
                      onView={onView}
                      onAsk={onAsk}
                      onCompare={onCompare}
                      isCompared={compareQueue.includes(item.program.id)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── STRICT USER SPECIFICATION: EXACTLY 3 DOTS BELOW THE 3 VISIBLE CARDS ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 mx-auto sm:mx-0 py-1" role="tablist" aria-label="Carousel pagination">
          {[0, 1, 2].map((dotIdx) => {
            const isActive = activeDotIndex === dotIdx;
            return (
              <button
                key={dotIdx}
                role="tab"
                aria-selected={isActive}
                onClick={() => handleJumpToDot(dotIdx)}
                className={`transition-all duration-300 rounded-full cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 ${
                  isActive
                    ? 'w-8 h-2.5 bg-gradient-to-r from-orange-500 to-amber-500 shadow-sm shadow-orange-500/30'
                    : 'w-2.5 h-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-orange-400'
                }`}
                aria-label={`Slide group ${dotIdx + 1}`}
              />
            );
          })}
        </div>

        {/* Clean tip with compass icon */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
          <Compass size={13} className="text-orange-500" />
          <span>Showing 3 cards per view • 5s smooth autoplay</span>
        </div>
      </div>
    </section>
  );
}
