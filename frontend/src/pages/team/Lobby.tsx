import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Wifi, Send, CheckCircle, Clock, Eye, HelpCircle, Maximize } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface Question {
    text: string;
    category: string;
    difficulty: string;
    type: string;
    options?: string[];
}

interface TeamData {
    id: number;
    name: string;
    score: number;
}

interface Stats {
    correct: number;
    total: number;
    avgTime: string;
    rank: number;
    teamCount: number;
}

export default function Lobby() {
    const [status, setStatus] = useState('Waiting for Quiz Master...');
    const [team, setTeam] = useState<TeamData | null>(null);
    const [phase, setPhase] = useState('LOBBY');
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [answer, setAnswer] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [buzzerOpen, setBuzzerOpen] = useState(false);
    const [timer, setTimer] = useState(150);
    const [stats] = useState<Stats>({
        correct: 12,
        total: 15,
        avgTime: '4.2s',
        rank: 2,
        teamCount: 8
    });

    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem('team');
        if (stored) {
            setTeam(JSON.parse(stored));
        }
        connectWebSocket();
        return () => wsRef.current?.close();
    }, []);

    const connectWebSocket = () => {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.hostname}:8000/ws/quiz/1/`;

        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            setStatus('Connected and Ready');
        };

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            if (msg.type === 'PHASE_CHANGE') {
                setPhase(msg.data.phase);
                if (msg.data.phase === 'QUESTION') {
                    setCurrentQuestion(msg.data.question);
                    setSubmitted(false);
                    setAnswer('');
                    setSelectedOption(null);
                    setStatus('Question Active!');
                } else if (msg.data.phase === 'ANSWER') {
                    setStatus('Answer Revealed');
                } else if (msg.data.phase === 'ENDED') {
                    setStatus('Quiz Ended');
                } else {
                    setStatus('Waiting...');
                }
            } else if (msg.type === 'BUZZER_STATE') {
                setBuzzerOpen(msg.data.active);
                if (msg.data.active) {
                    // Vibrate if supported
                    if (navigator.vibrate) {
                        navigator.vibrate([100, 50, 100]);
                    }
                }
            } else if (msg.type === 'TIMER_UPDATE') {
                setTimer(msg.data.remaining);
            }
        };

        wsRef.current = ws;
    };

    const submitAnswer = (val: string) => {
        setAnswer(val);
        setSubmitted(true);
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
                type: 'SUBMIT_ANSWER',
                data: { answer: val, team_id: team?.id || 0, team_name: team?.name || 'Unknown' }
            }));
        }
    };

    const handleBuzz = () => {
        if (buzzerOpen) {
            // Vibrate on buzz
            if (navigator.vibrate) {
                navigator.vibrate([200, 100, 200]);
            }
            submitAnswer('BUZZ');
        }
    };

    const selectOption = (opt: string) => {
        setSelectedOption(opt);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col relative overflow-hidden font-sans">
            {/* Header */}
            <header className="glass-effect p-4 shadow-lg">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-xl">{team?.name?.[0] || 'T'}</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">{team?.name || 'Team'}</h1>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="px-2 py-0.5 rounded-full bg-qz-success/20 text-qz-success text-xs font-bold flex items-center gap-1">
                                    <Wifi size={12} />
                                    Connected
                                </span>
                                <span className="opacity-70">Round 3 • Question 15</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-white">{team?.score || 0}</div>
                        <div className="text-xs opacity-70">Points</div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4">
                <AnimatePresence mode="wait">
                    {phase === 'LOBBY' && (
                        <motion.div
                            key="lobby"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex flex-col items-center justify-center h-full py-12"
                        >
                            <div className="glass-effect rounded-2xl p-8 w-full max-w-sm text-center">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    className="inline-block p-4 rounded-full bg-qz-primary/10 mb-4 ring-1 ring-qz-primary/30"
                                >
                                    <Loader2 size={40} className="text-qz-primary" />
                                </motion.div>
                                <h2 className="text-2xl font-bold text-white mb-2">You're In!</h2>
                                <h3 className="text-xl text-qz-primary font-mono mb-6">{team?.name || 'Team'}</h3>
                                <div className="flex items-center justify-center gap-2 text-sm text-qz-success bg-qz-success/10 py-2 px-4 rounded-full w-fit mx-auto">
                                    <Wifi size={14} />
                                    <span>Connected</span>
                                </div>
                            </div>

                            {/* Performance Summary */}
                            <div className="glass-effect rounded-2xl p-6 w-full max-w-sm mt-6">
                                <h3 className="font-bold mb-4 text-white">Performance Summary</h3>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <div className="text-2xl font-bold text-qz-success">{stats.correct}</div>
                                        <div className="text-xs opacity-70">Correct</div>
                                        <div className="text-xs text-qz-success">{Math.round((stats.correct / stats.total) * 100)}%</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-qz-primary">{stats.avgTime}</div>
                                        <div className="text-xs opacity-70">Avg Time</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-qz-accent">{stats.rank}<span className="text-sm">/{stats.teamCount}</span></div>
                                        <div className="text-xs opacity-70">Rank</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {phase === 'QUESTION' && currentQuestion && (
                        <motion.div
                            key="question"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            {/* Question Display */}
                            <div className="glass-effect rounded-2xl p-6 animate-slide-in">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex gap-2 flex-wrap">
                                        <span className="px-3 py-1 rounded-lg bg-qz-primary/20 text-qz-primary font-bold text-sm">
                                            Current Question
                                        </span>
                                        <span className="px-3 py-1 rounded-lg bg-white/10 font-bold text-sm">
                                            {currentQuestion.category}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm">
                                        <Clock size={14} />
                                        <span className={timer < 30 ? 'text-qz-danger' : ''}>{formatTime(timer)}</span>
                                    </div>
                                </div>

                                <h2 className="text-xl font-bold text-white leading-snug mb-4">
                                    {currentQuestion.text}
                                </h2>

                                {/* Options */}
                                {currentQuestion.type === 'MCQ' && currentQuestion.options && !submitted && (
                                    <div className="space-y-3 mt-4">
                                        {currentQuestion.options.map((opt, i) => (
                                            <motion.div
                                                key={i}
                                                whileTap={{ scale: 0.98 }}
                                                className={`flex items-center p-4 rounded-xl cursor-pointer transition-all ${selectedOption === opt
                                                    ? 'bg-qz-primary text-white'
                                                    : 'bg-white/5 hover:bg-white/10'
                                                    }`}
                                                onClick={() => selectOption(opt)}
                                            >
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 font-bold ${selectedOption === opt
                                                    ? 'bg-white text-qz-primary'
                                                    : 'bg-white/10'
                                                    }`}>
                                                    {String.fromCharCode(65 + i)}
                                                </div>
                                                <div className="flex-1">{opt}</div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Submit Section */}
                            {!submitted ? (
                                <div className="space-y-4">
                                    {currentQuestion.type === 'MCQ' && selectedOption && (
                                        <Button
                                            size="lg"
                                            className="w-full h-16 text-xl gradient-primary rounded-xl shadow-lg"
                                            onClick={() => submitAnswer(selectedOption)}
                                        >
                                            <Send className="mr-2" /> Submit Answer
                                        </Button>
                                    )}

                                    {currentQuestion.type !== 'MCQ' && (
                                        <div className="space-y-4">
                                            <input
                                                className="w-full glass-effect rounded-xl p-4 text-white text-lg focus:ring-2 focus:ring-qz-primary outline-none"
                                                placeholder="Type answer here..."
                                                value={answer}
                                                onChange={e => setAnswer(e.target.value)}
                                            />
                                            <Button
                                                size="lg"
                                                className="w-full h-16 text-xl gradient-primary rounded-xl shadow-lg"
                                                onClick={() => submitAnswer(answer)}
                                            >
                                                <Send className="mr-2" /> Submit
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="glass-effect border-2 border-qz-success/50 bg-qz-success/10 p-8 rounded-2xl text-center"
                                >
                                    <CheckCircle size={48} className="text-qz-success mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold text-white">Answer Sent!</h3>
                                    <p className="text-qz-success mt-2">Waiting for results...</p>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {phase === 'ANSWER' && (
                        <motion.div
                            key="answer"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center h-full py-12 text-center"
                        >
                            <h2 className="text-4xl font-bold text-white mb-4">Time's Up!</h2>
                            <p className="text-gray-400">Look at the main screen for results.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Buzzer Section */}
            <footer className="p-4 glass-effect">
                <div className="flex flex-col items-center">
                    {/* Buzzer Status */}
                    <div className="mb-4 text-center">
                        <div className={`text-sm font-bold ${buzzerOpen ? 'text-qz-accent' : 'opacity-70'}`}>
                            {buzzerOpen ? 'BUZZER IS OPEN!' : 'Buzzer is CLOSED'}
                        </div>
                        <div className="text-xs opacity-70">
                            {buzzerOpen ? 'Tap to buzz in!' : 'Wait for QM to open buzzer'}
                        </div>
                    </div>

                    {/* Main Buzzer Button */}
                    <motion.button
                        whileTap={buzzerOpen ? { scale: 0.95 } : {}}
                        disabled={!buzzerOpen || submitted}
                        onClick={handleBuzz}
                        className={`relative w-32 h-32 rounded-full ${buzzerOpen && !submitted
                            ? 'cursor-pointer animate-buzzer-glow'
                            : 'cursor-not-allowed opacity-50'
                            }`}
                    >
                        <div className="absolute inset-0 rounded-full gradient-danger animate-pulse" />
                        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-xl">
                            <span className="text-white text-2xl font-bold">
                                {submitted ? 'SENT' : 'BUZZ'}
                            </span>
                        </div>
                    </motion.button>

                    {/* Quick Actions */}
                    <div className="flex gap-4 mt-6">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-sm hover:bg-white/10 transition-colors">
                            <Eye size={16} />
                            View
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-sm hover:bg-white/10 transition-colors">
                            <HelpCircle size={16} />
                            Help
                        </button>
                        <button
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-sm hover:bg-white/10 transition-colors"
                            onClick={toggleFullscreen}
                        >
                            <Maximize size={16} />
                            Full
                        </button>
                    </div>
                </div>
            </footer>

            {/* Status Bar */}
            <div className="fixed bottom-0 left-0 right-0 py-2 text-center text-xs text-gray-500 bg-black/50">
                Status: {status}
            </div>
        </div>
    );
}

