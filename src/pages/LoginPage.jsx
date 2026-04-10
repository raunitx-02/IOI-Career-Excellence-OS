import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { useNotifStore } from '../store/notifStore';
import { Eye, EyeOff, Sun, Moon, ArrowRight, ChevronRight, Lock, Mail, Sparkles } from 'lucide-react';
import { DEMO_USERS } from '../data/mockData';
import Logo from '../components/ui/Logo';

const ROLE_LABELS = {
  student:     { label: 'Student',      icon: '🎓', color: 'hsl(246,80%,65%)' },
  faculty:     { label: 'Faculty',      icon: '📋', color: 'hsl(214,82%,58%)' },
  centerAdmin: { label: 'Center Admin', icon: '🏢', color: 'hsl(270,72%,60%)' },
  superAdmin:  { label: 'Super Admin',  icon: '⚡', color: 'hsl(38,92%,52%)' },
  management:  { label: 'Management',   icon: '📊', color: 'hsl(300,72%,60%)' },
};

const QUICK_LOGINS = [
  { role: 'student',     email: DEMO_USERS.find(u => u.role === 'student')?.email,  password: 'student123', label: 'Student Demo' },
  { role: 'faculty',     email: DEMO_USERS.find(u => u.role === 'faculty')?.email, password: 'faculty123', label: 'Faculty Demo' },
  { role: 'centerAdmin', email: 'admin.blr@pwioi.edu',       password: 'admin123',   label: 'Center Admin' },
  { role: 'superAdmin',  email: 'superadmin@pwioi.edu',       password: 'admin123',   label: 'Super Admin' },
  { role: 'management',  email: 'management@pwioi.edu',       password: 'mgmt123',    label: 'Management' },
];

const ROLE_PATHS = {
  student: '/student/dashboard', faculty: '/faculty/dashboard',
  centerAdmin: '/admin/dashboard', superAdmin: '/super/dashboard',
  management: '/management/dashboard',
};

