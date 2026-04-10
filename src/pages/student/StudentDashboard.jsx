import React, { useState, useEffect, useRef } from 'react';
import {
  TrendingUp, TrendingDown, Minus, Trophy, Star, Zap, Target,
  Calendar, Users, BookOpen, Award, ChevronRight, ArrowUp, ArrowDown,
  Flame, CheckCircle, Clock, BarChart3, Info, Gift
} from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line
} from 'recharts';
import { useAuthStore } from '../../store/authStore';
import {
  STUDENTS, CENTERS, BATCHES, CLASSROOMS, MONTHLY_SCORES, LEADERBOARD,
  STUDENT_BADGES, BADGE_DEFS, STUDENT_XP, STREAKS, STUDENT_QUESTS, QUESTS,
  REWARDS, CURRENT_CYCLE, getStudentProfile, ANNOUNCEMENTS,
} from '../../data/mockData';

// Animated number hook
function useCountUp(target, duration = 1000) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const start = performance.now();
    const animate = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) ref.current = requestAnimationFrame(animate);
    };
    ref.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(ref.current);
  }, [target, duration]);
  return value;
}

function RankDelta({ delta }) {
  if (!delta) return <span className="rank-same"><Minus size={12} /> No change</span>;
  if (delta > 0) return <span className="rank-up"><ArrowUp size={12} /> {delta} up</span>;
  return <span className="rank-down"><ArrowDown size={12} /> {Math.abs(delta)} down</span>;
}

function KpiCard({ label, value, sub, icon: Icon, iconColor, delta, delay = 0 }) {
  return (
    <div className="kpi-card animate-slide-up" style={{ animationDelay: `${delay}ms` }}>
      <div className="kpi-label">
        {Icon && <Icon size={14} style={{ color: iconColor || 'var(--text-tertiary)' }} />}
        {label}
      </div>
      <div className="kpi-value">{value}</div>
      {(sub || delta !== undefined) && (
        <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
          {delta !== undefined && (
            <span className={`kpi-delta ${delta > 0 ? 'kpi-delta-up' : delta < 0 ? 'kpi-delta-down' : 'kpi-delta-neutral'}`}>
              {delta > 0 ? '↑' : delta < 0 ? '↓' : '→'} {delta > 0 ? `+${delta}` : delta}
            </span>
          )}
          {sub && <span className="text-xs text-tertiary">{sub}</span>}
        </div>
      )}
    </div>
  );
}

