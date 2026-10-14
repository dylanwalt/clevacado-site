import React, { useEffect, useMemo, useState } from 'react';
import { Activity, BarChart3, Eye, LockKeyhole, LogOut, RefreshCw, Users, Video, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface AnalyticsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AnalyticsSummary {
  activeSessions: number;
  daily: Array<{ date: string; events: number; pageViews: number }>;
  days: number;
  eventCounts: Array<{ name: string; count: number }>;
  generatedAt: string;
  pageViews: number;
  pathCounts: Array<{ name: string; count: number }>;
  pilotFormDrafts: number;
  pilotFormOpens: number;
  pilotFormSubmits: number;
  totalEvents: number;
  uniqueViewers: number;
  selectedViewer: string;
  videoCounts: Array<{ name: string; count: number }>;
  videoPlays: number;
  viewerCounts: Array<{ id: string; count: number }>;
}

const numberFormatter = new Intl.NumberFormat('en-ZA');

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-ZA', { day: '2-digit', month: 'short' }).format(new Date(`${date}T00:00:00Z`));
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [days, setDays] = useState(30);
  const [viewerFilter, setViewerFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadSummary = async (range = days, viewer = viewerFilter) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ days: String(range) });
      if (viewer !== 'all') params.set('viewer', viewer);
      const response = await fetch(`/.netlify/functions/analytics-summary?${params.toString()}`, { credentials: 'include' });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Could not load the dashboard.');
      setSummary(body);
      setAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load the dashboard.');
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setPassword('');
      setAuthenticated(false);
      setSummary(null);
      setViewerFilter('all');
      setError('');
    }
  }, [isOpen]);

  const maxDailyEvents = useMemo(() => Math.max(...(summary?.daily.map((item) => item.events) || [1]), 1), [summary]);
  const dashboardCards: Array<{ label: string; value: number; Icon: LucideIcon }> = summary ? [
    { label: 'Page views', value: summary.pageViews, Icon: Eye },
    { label: 'Active sessions', value: summary.activeSessions, Icon: Users },
    { label: 'Unique viewers', value: summary.uniqueViewers, Icon: Users },
    { label: 'Pilot form opens', value: summary.pilotFormOpens, Icon: Activity },
    { label: 'Early email follow-ups', value: summary.pilotFormDrafts, Icon: Activity },
    { label: 'Pilot enquiries', value: summary.pilotFormSubmits, Icon: BarChart3 },
    { label: 'Video plays', value: summary.videoPlays, Icon: Video },
  ] : [];

  if (!isOpen) return null;

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/.netlify/functions/analytics-summary', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', password }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Could not sign in.');
      setPassword('');
      await loadSummary(days, viewerFilter);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in.');
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/.netlify/functions/analytics-summary', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    }).catch(() => undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#173C27] text-white">
      <div className="mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="flex items-center justify-between border-b border-[#2F8F46]/60 pb-5">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#B7FF5A]">ClevaCado / private view</p>
            <h1 className="mt-2 font-serif text-3xl font-bold sm:text-5xl">Analytics dashboard</h1>
          </div>
          <button onClick={onClose} className="rounded-full border border-[#2F8F46] p-3 text-[#EAF5E5] transition hover:border-[#B7FF5A] hover:text-[#B7FF5A]" aria-label="Close analytics dashboard">
            <X className="h-5 w-5" />
          </button>
        </div>

        {!authenticated ? (
          <div className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center">
            <form onSubmit={handleLogin} className="w-full space-y-6 rounded-3xl border border-[#2F8F46] bg-[#174D2A] p-8 shadow-2xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#B7FF5A]/50 bg-[#173C27] text-[#B7FF5A]"><LockKeyhole className="h-5 w-5" /></div>
              <div className="space-y-2">
                <h2 className="font-serif text-3xl font-bold">Private analytics</h2>
                <p className="text-sm font-light leading-relaxed text-[#EAF5E5]/75">Enter the dashboard password to view first-party site activity. Raw IPs and form contents are not included; early follow-up counts are aggregate only.</p>
              </div>
              <label className="block space-y-2 text-xs font-mono uppercase tracking-wider text-[#EAF5E5]/70">
                Password
                <input autoFocus type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-[#2F8F46] bg-[#173C27] p-3 text-base normal-case tracking-normal text-white outline-none focus:border-[#B7FF5A]" />
              </label>
              {error && <p className="rounded-xl border border-red-700 bg-red-950/60 p-3 text-xs text-red-200">{error}</p>}
              <button type="submit" disabled={loading || !password} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#B7FF5A] px-4 py-3 text-sm font-bold text-[#174D2A] transition hover:bg-[#5ED143] disabled:cursor-not-allowed disabled:opacity-50">
                <LockKeyhole className="h-4 w-4" />
                {loading ? 'Checking…' : 'Open dashboard'}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-8 py-8">
            <div className="flex flex-col gap-4 rounded-2xl border border-[#2F8F46] bg-[#174D2A] p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs font-light text-[#EAF5E5]/75">First-party events only. Raw IPs are not stored. Dashboard window: {days} days.</p>
              <div className="flex flex-wrap gap-2">
                {[7, 30, 90].map((range) => <button key={range} onClick={() => { setDays(range); void loadSummary(range); }} className={`rounded-lg px-3 py-2 text-xs font-mono ${days === range ? 'bg-[#B7FF5A] text-[#174D2A]' : 'border border-[#2F8F46] text-[#EAF5E5]'}`}>{range}d</button>)}
                <label className="flex items-center gap-2 rounded-lg border border-[#2F8F46] px-3 py-2 text-xs text-[#EAF5E5]/80">
                  <span className="font-mono uppercase tracking-wider">Viewer</span>
                  <select value={viewerFilter} onChange={(event) => { setViewerFilter(event.target.value); void loadSummary(days, event.target.value); }} className="max-w-[12rem] bg-transparent text-[#B7FF5A] outline-none">
                    <option value="all" className="bg-[#173C27]">All viewers</option>
                    {summary?.viewerCounts.map((item) => <option key={item.id} value={item.id} className="bg-[#173C27]">{item.id} ({item.count})</option>)}
                  </select>
                </label>
                <button onClick={() => void loadSummary(days)} className="rounded-lg border border-[#2F8F46] p-2 text-[#EAF5E5] hover:border-[#B7FF5A] hover:text-[#B7FF5A]" aria-label="Refresh analytics"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /></button>
                <button onClick={handleLogout} className="flex items-center gap-2 rounded-lg border border-[#2F8F46] px-3 py-2 text-xs text-[#EAF5E5] hover:border-[#B7FF5A] hover:text-[#B7FF5A]"><LogOut className="h-4 w-4" /> Sign out</button>
              </div>
            </div>

            {error && <p className="rounded-xl border border-red-700 bg-red-950/60 p-3 text-xs text-red-200">{error}</p>}

            {summary && <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
                {dashboardCards.map(({ label, value, Icon }) => <div key={label} className="rounded-2xl border border-[#2F8F46] bg-[#174D2A] p-5"><Icon className="h-5 w-5 text-[#B7FF5A]" /><p className="mt-5 text-xs font-mono uppercase tracking-wider text-[#EAF5E5]/60">{label}</p><p className="mt-1 font-serif text-3xl font-bold">{numberFormatter.format(value)}</p></div>)}
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_0.6fr]">
                <div className="rounded-3xl border border-[#2F8F46] bg-[#174D2A] p-6">
                  <div className="flex items-end justify-between"><div><p className="text-xs font-mono uppercase tracking-wider text-[#B7FF5A]">Activity rhythm</p><h2 className="mt-2 font-serif text-2xl font-bold">Events by day</h2></div><span className="text-xs text-[#EAF5E5]/60">Last {days} days</span></div>
                  <div className="mt-8 flex h-48 items-end gap-1.5 sm:gap-2">{summary.daily.map((item) => <div key={item.date} className="group flex h-full flex-1 flex-col justify-end"><div className="relative min-h-1 rounded-t bg-[#B7FF5A] transition group-hover:bg-[#5ED143]" style={{ height: `${Math.max((item.events / maxDailyEvents) * 100, item.events ? 4 : 1)}%` }} title={`${item.date}: ${item.events} events`} /><span className="mt-2 hidden truncate text-center text-[9px] font-mono text-[#EAF5E5]/45 sm:block">{formatDate(item.date)}</span></div>)}</div>
                </div>

                <div className="rounded-3xl border border-[#2F8F46] bg-[#174D2A] p-6"><p className="text-xs font-mono uppercase tracking-wider text-[#B7FF5A]">Video interest</p><h2 className="mt-2 font-serif text-2xl font-bold">Plays by film</h2><div className="mt-6 space-y-4">{summary.videoCounts.length ? summary.videoCounts.map((item) => <div key={item.name}><div className="flex justify-between text-xs text-[#EAF5E5]/75"><span>{item.name}</span><span>{item.count}</span></div><div className="mt-2 h-2 rounded-full bg-[#173C27]"><div className="h-2 rounded-full bg-[#5ED143]" style={{ width: `${Math.max((item.count / Math.max(...summary.videoCounts.map((entry) => entry.count), 1)) * 100, 4)}%` }} /></div></div>) : <p className="text-sm text-[#EAF5E5]/60">No video plays recorded yet.</p>}</div></div>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-3xl border border-[#2F8F46] bg-[#174D2A] p-6"><p className="text-xs font-mono uppercase tracking-wider text-[#B7FF5A]">Where people arrive</p><h2 className="mt-2 font-serif text-2xl font-bold">Top paths</h2><div className="mt-6 space-y-3">{summary.pathCounts.length ? summary.pathCounts.map((item) => <div key={item.name} className="flex items-center justify-between border-b border-[#2F8F46]/60 pb-3 text-sm"><span className="text-[#EAF5E5]/80">{item.name}</span><span className="font-mono text-[#B7FF5A]">{item.count}</span></div>) : <p className="text-sm text-[#EAF5E5]/60">No page views recorded yet.</p>}</div></div>
                <div className="rounded-3xl border border-[#2F8F46] bg-[#174D2A] p-6"><p className="text-xs font-mono uppercase tracking-wider text-[#B7FF5A]">What gets attention</p><h2 className="mt-2 font-serif text-2xl font-bold">Top events</h2><div className="mt-6 space-y-3">{summary.eventCounts.length ? summary.eventCounts.map((item) => <div key={item.name} className="flex items-center justify-between border-b border-[#2F8F46]/60 pb-3 text-sm"><span className="text-[#EAF5E5]/80">{item.name.replaceAll('_', ' ')}</span><span className="font-mono text-[#B7FF5A]">{item.count}</span></div>) : <p className="text-sm text-[#EAF5E5]/60">No events recorded yet.</p>}</div></div>
              </div>

              <p className="text-right text-[10px] font-mono uppercase tracking-wider text-[#EAF5E5]/40">Updated {new Date(summary.generatedAt).toLocaleString('en-ZA')}</p>
            </>}
          </div>
        )}
      </div>
    </div>
  );
};