// ─── Animated cosmos background panel ──────────────────────────────────────
function CosmosPanel() {
  const canvasRef = useRef(null);

  // Particle system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let W = canvas.offsetWidth, H = canvas.offsetHeight;
    canvas.width = W; canvas.height = H;

    const resize = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W; canvas.height = H;
    };
    window.addEventListener('resize', resize);

    // Stars
    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.2 + 0.3,
      a: Math.random(),
      da: (Math.random() - 0.5) * 0.008,
      speed: Math.random() * 0.15 + 0.05,
    }));

    // Constellation lines
    const constellations = Array.from({ length: 6 }, () => ({
      points: Array.from({ length: 4 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      })),
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Stars
      stars.forEach(s => {
        s.y += s.speed;
        s.a += s.da;
        if (s.a < 0) s.a = 0, s.da *= -1;
        if (s.a > 1) s.a = 1, s.da *= -1;
        if (s.y > H) s.y = 0;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.a * 0.7})`;
        ctx.fill();
      });

      // Constellation lines
      constellations.forEach(c => {
        c.points.forEach(p => {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > W) p.vx *= -1;
          if (p.y < 0 || p.y > H) p.vy *= -1;
        });
        ctx.beginPath();
        ctx.moveTo(c.points[0].x, c.points[0].y);
        c.points.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.strokeStyle = 'rgba(167,139,250,0.18)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
        c.points.forEach(p => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(167,139,250,0.50)';
          ctx.fill();
        });
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <div style={{
      flex: '1 1 500px',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, hsl(246,45%,8%) 0%, hsl(270,40%,10%) 35%, hsl(300,30%,10%) 65%, hsl(246,45%,8%) 100%)',
    }} className="hide-mobile">

      {/* Canvas particles */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

      {/* Animated blobs */}
      <div style={{
        position: 'absolute', top: '10%', left: '15%',
        width: 360, height: 360,
        background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'floatSlow 8s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '10%',
        width: 280, height: 280,
        background: 'radial-gradient(circle, rgba(139,92,246,0.20) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'floatSlow 10s ease-in-out infinite 2s',
      }} />
      <div style={{
        position: 'absolute', top: '50%', right: '20%',
        width: 200, height: 200,
        background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite 1s',
      }} />

      {/* Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(to right, rgba(99,102,241,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(99,102,241,0.07) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', textAlign: 'center', color: 'white', padding: 'var(--sp-12)', maxWidth: 480 }}>

        <div style={{ marginBottom: 'var(--sp-8)', display: 'flex', justifyContent: 'center' }}>
          <Logo size="lg" forceLight={true} />
        </div>

        {/* Eyebrow */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '5px 14px',
          background: 'rgba(99,102,241,0.18)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(99,102,241,0.35)',
          borderRadius: 99,
          fontSize: '11px', fontWeight: 600, color: 'rgba(167,139,250,0.95)',
          letterSpacing: '0.08em', textTransform: 'uppercase',
          marginBottom: 'var(--sp-5)',
          animation: 'slideDown 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
        }}>
          <Sparkles size={12} /> Career Excellence Platform
        </div>

        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
          fontWeight: 400,
          lineHeight: 1.2,
          marginBottom: 'var(--sp-4)',
          letterSpacing: '-0.02em',
          animation: 'fadeInUp 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.1s both',
        }}>
          Your career growth,<br />
          <span style={{
            background: 'linear-gradient(135deg, hsl(246,80%,72%), hsl(270,72%,72%), hsl(300,75%,70%))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            backgroundSize: '200% auto',
            animation: 'shimmerText 3s linear infinite',
          }}>made visible.</span>
        </h2>

        <p style={{
          color: 'rgba(255,255,255,0.55)', fontSize: 'var(--text-md)',
          lineHeight: 'var(--lh-relaxed)', maxWidth: 380, margin: '0 auto',
          marginBottom: 'var(--sp-10)',
          animation: 'fadeInUp 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.2s both',
        }}>
          Track scores, earn badges, compete in events, and unlock rewards — designed for students across all 4 IOI centers.
        </p>

        {/* Center pills */}
        <div style={{
          display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center',
          marginBottom: 'var(--sp-10)',
          animation: 'fadeInUp 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.3s both',
        }}>
          {[
            { label: 'Bangalore', color: 'rgba(99,102,241,0.5)' },
            { label: 'Noida',     color: 'rgba(59,130,246,0.5)' },
            { label: 'Pune',      color: 'rgba(139,92,246,0.5)' },
            { label: 'Lucknow',   color: 'rgba(251,146,60,0.5)' },
          ].map(c => (
            <span key={c.label} style={{
              padding: '5px 14px', borderRadius: 99,
              border: `1px solid ${c.color}`,
              background: c.color.replace('0.5)', '0.12)'),
              backdropFilter: 'blur(8px)',
              fontSize: 'var(--text-xs)', fontWeight: 600,
              color: 'rgba(255,255,255,0.80)',
            }}>{c.label}</span>
          ))}
        </div>

        {/* Floating stat cards */}
        <div style={{
          display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap',
          animation: 'fadeInUp 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.4s both',
        }}>
          {[
            { label: 'Students', value: '80+',  color: 'hsl(246,80%,70%)' },
            { label: 'Badges',   value: '142+', color: 'hsl(38,92%,62%)' },
            { label: 'Events',   value: '5',    color: 'hsl(300,72%,68%)' },
            { label: 'Centers',  value: '4',    color: 'hsl(142,68%,60%)' },
          ].map((s, i) => (
            <div key={s.label} style={{
              background: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 14,
              padding: '14px 20px',
              textAlign: 'center',
              minWidth: 80,
              boxShadow: '0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.10)',
              transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
              animationDelay: `${0.5 + i * 0.07}s`,
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px) scale(1.04)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0) scale(1)'}
            >
              <div style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.50)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom decoration */}
      <div style={{
        position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'center', gap: 8,
        color: 'rgba(255,255,255,0.28)', fontSize: 11,
      }}>
        <div style={{ width: 28, height: 1, background: 'rgba(255,255,255,0.15)' }} />
        PW Institute of Innovation
        <div style={{ width: 28, height: 1, background: 'rgba(255,255,255,0.15)' }} />
      </div>
    </div>
  );
}

// ─── LoginPage ──────────────────────────────────────────────────────────────
export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [activeRole, setActiveRole] = useState(null);

  const { login, isAuthenticated, user } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { addToast } = useNotifStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) navigate(ROLE_PATHS[user.role] || '/dashboard');
  }, [isAuthenticated, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const result = login(email, password);
    setLoading(false);
    if (result.success) {
      addToast({ type: 'success', title: `Welcome back, ${result.user.name.split(' ')[0]}!`, message: `Logged in as ${ROLE_LABELS[result.user.role]?.label}` });
      navigate(ROLE_PATHS[result.user.role] || '/dashboard');
    } else {
      setError(result.error);
    }
  };

  const handleQuick = (q) => {
    setActiveRole(q.role);
    setEmail(q.email || '');
    setPassword(q.password);
  };

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', background: 'var(--bg-app)' }}>

      {/* ── Left panel ── */}
      <div style={{
        flex: '0 0 480px',
        display: 'flex', flexDirection: 'column',
        padding: 'var(--sp-8)',
        background: 'var(--glass-bg-strong)',
        backdropFilter: 'var(--glass-blur-heavy)',
        WebkitBackdropFilter: 'var(--glass-blur-heavy)',
        borderRight: '1px solid var(--glass-border)',
        boxShadow: '4px 0 40px rgba(99,102,241,0.08)',
        position: 'relative',
        zIndex: 2,
      }}>

        {/* Ambient glow */}
        <div style={{
          position: 'absolute', top: -60, left: -60,
          width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />

        {/* Top bar */}
        <div className="flex items-center justify-between" style={{ marginBottom: 'var(--sp-10)', position: 'relative' }}>
          <div style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
            <Logo size="md" />
          </div>
          <button className="btn btn-ghost btn-icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={16} style={{ color: 'var(--color-gold-400)' }} /> : <Moon size={16} />}
          </button>
        </div>

        {/* Form area */}
        <div style={{ flex: 1, position: 'relative' }}>
          <div className="animate-slide-up">
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 12px',
              background: 'rgba(99,102,241,0.10)',
              border: '1px solid rgba(99,102,241,0.22)',
              borderRadius: 99,
              fontSize: 11, fontWeight: 600,
              color: 'var(--color-primary-500)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: 'var(--sp-4)',
            }}>
              <Sparkles size={11} /> Secure Access
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-3xl)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              marginBottom: 'var(--sp-2)',
              color: 'var(--text-primary)',
              lineHeight: 1.25,
            }}>
              Sign in to your<br />account
            </h1>
            <p className="text-sm text-secondary" style={{ marginBottom: 'var(--sp-8)' }}>
              Enter your IOI credentials or use a quick demo login.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }} className="animate-slide-up delay-50">
            {/* Email */}
            <div className="form-group">
              <label className="form-label flex items-center gap-2">
                <Mail size={13} /> Email address
              </label>
              <input
                id="login-email"
                type="email"
                className="form-input"
                placeholder="you@pwioi.edu"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                required
                autoComplete="username"
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label flex items-center gap-2">
                <Lock size={13} /> Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  className="btn btn-ghost btn-icon-sm"
                  style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)' }}
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && <p className="form-error animate-spring-pop">{error}</p>}

            <button
              id="login-submit"
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ marginTop: 'var(--sp-2)', width: '100%' }}
            >
              {loading ? (
                <span style={{
                  width: 18, height: 18,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white',
                  borderRadius: '50%',
                  display: 'inline-block',
                }} className="animate-spin" />
              ) : (
                <><ArrowRight size={18} /> Sign In</>
              )}
            </button>
          </form>

          {/* Quick logins */}
          <div style={{ marginTop: 'var(--sp-8)' }} className="animate-slide-up delay-100">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', marginBottom: 'var(--sp-4)' }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
              <span className="text-xs text-tertiary">Quick Demo Access</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
              {QUICK_LOGINS.map((q, i) => {
                const cfg = ROLE_LABELS[q.role];
                const isActive = activeRole === q.role;
                return (
                  <button
                    key={q.role}
                    id={`quick-login-${q.role}`}
                    type="button"
                    className="btn btn-secondary"
                    style={{
                      justifyContent: 'flex-start',
                      gap: 'var(--sp-3)',
                      animationDelay: `${i * 60}ms`,
                      border: isActive ? '1px solid var(--border-primary)' : undefined,
                      background: isActive ? 'rgba(99,102,241,0.08)' : undefined,
                      transform: isActive ? 'scale(1.01)' : undefined,
                      transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                    }}
                    onClick={() => handleQuick(q)}
                  >
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{cfg.icon}</span>
                    <span style={{ flex: 1, textAlign: 'left', fontWeight: 600 }}>{q.label}</span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', fontFamily: 'monospace', opacity: 0.7 }}>
                      {q.password}
                    </span>
                    <ChevronRight size={14} style={{ color: 'var(--text-disabled)', flexShrink: 0 }} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <p className="text-xs text-tertiary" style={{ marginTop: 'var(--sp-6)', textAlign: 'center' }}>
          © 2026 PW Institute of Innovation · Leaderboard Platform
        </p>
      </div>

      {/* ── Right panel — animated cosmos ── */}
      <CosmosPanel />
    </div>
  );
}
