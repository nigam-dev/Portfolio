import { useQuery } from '@tanstack/react-query';
import { Briefcase, Code, Award, GraduationCap, Medal, TrendingUp, Activity } from 'lucide-react';
import { api } from '../lib/api';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [projects, skills, experiences, education, certifications, auditLogs] = await Promise.all([
        api.get('/projects'),
        api.get('/skills'),
        api.get('/experiences'),
        api.get('/education'),
        api.get('/certifications'),
        api.get('/audit?limit=10'),
      ]);
      return {
        projects: projects.data?.data?.length || 0,
        skills: skills.data?.data?.length || 0,
        experiences: experiences.data?.data?.length || 0,
        education: education.data?.data?.length || 0,
        certifications: certifications.data?.data?.length || 0,
        recentActivities: auditLogs.data?.data?.logs || [],
      };
    },
  });

  const cards = [
    { title: 'Projects', value: stats?.projects || 0, color: 'bg-blue-500', icon: Briefcase, link: '/projects' },
    { title: 'Skills', value: stats?.skills || 0, color: 'bg-green-500', icon: Code, link: '/skills' },
    { title: 'Experiences', value: stats?.experiences || 0, color: 'bg-purple-500', icon: Award, link: '/experiences' },
    { title: 'Education', value: stats?.education || 0, color: 'bg-yellow-500', icon: GraduationCap, link: '/education' },
    { title: 'Certifications', value: stats?.certifications || 0, color: 'bg-pink-500', icon: Medal, link: '/certifications' },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (isLoading) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your portfolio overview.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.link}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="text-white" size={24} />
                </div>
                <TrendingUp className="text-gray-400" size={20} />
              </div>
              <h3 className="text-gray-600 text-sm mb-1">{card.title}</h3>
              <p className="text-3xl font-bold">{card.value}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/projects" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition">
              <Briefcase className="text-blue-600" size={20} />
              <span className="font-medium">Add New Project</span>
            </Link>
            <Link to="/skills" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition">
              <Code className="text-green-600" size={20} />
              <span className="font-medium">Add New Skill</span>
            </Link>
            <Link to="/experiences" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition">
              <Award className="text-purple-600" size={20} />
              <span className="font-medium">Add Experience</span>
            </Link>
            <Link to="/profile" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition">
              <GraduationCap className="text-yellow-600" size={20} />
              <span className="font-medium">Update Profile</span>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Recent Activity</h2>
            <Link to="/audit-logs" className="text-blue-600 text-sm hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {stats?.recentActivities.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent activity</p>
            ) : (
              stats?.recentActivities.slice(0, 5).map((activity: any) => (
                <div key={activity._id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Activity className="text-gray-400 mt-0.5" size={16} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-semibold">{activity.action}</span>{' '}
                      <span className="text-gray-600">{activity.resource}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(activity.createdAt)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
