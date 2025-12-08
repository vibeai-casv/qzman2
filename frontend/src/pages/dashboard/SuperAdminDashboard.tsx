import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Shield, Users, Server, Activity, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SuperAdminDashboard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Super Admin Console</h1>
                    <p className="text-muted-foreground mt-2">System-wide control and monitoring.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2 border-red-500/20 text-red-400">
                        <Server size={18} /> System Status
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card hoverEffect className="border-red-500/20">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-red-400">Total Users</CardTitle>
                        <Users size={16} className="text-red-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-white">4</div>
                        <p className="text-xs text-muted-foreground mt-1">Admins, QMs, Scorers</p>
                    </CardContent>
                </Card>
                <Card hoverEffect className="border-blue-500/20">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-blue-400">Active Quizzes</CardTitle>
                        <Activity size={16} className="text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-white">2</div>
                        <p className="text-xs text-muted-foreground mt-1">Currently running</p>
                    </CardContent>
                </Card>
                <Card hoverEffect className="border-green-500/20">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-green-400">Database Size</CardTitle>
                        <Database size={16} className="text-green-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-white">12MB</div>
                        <p className="text-xs text-muted-foreground mt-1">Last backup: 2h ago</p>
                    </CardContent>
                </Card>
                <Card hoverEffect className="border-purple-500/20">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-purple-400">Security</CardTitle>
                        <Shield size={16} className="text-purple-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-white">OK</div>
                        <p className="text-xs text-muted-foreground mt-1">No threats detected</p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex gap-4">
                <Link to="/admin">
                    <Button>Go to Standard Admin Panel</Button>
                </Link>
                <Button variant="secondary">Manage System Users</Button>
                <Button variant="secondary">View Server Logs</Button>
            </div>
        </motion.div>
    );
}
