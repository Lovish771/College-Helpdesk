import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  ChevronLeft, ChevronRight, Pause, Play, Sparkles, Compass
} from 'lucide-react';
import ProgramCard from './ProgramCard';

/**
 * ProgramsCarousel: Premium Smooth Horizontal Slide Carousel
 * Replicating 100% of the User's Requirements & Reference Mockup:
 * - Smooth left/right horizontal sliding transitions with cubic-bezier easing
 * - Active card is strictly centered, slightly larger (scale 1.06), and highlighted with a glowing orange ring
 * - Previous and next cards are partially visible on both sides with subtle scale (0.94) and opacity (0.88)
 * - Outer cards scale to 0.84 with 0.55 opacity, fading smoothly toward the edges
 * - Interactive circular navigation arrows (< and >) and pagination pill indicators
 * - Smooth mouse drag and touch swipe with 1:1 tracking and velocity flicking
 * - Clicking any card smoothly slides it into the center and selects it
 * - Internal buttons (View Details, Compare, Ask AI) maintain their isolated actions
 * - Seamless infinite looping with zero flickering or layout shifts
 * - Zero page-level horizontal overflow
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

  // Reduced motion detection
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
      // Mobile: allow adjacent cards to peek in by 28-36px
      return { cardWidth: Math.min(320, containerWidth - 68), gap: 16 };
    }
    if (containerWidth < 1024) {
      // Tablet
      return { cardWidth: 350, gap: 24 };
    }
    // Desktop: generous card size matching reference image
    return { cardWidth: 380, gap: 28 };
  }, [containerWidth]);

  const stepSize = cardWidth + gap;

  // Generate buffer cycles to ensure infinite looping without edge boundaries
  const repeatCount = useMemo(() => {
    if (N <= 1) return 1;
    const needed = Math.max(7, Math.ceil(35 / N));
    return needed % 2 === 0 ? needed + 1 : needed;
  }, [N]);

  const middleCycle = Math.floor(repeatCount / 2);
  const baseIndex = middleCycle * N;

  const [currentIndex, setCurrentIndex] = useState(baseIndex);

  // Reset index when program list changes (e.g. search filter applied)
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
  const activeProgram = programs[activeNormalizedIndex] || null;

  // Navigation handlers
  const handleNext = useCallback((isManual = false) => {
    if (N <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, [N]);

  const handlePrev = useCallback((isManual = false) => {
    if (N <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  }, [N]);

  // Jump to specific dot index
  const handleJumpToSlide = useCallback((targetOriginalIndex) => {
    if (N <= 1) return;
    setIsTransitioning(true);
    const currentNorm = ((currentIndex % N) + N) % N;
    let diff = targetOriginalIndex - currentNorm;
    if (diff > N / 2) diff -= N;
    if (diff < -N / 2) diff += N;
    setCurrentIndex((prev) => prev + diff);
  }, [currentIndex, N]);

  // Clicking any card smoothly slides that card into the center!
  const handleCardClick = useCallback((targetTrackIndex) => {
    if (hasDraggedRef.current) return;
    if (targetTrackIndex !== currentIndex) {
      setIsTransitioning(true);
      setCurrentIndex(targetTrackIndex);
    }
  }, [currentIndex]);

  // Seamless cycle wrap when reaching outer boundaries
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

  // Autoplay moves gently every 4s when not hovered or dragged
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
      handleNext(false);
    }, 3800);
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
      handlePrev(true);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext(true);
    }
  };

  // Prevent accidental clicks on child buttons when dragging
  const handleClickCapture = (e) => {
    if (hasDraggedRef.current) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  // Center coordinate math: puts the active card (at currentIndex) exactly at containerWidth / 2
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
      aria-label="Explore Our Courses Carousel"
      aria-roledescription="carousel"
      className="relative w-full select-none outline-none py-6 sm:py-8 overflow-hidden transition-colors"
    >
      {/* ── Status Bar / Subtitle ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800/50">
            <Sparkles size={12} className="text-orange-500 fill-orange-500" />
            <span>Interactive Carousel</span>
          </span>
          <span className="text-slate-400 dark:text-slate-500 font-semibold">
            Program <strong className="text-slate-900 dark:text-white font-mono">{activeNormalizedIndex + 1}</strong> of <strong className="text-slate-900 dark:text-white font-mono">{N}</strong>
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
              <span>Resume</span>
            </>
          ) : (
            <>
              <Pause size={11} className="text-orange-500" />
              <span>Autoplay</span>
            </>
          )}
        </button>
      </div>

      {/* ── Main Sliding Viewport Container ── */}
      <div
        className="relative w-full py-6 overflow-hidden cursor-grab active:cursor-grabbing touch-pan-y"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onClickCapture={handleClickCapture}
      >
        {/* Soft Left Ambient Gradient Fade */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-28 z-20 bg-gradient-to-r from-[#F8FAFC] dark:from-slate-950 via-[#F8FAFC]/80 dark:via-slate-950/80 to-transparent"
        />

        {/* Soft Right Ambient Gradient Fade */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-28 z-20 bg-gradient-to-l from-[#F8FAFC] dark:from-slate-950 via-[#F8FAFC]/80 dark:via-slate-950/80 to-transparent"
        />

        {/* Floating Circular Left Navigation Arrow (Matching Reference Mockup) */}
        <button
          type="button"
          onClick={() => handlePrev(true)}
          className="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 hover:text-orange-600 dark:hover:text-orange-400 border border-slate-200 dark:border-slate-800 shadow-[0_8px_25px_-5px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.6)] hover:border-orange-500/50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
          aria-label="Previous Program"
        >
          <ChevronLeft size={22} className="stroke-[2.5]" />
        </button>

        {/* Floating Circular Right Navigation Arrow (Matching Reference Mockup) */}
        <button
          type="button"
          onClick={() => handleNext(true)}
          className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 hover:text-orange-600 dark:hover:text-orange-400 border border-slate-200 dark:border-slate-800 shadow-[0_8px_25px_-5px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.6)] hover:border-orange-500/50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
          aria-label="Next Program"
        >
          <ChevronRight size={22} className="stroke-[2.5]" />
        </button>

        {/* ── The Continuous GPU-Accelerated Track ── */}
        <div
          ref={trackRef}
          onTransitionEnd={handleTransitionEnd}
          style={{
            transform: `translate3d(${translateX}px, 0, 0)`,
            transition: isTransitioning
              ? prefersReducedMotion
                ? 'transform 150ms ease'
                : 'transform 550ms cubic-bezier(0.22, 1, 0.36, 1)'
              : 'none',
          }}
          className="flex items-center will-change-transform py-6"
        >
          {trackItems.map((item, idx) => {
            const distance = Math.abs(idx - currentIndex);
            const isVisible = distance <= 4;
            const isCentered = distance === 0;

            // Smooth scale and opacity calculation based on distance from center
            let cardScale = 0.84;
            let cardOpacity = 0.55;
            let zIndex = 10;

            if (distance === 0) {
              cardScale = 1.06;
              cardOpacity = 1.0;
              zIndex = 30;
            } else if (distance === 1) {
              cardScale = 0.94;
              cardOpacity = 0.88;
              zIndex = 20;
            } else if (distance === 2) {
              cardScale = 0.85;
              cardOpacity = 0.60;
              zIndex = 10;
            }

            return (
              <div
                key={item.virtualId}
                onClick={() => handleCardClick(idx)}
                style={{
                  width: `${cardWidth}px`,
                  marginRight: `${gap}px`,
                  transform: `scale(${cardScale})`,
                  opacity: cardOpacity,
                  zIndex,
                  transition: prefersReducedMotion
                    ? 'none'
                    : 'transform 550ms cubic-bezier(0.22, 1, 0.36, 1), opacity 550ms cubic-bezier(0.22, 1, 0.36, 1)',
                  willChange: 'transform, opacity',
                }}
                className={`shrink-0 transition-transform cursor-pointer relative ${
                  isCentered ? 'filter drop-shadow-[0_15px_35px_rgba(249,115,22,0.28)]' : ''
                }`}
                aria-hidden={!isVisible}
              >
                {isVisible && (
                  <div className="relative">
                    {/* Glowing Orange Outline for Center Active Card */}
                    {isCentered && (
                      <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 opacity-80 blur-xs pointer-events-none -z-10" />
                    )}

                    <ProgramCard
                      p={item.program}
                      onView={onView}
                      onAsk={onAsk}
                      onCompare={onCompare}
                      isSelected={isCentered || compareQueue.includes(item.program.id)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Interactive Pagination Dots & Help Tip (Matches Reference Mockup) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Pagination Dots / Pills */}
        <div
          className="flex items-center gap-2 overflow-x-auto max-w-full py-1 scrollbar-none mx-auto sm:mx-0"
          role="tablist"
          aria-label="Course carousel pagination"
        >
          {programs.map((p, idx) => {
            const isActive = idx === activeNormalizedIndex;
            return (
              <button
                key={p.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => handleJumpToSlide(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 ${
                  isActive
                    ? 'w-8 h-2.5 bg-gradient-to-r from-orange-500 to-amber-500 shadow-md shadow-orange-500/40'
                    : 'w-2.5 h-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-orange-400 dark:hover:bg-orange-500'
                }`}
                title={`Jump to ${p.short}`}
                aria-label={`Go to slide ${idx + 1}: ${p.name}`}
              />
            );
          })}
        </div>

        {/* Tip helper */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500">
          <Compass size={12} className="text-orange-500" />
          <span>Click any card to center &amp; select • Swipe or drag to browse</span>
        </div>
      </div>
    </section>
  );
}
