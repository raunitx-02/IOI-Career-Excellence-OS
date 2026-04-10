import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Trophy, Users, Gift, Swords, BarChart3, X, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { STUDENTS, EVENTS, REWARDS, BADGE_DEFS } from '../../data/mockData';

const ROLE_PATHS = {
  student: '/student',
  faculty: '/faculty',
  centerAdmin: '/admin',
  superAdmin: '/super',
  management: '/management',
};

export default function CommandBar({ onClose }) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(0);
  const inputRef = useRef(null);
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const base = ROLE_PATHS[user?.role] || '/student';

  useEffect(() => {
    inputRef.current?.focus();
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') setFocused(f => f + 1);
      if (e.key === 'ArrowUp') setFocused(f => Math.max(0, f - 1));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const q = query.toLowerCase();
  const results = [];

  if (!q) {
    results.push(
      { type: 'nav', label: 'Leaderboard', icon: Trophy, action: () => navigate(`${base}/leaderboard`) },
      { type: 'nav', label: 'Rewards', icon: Gift, action: () => navigate(`${base}/rewards`) },
      { type: 'nav', label: 'Battleground Events', icon: Swords, action: () => navigate(`${base}/battleground`) },
      { type: 'nav', label: 'Analytics', icon: BarChart3, action: () => navigate(`${base}/analytics`) },
    );
  } else {
    STUDENTS.filter(s => s.name.toLowerCase().includes(q)).slice(0, 4).forEach(s => {
      results.push({
        type: 'student', label: s.name, sublabel: `${s.centerId} · Batch ${s.batchId}`,
        icon: Users, action: () => navigate(`${base}/dashboard`),
      });
    });
    EVENTS.filter(e => e.title.toLowerCase().includes(q)).slice(0, 3).forEach(e => {
      results.push({
        type: 'event', label: e.title, sublabel: e.type,
        icon: Swords, action: () => navigate(`${base}/battleground`),
      });
    });
    REWARDS.filter(r => r.name.toLowerCase().includes(q)).slice(0, 3).forEach(r => {
      results.push({
        type: 'reward', label: r.name, sublabel: r.type,
        icon: Gift, action: () => navigate(`${base}/rewards`),
      });
    });
    BADGE_DEFS.filter(b => b.name.toLowerCase().includes(q)).slice(0, 3).forEach(b => {
      results.push({
        type: 'badge', label: b.name, sublabel: b.rarity,
        emoji: b.icon, action: () => navigate(`${base}/dashboard`),
      });
    });
  }

  const sliced = results.slice(0, 8);

  return (
    <div className="command-overlay animate-fade-in" onClick={onClose}>
      <div className="command-panel animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className="command-input-wrap">
          <Search size={18} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            className="command-input"
            placeholder="Search students, events, rewards, badges..."
            value={query}
            onChange={e => { setQuery(e.target.value); setFocused(0); }}
          />
          <button className="btn btn-ghost btn-icon-sm" onClick={onClose}><X size={14} /></button>
        </div>
        <div className="command-results">
          {sliced.length === 0 && (
            <div className="empty-state" style={{ padding: 'var(--sp-8)' }}>
              <p className="text-sm text-tertiary">No results for "{query}"</p>
            </div>
          )}
          {sliced.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className={`command-item ${i === focused % sliced.length ? 'focused' : ''}`}
                onClick={() => { item.action(); onClose(); }}
              >
                <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {item.emoji ? <span style={{ fontSize: 16 }}>{item.emoji}</span> : <Icon size={16} style={{ color: 'var(--text-secondary)' }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="text-sm fw-medium truncate">{item.label}</div>
                  {item.sublabel && <div className="text-xs text-tertiary" style={{ textTransform: 'capitalize' }}>{item.sublabel}</div>}
                </div>
                <ArrowRight size={14} style={{ color: 'var(--text-disabled)' }} />
              </div>
            );
          })}
        </div>
        {!q && (
          <div style={{ padding: 'var(--sp-2) var(--sp-4)', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
            {[['↑↓', 'Navigate'], ['↵', 'Select'], ['Esc', 'Close']].map(([key, label]) => (
              <span key={key} className="text-xs text-tertiary flex items-center gap-1">
                <kbd style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-default)', borderRadius: 4, padding: '1px 5px', fontFamily: 'monospace', fontSize: 10 }}>{key}</kbd>
                {label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
