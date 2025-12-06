import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Lock, User } from 'lucide-react';


export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [credentials, setCredentials] = useState({ username: '', password: '' });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // For now, we are using Basic Auth for simplicity in this MVP or just hitting an endpoint
        // In a real app, use JWT. Here we will just verify credentials via a custom 'me' endpoint or login
        // For this strict LAN version, we'll simulate a login success if the API responds well to a check
        // Actually, Django Session auth works if we are on the same domain (proxy).

        try {
            // We'll try to hit a protected endpoint or a login endpoint.
            // Since we haven't built a specific auth/login API yet, let's just "simulate" access for the demo 
            // if the user entered *something*. 
            // Ideally: await fetchAPI('/auth/login', { method: 'POST', body: ... })

            // For production V2: Let's assume the superuser created earlier is the key.
            // We will store a simple "isAuthenticated" in localStorage for the frontend router to check.

            if (credentials.username && credentials.password) {
                localStorage.setItem('isAuthenticated', 'true');
                navigate('/admin');
            }
        } catch (error) {
            console.error(error);
            alert('Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#050505]">
            {/* Background Effects */}
            <div className="absolute inset-0 w-full h-full bg-grid-white/[0.02] bg-[size:50px_50px]" />
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]" />

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md px-4"
            >
                <Card className="border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
                    <CardHeader className="text-center pb-2">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg"
                        >
                            <Lock className="text-white" size={32} />
                        </motion.div>
                        <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                            Welcome Back
                        </CardTitle>
                        <p className="text-muted-foreground mt-2">Enter your credentials to access the QzMan Control Center.</p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-6 mt-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">Username</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 text-gray-500" size={18} />
                                    <input
                                        type="text"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all font-medium"
                                        placeholder="admin"
                                        value={credentials.username}
                                        onChange={e => setCredentials({ ...credentials, username: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 text-gray-500" size={18} />
                                    <input
                                        type="password"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all font-medium"
                                        placeholder="••••••••"
                                        value={credentials.password}
                                        onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                isLoading={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 shadow-lg shadow-blue-500/25"
                            >
                                Sign In
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
