import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';

export default function ProjectDetailPage() {
  const { slug } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['project', slug],
    queryFn: () => api.get(`/projects/${slug}`),
  });

  if (isLoading) return <div>Loading...</div>;

  const project = data?.data;

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-4">{project?.title}</h1>
      <p className="text-xl mb-8">{project?.shortDescription}</p>
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: project?.description }} />
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Technologies</h2>
        <div className="flex flex-wrap gap-2">
          {project?.technologies?.map((tech: string) => (
            <span key={tech} className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
