import React, { useState } from 'react';
import { Settings, Save, Palette } from 'lucide-react';
import { CENTERS } from '../../data/mockData';
import { useAuthStore } from '../../store/authStore';
import { useNotifStore } from '../../store/notifStore';

export default function CenterSettings() {
  const { user } = useAuthStore();
  const { addToast } = useNotifStore();
  const centerId = user?.centerId || 'BLR';
  const center = CENTERS.find(c => c.id === centerId);
  const [name, setName] = useState(center?.name || '');
  const [color, setColor] = useState(center?.color || '#0d9488');
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    await new Promise(r => setTimeout(r, 500));
    setSaved(true);
    addToast({ type: 'success', title: 'Settings Saved', message: 'Center settings updated successfully.' });
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title"><Settings size={22} style={{ display: 'inline', marginRight: 8 }} />Center Settings</h1>
        <p className="page-subtitle">Manage branding, display preferences, and center-level configurations.</p>
      </div>
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-6)', alignItems: 'start' }}>
        <div className="card" style={{ padding: 'var(--sp-6)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
          <h2 className="text-lg fw-semibold">Center Branding</h2>
          <div className="form-group">
            <label className="form-label">Center Display Name</label>
            <input className="form-input" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Accent Color</label>
            <div className="flex items-center gap-3">
              <input type="color" value={color} onChange={e => setColor(e.target.value)} style={{ width: 44, height: 36, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', cursor: 'pointer', background: 'none', padding: 2 }} />
              <span className="text-sm text-secondary">{color}</span>
            </div>
          </div>
          <div style={{ padding: 'var(--sp-4)', borderRadius: 'var(--radius-md)', border: `2px solid ${color}`, background: `${color}15` }}>
            <div className="text-xs text-tertiary" style={{ marginBottom: 4 }}>Preview</div>
            <div style={{ fontWeight: 700, color }} >{name} Center</div>
          </div>
          <button className="btn btn-primary" onClick={handleSave}><Save size={14} /> Save Settings</button>
        </div>
        <div className="card" style={{ padding: 'var(--sp-6)' }}>
          <h2 className="text-lg fw-semibold" style={{ marginBottom: 'var(--sp-4)' }}>Center Info</h2>
          {[
            { label: 'Center ID', value: centerId },
            { label: 'City', value: center?.city },
            { label: 'Default Emoji', value: center?.emoji },
            { label: 'Role', value: 'Center Admin' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--sp-3) 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <span className="text-sm text-secondary">{item.label}</span>
              <span className="text-sm fw-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
