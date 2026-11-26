import React, { useState, memo } from 'react';
import { ThumbsUp, ThumbsDown, Copy, Check, ArrowRight, RotateCcw } from 'lucide-react';
import DOMPurify from 'dompurify';
import LpuLogo from './LpuLogo';
import { request } from '../api/client';
import { formatISTTime } from '../utils/dateUtils';

const fmt = (d) => formatISTTime(d);

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
 * Render inline markdown (**bold**, `code`, [label](https://...)) safely
 */
function renderInline(text) {
  const parts = text.split(/(\*\*.*?\*\*|`[^`]+`|\[[^\]]+\]\(https?:\/\/[^\s)]+\))/g);
  return parts.map((part, pIdx) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={pIdx} className="font-bold text-slate-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code
          key={pIdx}
          className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-orange-700 dark:text-orange-300 font-mono text-[12px]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={pIdx}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange-600 dark:text-orange-400 underline underline-offset-2 hover:text-orange-700 dark:hover:text-orange-300 font-medium"
        >
          {linkMatch[1]}
        </a>
      );
    }
    return part;
  });
}

/**
 * Format markdown headings, bold text, bullet/numbered lists, and links into clean, sanitized JSX
 */
function FormattedText({ text }) {
  if (!text) return null;
  const rawText = typeof text === "string" ? text : String(text || "");
  const sanitized = sanitizeInput(rawText);
  const lines = sanitized.split('\n');

  return (
    <div className="space-y-1.5 leading-relaxed font-sans">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        if (/^-{3,}$/.test(trimmed)) {
          return <hr key={idx} className="border-slate-200 dark:border-slate-800 my-2" />;
        }

        const headingMatch = trimmed.match(/^#{1,4}\s+(.*)$/);
        if (headingMatch) {
          return (
            <h4 key={idx} className="text-[13.5px] sm:text-sm font-bold text-slate-900 dark:text-white pt-1">
              {renderInline(headingMatch[1])}
            </h4>
          );
        }

        const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (numberedMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 text-[13px] sm:text-[13.5px]">
              <span className="text-orange-600 dark:text-orange-400 font-bold shrink-0 min-w-[1.1rem]">
                {numberedMatch[1]}.
              </span>
              <span className="flex-1 text-slate-800 dark:text-slate-200">{renderInline(numberedMatch[2])}</span>
            </div>
          );
        }

        const isBullet = trimmed.startsWith('•') || trimmed.startsWith('- ');
        if (isBullet) {
          const cleanLine = trimmed.replace(/^[•\-]\s*/, '');
          return (
            <div key={idx} className="flex items-start gap-2 text-[13px] sm:text-[13.5px]">
              <span className="text-orange-500 font-bold shrink-0 mt-0.5">•</span>
              <span className="flex-1 text-slate-800 dark:text-slate-200">{renderInline(cleanLine)}</span>
            </div>
          );
        }

        return (
          <p key={idx} className="text-[13px] sm:text-[13.5px] text-slate-800 dark:text-slate-200">
            {renderInline(line)}
          </p>
        );
      })}
    </div>
  );
}

function ChatMessageComponent({ m, sessionId, onRetry, onContact }) {
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
            session_id: sessionId || 'chat_turn',
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
          className={`px-4 py-3.5 rounded-2xl shadow-xs transition-colors ${
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

        {/* Timestamp & Retry */}
        <div className="mt-1 flex items-center gap-2 px-1">
          <span className="text-[10px] font-medium text-slate-400">
            {fmt(m.time)}
          </span>
          {!isBot && m.status === 'error' && onRetry && (
            <button
              type="button"
              onClick={() => onRetry(m)}
              className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
            >
              <RotateCcw size={10} />
              <span>Retry</span>
            </button>
          )}
        </div>
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
