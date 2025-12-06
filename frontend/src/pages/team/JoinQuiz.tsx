import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { fetchAPI } from '../../lib/api';
import { Users, Hash } from 'lucide-react';

export default function JoinQuiz() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ access_code: '', team_name: '' });

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // We need to find the quiz first or just try to join directly if the API supports it
            // Since our backend ViewSet has a 'join' action on detail, we might need the ID.
            // For simplicity v2, let's assume we search by Access Code first or the Join API 
            // handles looking up the quiz by code.

            // Actually, typically typically you join a "Session".
            // Let's assume for now we hit a global join endpoint or iterate.
            // Since I only implemented `join` on `QuizViewSet` detail route, I need a Quiz ID.
            // Let's just mock the flow for the UI for now, or assume Quiz ID 1 for testing.

            // TODO: Implement a lookup API to get Quiz ID from Access Code.
            // For now: specific quiz ID 1.

            const res = await fetchAPI(`/quizzes/1/join/`, {
                method: 'POST',
                body: JSON.stringify(formData)
            });

            // Save team info
            localStorage.setItem('team', JSON.stringify(res));
            navigate('/play/lobby');

        } catch (error) {
            console.error(error);
            alert('Failed to join. Check code or connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Mobile-friendly background */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-black pointer-events-none" />

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-full max-w-sm z-10"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">QZMAN <span className="text-blue-500">LIVE</span></h1>
                    <p className="text-gray-400">Enter game details to join</p>
                </div>

                <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
                    <CardContent className="pt-6">
                        <form onSubmit={handleJoin} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 pl-1">Access Code</label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-3 text-blue-500" size={18} />
                                    <input
                                        className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-lg tracking-widest font-mono text-center focus:border-blue-500 outline-none transition-colors uppercase"
                                        placeholder="ABCD"
                                        maxLength={4}
                                        value={formData.access_code}
                                        onChange={e => setFormData({ ...formData, access_code: e.target.value.toUpperCase() })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 pl-1">Team Name</label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-3 text-blue-500" size={18} />
                                    <input
                                        className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-lg font-medium focus:border-blue-500 outline-none transition-colors"
                                        placeholder="The Quizzers"
                                        value={formData.team_name}
                                        onChange={e => setFormData({ ...formData, team_name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="w-full text-lg h-14 bg-gradient-to-r from-blue-600 to-cyan-500 shadow-xl shadow-blue-500/20"
                                isLoading={loading}
                            >
                                Join Game
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-center text-xs text-gray-600 mt-8">
                    Runs on QZMAN v2.0 &bull; Offline Mode
                </p>
            </motion.div>
        </div>
    );
}
