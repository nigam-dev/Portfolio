# Architecture Overview

## System Design Philosophy

This portfolio platform is built as a **personal CMS product**, not a static website. The architecture prioritizes:

1. **Separation of Concerns**: Clear boundaries between layers
2. **Scalability**: Ready to handle growth in traffic and features
3. **Maintainability**: Clean code, modular design, comprehensive docs
4. **Security**: Defense in depth, least privilege
5. **Extensibility**: Easy to add new features without breaking existing ones

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Internet / Users                         │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
┌───────▼────────┐                   ┌─────────▼────────┐
│  Public Client  │                   │   Admin Panel    │
│   (Port 3000)   │                   │   (Port 3001)    │
│ React + Vite    │                   │ React + Vite     │
└───────┬────────┘                   └─────────┬────────┘
        │                                       │
        └───────────────────┬───────────────────┘
                            │
                    ┌───────▼───────┐
                    │   REST API    │
                    │  (Port 5000)  │
                    │ Express + TS  │
                    └───────┬───────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌──────▼──────┐  ┌────────▼────────┐
│   MongoDB      │  │   Redis     │  │  File Storage   │
│  (Port 27017)  │  │ (Port 6379) │  │    /uploads     │
└────────────────┘  └─────────────┘  └─────────────────┘
```

## Technology Stack Rationale

### Backend: Node.js + Express + TypeScript

**Why Node.js?**
- JavaScript/TypeScript everywhere (full-stack consistency)
- Excellent for I/O-intensive operations
- Large ecosystem of packages
- Great performance for API servers

**Why Express?**
- Battle-tested, production-ready
- Minimal, flexible, non-opinionated
- Extensive middleware ecosystem
- Easy to understand and maintain

**Why TypeScript?**
- Type safety prevents bugs
- Better IDE support and autocomplete
- Self-documenting code
- Easier refactoring

### Database: MongoDB

**Why MongoDB?**
- Flexible schema for evolving requirements
- JSON-like documents match JavaScript objects
- Excellent for content management systems
- Built-in aggregation framework
- Easy to scale horizontally

**Alternative Considered**: PostgreSQL (chose MongoDB for schema flexibility)

### Cache: Redis

**Why Redis?**
- In-memory speed for frequently accessed data
- Session storage
- Rate limiting counters
- Future use: job queues, pub/sub

### Frontend: React + Vite

**Why React?**
- Component-based architecture
- Virtual DOM for performance
- Large community and ecosystem
- Excellent tooling

**Why Vite?**
- Lightning-fast HMR
- Modern build tool
- Optimized production builds
- Better DX than Webpack

### Styling: Tailwind CSS

**Why Tailwind?**
- Utility-first approach
- Rapid development
- Consistent design system
- Purges unused CSS
- Dark mode built-in

## Architectural Patterns

### 1. Monorepo Structure

```
portfolio-platform/
├── apps/           # Frontend applications
├── server/         # Backend API
├── shared/         # Shared code (types, constants)
└── docker/         # Deployment configs
```

**Benefits:**
- Single source of truth for types
- Easier to maintain consistency
- Atomic commits across stack
- Shared tooling and configs

### 2. Module-Based Backend

Each feature is self-contained:

```
modules/auth/
├── routes.ts       # API routes
├── controller.ts   # Business logic
├── service.ts      # (optional) Complex logic
└── validation.ts   # (optional) Input schemas
```

**Benefits:**
- Easy to locate code
- Clear boundaries
- Independent testing
- Easy to extract to microservices later

### 3. Repository Pattern (Implicit)

Models encapsulate database operations:

```typescript
// Instead of raw queries everywhere
const projects = await Project.find({ status: 'published' });

// Model encapsulates query logic
const projects = await Project.findPublished();
```

### 4. API-First Design

Frontend apps are pure consumers of APIs:
- No business logic in frontend
- Backend is source of truth
- Easy to build mobile apps later
- Can swap frontend frameworks

## Data Flow

### Public User Request

```
User → Client → API → Database → API → Client → User
```

1. User visits portfolio page
2. React app loads
3. TanStack Query fetches data from API
4. API queries MongoDB
5. Data returned to client
6. React renders components

### Admin Content Update

```
Admin → Admin Panel → API (Auth Check) → Database → Audit Log
```

1. Admin logs in via Google OAuth
2. System verifies email === ADMIN_EMAIL
3. JWT token issued
4. Admin submits content changes
5. API validates token and role
6. Database updated
7. Audit log entry created
8. Success response

## Security Architecture

### Defense Layers

1. **Network**: CORS, rate limiting
2. **Authentication**: JWT + Google OAuth
3. **Authorization**: Role-based access control
4. **Validation**: Zod schemas, sanitization
5. **Database**: NoSQL injection prevention
6. **Logging**: Audit trail for accountability

### Admin Access Flow

```
Login Request
     ↓
