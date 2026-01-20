# Deployment Guide

## 📦 Prerequisites

1. **Accounts needed (all free):**
   - GitHub (already have)
   - MongoDB Atlas: https://www.mongodb.com/cloud/atlas/register
   - Render.com: https://render.com/
   - Vercel: https://vercel.com/

## 🗄️ Step 1: Setup MongoDB Atlas

```bash
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free cluster (M0 Sandbox - 512MB)
3. Create database user with password
4. Whitelist IP: 0.0.0.0/0 (Allow from anywhere)
5. Get connection string:
   mongodb+srv://username:password@cluster.mongodb.net/portfolio
```

## 🔧 Step 2: Deploy Backend to Render

```bash
1. Go to https://render.com/
2. Connect your GitHub repository
3. Create New > Web Service
4. Select your repo: nigam-dev/Portfolio
5. Configure:
   - Name: portfolio-backend
   - Region: Oregon (US West)
   - Branch: main
   - Root Directory: server
   - Environment: Node
   - Build Command: npm install && npm run build
   - Start Command: npm start
   - Plan: Free

6. Add Environment Variables:
   NODE_ENV=production
   MONGODB_URI=<your-mongodb-atlas-connection-string>
   JWT_SECRET=<generate-random-32-char-string>
   JWT_EXPIRE=7d
   CLIENT_URL=<will-add-after-vercel>
   ADMIN_URL=<will-add-after-vercel>
   CORS_ORIGINS=<will-add-after-vercel>
   PORT=4000

7. Deploy!
8. Copy your backend URL: https://portfolio-backend-xxx.onrender.com
```

## 🌐 Step 3: Deploy Client to Vercel

```bash
1. Go to https://vercel.com/
2. Import Git Repository
3. Select: nigam-dev/Portfolio
4. Configure:
   - Project Name: portfolio-client
   - Framework Preset: Vite
   - Root Directory: apps/client
   - Build Command: npm run build
   - Output Directory: dist

5. Environment Variables:
   VITE_API_URL=https://portfolio-backend-xxx.onrender.com/api/v1

6. Deploy!
7. Copy your URL: https://portfolio-client-xxx.vercel.app
```

## 🔐 Step 4: Deploy Admin Panel to Vercel

```bash
1. In Vercel Dashboard > New Project
2. Select same repository
3. Configure:
   - Project Name: portfolio-admin
   - Framework Preset: Vite
   - Root Directory: apps/admin
   - Build Command: npm run build
   - Output Directory: dist

4. Environment Variables:
   VITE_API_URL=https://portfolio-backend-xxx.onrender.com/api/v1

5. Deploy!
6. Copy your URL: https://portfolio-admin-xxx.vercel.app
```

## 🔄 Step 5: Update Backend CORS

```bash
Go back to Render > Your Backend Service > Environment
Update these variables:
CLIENT_URL=https://portfolio-client-xxx.vercel.app
ADMIN_URL=https://portfolio-admin-xxx.vercel.app
CORS_ORIGINS=https://portfolio-client-xxx.vercel.app,https://portfolio-admin-xxx.vercel.app

Redeploy backend
```

## 👤 Step 6: Create Admin User

```bash
# Using Render Shell:
1. Go to Render Dashboard > Your Service
2. Click "Shell" tab
3. Run: npm run create-admin
4. Enter your email and password

# Or use MongoDB Compass/Atlas UI to create user manually
```

## ✅ Verification Checklist

- [ ] MongoDB Atlas cluster running
- [ ] Backend deployed on Render (check health: /api/v1/health)
- [ ] Client deployed on Vercel
- [ ] Admin panel deployed on Vercel
- [ ] CORS updated with correct URLs
- [ ] Admin user created
- [ ] Login to admin panel works
- [ ] Client fetches data from backend
- [ ] Images upload working

## 🔥 Quick Deploy Script

Run this to commit and push deployment configs:

```bash
git add .
git commit -m "chore: Add deployment configurations"
git push origin main
```

## 📝 Important Notes

1. **Render Free Tier:** Sleeps after 15 mins of inactivity, takes ~30s to wake up
2. **Vercel Free Tier:** Unlimited bandwidth, automatic HTTPS, custom domain support
3. **MongoDB Atlas Free:** 512MB storage, shared cluster
4. **Uptime:** Use UptimeRobot or Cron-job.org to ping backend every 14 mins (keeps awake)

## 🎯 Post-Deployment

1. Add content via admin panel
2. Test all features
3. Add custom domain (optional)
4. Setup analytics (Google Analytics)
5. Add sitemap for SEO

## 🆘 Troubleshooting

**Backend not responding:**
- Check Render logs
- Verify MongoDB connection string
- Check environment variables

**Admin can't connect:**
- Check CORS_ORIGINS includes admin URL
- Verify VITE_API_URL in admin .env

**Client not loading data:**
- Check VITE_API_URL in client .env
- Verify backend is running
- Check browser console for errors

## 🔗 Useful Links

- Render Dashboard: https://dashboard.render.com/
- Vercel Dashboard: https://vercel.com/dashboard
- MongoDB Atlas: https://cloud.mongodb.com/

---

Need help? Check logs in respective platforms or open an issue on GitHub!
