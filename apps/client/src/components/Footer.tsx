import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../services/api';

interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

interface Profile {
  name: string;
  bio: string;
  socialLinks?: SocialLink[];
}

const getSocialIcon = (platform: string) => {
  const icons: Record<string, string> = {
    github: '🔗 GitHub',
    linkedin: '💼 LinkedIn',
    twitter: '🐦 Twitter',
    email: '✉️ Email',
  };
  return icons[platform.toLowerCase()] || `🔗 ${platform}`;
};

export default function Footer() {
  const { data: profile } = useQuery<Profile>({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await api.get('/profile');
      return response.data.data;
    },
  });

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/projects', label: 'Projects' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <footer className="bg-gray-50 dark:bg-dark-card border-t border-gray-200 dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              {profile?.name || 'Backend Developer'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {profile?.bio?.substring(0, 120) || 'Building scalable and efficient backend systems'}
              {profile?.bio && profile.bio.length > 120 ? '...' : ''}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Connect */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Connect</h3>
            <ul className="space-y-2">
              {profile?.socialLinks?.map((social, index) => (
                <li key={index}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 text-sm transition-colors"
                  >
                    {getSocialIcon(social.platform)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-dark-border mt-8 pt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © {currentYear} {profile?.name || 'Backend Developer'}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
