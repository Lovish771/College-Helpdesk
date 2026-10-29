import { useEffect, useRef } from 'react';
import { Lock, Sparkles, LogIn } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import QuickActions from './QuickActions';
import LpuLogo from './LpuLogo';

export default function ChatWindow({ chat, go, isAuthenticated, onOpenAuth }) {
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [chat.messages, chat.loading]);

  const lastBotMessage = [...chat.messages].reverse().find(m => m.role === 'bot');

  const handlePickSuggestion = (query) => {
    if (!isAuthenticated) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    chat.send(query);
  };

  const handleSendMessage = (text) => {
    if (!isAuthenticated) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    chat.send(text);
  };

  return (
    <div className="flex flex-col h-full w-full min-h-0 bg-[#F8FAFC] dark:bg-slate-950 transition-colors overflow-hidden">
      {/* Scrollable conversation history - Isolated scroll container */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 scrollbar-thin"
        role="log"
        aria-live="polite"
      >
        <div className="mx-auto max-w-3xl space-y-4">
          {chat.messages.map((m) => (
            <ChatMessage
              key={m.id}
              m={m}
              onRetry={(x) => handleSendMessage(x.text)}
              onContact={() => go('contact')}
            />
          ))}

          {/* Suggested follow-up chips */}
          {lastBotMessage?.suggestions && !chat.loading && (
            <QuickActions items={lastBotMessage.suggestions} onPick={handlePickSuggestion} />
          )}

          {/* Typing Indicator */}
          {chat.loading && (
            <div className="flex items-center gap-3 animate-fade-in">
              <div className="shrink-0">
                <LpuLogo size={26} />
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 px-4 py-3 text-xs text-slate-500 dark:text-slate-400 shadow-xs flex items-center gap-1.5">
                <span>Assistant is typing</span>
                <span className="flex gap-1 ml-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="dot h-1.5 w-1.5 rounded-full bg-orange-500 inline-block"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input area fixed at bottom of chat panel */}
      <div className="shrink-0">
        {!isAuthenticated ? (
          <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-lg">
            <div className="mx-auto max-w-3xl flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-2xl bg-orange-50/70 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/40">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Lock size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>Student Login Required to Chat with AI</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] uppercase tracking-wider bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300 font-extrabold">Required</span>
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Verify your email with a 6-digit OTP to start chatting, track enquiry resolution, and receive official admission counselling.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenAuth}
                className="shrink-0 w-full sm:w-auto px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <LogIn size={14} />
                <span>Verify Email &amp; Chat</span>
              </button>
            </div>
          </div>
        ) : (
          <ChatInput onSend={handleSendMessage} disabled={chat.loading} />
        )}
      </div>
    </div>
  );
}
