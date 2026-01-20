import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from './lib/api';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Skills from './pages/Skills';
import Experiences from './pages/Experiences';
import Profile from './pages/Profile';
import Login from './pages/Login';

function App() {
  const location = useLocation();
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      const response = await api.get('/auth/me');
      return response.data;
    },
    retry: false,
    enabled: location.pathname !== '/login',
  });

  if (isLoading && location.pathname !== '/login') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const isAuthenticated = !!user?.data;
  const isAdmin = user?.data?.role === 'admin';

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/" replace /> : <Login />
      } />
      
      <Route path="/*" element={
        !isAuthenticated ? (
          <Navigate to="/login" replace />
        ) : !isAdmin ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
              <p>You do not have admin privileges.</p>
            </div>
          </div>
        ) : (
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/experiences" element={<Experiences />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        )
      } />
    </Routes>
  );
}

export default App;
