import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Trophy, Clock, Bell } from 'lucide-react';

interface Team {
    name: string;
    score: number;
    correct: number;
    total: number;
    buzzes: number;
    avgTime: string;
}

interface GameState {
    phase: string;
    currentQuestion: {
        text: string;
        category: string;
        difficulty: string;
        number: number;
        options?: string[];
    };
    teams: Team[];
    timer: number;
    buzzer: {
        active: boolean;
        team: string;
        time: string;
    } | null;
    round: {
        name: string;
        rules: string;
        next: string;
    };
}

export default function ProjectorView() {
    const { id } = useParams();
    const quizId = id || '1';

    const [gameState, setGameState] = useState<GameState>({
        phase: 'IDLE',
        currentQuestion: {
            text: "Waiting for Quiz Master...",
            category: "General",
            difficulty: "Medium",
            number: 1,
            options: ['Option A', 'Option B', 'Option C', 'Option D']
        },
        teams: [
            { name: 'Alpha', score: 250, correct: 12, total: 15, buzzes: 8, avgTime: '4.2s' },
            { name: 'Beta', score: 220, correct: 10, total: 15, buzzes: 6, avgTime: '4.8s' },
            { name: 'Gamma', score: 210, correct: 9, total: 15, buzzes: 7, avgTime: '5.1s' },
            { name: 'Delta', score: 190, correct: 8, total: 15, buzzes: 5, avgTime: '5.5s' },
        ],
        timer: 150,
        buzzer: null,
        round: {
            name: 'Finals - Bounce & Pounce',
            rules: '+10 Correct, -5 Wrong, Bounce Enabled',
            next: 'Rapid Fire'
        }
    });

    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.hostname}:8000/ws/quiz/${quizId}/`;

        const ws = new WebSocket(wsUrl);

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            if (msg.type === 'PHASE_CHANGE') {
                setGameState((prev) => ({
                    ...prev,
                    phase: msg.data.phase,
                    currentQuestion: msg.data.question || prev.currentQuestion
                }));
            } else if (msg.type === 'SCORE_UPDATE') {
                setGameState((prev) => ({
                    ...prev,
                    teams: msg.data.teams || prev.teams
                }));
            } else if (msg.type === 'BUZZER_UPDATE') {
                setGameState((prev) => ({
                    ...prev,
                    buzzer: msg.data
                }));
            } else if (msg.type === 'TIMER_UPDATE') {
                setGameState((prev) => ({
                    ...prev,
                    timer: msg.data.remaining
                }));
            }
        };

        wsRef.current = ws;
        return () => ws.close();
    }, [quizId]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const sortedTeams = [...gameState.teams].sort((a, b) => b.score - a.score);
    const timerPercentage = (gameState.timer / 150) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden font-sans">
            {/* Header */}
            <header className="px-8 py-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-lg">
                        <span className="text-3xl font-bold">QZ</span>
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-qz-primary via-qz-accent to-qz-success bg-clip-text text-transparent">
                            QUIZ COMPETITION 2024
                        </h1>
                        <p className="text-xl opacity-80">Finals • Round 3 of 5</p>
                    </div>
                </div>
                <div className="px-6 py-3 glass-effect rounded-full font-mono text-xl">
                    CODE: <span className="font-bold text-qz-warning">ABCD</span>
                </div>
            </header>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-8 pb-8">
                {/* Left: Live Scoreboard */}
                <div className="lg:col-span-2">
                    <div className="scoreboard-card rounded-3xl shadow-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold flex items-center gap-3">
                                <Trophy className="text-qz-warning" />
                                LIVE SCOREBOARD
                            </h2>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-qz-success">Question #{gameState.currentQuestion.number}</div>
                                <div className="text-lg opacity-80">{gameState.currentQuestion.category} • 250 points</div>
                            </div>
                        </div>

                        {/* Podium */}
                        <div className="flex items-end justify-center mb-8 h-48">
                            {/* 2nd Place */}
                            {sortedTeams[1] && (
                                <motion.div
                                    className="flex flex-col items-center mx-4"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="podium-2 w-32 h-32 rounded-t-2xl flex items-center justify-center relative shadow-lg">
                                        <div className="text-4xl font-bold">2</div>
                                        <div className="absolute -top-12 w-16 h-16 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center shadow-lg ring-2 ring-gray-300">
                                            <span className="text-xl font-bold text-white">{sortedTeams[1].name[0]}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-center">
                                        <div className="font-bold text-xl">{sortedTeams[1].name}</div>
                                        <div className="text-2xl font-bold text-gray-400">{sortedTeams[1].score}</div>
                                    </div>
                                </motion.div>
                            )}

                            {/* 1st Place */}
                            {sortedTeams[0] && (
                                <motion.div
                                    className="flex flex-col items-center mx-4"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className="podium-1 w-40 h-40 rounded-t-2xl flex items-center justify-center relative shadow-xl animate-float">
                                        <div className="text-5xl font-bold">1</div>
                                        <div className="absolute -top-16 w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-xl ring-4 ring-yellow-300">
                                            <span className="text-2xl font-bold">{sortedTeams[0].name[0]}</span>
                                        </div>
                                    </div>
                                    <div className="mt-6 text-center">
                                        <div className="font-bold text-2xl">{sortedTeams[0].name}</div>
                                        <div className="text-3xl font-bold text-yellow-400">{sortedTeams[0].score}</div>
                                        <div className="text-sm opacity-80">▲ Leader</div>
                                    </div>
                                </motion.div>
                            )}

                            {/* 3rd Place */}
                            {sortedTeams[2] && (
                                <motion.div
                                    className="flex flex-col items-center mx-4"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <div className="podium-3 w-28 h-28 rounded-t-2xl flex items-center justify-center relative shadow-lg">
                                        <div className="text-4xl font-bold">3</div>
                                        <div className="absolute -top-10 w-14 h-14 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center shadow-lg ring-2 ring-amber-600">
                                            <span className="text-lg font-bold text-white">{sortedTeams[2].name[0]}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-center">
                                        <div className="font-bold text-xl">{sortedTeams[2].name}</div>
                                        <div className="text-2xl font-bold text-amber-600">{sortedTeams[2].score}</div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Team Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-lg border-b border-white/10">
                                        <th className="py-3 px-4">Rank</th>
                                        <th className="py-3 px-4">Team</th>
                                        <th className="py-3 px-4">Score</th>
                                        <th className="py-3 px-4">Correct</th>
                                        <th className="py-3 px-4">Buzzes</th>
                                        <th className="py-3 px-4">Avg Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedTeams.map((team, index) => (
                                        <motion.tr
                                            key={team.name}
                                            className="hover:bg-white/5 transition-colors"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <td className="py-4 px-4 text-xl font-bold">{index + 1}</td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow ${index === 0 ? 'bg-gradient-to-br from-yellow-500 to-orange-500' :
                                                        index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-600' :
                                                            index === 2 ? 'bg-gradient-to-br from-amber-700 to-amber-900' :
                                                                'bg-gradient-to-br from-blue-500 to-purple-600'
                                                        }`}>
                                                        <span className="text-white font-bold">{team.name[0]}</span>
                                                    </div>
                                                    <span className="font-bold">{team.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-2xl font-bold text-qz-success">{team.score}</td>
                                            <td className="py-4 px-4">{team.correct}/{team.total}</td>
                                            <td className="py-4 px-4">{team.buzzes}</td>
                                            <td className="py-4 px-4">{team.avgTime}</td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right: Question & Buzzer Status */}
                <div className="space-y-8">
                    {/* Current Question */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={gameState.phase}
                            className="scoreboard-card rounded-3xl shadow-2xl p-6"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                        >
                            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-qz-success animate-pulse" />
                                CURRENT QUESTION
                            </h3>
                            <div className="mb-4 flex gap-2">
                                <span className="px-3 py-1 rounded-lg bg-qz-primary/20 text-qz-primary font-bold text-sm">
                                    {gameState.currentQuestion.category}
                                </span>
                                <span className="px-3 py-1 rounded-lg bg-white/10 font-bold text-sm">
                                    #{gameState.currentQuestion.number}
                                </span>
                            </div>

                            {gameState.phase === 'QUESTION' ? (
                                <>
                                    <p className="text-2xl font-medium mb-6 leading-relaxed">
                                        {gameState.currentQuestion.text}
                                    </p>
                                    {gameState.currentQuestion.options && (
                                        <div className="grid grid-cols-2 gap-4">
                                            {gameState.currentQuestion.options.map((opt, i) => (
                                                <div key={i} className="p-4 rounded-xl bg-white/5 text-center hover:bg-white/10 transition-colors">
                                                    <div className="text-lg font-bold text-qz-primary">{String.fromCharCode(65 + i)}</div>
                                                    <div className="text-xl">{opt}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <motion.h2
                                        animate={{ scale: [1, 1.02, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="text-4xl font-black drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]"
                                    >
                                        {gameState.phase === 'IDLE' ? 'GET READY!' : 'TIME\'S UP!'}
                                    </motion.h2>
                                </div>
                            )}

                            {/* Timer */}
                            <div className="mt-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-lg flex items-center gap-2">
                                        <Clock size={20} />
                                        Time Remaining
                                    </span>
                                    <span className={`text-2xl font-bold ${gameState.timer < 30 ? 'text-qz-danger' : 'text-qz-warning'}`}>
                                        {formatTime(gameState.timer)}
                                    </span>
                                </div>
                                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        className={`h-full ${gameState.timer < 30 ? 'bg-qz-danger' : 'bg-qz-warning'}`}
                                        style={{ width: `${timerPercentage}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Buzzer Status */}
                    <div className="scoreboard-card rounded-3xl shadow-2xl p-6">
                        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <Bell className="text-qz-accent" />
                            BUZZER STATUS
                        </h3>

                        <AnimatePresence mode="wait">
                            {gameState.buzzer?.active ? (
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    className="text-center p-6 rounded-2xl bg-gradient-to-r from-qz-accent/20 to-qz-primary/20 border-2 border-qz-accent animate-buzzer-glow"
                                >
                                    <div className="text-5xl mb-4">🔔</div>
                                    <div className="text-3xl font-bold">{gameState.buzzer.team.toUpperCase()}</div>
                                    <div className="text-xl mt-2">BUZZED IN FIRST!</div>
                                    <div className="text-lg mt-4">Response Time: <span className="font-bold">{gameState.buzzer.time}</span></div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center p-6"
                                >
                                    <div className="text-5xl mb-4 opacity-50">⏸️</div>
                                    <div className="text-2xl font-bold opacity-70">Buzzer Closed</div>
                                    <div className="text-lg mt-2 opacity-70">Waiting for QM to open</div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Recent Buzzes */}
                        <div className="mt-6">
                            <h4 className="text-lg font-bold mb-3">Recent Buzzes</h4>
                            <div className="space-y-2">
                                {['Gamma', 'Alpha', 'Beta'].map((team, i) => (
                                    <div key={team} className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                                        <span>{team}</span>
                                        <span className={`px-2 py-1 rounded text-sm font-bold ${i === 0 ? 'bg-qz-success/20 text-qz-success' :
                                            i === 1 ? 'bg-qz-warning/20 text-qz-warning' :
                                                'bg-qz-danger/20 text-qz-danger'
                                            }`}>
                                            {(2.3 + i * 0.5).toFixed(1)}s
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="px-8 py-4 border-t border-white/10 flex flex-wrap justify-between items-center gap-4">
                <div className="text-xl">
                    <span className="font-bold">Current Round:</span> {gameState.round.name}
                </div>
                <div className="text-xl">
                    <span className="font-bold">Rules:</span> {gameState.round.rules}
                </div>
                <div className="text-xl">
                    <span className="font-bold">Next Round:</span> {gameState.round.next}
                </div>
            </footer>
        </div>
    );
}

