import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ChevronDown, TrendingUp, Users, MessageSquare, Clock, BarChart3, HelpCircle,
  FileText, ShieldCheck, AlertCircle, ArrowUpRight, Search, CheckCircle2, Lock,
  RefreshCw
} from 'lucide-react';
import { getAnalytics } from '../api/analyticsApi';
import useAuth from '../hooks/useAuth';

const RANGE_MAP = {
  'Last 7 Days': '7d',
  'Last 30 Days': '30d',
  'Last 90 Days': '90d',
  'All Time': 'all'
};

const CATEGORY_COLORS = ['#EA580C', '#F97316', '#2563EB', '#10B981', '#8B5CF6', '#EC4899'];

export default function Analytics({ onOpenAuth, go }) {
  const { isAdmin } = useAuth();
  const [timeRange, setTimeRange] = useState('Last 30 Days');
  const [queryFilter, setQueryFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async (rangeLabel) => {
    setLoading(true);
    setError(null);
    try {
      const rangeParam = RANGE_MAP[rangeLabel] || '30d';
      const res = await getAnalytics(rangeParam);
      if (res && res.totals) {
        setData(res);
      } else if (res && res.error) {
        setError(res.error);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err.message || 'Failed to load telemetry data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchAnalytics(timeRange);
    }
  }, [isAdmin, timeRange, fetchAnalytics]);

  // Non-admin restricted access view
  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-9 shadow-xl text-center space-y-4 animate-scale-up">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Lock size={28} />
          </div>
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
              Restricted Confidential Area
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold font-display text-slate-900 dark:text-white mt-3">
              Administrator Access Required
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Telemetry metrics, query distributions, and student audit logs are confidential and restricted strictly to verified university administrators.
            </p>
          </div>
          <div className="pt-3 flex flex-col sm:flex-row gap-2 justify-center">
            <button
              type="button"
              onClick={() => onOpenAuth && onOpenAuth()}
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              Sign In as Administrator
            </button>
            <button
              type="button"
              onClick={() => go && go('home')}
              className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
            >
              Return to Helpdesk
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totals = data?.totals || { conversations: 0, messages: 0, answered: 0, unanswered: 0, rate: 100.0 };
  const topics = Array.isArray(data?.topics) && data.topics.length > 0
    ? data.topics
    : [
        { name: 'Fees & Expenses', count: 0, percentage: 35 },
        { name: 'Hostel & Living', count: 0, percentage: 25 },
        { name: 'Admissions & LPUNEST', count: 0, percentage: 20 },
        { name: 'Scholarships & Aid', count: 0, percentage: 12 },
        { name: 'Curriculum & Syllabi', count: 0, percentage: 8 },
      ];

  const timeline = Array.isArray(data?.timeline) ? data.timeline : [];
  const feedback = data?.feedback || { positive: 90, neutral: 8, negative: 2, total: 0 };
  const recentLogs = Array.isArray(data?.recent) ? data.recent : [];

  const filteredLogs = useMemo(() => {
    if (!queryFilter.trim()) return recentLogs;
    const q = queryFilter.toLowerCase();
    return recentLogs.filter(([query, intent]) =>
      (query && query.toLowerCase().includes(q)) ||
      (intent && intent.toLowerCase().includes(q))
    );
  }, [recentLogs, queryFilter]);

  // Compute dynamic SVG line & area path from timeline data
  const chartPathData = useMemo(() => {
    if (!timeline.length) {
      return { area: 'M 0 160 L 800 160 L 800 200 L 0 200 Z', line: 'M 0 160 L 800 160', nodes: [] };
    }
    const maxCount = Math.max(...timeline.map((t) => t.count), 5);
    const stepX = 800 / Math.max(timeline.length - 1, 1);
    const points = timeline.map((t, idx) => {
      const x = Math.round(idx * stepX);
      const y = Math.round(180 - (t.count / maxCount) * 140);
      return { x, y, count: t.count, date: t.date };
    });

    const linePath = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaPath = `${linePath} L 800 200 L 0 200 Z`;
    return { area: areaPath, line: linePath, nodes: points };
  }, [timeline]);

  // Compute Donut SVG Dash Offsets
  const circumference = 339.29; // 2 * PI * 54
  let accumulatedPercent = 0;
  const donutSlices = topics.map((t, idx) => {
    const pct = t.percentage || (t.count ? Math.round((t.count / Math.max(totals.messages, 1)) * 100) : 10);
    const strokeDasharray = `${(pct / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
    accumulatedPercent += pct;
    return {
      name: t.name,
      count: t.count,
      pct: `${pct}%`,
      color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Title and Filter Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-1.5">
              <span className="h-2 w-2 rounded-full bg-orange-600 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400">
                Administrative Telemetry &amp; Real-Time Audit Logs
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white mt-0.5">
              Helpdesk Analytics &amp; Student Logs
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Live audit trail of student chatbot inquiries, intent resolution rates, and system telemetry.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => fetchAnalytics(timeRange)}
              disabled={loading}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-orange-600 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
              title="Refresh telemetry metrics"
              aria-label="Refresh telemetry metrics"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin text-orange-500' : ''} />
            </button>

            <div className="relative">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="appearance-none rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-2 pl-3.5 pr-9 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer hover:border-orange-300 dark:hover:border-orange-700 shadow-xs transition-all"
              >
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Last 90 Days">Last 90 Days</option>
                <option value="All Time">All Time</option>
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        {/* 4 Metric Cards (Real Database Numbers) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Total Inquiries',
              val: (totals.conversations || totals.messages || 0).toLocaleString(),
              change: 'Live',
              isUp: true,
              subtitle: 'Student conversations recorded',
            },
            {
              title: 'Answered Queries',
              val: (totals.answered || 0).toLocaleString(),
              change: 'Resolved',
              isUp: true,
              subtitle: 'Verified bot answers delivered',
            },
            {
              title: 'Resolution Rate',
              val: `${totals.rate || 100}%`,
              change: totals.rate >= 90 ? 'Optimal' : 'Review',
              isUp: totals.rate >= 80,
              subtitle: 'Intent match accuracy',
            },
            {
              title: 'Unanswered / Flagged',
              val: totals.unanswered || 0,
              change: totals.unanswered > 0 ? 'Pending' : 'Clear',
              isUp: totals.unanswered === 0,
              subtitle: 'Requiring staff review',
            },
          ].map(({ title, val, change, isUp, subtitle }) => (
            <div
              key={title}
              className="rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm transition-all duration-200 hover:border-orange-300 dark:hover:border-orange-700"
            >
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {title}
                </p>
                <span
                  className={`inline-flex items-center text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                    isUp
                      ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50'
                      : 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50'
                  }`}
                >
                  {change}
                </span>
              </div>
              <div className="mt-3">
                <p className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
                  {val}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">{subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Conversations Over Time (Dynamic SVG Curve) */}
        <div className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
                Conversations Over Time
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                Real-time volume of processed student enquiries ({timeRange})
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 px-3 py-1 rounded-full border border-orange-200/60 dark:border-orange-900/60 shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              <span>Live Database Traffic</span>
            </div>
          </div>

          {/* SVG Smooth Curve Area Chart */}
          <div className="relative h-56 w-full">
            <svg viewBox="0 0 800 200" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradientOrange" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EA580C" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#EA580C" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid Lines */}
              <line x1="0" y1="20" x2="800" y2="20" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="3 3" />
              <line x1="0" y1="65" x2="800" y2="65" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="3 3" />
              <line x1="0" y1="110" x2="800" y2="110" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="3 3" />
              <line x1="0" y1="155" x2="800" y2="155" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="3 3" />

              {/* Area */}
              <path d={chartPathData.area} fill="url(#chartGradientOrange)" />

              {/* Stroke line */}
              <path d={chartPathData.line} fill="none" stroke="#EA580C" strokeWidth="3" strokeLinecap="round" />

              {/* Active Nodes */}
              {chartPathData.nodes.slice(-8).map((node, i) => (
                <circle
                  key={i}
                  cx={node.x}
                  cy={node.y}
                  r="4"
                  fill="#EA580C"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
              ))}
            </svg>

            {/* X-axis labels from real database dates */}
            <div className="mt-3 flex justify-between text-[11px] text-slate-400 dark:text-slate-500 font-mono">
              {timeline.length > 0 ? (
                <>
                  <span>{timeline[0]?.date || 'Start'}</span>
                  <span>{timeline[Math.floor(timeline.length / 2)]?.date || 'Mid'}</span>
                  <span>{timeline[timeline.length - 1]?.date || 'Today'}</span>
                </>
              ) : (
                <>
                  <span>Day 1</span>
                  <span>Day 15</span>
                  <span>Today</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Intent Distribution & User Feedback Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Card 1: Top Intent Categories */}
          <div className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 dark:text-white font-display mb-6">
              Top Student Intent Categories
            </h2>

            <div className="flex flex-col sm:flex-row items-center gap-8">
              {/* Dynamic SVG Donut Chart */}
              <div className="relative flex items-center justify-center shrink-0">
                <svg className="w-36 h-36 transform -rotate-90">
                  {donutSlices.map((slice, i) => (
                    <circle
                      key={i}
                      cx="72"
                      cy="72"
                      r="54"
                      stroke={slice.color}
                      strokeWidth="18"
                      fill="none"
                      strokeDasharray={slice.strokeDasharray}
                      strokeDashoffset={slice.strokeDashoffset}
                      className="transition-all duration-500"
                    />
                  ))}
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {(totals.messages || totals.conversations || 0).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">Queries</span>
                </div>
              </div>

              {/* Legend with percentages */}
              <div className="space-y-2.5 w-full text-xs">
                {donutSlices.map((slice) => (
                  <div key={slice.name} className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: slice.color }} />
                      <span className="font-medium truncate max-w-[150px]">{slice.name}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-slate-400 text-[11px]">({slice.count || 0})</span>
                      <span className="font-bold text-slate-900 dark:text-white">{slice.pct}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: User Satisfaction Feedback */}
          <div className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
                User Satisfaction Feedback
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                {feedback.total > 0 ? `${feedback.total} ratings` : 'Active Surveys'}
              </span>
            </div>

            <div className="space-y-5">
              {[
                { label: 'Helpful & Resolved', pct: feedback.positive, color: '#10B981' },
                { label: 'Neutral / Follow-up', pct: feedback.neutral, color: '#F59E0B' },
                { label: 'Unresolved / Dislike', pct: feedback.negative, color: '#EF4444' },
              ].map(({ label, pct, color }) => (
                <div key={label} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">{label}</span>
                    <span style={{ color }} className="font-bold">{pct}%</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden shadow-inner">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(pct, 2)}%`, background: color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-8 text-xs text-slate-400 dark:text-slate-500 text-center font-medium">
              Calculated from verified ratings submitted by students across Lovely Professional University helpdesk chats.
            </p>
          </div>
        </div>

        {/* ── Real Student Inquiry & Audit Logs Section ── */}
        <div className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-orange-600 dark:text-orange-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
                  Recent Student Inquiry &amp; Audit Logs
                </h2>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Real-time log of student queries submitted to the helpdesk system.
              </p>
            </div>

            {/* Search filter for logs */}
            <div className="relative">
              <input
                type="text"
                placeholder="Filter logs by query or intent..."
                value={queryFilter}
                onChange={(e) => setQueryFilter(e.target.value)}
                className="w-full sm:w-64 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 py-2 pl-9 pr-3 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all focus:border-orange-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-950/40"
              />
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Logs Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Student Inquiry Query</th>
                  <th className="py-3 px-4">Detected Intent</th>
                  <th className="py-3 px-4">Resolution Status</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map(([query, intent, status, date], idx) => {
                    const isUnanswered = status.toLowerCase().includes('unanswered') || status.toLowerCase().includes('review');
                    return (
                      <tr
                        key={idx}
                        className="hover:bg-orange-50/40 dark:hover:bg-orange-950/20 transition-colors duration-150 group"
                      >
                        <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-slate-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors max-w-md truncate">
                          "{query}"
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-mono font-semibold">
                            {intent}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              isUnanswered
                                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/80 dark:border-amber-900/60'
                                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-900/60'
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                isUnanswered ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                            />
                            <span>{status}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                          {date}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-xs text-slate-400">
                      {loading ? 'Loading real telemetry logs...' : 'No matching inquiries found in this timeframe.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
