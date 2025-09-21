# 🚀 Free Deployment Guide

This guide will help you deploy your AI Career Toolkit application for free using Vercel (frontend) and Railway (backend).

## 📋 Prerequisites

- GitHub account
- Vercel account (free)
- Railway account (free)

## 🎯 Deployment Steps

### 1. Backend Deployment (Railway)

#### Step 1: Prepare Backend for Railway
Your backend is already configured for Railway with the `DATABASE_URL` in your `.env` file.

#### Step 2: Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will automatically detect it's a Python app
6. Add environment variables:
   - `DATABASE_URL`: Your existing database URL
   - `SECRET_KEY`: Your secret key
   - `DEBUG`: `False` (for production)

#### Step 3: Get Railway URL
After deployment, Railway will give you a URL like: `https://your-app-name.railway.app`

### 2. Frontend Deployment (Vercel)

#### Step 1: Update Environment Variables
Update your `vercel.json` file with your Railway backend URL:

```json
{
  "env": {
    "VITE_API_BASE": "https://your-actual-railway-url.railway.app"
  }
}
```

#### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect it's a Vite React app
6. Add environment variable:
   - `VITE_API_BASE`: Your Railway backend URL

#### Step 3: Deploy
Click "Deploy" and Vercel will build and deploy your app!

## 🔧 Alternative Free Options

### Option 2: Netlify (Frontend) + Render (Backend)

#### Frontend (Netlify):
1. Go to [netlify.com](https://netlify.com)
2. Connect GitHub repository
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variable: `VITE_API_BASE`

#### Backend (Render):
1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Build command: `pip install -r requirements.txt`
5. Start command: `python run.py`
6. Add environment variables

### Option 3: GitHub Pages (Frontend) + Heroku (Backend)

#### Frontend (GitHub Pages):
1. Enable GitHub Pages in repository settings
2. Use GitHub Actions for deployment
3. Update `vite.config.js` for GitHub Pages

#### Backend (Heroku):
1. Go to [heroku.com](https://heroku.com)
2. Create new app
3. Connect GitHub repository
4. Add environment variables
5. Deploy

## 🌐 Custom Domain (Optional)

Both Vercel and Railway offer free custom domains:
- Vercel: Add custom domain in project settings
- Railway: Add custom domain in app settings

## 📊 Monitoring

- **Vercel**: Built-in analytics and performance monitoring
- **Railway**: Built-in logs and metrics
- **Uptime**: Both services offer excellent uptime

## 💰 Cost Breakdown

- **Vercel**: Free tier includes 100GB bandwidth/month
- **Railway**: Free tier includes $5 credit/month
- **Total Cost**: $0/month

## 🔄 Continuous Deployment

Both services support automatic deployments:
- Push to `main` branch → Automatic deployment
- Preview deployments for pull requests
- Easy rollbacks if needed

## 🛠️ Troubleshooting

### Common Issues:
1. **CORS Errors**: Ensure backend CORS is configured for your frontend domain
2. **Environment Variables**: Double-check all environment variables are set
3. **Build Failures**: Check build logs in deployment dashboard
4. **Database Connection**: Verify DATABASE_URL is correct

### Support:
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Railway: [docs.railway.app](https://docs.railway.app)

## 🎉 Success!

Once deployed, your app will be live at:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app.railway.app`

Your AI Career Toolkit is now live and accessible worldwide! 🌍
