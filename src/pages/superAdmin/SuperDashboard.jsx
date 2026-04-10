import React, { useState } from 'react';
import {
  Building2, Users, Trophy, Star, BarChart3, TrendingUp,
  Zap, Shield, Activity, Globe, ChevronRight, Download, RefreshCw
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts';
import {
  CENTERS, STUDENTS, MONTHLY_SCORES, LEADERBOARD, STUDENT_BADGES,
  EVENTS, REWARDS, REWARD_REDEMPTIONS, CURRENT_CYCLE, getCenterAnalytics
} from '../../data/mockData';

export default function SuperDashboard() {
  const [refreshing, setRefreshing] = useState(false);

  const centerAnalytics = CENTERS.map(c => ({
    ...c,
    analytics: getCenterAnalytics(c.id),
  }));

  const totalStudents = STUDENTS.length;
  const totalBadges = STUDENT_BADGES.length;
  const totalEvents = EVENTS.length;
  const totalRedemptions = REWARD_REDEMPTIONS.length;

  const centerComparison = centerAnalytics.map(c => ({
    name: c.name,
    Score: c.analytics.avgScores[CURRENT_CYCLE - 1]?.value || 0,
    Attendance: c.analytics.avgAttendance[CURRENT_CYCLE - 1]?.value || 0,
    Students: c.analytics.totalStudents,
    Badges: c.analytics.badgeCount,
  }));

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 1000));
    setRefreshing(false);
  };

  return (
    <div className="page-content">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: 'var(--sp-3)' }}>
          <div>
            <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
              <Shield size={14} style={{ color: 'var(--color-gold-500)' }} />
              <span className="text-sm text-tertiary">Super Admin · All Centers</span>
            </div>
            <h1 className="page-title">Platform Command Center</h1>
            <p className="page-subtitle">Full oversight of all 4 centers — Bangalore, Noida, Pune, and Lucknow.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-ghost btn-icon" onClick={handleRefresh} title="Refresh data">
              <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
            </button>
            <button className="btn btn-secondary btn-sm"><Download size={13} /> Export All</button>
          </div>
        </div>
      </div>

      {/* Global KPIs */}
      <div className="grid-4 grid" style={{ gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
        {[
          { label: 'Total Students', value: totalStudents, icon: Users, color: 'var(--color-primary-500)', delta: 'Across 4 centers' },
          { label: 'Badges Awarded', value: totalBadges, icon: Star, color: 'var(--color-gold-500)' },
          { label: 'Events Conducted', value: totalEvents, icon: Activity, color: 'hsl(280,72%,48%)' },
          { label: 'Reward Claims', value: totalRedemptions, icon: Trophy, color: 'hsl(24,85%,48%)' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="kpi-card">
              <div className="kpi-label"><Icon size={14} style={{ color: s.color }} />{s.label}</div>
              <div className="kpi-value">{s.value}</div>
              {s.delta && <span className="text-xs text-tertiary">{s.delta}</span>}
            </div>
          );
        })}
      </div>

      {/* Center comparison chart */}
      <div className="chart-container" style={{ marginBottom: 'var(--sp-6)' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 'var(--sp-4)' }}>
          <div className="chart-title" style={{ marginBottom: 0 }}>Cross-Center Performance Comparison — November</div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-secondary"><span style={{ width: 10, height: 3, background: 'var(--color-primary-500)', display: 'inline-block', borderRadius: 2 }} /> Avg Score</span>
            <span className="flex items-center gap-1 text-xs text-secondary"><span style={{ width: 10, height: 3, background: 'var(--color-gold-500)', display: 'inline-block', borderRadius: 2 }} /> Attendance %</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={centerComparison} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
            <XAxis dataKey="name" tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} domain={[55, 90]} />
            <Tooltip contentStyle={{ background: 'var(--bg-surface-raised)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="Score" fill="var(--color-primary-500)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Attendance" fill="var(--color-gold-500)" radius={[4, 4, 0, 0]} opacity={0.75} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Per-center cards */}
      <div className="grid-4 grid" style={{ gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
        {centerAnalytics.map(c => (
          <div key={c.id} className="card" style={{ padding: 'var(--sp-5)', borderTop: `3px solid ${c.color}` }}>
            <div className="flex items-center gap-2" style={{ marginBottom: 'var(--sp-3)' }}>
              <span style={{ fontSize: 20 }}>{c.emoji}</span>
              <span className="text-md fw-bold">{c.name}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
              {[
                { l: 'Students', v: c.analytics.totalStudents },
                { l: 'Avg Score', v: c.analytics.avgScores[CURRENT_CYCLE - 1]?.value || 0 },
                { l: 'Badges', v: c.analytics.badgeCount },
                { l: 'Events', v: c.analytics.activeEvents },
              ].map(s => (
                <div key={s.l} className="flex items-center justify-between">
                  <span className="text-xs text-secondary">{s.l}</span>
                  <span className="text-sm fw-semibold">{s.v}</span>
                </div>
              ))}
            </div>
            <div className="progress-track" style={{ marginTop: 'var(--sp-3)' }}>
              <div className="progress-fill" style={{ width: `${c.analytics.avgScores[CURRENT_CYCLE - 1]?.value || 0}%`, background: c.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--sp-4)' }}>
        {[
          { label: 'User Management', icon: Users, path: '/super/users', color: 'var(--color-primary-500)' },
          { label: 'Scoring Policy', icon: Shield, path: '/super/policy', color: 'var(--color-gold-500)' },
          { label: 'Analytics', icon: BarChart3, path: '/super/analytics', color: 'hsl(214,82%,48%)' },
          { label: 'Audit Logs', icon: Activity, path: '/super/audit', color: 'hsl(280,72%,48%)' },
          { label: 'Leaderboards', icon: Trophy, path: '/super/leaderboard', color: 'var(--color-success-500)' },
          { label: 'Global Leaderboard', icon: Globe, path: '/super/leaderboard', color: 'hsl(24,85%,48%)' },
        ].map(a => {
          const Icon = a.icon;
          return (
            <a key={a.label} href={a.path} className="card card-interactive" style={{ padding: 'var(--sp-4)', display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', textDecoration: 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} style={{ color: a.color }} />
              </div>
              <span className="text-sm fw-medium">{a.label}</span>
              <ChevronRight size={13} style={{ color: 'var(--text-disabled)', marginLeft: 'auto' }} />
            </a>
          );
        })}
      </div>
    </div>
  );
}
