'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    skillDefID: '',
    proficiencyLevel: 5,
  });

  useEffect(() => {
    fetchSkills();
    fetchAllSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await fetch('/api/skills');
      if (res.ok) {
        const data = await res.json();
        setSkills(data.skills);
      }
    } catch (error) {
      toast.error('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllSkills = async () => {
    try {
      const res = await fetch('/api/skills/definitions');
      if (res.ok) {
        const data = await res.json();
        setAllSkills(data.skills);
      }
    } catch (error) {
      console.error('Failed to load skill definitions');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        toast.success('Skill added!');
        setShowModal(false);
        setFormData({ skillDefID: '', proficiencyLevel: 5 });
        fetchSkills();
      } else {
        toast.error(data.error || 'Operation failed');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleUpdateProficiency = async (userSkillID, newLevel) => {
    try {
      const res = await fetch(`/api/skills/${userSkillID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proficiencyLevel: newLevel }),
      });
      
      if (res.ok) {
        toast.success('Proficiency updated');
        fetchSkills();
      }
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this skill?')) return;
    
    try {
      const res = await fetch(`/api/skills/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Skill removed');
        fetchSkills();
      }
    } catch (error) {
      toast.error('Failed to remove skill');
    }
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.Category]) acc[skill.Category] = [];
    acc[skill.Category].push(skill);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">My Skills</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
            >
              + Add Skill
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
        ) : skills.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">No skills yet</h3>
            <p className="text-gray-600 mb-4">Start by adding your technical skills!</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
            >
              Add Your First Skill
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <div key={category} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">{category}</h2>
                <div className="space-y-4">
                  {categorySkills.map((skill) => (
                    <div key={skill.UserSkillID} className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{skill.SkillName}</span>
                          <span className="text-sm text-gray-600">
                            Level {skill.ProficiencyLevel}/10
                          </span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={skill.ProficiencyLevel}
                          onChange={(e) => handleUpdateProficiency(skill.UserSkillID, parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                      </div>
                      <button
                        onClick={() => handleDelete(skill.UserSkillID)}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add New Skill</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Skill *
                </label>
                <select
                  required
                  value={formData.skillDefID}
                  onChange={(e) => setFormData({ ...formData, skillDefID: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Choose a skill...</option>
                  {allSkills.map((skill) => (
                    <option key={skill.SkillDefID} value={skill.SkillDefID}>
                      {skill.SkillName} ({skill.Category})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proficiency Level: {formData.proficiencyLevel}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.proficiencyLevel}
                  onChange={(e) => setFormData({ ...formData, proficiencyLevel: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Beginner</span>
                  <span>Expert</span>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                >
                  Add Skill
                </button>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setFormData({ skillDefID: '', proficiencyLevel: 5 }); }}
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
