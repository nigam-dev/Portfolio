import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export default function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [projects, skills, experiences] = await Promise.all([
        api.get('/projects'),
        api.get('/skills'),
        api.get('/experiences'),
      ]);
      return {
        projects: projects.data?.length || 0,
        skills: skills.data?.length || 0,
        experiences: experiences.data?.length || 0,
      };
    },
  });

  const cards = [
    { title: 'Projects', value: stats?.projects || 0, color: 'bg-blue-500' },
    { title: 'Skills', value: stats?.skills || 0, color: 'bg-green-500' },
    { title: 'Experiences', value: stats?.experiences || 0, color: 'bg-purple-500' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((card) => (
          <div key={card.title} className="bg-white rounded-lg shadow p-6">
            <div className={`w-12 h-12 ${card.color} rounded-lg mb-4`} />
            <h3 className="text-gray-600 text-sm mb-1">{card.title}</h3>
            <p className="text-3xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <a href="/projects" className="p-4 border rounded-lg hover:bg-gray-50">
            Add New Project
          </a>
          <a href="/skills" className="p-4 border rounded-lg hover:bg-gray-50">
            Add New Skill
          </a>
        </div>
      </div>
    </div>
  );
}
