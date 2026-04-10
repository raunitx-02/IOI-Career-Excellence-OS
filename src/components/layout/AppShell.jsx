import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { useNotifStore } from '../../store/notifStore';
import {
  LayoutDashboard, Trophy, Users, Gift, Swords, BarChart3,
  FileDown, Settings, LogOut, Sun, Moon, Bell, Search,
  ChevronDown, Menu, X, Shield, BookOpen, ClipboardList,
  UserCheck, Star, Building2, Activity, ScrollText, Award, MoreHorizontal
} from 'lucide-react';
import { CENTERS } from '../../data/mockData';
import CommandBar from './CommandBar';
import NotificationPanel from './NotificationPanel';
import Logo from '../ui/Logo';

const NAV_CONFIG = {
  student: [
    { label: 'Dashboard',    icon: LayoutDashboard, path: '/student/dashboard' },
    { label: 'Leaderboard',  icon: Trophy,          path: '/student/leaderboard' },
    { label: 'Rewards',      icon: Gift,            path: '/student/rewards' },
    { label: 'Battleground', icon: Swords,          path: '/student/battleground' },
    { label: 'My Profile',   icon: Users,           path: '/student/profile' },
  ],
  faculty: [
    { label: 'Dashboard',   icon: LayoutDashboard, path: '/faculty/dashboard' },
    { label: 'Attendance',  icon: ClipboardList,   path: '/faculty/attendance' },
    { label: 'Score Entry', icon: BookOpen,        path: '/faculty/scores' },
    { label: 'Nominations', icon: Star,            path: '/faculty/nominations' },
  ],
  centerAdmin: [
    { label: 'Dashboard',      icon: LayoutDashboard, path: '/admin/dashboard' },
    { label: 'Leaderboards',   icon: Trophy,          path: '/admin/leaderboard' },
    { label: 'Publish Cycle',  icon: Award,           path: '/admin/publish' },
    { label: 'Analytics',      icon: BarChart3,       path: '/admin/analytics' },
    { label: 'Settings',       icon: Settings,        path: '/admin/settings' },
  ],
  superAdmin: [
    { label: 'Command Center',  icon: LayoutDashboard, path: '/super/dashboard' },
    { label: 'Leaderboards',    icon: Trophy,          path: '/super/leaderboard' },
    { label: 'User Management', icon: UserCheck,       path: '/super/users' },
    { label: 'Scoring Policy',  icon: Shield,          path: '/super/policy' },
    { label: 'Analytics',       icon: BarChart3,       path: '/super/analytics' },
    { label: 'Audit Logs',      icon: ScrollText,      path: '/super/audit' },
  ],
  management: [
    { label: 'Overview',          icon: LayoutDashboard, path: '/management/dashboard' },
    { label: 'Analytics',         icon: BarChart3,       path: '/management/analytics' },
    { label: 'Judge Review Mode', icon: Activity,        path: '/management/review' },
  ],
};

const ROLE_COLORS = {
  student:     'linear-gradient(135deg, hsl(246,80%,60%), hsl(270,72%,58%))',
  faculty:     'linear-gradient(135deg, hsl(214,82%,52%), hsl(246,80%,58%))',
  centerAdmin: 'linear-gradient(135deg, hsl(270,72%,52%), hsl(300,72%,54%))',
  superAdmin:  'linear-gradient(135deg, hsl(38,92%,50%), hsl(30,88%,48%))',
  management:  'linear-gradient(135deg, hsl(300,72%,54%), hsl(246,80%,58%))',
};

function AvatarInitials({ name, role, size = 'md' }) {
  const initials = name?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() || '?';
  const bg = ROLE_COLORS[role] || ROLE_COLORS.student;
  return (
    <div
      className={`avatar avatar-${size}`}
      style={{ background: bg, boxShadow: '0 2px 10px rgba(99,102,241,0.35)' }}
    >
      {initials}
    </div>
  );
}

function CenterDot({ centerId }) {
  const center = CENTERS.find(c => c.id === centerId);
  if (!center) return null;
  return (
    <span className="center-chip" style={{ fontSize: 10 }}>
      <span className="center-chip-dot" style={{ background: center.color }} />
      {center.name}
    </span>
  );
}

