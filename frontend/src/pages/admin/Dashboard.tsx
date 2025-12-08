import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
    Home, BookOpen, Users, Play, Settings, BarChart3,
    Plus, Monitor, Bell, LogOut, ChevronDown, Menu, X,
    CheckCircle, Database, Wifi
} from 'lucide-react';

interface Stats {
    activeQuizzes: number;
    registeredTeams: number;
    questionsInBank: number;
    liveSessions: number;
}

interface Activity {
    id: number;
    description: string;
    timestamp: string;
}

interface Quiz {
    id: number;
    name: string;
    scheduledAt: string;
}

export default function Dashboard() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const username = localStorage.getItem('username') || 'Admin';
    const userRole = localStorage.getItem('userRole') || 'ADMIN';

    const [stats, setStats] = useState<Stats>({
        activeQuizzes: 3,
        registeredTeams: 24,
        questionsInBank: 1248,
        liveSessions: 1
    });

    const [recentActivities] = useState<Activity[]>([
        { id: 1, description: 'Quiz "General Knowledge Finals" was created', timestamp: '2 hours ago' },
        { id: 2, description: 'Team "Alpha" joined the quiz', timestamp: '3 hours ago' },
        { id: 3, description: '50 new questions added to bank', timestamp: '5 hours ago' },
        { id: 4, description: 'Quiz "Science Bowl" completed', timestamp: '1 day ago' },
    ]);

    const [upcomingQuizzes] = useState<Quiz[]>([
        { id: 1, name: 'General Knowledge Finals', scheduledAt: 'Dec 10, 2024 14:00' },
        { id: 2, name: 'Science Bowl Round 2', scheduledAt: 'Dec 12, 2024 10:00' },
        { id: 3, name: 'History Challenge', scheduledAt: 'Dec 15, 2024 15:00' },
    ]);

    useEffect(() => {
        // Fetch real stats from API
        const fetchStats = async () => {
            try {
                const [quizRes, teamRes, questionRes] = await Promise.all([
                    fetch('/api/quizzes/'),
                    fetch('/api/teams/'),
                    fetch('/api/questions/')
                ]);

                const quizzes = await quizRes.json();
                const teams = await teamRes.json();
                const questions = await questionRes.json();

                setStats({
                    activeQuizzes: Array.isArray(quizzes) ? quizzes.length : 0,
                    registeredTeams: Array.isArray(teams) ? teams.length : 0,
                    questionsInBank: Array.isArray(questions) ? questions.length : 0,
                    liveSessions: 0
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };
        fetchStats();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userRole');
        localStorage.removeItem('username');
        navigate('/login');
    };

    const navItems = [
        { id: 'overview', label: 'Dashboard Overview', icon: Home, href: '/admin' },
        { id: 'quizzes', label: 'Quiz Management', icon: BookOpen, href: '/admin/quizzes' },
        { id: 'questions', label: 'Global Question Bank', icon: Database, href: '/admin/questions' },
        { id: 'teams', label: 'Team Management', icon: Users, href: '/admin/teams' },
        { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3, href: '#' },
        { id: 'settings', label: 'System Settings', icon: Settings, href: '/admin/settings' },
    ];

    const getRoleDisplay = (role: string) => {
        switch (role) {
            case 'SUPER_ADMIN': return 'Super Administrator';
            case 'QUIZ_MASTER': return 'Quiz Master';
            case 'SCORE_MANAGER': return 'Score Manager';
            case 'ADMIN': return 'Administrator';
            default: return 'User';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation */}
            <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Left: Logo & Menu Toggle */}
                        <div className="flex items-center">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                            >
                                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                            <div className="flex items-center ml-4 lg:ml-0">
                                <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
                                    <span className="text-lg font-bold text-white">Q</span>
                                </div>
                                <h1 className="ml-3 text-xl font-bold text-gray-900">QZMAN Dashboard</h1>
                            </div>
                        </div>

                        {/* Right: Quick Actions & User */}
                        <div className="flex items-center space-x-4">
                            {/* Quick Actions */}
                            <div className="hidden md:flex items-center space-x-2">
                                <Link
                                    to="/admin/quizzes"
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    New Quiz
                                </Link>
                                <a
                                    href="/projector/1"
                                    target="_blank"
                                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                >
                                    <Monitor className="w-4 h-4 mr-2" />
                                    Projector
                                </a>
                            </div>

                            {/* Notifications */}
                            <button className="relative p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                                <Bell className="h-6 w-6" />
                                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400"></span>
                            </button>

                            {/* User Menu */}
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100"
                                >
                                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-semibold text-indigo-600">
                                            {username.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="hidden md:block text-left">
                                        <p className="text-sm font-medium text-gray-900">{username}</p>
                                        <p className="text-xs text-gray-500">{getRoleDisplay(userRole)}</p>
                                    </div>
                                    <ChevronDown className="h-5 w-5 text-gray-500" />
                                </button>

                                {/* Dropdown */}
                                {userMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-200 z-50"
                                    >
                                        <Link
                                            to="/admin/settings"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <Settings className="w-4 h-4 inline mr-2" />
                                            Settings
                                        </Link>
                                        <div className="border-t border-gray-200 my-1"></div>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        >
                                            <LogOut className="w-4 h-4 inline mr-2" />
                                            Sign Out
                                        </button>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex">
                {/* Sidebar */}
                <aside
                    className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                        }`}
                    style={{ top: '64px' }}
                >
                    <div className="h-full flex flex-col">
                        {/* Sidebar Header */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                    <span className="text-lg font-bold text-indigo-600">
                                        {username.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">{username}</p>
                                    <p className="text-xs text-indigo-600 font-semibold">{getRoleDisplay(userRole)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                            {navItems.map((item) => (
                                <Link
                                    key={item.id}
                                    to={item.href}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg border-l-4 transition-colors ${activeTab === item.id
                                            ? 'bg-indigo-50 text-indigo-700 border-indigo-500'
                                            : 'text-gray-700 hover:bg-gray-50 border-transparent'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5 mr-3" />
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Sidebar Footer */}
                        <div className="p-4 border-t border-gray-200">
                            <div className="bg-indigo-50 rounded-lg p-3">
                                <p className="text-xs font-medium text-indigo-800 mb-1">System Status</p>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                    <p className="text-xs text-gray-600">All systems operational</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-20 bg-gray-600 bg-opacity-50 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                )}

                {/* Main Content */}
                <main className="flex-1 p-6 lg:ml-0">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <motion.div
                                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <div className="flex items-center">
                                    <div className="p-3 bg-blue-100 rounded-lg">
                                        <BookOpen className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Active Quizzes</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.activeQuizzes}</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="flex items-center">
                                    <div className="p-3 bg-green-100 rounded-lg">
                                        <Users className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Registered Teams</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.registeredTeams}</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <div className="flex items-center">
                                    <div className="p-3 bg-purple-100 rounded-lg">
                                        <Database className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Questions in Bank</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.questionsInBank.toLocaleString()}</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <div className="flex items-center">
                                    <div className="p-3 bg-amber-100 rounded-lg">
                                        <Play className="w-6 h-6 text-amber-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Live Sessions</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.liveSessions}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Quick Actions & Recent Activity */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Recent Activity */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
                                    <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">View All</a>
                                </div>
                                <div className="space-y-4">
                                    {recentActivities.map((activity) => (
                                        <div key={activity.id} className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                                    <CheckCircle className="w-4 h-4 text-indigo-600" />
                                                </div>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm text-gray-900">{activity.description}</p>
                                                <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Upcoming Quizzes */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold text-gray-900">Upcoming Quizzes</h2>
                                    <Link to="/admin/quizzes" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                        Schedule New
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {upcomingQuizzes.map((quiz) => (
                                        <div key={quiz.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900">{quiz.name}</p>
                                                <p className="text-sm text-gray-500">{quiz.scheduledAt}</p>
                                            </div>
                                            <Link
                                                to={`/admin/quizzes/${quiz.id}/play`}
                                                className="px-3 py-1 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                                            >
                                                Prepare
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* System Status */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">System Status</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                    <div className="flex items-center">
                                        <Wifi className="w-5 h-5 text-green-600 mr-3" />
                                        <span className="font-medium text-green-800">WebSocket Server</span>
                                    </div>
                                    <p className="text-sm text-green-600 mt-2">Connected to {stats.registeredTeams} devices</p>
                                </div>
                                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                    <div className="flex items-center">
                                        <Database className="w-5 h-5 text-green-600 mr-3" />
                                        <span className="font-medium text-green-800">Database</span>
                                    </div>
                                    <p className="text-sm text-green-600 mt-2">Operational, SQLite</p>
                                </div>
                                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                    <div className="flex items-center">
                                        <Monitor className="w-5 h-5 text-green-600 mr-3" />
                                        <span className="font-medium text-green-800">Projector Client</span>
                                    </div>
                                    <p className="text-sm text-green-600 mt-2">Active, sync normal</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
