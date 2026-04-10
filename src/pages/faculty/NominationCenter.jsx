import React, { useState } from 'react';
import { Star, CheckCircle, Send, Users, Shield } from 'lucide-react';
import { STUDENTS, FACULTY, CLASSROOMS, BATCHES, NOMINATIONS, SCHOOL_CATEGORIES } from '../../data/mockData';
import { useAuthStore } from '../../store/authStore';
import { useNotifStore } from '../../store/notifStore';

const NOMINATION_TYPES = [
  { id: 'class-president', label: 'Class President', icon: '🏛️', desc: 'Recommend for leadership role' },
  { id: 'most-improved', label: 'Most Improved', icon: '🚀', desc: 'Significant rank or score jump' },
  { id: 'communication-star', label: 'Communication Star', icon: '🎤', desc: 'Outstanding spoken communication' },
  { id: 'event-leader', label: 'Event Leader', icon: '🎯', desc: 'Led or organized events effectively' },
  { id: 'attendance-hero', label: 'Attendance Hero', icon: '🟢', desc: 'Perfect or near-perfect attendance' },
];

export default function NominationCenter() {
  const { user } = useAuthStore();
  const { addToast } = useNotifStore();

  const faculty = FACULTY.find(f => f.id === user?.id)
    || FACULTY.find(f => f.centerId === user?.centerId)
    || FACULTY[0];

  const schoolId = user?.schoolId || faculty?.schoolId || 'SOT';
  const schoolCategory = SCHOOL_CATEGORIES.find(s => s.id === schoolId);

  // Filter to faculty's school + center
  const myBatches = BATCHES.filter(b => b.schoolId === schoolId);
  const myClassrooms = CLASSROOMS.filter(cl =>
    cl.centerId === (user?.centerId || faculty?.centerId) &&
    myBatches.some(b => b.id === cl.batchId)
  );
  const myStudents = STUDENTS.filter(s => myClassrooms.some(c => c.id === s.classroomId)).slice(0, 20);

  const [form, setForm] = useState({ studentId: '', type: '', reason: '' });
  const [submitted, setSubmitted] = useState(false);
  const [existing, setExisting] = useState(NOMINATIONS.filter(n => myStudents.some(s => s.id === n.studentId)));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await new Promise(r => setTimeout(r, 600));
    const student = myStudents.find(s => s.id === form.studentId);
    const type = NOMINATION_TYPES.find(t => t.id === form.type);
    setExisting(prev => [...prev, { id: `NOM-NEW`, studentId: form.studentId, type: form.type, reason: form.reason, status: 'pending', nominatedBy: faculty.id }]);
    setForm({ studentId: '', type: '', reason: '' });
    setSubmitted(true);
    addToast({ type: 'success', emoji: type?.icon, title: 'Nomination Submitted!', message: `${student?.name} nominated for ${type?.label}` });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', flexWrap: 'wrap', marginBottom: 'var(--sp-1)' }}>
          <h1 className="page-title"><Star size={22} style={{ display: 'inline', marginRight: 8 }} />Nomination Center</h1>
          {schoolCategory && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '3px 10px', borderRadius: 99,
              background: `${schoolCategory.color}18`,
              border: `1px solid ${schoolCategory.color}35`,
              color: schoolCategory.color,
              fontSize: 11, fontWeight: 700,
            }}>
              <Shield size={10} /> {schoolCategory.id} — {schoolCategory.shortName}
            </span>
          )}
        </div>
        <p className="page-subtitle">Recognize outstanding students from your {schoolCategory?.name} batches.</p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.2fr 1fr', gap: 'var(--sp-6)', alignItems: 'start' }}>
        {/* Form */}
        <div className="card" style={{ padding: 'var(--sp-6)' }}>
          <h2 className="text-lg fw-semibold" style={{ marginBottom: 'var(--sp-5)' }}>Nominate a Student</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            <div className="form-group">
              <label className="form-label">Select Student ({schoolCategory?.id})</label>
              <select className="form-select" value={form.studentId} onChange={e => setForm(prev => ({ ...prev, studentId: e.target.value }))} required>
                <option value="">Choose a student...</option>
                {myStudents.map(s => (
                  <option key={s.id} value={s.id}>{s.name} — {s.batchId}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Nomination Type</label>
              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-2)' }}>
                {NOMINATION_TYPES.map(t => (
                  <label
                    key={t.id}
                    style={{
                      border: `1px solid ${form.type === t.id ? 'var(--color-primary-400)' : 'var(--border-default)'}`,
                      borderRadius: 'var(--radius-md)',
                      padding: 'var(--sp-3)',
                      cursor: 'pointer',
                      background: form.type === t.id ? 'var(--color-primary-50)' : 'var(--bg-input)',
                      display: 'flex', alignItems: 'flex-start', gap: 'var(--sp-2)',
                      transition: 'all var(--duration-fast)',
                    }}
                  >
                    <input type="radio" hidden name="type" value={t.id} checked={form.type === t.id} onChange={() => setForm(prev => ({ ...prev, type: t.id }))} />
                    <span style={{ fontSize: 18 }}>{t.icon}</span>
                    <div>
                      <div className="text-xs fw-semibold">{t.label}</div>
                      <div className="text-xs text-tertiary">{t.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Reason / Justification</label>
              <textarea
                className="form-textarea"
                rows={4}
                placeholder="Describe why this student deserves this nomination..."
                value={form.reason}
                onChange={e => setForm(prev => ({ ...prev, reason: e.target.value }))}
                required
                style={{ resize: 'vertical' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={!form.studentId || !form.type || !form.reason}>
              <Send size={14} /> Submit Nomination
            </button>
          </form>
        </div>

        {/* Existing nominations */}
        <div>
          <h2 className="text-lg fw-semibold" style={{ marginBottom: 'var(--sp-4)' }}>Submitted Nominations ({existing.length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            {existing.length === 0 ? (
              <div className="empty-state">
                <Users size={36} className="empty-state-icon" />
                <div className="empty-state-desc">No nominations yet</div>
              </div>
            ) : existing.map((n, i) => {
              const student = STUDENTS.find(s => s.id === n.studentId);
              const type = NOMINATION_TYPES.find(t => t.id === n.type);
              return (
                <div key={n.id || i} className="card" style={{ padding: 'var(--sp-4)' }}>
                  <div className="flex items-start justify-between gap-3" style={{ marginBottom: 8 }}>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: 18 }}>{type?.icon}</span>
                      <div>
                        <div className="text-sm fw-semibold">{student?.name}</div>
                        <div className="text-xs text-tertiary">{type?.label}</div>
                      </div>
                    </div>
                    <span className={`badge ${n.status === 'approved' ? 'badge-success' : 'badge-neutral'}`}>
                      {n.status === 'approved' ? <><CheckCircle size={11} /> Approved</> : 'Pending'}
                    </span>
                  </div>
                  <p className="text-xs text-secondary">{n.reason}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
