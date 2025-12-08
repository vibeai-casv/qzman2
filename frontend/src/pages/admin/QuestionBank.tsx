import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Edit2, Trash2, CheckCircle, Plus } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Select, Badge } from '../../components/ui/FormControls';
import { Modal } from '../../components/ui/Modal';
import { fetchAPI } from '../../lib/api';

export default function QuestionBank() {
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('ALL');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<any>(null);

    // Form State
    const [formData, setFormData] = useState({
        text: '',
        type: 'MCQ',
        category: 'General',
        difficulty: 'MEDIUM',
        options: ['', '', '', ''],
        answer: '',
        tags: ''
    });

    useEffect(() => {
        loadQuestions();
    }, []);

    const loadQuestions = async () => {
        setLoading(true);
        try {
            const data = await fetchAPI('/questions/');
            setQuestions(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const payload = {
                ...formData,
                options: formData.type === 'MCQ' ? formData.options : [],
                tags: typeof formData.tags === 'string' ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : formData.tags
            };

            if (editingQuestion) {
                await fetchAPI(`/questions/${editingQuestion.id}/`, {
                    method: 'PUT',
                    body: JSON.stringify(payload)
                });
            } else {
                await fetchAPI('/questions/', {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });
            }
            setIsModalOpen(false);
            setEditingQuestion(null);
            resetForm();
            loadQuestions();
        } catch (error) {
            alert('Error saving question');
            console.error(error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure?')) return;
        try {
            await fetchAPI(`/questions/${id}/`, { method: 'DELETE' });
            loadQuestions();
        } catch (error) {
            console.error(error);
        }
    };

    const openEdit = (q: any) => {
        setEditingQuestion(q);
        setFormData({
            text: q.text,
            type: q.type,
            category: q.category,
            difficulty: q.difficulty,
            options: Array.isArray(q.options) && q.options.length >= 4 ? q.options : ['', '', '', ''],
            answer: q.answer,
            tags: Array.isArray(q.tags) ? q.tags.join(', ') : ''
        });
        setIsModalOpen(true);
    };

    const openCreate = () => {
        setEditingQuestion(null);
        resetForm();
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            text: '',
            type: 'MCQ',
            category: 'General',
            difficulty: 'MEDIUM',
            options: ['', '', '', ''],
            answer: '',
            tags: ''
        });
    };

    const updateOption = (idx: number, val: string) => {
        const newOpts = [...formData.options];
        newOpts[idx] = val;
        setFormData({ ...formData, options: newOpts });
    };

    const filteredQuestions = Array.isArray(questions) ? questions.filter(q => {
        const matchesSearch = q.text.toLowerCase().includes(searchTerm.toLowerCase()) || q.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'ALL' || q.type === filterType;
        return matchesSearch && matchesType;
    }) : [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-extrabold text-gradient">Question Bank</h1>
                <Button onClick={openCreate} className="gap-2 shadow-lg shadow-purple-500/20 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 border-none">
                    <Plus size={18} /> Add Question
                </Button>
            </div>

            <Card className="glass border-0">
                <CardHeader>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
                            <Input
                                placeholder="Search questions..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select
                            className="w-full md:w-48"
                            value={filterType}
                            onChange={e => setFilterType(e.target.value)}
                        >
                            <option value="ALL">All Types</option>
                            <option value="MCQ">Multiple Choice</option>
                            <option value="TEXT">Text Answer</option>
                            <option value="MEDIA">Media</option>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-20 text-gray-500">Loading library...</div>
                    ) : (
                        <div className="space-y-4">
                            {filteredQuestions.map(q => (
                                <div key={q.id} className="group relative bg-white/5 border border-white/5 rounded-xl p-4 hover:border-blue-500/50 transition-all">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Badge variant={q.difficulty === 'HARD' ? 'danger' : q.difficulty === 'MEDIUM' ? 'warning' : 'success'}>
                                                    {q.difficulty}
                                                </Badge>
                                                <Badge variant="outline">{q.category}</Badge>
                                                <Badge variant="default" className="text-[10px]">{q.type}</Badge>
                                            </div>
                                            <p className="font-medium text-lg text-white mb-2">{q.text}</p>
                                            <div className="text-sm text-gray-400 flex items-center gap-2">
                                                <CheckCircle size={14} className="text-green-500" />
                                                Answer: <span className="text-green-400">{q.answer}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button size="icon" variant="ghost" onClick={() => openEdit(q)}>
                                                <Edit2 size={16} />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-400/20" onClick={() => handleDelete(q.id)}>
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {filteredQuestions.length === 0 && (
                                <div className="text-center py-10 text-gray-500">No questions found matching your criteria.</div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingQuestion ? 'Edit Question' : 'New Question'}
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Question Text</label>
                        <Input
                            value={formData.text}
                            onChange={e => setFormData({ ...formData, text: e.target.value })}
                            placeholder="e.g. What is the capital of France?"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Category</label>
                            <Input
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Difficulty</label>
                            <Select
                                value={formData.difficulty}
                                onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                            >
                                <option value="EASY">Easy</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HARD">Hard</option>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Type</label>
                        <Select
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="MCQ">Multiple Choice</option>
                            <option value="TEXT">Direct Text Answer</option>
                            <option value="MEDIA">Media / Picture</option>
                        </Select>
                    </div>

                    {formData.type === 'MCQ' && (
                        <div className="space-y-2 p-4 bg-black/20 rounded-lg border border-white/5">
                            <label className="text-sm font-medium text-gray-300 mb-2 block">Options</label>
                            {formData.options.map((opt, i) => (
                                <div key={i} className="flex gap-2">
                                    <span className="text-gray-500 py-2">{String.fromCharCode(65 + i)}.</span>
                                    <Input
                                        value={opt}
                                        onChange={e => updateOption(i, e.target.value)}
                                        placeholder={`Option ${i + 1}`}
                                        className="bg-black/40"
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">
                            Correct Answer {formData.type === 'MCQ' ? '(Must match one option exactly)' : ''}
                        </label>
                        {formData.type === 'MCQ' ? (
                            <Select
                                value={formData.answer}
                                onChange={e => setFormData({ ...formData, answer: e.target.value })}
                            >
                                <option value="">Select correct option...</option>
                                {formData.options.map((opt, i) => (
                                    opt && <option key={i} value={opt}>{opt}</option>
                                ))}
                            </Select>
                        ) : (
                            <Input
                                value={formData.answer}
                                onChange={e => setFormData({ ...formData, answer: e.target.value })}
                                placeholder="The correct answer..."
                            />
                        )}
                    </div>

                    <div className="flex gap-2 justify-end mt-8">
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave}>Save Question</Button>
                    </div>
                </div>
            </Modal>
        </motion.div>
    );
}
