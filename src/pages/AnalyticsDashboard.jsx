import React, { useState } from 'react';
import {
  BarChart, Bar, AreaChart, Area, LineChart, Line,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis, PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, Users, Star, AlertTriangle, BarChart3, Activity } from 'lucide-react';
import {
  CENTERS, STUDENTS, MONTHLY_SCORES, STUDENT_BADGES, BADGE_DEFS,
  CURRENT_CYCLE, getCenterAnalytics, LEADERBOARD
} from '../data/mockData';
import { useAuthStore } from '../store/authStore';

const MONTH_LABELS = ['Sep', 'Oct', 'Nov'];
const RARITY_COLORS = { bronze: '#cd7f32', silver: '#a8a9ad', gold: '#d4af37', elite: '#9c27b0' };
const CENTER_COLORS = ['var(--color-primary-500)', 'hsl(214,82%,48%)', 'hsl(280,72%,48%)', 'hsl(24,85%,48%)'];

export default function AnalyticsDashboard() {
  const { user } = useAuthStore();
  const [selectedCenter, setSelectedCenter] = useState(user?.centerId || 'BLR');

  const centerData = CENTERS.map(c => {
    const a = getCenterAnalytics(c.id);
    return { ...c, analytics: a };
  });

  // ─── Attendance vs Performance Scatter ───────────────────────────────
  const scatterData = STUDENTS.slice(0, 40).map(st => {
    const score = MONTHLY_SCORES.find(s => s.studentId === st.id && s.month === CURRENT_CYCLE);
    return { x: score?.attendancePct || 0, y: score?.total || 0, name: st.name };
  });

  // ─── Monthly trend per center ─────────────────────────────────────────
  const trendData = MONTH_LABELS.map((label, mi) => {
    const entry = { month: label };
    CENTERS.forEach(c => {
      const a = getCenterAnalytics(c.id);
      entry[c.name] = a.avgScores[mi]?.value || 0;
    });
    return entry;
  });

  // ─── Badge distribution pie ───────────────────────────────────────────
  const badgeDist = Object.entries(
    STUDENT_BADGES.reduce((acc, b) => {
      const def = BADGE_DEFS.find(d => d.id === b.badgeId);
      if (def) acc[def.rarity] = (acc[def.rarity] || 0) + 1;
      return acc;
    }, {})
  ).map(([rarity, count]) => ({ name: rarity, value: count, color: RARITY_COLORS[rarity] }));

  // ─── Per-category avg score ───────────────────────────────────────────
  const scoreBreakdown = MONTH_LABELS.map((label, mi) => {
    const scores = MONTHLY_SCORES.filter(s => s.month === mi + 1);
    const avg = (key) => scores.length ? Math.round(scores.reduce((sum, s) => sum + (s[key] || 0), 0) / scores.length) : 0;
    return {
      month: label,
      Attendance: avg('attendancePct'),
      RAG: avg('ragScore'),
      Assessment: avg('assessmentScore'),
      Participation: avg('participationScore'),
    };
  });

  // ─── At-risk & improving students ───────────────────────────────────
  const atRisk = STUDENTS.filter(st => {
    const s = MONTHLY_SCORES.find(sc => sc.studentId === st.id && sc.month === CURRENT_CYCLE);
    return s && s.total < 63;
  }).slice(0, 6);

  const mostImproved = STUDENTS.filter(st => {
    const s2 = MONTHLY_SCORES.find(sc => sc.studentId === st.id && sc.month === 2);
    const s3 = MONTHLY_SCORES.find(sc => sc.studentId === st.id && sc.month === CURRENT_CYCLE);
    return s2 && s3 && (s3.total - s2.total) > 5;
  }).slice(0, 6).map(st => {
    const s2 = MONTHLY_SCORES.find(sc => sc.studentId === st.id && sc.month === 2);
    const s3 = MONTHLY_SCORES.find(sc => sc.studentId === st.id && sc.month === CURRENT_CYCLE);
    return { ...st, delta: Math.round(s3.total - s2.total), score: s3.total };
  }).sort((a, b) => b.delta - a.delta);

  // ─── Top badge earners ────────────────────────────────────────────────
  const topBadgeStudents = STUDENTS.map(st => ({
    ...st,
    badgeCount: STUDENT_BADGES.filter(b => b.studentId === st.id).length,
  })).sort((a, b) => b.badgeCount - a.badgeCount).slice(0, 5);

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">📊 Analytics & Intelligence</h1>
        <p className="page-subtitle">Deep performance insights across all centers, batches, and students.</p>
      </div>

      {/* Global KPIs */}
      <div className="grid-4 grid" style={{ gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
        {[
          { label: 'Total Students', value: STUDENTS.length, icon: Users, color: 'var(--color-primary-500)' },
          { label: 'At-Risk (< 63 pts)', value: atRisk.length, icon: AlertTriangle, color: 'var(--color-danger-500)' },
          { label: 'Most Improved', value: mostImproved.length, icon: TrendingUp, color: 'var(--color-success-500)' },
          { label: 'Badges Distributed', value: STUDENT_BADGES.length, icon: Star, color: 'var(--color-gold-500)' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="kpi-card">
              <div className="kpi-label"><Icon size={14} style={{ color: s.color }} />{s.label}</div>
              <div className="kpi-value">{s.value}</div>
            </div>
          );
        })}
      </div>

      {/* Row 1: Trend + Breakdown */}
      <div className="grid grid-layout-md" style={{ gridTemplateColumns: '1.3fr 1fr', gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
        {/* Multi-center trend */}
        <div className="chart-container">
          <div className="chart-title">Center Score Trend — 3 Months</div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} domain={[55, 90]} />
              <Tooltip contentStyle={{ background: 'var(--bg-surface-raised)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 12 }} />
              {CENTERS.map((c, i) => (
                <Line key={c.id} type="monotone" dataKey={c.name} stroke={CENTER_COLORS[i]} strokeWidth={2} dot={{ r: 4, fill: CENTER_COLORS[i] }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4" style={{ marginTop: 'var(--sp-3)', flexWrap: 'wrap' }}>
            {CENTERS.map((c, i) => (
              <span key={c.id} className="flex items-center gap-1 text-xs text-secondary">
                <span style={{ width: 12, height: 3, background: CENTER_COLORS[i], display: 'inline-block', borderRadius: 2 }} />{c.name}
              </span>
            ))}
          </div>
        </div>

        {/* Score category breakdown */}
        <div className="chart-container">
          <div className="chart-title">Score Category Average — All Centers</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={scoreBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} domain={[50, 100]} />
              <Tooltip contentStyle={{ background: 'var(--bg-surface-raised)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="Attendance" fill="var(--color-primary-500)" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Assessment" fill="var(--color-gold-500)" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Participation" fill="hsl(280,72%,48%)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Scatter + Badge pie */}
      <div className="grid grid-layout-md" style={{ gridTemplateColumns: '1.5fr 1fr', gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
        {/* Attendance vs Score scatter */}
        <div className="chart-container">
          <div className="chart-title">Attendance vs Total Score Correlation</div>
          <div className="text-xs text-tertiary" style={{ marginBottom: 'var(--sp-3)' }}>Each dot = one student. Higher attendance → higher total score.</div>
          <ResponsiveContainer width="100%" height={240}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="x" name="Attendance" unit="%" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} label={{ value: 'Attendance %', position: 'insideBottom', fill: 'var(--text-tertiary)', fontSize: 11 }} />
              <YAxis dataKey="y" name="Score" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} domain={[50, 100]} />
              <ZAxis range={[30, 30]} />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ background: 'var(--bg-surface-raised)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 12 }}
                formatter={(val, name) => [val, name === 'x' ? 'Attendance %' : 'Score']}
              />
              <Scatter data={scatterData} fill="var(--color-primary-500)" fillOpacity={0.6} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Badge rarity pie */}
        <div className="chart-container" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="chart-title">Badge Distribution by Rarity</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={badgeDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, value }) => `${name}: ${value}`} labelLine={false}
                style={{ fontSize: 11, fill: 'var(--text-secondary)' }}>
                {badgeDist.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--bg-surface-raised)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-3" style={{ flexWrap: 'wrap', justifyContent: 'center', marginTop: 'var(--sp-2)' }}>
            {badgeDist.map(b => (
              <span key={b.name} className="flex items-center gap-1 text-xs text-secondary" style={{ textTransform: 'capitalize' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: b.color, display: 'inline-block' }} />{b.name} ({b.value})
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: At-risk + Most improved + Top badge */}
      <div className="grid grid-layout-md" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--sp-4)' }}>
        {/* At-risk students */}
        <div className="card" style={{ padding: 'var(--sp-5)' }}>
          <div className="section-header" style={{ marginBottom: 'var(--sp-4)' }}>
            <span className="section-title" style={{ color: 'var(--color-danger-500)' }}>
              <AlertTriangle size={14} style={{ display: 'inline', marginRight: 5 }} />At-Risk Students
            </span>
            <span className="badge badge-danger">{atRisk.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
            {atRisk.map(st => {
              const score = MONTHLY_SCORES.find(s => s.studentId === st.id && s.month === CURRENT_CYCLE);
              const center = CENTERS.find(c => c.id === st.centerId);
              return (
                <div key={st.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', padding: 'var(--sp-2) var(--sp-3)', background: 'var(--color-danger-100)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="text-sm fw-medium truncate">{st.name}</div>
                    <div className="text-xs text-tertiary">{center?.name}</div>
                  </div>
                  <span className="badge badge-danger">{score?.total || 0}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Most improved */}
        <div className="card" style={{ padding: 'var(--sp-5)' }}>
          <div className="section-header" style={{ marginBottom: 'var(--sp-4)' }}>
            <span className="section-title" style={{ color: 'var(--color-success-500)' }}>
              <TrendingUp size={14} style={{ display: 'inline', marginRight: 5 }} />Most Improved
            </span>
            <span className="badge badge-success">{mostImproved.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
            {mostImproved.map(st => {
              const center = CENTERS.find(c => c.id === st.centerId);
              return (
                <div key={st.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', padding: 'var(--sp-2) var(--sp-3)', background: 'var(--color-success-100)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="text-sm fw-medium truncate">{st.name}</div>
                    <div className="text-xs text-tertiary">{center?.name}</div>
                  </div>
                  <span className="badge badge-success">+{st.delta} pts</span>
                </div>
              );
            })}
            {mostImproved.length === 0 && <div className="text-xs text-tertiary" style={{ padding: 'var(--sp-4)' }}>No significant improvers this cycle.</div>}
          </div>
        </div>

        {/* Top badge earners */}
        <div className="card" style={{ padding: 'var(--sp-5)' }}>
          <div className="section-header" style={{ marginBottom: 'var(--sp-4)' }}>
            <span className="section-title">
              <Star size={14} style={{ display: 'inline', marginRight: 5, color: 'var(--color-gold-500)' }} />Badge Leaders
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
            {topBadgeStudents.map((st, i) => {
              const center = CENTERS.find(c => c.id === st.centerId);
              return (
                <div key={st.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', padding: 'var(--sp-2) var(--sp-3)', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <div className={`rank-badge ${i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-other'}`}>{i + 1}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="text-sm fw-medium truncate">{st.name}</div>
                    <div className="text-xs text-tertiary">{center?.name}</div>
                  </div>
                  <span className="badge badge-gold">{st.badgeCount} 🎖️</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
