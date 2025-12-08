import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLayout from './layout/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import QuizList from './pages/admin/QuizList';
import QuestionBank from './pages/admin/QuestionBank';
import TeamList from './pages/admin/TeamList';
import QuizDetail from './pages/admin/QuizDetail';
import GameControl from './pages/admin/GameControl';

import Login from './pages/Login';
import LandingPage from './pages/LandingPage';

import JoinQuiz from './pages/team/JoinQuiz';
import Lobby from './pages/team/Lobby';

import ProjectorView from './pages/projector/ProjectorView';

// New Dashboards
import SuperAdminDashboard from './pages/dashboard/SuperAdminDashboard';
import QuizMasterDashboard from './pages/dashboard/QuizMasterDashboard';
import ScoreManagerDashboard from './pages/dashboard/ScoreManagerDashboard';

// New Admin Components
import Settings from './pages/admin/Settings';
import UserManagement from './pages/admin/UserManagement';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground font-sans antialiased">
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route path="/login" element={<Login />} />

          <Route path="/play" element={<JoinQuiz />} />
          <Route path="/play/lobby" element={<Lobby />} />

          <Route path="/projector/:id" element={<ProjectorView />} />

          {/* Role based Routes - reusing AdminLayout for now which has sidebar */}

          <Route path="/super-admin" element={<AdminLayout />}>
            <Route index element={<SuperAdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="/quiz-master" element={<AdminLayout />}>
            <Route index element={<QuizMasterDashboard />} />
          </Route>

          <Route path="/score-manager" element={<AdminLayout />}>
            <Route index element={<ScoreManagerDashboard />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="quizzes" element={<QuizList />} />
            <Route path="quizzes/:id" element={<QuizDetail />} />
            <Route path="quizzes/:id/play" element={<GameControl />} />
            <Route path="questions" element={<QuestionBank />} />
            <Route path="teams" element={<TeamList />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
