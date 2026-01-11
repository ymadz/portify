'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Card, Button, Modal, Input } from '@/components';

export default function ExperiencePage() {
    const [experience, setExperience] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentExp, setCurrentExp] = useState(null);
    const [formData, setFormData] = useState({
        jobTitle: '',
        company: '',
        startDate: '',
        endDate: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch Experience
    const fetchExperience = async () => {
        try {
            const res = await fetch('/api/experience');
            if (res.ok) {
                setExperience((await res.json()).experience || []);
            }
        } catch (error) {
            toast.error('Failed to load experience');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExperience();
    }, []);

    // Handle Form Input
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Open Modal
    const openModal = (exp = null) => {
        if (exp) {
            setCurrentExp(exp);
            setFormData({
                jobTitle: exp.JobTitle,
                company: exp.Company,
                startDate: exp.StartDate.split('T')[0],
                endDate: exp.EndDate ? exp.EndDate.split('T')[0] : ''
            });
        } else {
            setCurrentExp(null);
            setFormData({ jobTitle: '', company: '', startDate: '', endDate: '' });
        }
        setIsModalOpen(true);
    };

    // Submit Form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const url = currentExp ? `/api/experience/${currentExp.ExpID}` : '/api/experience';
            const method = currentExp ? 'PUT' : 'POST';

            const payload = { ...formData };
            if (!payload.endDate) payload.endDate = null;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                // Handle Trigger Error specifically
                throw new Error(data.error || 'Failed to save experience');
            }

            toast.success(currentExp ? 'Experience updated!' : 'Experience added!');
            setIsModalOpen(false);
            fetchExperience();
        } catch (error) {
            // Show error directly (e.g., "End Date cannot be before Start Date")
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Delete Experience
    const handleDelete = async (id) => {
        if (!confirm('Delete this experience entry?')) return;
        try {
            await fetch(`/api/experience/${id}`, { method: 'DELETE' });
            toast.success('Deleted successfully');
            setExperience(experience.filter(e => e.ExpID !== id));
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    if (loading) return <div className="text-center py-20 text-gray-500 animate-pulse">Loading experience...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Work Experience</h1>
                    <p className="text-gray-400">Your professional journey and career milestones.</p>
                </div>
                <Button onClick={() => openModal()}>+ Add Experience</Button>
            </div>

            {/* Experience List - Always visible to show Add Card */}
            <div className="grid gap-6">
                {experience.map((exp) => (
                    <div key={exp.ExpID} className="glass-card rounded-3xl p-6 relative overflow-hidden group hover:border-white/20 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                                    {exp.JobTitle}
                                </h3>
                                <div className="text-blue-400 font-medium">{exp.Company}</div>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => { e.stopPropagation(); openModal(exp); }}
                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(exp.ExpID); }}
                                    className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-500 font-mono mb-4">
                            <span>{new Date(exp.StartDate).toLocaleDateString()}</span>
                            <span>→</span>
                            <span className={!exp.EndDate ? "text-green-400" : ""}>
                                {exp.EndDate ? new Date(exp.EndDate).toLocaleDateString() : 'Present'}
                            </span>
                        </div>

                        {/* Timeline connector (decorative) */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-transparent opacity-0 group-hover:opacity-50 transition-opacity"></div>
                    </div>
                ))}
            </div>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentExp ? 'Edit Experience' : 'Add Experience'}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Job Title"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        placeholder="Senior Engineer"
                        required
                    />
                    <Input
                        label="Company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Tech Corp"
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            type="date"
                            label="Start Date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            required
                            className="dark:[color-scheme:dark]"
                        />
                        <Input
                            type="date"
                            label="End Date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            helperText="Leave blank if currently working here"
                            className="dark:[color-scheme:dark]"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : (currentExp ? 'Update' : 'Add Role')}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div >
    );
}
