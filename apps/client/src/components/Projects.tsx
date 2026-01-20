import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import ProjectCard from './ProjectCard';

export default function Projects() {
  const { data } = useQuery({
    queryKey: ['projects', 'featured'],
    queryFn: () => api.get('/projects', { params: { featured: true, limit: 6 } }),
  });

  return (
    <section id="projects" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center">Featured Projects</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {data?.data?.map((project: any) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/projects"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            View All Projects
          </Link>
        </div>
      </div>
    </section>
  );
}
