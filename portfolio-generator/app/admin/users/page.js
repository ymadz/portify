'use client';

import { useState, useEffect } from 'react';
import { AdminTable, AdminForm, Modal, Button } from '@/components';
import toast from 'react-hot-toast';

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    const fetchUsers = async (page = 1) => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: '10',
                search,
                role: roleFilter
            });

            const res = await fetch(`/api/admin/users?${queryParams}`);
            if (res.ok) {
                const data = await res.json();
                setUsers(data.items);
                setPagination({
                    currentPage: data.pagination.page,
                    totalPages: data.pagination.totalPages
                });
            } else {
                toast.error('Failed to fetch users');
            }
        } catch (error) {
            toast.error('Error loading users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(1);
    }, [roleFilter]); // Auto-fetch on role change

    const handleSearch = (e) => {
        e.preventDefault();
        fetchUsers(1);
    };

    const handleCreate = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleEdit = (user) => {
        setEditingUser({
            id: user.UserID,
            fullName: user.FullName,
            email: user.Email,
            bio: user.Bio,
            role: user.Role || 'user', // Assuming Role might be returned
            password: '', // Don't fill password on edit usually, but form requires it? Let's check logic.
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (user) => {
        if (!confirm('Are you sure you want to delete this user? This will delete all their data.')) return;

        try {
            const res = await fetch(`/api/admin/users?id=${user.UserID}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('User deleted');
                fetchUsers(pagination.currentPage);
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to delete');
            }
        } catch (error) {
            toast.error('Error deleting user');
        }
    };

    const handleSubmit = async (formData) => {
        try {
            const method = editingUser ? 'PUT' : 'POST';
            const body = editingUser ? { ...formData, id: editingUser.id } : formData;

            // If editing and password is empty, remove it (backend should handle not updating it)
            // But my backend PUT for users doesn't update password currently.
            // My backend POST requires password.

            const res = await fetch('/api/admin/users', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                toast.success(editingUser ? 'User updated' : 'User created');
                setIsModalOpen(false);
                fetchUsers(pagination.currentPage);
            } else {
                const data = await res.json();
                toast.error(data.error || 'Operation failed');
            }
        } catch (error) {
            toast.error('Error submitting form');
        }
    };

    const columns = [
        { key: 'FullName', label: 'Name' },
        { key: 'Email', label: 'Email' },
        { key: 'Role', label: 'Role', render: (val) => <span className={`uppercase text-xs font-bold px-2 py-1 rounded ${val === 'admin' ? 'bg-rose-500/20 text-rose-400' : 'bg-gray-500/20 text-gray-400'}`}>{val}</span> },
        { key: 'JoinDate', label: 'Joined', render: (val) => new Date(val).toLocaleDateString() },
    ];

    const fields = [
        { name: 'fullName', label: 'Full Name', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'role', label: 'Role', type: 'select', options: [{ value: 'user', label: 'User' }, { value: 'admin', label: 'Admin' }], required: true },
        { name: 'bio', label: 'Bio', type: 'textarea' },
    ];

    // Only add password field for new users
    if (!editingUser) {
        fields.splice(2, 0, { name: 'password', label: 'Password', type: 'password', required: true });
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Users</h1>
                <Button onClick={handleCreate} className="bg-rose-500 hover:bg-rose-600 border-none text-white">
                    Add User
                </Button>
            </div>

            <div className="flex gap-4 items-center bg-white/5 p-4 rounded-xl border border-white/10">
                <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                    <input
                        type="text"
                        placeholder="Search name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 w-full"
                    />
                    <Button type="submit" className="bg-white/10 hover:bg-white/20 text-white">Search</Button>
                </form>
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-rose-500"
                >
                    <option value="">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                </select>
            </div>

            <AdminTable
                columns={columns}
                data={users}
                isLoading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                pagination={{
                    ...pagination,
                    onPageChange: (page) => fetchUsers(page)
                }}
            />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingUser ? 'Edit User' : 'New User'}>
                <AdminForm
                    fields={fields}
                    initialData={editingUser}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
}
