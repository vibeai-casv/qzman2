import { useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home, BookOpen, Users, Settings, BarChart3,
    Plus, Monitor, Bell, LogOut, ChevronDown, Menu, X,
    Database
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
    const username = localStorage.getItem('username') || 'Admin';
    const userRole = localStorage.getItem('userRole') || 'ADMIN';

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

    const isActive = (href: string) => {
        if (href === '/admin') return location.pathname === '/admin';
        return location.pathname.startsWith(href);
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
                            <Link to="/admin" className="flex items-center ml-4 lg:ml-0">
                                <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
                                    <span className="text-lg font-bold text-white">Q</span>
                                </div>
                                <h1 className="ml-3 text-xl font-bold text-gray-900">QZMAN</h1>
                            </Link>
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
                                <AnimatePresence>
                                    {userMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
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
                                </AnimatePresence>
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
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg border-l-4 transition-colors ${isActive(item.href)
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
                <main className="flex-1 p-6 lg:ml-0 min-h-[calc(100vh-64px)]">
                    <div className="max-w-7xl mx-auto">
                        {/* Page Header */}
                        {(title || actions) && (
                            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    {title && <h1 className="text-2xl font-bold text-gray-900">{title}</h1>}
                                    {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
                                </div>
                                {actions && <div className="flex gap-3">{actions}</div>}
                            </div>
                        )}

                        {/* Page Content */}
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
