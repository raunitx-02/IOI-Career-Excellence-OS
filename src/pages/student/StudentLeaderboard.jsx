import React, { useState, useMemo } from 'react';
import { Trophy, Search, Filter, ArrowUp, ArrowDown, Minus, ChevronDown, ChevronUp, Download, Star, Zap } from 'lucide-react';
import { STUDENTS, BATCHES, CLASSROOMS, CENTERS, LEADERBOARD, MONTHLY_SCORES, STUDENT_BADGES, BADGE_DEFS, STUDENT_XP, CURRENT_CYCLE } from '../../data/mockData';
import { useAuthStore } from '../../store/authStore';

const MONTH_LABELS = { 1: 'September', 2: 'October', 3: 'November', 4: 'December', 5: 'January', 6: 'February', 7: 'March', 8: 'April' };

function RankChange({ current, prev }) {
  if (!prev) return <span className="rank-same"><Minus size={11} /> —</span>;
  const delta = prev - current;
  if (delta > 0) return <span className="rank-up"><ArrowUp size={11} /> {delta}</span>;
  if (delta < 0) return <span className="rank-down"><ArrowDown size={11} /> {Math.abs(delta)}</span>;
  return <span className="rank-same"><Minus size={11} /> 0</span>;
}

function AvatarInitials({ name }) {
  const initials = name?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() || '?';
  const colors = ['hsl(174,78%,36%)', 'hsl(214,82%,48%)', 'hsl(280,72%,48%)', 'hsl(24,85%,48%)', 'hsl(350,72%,48%)'];
  const bg = colors[name?.charCodeAt(0) % colors.length];
  return (
    <div className="avatar avatar-md" style={{ background: bg }}>{initials}</div>
  );
}

