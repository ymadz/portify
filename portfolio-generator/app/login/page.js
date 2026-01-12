'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Button, Input, Card } from '@/components';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log('🔵 Login form submitted', { email: formData.email });

    try {
      console.log('🔵 Sending login request...');
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      console.log('🔵 Response status:', res.status);
      const data = await res.json();
      console.log('🔵 Response data:', data);

      if (res.ok) {
        console.log('✅ Login successful!');
        console.log('🔵 Response data:', data);

        // Show success message
        toast.success('Welcome back!');

        // Wait a bit to ensure cookie is set, then redirect
        console.log('🔵 Waiting for cookie to be set...');
        await new Promise(resolve => setTimeout(resolve, 100));

        // Redirect based on user role
        const redirectPath = data.redirectTo || '/dashboard';
        console.log('\ud83d\udd35 Redirecting to', redirectPath, 'using window.location');
        window.location.href = redirectPath;
      } else {
        console.log('❌ Login failed:', data.error);
        toast.error(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
      console.log('🔵 Login process completed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-900/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link href="/">
            <div className="inline-flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity group">
              <div className="relative w-16 h-16 group-hover:scale-110 transition-transform duration-300">
                <img
                  src="/logo.png"
                  alt="Portify Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-bold text-2xl text-white tracking-wide">Portify</span>
            </div>
          </Link>
        </div>

        <div className="glass-card rounded-3xl p-8 transform transition-all hover:scale-[1.01] duration-500">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400">Sign in to your portfolio account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              id="email"
              type="email"
              label="Email Address"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@example.com"
            />

            <Input
              id="password"
              type="password"
              label="Password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
            />

            <Button
              type="submit"
              disabled={loading}
              variant="primary"
              className="w-full py-3 text-lg font-semibold shadow-rose-500/20"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-8 text-center border-t border-white/10 pt-6">
            <p className="text-gray-400">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-rose-400 hover:text-rose-300 font-medium transition-colors">
                Sign up
              </Link>
            </p>
            <Link href="/" className="block mt-4 text-gray-500 hover:text-white transition-colors text-sm">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
