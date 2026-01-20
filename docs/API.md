# API Documentation

## Base URL
```
Development: http://localhost:5000/api/v1
Production: https://api.yourdomain.com/api/v1
```

## Authentication

All admin endpoints require authentication via JWT token.

### Headers
```http
Authorization: Bearer <token>
```

### Response Format
```json
{
  "success": true,
  "data": {...},
  "message": "Optional message",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

## Endpoints

### Authentication

#### Initiate Google OAuth
```http
GET /auth/google
```

#### OAuth Callback
```http
GET /auth/google/callback
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "_id": "...",
    "email": "nigmanand-dev@gmail.com",
    "name": "Nigmanand Das",
    "role": "admin"
  }
}
```

### Projects

#### List Projects
```http
GET /projects?page=1&limit=10&category=backend&featured=true

Query Parameters:
- page: Page number (default: 1)
- limit: Items per page (default: 10)
- category: Filter by category
- featured: Filter featured projects
- search: Search in title/description

Response:
{
  "success": true,
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

#### Get Project by Slug
```http
GET /projects/:slug

Response:
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "Project Name",
    "slug": "project-name",
    "description": "...",
    "technologies": ["Node.js", "MongoDB"],
    "category": "backend",
    "featured": true
  }
}
```

#### Create Project (Admin)
```http
POST /projects
Authorization: Bearer <token>

Body:
{
  "title": "New Project",
  "slug": "new-project",
  "shortDescription": "Brief description",
  "description": "Full description",
  "technologies": ["Node.js", "Express"],
  "category": "backend",
  "status": "published",
  "featured": false
}
```

#### Update Project (Admin)
```http
PATCH /projects/:id
Authorization: Bearer <token>

Body: (partial update)
{
  "title": "Updated Title",
  "featured": true
}
```

#### Delete Project (Admin)
```http
DELETE /projects/:id
Authorization: Bearer <token>
```

### Skills

#### List Skills
```http
GET /skills?category=backend

Query Parameters:
- category: Filter by category
- visibility: Filter by visibility (admin only)

Response:
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Node.js",
      "category": "backend",
      "proficiency": "expert",
      "icon": "..."
    }
  ]
}
```

#### Create Skill (Admin)
```http
POST /skills
Authorization: Bearer <token>

Body:
{
  "name": "Python",
  "category": "backend",
  "proficiency": "advanced",
  "order": 1
}
```

### Experience

#### List Experiences
```http
GET /experiences

Response:
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "company": "NavGurukul Foundation",
      "position": "Backend Developer",
      "startDate": "2023-01-01",
      "current": true,
      "technologies": ["Node.js", "MongoDB"]
    }
  ]
}
```

#### Create Experience (Admin)
```http
POST /experiences
Authorization: Bearer <token>

Body:
{
  "company": "Company Name",
  "position": "Position",
  "location": "Location",
  "startDate": "2023-01-01",
  "current": true,
  "description": "...",
  "responsibilities": ["..."],
  "achievements": ["..."],
  "technologies": ["..."]
}
```

### Profile

#### Get Profile
```http
GET /profile

Response:
{
  "success": true,
  "data": {
    "fullName": "Nigmanand Das",
    "tagline": "Backend Developer",
    "bio": "...",
    "socialLinks": [...]
  }
}
```

#### Update Profile (Admin)
```http
PATCH /profile
Authorization: Bearer <token>

Body:
{
  "fullName": "Updated Name",
  "tagline": "New Tagline",
  "bio": "Updated bio"
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Error |
| 500 | Internal Server Error |

## Rate Limiting

- 100 requests per 15 minutes per IP
- Headers included in response:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`
