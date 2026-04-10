import React, { useState } from 'react';
import {
  Users, TrendingUp, Award, BarChart3, AlertTriangle, CheckCircle,
  Calendar, Megaphone, Trophy, Star, Building2, ChevronRight, Download
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, LineChart, Line
} from 'recharts';
import {
  CENTERS, BATCHES, CLASSROOMS, STUDENTS, MONTHLY_SCORES, LEADERBOARD,
  STUDENT_BADGES, REWARDS, REWARD_REDEMPTIONS, EVENTS, ANNOUNCEMENTS,
  CURRENT_CYCLE, getCenterAnalytics
} from '../../data/mockData';
import { useAuthStore } from '../../store/authStore';
import { useNotifStore } from '../../store/notifStore';

const MONTH_LABELS = ['Sep', 'Oct', 'Nov'];

export default function CenterDashboard() {
  const { user } = useAuthStore();
  const { addToast } = useNotifStore();
  const centerId = user?.centerId || 'BLR';
  const center = CENTERS.find(c => c.id === centerId);
  const analytics = getCenterAnalytics(centerId);

  const centerStudents = STUDENTS.filter(s => s.centerId === centerId);
  const centerBatches = BATCHES.filter(b => b.centerId === centerId);
  const centerClassrooms = CLASSROOMS.filter(c => c.centerId === centerId);
  const topStudents = analytics.topStudents;

  const avgTrend = analytics.avgScores.map((s, i) => ({
    month: MONTH_LABELS[i],
    Score: s.value,
    Attendance: analytics.avgAttendance[i].value,
  }));

  const [publishStep, setPublishStep] = useState(0);
  const handlePublish = async () => {
    setPublishStep(1);
    await new Promise(r => setTimeout(r, 1000));
    setPublishStep(2);
    await new Promise(r => setTimeout(r, 1000));
    setPublishStep(3);
    addToast({ type: 'success', emoji: '🏆', title: 'Leaderboard Published!', message: `${center?.name} November rankings are now live.` });
  };

  const atRisk = centerStudents.filter(s => {
    const score = MONTHLY_SCORES.find(sc => sc.studentId === s.id && sc.month === CURRENT_CYCLE);
    return score && score.total < 62;
  });

  const centerAnnouncements = ANNOUNCEMENTS.filter(a => !a.centerId || a.centerId === centerId);

  return (
    <div className="page-content">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: 'var(--sp-3)' }}>
          <div>
            <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: center?.color }} />
              <span className="text-sm text-tertiary">{center?.name} Center</span>
            </div>
            <h1 className="page-title">Center Command Center</h1>
            <p className="page-subtitle">Manage students, publish cycles, and monitor performance across all batches.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-secondary btn-sm"><Download size={13} /> Export Report</button>
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid-4 grid" style={{ gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
        {[
          { label: 'Total Students', value: analytics.totalStudents, icon: Users, color: 'var(--color-primary-500)', delta: '+3 this month' },
          { label: 'Avg Month Score', value: analytics.avgScores[CURRENT_CYCLE - 1]?.value || 0, icon: Star, color: 'var(--color-gold-500)', sub: '/100 pts' },
          { label: 'Avg Attendance', value: analytics.avgAttendance[CURRENT_CYCLE - 1]?.value + '%' || '—', icon: Calendar, color: 'var(--color-success-500)' },
          { label: 'At-Risk Students', value: atRisk.length, icon: AlertTriangle, color: atRisk.length > 3 ? 'var(--color-danger-500)' : 'var(--color-gold-500)' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="kpi-card">
              <div className="kpi-label"><Icon size={14} style={{ color: s.color }} />{s.label}</div>
              <div className="kpi-value">{s.value}{s.sub && <span className="text-sm text-tertiary fw-normal"> {s.sub}</span>}</div>
              {s.delta && <span className="text-xs text-success">{s.delta}</span>}
            </div>
          );
        })}
      </div>

      {/* Additional KPIs */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
        {[
          { label: 'Batches', value: centerBatches.length },
          { label: 'Classrooms', value: centerClassrooms.length },
          { label: 'Badges Awarded', value: analytics.badgeCount },
          { label: 'Active Events', value: analytics.activeEvents },
        ].map(s => (
          <div key={s.label} className="kpi-card" style={{ padding: 'var(--sp-4)' }}>
            <div className="kpi-label">{s.label}</div>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--fw-bold)', color: 'var(--text-primary)' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Charts + top students */}
      <div className="grid" style={{ gridTemplateColumns: '1.5fr 1fr', gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
        {/* Trend chart */}
        <div className="chart-container">
          <div className="chart-title">Center Performance Trend</div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={avgTrend}>
              <defs>
                <linearGradient id="avgGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary-500)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--color-primary-500)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-gold-500)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--color-gold-500)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} domain={[55, 90]} />
              <Tooltip contentStyle={{ background: 'var(--bg-surface-raised)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="Score" stroke="var(--color-primary-500)" fill="url(#avgGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="Attendance" stroke="var(--color-gold-500)" fill="url(#attGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top students */}
        <div className="card" style={{ padding: 'var(--sp-5)' }}>
          <div className="section-header" style={{ marginBottom: 'var(--sp-4)' }}>
            <span className="section-title">🏆 Top Performers</span>
            <span className="badge badge-primary">November</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            {topStudents.map((e, i) => (
              <div key={e.studentId} className="flex items-center gap-3">
                <div className={`rank-badge ${i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-other'}`}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="text-sm fw-semibold truncate">{e.student?.name}</div>
                  <div className="text-xs text-tertiary">Score: {e.total}</div>
                </div>
                <div className="progress-track" style={{ width: 60 }}>
                  <div className="progress-fill" style={{ width: `${e.total}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Publish cycle + at-risk */}
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
        {/* Monthly publish flow */}
        <div className="card" style={{ padding: 'var(--sp-5)' }}>
          <div className="section-title" style={{ marginBottom: 'var(--sp-4)' }}>📢 Publish November Results</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)', marginBottom: 'var(--sp-5)' }}>
            {[
              { step: 1, label: 'Faculty Submissions Received', done: true },
              { step: 2, label: 'Scores Calculated & Ranked', done: publishStep >= 1 },
              { step: 3, label: 'Leaderboard Published', done: publishStep >= 3 },
            ].map(s => (
              <div key={s.step} className="flex items-center gap-3">
                <div style={{ width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: s.done ? 'var(--color-success-500)' : 'var(--bg-subtle)', color: s.done ? 'white' : 'var(--text-tertiary)', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
                  {s.done ? <CheckCircle size={14} /> : s.step}
                </div>
                <span className={`text-sm ${s.done ? 'fw-medium' : 'text-tertiary'}`}>{s.label}</span>
              </div>
            ))}
          </div>
          {publishStep < 3 ? (
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={handlePublish} disabled={publishStep > 0 && publishStep < 3}>
              {publishStep === 0 ? '🚀 Publish November Leaderboard' : publishStep < 3 ? 'Publishing...' : '✅ Published'}
            </button>
          ) : (
            <div style={{ background: 'var(--color-success-100)', borderRadius: 'var(--radius-md)', padding: 'var(--sp-3)', textAlign: 'center' }}>
              <span className="text-sm fw-semibold" style={{ color: 'var(--color-success-700)' }}>✅ November results are live!</span>
            </div>
          )}
        </div>

        {/* At-risk students */}
        <div className="card" style={{ padding: 'var(--sp-5)' }}>
          <div className="section-title" style={{ marginBottom: 'var(--sp-4)', color: 'var(--color-danger-500)' }}>
            <AlertTriangle size={15} style={{ display: 'inline', marginRight: 6 }} />
            At-Risk Students ({atRisk.length})
          </div>
          {atRisk.length === 0 ? (
            <div className="flex items-center gap-3" style={{ background: 'var(--color-success-100)', borderRadius: 'var(--radius-md)', padding: 'var(--sp-4)' }}>
              <CheckCircle size={16} style={{ color: 'var(--color-success-600)' }} />
              <span className="text-sm fw-medium" style={{ color: 'var(--color-success-700)' }}>All students performing above threshold!</span>
            </div>
          ) : (
            <div style={{ maxHeight: 200, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
              {atRisk.map(st => {
                const score = MONTHLY_SCORES.find(sc => sc.studentId === st.id && sc.month === CURRENT_CYCLE);
                return (
                  <div key={st.id} style={{ background: 'var(--color-danger-100)', borderRadius: 'var(--radius-md)', padding: 'var(--sp-3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="text-sm fw-medium">{st.name}</div>
                    <span className="badge badge-danger">{score?.total || 0} pts</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Announcements */}
      <div className="card" style={{ padding: 'var(--sp-5)' }}>
        <div className="section-header" style={{ marginBottom: 'var(--sp-4)' }}>
          <span className="section-title"><Megaphone size={16} style={{ display: 'inline', marginRight: 6 }} />Center Announcements</span>
          <button className="btn btn-secondary btn-sm">+ New Announcement</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
          {centerAnnouncements.slice(0, 3).map(a => (
            <div key={a.id} style={{ padding: 'var(--sp-3) var(--sp-4)', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
              <div style={{ flex: 1 }}>
                <div className="text-sm fw-semibold">{a.title}</div>
                <div className="text-xs text-tertiary">{a.publishedAt}</div>
              </div>
              <span className={`badge ${a.tag === 'results' ? 'badge-success' : a.tag === 'event' ? 'badge-primary' : 'badge-neutral'}`}>{a.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
