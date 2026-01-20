import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Plus, Edit, Trash2, X, ChevronUp, ChevronDown } from 'lucide-react';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

interface SkillFormData {
  name: string;
  category: string;
  proficiency: string;
  icon?: string;
}

export default function Skills() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<any>(null);
  const [formData, setFormData] = useState<SkillFormData>({
    name: '',
    category: 'frontend',
    proficiency: 'intermediate',
    icon: '',
  });
  
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-skills'],
    queryFn: async () => {
      const response = await api.get('/skills');
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: SkillFormData) => api.post('/skills', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-skills'] });
      toast.success('Skill created successfully');
      closeModal();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create skill');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: SkillFormData }) => 
      api.patch(`/skills/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-skills'] });
      toast.success('Skill updated successfully');
      closeModal();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update skill');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/skills/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-skills'] });
      toast.success('Skill deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete skill');
    },
  });

  const reorderMutation = useMutation({
    mutationFn: ({ id, order }: { id: string; order: number }) => 
      api.patch(`/skills/${id}`, { order }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-skills'] });
    },
  });

  const openAddModal = () => {
    setEditingSkill(null);
    setFormData({
      name: '',
      category: 'frontend',
      proficiency: 'intermediate',
      icon: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (skill: any) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      icon: skill.icon || '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSkill(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      icon: formData.icon?.trim() || undefined,
    };
    
    if (editingSkill) {
      updateMutation.mutate({ id: editingSkill._id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const moveSkill = (skill: any, direction: 'up' | 'down') => {
    const skills = data?.data || [];
    const currentIndex = skills.findIndex((s: any) => s._id === skill._id);
    
    if (direction === 'up' && currentIndex > 0) {
      reorderMutation.mutate({ id: skill._id, order: skill.order - 1 });
    } else if (direction === 'down' && currentIndex < skills.length - 1) {
      reorderMutation.mutate({ id: skill._id, order: skill.order + 1 });
    }
  };

  const getProficiencyColor = (proficiency: string) => {
    switch (proficiency) {
      case 'beginner': return 'bg-yellow-100 text-yellow-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-green-100 text-green-800';
      case 'expert': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'frontend': return 'bg-pink-100 text-pink-800';
      case 'backend': return 'bg-indigo-100 text-indigo-800';
      case 'database': return 'bg-orange-100 text-orange-800';
      case 'devops': return 'bg-teal-100 text-teal-800';
      case 'ai-ml': return 'bg-violet-100 text-violet-800';
      case 'tools': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading skills...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">Error loading skills: {(error as any).message}</div>;
  }

  const skills = data?.data || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Skills</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Add Skill
        </button>
      </div>

      {skills.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          No skills yet. Click "Add Skill" to add your first skill.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Skill Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Proficiency
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Order
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {skills.map((skill: any, index: number) => (
                <tr key={skill._id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {skill.icon && <span className="text-2xl">{skill.icon}</span>}
                      <span className="text-sm font-medium text-gray-900">{skill.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(skill.category)}`}>
                      {skill.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getProficiencyColor(skill.proficiency)}`}>
                      {skill.proficiency}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => moveSkill(skill, 'up')}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button
                        onClick={() => moveSkill(skill, 'down')}
                        disabled={index === skills.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      >
                        <ChevronDown size={16} />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button 
                      onClick={() => openEditModal(skill)}
                      className="text-blue-600 hover:text-blue-800 mr-4"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this skill?')) {
                          deleteMutation.mutate(skill._id);
                        }
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold">
                {editingSkill ? 'Edit Skill' : 'Add New Skill'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Skill Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skill Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="React, Node.js, Python..."
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="database">Database</option>
                  <option value="devops">DevOps</option>
                  <option value="ai-ml">AI/ML</option>
                  <option value="tools">Tools</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Proficiency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proficiency Level *
                </label>
                <select
                  required
                  value={formData.proficiency}
                  onChange={(e) => setFormData({ ...formData, proficiency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              {/* Icon (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon (Emoji - Optional)
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="⚛️ 🚀 💻"
                  maxLength={2}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Add an emoji to represent this skill (e.g., ⚛️ for React)
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                >
                  {createMutation.isPending || updateMutation.isPending 
                    ? 'Saving...' 
                    : editingSkill ? 'Update Skill' : 'Add Skill'
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
