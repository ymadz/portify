'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Button, Input, Textarea, Card } from '@/components';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          bio: formData.bio || null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Account created successfully!');
        router.push('/dashboard');
        router.refresh();
      } else {
        toast.error(data.error || 'Registration failed');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-indigo-50 flex items-center justify-center px-4 py-12">
      <Card className="max-w-md w-full p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-[var(--muted)]">Start building your portfolio today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="fullName"
            type="text"
            label="Full Name"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="John Doe"
          />

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
            helperText="Minimum 6 characters"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="••••••••"
          />

          <Input
            id="confirmPassword"
            type="password"
            label="Confirm Password"
            required
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            placeholder="••••••••"
          />

          <Textarea
            id="bio"
            label="Bio (Optional)"
            rows={3}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Tell us about yourself..."
            helperText="Share your background, interests, or professional summary"
          />

          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            className="w-full"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[var(--muted)]">
            Already have an account?{' '}
            <Link href="/login" className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium">
              Sign in
            </Link>
          </p>
          <Link href="/" className="block mt-4 text-[var(--muted)] hover:text-gray-700">
            ← Back to home
          </Link>
        </div>
      </Card>
    </div>
  );
}
