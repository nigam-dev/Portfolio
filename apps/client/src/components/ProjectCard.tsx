import { Link } from 'react-router-dom';

export default function ProjectCard({ project }: { project: any }) {
  return (
    <Link
      to={`/projects/${project.slug}`}
      className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition p-6"
    >
      {project.images?.[0] && (
        <img
          src={project.images[0]}
          alt={project.title}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}
      
      <h3 className="text-xl font-bold mb-2">{project.title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{project.shortDescription}</p>
      
      <div className="flex flex-wrap gap-2">
        {project.technologies?.slice(0, 3).map((tech: string) => (
          <span key={tech} className="text-sm px-2 py-1 bg-primary-100 text-primary-800 rounded">
            {tech}
          </span>
        ))}
      </div>
    </Link>
  );
}
