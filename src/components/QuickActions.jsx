import React from 'react';

export default function QuickActions({ items, onPick, disabled }) {
  if (!items || !Array.isArray(items) || !items.length) return null;

  return (
    <div className="flex flex-wrap gap-2 pt-2 pl-9" role="group" aria-label="Suggested follow-ups">
      {items.map((q, idx) => (
        <button
          key={`${q}-${idx}`}
          disabled={disabled}
          onClick={() => onPick && onPick(q)}
          className="rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all select-none disabled:opacity-50 cursor-pointer shadow-2xs hover:scale-102 active:scale-95 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/60"
        >
          {q}
        </button>
      ))}
    </div>
  );
}
