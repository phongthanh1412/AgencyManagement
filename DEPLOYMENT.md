# Deployment Guide

## Frontend Deployment (Vercel)

### Step 1: Push to GitHub
Make sure your code is pushed to GitHub:
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Import your GitHub repository: `AgencyManagement`
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add Environment Variable:
   - `VITE_API_URL` = Your backend URL (you'll get this from Render after deploying backend)

6. Click "Deploy"

### Step 3: Update API URL After Backend Deployment
After deploying the backend, go back to Vercel:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Update `VITE_API_URL` with your Render backend URL
4. Redeploy the frontend

---

## Backend Deployment (Render)

### Step 1: Prepare Backend
Your backend is ready with the start script in package.json.

### Step 2: Deploy to Render
1. Go to [render.com](https://render.com) and sign in with GitHub
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `AgencyManagement`
4. Configure the service:
   - **Name**: `agencymanagement-backend`
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

5. Add Environment Variables:
   - `PORT` = `10000` (or leave default)
   - `MONGODB_URI` = Your MongoDB connection string
   - `JWT_SECRET` = Your JWT secret key
   - `NODE_ENV` = `production`

6. Click "Create Web Service"

### Step 3: Get Backend URL
After deployment completes, copy the backend URL (e.g., `https://agencymanagement-backend.onrender.com`)

---

## Update Frontend API Configuration

After getting your backend URL from Render, update the frontend API configuration:

1. Go to Vercel dashboard
2. Select your frontend project
3. Go to Settings → Environment Variables
4. Add or update: `VITE_API_URL` = `https://your-backend-url.onrender.com`
5. Redeploy the frontend

---

## Important Notes

1. **MongoDB**: Make sure your MongoDB connection string is accessible from Render (use MongoDB Atlas for cloud database)
2. **CORS**: Your backend already has CORS enabled, but you may want to restrict it to your frontend URL in production
3. **Environment Variables**: Never commit .env files to GitHub
4. **Free Tier Limits**: 
   - Render free tier spins down after inactivity (may take 30s to wake up)
   - Vercel has bandwidth and build time limits

---

## Testing Deployment

1. Visit your Vercel frontend URL
2. Try to log in or sign up
3. Check if the frontend can communicate with the backend
4. Monitor Render logs for any backend errors
