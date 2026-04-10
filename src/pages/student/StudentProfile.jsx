import React from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { Trophy, Star, Zap, Award, Calendar, TrendingUp, BookOpen, Target } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { STUDENTS, CENTERS, BATCHES, CLASSROOMS, getStudentProfile, BADGE_DEFS, NOMINATIONS, PLACEMENT_READINESS, CURRENT_CYCLE } from '../../data/mockData';

const MONTH_LABELS_ARR = ['Sep', 'Oct', 'Nov'];


export default function StudentProfile() {
  const { user } = useAuthStore();
  const studentId = user?.studentId || user?.id || STUDENTS[0].id;
  const profile = getStudentProfile(studentId);

  if (!profile) return <div className="page-content"><div className="skeleton" style={{ height: 400 }} /></div>;

  const { center, batch, classroom, scores, badges, xpData, streaks, placement, nominations, ranks, currentRank, rankDelta } = profile;

  const radarData = scores[2] ? [
    { metric: 'Attendance', value: scores[2].attendancePct },
    { metric: 'RAG', value: scores[2].ragScore },
    { metric: 'Assessment', value: scores[2].assessmentScore },
    { metric: 'Participation', value: scores[2].participationScore },
  ] : [];

  const trendData = MONTH_LABELS_ARR.map((m, i) => ({
    month: m,
    Score: scores[i]?.total || 0,
    Rank: ranks[i + 1] || 0,
  }));

  const initials = profile.name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  const colors = ['hsl(174,78%,36%)', 'hsl(214,82%,48%)', 'hsl(280,72%,48%)', 'hsl(24,85%,48%)'];
  const avatarBg = colors[profile.name?.charCodeAt(0) % colors.length];

  return (
    <div className="page-content">
      {/* Profile header card */}
      <div className="card" style={{ padding: 'var(--sp-6)', marginBottom: 'var(--sp-6)' }}>
        <div className="flex items-start gap-6" style={{ flexWrap: 'wrap' }}>
          <div className="avatar avatar-2xl" style={{ background: avatarBg, fontSize: 'var(--text-2xl)' }}>{initials}</div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--fw-bold)', color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 'var(--sp-2)' }}>
              {profile.name}
            </h1>
            <div className="flex items-center gap-3" style={{ flexWrap: 'wrap', marginBottom: 'var(--sp-3)' }}>
              {center && (
                <span className="center-chip">
                  <span className="center-chip-dot" style={{ background: center.color }} />
                  {center.name}
                </span>
              )}
              {batch && <span className="badge badge-neutral">{batch.name}</span>}
              {classroom && <span className="badge badge-neutral">{classroom.name}</span>}
            </div>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 'var(--sp-3)', marginTop: 'var(--sp-4)' }}>
              {[
                { label: 'Current Rank', value: `#${currentRank || '—'}`, icon: Trophy, color: 'var(--color-gold-500)' },
                { label: 'Monthly Score', value: scores[2]?.total || 0, icon: Star, color: 'var(--color-primary-500)' },
                { label: 'Total XP', value: xpData?.xp?.toLocaleString() || 0, icon: Zap, color: 'var(--color-gold-500)' },
                { label: 'Badges', value: badges.length, icon: Award, color: 'hsl(280,72%,48%)' },
              ].map(s => {
                const Icon = s.icon;
                return (
                  <div key={s.label} style={{ textAlign: 'center', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--sp-3)' }}>
                    <Icon size={16} style={{ color: s.color, margin: '0 auto var(--sp-1)' }} />
                    <div className="text-lg fw-bold">{s.value}</div>
                    <div className="text-xs text-tertiary">{s.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
        <div className="chart-container">
          <div className="chart-title">Skill Profile</div>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--border-default)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
              <Radar name="Score" dataKey="value" stroke="var(--color-primary-500)" fill="var(--color-primary-500)" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-container">
          <div className="chart-title">Score & Rank History</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-surface-raised)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="Score" stroke="var(--color-primary-500)" strokeWidth={2} dot={{ r: 4, fill: 'var(--color-primary-500)' }} />
              <Line type="monotone" dataKey="Rank" stroke="var(--color-gold-500)" strokeWidth={2} strokeDasharray="5 3" dot={{ r: 4, fill: 'var(--color-gold-500)' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Badges */}
      <div className="card" style={{ padding: 'var(--sp-5)', marginBottom: 'var(--sp-4)' }}>
        <div className="section-header" style={{ marginBottom: 'var(--sp-4)' }}>
          <span className="section-title">🎖️ Badge Gallery</span>
          <span className="badge badge-neutral">{badges.length} earned</span>
        </div>
        {badges.length === 0 ? (
          <div className="text-sm text-tertiary" style={{ padding: 'var(--sp-4)' }}>No badges earned yet.</div>
        ) : (
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 'var(--sp-3)' }}>
            {badges.map((b, i) => (
              <div key={i} className="achievement-card" style={{ padding: 'var(--sp-3)', gap: 'var(--sp-2)' }}>
                <span style={{ fontSize: 28 }}>{b.badge?.icon || '🏅'}</span>
                <div className="text-xs fw-semibold text-center" style={{ lineHeight: 1.2 }}>{b.badge?.name}</div>
                <span className={`badge badge-${b.badge?.rarity === 'gold' ? 'gold' : b.badge?.rarity === 'elite' ? 'elite' : b.badge?.rarity === 'silver' ? 'silver' : 'bronze'}`} style={{ fontSize: 9 }}>
                  {b.badge?.rarity}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Placement readiness */}
      {placement && (
        <div className="card" style={{ padding: 'var(--sp-5)', marginBottom: 'var(--sp-4)' }}>
          <div className="section-header" style={{ marginBottom: 'var(--sp-4)' }}>
            <span className="section-title">🚀 Placement Readiness</span>
            <span className="badge badge-success">Overall: {placement.overallReadiness}%</span>
          </div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 'var(--sp-3)' }}>
            {[
              { label: 'Communication', value: placement.communicationScore },
              { label: 'Leadership', value: placement.leadershipScore },
              { label: 'Consistency', value: placement.consistencyScore },
              { label: 'Technical', value: placement.technicalScore },
            ].map(m => (
              <div key={m.label}>
                <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
                  <span className="text-sm text-secondary">{m.label}</span>
                  <span className="text-sm fw-bold">{m.value}%</span>
                </div>
                <div className="progress-track" style={{ height: 6 }}>
                  <div className="progress-fill" style={{ width: `${m.value}%`, background: m.value >= 80 ? 'var(--color-success-500)' : m.value >= 60 ? 'var(--color-primary-500)' : 'var(--color-danger-500)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Nominations */}
      {nominations.length > 0 && (
        <div className="card" style={{ padding: 'var(--sp-5)' }}>
          <div className="section-header" style={{ marginBottom: 'var(--sp-4)' }}>
            <span className="section-title">🏅 Faculty Nominations</span>
          </div>
          {nominations.map(n => (
            <div key={n.id} style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--sp-4)', marginBottom: 'var(--sp-3)' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                <span className="text-sm fw-semibold" style={{ textTransform: 'capitalize' }}>{n.type.replace('-', ' ')}</span>
                <span className={`badge ${n.status === 'approved' ? 'badge-success' : 'badge-neutral'}`}>{n.status}</span>
              </div>
              <p className="text-xs text-secondary">{n.reason}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
