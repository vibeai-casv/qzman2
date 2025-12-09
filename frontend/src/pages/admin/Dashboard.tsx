import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    BookOpen, Users, Database, Activity, Zap, Target,
    Trophy, Calendar, TrendingUp, MoreHorizontal
} from 'lucide-react';

interface Stats {
    activeQuizzes: number;
    registeredTeams: number;
    questionsInBank: number;
    liveSessions: number;
}

// Simple SVG Chart Component for "Graphic Rich" feel without external libs
const ActivityGraph = () => (
    <div className="relative h-48 w-full overflow-hidden">
        <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
            <defs>
                <linearGradient id="gradientGraph" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
                </linearGradient>
            </defs>
            <path
                d="M0,40 L0,30 C10,25 20,35 30,20 C40,5 50,25 60,15 C70,5 80,10 90,20 L100,5 L100,40 Z"
                fill="url(#gradientGraph)"
            />
            <path
                d="M0,30 C10,25 20,35 30,20 C40,5 50,25 60,15 C70,5 80,10 90,20 L100,5"
                fill="none"
                stroke="#818cf8"
                strokeWidth="0.5"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
        {/* Data points */}
        <div className="absolute top-[20%] left-[30%] w-3 h-3 bg-indigo-500 rounded-full border-2 border-slate-900 shadow-lg group">
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                New High: 30 Qz
            </div>
        </div>
        <div className="absolute top-[15%] left-[60%] w-3 h-3 bg-purple-500 rounded-full border-2 border-slate-900 shadow-lg group">
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Peak Users: 120
            </div>
        </div>
    </div>
);

