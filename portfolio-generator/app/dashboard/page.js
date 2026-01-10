'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, Button } from '@/components';

export default function DashboardPage() {
    const [stats, setStats] = useState({
        projectCount: 0,
        skillCount: 0,
        experienceCount: 0,
        user: null
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                // Fetch user profile strength and other stats
                // Note: Real implementation would hit /api/stats or specific endpoints
                // For now simulating derived stats from disparate endpoints or a comprehensive dashboard endpoint
                // In the instructions, getting profile strength is specific. 
                // We'll use /api/auth/me for user info and derived counts if needed, but optimally we should have a dashboard endpoint.
                // Based on existing APIs, we might need to fetch separately or assumes /api/profile provides this.
                // Let's check /api/profile or /api/stats. 
                // The instructions mention /api/stats is for ADMIN view. 
                // Profile strength is usually on user profile. Let's try fetching user profile details.

                const [profileRes, projectsRes, skillsRes, expRes] = await Promise.all([
                    fetch('/api/auth/me'),
                    fetch('/api/projects'),
                    fetch('/api/skills'),
                    fetch('/api/experience')
                ]);

                if (profileRes.ok && projectsRes.ok && skillsRes.ok && expRes.ok) {
                    const profileData = await profileRes.json();
                    const projectsData = await projectsRes.json();
                    const skillsData = await skillsRes.json();
                    const expData = await expRes.json();

                    // Calculate basic stats manually or if backend provides strength 
                    // The instructions say fn_CalculateProfileStrength is a stored function. 
                    // We need to ensure the API returns this value. 
                    // Usually passed in user object or profile object.

                    setStats({
                        user: profileData.user,
                        projectCount: projectsData.projects?.length || 0,
                        skillCount: skillsData.skills?.length || 0,
                        experienceCount: expData.experience?.length || 0
                    });
                }
            } catch (error) {
                console.error('Failed to load dashboard data', error);
            } finally {
                setLoading(false);
            }
        }

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-pulse text-rose-500 font-bold text-xl">Loading Portify...</div>
            </div>
        );
    }

    const { user, projectCount, skillCount, experienceCount } = stats;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Welcome back, {user?.fullName?.split(' ')[0] || 'Creator'}!
                    </h1>
                    <p className="text-gray-400">
                        Here&apos;s what&apos;s happening with your portfolio today.
                    </p>
                </div>
                <Link href={`/portfolio/${user?.id}`} target="_blank">
                    <Button variant="outline" className="gap-2">
                        <span>🌐</span> View Public Portfolio
                    </Button>
                </Link>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Projects Stats */}
                <Link href="/dashboard/projects" className="block group">
                    <div className="glass-card rounded-3xl p-6 h-full hover:bg-white/5 transition-all relative overflow-hidden">
                        <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-[radial-gradient(circle,theme(colors.rose.500)_0%,transparent_70%)] opacity-20 group-hover:opacity-40 transition-all"></div>
                        <div className="flex items-start justify-between mb-8 relative z-10">
                            <div className="p-3 bg-rose-500/20 rounded-2xl text-rose-400">
                                🚀
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Projects</span>
                        </div>
                        <div className="relative z-10">
                            <div className="text-3xl font-bold text-white mb-1">{projectCount}</div>
                            <p className="text-gray-400 text-sm">Showcased works</p>
                        </div>
                    </div>
                </Link>

                {/* Skills Stats */}
                <Link href="/dashboard/skills" className="block group">
                    <div className="glass-card rounded-3xl p-6 h-full hover:bg-white/5 transition-all relative overflow-hidden">
                        <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-[radial-gradient(circle,theme(colors.purple.500)_0%,transparent_70%)] opacity-20 group-hover:opacity-40 transition-all"></div>
                        <div className="flex items-start justify-between mb-8 relative z-10">
                            <div className="p-3 bg-purple-500/20 rounded-2xl text-purple-400">
                                🎯
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Skills</span>
                        </div>
                        <div className="relative z-10">
                            <div className="text-3xl font-bold text-white mb-1">{skillCount}</div>
                            <p className="text-gray-400 text-sm">Technical abilities</p>
                        </div>
                    </div>
                </Link>

                {/* Experience Stats */}
                <Link href="/dashboard/experience" className="block group">
                    <div className="glass-card rounded-3xl p-6 h-full hover:bg-white/5 transition-all relative overflow-hidden">
                        <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-[radial-gradient(circle,theme(colors.blue.500)_0%,transparent_70%)] opacity-20 group-hover:opacity-40 transition-all"></div>
                        <div className="flex items-start justify-between mb-8 relative z-10">
                            <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400">
                                💼
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Experience</span>
                        </div>
                        <div className="relative z-10">
                            <div className="text-3xl font-bold text-white mb-1">{experienceCount}</div>
                            <p className="text-gray-400 text-sm">Career milestones</p>
                        </div>
                    </div>
                </Link>

                {/* Profile Card */}
                <Link href="/dashboard/profile" className="block group">
                    <div className="glass-card rounded-3xl p-6 h-full hover:bg-white/5 transition-all relative overflow-hidden">
                        <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-[radial-gradient(circle,theme(colors.green.500)_0%,transparent_70%)] opacity-20 group-hover:opacity-40 transition-all"></div>
                        <div className="flex items-start justify-between mb-8 relative z-10">
                            <div className="p-3 bg-green-500/20 rounded-2xl text-green-400">
                                👤
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">About Me</span>
                        </div>
                        <div className="relative z-10">
                            <div className="text-xl font-bold text-white mb-1">Edit Profile</div>
                            <p className="text-gray-400 text-sm">Bio & Personal Info</p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Hints / Admin Link */}
            {
                user?.role === 'admin' && (
                    <div className="mt-8">
                        <Link href="/dashboard/admin">
                            <div className="glass-panel p-4 rounded-2xl flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl text-yellow-500">
                                        ⚡
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold">Admin Dashboard Available</h4>
                                        <p className="text-gray-500 text-sm">Access system-wide statistics and management tools.</p>
                                    </div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-white">
                                    →
                                </div>
                            </div>
                        </Link>
                    </div>
                )
            }
        </div >
    );
}
