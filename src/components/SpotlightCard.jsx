import React, { useRef, useCallback } from 'react';

/**
 * SpotlightCard: High-performance card container with Linear/Raycast style dynamic spotlight border glow.
 */
export default function SpotlightCard({
  children,
  className = '',
  onClick,
  ...props
}) {
  const cardRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      className={`spotlight-card border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
