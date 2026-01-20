import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import api from '../services/api';

interface Profile {
  name: string;
  tagline: string;
  bio: string;
  email?: string;
  phone?: string;
  location?: string;
  profilePicture?: string;
  resume?: string;
}

interface Experience {
  _id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description: string;
  companyLogo?: string;
}

interface Education {
  _id: string;
  degree: string;
  institution: string;
  location?: string;
  startDate: string;
  endDate?: string;
  grade?: string;
  description?: string;
}

interface Certification {
  _id: string;
  name: string;
  organization: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  logo?: string;
}

interface Skill {
  name: string;
  category: string;
  proficiency: number;
}

export default function AboutPage() {
  const { data: profile } = useQuery<Profile>({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await api.get('/profile');
      return response.data.data;
    },
  });

  const { data: experiences } = useQuery<Experience[]>({
    queryKey: ['experiences'],
    queryFn: async () => {
      const response = await api.get('/experiences');
      return response.data.data;
    },
  });

  const { data: educations } = useQuery<Education[]>({
    queryKey: ['educations'],
    queryFn: async () => {
      const response = await api.get('/educations');
      return response.data.data;
    },
  });

  const { data: certifications } = useQuery<Certification[]>({
    queryKey: ['certifications'],
    queryFn: async () => {
      const response = await api.get('/certifications');
      return response.data.data;
    },
  });

  const { data: skills } = useQuery<Skill[]>({
    queryKey: ['skills'],
    queryFn: async () => {
      const response = await api.get('/skills');
      return response.data.data;
    },
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const groupedSkills = skills?.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg">
      <SEO
        title={`About ${profile?.name || 'Me'} | Backend Developer`}
        description={profile?.bio || 'Learn more about my experience, education, and skills as a backend developer'}
        keywords={['backend developer', 'about', 'experience', 'education', 'skills']}
      />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-50 to-white dark:from-dark-card dark:to-dark-bg border-b border-gray-200 dark:border-dark-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {profile?.profilePicture && (
              <img
                src={profile.profilePicture}
                alt={profile.name}
                className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-primary-500 shadow-xl"
              />
            )}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              About Me
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              {profile?.tagline || 'Backend Developer'}
            </p>
            <div className="prose prose-lg dark:prose-invert mx-auto text-gray-700 dark:text-gray-300">
              <p>{profile?.bio}</p>
            </div>
            {profile?.resume && (
              <a
                href={profile.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Resume
              </a>
            )}
          </motion.div>
        </div>
      </section>

      {/* Experience Section */}
      {experiences && experiences.length > 0 && (
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center"
            >
              Work Experience
            </motion.h2>
            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <motion.div
                  key={exp._id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative pl-8 border-l-2 border-primary-500"
                >
                  <div className="absolute w-4 h-4 bg-primary-500 rounded-full -left-[9px] top-0"></div>
                  <div className="bg-white dark:bg-dark-card p-6 rounded-lg border border-gray-200 dark:border-dark-border hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{exp.title}</h3>
                        <p className="text-primary-500 font-semibold">{exp.company}</p>
                        {exp.location && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">📍 {exp.location}</p>
                        )}
                      </div>
                      {exp.companyLogo && (
                        <img
                          src={exp.companyLogo}
                          alt={exp.company}
                          className="w-12 h-12 object-contain rounded"
                        />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate || '')}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">{exp.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Education Section */}
      {educations && educations.length > 0 && (
        <section className="py-20 bg-gray-50 dark:bg-dark-card/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center"
            >
              Education
            </motion.h2>
            <div className="grid gap-6 md:grid-cols-2">
              {educations.map((edu, index) => (
                <motion.div
                  key={edu._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-dark-card p-6 rounded-lg border border-gray-200 dark:border-dark-border hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{edu.degree}</h3>
                  <p className="text-primary-500 font-semibold mb-1">{edu.institution}</p>
                  {edu.location && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">📍 {edu.location}</p>
                  )}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate || '')}
                  </p>
                  {edu.grade && (
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Grade: {edu.grade}
                    </p>
                  )}
                  {edu.description && (
                    <p className="text-gray-700 dark:text-gray-300 text-sm">{edu.description}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Certifications Section */}
      {certifications && certifications.length > 0 && (
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center"
            >
              Certifications
            </motion.h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {certifications.map((cert, index) => (
                <motion.div
                  key={cert._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-dark-card p-6 rounded-lg border border-gray-200 dark:border-dark-border hover:shadow-lg transition-shadow"
                >
                  {cert.logo && (
                    <img src={cert.logo} alt={cert.name} className="w-16 h-16 object-contain mb-4" />
                  )}
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{cert.name}</h3>
                  <p className="text-primary-500 font-semibold mb-2">{cert.organization}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Issued: {formatDate(cert.issueDate)}
                  </p>
                  {cert.expiryDate && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Expires: {formatDate(cert.expiryDate)}
                    </p>
                  )}
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-sm text-primary-500 hover:text-primary-600 mt-2"
                    >
                      View Credential →
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {groupedSkills && Object.keys(groupedSkills).length > 0 && (
        <section className="py-20 bg-gray-50 dark:bg-dark-card/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center"
            >
              Skills & Technologies
            </motion.h2>
            <div className="space-y-12">
              {Object.entries(groupedSkills).map(([category, categorySkills], index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{category}</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {categorySkills.map((skill) => (
                      <div key={skill.name}>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-700 dark:text-gray-300 font-medium">{skill.name}</span>
                          <span className="text-primary-500 font-semibold">{skill.proficiency}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-dark-border rounded-full h-2.5">
                          <div
                            className="bg-primary-500 h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${skill.proficiency}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
