import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import Profile from '../models/Profile';
import Project from '../models/Project';
import Skill from '../models/Skill';
import Experience from '../models/Experience';
import { UserRole, SkillCategory, SkillProficiency, ProjectCategory, ContentStatus } from '../../shared/src/types';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio_db';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'nigmanand-dev@gmail.com';

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Profile.deleteMany({}),
      Project.deleteMany({}),
      Skill.deleteMany({}),
      Experience.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      email: ADMIN_EMAIL,
      name: 'Nigmanand Das',
      role: UserRole.ADMIN,
      isActive: true,
    });
    console.log('Created admin user');

    // Create profile
    await Profile.create({
      userId: adminUser._id.toString(),
      fullName: 'Nigmanand Das',
      tagline: 'Backend-Focused Full-Stack Developer',
      bio: 'Passionate backend developer specializing in Node.js, Express, MongoDB, and scalable system design. Experience in mentoring, AI/LLM integration, and building production-grade applications.',
      location: 'India',
      email: ADMIN_EMAIL,
      socialLinks: [
        { platform: 'GitHub', url: 'https://github.com/nigmanand', icon: 'github' },
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/nigmanand', icon: 'linkedin' },
        { platform: 'Twitter', url: 'https://twitter.com/nigmanand', icon: 'twitter' },
      ],
      visibility: true,
      createdBy: adminUser._id.toString(),
    });
    console.log('Created profile');

    // Create skills
    const skills = [
      // Backend
      { name: 'Node.js', category: SkillCategory.BACKEND, proficiency: SkillProficiency.EXPERT, order: 1 },
      { name: 'Express.js', category: SkillCategory.BACKEND, proficiency: SkillProficiency.EXPERT, order: 2 },
      { name: 'TypeScript', category: SkillCategory.BACKEND, proficiency: SkillProficiency.ADVANCED, order: 3 },
      { name: 'Python', category: SkillCategory.BACKEND, proficiency: SkillProficiency.INTERMEDIATE, order: 4 },
      
      // Frontend
      { name: 'React', category: SkillCategory.FRONTEND, proficiency: SkillProficiency.ADVANCED, order: 5 },
      { name: 'JavaScript', category: SkillCategory.FRONTEND, proficiency: SkillProficiency.EXPERT, order: 6 },
      { name: 'Tailwind CSS', category: SkillCategory.FRONTEND, proficiency: SkillProficiency.ADVANCED, order: 7 },
      
      // Database
      { name: 'MongoDB', category: SkillCategory.DATABASE, proficiency: SkillProficiency.EXPERT, order: 8 },
      { name: 'Redis', category: SkillCategory.DATABASE, proficiency: SkillProficiency.ADVANCED, order: 9 },
      { name: 'PostgreSQL', category: SkillCategory.DATABASE, proficiency: SkillProficiency.INTERMEDIATE, order: 10 },
      
      // DevOps
      { name: 'Docker', category: SkillCategory.DEVOPS, proficiency: SkillProficiency.ADVANCED, order: 11 },
      { name: 'Git', category: SkillCategory.DEVOPS, proficiency: SkillProficiency.EXPERT, order: 12 },
      { name: 'Linux', category: SkillCategory.DEVOPS, proficiency: SkillProficiency.ADVANCED, order: 13 },
      
      // AI/ML
      { name: 'LLM Integration', category: SkillCategory.AI_ML, proficiency: SkillProficiency.ADVANCED, order: 14 },
      { name: 'OpenAI API', category: SkillCategory.AI_ML, proficiency: SkillProficiency.ADVANCED, order: 15 },
    ];

    await Skill.insertMany(
      skills.map(skill => ({
        ...skill,
        visibility: true,
        createdBy: adminUser._id.toString(),
      }))
    );
    console.log('Created skills');

    // Create sample projects
    const projects = [
      {
        title: 'Portfolio CMS Platform',
        slug: 'portfolio-cms-platform',
        shortDescription: 'Future-proof, fully dynamic portfolio management system',
        description: '<p>A production-grade personal CMS built with Node.js, Express, MongoDB, and React. Features include admin-controlled content, Google OAuth authentication, and complete CRUD operations for projects, skills, and experiences.</p>',
        technologies: ['Node.js', 'Express', 'MongoDB', 'React', 'TypeScript', 'Docker'],
        category: ProjectCategory.BACKEND,
        featured: true,
        order: 1,
        status: ContentStatus.PUBLISHED,
        visibility: true,
        createdBy: adminUser._id.toString(),
      },
      {
        title: 'API Gateway Service',
        slug: 'api-gateway-service',
        shortDescription: 'Scalable microservices API gateway with rate limiting',
        description: '<p>Enterprise-grade API gateway built to handle high traffic with rate limiting, request routing, and authentication middleware.</p>',
        technologies: ['Node.js', 'Express', 'Redis', 'JWT'],
        category: ProjectCategory.BACKEND,
        featured: true,
        order: 2,
        status: ContentStatus.PUBLISHED,
        visibility: true,
        createdBy: adminUser._id.toString(),
      },
      {
        title: 'LLM Integration Framework',
        slug: 'llm-integration-framework',
        shortDescription: 'Reusable framework for integrating LLMs into applications',
        description: '<p>A flexible framework for integrating various LLM providers (OpenAI, Anthropic, etc.) with features like prompt management, context handling, and response streaming.</p>',
        technologies: ['Node.js', 'TypeScript', 'OpenAI API', 'Langchain'],
        category: ProjectCategory.AI_ML,
        featured: true,
        order: 3,
        status: ContentStatus.PUBLISHED,
        visibility: true,
        createdBy: adminUser._id.toString(),
      },
    ];

    await Project.insertMany(projects);
    console.log('Created projects');

    // Create experience
    await Experience.create({
      company: 'NavGurukul Foundation',
      position: 'Backend Developer & Mentor',
      location: 'India',
      startDate: new Date('2023-01-01'),
      current: true,
      description: 'Leading backend development and mentoring students in full-stack development.',
      responsibilities: [
        'Architecting and developing scalable backend systems',
        'Mentoring junior developers and students',
        'Code reviews and technical guidance',
        'System design and database optimization',
      ],
      achievements: [
        'Built production-grade APIs serving thousands of users',
        'Mentored 50+ students in backend development',
        'Reduced API response time by 60% through optimization',
      ],
      technologies: ['Node.js', 'Express', 'MongoDB', 'Docker', 'Redis'],
      order: 1,
      visibility: true,
      createdBy: adminUser._id.toString(),
    });
    console.log('Created experience');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nLogin credentials:');
    console.log(`Email: ${ADMIN_EMAIL}`);
    console.log('Authentication: Google OAuth\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
