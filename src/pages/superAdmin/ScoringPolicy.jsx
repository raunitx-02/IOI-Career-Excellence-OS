import React, { useState } from 'react';
import { Shield, Save, AlertCircle, CheckCircle, Sliders } from 'lucide-react';
import { DEFAULT_WEIGHTS } from '../../data/mockData';
import { useNotifStore } from '../../store/notifStore';

const TIE_BREAK = [
  'Higher RAG improvement score',
  'Higher assessment (test/exam) score',
  'Higher participation score',
  'Better attendance percentage',
  'Earliest timestamp of score submission',
];

export default function ScoringPolicy() {
  const { addToast } = useNotifStore();
  const [weights, setWeights] = useState({ ...DEFAULT_WEIGHTS });
  const [saved, setSaved] = useState(false);

  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  const valid = total === 100;

  const handleChange = (key, val) => {
    setSaved(false);
    setWeights(prev => ({ ...prev, [key]: Math.max(0, Math.min(100, Number(val))) }));
  };

  const handleSave = async () => {
    if (!valid) return;
    await new Promise(r => setTimeout(r, 600));
    setSaved(true);
    addToast({ type: 'success', title: 'Policy Updated!', message: 'New scoring weights will apply to the next monthly cycle.' });
  };

  const FIELD_CONFIG = [
    { key: 'attendance', label: 'Attendance', icon: '📅', desc: 'Percentage of classes attended vs total classes conducted.' },
    { key: 'ragImprovement', label: 'RAG Improvement', icon: '📈', desc: 'Change in student\'s performance band (Red-Amber-Green) over the month.' },
    { key: 'assessments', label: 'Assessments', icon: '📝', desc: 'Weighted average of Class Tests, Mid-Term, and End-Term scores.' },
    { key: 'participation', label: 'Class Participation', icon: '🎤', desc: 'Faculty-assigned band score: Low (40), Moderate (65), High (85), Outstanding (100).' },
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title"><Shield size={22} style={{ display: 'inline', marginRight: 8 }} />Scoring Policy Manager</h1>
        <p className="page-subtitle">Configure the weighted formula used to calculate each student's monthly total score.</p>
      </div>

      <div className="grid grid-layout-md" style={{ gridTemplateColumns: '1.2fr 1fr', gap: 'var(--sp-6)', alignItems: 'start' }}>
        {/* Weights editor */}
        <div className="card" style={{ padding: 'var(--sp-6)' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 'var(--sp-6)' }}>
            <h2 className="text-lg fw-semibold">Score Weights</h2>
            <div className={`badge ${valid ? 'badge-success' : 'badge-danger'}`}>{total}% / 100%</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
            {FIELD_CONFIG.map(f => (
              <div key={f.key}>
                <div className="flex items-center justify-between" style={{ marginBottom: 'var(--sp-2)' }}>
                  <label className="text-sm fw-semibold flex items-center gap-2">
                    <span style={{ fontSize: 16 }}>{f.icon}</span> {f.label}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0} max={100}
                      value={weights[f.key]}
                      onChange={e => handleChange(f.key, e.target.value)}
                      className="form-input"
                      style={{ width: 64, textAlign: 'center', padding: '4px 8px', fontSize: 'var(--text-sm)' }}
                    />
                    <span className="text-sm text-secondary">%</span>
                  </div>
                </div>
                <div className="progress-track" style={{ height: 8 }}>
                  <div className="progress-fill" style={{ width: `${weights[f.key]}%` }} />
                </div>
                <p className="text-xs text-tertiary" style={{ marginTop: 4 }}>{f.desc}</p>
              </div>
            ))}
          </div>

          {!valid && (
            <div style={{ marginTop: 'var(--sp-4)', background: 'var(--color-danger-100)', borderRadius: 'var(--radius-md)', padding: 'var(--sp-3)', display: 'flex', gap: 'var(--sp-2)' }}>
              <AlertCircle size={15} style={{ color: 'var(--color-danger-500)', flexShrink: 0 }} />
              <span className="text-xs" style={{ color: 'var(--color-danger-500)' }}>Weights must sum to exactly 100%. Currently: {total}%.</span>
            </div>
          )}

          <button
            className="btn btn-primary"
            style={{ marginTop: 'var(--sp-5)', width: '100%' }}
            onClick={handleSave}
            disabled={!valid}
          >
            <Save size={14} /> Save Policy
          </button>

          {saved && (
            <div style={{ marginTop: 'var(--sp-3)', background: 'var(--color-success-100)', borderRadius: 'var(--radius-md)', padding: 'var(--sp-3)', display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
              <CheckCircle size={14} style={{ color: 'var(--color-success-500)' }} />
              <span className="text-xs" style={{ color: 'var(--color-success-700)' }}>Policy saved. Applies to next monthly cycle.</span>
            </div>
          )}
        </div>

        {/* Tie-break rules */}
        <div>
          <div className="card" style={{ padding: 'var(--sp-5)', marginBottom: 'var(--sp-4)' }}>
            <h2 className="text-lg fw-semibold" style={{ marginBottom: 'var(--sp-4)' }}>
              <Sliders size={16} style={{ display: 'inline', marginRight: 6 }} />Tie-Break Order
            </h2>
            <p className="text-xs text-secondary" style={{ marginBottom: 'var(--sp-4)' }}>
              When two students have the same total score, rank is determined by the following sequence:
            </p>
            <ol style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
              {TIE_BREAK.map((rule, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--sp-3)' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--bg-subtle)', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-secondary)', flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <span className="text-sm text-secondary">{rule}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="card" style={{ padding: 'var(--sp-5)' }}>
            <h2 className="text-sm fw-semibold" style={{ marginBottom: 'var(--sp-4)' }}>Score Formula Preview</h2>
            <div style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--sp-4)', fontFamily: 'monospace', fontSize: 'var(--text-xs)', lineHeight: 2, color: 'var(--text-secondary)' }}>
              <span style={{ color: 'var(--color-primary-500)', fontWeight: 600 }}>Total</span> = (<br />
              &nbsp;&nbsp;Attendance × <strong>{weights.attendance}%</strong> +<br />
              &nbsp;&nbsp;RAG × <strong>{weights.ragImprovement}%</strong> +<br />
              &nbsp;&nbsp;Assessments × <strong>{weights.assessments}%</strong> +<br />
              &nbsp;&nbsp;Participation × <strong>{weights.participation}%</strong><br />
              ) / 100
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
