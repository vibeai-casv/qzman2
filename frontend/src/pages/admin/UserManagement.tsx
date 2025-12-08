import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/FormControls';
import { UserPlus, Trash2, Edit2 } from 'lucide-react';

export default function UserManagement() {
    // Mock user data for now, ideally fetched from backend
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [users] = useState([
        { id: 1, username: 'sadmin', role: 'SUPER_ADMIN', active: true },
        { id: 2, username: 'admin', role: 'ADMIN', active: true },
        { id: 3, username: 'qzmaster', role: 'QUIZ_MASTER', active: true },
        { id: 4, username: 'scoremanager', role: 'SCORE_MANAGER', active: true },
    ]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-extrabold text-gradient">User Management</h1>
                    <p className="text-muted-foreground mt-2 text-lg">Manage system access and roles.</p>
                </div>
                <Button className="gap-2 bg-white/10 hover:bg-white/20 border-0">
                    <UserPlus size={18} /> Add User
                </Button>
            </div>

            <Card className="glass border-0">
                <CardContent className="p-0">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-gray-400 text-sm uppercase">
                            <tr>
                                <th className="p-6 font-medium">User</th>
                                <th className="p-6 font-medium">Role</th>
                                <th className="p-6 font-medium">Status</th>
                                <th className="p-6 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-white">
                                                {user.username[0].toUpperCase()}
                                            </div>
                                            <span className="font-bold text-white">{user.username}</span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">
                                            {user.role.replace('_', ' ')}
                                        </Badge>
                                    </td>
                                    <td className="p-6">
                                        <Badge variant={user.active ? 'success' : 'danger'}>
                                            {user.active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button size="icon" variant="ghost" className="h-8 w-8">
                                                <Edit2 size={16} />
                                            </Button>
                                            {user.role !== 'SUPER_ADMIN' && (
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400">
                                                    <Trash2 size={16} />
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </motion.div>
    );
}
