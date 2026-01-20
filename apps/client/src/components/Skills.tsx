import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export default function Skills() {
  const { data } = useQuery({
    queryKey: ['skills'],
    queryFn: () => api.get('/skills'),
  });

  const skills = data?.data || [];
  const categories = [...new Set(skills.map((s: any) => s.category))];

  return (
    <section id="skills" className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center">Skills & Technologies</h2>
        
        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category as string}>
              <h3 className="text-2xl font-semibold mb-4 capitalize">{category as string}</h3>
              <div className="flex flex-wrap gap-3">
                {skills
                  .filter((s: any) => s.category === category)
                  .map((skill: any) => (
                    <div
                      key={skill._id}
                      className="px-4 py-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm"
                    >
                      {skill.name}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
