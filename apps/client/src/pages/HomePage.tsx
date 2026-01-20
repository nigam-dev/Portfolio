import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import Hero from '../components/Hero';
import Projects from '../components/Projects';
import Skills from '../components/Skills';
import Experience from '../components/Experience';

export default function HomePage() {
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.get('/profile'),
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Hero profile={profile?.data} />
      <Skills />
      <Projects />
      <Experience />
    </motion.div>
  );
}
