import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Target, TrendingUp, Users, Award, BarChart3, Shield, Star, Globe, CheckCircle } from 'lucide-react';
import { CENTERS, STUDENTS, getCenterAnalytics, CURRENT_CYCLE } from '../../data/mockData';

const SLIDES = [
  {
    id: 'problem',
    label: 'The Problem',
    title: 'The Challenge in Academic Motivation',
    subtitle: 'What IOI students face every day',
    content: [
      { icon: '😓', text: 'Students juggling academics, extracurriculars, and career prep with no unified visibility.' },
      { icon: '📊', text: 'No transparent, real-time feedback on academic position relative to peers.' },
      { icon: '🏫', text: 'Faculty manually track scores with no cross-center benchmarking.' },
      { icon: '🏆', text: 'Recognition is informal — hard work often goes unnoticed at scale.' },
      { icon: '📍', text: 'Management has no unified view across Bangalore, Noida, Pune, and Lucknow.' },
    ],
  },
  {
    id: 'solution',
    label: 'The Solution',
    title: 'IOI Career Excellence Leaderboard',
    subtitle: 'A Career Excellence OS — not just a marks portal',
    content: [
      { icon: '🏆', text: 'Transparent multi-level leaderboards: classroom → batch → center → cross-center.' },
      { icon: '⚡', text: 'Full gamification: XP, levels, badges, streaks, quests — built on real metrics.' },
      { icon: '🎯', text: 'Configurable weighted scoring with audit trail and explainable rank logic.' },
      { icon: '🎤', text: 'Top Learner Battleground: debates, roleplay, pitch — rubric-scored events.' },
      { icon: '🚀', text: 'Rewards system: LinkedIn endorsements, event hosting, early placement access.' },
    ],
  },
  {
    id: 'impact',
    label: 'Impact Metrics',
    title: 'Measurable Platform Impact',
    subtitle: 'Live data from the November cycle',
    isData: true,
  },
  {
    id: 'fairness',
    label: 'Fairness & Trust',
    title: 'Built on Transparency and Fairness',
    subtitle: 'Every rank is explainable. Every score is auditable.',
    content: [
      { icon: '🔍', text: 'Every student can see exactly why they got their rank — metric by metric.' },
      { icon: '📋', text: 'Participation uses a 4-band rubric (Low/Moderate/High/Outstanding), not guesswork.' },
      { icon: '🔒', text: 'Scores are locked after publish. All edits are tracked in an immutable audit log.' },
      { icon: '⚖️', text: 'Configurable tie-break rules ensure no ambiguity in ranking.' },
      { icon: '✅', text: 'Faculty attribution on all score inputs. Center Admin approval before publish.' },
    ],
  },
  {
    id: 'centers',
    label: 'Multi-Center',
    title: 'Natively Multi-Center',
    subtitle: '4 centers. One platform. Zero inconsistency.',
    isCenters: true,
  },
  {
    id: 'differentiation',
    label: 'Why Us',
    title: 'What Makes This Different',
    subtitle: 'Not a portal. An academic motivation operating system.',
    content: [
      { icon: '🌟', text: 'Designed to motivate students, not just track them — gamification with meaning.' },
      { icon: '📈', text: 'Management gets actionable cross-center intelligence, not just tables.' },
      { icon: '🎓', text: 'Faculty workflows are fast, validated, and audited — not manual spreadsheets.' },
      { icon: '🏛️', text: 'Hall of Fame, recognition wall, and achievement cards create real prestige.' },
      { icon: '🔗', text: 'Directly prepares students for placement: communication, leadership, consistency.' },
    ],
  },
];

