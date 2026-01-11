'use client';

import { useState, useEffect } from 'react';
import { AdminTable, AdminForm, Modal, Button } from '@/components';
import toast from 'react-hot-toast';

export default function UserSkillsPage() {
    const [userSkills, setUserSkills] = useState([]);
    const [users, setUsers] = useState([]);
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
    const [search, setSearch] = useState('');


    const fetchData = async (page = 1) => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: '10',
                search
            });

            const [usRes, uRes, sRes] = await Promise.all([
                fetch(`/api/admin/user-skills?${queryParams}`),
                fetch('/api/admin/users?limit=1000'),
                fetch('/api/admin/skills?limit=1000')
            ]);

            if (usRes.ok && uRes.ok && sRes.ok) {
                const usData = await usRes.json();
                const uData = await uRes.json();
                const sData = await sRes.json();

                setUserSkills(usData.items);
                setPagination({
                    currentPage: usData.pagination.page,
                    totalPages: usData.pagination.totalPages
                });

                setUsers(uData.items || []);
                setSkills(sData.items || []);
            } else {
                toast.error('Failed to fetch data');
            }
        } catch (error) {
            toast.error('Error loading data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(1);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchData(1);
    };

    const handleCreate = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item) => {
        setEditingItem({
            id: item.UserSkillID,
            userId: item.UserID,
            skillDefId: item.SkillDefID,
            proficiencyLevel: item.ProficiencyLevel,
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (item) => {
        if (!confirm('Remove this skill assignment?')) return;

        try {
            const res = await fetch(`/api/admin/user-skills?id=${item.UserSkillID}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Assignment removed');
                fetchData(pagination.currentPage);
            } else {
                toast.error('Failed to remove');
            }
        } catch (error) {
            toast.error('Error removing assignment');
        }
    };

    const handleSubmit = async (formData) => {
        try {
            const method = editingItem ? 'PUT' : 'POST';
            const body = editingItem ? { ...formData, id: editingItem.id } : formData;

            const res = await fetch('/api/admin/user-skills', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                toast.success(editingItem ? 'Assignment updated' : 'Assignment created');
                setIsModalOpen(false);
                fetchData(pagination.currentPage);
            } else {
                const data = await res.json();
                toast.error(data.error || 'Operation failed');
            }
        } catch (error) {
            toast.error('Error submitting form');
        }
    };

    const columns = [
        { key: 'UserName', label: 'User' },
        { key: 'SkillName', label: 'Skill' },
        {
            key: 'ProficiencyLevel', label: 'Level', render: (val) => (
                <div className="w-24 bg-gray-700 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${val}%` }}></div>
                </div>
            )
        },
    ];

    const fields = [
        { name: 'userId', label: 'User', type: 'search-select', options: users.map(u => ({ value: u.UserID, label: u.FullName })), required: true },
        { name: 'skillDefId', label: 'Skill', type: 'select', options: skills.map(s => ({ value: s.SkillDefID, label: s.SkillName })), required: true },
        { name: 'proficiencyLevel', label: 'Proficiency (0-100)', type: 'text', required: true },
    ];

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Skill Assignments</h1>
                <Button onClick={handleCreate} className="bg-rose-500 hover:bg-rose-600 border-none text-white">
                    Assign Skill
                </Button>
            </div>

            <div className="flex gap-4 items-center bg-white/5 p-4 rounded-xl border border-white/10">
                <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                    <input
                        type="text"
                        placeholder="Search skill name or user..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 w-full"
                    />
                    <Button type="submit" className="bg-white/10 hover:bg-white/20 text-white">Search</Button>
                </form>
            </div>

            <AdminTable
                columns={columns}
                data={userSkills}
                isLoading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                pagination={{
                    ...pagination,
                    onPageChange: (page) => fetchData(page)
                }}
            />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Assignment' : 'New Assignment'}>
                <AdminForm
                    fields={fields}
                    initialData={editingItem}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
}
