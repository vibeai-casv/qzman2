import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Badge } from '../../components/ui/FormControls';
import { fetchAPI } from '../../lib/api';
import { Search, Trash2, Shield, ShieldOff, Users } from 'lucide-react';

export default function TeamList() {
    const [teams, setTeams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadTeams();
    }, []);

    const loadTeams = async () => {
        try {
            const data = await fetchAPI('/teams/');
            setTeams(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this team?')) return;
        try {
            await fetchAPI(`/teams/${id}/`, { method: 'DELETE' });
            loadTeams();
        } catch (error) {
            alert('Failed to delete team');
        }
    };

    const toggleStatus = async (team: any) => {
        try {
            await fetchAPI(`/teams/${team.id}/`, {
                method: 'PATCH',
                body: JSON.stringify({ is_active: !team.is_active })
            });
            loadTeams();
        } catch (error) {
            console.error(error);
        }
    };

    const filteredTeams = teams.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-extrabold text-gradient">Team Management</h1>
                    <p className="text-muted-foreground mt-2 text-lg">Monitor and manage participating teams.</p>
                </div>
            </div>

            <Card className="glass border-0">
                <CardHeader>
                    <div className="flex gap-4 items-center">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
                            <Input
                                placeholder="Search teams..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="text-sm text-gray-400 ml-auto">
                            Total Teams: {teams.length}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-20 text-gray-500">Loading teams...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredTeams.map(team => (
                                <div key={team.id} className="bg-white/5 border border-white/5 rounded-xl p-6 flex flex-col gap-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                                                {team.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white text-lg">{team.name}</h3>
                                                <p className="text-xs text-gray-400">Score: {team.score}</p>
                                            </div>
                                        </div>
                                        <Badge variant={team.is_active ? 'success' : 'danger'}>
                                            {team.is_active ? 'Active' : 'Blocked'}
                                        </Badge>
                                    </div>

                                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/5">
                                        <div className="text-xs text-gray-500">
                                            Members: {team.members_count || 0}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="ghost" onClick={() => toggleStatus(team)} title={team.is_active ? "Block Team" : "Activate Team"}>
                                                {team.is_active ? <ShieldOff size={16} className="text-orange-400" /> : <Shield size={16} className="text-green-400" />}
                                            </Button>
                                            <Button size="sm" variant="ghost" onClick={() => handleDelete(team.id)} className="text-red-400 hover:bg-red-500/10">
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {filteredTeams.length === 0 && (
                                <div className="col-span-full text-center py-10 text-gray-500 flex flex-col items-center gap-4">
                                    <Users size={40} className="opacity-20" />
                                    No teams found.
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
