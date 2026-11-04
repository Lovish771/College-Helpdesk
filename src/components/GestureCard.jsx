import { useState, useRef } from 'react';

/**
 * GestureCard: A modern interactive card that responds with tactile 3D tilt,
 * cursor-following glare, and smooth spring physics on hover.
 */
export default function GestureCard({
  children,
  className = '',
  maxTilt = 6,
  glare = true,
  onClick,
  style = {},
  ...props
}) {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, isHovering: false });
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ rotateX, rotateY, glareX, glareY, isHovering: true });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, isHovering: false });
  };

  return (
    <div
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-all duration-200 ${className}`}
      style={{
        ...style,
        transform: tilt.isHovering
          ? `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(1.018, 1.018, 1.018)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        boxShadow: tilt.isHovering
          ? '0 20px 35px -10px rgba(15, 23, 42, 0.12), 0 0 20px -2px rgba(56, 189, 248, 0.16), 0 0 0 1px rgba(234, 88, 12, 0.25)'
          : undefined,
        transition: tilt.isHovering
          ? 'transform 0.1s ease-out, box-shadow 0.2s ease, border-color 0.2s ease'
          : 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease',
        transformStyle: 'preserve-3d',
      }}
      {...props}
    >
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl z-20 transition-opacity duration-200 mix-blend-overlay overflow-hidden"
          style={{
            opacity: tilt.isHovering ? 0.35 : 0,
            background: `radial-gradient(circle 260px at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)`,
          }}
        />
      )}
      {children}
    </div>
  );
}