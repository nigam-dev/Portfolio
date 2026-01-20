# Portfolio Platform - Future-Proof Personal CMS

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A production-grade, fully dynamic portfolio platform designed for backend-focused developers. Built as a personal CMS with complete admin control, this system is architected for extensibility and longevity.

## 🎯 Vision

This isn't just a portfolio website—it's a **personal operating system on the internet**. Every piece of content is database-driven, admin-controlled, and future-ready for AI integration, analytics, and multi-language support.

## ✨ Key Features

### Core Capabilities
- **Zero Hard-Coded Content**: Everything is editable from admin panel
- **Admin-Only Access**: Secured to `nigmanand-dev@gmail.com` via Google OAuth
- **Full CRUD Operations**: Projects, skills, experiences, education, certifications
- **Content Management**: Draft/publish workflows, visibility toggles, ordering
- **Audit Logging**: Complete action tracking for accountability
- **SEO Optimized**: Meta tags, semantic HTML, performance-first
- **Responsive Design**: Mobile-first, dark mode support

### Technical Excellence
- **TypeScript Throughout**: Type-safe across full stack
- **Clean Architecture**: Modular, maintainable, scalable
- **Production Ready**: Docker, environment configs, graceful shutdown
- **API-First Design**: RESTful, versioned, documented
- **Security Hardened**: JWT, CORS, Helmet, rate limiting

## 🏗️ Architecture

```
portfolio-platform/
├── apps/
│   ├── client/          # Public portfolio (React + Vite + Tailwind)
│   └── admin/           # Admin CMS (React + Vite + Tailwind)
├── server/              # Backend API (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── config/      # Configuration & DB connections
│   │   ├── middlewares/ # Auth, validation, error handling
│   │   ├── models/      # Mongoose schemas
│   │   ├── modules/     # Feature modules (auth, projects, etc.)
│   │   └── utils/       # Helpers, logger, response handlers
├── shared/              # Shared types & constants
├── docker/              # Docker configurations
└── docs/                # Documentation
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- MongoDB 7+
- Redis 7+ (optional but recommended)
- Google OAuth credentials

### 1. Clone and Install

```bash
git clone <repository-url>
cd Portfolio
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

**Critical variables:**
```env
MONGODB_URI=mongodb://localhost:27017/portfolio_db
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
JWT_SECRET=your_super_secret_key
ADMIN_EMAIL=nigmanand-dev@gmail.com
```

### 3. Start Development

```bash
# Start all services
npm run dev

# Or individually:
npm run dev:server  # Backend on :5000
npm run dev:client  # Client on :3000
npm run dev:admin   # Admin on :3001
```

### 4. Access

- **Public Portfolio**: http://localhost:3000
- **Admin Panel**: http://localhost:3001
- **API**: http://localhost:5000/api/v1

## 🐳 Docker Deployment

### Development
```bash
docker-compose up -d
```

### Production
```bash
# Build images
docker-compose -f docker-compose.yml build

# Start services
docker-compose -f docker-compose.yml up -d
```

## 📊 Database Collections

| Collection | Purpose |
|------------|---------|
| `users` | User authentication data |
| `profiles` | Portfolio profile information |
| `projects` | Project showcase items |
| `skills` | Technical skills & proficiencies |
| `experiences` | Work experience timeline |
| `education` | Educational background |
| `certifications` | Professional certifications |
| `achievements` | Awards & recognitions |
| `site_settings` | Configurable site settings |
| `audit_logs` | Action audit trail |

## 🔐 Authentication Flow

1. User clicks "Login with Google"
2. Redirects to Google OAuth consent screen
3. Google returns user profile
4. System checks email against `ADMIN_EMAIL`
5. If match: grants admin role, issues JWT
6. If no match: read-only or access denied
7. JWT stored in httpOnly cookie + localStorage

## 🛣️ API Routes

### Public Endpoints
```
GET  /api/v1/projects          # List projects (published only)
GET  /api/v1/projects/:slug    # Get project details
GET  /api/v1/skills            # List skills
GET  /api/v1/experiences       # List experiences
GET  /api/v1/profile           # Get profile
```

