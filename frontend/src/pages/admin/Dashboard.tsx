import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Plus } from 'lucide-react';

export default function Dashboard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Dashboard</h1>
                    <p className="text-muted-foreground mt-2">Welcome back, Quiz Master.</p>
                </div>
                <Button className="gap-2 shadow-lg shadow-primary/20">
                    <Plus size={18} />
                    Create New Quiz
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card hoverEffect>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Quizzes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-white">12</div>
                        <p className="text-xs text-muted-foreground mt-1">+2 from last month</p>
                    </CardContent>
                </Card>
                <Card hoverEffect>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Questions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-white">843</div>
                        <p className="text-xs text-muted-foreground mt-1">+120 new questions</p>
                    </CardContent>
                </Card>
                <Card hoverEffect>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active Teams</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-white">24</div>
                        <p className="text-xs text-muted-foreground mt-1">Across 3 active sessions</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="h-[400px]">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0">
                                    <div>
                                        <h4 className="font-medium text-white">IT Quiz Finals 2025</h4>
                                        <p className="text-sm text-muted-foreground">Edited by Admin</p>
                                    </div>
                                    <span className="text-xs text-muted-foreground">2 hours ago</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="h-[400px] border-primary/20 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="text-primary">Featured Question</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg text-white/90 italic">"What is the name of the first computer programmer?"</p>
                        <div className="mt-4 flex gap-2">
                            <span className="px-3 py-1 rounded-full bg-white/10 text-xs text-white">History</span>
                            <span className="px-3 py-1 rounded-full bg-white/10 text-xs text-white">Easy</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    )
}
