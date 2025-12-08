import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/FormControls';
import { fetchAPI } from '../../lib/api';
import { SkipForward, Eye, Award, Users } from 'lucide-react';

export default function GameControl() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState<any>(null);
    const [status, setStatus] = useState('IDLE'); // IDLE, ACTIVE, DISCONNECTED
    const [currentPhase, setCurrentPhase] = useState('LOBBY'); // LOBBY, QUESTION, ANSWER, LEADERBOARD
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        loadQuiz();
        connectWebSocket();
        return () => wsRef.current?.close();
    }, [id]);

    const loadQuiz = async () => {
        try {
            const data = await fetchAPI(`/quizzes/${id}/`);
            setQuiz(data);
        } catch (e) {
            console.error(e);
        }
    };

    const connectWebSocket = () => {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.hostname}:8000/ws/quiz/${id}/`;

        console.log('Connecting to', wsUrl);
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log('WS Connected');
            setStatus('ACTIVE');
        };

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            handleMessage(msg);
        };

        ws.onclose = () => {
            console.log('WS Disconnected');
            setStatus('DISCONNECTED');
            // Reconnect logic could go here
        };

        wsRef.current = ws;
    };

    const handleMessage = (msg: any) => {
        if (msg.type === 'PHASE_CHANGE') {
            setCurrentPhase(msg.data.phase);
            if (msg.data.questionIndex !== undefined) {
                setCurrentQuestionIndex(msg.data.questionIndex);
            }
        }
    };

    const broadcast = (type: string, payload: any = {}) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
                type: type,
                data: payload
            }));
        }
    };

    const allQuestions = quiz?.rounds?.flatMap((r: any) => r.quiz_questions) || [];
    const currentQ = allQuestions[currentQuestionIndex];

    const nextQuestion = () => {
        const nextIdx = currentQuestionIndex + 1;
        if (nextIdx < allQuestions.length) {
            const q = allQuestions[nextIdx];
            broadcast('PHASE_CHANGE', {
                phase: 'QUESTION',
                questionIndex: nextIdx,
                question: {
                    text: q.question.text, // Access nested question object
                    category: q.question.category,
                    difficulty: q.question.difficulty,
                    type: q.question.type,
                    options: q.question.options
                }
            });
        } else {
            alert('End of Quiz');
            broadcast('PHASE_CHANGE', { phase: 'ENDED' });
        }
    };

    const revealAnswer = () => {
        broadcast('PHASE_CHANGE', { phase: 'ANSWER' });
    };

    const showLeaderboard = () => {
        broadcast('PHASE_CHANGE', { phase: 'LEADERBOARD' });
    };

    if (!quiz) return <div className="p-10 text-center text-white">Loading Game Control...</div>;

    return (
        <div className="h-screen flex flex-col bg-background text-white overflow-hidden">
            {/* Top Bar */}
            <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/40">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/quizzes/${id}`)}>Exit</Button>
                    <h1 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                        {quiz.title} <span className="text-gray-500 text-sm font-normal">| LIVE CONTROL</span>
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <Badge variant={status === 'ACTIVE' ? 'success' : 'outline'}>{status}</Badge>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Users size={16} /> 0 Teams
                    </div>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar: Timeline */}
                <div className="w-64 border-r border-white/10 bg-black/20 overflow-y-auto p-4 space-y-2">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Timeline</h3>
                    {allQuestions.map((q: any, idx: number) => (
                        <div
                            key={idx}
                            onClick={() => setCurrentQuestionIndex(idx)}
                            className={`p-3 rounded text-sm cursor-pointer border transition-all ${idx === currentQuestionIndex ? 'bg-blue-500/20 border-blue-500' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                        >
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Q{idx + 1}</span>
                                <span>{q.points}pts</span>
                            </div>
                            <p className="line-clamp-2">{q.question?.text}</p>
                        </div>
                    ))}
                </div>

                {/* Main Control Area */}
                <div className="flex-1 p-8 flex flex-col gap-6 overflow-y-auto">
                    {/* Current Action Card */}
                    <Card className="bg-gradient-to-br from-blue-900/20 to-black border-blue-500/30">
                        <div className="p-8 text-center space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-mono border border-blue-500/20">
                                {currentPhase}
                            </div>

                            <h2 className="text-4xl font-bold leading-tight min-h-[100px] flex items-center justify-center">
                                {currentQ ? currentQ.question.text : "Quiz Ready to Start"}
                            </h2>

                            {currentPhase === 'ANSWER' && currentQ && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl text-green-400 font-bold">
                                    ANSWER: {currentQ.question.answer}
                                </motion.div>
                            )}

                            <div className="flex justify-center gap-4 pt-4">
                                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 min-w-[160px]" onClick={nextQuestion}>
                                    <SkipForward className="mr-2" /> Next Question
                                </Button>
                                <Button size="lg" variant="secondary" onClick={revealAnswer} disabled={currentPhase === 'ANSWER'}>
                                    <Eye className="mr-2" /> Reveal Answer
                                </Button>
                                <Button size="lg" variant="secondary" onClick={showLeaderboard}>
                                    <Award className="mr-2" /> Leaderboard
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Stats / Feed */}
                    <div className="grid grid-cols-2 gap-6">
                        <Card className="h-64">
                            <div className="p-4 border-b border-white/10 font-semibold">Live Answers</div>
                            <div className="p-4 flex items-center justify-center h-full text-gray-500">
                                No answers yet
                            </div>
                        </Card>
                        <Card className="h-64">
                            <div className="p-4 border-b border-white/10 font-semibold">Buzzers</div>
                            <div className="p-4 flex items-center justify-center h-full text-gray-500">
                                No active buzzers
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
