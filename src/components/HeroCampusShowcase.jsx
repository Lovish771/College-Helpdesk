import { useState, useEffect, useRef } from 'react';
import { Camera, Sparkles, Compass, CheckCircle2, ChevronRight, Layers } from 'lucide-react';
import LpuLogo from './LpuLogo';

const PHOTOS = [
  {
    id: 'entrance',
    src: '/images/lpu-campus-entrance.jpg',
    alt: 'Lovely Professional University Iconic Grand Entrance and Student Walkway',
    label: 'Grand Entrance',
    tag: 'Main Campus · Punjab',
    title: 'Grand Entrance & Walkway',
    subtitle: 'Iconic Sunburst Monument & Modern Campus',
    badge: 'Ranked #1',
    badgeSub: 'WURI Global Rankings',
  },
  {
    id: 'academic',
    src: '/images/lpu-campus-academic.png',
    alt: 'Lovely Professional University Admissions Block and Chancellery Building Panorama',
    label: 'Admissions Block',
    tag: 'The Chancellery',
    title: 'Admissions & Chancellery Block',
    subtitle: '600+ Acre Sprawling Green Campus',
    badge: 'NAAC A++',
    badgeSub: 'Highest Accreditation',
  },
];

export default function HeroCampusShowcase() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, isHovering: false });
  const cardRef = useRef(null);

  // Auto-slide every 6s, pauses instantly when mouse is hovering
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev === 0 ? 1 : 0));
    }, 6000);
    return () => clearInterval(timer);
  }, [isHovered]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Gesture tilt degrees: -8 to +8 degrees
    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ rotateX, rotateY, glareX, glareY, isHovering: true });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, isHovering: false });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const activePhoto = PHOTOS[activeIdx];
  const nextIdx = activeIdx === 0 ? 1 : 0;
  const nextPhoto = PHOTOS[nextIdx];

  return (
    <div className="relative group/showcase w-full select-none">
      {/* ── Top Interactive Gesture Tabs (Pills) ── */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="inline-flex p-1 rounded-xl bg-slate-100/90 border border-slate-200/80 shadow-inner backdrop-blur-sm">
          {PHOTOS.map((photo, idx) => {
            const isCurrent = activeIdx === idx;
            return (
              <button
                key={photo.id}
                onClick={() => setActiveIdx(idx)}
                onMouseEnter={() => {
                  setIsHovered(true);
                  setActiveIdx(idx);
                }}
                className={`relative px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 ${
                  isCurrent
                    ? 'text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
                style={
                  isCurrent
                    ? {
                        background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                      }
                    : {}
                }
              >
                {idx === 0 ? <Compass size={13} /> : <Sparkles size={13} />}
                <span>{photo.label}</span>
                {isCurrent && (
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse ml-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Campus Location Tag */}
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-white/90 dark:bg-slate-800/90 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-2xs">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>600+ Acre Residential Township</span>
        </div>
      </div>

      {/* ── 3D Interactive Tilt Card Container ── */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white cursor-pointer bg-slate-900 transition-shadow duration-300 group-hover/showcase:shadow-orange-600/15 group-hover/showcase:shadow-3xl"
        style={{
          height: '430px',
          transform: tilt.isHovering
            ? `perspective(1100px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(1.02, 1.02, 1.02)`
            : 'perspective(1100px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: tilt.isHovering
            ? 'transform 0.12s ease-out, box-shadow 0.3s ease'
            : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Specular Glare/Reflection Layer */}
        <div
          className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-200 mix-blend-overlay"
          style={{
            opacity: tilt.isHovering ? 0.45 : 0,
            background: `radial-gradient(circle 360px at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.15) 50%, transparent 80%)`,
          }}
        />

        {/* ── Imagery with Cross-Fade Gestural Slide ── */}
        {PHOTOS.map((photo, idx) => {
          const isCurrent = activeIdx === idx;
          return (
            <div
              key={photo.id}
              className={`absolute inset-0 transition-all duration-700 ease-out ${
                isCurrent
                  ? 'opacity-100 scale-100 z-10'
                  : 'opacity-0 scale-105 pointer-events-none z-0'
              }`}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover"
                loading="eager"
              />
              {/* Cinematic Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-slate-900/30" />
            </div>
          );
        })}

        {/* ── Floating 3D Badge 1: Location & Authenticity (Parallax Z: 35px) ── */}
        <div
          className="absolute top-4 left-4 z-20 transition-transform duration-200"
          style={{
            transform: tilt.isHovering ? 'translateZ(35px)' : 'translateZ(0px)',
          }}
        >
          <div className="inline-flex items-center gap-2 rounded-xl bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 text-white border border-white/20 shadow-lg text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            <span>{activePhoto.tag}</span>
          </div>
        </div>

        {/* ── Floating 3D Badge 2: Official Accreditation (Parallax Z: 35px) ── */}
        <div
          className="absolute top-4 right-4 z-20 transition-transform duration-200"
          style={{
            transform: tilt.isHovering ? 'translateZ(35px)' : 'translateZ(0px)',
          }}
        >
          <div className="inline-flex items-center gap-1.5 rounded-xl bg-orange-600/90 backdrop-blur-md px-3 py-1.5 text-white border border-orange-400/30 shadow-lg text-xs font-bold">
            <CheckCircle2 size={13} className="text-white" />
            <span>{activePhoto.badge}</span>
          </div>
        </div>

        {/* ── Stacked 3D Peek Thumbnail (Interactive Gesture to swap photos) ── */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            setActiveIdx(nextIdx);
          }}
          className="absolute bottom-24 right-4 z-25 group/peek transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          style={{
            transform: tilt.isHovering ? 'translateZ(45px)' : 'translateZ(0px)',
          }}
          title={`Click or hover to switch to ${nextPhoto.label}`}
        >
          <div className="relative rounded-xl overflow-hidden border-2 border-white/90 shadow-xl w-24 h-16 bg-slate-900">
            <img
              src={nextPhoto.src}
              alt={nextPhoto.label}
              className="w-full h-full object-cover group-hover/peek:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-slate-950/40 group-hover/peek:bg-transparent transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-slate-900/80 backdrop-blur-xs text-[10px] font-bold text-white px-2 py-0.5 rounded-md border border-white/30 flex items-center gap-1 shadow-sm">
                <Layers size={10} className="text-orange-400" />
                <span>Next</span>
              </span>
            </div>
          </div>
        </div>

        {/* ── Bottom Information Card with Parallax Depth (Parallax Z: 40px) ── */}
        <div
          className="absolute bottom-4 left-4 right-4 z-20 transition-transform duration-200"
          style={{
            transform: tilt.isHovering ? 'translateZ(40px)' : 'translateZ(0px)',
          }}
        >
          <div className="rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 shadow-xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-xl bg-slate-900 shadow-md border border-white/20">
                <LpuLogo variant="dark" size={32} showSubtitle={false} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  {activePhoto.title}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                  {activePhoto.subtitle}
                </p>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveIdx(nextIdx);
              }}
              className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/50 hover:bg-orange-100 dark:hover:bg-orange-900/60 border border-orange-200 dark:border-orange-800 px-3 py-1.5 rounded-xl transition-all hover:scale-105 active:scale-95"
            >
              <span>Switch Photo</span>
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Ambient Warm Lighting Glow Behind ── */}
      <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/15 via-amber-400/10 to-orange-600/15 rounded-3xl blur-2xl -z-10 transition-opacity duration-500 group-hover/showcase:opacity-100 opacity-60 pointer-events-none" />
    </div>
  );
}