'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Card, Button, Modal, SearchableSelect, Input, Badge, EmptyState } from '@/components';

export default function SkillsPage() {
    const [skills, setSkills] = useState([]);
    const [definitions, setDefinitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ skillDefID: '', proficiencyLevel: 5 });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch Data
    const fetchData = async () => {
        try {
            const [skillsRes, defsRes] = await Promise.all([
                fetch('/api/skills'),
                fetch('/api/skills/definitions')
            ]);

            if (skillsRes.ok && defsRes.ok) {
                setSkills((await skillsRes.json()).skills || []);
                setDefinitions(await defsRes.json());
            }
        } catch (error) {
            toast.error('Failed to load skills');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Add Skill
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/skills', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Failed to add skill');
            }

            toast.success('Skill added!');
            setIsModalOpen(false);
            setFormData({ skillDefID: '', proficiencyLevel: 5 });
            fetchData();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Remove Skill
    const handleDelete = async (id) => {
        if (!confirm('Remove this skill from your profile?')) return;
        try {
            await fetch(`/api/skills/${id}`, { method: 'DELETE' });
            toast.success('Skill removed');
            setSkills(skills.filter(s => s.UserSkillID !== id));
        } catch (error) {
            toast.error('Failed to remove skill');
        }
    };

    // Group Skills by Category
    const groupedSkills = skills.reduce((acc, skill) => {
        const cat = skill.Category || 'Other';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(skill);
        return acc;
    }, {});

    if (loading) return <div className="text-center py-20 text-gray-500 animate-pulse">Loading skills...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div className="flex justify-between items-center w-full">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">My Skills</h1>
                        <p className="text-gray-400">Manage your technical expertise and proficiency.</p>
                    </div>
                    <Button onClick={() => setIsModalOpen(true)}>+ Add Skill</Button>
                </div>
            </div>

            {/* Skills Grid or Empty State */}
            {skills.length === 0 ? (
                <EmptyState
                    title="No Skills Added"
                    description="Highlight your technical expertise. Add your first skill now."
                    actionLabel="Add Skill"
                    onAction={() => setIsModalOpen(true)}
                    icon="🎯"
                />
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {Object.entries(groupedSkills).map(([category, items]) => (
                        <div key={category} className="glass-card rounded-3xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4 border-b border-white/5 pb-2 flex items-center justify-between">
                                {category}
                                <Badge variant="secondary" size="sm">{items.length}</Badge>
                            </h3>
                            <div className="space-y-3">
                                {items.map(skill => (
                                    <div key={skill.UserSkillID} className="group flex items-center gap-4 bg-white/5 p-3 rounded-2xl hover:bg-white/10 transition-colors border border-transparent hover:border-white/10">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-lg font-bold border border-white/10 text-gray-300">
                                            {skill.SkillName.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-medium text-gray-200">{skill.SkillName}</span>
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleDelete(skill.UserSkillID)}
                                                        className="text-gray-500 hover:text-red-400 transition-colors"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            </div>
                                            {/* Proficiency Bar */}
                                            <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                                                    style={{ width: `${(skill.ProficiencyLevel * 10)}%` }}
                                                ></div>
                                            </div>
                                            <div className="text-xs text-right mt-1 text-gray-500">Lvl {skill.ProficiencyLevel}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Skill Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Skill"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <SearchableSelect
                        label="Select Skill"
                        value={formData.skillDefID}
                        onChange={(value) => setFormData({ ...formData, skillDefID: value })}
                        options={definitions.map(def => ({
                            value: def.SkillDefID,
                            label: `${def.SkillName} (${def.Category})`
                        }))}
                        placeholder="Search for a skill..."
                        required
                    />

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 block">
                            Proficiency Level (1-10)
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={formData.proficiencyLevel}
                                onChange={(e) => setFormData({ ...formData, proficiencyLevel: parseInt(e.target.value) })}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                            />
                            <div className="w-12 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center font-bold text-purple-400">
                                {formData.proficiencyLevel}
                            </div>
                        </div>
                        <p className="text-xs text-gray-500">1 = Novice, 10 = Expert</p>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Adding...' : 'Add Skill'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
