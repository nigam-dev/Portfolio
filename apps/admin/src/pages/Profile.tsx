import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useRef, useEffect } from 'react';
import { Save, Upload, X, Plus, ExternalLink } from 'lucide-react';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

interface ProfileFormData {
  fullName: string;
  tagline: string;
  bio: string;
  location: string;
  email: string;
  phone: string;
  avatar: string;
  resume: string;
  socialLinks: SocialLink[];
}

const SOCIAL_PLATFORMS = [
  { name: 'GitHub', icon: '🐙', placeholder: 'https://github.com/username' },
  { name: 'LinkedIn', icon: '💼', placeholder: 'https://linkedin.com/in/username' },
  { name: 'Twitter', icon: '🐦', placeholder: 'https://twitter.com/username' },
  { name: 'Instagram', icon: '📷', placeholder: 'https://instagram.com/username' },
  { name: 'Facebook', icon: '👤', placeholder: 'https://facebook.com/username' },
  { name: 'YouTube', icon: '🎥', placeholder: 'https://youtube.com/@username' },
  { name: 'Website', icon: '🌐', placeholder: 'https://yourwebsite.com' },
  { name: 'Other', icon: '🔗', placeholder: 'https://...' },
];

export default function Profile() {
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: '',
    tagline: '',
    bio: '',
    location: '',
    email: '',
    phone: '',
    avatar: '',
    resume: '',
    socialLinks: [],
  });
  const [newSocialLink, setNewSocialLink] = useState({ platform: 'GitHub', url: '' });
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-profile'],
    queryFn: async () => {
      const response = await api.get('/profile');
      return response.data;
    },
    retry: false,
  });

  // Populate form when data loads
  useEffect(() => {
    if (data?.data) {
      setFormData({
        fullName: data.data.fullName || '',
        tagline: data.data.tagline || '',
        bio: data.data.bio || '',
        location: data.data.location || '',
        email: data.data.email || '',
        phone: data.data.phone || '',
        avatar: data.data.avatar || '',
        resume: data.data.resume || '',
        socialLinks: data.data.socialLinks || [],
      });
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: (data: ProfileFormData) => api.patch('/profile', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-profile'] });
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const addSocialLink = () => {
    if (newSocialLink.url.trim()) {
      const platform = SOCIAL_PLATFORMS.find(p => p.name === newSocialLink.platform);
      setFormData({
        ...formData,
        socialLinks: [
          ...formData.socialLinks,
          {
            platform: newSocialLink.platform,
            url: newSocialLink.url.trim(),
            icon: platform?.icon,
          },
        ],
      });
      setNewSocialLink({ platform: 'GitHub', url: '' });
    }
  };

  const removeSocialLink = (index: number) => {
    setFormData({
      ...formData,
      socialLinks: formData.socialLinks.filter((_, i) => i !== index),
    });
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to a cloud storage service
      // For now, just show a placeholder
      toast.success('Avatar upload coming soon - cloud storage integration needed');
      // TODO: Implement actual file upload with multer + S3/Cloudinary
    }
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to a cloud storage service
      toast.success('Resume upload coming soon - cloud storage integration needed');
      // TODO: Implement actual file upload with multer + S3/Cloudinary
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading profile...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Picture Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>
          <div className="flex items-center gap-6">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {formData.avatar ? (
                <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl text-gray-400">👤</span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Avatar URL (or upload below)"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  <Upload size={16} />
                  Upload Image
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                {formData.avatar && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, avatar: '' })}
                    className="px-4 py-2 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Note: File upload requires cloud storage setup (S3/Cloudinary)
              </p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tagline *
              </label>
              <input
                type="text"
                required
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Full Stack Developer | AI Enthusiast | Open Source Contributor"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio *
              </label>
              <textarea
                required
                rows={5}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tell us about yourself, your expertise, interests, and what you do..."
              />
            </div>

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
                placeholder="San Francisco, CA"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="john@example.com"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Social Links</h2>
          
          <div className="space-y-3 mb-4">
            {formData.socialLinks.map((link, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-2xl">{link.icon}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-700">{link.platform}</div>
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {link.url}
                    <ExternalLink size={12} />
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => removeSocialLink(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <select
              value={newSocialLink.platform}
              onChange={(e) => setNewSocialLink({ ...newSocialLink, platform: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {SOCIAL_PLATFORMS.map((platform) => (
                <option key={platform.name} value={platform.name}>
                  {platform.icon} {platform.name}
                </option>
              ))}
            </select>
            <input
              type="url"
              value={newSocialLink.url}
              onChange={(e) => setNewSocialLink({ ...newSocialLink, url: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSocialLink())}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={SOCIAL_PLATFORMS.find(p => p.name === newSocialLink.platform)?.placeholder}
            />
            <button
              type="button"
              onClick={addSocialLink}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus size={16} />
              Add
            </button>
          </div>
        </div>

        {/* Resume Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Resume / CV</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resume URL
              </label>
              <input
                type="text"
                value={formData.resume}
                onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://drive.google.com/your-resume.pdf"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => resumeInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                <Upload size={16} />
                Upload Resume
              </button>
              <input
                ref={resumeInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                className="hidden"
              />
              {formData.resume && (
                <a
                  href={formData.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink size={16} />
                  View Resume
                </a>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Note: File upload requires cloud storage setup (S3/Cloudinary). For now, use a direct URL.
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
          >
            <Save size={20} />
            {updateMutation.isPending ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
