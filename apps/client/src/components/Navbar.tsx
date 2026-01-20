import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const links = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/projects', label: 'Projects' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-dark-card/90 backdrop-blur-sm border-b border-gray-200 dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
              Portfolio
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`${
                  isActive(link.path)
                    ? 'text-primary-500 font-semibold'
                    : 'text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400'
                } transition-colors`}
              >
                {link.label}
              </Link>
            ))}
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 dark:border-dark-border mt-2 pt-2">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block py-2 px-2 rounded ${
                  isActive(link.path)
                    ? 'text-primary-500 bg-primary-50 dark:bg-dark-hover font-semibold'
                    : 'text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-dark-hover'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
