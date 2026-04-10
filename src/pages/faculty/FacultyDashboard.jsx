import React, { useState } from 'react';
import { ClipboardList, BookOpen, Star, TrendingUp, AlertTriangle, Users, CheckCircle, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useAuthStore } from '../../store/authStore';
import { FACULTY, STUDENTS, CLASSROOMS, BATCHES, MONTHLY_SCORES, LEADERBOARD, CURRENT_CYCLE, CENTERS } from '../../data/mockData';

export default function FacultyDashboard() {
  const { user } = useAuthStore();
  const faculty = FACULTY.find(f => f.id === user?.id) || FACULTY[0];
  const center = CENTERS.find(c => c.id === faculty.centerId);
  const [activeClassroom, setActiveClassroom] = useState(null);

  const myBatches = BATCHES.filter(b => faculty.assignedBatches?.includes(b.id));
  const myClassrooms = CLASSROOMS.filter(c => myBatches.some(b => b.id === c.batchId));
  const displayClassroom = activeClassroom || myClassrooms[0];

  const classroomStudents = STUDENTS.filter(s => s.classroomId === displayClassroom?.id);
  const classroomScores = MONTHLY_SCORES.filter(s => classroomStudents.some(st => st.id === s.studentId) && s.month === CURRENT_CYCLE);

  const avgScore = classroomScores.length ? Math.round(classroomScores.reduce((sum, s) => sum + s.total, 0) / classroomScores.length) : 0;
  const avgAttendance = classroomScores.length ? Math.round(classroomScores.reduce((sum, s) => sum + s.attendancePct, 0) / classroomScores.length) : 0;

  const atRisk = classroomStudents.filter(st => {
    const score = classroomScores.find(s => s.studentId === st.id);
    return score && score.total < 65;
  });

  const chartData = classroomStudents.slice(0, 8).map(st => {
    const score = classroomScores.find(s => s.studentId === st.id);
    return {
      name: st.name.split(' ')[0],
      Score: score?.total || 0,
      Attendance: score?.attendancePct || 0,
    };
  });

  const pending = [
    { task: 'Submit November Participation Scores', classroom: displayClassroom?.name, due: 'Nov 30' },
    { task: 'RAG Improvement Update', classroom: displayClassroom?.name, due: 'Nov 28' },
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Faculty Dashboard</h1>
        <p className="page-subtitle">{faculty.name} · {center?.name} Center</p>
      </div>

      {/* KPIs */}
      <div className="grid-4 grid" style={{ gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
        {[
          { label: 'My Classrooms', value: myClassrooms.length, icon: Users, color: 'var(--color-primary-500)' },
          { label: 'Avg Class Score', value: avgScore, icon: Star, color: 'var(--color-gold-500)', sub: '/100' },
          { label: 'Avg Attendance', value: avgAttendance + '%', icon: ClipboardList, color: 'var(--color-success-500)' },
          { label: 'At-Risk Students', value: atRisk.length, icon: AlertTriangle, color: atRisk.length > 0 ? 'var(--color-danger-500)' : 'var(--color-success-500)' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="kpi-card">
              <div className="kpi-label"><Icon size={14} style={{ color: s.color }} />{s.label}</div>
              <div className="kpi-value">{s.value}{s.sub && <span className="text-sm text-tertiary fw-normal">{s.sub}</span>}</div>
            </div>
          );
        })}
      </div>

      {/* Pending tasks */}
      {pending.length > 0 && (
        <div className="card" style={{ padding: 'var(--sp-5)', marginBottom: 'var(--sp-6)', borderLeft: '4px solid var(--color-gold-500)' }}>
          <div className="section-header" style={{ marginBottom: 'var(--sp-3)' }}>
            <span className="section-title flex items-center gap-2"><Clock size={16} style={{ color: 'var(--color-gold-500)' }} /> Pending Submissions</span>
          </div>
          {pending.map((p, i) => (
            <div key={i} className="flex items-center gap-4" style={{ padding: 'var(--sp-3) 0', borderBottom: i < pending.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
              <Clock size={15} style={{ color: 'var(--color-gold-500)', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className="text-sm fw-medium">{p.task}</div>
                <div className="text-xs text-secondary">{p.classroom}</div>
              </div>
              <span className="badge badge-gold">Due {p.due}</span>
            </div>
          ))}
        </div>
      )}

      {/* Classroom selector */}
      <div className="flex items-center gap-3" style={{ marginBottom: 'var(--sp-5)', flexWrap: 'wrap' }}>
        <span className="text-sm text-secondary">Classroom:</span>
        {myClassrooms.map(cl => (
          <button
            key={cl.id}
            className={`btn btn-sm ${(displayClassroom?.id === cl.id) ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveClassroom(cl)}
          >
            {cl.name.split('—')[1]?.trim() || cl.name}
          </button>
        ))}
      </div>

      {/* Class performance chart */}
      <div className="grid" style={{ gridTemplateColumns: '1.5fr 1fr', gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
        <div className="chart-container">
          <div className="chart-title">Student Scores — {displayClassroom?.name}</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: 'var(--bg-surface-raised)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="Score" fill="var(--color-primary-500)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Attendance" fill="var(--color-gold-500)" radius={[4, 4, 0, 0]} opacity={0.6} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* At-risk students */}
        <div className="card" style={{ padding: 'var(--sp-5)' }}>
          <div className="section-title" style={{ marginBottom: 'var(--sp-4)', color: atRisk.length ? 'var(--color-danger-500)' : 'var(--text-primary)' }}>
            <AlertTriangle size={15} style={{ display: 'inline', marginRight: 6 }} />
            At-Risk Students ({atRisk.length})
          </div>
          {atRisk.length === 0 ? (
            <div className="flex items-center gap-3" style={{ padding: 'var(--sp-4)', background: 'var(--color-success-100)', borderRadius: 'var(--radius-md)' }}>
              <CheckCircle size={16} style={{ color: 'var(--color-success-500)' }} />
              <span className="text-sm fw-medium" style={{ color: 'var(--color-success-600)' }}>All students performing well!</span>
            </div>
          ) : atRisk.map(st => {
            const score = classroomScores.find(s => s.studentId === st.id);
            return (
              <div key={st.id} style={{ padding: 'var(--sp-3)', background: 'var(--color-danger-100)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--sp-2)' }}>
                <div className="text-sm fw-semibold">{st.name}</div>
                <div className="text-xs text-secondary">Score: {score?.total} · Attendance: {score?.attendancePct}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick action links */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--sp-4)' }}>
        {[
          { label: 'Mark Attendance', icon: ClipboardList, color: 'var(--color-primary-500)', path: '/faculty/attendance' },
          { label: 'Enter Scores', icon: BookOpen, color: 'var(--color-gold-500)', path: '/faculty/scores' },
          { label: 'Nominate Student', icon: Star, color: 'hsl(280,72%,48%)', path: '/faculty/nominations' },
          { label: 'View Leaderboard', icon: TrendingUp, color: 'var(--color-success-500)', path: '/student/leaderboard' },
        ].map(a => {
          const Icon = a.icon;
          return (
            <a key={a.label} href={a.path} className="card card-interactive" style={{ padding: 'var(--sp-5)', display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', textDecoration: 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} style={{ color: a.color }} />
              </div>
              <span className="text-sm fw-medium">{a.label}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
