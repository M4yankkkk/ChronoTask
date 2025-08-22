# 🚀 ChronoTask Deployment Guide

## Backend Deployment on Render.com

### 1. Create Render Account
- Go to [render.com](https://render.com)
- Sign up with GitHub

### 2. Connect Your Repository
- Click "New +" → "Web Service"
- Connect your GitHub repository
- Select the `chronotask` repository

### 3. Configure the Service
- **Name**: `chronotask-backend`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main` or `master`
- **Build Command**: `cd server && npm install`
- **Start Command**: `cd server && npm start`

### 4. Set Environment Variables
Click "Environment" tab and add:

```
MONGODB_URI=mongodb+srv://cinemayank:mayank485@cluster0.4wddrrc.mongodb.net/
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
```

### 5. Deploy
- Click "Create Web Service"
- Render will build and deploy your backend
- Your API will be available at: `https://your-service-name.onrender.com`

### 6. Update Frontend
After deployment, update your frontend to use the new backend URL:

```javascript
// In client/src/services/todoService.js
const API_BASE_URL = 'https://your-service-name.onrender.com/api';
```

## Frontend Deployment on Vercel

### 1. Connect to Vercel
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository

### 2. Configure Build
- Framework Preset: `Create React App`
- Build Command: `npm run build`
- Output Directory: `client/build`

### 3. Set Environment Variables
Add your backend URL:
```
REACT_APP_API_URL=https://your-service-name.onrender.com
```

### 4. Deploy
- Click "Deploy"
- Your app will be live at: `https://your-app.vercel.app`

## Troubleshooting

### Backend Issues
- Check Render logs for build errors
- Ensure MongoDB URI is correct
- Verify JWT_SECRET is set

### Frontend Issues
- Check if backend URL is correct
- Ensure CORS is properly configured
- Check browser console for errors

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | ✅ |
| `JWT_SECRET` | Secret key for JWT tokens | ✅ |
| `PORT` | Server port (auto-set by Render) | ❌ |
| `NODE_ENV` | Environment (production/development) | ❌ |
