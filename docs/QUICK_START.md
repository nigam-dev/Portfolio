# Quick Start Guide

Get your portfolio platform up and running in 10 minutes!

## Prerequisites Check

Before starting, ensure you have:

- ✅ Node.js 20+ installed (`node --version`)
- ✅ MongoDB running locally or connection string
- ✅ Google OAuth credentials ([Get them here](https://console.cloud.google.com/))

## Step-by-Step Setup

### 1. Clone and Install (2 minutes)

```bash
# Clone the repository
git clone <your-repo-url>
cd Portfolio

# Install all dependencies
npm install
```

### 2. Environment Configuration (3 minutes)

```bash
# Copy example environment file
cp .env.example .env
```

Edit `.env` and set these required values:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/portfolio_db

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# Security
JWT_SECRET=generate_random_secret_here

# Admin Email (IMPORTANT!)
ADMIN_EMAIL=your-email@gmail.com
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Setup Google OAuth (5 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Set Authorized Redirect URIs:
   - `http://localhost:5000/api/v1/auth/google/callback`
6. Copy Client ID and Secret to `.env`

### 4. Start Development (1 minute)

```bash
# Start MongoDB (if not running)
docker run -d -p 27017:27017 --name mongo mongo:7

# Start all services
npm run dev
```

This starts:
- ✅ Backend API on http://localhost:5000
- ✅ Public Client on http://localhost:3000
- ✅ Admin Panel on http://localhost:3001

### 5. Seed Sample Data (Optional)

```bash
# Build the server first
cd server
npm run build

# Run seed script
npm run seed
```

## First Login

1. Open http://localhost:3001 (Admin Panel)
2. Click "Sign in with Google"
3. Authenticate with your Google account
4. If your email matches `ADMIN_EMAIL`, you'll get admin access!

## Verify Everything Works

### Check Backend Health
```bash
curl http://localhost:5000/health
# Should return: {"status":"ok","timestamp":"..."}
```

### Check API
```bash
curl http://localhost:5000/api/v1/projects
# Should return list of projects
```

### Check Frontend
Visit http://localhost:3000 - you should see the portfolio homepage!

## Common Issues & Solutions

### MongoDB Connection Failed

**Error:** `MongooseServerSelectionError`

**Solution:**
```bash
# Start MongoDB
docker run -d -p 27017:27017 --name mongo mongo:7

# Or if using Homebrew
brew services start mongodb-community
```

### Google OAuth Error

**Error:** `redirect_uri_mismatch`

**Solution:**
- Verify callback URL in Google Console matches `.env`
- Ensure no trailing slashes
- Use exact same protocol (http vs https)

### Port Already in Use

**Error:** `EADDRINUSE: address already in use`

**Solution:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port in .env
PORT=5001
```

### Admin Access Denied

**Error:** "You do not have admin privileges"

**Solution:**
- Verify `ADMIN_EMAIL` in `.env` matches your Google account
- Check server logs for email being used
- Restart server after changing `.env`

## Next Steps

### Add Your First Project

1. Go to http://localhost:3001/projects
2. Click "Add Project"
3. Fill in details
4. Publish!

### Customize Profile

1. Go to http://localhost:3001/profile
2. Update your bio, tagline, social links
3. Save changes

### Add Skills

1. Go to http://localhost:3001/skills
2. Add your technical skills with proficiency levels
3. Organize by categories

## Development Workflow

```bash
# Start all services
npm run dev

# Or start individually
npm run dev:server  # Backend only
npm run dev:client  # Client only
npm run dev:admin   # Admin only

# Type checking
npm run type-check

# Build for production
npm run build
```

## Docker Quick Start

Prefer Docker? Run everything in containers:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## Production Deployment

Ready to deploy? See detailed guides:

- [Deployment Guide](docs/DEPLOYMENT.md) - Full production setup
- [API Documentation](docs/API.md) - Complete API reference
- [Architecture](docs/ARCHITECTURE.md) - System design details

## Getting Help

- 📖 Check [Documentation](docs/)
- 🐛 Open an [Issue](https://github.com/your-username/Portfolio/issues)
- 💬 Ask questions in [Discussions](https://github.com/your-username/Portfolio/discussions)

## What's Next?

- [ ] Customize your profile
- [ ] Add your projects
- [ ] List your skills
- [ ] Document your experience
- [ ] Make it public!
- [ ] Get feedback
- [ ] Share with recruiters

---

**🎉 Congratulations!** Your portfolio platform is ready. Start building your online presence!

Need help? Check the [full README](README.md) or [development guide](docs/DEVELOPMENT.md).
