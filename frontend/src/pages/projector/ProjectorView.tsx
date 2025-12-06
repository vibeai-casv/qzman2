import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';

export default function ProjectorView() {
    const { id } = useParams(); // Start utilizing ID from URL
    const quizId = id || '1'; // Default to 1 if not provided (demo mode)

    const [gameState, setGameState] = useState<any>({
        phase: 'IDLE', // IDLE, QUESTION, ANSWER, LEADERBOARD
        currentQuestion: {
            text: "Waiting for Quiz Master...",
            category: "-",
            difficulty: "-"
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
                setGameState(prev => ({
                    ...prev,
                    phase: msg.data.phase,
                    // If question data is sent
                    currentQuestion: msg.data.question || prev.currentQuestion
                }));
            }
        };

        wsRef.current = ws;

        return () => ws.close();
    }, [quizId]);

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden relative font-sans">
            {/* Dynamic Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-black to-black animate-pulse" />

            {/* Header */}
            <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-center z-10">
                <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                    QZMAN <span className="text-white">LIVE</span>
                </h1>
                <div className="px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 font-mono text-xl">
                    CODE: <span className="font-bold text-yellow-400">ABCD</span>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col items-center justify-center h-screen px-20 text-center relative z-0">
                <motion.div
                    key={gameState.phase}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="w-full max-w-6xl"
                >
                    {gameState.phase === 'IDLE' && (
                        <div className="space-y-8">
                            <motion.h2
                                animate={{ scale: [1, 1.02, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="text-8xl font-black text-white drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]"
                            >
                                ARE YOU READY?
                            </motion.h2>
                            <p className="text-3xl text-gray-400">Join at <span className="text-white font-bold">192.168.1.X:5173/play</span></p>
                        </div>
                    )}

                    {gameState.phase === 'QUESTION' && (
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-3xl shadow-2xl">
                            <div className="flex justify-between text-blue-400 font-bold tracking-widest uppercase mb-8">
                                <span>{gameState.currentQuestion.category}</span>
                                <span>{gameState.currentQuestion.difficulty}</span>
                            </div>
                            <h3 className="text-6xl font-bold leading-tight">
                                {gameState.currentQuestion.text}
                            </h3>
                            {/* Timer bar */}
                            <div className="w-full h-2 bg-white/10 rounded-full mt-12 overflow-hidden">
                                <motion.div
                                    className="h-full bg-blue-500"
                                    initial={{ width: "100%" }}
                                    animate={{ width: "0%" }}
                                    transition={{ duration: 15, ease: "linear" }}
                                />
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}
