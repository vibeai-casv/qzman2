import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
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

    const handleCreateSample = async () => {
        try {
            await fetchAPI('/quizzes/', {
                method: 'POST',
                body: JSON.stringify({
                    title: `Sample Quiz ${new Date().toLocaleTimeString()}`,
                    description: 'A generated sample quiz to test export functionality.',
                    created_by: 1
                })
            });
            loadQuizzes();
        } catch (err) {
            console.error('Create Failed', err);
            // Fallback for demo if auth fail
            alert('Could not create quiz. Ensure backend is running and you are logged in (or auth is disabled for dev).');
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
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">My Quizzes</h1>
                    <p className="text-muted-foreground mt-2">Manage your quiz events.</p>
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
                    <Button onClick={handleCreateSample} className="gap-2 shadow-lg shadow-primary/20">
                        <Plus size={18} />
                        Create New Quiz
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.map((quiz) => (
                    <Card key={quiz.id} hoverEffect className="group relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader>
                            <CardTitle className="flex justify-between items-start">
                                <span className="truncate pr-4">{quiz.title}</span>
                                <span className="flex h-2 w-2 translate-y-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">{quiz.description || "No description provided."}</p>

                            <div className="mt-6 flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1"><Calendar size={12} /> {new Date().toLocaleDateString()}</span>
                                <span>•</span>
                                <span>{quiz.rounds?.length || 0} Rounds</span>
                            </div>

                            <div className="mt-6 flex gap-2">
                                <Button size="sm" className="flex-1 gap-2" onClick={() => window.location.href = `/admin/quizzes/${quiz.id}`}>
                                    <Play size={14} /> Manage
                                </Button>
                                <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); handleExport(quiz.id); }}>
                                    <Download size={16} />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {quizzes.length === 0 && (
                    <div className="col-span-full py-20 text-center text-muted-foreground border border-dashed border-white/10 rounded-xl">
                        No Quizzes Found. Create one or Import from JSON.
                    </div>
                )}
            </div>
        </motion.div>
    )
}
