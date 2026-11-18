import React from 'react';

/**
 * Card container. Kept as a named component because several screens import it;
 * the mouse-tracking spotlight border it used to draw is gone - a 1px border and
 * a border-colour hover read more cleanly and cost nothing on every mousemove.
 */
export default function SpotlightCard({ children, className = '', onClick, ...props }) {
  return (
    <div
      onClick={onClick}
      className={`card ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}