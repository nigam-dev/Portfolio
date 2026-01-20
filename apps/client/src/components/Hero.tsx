export default function Hero({ profile }: { profile?: any }) {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          {profile?.fullName || 'Nigmanand Das'}
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
          {profile?.tagline || 'Backend-Focused Full-Stack Developer'}
        </p>
        <p className="text-lg max-w-2xl mx-auto mb-12">
          {profile?.bio || 'Specializing in Node.js, Express, MongoDB, React, and AI/LLM integration'}
        </p>
        <div className="flex gap-4 justify-center">
          <a href="#projects" className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
            View Projects
          </a>
          <a href="#contact" className="px-6 py-3 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition">
            Contact Me
          </a>
        </div>
      </div>
    </section>
  );
}
