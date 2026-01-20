import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Plus, Edit, Trash2, X, ChevronUp, ChevronDown } from 'lucide-react';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

interface ExperienceFormData {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
}

export default function Experiences() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<any>(null);
  const [formData, setFormData] = useState<ExperienceFormData>({
    company: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    responsibilities: [],
    achievements: [],
    technologies: [],
  });
  const [respInput, setRespInput] = useState('');
  const [achInput, setAchInput] = useState('');
  const [techInput, setTechInput] = useState('');
  
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-experiences'],
    queryFn: async () => {
      const response = await api.get('/experiences');
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: ExperienceFormData) => api.post('/experiences', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-experiences'] });
      toast.success('Experience created successfully');
      closeModal();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create experience');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ExperienceFormData }) => 
      api.patch(`/experiences/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-experiences'] });
      toast.success('Experience updated successfully');
      closeModal();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update experience');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/experiences/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-experiences'] });
      toast.success('Experience deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete experience');
    },
  });

  const reorderMutation = useMutation({
    mutationFn: ({ id, order }: { id: string; order: number }) => 
      api.patch(`/experiences/${id}`, { order }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-experiences'] });
    },
  });

  const openAddModal = () => {
    setEditingExperience(null);
    setFormData({
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      responsibilities: [],
      achievements: [],
      technologies: [],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (experience: any) => {
    setEditingExperience(experience);
    setFormData({
      company: experience.company,
      position: experience.position,
      location: experience.location,
      startDate: experience.startDate ? new Date(experience.startDate).toISOString().split('T')[0] : '',
      endDate: experience.endDate ? new Date(experience.endDate).toISOString().split('T')[0] : '',
      current: experience.current || false,
      description: experience.description,
      responsibilities: experience.responsibilities || [],
      achievements: experience.achievements || [],
      technologies: experience.technologies || [],
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExperience(null);
    setRespInput('');
    setAchInput('');
    setTechInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      endDate: formData.current ? undefined : formData.endDate || undefined,
    };
    
    if (editingExperience) {
      updateMutation.mutate({ id: editingExperience._id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const addResponsibility = () => {
    if (respInput.trim() && !formData.responsibilities.includes(respInput.trim())) {
      setFormData({
        ...formData,
        responsibilities: [...formData.responsibilities, respInput.trim()],
      });
      setRespInput('');
    }
  };

  const removeResponsibility = (resp: string) => {
    setFormData({
      ...formData,
      responsibilities: formData.responsibilities.filter(r => r !== resp),
    });
  };

  const addAchievement = () => {
    if (achInput.trim() && !formData.achievements.includes(achInput.trim())) {
      setFormData({
        ...formData,
        achievements: [...formData.achievements, achInput.trim()],
      });
      setAchInput('');
    }
  };

  const removeAchievement = (ach: string) => {
    setFormData({
      ...formData,
      achievements: formData.achievements.filter(a => a !== ach),
    });
  };

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()],
      });
      setTechInput('');
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter(t => t !== tech),
    });
  };

  const moveExperience = (exp: any, direction: 'up' | 'down') => {
    const experiences = data?.data || [];
    const currentIndex = experiences.findIndex((e: any) => e._id === exp._id);
    
    if (direction === 'up' && currentIndex > 0) {
      reorderMutation.mutate({ id: exp._id, order: exp.order - 1 });
    } else if (direction === 'down' && currentIndex < experiences.length - 1) {
      reorderMutation.mutate({ id: exp._id, order: exp.order + 1 });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  if (isLoading) {
    return <div className="p-8">Loading experiences...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">Error loading experiences: {(error as any).message}</div>;
  }

  const experiences = data?.data || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Experience</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Add Experience
        </button>
      </div>

      {experiences.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          No experiences yet. Click "Add Experience" to add your first work experience.
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp: any, index: number) => (
            <div key={exp._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{exp.position}</h3>
                  <p className="text-lg text-blue-600 mt-1">{exp.company}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    📍 {exp.location} • {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </p>
                  <p className="text-gray-700 mt-3">{exp.description}</p>
                  
                  {exp.responsibilities?.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Responsibilities:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {exp.responsibilities.map((resp: string, i: number) => (
                          <li key={i} className="text-sm text-gray-600">{resp}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {exp.achievements?.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Achievements:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {exp.achievements.map((ach: string, i: number) => (
                          <li key={i} className="text-sm text-gray-600">{ach}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {exp.technologies?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {exp.technologies.map((tech: string) => (
                        <span key={tech} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveExperience(exp, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      <ChevronUp size={20} />
                    </button>
                    <button
                      onClick={() => moveExperience(exp, 'down')}
                      disabled={index === experiences.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      <ChevronDown size={20} />
                    </button>
                  </div>
                  <button 
                    onClick={() => openEditModal(exp)}
                    className="p-2 text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this experience?')) {
                        deleteMutation.mutate(exp._id);
                      }
                    }}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
              <h2 className="text-2xl font-bold">
                {editingExperience ? 'Edit Experience' : 'Add New Experience'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Company & Position */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Google, Microsoft, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position/Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Senior Software Engineer"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="San Francisco, CA (Remote)"
                />
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date {!formData.current && '*'}
                  </label>
                  <input
                    type="date"
                    required={!formData.current}
                    disabled={formData.current}
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </div>

              {/* Current Position Checkbox */}
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.current}
                    onChange={(e) => setFormData({ ...formData, current: e.target.checked, endDate: '' })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">I currently work here</span>
                </label>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief overview of your role and what you do/did..."
                />
              </div>

              {/* Responsibilities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Responsibilities
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={respInput}
                    onChange={(e) => setRespInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addResponsibility())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Led a team of 5 developers..."
                  />
                  <button
                    type="button"
                    onClick={addResponsibility}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.responsibilities.map((resp, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                      <span className="flex-1 text-sm text-gray-700">• {resp}</span>
                      <button
                        type="button"
                        onClick={() => removeResponsibility(resp)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Achievements
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={achInput}
                    onChange={(e) => setAchInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Reduced server costs by 40%..."
                  />
                  <button
                    type="button"
                    onClick={addAchievement}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.achievements.map((ach, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 bg-green-50 rounded">
                      <span className="flex-1 text-sm text-gray-700">🏆 {ach}</span>
                      <button
                        type="button"
                        onClick={() => removeAchievement(ach)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technologies Used
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="React, Node.js, AWS..."
                  />
                  <button
                    type="button"
                    onClick={addTechnology}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTechnology(tech)}
                        className="hover:text-blue-600"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
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
                    : editingExperience ? 'Update Experience' : 'Add Experience'
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