function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = NAV_CONFIG[user?.role] || [];

  const handleLogout = () => { logout(); navigate('/login'); };

  const roleLabel = user?.role?.replace(/([A-Z])/g, ' $1').trim();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed animate-fade-in"
          style={{ inset: 0, background: 'rgba(10,8,28,0.60)', backdropFilter: 'blur(4px)', zIndex: 'var(--z-overlay)' }}
          onClick={onClose}
        />
      )}

      <aside
        className="sidebar"
        style={{
          zIndex: 'var(--z-modal)',
          position: isOpen ? 'fixed' : undefined,
          left: isOpen ? 0 : undefined,
          top: isOpen ? 0 : undefined,
          bottom: isOpen ? 0 : undefined,
          transform: isOpen !== undefined && window.innerWidth <= 768
            ? isOpen ? 'translateX(0)' : 'translateX(-100%)'
            : undefined,
          transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {/* Header — PW IOI Logo */}
        <div className="sidebar-header">
          <div className="sidebar-logo" style={{ justifyContent: 'space-between' }}>
            <div
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              onClick={() => navigate('/')}
            >
              <Logo size="sm" />
            </div>
            <button className="btn btn-ghost btn-icon show-mobile" onClick={onClose}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* User card */}
        <div style={{
          padding: 'var(--sp-3)',
          margin: 'var(--sp-2)',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--glass-bg)',
          backdropFilter: 'var(--glass-blur)',
          WebkitBackdropFilter: 'var(--glass-blur)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--shadow-glass)',
        }}>
          <div className="flex items-center gap-3">
            <AvatarInitials name={user?.name} role={user?.role} size="md" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="text-sm fw-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                {user?.name}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-tertiary)', textTransform: 'capitalize' }}>
                {roleLabel}
              </div>
            </div>
          </div>
          {user?.centerId && (
            <div style={{ marginTop: 'var(--sp-2)' }}>
              <CenterDot centerId={user.centerId} />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item, i) => {
            const Icon = item.icon;
            const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <a
                key={item.path}
                href={item.path}
                className={`nav-item ${active ? 'active' : ''} animate-slide-up`}
                style={{ animationDelay: `${i * 40}ms` }}
                onClick={e => { e.preventDefault(); navigate(item.path); onClose?.(); }}
              >
                <Icon className="nav-item-icon" />
                {item.label}
                {active && (
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: 'var(--color-primary-500)',
                      boxShadow: '0 0 6px rgba(99,102,241,0.60)',
                      animation: 'pulseGlow 2s ease-in-out infinite',
                    }} />
                  </div>
                )}
              </a>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div style={{
            padding: 'var(--sp-2) var(--sp-1)',
            borderTop: '1px solid var(--glass-border-subtle)',
            display: 'flex', flexDirection: 'column', gap: 'var(--sp-1)',
          }}>
            <button className="nav-item" style={{ width: '100%' }} onClick={toggleTheme}>
              {theme === 'dark'
                ? <Sun size={16} style={{ color: 'var(--color-gold-400)' }} />
                : <Moon size={16} />
              }
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button
              className="nav-item"
              style={{ width: '100%', color: 'var(--color-danger-500)' }}
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>

          {/* PW branding footer */}
          <div style={{
            padding: 'var(--sp-3)',
            textAlign: 'center',
            borderTop: '1px solid var(--glass-border-subtle)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Logo size="xs" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [notifOpen, setNotifOpen]     = useState(false);
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { notifications } = useNotifStore();
  const unread = notifications.filter(n => !n.isRead).length;
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="app-main">
        {/* Topbar */}
        <header className="topbar">
          {/* Mobile logo */}
          <div className="show-mobile" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <Logo size={24} />
          </div>

          <div style={{ flex: 1 }} />

          {/* Search trigger */}
          <button className="command-bar-trigger hide-mobile" onClick={() => setCommandOpen(true)}>
            <Search size={14} />
            <span>Search anything...</span>
            <span style={{
              marginLeft: 'auto', fontSize: '10px', color: 'var(--text-disabled)',
              background: 'var(--bg-subtle)',
              padding: '1px 6px', borderRadius: 4, fontFamily: 'monospace',
            }}>⌘K</span>
          </button>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button className="btn btn-ghost btn-icon" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark'
                ? <Sun size={16} style={{ color: 'var(--color-gold-400)' }} />
                : <Moon size={16} />
              }
            </button>

            <div style={{ position: 'relative' }}>
              <button className="btn btn-ghost btn-icon" onClick={() => setNotifOpen(!notifOpen)} aria-label="Notifications">
                <Bell size={16} />
                {unread > 0 && <span className="notif-dot" />}
              </button>
              {notifOpen && <NotificationPanel onClose={() => setNotifOpen(false)} />}
            </div>

            {/* User avatar */}
            <div
              className="hide-mobile flex items-center gap-2"
              style={{ paddingLeft: 'var(--sp-2)', borderLeft: '1px solid var(--border-subtle)' }}
            >
              <AvatarInitials name={user?.name} role={user?.role} size="sm" />
              <div className="hide-mobile">
                <div className="text-sm fw-medium" style={{ lineHeight: 1.2 }}>
                  {user?.name?.split(' ')[0]}
                </div>
                <div className="text-xs text-tertiary" style={{ textTransform: 'capitalize', lineHeight: 1.2 }}>
                  {user?.role?.replace(/([A-Z])/g, ' $1').trim()}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <Outlet />

        {/* Mobile bottom nav */}
        <MobileBottomNav />
      </div>

      {commandOpen && <CommandBar onClose={() => setCommandOpen(false)} />}
    </div>
  );
}

