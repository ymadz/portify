'use client';

import { useState, useEffect } from 'react';
import { AdminTable, AdminForm, Modal, Button } from '@/components';
import toast from 'react-hot-toast';

export default function ExperiencePage() {
    const [experience, setExperience] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExp, setEditingExp] = useState(null);

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

            const [expRes, userRes] = await Promise.all([
                fetch(`/api/admin/experience?${queryParams}`),
                fetch('/api/admin/users?limit=1000')
            ]);

            if (expRes.ok && userRes.ok) {
                const expData = await expRes.json();
                const userData = await userRes.json();

                setExperience(expData.items);
                setPagination({
                    currentPage: expData.pagination.page,
                    totalPages: expData.pagination.totalPages
                });

                setUsers(userData.items || []);
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
        setEditingExp(null);
        setIsModalOpen(true);
    };

    const handleEdit = (exp) => {
        setEditingExp({
            id: exp.ExpID,
            userId: exp.UserID,
            jobTitle: exp.JobTitle,
            company: exp.Company,
            startDate: exp.StartDate ? exp.StartDate.split('T')[0] : '',
            endDate: exp.EndDate ? exp.EndDate.split('T')[0] : '',
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (exp) => {
        if (!confirm('Delete this experience record?')) return;

        try {
            const res = await fetch(`/api/admin/experience?id=${exp.ExpID}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Record deleted');
                fetchData(pagination.currentPage);
            } else {
                toast.error('Failed to delete');
            }
        } catch (error) {
            toast.error('Error deleting record');
        }
    };

    const handleSubmit = async (formData) => {
        try {
            const method = editingExp ? 'PUT' : 'POST';
            const body = editingExp ? { ...formData, id: editingExp.id } : formData;

            const res = await fetch('/api/admin/experience', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                toast.success(editingExp ? 'Record updated' : 'Record created');
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
        { key: 'JobTitle', label: 'Job Title' },
        { key: 'Company', label: 'Company' },
        { key: 'UserName', label: 'User', render: (val) => <span className="text-gray-400">{val}</span> },
        { key: 'StartDate', label: 'Start Date', render: (val) => new Date(val).toLocaleDateString() },
        { key: 'EndDate', label: 'End Date', render: (val) => val ? new Date(val).toLocaleDateString() : 'Present' },
    ];

    const fields = [
        { name: 'userId', label: 'User', type: 'search-select', options: users.map(u => ({ value: u.UserID, label: u.FullName })), required: true },
        { name: 'jobTitle', label: 'Job Title', required: true },
        { name: 'company', label: 'Company', required: true },
        { name: 'startDate', label: 'Start Date', type: 'date', required: true },
        { name: 'endDate', label: 'End Date', type: 'date' },
    ];

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Experience</h1>
                <Button onClick={handleCreate} className="bg-rose-500 hover:bg-rose-600 border-none text-white">
                    Add Experience
                </Button>
            </div>

            <div className="flex gap-4 items-center bg-white/5 p-4 rounded-xl border border-white/10">
                <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                    <input
                        type="text"
                        placeholder="Search job title, company, or user..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 w-full"
                    />
                    <Button type="submit" className="bg-white/10 hover:bg-white/20 text-white">Search</Button>
                </form>
            </div>

            <AdminTable
                columns={columns}
                data={experience}
                isLoading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                pagination={{
                    ...pagination,
                    onPageChange: (page) => fetchData(page)
                }}
            />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingExp ? 'Edit Experience' : 'New Experience'}>
                <AdminForm
                    fields={fields}
                    initialData={editingExp}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
}
