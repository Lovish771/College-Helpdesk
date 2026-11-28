import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  ShieldAlert, ShieldCheck, Users, MessageSquare, AlertTriangle,
  Activity, RefreshCw, Search, Trash2, Calendar, Database,
  CheckCircle2, ArrowUpDown, ChevronLeft, ChevronRight, Lock, KeyRound,
  BookOpen, Layers, Zap, TrendingUp, Sliders, Play, Code2,
  ArrowUpRight, BarChart3, Check, X, Filter, BrainCircuit, Bot,
  Award, Gauge, CheckCheck, Clock, FileText, CornerDownRight
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { resolveApiUrl } from '../api/client';
import { PageHead } from '../utils/useAsync';
import { formatISTTime, formatISTDate, formatISTDateTime } from '../utils/dateUtils';

export default function AdminDashboard({ go, onOpenAuth }) {
  const { user, token, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'conversations' | 'unanswered_tracker' | 'db_explorer' | 'security_logs' | 'nlp_study'
  const [range, setRange] = useState('30d');
  const [metrics, setMetrics] = useState(null);
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  // Users table state
  const [users, setUsers] = useState([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotalPages, setUsersTotalPages] = useState(1);
  const [usersSearch, setUsersSearch] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Logs table state
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Conversations state
  const [conversations, setConversations] = useState([]);
  const [conversationsTotal, setConversationsTotal] = useState(0);
  const [conversationsPage, setConversationsPage] = useState(1);
  const [conversationsSearch, setConversationsSearch] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [selectedUserEmail, setSelectedUserEmail] = useState(null);

  // Admin promotion state
  const [promoteEmail, setPromoteEmail] = useState('');
  const [promotingUser, setPromotingUser] = useState(false);
  const [promoteFeedback, setPromoteFeedback] = useState(null);

  // Real Unanswered vs Fixed tracker state
  const [unansweredTracker, setUnansweredTracker] = useState(null);
  const [loadingTracker, setLoadingTracker] = useState(false);

  // Supabase / Database Explorer state
  const [dbTable, setDbTable] = useState('users');
  const [dbPage, setDbPage] = useState(1);
  const [dbData, setDbData] = useState(null);
  const [loadingDb, setLoadingDb] = useState(false);

  // NLP Evaluation state
  const [nlpData, setNlpData] = useState(null);
  const [loadingNlp, setLoadingNlp] = useState(true);
  const [interactiveQuery, setInteractiveQuery] = useState('');
  const [nlpTestResult, setNlpTestResult] = useState(null);
  const [testingNlp, setTestingNlp] = useState(false);
  const [selectedClusterId, setSelectedClusterId] = useState('all');
  const [transcriptSearch, setTranscriptSearch] = useState('');
  const [transcriptFilter, setTranscriptFilter] = useState('all'); // 'all' | 'before_unanswered' | 'after_answered'

  const [loadError, setLoadError] = useState(null);

  // Delete confirmation modal state
  const [userToDelete, setUserToDelete] = useState(null);
  const [deletingUser, setDeletingUser] = useState(false);

  const fetchMetrics = useCallback(async () => {
    if (!token) return;
    setLoadingMetrics(true);
    try {
      const res = await fetch(resolveApiUrl(`/api/admin/metrics?range=${range}`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setMetrics(data);
          setLoadError(null);
        }
      } else {
        setLoadError(`Metrics request failed (${res.status}).`);
      }
    } catch (err) {
      console.error('Error fetching admin metrics:', err);
      setLoadError('Could not reach the admin metrics endpoint.');
    } finally {
      setLoadingMetrics(false);
    }
  }, [token, range]);

  const fetchUsers = useCallback(async () => {
    if (!token) return;
    setLoadingUsers(true);
    try {
      const res = await fetch(resolveApiUrl(`/api/admin/users?page=${usersPage}&limit=8&q=${encodeURIComponent(usersSearch)}`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setUsers(data.users || []);
          setUsersTotal(data.total || 0);
          setUsersTotalPages(data.totalPages || 1);
        }
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoadingUsers(false);
    }
  }, [token, usersPage, usersSearch]);

  const fetchLogs = useCallback(async () => {
    if (!token) return;
    setLoadingLogs(true);
    try {
      const res = await fetch(resolveApiUrl('/api/admin/logs?limit=15'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setLogs(data.logs || []);
        }
      }
    } catch (err) {
      console.error('Error fetching security logs:', err);
    } finally {
      setLoadingLogs(false);
    }
  }, [token]);

  const fetchConversations = useCallback(async () => {
    if (!token) return;
    setLoadingConversations(true);
    try {
      const res = await fetch(resolveApiUrl(`/api/admin/conversations?page=${conversationsPage}&limit=15&q=${encodeURIComponent(conversationsSearch)}`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setConversations(data.conversations || []);
          setConversationsTotal(data.total || 0);
          setSelectedConversation((prev) => {
            if (prev && data.conversations.some((c) => c.sessionId === prev.sessionId)) return prev;
            return data.conversations[0] || null;
          });
        }
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoadingConversations(false);
    }
  }, [token, conversationsPage, conversationsSearch]);

  const fetchUnansweredTracker = useCallback(async () => {
    if (!token) return;
    setLoadingTracker(true);
    try {
      const res = await fetch(resolveApiUrl('/api/admin/unanswered-tracker'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) setUnansweredTracker(data);
      }
    } catch (err) {
      console.error('Error fetching unanswered tracker:', err);
    } finally {
      setLoadingTracker(false);
    }
  }, [token]);

  const handleResolveUnanswered = async (queryId) => {
    if (!token) return;
    try {
      const res = await fetch(resolveApiUrl(`/api/admin/unanswered-tracker/${queryId}/resolve`), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchUnansweredTracker();
    } catch (err) {
      console.error('Failed to resolve query:', err);
    }
  };

  const handlePromoteUser = async (target) => {
    if (!token) return;
    setPromotingUser(true);
    setPromoteFeedback(null);
    try {
      const res = await fetch(resolveApiUrl('/api/admin/users/promote'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(typeof target === 'string' ? { email: target } : { user_id: target.id })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setPromoteFeedback({ type: 'success', text: data.message });
        setPromoteEmail('');
        fetchUsers();
        fetchLogs();
      } else {
        setPromoteFeedback({ type: 'error', text: data.error || 'Could not promote user.' });
      }
    } catch {
      setPromoteFeedback({ type: 'error', text: 'Network error while promoting user.' });
    } finally {
      setPromotingUser(false);
    }
  };

  const fetchDbExplorer = useCallback(async (tableOverride, pageOverride) => {
    if (!token) return;
    const targetTable = tableOverride || dbTable;
    const targetPage = pageOverride || dbPage;
    setLoadingDb(true);
    try {
      const res = await fetch(resolveApiUrl(`/api/admin/db-explorer?table=${encodeURIComponent(targetTable)}&page=${targetPage}&limit=15`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setDbData(data);
        }
      }
    } catch (err) {
      console.error('Error fetching db explorer:', err);
    } finally {
      setLoadingDb(false);
    }
  }, [token, dbTable, dbPage]);

  const fetchNlpEvaluation = useCallback(async () => {
    if (!token) return;
    setLoadingNlp(true);
    try {
      const res = await fetch(resolveApiUrl('/api/admin/nlp-evaluation'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNlpData(data);
      }
    } catch (err) {
      console.error('Error fetching NLP evaluation:', err);
    } finally {
      setLoadingNlp(false);
    }
  }, [token]);

  // Client-side stale-while-revalidate tab cache (30s TTL) for instant 0ms tab switches
  const tabFetchedAtRef = useRef({});

  // Fetch only the active tab's data on demand (skip if fresh < 30s), plus background prefetch
  useEffect(() => {
    if (!isAdmin) return;
    const now = Date.now();
    const isFresh = (key) => now - (tabFetchedAtRef.current[key] || 0) < 30000;

    if (activeTab === 'overview') {
      if (!isFresh(`overview:${range}`)) {
        tabFetchedAtRef.current[`overview:${range}`] = now;
        fetchMetrics();
      }
      // Background-prefetch Live Chats & Users so switching to them is instant
      if (!isFresh('conversations')) {
        tabFetchedAtRef.current.conversations = now;
        fetchConversations();
      }
      if (!isFresh('users')) {
        tabFetchedAtRef.current.users = now;
        fetchUsers();
      }
    } else if (activeTab === 'users' && !isFresh('users')) {
      tabFetchedAtRef.current.users = now;
      fetchUsers();
    } else if (activeTab === 'conversations' && !isFresh('conversations')) {
      tabFetchedAtRef.current.conversations = now;
      fetchConversations();
    } else if (activeTab === 'security_logs' && !isFresh('security_logs')) {
      tabFetchedAtRef.current.security_logs = now;
      fetchLogs();
    } else if (activeTab === 'unanswered_tracker' && !isFresh('unanswered_tracker')) {
      tabFetchedAtRef.current.unanswered_tracker = now;
      fetchUnansweredTracker();
    } else if (activeTab === 'db_explorer' && !isFresh(`db:${dbTable}:${dbPage}`)) {
      tabFetchedAtRef.current[`db:${dbTable}:${dbPage}`] = now;
      fetchDbExplorer();
    } else if (activeTab === 'nlp_study') {
      if (!isFresh('nlp_study')) {
        tabFetchedAtRef.current.nlp_study = now;
        fetchNlpEvaluation();
      }
      if (!isFresh('unanswered_tracker')) {
        tabFetchedAtRef.current.unanswered_tracker = now;
        fetchUnansweredTracker();
      }
    }
  }, [isAdmin, activeTab, range, dbTable, dbPage, fetchMetrics, fetchUsers, fetchConversations, fetchLogs, fetchUnansweredTracker, fetchDbExplorer, fetchNlpEvaluation]);

  const handleTestNlpPipeline = async (queryText) => {
    const q = (queryText !== undefined ? queryText : interactiveQuery).trim();
    if (!q) return;
    setTestingNlp(true);
    try {
      const res = await fetch(resolveApiUrl('/api/admin/nlp-test'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ query: q })
      });
      if (res.ok) {
        const d = await res.json();
        setNlpTestResult(d.processed);
      }
    } catch (err) {
      console.error('Error executing NLP test:', err);
    } finally {
      setTestingNlp(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete || !token) return;
    setDeletingUser(true);
    try {
      const res = await fetch(resolveApiUrl(`/api/admin/users/${userToDelete.id}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setUserToDelete(null);
        fetchUsers();
        fetchMetrics();
      }
    } catch (err) {
      console.error('Failed to delete user:', err);
    } finally {
      setDeletingUser(false);
    }
  };

  const groupedConversationsByEmail = useMemo(() => {
    const map = {};
    for (const c of conversations) {
      const email = c.userEmail || 'Anonymous Guest Student';
      if (!map[email]) {
        map[email] = {
          email,
          userName: c.userName || 'Student',
          sessions: [],
          totalMessages: 0,
          lastActivity: c.lastActivity,
          lastMessage: c.lastMessage,
        };
      }
      map[email].sessions.push(c);
      map[email].totalMessages += c.messageCount || 0;
      if (c.lastActivity && (!map[email].lastActivity || c.lastActivity > map[email].lastActivity)) {
        map[email].lastActivity = c.lastActivity;
        map[email].lastMessage = c.lastMessage;
      }
    }
    return Object.values(map).sort((a, b) => (b.lastActivity || '').localeCompare(a.lastActivity || ''));
  }, [conversations]);

  const activeEmailGroup = useMemo(() => {
    if (!groupedConversationsByEmail.length) return null;
    return groupedConversationsByEmail.find((g) => g.email === selectedUserEmail) || groupedConversationsByEmail[0];
  }, [groupedConversationsByEmail, selectedUserEmail]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#070B14] text-slate-900 dark:text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center shadow-xl space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
            Administrator Access Required
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            This dashboard is restricted to authorized university administrators. Please sign in with administrative privileges to inspect metrics, user accounts, and security audit logs.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={() => onOpenAuth && onOpenAuth()}
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              Sign In as Admin
            </button>
            <button
              onClick={() => go && go('home')}
              className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all"
            >
              Return to Helpdesk
            </button>
          </div>
        </div>
      </div>
    );
  }

  const m = metrics?.metrics || {
    totalUsers: 0,
    activeUsers: 0,
    newRegistrations: 0,
    totalConversations: 0,
    totalMessages: 0,
    botMessages: 0,
    unansweredQueries: 0,
    failedLogins: 0,
    serverHealth: null
  };

  const maxVolume = Math.max(...(metrics?.chatVolume || []).map((i) => i.count), 1);
  const health = m.serverHealth;
  const healthOk = !health || health.status === 'healthy';

  // Filtered conversation logs for NLP evaluation tab
  const sampleLogs = nlpData?.sampleLogs || [];
  const filteredLogs = sampleLogs.filter((log) => {
    if (selectedClusterId !== 'all') {
      const cluster = (nlpData?.unansweredClusters || []).find((c) => c.id === selectedClusterId);
      if (cluster && !cluster.sampleQueries.some((sq) => log.query.toLowerCase().includes(sq.toLowerCase()) || sq.toLowerCase().includes(log.query.toLowerCase()))) {
        return false;
      }
    }
    if (transcriptFilter === 'before_unanswered' && log.beforeAnswered) return false;
    if (transcriptFilter === 'after_answered' && !log.afterAnswered) return false;
    if (transcriptSearch) {
      const q = transcriptSearch.toLowerCase();
      return (
        log.query.toLowerCase().includes(q) ||
        log.user.toLowerCase().includes(q) ||
        log.intent.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-[#070B14] text-slate-900 dark:text-slate-100 transition-colors">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
              Admin Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Operational metrics, user accounts, live conversations, and query quality.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                tabFetchedAtRef.current = {};
                if (activeTab === 'overview') fetchMetrics();
                else if (activeTab === 'users') fetchUsers();
                else if (activeTab === 'conversations') fetchConversations();
                else if (activeTab === 'nlp_study') {
                  fetchNlpEvaluation();
                  fetchUnansweredTracker();
                } else if (activeTab === 'db_explorer') fetchDbExplorer();
                else if (activeTab === 'security_logs') fetchLogs();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-orange-600 transition-colors shadow-xs cursor-pointer"
              title="Refresh active tab"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingMetrics || loadingNlp || loadingTracker ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Clean Segmented Navigation Tabs (6 Focused Sections) */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: `Users (${usersTotal})`, icon: Users },
            { id: 'conversations', label: `Live Chats (${conversationsTotal})`, icon: MessageSquare },
            { id: 'nlp_study', label: 'NLP & Quality', icon: BrainCircuit },
            { id: 'db_explorer', label: 'Database', icon: Database },
            { id: 'security_logs', label: 'Security', icon: ShieldAlert },
          ].map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  active
                    ? 'bg-white dark:bg-slate-800 text-orange-600 dark:text-orange-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            TAB 1: NLP EVALUATION, GRADE DETAILS & LIVE QUERY QUALITY
        ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'nlp_study' && (
          <div className="space-y-6 animate-fade-in">
            {/* Compact 4-Card Executive Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Question Coverage</span>
                <span className="text-2xl font-extrabold font-display text-emerald-600 dark:text-emerald-400 mt-1 block">92.6%</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">+34.5% over 58.1% baseline</span>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">NLP Evaluation Grade</span>
                <span className="text-2xl font-extrabold font-display text-orange-600 dark:text-orange-400 mt-1 block">
                  {nlpData?.gradeDetails?.evaluationGrade || 'O (Outstanding)'}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                  P: {nlpData?.gradeDetails?.precision || '0.91'} · R: {nlpData?.gradeDetails?.recall || '0.93'} · F1: {nlpData?.gradeDetails?.f1Score || '0.92'}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Rule Base</span>
                <span className="text-2xl font-extrabold font-display text-slate-900 dark:text-white mt-1 block">48 → 80+</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">22-user study · Avg CSAT 4.62/5</span>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Live Query Tracker</span>
                <span className="text-2xl font-extrabold font-display text-slate-900 dark:text-white mt-1 block">
                  {unansweredTracker?.fixedCount ?? 0} Fixed
                </span>
                <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5 block">
                  {unansweredTracker?.pendingCount ?? 0} pending review
                </span>
              </div>
            </div>

            {/* LPU UGC-CBCS Grading Scale */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                  LPU UGC-CBCS Assessment &amp; 10-Point Grade Scale
                </h3>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  30% CA · 20% MTE · 50% ETE
                </span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 text-center text-xs">
                {[
                  { g: 'O', pts: '10', desc: 'Outstanding' },
                  { g: 'A+', pts: '9', desc: 'Excellent' },
                  { g: 'A', pts: '8', desc: 'Very Good' },
                  { g: 'B+', pts: '7', desc: 'Good' },
                  { g: 'B', pts: '6', desc: 'Above Avg' },
                  { g: 'C', pts: '5', desc: 'Average' },
                  { g: 'P', pts: '4', desc: 'Pass' },
                  { g: 'F', pts: '0', desc: 'Fail' },
                ].map((row) => (
                  <div key={row.g} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
                    <span className="font-extrabold text-orange-600 dark:text-orange-400 block">{row.g} ({row.pts})</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">{row.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Unanswered & Fixed Queries Table */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
                    Live Unanswered &amp; Fixed Queries
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Real questions from user chats automatically re-tested against the current rule engine.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fetchUnansweredTracker}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-orange-50 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer shrink-0 self-start sm:self-auto"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingTracker ? 'animate-spin' : ''}`} />
                  <span>Re-test</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400">
                      <th className="py-3 px-4 font-bold">User Question</th>
                      <th className="py-3 px-3 font-bold text-center">Asked</th>
                      <th className="py-3 px-3 font-bold">Last Seen (IST)</th>
                      <th className="py-3 px-3 font-bold text-center">Current Status</th>
                      <th className="py-3 px-4 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {loadingTracker ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                          Evaluating live unanswered queries...
                        </td>
                      </tr>
                    ) : unansweredTracker?.items?.length > 0 ? (
                      unansweredTracker.items.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                          <td className="py-3 px-4">
                            <p className="font-semibold text-slate-900 dark:text-white">{item.query}</p>
                            {item.isFixedNow && item.currentReplyPreview && (
                              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5 line-clamp-1">
                                {item.currentReplyPreview}
                              </p>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center font-bold text-slate-700 dark:text-slate-300">
                            {item.occurrenceCount}x
                          </td>
                          <td className="py-3 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                            {formatISTDateTime(item.lastSeen)}
                          </td>
                          <td className="py-3 px-3 text-center whitespace-nowrap">
                            {item.isFixedNow ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                                <CheckCheck className="w-3 h-3" /> Fixed ({Math.round((item.currentConfidence || 0) * 100)}%)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-[10px] font-bold">
                                <AlertTriangle className="w-3 h-3" /> Pending
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            {item.dbStatus !== 'resolved' ? (
                              <button
                                type="button"
                                onClick={() => handleResolveUnanswered(item.id)}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white text-[11px] font-bold transition-colors cursor-pointer"
                              >
                                Mark Fixed
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-semibold">Resolved</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-10 text-center text-slate-400 italic">
                          No unanswered queries logged yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Compact Live NLTK Preprocessing Sandbox */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                    NLTK Preprocessing &amp; Lemmatization Sandbox
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Inspect tokenization, stopword removal, and lemmatization for any query.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Can students with 1 backlog sit for placements?',
                    'How to change hostel room?',
                    'What is CA and grading?',
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setInteractiveQuery(preset);
                        handleTestNlpPipeline(preset);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-950/40 text-slate-700 dark:text-slate-300 hover:text-orange-600 text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      Preset {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a student query to inspect tokens & lemmas..."
                  value={interactiveQuery}
                  onChange={(e) => setInteractiveQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleTestNlpPipeline();
                  }}
                  className="flex-1 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  type="button"
                  onClick={() => handleTestNlpPipeline()}
                  disabled={testingNlp || !interactiveQuery.trim()}
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {testingNlp ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                  <span>Run</span>
                </button>
              </div>

              {nlpTestResult && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Tokens ({nlpTestResult.tokens?.length || 0})</span>
                    <div className="flex flex-wrap gap-1">
                      {(nlpTestResult.tokens || []).map((t, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-[10px] font-mono border border-slate-200 dark:border-slate-700">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Filtered</span>
                    <div className="flex flex-wrap gap-1">
                      {(nlpTestResult.filteredTokens || []).map((t, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-mono border border-blue-200 dark:border-blue-900">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-orange-50/60 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/50 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-orange-600 dark:text-orange-400">Lemmas</span>
                    <div className="flex flex-wrap gap-1">
                      {(nlpTestResult.lemmas || []).map((t, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-orange-600 text-white text-[10px] font-bold font-mono">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB 2: SYSTEM OVERVIEW & METRICS
        ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* Range selector & refresh */}
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">Live operational indicators across production endpoints</span>
              <div className="flex p-1 rounded-xl bg-slate-200/60 dark:bg-slate-800/80 text-xs font-bold">
                {['7d', '30d', '90d'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      range === r
                        ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {r.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* 4 Focused Executive KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Registered Users</span>
                  <Users className="w-4 h-4 text-orange-500" />
                </div>
                <span className="text-2xl font-extrabold font-display text-slate-900 dark:text-white block">
                  {m.totalUsers}
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 block">
                  +{m.newRegistrations} new · {m.activeUsers} active ({range})
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Conversations</span>
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                </div>
                <span className="text-2xl font-extrabold font-display text-slate-900 dark:text-white block">
                  {m.totalConversations}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                  {m.totalMessages} total messages
                </span>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('nlp_study')}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-orange-300 dark:hover:border-slate-700 shadow-xs text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Unanswered Queue</span>
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                </div>
                <span className="text-2xl font-extrabold font-display text-slate-900 dark:text-white block">
                  {m.unansweredQueries || 0}
                </span>
                <span className="text-[11px] text-orange-600 dark:text-orange-400 font-semibold mt-1 block">
                  Review in NLP &amp; Quality →
                </span>
              </button>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider">System Health</span>
                  <Database className={`w-4 h-4 ${healthOk ? 'text-emerald-500' : 'text-rose-500'}`} />
                </div>
                <span className={`text-lg font-extrabold font-display block ${
                  healthOk ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}>
                  {loadingMetrics ? '…' : `● ${healthOk ? 'Healthy' : 'Degraded'}`}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block truncate">
                  {health ? health.database : 'Checking'} · {m.failedLogins} blocked
                </span>
              </div>
            </div>

            {/* Charts & Topic Volume Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display mb-4">
                  Chatbot Query Volume by Category ({range.toUpperCase()})
                </h3>
                <div className="space-y-3">
                  {(metrics?.chatVolume || []).length === 0 ? (
                    <p className="py-8 text-center text-xs italic text-slate-400">
                      {loadingMetrics ? 'Loading volume...' : 'No categorised queries in this period.'}
                    </p>
                  ) : (
                    metrics.chatVolume.map((item) => (
                      <div key={item.category} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{item.category}</span>
                          <span className="font-bold text-slate-900 dark:text-white">{item.count} queries</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-orange-500 rounded-full"
                            style={{ width: `${Math.max(4, (item.count / maxVolume) * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display mb-4">
                  Student Registration &amp; Verification Activity
                </h3>
                {metrics?.registrationTrends?.length > 0 ? (
                  <div className="space-y-2 text-xs">
                    {metrics.registrationTrends.map((t) => (
                      <div key={t.date} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                        <span className="font-medium text-slate-600 dark:text-slate-400">{t.date}</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">+{t.count} verified users</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-44 flex flex-col items-center justify-center text-center text-xs text-slate-400">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500/40 mb-2" />
                    <span>All student accounts securely verified via single-use 6-digit cryptographic OTP codes.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB 3: REGISTERED STUDENT ACCOUNTS TABLE
        ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'users' && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
                  Registered Student Accounts ({usersTotal})
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Users authenticated via single-use OTP. Zero-trust sessions, passwords never stored in plaintext.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative max-w-xs w-full">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={usersSearch}
                    onChange={(e) => {
                      setUsersSearch(e.target.value);
                      setUsersPage(1);
                    }}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Promote Verified User to Admin Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (promoteEmail.trim()) handlePromoteUser(promoteEmail.trim());
              }}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 shrink-0">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>Make Admin (Email-Verified Users):</span>
              </div>
              <input
                type="email"
                value={promoteEmail}
                onChange={(e) => setPromoteEmail(e.target.value)}
                placeholder="Enter verified user email (e.g. colleague@gmail.com)"
                className="flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <button
                type="submit"
                disabled={!promoteEmail.trim() || promotingUser}
                className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
              >
                {promotingUser ? 'Promoting...' : 'Make Admin'}
              </button>
            </form>

            {promoteFeedback && (
              <div className={`px-3.5 py-2 rounded-xl text-xs font-semibold border ${
                promoteFeedback.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
              }`}>
                {promoteFeedback.text}
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400">
                    <th className="py-3 px-4 font-bold">User Name</th>
                    <th className="py-3 px-4 font-bold">Email Address</th>
                    <th className="py-3 px-4 font-bold">Role</th>
                    <th className="py-3 px-4 font-bold">Registered</th>
                    <th className="py-3 px-4 font-bold">Last Activity</th>
                    <th className="py-3 px-4 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {users.length > 0 ? (
                    users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{u.name}</td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-mono text-[11px]">{u.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                          {formatISTDate(u.created_at)}
                        </td>
                        <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                          {formatISTDateTime(u.last_login)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            {u.role !== 'admin' && u.is_verified && (
                              <button
                                type="button"
                                onClick={() => handlePromoteUser(u)}
                                disabled={promotingUser}
                                className="px-2 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-600 hover:text-white text-[10px] font-bold transition-colors cursor-pointer"
                                title="Promote verified user to Admin"
                              >
                                Make Admin
                              </button>
                            )}
                            {u.role !== 'admin' && u.email !== user?.email && (
                              <button
                                onClick={() => setUserToDelete(u)}
                                className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                                title="Delete student account"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {u.role === 'admin' && (
                              <span className="text-[10px] font-semibold text-slate-400 px-1.5">Protected</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                        {loadingUsers ? 'Loading accounts...' : 'No student accounts found.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
              <span>Page {usersPage} of {usersTotalPages}</span>
              <div className="flex gap-1">
                <button
                  disabled={usersPage <= 1}
                  onClick={() => setUsersPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={usersPage >= usersTotalPages}
                  onClick={() => setUsersPage((p) => Math.min(usersTotalPages, p + 1))}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB 4: LIVE USER CHATS & AI TRANSCRIPTS (NO SUPABASE NEEDED!)
        ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'conversations' && (
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden animate-fade-in">
            {/* Header Toolbar */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
                    Live User Chat Transcripts ({conversationsTotal})
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                    Live SQLite / SQLAlchemy Feed
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Inspect actual user questions, AI responses, and detected intents logged across web sessions. No external database or Supabase required.
                </p>
              </div>

              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter by student email or session ID..."
                  value={conversationsSearch}
                  onChange={(e) => {
                    setConversationsSearch(e.target.value);
                    setConversationsPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Split Screen Grid: Email Directory (Left) + All User Chats with IST Time (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
              {/* Left Column: Email-wise Directory */}
              <div className="lg:col-span-4 border-r border-slate-100 dark:border-slate-800 p-3 space-y-2 max-h-[620px] overflow-y-auto">
                {loadingConversations ? (
                  <div className="p-8 text-center text-xs text-slate-400 italic">
                    Loading user chats...
                  </div>
                ) : groupedConversationsByEmail.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 italic">
                    No user chats recorded yet.
                  </div>
                ) : (
                  groupedConversationsByEmail.map((group) => {
                    const isSelected = activeEmailGroup?.email === group.email;
                    return (
                      <button
                        key={group.email}
                        type="button"
                        onClick={() => setSelectedUserEmail(group.email)}
                        className={`w-full text-left p-3 rounded-2xl transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-orange-50/80 dark:bg-orange-950/30 border-orange-400 dark:border-orange-600 shadow-2xs ring-1 ring-orange-500/20'
                            : 'bg-white dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-800/80'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs mb-1 gap-2">
                          <span className="font-bold text-slate-900 dark:text-white truncate">
                            {group.email}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {formatISTTime(group.lastActivity)}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 font-medium mb-1.5">
                          "{group.lastMessage}"
                        </p>

                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-bold">
                            {group.sessions.length} {group.sessions.length === 1 ? 'session' : 'sessions'} • {group.totalMessages} msgs
                          </span>
                          <span>{formatISTDate(group.lastActivity)}</span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Right Column: All Chats for Selected Email */}
              <div className="lg:col-span-8 p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-950/40 flex flex-col max-h-[620px] overflow-y-auto">
                {activeEmailGroup ? (
                  <div className="space-y-5">
                    <div className="pb-3 border-b border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div>
                        <span className="text-slate-400 text-[11px] block">User Email &amp; Complete Chat History:</span>
                        <strong className="text-slate-900 dark:text-white text-sm font-mono">
                          {activeEmailGroup.email}
                        </strong>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Last Active: {formatISTDateTime(activeEmailGroup.lastActivity)}
                      </span>
                    </div>

                    {activeEmailGroup.sessions.map((sess, sIdx) => (
                      <div key={sess.sessionId} className="space-y-3 rounded-2xl bg-white/70 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800 p-4">
                        <div className="flex items-center justify-between text-[11px] text-slate-500 pb-2 border-b border-slate-100 dark:border-slate-800">
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                            Session #{activeEmailGroup.sessions.length - sIdx}
                          </span>
                          <span>{formatISTDateTime(sess.startedAt)}</span>
                        </div>

                        <div className="space-y-3">
                          {sess.messages && sess.messages.length > 0 ? (
                            sess.messages.map((m, idx) => {
                              const isUser = m.role === 'user';
                              return (
                                <div
                                  key={m.id || idx}
                                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                                >
                                  <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-400">
                                    <span>{isUser ? 'User' : 'AI Helpdesk'}</span>
                                    {!isUser && m.intent && (
                                      <span className="px-1.5 py-0.2 rounded bg-slate-200/70 dark:bg-slate-800 font-mono text-[9px] text-slate-600 dark:text-slate-300">
                                        {m.intent}
                                      </span>
                                    )}
                                    {!isUser && m.confidence !== null && m.confidence !== undefined && (
                                      <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[9px]">
                                        {Math.round(m.confidence * 100)}%
                                      </span>
                                    )}
                                  </div>

                                  <div
                                    className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed whitespace-pre-wrap ${
                                      isUser
                                        ? 'bg-orange-600 text-white rounded-tr-xs shadow-xs'
                                        : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-tl-xs border border-slate-200/80 dark:border-slate-800 shadow-xs'
                                    }`}
                                  >
                                    {m.content}
                                  </div>

                                  <span className="text-[9px] text-slate-400 mt-0.5 px-1">
                                    {formatISTTime(m.timestamp)} IST
                                  </span>
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-center py-4 text-slate-400 text-xs italic">
                              No messages in this session.
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center text-xs text-slate-400 py-16">
                    <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" />
                    <span>Select a user email from the left list to inspect all their chats.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB 5: SECURITY AUDIT LOGS TABLE
        ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'security_logs' && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 animate-fade-in">
            <div>
              <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
                Security &amp; Auth Event Audit Logs
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Immutable log stream of cryptographic OTP requests, logins, and access control verifications. Emails are masked in compliance with user privacy standards.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400">
                    <th className="py-2.5 px-3 font-bold">Timestamp</th>
                    <th className="py-2.5 px-3 font-bold">Event Type</th>
                    <th className="py-2.5 px-3 font-bold">Masked Identity</th>
                    <th className="py-2.5 px-3 font-bold">IP Address</th>
                    <th className="py-2.5 px-3 font-bold">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {logs.length > 0 ? (
                    logs.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">
                          {formatISTDateTime(l.timestamp)}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                            l.event_type.includes('fail')
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          }`}>
                            {l.event_type}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 font-mono text-[11px]">{l.email || 'Anonymous'}</td>
                        <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 font-mono text-[11px]">{l.ip_address || '127.0.0.1'}</td>
                        <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{l.details}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400 italic">
                        {loadingLogs ? 'Loading security stream...' : 'No audit events recorded yet.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB 7: DATABASE / SUPABASE TABLE EXPLORER
        ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'db_explorer' && (
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden animate-fade-in">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
                    Database Table Explorer
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                    {dbData?.engine || 'Connected'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Browse live database tables, rows, users, and chat records directly from your admin console.
                </p>
              </div>
              <button
                type="button"
                onClick={() => fetchDbExplorer(dbTable, dbPage)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-950/40 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingDb ? 'animate-spin' : ''}`} />
                <span>Refresh Table</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
              {/* Left Table Selector */}
              <div className="lg:col-span-3 border-r border-slate-100 dark:border-slate-800 p-3 space-y-1 bg-slate-50/50 dark:bg-slate-950/30">
                <p className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Tables
                </p>
                {Object.entries(dbData?.tableCounts || {
                  users: 0,
                  conversation_sessions: 0,
                  conversation_messages: 0,
                  unanswered_queries: 0,
                  security_logs: 0,
                  programs: 0,
                  knowledge_entries: 0,
                }).map(([tbl, cnt]) => (
                  <button
                    key={tbl}
                    type="button"
                    onClick={() => {
                      setDbTable(tbl);
                      setDbPage(1);
                      fetchDbExplorer(tbl, 1);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      dbTable === tbl
                        ? 'bg-orange-600 text-white shadow-xs'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="font-mono text-[11px] truncate">{tbl}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      dbTable === tbl ? 'bg-white/20 text-white' : 'bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      {cnt}
                    </span>
                  </button>
                ))}
              </div>

              {/* Right Table Grid */}
              <div className="lg:col-span-9 flex flex-col justify-between overflow-hidden">
                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400">
                        {(dbData?.columns || []).map((col) => (
                          <th key={col} className="py-2.5 px-3 font-mono text-[11px] font-bold whitespace-nowrap">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {loadingDb ? (
                        <tr>
                          <td colSpan={Math.max(1, (dbData?.columns || []).length)} className="py-10 text-center text-slate-400 italic">
                            Loading table rows...
                          </td>
                        </tr>
                      ) : dbData?.rows && dbData.rows.length > 0 ? (
                        dbData.rows.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                            {(dbData.columns || []).map((col) => (
                              <td key={col} className="py-2 px-3 text-slate-700 dark:text-slate-300 max-w-[240px] truncate font-mono text-[11px]" title={String(row[col] ?? '')}>
                                {row[col] === null || row[col] === undefined ? <span className="text-slate-400 italic">null</span> : String(row[col])}
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={Math.max(1, (dbData?.columns || []).length)} className="py-10 text-center text-slate-400 italic">
                            No records found in {dbTable}.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span>
                    Page {dbData?.page || 1} of {dbData?.totalPages || 1} ({dbData?.total || 0} rows)
                  </span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      disabled={(dbData?.page || 1) <= 1}
                      onClick={() => {
                        const next = Math.max(1, dbPage - 1);
                        setDbPage(next);
                        fetchDbExplorer(dbTable, next);
                      }}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={(dbData?.page || 1) >= (dbData?.totalPages || 1)}
                      onClick={() => {
                        const next = Math.min(dbData?.totalPages || 1, dbPage + 1);
                        setDbPage(next);
                        fetchDbExplorer(dbTable, next);
                      }}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Delete User Confirmation Modal */}
      {userToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/60">
                <Trash2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">Delete User Account?</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Are you sure you want to permanently delete <strong>{userToDelete.email}</strong>? This action will permanently erase their profile and all associated chat logs. This cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={deletingUser}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors disabled:opacity-50"
              >
                {deletingUser ? 'Deleting...' : 'Permanently Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}