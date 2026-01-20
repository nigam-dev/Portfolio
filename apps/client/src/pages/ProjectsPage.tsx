import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '../lib/api';
import ProjectCard from '../components/ProjectCard';

export default function ProjectsPage() {
  const [category, setCategory] = useState<string>('');

  const { data, isLoading } = useQuery({
    queryKey: ['projects', category],
    queryFn: () => api.get('/projects', { params: { category } }),
  });

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Projects</h1>
      
      <div className="mb-8">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">All Categories</option>
          <option value="backend">Backend</option>
          <option value="web">Web</option>
          <option value="ai-ml">AI/ML</option>
        </select>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data?.map((project: any) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
