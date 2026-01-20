import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Plus, Edit, Trash2, X, ChevronUp, ChevronDown, GraduationCap } from 'lucide-react';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

interface EducationFormData {
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  grade: string;
  description: string;
}

export default function Education() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<any>(null);
  const [formData, setFormData] = useState<EducationFormData>({
    institution: '',
    degree: '',
    field: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    grade: '',
    description: '',
  });
  
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-education'],
    queryFn: async () => {
      const response = await api.get('/education');
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: EducationFormData) => api.post('/education', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-education'] });
      toast.success('Education created successfully');
      closeModal();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create education');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: EducationFormData }) => 
      api.patch(`/education/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-education'] });
      toast.success('Education updated successfully');
      closeModal();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update education');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/education/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-education'] });
      toast.success('Education deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete education');
    },
  });

  const reorderMutation = useMutation({
    mutationFn: ({ id, order }: { id: string; order: number }) => 
      api.patch(`/education/${id}`, { order }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-education'] });
    },
  });

  const openAddModal = () => {
    setEditingEducation(null);
    setFormData({
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      grade: '',
      description: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (education: any) => {
    setEditingEducation(education);
    setFormData({
      institution: education.institution,
      degree: education.degree,
      field: education.field,
      location: education.location,
      startDate: education.startDate ? new Date(education.startDate).toISOString().split('T')[0] : '',
      endDate: education.endDate ? new Date(education.endDate).toISOString().split('T')[0] : '',
      current: education.current || false,
      grade: education.grade || '',
      description: education.description || '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEducation(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      endDate: formData.current ? undefined : formData.endDate || undefined,
    };
    
    if (editingEducation) {
      updateMutation.mutate({ id: editingEducation._id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const moveEducation = (edu: any, direction: 'up' | 'down') => {
    const educations = data?.data || [];
    const currentIndex = educations.findIndex((e: any) => e._id === edu._id);
    
    if (direction === 'up' && currentIndex > 0) {
      reorderMutation.mutate({ id: edu._id, order: edu.order - 1 });
    } else if (direction === 'down' && currentIndex < educations.length - 1) {
      reorderMutation.mutate({ id: edu._id, order: edu.order + 1 });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  if (isLoading) {
    return <div className="p-8">Loading education...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">Error loading education: {(error as any).message}</div>;
  }

  const educations = data?.data || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Education</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Add Education
        </button>
      </div>

      {educations.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          No education records yet. Click "Add Education" to add your first degree.
        </div>
      ) : (
        <div className="space-y-4">
          {educations.map((edu: any, index: number) => (
            <div key={edu._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div className="flex gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="text-blue-600" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{edu.degree}</h3>
                    <p className="text-lg text-blue-600 mt-1">{edu.institution}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      📚 {edu.field} • 📍 {edu.location}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate)}
                    </p>
                    {edu.grade && (
                      <p className="text-sm text-gray-700 mt-2">
                        <span className="font-semibold">Grade:</span> {edu.grade}
                      </p>
                    )}
                    {edu.description && (
                      <p className="text-gray-700 mt-3">{edu.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveEducation(edu, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      <ChevronUp size={20} />
                    </button>
                    <button
                      onClick={() => moveEducation(edu, 'down')}
                      disabled={index === educations.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      <ChevronDown size={20} />
                    </button>
                  </div>
                  <button 
                    onClick={() => openEditModal(edu)}
                    className="p-2 text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this education record?')) {
                        deleteMutation.mutate(edu._id);
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
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
              <h2 className="text-2xl font-bold">
                {editingEducation ? 'Edit Education' : 'Add New Education'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Institution */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Institution/University *
                </label>
                <input
                  type="text"
                  required
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Harvard University, MIT, Stanford..."
                />
              </div>

              {/* Degree & Field */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Degree *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="B.Sc, M.Sc, PhD, B.Tech..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Field of Study *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.field}
                    onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Computer Science, Engineering..."
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
                  placeholder="Cambridge, MA"
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

              {/* Current Checkbox */}
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.current}
                    onChange={(e) => setFormData({ ...formData, current: e.target.checked, endDate: '' })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">I currently study here</span>
                </label>
              </div>

              {/* Grade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade/GPA (Optional)
                </label>
                <input
                  type="text"
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="3.9/4.0, First Class, 85%..."
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Relevant coursework, achievements, activities..."
                />
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
                    : editingEducation ? 'Update Education' : 'Add Education'
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
