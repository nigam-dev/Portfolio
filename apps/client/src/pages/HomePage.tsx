import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import SEO from '../components/SEO';

interface Profile {
  name: string;
  tagline: string;
  bio: string;
  email?: string;
  profilePicture?: string;
  socialLinks?: { platform: string; url: string }[];
}

interface Project {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  technologies: string[];
  images?: string[];
  featured?: boolean;
  demoUrl?: string;
  githubUrl?: string;
}

interface Skill {
  name: string;
  category: string;
  proficiency: number;
}

interface Experience {
  _id: string;
  title: string;
  company: string;
}

export default function HomePage() {
  const { data: profileData } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await api.get('/profile');
      return response.data.data as Profile;
    },
  });

  const { data: projectsData } = useQuery({
    queryKey: ['featured-projects'],
    queryFn: async () => {
      const response = await api.get('/projects', {
        params: { featured: true, limit: 6, status: 'published' }
      });
      return response.data.data as Project[];
    },
  });

  const { data: skillsData } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const response = await api.get('/skills');
      return response.data.data as Skill[];
    },
  });

  const { data: experiencesData } = useQuery({
    queryKey: ['experiences-preview'],
    queryFn: async () => {
      const response = await api.get('/experiences', { params: { limit: 3 } });
      return response.data.data as Experience[];
    },
  });

  const profile = profileData;
  const projects = projectsData || [];
  const skills = skillsData || [];
  const experiences = experiencesData || [];

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <>
      <SEO
        title={profile?.name || 'Backend Developer Portfolio'}
        description={profile?.bio || 'Professional backend developer portfolio showcasing projects and expertise'}
      />

      <div className="bg-white dark:bg-dark-bg">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-20 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          
          <div className="relative max-w-6xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-sm font-mono text-primary-500 dark:text-primary-400 mb-4">
                  Hi, my name is
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                  {profile?.name || 'Backend Developer'}
                </h1>
                
                <h2 className="text-3xl md:text-4xl font-bold text-gray-600 dark:text-gray-400 mb-6">
                  {profile?.tagline || 'Building scalable systems'}
                </h2>
                
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-xl">
                  {profile?.bio || 'I specialize in building robust, scalable backend systems and APIs. Passionate about clean architecture, performance optimization, and solving complex technical challenges.'}
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/projects"
                    className="px-8 py-4 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-all shadow-lg hover:shadow-xl"
                  >
                    View My Work
                  </Link>
                  <Link
                    to="/contact"
                    className="px-8 py-4 border-2 border-gray-300 dark:border-dark-border text-gray-700 dark:text-white rounded-lg font-semibold hover:border-primary-500 dark:hover:border-primary-500 transition-all"
                  >
                    Get In Touch
                  </Link>
                </div>

                {/* Social Links */}
                {profile?.socialLinks && profile.socialLinks.length > 0 && (
                  <div className="flex gap-4 mt-8">
                    {profile.socialLinks.slice(0, 4).map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-dark-card border border-gray-200 dark:border-dark-border hover:border-primary-500 dark:hover:border-primary-500 transition-all"
                        title={link.platform}
                      >
                        <span className="text-xl">{getSocialIcon(link.platform)}</span>
                      </a>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Right Content - Profile Image or Stats */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                {profile?.profilePicture ? (
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-3xl"></div>
                    <img
                      src={profile.profilePicture}
                      alt={profile.name}
                      className="relative w-full max-w-md mx-auto rounded-2xl shadow-2xl border-4 border-white dark:border-dark-border"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <StatCard number={projects.length} label="Projects" />
                    <StatCard number={skills.length} label="Skills" />
                    <StatCard number={experiences.length} label="Years Exp" />
                    <StatCard number="∞" label="Lines of Code" />
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Skills Preview Section */}
        <section className="py-20 px-4 bg-gray-50 dark:bg-dark-card">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Tech Stack</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Technologies and tools I use to build robust backend systems
              </p>
            </motion.div>

            {Object.keys(groupedSkills).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(groupedSkills).slice(0, 3).map(([category, categorySkills], idx) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white dark:bg-dark-bg rounded-lg p-6 border border-gray-200 dark:border-dark-border hover:border-primary-500 dark:hover:border-primary-500 transition-all"
                  >
                    <h3 className="text-xl font-bold mb-4 capitalize text-primary-500">{category}</h3>
                    <div className="space-y-3">
                      {categorySkills.slice(0, 4).map((skill) => (
                        <div key={skill.name} className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium">{skill.name}</span>
                              <span className="text-gray-500">{skill.proficiency}%</span>
                            </div>
                            <div className="h-1.5 bg-gray-200 dark:bg-dark-hover rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary-500 rounded-full"
                                style={{ width: `${skill.proficiency}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {skills.slice(0, 12).map((skill, idx) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    viewport={{ once: true }}
                    className="bg-white dark:bg-dark-bg rounded-lg p-4 border border-gray-200 dark:border-dark-border hover:border-primary-500 dark:hover:border-primary-500 transition-all text-center"
                  >
                    <p className="font-semibold text-sm">{skill.name}</p>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <Link
                to="/about#skills"
                className="inline-flex items-center gap-2 text-primary-500 font-semibold hover:gap-3 transition-all"
              >
                View All Skills <span>→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Projects Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Featured Projects</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Some of my recent work showcasing backend development expertise
              </p>
            </motion.div>

            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, idx) => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Link
                      to={`/projects/${project.slug}`}
                      className="group block bg-white dark:bg-dark-card rounded-lg overflow-hidden border border-gray-200 dark:border-dark-border hover:border-primary-500 dark:hover:border-primary-500 transition-all hover:shadow-xl h-full"
                    >
                      {project.images?.[0] ? (
                        <div className="aspect-video overflow-hidden bg-gray-100 dark:bg-dark-hover">
                          <img
                            src={project.images[0]}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-gradient-to-br from-primary-500/10 to-primary-600/10 flex items-center justify-center">
                          <span className="text-6xl font-bold text-primary-500/30">
                            {project.title.charAt(0)}
                          </span>
                        </div>
                      )}

                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary-500 transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.slice(0, 3).map((tech, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-gray-100 dark:bg-dark-bg text-primary-500 text-xs rounded-full border border-gray-200 dark:border-dark-border font-mono"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 3 && (
                            <span className="px-3 py-1 text-gray-500 text-xs">
                              +{project.technologies.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-600">
                No projects found. Add projects in the admin panel to display them here.
              </div>
            )}

            {projects.length > 0 && (
              <div className="text-center mt-12">
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-all shadow-lg hover:shadow-xl"
                >
                  View All Projects <span>→</span>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-primary-500 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">
                Let's Build Something Amazing Together
              </h2>
              <p className="text-xl mb-8 text-primary-100">
                I'm always interested in hearing about new projects and opportunities.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-500 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-lg"
              >
                Get In Touch <span>→</span>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}

function StatCard({ number, label }: { number: number | string; label: string }) {
  return (
    <div className="bg-white dark:bg-dark-card rounded-lg p-6 border border-gray-200 dark:border-dark-border text-center">
      <div className="text-4xl font-bold text-primary-500 mb-2">{number}+</div>
      <div className="text-gray-600 dark:text-gray-400">{label}</div>
    </div>
  );
}

function getSocialIcon(platform: string): string {
  const icons: Record<string, string> = {
    github: '⚡',
    linkedin: '💼',
    twitter: '🐦',
    email: '📧',
    website: '🌐',
  };
  return icons[platform.toLowerCase()] || '🔗';
}
