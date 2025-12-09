import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Lock, User, Eye, EyeOff, Users, Monitor,
    Zap, Database, Shield, ArrowRight,
    Target, Wifi, TrendingUp
} from 'lucide-react';

export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const payload = {
            username: credentials.username.trim(),
            password: credentials.password.trim()
        };

        try {
            const res = await fetch('/api/auth/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (data.success) {
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userRole', data.role);
                localStorage.setItem('username', data.username);

                switch (data.role) {
                    case 'SUPER_ADMIN':
                        navigate('/super-admin');
                        break;
                    case 'QUIZ_MASTER':
                        navigate('/quiz-master');
                        break;
                    case 'SCORE_MANAGER':
                        navigate('/score-manager');
                        break;
                    case 'ADMIN':
                    default:
                        navigate('/admin');
                        break;
                }
            } else {
                setError(data.error || data.detail || 'Invalid credentials');
            }
        } catch (err) {
            console.error('Login Error:', err);
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const features = [
        { icon: Wifi, text: 'Offline LAN Operation', color: 'from-blue-500 to-cyan-500' },
        { icon: Zap, text: 'Real-time Buzzer System', color: 'from-purple-500 to-pink-500' },
        { icon: Database, text: 'Global Question Bank', color: 'from-emerald-500 to-teal-500' },
        { icon: Shield, text: 'Enterprise Security', color: 'from-amber-500 to-orange-500' },
        { icon: Target, text: 'Advanced Analytics', color: 'from-violet-500 to-purple-500' },
        { icon: TrendingUp, text: 'Live Score Tracking', color: 'from-rose-500 to-pink-500' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-500"></div>
            </div>

            <div className="relative flex min-h-screen">
                {/* Left Panel - Enhanced Brand/Info */}
                <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative z-10"
                    >
                        {/* Floating Particles */}
                        <div className="absolute -top-10 -left-10 w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-xl"></div>
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 rounded-full blur-xl"></div>

                        <div className="flex items-center space-x-4 mb-12">
                            <motion.div
                                whileHover={{ scale: 1.05, rotate: 5 }}
                                className="relative"
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/30">
                                    <span className="text-3xl font-bold text-white">Q</span>
                                </div>
                                <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-30 animate-pulse"></div>
                            </motion.div>
                            <div>
                                <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
                                    QZMAN
                                </h1>
                                <p className="text-indigo-300 font-medium">Quiz Management System</p>
                            </div>
                        </div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight"
                        >
                            Professional
                            <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Quiz Management
                            </span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="text-xl text-slate-300 mb-12 leading-relaxed max-w-2xl"
                        >
                            Complete LAN-based quiz system with real-time controls, advanced scoring, and global question banking. Perfect for tournaments, corporate events, and educational institutions.
                        </motion.p>

                        {/* Feature Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.1 * index }}
                                    whileHover={{ scale: 1.02, x: 5 }}
                                    className="group"
                                >
                                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
                                        <div className="flex items-center space-x-3">
                                            <div className={`p-2 rounded-lg bg-gradient-to-br ${feature.color} shadow-lg`}>
                                                <feature.icon className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="text-white font-medium text-sm">{feature.text}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Stats Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="relative z-10"
                    >
                        <div className="bg-gradient-to-r from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-white">500+</div>
                                    <div className="text-sm text-slate-400">Active Quizzes</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-white">10K+</div>
                                    <div className="text-sm text-slate-400">Questions</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-white">99.9%</div>
                                    <div className="text-sm text-slate-400">Uptime</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Panel - Enhanced Login Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-12 relative">
                    <div className="w-full max-w-md">
                        {/* Mobile Logo */}
                        <div className="lg:hidden flex justify-center mb-8">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200 }}
                                className="relative"
                            >
                                <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/30">
                                    <span className="text-4xl font-bold text-white">Q</span>
                                </div>
                                <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-3xl blur-xl"></div>
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="relative"
                        >
                            {/* Glass Effect Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20"></div>

                            {/* Glow Effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl blur opacity-20"></div>

                            <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-3xl p-8 lg:p-10 border border-white/10 shadow-2xl">
                                <div className="text-center mb-8">
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl mb-4 shadow-lg"
                                    >
                                        <User className="w-8 h-8 text-white" />
                                    </motion.div>
                                    <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                                        Welcome Back
                                    </h2>
                                    <p className="text-slate-400 mt-2">Sign in to your dashboard</p>
                                </div>

                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mb-6 p-4 bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-xl backdrop-blur-sm"
                                        >
                                            <div className="flex items-center">
                                                <div className="p-2 bg-red-500/20 rounded-lg mr-3">
                                                    <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <p className="text-sm text-red-300">{error}</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <form onSubmit={handleLogin} className="space-y-6">
                                    {/* Username Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-3">
                                            Username or Email
                                        </label>
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="relative"
                                        >
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <User className="h-5 w-5 text-slate-500" />
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
                                                placeholder="Enter your username"
                                                value={credentials.username}
                                                onChange={e => setCredentials({ ...credentials, username: e.target.value })}
                                            />
                                        </motion.div>
                                    </div>

                                    {/* Password Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-3">
                                            Password
                                        </label>
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="relative"
                                        >
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-slate-500" />
                                            </div>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                required
                                                className="block w-full pl-12 pr-12 py-4 bg-white/5 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
                                                placeholder="Enter your password"
                                                value={credentials.password}
                                                onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-white transition-colors"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-5 w-5 text-slate-500 hover:text-white" />
                                                ) : (
                                                    <Eye className="h-5 w-5 text-slate-500 hover:text-white" />
                                                )}
                                            </button>
                                        </motion.div>
                                    </div>

                                    {/* Remember & Forgot */}
                                    <div className="flex items-center justify-between">
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            className="flex items-center"
                                        >
                                            <input
                                                id="remember"
                                                type="checkbox"
                                                checked={rememberMe}
                                                onChange={e => setRememberMe(e.target.checked)}
                                                className="h-5 w-5 rounded border-slate-700 bg-white/5 text-indigo-600 focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-slate-900"
                                            />
                                            <label htmlFor="remember" className="ml-3 text-sm text-slate-400">
                                                Remember me
                                            </label>
                                        </motion.div>
                                        <a href="#" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                                            Forgot password?
                                        </a>
                                    </div>

                                    {/* Login Button */}
                                    <motion.button
                                        type="submit"
                                        disabled={loading}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full relative overflow-hidden group"
                                    >
                                        {/* Button Background */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 group-hover:from-indigo-500 group-hover:via-purple-500 group-hover:to-pink-500 transition-all duration-300"></div>
                                        {/* Button Glow */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-xl group-hover:blur-2xl transition-all duration-300"></div>

                                        <div className="relative flex justify-center items-center py-4 px-4 border border-transparent rounded-xl text-sm font-semibold text-white transition-all duration-300">
                                            {loading ? (
                                                <>
                                                    <svg className="animate-spin h-5 w-5 text-white mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Signing In...
                                                </>
                                            ) : (
                                                <>
                                                    <span className="mr-2">Sign In</span>
                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </div>
                                    </motion.button>
                                </form>

                                {/* Quick LAN Access */}
                                <div className="mt-10 pt-8 border-t border-slate-800">
                                    <h3 className="text-sm font-medium text-slate-400 mb-4 text-center">Quick LAN Access</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <motion.a
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            href="/play"
                                            className="inline-flex justify-center items-center px-4 py-3 bg-white/5 border border-slate-700 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 hover:border-slate-600 transition-all group"
                                        >
                                            <Users className="w-4 h-4 mr-2 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                                            Team Login
                                        </motion.a>
                                        <motion.a
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            href="/projector/1"
                                            className="inline-flex justify-center items-center px-4 py-3 bg-white/5 border border-slate-700 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 hover:border-slate-600 transition-all group"
                                        >
                                            <Monitor className="w-4 h-4 mr-2 text-slate-400 group-hover:text-purple-400 transition-colors" />
                                            Projector View
                                        </motion.a>
                                    </div>
                                </div>

                                {/* Demo Credentials */}
                                <div className="mt-6 p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl">
                                    <p className="text-xs text-slate-400 text-center">
                                        Demo: admin / admin123
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Footer */}
                        <p className="mt-8 text-center text-sm text-slate-500">
                            © 2024 QZMAN Quiz System. All rights reserved.
                            <span className="block text-xs text-slate-600 mt-1">v2.0 • Production Ready</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Floating Elements */}
            <motion.div
                animate={{
                    y: [0, -20, 0],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute bottom-10 left-10 w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-sm opacity-50"
            ></motion.div>
            <motion.div
                animate={{
                    y: [0, 20, 0],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                }}
                className="absolute top-10 right-10 w-6 h-6 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full blur-sm opacity-30"
            ></motion.div>
        </div>
    );
}
