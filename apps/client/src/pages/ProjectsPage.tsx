import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import api from '../services/api';

interface Project {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  technologies: string[];
  featured: boolean;
  status: string;
  images?: string[];
  demoUrl?: string;
  githubUrl?: string;
}

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTech, setSelectedTech] = useState<string>('all');

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await api.get('/projects?status=published');
      return response.data.data;
    },
  });

  // Extract unique categories and technologies
  const categories = ['all', ...new Set(projects.map((p) => p.category))];
  const allTechnologies = projects.flatMap((p) => p.technologies);
  const technologies = ['all', ...new Set(allTechnologies)];

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    const matchesTech =
      selectedTech === 'all' || project.technologies.includes(selectedTech);
    return matchesSearch && matchesCategory && matchesTech;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg py-20">
      <SEO
        title="Projects | Backend Developer Portfolio"
        description="Explore my portfolio of backend development projects, APIs, microservices, and full-stack applications"
        keywords={['projects', 'portfolio', 'backend', 'API', 'microservices']}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            My Projects
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A collection of projects showcasing my skills in backend development, API design, and system architecture
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-dark-card p-6 rounded-lg border border-gray-200 dark:border-dark-border mb-12"
        >
          <div className="grid gap-4 md:grid-cols-3">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Technology Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Technology
              </label>
              <select
                value={selectedTech}
                onChange={(e) => setSelectedTech(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {technologies.map((tech) => (
                  <option key={tech} value={tech}>
                    {tech.charAt(0).toUpperCase() + tech.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredProjects.length} of {projects.length} projects
          </div>
        </motion.div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 dark:text-gray-400">No projects found matching your filters</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  to={`/projects/${project.slug}`}
                  className="block bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  {/* Project Image */}
                  <div className="relative h-48 bg-gradient-to-br from-primary-500 to-primary-600 overflow-hidden">
                    {project.images && project.images.length > 0 ? (
                      <img
                        src={project.images[0]}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          className="w-16 h-16 text-white opacity-50"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                          />
                        </svg>
                      </div>
                    )}
                    {project.featured && (
                      <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-bold">
                        ⭐ Featured
                      </div>
                    )}
                  </div>

                  {/* Project Info */}
                  <div className="p-6">
                    <div className="mb-3">
                      <span className="inline-block px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-semibold rounded">
                        {project.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-500 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-gray-100 dark:bg-dark-hover text-gray-700 dark:text-gray-300 text-xs rounded"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-2 py-1 text-gray-500 dark:text-gray-400 text-xs">
                          +{project.technologies.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-3 text-sm">
                      {project.demoUrl && (
                        <span className="text-primary-500 font-medium">
                          View Demo →
                        </span>
                      )}
                      {project.githubUrl && (
                        <span className="text-gray-600 dark:text-gray-400">
                          🔗 GitHub
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
