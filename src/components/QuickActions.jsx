export default function QuickActions({ items, onPick, disabled }) {
  if (!items || !items.length) return null;

  return (
    <div className="flex flex-wrap gap-2 pt-2 pl-9" role="group" aria-label="Suggested follow-ups">
      {items.map((q) => (
        <button
          key={q}
          disabled={disabled}
          onClick={() => onPick(q)}
          className="rounded-full px-4 py-1.5 text-xs font-semibold transition-all select-none disabled:opacity-50"
          style={{
            background: '#FFF7ED',
            border: '1px solid #FFEDD5',
            color: '#EA580C',
          }}
          onMouseEnter={e => {
            if (!disabled) {
              e.currentTarget.style.background = '#FFEDD5';
              e.currentTarget.style.borderColor = '#FDBA74';
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#FFF7ED';
            e.currentTarget.style.borderColor = '#FFEDD5';
          }}
        >
          {q}
        </button>
      ))}
    </div>
  );
}
