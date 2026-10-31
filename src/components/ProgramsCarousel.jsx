import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  ChevronLeft, ChevronRight, Pause, Play, Sparkles, Compass
} from 'lucide-react';
import ProgramCard from './ProgramCard';

/**
 * Premium Infinite 3D Carousel for Degree Cards
 * Features:
 * - Continuous infinite carousel with smooth right-to-left transitions
 * - Snappy, silky-smooth animation curve (~450ms cubic-bezier)
 * - Autoplay timed at ~1.75s per transition (customizable in 1.5–2.0s range)
 * - Autoplay pauses on mouse hover over any card or carousel surface
 * - Seamless loop without any blank space or sudden jumps
 * - Subtle 3D perspective effect with hardware-accelerated depth, scaling, and rotation
 * - Prominent, highlighted, larger center card with active glow and elevation
 * - Side cards smoothly slide and rotate into center position
 * - Manual navigation (arrows, dots, click-on-card, swipe) seamlessly resets autoplay
 * - Fully responsive on desktop, tablet, and mobile
 */
export default function ProgramsCarousel({
  programs = [],
  onView,
  onAsk,
  onCompare,
}) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  const [containerWidth, setContainerWidth] = useState(1100);
  const [isHovered, setIsHovered] = useState(false);
  const [isPausedManually, setIsPausedManually] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [selectedProgramId, setSelectedProgramId] = useState(null);
  const [autoplayKey, setAutoplayKey] = useState(0);

  // Reduced motion detection
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // ResizeObserver to measure exact container width dynamically
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
  const { cardWidth, gap, isMobile } = useMemo(() => {
    if (containerWidth < 640) {
      return { cardWidth: Math.min(324, containerWidth - 36), gap: 16, isMobile: true };
    }
    if (containerWidth < 1024) {
      return { cardWidth: 360, gap: 24, isMobile: false };
    }
    return { cardWidth: 395, gap: 28, isMobile: false };
  }, [containerWidth]);

  const stepSize = cardWidth + gap;

  // Repeat count to create an infinite buffer with zero edges
  const repeatCount = useMemo(() => {
    if (N <= 1) return 1;
    // Ensure at least 35 items in buffer and repeatCount is odd so middleCycle is symmetrical
    const needed = Math.max(7, Math.ceil(35 / N));
    return needed % 2 === 0 ? needed + 1 : needed;
  }, [N]);

  const middleCycle = Math.floor(repeatCount / 2);
  const baseIndex = middleCycle * N;

  const [currentIndex, setCurrentIndex] = useState(baseIndex);

  // Reset to middle block whenever programs array changes (e.g. search or filter changed)
  useEffect(() => {
    setCurrentIndex(baseIndex);
    setIsTransitioning(false);
    requestAnimationFrame(() => {
      setIsTransitioning(true);
    });
  }, [baseIndex, N]);

  // Cloned track items
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

  // Active normalized program index
  const activeNormalizedIndex = N > 0 ? ((currentIndex % N) + N) % N : 0;
  const activeProgram = (selectedProgramId && programs.find((p) => p.id === selectedProgramId)) || programs[activeNormalizedIndex] || null;

  // Restart / sync autoplay timer on manual interactions
  const restartAutoplay = useCallback(() => {
    setAutoplayKey((prev) => prev + 1);
  }, []);

  // Navigation handlers
  const handleNext = useCallback((isManual = false) => {
    if (N <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
    if (isManual) restartAutoplay();
  }, [N, restartAutoplay]);

  const handlePrev = useCallback((isManual = false) => {
    if (N <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
    if (isManual) restartAutoplay();
  }, [N, restartAutoplay]);

  const handleJumpToIndex = useCallback((targetOriginalIndex) => {
    if (N <= 1) return;
    setIsTransitioning(true);
    const currentNorm = ((currentIndex % N) + N) % N;
    let diff = targetOriginalIndex - currentNorm;
    // Choose shortest direction
    if (diff > N / 2) diff -= N;
    if (diff < -N / 2) diff += N;
    setCurrentIndex((prev) => prev + diff);
    restartAutoplay();
  }, [currentIndex, N, restartAutoplay]);

  // Click-to-select interaction: smoothly selects and expands card in its current position without shifting the carousel
  const handleCardSelect = useCallback((programId) => {
    if (hasDraggedRef.current) return;
    setSelectedProgramId((prev) => (prev === programId ? null : programId));
    restartAutoplay();
  }, [restartAutoplay]);

  // Seamless Wrap on transition end (100% invisible reset with zero jumps)
  const handleTransitionEnd = useCallback((e) => {
    // Only handle horizontal transform transition on the main track
    if (e.target !== trackRef.current || e.propertyName !== 'transform') return;
    if (N <= 1) return;

    const norm = ((currentIndex % N) + N) % N;
    const safeIndex = baseIndex + norm;

    // If drifted away from the safe middle cycle, silently snap back
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

  // Continuous Fast Autoplay (moves smoothly every 1.75 seconds, paused on hover)
  useEffect(() => {
    if (prefersReducedMotion || isHovered || isDragging || isPausedManually || N <= 1) {
      return;
    }
    const timer = setInterval(() => {
      handleNext(false);
    }, 1750); // ~1.75 seconds per transition
    return () => clearInterval(timer);
  }, [prefersReducedMotion, isHovered, isDragging, isPausedManually, N, handleNext, autoplayKey]);

  // Pointer dragging & mobile touch swiping
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
    const deltaX = pointerStartRef.current.x ? 0 : 0; // fallback safety
    const endDeltaX = dragOffset;
    const deltaTime = Date.now() - pointerStartRef.current.time;
    const velocity = Math.abs(endDeltaX) / (deltaTime || 1);

    setIsTransitioning(true);
    setDragOffset(0);

    // Swipe threshold: 40px or rapid flick
    if (Math.abs(endDeltaX) > 40 || velocity > 0.4) {
      if (endDeltaX < 0) {
        // Dragged left -> advance right to left
        setCurrentIndex((prev) => prev + 1);
      } else {
        // Dragged right -> go previous
        setCurrentIndex((prev) => prev - 1);
      }
      restartAutoplay();
    }

    // Suppress clicks on child elements if user was actively dragging
    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 120);
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev(true);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext(true);
    }
  };

  // Click capture to prevent accidental button clicks while dragging
  const handleClickCapture = (e) => {
    if (hasDraggedRef.current) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  // Mathematical center coordinate calculation
  const translateX = (containerWidth / 2) - (cardWidth / 2) - (currentIndex * stepSize) + dragOffset;

  if (N === 0) return null;

  return (
    <section
      ref={containerRef}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsHovered(true)}
      onBlurCapture={() => setIsHovered(false)}
      tabIndex={0}
      aria-label="Degree Programs 3D Infinite Carousel"
      aria-roledescription="carousel"
      className="relative w-full overflow-hidden select-none outline-none py-6 sm:py-8 transition-colors"
    >
      {/* ── Carousel Header & Status Bar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
              <Sparkles size={11} />
              <span>Interactive 3D Carousel</span>
            </span>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
              Showing Degree <strong className="text-slate-900 dark:text-white font-mono font-bold">{activeNormalizedIndex + 1}</strong> of <strong className="text-slate-900 dark:text-white font-mono font-bold">{N}</strong>
            </span>
          </div>

          {activeProgram && (
            <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 truncate max-w-xl">
              <span className="text-orange-600 dark:text-orange-400 font-mono mr-1.5">[{activeProgram.short}]</span>
              {activeProgram.name}
            </p>
          )}
        </div>

        {/* Carousel Quick Navigation Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Autoplay Pause / Resume toggle button */}
          <button
            type="button"
            onClick={() => {
              setIsPausedManually((prev) => !prev);
              restartAutoplay();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-500/40 transition-colors shadow-2xs cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500"
            title={isPausedManually ? 'Resume automatic sliding' : 'Pause automatic sliding'}
            aria-label={isPausedManually ? 'Resume autoplay' : 'Pause autoplay'}
          >
            {isPausedManually ? <Play size={12} className="text-orange-500 fill-orange-500" /> : <Pause size={12} className="text-orange-500" />}
            <span className="hidden sm:inline">{isPausedManually ? 'Resume' : 'Autoplay'}</span>
          </button>

          {/* Prev Arrow Button */}
          <button
            type="button"
            onClick={() => handlePrev(true)}
            className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-500/50 shadow-2xs flex items-center justify-center transition-all cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-orange-500"
            aria-label="Previous degree program"
            title="Previous (Left Arrow)"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Next Arrow Button */}
          <button
            type="button"
            onClick={() => handleNext(true)}
            className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-500/50 shadow-2xs flex items-center justify-center transition-all cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-orange-500"
            aria-label="Next degree program"
            title="Next (Right Arrow)"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* ── Main Sliding Track Container with 3D Stage Perspective ── */}
      <div
        className="relative w-full py-6 sm:py-8 overflow-visible [perspective:1400px] [transform-style:preserve-3d] cursor-grab active:cursor-grabbing touch-pan-y"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onClickCapture={handleClickCapture}
      >
        {/* Floating Left Gradient Edge Shadow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-20 z-40 bg-gradient-to-r from-[#F8FAFC] dark:from-slate-950 via-[#F8FAFC]/80 dark:via-slate-950/80 to-transparent"
        />

        {/* Floating Right Gradient Edge Shadow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-20 z-40 bg-gradient-to-l from-[#F8FAFC] dark:from-slate-950 via-[#F8FAFC]/80 dark:via-slate-950/80 to-transparent"
        />

        {/* Floating Side Arrows on larger screens for direct in-canvas clicking */}
        <button
          type="button"
          onClick={() => handlePrev(true)}
          className="hidden md:flex absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-500/60 hover:scale-105 shadow-xl items-center justify-center transition-all cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-orange-500"
          aria-label="Previous card"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          type="button"
          onClick={() => handleNext(true)}
          className="hidden md:flex absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-500/60 hover:scale-105 shadow-xl items-center justify-center transition-all cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-orange-500"
          aria-label="Next card"
        >
          <ChevronRight size={20} />
        </button>

        {/* Continuous Horizontal Track */}
        <div
          ref={trackRef}
          onTransitionEnd={handleTransitionEnd}
          style={{
            transform: `translate3d(${translateX}px, 0, 0)`,
            transition: isTransitioning
              ? prefersReducedMotion
                ? 'transform 120ms ease'
                : 'transform 450ms cubic-bezier(0.22, 1, 0.36, 1)'
              : 'none',
          }}
          className="flex items-center will-change-transform [transform-style:preserve-3d]"
        >
          {trackItems.map((item, idx) => {
            const distance = Math.abs(idx - currentIndex);
            const isCenter = distance === 0;
            const isLeft = idx < currentIndex;
            const isSelected = selectedProgramId === item.program.id;

            // Only render cards within active view window (distance <= 4) to ensure wide displays have zero blank pop-ins
            const isVisible = distance <= 4;

            // Compute 3D Depth, Scaling, and Rotation angles
            let transformStyle = '';
            let opacity = 0;
            let zIndex = 0;
            let pointerEvents = 'none';

            if (isCenter) {
              transformStyle = prefersReducedMotion
                ? 'scale(1.02)'
                : isMobile
                  ? 'scale(1.03) translateZ(16px) rotateY(0deg)'
                  : 'scale(1.06) translateZ(36px) rotateY(0deg)';
              opacity = 1;
              zIndex = 30;
              pointerEvents = 'auto';
            } else if (distance === 1) {
              const rot = isLeft ? (isMobile ? 4 : 7) : (isMobile ? -4 : -7);
              const tz = isMobile ? -25 : -45;
              transformStyle = prefersReducedMotion
                ? 'scale(0.92)'
                : `scale(0.92) translateZ(${tz}px) rotateY(${rot}deg)`;
              opacity = 0.85;
              zIndex = 20;
              pointerEvents = 'auto';
            } else if (distance === 2) {
              const rot = isLeft ? (isMobile ? 8 : 12) : (isMobile ? -8 : -12);
              const tz = isMobile ? -60 : -95;
              transformStyle = prefersReducedMotion
                ? 'scale(0.84)'
                : `scale(0.84) translateZ(${tz}px) rotateY(${rot}deg)`;
              opacity = 0.45;
              zIndex = 10;
              pointerEvents = 'auto';
            } else if (distance === 3) {
              const rot = isLeft ? 15 : -15;
              transformStyle = `scale(0.76) translateZ(-145px) rotateY(${rot}deg)`;
              opacity = 0.18;
              zIndex = 5;
              pointerEvents = 'none';
            } else {
              transformStyle = 'scale(0.7) translateZ(-190px)';
              opacity = 0;
              zIndex = 0;
              pointerEvents = 'none';
            }

            return (
              <div
                key={item.virtualId}
                style={{
                  width: `${cardWidth}px`,
                  marginRight: `${gap}px`,
                  transform: transformStyle,
                  opacity: isSelected ? 1 : opacity,
                  zIndex: isSelected ? 45 : zIndex,
                  pointerEvents: pointerEvents,
                  transition: isTransitioning
                    ? prefersReducedMotion
                      ? 'transform 120ms ease, opacity 120ms ease'
                      : 'transform 500ms cubic-bezier(0.22, 1, 0.36, 1), opacity 500ms cubic-bezier(0.22, 1, 0.36, 1), filter 500ms ease'
                    : 'none',
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="shrink-0 transform-gpu will-change-transform [transform-style:preserve-3d]"
                aria-hidden={!isCenter && !isSelected}
              >
                {isVisible && (
                  <ProgramCard
                    p={item.program}
                    onView={onView}
                    onAsk={onAsk}
                    onCompare={onCompare}
                    isCenter={isCenter}
                    isSelected={isSelected}
                    onSelect={() => handleCardSelect(item.program.id)}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Interactive Pagination Indicators Bar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Interactive Dots / Pills */}
        <div
          className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1 scrollbar-none"
          role="tablist"
          aria-label="Carousel slide pagination"
        >
          {programs.map((p, idx) => {
            const isActive = idx === activeNormalizedIndex;
            return (
              <button
                key={p.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => handleJumpToIndex(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 ${
                  isActive
                    ? 'w-7 sm:w-8 h-2 bg-orange-600 shadow-xs shadow-orange-500/40'
                    : 'w-2 h-2 bg-slate-300 dark:bg-slate-700 hover:bg-orange-400 dark:hover:bg-orange-600'
                }`}
                title={`Jump to ${p.short}`}
                aria-label={`Go to slide ${idx + 1}: ${p.name}`}
              />
            );
          })}
        </div>

        {/* Mobile Swipe Tip & Keyboard helper */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500">
          <span className="flex items-center gap-1">
            <Compass size={12} className="text-orange-500" />
            <span>Hover to pause • Drag, swipe or use arrow keys</span>
          </span>
        </div>
      </div>
    </section>
  );
}
