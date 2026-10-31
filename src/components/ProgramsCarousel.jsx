import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  ChevronLeft, ChevronRight, Pause, Play, Sparkles, Compass
} from 'lucide-react';
import ProgramCard from './ProgramCard';

/**
 * Degree Programs Carousel with Click-to-Select and Smooth In-Place Expansion
 * Features:
 * - Clean, uniform horizontal card layout (no forced 3D tilt or center-distortion)
 * - Click-to-select: Clicking any card smoothly expands that exact card in its existing position
 * - Selected card scales up with a 500ms natural easing transition, premium orange border, and soft glow
 * - Other cards remain in their original positions without moving, shifting, or jumping
 * - Clicking another card smoothly restores the previous card to normal size and expands the new card
 * - Hovering does NOT trigger selection or expansion
 * - Entire card is clickable for selection while internal buttons (View Details, Ask AI, Compare, Quick Glimpse) keep their isolated actions
 * - Preserves carousel navigation arrows, pagination pill indicators, and responsive design
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
  const { cardWidth, gap } = useMemo(() => {
    if (containerWidth < 640) {
      return { cardWidth: Math.min(320, containerWidth - 36), gap: 16 };
    }
    if (containerWidth < 1024) {
      return { cardWidth: 355, gap: 24 };
    }
    return { cardWidth: 385, gap: 28 };
  }, [containerWidth]);

  const stepSize = cardWidth + gap;

  // Repeat count to create an infinite buffer with zero edges
  const repeatCount = useMemo(() => {
    if (N <= 1) return 1;
    const needed = Math.max(7, Math.ceil(35 / N));
    return needed % 2 === 0 ? needed + 1 : needed;
  }, [N]);

  const middleCycle = Math.floor(repeatCount / 2);
  const baseIndex = middleCycle * N;

  const [currentIndex, setCurrentIndex] = useState(baseIndex);

  // Reset to middle block whenever programs array changes (e.g. search or filter changed)
  useEffect(() => {
    setCurrentIndex(baseIndex);
    setSelectedProgramId(null);
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
  const activeProgram =
    (selectedProgramId && programs.find((p) => p.id === selectedProgramId)) ||
    programs[activeNormalizedIndex] ||
    null;

  // Restart / sync autoplay timer on manual interactions
  const restartAutoplay = useCallback(() => {
    setAutoplayKey((prev) => prev + 1);
  }, []);

  // Navigation handlers (manual arrows or pagination)
  const handleNext = useCallback((isManual = false) => {
    if (N <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
    if (isManual) {
      setSelectedProgramId(null);
      restartAutoplay();
    }
  }, [N, restartAutoplay]);

  const handlePrev = useCallback((isManual = false) => {
    if (N <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
    if (isManual) {
      setSelectedProgramId(null);
      restartAutoplay();
    }
  }, [N, restartAutoplay]);

  const handleJumpToIndex = useCallback((targetOriginalIndex) => {
    if (N <= 1) return;
    setIsTransitioning(true);
    setSelectedProgramId(null);
    const currentNorm = ((currentIndex % N) + N) % N;
    let diff = targetOriginalIndex - currentNorm;
    if (diff > N / 2) diff -= N;
    if (diff < -N / 2) diff += N;
    setCurrentIndex((prev) => prev + diff);
    restartAutoplay();
  }, [currentIndex, N, restartAutoplay]);

  // Click-to-select: Expands the card in its CURRENT position without moving the carousel
  const handleCardSelect = useCallback((programId) => {
    if (hasDraggedRef.current) return;
    setSelectedProgramId((prev) => (prev === programId ? null : programId));
  }, []);

  // Seamless Wrap on transition end (invisible cycle boundary reset)
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

  // Autoplay moves smoothly when no card is selected and not hovered
  useEffect(() => {
    if (
      prefersReducedMotion ||
      isHovered ||
      isDragging ||
      isPausedManually ||
      selectedProgramId !== null ||
      N <= 1
    ) {
      return;
    }
    const timer = setInterval(() => {
      handleNext(false);
    }, 2000);
    return () => clearInterval(timer);
  }, [
    prefersReducedMotion,
    isHovered,
    isDragging,
    isPausedManually,
    selectedProgramId,
    N,
    handleNext,
    autoplayKey,
  ]);

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
    if (Math.abs(deltaX) > 8 || hasDraggedRef.current) {
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

    // Swipe threshold: 45px or rapid flick
    if (Math.abs(endDeltaX) > 45 || velocity > 0.45) {
      if (endDeltaX < 0) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setCurrentIndex((prev) => prev - 1);
      }
      setSelectedProgramId(null);
      restartAutoplay();
    }

    // Suppress clicks on child elements only if actively dragged
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

  // Click capture to prevent accidental clicks while dragging
  const handleClickCapture = (e) => {
    if (hasDraggedRef.current) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  // Mathematical center coordinate calculation
  const translateX =
    containerWidth / 2 - cardWidth / 2 - currentIndex * stepSize + dragOffset;

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
      aria-label="Degree Programs Carousel"
      aria-roledescription="carousel"
      className="relative w-full select-none outline-none py-4 sm:py-6 transition-colors"
    >
      {/* ── Carousel Header & Status Bar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
              <Sparkles size={11} />
              <span>Interactive Degrees Carousel</span>
            </span>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
              Showing Degree{' '}
              <strong className="text-slate-900 dark:text-white font-mono font-bold">
                {activeNormalizedIndex + 1}
              </strong>{' '}
              of{' '}
              <strong className="text-slate-900 dark:text-white font-mono font-bold">
                {N}
              </strong>
            </span>
          </div>

          {activeProgram && (
            <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 truncate max-w-xl">
              <span className="text-orange-600 dark:text-orange-400 font-mono mr-1.5">
                [{activeProgram.short}]
              </span>
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
            {isPausedManually ? (
              <Play size={12} className="text-orange-500 fill-orange-500" />
            ) : (
              <Pause size={12} className="text-orange-500" />
            )}
            <span className="hidden sm:inline">
              {isPausedManually ? 'Resume' : 'Autoplay'}
            </span>
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

      {/* ── Main Sliding Track Container ── */}
      <div
        className="relative w-full py-4 overflow-hidden cursor-grab active:cursor-grabbing touch-pan-y"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onClickCapture={handleClickCapture}
      >
        {/* Floating Left Gradient Edge Shadow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-20 z-20 bg-gradient-to-r from-[#F8FAFC] dark:from-slate-950 via-[#F8FAFC]/80 dark:via-slate-950/80 to-transparent"
        />

        {/* Floating Right Gradient Edge Shadow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-20 z-20 bg-gradient-to-l from-[#F8FAFC] dark:from-slate-950 via-[#F8FAFC]/80 dark:via-slate-950/80 to-transparent"
        />

        {/* Floating Side Arrows on larger screens for direct in-canvas clicking */}
        <button
          type="button"
          onClick={() => handlePrev(true)}
          className="hidden md:flex absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-500/60 hover:scale-105 shadow-xl items-center justify-center transition-all cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-orange-500"
          aria-label="Previous card"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          type="button"
          onClick={() => handleNext(true)}
          className="hidden md:flex absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-500/60 hover:scale-105 shadow-xl items-center justify-center transition-all cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-orange-500"
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
                : 'transform 500ms cubic-bezier(0.22, 1, 0.36, 1)'
              : 'none',
          }}
          className="flex items-center will-change-transform py-4"
        >
          {trackItems.map((item, idx) => {
            const distance = Math.abs(idx - currentIndex);
            const isVisible = distance <= 4;
            const isSelected = selectedProgramId === item.program.id;

            return (
              <div
                key={item.virtualId}
                style={{
                  width: `${cardWidth}px`,
                  marginRight: `${gap}px`,
                  zIndex: isSelected ? 30 : 10,
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="shrink-0"
                aria-hidden={!isVisible}
              >
                {isVisible && (
                  <ProgramCard
                    p={item.program}
                    onView={onView}
                    onAsk={onAsk}
                    onCompare={onCompare}
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
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

        {/* Tip helper */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500">
          <span className="flex items-center gap-1">
            <Compass size={12} className="text-orange-500" />
            <span>Click any card to select &amp; expand • Drag or use arrows to slide</span>
          </span>
        </div>
      </div>
    </section>
  );
}
