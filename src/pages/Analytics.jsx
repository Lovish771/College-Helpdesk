import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ChevronDown, RefreshCw, Search, Lock, FileText, AlertTriangle, Inbox, LockKeyhole
} from 'lucide-react';
import { getAnalytics } from '../api/analyticsApi';
import useAuth from '../hooks/useAuth';

const RANGE_MAP = {
  'Last 7 Days': '7d',
  'Last 30 Days': '30d',
  'Last 90 Days': '90d',
  'All Time': 'all',
};

const CATEGORY_COLORS = ['#EA580C', '#2563EB', '#0F766E', '#7C3AED', '#B45309', '#475569'];

const pct = (v) => (v == null ? '—' : `${v}%`);

function EmptyState({ title, hint }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-slate-300 px-4 py-10 text-center dark:border-slate-700">
      <Inbox size={20} className="text-slate-400" />
      <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">{title}</p>
      {hint && <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">{hint}</p>}
    </div>
  );
}

function StatTile({ label, value, sub }) {
  return (
    <div className="card p-4">
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900 dark:text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{sub}</p>
    </div>
  );
}

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
      } else {
        setError('The analytics endpoint returned no data.');
      }
    } catch (err) {
      setError(err.message || 'Could not load analytics.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) fetchAnalytics(timeRange);
  }, [isAdmin, timeRange, fetchAnalytics]);

  const totals = data?.totals || null;
  const topics = Array.isArray(data?.topics) ? data.topics : [];
  const timeline = Array.isArray(data?.timeline) ? data.timeline : [];
  const feedback = data?.feedback || null;
  const recentLogs = Array.isArray(data?.recent) ? data.recent : [];

  const filteredLogs = useMemo(() => {
    if (!queryFilter.trim()) return recentLogs;
    const q = queryFilter.toLowerCase();
    return recentLogs.filter(([query, intent]) =>
      (query && query.toLowerCase().includes(q)) ||
      (intent && intent.toLowerCase().includes(q))
    );
  }, [recentLogs, queryFilter]);

  // Chart geometry. Only computed from real points; an empty timeline renders
  // the empty state instead of a flat line that looks like "zero traffic".
  const chart = useMemo(() => {
    if (!timeline.length) return null;
    const maxCount = Math.max(...timeline.map((t) => t.count), 1);
    const stepX = 800 / Math.max(timeline.length - 1, 1);
    const points = timeline.map((t, idx) => ({
      x: Math.round(idx * stepX),
      y: Math.round(180 - (t.count / maxCount) * 140),
      count: t.count,
      date: t.date,
    }));
    const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    return { line, area: `${line} L 800 200 L 0 200 Z`, points };
  }, [timeline]);

  const circumference = 339.29;
  let accumulated = 0;
  const donutSlices = topics.map((t, idx) => {
    const percentage = t.percentage || 0;
    const slice = {
      name: t.name,
      count: t.count,
      label: `${percentage}%`,
      color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
      strokeDasharray: `${(percentage / 100) * circumference} ${circumference}`,
      strokeDashoffset: -((accumulated / 100) * circumference),
    };
    accumulated += percentage;
    return slice;
  });

  if (!isAdmin) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="card w-full max-w-md p-8 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
            <Lock size={20} />
          </span>
          <h1 className="mt-4 text-h3 font-semibold text-slate-900 dark:text-white">
            Administrator access required
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Analytics and the query log are limited to the two administrator accounts.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
            <button type="button" onClick={() => onOpenAuth && onOpenAuth()} className="btn-primary">
              Sign in
            </button>
            <button type="button" onClick={() => go && go('home')} className="btn-secondary">
              Back to helpdesk
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container-page space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Administration</p>
            <h1 className="mt-1 text-h1 font-semibold text-slate-900 dark:text-white">Analytics</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Figures are read from the conversation log for the selected period. Empty panels mean there is no
              recorded activity — nothing is estimated.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fetchAnalytics(timeRange)}
              disabled={loading}
              className="btn-secondary btn-sm"
              aria-label="Refresh analytics"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>

            <div className="relative">
              <label htmlFor="range" className="sr-only">Date range</label>
              <select
                id="range"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="input appearance-none py-2 pl-3 pr-9 text-small"
              >
                {Object.keys(RANGE_MAP).map((label) => (
                  <option key={label} value={label}>{label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        {error && (
          <div role="alert" className="flex items-start gap-2 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="font-medium">Analytics could not be loaded</p>
              <p className="mt-0.5 text-xs">{error}</p>
            </div>
            <button type="button" onClick={() => fetchAnalytics(timeRange)} className="btn-secondary btn-sm">
              Retry
            </button>
          </div>
        )}

        {/* Totals */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatTile
            label="Conversations"
            value={loading ? '…' : (totals?.conversations ?? 0).toLocaleString()}
            sub="Sessions started in this period"
          />
          <StatTile
            label="Bot answers"
            value={loading ? '…' : (totals?.answered ?? 0).toLocaleString()}
            sub="Replies marked answered"
          />
          <StatTile
            label="Answer rate"
            value={loading ? '…' : pct(totals?.rate)}
            sub={totals?.bot_messages ? `${totals.bot_messages} bot replies` : 'No replies to measure'}
          />
          <StatTile
            label="Unanswered"
            value={loading ? '…' : (totals?.unanswered ?? 0).toLocaleString()}
            sub="Logged for review"
          />
        </div>

        {/* Volume */}
        <section className="card p-5">
          <div className="flex items-baseline justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Messages per day</h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{timeRange}</p>
            </div>
            {timeline.length > 0 && (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {timeline.reduce((sum, t) => sum + t.count, 0).toLocaleString()} messages
              </span>
            )}
          </div>

          {loading ? (
            <div className="mt-6 h-48 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
          ) : chart ? (
            <>
              <div className="mt-4 h-48 w-full">
                <svg viewBox="0 0 800 200" className="h-full w-full" preserveAspectRatio="none" role="img" aria-label="Messages per day">
                  <defs>
                    <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EA580C" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[20, 65, 110, 155].map((y) => (
                    <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="currentColor"
                      className="text-slate-100 dark:text-slate-800" strokeWidth="1" />
                  ))}
                  <path d={chart.area} fill="url(#chartFill)" />
                  <path d={chart.line} fill="none" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  {chart.points.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#EA580C" />
                  ))}
                </svg>
              </div>
              <div className="mt-2 flex justify-between font-mono text-[11px] text-slate-500 dark:text-slate-400">
                <span>{timeline[0]?.date}</span>
                <span>{timeline[timeline.length - 1]?.date}</span>
              </div>
            </>
          ) : (
            <div className="mt-4">
              <EmptyState
                title="No messages in this period"
                hint="Charts appear once students start using the chat."
              />
            </div>
          )}
        </section>

        {/* Intents + feedback */}
        <div className="grid gap-4 lg:grid-cols-2">
          <section className="card p-5">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Most common intents</h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Excludes greetings and unrecognised messages.
            </p>

            {loading ? (
              <div className="mt-6 h-36 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
            ) : donutSlices.length === 0 ? (
              <div className="mt-4">
                <EmptyState title="No intents recorded yet" hint="Intent counts appear after the first answered questions." />
              </div>
            ) : (
              <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row">
                <svg viewBox="0 0 144 144" className="h-36 w-36 shrink-0 -rotate-90" role="img" aria-label="Intent distribution">
                  {donutSlices.map((slice, i) => (
                    <circle
                      key={i}
                      cx="72" cy="72" r="54"
                      fill="none"
                      stroke={slice.color}
                      strokeWidth="16"
                      strokeDasharray={slice.strokeDasharray}
                      strokeDashoffset={slice.strokeDashoffset}
                    />
                  ))}
                </svg>
                <ul className="w-full space-y-2 text-xs">
                  {donutSlices.map((slice) => (
                    <li key={slice.name} className="flex items-center justify-between gap-2">
                      <span className="flex min-w-0 items-center gap-2 text-slate-700 dark:text-slate-300">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: slice.color }} />
                        <span className="truncate">{slice.name}</span>
                      </span>
                      <span className="shrink-0 tabular-nums text-slate-500 dark:text-slate-400">
                        {slice.count} · <span className="font-medium text-slate-900 dark:text-white">{slice.label}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          <section className="card p-5">
            <div className="flex items-baseline justify-between">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Answer feedback</h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {feedback?.has_data ? `${feedback.total} ratings` : 'No ratings'}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Thumbs up / down on individual chat answers.
            </p>

            {loading ? (
              <div className="mt-6 h-28 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
            ) : !feedback?.has_data ? (
              <div className="mt-4">
                <EmptyState
                  title="No feedback submitted yet"
                  hint="Percentages are only shown once students rate an answer."
                />
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {[
                  { label: 'Helpful', value: feedback.positive, count: feedback.upvotes, color: '#0F766E' },
                  { label: 'Not helpful', value: feedback.negative, count: feedback.downvotes, color: '#B91C1C' },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
                      <span>{row.label}</span>
                      <span className="tabular-nums">{row.value}% · {row.count}</span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-sm bg-slate-100 dark:bg-slate-800">
                      <div className="h-full rounded-sm" style={{ width: `${row.value}%`, background: row.color }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Logs */}
        <section className="card p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                <FileText size={15} className="text-slate-400" />
                Recent questions
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Latest student messages with the intent the rule engine assigned.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <label htmlFor="log-filter" className="sr-only">Filter questions</label>
              <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="log-filter"
                type="text"
                placeholder="Filter by question or intent"
                value={queryFilter}
                onChange={(e) => setQueryFilter(e.target.value)}
                className="input py-2 pl-9 text-xs"
              />
            </div>
          </div>

          {loading ? (
            <div className="mt-4 space-y-2">
              {[0, 1, 2].map((i) => <div key={i} className="h-10 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />)}
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                title={queryFilter ? 'No questions match this filter' : 'No questions in this period'}
                hint={queryFilter ? 'Try a shorter search term.' : 'The log fills as students use the chat.'}
              />
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="mt-4 hidden overflow-x-auto rounded border border-slate-200 dark:border-slate-800 md:block">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
                      <th className="px-4 py-2.5">Question</th>
                      <th className="px-4 py-2.5">Intent</th>
                      <th className="px-4 py-2.5">Status</th>
                      <th className="px-4 py-2.5">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs dark:divide-slate-800">
                    {filteredLogs.map(([query, intent, status, date], idx) => {
                      const needsReview = /unanswered|review/i.test(status);
                      return (
                        <tr key={idx}>
                          <td className="max-w-md truncate px-4 py-2.5 text-slate-800 dark:text-slate-200">{query}</td>
                          <td className="px-4 py-2.5">
                            <span className="badge font-mono">{intent}</span>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className={`badge ${needsReview ? 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300' : 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300'}`}>
                              {status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-4 py-2.5 font-mono text-[11px] text-slate-500 dark:text-slate-400">{date}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <ul className="mt-4 divide-y divide-slate-100 md:hidden dark:divide-slate-800">
                {filteredLogs.map(([query, intent, status, date], idx) => {
                  const needsReview = /unanswered|review/i.test(status);
                  return (
                    <li key={idx} className="py-3">
                      <p className="text-sm text-slate-800 dark:text-slate-200">{query}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="badge font-mono">{intent}</span>
                        <span className={needsReview ? 'text-amber-700 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-400'}>
                          {status}
                        </span>
                        <span className="font-mono">{date}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </section>

        {data?.generated_at && (
          <p className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
            <LockKeyhole size={12} />
            Generated {new Date(data.generated_at + 'Z').toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}