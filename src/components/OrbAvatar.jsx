import React from 'react';

/**
 * Lightweight 3D-shaded Robotic Orb Avatar matching ThreeAiOrb,
 * safe to render on every bot message without hitting WebGL context limits.
 */
export default function OrbAvatar({ size = 32, className = '' }) {
  const uid = React.useId().replace(/:/g, '');
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 drop-shadow-[0_4px_10px_rgba(249,115,22,0.28)] ${className}`}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`shell-${uid}`} cx="38%" cy="28%" r="72%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#EEF2F7" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </radialGradient>
        <linearGradient id={`visor-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="50%" stopColor="#090D16" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
        <radialGradient id={`glow-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFA94D" />
          <stop offset="100%" stopColor="#EA580C" />
        </radialGradient>
      </defs>

      {/* Top antenna stem & glowing tip */}
      <rect x="30.5" y="4" width="3" height="6" rx="1.5" fill="#334155" />
      <circle cx="32" cy="4" r="2.6" fill="#FF6A00" />

      {/* Side glowing orange ear-pods */}
      <rect x="5" y="23" width="6" height="18" rx="3" fill={`url(#glow-${uid})`} />
      <rect x="53" y="23" width="6" height="18" rx="3" fill={`url(#glow-${uid})`} />
      <rect x="7" y="21" width="5" height="22" rx="2.5" fill="#E2E8F0" />
      <rect x="52" y="21" width="5" height="22" rx="2.5" fill="#E2E8F0" />

      {/* Main 3D pearlescent sphere body */}
      <circle cx="32" cy="34" r="24" fill={`url(#shell-${uid})`} stroke="#CBD5E1" strokeWidth="0.8" />

      {/* Headband arch */}
      <path d="M10 29 C12 13, 52 13, 54 29" stroke="#E2E8F0" strokeWidth="2.4" fill="none" />

      {/* Curved obsidian glass visor */}
      <rect x="14" y="21" width="36" height="22" rx="10" fill={`url(#visor-${uid})`} stroke="#334155" strokeWidth="1" />

      {/* Visor specular highlight */}
      <ellipse cx="23" cy="25" rx="6" ry="1.8" fill="white" fillOpacity="0.16" />

      {/* Glowing neon orange digital eyes */}
      <path d="M20 33 C22 29.5, 26 29.5, 28 33" stroke="#FF8C24" strokeWidth="2.8" strokeLinecap="round" fill="none" />
      <path d="M36 33 C38 29.5, 42 29.5, 44 33" stroke="#FF8C24" strokeWidth="2.8" strokeLinecap="round" fill="none" />

      {/* Lower chin intake vent */}
      <rect x="26" y="48.5" width="12" height="3.2" rx="1.6" fill="#1E293B" />

      {/* Subtle orange holographic base ring */}
      <ellipse cx="32" cy="60.5" rx="14" ry="2" fill="#FF6A00" fillOpacity="0.28" />
    </svg>
  );
}