Google OAuth
     ↓
Email Check → Is email === ADMIN_EMAIL?
     ↓                ↓
   Yes              No
     ↓                ↓
Grant Admin      Deny Access
     ↓
Issue JWT
     ↓
Store in Cookie + localStorage
```

## Scalability Considerations

### Current Architecture (Single Server)

**Handles:**
- Thousands of daily visits
- Moderate concurrent users
- Reasonable content volume

### Horizontal Scaling Path

When needed:

1. **Load Balancer** in front of multiple API servers
2. **MongoDB Replica Set** for read scaling
3. **Redis Cluster** for distributed caching
4. **CDN** for static assets (CloudFlare, CloudFront)
5. **Separate File Storage** (S3, GCS)

### Vertical Scaling Path

- Increase server resources (CPU, RAM)
- Optimize database indexes
- Implement aggressive caching
- Use connection pooling

## Extension Points

### Adding New Content Types

1. Create Mongoose model
2. Add to shared types
3. Create module (routes + controller)
4. Add admin CRUD pages
5. Display on public site

Example: Adding "Blog Posts"

```typescript
// shared/src/types.ts
export interface IBlogPost {
  title: string;
  slug: string;
  content: string;
  // ...
}

// server/src/models/BlogPost.ts
const blogPostSchema = new Schema<IBlogPost>({...});

// server/src/modules/blog/routes.ts
router.get('/posts', getPostsController);

// apps/admin/src/pages/BlogPosts.tsx
// Admin CRUD interface

// apps/client/src/pages/Blog.tsx
// Public display
```

### AI Integration Hooks

Future AI assistant can:
- Query database directly
- Use audit logs for context
- Generate content suggestions
- Answer recruiter questions

### Analytics Integration

- Capture page views in audit logs
- Track project interest
- Generate heatmaps
- Recruiter engagement metrics

## Deployment Architecture

### Development

```
Localhost → Docker Compose
- All services on single machine
- Hot reloading enabled
- Debug logging
```

### Production

```
Cloud Provider (AWS/GCP/Azure)
├── Web Server (Nginx)
├── Application Servers (Docker Swarm/K8s)
├── Database (Managed MongoDB)
├── Cache (Managed Redis)
└── Storage (S3/GCS)
```

## Performance Optimization

### Backend

- Database indexing on frequently queried fields
- Redis caching for read-heavy data
- Pagination for large datasets
- Lean queries for read-only operations
- Compression middleware

### Frontend

- Code splitting by route
- Lazy loading components
- Image optimization
- TanStack Query caching
- Service worker (future)

## Monitoring & Observability

### Logging

- Winston for structured logs
- Log levels: error, warn, info, debug
- Separate files for errors
- Request logging with correlation IDs

### Health Checks

- `/health` endpoint for uptime monitoring
- Database connection status
- Redis connection status

### Metrics (Future)

- Response times
- Error rates
- Database query performance
- Cache hit rates

## Disaster Recovery

### Backup Strategy

- Daily MongoDB backups
- Point-in-time recovery capability
- Offsite backup storage
- Automated backup testing

### Failure Scenarios

| Scenario | Impact | Recovery |
|----------|--------|----------|
| API server crash | Users can't load data | Docker auto-restart |
| Database failure | Complete outage | Restore from backup |
| Redis failure | Slower performance | System continues without cache |
| Disk full | Uploads fail | Clean old logs, expand disk |

## Future Architecture Evolution

### Phase 2: Multi-Tenant

Support multiple portfolios:
- Subdomain per user
- Shared infrastructure
- Isolated data

### Phase 3: Microservices

If scale demands:
- Auth service
- Content service
- Analytics service
- File service
- API Gateway

### Phase 4: Global

- Multi-region deployment
- CDN edge caching
- Geo-distributed database
- Low latency worldwide

---

**Design Principle**: Build for today, architect for tomorrow.
