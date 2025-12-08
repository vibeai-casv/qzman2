import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    BookOpen,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    PlusCircle
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function AdminLayout() {
    const [isOpen, setIsOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const isAuth = localStorage.getItem('isAuthenticated');
        if (!isAuth) {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout/', { method: 'POST' });
        } catch (e) {
            console.error(e);
        }
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userRole');
        localStorage.removeItem('username');
        navigate('/login');
    };

    const role = localStorage.getItem('userRole') || 'ADMIN';

    let navItems = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { name: 'My Quizzes', path: '/admin/quizzes', icon: BookOpen },
        { name: 'Question Bank', path: '/admin/questions', icon: PlusCircle },
        { name: 'Teams', path: '/admin/teams', icon: Users },
        { name: 'Settings', path: '/admin/settings', icon: Settings },
    ];

    if (role === 'SUPER_ADMIN') {
        navItems = [
            { name: 'Console', path: '/super-admin', icon: LayoutDashboard },
            { name: 'Users', path: '/super-admin/users', icon: Users },
            { name: 'Settings', path: '/admin/settings', icon: Settings },
        ];
    } else if (role === 'QUIZ_MASTER') {
        navItems = [
            { name: 'Control', path: '/quiz-master', icon: LayoutDashboard },
            { name: 'Quizzes', path: '/admin/quizzes', icon: BookOpen },
            { name: 'Question Bank', path: '/admin/questions', icon: PlusCircle },
        ];
    } else if (role === 'SCORE_MANAGER') {
        navItems = [
            { name: 'Score Station', path: '/score-manager', icon: LayoutDashboard },
            { name: 'Teams', path: '/admin/teams', icon: Users },
        ];
    }

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isOpen ? 280 : 80 }}
                className="relative z-20 flex flex-col border-r border-white/10 bg-card/30 backdrop-blur-xl h-full shadow-2xl transition-all duration-300"
            >
                <div className="flex h-16 items-center justify-between px-6 border-b border-white/10">
                    {isOpen && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">QZMAN</motion.span>}
                    <button onClick={() => setIsOpen(!isOpen)} className="text-muted-foreground hover:text-white transition-colors">
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="flex-1 space-y-2 p-4">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link key={item.path} to={item.path}>
                                <div className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive ? 'bg-primary/20 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-white/5 hover:text-white'}`}>
                                    <item.icon size={22} className={isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-white'} />
                                    {isOpen && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="font-medium"
                                        >
                                            {item.name}
                                        </motion.span>
                                    )}
                                </div>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <Button variant="ghost" onClick={handleLogout} className="w-full justify-start gap-4 px-4 text-muted-foreground hover:text-red-400 hover:bg-red-400/10">
                        <LogOut size={22} />
                        {isOpen && <span>Logout</span>}
                    </Button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-background to-purple-900/10 pointer-events-none" />
                <div className="relative z-10 p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
