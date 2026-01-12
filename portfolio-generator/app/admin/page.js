'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            try {
                const res = await fetch('/api/stats');
                if (res.ok) {
                    const data = await res.json();
                    setStats(data.stats);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadStats();
    }, []);

    if (loading) return <div className="text-gray-400 p-8">Loading dashboard...</div>;

    return (
        <div className="space-y-8 p-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
                <p className="text-gray-400">Welcome back, Admin.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="border-l-4 border-rose-500 p-6">
                    <div className="text-gray-400 text-sm uppercase font-bold mb-2">Total Users</div>
                    <div className="text-4xl font-bold text-white">{stats?.totalUsers || 0}</div>
                </Card>
                <Card className="border-l-4 border-indigo-500 p-6">
                    <div className="text-gray-400 text-sm uppercase font-bold mb-2">Total Projects</div>
                    <div className="text-4xl font-bold text-white">{stats?.totalProjects || 0}</div>
                </Card>
                <Card className="border-l-4 border-emerald-500 p-6">
                    <div className="text-gray-400 text-sm uppercase font-bold mb-2">Total Skills Assigned</div>
                    <div className="text-4xl font-bold text-white">{stats?.totalUserSkills || 0}</div>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-2 gap-8">
                <div className="glass-panel p-6 rounded-3xl">
                    <h3 className="text-xl font-bold text-white mb-6">User Growth</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats?.userGrowth || []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="Date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                    cursor={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                                />
                                <Line type="monotone" dataKey="Count" stroke="#f43f5e" strokeWidth={3} dot={{ fill: '#f43f5e' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="glass-panel p-6 rounded-3xl">
                    <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Link href="/admin/users" className="p-4 rounded-xl bg-white/5 border border-white/10 text-center text-gray-300 hover:text-white hover:bg-white/10 transition-all group flex flex-col items-center gap-2">
                            <span className="text-2xl group-hover:scale-110 transition-transform">👥</span>
                            <span className="font-medium">Manage Users</span>
                        </Link>
                        <Link href="/admin/projects" className="p-4 rounded-xl bg-white/5 border border-white/10 text-center text-gray-300 hover:text-white hover:bg-white/10 transition-all group flex flex-col items-center gap-2">
                            <span className="text-2xl group-hover:scale-110 transition-transform">🚀</span>
                            <span className="font-medium">Review Projects</span>
                        </Link>
                        <Link href="/admin/skills" className="p-4 rounded-xl bg-white/5 border border-white/10 text-center text-gray-300 hover:text-white hover:bg-white/10 transition-all group flex flex-col items-center gap-2">
                            <span className="text-2xl group-hover:scale-110 transition-transform">🎯</span>
                            <span className="font-medium">Manage Skills</span>
                        </Link>
                        <Link href="/admin/experience" className="p-4 rounded-xl bg-white/5 border border-white/10 text-center text-gray-300 hover:text-white hover:bg-white/10 transition-all group flex flex-col items-center gap-2">
                            <span className="text-2xl group-hover:scale-110 transition-transform">💼</span>
                            <span className="font-medium">Experience</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
