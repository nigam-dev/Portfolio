# Development Guide

## Setup Development Environment

### 1. Install Dependencies

```bash
# Install all packages
npm install

# Or install per workspace
npm install --workspace=server
npm install --workspace=client
npm install --workspace=admin
npm install --workspace=shared
```

### 2. Start MongoDB and Redis

```bash
# Using Docker
docker run -d -p 27017:27017 --name mongo mongo:7
docker run -d -p 6379:6379 --name redis redis:7-alpine

# Or install locally
brew install mongodb-community
brew install redis

brew services start mongodb-community
brew services start redis
```

### 3. Configure Environment

Copy `.env.example` to `.env` and update values.

### 4. Start Development Servers

```bash
# Start all services concurrently
npm run dev

# Or start individually
npm run dev:server  # Port 5000
npm run dev:client  # Port 3000
npm run dev:admin   # Port 3001
```

## Project Structure

### Server Architecture

```
server/src/
├── config/           # Configuration files
│   ├── index.ts     # Main config
│   ├── database.ts  # MongoDB connection
│   ├── redis.ts     # Redis connection
│   └── passport.ts  # Auth strategies
├── middlewares/     # Express middlewares
│   ├── auth.ts      # Authentication
│   ├── validate.ts  # Request validation
│   └── errorHandler.ts
├── models/          # Mongoose models
│   ├── User.ts
│   ├── Project.ts
│   └── ...
├── modules/         # Feature modules
│   ├── auth/
│   │   ├── routes.ts
│   │   └── controller.ts
│   ├── projects/
│   └── ...
├── utils/           # Utility functions
│   ├── logger.ts
│   └── response.ts
├── app.ts           # Express app setup
└── index.ts         # Entry point
```

### Frontend Architecture

```
apps/client/src/
├── components/      # Reusable components
│   ├── Hero.tsx
│   ├── Projects.tsx
│   └── ...
├── pages/           # Route pages
│   ├── HomePage.tsx
│   └── ProjectsPage.tsx
├── lib/             # Utilities
│   └── api.ts       # API client
├── App.tsx          # Main app component
└── main.tsx         # Entry point
```

## Coding Standards

### TypeScript

- Use strict mode
- Define explicit types
- Avoid `any`
- Use interfaces for objects
- Use enums for constants

```typescript
// Good
interface Project {
  title: string;
  slug: string;
  category: ProjectCategory;
}

// Avoid
const project: any = {...};
```

### Naming Conventions

- **Files**: PascalCase for components, camelCase for utilities
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Components**: PascalCase
- **Functions**: camelCase, descriptive verbs

```typescript
// Good
const getUserById = async (id: string) => {...}
const MAX_FILE_SIZE = 5242880;

// Avoid
const getuser = (i) => {...}
const maxfilesize = 5242880;
```

### API Design

Follow RESTful conventions:

```
GET    /resources      # List
POST   /resources      # Create
GET    /resources/:id  # Read
PATCH  /resources/:id  # Update
DELETE /resources/:id  # Delete
```

### Error Handling

Always use try-catch in async functions:

```typescript
export const getProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projects = await Project.find();
    return sendSuccess(res, projects);
  } catch (error) {
    next(error); // Pass to error handler
  }
};
```

## Testing

### Unit Tests

```bash
# Run tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

### Test Structure

```typescript
describe('ProjectController', () => {
  describe('getProjects', () => {
    it('should return published projects for public users', async () => {
      // Arrange
      const req = mockRequest();
      const res = mockResponse();
      
      // Act
      await getProjects(req, res);
      
      // Assert
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: expect.any(Array)
      });
    });
  });
});
```

## Database

### Adding New Model

1. Create model file in `server/src/models/`
2. Define schema with TypeScript interface
3. Add indexes for frequently queried fields
4. Export model

```typescript
import mongoose, { Schema, Document } from 'mongoose';

interface INewModel extends Document {
  field1: string;
  field2: number;
}

const newModelSchema = new Schema<INewModel>({
  field1: { type: String, required: true },
  field2: { type: Number, default: 0 },
}, { timestamps: true });

newModelSchema.index({ field1: 1 });

export default mongoose.model<INewModel>('NewModel', newModelSchema);
```

### Migrations

For schema changes:

1. Add new fields with default values
2. Create migration script if needed
3. Update TypeScript interfaces
4. Deploy backend first
5. Then deploy frontend

## API Module Pattern

### Creating New Module

1. Create folder in `server/src/modules/`
2. Add `controller.ts` for business logic
3. Add `routes.ts` for endpoint definitions
4. Register routes in `app.ts`

```typescript
// controller.ts
export const getItems = async (req, res, next) => {
  try {
    const items = await Model.find();
    return sendSuccess(res, items);
  } catch (error) {
    next(error);
  }
};

// routes.ts
import { Router } from 'express';
import * as controller from './controller';

const router = Router();
router.get('/', controller.getItems);

export default router;

// app.ts
import itemRoutes from './modules/items/routes';
app.use('/api/v1/items', itemRoutes);
```

## Frontend Development

### Adding New Page

1. Create component in `apps/client/src/pages/`
2. Add route in `App.tsx`
3. Create API hook if needed

```tsx
// pages/NewPage.tsx
export default function NewPage() {
  const { data } = useQuery({
    queryKey: ['items'],
    queryFn: () => api.get('/items'),
  });

  return <div>{/* Component JSX */}</div>;
}

// App.tsx
<Route path="/new" element={<NewPage />} />
```

### Styling Guidelines

- Use Tailwind utility classes
- Create custom classes for repeated patterns
- Support dark mode with `dark:` prefix

```tsx
<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
  <h2 className="text-2xl font-bold mb-4">Title</h2>
</div>
```

## Git Workflow

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates

### Commit Messages

Follow conventional commits:

```
feat: add project filtering by category
fix: resolve authentication token expiry issue
refactor: improve error handling in projects module
docs: update API documentation
```

### Pull Request Process

1. Create feature branch
2. Make changes with clear commits
3. Test thoroughly
4. Update documentation
5. Create PR with description
6. Request review
7. Address feedback
8. Merge after approval

## Debugging

### Server Debugging

```bash
# View logs
npm run dev:server

# Debug specific module
DEBUG=portfolio:* npm run dev:server
```

### Database Queries

```bash
# Connect to MongoDB
docker exec -it portfolio-mongodb mongo

use portfolio_db
db.projects.find().pretty()
```

### API Testing

```bash
# Using curl
curl http://localhost:5000/api/v1/projects

# With authentication
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/v1/admin/projects
```

## Performance

### Backend Optimization

- Use indexes on frequently queried fields
- Implement caching with Redis
- Paginate large result sets
- Use lean() for read-only queries
- Add database query logging in development

### Frontend Optimization

- Use React.memo for expensive components
- Implement code splitting
- Optimize images
- Use TanStack Query caching
- Lazy load routes

## Useful Commands

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build

# Clean install
rm -rf node_modules package-lock.json
npm install

# Docker cleanup
docker system prune -a

# Database backup
docker exec portfolio-mongodb mongodump --out /tmp/backup
```

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Mongoose Documentation](https://mongoosejs.com/docs/guide.html)
- [React Documentation](https://react.dev/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
