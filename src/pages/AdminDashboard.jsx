import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ShieldAlert, ShieldCheck, Users, MessageSquare, AlertTriangle,
  Activity, RefreshCw, Search, Trash2, Calendar, Database,
  CheckCircle2, ArrowUpDown, ChevronLeft, ChevronRight, Lock, KeyRound
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { resolveApiUrl } from '../api/client';
import { PageHead } from '../utils/useAsync';

export default function AdminDashboard({ go, onOpenAuth }) {
  const { user, token, isAdmin } = useAuth();

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

  useEffect(() => {
    if (isAdmin) {
      fetchMetrics();
      fetchUsers();
      fetchLogs();
    }
  }, [isAdmin, fetchMetrics, fetchUsers, fetchLogs]);

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

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex items-center justify-center p-4">
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

  // Bars are scaled against the largest category present, so a bar's length
  // stays meaningful whatever the traffic volume is.
  const maxVolume = Math.max(...(metrics?.chatVolume || []).map((i) => i.count), 1);
  const health = m.serverHealth;
  const healthOk = !health || health.status === 'healthy';

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-10 sm:py-12 space-y-8">
        
        {/* Page Head */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Enterprise Admin Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
              System Metrics &amp; Security Audit
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Real-time monitoring of registered student accounts, chatbot volume, and zero-trust security events.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Range selector */}
            <div className="flex p-1 rounded-xl bg-slate-200/60 dark:bg-slate-800/80 text-xs font-bold">
              {['7d', '30d', '90d'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    range === r
                      ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                fetchMetrics();
                fetchUsers();
                fetchLogs();
              }}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-orange-600 transition-colors shadow-xs"
              title="Refresh all metrics"
            >
              <RefreshCw className={`w-4 h-4 ${loadingMetrics ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* 6 Core Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Users</span>
              <Users className="w-4 h-4 text-orange-500" />
            </div>
            <span className="text-2xl font-extrabold font-display text-slate-900 dark:text-white block">
              {m.totalUsers}
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 block">
              +{m.newRegistrations} this period
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Active Users</span>
              <Activity className="w-4 h-4 text-emerald-500" />
            </div>
            <span className="text-2xl font-extrabold font-display text-slate-900 dark:text-white block">
              {m.activeUsers}
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Past {range} activity
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Conversations</span>
              <MessageSquare className="w-4 h-4 text-blue-500" />
            </div>
            <span className="text-2xl font-extrabold font-display text-slate-900 dark:text-white block">
              {m.totalConversations}
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block">
              {m.totalMessages} messages in period
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Unanswered</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <span className="text-2xl font-extrabold font-display text-slate-900 dark:text-white block">
              {m.unansweredQueries || 0}
            </span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold mt-1 block">
              Needs knowledge entry
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Failed Logins</span>
              <ShieldAlert className="w-4 h-4 text-rose-500" />
            </div>
            <span className="text-2xl font-extrabold font-display text-slate-900 dark:text-white block">
              {m.failedLogins}
            </span>
            <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold mt-1 block">
              Admin &amp; OTP attempts
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Server Health</span>
              <Database className={`w-4 h-4 ${healthOk ? 'text-emerald-500' : 'text-rose-500'}`} />
            </div>
            <span className={`text-sm font-extrabold font-display block pt-1 ${
              healthOk ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            }`}>
              {loadingMetrics ? '…' : `● ${healthOk ? 'Healthy' : 'Degraded'}`}
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block truncate">
              {health ? `Database ${health.database}` : 'Health unknown'}
            </span>
          </div>
        </div>

        {/* Charts & Topic Volume Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Topic Volume */}
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

          {/* Registration Trends */}
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
                <span>All student accounts securely verified via single-use 6-digit OTP codes.</span>
              </div>
            )}
          </div>
        </div>

        {/* ── REGISTERED USERS TABLE ── */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
                Registered Student Accounts ({usersTotal})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Users authenticated via single-use OTP. Passwords and credentials never stored in plaintext.
              </p>
            </div>

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
                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                        {u.last_login ? new Date(u.last_login).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {u.email !== user?.email && (
                          <button
                            onClick={() => setUserToDelete(u)}
                            className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                            title="Delete account"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
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

          {/* Pagination controls */}
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

        {/* ── SECURITY AUDIT LOGS TABLE ── */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
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
                        {l.timestamp ? new Date(l.timestamp).toLocaleString() : 'N/A'}
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
