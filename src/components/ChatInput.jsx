import React, { useState, useRef, useEffect, memo } from 'react';
import { Send } from 'lucide-react';

const MAX_CHAT_LENGTH = 500;

function ChatInputComponent({ onSend, disabled }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }, [text]);

  const submitMessage = () => {
    const val = text.trim();
    if (!val || disabled) return;
    onSend(val.slice(0, MAX_CHAT_LENGTH));
    setText('');
    textareaRef.current?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitMessage();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitMessage();
    }
  };

  const remaining = MAX_CHAT_LENGTH - text.length;
  const isNearLimit = remaining <= 50;

  return (
    <div className="p-3 sm:p-4 bg-[#F8FAFC] dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
        <div className="relative flex items-end gap-2 rounded-2xl bg-white dark:bg-slate-900 px-3.5 py-2 border border-slate-200 dark:border-slate-800 shadow-xs focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20">
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_CHAT_LENGTH))}
            onKeyDown={handleKeyDown}
            placeholder="Ask about LPU fees, hostels, scholarships, or admissions..."
            disabled={disabled}
            maxLength={MAX_CHAT_LENGTH}
            aria-label="Ask a question about Lovely Professional University"
            className={`flex-1 resize-none bg-transparent px-1.5 py-1.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus-visible:outline-none max-h-[140px] leading-relaxed ${text ? 'overflow-y-auto' : 'overflow-hidden'}`}
          />

          {/* Character warning indicator when approaching cap */}
          {isNearLimit && (
            <span
              className={`mb-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
                remaining <= 10
                  ? 'bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400'
                  : 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
              }`}
              aria-live="polite"
            >
              {remaining}
            </span>
          )}

          {/* Send Button */}
          <button
            type="submit"
            disabled={disabled || !text.trim()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500"
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

