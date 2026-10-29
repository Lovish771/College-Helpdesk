import { useCallback, useEffect, useRef, useState } from 'react';
import { sendMessage, resetConversation } from '../api/chatbotApi';
import { getStoredItem, setStoredItem } from '../utils/storage';

const uid = () => Math.random().toString(36).slice(2, 10);

const defaultWelcomeChat = () => [
  {
    id: 'welcome-bot',
    role: 'bot',
    text: `Hello! Welcome to the Lovely Professional University (LPU) Student Helpdesk.

I can assist you with:
• Admissions criteria, cutoff & application deadlines (2026-27)
• Per-semester tuition fees & LPUNEST merit scholarship slabs (up to 50% waiver)
• Residential room categories (AC/Air-Cooled), mess plans & laundry
• Curriculum, examination regulations & 75% attendance policy
• Official contact channels for Block 30 (Admissions) & Block 29 (DSR)

What programme or query would you like to explore today?`,
    time: new Date(),
    suggestions: ['B.Tech CSE Fees & Slabs', 'LPUNEST Scholarship Criteria', 'Hostel & Mess Charges', 'DSR Block 29 Contact'],
  },
];

export default function useChat() {
  const [cid, setCid] = useState(uid);
  const [messages, setMessages] = useState(defaultWelcomeChat);
  const [loading, setLoading] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);

  // Schema-validated chat history persistence
  const [history, setHistory] = useState(() => {
    try {
      const saved = getStoredItem('lpu_chat_history');
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  const [errorToast, setErrorToast] = useState('');

  const cidRef = useRef(cid); cidRef.current = cid;
  const msgRef = useRef(messages); msgRef.current = messages;

  // Persist history whenever updated
  useEffect(() => {
    try {
      setStoredItem('lpu_chat_history', history);
    } catch {}
  }, [history]);

  const archiveCurrent = useCallback(() => {
    const m = msgRef.current;
    const firstUserMsg = m.find((x) => x.role === 'user');
    if (firstUserMsg && m.length > 1) {
      setHistory((prev) => {
        const item = {
          id: cidRef.current,
          title: firstUserMsg.text.slice(0, 36) + (firstUserMsg.text.length > 36 ? '...' : ''),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          messages: m,
        };
        const updated = [item, ...prev.filter((x) => x.id !== cidRef.current)];
        return updated.slice(0, 25); // retain last 25 sessions
      });
    }
  }, []);

  const send = useCallback(async (text, retryId) => {
    const t = text.trim(); if (!t) return;
    const id = retryId || uid();
    const patch = (status) => setMessages((m) => m.map((x) => (x.id === id ? { ...x, status } : x)));
    if (retryId) patch('sending');
    else setMessages((m) => [...m.map((x) => ({ ...x, suggestions: undefined })), { id, role: 'user', text: t, time: new Date(), status: 'sending' }]);
    setLoading(true);
    const my = cidRef.current;
    try {
      const r = await sendMessage(t, my);
      if (cidRef.current !== my) return;
      patch('sent');
      setMessages((m) => [...m, {
        id: uid(),
        role: 'bot',
        text: r.reply,
        time: new Date(),
        suggestions: r.suggestions || ['Admission Process', 'Fee Structure', 'Scholarships'],
        action: r.action,
        meta: { intent: r.intent, confidence: r.confidence, requires_slot: r.requires_slot, slot: r.slot }
      }]);
    } catch (e) {
      if (cidRef.current === my) patch('failed');
    } finally {
      if (cidRef.current === my) setLoading(false);
    }
  }, []);

  const startNewChat = useCallback((initialQuery) => {
    archiveCurrent();
    const newCid = uid();
    setCid(newCid);
    cidRef.current = newCid;
    setLoading(false);

    if (initialQuery && initialQuery.trim()) {
      const q = initialQuery.trim();
      const userMsgId = uid();
      setMessages([
        {
          id: userMsgId,
          role: 'user',
          text: q,
          time: new Date(),
          status: 'sending',
        },
      ]);
      setLoading(true);

      sendMessage(q, newCid)
        .then((r) => {
          if (cidRef.current !== newCid) return;
          setMessages([
            {
              id: userMsgId,
              role: 'user',
              text: q,
              time: new Date(),
              status: 'sent',
            },
            {
              id: uid(),
              role: 'bot',
              text: r.reply,
              time: new Date(),
              suggestions: r.suggestions || ['Admission Process', 'Fee Structure', 'Scholarships'],
              action: r.action,
              meta: { intent: r.intent, confidence: r.confidence, requires_slot: r.requires_slot, slot: r.slot },
            },
          ]);
        })
        .catch(() => {
          if (cidRef.current !== newCid) return;
          setMessages((m) => m.map((x) => (x.id === userMsgId ? { ...x, status: 'failed' } : x)));
        })
        .finally(() => {
          if (cidRef.current === newCid) setLoading(false);
        });
    } else {
      setMessages(defaultWelcomeChat());
    }
  }, [archiveCurrent]);

  const newChat = useCallback(() => {
    startNewChat();
  }, [startNewChat]);

  // Permanently delete a single conversation
  const deleteConversation = useCallback(async (sessionId) => {
    try {
      const token = getStoredItem('lpu_auth_token');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      const res = await fetch(`/api/conversations/${sessionId}`, {
        method: 'DELETE',
        headers
      });

      if (!res.ok) {
        throw new Error('Failed to delete conversation from server');
      }

      setHistory((prev) => prev.filter((item) => item.id !== sessionId));
      if (cidRef.current === sessionId) {
        startNewChat();
      }
      return true;
    } catch (err) {
      console.error('Delete conversation error:', err);
      setErrorToast('Failed to delete conversation from server. Retaining chat history.');
      return false;
    }
  }, [startNewChat]);

  // Permanently clear all conversation history
  const clearAllHistory = useCallback(async () => {
    try {
      const token = getStoredItem('lpu_auth_token');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`/api/conversations?conversation_id=${cidRef.current}`, {
        method: 'DELETE',
        headers
      });

      if (!res.ok) {
        throw new Error('Server failed to clear conversation records');
      }

      setHistory([]);
      const newCid = uid();
      setCid(newCid);
      cidRef.current = newCid;
      setLoading(false);
      setMessages(defaultWelcomeChat());
      return true;
    } catch (err) {
      console.error('Clear all history error:', err);
      setErrorToast('Failed to delete records from server. Chat history preserved.');
      return false;
    }
  }, []);

  const open = useCallback((h) => {
    archiveCurrent();
    setCid(h.id);
    cidRef.current = h.id;
    setLoading(false);
    setMessages(h.messages);
  }, [archiveCurrent]);

  useEffect(() => {
    const a = () => setOnline(true);
    const b = () => setOnline(false);
    window.addEventListener('online', a);
    window.addEventListener('offline', b);
    return () => {
      window.removeEventListener('online', a);
      window.removeEventListener('offline', b);
    };
  }, []);

  return {
    messages,
    loading,
    history,
    online,
    errorToast,
    clearErrorToast: () => setErrorToast(''),
    send,
    newChat,
    startNewChat,
    clear: clearAllHistory,
    deleteConversation,
    clearAllHistory,
    open
  };
}
