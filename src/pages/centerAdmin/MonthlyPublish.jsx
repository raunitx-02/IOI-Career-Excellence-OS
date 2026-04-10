import React, { useState } from 'react';
import { CheckCircle, Lock, AlertCircle, Play, Trophy } from 'lucide-react';
import { CENTERS, BATCHES, MONTHLY_SCORES, LEADERBOARD, STUDENTS, CURRENT_CYCLE } from '../../data/mockData';
import { useAuthStore } from '../../store/authStore';
import { useNotifStore } from '../../store/notifStore';

const STEPS = [
  { id: 1, label: 'Verify all faculty submissions received', desc: 'Check that every classroom has submitted attendance, scores, and participation.' },
  { id: 2, label: 'Run score calculation engine', desc: 'Apply configured weights and tie-break rules across all students.' },
  { id: 3, label: 'Preview leaderboard ranking', desc: 'Review final rankings before making them public.' },
  { id: 4, label: 'Publish to all students & faculty', desc: 'Leaderboard goes live, badges unlock, notifications sent.' },
];

export default function MonthlyPublish() {
  const { user } = useAuthStore();
  const { addToast } = useNotifStore();
  const centerId = user?.centerId || 'BLR';
  const center = CENTERS.find(c => c.id === centerId);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [published, setPublished] = useState(false);

  const centerStudents = STUDENTS.filter(s => s.centerId === centerId);
  const lb = LEADERBOARD[`center-${centerId}-${CURRENT_CYCLE}`] || [];
  const preview = lb.slice(0, 5).map(e => ({ ...e, student: STUDENTS.find(s => s.id === e.studentId) }));

  const handleStep = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      setPublished(true);
      addToast({ type: 'success', emoji: '🏆', title: 'Results Published!', message: `${center?.name} November leaderboard is now live for all students.` });
    }
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">📢 Publish Monthly Results</h1>
        <p className="page-subtitle">Complete each step to safely publish the November leaderboard for {center?.name}.</p>
      </div>

      {published ? (
        <div className="card" style={{ padding: 'var(--sp-12)', textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 'var(--sp-4)' }}>🎉</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', color: 'var(--text-primary)', marginBottom: 'var(--sp-2)' }}>Results are Live!</h2>
          <p className="text-secondary" style={{ marginBottom: 'var(--sp-6)' }}>November leaderboard published for {center?.name}. Students and faculty have been notified.</p>
          <div style={{ display: 'flex', gap: 'var(--sp-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary">View Leaderboard</button>
            <button className="btn btn-secondary">Download Report</button>
          </div>
        </div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-6)', alignItems: 'start' }}>
          {/* Steps */}
          <div className="card" style={{ padding: 'var(--sp-6)' }}>
            <h2 className="text-lg fw-semibold" style={{ marginBottom: 'var(--sp-5)' }}>Publication Checklist</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
              {STEPS.map((step, i) => {
                const done = i < currentStep;
                const active = i === currentStep;
                return (
                  <div key={step.id} className="flex items-start gap-4" style={{ opacity: i > currentStep ? 0.5 : 1, transition: 'opacity 0.3s' }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 'var(--text-sm)',
                      background: done ? 'var(--color-success-500)' : active ? 'var(--color-primary-500)' : 'var(--bg-subtle)',
                      color: done || active ? 'white' : 'var(--text-tertiary)',
                      border: active ? '2px solid var(--color-primary-300)' : 'none',
                      boxShadow: active ? 'var(--shadow-primary)' : 'none',
                    }}>
                      {done ? <CheckCircle size={16} /> : step.id}
                    </div>
                    <div>
                      <div className={`text-sm fw-semibold ${active ? '' : done ? 'text-secondary' : 'text-tertiary'}`}>{step.label}</div>
                      <div className="text-xs text-tertiary" style={{ marginTop: 2 }}>{step.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
              onClick={handleStep}
              disabled={loading}
            >
              {loading ? (
                <span className="animate-spin" style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block' }} />
              ) : currentStep === STEPS.length - 1 ? (
                <><Trophy size={18} /> Publish Now</>
              ) : (
                <><Play size={16} /> {STEPS[currentStep]?.label.split(' ').slice(0, 3).join(' ')}...</>
              )}
            </button>
            <div style={{ marginTop: 'var(--sp-3)', background: 'var(--color-gold-50)', borderRadius: 'var(--radius-md)', padding: 'var(--sp-3)', display: 'flex', gap: 'var(--sp-2)' }}>
              <AlertCircle size={15} style={{ color: 'var(--color-gold-500)', flexShrink: 0, marginTop: 1 }} />
              <span className="text-xs" style={{ color: 'var(--color-gold-700)' }}>Publishing locks all faculty-submitted scores for this month. Contact Super Admin to undo.</span>
            </div>
          </div>

          {/* Leaderboard preview */}
          <div className="card" style={{ padding: 'var(--sp-5)' }}>
            <div className="section-header" style={{ marginBottom: 'var(--sp-4)' }}>
              <span className="section-title">Leaderboard Preview</span>
              <span className="badge badge-neutral">{centerStudents.length} students</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              {preview.map((e, i) => (
                <div key={e.studentId} className="flex items-center gap-3" style={{ padding: 'var(--sp-3)', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <div className={`rank-badge ${i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-other'}`}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div className="text-sm fw-semibold">{e.student?.name}</div>
                    <div className="text-xs text-tertiary">Score: {e.total}</div>
                  </div>
                  <div className="progress-track" style={{ width: 50 }}>
                    <div className="progress-fill" style={{ width: `${e.total}%` }} />
                  </div>
                </div>
              ))}
              <div className="text-xs text-tertiary" style={{ textAlign: 'center', paddingTop: 'var(--sp-2)' }}>
                + {centerStudents.length - 5} more students in full leaderboard
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
