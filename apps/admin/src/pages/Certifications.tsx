import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Plus, Edit, Trash2, X, ChevronUp, ChevronDown, Award, ExternalLink } from 'lucide-react';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

interface CertificationFormData {
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  credentialId: string;
  credentialUrl: string;
  image: string;
}

export default function Certifications() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCertification, setEditingCertification] = useState<any>(null);
  const [formData, setFormData] = useState<CertificationFormData>({
    title: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    credentialId: '',
    credentialUrl: '',
    image: '',
  });
  
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-certifications'],
    queryFn: async () => {
      const response = await api.get('/certifications');
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: CertificationFormData) => api.post('/certifications', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-certifications'] });
      toast.success('Certification created successfully');
      closeModal();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create certification');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CertificationFormData }) => 
      api.patch(`/certifications/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-certifications'] });
      toast.success('Certification updated successfully');
      closeModal();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update certification');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/certifications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-certifications'] });
      toast.success('Certification deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete certification');
    },
  });

  const reorderMutation = useMutation({
    mutationFn: ({ id, order }: { id: string; order: number }) => 
      api.patch(`/certifications/${id}`, { order }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-certifications'] });
    },
  });

  const openAddModal = () => {
    setEditingCertification(null);
    setFormData({
      title: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      credentialUrl: '',
      image: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (certification: any) => {
    setEditingCertification(certification);
    setFormData({
      title: certification.title,
      issuer: certification.issuer,
      issueDate: certification.issueDate ? new Date(certification.issueDate).toISOString().split('T')[0] : '',
      expiryDate: certification.expiryDate ? new Date(certification.expiryDate).toISOString().split('T')[0] : '',
      credentialId: certification.credentialId || '',
      credentialUrl: certification.credentialUrl || '',
      image: certification.image || '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCertification(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCertification) {
      updateMutation.mutate({ id: editingCertification._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const moveCertification = (cert: any, direction: 'up' | 'down') => {
    const certifications = data?.data || [];
    const currentIndex = certifications.findIndex((c: any) => c._id === cert._id);
    
    if (direction === 'up' && currentIndex > 0) {
      reorderMutation.mutate({ id: cert._id, order: cert.order - 1 });
    } else if (direction === 'down' && currentIndex < certifications.length - 1) {
      reorderMutation.mutate({ id: cert._id, order: cert.order + 1 });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const isExpired = (expiryDate: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  if (isLoading) {
    return <div className="p-8">Loading certifications...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">Error loading certifications: {(error as any).message}</div>;
  }

  const certifications = data?.data || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Certifications</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Add Certification
        </button>
      </div>

      {certifications.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          No certifications yet. Click "Add Certification" to add your first certificate.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert: any, index: number) => (
            <div key={cert._id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              {cert.image && (
                <div className="mb-4 flex justify-center">
                  <img src={cert.image} alt={cert.title} className="h-20 object-contain" />
                </div>
              )}
              {!cert.image && (
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                    <Award className="text-purple-600" size={32} />
                  </div>
                </div>
              )}
              
              <h3 className="text-lg font-bold text-gray-900 mb-2">{cert.title}</h3>
              <p className="text-blue-600 font-medium mb-3">{cert.issuer}</p>
              
              <div className="space-y-1 text-sm text-gray-600 mb-4">
                <p>📅 Issued: {formatDate(cert.issueDate)}</p>
                {cert.expiryDate && (
                  <p className={isExpired(cert.expiryDate) ? 'text-red-600' : ''}>
                    {isExpired(cert.expiryDate) ? '❌' : '✅'} Expires: {formatDate(cert.expiryDate)}
                  </p>
                )}
                {cert.credentialId && (
                  <p className="text-xs">ID: {cert.credentialId}</p>
                )}
              </div>

              {cert.credentialUrl && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mb-4"
                >
                  View Credential <ExternalLink size={14} />
                </a>
              )}

              <div className="flex items-center justify-between pt-4 border-t mt-4">
                <div className="flex gap-1">
                  <button
                    onClick={() => moveCertification(cert, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    <ChevronUp size={20} />
                  </button>
                  <button
                    onClick={() => moveCertification(cert, 'down')}
                    disabled={index === certifications.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    <ChevronDown size={20} />
                  </button>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => openEditModal(cert)}
                    className="p-2 text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this certification?')) {
                        deleteMutation.mutate(cert._id);
                      }
                    }}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
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
                {editingCertification ? 'Edit Certification' : 'Add New Certification'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certification Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="AWS Certified Solutions Architect"
                />
              </div>

              {/* Issuer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issuing Organization *
                </label>
                <input
                  type="text"
                  required
                  value={formData.issuer}
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Amazon Web Services, Google, Microsoft..."
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Credential ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Credential ID (Optional)
                </label>
                <input
                  type="text"
                  value={formData.credentialId}
                  onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ABC123XYZ789"
                />
              </div>

              {/* Credential URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Credential URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.credentialUrl}
                  onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://verify.example.com/certificate/..."
                />
              </div>

              {/* Badge/Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Badge/Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/badge.png"
                />
                {formData.image && (
                  <div className="mt-2 flex justify-center">
                    <img src={formData.image} alt="Preview" className="h-20 object-contain" />
                  </div>
                )}
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
                    : editingCertification ? 'Update Certification' : 'Add Certification'
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
