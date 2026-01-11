'use client';

import { useState, useEffect } from 'react';
import { AdminTable, AdminForm, Modal, Button } from '@/components';
import toast from 'react-hot-toast';

export default function SkillsPage() {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState(null);

    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    const fetchSkills = async (page = 1) => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: '10',
                search,
                category: categoryFilter
            });

            const res = await fetch(`/api/admin/skills?${queryParams}`);
            if (res.ok) {
                const data = await res.json();
                setSkills(data.items);
                setPagination({
                    currentPage: data.pagination.page,
                    totalPages: data.pagination.totalPages
                });
            } else {
                toast.error('Failed to fetch skills');
            }
        } catch (error) {
            toast.error('Error loading skills');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSkills(1);
    }, [categoryFilter]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchSkills(1);
    };

    const handleCreate = () => {
        setEditingSkill(null);
        setIsModalOpen(true);
    };

    const handleEdit = (skill) => {
        setEditingSkill({
            id: skill.SkillDefID,
            skillName: skill.SkillName,
            category: skill.Category,
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (skill) => {
        if (!confirm('Delete this skill definition? Note: This might fail if users are assigned this skill.')) return;

        try {
            const res = await fetch(`/api/admin/skills?id=${skill.SkillDefID}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Skill deleted');
                fetchSkills(pagination.currentPage);
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to delete');
            }
        } catch (error) {
            toast.error('Error deleting skill');
        }
    };

    const handleSubmit = async (formData) => {
        try {
            const method = editingSkill ? 'PUT' : 'POST';
            const body = editingSkill ? { ...formData, id: editingSkill.id } : formData;

            const res = await fetch('/api/admin/skills', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                toast.success(editingSkill ? 'Skill updated' : 'Skill created');
                setIsModalOpen(false);
                fetchSkills(pagination.currentPage);
            } else {
                const data = await res.json();
                toast.error(data.error || 'Operation failed');
            }
        } catch (error) {
            toast.error('Error submitting form');
        }
    };

    const categoryColors = {
        'Frontend': 'bg-blue-500/20 text-blue-400',
        'Backend': 'bg-emerald-500/20 text-emerald-400',
        'Database': 'bg-amber-500/20 text-amber-400',
        'DevOps': 'bg-rose-500/20 text-rose-400',
        'Mobile': 'bg-purple-500/20 text-purple-400',
        'Language': 'bg-pink-500/20 text-pink-400',
        'Tool': 'bg-cyan-500/20 text-cyan-400',
        'Other': 'bg-gray-500/20 text-gray-400'
    };

    const columns = [
        { key: 'SkillName', label: 'Skill Name' },
        {
            key: 'Category',
            label: 'Category',
            render: (val) => (
                <span className={`${categoryColors[val] || 'bg-gray-500/20 text-gray-400'} px-2 py-1 rounded text-xs font-bold uppercase`}>
                    {val}
                </span>
            )
        },
    ];

    const fields = [
        { name: 'skillName', label: 'Skill Name', required: true },
        {
            name: 'category', label: 'Category', type: 'select', options: [
                { value: 'Frontend', label: 'Frontend' },
                { value: 'Backend', label: 'Backend' },
                { value: 'Database', label: 'Database' },
                { value: 'DevOps', label: 'DevOps' },
                { value: 'Mobile', label: 'Mobile' },
                { value: 'Language', label: 'Language' },
                { value: 'Tool', label: 'Tool' },
                { value: 'Other', label: 'Other' },
            ], required: true
        },
    ];

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Skills Library</h1>
                <Button onClick={handleCreate} className="bg-rose-500 hover:bg-rose-600 border-none text-white">
                    Add Skill
                </Button>
            </div>

            <div className="flex gap-4 items-center bg-white/5 p-4 rounded-xl border border-white/10">
                <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                    <input
                        type="text"
                        placeholder="Search skill name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 w-full"
                    />
                    <Button type="submit" className="bg-white/10 hover:bg-white/20 text-white">Search</Button>
                </form>
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-rose-500"
                >
                    <option value="">All Categories</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Database">Database</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Language">Language</option>
                    <option value="Tool">Tool</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <AdminTable
                columns={columns}
                data={skills}
                isLoading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                pagination={{
                    ...pagination,
                    onPageChange: (page) => fetchSkills(page)
                }}
            />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingSkill ? 'Edit Skill' : 'New Skill'}>
                <AdminForm
                    fields={fields}
                    initialData={editingSkill}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
}