function MobileBottomNav() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  
  const allItems = NAV_CONFIG[user?.role] || [];
  const MAX_VISIBLE = 4;
  const primaryItems = allItems.slice(0, MAX_VISIBLE);
  const extraItems = allItems.slice(MAX_VISIBLE);
  const hasExtra = extraItems.length > 0;

  return (
    <>
      <nav className="bottom-nav">
        {primaryItems.map(item => {
          const Icon = item.icon;
          const active = location.pathname === item.path && !moreOpen;
          return (
            <button
              key={item.path}
              className={`bottom-nav-item ${active ? 'active' : ''}`}
              onClick={() => { setMoreOpen(false); navigate(item.path); }}
            >
              <Icon size={20} />
              <span>{item.label.split(' ')[0]}</span>
              {active && <div style={{ position: 'absolute', bottom: 4, width: 4, height: 4, borderRadius: '50%', background: 'var(--color-primary-500)' }} />}
            </button>
          );
        })}
        {hasExtra && (
          <button
            className={`bottom-nav-item ${moreOpen ? 'active' : ''}`}
            onClick={() => setMoreOpen(!moreOpen)}
          >
            <MoreHorizontal size={20} />
            <span>More</span>
            {moreOpen && <div style={{ position: 'absolute', bottom: 4, width: 4, height: 4, borderRadius: '50%', background: 'var(--color-primary-500)' }} />}
          </button>
        )}
      </nav>

      {/* Slide-up More Sheet */}
      {moreOpen && hasExtra && (
        <>
          <div className="fixed inset-0" style={{ zIndex: 'calc(var(--z-sticky) - 1)', background: 'var(--bg-surface-overlay)', backdropFilter: 'var(--glass-blur)' }} onClick={() => setMoreOpen(false)} />
          <div className="animate-slide-up card" style={{
            position: 'fixed', bottom: 64, left: 'var(--sp-4)', right: 'var(--sp-4)', padding: 'var(--sp-4)',
            zIndex: 'var(--z-sticky)', boxShadow: 'var(--shadow-xl)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)'
          }}>
            <div className="text-sm fw-semibold text-tertiary" style={{ margin: '0 0 var(--sp-2) var(--sp-2)' }}>Additional Options</div>
            {extraItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  className="btn btn-ghost"
                  style={{ justifyContent: 'flex-start', color: location.pathname === item.path ? 'var(--color-primary-500)' : 'var(--text-secondary)' }}
                  onClick={() => { setMoreOpen(false); navigate(item.path); }}
                >
                  <Icon size={16} /> {item.label}
                </button>
              );
            })}
            <div style={{ height: 1, background: 'var(--border-subtle)', margin: 'var(--sp-2) 0' }} />
            <button className="btn btn-ghost" style={{ justifyContent: 'flex-start', color: 'var(--color-danger-500)' }} onClick={() => { logout(); navigate('/login'); }}>
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </>
      )}
    </>
  );
}
