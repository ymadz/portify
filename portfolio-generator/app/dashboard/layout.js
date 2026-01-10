'use client';

import { Navbar } from '@/components';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Quick fetch for user info in header
        fetch('/api/auth/me')
            .then(res => res.ok ? res.json() : null)
            .then(data => data && setUser(data.user));
    }, []);

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

    // Navigation Tabs
    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: '📊' },
        { name: 'Projects', path: '/dashboard/projects', icon: '🚀' },
        { name: 'Skills', path: '/dashboard/skills', icon: '🎯' },
        { name: 'Experience', path: '/dashboard/experience', icon: '💼' },
        { name: 'Profile', path: '/dashboard/profile', icon: '👤' },
    ];

    return (
        <div className="min-h-screen relative">
            {/* Decorative background blobs */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px] animate-[pulse_8s_ease-in-out_infinite]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-900/20 rounded-full blur-[120px] animate-[pulse_10s_ease-in-out_infinite_reverse]" />
            </div>

            {/* Top Navigation Bar */}
            <Navbar
                user={user}
                navItems={navItems}
                onLogout={handleLogout}
                logoHref="/dashboard"
            />

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-6 py-8 pt-32">
                {children}
            </main>
        </div>
    );
}
