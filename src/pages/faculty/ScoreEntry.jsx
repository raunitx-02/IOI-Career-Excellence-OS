import React, { useState } from 'react';
import { Save, CheckCircle, BookOpen, Lock, Shield } from 'lucide-react';
import { STUDENTS, CLASSROOMS, BATCHES, FACULTY, SCHOOL_CATEGORIES } from '../../data/mockData';
import { useAuthStore } from '../../store/authStore';
import { useNotifStore } from '../../store/notifStore';

const SCORE_TYPES = ['Class Test 1', 'Class Test 2', 'Mid Term', 'End Term'];
const PARTICIPATION_BANDS = ['Low', 'Moderate', 'High', 'Outstanding'];
const PARTICIPATION_SCORES = { Low: 40, Moderate: 65, High: 85, Outstanding: 100 };

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

export default function ScoreEntry() {
  const { user } = useAuthStore();
  const { addToast } = useNotifStore();

  const faculty = FACULTY.find(f => f.id === user?.id)
    || FACULTY.find(f => f.centerId === user?.centerId)
    || FACULTY[0];

  const schoolId = user?.schoolId || faculty?.schoolId || 'SOT';
  const schoolCategory = SCHOOL_CATEGORIES.find(s => s.id === schoolId);

  // Filter batches to faculty's school
  const myBatches = BATCHES.filter(b => b.schoolId === schoolId);

  // Classrooms in faculty's center AND school
  const myClassrooms = CLASSROOMS.filter(cl =>
    cl.centerId === (user?.centerId || faculty?.centerId) &&
    myBatches.some(b => b.id === cl.batchId)
  );

  const [selectedClassroom, setSelectedClassroom] = useState(myClassrooms[0]?.id || '');
  const [activeTab, setActiveTab] = useState('assessment');
  const [saved, setSaved] = useState(false);

  const students = STUDENTS.filter(s => s.classroomId === selectedClassroom).slice(0, 12);

  const [scores, setScores] = useState(() => {
    const init = {};
    students.forEach(s => {
      SCORE_TYPES.forEach(t => { init[`${s.id}-${t}`] = Math.floor(Math.random() * 30 + 65); });
      init[`${s.id}-participation`] = pick(PARTICIPATION_BANDS);
      init[`${s.id}-rag`] = Math.floor(Math.random() * 20 + 60);
    });
    return init;
  });

  const handleSave = async () => {
    await new Promise(r => setTimeout(r, 700));
    setSaved(true);
    addToast({ type: 'success', title: 'Scores Submitted!', message: 'All scores saved and submitted for review.' });
  };

  // Group classrooms by batch
  const batchGroups = myBatches.map(b => ({
    batch: b,
    classrooms: myClassrooms.filter(cl => cl.batchId === b.id),
  })).filter(g => g.classrooms.length > 0);

  const tabs = [
    { id: 'assessment',    label: '📝 Assessment' },
    { id: 'participation', label: '🎤 Participation' },
    { id: 'rag',           label: '📈 RAG Score' },
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: 'var(--sp-3)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-1)' }}>
              <h1 className="page-title"><BookOpen size={22} style={{ display: 'inline', marginRight: 8 }} />Score Entry</h1>
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
              Scores for <strong>{schoolCategory?.name}</strong> — {user?.centerId || faculty?.centerId} Center.
            </p>
          </div>
          {!saved ? (
            <button className="btn btn-primary" onClick={handleSave}>
              <Save size={14} /> Save All Scores
            </button>
          ) : (
            <span className="badge badge-success" style={{ fontSize: 'var(--text-sm)', padding: 'var(--sp-2) var(--sp-3)' }}>
              <Lock size={13} /> Submitted & Locked
            </span>
          )}
        </div>
      </div>

      {/* School access notice */}
      <div className="card" style={{
        padding: 'var(--sp-3) var(--sp-4)', marginBottom: 'var(--sp-5)',
        background: `${schoolCategory?.color}0F`,
        border: `1px solid ${schoolCategory?.color}25`,
        display: 'flex', alignItems: 'center', gap: 'var(--sp-3)',
      }}>
        <span style={{ fontSize: 20 }}>{schoolCategory?.icon}</span>
        <div>
          <div className="text-sm fw-semibold" style={{ color: schoolCategory?.color }}>
            Scope: {schoolCategory?.name} — Batches: {myBatches.map(b => b.id).join(' · ')}
          </div>
          <div className="text-xs text-secondary">
            You can only enter scores for students in your assigned school.
          </div>
        </div>
      </div>

      {/* Batch + Classroom selector */}
      <div style={{ marginBottom: 'var(--sp-5)' }}>
        <div className="text-sm fw-semibold" style={{ marginBottom: 'var(--sp-3)', color: 'var(--text-secondary)' }}>
          Select Batch & Group:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-3)' }}>
          {batchGroups.map(({ batch, classrooms }) => (
            <div key={batch.id} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-1)' }}>
              <div className="text-xs fw-semibold text-tertiary" style={{ letterSpacing: '0.06em', textTransform: 'uppercase', padding: '0 var(--sp-2)' }}>
                {batch.id}
              </div>
              <div style={{ display: 'flex', gap: 'var(--sp-1)' }}>
                {classrooms.map(cl => (
                  <button
                    key={cl.id}
                    className={`btn btn-sm ${selectedClassroom === cl.id ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => { setSelectedClassroom(cl.id); setSaved(false); }}
                  >
                    {cl.name.split('—').pop()?.trim() || cl.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-list" style={{ marginBottom: 0 }}>
        {tabs.map(t => (
          <button key={t.id} className={`tab-trigger ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {/* ── Assessment Tab ── */}
        {activeTab === 'assessment' && (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>Batch</th>
                  {SCORE_TYPES.map(t => <th key={t} style={{ textAlign: 'center' }}>{t}</th>)}
                  <th style={{ textAlign: 'center' }}>Avg</th>
                </tr>
              </thead>
              <tbody>
                {students.map(st => {
                  const vals = SCORE_TYPES.map(t => scores[`${st.id}-${t}`] || 0);
                  const avg = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
                  return (
                    <tr key={st.id}>
                      <td className="text-sm fw-medium">{st.name}</td>
                      <td>
                        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.04em' }}>
                          {st.batchId}
                        </span>
                      </td>
                      {SCORE_TYPES.map(t => (
                        <td key={t} style={{ textAlign: 'center', width: 100 }}>
                          <input
                            type="number" min={0} max={100}
                            value={scores[`${st.id}-${t}`] || ''}
                            disabled={saved}
                            onChange={e => setScores(prev => ({ ...prev, [`${st.id}-${t}`]: Number(e.target.value) }))}
                            className="form-input"
                            style={{ width: 64, textAlign: 'center', padding: '4px', fontSize: 'var(--text-sm)' }}
                          />
                        </td>
                      ))}
                      <td style={{ textAlign: 'center' }}>
                        <span className={`badge ${avg >= 80 ? 'badge-success' : avg >= 60 ? 'badge-primary' : 'badge-danger'}`}>{avg}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Participation Tab ── */}
        {activeTab === 'participation' && (
          <div>
            <div style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--sp-4)', marginBottom: 'var(--sp-4)' }}>
              <div className="text-sm fw-semibold" style={{ marginBottom: 8 }}>Participation Rubric Guide</div>
              <div className="grid-4 grid" style={{ gap: 'var(--sp-3)' }}>
                {PARTICIPATION_BANDS.map(b => (
                  <div key={b} style={{ background: 'var(--bg-surface)', backdropFilter: 'var(--glass-blur-light)', borderRadius: 'var(--radius-md)', padding: 'var(--sp-3)' }}>
                    <div className="text-sm fw-semibold">{b}</div>
                    <div className="text-xs text-tertiary">{PARTICIPATION_SCORES[b]} pts</div>
                    <div className="text-xs text-secondary" style={{ marginTop: 4 }}>
                      {b === 'Low' && 'Rarely responds or participates'}
                      {b === 'Moderate' && 'Participates when prompted'}
                      {b === 'High' && 'Proactively engages in class'}
                      {b === 'Outstanding' && 'Leads discussion consistently'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Batch</th>
                    <th style={{ textAlign: 'center' }}>Participation Band</th>
                    <th style={{ textAlign: 'center' }}>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(st => {
                    const val = scores[`${st.id}-participation`] || 'Moderate';
                    const score = PARTICIPATION_SCORES[val];
                    return (
                      <tr key={st.id}>
                        <td className="text-sm fw-medium">{st.name}</td>
                        <td><span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)' }}>{st.batchId}</span></td>
                        <td style={{ textAlign: 'center' }}>
                          <select
                            className="form-select"
                            style={{ width: 'auto', fontSize: 'var(--text-sm)', margin: '0 auto', display: 'block' }}
                            value={val}
                            disabled={saved}
                            onChange={e => setScores(prev => ({ ...prev, [`${st.id}-participation`]: e.target.value }))}
                          >
                            {PARTICIPATION_BANDS.map(b => <option key={b} value={b}>{b}</option>)}
                          </select>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span className={`badge ${score >= 85 ? 'badge-success' : score >= 65 ? 'badge-primary' : 'badge-neutral'}`}>{score}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── RAG Tab ── */}
        {activeTab === 'rag' && (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Batch</th>
                  <th>Previous RAG</th>
                  <th>Current RAG</th>
                  <th>Δ Change</th>
                </tr>
              </thead>
              <tbody>
                {students.map(st => {
                  const current = scores[`${st.id}-rag`] || 65;
                  const previous = Math.max(40, current - 10);
                  const improvement = current - previous;
                  return (
                    <tr key={st.id}>
                      <td className="text-sm fw-medium">{st.name}</td>
                      <td><span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)' }}>{st.batchId}</span></td>
                      <td><span className="badge badge-neutral">{previous}</span></td>
                      <td>
                        <input
                          type="number" min={0} max={100}
                          value={current}
                          disabled={saved}
                          onChange={e => setScores(prev => ({ ...prev, [`${st.id}-rag`]: Number(e.target.value) }))}
                          className="form-input"
                          style={{ width: 72, fontSize: 'var(--text-sm)', padding: '4px 8px' }}
                        />
                      </td>
                      <td>
                        <span className={`badge ${improvement > 0 ? 'badge-success' : improvement < 0 ? 'badge-danger' : 'badge-neutral'}`}>
                          {improvement > 0 ? '+' : ''}{improvement}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