### Admin Endpoints (Requires Auth)
```
POST   /api/v1/projects        # Create project
PATCH  /api/v1/projects/:id    # Update project
DELETE /api/v1/projects/:id    # Delete project

POST   /api/v1/skills          # Create skill
PATCH  /api/v1/skills/:id      # Update skill
DELETE /api/v1/skills/:id      # Delete skill

# Similar patterns for experiences, education, certifications
```

### Authentication
```
GET  /api/v1/auth/google          # Initiate OAuth
GET  /api/v1/auth/google/callback # OAuth callback
GET  /api/v1/auth/me              # Get current user
POST /api/v1/auth/logout          # Logout
POST /api/v1/auth/refresh         # Refresh token
```

## 🎨 Admin Panel Features

### Dashboard
- Quick stats overview
- Recent activity
- Quick actions

### Content Management
- **Projects**: Full CRUD, draft/publish, image uploads, tech tags
- **Skills**: Category-based, proficiency levels, ordering
- **Experience**: Timeline builder, rich descriptions
- **Profile**: Bio, social links, resume upload

### Advanced Features
- Visibility toggles
- Content ordering (drag-drop ready)
- Bulk operations
- Search & filters
- Audit log viewer

## 🔧 Tech Stack

### Backend
- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB + Mongoose
- **Cache**: Redis
- **Auth**: JWT + Passport.js (Google OAuth)
- **Validation**: Zod
- **Logging**: Winston

### Frontend (Client)
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State**: TanStack Query
- **Routing**: React Router
- **Animations**: Framer Motion

### Frontend (Admin)
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod
- **State**: TanStack Query
- **Notifications**: React Hot Toast

### DevOps
- **Containerization**: Docker + Docker Compose
- **Web Server**: Nginx (production)
- **Process Manager**: PM2 (optional)

## 🔮 Future Enhancements

### Planned Features
- [ ] Blog/Notes system with Markdown editor
- [ ] AI assistant trained on portfolio data
- [ ] Analytics dashboard (views, engagement)
- [ ] Resume auto-generation from DB
- [ ] Multi-language support (i18n)
- [ ] Email newsletter integration
- [ ] Visitor contact form with spam protection
- [ ] File/image CDN integration
- [ ] Advanced SEO tools
- [ ] Plugin/extension system

### AI Integration Hooks
- Portfolio data export for LLM training
- Chatbot for recruiter Q&A
- Resume customization based on job description
- Content suggestions & optimization

## 📁 Project Structure Details

### Shared Package
```typescript
shared/
├── src/
│   ├── types.ts      # All TypeScript interfaces
│   ├── constants.ts  # Shared constants
│   └── index.ts      # Exports
```

### Server Modules
```
server/src/modules/
├── auth/             # Authentication logic
├── projects/         # Project management
├── skills/           # Skills CRUD
├── experiences/      # Experience management
├── profile/          # Profile editor
└── [future modules]
```

## 🧪 Testing (To Be Implemented)

```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

## 📝 Environment Variables

### Required
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT signing
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth secret
- `ADMIN_EMAIL` - Admin user email

### Optional
- `REDIS_URL` - Redis connection (caching)
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `CLIENT_URL` - Client URL for CORS
- `ADMIN_URL` - Admin URL for CORS

## 🤝 Contributing

This is a personal project, but suggestions and improvements are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - See LICENSE file for details

## 👨‍💻 About

**Built by**: Nigmanand Das  
**Portfolio**: [Your Domain]  
**Role**: Backend-Focused Full-Stack Developer  
**Expertise**: Node.js, Express, MongoDB, React, AI/LLM Integration  
**Organization**: NavGurukul Foundation

---

## 🎓 Design Philosophy

This platform embodies:
- **Backend Excellence**: Clean architecture, proper error handling, logging
- **System Thinking**: Scalable, maintainable, extensible
- **Security First**: Auth hardening, input validation, audit trails
- **User-Centric**: Admin UX, performance, accessibility
- **Future-Ready**: AI hooks, analytics, extensibility

Built not as a website, but as a **product** designed to last 10+ years.

---

**Last Updated**: January 2026  
**Version**: 1.0.0
