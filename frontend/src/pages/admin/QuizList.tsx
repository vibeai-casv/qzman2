import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/FormControls';
import { Modal } from '../../components/ui/Modal';
import { Plus, Download, Upload, Play, Calendar } from 'lucide-react';
import { fetchAPI, uploadFile } from '../../lib/api';

interface Quiz {
    id: number;
    title: string;
    description: string;
    created_at: string;
    rounds: any[];
}

export default function QuizList() {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [newQuizTitle, setNewQuizTitle] = useState('');
    const [newQuizDesc, setNewQuizDesc] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadQuizzes();
    }, []);

    const loadQuizzes = () => {
        fetchAPI('/quizzes/').then(setQuizzes).catch(console.error);
    };

    const handleExport = (id: number) => {
        // Direct link download for simplicity as API returns file attachment
        window.location.href = `/api/quizzes/${id}/export_data/`;
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            try {
                await uploadFile('/quizzes/import_quiz/', e.target.files[0]);
                loadQuizzes();
                alert('Quiz Imported Successfully');
            } catch (err) {
                alert('Import Failed');
                console.error(err);
            }
        }
    };

    const handleCreateQuiz = async () => {
        if (!newQuizTitle.trim()) {
            alert('Please enter a quiz title');
            return;
        }

        try {
            await fetchAPI('/quizzes/', {
                method: 'POST',
                body: JSON.stringify({
                    title: newQuizTitle,
                    description: newQuizDesc,
                    created_by: 1 // TODO: Get from auth context
                })
            });
            setCreateModalOpen(false);
            setNewQuizTitle('');
            setNewQuizDesc('');
            loadQuizzes();
        } catch (err) {
            console.error('Create Failed', err);
            alert('Could not create quiz. Ensure backend is running and you are logged in.');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
        >
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-extrabold text-gradient">My Quizzes</h1>
                    <p className="text-muted-foreground mt-2 text-lg">Manage your quiz events.</p>
                </div>
                <div className="flex gap-4">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".json"
                        onChange={handleFileChange}
                    />
                    <Button variant="secondary" onClick={handleImportClick} className="gap-2">
                        <Upload size={18} />
                        Import Quiz
                    </Button>
                    <Button onClick={() => setCreateModalOpen(true)} className="gap-2 shadow-lg shadow-cyan-500/20 bg-gradient-to-r from-cyan-500 to-blue-600 border-none">
                        <Plus size={18} />
                        Create New Quiz
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.map((quiz) => (
                    <Card key={quiz.id} hoverEffect className="group relative overflow-hidden glass border-0 bg-white/5">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader>
                            <CardTitle className="flex justify-between items-start">
                                <span className="truncate pr-4 text-xl font-bold text-white">{quiz.title}</span>
                                <span className="flex h-2 w-2 translate-y-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-400 line-clamp-2 min-h-[40px]">{quiz.description || "No description provided."}</p>

                            <div className="mt-6 flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1"><Calendar size={12} /> {new Date().toLocaleDateString()}</span>
                                <span>•</span>
                                <span>{quiz.rounds?.length || 0} Rounds</span>
                            </div>

                            <div className="mt-6 flex gap-2">
                                <Button size="sm" className="flex-1 gap-2 bg-white/10 hover:bg-white/20 border-0" onClick={() => window.location.href = `/admin/quizzes/${quiz.id}`}>
                                    <Play size={14} className="fill-current" /> Manage
                                </Button>
                                <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); handleExport(quiz.id); }}>
                                    <Download size={16} />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {quizzes.length === 0 && (
                    <div className="col-span-full py-20 text-center text-gray-500 border-2 border-dashed border-white/5 rounded-3xl bg-white/5 flex flex-col items-center justify-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                            <Plus size={24} className="opacity-50" />
                        </div>
                        <p>No Quizzes Found. Create one or Import from JSON.</p>
                    </div>
                )}
            </div>

            <Modal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} title="Create New Quiz">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Quiz Title</label>
                        <Input
                            value={newQuizTitle}
                            onChange={(e) => setNewQuizTitle(e.target.value)}
                            placeholder="e.g. Science Fair 2025"
                            className="bg-black/40"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Description</label>
                        <Input
                            value={newQuizDesc}
                            onChange={(e) => setNewQuizDesc(e.target.value)}
                            placeholder="Optional description..."
                            className="bg-black/40"
                        />
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <Button variant="ghost" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateQuiz} className="bg-gradient-to-r from-cyan-500 to-blue-600 border-none">Create Quiz</Button>
                    </div>
                </div>
            </Modal>
        </motion.div>
    )
}
