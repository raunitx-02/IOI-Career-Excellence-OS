import React, { useState } from 'react';
import { Save, CheckCircle, Lock, AlertCircle, Shield } from 'lucide-react';
import { STUDENTS, CLASSROOMS, BATCHES, FACULTY, SCHOOL_CATEGORIES } from '../../data/mockData';
import { useAuthStore } from '../../store/authStore';
import { useNotifStore } from '../../store/notifStore';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export default function AttendanceEntry() {
  const { user } = useAuthStore();
  const { addToast } = useNotifStore();

  // Resolve faculty — match by id, then fall back to first faculty of user's center
  const faculty = FACULTY.find(f => f.id === user?.id)
    || FACULTY.find(f => f.centerId === user?.centerId)
    || FACULTY[0];

  // Faculty school category info
  const schoolId = user?.schoolId || faculty?.schoolId || 'SOT';
  const schoolCategory = SCHOOL_CATEGORIES.find(s => s.id === schoolId);

  // Only show batches belonging to this faculty's school
  const myBatches = BATCHES.filter(b => b.schoolId === schoolId);

  // Classrooms: must match user's center AND be in their school's batches
  const myClassrooms = CLASSROOMS.filter(cl =>
    cl.centerId === (user?.centerId || faculty?.centerId) &&
    myBatches.some(b => b.id === cl.batchId)
  );

  const [selectedClassroom, setSelectedClassroom] = useState(myClassrooms[0]?.id || '');
  const [saved, setSaved] = useState(false);

  const classroom = CLASSROOMS.find(c => c.id === selectedClassroom);
  const students = STUDENTS.filter(s => s.classroomId === selectedClassroom).slice(0, 15);

  const [attendance, setAttendance] = useState(() => {
    const init = {};
    students.forEach(s => {
      DAYS.forEach(d => { init[`${s.id}-${d}`] = Math.random() > 0.15 ? 'P' : 'A'; });
    });
    return init;
  });

  const toggle = (studentId, day) => {
    if (saved) return;
    setAttendance(prev => ({
      ...prev,
      [`${studentId}-${day}`]: prev[`${studentId}-${day}`] === 'P' ? 'A' : 'P',
    }));
  };

  const handleSave = async () => {
    await new Promise(r => setTimeout(r, 600));
    setSaved(true);
    addToast({ type: 'success', title: 'Attendance Saved!', message: `Submitted for ${classroom?.name}` });
  };

  const totalPresent = students.reduce((acc, s) => {
    return acc + DAYS.filter(d => attendance[`${s.id}-${d}`] === 'P').length;
  }, 0);
  const totalSessions = students.length * DAYS.length;
  const pct = totalSessions > 0 ? Math.round((totalPresent / totalSessions) * 100) : 0;

  // Group classrooms by batch for easier navigation
  const batchGroups = myBatches.map(b => ({
    batch: b,
    classrooms: myClassrooms.filter(cl => cl.batchId === b.id),
  })).filter(g => g.classrooms.length > 0);

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: 'var(--sp-3)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-1)' }}>
              <h1 className="page-title">📋 Attendance Entry</h1>
              {/* School category badge */}
              {schoolCategory && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '3px 10px', borderRadius: 99,
                  background: `${schoolCategory.color}18`,
                  border: `1px solid ${schoolCategory.color}35`,
                  color: schoolCategory.color,
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
                }}>
                  <Shield size={10} /> {schoolCategory.id}
                </span>
              )}
            </div>
            <p className="page-subtitle">
              Marking attendance for <strong>{schoolCategory?.name || schoolId}</strong> — {user?.centerId || faculty?.centerId} Center.
              Changes are tracked in the audit log.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {saved ? (
              <span className="badge badge-success"><CheckCircle size={13} /> Submitted & Locked</span>
            ) : (
              <button className="btn btn-primary" onClick={handleSave}>
                <Save size={14} /> Save & Submit
              </button>
            )}
          </div>
        </div>
      </div>

      {/* School access notice */}
      <div className="card" style={{
        padding: 'var(--sp-3) var(--sp-4)',
        marginBottom: 'var(--sp-5)',
        background: `${schoolCategory?.color}0F`,
        border: `1px solid ${schoolCategory?.color}25`,
        display: 'flex', alignItems: 'center', gap: 'var(--sp-3)',
      }}>
        <span style={{ fontSize: 20 }}>{schoolCategory?.icon}</span>
        <div>
          <div className="text-sm fw-semibold" style={{ color: schoolCategory?.color }}>
            Access Scope: {schoolCategory?.name}
          </div>
          <div className="text-xs text-secondary">
            You can only manage attendance for batches: {myBatches.map(b => b.id).join(', ')}
          </div>
        </div>
      </div>

      {/* Batch + Classroom selector */}
      <div style={{ marginBottom: 'var(--sp-5)' }}>
        <div className="text-sm fw-semibold" style={{ marginBottom: 'var(--sp-3)', color: 'var(--text-secondary)' }}>
          Select Batch & Group:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
          {myClassrooms.map(cl => (
            <button
              key={cl.id}
              className={`btn btn-sm ${selectedClassroom === cl.id ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => { setSelectedClassroom(cl.id); setSaved(false); }}
            >
              {cl.batchId}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
        {[
          { label: 'Students', value: students.length },
          { label: 'Present Sessions', value: totalPresent },
          { label: 'Absent Sessions', value: totalSessions - totalPresent },
          { label: 'Avg Attendance', value: `${pct}%` },
        ].map(s => (
          <div key={s.label} className="kpi-card">
            <div className="kpi-label">{s.label}</div>
            <div className="kpi-value">{s.value}</div>
          </div>
        ))}
      </div>

      {saved && (
        <div style={{
          background: 'var(--color-success-100)', border: '1px solid hsl(142,60%,75%)',
          borderRadius: 'var(--radius-md)', padding: 'var(--sp-4)', marginBottom: 'var(--sp-4)',
          display: 'flex', alignItems: 'center', gap: 'var(--sp-3)',
        }}>
          <Lock size={16} style={{ color: 'var(--color-success-600)', flexShrink: 0 }} />
          <span className="text-sm fw-medium" style={{ color: 'var(--color-success-700)' }}>
            Attendance locked. Contact Center Admin to make corrections.
          </span>
        </div>
      )}

      {students.length === 0 ? (
        <div className="empty-state">
          <AlertCircle size={40} className="empty-state-icon" />
          <div className="empty-state-title">No students found</div>
          <div className="empty-state-desc">Select a different batch or classroom above.</div>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th className="text-xs text-tertiary" style={{ fontWeight: 500 }}>Batch</th>
                {DAYS.map(d => <th key={d} style={{ textAlign: 'center' }}>{d}</th>)}
                <th style={{ textAlign: 'center' }}>Total</th>
                <th style={{ textAlign: 'center' }}>%</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => {
                const presentDays = DAYS.filter(d => attendance[`${student.id}-${d}`] === 'P').length;
                const sPct = Math.round((presentDays / DAYS.length) * 100);
                return (
                  <tr key={student.id}>
                    <td><div className="text-sm fw-medium">{student.name}</div></td>
                    <td>
                      <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.04em' }}>
                        {student.batchId}
                      </span>
                    </td>
                    {DAYS.map(d => {
                      const val = attendance[`${student.id}-${d}`];
                      return (
                        <td key={d} style={{ textAlign: 'center' }}>
                          <button
                            onClick={() => toggle(student.id, d)}
                            disabled={saved}
                            style={{
                              width: 32, height: 32, borderRadius: 6, border: 'none',
                              cursor: saved ? 'default' : 'pointer',
                              background: val === 'P' ? 'var(--color-primary-500)' : 'var(--color-danger-100)',
                              color: val === 'P' ? 'white' : 'var(--color-danger-500)',
                              fontWeight: 700, fontSize: 'var(--text-xs)',
                              transition: 'all 0.2s var(--ease-spring)',
                              transform: val === 'P' ? 'scale(1)' : 'scale(0.95)',
                            }}
                          >
                            {val}
                          </button>
                        </td>
                      );
                    })}
                    <td style={{ textAlign: 'center' }}>
                      <span className="text-sm fw-semibold">{presentDays}/{DAYS.length}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`badge ${sPct >= 80 ? 'badge-success' : sPct >= 60 ? 'badge-gold' : 'badge-danger'}`}>
                        {sPct}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: 'var(--sp-4)', display: 'flex', gap: 'var(--sp-3)', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ width: 28, height: 28, background: 'var(--color-primary-500)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 'var(--text-xs)', fontWeight: 700 }}>P</div>
        <span className="text-xs text-secondary">Present (click to toggle)</span>
        <div style={{ width: 28, height: 28, background: 'var(--color-danger-100)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-danger-500)', fontSize: 'var(--text-xs)', fontWeight: 700 }}>A</div>
        <span className="text-xs text-secondary">Absent</span>
      </div>
    </div>
  );
}
