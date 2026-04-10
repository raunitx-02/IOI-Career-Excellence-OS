import React, { useState } from 'react';
import { Gift, CheckCircle, Clock, ArrowRight, Star, Trophy, Award } from 'lucide-react';
import { REWARDS, REWARD_REDEMPTIONS, NOMINATIONS, MONTHLY_SCORES, STUDENTS, CURRENT_CYCLE } from '../../data/mockData';
import { useAuthStore } from '../../store/authStore';
import { useNotifStore } from '../../store/notifStore';

const HALL_OF_FAME = [
  { title: 'Student of the Month', studentId: 'STU-BLR-01', reason: 'Exceptional ranking and consistent engagement', month: 'April', icon: '👑' },
  { title: 'Most Improved', studentId: 'STU-NOI-03', reason: 'Jumped from rank 15 to rank 4 in a single month', month: 'March', icon: '🚀' },
  { title: 'Consistency Champion', studentId: 'STU-PUN-07', reason: 'Top 5 for three consecutive months', month: 'All', icon: '🔥' },
  { title: 'Top Communicator', studentId: 'STU-LKO-02', reason: 'Outstanding participation and event leadership', month: 'April', icon: '🎤' },
];

export default function StudentRewards() {
  const { user } = useAuthStore();
  const { addToast } = useNotifStore();
  const [tab, setTab] = useState('catalog');
  const [claiming, setClaiming] = useState(null);
  const [localRedemptions, setLocalRedemptions] = useState(
    REWARD_REDEMPTIONS.filter(r => r.studentId === (user?.studentId || user?.id || 'STU-BLR-01'))
  );

  const studentId = user?.studentId || user?.id || 'STU-BLR-01';
  const currentScore = MONTHLY_SCORES.find(s => s.studentId === studentId && s.month === CURRENT_CYCLE);
  const myScore = currentScore?.total || 72;

  const myRedemptions = localRedemptions;
  const eligible = REWARDS.filter(r => myScore >= r.eligibilityScore);
  const claimed = REWARDS.filter(r => myRedemptions.some(rd => rd.rewardId === r.id));

  const handleClaim = async (reward) => {
    setClaiming(reward.id);
    await new Promise(r => setTimeout(r, 800));
    setLocalRedemptions(prev => [...prev, { studentId, rewardId: reward.id, status: 'pending', date: new Date().toISOString() }]);
    setClaiming(null);
    addToast({ type: 'success', emoji: reward.icon, title: 'Reward Claimed!', message: `${reward.name} request submitted for approval.` });
  };

  const tabs = [
    { id: 'catalog', label: 'Reward Catalog' },
    { id: 'eligibility', label: `Eligible (${eligible.length})` },
    { id: 'history', label: `My Rewards` },
    { id: 'fame', label: 'Hall of Fame' },
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">🏆 Rewards & Recognition</h1>
        <p className="page-subtitle">Earn and redeem rewards based on your academic and leadership performance.</p>
      </div>

      {/* Stats row */}
      <div className="grid-4 grid" style={{ gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
        {[
          { label: 'Current Score', value: Math.round(myScore), icon: Star, color: 'var(--color-primary-500)' },
          { label: 'Eligible Rewards', value: eligible.length, icon: Gift, color: 'var(--color-gold-500)' },
          { label: 'Rewards Claimed', value: myRedemptions.length, icon: CheckCircle, color: 'var(--color-success-500)' },
          { label: 'Nominations', value: NOMINATIONS.filter(n => n.studentId === studentId).length, icon: Award, color: 'hsl(280,72%,48%)' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="kpi-card">
              <div className="kpi-label"><Icon size={14} style={{ color: s.color }} />{s.label}</div>
              <div className="kpi-value" style={{ color: s.color }}>{s.value}</div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="tabs-list" style={{ marginBottom: 0 }}>
        {tabs.map(t => (
          <button key={t.id} className={`tab-trigger ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {tab === 'catalog' && (
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--sp-4)' }}>
            {REWARDS.map(r => {
              const isEligible = myScore >= r.eligibilityScore;
              const isClaimed = claimed.some(c => c.id === r.id);
              return (
                <div key={r.id} className="card" style={{ padding: 'var(--sp-5)', opacity: isEligible ? 1 : 0.65 }}>
                  <div className="flex items-start gap-4">
                    <div style={{ fontSize: 32, flexShrink: 0 }}>{r.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
                        <div className="text-md fw-semibold">{r.name}</div>
                        <span className={`badge ${isEligible ? 'badge-success' : 'badge-neutral'}`}>
                          {isEligible ? '✓ Eligible' : `${r.eligibilityScore} pts req.`}
                        </span>
                      </div>
                      <p className="text-xs text-secondary" style={{ marginBottom: 'var(--sp-3)', lineHeight: 'var(--lh-relaxed)' }}>{r.desc}</p>
                      {r.eligibilityScore > 0 && (
                        <div style={{ marginBottom: 'var(--sp-3)' }}>
                          <div className="progress-track" style={{ height: 4 }}>
                            <div className="progress-fill" style={{ width: `${Math.min(100, (myScore / r.eligibilityScore) * 100)}%` }} />
                          </div>
                          <div className="text-xs text-tertiary" style={{ marginTop: 3 }}>
                            {Math.round(myScore)} / {r.eligibilityScore} pts required
                          </div>
                        </div>
                      )}
                      {isEligible && !isClaimed && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleClaim(r)}
                          disabled={claiming === r.id}
                          style={{ boxShadow: 'var(--shadow-primary)' }}
                        >
                          {claiming === r.id
                            ? <span className="animate-spin" style={{ width: 12, height: 12, border: '2px solid rgba(255,255,255,.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block' }} />
                            : <><Gift size={12} /> Claim Reward</>
                          }
                        </button>
                      )}
                      {isClaimed && (
                        <span className="badge badge-success"><CheckCircle size={11} /> Claimed</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'eligibility' && (
          eligible.length === 0 ? (
            <div className="empty-state">
              <Gift size={48} className="empty-state-icon" />
              <div className="empty-state-title">No eligible rewards yet</div>
              <div className="empty-state-desc">Keep improving your monthly score to unlock rewards!</div>
            </div>
          ) : (
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--sp-4)' }}>
              {eligible.map(r => (
                <div key={r.id} className="card" style={{ padding: 'var(--sp-5)', border: '1px solid var(--color-primary-300)' }}>
                  <div className="flex items-center gap-3" style={{ marginBottom: 'var(--sp-3)' }}>
                    <span style={{ fontSize: 28 }}>{r.icon}</span>
                    <div>
                      <div className="text-md fw-semibold">{r.name}</div>
                      <span className="badge badge-success">✓ Eligible</span>
                    </div>
                  </div>
                  <p className="text-xs text-secondary" style={{ marginBottom: 'var(--sp-4)' }}>{r.desc}</p>
                  <button className="btn btn-primary btn-sm" onClick={() => handleClaim(r)}>
                    <Gift size={12} /> Claim Now <ArrowRight size={12} />
                  </button>
                </div>
              ))}
            </div>
          )
        )}

        {tab === 'history' && (
          myRedemptions.length === 0 ? (
            <div className="empty-state">
              <Clock size={48} className="empty-state-icon" />
              <div className="empty-state-title">No reward claims yet</div>
              <div className="empty-state-desc">Claim rewards from the catalog when you're eligible.</div>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Reward</th><th>Status</th><th>Requested</th>
                  </tr>
                </thead>
                <tbody>
                  {myRedemptions.map(rd => {
                    const r = REWARDS.find(rr => rr.id === rd.rewardId);
                    return (
                      <tr key={rd.id}>
                        <td>
                          <div className="flex items-center gap-2">
                            <span style={{ fontSize: 20 }}>{r?.icon}</span>
                            <span className="text-sm fw-medium">{r?.name}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${rd.status === 'approved' ? 'badge-success' : 'badge-neutral'}`}>
                            {rd.status === 'approved' ? <><CheckCircle size={11} /> Approved</> : <><Clock size={11} /> Pending</>}
                          </span>
                        </td>
                        <td className="text-sm text-secondary">{new Date(rd.requestedAt).toLocaleDateString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        )}

        {tab === 'fame' && (
          <div>
            <div style={{ marginBottom: 'var(--sp-6)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', color: 'var(--text-primary)', letterSpacing: '-0.01em', marginBottom: 'var(--sp-2)' }}>
                🌟 Hall of Fame
              </h2>
              <p className="text-sm text-secondary">Celebrating our highest achieving students across all centers.</p>
            </div>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--sp-4)' }}>
              {HALL_OF_FAME.map((h, i) => {
                const student = STUDENTS.find(s => s.id === h.studentId);
                return (
                  <div key={i} className="card" style={{ padding: 'var(--sp-6)', background: 'linear-gradient(135deg, var(--bg-surface), var(--bg-subtle))', textAlign: 'center' }}>
                    <div style={{ fontSize: 40, marginBottom: 'var(--sp-3)' }}>{h.icon}</div>
                    <div className="text-xs text-tertiary fw-semibold" style={{ letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 'var(--sp-2)' }}>{h.title}</div>
                    <div className="text-lg fw-bold" style={{ color: 'var(--text-primary)', marginBottom: 4 }}>{student?.name}</div>
                    <div className="text-xs text-secondary" style={{ marginBottom: 'var(--sp-3)', lineHeight: 'var(--lh-relaxed)' }}>{h.reason}</div>
                    <span className="badge badge-gold">{h.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
