import React, { useState } from 'react';
import { Swords, Calendar, Users, MapPin, Trophy, Clock, CheckCircle, Star, Plus, ChevronRight, Award } from 'lucide-react';
import { EVENTS, STUDENTS, CENTERS, FACULTY } from '../../data/mockData';
import { useAuthStore } from '../../store/authStore';
import { useNotifStore } from '../../store/notifStore';

const TYPE_CONFIG = {
  debate: { icon: '⚔️', color: 'hsl(0,72%,48%)', label: 'Debate' },
  roleplay: { icon: '🎭', color: 'hsl(280,72%,48%)', label: 'Roleplay' },
  pitch: { icon: '💡', color: 'var(--color-gold-500)', label: 'Pitch' },
  communication: { icon: '🎤', color: 'var(--color-primary-500)', label: 'Communication' },
  group: { icon: '🤝', color: 'hsl(142,72%,38%)', label: 'Group Task' },
};

const STATUS_CONFIG = {
  completed: { label: 'Completed', badge: 'badge-success' },
  active: { label: 'Live', badge: 'badge-primary' },
  upcoming: { label: 'Upcoming', badge: 'badge-neutral' },
};

function EventCard({ event }) {
  const { addToast } = useNotifStore();
  const [registered, setRegistered] = useState(false);
  const type = TYPE_CONFIG[event.type] || TYPE_CONFIG.debate;
  const status = STATUS_CONFIG[event.status];
  const center = CENTERS.find(c => c.id === event.centerId);
  const winner = STUDENTS.find(s => s.id === event.winnerId);
  const judges = FACULTY.filter(f => event.judgeIds?.includes(f.id));

  const handleRegister = () => {
    setRegistered(true);
    addToast({ emoji: type.icon, title: 'Registered!', message: `You've registered for ${event.title}` });
  };

  return (
    <div className="card" style={{ padding: 'var(--sp-5)' }}>
      <div className="flex items-start justify-between gap-4" style={{ marginBottom: 'var(--sp-4)' }}>
        <div className="flex items-center gap-3">
          <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-lg)', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
            {type.icon}
          </div>
          <div>
            <div className="text-md fw-semibold">{event.title}</div>
            <div className="flex items-center gap-2" style={{ marginTop: 4 }}>
              <span className={`badge ${status.badge}`}>{status.label}</span>
              <span className="badge badge-neutral">{type.label}</span>
              {event.isCrossCenter && <span className="badge badge-primary">Cross-Center</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)', marginBottom: 'var(--sp-4)' }}>
        <div className="flex items-center gap-2">
          <Calendar size={13} style={{ color: 'var(--text-tertiary)' }} />
          <span className="text-xs text-secondary">{event.startDate} → {event.endDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users size={13} style={{ color: 'var(--text-tertiary)' }} />
          <span className="text-xs text-secondary">{event.participantCount} participants</span>
        </div>
        <div className="flex items-center gap-2">
          <Award size={13} style={{ color: 'var(--text-tertiary)' }} />
          <span className="text-xs text-secondary">{event.rounds} round{event.rounds > 1 ? 's' : ''}</span>
        </div>
        {center && (
          <div className="flex items-center gap-2">
            <MapPin size={13} style={{ color: 'var(--text-tertiary)' }} />
            <span className="text-xs text-secondary">{center.name}</span>
          </div>
        )}
      </div>

      {judges.length > 0 && (
        <div style={{ marginBottom: 'var(--sp-4)' }}>
          <div className="text-xs text-tertiary" style={{ marginBottom: 6 }}>Judges</div>
          <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
            {judges.map(j => (
              <span key={j.id} className="badge badge-neutral">{j.name}</span>
            ))}
          </div>
        </div>
      )}

      {winner && (
        <div style={{ background: 'var(--color-gold-50)', borderRadius: 'var(--radius-md)', padding: 'var(--sp-3)', marginBottom: 'var(--sp-4)', display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
          <Trophy size={18} style={{ color: 'var(--color-gold-500)', flexShrink: 0 }} />
          <div>
            <div className="text-xs text-tertiary">Winner</div>
            <div className="text-sm fw-semibold" style={{ color: 'var(--color-gold-600)' }}>{winner.name}</div>
          </div>
        </div>
      )}

      {event.status === 'upcoming' && (
        <button
          className={`btn btn-sm ${registered ? 'btn-secondary' : 'btn-primary'}`}
          onClick={handleRegister}
          disabled={registered}
          style={{ width: '100%' }}
        >
          {registered ? <><CheckCircle size={12} /> Registered</> : <>Register for Event <ChevronRight size={13} /></>}
        </button>
      )}
      {event.status === 'active' && (
        <div style={{ background: 'var(--color-primary-50)', borderRadius: 'var(--radius-md)', padding: 'var(--sp-3)', textAlign: 'center' }}>
          <span className="text-sm fw-semibold" style={{ color: 'var(--color-primary-600)' }}>🔴 Event in Progress — Scoreboard Live</span>
        </div>
      )}
    </div>
  );
}

export default function StudentBattleground() {
  const [filter, setFilter] = useState('all');
  const statuses = ['all', 'active', 'upcoming', 'completed'];
  const filtered = filter === 'all' ? EVENTS : EVENTS.filter(e => e.status === filter);

  const liveEvents = EVENTS.filter(e => e.status === 'active');

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">⚔️ Top Learner Battleground</h1>
        <p className="page-subtitle">Compete in debates, roleplay, pitch events, and more. Earn badges and boost your profile.</p>
      </div>

      {/* Live event banner */}
      {liveEvents.length > 0 && (
        <div style={{ background: 'linear-gradient(90deg, hsl(174,78%,20%), hsl(174,78%,28%))', borderRadius: 'var(--radius-lg)', padding: 'var(--sp-4) var(--sp-5)', marginBottom: 'var(--sp-6)', display: 'flex', alignItems: 'center', gap: 'var(--sp-4)', flexWrap: 'wrap' }}>
          <div style={{ width: 10, height: 10, background: 'hsl(120,72%,55%)', borderRadius: '50%', animation: 'pulse-glow 2s infinite', flexShrink: 0 }} />
          <div style={{ color: 'white' }}>
            <div className="text-sm fw-bold">🔴 LIVE: {liveEvents[0].title}</div>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>Round scoring in progress — {liveEvents[0].participantCount} participants competing</div>
          </div>
          <button className="btn btn-sm" style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.25)' }}>
            View Scoreboard <ChevronRight size={13} />
          </button>
        </div>
      )}

      {/* Stats strip */}
      <div className="grid-4 grid" style={{ gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
        {[
          { label: 'Total Events', value: EVENTS.length, icon: '⚔️' },
          { label: 'Live Now', value: liveEvents.length, icon: '🔴' },
          { label: 'Upcoming', value: EVENTS.filter(e => e.status === 'upcoming').length, icon: '📅' },
          { label: 'Completed', value: EVENTS.filter(e => e.status === 'completed').length, icon: '✅' },
        ].map(s => (
          <div key={s.label} className="kpi-card">
            <div className="kpi-label">{s.icon} {s.label}</div>
            <div className="kpi-value">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2" style={{ marginBottom: 'var(--sp-5)', flexWrap: 'wrap' }}>
        {statuses.map(s => (
          <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(s)} style={{ textTransform: 'capitalize' }}>
            {s}
          </button>
        ))}
      </div>

      {/* Event grid */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--sp-4)' }}>
        {filtered.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <span style={{ fontSize: 48 }}>⚔️</span>
          <div className="empty-state-title">No {filter} events</div>
          <div className="empty-state-desc">Check back soon for new battleground events.</div>
        </div>
      )}
    </div>
  );
}
