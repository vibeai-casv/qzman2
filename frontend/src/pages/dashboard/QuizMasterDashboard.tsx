import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Mic2, Play, BookOpen, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function QuizMasterDashboard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Quiz Master Control</h1>
                    <p className="text-muted-foreground mt-2">Manage your quizzes and live sessions.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <Card className="col-span-full border-purple-500/20 bg-purple-500/5">
                    <CardHeader>
                        <CardTitle className="text-purple-400 flex items-center gap-2">
                            <Mic2 size={24} /> Live Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex gap-4">
                        <Button className="bg-purple-600 hover:bg-purple-700 h-16 text-lg px-8">
                            <Play className="mr-2" fill="currentColor" /> Start New Quiz
                        </Button>
                        <Link to="/admin/questions">
                            <Button variant="secondary" className="h-16 text-lg px-8">
                                <BookOpen className="mr-2" /> Question Bank
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card hoverEffect>
                    <CardHeader>
                        <CardTitle className="text-lg">Your Quizzes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            <li className="p-3 bg-white/5 rounded-lg flex justify-between items-center">
                                <span>Tech Trivia 2025</span>
                                <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">Ready</span>
                            </li>
                            <li className="p-3 bg-white/5 rounded-lg flex justify-between items-center">
                                <span>Science Finals</span>
                                <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">Draft</span>
                            </li>
                        </ul>
                        <Link to="/admin/quizzes" className="block mt-4 text-center text-sm text-blue-400 hover:underline">View All</Link>
                    </CardContent>
                </Card>

                <Card hoverEffect>
                    <CardHeader>
                        <CardTitle className="text-lg">Recent Question Packs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            <li className="p-3 bg-white/5 rounded-lg flex items-center gap-3">
                                <Layers size={16} className="text-gray-400" />
                                <span>General Knowledge Set A</span>
                            </li>
                            <li className="p-3 bg-white/5 rounded-lg flex items-center gap-3">
                                <Layers size={16} className="text-gray-400" />
                                <span>Audio/Visual Round 1</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
}
