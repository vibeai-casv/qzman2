import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLayout from './layout/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import QuizList from './pages/admin/QuizList';
import QuestionBank from './pages/admin/QuestionBank';
import TeamList from './pages/admin/TeamList';
import QuizDetail from './pages/admin/QuizDetail';
import GameControl from './pages/admin/GameControl';

import Login from './pages/Login';

import JoinQuiz from './pages/team/JoinQuiz';
import Lobby from './pages/team/Lobby';

import ProjectorView from './pages/projector/ProjectorView';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground font-sans antialiased">
        <Routes>
          <Route path="/" element={<div className="p-10 text-center"><h1 className="text-4xl font-bold text-primary">QzMan Gateway</h1><p className="mt-4 text-muted-foreground">Select your role:</p><div className="flex gap-4 justify-center mt-6"><a href="/login" className="px-4 py-2 bg-primary text-primary-foreground rounded">Admin/QM</a><a href="/play" className="px-4 py-2 bg-accent text-accent-foreground rounded">Team Play</a><a href="/projector" className="px-4 py-2 bg-secondary text-secondary-foreground rounded">Projector</a></div></div>} />

          <Route path="/login" element={<Login />} />

          <Route path="/play" element={<JoinQuiz />} />
          <Route path="/play/lobby" element={<Lobby />} />

          <Route path="/projector/:id" element={<ProjectorView />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="quizzes" element={<QuizList />} />
            <Route path="quizzes/:id" element={<QuizDetail />} />
            <Route path="quizzes/:id/play" element={<GameControl />} />
            <Route path="questions" element={<QuestionBank />} />
            <Route path="teams" element={<TeamList />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
