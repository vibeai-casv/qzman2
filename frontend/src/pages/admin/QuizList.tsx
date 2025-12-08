import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download, Upload, Play, Calendar, BookOpen } from 'lucide-react';
import { fetchAPI, uploadFile } from '../../lib/api';
import AdminPageLayout from '../../layout/AdminPageLayout';

interface Quiz {
    id: number;
    title: string;
    description: string;
    created_at: string;
    rounds: unknown[];
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
                    created_by: 1
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

    const actions = (
        <>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".json"
                onChange={handleFileChange}
            />
            <button
                onClick={handleImportClick}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
                <Upload className="w-4 h-4 mr-2" />
                Import Quiz
            </button>
            <button
                onClick={() => setCreateModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
            >
                <Plus className="w-4 h-4 mr-2" />
                Create New Quiz
            </button>
        </>
    );

    return (
        <AdminPageLayout
            title="Quiz Management"
            subtitle="Create, manage, and run your quiz events"
            actions={actions}
        >
            {/* Quiz Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.map((quiz, index) => (
                    <motion.div
                        key={quiz.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group"
                    >
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-3">
                                <div className="p-2 bg-indigo-100 rounded-lg">
                                    <BookOpen className="w-5 h-5 text-indigo-600" />
                                </div>
                                <span className="flex h-2 w-2 rounded-full bg-green-400 shadow-sm" />
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                                {quiz.title}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px]">
                                {quiz.description || "No description provided."}
                            </p>

                            <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(quiz.created_at || Date.now()).toLocaleDateString()}
                                </span>
                                <span>•</span>
                                <span>{quiz.rounds?.length || 0} Rounds</span>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                                <a
                                    href={`/admin/quizzes/${quiz.id}`}
                                    className="flex-1 inline-flex justify-center items-center px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                                >
                                    <Play className="w-4 h-4 mr-1" />
                                    Manage
                                </a>
                                <button
                                    onClick={() => handleExport(quiz.id)}
                                    className="px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {quizzes.length === 0 && (
                    <div className="col-span-full py-16 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                            <Plus className="w-6 h-6 text-gray-400" />
                        </div>
                        <h3 className="text-gray-900 font-medium mb-1">No Quizzes Found</h3>
                        <p className="text-gray-500 text-sm">Create a new quiz or import from JSON to get started.</p>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setCreateModalOpen(false)} />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4"
                    >
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Quiz</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Quiz Title</label>
                                <input
                                    type="text"
                                    value={newQuizTitle}
                                    onChange={(e) => setNewQuizTitle(e.target.value)}
                                    placeholder="e.g. Science Fair 2025"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <input
                                    type="text"
                                    value={newQuizDesc}
                                    onChange={(e) => setNewQuizDesc(e.target.value)}
                                    placeholder="Optional description..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    onClick={() => setCreateModalOpen(false)}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateQuiz}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    Create Quiz
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AdminPageLayout>
    );
}
