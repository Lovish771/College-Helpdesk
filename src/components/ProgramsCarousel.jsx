import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  ChevronLeft, ChevronRight, Pause, Play, Sparkles, Compass
} from 'lucide-react';
import ProgramCard from './ProgramCard';

/**
 * Premium Infinite Horizontal 3D Carousel for Degree Cards
 * Features:
 * - Seamless right-to-left continuous infinite circular loop (zero jumps or visible resets)
 * - Prominent center card (scale-105, vibrant orange border, soft bloom glow)
 * - Neighboring cards with subtle depth, scaled down (0.93/0.86), and reduced emphasis
 * - Autoplay paused on hover and focus
 * - 1:1 Pointer dragging (mouse) & touch swiping (mobile) with inertial release
 * - Sleek floating navigation arrows & interactive pagination dots
 * - Accessible keyboard navigation (ArrowLeft / ArrowRight)
 * - Zero layout shifts and strict overflow confinement
 * - Respects prefers-reduced-motion
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
  const { cardWidth, gap } = useMemo(() => {
    if (containerWidth < 640) {
      return { cardWidth: Math.min(320, containerWidth - 44), gap: 16 };
    }
    if (containerWidth < 1024) {
      return { cardWidth: 360, gap: 24 };
    }
    return { cardWidth: 390, gap: 28 };
  }, [containerWidth]);

  const stepSize = cardWidth + gap;

  // Repeat count to create an infinite buffer with zero edges
  const repeatCount = useMemo(() => {
    if (N <= 1) return 1;
    // Ensure at least 25 items in track and repeatCount is odd for a true center segment
    const needed = Math.max(5, Math.ceil(25 / N));
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
  const activeProgram = programs[activeNormalizedIndex] || null;

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

  const handleJumpToIndex = useCallback((targetOriginalIndex) => {
    if (N <= 1) return;
    setIsTransitioning(true);
    const currentNorm = ((currentIndex % N) + N) % N;
    let diff = targetOriginalIndex - currentNorm;
    // Choose shortest direction
    if (diff > N / 2) diff -= N;
    if (diff < -N / 2) diff += N;
    setCurrentIndex((prev) => prev + diff);
  }, [currentIndex, N]);

  // Seamless Wrap on transition end (100% invisible reset with zero jumps)
  const handleTransitionEnd = useCallback((e) => {
    // Only handle horizontal transform transition
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

  // Continuous Autoplay (moves right-to-left every 3.8s)
  useEffect(() => {
    if (prefersReducedMotion || isHovered || isDragging || isPausedManually || N <= 1) {
      return;
    }
    const timer = setInterval(() => {
      handleNext();
    }, 3800);
    return () => clearInterval(timer);
  }, [prefersReducedMotion, isHovered, isDragging, isPausedManually, N, handleNext]);

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

  const handlePointerEnd = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    const deltaX = e.clientX - pointerStartRef.current.x;
    const deltaTime = Date.now() - pointerStartRef.current.time;
    const velocity = Math.abs(deltaX) / (deltaTime || 1);

    setIsTransitioning(true);
    setDragOffset(0);

    // Swipe threshold: 45px or rapid flick
    if (Math.abs(deltaX) > 45 || velocity > 0.45) {
      if (deltaX < 0) {
        // Dragged left -> advance right to left
        setCurrentIndex((prev) => prev + 1);
      } else {
        // Dragged right -> go previous
        setCurrentIndex((prev) => prev - 1);
      }
    }

    // Suppress clicks on child buttons if user was actively dragging
    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 100);
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
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
      aria-label="Degree Programs Infinite Carousel"
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

        {/* Carousel Quick Navigation Pill Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Autoplay Pause / Resume toggle button */}
          <button
            type="button"
            onClick={() => setIsPausedManually((prev) => !prev)}
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
            onClick={handlePrev}
            className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-500/50 shadow-2xs flex items-center justify-center transition-all cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-orange-500"
            aria-label="Previous degree program"
            title="Previous (Left Arrow)"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Next Arrow Button */}
          <button
            type="button"
            onClick={handleNext}
            className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-500/50 shadow-2xs flex items-center justify-center transition-all cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-orange-500"
            aria-label="Next degree program"
            title="Next (Right Arrow)"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* ── Main Sliding Track Container ── */}
      <div
        className="relative w-full py-4 overflow-visible cursor-grab active:cursor-grabbing touch-pan-y"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onClickCapture={handleClickCapture}
      >
        {/* Floating Left Gradient Edge Shadow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 z-30 bg-gradient-to-r from-[#F8FAFC] dark:from-slate-950 to-transparent"
        />

        {/* Floating Right Gradient Edge Shadow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 z-30 bg-gradient-to-l from-[#F8FAFC] dark:from-slate-950 to-transparent"
        />

        {/* Floating Side Arrows on larger screens for direct in-canvas clicking */}
        <button
          type="button"
          onClick={handlePrev}
          className="hidden md:flex absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-500/50 hover:scale-105 shadow-xl items-center justify-center transition-all cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-orange-500"
          aria-label="Previous card"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="hidden md:flex absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-500/50 hover:scale-105 shadow-xl items-center justify-center transition-all cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-orange-500"
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
                ? 'transform 100ms ease'
                : 'transform 550ms cubic-bezier(0.16, 1, 0.3, 1)'
              : 'none',
          }}
          className="flex items-center will-change-transform"
        >
          {trackItems.map((item, idx) => {
            const distance = Math.abs(idx - currentIndex);
            const isCenter = distance === 0;
            const isNeighbor = distance === 1;
            const isFarNeighbor = distance === 2;

            // Only render full visual fidelity for cards within active view window
            const isVisible = distance <= 3;

            // Compute center prominence and subtle depth transitions
            let scaleClass = 'scale-[0.84] opacity-0 pointer-events-none z-0';
            if (isCenter) {
              scaleClass = 'scale-100 sm:scale-[1.03] opacity-100 z-20';
            } else if (isNeighbor) {
              scaleClass = 'scale-[0.92] sm:scale-[0.94] opacity-75 dark:opacity-65 z-10';
            } else if (isFarNeighbor) {
              scaleClass = 'scale-[0.86] sm:scale-[0.88] opacity-35 dark:opacity-20 z-0';
            }

            return (
              <div
                key={item.virtualId}
                style={{
                  width: `${cardWidth}px`,
                  marginRight: `${gap}px`,
                }}
                className={`shrink-0 transform-gpu transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${scaleClass}`}
                aria-hidden={!isCenter}
              >
                {isVisible && (
                  <ProgramCard
                    p={item.program}
                    onView={onView}
                    onAsk={onAsk}
                    onCompare={onCompare}
                    isCenter={isCenter}
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
            <span>Drag or swipe horizontally • Arrow keys supported</span>
          </span>
        </div>
      </div>
    </section>
  );
}
