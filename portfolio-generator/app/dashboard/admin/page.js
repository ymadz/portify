'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button, Badge, Input, Select, Modal } from '@/components';

export default function AdminPage() {
    const router = useRouter();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Checking admin access and fetching logic
    useEffect(() => {
        async function loadAdminData() {
            try {
                // 1. Check Auth (handled mostly by API protection but good to verify role)
                const authRes = await fetch('/api/auth/me');
                if (!authRes.ok) throw new Error('Unauthorized');
                const authData = await authRes.json();
                if (authData.user.role !== 'admin') {
                    router.push('/dashboard');
                    return;
                }

                // 2. Fetch Stats from View
                const statsRes = await fetch('/api/stats');
                if (!statsRes.ok) throw new Error('Failed to load stats');
                const statsData = await statsRes.json();
                setStats(statsData);
            } catch (err) {
                console.error(err);
                setError('Access Denied or API Error');
                router.push('/dashboard');
            } finally {
                setLoading(false);
            }
        }
        loadAdminData();
    }, [router]);

    if (loading) return <div className="text-center py-20 text-gray-500 animate-pulse">Loading Admin Panel...</div>;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
                <p className="text-gray-400">System-wide monitoring with SQL Server Views.</p>
            </div>

            {stats && (
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="glass-card rounded-3xl p-6 border-l-4 border-rose-500">
                        <div className="text-gray-400 text-sm uppercase font-bold mb-2">Total Users</div>
                        <div className="text-4xl font-bold text-white">{stats.TotalUsers}</div>
                    </div>
                    <div className="glass-card rounded-3xl p-6 border-l-4 border-orange-500">
                        <div className="text-gray-400 text-sm uppercase font-bold mb-2">Total Projects</div>
                        <div className="text-4xl font-bold text-white">{stats.TotalProjects}</div>
                    </div>
                    <div className="glass-card rounded-3xl p-6 border-l-4 border-purple-500">
                        <div className="text-gray-400 text-sm uppercase font-bold mb-2">Total Skills</div>
                        <div className="text-4xl font-bold text-white">{stats.TotalSkills}</div>
                    </div>
                </div>
            )}

            {/* Additional Management Sections would go here, simplified for this scope */}
            <div className="glass-panel p-8 rounded-3xl text-center">
                <h3 className="text-xl font-bold text-white mb-2">Database Management</h3>
                <p className="text-gray-500 mb-6">
                    This dashboard reads directly from <code>vw_AdminDashboardStats</code>.
                </p>
                <div className="inline-flex gap-4">
                    <Button variant="outline" disabled>Manage Users</Button>
                    <Button variant="outline" disabled>System Logs</Button>
                </div>
            </div>
        </div>
    );
}
