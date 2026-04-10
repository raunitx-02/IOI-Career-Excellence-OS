import React, { useState } from 'react';
import { ScrollText, Search, Filter, Clock } from 'lucide-react';
import { AUDIT_LOGS, DEMO_USERS } from '../../data/mockData';

const ACTION_COLORS = {
  'scores.submitted': 'badge-primary',
  'leaderboard.published': 'badge-success',
  'badge.granted': 'badge-gold',
  'reward.approved': 'badge-success',
  'weights.updated': 'badge-neutral',
  'event.created': 'badge-neutral',
};

export default function AuditLogs() {
  const [search, setSearch] = useState('');

  const filtered = AUDIT_LOGS.filter(log =>
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.details.toLowerCase().includes(search.toLowerCase()) ||
    log.performedBy.toLowerCase().includes(search.toLowerCase())
  );

  const getUser = (id) => DEMO_USERS.find(u => u.id === id)?.name || id;

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title"><ScrollText size={22} style={{ display: 'inline', marginRight: 8 }} />Audit Logs</h1>
        <p className="page-subtitle">Full immutable trail of all administrative and faculty actions on the platform.</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--sp-5)', flexWrap: 'wrap', gap: 'var(--sp-3)' }}>
        <div style={{ position: 'relative', maxWidth: 360, flex: 1 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input className="form-input" style={{ paddingLeft: 32 }} placeholder="Search action, user, or detail..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <span className="badge badge-neutral text-xs" style={{ padding: 'var(--sp-2) var(--sp-3)', alignSelf: 'center' }}>
          {filtered.length} entries
        </span>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Performed By</th>
              <th>Target</th>
              <th>Details</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(log => (
              <tr key={log.id}>
                <td>
                  <span className={`badge ${ACTION_COLORS[log.action] || 'badge-neutral'}`} style={{ fontFamily: 'monospace', fontSize: 10 }}>
                    {log.action}
                  </span>
                </td>
                <td className="text-sm">{getUser(log.performedBy)}</td>
                <td>
                  <div>
                    <div className="text-xs text-tertiary">{log.targetType}</div>
                    <div className="text-sm fw-medium" style={{ fontFamily: 'monospace', fontSize: 11 }}>{log.targetId}</div>
                  </div>
                </td>
                <td className="text-xs text-secondary" style={{ maxWidth: 280 }}>
                  <span className="line-clamp-2">{log.details}</span>
                </td>
                <td>
                  <div className="flex items-center gap-1 text-xs text-tertiary">
                    <Clock size={11} />
                    {new Date(log.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 && (
        <div className="empty-state">
          <ScrollText size={40} className="empty-state-icon" />
          <div className="empty-state-title">No matching logs</div>
        </div>
      )}
    </div>
  );
}
