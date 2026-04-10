import React from 'react';
import { X, CheckCircle, AlertCircle, Info, Zap } from 'lucide-react';
import { useNotifStore } from '../../store/notifStore';

const typeConfig = {
  success: { Icon: CheckCircle, color: 'var(--color-success-500)', bg: 'var(--color-success-100)' },
  error: { Icon: AlertCircle, color: 'var(--color-danger-500)', bg: 'var(--color-danger-100)' },
  info: { Icon: Info, color: 'var(--color-primary-500)', bg: 'var(--color-primary-50)' },
  badge: { Icon: Zap, color: 'var(--color-gold-500)', bg: 'var(--color-gold-50)' },
};

export default function ToastContainer() {
  const { toasts, removeToast } = useNotifStore();

  return (
    <div className="toast-container">
      {toasts.map(toast => {
        const cfg = typeConfig[toast.type] || typeConfig.info;
        const Icon = cfg.Icon;
        return (
          <div key={toast.id} className="toast">
            <div style={{ width: 32, height: 32, borderRadius: 8, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {toast.emoji
                ? <span style={{ fontSize: 18 }}>{toast.emoji}</span>
                : <Icon size={16} style={{ color: cfg.color }} />
              }
            </div>
            <div style={{ flex: 1 }}>
              <div className="toast-title">{toast.title}</div>
              {toast.message && <div className="toast-message">{toast.message}</div>}
            </div>
            <button className="btn btn-ghost btn-icon-sm" onClick={() => removeToast(toast.id)}>
              <X size={12} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
