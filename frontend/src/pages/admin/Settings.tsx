import { motion } from 'framer-motion';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/FormControls';
import { Save } from 'lucide-react';

export default function Settings() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-4xl"
        >
            <h1 className="text-4xl font-extrabold text-gradient">Settings</h1>

            <Card className="glass border-0">
                <CardHeader>
                    <h2 className="text-xl font-bold text-white">General Configuration</h2>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Quiz Default Duration (Seconds)</label>
                        <Input placeholder="30" type="number" defaultValue={30} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Theme Preference</label>
                        <Select>
                            <option>Cosmic Night (Default)</option>
                            <option>Midnight Blue</option>
                            <option>Cyberpunk Neon</option>
                        </Select>
                    </div>

                    <div className="flex items-center gap-4">
                        <input type="checkbox" id="sounds" className="w-4 h-4 rounded border-gray-600 bg-black/40 text-blue-500 focus:ring-blue-500" defaultChecked />
                        <label htmlFor="sounds" className="text-sm font-medium text-gray-300">Enable Sound Effects</label>
                    </div>
                </CardContent>
            </Card>

            <Card className="glass border-0">
                <CardHeader>
                    <h2 className="text-xl font-bold text-white">Admin Profile</h2>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Display Name</label>
                            <Input placeholder="Quiz Master" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Email (Read Only)</label>
                            <Input value="admin@qzman.com" disabled className="opacity-50" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">New Password</label>
                        <Input type="password" placeholder="Leave blank to keep current" />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button className="gap-2 shadow-lg shadow-cyan-500/20 bg-gradient-to-r from-cyan-500 to-blue-600 border-none">
                    <Save size={18} /> Save Changes
                </Button>
            </div>
        </motion.div>
    );
}
