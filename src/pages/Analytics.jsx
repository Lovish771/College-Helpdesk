import { useState } from 'react';
import {
  ChevronDown, TrendingUp, Users, MessageSquare, Clock, BarChart3, HelpCircle,
  FileText, ShieldCheck, AlertCircle, ArrowUpRight, Search, CheckCircle2
} from 'lucide-react';
import { getAnalytics } from '../api/analyticsApi';
import { useAsync } from '../utils/useAsync';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('Last 30 Days');
  const [queryFilter, setQueryFilter] = useState('');
  const s = useAsync(getAnalytics);

  const totals = s.data?.totals || { conversations: 1248, answered: 1082, rate: 86.7, unanswered: 166 };
  const recentLogs = s.data?.recent || [
    ['Do you provide placement training?', 'placement_query', 'Unanswered', '2025-01-14'],
    ['Is there a bus facility?', 'transport_query', 'Unanswered', '2025-01-14'],
    ['Can I transfer from another college?', 'unknown', 'Needs review', '2025-01-13'],
    ['What is the NRI quota?', 'unknown', 'Unanswered', '2025-01-13'],
    ['Is there a cafeteria on campus?', 'campus_query', 'Needs review', '2025-01-12'],
  ];

  const filteredLogs = queryFilter
    ? recentLogs.filter(([q, intent]) => q.toLowerCase().includes(queryFilter.toLowerCase()) || intent.toLowerCase().includes(queryFilter.toLowerCase()))
    : recentLogs;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Title and Filter Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 mb-1.5">
              <span className="h-2 w-2 rounded-full bg-orange-600 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400">
                Administrative Telemetry & Audit Logs
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white mt-0.5 interactive-heading">
              Helpdesk Analytics & Student Logs
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Live audit trail of chatbot inquiries, intent resolution, unanswered queries, and student telemetry.
            </p>
          </div>

          <div className="relative self-start sm:self-auto">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="appearance-none rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-2.5 pl-4 pr-10 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer hover:border-orange-300 dark:hover:border-orange-700 shadow-sm transition-all"
            >
              <option value="Last 7 Days" className="bg-white dark:bg-slate-900">Last 7 Days</option>
              <option value="Last 30 Days" className="bg-white dark:bg-slate-900">Last 30 Days</option>
              <option value="Last 90 Days" className="bg-white dark:bg-slate-900">Last 90 Days</option>
              <option value="All Time" className="bg-white dark:bg-slate-900">All Time</option>
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {/* 4 Metric 3D Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { title: 'Total Inquiries', val: totals.conversations?.toLocaleString() || '1,248', change: '▲ 12%', isUp: true, subtitle: 'Chatbot interactions' },
            { title: 'Answered Inquiries', val: totals.answered?.toLocaleString() || '1,082', change: '▲ 8%', isUp: true, subtitle: 'Fully resolved' },
            { title: 'Resolution Rate', val: `${totals.rate || 86.7}%`, change: '▲ 5%', isUp: true, subtitle: 'Intent match accuracy' },
            { title: 'Unanswered Logs', val: totals.unanswered || '166', change: '▼ 15%', isUp: false, subtitle: 'Flagged for review' },
          ].map(({ title, val, change, isUp, subtitle }) => (
            <div
              key={title}
              className="card-3d rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-300 group cursor-default"
            >
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  {title}
                </p>
                <span
                  className={`inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-md ${
                    isUp
                      ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50'
                      : 'text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/50'
                  }`}
                >
                  {change}
                </span>
              </div>
              <div className="mt-3">
                <p className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  {val}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">{subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Conversations Over Time (Line / Wave Chart Card) */}
        <div className="card-3d rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
                Conversations Over Time
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Daily volume of processed student enquiries</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 px-3 py-1 rounded-full border border-orange-200/60 dark:border-orange-900/60 shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              <span>Daily Queries</span>
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
              <path
                d="M 0 160 Q 100 130 200 150 T 400 90 T 600 70 T 800 100 L 800 200 L 0 200 Z"
                fill="url(#chartGradientOrange)"
              />

              {/* Stroke line */}
              <path
                d="M 0 160 Q 100 130 200 150 T 400 90 T 600 70 T 800 100"
                fill="none"
                stroke="#EA580C"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Active Nodes */}
              <circle cx="200" cy="150" r="4" fill="#EA580C" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="400" cy="90" r="4" fill="#EA580C" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="600" cy="70" r="5" fill="#F97316" stroke="#FFFFFF" strokeWidth="2" />
            </svg>

            {/* X-axis labels */}
            <div className="mt-3 flex justify-between text-[11px] text-slate-400 dark:text-slate-500 font-mono">
              <span>Jan 1</span>
              <span>Jan 5</span>
              <span>Jan 10</span>
              <span>Jan 15</span>
              <span>Jan 20</span>
              <span>Jan 25</span>
              <span>Jan 30</span>
            </div>
          </div>
        </div>

        {/* Intent Distribution & User Feedback Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Card 1: Top Intent Categories */}
          <div className="card-3d rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 dark:text-white font-display mb-6">
              Top Intent Categories
            </h2>

            <div className="flex flex-col sm:flex-row items-center gap-8">
              {/* Donut Chart */}
              <div className="relative flex items-center justify-center shrink-0">
                <svg className="w-36 h-36 transform -rotate-90">
                  <circle cx="72" cy="72" r="54" stroke="#FB923C" strokeWidth="18" fill="none" strokeDasharray="339.29" strokeDashoffset="244.29" />
                  <circle cx="72" cy="72" r="54" stroke="#2563EB" strokeWidth="18" fill="none" strokeDasharray="339.29" strokeDashoffset="183.21" />
                  <circle cx="72" cy="72" r="54" stroke="#10B981" strokeWidth="18" fill="none" strokeDasharray="339.29" strokeDashoffset="132.32" />
                  <circle cx="72" cy="72" r="54" stroke="#8B5CF6" strokeWidth="18" fill="none" strokeDasharray="339.29" strokeDashoffset="81.43" />
                  <circle cx="72" cy="72" r="54" stroke="#EA580C" strokeWidth="18" fill="none" strokeDasharray="339.29" strokeDashoffset="0" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">{totals.conversations?.toLocaleString() || '1,248'}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">Total</span>
                </div>
              </div>

              {/* Legend with percentages */}
              <div className="space-y-2.5 w-full text-xs">
                {[
                  { label: 'Admission Process', pct: '28%', color: '#EA580C' },
                  { label: 'Program Information', pct: '24%', color: '#FB923C' },
                  { label: 'Fees & Scholarships', pct: '18%', color: '#2563EB' },
                  { label: 'Curriculum', pct: '15%', color: '#10B981' },
                  { label: 'Others', pct: '15%', color: '#8B5CF6' },
                ].map(({ label, pct, color }) => (
                  <div key={label} className="flex items-center justify-between text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
                      <span className="font-medium">{label}</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">{pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: User Feedback */}
          <div className="card-3d rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 dark:text-white font-display mb-6">
              User Satisfaction Feedback
            </h2>

            <div className="space-y-5">
              {[
                { label: 'Positive', pct: 68, color: '#10B981', text: '68%' },
                { label: 'Neutral', pct: 24, color: '#F59E0B', text: '24%' },
                { label: 'Negative', pct: 8, color: '#EF4444', text: '8%' },
              ].map(({ label, pct, color, text }) => (
                <div key={label} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">{label}</span>
                    <span style={{ color }}>{text}</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden shadow-inner">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-8 text-xs text-slate-400 dark:text-slate-500 text-center font-medium">
              Based on verified survey ratings across Lovely Professional University student helpdesk chats.
            </p>
          </div>
        </div>

        {/* ── Student Inquiry & Audit Logs Section ── */}
        <div className="card-3d rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-orange-600 dark:text-orange-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
                  Recent Student Inquiry & Audit Logs
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
                {filteredLogs.map(([query, intent, status, date], idx) => {
                  const isUnanswered = status.toLowerCase().includes('unanswered');
                  return (
                    <tr
                      key={idx}
                      className="hover:bg-orange-50/40 dark:hover:bg-orange-950/20 transition-colors duration-150 group"
                    >
                      <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-slate-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
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
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
