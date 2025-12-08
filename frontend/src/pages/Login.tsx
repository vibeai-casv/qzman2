import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Lock, User } from 'lucide-react';
import AnimatedBackground from '../components/ui/AnimatedBackground';


export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [credentials, setCredentials] = useState({ username: '', password: '' });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            username: credentials.username.trim(),
            password: credentials.password.trim()
        };

        // Debug: Log payload
        console.log('Sending login payload:', payload);

        try {
            const res = await fetch('/api/auth/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            console.log('Login response status:', res.status);
            const data = await res.json();
            console.log('Login response data:', data);

            if (data.success) {
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userRole', data.role);
                localStorage.setItem('username', data.username);

                // Redirect based on role
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
                // Improved Error Reporting
                const errorMsg = data.error || data.detail || JSON.stringify(data);
                alert(`Login Failed: ${errorMsg}`);
            }
        } catch (error) {
            console.error('Login Fetch Error:', error);
            alert(`Network/Server Error: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#050505]">
            <AnimatedBackground />

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 w-full max-w-2xl px-6"
            >
                <Card className="border-qz-primary/20 bg-slate-950/60 backdrop-blur-xl shadow-2xl p-8 lg:p-12 shadow-qz-primary/10">
                    <CardHeader className="text-center pb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                            className="w-24 h-24 bg-gradient-to-tr from-qz-primary to-qz-accent rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-2xl shadow-qz-primary/30"
                        >
                            <Lock className="text-white" size={48} />
                        </motion.div>
                        <CardTitle className="text-5xl font-bold text-white tracking-tight mb-4">
                            Welcome Back
                        </CardTitle>
                        <p className="text-slate-400 text-xl font-medium">Enter your credentials to access the QzMan Control Center.</p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-lg font-semibold text-slate-300 ml-1">Username</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="text-slate-500 group-focus-within:text-qz-primary transition-colors" size={24} />
                                    </div>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-4 pl-14 pr-6 text-white text-xl placeholder-slate-600 focus:outline-none focus:border-qz-primary/50 focus:ring-2 focus:ring-qz-primary/20 transition-all font-medium"
                                        placeholder="Enter your username"
                                        value={credentials.username}
                                        onChange={e => setCredentials({ ...credentials, username: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-lg font-semibold text-slate-300 ml-1">Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="text-slate-500 group-focus-within:text-qz-primary transition-colors" size={24} />
                                    </div>
                                    <input
                                        type="password"
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-4 pl-14 pr-6 text-white text-xl placeholder-slate-600 focus:outline-none focus:border-qz-primary/50 focus:ring-2 focus:ring-qz-primary/20 transition-all font-medium"
                                        placeholder="••••••••••••"
                                        value={credentials.password}
                                        onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                isLoading={loading}
                                className="w-full bg-gradient-to-r from-qz-primary to-qz-accent hover:opacity-90 text-white text-xl font-bold py-5 rounded-xl shadow-xl shadow-qz-primary/20 hover:shadow-qz-primary/30 transition-all transform hover:scale-[1.02] mt-4"
                            >
                                Sign In to Dashboard
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
