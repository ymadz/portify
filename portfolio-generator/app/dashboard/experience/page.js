'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const res = await fetch('/api/experience');
      if (res.ok) {
        const data = await res.json();
        setExperiences(data.experience);
      }
    } catch (error) {
      toast.error('Failed to load experience');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Trigger validation will happen in the API
    try {
      const url = editingExp ? `/api/experience/${editingExp.ExpID}` : '/api/experience';
      const method = editingExp ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          endDate: formData.endDate || null, // null means "Present"
        }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        toast.success(editingExp ? 'Experience updated!' : 'Experience added!');
        setShowModal(false);
        setEditingExp(null);
        setFormData({ jobTitle: '', company: '', startDate: '', endDate: '' });
        fetchExperiences();
      } else {
        // Display trigger validation error
        toast.error(data.error || 'Operation failed');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleEdit = (exp) => {
    setEditingExp(exp);
    setFormData({
      jobTitle: exp.JobTitle,
      company: exp.Company,
      startDate: exp.StartDate ? exp.StartDate.split('T')[0] : '',
      endDate: exp.EndDate ? exp.EndDate.split('T')[0] : '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this experience?')) return;
    
    try {
      const res = await fetch(`/api/experience/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Experience deleted');
        fetchExperiences();
      }
    } catch (error) {
      toast.error('Failed to delete experience');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Work Experience</h1>
          <div className="flex gap-4">
            <button
              onClick={() => { setEditingExp(null); setFormData({ jobTitle: '', company: '', startDate: '', endDate: '' }); setShowModal(true); }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
            >
              + Add Experience
            </button>
            <Link href="/dashboard" className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center text-gray-600">Loading...</div>
        ) : experiences.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-6xl mb-4">💼</div>
            <h3 className="text-xl font-semibold mb-2">No experience yet</h3>
            <p className="text-gray-600 mb-4">Start building your professional timeline!</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
            >
              Add Your First Experience
            </button>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {experiences.map((exp) => (
                <div key={exp.ExpID} className="bg-white rounded-lg shadow-md p-6 relative">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{exp.JobTitle}</h3>
                      <p className="text-indigo-600 font-medium">{exp.Company}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(exp)}
                        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(exp.ExpID)}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    {new Date(exp.StartDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} -{' '}
                    {exp.EndDate ? new Date(exp.EndDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {editingExp ? 'Edit Experience' : 'Add New Experience'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company *
                </label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date (leave empty if current)
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  ⚠️ Trigger validation: End date must be after start date
                </p>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                >
                  {editingExp ? 'Update' : 'Add'} Experience
                </button>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingExp(null); }}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
