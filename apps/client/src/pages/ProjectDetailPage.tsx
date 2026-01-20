import { useQuery } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import api from '../services/api';

interface Project {
  title: string;
  slug: string;
  description: string;
  category: string;
  technologies: string[];
  features?: string[];
  images?: string[];
  demoUrl?: string;
  githubUrl?: string;
  documentationUrl?: string;
  startDate?: string;
  endDate?: string;
}

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: ['project', slug],
    queryFn: async () => {
      const response = await api.get(`/projects/${slug}`);
      return response.data.data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-bg flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Project Not Found</h1>
          <Link to="/projects" className="text-primary-500 hover:text-primary-600">
            ← Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg">
      <SEO
        title={`${project.title} | Project Portfolio`}
        description={project.description}
        keywords={[project.category, ...project.technologies]}
      />

      {/* Hero Section with Image */}
      <div className="relative h-96 bg-gradient-to-br from-primary-500 to-primary-600 overflow-hidden">
        {project.images && project.images.length > 0 ? (
          <img
            src={project.images[0]}
            alt={project.title}
            className="w-full h-full object-cover opacity-30"
          />
        ) : null}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => navigate('/projects')}
              className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Projects
            </motion.button>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              {project.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/90"
            >
              {project.category}
            </motion.p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-4 mb-12"
        >
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              GitHub Repository
            </a>
          )}
          {project.documentationUrl && (
            <a
              href={project.documentationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-dark-hover font-semibold rounded-lg transition-colors"
            >
              📖 Documentation
            </a>
          )}
        </motion.div>

        {/* Description */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Overview</h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
            {project.description}
          </p>
        </motion.section>

        {/* Technologies */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Technologies Used</h2>
          <div className="flex flex-wrap gap-3">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold rounded-lg"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.section>

        {/* Features */}
        {project.features && project.features.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Key Features</h2>
            <ul className="grid gap-3 md:grid-cols-2">
              {project.features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 p-4 bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border"
                >
                  <svg className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </motion.section>
        )}

        {/* Image Gallery */}
        {project.images && project.images.length > 1 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Gallery</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {project.images.slice(1).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${project.title} screenshot ${index + 1}`}
                  className="w-full h-64 object-cover rounded-lg border border-gray-200 dark:border-dark-border"
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* Timeline */}
        {(project.startDate || project.endDate) && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Timeline</h2>
            <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
              {project.startDate && (
                <span>
                  Started: {new Date(project.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              )}
              {project.startDate && project.endDate && <span>•</span>}
              {project.endDate && (
                <span>
                  Completed: {new Date(project.endDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              )}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
