import React, { useState } from 'react';
import { Users, Search, Plus, Edit2, Shield, Building2, Trash2, X, Check } from 'lucide-react';
import { CENTERS } from '../../data/mockData';
import { useUserStore } from '../../store/userStore';
import { useNotifStore } from '../../store/notifStore';

const ROLE_BADGES = {
  student: { label: 'Student', class: 'badge-primary' },
  faculty: { label: 'Faculty', class: 'badge-neutral' },
  centerAdmin: { label: 'Center Admin', class: 'badge-gold' },
  superAdmin: { label: 'Super Admin', class: 'badge-danger' },
  management: { label: 'Management', class: 'badge-success' },
};

export default function UserManagement() {
  const { users, addUser, updateUser, removeUser } = useUserStore();
  const { addToast } = useNotifStore();
  
  const [search, setSearch] = useState('');
  const [roleFilter, setFilter] = useState('all');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  
  // Add User Form State
  const [formData, setFormData] = useState({ name: '', email: '', role: 'student', centerId: 'CEN-BLR' });

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const center = (id) => CENTERS.find(c => c.id === id);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    addUser(formData);
    setShowAddModal(false);
    setFormData({ name: '', email: '', role: 'student', centerId: 'CEN-BLR' });
    addToast({ type: 'success', title: 'User Added', message: `${formData.name} was successfully added.` });
  };

  const handleUpdateRole = (id, newRole) => {
    updateUser(id, { role: newRole });
    addToast({ type: 'success', title: 'Role Updated', message: `User permissions updated automatically.` });
    setEditUser(null);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name}?`)) {
      removeUser(id);
      addToast({ type: 'error', title: 'User Removed', message: `${name} has been permanently deleted.` });
    }
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: 'var(--sp-4)' }}>
          <div>
            <h1 className="page-title"><Users size={22} style={{ display: 'inline', marginRight: 8 }} />User Management</h1>
            <p className="page-subtitle">Manage all platform users across all roles and centers.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={15} /> Add User
          </button>
        </div>
      </div>

      {/* Role counts */}
      <div className="grid grid-layout-md" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--sp-3)', marginBottom: 'var(--sp-6)' }}>
        {['all', 'student', 'faculty', 'centerAdmin', 'superAdmin', 'management'].slice(0, 5).map(role => {
          const count = role === 'all' ? users.length : users.filter(u => u.role === role).length;
          const cfg = ROLE_BADGES[role] || { label: 'All', class: 'badge-neutral' };
          return (
            <button
              key={role}
              className={`kpi-card ${roleFilter === role ? 'card-interactive' : ''}`}
              style={{ textAlign: 'left', border: roleFilter === role ? '1px solid var(--color-primary-400)' : undefined, cursor: 'pointer' }}
              onClick={() => setFilter(role)}
            >
              <div className="kpi-label" style={{ textTransform: 'capitalize' }}>{role === 'all' ? 'All Users' : cfg.label}</div>
              <div className="kpi-value" style={{ fontSize: 'var(--text-2xl)' }}>{count}</div>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 'var(--sp-5)', maxWidth: '100%' }}>
        <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
        <input className="form-input" style={{ paddingLeft: 32, maxWidth: 360 }} placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Center</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => {
              const cfg = ROLE_BADGES[u.role] || { label: u.role, class: 'badge-neutral' };
              const c = center(u.centerId);
              const isEditing = editUser === u.id;

              return (
                <tr key={u.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar avatar-sm" style={{ background: 'var(--color-primary-500)' }}>
                        {u.name?.split(' ').slice(0, 2).map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm fw-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="text-sm text-secondary">{u.email}</td>
                  <td>
                    {isEditing ? (
                      <select 
                        className="form-select" 
                        style={{ padding: '2px 8px', fontSize: 'var(--text-xs)', width: 'auto' }}
                        value={u.role}
                        onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                        autoFocus
                        onBlur={() => setEditUser(null)}
                      >
                        {Object.keys(ROLE_BADGES).map(key => (
                          <option key={key} value={key}>{ROLE_BADGES[key].label}</option>
                        ))}
                      </select>
                    ) : (
                      <span className={`badge ${cfg.class}`}>{cfg.label}</span>
                    )}
                  </td>
                  <td>
                    {c ? (
                      <span className="center-chip">
                        <span className="center-chip-dot" style={{ background: c.color }} />
                        {c.name}
                      </span>
                    ) : <span className="text-xs text-tertiary">All Centers</span>}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button className="btn btn-ghost btn-icon-sm" title="Change Role" onClick={() => setEditUser(isEditing ? null : u.id)}>
                        {isEditing ? <X size={13} /> : <Shield size={13} />}
                      </button>
                      <button className="btn btn-ghost btn-icon-sm" title="Delete User" onClick={() => handleDelete(u.id, u.name)}>
                        <Trash2 size={13} style={{ color: 'var(--color-danger-500)' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {filtered.length === 0 && (
        <div className="empty-state">
          <Users size={40} className="empty-state-icon" />
          <div className="empty-state-title">No users found</div>
          <div className="empty-state-desc">Try adjusting your search or filter.</div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'var(--bg-surface-overlay)', backdropFilter: 'var(--glass-blur)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 'var(--z-modal)', padding: 'var(--sp-4)'
        }}>
          <div className="card modal-content" style={{ width: '100%', maxWidth: 420, padding: 'var(--sp-6)' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 'var(--sp-5)' }}>
              <h2 className="text-xl fw-bold">Add New User</h2>
              <button className="btn btn-ghost btn-icon-sm" onClick={() => setShowAddModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input required className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Jane Doe" />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input required type="email" className="form-input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="jane@pw.live" />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-select" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                  {Object.keys(ROLE_BADGES).map(key => (
                    <option key={key} value={key}>{ROLE_BADGES[key].label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Center Assignment</label>
                <select className="form-select" value={formData.centerId} onChange={e => setFormData({...formData, centerId: e.target.value})}>
                  {CENTERS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: 'var(--sp-3)', marginTop: 'var(--sp-2)' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