const MONTH_LABELS = ['September', 'October', 'November', 'December', 'January', 'February', 'March', 'April'];

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [whyRankOpen, setWhyRankOpen] = useState(false);

  // Find the student ID — either the user IS a student, or pick first student for demo
  const studentId = user?.studentId || user?.id || STUDENTS[0].id;

  useEffect(() => {
    const p = getStudentProfile(studentId);
    setProfile(p);
  }, [studentId]);

  // ─── Derive values safely (null-safe) ──────────────────────────────
  const currentScore = profile?.scores?.find(s => s.month === CURRENT_CYCLE);

  // ⚠️  Hooks must ALWAYS be called — no conditionals before them
  const displayRank = useCountUp(profile?.currentRank || 0);
  const displayScore = useCountUp(currentScore?.total || 0);
  const displayXp = useCountUp(profile?.xpData?.xp || 0);

  if (!profile) {
    return (
      <div className="page-content">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 120, marginBottom: 'var(--sp-4)', borderRadius: 'var(--radius-lg)' }} />
        ))}
      </div>
    );
  }

  const { center, batch, xpData, badges, streaks, quests, scores, ranks, rankDelta, currentRank } = profile;

  // Radar chart data
  const radarData = currentScore ? [
    { metric: 'Attendance', value: currentScore.attendancePct, fullMark: 100 },
    { metric: 'RAG', value: currentScore.ragScore, fullMark: 100 },
    { metric: 'Assessment', value: currentScore.assessmentScore, fullMark: 100 },
    { metric: 'Participation', value: currentScore.participationScore, fullMark: 100 },
  ] : [];

  // Area chart data — month trend
  const trendData = MONTH_LABELS.map((label, i) => {
    const s = scores.find(sc => sc.month === i + 1);
    return {
      month: label.slice(0, 3),
      Score: s?.total || 0,
      Rank: ranks[i + 1] || 0,
    };
  });

  // Eligible rewards
  const eligibleRewards = REWARDS.filter(r => (currentScore?.total || 0) >= r.eligibilityScore);

  const myBadgeDefs = badges.slice(0, 6).map(b => ({ ...b.badge, ...b }));
  const myQuests = quests.filter(q => q.quest).slice(0, 4);
  const announcements = ANNOUNCEMENTS.slice(0, 2);

  // Insights
  const bestMetric = currentScore ? Object.entries({
    Attendance: currentScore.attendancePct,
    'RAG Improvement': currentScore.ragScore,
    Assessments: currentScore.assessmentScore,
    Participation: currentScore.participationScore,
  }).sort(([, a], [, b]) => b - a)[0] : null;

  const worstMetric = currentScore ? Object.entries({
    Attendance: currentScore.attendancePct,
    'RAG Improvement': currentScore.ragScore,
    Assessments: currentScore.assessmentScore,
    Participation: currentScore.participationScore,
  }).sort(([, a], [, b]) => a - b)[0] : null;

  return (
    <div className="page-content">
      {/* Page header */}
      <div className="page-header">
        <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: 'var(--sp-3)' }}>
          <div>
            <p className="text-sm text-tertiary" style={{ marginBottom: 4 }}>
              {center?.emoji} {center?.name} · {batch?.name}
            </p>
            <h1 className="page-title">Hello, {profile.name.split(' ')[0]} 👋</h1>
            <p className="page-subtitle">Here's your academic performance overview for November.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="badge badge-primary">{xpData?.name} Level</div>
            <button className="btn btn-secondary btn-sm" onClick={() => setWhyRankOpen(true)}>
              <Info size={13} /> Why this rank?
            </button>
          </div>
        </div>
      </div>

      {/* Announcements */}
      {announcements.length > 0 && (
        <div style={{ marginBottom: 'var(--sp-6)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
          {announcements.map(ann => (
            <div key={ann.id} style={{ background: 'var(--color-primary-50)', border: '1px solid var(--color-primary-200)', borderRadius: 'var(--radius-md)', padding: 'var(--sp-3) var(--sp-4)', display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
              <span style={{ fontSize: 16 }}>📣</span>
              <div style={{ flex: 1 }}>
                <span className="text-sm fw-semibold" style={{ color: 'var(--color-primary-700)' }}>{ann.title}</span>
                <span className="text-xs text-secondary" style={{ marginLeft: 8 }}>{ann.publishedAt}</span>
              </div>
              <span className={`badge ${ann.tag === 'event' ? 'badge-primary' : ann.tag === 'results' ? 'badge-gold' : 'badge-neutral'}`}>{ann.tag}</span>
            </div>
          ))}
        </div>
      )}

      {/* KPI Grid */}
      <div className="grid-4 grid" style={{ gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
        <KpiCard
          label="Current Rank"
          value={`#${displayRank}`}
          sub={`in ${batch?.name}`}
          icon={Trophy}
          iconColor="var(--color-gold-500)"
          delta={rankDelta}
          delay={0}
        />
        <KpiCard
          label="Monthly Score"
          value={displayScore}
          sub="/ 100 points"
          icon={Star}
          iconColor="var(--color-primary-500)"
          delta={currentScore && scores[1] ? Math.round(currentScore.total - scores[1].total) : 0}
          delay={60}
        />
        <KpiCard
          label="Total XP Earned"
          value={displayXp.toLocaleString()}
          sub={`Level ${xpData?.level} — ${xpData?.name}`}
          icon={Zap}
          iconColor="var(--color-gold-500)"
          delay={120}
        />
        <KpiCard
          label="Badges Earned"
          value={badges.length}
          sub={`${eligibleRewards.length} reward${eligibleRewards.length !== 1 ? 's' : ''} eligible`}
          icon={Award}
          iconColor="var(--color-primary-500)"
          delay={180}
        />
      </div>

      {/* Row 2 — Score breakdown + Trend */}
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
        {/* Radar — Score breakdown */}
        <div className="chart-container animate-fade-in delay-200">
          <div className="chart-title">Score Breakdown — November</div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--border-default)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <Radar name="Score" dataKey="value" stroke="var(--color-primary-500)" fill="var(--color-primary-500)" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
          {currentScore && (
            <div className="grid-4 grid" style={{ gap: 'var(--sp-2)', marginTop: 'var(--sp-4)' }}>
              {[
                { l: 'Attendance', v: currentScore.attendancePct + '%' },
                { l: 'RAG', v: currentScore.ragScore },
                { l: 'Assessment', v: currentScore.assessmentScore },
                { l: 'Participation', v: currentScore.participationScore },
              ].map(m => (
                <div key={m.l} style={{ textAlign: 'center' }}>
                  <div className="text-lg fw-bold" style={{ color: 'var(--color-primary-500)' }}>{m.v}</div>
                  <div className="text-xs text-tertiary">{m.l}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Monthly trend */}
        <div className="chart-container animate-fade-in delay-300">
          <div className="chart-title flex items-center justify-between">
            <span>Score Trend — 3 Months</span>
            <span className="badge badge-success">↑ Improving</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary-500)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="var(--color-primary-500)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} domain={[50, 100]} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-surface-raised)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
              />
              <Area type="monotone" dataKey="Score" stroke="var(--color-primary-500)" fill="url(#scoreGrad)" strokeWidth={2} dot={{ fill: 'var(--color-primary-500)', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
          {/* Rank progression */}
          <div style={{ marginTop: 'var(--sp-4)', display: 'flex', gap: 'var(--sp-3)', flexWrap: 'wrap' }}>
            {MONTH_LABELS.map((m, i) => (
              <div key={m} style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                <div className={`rank-badge ${ranks[i + 1] === 1 ? 'rank-1' : ranks[i + 1] <= 3 ? 'rank-2' : 'rank-other'}`}>
                  #{ranks[i + 1] || '—'}
                </div>
                <span className="text-xs text-secondary">{m.slice(0, 3)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3 — XP bar + Streak + Insight card */}
      <div className="grid" style={{ gridTemplateColumns: '1.5fr 1fr', gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
        {/* XP Level Card */}
        <div className="card" style={{ padding: 'var(--sp-5)' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 'var(--sp-4)' }}>
            <div>
              <div className="text-xs text-tertiary" style={{ marginBottom: 2 }}>Level Progress</div>
              <div className="text-lg fw-bold" style={{ color: 'var(--color-gold-500)' }}>Level {xpData?.level} — {xpData?.name}</div>
            </div>
            <div style={{ fontSize: 32 }}>⚡</div>
          </div>
          <div className="progress-track" style={{ height: 10, marginBottom: 'var(--sp-2)' }}>
            <div className="progress-fill progress-fill-gold" style={{ width: `${xpData?.progress || 0}%` }} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-secondary">{xpData?.xp.toLocaleString()} XP</span>
            <span className="text-xs text-secondary">{xpData?.progress}% to Level {(xpData?.level || 1) + 1}</span>
          </div>
          {/* Streak section */}
          <div style={{ marginTop: 'var(--sp-5)', borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--sp-4)' }}>
            <div className="text-xs text-tertiary fw-semibold" style={{ letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 'var(--sp-3)' }}>Active Streaks</div>
            <div className="grid-4 grid" style={{ gap: 'var(--sp-2)' }}>
              {[
                { label: 'Attendance', value: streaks?.attendanceStreak, icon: '📅' },
                { label: 'Participation', value: streaks?.participationStreak, icon: '🎤' },
                { label: 'Improvement', value: streaks?.improvementStreak, icon: '📈' },
                { label: 'Goal', value: streaks?.goalStreak, icon: '🎯' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--sp-3) var(--sp-2)' }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
                  <div className="text-md fw-bold" style={{ color: s.value >= 3 ? 'var(--color-gold-500)' : 'var(--text-primary)' }}>
                    {s.value || 0}
                    {s.value >= 3 && <Flame size={12} style={{ display: 'inline', marginLeft: 2, color: 'var(--color-gold-500)' }} />}
                  </div>
                  <div className="text-xs text-tertiary">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insight card */}
        <div className="card" style={{ padding: 'var(--sp-5)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          <div className="text-sm fw-semibold">🔍 Performance Insights</div>
          {bestMetric && (
            <div style={{ background: 'var(--color-success-100)', borderRadius: 'var(--radius-md)', padding: 'var(--sp-3)' }}>
              <div className="text-xs fw-semibold" style={{ color: 'var(--color-success-600)', marginBottom: 4 }}>💪 Your Strength</div>
              <div className="text-sm fw-medium">{bestMetric[0]}</div>
              <div className="text-xs text-secondary">Score: {bestMetric[1]}/100 — boosting your rank</div>
            </div>
          )}
          {worstMetric && (
            <div style={{ background: 'var(--color-danger-100)', borderRadius: 'var(--radius-md)', padding: 'var(--sp-3)' }}>
              <div className="text-xs fw-semibold" style={{ color: 'var(--color-danger-500)', marginBottom: 4 }}>📌 Improve Next Month</div>
              <div className="text-sm fw-medium">{worstMetric[0]}</div>
              <div className="text-xs text-secondary">Score: {worstMetric[1]}/100 — highest impact area</div>
            </div>
          )}
          <div style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--sp-3)' }}>
            <div className="text-xs fw-semibold text-tertiary" style={{ marginBottom: 4 }}>⚡ To move up 3 ranks</div>
            <div className="text-xs text-secondary">Focus on {worstMetric?.[0]} — a 10-point improvement would move you up ~3 positions.</div>
          </div>
        </div>
      </div>

      {/* Row 4 — Badges + Quests */}
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
        {/* Badges */}
        <div className="card" style={{ padding: 'var(--sp-5)' }}>
          <div className="section-header">
            <span className="section-title">🎖️ My Badges</span>
            <span className="badge badge-primary">{badges.length} earned</span>
          </div>
          {badges.length === 0 ? (
            <div className="empty-state" style={{ padding: 'var(--sp-8) var(--sp-4)' }}>
              <div className="text-sm text-tertiary">No badges yet — keep going!</div>
            </div>
          ) : (
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 'var(--sp-3)' }}>
              {myBadgeDefs.map((b, i) => (
                <div key={b.badgeId || i} className="achievement-card animate-scale-in" style={{ animationDelay: `${i * 50}ms`, padding: 'var(--sp-3)' }}>
                  <div style={{ fontSize: 24 }}>{b?.icon || '🏅'}</div>
                  <div className="text-xs fw-semibold text-primary" style={{ textAlign: 'center', lineHeight: 1.2 }}>{b?.name}</div>
                  <span className={`badge badge-${b?.rarity === 'gold' ? 'gold' : b?.rarity === 'silver' ? 'silver' : b?.rarity === 'elite' ? 'elite' : 'bronze'}`} style={{ fontSize: 9 }}>
                    {b?.rarity}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quests */}
        <div className="card" style={{ padding: 'var(--sp-5)' }}>
          <div className="section-header">
            <span className="section-title">🎯 Active Quests</span>
            <span className="badge badge-success">{myQuests.filter(q => q.completed).length} done</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            {myQuests.map((q, i) => (
              <div key={q.questId} className="animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex items-center justify-between" style={{ marginBottom: 'var(--sp-1)' }}>
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 16 }}>{q.quest?.icon}</span>
                    <span className="text-sm fw-medium">{q.quest?.title}</span>
                    {q.completed && <CheckCircle size={13} style={{ color: 'var(--color-success-500)' }} />}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="badge badge-gold" style={{ fontSize: 9 }}>+{q.quest?.xpReward} XP</span>
                    <span className="badge badge-neutral">{q.quest?.type}</span>
                  </div>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${q.completed ? 100 : q.progress}%`, background: q.completed ? 'var(--color-success-500)' : undefined }}
                  />
                </div>
                <div className="text-xs text-tertiary" style={{ marginTop: 3 }}>
                  {q.completed ? 'Completed!' : `${q.progress}%`} — {q.quest?.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 5 — Rewards eligibility */}
      {eligibleRewards.length > 0 && (
        <div className="card" style={{ padding: 'var(--sp-5)', marginBottom: 'var(--sp-6)' }}>
          <div className="section-header">
            <span className="section-title">🏆 Rewards You're Eligible For</span>
            <button className="btn btn-secondary btn-sm">View All</button>
          </div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--sp-3)' }}>
            {eligibleRewards.slice(0, 4).map(r => (
              <div key={r.id} className="card-raised" style={{ padding: 'var(--sp-4)', display: 'flex', gap: 'var(--sp-3)', alignItems: 'flex-start' }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>{r.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="text-sm fw-semibold">{r.name}</div>
                  <div className="text-xs text-secondary" style={{ marginTop: 2 }}>{r.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Why My Rank — Drawer */}
      {whyRankOpen && (
        <div className="modal-backdrop" onClick={() => setWhyRankOpen(false)}>
          <div className="modal-panel animate-scale-in" onClick={e => e.stopPropagation()}>
            <div style={{ padding: 'var(--sp-6)', borderBottom: '1px solid var(--border-subtle)' }}>
              <h2 className="text-xl fw-bold" style={{ marginBottom: 4 }}>Why Rank #{currentRank}?</h2>
              <p className="text-sm text-secondary">Full breakdown of how your rank was calculated.</p>
            </div>
            <div style={{ padding: 'var(--sp-6)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              {currentScore && [
                { label: 'Attendance', value: currentScore.attendancePct, weight: 20, max: 100 },
                { label: 'RAG Improvement', value: currentScore.ragScore, weight: 25, max: 100 },
                { label: 'Assessments', value: currentScore.assessmentScore, weight: 35, max: 100 },
                { label: 'Participation', value: currentScore.participationScore, weight: 20, max: 100 },
              ].map(m => (
                <div key={m.label}>
                  <div className="flex items-center justify-between" style={{ marginBottom: 'var(--sp-1)' }}>
                    <span className="text-sm fw-medium">{m.label}</span>
                    <span className="text-sm fw-bold" style={{ color: 'var(--color-primary-500)' }}>{m.value}/100</span>
                  </div>
                  <div className="progress-track" style={{ height: 8 }}>
                    <div className="progress-fill" style={{ width: `${m.value}%` }} />
                  </div>
                  <div className="flex items-center justify-between" style={{ marginTop: 4 }}>
                    <span className="text-xs text-tertiary">Weight: {m.weight}%</span>
                    <span className="text-xs text-tertiary">Contributes: {Math.round(m.value * m.weight / 100)} pts</span>
                  </div>
                </div>
              ))}
              <div style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--sp-4)', textAlign: 'center', marginTop: 'var(--sp-2)' }}>
                <div className="text-xs text-tertiary" style={{ marginBottom: 4 }}>Total Weighted Score</div>
                <div className="text-3xl fw-extrabold" style={{ color: 'var(--color-primary-500)' }}>{currentScore.total}</div>
              </div>
              <div style={{ background: 'var(--color-primary-50)', borderRadius: 'var(--radius-md)', padding: 'var(--sp-4)' }}>
                <div className="text-xs fw-semibold" style={{ color: 'var(--color-primary-700)', marginBottom: 6 }}>Tie-Break Order (if scores are equal)</div>
                <ol style={{ paddingLeft: 'var(--sp-4)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {['Higher RAG improvement', 'Higher assessment score', 'Higher participation score', 'Better attendance', 'Earliest completion time'].map((t, i) => (
                    <li key={i} className="text-xs text-secondary">#{i + 1} {t}</li>
                  ))}
                </ol>
              </div>
            </div>
            <div style={{ padding: 'var(--sp-4)', borderTop: '1px solid var(--border-subtle)' }}>
              <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => setWhyRankOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
