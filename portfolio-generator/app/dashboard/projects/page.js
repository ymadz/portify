'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Card, Button, Modal, Input, Textarea } from '@/components';

export default function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProject, setCurrentProject] = useState(null); // null = create mode
    const [formData, setFormData] = useState({ title: '', description: '', projectUrl: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch Projects
    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/projects');
            if (res.ok) {
                const data = await res.json();
                setProjects(data.projects || []);
            }
        } catch (error) {
            toast.error('Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    // Handle Form Input
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Open Modal
    const openModal = (project = null) => {
        if (project) {
            setCurrentProject(project);
            setFormData({
                title: project.Title,
                description: project.Description,
                projectUrl: project.ProjectURL || ''
            });
        } else {
            setCurrentProject(null);
            setFormData({ title: '', description: '', projectUrl: '' });
        }
        setIsModalOpen(true);
    };

    // Submit Form (Create or Update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const url = currentProject ? `/api/projects/${currentProject.ProjectID}` : '/api/projects';
            const method = currentProject ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Failed to save project');

            toast.success(currentProject ? 'Project updated!' : 'Project created!');
            setIsModalOpen(false);
            fetchProjects();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Delete Project
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        try {
            const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');

            toast.success('Project deleted');
            setProjects(projects.filter(p => p.ProjectID !== id));
        } catch (error) {
            toast.error('Failed to delete project');
        }
    };

    if (loading) return <div className="text-center py-20 text-gray-500 animate-pulse">Loading projects...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">My Projects</h1>
                    <p className="text-gray-400">Showcase your best work to the world.</p>
                </div>
                <Button onClick={() => openModal()}>+ Add Project</Button>
            </div>

            {/* Projects Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                {projects.map((project) => (
                    <div key={project.ProjectID} className="glass-card rounded-3xl p-6 group hover:border-white/20 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-white group-hover:text-rose-400 transition-colors">
                                {project.Title}
                            </h3>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => { e.stopPropagation(); openModal(project); }}
                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(project.ProjectID); }}
                                    className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>

                        <p className="text-gray-400 mb-6 line-clamp-3 text-sm leading-relaxed">
                            {project.Description}
                        </p>

                        <div className="flex items-center justify-between mt-auto">
                            {project.ProjectURL && (
                                <a
                                    href={project.ProjectURL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-medium text-rose-400 hover:text-rose-300 flex items-center gap-1"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    View Project ↗
                                </a>
                            )}
                            <span className="text-xs text-gray-600 font-mono">
                                {new Date(project.DateCompleted).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentProject ? 'Edit Project' : 'Add New Project'}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Project Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. E-commerce Platform"
                        required
                    />

                    <Textarea
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe the technologies used and impact..."
                        rows={4}
                        required
                    />

                    <Input
                        label="Project URL"
                        name="projectUrl"
                        value={formData.projectUrl}
                        onChange={handleChange}
                        placeholder="https://github.com/username/project"
                    />

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : (currentProject ? 'Update Project' : 'Create Project')}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div >
    );
}
