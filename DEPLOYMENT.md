# 🚀 Deployment Guide

## 📋 Prerequisites

1. **GitHub Account** - [Sign up here](https://github.com)
2. **MongoDB Atlas Account** - [Sign up here](https://www.mongodb.com/atlas)
3. **Vercel Account** (Recommended) - [Sign up here](https://vercel.com)

## 🔧 Step 1: Set Up MongoDB Atlas

### 1.1 Create MongoDB Cluster
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (M0 Free tier is perfect)
4. Choose your preferred cloud provider and region

### 1.2 Configure Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Create a username and password (save these!)
4. Select "Read and write to any database"
5. Click "Add User"

### 1.3 Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Click "Confirm"

### 1.4 Get Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your actual password

## 🔧 Step 2: Initialize Git Repository

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Trello-like board management app"

# Create .env.local file (create this file manually)
echo "MONGODB_URI=your_mongodb_connection_string_here" > .env.local
echo "NEXTAUTH_SECRET=your_nextauth_secret_here" >> .env.local
echo "NEXTAUTH_URL=http://localhost:3000" >> .env.local
```

## 🔧 Step 3: Push to GitHub

### 3.1 Create GitHub Repository
1. Go to [GitHub](https://github.com)
2. Click the "+" icon in the top right
3. Select "New repository"
4. Name it `wisdomhub` or your preferred name
5. Make it **Public** (for free hosting)
6. **Don't** initialize with README (we already have one)
7. Click "Create repository"

### 3.2 Push Your Code
```bash
# Add GitHub as remote origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## 🚀 Step 4: Deploy to Vercel (Recommended)

### 4.1 Connect to Vercel
1. Go to [Vercel](https://vercel.com)
2. Sign up with your GitHub account
3. Click "New Project"
4. Import your GitHub repository
5. Click "Import"

### 4.2 Configure Environment Variables
1. In the Vercel dashboard, go to your project
2. Click "Settings" → "Environment Variables"
3. Add these variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `NEXTAUTH_SECRET`: A random string (you can generate one)
   - `NEXTAUTH_URL`: Your Vercel URL (e.g., `https://your-app.vercel.app`)

### 4.3 Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Your app will be live at `https://your-app.vercel.app`

## 🌐 Alternative Hosting Options

### Netlify
1. Go to [Netlify](https://netlify.com)
2. Connect your GitHub repository
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Add environment variables in Netlify dashboard

### Railway
1. Go to [Railway](https://railway.app)
2. Connect your GitHub repository
3. Add environment variables
4. Deploy automatically

## 🔧 Step 5: Update Environment Variables

After deployment, update your `.env.local` file:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wisdomhub?retryWrites=true&w=majority
NEXTAUTH_SECRET=your_generated_secret_here
NEXTAUTH_URL=https://your-app.vercel.app
```

## 🎯 Step 6: Test Your Deployment

1. Visit your deployed URL
2. Register a new account
3. Create a board
4. Add lists and cards
5. Test drag and drop functionality
6. Test dark mode toggle

## 🔧 Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**
   - Check your connection string
   - Ensure IP whitelist includes `0.0.0.0/0`
   - Verify username/password

2. **Build Errors**
   - Check that all dependencies are in `package.json`
   - Ensure TypeScript compilation passes locally

3. **Environment Variables**
   - Double-check all environment variables are set in Vercel
   - Ensure no typos in variable names

### Useful Commands:

```bash
# Test build locally
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Run production build locally
npm start
```

## 🎉 Success!

Your Trello-like app is now:
- ✅ Hosted on Vercel
- ✅ Connected to MongoDB Atlas
- ✅ Pushed to GitHub
- ✅ Ready for production use

## 📱 Next Steps

1. **Custom Domain**: Add a custom domain in Vercel settings
2. **Analytics**: Add Google Analytics or Vercel Analytics
3. **Monitoring**: Set up error monitoring with Sentry
4. **CI/CD**: Configure automatic deployments on push to main branch

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [GitHub Pages](https://pages.github.com)

---

**Need help?** Check the troubleshooting section or create an issue in your GitHub repository!
