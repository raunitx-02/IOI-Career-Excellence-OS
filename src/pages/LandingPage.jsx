import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import {
  Moon, Sun, ArrowRight, Trophy, Users, BarChart3, Zap,
  Star, Shield, TrendingUp, Award, Target, Sparkles
} from 'lucide-react';
import { CENTERS } from '../data/mockData';
import Logo, { LogoMark } from '../components/ui/Logo';

// Swords icon (local since lucide may not have it)
function Swords({ size, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
      <line x1="13" y1="19" x2="19" y2="13" />
      <line x1="16" y1="16" x2="20" y2="20" />
      <line x1="19" y1="21" x2="21" y2="19" />
      <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5" />
      <line x1="5" y1="14" x2="9" y2="18" />
      <line x1="7" y1="11" x2="13" y2="17" />
    </svg>
  );
}

function AnimatedCounter({ value, suffix = '' }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const duration = 1400;
    const startTime = performance.now();
    const animate = (now) => {
      const p = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setDisplay(Math.round(value * eased));
      if (p < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);
  return <span>{display.toLocaleString()}{suffix}</span>;
}

// Floating orb background
function AmbientOrbs() {
  return (
    <>
      <div style={{
        position: 'fixed', top: '-10%', left: '-5%',
        width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
        animation: 'floatSlow 10s ease-in-out infinite',
      }} />
      <div style={{
        position: 'fixed', top: '30%', right: '-10%',
        width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
        animation: 'floatSlow 14s ease-in-out infinite 3s',
      }} />
      <div style={{
        position: 'fixed', bottom: '-5%', left: '30%',
        width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(236,72,153,0.10) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
        animation: 'float 8s ease-in-out infinite 1s',
      }} />
    </>
  );
}

export default function LandingPage() {
  const { isAuthenticated, quickLogin } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated]);

  const handleQuickLogin = (role) => {
    quickLogin(role);
    navigate('/dashboard');
  };

  const stats = [
    { label: 'Students Across Centers', value: 200, suffix: '+', icon: Users,     color: 'var(--color-primary-500)' },
    { label: 'Months Tracked',          value: 8,   suffix: '',  icon: TrendingUp, color: 'var(--color-violet-500)' },
    { label: 'Badges Awarded',          value: 250, suffix: '+', icon: Star,       color: 'var(--color-gold-500)' },
    { label: 'Events Conducted',        value: 12,  suffix: '',  icon: Trophy,     color: 'hsl(142,68%,45%)' },
  ];

  const features = [
    {
      icon: Trophy, title: 'Transparent Leaderboards',
      desc: 'Classroom, batch, center, and cross-center rankings. Every rank is explainable and auditable.',
      gradient: 'linear-gradient(135deg, hsl(38,92%,52%), hsl(30,88%,48%))',
    },
    {
      icon: Zap, title: 'Gamification Engine',
      desc: 'XP, levels, badges, streaks, quests — a full motivation system that rewards consistency.',
      gradient: 'linear-gradient(135deg, hsl(246,80%,60%), hsl(270,72%,58%))',
    },
    {
      icon: Swords, title: 'Top Learner Battleground',
      desc: 'Debates, roleplay, pitch — rubric-scored events that create real leadership opportunities.',
      gradient: 'linear-gradient(135deg, hsl(270,72%,56%), hsl(300,72%,54%))',
    },
    {
      icon: Award, title: 'Rewards & Recognition',
      desc: 'LinkedIn endorsements, event hosting rights, early placement access — meaningful rewards.',
      gradient: 'linear-gradient(135deg, hsl(300,72%,56%), hsl(246,80%,60%))',
    },
    {
      icon: BarChart3, title: 'Deep Analytics',
      desc: 'Attendance–performance correlation, risk identification, improvement clusters — actionable intelligence.',
      gradient: 'linear-gradient(135deg, hsl(214,82%,54%), hsl(246,80%,58%))',
    },
    {
      icon: Shield, title: 'Fair & Auditable',
      desc: 'Every score is rubric-based, locked on publish, with full audit trails. 100% transparent.',
      gradient: 'linear-gradient(135deg, hsl(142,68%,42%), hsl(214,82%,52%))',
    },
  ];

  const roles = [
    { role: 'student',     label: 'Student',      icon: '🎓', desc: 'View your growth, rank & badges',    color: 'var(--color-primary-500)' },
    { role: 'faculty',     label: 'Faculty',       icon: '📋', desc: 'Enter scores & nominations',         color: 'hsl(214,82%,58%)' },
    { role: 'centerAdmin', label: 'Center Admin',  icon: '🏢', desc: 'Manage center & publish results',    color: 'var(--color-violet-500)' },
    { role: 'superAdmin',  label: 'Super Admin',   icon: '⚡', desc: 'Full platform control',              color: 'var(--color-gold-500)' },
    { role: 'management',  label: 'Management',    icon: '📊', desc: 'Analytics & judge review mode',      color: 'hsl(300,72%,58%)' },
  ];

  return (
    <div className="landing-hero" style={{ position: 'relative' }}>
      <AmbientOrbs />

      {/* ── Nav ── */}
      <nav className="landing-nav" style={{ position: 'sticky', top: 0, zIndex: 200 }}>
        <div
          className="flex items-center gap-3"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <Logo size="md" />
        </div>

        <div className="flex items-center gap-3">
          {CENTERS.map(c => (
            <span key={c.id} className="center-chip hide-mobile">
              <span className="center-chip-dot" style={{ background: c.color }} />
              {c.name}
            </span>
          ))}
          <button className="btn btn-ghost btn-icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark'
              ? <Sun size={16} style={{ color: 'var(--color-gold-400)' }} />
              : <Moon size={16} />
            }
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/login')}>
            Sign In <ArrowRight size={13} />
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero-section" style={{ position: 'relative', zIndex: 1 }}>
        <div className="hero-grid-bg" />

        {/* Eyebrow */}
        <div className="hero-eyebrow animate-slide-down">
          <div style={{
            width: 7, height: 7, borderRadius: '50%',
            background: 'var(--color-primary-500)',
            boxShadow: '0 0 8px rgba(99,102,241,0.60)',
            animation: 'pulseGlow 2s ease-in-out infinite',
          }} />
          PW IOI · 4 Centers · 80+ Students · Live Platform
        </div>

        {/* Title */}
        <h1 className="hero-title" style={{ position: 'relative' }}>
          The{' '}
          <span className="gradient-text">Career Excellence OS</span>
          <br />for IOI Students
        </h1>

        <p className="hero-subtitle animate-fade-in-up delay-200">
          A premium academic growth, recognition, and gamification system combining
          intelligent leaderboards, reward automation, and battleground events across all 4 IOI centers.
        </p>

        {/* CTA buttons */}
        <div className="flex items-center gap-3 animate-fade-in-up delay-300" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate('/login')}
            style={{ boxShadow: 'var(--shadow-primary)', minWidth: 180 }}
          >
            Explore Platform <ArrowRight size={18} />
          </button>
          <button
            className="btn btn-secondary btn-lg"
            onClick={() => handleQuickLogin('management')}
            style={{ minWidth: 180 }}
          >
            <Sparkles size={16} /> Judge Review Mode
          </button>
        </div>

        {/* Stats grid */}
        <div
          className="grid-4 grid animate-fade-in-up delay-400"
          style={{ gap: 'var(--sp-4)', marginTop: 'var(--sp-8)', width: '100%', maxWidth: 860 }}
        >
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="card card-interactive"
                style={{ padding: 'var(--sp-5)', textAlign: 'center', animationDelay: `${400 + i * 60}ms` }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 'var(--radius-lg)',
                  background: `${s.color}18`,
                  border: `1px solid ${s.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto var(--sp-3)',
                }}>
                  <Icon size={18} style={{ color: s.color }} />
                </div>
                <div style={{
                  fontSize: 'var(--text-3xl)', fontWeight: 800,
                  color: 'var(--text-primary)', letterSpacing: '-0.03em',
                  background: `linear-gradient(135deg, ${s.color}, var(--color-violet-400))`,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  <AnimatedCounter value={s.value} suffix={s.suffix} />
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 4 }}>{s.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: 'var(--sp-20) var(--sp-8)', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--sp-12)' }}>
            <div className="hero-eyebrow" style={{ display: 'inline-flex', marginBottom: 'var(--sp-4)' }}>
              <Sparkles size={11} /> Platform Features
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(var(--text-3xl), 4vw, var(--text-4xl))',
              color: 'var(--text-primary)', letterSpacing: '-0.02em',
              marginBottom: 'var(--sp-3)',
            }}>
              More than a leaderboard
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)', maxWidth: 560, margin: '0 auto', lineHeight: 'var(--lh-relaxed)' }}>
              Every feature is designed around <strong>student motivation</strong>,{' '}
              <strong>faculty efficiency</strong>, and <strong>management intelligence.</strong>
            </p>
          </div>

          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--sp-4)' }}>
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="card card-interactive animate-slide-up"
                  style={{ padding: 'var(--sp-6)', animationDelay: `${i * 70}ms` }}
                >
                  {/* Icon with gradient */}
                  <div style={{
                    width: 48, height: 48,
                    borderRadius: 'var(--radius-lg)',
                    background: f.gradient,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 'var(--sp-4)',
                    boxShadow: '0 4px 16px rgba(99,102,241,0.25)',
                  }}>
                    <Icon size={22} style={{ color: 'white' }} />
                  </div>
                  <h3 style={{
                    fontSize: 'var(--text-md)', fontWeight: 700,
                    color: 'var(--text-primary)', marginBottom: 'var(--sp-2)',
                    letterSpacing: '-0.01em',
                  }}>{f.title}</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--lh-relaxed)' }}>
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4 Centers ── */}
      <section style={{
        padding: 'var(--sp-16) var(--sp-8)',
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        borderTop: '1px solid var(--glass-border)',
        borderBottom: '1px solid var(--glass-border)',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-3xl)',
            color: 'var(--text-primary)', letterSpacing: '-0.02em',
            marginBottom: 'var(--sp-2)',
          }}>
            4 Centers. One Platform.
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--sp-8)', fontSize: 'var(--text-md)' }}>
            Natively multi-center — every leaderboard, badge, and reward is center-aware.
          </p>
          <div className="grid-4 grid" style={{ gap: 'var(--sp-4)' }}>
            {CENTERS.map((c, i) => (
              <div
                key={c.id}
                className="card card-interactive animate-slide-up"
                style={{ padding: 'var(--sp-5)', textAlign: 'center', animationDelay: `${i * 80}ms` }}
              >
                {/* Colored top bar */}
                <div style={{ height: 3, borderRadius: 99, background: c.color, marginBottom: 'var(--sp-4)' }} />
                <div style={{
                  width: 52, height: 52, borderRadius: 'var(--radius-full)',
                  background: `${c.color}22`,
                  border: `2px solid ${c.color}50`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto var(--sp-3)', fontSize: 24,
                }}>
                  {c.emoji}
                </div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 'var(--text-md)' }}>
                  {c.name}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 4 }}>
                  8 Batches · 32 Classrooms
                </div>
                <div style={{
                  marginTop: 'var(--sp-3)',
                  padding: '3px 10px',
                  background: `${c.color}15`,
                  border: `1px solid ${c.color}35`,
                  borderRadius: 99,
                  display: 'inline-block',
                  fontSize: 10,
                  fontWeight: 600,
                  color: c.color,
                }}>
                  Live
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quick Access by Role ── */}
      <section style={{ padding: 'var(--sp-20) var(--sp-8)', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div className="hero-eyebrow" style={{ display: 'inline-flex', marginBottom: 'var(--sp-4)' }}>
            <Target size={11} /> Demo Access
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-3xl)', color: 'var(--text-primary)',
            letterSpacing: '-0.02em', marginBottom: 'var(--sp-2)',
          }}>
            Quick Access by Role
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--sp-8)', fontSize: 'var(--text-md)' }}>
            Demo credentials are pre-loaded. Click any role to explore instantly.
          </p>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 'var(--sp-3)' }}>
            {roles.map((r, i) => (
              <button
                key={r.role}
                className="card card-interactive animate-spring-pop"
                style={{
                  padding: 'var(--sp-5)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-2)',
                  border: 'none', cursor: 'pointer', width: '100%', textAlign: 'center',
                  animationDelay: `${i * 70}ms`,
                }}
                onClick={() => handleQuickLogin(r.role)}
              >
                <span style={{ fontSize: 30 }}>{r.icon}</span>
                <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{r.label}</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', lineHeight: 1.4 }}>{r.desc}</span>
                <span style={{
                  fontSize: 11, fontWeight: 700, color: r.color,
                  marginTop: 4, display: 'flex', alignItems: 'center', gap: 3,
                }}>
                  Login instantly <ArrowRight size={10} />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: '1px solid var(--glass-border)',
        padding: 'var(--sp-6) var(--sp-8)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 'var(--sp-4)',
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        position: 'relative', zIndex: 1,
      }}>
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
            Leaderboard & Analytics Platform
          </span>
        </div>
        <div style={{ display: 'flex', gap: 'var(--sp-6)' }}>
          {CENTERS.map(c => (
            <span key={c.id} className="text-xs text-tertiary">{c.name}</span>
          ))}
        </div>
        <span className="text-xs text-tertiary">© 2026 PW Institute of Innovation</span>
      </footer>
    </div>
  );
}
