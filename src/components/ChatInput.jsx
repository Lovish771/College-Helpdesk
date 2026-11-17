import React, { useState, useRef, memo } from 'react';
import { Paperclip, Send } from 'lucide-react';

const MAX_CHAT_LENGTH = 500;

function ChatInputComponent({ onSend, disabled }) {
  const [text, setText] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = text.trim();
    if (!val || disabled) return;
    onSend(val.slice(0, MAX_CHAT_LENGTH));
    setText('');
    inputRef.current?.focus();
  };

  const remaining = MAX_CHAT_LENGTH - text.length;
  const isNearLimit = remaining <= 50;

  return (
    <div className="p-4 sm:p-5 bg-[#F8FAFC] dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
        <div className="relative flex items-center gap-2 rounded-lg bg-white dark:bg-slate-900 px-4 py-2 border border-slate-200 dark:border-slate-800 transition-colors focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_CHAT_LENGTH))}
            placeholder="Type your question about LPU admissions, fees, hostels, rules..."
            disabled={disabled}
            maxLength={MAX_CHAT_LENGTH}
            aria-label="Ask a question about Lovely Professional University"
            className="flex-1 bg-transparent px-2 py-1.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus-visible:outline-none"
          />

          {/* Character warning indicator when approaching cap */}
          {isNearLimit && (
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                remaining <= 10
                  ? 'bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400'
                  : 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
              }`}
              aria-live="polite"
            >
              {remaining}
            </span>
          )}

          {/* Paperclip attach icon */}
          <button
            type="button"
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 rounded-full"
            title="Attach file (Optional)"
            aria-label="Attach file"
            onClick={() => {}}
          >
            <Paperclip size={18} />
          </button>

          {/* Send Circular LPU Orange 3D Button */}
          <button
            type="submit"
            disabled={disabled || !text.trim()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500"
            aria-label="Send message"
          >
            <Send size={15} className="-ml-0.5 mt-0.5 stroke-[2.5]" />
          </button>
        </div>
      </form>
    </div>
  );
}

const ChatInput = memo(ChatInputComponent);
export default ChatInput;

