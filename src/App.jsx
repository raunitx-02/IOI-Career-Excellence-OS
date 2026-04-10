import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import { useNotifStore } from './store/notifStore';
import { NOTIFICATIONS_TEMPLATES } from './data/mockData';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AppShell from './components/layout/AppShell';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentLeaderboard from './pages/student/StudentLeaderboard';
import StudentRewards from './pages/student/StudentRewards';
import StudentBattleground from './pages/student/StudentBattleground';
import StudentProfile from './pages/student/StudentProfile';
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import AttendanceEntry from './pages/faculty/AttendanceEntry';
import ScoreEntry from './pages/faculty/ScoreEntry';
import NominationCenter from './pages/faculty/NominationCenter';
import CenterDashboard from './pages/centerAdmin/CenterDashboard';
import MonthlyPublish from './pages/centerAdmin/MonthlyPublish';
import CenterSettings from './pages/centerAdmin/CenterSettings';
import SuperDashboard from './pages/superAdmin/SuperDashboard';
import UserManagement from './pages/superAdmin/UserManagement';
import ScoringPolicy from './pages/superAdmin/ScoringPolicy';
import AuditLogs from './pages/superAdmin/AuditLogs';
import ManagementDashboard from './pages/management/ManagementDashboard';
import JudgeReviewMode from './pages/management/JudgeReviewMode';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import ToastContainer from './components/ui/ToastContainer';

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

function RoleRedirect() {
  const { user } = useAuthStore();
  const roleRoutes = {
    student: '/student/dashboard',
    faculty: '/faculty/dashboard',
    centerAdmin: '/admin/dashboard',
    superAdmin: '/super/dashboard',
    management: '/management/dashboard',
  };
  return <Navigate to={roleRoutes[user?.role] || '/login'} replace />;
}

export default function App() {
  const { initTheme } = useThemeStore();
  const { addNotification } = useNotifStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    initTheme();
  }, []);

  // Seed some demo notifications on first auth
  useEffect(() => {
    if (isAuthenticated) {
      const template = NOTIFICATIONS_TEMPLATES[0];
      addNotification({ ...template, isRead: false });
    }
  }, [isAuthenticated]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Role redirect */}
        <Route path="/dashboard" element={
          <ProtectedRoute><RoleRedirect /></ProtectedRoute>
        } />

        {/* Student Routes */}
        <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><AppShell /></ProtectedRoute>}>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="leaderboard" element={<StudentLeaderboard />} />
          <Route path="rewards" element={<StudentRewards />} />
          <Route path="battleground" element={<StudentBattleground />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Faculty Routes */}
        <Route path="/faculty" element={<ProtectedRoute allowedRoles={['faculty']}><AppShell /></ProtectedRoute>}>
          <Route path="dashboard" element={<FacultyDashboard />} />
          <Route path="attendance" element={<AttendanceEntry />} />
          <Route path="scores" element={<ScoreEntry />} />
          <Route path="nominations" element={<NominationCenter />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Center Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['centerAdmin']}><AppShell /></ProtectedRoute>}>
          <Route path="dashboard" element={<CenterDashboard />} />
          <Route path="publish" element={<MonthlyPublish />} />
          <Route path="settings" element={<CenterSettings />} />
          <Route path="leaderboard" element={<StudentLeaderboard adminView />} />
          <Route path="analytics" element={<AnalyticsDashboard />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Super Admin Routes */}
        <Route path="/super" element={<ProtectedRoute allowedRoles={['superAdmin']}><AppShell /></ProtectedRoute>}>
          <Route path="dashboard" element={<SuperDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="policy" element={<ScoringPolicy />} />
          <Route path="audit" element={<AuditLogs />} />
          <Route path="leaderboard" element={<StudentLeaderboard adminView />} />
          <Route path="analytics" element={<AnalyticsDashboard />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Management Routes */}
        <Route path="/management" element={<ProtectedRoute allowedRoles={['management']}><AppShell /></ProtectedRoute>}>
          <Route path="dashboard" element={<ManagementDashboard />} />
          <Route path="review" element={<JudgeReviewMode />} />
          <Route path="analytics" element={<AnalyticsDashboard />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />} />
      </Routes>

      <ToastContainer />
    </BrowserRouter>
  );
}
