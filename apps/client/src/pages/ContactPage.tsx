import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import api from '../services/api';

interface SocialLink {
  platform: string;
  url: string;
}

interface Profile {
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  socialLinks?: SocialLink[];
  resume?: string;
}

const getSocialIcon = (platform: string) => {
  const icons: Record<string, { icon: string; color: string }> = {
    github: { icon: '🔗', color: 'text-gray-800 dark:text-gray-200' },
    linkedin: { icon: '💼', color: 'text-blue-600' },
    twitter: { icon: '🐦', color: 'text-blue-400' },
    email: { icon: '✉️', color: 'text-red-500' },
    website: { icon: '🌐', color: 'text-primary-500' },
  };
  return icons[platform.toLowerCase()] || { icon: '🔗', color: 'text-gray-600' };
};

export default function ContactPage() {
  const { data: profile } = useQuery<Profile>({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await api.get('/profile');
      return response.data.data;
    },
  });

  const contactMethods = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: 'Email',
      value: profile?.email,
      href: profile?.email ? `mailto:${profile.email}` : undefined,
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      label: 'Phone',
      value: profile?.phone,
      href: profile?.phone ? `tel:${profile.phone}` : undefined,
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: 'Location',
      value: profile?.location,
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg py-20">
      <SEO
        title={`Contact ${profile?.name || 'Me'} | Backend Developer`}
        description="Get in touch for collaboration opportunities, project inquiries, or just to say hello"
        keywords={['contact', 'hire', 'backend developer', 'collaboration']}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Get In Touch
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Have a project in mind or want to discuss opportunities? I'd love to hear from you!
          </p>
        </motion.div>

        {/* Contact Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid gap-6 md:grid-cols-3 mb-12"
        >
          {contactMethods.map((method, index) => (
            method.value && (
              <div
                key={index}
                className="bg-white dark:bg-dark-card p-6 rounded-lg border border-gray-200 dark:border-dark-border text-center hover:shadow-lg transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-500 mb-4">
                  {method.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {method.label}
                </h3>
                {method.href ? (
                  <a
                    href={method.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    {method.value}
                  </a>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">{method.value}</p>
                )}
              </div>
            )
          ))}
        </motion.div>

        {/* Social Links */}
        {profile?.socialLinks && profile.socialLinks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-br from-primary-50 to-white dark:from-dark-card dark:to-dark-bg p-8 rounded-lg border border-gray-200 dark:border-dark-border mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Connect on Social Media
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {profile.socialLinks.map((social, index) => {
                const { icon, color } = getSocialIcon(social.platform);
                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border hover:border-primary-500 dark:hover:border-primary-500 transition-all group"
                  >
                    <span className={`text-2xl ${color}`}>{icon}</span>
                    <div className="flex-1">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">
                        {social.platform.charAt(0).toUpperCase() + social.platform.slice(1)}
                      </span>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Resume Download */}
        {profile?.resume && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center"
          >
            <div className="inline-block p-8 bg-primary-500 rounded-2xl">
              <h2 className="text-2xl font-bold text-white mb-4">
                Interested in working together?
              </h2>
              <p className="text-white/90 mb-6">
                Download my resume to learn more about my experience and skills
              </p>
              <a
                href={profile.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-500 font-bold rounded-lg hover:bg-gray-50 transition-colors shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Resume
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