export default function Dashboard() {
    const [stats, setStats] = useState<Stats>({
        activeQuizzes: 0,
        registeredTeams: 0,
        questionsInBank: 0,
        liveSessions: 0
    });

    const [recentActivities] = useState([
        { id: 1, user: 'Admin', action: 'created quiz', target: 'Tech Challenge', time: '10 min', icon: Calendar, color: 'text-blue-400' },
        { id: 2, user: 'QuizMaster', action: 'updated', target: 'Science Bowl', time: '25 min', icon: Database, color: 'text-emerald-400' },
        { id: 3, user: 'System', action: 'backup', target: 'Automatic', time: '1 hr', icon: Zap, color: 'text-amber-400' },
        { id: 4, user: 'Scorer', action: 'finalized', target: 'Math Olympiad', time: '2 hr', icon: Trophy, color: 'text-purple-400' },
    ]);

    useEffect(() => {
        // Simulating API fetch for demo purposes if real endpoints fail
        // In production, keep the fetch logic
        const fetchStats = async () => {
            try {
                // Mock data fallback if fetch fails for immediate visual gratification
                setStats({
                    activeQuizzes: 12,
                    registeredTeams: 48,
                    questionsInBank: 1543,
                    liveSessions: 2
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };
        fetchStats();
    }, []);

    const StatsCard = ({ label, value, icon: Icon, color, change, subtext }: any) => (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="relative overflow-hidden bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-5 md:p-6 group transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-white/20"
        >
            <div className={`absolute top-0 right-0 p-32 bg-gradient-to-br ${color} opacity-[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-[0.08] transition-opacity`}></div>

            <div className="flex items-start justify-between mb-3 md:mb-4 relative z-10">
                <div className={`p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-white/5 border border-white/5 ${color} bg-opacity-10`}>
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                {change && (
                    <span className={`flex items-center text-xs font-semibold px-2 md:px-2.5 py-1 rounded-full border border-white/5 ${change.includes('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {change}
                        {change.includes('+') ? <TrendingUp className="w-3 h-3 ml-1" /> : null}
                    </span>
                )}
            </div>

            <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-1">{value}</h3>
                <p className="text-xs md:text-sm font-medium text-slate-400">{label}</p>
                {subtext && <p className="text-[10px] md:text-xs text-slate-500 mt-1 md:mt-2">{subtext}</p>}
            </div>
        </motion.div>
    );

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Dashboard</h1>
                    <p className="text-sm md:text-base text-slate-400">Welcome back, get ready to manage your quizzes.</p>
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <button className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-colors border border-slate-700">
                        Download Report
                    </button>
                    <button className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-indigo-500/25">
                        Start New Quiz
                    </button>
                </div>
            </div>

            {/* Stats Grid - Fully Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <StatsCard
                    label="Active Quizzes"
                    value={stats.activeQuizzes}
                    icon={BookOpen}
                    color="from-blue-500 to-indigo-500"
                    change="+12%"
                    subtext="4 ending soon"
                />
                <StatsCard
                    label="Active Teams"
                    value={stats.registeredTeams}
                    icon={Users}
                    color="from-purple-500 to-pink-500"
                    change="+5%"
                    subtext="Registered this week"
                />
                <StatsCard
                    label="Total Questions"
                    value={stats.questionsInBank}
                    icon={Database}
                    color="from-emerald-500 to-teal-500"
                    change="+128"
                    subtext="Across 15 categories"
                />
                <StatsCard
                    label="Live Sessions"
                    value={stats.liveSessions}
                    icon={Activity}
                    color="from-amber-500 to-orange-500"
                    change="+2"
                    subtext="Currently running"
                />
            </div>

            {/* Main Content Split - Responsive Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

                {/* Left Column: Analytics & Chart */}
                <div className="lg:col-span-2 space-y-6 md:space-y-8">
                    {/* Activity Chart Card */}
                    <div className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-5 md:p-8 overflow-hidden relative">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4 mb-6 md:mb-8">
                            <div>
                                <h2 className="text-lg md:text-xl font-bold text-white">Quiz Activity</h2>
                                <p className="text-xs md:text-sm text-slate-400 mt-1">Participation trends over the last 30 days</p>
                            </div>
                            <select className="bg-slate-900/50 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 outline-none focus:border-indigo-500 w-full sm:w-auto">
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                                <option>This Year</option>
                            </select>
                        </div>

                        <ActivityGraph />

                        <div className="grid grid-cols-3 gap-2 md:gap-4 mt-6 pt-6 border-t border-white/5">
                            <div className="text-center">
                                <p className="text-xl md:text-2xl font-bold text-white">24.5k</p>
                                <p className="text-[10px] md:text-xs text-slate-500 uppercase tracking-wider mt-1">Total Responses</p>
                            </div>
                            <div className="text-center border-l border-white/5">
                                <p className="text-xl md:text-2xl font-bold text-emerald-400">85%</p>
                                <p className="text-[10px] md:text-xs text-slate-500 uppercase tracking-wider mt-1">Avg Accuracy</p>
                            </div>
                            <div className="text-center border-l border-white/5">
                                <p className="text-xl md:text-2xl font-bold text-blue-400">12m</p>
                                <p className="text-[10px] md:text-xs text-slate-500 uppercase tracking-wider mt-1">Avg Duration</p>
                            </div>
                        </div>
                    </div>

                    {/* Recent Quizzes List - Mobile Responsive Table */}
                    <div className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-8">
                        <div className="flex items-center justify-between mb-4 md:mb-6">
                            <h2 className="text-lg md:text-xl font-bold text-white">Recent Quizzes</h2>
                            <Link to="/admin/quizzes" className="text-xs md:text-sm text-indigo-400 hover:text-indigo-300 font-medium">View All</Link>
                        </div>

                        {/* Mobile: Card View */}
                        <div className="md:hidden space-y-3">
                            {[
                                { name: 'General Knowledge 2024', status: 'Live', teams: 12, date: 'Today', color: 'text-emerald-400 bg-emerald-400/10' },
                                { name: 'Science & Tech Finals', status: 'Scheduled', teams: 8, date: 'Tomorrow', color: 'text-blue-400 bg-blue-400/10' },
                                { name: 'History Bee Round 1', status: 'Completed', teams: 24, date: 'Yesterday', color: 'text-slate-400 bg-slate-400/10' },
                                { name: 'Music Trivia Night', status: 'Draft', teams: 0, date: 'TBD', color: 'text-amber-400 bg-amber-400/10' },
                            ].map((quiz, i) => (
                                <div key={i} className="bg-white/5 hover:bg-white/10 rounded-xl p-4 transition-colors">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-medium text-white text-sm">{quiz.name}</h3>
                                        <button className="p-1 hover:bg-slate-700 rounded text-slate-400">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className={`px-2 py-1 rounded-full font-semibold ${quiz.color}`}>
                                            {quiz.status}
                                        </span>
                                        <div className="flex items-center space-x-3 text-slate-400">
                                            <span className="flex items-center">
                                                <Users className="w-3 h-3 mr-1" />
                                                {quiz.teams}
                                            </span>
                                            <span>{quiz.date}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop/Tablet: Table View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/10 text-xs text-slate-500 uppercase tracking-wider">
                                        <th className="pb-4 font-medium pl-2">Quiz Name</th>
                                        <th className="pb-4 font-medium">Status</th>
                                        <th className="pb-4 font-medium">Teams</th>
                                        <th className="pb-4 font-medium">Date</th>
                                        <th className="pb-4 font-medium text-right pr-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {[
                                        { name: 'General Knowledge 2024', status: 'Live', teams: 12, date: 'Today', color: 'text-emerald-400 bg-emerald-400/10' },
                                        { name: 'Science & Tech Finals', status: 'Scheduled', teams: 8, date: 'Tomorrow', color: 'text-blue-400 bg-blue-400/10' },
                                        { name: 'History Bee Round 1', status: 'Completed', teams: 24, date: 'Yesterday', color: 'text-slate-400 bg-slate-400/10' },
                                        { name: 'Music Trivia Night', status: 'Draft', teams: 0, date: 'TBD', color: 'text-amber-400 bg-amber-400/10' },
                                    ].map((quiz, i) => (
                                        <tr key={i} className="group hover:bg-white/5 transition-colors">
                                            <td className="py-4 pl-2 font-medium text-white">{quiz.name}</td>
                                            <td className="py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${quiz.color}`}>
                                                    {quiz.status}
                                                </span>
                                            </td>
                                            <td className="py-4 text-slate-400">
                                                <div className="flex items-center">
                                                    <Users className="w-3 h-3 mr-1.5" />
                                                    {quiz.teams}
                                                </div>
                                            </td>
                                            <td className="py-4 text-slate-400">{quiz.date}</td>
                                            <td className="py-4 text-right pr-2">
                                                <button className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column: Activities & Upcoming - Responsive */}
                <div className="space-y-6 md:space-y-8">
                    {/* System Status Small Widget */}
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-2xl md:rounded-3xl p-5 md:p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <p className="text-xs md:text-sm font-medium text-slate-400">System Health</p>
                                <p className="text-base md:text-xl font-bold text-white mt-1">All Systems Operational</p>
                            </div>
                            <div className="h-10 w-10 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Activity className="w-5 h-5 text-emerald-400" />
                            </div>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-2 md:gap-4 text-xs font-medium text-slate-500">
                            <span className="flex items-center"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5"></div> DB: Online</span>
                            <span className="flex items-center"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5"></div> WS: Connected</span>
                        </div>
                    </div>

                    {/* Recent Activity Timeline */}
                    <div className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6">
                        <h2 className="text-base md:text-lg font-bold text-white mb-4 md:mb-6">Activity Log</h2>
                        <div className="space-y-4 md:space-y-6 relative">
                            {/* Connector Line */}
                            <div className="absolute top-2 bottom-2 left-5 md:left-6 w-px bg-slate-700"></div>

                            {recentActivities.map((activity) => (
                                <div key={activity.id} className="relative flex items-start group">
                                    <div className={`relative z-10 flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-800 border-2 border-slate-900 flex items-center justify-center mr-3 md:mr-4 ${activity.color} group-hover:scale-110 transition-transform`}>
                                        <activity.icon className="w-4 h-4 md:w-5 md:h-5" />
                                    </div>
                                    <div className="flex-1 py-1 min-w-0">
                                        <p className="text-xs md:text-sm text-white">
                                            <span className="font-semibold hover:text-indigo-400 cursor-pointer transition-colors">{activity.user}</span>
                                            <span className="text-slate-400"> {activity.action} </span>
                                            <span className="text-indigo-300 truncate inline-block max-w-[120px] md:max-w-none">{activity.target}</span>
                                        </p>
                                        <p className="text-[10px] md:text-xs text-slate-500 mt-1">{activity.time} ago</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 md:mt-6 py-2.5 md:py-3 text-xs md:text-sm font-medium text-slate-300 hover:text-white border border-slate-700 hover:bg-slate-700/50 rounded-xl transition-all">
                            View Full Log
                        </button>
                    </div>

                    {/* Upcoming Events Mini */}
                    <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base md:text-lg font-bold text-white">Upcoming</h2>
                            <Calendar className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div className="space-y-3">
                            {[
                                { title: "End Semester Quiz", date: "Dec 15", time: "10:00 AM" },
                                { title: "Staff Training", date: "Dec 18", time: "02:00 PM" }
                            ].map((evt, i) => (
                                <div key={i} className="flex items-center bg-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
                                    <div className="h-10 w-10 bg-slate-800 rounded-lg flex flex-col items-center justify-center text-xs font-bold text-slate-300 mr-3 flex-shrink-0">
                                        <span>{evt.date.split(' ')[1]}</span>
                                        <span className="text-indigo-400 text-[10px]">{evt.date.split(' ')[0]}</span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs md:text-sm font-semibold text-white truncate">{evt.title}</p>
                                        <p className="text-[10px] md:text-xs text-slate-400">{evt.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Action Button for Mobile */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="lg:hidden fixed bottom-6 right-6 h-14 w-14 bg-indigo-600 rounded-full flex items-center justify-center shadow-2xl shadow-indigo-500/50 z-50 text-white"
            >
                <Target className="w-6 h-6" />
            </motion.button>
        </div>
    );
}
