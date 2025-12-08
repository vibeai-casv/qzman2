import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

import { Button } from '../../components/ui/Button';
import { Trophy, TrendingUp, AlertCircle, Edit } from 'lucide-react';

export default function ScoreManagerDashboard() {
    // Mock Data
    const teams = [
        { id: 1, name: 'Alpha Squad', score: 120, rank: 1, trend: 'up' },
        { id: 2, name: 'Beta Blockers', score: 115, rank: 2, trend: 'down' },
        { id: 3, name: 'Gamma Rays', score: 90, rank: 3, trend: 'stable' },
        { id: 4, name: 'Delta Force', score: 85, rank: 4, trend: 'up' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Score Manager Station</h1>
                    <p className="text-muted-foreground mt-2">Monitor and correct live scores.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Trophy className="text-yellow-400" /> Live Leaderboard
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {teams.map((team) => (
                                    <div key={team.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-yellow-500/30 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${team.rank === 1 ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-gray-300'}`}>
                                                {team.rank}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-white">{team.name}</h3>
                                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                                    {team.trend === 'up' && <TrendingUp size={12} className="text-green-400" />}
                                                    Rank {team.rank}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-2xl font-mono font-bold text-yellow-500">{team.score}</div>
                                            <Button size="icon" variant="secondary" title="Edit Score">
                                                <Edit size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="border-red-500/20 bg-red-500/5">
                        <CardHeader>
                            <CardTitle className="text-red-400 flex items-center gap-2">
                                <AlertCircle size={20} /> pending Disputes
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8 text-gray-500">
                                No disputes raised.
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Manual Adjustment</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-gray-400">Log manual point adjustments for technical issues or bonus rounds.</p>
                            <Button className="w-full">Log Adjustment</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
}
