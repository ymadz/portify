'use client';

import { useState, useEffect } from 'react';
import { AdminTable, AdminForm, Modal, Button } from '@/components';
import toast from 'react-hot-toast';

export default function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);

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

            const [projRes, userRes] = await Promise.all([
                fetch(`/api/admin/projects?${queryParams}`),
                fetch('/api/admin/users?limit=1000')
            ]);

            if (projRes.ok && userRes.ok) {
                const projData = await projRes.json();
                const userData = await userRes.json();

                setProjects(projData.items);
                setPagination({
                    currentPage: projData.pagination.page,
                    totalPages: projData.pagination.totalPages
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
        setEditingProject(null);
        setIsModalOpen(true);
    };

    const handleEdit = (project) => {
        setEditingProject({
            id: project.ProjectID,
            userId: project.UserID,
            title: project.Title,
            description: project.Description,
            projectUrl: project.ProjectURL,
            dateCompleted: project.DateCompleted ? project.DateCompleted.split('T')[0] : '',
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (project) => {
        if (!confirm('Delete this project?')) return;

        try {
            const res = await fetch(`/api/admin/projects?id=${project.ProjectID}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Project deleted');
                fetchData(pagination.currentPage);
            } else {
                toast.error('Failed to delete');
            }
        } catch (error) {
            toast.error('Error deleting project');
        }
    };

    const handleSubmit = async (formData) => {
        try {
            const method = editingProject ? 'PUT' : 'POST';
            const body = editingProject ? { ...formData, id: editingProject.id } : formData;

            const res = await fetch('/api/admin/projects', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                toast.success(editingProject ? 'Project updated' : 'Project created');
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
        { key: 'Title', label: 'Title' },
        { key: 'UserName', label: 'User', render: (val) => <span className="text-gray-400">{val}</span> },
        { key: 'DateCompleted', label: 'Completed', render: (val) => val ? new Date(val).toLocaleDateString() : '-' },
        { key: 'ProjectURL', label: 'URL', render: (val) => val ? <a href={val} target="_blank" className="text-rose-400 hover:underline">Link</a> : '-' },
    ];

    const fields = [
        { name: 'userId', label: 'User', type: 'search-select', options: users.map(u => ({ value: u.UserID, label: u.FullName })), required: true },
        { name: 'title', label: 'Project Title', required: true },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'projectUrl', label: 'Project URL' },
        { name: 'dateCompleted', label: 'Completion Date', type: 'date' },
    ];

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Projects</h1>
                <Button onClick={handleCreate} className="bg-rose-500 hover:bg-rose-600 border-none text-white">
                    Add Project
                </Button>
            </div>

            <div className="flex gap-4 items-center bg-white/5 p-4 rounded-xl border border-white/10">
                <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                    <input
                        type="text"
                        placeholder="Search project title or user..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 w-full"
                    />
                    <Button type="submit" className="bg-white/10 hover:bg-white/20 text-white">Search</Button>
                </form>
            </div>

            <AdminTable
                columns={columns}
                data={projects}
                isLoading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                pagination={{
                    ...pagination,
                    onPageChange: (page) => fetchData(page)
                }}
            />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProject ? 'Edit Project' : 'New Project'}>
                <AdminForm
                    fields={fields}
                    initialData={editingProject}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
}