function Podium({ entries }) {
  const [first, second, third] = entries;
  if (!first) return null;

  return (
    <div style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius-xl)', padding: 'var(--sp-6)', marginBottom: 'var(--sp-6)' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--sp-6)' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
          🏆 Leaderboard Podium
        </h2>
        <p className="text-sm text-secondary">Top 3 performers this month</p>
      </div>
      <div className="podium-wrapper">
        {/* 2nd */}
        {second && (
          <div className="podium-block animate-rank-reveal delay-200">
            <div className="podium-avatar-wrap">
              <AvatarInitials name={second.student?.name} />
            </div>
            <div className="text-sm fw-semibold text-primary truncate" style={{ maxWidth: 120 }}>{second.student?.name}</div>
            <div className="text-xs text-secondary">{Math.round(second.total)} pts</div>
            <div className="podium-base podium-base-2" style={{ borderRadius: '8px 8px 0 0' }}>
              <span style={{ fontSize: 20, color: 'white', fontWeight: 700 }}>2</span>
            </div>
          </div>
        )}
        {/* 1st */}
        <div className="podium-block animate-rank-reveal">
          <div className="podium-avatar-wrap">
            <span className="podium-crown">👑</span>
            <div className="avatar avatar-lg" style={{ background: 'var(--color-gold-500)', border: '3px solid var(--color-gold-300)' }}>
              {first.student?.name?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()}
            </div>
          </div>
          <div className="text-sm fw-bold text-primary truncate" style={{ maxWidth: 140 }}>{first.student?.name}</div>
          <div className="text-xs" style={{ color: 'var(--color-gold-500)', fontWeight: 600 }}>{Math.round(first.total)} pts</div>
          <div className="podium-base podium-base-1" style={{ borderRadius: '8px 8px 0 0' }}>
            <span style={{ fontSize: 24, color: 'white', fontWeight: 800 }}>1</span>
          </div>
        </div>
        {/* 3rd */}
        {third && (
          <div className="podium-block animate-rank-reveal delay-300">
            <div className="podium-avatar-wrap">
              <AvatarInitials name={third.student?.name} />
            </div>
            <div className="text-sm fw-semibold text-primary truncate" style={{ maxWidth: 120 }}>{third.student?.name}</div>
            <div className="text-xs text-secondary">{Math.round(third.total)} pts</div>
            <div className="podium-base podium-base-3" style={{ borderRadius: '8px 8px 0 0' }}>
              <span style={{ fontSize: 18, color: 'white', fontWeight: 700 }}>3</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LeaderboardRow({ entry, position, isCurrentUser, prevEntry, mobile }) {
  const [expanded, setExpanded] = useState(false);
  const xpData = STUDENT_XP.find(x => x.studentId === entry.studentId);
  const badgeCount = STUDENT_BADGES.filter(b => b.studentId === entry.studentId).length;
  const center = CENTERS.find(c => c.id === entry.student?.centerId);

  return (
    <>
      <tr
        className={`${isCurrentUser ? '' : ''}`}
        style={{
          background: isCurrentUser ? 'var(--color-primary-50)' : undefined,
          cursor: 'pointer',
          transition: 'background var(--duration-fast)',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <td style={{ width: 60 }}>
          <div className={`rank-badge ${position === 1 ? 'rank-1' : position === 2 ? 'rank-2' : position === 3 ? 'rank-3' : 'rank-other'}`}>
            {position <= 3 ? ['🥇', '🥈', '🥉'][position - 1] : `#${position}`}
          </div>
        </td>
        <td>
          <div className="flex items-center gap-3">
            <AvatarInitials name={entry.student?.name} />
            <div>
              <div className="text-sm fw-semibold" style={{ color: isCurrentUser ? 'var(--color-primary-600)' : 'var(--text-primary)' }}>
                {entry.student?.name}
                {isCurrentUser && <span className="badge badge-primary" style={{ marginLeft: 8, fontSize: 9 }}>You</span>}
              </div>
              <div className="text-xs text-tertiary">{xpData?.name} · {badgeCount} badges</div>
            </div>
          </div>
        </td>
        <td className="hide-mobile">
          {center && (
            <span className="center-chip">
              <span className="center-chip-dot" style={{ background: center.color }} />
              {center.name}
            </span>
          )}
        </td>
        <td className="hide-mobile text-sm fw-semibold" style={{ color: 'var(--color-primary-500)' }}>{entry.total}</td>
        <td className="hide-mobile"><span style={{ fontSize: 12, background: 'var(--bg-subtle)', padding: '2px 6px', borderRadius: 4 }}>{entry.attendancePct}%</span></td>
        <td style={{ width: 80 }}>
          <RankChange current={entry.rank} prev={prevEntry?.rank} />
        </td>
        <td style={{ width: 40 }}>
          {expanded ? <ChevronUp size={14} style={{ color: 'var(--text-tertiary)' }} /> : <ChevronDown size={14} style={{ color: 'var(--text-tertiary)' }} />}
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={7} style={{ padding: 0 }}>
            <div style={{ padding: 'var(--sp-4) var(--sp-6)', background: 'var(--bg-subtle)', borderTop: '1px solid var(--border-subtle)' }}>
              <div className="grid-4 grid" style={{ gap: 'var(--sp-3)', marginBottom: 'var(--sp-3)' }}>
                {[
                  { l: 'Attendance', v: entry.attendancePct + '%', w: 20 },
                  { l: 'RAG', v: entry.ragScore, w: 25 },
                  { l: 'Assessments', v: entry.assessmentScore, w: 35 },
                  { l: 'Participation', v: entry.participationScore, w: 20 },
                ].map(m => (
                  <div key={m.l} style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', padding: 'var(--sp-3)' }}>
                    <div className="text-xs text-tertiary">{m.l} ({m.w}%)</div>
                    <div className="text-lg fw-bold" style={{ color: 'var(--color-primary-500)' }}>{m.v}</div>
                  </div>
                ))}
              </div>
              <div className="text-xs text-tertiary">Total weighted score: <strong>{entry.total}</strong></div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function StudentLeaderboard({ adminView }) {
  const { user } = useAuthStore();
  const [month, setMonth] = useState(CURRENT_CYCLE);
  
  // Resolve user specific scope
  const isStudent = user?.role === 'student';
  const isFaculty = user?.role === 'faculty';
  const isAdmin = ['superAdmin', 'management', 'centerAdmin'].includes(user?.role);
  
  const facultyData = isFaculty ? FACULTY.find(f => f.id === user?.id) : null;
  const studentData = isStudent ? STUDENTS.find(s => s.id === (user?.studentId || user?.id)) : null;

  const allowedCenterIds = isAdmin ? CENTERS.map(c => c.id) : [(facultyData?.centerId || studentData?.centerId || user?.centerId || 'BLR')];
  
  // Allowed Batches for faculty = their assigned ones. For students = their own batch.
  const allowedBatches = useMemo(() => {
    if (isAdmin) return BATCHES;
    if (isFaculty) return BATCHES.filter(b => facultyData?.assignedBatches?.includes(b.id));
    if (isStudent) return BATCHES.filter(b => b.id === studentData?.batchId);
    return BATCHES;
  }, [isAdmin, isFaculty, isStudent, facultyData, studentData, allowedCenterIds]);

  const [view, setView] = useState(isStudent ? 'batch' : 'center'); 
  const [centerId, setCenterId] = useState(allowedCenterIds[0]);
  const [batchId, setBatchId] = useState(allowedBatches[0]?.id);
  const [searchQ, setSearchQ] = useState('');

  // Lock the current center if they try to select something outside their scope
  const activeCenter = allowedCenterIds.includes(centerId) ? centerId : allowedCenterIds[0];
  const currentBatch = useMemo(() => batchId || allowedBatches[0]?.id, [batchId, allowedBatches]);

  const leaderboardKey = useMemo(() => {
    if (view === 'global') return `global-${month}`;
    if (view === 'center') return `center-${activeCenter}-${month}`;
    if (view === 'batch') return `batch-${activeCenter}-${currentBatch}-${month}`;
    return `global-${month}`;
  }, [view, month, activeCenter, currentBatch]);

  const prevKey = leaderboardKey.replace(`-${month}`, `-${month - 1}`);

  const rawEntries = useMemo(() => {
    const lb = LEADERBOARD[leaderboardKey] || [];
    return lb.map(e => ({ ...e, student: STUDENTS.find(s => s.id === e.studentId) }));
  }, [leaderboardKey]);

  const prevEntries = LEADERBOARD[prevKey] || [];

  const filtered = useMemo(() => {
    if (!searchQ) return rawEntries;
    return rawEntries.filter(e => e.student?.name.toLowerCase().includes(searchQ.toLowerCase()));
  }, [rawEntries, searchQ]);

  const podiumEntries = rawEntries.slice(0, 3);
  const tableEntries = filtered.slice(0, 30);

  const VIEWS = [
    { id: 'batch', label: isStudent ? 'My Batch' : 'Batch', active: true },
    { id: 'center', label: isStudent ? 'My Center' : 'Center', active: true },
    { id: 'global', label: 'All-India Ranking', adminOnly: true },
  ];

  const allowedCentersObjects = CENTERS.filter(c => allowedCenterIds.includes(c.id));

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: 'var(--sp-3)' }}>
          <div>
            <h1 className="page-title">🏆 Leaderboard</h1>
            <p className="page-subtitle">View rankings by batch, center, or across all centers.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-secondary btn-sm">
              <Download size={13} /> Export CSV
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3" style={{ marginTop: 'var(--sp-4)', flexWrap: 'wrap' }}>
          {/* Month */}
          <select className="form-select" style={{ width: 'auto', fontSize: 'var(--text-sm)' }} value={month} onChange={e => setMonth(Number(e.target.value))}>
            {Object.entries(MONTH_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>

          {/* View type */}
          <div style={{ display: 'flex', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', padding: 2, gap: 2 }}>
            {VIEWS.filter(v => !v.adminOnly || adminView || isAdmin).map(v => (
              <button key={v.id} className={`btn btn-sm ${view === v.id ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setView(v.id)}>
                {v.label}
              </button>
            ))}
          </div>

          {/* Scope Selectors */}
          {allowedCentersObjects.length > 1 && view !== 'global' && (
            <select className="form-select" style={{ width: 'auto', fontSize: 'var(--text-sm)' }} value={activeCenter} onChange={e => { setCenterId(e.target.value); setBatchId(null); }}>
              {allowedCentersObjects.map(c => <option key={c.id} value={c.id}>{c.abbr}</option>)}
            </select>
          )}

          {view === 'batch' && allowedBatches.length > 1 && (
            <select className="form-select" style={{ width: 'auto', fontSize: 'var(--text-sm)', maxWidth: 220 }} value={currentBatch || ''} onChange={e => setBatchId(e.target.value)}>
              {allowedBatches.map(b => (
                <option key={b.id} value={b.id}>{b.shortName}</option>
              ))}
            </select>
          )}

          {/* Search */}
          <div style={{ position: 'relative', marginLeft: 'auto' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input
              className="form-input"
              style={{ paddingLeft: 32, width: 200, fontSize: 'var(--text-sm)' }}
              placeholder="Search student..."
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Podium */}
      <Podium entries={podiumEntries} />

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <Trophy size={48} style={{ color: 'var(--text-disabled)' }} />
          <div className="empty-state-title">No entries found</div>
          <div className="empty-state-desc">{searchQ ? `No students matching "${searchQ}"` : 'No leaderboard data for this selection.'}</div>
        </div>
      ) : (
        <div className="table-wrapper animate-fade-in">
          <table className="table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Student</th>
                <th className="hide-mobile">Center</th>
                <th className="hide-mobile">Score</th>
                <th className="hide-mobile">Attendance</th>
                <th>Change</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tableEntries.map((entry, i) => (
                <LeaderboardRow
                  key={entry.studentId}
                  entry={entry}
                  position={entry.rank}
                  isCurrentUser={entry.studentId === (user?.studentId || user?.id)}
                  prevEntry={prevEntries.find(e => e.studentId === entry.studentId)}
                  mobile={false}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
