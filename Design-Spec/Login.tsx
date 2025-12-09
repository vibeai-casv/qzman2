import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, Check, Users, Monitor } from 'lucide-react';

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
        { icon: Check, text: 'Offline LAN Operation' },
        { icon: Check, text: 'Real-time Buzzer System' },
        { icon: Check, text: 'Global Question Bank' },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Left Panel - Brand/Info */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-900 to-purple-800 p-12 flex-col justify-between">
                <div>
                    <motion.div
                        className="flex items-center space-x-3 mb-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-3xl font-bold text-indigo-600">Q</span>
                        </div>
                        <h1 className="text-3xl font-bold text-white">QZMAN</h1>
                    </motion.div>

                    <motion.h2
                        className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        Professional Quiz Management
                    </motion.h2>

                    <motion.p
                        className="text-indigo-200 text-lg lg:text-xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        Complete LAN-based quiz system with real-time controls, advanced scoring, and global question banking.
                    </motion.p>
                </div>

                <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    {features.map((feature, index) => (
                        <div key={index} className="flex items-center text-indigo-200">
                            <feature.icon className="w-5 h-5 mr-3 text-indigo-300" />
                            <span className="text-lg">{feature.text}</span>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex justify-center mb-8">
                        <div className="flex items-center space-x-3">
                            <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-3xl font-bold text-white">Q</span>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900">QZMAN</h1>
                        </div>
                    </div>

                    <motion.div
                        className="bg-white rounded-2xl shadow-xl p-8 lg:p-10"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                        <p className="text-gray-600 mb-8">Sign in to your dashboard</p>

                        {error && (
                            <motion.div
                                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <svg className="h-5 w-5 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <p className="ml-3 text-sm text-red-700">{error}</p>
                            </motion.div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Username or Email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        placeholder="Enter your username"
                                        value={credentials.username}
                                        onChange={e => setCredentials({ ...credentials, username: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        placeholder="Enter your password"
                                        value={credentials.password}
                                        onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember"
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={e => setRememberMe(e.target.checked)}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                        Remember me
                                    </label>
                                </div>
                                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                    Forgot password?
                                </a>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>

                        {/* Quick LAN Access */}
                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <h3 className="text-sm font-medium text-gray-700 mb-4">Quick LAN Access</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <a
                                    href="/play"
                                    className="inline-flex justify-center items-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all"
                                >
                                    <Users className="w-4 h-4 mr-2 text-gray-500" />
                                    Team Login
                                </a>
                                <a
                                    href="/projector/1"
                                    className="inline-flex justify-center items-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all"
                                >
                                    <Monitor className="w-4 h-4 mr-2 text-gray-500" />
                                    Projector View
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    <p className="mt-8 text-center text-sm text-gray-600">
                        © 2024 QZMAN Quiz System. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
