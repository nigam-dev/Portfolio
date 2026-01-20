import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Briefcase, Code, Award, GraduationCap, Medal, User, FileText, LogOut } from 'lucide-react';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Projects', href: '/projects', icon: Briefcase },
  { name: 'Skills', href: '/skills', icon: Code },
  { name: 'Experience', href: '/experiences', icon: Award },
  { name: 'Education', href: '/education', icon: GraduationCap },
  { name: 'Certifications', href: '/certifications', icon: Medal },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'divider' },
  { name: 'Audit Logs', href: '/audit-logs', icon: FileText },
];

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('admin_token');
      window.location.href = '/';
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Portfolio Admin</h1>
        </div>
        
        <nav className="mt-6">
          {navigation.map((item, index) => {
            if (item.name === 'divider') {
              return <div key={`divider-${index}`} className="my-4 border-t border-gray-700" />;
            }
            
            const Icon = item.icon!;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href!}
                className={`flex items-center gap-3 px-6 py-3 transition ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-6 py-3 w-full text-gray-300 hover:bg-gray-700 mt-auto absolute bottom-6"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
