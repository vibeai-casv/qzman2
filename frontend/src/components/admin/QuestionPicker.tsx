import { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input, Badge } from '../ui/FormControls';
import { Button } from '../ui/Button';
import { fetchAPI } from '../../lib/api';
import { Search, Plus } from 'lucide-react';

interface QuestionPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (questionId: number) => void;
}

export function QuestionPicker({ isOpen, onClose, onSelect }: QuestionPickerProps) {
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (isOpen) loadQuestions();
    }, [isOpen]);

    const loadQuestions = async () => {
        setLoading(true);
        try {
            const data = await fetchAPI('/questions/');
            setQuestions(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const filtered = questions.filter(q => q.text.toLowerCase().includes(search.toLowerCase()));

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Select Question from Bank">
            <div className="space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
                    <Input
                        placeholder="Search..."
                        className="pl-10"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                <div className="max-h-[400px] overflow-y-auto space-y-2 custom-scrollbar">
                    {loading ? (
                        <div className="text-center p-4">Loading...</div>
                    ) : (
                        filtered.map(q => (
                            <div key={q.id} className="flex items-center justify-between p-3 rounded-lg border border-white/10 hover:border-blue-500/50 hover:bg-white/5 transition-all">
                                <div className="flex-1 pr-4">
                                    <div className="flex gap-2 mb-1">
                                        <Badge variant="outline">{q.category}</Badge>
                                        <Badge className="text-[10px]">{q.type}</Badge>
                                    </div>
                                    <p className="text-sm text-white line-clamp-2">{q.text}</p>
                                </div>
                                <Button size="sm" onClick={() => onSelect(q.id)}>
                                    <Plus size={16} />
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </Modal>
    );
}
