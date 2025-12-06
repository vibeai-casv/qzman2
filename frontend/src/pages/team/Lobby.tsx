import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Wifi, Zap, Send, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function Lobby() {
    const [status, setStatus] = useState('Waiting for Quiz Master...');
    const [team, setTeam] = useState<any>(null);
    const [phase, setPhase] = useState('LOBBY'); // LOBBY, QUESTION, ANSWER
    const [currentQuestion, setCurrentQuestion] = useState<any>(null);
    const [answer, setAnswer] = useState('');
    const [submitted, setSubmitted] = useState(false);

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
        // Hardcoded Quiz ID 1 for demo
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
                    setStatus('Question Active!');
                } else if (msg.data.phase === 'ANSWER') {
                    setStatus('Answer Revealed');
                } else if (msg.data.phase === 'ENDED') {
                    setStatus('Quiz Ended');
                } else {
                    setStatus('Waiting...');
                }
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


    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center space-y-8 relative overflow-hidden font-sans">
            {/* Background Effect */}
            <div className={`absolute inset-0 transition-colors duration-500 ${phase === 'QUESTION' ? 'bg-blue-900/20' : 'bg-black'}`} />

            {phase === 'LOBBY' && (
                <div className="z-10 bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 w-full max-w-sm">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="inline-block p-4 rounded-full bg-blue-500/10 mb-4 ring-1 ring-blue-500/30"
                    >
                        <Loader2 size={40} className="text-blue-400" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-white mb-2">You're In!</h2>
                    <h3 className="text-xl text-blue-400 font-mono mb-6">{team?.name || 'Team'}</h3>
                    <div className="flex items-center justify-center gap-2 text-sm text-green-400 bg-green-400/10 py-2 px-4 rounded-full w-fit mx-auto">
                        <Wifi size={14} />
                        <span>Connected</span>
                    </div>
                </div>
            )}

            {phase === 'QUESTION' && currentQuestion && (
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="z-10 w-full max-w-md space-y-6"
                >
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-2xl">
                        <div className="flex justify-between text-xs text-gray-400 uppercase tracking-widest mb-4">
                            <span>{currentQuestion.category}</span>
                            <span>{currentQuestion.difficulty}</span>
                        </div>
                        <h2 className="text-xl font-bold text-white leading-snug mb-2">
                            {currentQuestion.text}
                        </h2>
                    </div>

                    {!submitted ? (
                        <div className="space-y-4">
                            {currentQuestion.type === 'MCQ' && currentQuestion.options ? (
                                <div className="grid grid-cols-2 gap-3">
                                    {currentQuestion.options.map((opt: string, i: number) => (
                                        <Button
                                            key={i}
                                            size="lg"
                                            variant="secondary"
                                            className="h-24 text-lg font-bold bg-white/5 border border-white/10 hover:bg-blue-600 hover:border-blue-500 transition-all"
                                            onClick={() => submitAnswer(opt)}
                                        >
                                            {opt}
                                        </Button>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <input
                                        className="w-full bg-black/40 border border-white/20 rounded-xl p-4 text-white text-lg focus:border-blue-500 outline-none"
                                        placeholder="Type answer here..."
                                        value={answer}
                                        onChange={e => setAnswer(e.target.value)}
                                    />
                                    <Button
                                        size="lg"
                                        className="w-full h-16 text-xl bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.5)]"
                                        onClick={() => submitAnswer(answer)}
                                    >
                                        <Send className="mr-2" /> Submit
                                    </Button>

                                    <div className="relative my-8">
                                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-black px-2 text-gray-500">OR</span></div>
                                    </div>

                                    <Button
                                        size="lg"
                                        variant="danger"
                                        className="w-full h-24 text-2xl font-black tracking-widest bg-red-600 hover:bg-red-700 shadow-[0_0_30px_rgba(220,38,38,0.4)] rounded-2xl"
                                        onClick={() => submitAnswer('BUZZ')}
                                    >
                                        <Zap size={32} className="mr-2 animate-pulse" /> BUZZ!
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-green-500/20 border border-green-500/50 p-8 rounded-2xl text-center animate-in fade-in zoom-in duration-300">
                            <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-white">Answer Sent!</h3>
                            <p className="text-green-200 mt-2">Waiting for results...</p>
                        </div>
                    )}
                </motion.div>
            )}

            {phase === 'ANSWER' && (
                <div className="z-10 text-center">
                    <h2 className="text-4xl font-bold text-white mb-4">Time's Up!</h2>
                    <p className="text-gray-400">Look at the main screen for results.</p>
                </div>
            )}

            <div className="fixed bottom-4 text-xs text-gray-600">
                Status: {status}
            </div>
        </div>
    )
}
