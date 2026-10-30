import React, { useState, memo } from 'react';
import { ThumbsUp, ThumbsDown, Copy, Check, ArrowRight, Sparkles } from 'lucide-react';
import DOMPurify from 'dompurify';
import LpuLogo from './LpuLogo';
import { request } from '../api/client';

const fmt = (d) => {
  if (!d) return 'Just now';
  try {
    const date = typeof d === 'string' || typeof d === 'number' ? new Date(d) : d;
    if (isNaN(date?.getTime?.())) return 'Just now';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return 'Just now';
  }
};

/**
 * Clean & sanitize text through DOMPurify to defend against XSS & payload injections
 */
function sanitizeInput(raw) {
  if (!raw || typeof raw !== 'string') return '';
  try {
    return DOMPurify.sanitize(raw, {
      ALLOWED_TAGS: ['b', 'i', 'strong', 'em', 'span', 'code', 'a', 'p', 'br', 'ul', 'ol', 'li'],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
    });
  } catch {
    return String(raw);
  }
}

/**
 * Format markdown bold **text**, bullet points, and links into clean, sanitized JSX
 */
function FormattedText({ text }) {
  if (!text) return null;
  const rawText = typeof text === "string" ? text : String(text || "");
  const sanitized = sanitizeInput(rawText);

  // Split by newlines
  const lines = sanitized.split('\n');

  return (
    <div className="space-y-1.5 leading-relaxed font-sans">
      {lines.map((line, idx) => {
        if (!line.trim()) {
          return <div key={idx} className="h-1" />;
        }

        // Bullet point check
        const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
        const cleanLine = isBullet ? line.trim().replace(/^[•\-]\s*/, '') : line;

        // Parse bold segments (**bold**)
        const parts = cleanLine.split(/(\*\*.*?\*\*)/g);

        const renderedLine = parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
            return (
              <strong key={pIdx} className="font-bold text-slate-900 dark:text-white">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        });

        if (isBullet) {
          return (
            <div key={idx} className="flex items-start gap-2 text-[13px] sm:text-[13.5px]">
              <span className="text-orange-500 font-bold shrink-0 mt-0.5">•</span>
              <span className="flex-1 text-slate-800 dark:text-slate-200">{renderedLine}</span>
            </div>
          );
        }

        return (
          <p key={idx} className="text-[13px] sm:text-[13.5px] text-slate-800 dark:text-slate-200">
            {renderedLine}
          </p>
        );
      })}
    </div>
  );
}

function ChatMessageComponent({ m, onRetry, onContact }) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'like' | 'dislike'

  if (m.role === 'system') {
    return (
      <div className="my-2 text-center text-xs text-slate-400">
        <span className="inline-block rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1">
          {m.text}
        </span>
      </div>
    );
  }

  const isBot = m.role === 'bot';

  const handleCopy = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(m.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFeedback = (type) => {
    setFeedback(type);
    try {
      request(
        '/api/feedback',
        () => ({ status: 'success', recorded: true }),
        {
          method: 'POST',
          body: JSON.stringify({
            session_id: 'chat_turn',
            is_helpful: type === 'like',
            comment: type === 'like' ? 'Helpful answer' : 'Needs improvement',
          }),
        }
      ).catch(() => {});
    } catch {}
  };

  return (
    <div className={`flex gap-3 animate-fade-up ${isBot ? 'items-start' : 'items-end justify-end'}`}>
      {/* Bot Avatar */}
      {isBot && (
        <div className="shrink-0 mt-1">
          <LpuLogo variant="light" size={28} />
        </div>
      )}

      {/* Bubble Container */}
      <div className={`flex flex-col ${isBot ? 'w-full max-w-full sm:max-w-[94%] items-start' : 'max-w-[85%] sm:max-w-[75%] items-end'}`}>
        <div
          className={`px-4 py-3.5 rounded-2xl shadow-xs transition-all ${
            isBot
              ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200/90 dark:border-slate-800 rounded-tl-sm w-full'
              : 'bg-orange-600 text-white rounded-tr-sm font-medium'
          }`}
        >
          {/* Formatted body */}
          {isBot ? (
            <FormattedText text={m.text} />
          ) : (
            <p className="text-[13px] sm:text-[13.5px] whitespace-pre-wrap leading-relaxed font-sans">{sanitizeInput(m.text)}</p>
          )}

          {/* Action button if needed */}
          {m.action === 'contact' && (
            <button
              type="button"
              onClick={() => onContact && onContact()}
              className="mt-3.5 inline-flex items-center gap-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 px-3.5 py-1.5 text-xs font-bold text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/60 transition-colors shadow-2xs cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none"
            >
              <span>Admissions contact details</span>
              <ArrowRight size={13} />
            </button>
          )}

          {/* Message Footer Utilities for Bot (Copy + Helpful Thumbs) */}
          {isBot && (
            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 gap-2">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                From this site's LPU reference data
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500"
                  title="Copy response"
                  aria-label="Copy response text"
                >
                  {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                </button>

                <div className="h-3 w-[1px] bg-slate-200 dark:bg-slate-800" />

                <button
                  type="button"
                  onClick={() => handleFeedback('like')}
                  className={`p-1 rounded-md transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 ${
                    feedback === 'like' ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  }`}
                  title="Helpful"
                  aria-label="Mark answer as helpful"
                >
                  <ThumbsUp size={13} />
                </button>

                <button
                  type="button"
                  onClick={() => handleFeedback('dislike')}
                  className={`p-1 rounded-md transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 ${
                    feedback === 'dislike' ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  }`}
                  title="Not helpful"
                  aria-label="Mark answer as unhelpful"
                >
                  <ThumbsDown size={13} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <span className="mt-1 text-[10px] font-medium text-slate-400 px-1">
          {fmt(m.time)}
        </span>
      </div>
    </div>
  );
}

const ChatMessage = memo(ChatMessageComponent, (prevProps, nextProps) => {
  return (
    prevProps.m.id === nextProps.m.id &&
    prevProps.m.text === nextProps.m.text &&
    prevProps.m.status === nextProps.m.status &&
    prevProps.m.suggestions === nextProps.m.suggestions
  );
});

export default ChatMessage;
