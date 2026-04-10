import React from 'react';
import { Bell, CheckCheck, Trophy, Star, Gift, Swords, Info } from 'lucide-react';
import { useNotifStore } from '../../store/notifStore';
import { useAuthStore } from '../../store/authStore';
import { NOTIFICATIONS_TEMPLATES } from '../../data/mockData';

const typeIcons = { badge: Star, rank: Trophy, reward: Gift, result: Trophy, event: Swords, quest: CheckCheck };
const typeColors = {
  badge: 'var(--color-gold-500)', rank: 'var(--color-primary-500)',
  reward: 'var(--color-primary-500)', result: 'var(--color-gold-500)',
  event: 'var(--color-danger-500)', quest: 'var(--color-success-500)',
};

export default function NotificationPanel({ onClose }) {
  const { user } = useAuthStore();
  const { notifications, markAllRead } = useNotifStore();

  // Role-based notification scoping mock
  const roleNotifs = NOTIFICATIONS_TEMPLATES.filter(n => {
    if (user?.role === 'student' && ['rank', 'badge', 'reward', 'quest'].includes(n.type)) return true;
    if (user?.role === 'faculty' && ['event', 'alert', 'rank'].includes(n.type)) return true;
    if (['centerAdmin', 'superAdmin', 'management'].includes(user?.role)) return true;
    return false;
  });

  const allNotifs = notifications.length > 0 ? notifications :
    roleNotifs.map((t, i) => ({ ...t, id: i + 1, isRead: i > 1, createdAt: new Date(Date.now() - i * 3600000).toISOString() }));

  const unread = allNotifs.filter(n => !n.isRead).length;

  return (
    <>
      <div className="fixed inset-0" style={{ zIndex: 'calc(var(--z-dropdown) - 1)' }} onClick={onClose} />
      <div
        className="animate-slide-down card"
        style={{
          position: 'absolute', top: '44px', right: 0, width: 340, maxWidth: 'calc(100vw - 32px)',
          zIndex: 'var(--z-dropdown)', boxShadow: 'var(--shadow-xl)',
          maxHeight: '480px', display: 'flex', flexDirection: 'column',
        }}
      >
        <div className="flex items-center justify-between" style={{ padding: 'var(--sp-4)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="flex items-center gap-2">
            <Bell size={16} style={{ color: 'var(--text-secondary)' }} />
            <span className="text-sm fw-semibold">Notifications</span>
            {unread > 0 && (
              <span className="badge badge-primary" style={{ fontSize: '10px' }}>{unread} new</span>
            )}
          </div>
          {unread > 0 && (
            <button className="btn btn-ghost btn-sm" onClick={markAllRead} style={{ fontSize: 'var(--text-xs)' }}>
              <CheckCheck size={12} /> Mark all read
            </button>
          )}
        </div>
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {allNotifs.length === 0 ? (
            <div className="empty-state">
              <Bell size={32} style={{ color: 'var(--text-disabled)' }} />
              <p className="text-sm text-tertiary">No notifications yet</p>
            </div>
          ) : allNotifs.slice(0, 10).map((n, i) => {
            const Icon = typeIcons[n.type] || Info;
            const color = typeColors[n.type] || 'var(--text-primary)';
            return (
              <div
                key={n.id || i}
                className="flex items-start gap-3"
                style={{
                  padding: 'var(--sp-3) var(--sp-4)',
                  borderBottom: '1px solid var(--border-subtle)',
                  background: n.isRead ? 'transparent' : 'var(--color-primary-50)',
                  cursor: 'pointer',
                  transition: 'background var(--duration-fast)',
                }}
              >
                <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {n.icon ? <span style={{ fontSize: 16 }}>{n.icon}</span> : <Icon size={15} style={{ color }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="text-sm fw-medium">{n.title}</div>
                  <div className="text-xs text-secondary" style={{ marginTop: 2 }}>{n.message}</div>
                </div>
                {!n.isRead && <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--color-primary-500)', flexShrink: 0, marginTop: 6 }} />}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
