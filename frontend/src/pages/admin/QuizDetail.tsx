import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchAPI } from '../../lib/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Badge } from '../../components/ui/FormControls';
import { Modal } from '../../components/ui/Modal';
import { QuestionPicker } from '../../components/admin/QuestionPicker';
import { Settings, Plus, Trash2, ArrowLeft, ChevronDown, ChevronRight, Play } from 'lucide-react';

export default function QuizDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [expandedRound, setExpandedRound] = useState<number | null>(null);

    // Modals
    const [isRoundModalOpen, setIsRoundModalOpen] = useState(false);
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [activeRoundForPicker, setActiveRoundForPicker] = useState<number | null>(null);

    // Round Form
    const [roundName, setRoundName] = useState('');

    useEffect(() => {
        loadQuiz();
    }, [id]);

    const loadQuiz = async () => {
        try {
            const data = await fetchAPI(`/quizzes/${id}/`);
            // We need full details including rounds and questions.
            // Assuming the serializer is nested depth=1 or similar.
            // If not, we might need separate calls or a specific retrieve endpoint configuration.
            setQuiz(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRound = async () => {
        try {
            await fetchAPI('/rounds/', {
                method: 'POST',
                body: JSON.stringify({
                    quiz: id,
                    name: roundName,
                    order: (quiz.rounds?.length || 0) + 1,
                    type: 'MCQ' // Defaulting to MCQ as NORMAL is not in choices
                })
            });
            setIsRoundModalOpen(false);
            setRoundName('');
            loadQuiz();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteRound = async (roundId: number) => {
        if (!confirm('Delete Round?')) return;
        try {
            await fetchAPI(`/rounds/${roundId}/`, { method: 'DELETE' });
            loadQuiz();
        } catch (e) {
            console.error(e);
        }
    };

    const handleAddQuestion = async (questionId: number) => {
        if (!activeRoundForPicker) return;
        try {
            await fetchAPI('/quiz-questions/', {
                method: 'POST',
                body: JSON.stringify({
                    round: activeRoundForPicker,
                    question: questionId,
                    order: 0, // Should calculate max order + 1
                    points: 10
                })
            });
            setIsPickerOpen(false);
            loadQuiz();
        } catch (e) {
            console.error(e);
            alert('Failed to add question (maybe duplicate?)');
        }
    };

    const handleRemoveQuestionLink = async (linkId: number) => {
        try {
            await fetchAPI(`/quiz-questions/${linkId}/`, { method: 'DELETE' });
            loadQuiz();
        } catch (e) { console.error(e); }
    };

    if (loading) return <div className="p-10 text-center">Loading Quiz...</div>;
    if (!quiz) return <div className="p-10 text-center">Quiz not found</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/admin/quizzes')}>
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-white">{quiz.title}</h1>
                        <p className="text-gray-400">{quiz.description}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" className="gap-2">
                        <Settings size={18} /> Settings
                    </Button>
                    <Button className="gap-2 bg-green-600 hover:bg-green-700" onClick={() => navigate(`/admin/quizzes/${id}/play`)}>
                        <Play size={18} /> Launch
                    </Button>
                </div>
            </div>

            {/* Rounds List */}
            <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                    <h2 className="text-xl font-semibold text-gray-300">Rounds timeline</h2>
                    <Button size="sm" onClick={() => setIsRoundModalOpen(true)} className="gap-2">
                        <Plus size={16} /> New Round
                    </Button>
                </div>

                {quiz.rounds?.map((round: any) => (
                    <Card key={round.id} className="overflow-hidden glass border-0 bg-white/5">
                        <div
                            className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
                            onClick={() => setExpandedRound(expandedRound === round.id ? null : round.id)}
                        >
                            <div className="flex items-center gap-4">
                                {expandedRound === round.id ? <ChevronDown size={20} className="text-cyan-400" /> : <ChevronRight size={20} className="text-gray-500" />}
                                <h3 className="font-bold text-lg text-white group-hover:text-cyan-400 transition-colors">{round.name}</h3>
                                <Badge variant="outline">{round.questions?.length || 0} Questions</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button size="icon" variant="ghost" className="text-red-400 hover:bg-red-400/10" onClick={(e) => { e.stopPropagation(); handleDeleteRound(round.id); }}>
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </div>

                        <AnimatePresence>
                            {expandedRound === round.id && (
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: "auto" }}
                                    exit={{ height: 0 }}
                                    className="overflow-hidden bg-black/40"
                                >
                                    <div className="p-4 space-y-2 border-t border-white/5">
                                        {round.quiz_questions?.map((qq: any, idx: number) => (
                                            <div key={qq.id} className="flex items-center gap-4 p-3 rounded bg-white/5 border border-white/5">
                                                <span className="font-mono text-gray-500 w-6">{idx + 1}.</span>
                                                <div className="flex-1">
                                                    <p className="text-white text-sm line-clamp-1">{qq.question?.text || 'Question Text Missing'}</p>
                                                    <div className="flex gap-2 text-xs text-gray-400 mt-1">
                                                        <span>{qq.points} pts</span>
                                                        <span>•</span>
                                                        <span>{qq.question?.type}</span>
                                                    </div>
                                                </div>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400" onClick={() => handleRemoveQuestionLink(qq.id)}>
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        ))}

                                        <Button
                                            variant="ghost"
                                            className="w-full border border-dashed border-white/20 hover:border-blue-500 text-gray-400 hover:text-blue-400 mt-4"
                                            onClick={() => { setActiveRoundForPicker(round.id); setIsPickerOpen(true); }}
                                        >
                                            <Plus size={16} className="mr-2" /> Add Question to Round
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Card>
                ))}

                {(!quiz.rounds || quiz.rounds.length === 0) && (
                    <div className="text-center py-10 text-gray-500 border border-dashed border-white/10 rounded-xl">
                        No rounds yet. Create one to get started.
                    </div>
                )}
            </div>

            {/* Modals */}
            <Modal isOpen={isRoundModalOpen} onClose={() => setIsRoundModalOpen(false)} title="Create New Round">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Round Title</label>
                        <Input value={roundName} onChange={e => setRoundName(e.target.value)} placeholder="e.g. General Knowledge" />
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="ghost" onClick={() => setIsRoundModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateRound}>Create</Button>
                    </div>
                </div>
            </Modal>

            <QuestionPicker
                isOpen={isPickerOpen}
                onClose={() => setIsPickerOpen(false)}
                onSelect={handleAddQuestion}
            />

        </motion.div>
    );
}
