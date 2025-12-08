import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Plus, Trophy, BrainCircuit, Users, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-extrabold text-gradient">Dashboard</h1>
                    <p className="text-muted-foreground mt-2 text-lg">Your command center for all quiz activities.</p>
                </div>
                <Link to="/admin/quizzes">
                    <Button className="gap-2 shadow-lg shadow-cyan-500/20 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 border-none">
                        <Plus size={18} />
                        Create New Quiz
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card hoverEffect className="border-cyan-500/20 bg-gradient-to-br from-cyan-950/30 to-black/40">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-cyan-400">Total Quizzes</CardTitle>
                        <Trophy size={20} className="text-cyan-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-white">12</div>
                        <p className="text-xs text-muted-foreground mt-1">+2 from last month</p>
                    </CardContent>
                </Card>
                <Card hoverEffect className="border-purple-500/20 bg-gradient-to-br from-purple-950/30 to-black/40">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-purple-400">Question Bank</CardTitle>
                        <BrainCircuit size={20} className="text-purple-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-white">843</div>
                        <p className="text-xs text-muted-foreground mt-1">+120 new questions</p>
                    </CardContent>
                </Card>
                <Card hoverEffect className="border-green-500/20 bg-gradient-to-br from-green-950/30 to-black/40">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-green-400">Active Teams</CardTitle>
                        <Users size={20} className="text-green-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-white">24</div>
                        <p className="text-xs text-muted-foreground mt-1">Across 3 active sessions</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="glass">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity size={20} className="text-blue-400" /> Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 hover:bg-white/5 p-2 rounded transition-colors cursor-pointer">
                                    <div>
                                        <h4 className="font-bold text-white">IT Quiz Finals 2025</h4>
                                        <p className="text-sm text-gray-400">Questions updated by Admin</p>
                                    </div>
                                    <span className="text-xs text-gray-500">2 hours ago</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                    <CardHeader>
                        <CardTitle className="text-blue-200 z-10 relative">Featured Question</CardTitle>
                    </CardHeader>
                    <CardContent className="z-10 relative">
                        <p className="text-2xl font-serif text-white/90 italic leading-relaxed">"What is the name of the first computer programmer?"</p>
                        <div className="mt-8 flex gap-3">
                            <span className="px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-xs font-bold text-blue-200 uppercase tracking-widest">History</span>
                            <span className="px-4 py-1.5 rounded-full bg-green-500/20 border border-green-500/30 text-xs font-bold text-green-200 uppercase tracking-widest">Easy</span>
                        </div>
                        <div className="mt-8 pt-4 border-t border-white/10 text-right">
                            <span className="text-sm text-gray-400">Answer: <span className="text-white font-bold ml-2">Ada Lovelace</span></span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    )
}
