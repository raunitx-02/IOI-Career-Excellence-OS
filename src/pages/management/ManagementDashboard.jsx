import React, { useState } from 'react';
import {
  BarChart3, TrendingUp, Users, Trophy, Star, Award,
  Building2, Download, Globe, Target, ArrowUp, ArrowDown
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  AreaChart, Area, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts';
import {
  CENTERS, STUDENTS, CURRENT_CYCLE, getCenterAnalytics,
  MONTHLY_SCORES, LEADERBOARD, STUDENT_BADGES, PLACEMENT_READINESS
} from '../../data/mockData';

const MONTH_LABELS = ['September', 'October', 'November', 'December', 'January', 'February', 'March', 'April'];

export default function ManagementDashboard() {
  const [selectedCenter, setSelectedCenter] = useState('all');

  const centerData = CENTERS.map(c => {
    const a = getCenterAnalytics(c.id);
    return {
      ...c,
      analytics: a,
      avgScore: a.avgScores[CURRENT_CYCLE - 1]?.value || 0,
      avgAttendance: a.avgAttendance[CURRENT_CYCLE - 1]?.value || 0,
      badgeCount: a.badgeCount,
      totalStudents: a.totalStudents,
    };
  });

  const bestCenter = [...centerData].sort((a, b) => b.avgScore - a.avgScore)[0];
  const mostImproved = [...centerData].sort((a, b) =>
    (b.analytics.avgScores[2]?.value - b.analytics.avgScores[0]?.value) -
    (a.analytics.avgScores[2]?.value - a.analytics.avgScores[0]?.value)
  )[0];

  const comparisonData = centerData.map(c => ({
    name: c.name,
    'Avg Score': c.avgScore,
    'Attendance %': c.avgAttendance,
    Badges: c.badgeCount,
    Students: c.totalStudents,
  }));

  // Trend data across 3 months for all centers
  const trendData = MONTH_LABELS.map((month, mi) => {
    const entry = { month: month.slice(0, 3) };
    CENTERS.forEach(c => {
      const a = getCenterAnalytics(c.id);
      entry[c.name] = a.avgScores[mi]?.value || 0;
    });
    return entry;
  });

  const centerColors = ['var(--color-primary-500)', 'hsl(214,82%,48%)', 'hsl(280,72%,48%)', 'hsl(24,85%,48%)'];

  // Placement readiness for top students
  const topPlacement = PLACEMENT_READINESS.slice(0, 5).map(p => ({
    ...p,
    student: STUDENTS.find(s => s.id === p.studentId),
  }));

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: 'var(--sp-4)' }}>
          <div>
            <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
              <Globe size={14} style={{ color: 'var(--color-primary-500)' }} />
              <span className="text-sm text-tertiary">Management View · Read Only</span>
            </div>
            <h1 className="page-title">Platform Performance Overview</h1>
            <p className="page-subtitle">High-level insights across all 4 PW IOI centers — Bangalore, Noida, Pune, Lucknow.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-secondary btn-sm"><Download size={13} /> Export Report</button>
            <a href="/management/review" className="btn btn-primary btn-sm">
              <Star size={13} /> Judge Review Mode
            </a>
          </div>
        </div>
      </div>

      {/* Highlight chips */}
      <div className="flex items-center gap-3" style={{ marginBottom: 'var(--sp-6)', flexWrap: 'wrap' }}>
        {bestCenter && (
          <div style={{ background: 'var(--color-gold-50)', border: '1px solid var(--color-gold-200)', borderRadius: 'var(--radius-full)', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Trophy size={14} style={{ color: 'var(--color-gold-500)' }} />
            <span className="text-sm fw-semibold" style={{ color: 'var(--color-gold-700)' }}>Top Center: {bestCenter.name} ({bestCenter.avgScore} avg)</span>
          </div>
        )}
        {mostImproved && (
          <div style={{ background: 'var(--color-primary-50)', border: '1px solid var(--color-primary-200)', borderRadius: 'var(--radius-full)', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp size={14} style={{ color: 'var(--color-primary-500)' }} />
            <span className="text-sm fw-semibold" style={{ color: 'var(--color-primary-700)' }}>Most Improved: {mostImproved.name}</span>
          </div>
        )}
        <div style={{ background: 'var(--color-success-100)', border: '1px solid hsl(142,60%,80%)', borderRadius: 'var(--radius-full)', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Users size={14} style={{ color: 'var(--color-success-500)' }} />
          <span className="text-sm fw-semibold" style={{ color: 'var(--color-success-700)' }}>{STUDENTS.length} students active this cycle</span>
        </div>
      </div>

      {/* Center comparison cards */}
      <div className="grid-4 grid" style={{ gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
        {centerData.map((c, i) => (
          <div key={c.id} className={`card ${selectedCenter === c.id ? 'card-interactive' : ''}`}
            style={{ padding: 'var(--sp-5)', borderTop: `3px solid ${c.color}`, cursor: 'pointer' }}
            onClick={() => setSelectedCenter(selectedCenter === c.id ? 'all' : c.id)}>
            <div className="flex items-center gap-2" style={{ marginBottom: 'var(--sp-3)' }}>
              <span style={{ fontSize: 22 }}>{c.emoji}</span>
              <span className="text-md fw-bold">{c.name}</span>
              {selectedCenter === c.id && <span className="badge badge-primary" style={{ marginLeft: 'auto', fontSize: 9 }}>Selected</span>}
            </div>
            {[
              { l: 'Students', v: c.totalStudents },
              { l: 'Avg Score', v: `${c.avgScore}/100` },
              { l: 'Attendance', v: `${c.avgAttendance}%` },
              { l: 'Badges', v: c.badgeCount },
            ].map(s => (
              <div key={s.l} className="flex items-center justify-between" style={{ marginBottom: 4 }}>
                <span className="text-xs text-tertiary">{s.l}</span>
                <span className="text-xs fw-semibold">{s.v}</span>
              </div>
            ))}
            <div className="progress-track" style={{ marginTop: 'var(--sp-3)' }}>
              <div className="progress-fill" style={{ width: `${c.avgScore}%`, background: c.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid" style={{ gridTemplateColumns: '1.3fr 1fr', gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
        {/* Multi-center trend */}
        <div className="chart-container">
          <div className="chart-title">Center Score Trend — Sep to Apr</div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} domain={[55, 90]} />
              <Tooltip contentStyle={{ background: 'var(--bg-surface-raised)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 12 }} />
              {CENTERS.map((c, i) => (
                <Line key={c.id} type="monotone" dataKey={c.name} stroke={centerColors[i]} strokeWidth={2} dot={{ r: 4, fill: centerColors[i] }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="flex items-center gap-4" style={{ marginTop: 'var(--sp-3)', flexWrap: 'wrap' }}>
            {CENTERS.map((c, i) => (
              <span key={c.id} className="flex items-center gap-1 text-xs text-secondary">
                <span style={{ width: 12, height: 3, background: centerColors[i], display: 'inline-block', borderRadius: 2 }} />
                {c.name}
              </span>
            ))}
          </div>
        </div>

        {/* Comparison bar */}
        <div className="chart-container">
          <div className="chart-title">Score vs Attendance — November</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={comparisonData} barGap={3}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} domain={[55, 90]} />
              <Tooltip contentStyle={{ background: 'var(--bg-surface-raised)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="Avg Score" fill="var(--color-primary-500)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Attendance %" fill="var(--color-gold-500)" radius={[4, 4, 0, 0]} opacity={0.75} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Placement readiness */}
      <div className="card" style={{ padding: 'var(--sp-5)', marginBottom: 'var(--sp-6)', border: '1px solid var(--border-subtle)' }}>
        <div className="section-header" style={{ marginBottom: 'var(--sp-4)' }}>
          <div className="flex items-center gap-2">
            <span className="section-title">🚀 Leadership & Placement Pipeline</span>
            <span className="badge badge-gold" style={{ fontSize: 10 }}>Strategic Overview</span>
          </div>
          <span className="text-xs text-tertiary">Live data across all schools</span>
        </div>
        <div className="table-wrapper" style={{ background: 'var(--glass-bg-dark)', borderRadius: 'var(--radius-md)' }}>
          <table className="table">
            <thead>
              <tr>
                <th style={{ color: 'var(--text-primary)', fontWeight: 700 }}>Student</th>
                <th style={{ textAlign: 'center', color: 'var(--text-primary)', fontWeight: 700 }}>Communication</th>
                <th style={{ textAlign: 'center', color: 'var(--text-primary)', fontWeight: 700 }}>Leadership</th>
                <th style={{ textAlign: 'center', color: 'var(--text-primary)', fontWeight: 700 }}>Consistency</th>
                <th style={{ textAlign: 'center', color: 'var(--text-primary)', fontWeight: 700, background: 'rgba(99,102,241,0.05)' }}>Overall</th>
              </tr>
            </thead>
            <tbody>
              {topPlacement.map(p => (
                <tr key={p.studentId}>
                  <td>
                    <div className="text-sm fw-bold" style={{ color: 'var(--text-primary)' }}>{p.student?.name}</div>
                    <div className="text-xs fw-medium" style={{ color: 'var(--text-primary-color)', opacity: 0.8 }}>{p.student?.centerId} · {p.student?.schoolId}</div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`badge ${p.communicationScore >= 75 ? 'badge-primary' : 'badge-neutral'}`}>
                      {p.communicationScore}%
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`badge ${p.leadershipScore >= 75 ? 'badge-violet' : 'badge-neutral'}`}>
                      {p.leadershipScore}%
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`badge ${p.consistencyScore >= 75 ? 'badge-success' : 'badge-neutral'}`}>
                      {p.consistencyScore}%
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', background: 'rgba(99,102,241,0.03)' }}>
                    <span className="badge badge-gold" style={{ padding: '4px 10px', fontSize: 'var(--text-sm)' }}>
                      {p.overallReadiness}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
