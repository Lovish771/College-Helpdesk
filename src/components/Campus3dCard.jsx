import React, { useState, useRef, useCallback } from 'react';
import {
  ZoomIn, ZoomOut, Maximize2, X, Sparkles, MapPin, Compass, Building2,
  Eye, Layers
} from 'lucide-react';

/**
 * Campus3dCard: Interactive 3D Zoom & Tilt Showcase for LPU Central Amphitheater & Unipolis
 * Features:
 * - 3D Perspective Tilt on Mouse Movement with Dynamic Specular Glare
 * - Smooth 3D Zoom In & Zoom Out interaction (Toggle & Hover)
 * - Ultra-realistic depth layers, floating glassmorphic information pill
 * - Fullscreen 3D inspect modal with deep pan and zoom
 * - Fully responsive on desktop and mobile with touch support
 */
export default function Campus3dCard({
  imageSrc = '/images/lpu-unipolis-amphitheater.jpg',
  title = 'LPU Central Amphitheater & Unipolis',
  subtitle = 'Iconic 600+ Acre Landmark · Heart of Campus Life',
  onExplore,
}) {
  const cardRef = useRef(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalZoom, setModalZoom] = useState(1);
  const [tilt, setTilt] = useState({ rotX: 0, rotY: 0, glareX: 50, glareY: 50 });
  const [isHovered, setIsHovered] = useState(false);

  // 3D Parallax & Glare on Mouse Move
  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Smooth tilt angles (max +/- 10 deg)
    const rotY = ((x - centerX) / centerX) * 9;
    const rotX = -((y - centerY) / centerY) * 9;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ rotX, rotY, glareX, glareY });
  }, []);

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotX: 0, rotY: 0, glareX: 50, glareY: 50 });
  };

  const toggleZoom = (e) => {
    e?.stopPropagation();
    setIsZoomed((prev) => !prev);
  };

  return (
    <>
      {/* ── Main 3D Interactive Card ── */}
      <div
        className="relative group select-none cursor-pointer"
        style={{ perspective: '1100px' }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={toggleZoom}
      >
        <div
          ref={cardRef}
          style={{
            transform: isHovered
              ? `rotateX(${tilt.rotX}deg) rotateY(${tilt.rotY}deg) scale3d(1.02, 1.02, 1.02)`
              : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
            transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            transformStyle: 'preserve-3d',
          }}
          className="relative w-full h-[270px] sm:h-[300px] rounded-3xl overflow-hidden
            bg-slate-900 border border-slate-200/90 dark:border-white/15
            shadow-[0_20px_45px_-15px_rgba(0,0,0,0.5),0_0_30px_-5px_rgba(249,115,22,0.18)]
            dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),0_0_35px_-5px_rgba(249,115,22,0.25)]"
        >
          {/* ── Layer 1: High-Resolution 3D Image with Smooth Zoom In / Zoom Out ── */}
          <div className="absolute inset-0 overflow-hidden bg-slate-950">
            <img
              src={imageSrc}
              alt={title}
              className={`w-full h-full object-cover object-center transition-transform duration-700 ease-out will-change-transform ${
                isZoomed
                  ? 'scale-135 translate-y-[-6%]'
                  : isHovered
                  ? 'scale-110'
                  : 'scale-100'
              }`}
            />

            {/* Subtle Gradient Vignette & Lighting Filter */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/15 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/30 pointer-events-none" />
          </div>

          {/* ── Layer 2: Dynamic Specular Glare Reflection Sheen ── */}
          <div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay"
            style={{
              background: `radial-gradient(circle 320px at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 80%)`,
            }}
          />

          {/* ── Layer 3: Top Navigation & Zoom Controls ── */}
          <div
            className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10"
            style={{ transform: 'translateZ(26px)' }}
          >
            {/* 3D Interactive Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/75 backdrop-blur-md border border-white/20 text-white shadow-lg text-[11px] font-bold">
              <Sparkles size={12} className="text-orange-400 fill-orange-400 animate-pulse" />
              <span>3D Campus View</span>
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 ml-0.5 animate-ping" />
            </div>

            {/* Interactive Zoom & Fullscreen Controls */}
            <div className="flex items-center gap-1.5">
              {/* Zoom In / Zoom Out Toggle Button */}
              <button
                type="button"
                onClick={toggleZoom}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/75 hover:bg-orange-500 backdrop-blur-md border border-white/20 hover:border-orange-400 text-white text-[11px] font-bold shadow-lg transition-all active:scale-95 cursor-pointer"
                title={isZoomed ? 'Zoom Out' : 'Zoom In (3D)'}
              >
                {isZoomed ? (
                  <>
                    <ZoomOut size={12} className="text-orange-300 group-hover:text-white" />
                    <span>Zoom Out</span>
                  </>
                ) : (
                  <>
                    <ZoomIn size={12} className="text-orange-300 group-hover:text-white" />
                    <span>Zoom In</span>
                  </>
                )}
              </button>

              {/* Fullscreen Expand Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
                className="w-7 h-7 rounded-full bg-slate-950/75 hover:bg-orange-500 backdrop-blur-md border border-white/20 hover:border-orange-400 text-white flex items-center justify-center shadow-lg transition-all active:scale-95 cursor-pointer"
                title="Expand Full 3D View"
              >
                <Maximize2 size={12} />
              </button>
            </div>
          </div>

          {/* ── Layer 4: Bottom Glassmorphism Landmark Caption ── */}
          <div
            className="absolute bottom-3 left-3 right-3 p-3.5 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-white/15 text-white shadow-2xl z-10 transition-transform duration-300"
            style={{ transform: 'translateZ(30px)' }}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5 text-orange-400 text-[10px] font-extrabold uppercase tracking-wider mb-0.5">
                  <MapPin size={11} className="text-orange-400 shrink-0" />
                  <span>Unipolis &amp; Amphitheater · Central Campus</span>
                </div>
                <h3 className="text-xs sm:text-sm font-extrabold text-white font-display tracking-tight leading-snug">
                  {title}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-slate-300 mt-0.5 line-clamp-1">
                  {subtitle}
                </p>
              </div>

              {/* Interactive Status Pill */}
              <span className="shrink-0 px-2 py-0.5 rounded-lg bg-orange-500/20 border border-orange-500/40 text-orange-300 text-[10px] font-bold flex items-center gap-1">
                <Layers size={10} />
                <span>{isZoomed ? 'Zoomed 1.35x' : 'Interactive'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Ambient Warm Under-Glow Rim */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-orange-500/20 via-amber-500/15 to-orange-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 pointer-events-none" />
      </div>

      {/* ── Modal: High-Definition 3D Pan & Zoom Inspection Modal ── */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-label="High Definition 3D Campus Inspector"
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl rounded-3xl overflow-hidden bg-[#0A0E17] border border-white/20 shadow-2xl flex flex-col text-white"
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
                  <Building2 size={16} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white font-display">
                    {title}
                  </h3>
                  <p className="text-xs text-slate-400">{subtitle}</p>
                </div>
              </div>

              {/* Modal Zoom & Close Controls */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-white/10 p-1 rounded-full border border-white/10 text-xs">
                  <button
                    type="button"
                    onClick={() => setModalZoom((z) => Math.max(1, z - 0.25))}
                    disabled={modalZoom <= 1}
                    className="p-1.5 rounded-full hover:bg-white/20 disabled:opacity-40 transition-colors cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut size={14} />
                  </button>
                  <span className="px-2 font-mono text-[11px] font-bold text-orange-400">
                    {Math.round(modalZoom * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setModalZoom((z) => Math.min(2.5, z + 0.25))}
                    disabled={modalZoom >= 2.5}
                    className="p-1.5 rounded-full hover:bg-white/20 disabled:opacity-40 transition-colors cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn size={14} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full bg-white/10 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition-colors cursor-pointer"
                  title="Close Modal"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Modal Image Viewport */}
            <div className="relative w-full h-[55vh] sm:h-[65vh] overflow-auto flex items-center justify-center bg-black/90 p-2 scrollbar-thin scrollbar-thumb-white/20">
              <img
                src={imageSrc}
                alt={title}
                style={{
                  transform: `scale(${modalZoom})`,
                  transition: 'transform 0.25s ease-out',
                }}
                className="max-h-full max-w-full object-contain rounded-xl select-none"
              />
            </div>

            {/* Modal Footer Info */}
            <div className="p-3.5 sm:p-4 border-t border-white/10 bg-slate-950/60 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Sparkles size={13} className="text-orange-400" />
                <span>600+ Acres Campus · High-Definition Unipolis Architecture</span>
              </span>
              <span className="text-[11px] text-slate-500">
                Use controls to zoom in/out or click outside to close
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