export default function JudgeReviewMode() {
  const [slide, setSlide] = useState(0);
  const current = SLIDES[slide];
  const centerData = CENTERS.map(c => ({ ...c, analytics: getCenterAnalytics(c.id) }));

  const prev = () => setSlide(s => Math.max(0, s - 1));
  const next = () => setSlide(s => Math.min(SLIDES.length - 1, s + 1));

  return (
    <div style={{ minHeight: 'calc(100dvh - 56px)', background: 'var(--bg-app)' }}>
      {/* Progress bar */}
      <div style={{ height: 3, background: 'var(--border-subtle)' }}>
        <div style={{ height: '100%', background: 'var(--color-primary-500)', width: `${((slide + 1) / SLIDES.length) * 100}%`, transition: 'width 0.4s var(--ease-out)' }} />
      </div>

      {/* Slide nav pills */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--sp-2)', padding: 'var(--sp-4) var(--sp-6)', borderBottom: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            className={`btn btn-sm ${slide === i ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setSlide(i)}
            style={{ fontSize: 'var(--text-xs)' }}
          >
            {i + 1}. {s.label}
          </button>
        ))}
      </div>

      {/* Slide content */}
      <div className="page-content" style={{ maxWidth: 900 }} key={slide}>
        <div className="animate-slide-up">
          {/* Slide header */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--sp-10)', paddingTop: 'var(--sp-8)' }}>
            <div className="badge badge-primary" style={{ marginBottom: 'var(--sp-4)', fontSize: 'var(--text-xs)' }}>
              {slide + 1} / {SLIDES.length} — {current.label}
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(var(--text-3xl), 4vw, var(--text-5xl))', color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 'var(--sp-3)', lineHeight: 'var(--lh-tight)' }}>
              {current.title}
            </h1>
            <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)' }}>{current.subtitle}</p>
          </div>

          {/* Content cards */}
          {current.content && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)', marginBottom: 'var(--sp-10)' }}>
              {current.content.map((item, i) => (
                <div
                  key={i}
                  className="card animate-slide-up"
                  style={{ padding: 'var(--sp-5)', display: 'flex', alignItems: 'flex-start', gap: 'var(--sp-4)', animationDelay: `${i * 80}ms` }}
                >
                  <span style={{ fontSize: 28, flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ fontSize: 'var(--text-md)', color: 'var(--text-primary)', lineHeight: 'var(--lh-relaxed)' }}>{item.text}</span>
                </div>
              ))}
            </div>
          )}

          {/* Impact data slide */}
          {current.isData && (
            <div>
              <div className="grid-4 grid" style={{ gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
                {[
                  { label: 'Students Enrolled', value: STUDENTS.length, icon: '👥', color: 'var(--color-primary-500)' },
                  { label: 'Centers Covered', value: 4, icon: '🏛️', color: 'var(--color-gold-500)' },
                  { label: 'Monthly Scores Tracked', value: STUDENTS.length * 3, icon: '📊', color: 'hsl(214,82%,48%)' },
                  { label: 'Badges Awarded', value: '142+', icon: '🎖️', color: 'hsl(280,72%,48%)' },
                ].map(s => (
                  <div key={s.label} className="kpi-card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 32, marginBottom: 'var(--sp-2)' }}>{s.icon}</div>
                    <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--fw-extrabold)', color: s.color, letterSpacing: '-0.02em' }}>{s.value}</div>
                    <div className="text-xs text-tertiary" style={{ marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--sp-4)' }}>
                {centerData.map(c => (
                  <div key={c.id} className="card" style={{ padding: 'var(--sp-5)', borderTop: `3px solid ${c.color}` }}>
                    <div className="flex items-center gap-2" style={{ marginBottom: 'var(--sp-3)' }}>
                      <span style={{ fontSize: 22 }}>{c.emoji}</span>
                      <span className="text-md fw-bold">{c.name}</span>
                    </div>
                    <div className="text-2xl fw-extrabold" style={{ color: c.color, letterSpacing: '-0.02em' }}>
                      {c.analytics.avgScores[CURRENT_CYCLE - 1]?.value || 0}
                    </div>
                    <div className="text-xs text-tertiary">avg score · {c.analytics.totalStudents} students</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Centers slide */}
          {current.isCenters && (
            <div>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--sp-5)', marginBottom: 'var(--sp-6)' }}>
                {centerData.map(c => (
                  <div key={c.id} className="card" style={{ padding: 'var(--sp-6)' }}>
                    <div className="flex items-center gap-3" style={{ marginBottom: 'var(--sp-4)' }}>
                      <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-full)', background: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                        {c.emoji}
                      </div>
                      <div>
                        <div className="text-lg fw-bold">{c.name}</div>
                        <div className="text-xs text-tertiary">{c.city}</div>
                      </div>
                    </div>
                    {[
                      { l: 'Students', v: c.analytics.totalStudents },
                      { l: 'Avg Score', v: `${c.analytics.avgScores[CURRENT_CYCLE - 1]?.value || 0}/100` },
                      { l: 'Avg Attendance', v: `${c.analytics.avgAttendance[CURRENT_CYCLE - 1]?.value || 0}%` },
                      { l: 'Badges Awarded', v: c.analytics.badgeCount },
                      { l: 'Active Events', v: c.analytics.activeEvents },
                    ].map(s => (
                      <div key={s.l} className="flex items-center justify-between" style={{ padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                        <span className="text-sm text-secondary">{s.l}</span>
                        <span className="text-sm fw-semibold">{s.v}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="card" style={{ padding: 'var(--sp-5)', background: 'var(--bg-subtle)' }}>
                <div className="flex items-center gap-3">
                  <CheckCircle size={20} style={{ color: 'var(--color-success-500)', flexShrink: 0 }} />
                  <span className="text-md">Each center has its own admin, faculty, batches, classrooms, leaderboards, and events — all unified in a single platform with cross-center comparison intelligence.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ position: 'sticky', bottom: 0, background: 'var(--bg-surface)', borderTop: '1px solid var(--border-default)', padding: 'var(--sp-4) var(--sp-8)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn btn-secondary btn-lg" onClick={prev} disabled={slide === 0}>
          <ChevronLeft size={18} /> Previous
        </button>
        <span className="text-sm text-tertiary">
          {slide + 1} of {SLIDES.length}
        </span>
        <button className="btn btn-primary btn-lg" onClick={next} disabled={slide === SLIDES.length - 1}>
          Next <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
