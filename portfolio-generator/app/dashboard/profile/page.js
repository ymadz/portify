
'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Button, Input, Textarea } from '@/components';

export default function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ fullName: '', bio: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch Profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/profile');
                if (res.ok) {
                    const data = await res.json();
                    if (data.profile) {
                        setFormData({
                            fullName: data.profile.FullName || '',
                            bio: data.profile.Bio || '',
                        });
                    }
                }
            } catch (error) {
                toast.error('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    // Handle Form Input
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Submit Form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Failed to update profile');

            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="text-center py-20 text-gray-500 animate-pulse">Loading profile...</div>;

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Edit Profile</h1>
                <p className="text-gray-400">Update your personal information and bio.</p>
            </div>

            <div className="glass-card rounded-3xl p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Full Name"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Your full name"
                        required
                    />

                    <Textarea
                        label="About Me (Bio)"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Tell the world about yourself..."
                        rows={6}
                    />

                    <div className="flex justify-end pt-4">
                        <Button type="submit" variant="primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
