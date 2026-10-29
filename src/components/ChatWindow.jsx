import { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import QuickActions from './QuickActions';
import LpuLogo from './LpuLogo';

export default function ChatWindow({ chat, go }) {
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
              onRetry={(x) => chat.send(x.text, x.id)}
              onContact={() => go('contact')}
            />
          ))}

          {/* Suggested follow-up chips */}
          {lastBotMessage?.suggestions && !chat.loading && (
            <QuickActions items={lastBotMessage.suggestions} onPick={chat.send} />
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
        <ChatInput onSend={chat.send} disabled={chat.loading} />
      </div>
    </div>
  );
}
