import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export default function Experience() {
  const { data } = useQuery({
    queryKey: ['experiences'],
    queryFn: () => api.get('/experiences'),
  });

  return (
    <section id="experience" className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center">Experience</h2>
        
        <div className="max-w-3xl mx-auto space-y-8">
          {data?.data?.map((exp: any) => (
            <div key={exp._id} className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md">
              <h3 className="text-2xl font-bold mb-2">{exp.position}</h3>
              <p className="text-lg text-primary-600 mb-2">{exp.company}</p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {new Date(exp.startDate).toLocaleDateString()} - 
                {exp.current ? ' Present' : new Date(exp.endDate).toLocaleDateString()}
              </p>
              <p className="mb-4">{exp.description}</p>
              
              {exp.technologies?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech: string) => (
                    <span key={tech} className="text-sm px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
