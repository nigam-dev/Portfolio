#!/bin/bash

echo "🚀 Portfolio Deployment Helper"
echo "================================"
echo ""

# Check if all required files exist
echo "✓ Checking deployment configurations..."

if [ ! -f "render.yaml" ]; then
    echo "❌ render.yaml not found!"
    exit 1
fi

if [ ! -f "apps/client/vercel.json" ]; then
    echo "❌ apps/client/vercel.json not found!"
    exit 1
fi

if [ ! -f "apps/admin/vercel.json" ]; then
    echo "❌ apps/admin/vercel.json not found!"
    exit 1
fi

echo "✓ All deployment configs found!"
echo ""

# Prompt for MongoDB URI
echo "📝 Please enter your MongoDB Atlas connection string:"
read -p "MONGODB_URI: " mongodb_uri

if [ -z "$mongodb_uri" ]; then
    echo "❌ MongoDB URI is required!"
    exit 1
fi

# Generate JWT secret
jwt_secret=$(openssl rand -hex 32)
echo "✓ Generated JWT Secret: $jwt_secret"
echo ""

# Create .env.production for server
echo "📝 Creating server/.env.production..."
cat > server/.env.production << EOF
NODE_ENV=production
PORT=4000
MONGODB_URI=$mongodb_uri
JWT_SECRET=$jwt_secret
JWT_EXPIRE=7d
REDIS_URL=
CLIENT_URL=
ADMIN_URL=
CORS_ORIGINS=
EOF

echo "✓ server/.env.production created!"
echo ""

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Commit and push to GitHub:"
echo "   git add ."
echo "   git commit -m 'chore: Add deployment configurations'"
echo "   git push origin main"
echo ""
echo "2. Deploy backend on Render.com"
echo "3. Deploy client on Vercel"
echo "4. Deploy admin on Vercel"
echo "5. Update CORS URLs in Render"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
