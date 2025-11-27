'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button, Card, Progress, Avatar } from '@/components';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserAndStats();
  }, []);

  const fetchUserAndStats = async () => {
    try {
      const [userRes, statsRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/stats'),
      ]);

      if (userRes.ok && statsRes.ok) {
        const userData = await userRes.json();
        const statsData = await statsRes.json();
        setUser(userData.user);
        setStats(statsData.stats);
      } else {
        router.push('/login');
      }
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.success('Logged out successfully');
      router.push('/');
      router.refresh();
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-[var(--muted)]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-subtle">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Avatar name={user?.fullName} size="lg" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Portfolio Dashboard</h1>
                <p className="text-[var(--muted)]">Welcome back, {user?.fullName}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href={`/portfolio/${user?.id}`}>
                <Button variant="ghost">
                  View Public Portfolio
                </Button>
              </Link>
              <Button variant="secondary" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Profile Strength Card */}
        <Card className="mb-6">
          <Card.Header>
            <Card.Title>Profile Strength</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="flex items-center gap-6 mb-6">
              <div className="flex-1">
                <Progress 
                  value={stats?.profileStrength || 0}
                  max={100}
                  label="Profile Completion"
                  size="lg"
                  color="accent"
                />
              </div>
              <div className="text-5xl font-bold text-[var(--accent)]">
                {stats?.profileStrength}%
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{stats?.userProjects || 0}</div>
                <div className="text-sm text-[var(--muted)]">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{stats?.userSkills || 0}</div>
                <div className="text-sm text-[var(--muted)]">Skills</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{stats?.userExperience || 0}</div>
                <div className="text-sm text-[var(--muted)]">Experiences</div>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Skill Distribution Chart */}
        {stats?.skillDistribution && stats.skillDistribution.length > 0 && (
          <Card className="mb-6">
            <Card.Header>
              <Card.Title>Your Skills by Category</Card.Title>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.skillDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="Category" tick={{ fill: '#6B7280' }} />
                  <YAxis tick={{ fill: '#6B7280' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="Count" fill="var(--accent)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <Link href="/dashboard/projects">
            <Card className="hover:shadow-modal transition-shadow cursor-pointer h-full">
              <div className="text-4xl mb-3">🚀</div>
              <Card.Title className="mb-2">Manage Projects</Card.Title>
              <Card.Body>
                <p className="text-sm">Add, edit, or remove your projects</p>
              </Card.Body>
            </Card>
          </Link>

          <Link href="/dashboard/skills">
            <Card className="hover:shadow-modal transition-shadow cursor-pointer h-full">
              <div className="text-4xl mb-3">🎯</div>
              <Card.Title className="mb-2">Manage Skills</Card.Title>
              <Card.Body>
                <p className="text-sm">Update your skills and proficiency levels</p>
              </Card.Body>
            </Card>
          </Link>

          <Link href="/dashboard/experience">
            <Card className="hover:shadow-modal transition-shadow cursor-pointer h-full">
              <div className="text-4xl mb-3">💼</div>
              <Card.Title className="mb-2">Manage Experience</Card.Title>
              <Card.Body>
                <p className="text-sm">Track your work history and achievements</p>
              </Card.Body>
            </Card>
          </Link>
        </div>

        {/* Platform Stats */}
        <Card>
          <Card.Header>
            <Card.Title>Platform Statistics</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--accent)]">{stats?.totalUsers || 0}</div>
                <div className="text-sm text-[var(--muted)] mt-1">Total Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--accent)]">{stats?.totalProjects || 0}</div>
                <div className="text-sm text-[var(--muted)] mt-1">Total Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--accent)]">{stats?.avgProjectsPerUser || 0}</div>
                <div className="text-sm text-[var(--muted)] mt-1">Avg Projects/User</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--accent)]">{stats?.mostPopularSkill || 'N/A'}</div>
                <div className="text-sm text-[var(--muted)] mt-1">Most Popular Skill</div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
