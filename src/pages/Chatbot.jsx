import React, { useEffect, useRef, useState } from 'react';
import {
  Plus, Menu, X, Trash2, HelpCircle,
  MessageSquare, Sparkles, PhoneCall, Clock,
  AlertTriangle, CheckCircle2, ShieldAlert
} from 'lucide-react';
import ChatWindow from '../components/ChatWindow';

const COMMON_TOPICS = [
  { id: 't1', title: 'B.Tech CSE Fees & Cutoff', query: 'What are the eligibility criteria and fees for B.Tech CSE at LPU?' },
  { id: 't2', title: 'LPUNEST 50% Scholarships', query: 'What are the LPUNEST scholarship slabs and eligibility criteria?' },
  { id: 't3', title: 'Hostel AC & Mess Charges', query: 'What are the hostel room and mess charges at LPU?' },
  { id: 't4', title: 'MBA Mittal School Cutoff', query: 'What is the MBA admission process and cutoff at Mittal School of Business?' },
];

export default function Chatbot({ chat, go, pending, clearPending }) {
  const [drawer, setDrawer] = useState(false);
  const done = useRef(null);

  // Confirmation dialog state: null | { type: 'single', session: item } | { type: 'all' }
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // When redirected from any "Ask AI..." button across the site, start a fresh new chat session
  useEffect(() => {
    if (!pending) {
      done.current = null;
      return;
    }
    if (done.current === pending) return;
    done.current = pending;
    chat.startNewChat(pending);
    clearPending();
  }, [pending, chat, clearPending]);

  const act = (fn) => () => {
    setDrawer(false);
    fn();
  };

  const handleConfirmDelete = async () => {
    if (!confirmDialog) return;
    setDeleting(true);
    try {
      if (confirmDialog.type === 'single') {
        await chat.deleteConversation(confirmDialog.session.id);
      } else if (confirmDialog.type === 'all') {
        await chat.clearAllHistory();
      }
      setConfirmDialog(null);
    } finally {
      setDeleting(false);
    }
  };

  const SidebarContent = (
    <div className="flex h-full flex-col justify-between bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-colors">
      <div className="flex flex-col h-full min-h-0">
        {/* + New Chat Button in LPU Orange */}
        <div className="p-3.5 shrink-0">
          <button
            onClick={act(() => chat.startNewChat())}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold text-white shadow-md transition-all hover:brightness-105 active:scale-95 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
            }}
          >
            <Plus size={15} />
            <span>New Enquiry</span>
          </button>
        </div>

        {/* Scrollable Middle Area: Quick Inquiries & Saved History */}
        <div className="flex-1 overflow-y-auto px-3 space-y-4 pb-3">
          {/* Quick Topic Prompts */}
          <div>
            <p className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Common Inquiries
            </p>
            <div className="space-y-1 mt-1">
              {COMMON_TOPICS.map((item) => (
                <button
                  key={item.id}
                  onClick={act(() => chat.startNewChat(item.query))}
                  className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs transition-colors hover:bg-orange-50 dark:hover:bg-slate-800 group cursor-pointer"
                >
                  <MessageSquare size={13} className="text-slate-400 group-hover:text-orange-600 dark:group-hover:text-orange-400 shrink-0" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white truncate">
                    {item.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Saved Sessions (With Individual Delete Option) */}
          {chat.history && chat.history.length > 0 && (
            <div>
              <div className="flex items-center justify-between px-3 py-1.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                  <Clock size={11} />
                  <span>Recent Conversations</span>
                </p>
                <button
                  onClick={() => setConfirmDialog({ type: 'all' })}
                  className="text-[10px] text-red-500 hover:text-red-600 dark:hover:text-red-400 font-bold hover:underline cursor-pointer"
                  title="Clear all saved history"
                >
                  Clear All
                </button>
              </div>
              <div className="space-y-1 mt-1">
                {chat.history.map((h) => (
                  <div
                    key={h.id}
                    className="flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs hover:bg-orange-50/70 dark:hover:bg-slate-800 group transition-colors"
                  >
                    <button
                      onClick={act(() => chat.open(h))}
                      className="flex items-center gap-2 truncate text-left flex-1 min-w-0 cursor-pointer"
                      title={h.title}
                    >
                      <MessageSquare size={12} className="text-slate-400 group-hover:text-orange-600 shrink-0" />
                      <span className="font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white truncate">
                        {h.title}
                      </span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDialog({ type: 'single', session: h });
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 rounded transition-opacity cursor-pointer shrink-0 ml-1"
                      title="Permanently delete conversation"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Footer Controls */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-1 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
        {chat.history && chat.history.length > 0 && (
          <button
            onClick={() => setConfirmDialog({ type: 'all' })}
            className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
          >
            <Trash2 size={13} />
            <span>Clear Chat History</span>
          </button>
        )}
        <button
          onClick={act(() => go('contact'))}
          className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <PhoneCall size={13} />
          <span>Official LPU Helplines</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-[100dvh] w-full overflow-hidden bg-[#F8FAFC] dark:bg-slate-950 transition-colors relative">
      {/* Error Toast if delete fails */}
      {chat.errorToast && (
        <div
          role="alert"
          className="absolute top-4 right-4 z-50 p-3 rounded-2xl bg-rose-600 text-white text-xs shadow-xl flex items-center gap-3 animate-fade-in max-w-sm"
        >
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span className="flex-1 leading-snug">{chat.errorToast}</span>
          <button
            onClick={chat.clearErrorToast}
            className="p-1 rounded-lg hover:bg-rose-700 text-white"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Mobile Drawer Trigger Bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
        <button
          onClick={() => setDrawer(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 cursor-pointer"
        >
          <Menu size={15} />
          <span>Inquiry Topics ({chat.history?.length || 0})</span>
        </button>

        <button
          onClick={() => chat.startNewChat()}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-orange-600 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 cursor-pointer"
        >
          <Plus size={13} />
          <span>New Chat</span>
        </button>
      </div>

      {/* Main Layout: Fixed-Height Decoupled Left Sidebar + Right Chat Window */}
      <div className="flex flex-1 w-full h-full min-h-0 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 h-full overflow-hidden">
          {SidebarContent}
        </aside>

        {/* Mobile Slide-over Drawer */}
        {drawer && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs" onClick={() => setDrawer(false)} />
            <div className="relative w-72 bg-white dark:bg-slate-900 h-full z-10 shadow-2xl flex flex-col animate-slide-in">
              <button
                className="absolute right-3 top-3 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                onClick={() => setDrawer(false)}
                aria-label="Close drawer"
              >
                <X size={18} />
              </button>
              {SidebarContent}
            </div>
          </div>
        )}

        {/* Chat Conversation Main Panel */}
        <main className="flex-1 flex flex-col h-full min-h-0 min-w-0 bg-[#F8FAFC] dark:bg-slate-950 overflow-hidden">
          <ChatWindow chat={chat} go={go} />
        </main>
      </div>

      {/* ── ACCESSIBLE CONFIRMATION DIALOG (FOR CHAT DELETION) ── */}
      {confirmDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-delete-title"
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-2xl bg-rose-100 dark:bg-rose-950/60">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 id="confirm-delete-title" className="font-bold text-base text-slate-900 dark:text-white font-display">
                  {confirmDialog.type === 'single' ? 'Delete Conversation?' : 'Clear All History?'}
                </h4>
                <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider">
                  Permanent Action
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {confirmDialog.type === 'single' ? (
                <>
                  Are you sure you want to permanently delete this conversation (<strong>"{confirmDialog.session?.title}"</strong>)? This will completely erase all messages from the database and local storage. This action cannot be undone.
                </>
              ) : (
                <>
                  Are you sure you want to clear your entire chat history? All recorded conversation sessions will be permanently purged from the database and local storage.
                </>
              )}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setConfirmDialog(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
              >
                <span>{deleting ? 'Deleting...' : 'Permanently Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
