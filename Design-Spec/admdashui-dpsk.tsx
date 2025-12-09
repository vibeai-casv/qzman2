import { useState, useEffect, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, BookOpen, Users, Settings, BarChart3, Bell, LogOut,
  Plus, Monitor, ChevronDown, Menu, X, Database, Zap, Target,
  Trophy, Calendar, FileText, Layers, PieChart, TrendingUp,
  Download, Upload, Filter, Search, Eye, Edit, Trash2,
  Activity, Globe, Shield, RefreshCw, MoreVertical,
  Crown, Star, Award, TrendingDown
} from 'lucide-react';

interface AdminPageLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
}

export default function AdminPageLayout({ children, title, subtitle, actions }: AdminPageLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const username = localStorage.getItem('username') || 'Admin';
  const userRole = localStorage.getItem('userRole') || 'ADMIN';
  const [stats, setStats] = useState({
    activeQuizzes: 3,
    totalTeams: 24,
    totalQuestions: 1248,
    liveSessions: 1,
    avgScore: 78,
    uptime: 99.9
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        liveSessions: Math.max(1, prev.liveSessions + (Math.random() > 0.5 ? 1 : -1))
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: Home, href: '/admin', color: 'from-blue-500 to-cyan-500' },
    { id: 'quizzes', label: 'Quiz Management', icon: BookOpen, href: '/admin/quizzes', color: 'from-purple-500 to-pink-500' },
    { id: 'questions', label: 'Question Bank', icon: Database, href: '/admin/questions', color: 'from-emerald-500 to-teal-500' },
    { id: 'teams', label: 'Teams', icon: Users, href: '/admin/teams', color: 'from-amber-500 to-orange-500' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/admin/analytics', color: 'from-violet-500 to-purple-500' },
    { id: 'reports', label: 'Reports', icon: FileText, href: '/admin/reports', color: 'from-rose-500 to-pink-500' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/admin/settings', color: 'from-slate-600 to-slate-700' },
  ];

  const notifications = [
    { id: 1, type: 'success', title: 'Quiz Started', message: 'Tech Trivia 2024 is now live', time: '2 min ago' },
    { id: 2, type: 'warning', title: 'Team Joined', message: 'Team "Code Warriors" has joined', time: '5 min ago' },
    { id: 3, type: 'info', title: 'Question Added', message: '15 new questions added to Physics', time: '1 hour ago' },
    { id: 4, type: 'error', title: 'System Backup', message: 'Daily backup completed', time: '2 hours ago' },
  ];

  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'created a new quiz', target: 'Tech Challenge', time: '10 min ago' },
    { id: 2, user: 'Sarah Smith', action: 'added questions to', target: 'Science Bowl', time: '25 min ago' },
    { id: 3, user: 'Mike Johnson', action: 'started live session', target: 'Math Olympiad', time: '1 hour ago' },
    { id: 4, user: 'Emma Wilson', action: 'exported report for', target: 'Quarterly Review', time: '2 hours ago' },
  ];

  const quickStats = [
    { label: 'Response Time', value: '45ms', change: '+2.3%', icon: Zap, color: 'bg-gradient-to-br from-blue-500 to-cyan-500' },
    { label: 'Accuracy', value: '98.7%', change: '+0.5%', icon: Target, color: 'bg-gradient-to-br from-emerald-500 to-teal-500' },
    { label: 'Engagement', value: '89.2%', change: '+3.1%', icon: TrendingUp, color: 'bg-gradient-to-br from-purple-500 to-pink-500' },
    { label: 'Satisfaction', value: '4.8/5', change: '+0.2', icon: Star, color: 'bg-gradient-to-br from-amber-500 to-orange-500' },
  ];

  const getRoleDisplay = (role: string) => {
    const roles: Record<string, { label: string, color: string, icon: any }> = {
      'SUPER_ADMIN': { label: 'Super Admin', color: 'from-red-500 to-pink-500', icon: Crown },
      'QUIZ_MASTER': { label: 'Quiz Master', color: 'from-purple-500 to-indigo-500', icon: Award },
      'SCORE_MANAGER': { label: 'Score Manager', color: 'from-blue-500 to-cyan-500', icon: TrendingUp },
      'ADMIN': { label: 'Administrator', color: 'from-emerald-500 to-teal-500', icon: Shield },
    };
    return roles[role] || { label: 'User', color: 'from-slate-500 to-slate-600', icon: Users };
  };

  const roleInfo = getRoleDisplay(userRole);

  const isActive = (href: string) => {
    if (href === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(href);
  };

  const StatsCard = ({ label, value, icon: Icon, color, change }: any) => (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className={`text-sm font-medium px-2 py-1 rounded-full ${change.includes('+') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
          {change}
        </span>
      </div>
      <div>
        <p className="text-3xl font-bold text-white">{value}</p>
        <p className="text-sm text-slate-400 mt-1">{label}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      </div>

      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left: Logo & Menu Toggle */}
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <Link to="/admin" className="flex items-center ml-4 lg:ml-0">
                <motion.div
                  whileHover={{ rotate: 5 }}
                  className="relative"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-xl font-bold text-white">Q</span>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-30"></div>
                </motion.div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                    QZMAN
                  </h1>
                  <p className="text-xs text-slate-500">Dashboard</p>
                </div>
              </Link>
            </div>

            {/* Center: Search */}
            <div className="hidden md:flex items-center flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search quizzes, questions, teams..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-2">
              {/* Quick Actions */}
              <div className="hidden md:flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Quiz
                </motion.button>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/projector/1"
                  target="_blank"
                  className="flex items-center px-4 py-2 bg-slate-800/50 border border-slate-700 text-slate-300 font-medium rounded-xl hover:bg-slate-800 hover:text-white transition-all"
                >
                  <Monitor className="w-4 h-4 mr-2" />
                  Projector
                </motion.a>
              </div>

              {/* Notifications */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                </motion.button>

                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-80 bg-slate-800/90 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-700/50 z-50"
                    >
                      <div className="p-4 border-b border-slate-700">
                        <div className="flex justify-between items-center">
                          <h3 className="font-bold text-white">Notifications</h3>
                          <span className="text-xs text-slate-500">{notifications.length} new</span>
                        </div>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className="p-4 border-b border-slate-700/50 hover:bg-slate-700/30 cursor-pointer transition-colors"
                          >
                            <div className="flex items-start">
                              <div className={`p-2 rounded-lg mr-3 ${
                                notification.type === 'success' ? 'bg-emerald-500/20' :
                                notification.type === 'warning' ? 'bg-amber-500/20' :
                                notification.type === 'error' ? 'bg-rose-500/20' :
                                'bg-blue-500/20'
                              }`}>
                                <Bell className="w-4 h-4" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-white">{notification.title}</p>
                                <p className="text-sm text-slate-400">{notification.message}</p>
                                <p className="text-xs text-slate-500 mt-1">{notification.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 border-t border-slate-700">
                        <button className="w-full text-center text-sm text-indigo-400 hover:text-indigo-300">
                          View all notifications
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Menu */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${roleInfo.color} flex items-center justify-center shadow-lg`}>
                    <span className="text-lg font-bold text-white">
                      {username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-white">{username}</p>
                    <p className="text-xs text-slate-400">{roleInfo.label}</p>
                  </div>
                  <ChevronDown className="h-5 w-5 text-slate-500" />
                </motion.button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-64 bg-slate-800/90 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-700/50 z-50"
                    >
                      <div className="p-4 border-b border-slate-700">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${roleInfo.color} flex items-center justify-center`}>
                            <span className="text-xl font-bold text-white">
                              {username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-bold text-white">{username}</p>
                            <p className="text-sm text-slate-400">{roleInfo.label}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <Link
                          to="/admin/profile"
                          className="flex items-center px-3 py-3 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                        >
                          <Users className="w-4 h-4 mr-3" />
                          Profile Settings
                        </Link>
                        <Link
                          to="/admin/audit"
                          className="flex items-center px-3 py-3 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                        >
                          <FileText className="w-4 h-4 mr-3" />
                          Audit Logs
                        </Link>
                        <Link
                          to="/admin/settings"
                          className="flex items-center px-3 py-3 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                        >
                          <Settings className="w-4 h-4 mr-3" />
                          System Settings
                        </Link>
                      </div>
                      <div className="p-3 border-t border-slate-700">
                        <button
                          onClick={handleLogout}
                          className="flex items-center justify-center w-full px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-medium rounded-lg hover:from-rose-500 hover:to-pink-500 transition-all"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 bg-slate-900/80 backdrop-blur-xl border-r border-slate-700/50 transform transition-transform lg:relative lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={{ top: '64px' }}
        >
          <div className="h-full flex flex-col">
            {/* User Profile */}
            <div className="p-6 border-b border-slate-700/50">
              <div className="flex items-center">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${roleInfo.color} flex items-center justify-center shadow-lg`}>
                  <span className="text-2xl font-bold text-white">
                    {username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="ml-4">
                  <p className="text-lg font-bold text-white">{username}</p>
                  <div className="flex items-center mt-1">
                    <roleInfo.icon className="w-4 h-4 text-slate-400 mr-2" />
                    <span className="text-sm text-slate-400">{roleInfo.label}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ x: 5 }}
                  >
                    <Link
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                        active
                          ? 'bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-lg'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mr-3 shadow-md`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      {item.label}
                      {active && (
                        <div className="ml-auto w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse"></div>
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* System Status */}
            <div className="p-4 border-t border-slate-700/50">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-slate-300">System Status</p>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-xs text-emerald-400">Live</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">WebSocket</span>
                    <span className="text-emerald-400 font-medium">24 devices</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Database</span>
                    <span className="text-blue-400 font-medium">1.2GB / 10GB</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Uptime</span>
                    <span className="text-emerald-400 font-medium">99.9%</span>
                  </div>
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-slate-800 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-700 hover:text-white transition-colors">
                  <RefreshCw className="w-4 h-4 inline mr-2" />
                  Refresh Status
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 min-h-[calc(100vh-64px)] overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            {(title || actions) && (
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    {title && (
                      <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                        {title}
                      </h1>
                    )}
                    {subtitle && (
                      <p className="text-slate-400 mt-2 flex items-center">
                        <span className="w-1 h-1 bg-slate-600 rounded-full mr-2"></span>
                        {subtitle}
                      </p>
                    )}
                  </div>
                  {actions && <div className="flex gap-3">{actions}</div>}
                </div>
              </div>
            )}

            {/* Dashboard Overview (Default) */}
            {!title && (
              <>
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <StatsCard label="Active Quizzes" value={stats.activeQuizzes} icon={BookOpen} color="bg-gradient-to-br from-blue-500 to-cyan-500" change="+2" />
                  <StatsCard label="Registered Teams" value={stats.totalTeams} icon={Users} color="bg-gradient-to-br from-purple-500 to-pink-500" change="+4" />
                  <StatsCard label="Question Bank" value={stats.totalQuestions} icon={Database} color="bg-gradient-to-br from-emerald-500 to-teal-500" change="+15" />
                  <StatsCard label="Live Sessions" value={stats.liveSessions} icon={Activity} color="bg-gradient-to-br from-amber-500 to-orange-500" change="+1" />
                </div>

                {/* Performance Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Recent Activities */}
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-white">Recent Activities</h2>
                      <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                        View All →
                      </button>
                    </div>
                    <div className="space-y-4">
                      {recentActivities.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center p-4 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-colors"
                        >
                          <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center mr-4">
                            <Users className="w-5 h-5 text-slate-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-white">
                              <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                              <span className="text-indigo-300">{activity.target}</span>
                            </p>
                            <p className="text-sm text-slate-500">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* System Metrics */}
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-white">System Metrics</h2>
                      <div className="flex items-center text-sm text-emerald-400">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                        All Systems Normal
                      </div>
                    </div>
                    <div className="space-y-6">
                      {quickStats.map((stat, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-lg ${stat.color} mr-3`}>
                              <stat.icon className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-slate-300">{stat.label}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                            <span className={`text-sm ${stat.change.includes('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {stat.change}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Upcoming Events */}
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Upcoming Events</h2>
                    <button className="flex items-center text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule New
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { name: 'Tech Trivia Finals', date: 'Today, 18:00', teams: 8, color: 'from-blue-500/20 to-cyan-500/20' },
                      { name: 'Science Bowl', date: 'Tomorrow, 14:00', teams: 12, color: 'from-purple-500/20 to-pink-500/20' },
                      { name: 'Math Olympiad', date: 'Nov 15, 10:00', teams: 16, color: 'from-emerald-500/20 to-teal-500/20' },
                    ].map((event, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ y: -5 }}
                        className={`bg-gradient-to-br ${event.color} border border-slate-700/50 rounded-xl p-4`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <Trophy className="w-5 h-5 text-white/50" />
                          <span className="text-xs text-slate-400 px-2 py-1 bg-slate-800/50 rounded-full">
                            {event.teams} teams
                          </span>
                        </div>
                        <h3 className="font-bold text-white mb-2">{event.name}</h3>
                        <p className="text-sm text-slate-400">{event.date}</p>
                        <button className="w-full mt-4 px-4 py-2 bg-slate-800/50 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">
                          Prepare Quiz
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Page Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>

      {/* Live Quiz Notification */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <div className="relative group">
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
          
          <div className="relative bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-4 shadow-2xl">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <p className="font-bold text-white">LIVE: Tech Trivia 2024</p>
                <p className="text-sm text-slate-400">Round 3 • Question 15 • 8 teams</p>
              </div>
              <a
                href="/quiz/control"
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg hover:from-indigo-500 hover:to-purple-500 transition-all"
              >
                Join →
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}