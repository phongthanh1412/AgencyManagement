# Complete Deployment Guide - Step by Step

## 🎯 Overview
- **Backend**: Render (https://render.com)
- **Frontend**: Vercel (https://vercel.com)
- **Database**: MongoDB Atlas (cloud database)

---

## 📋 Prerequisites

### 1. Create MongoDB Atlas Database (if you haven't)
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up/Login
3. Create a FREE cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)
6. **IMPORTANT**: Replace `<password>` with your actual password
7. Add your database name after `.net/` (e.g., `mongodb+srv://user:pass@cluster.mongodb.net/agencydb`)

---

## 🚀 PART 1: Deploy Backend to Render (Do This FIRST!)

### Step 1: Go to Render
1. Visit [render.com](https://render.com)
2. Sign in with GitHub
3. Click **"New +"** button (top right)
4. Select **"Web Service"**

### Step 2: Connect Repository
1. Find and select your repository: **phongthanh1412/AgencyManagement**
2. Click **"Connect"**

### Step 3: Configure Service
Fill in these settings:

| Setting | Value |
|---------|-------|
| **Name** | `agencymanagement-backend` (or any name you like) |
| **Root Directory** | `backend` |
| **Environment** | `Node` |
| **Region** | Choose closest to you (e.g., Oregon USA) |
| **Branch** | `main` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

### Step 4: Add Environment Variables
Click **"Add Environment Variable"** and add these **4 variables**:

| Key | Value | Example |
|-----|-------|---------|
| `PORT` | `10000` | 10000 |
| `MONGODB_URI` | Your MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/agencydb` |
| `JWT_SECRET` | Any random string (keep secret!) | `mySecretKey123!@#` |
| `NODE_ENV` | `production` | production |

### Step 5: Deploy Backend
1. Click **"Create Web Service"**
2. Wait 2-5 minutes for deployment to complete
3. You'll see "Live" with a green dot when ready
4. **COPY YOUR BACKEND URL** (looks like: `https://agencymanagement-backend.onrender.com`)

### Step 6: Test Backend
1. Open your backend URL in browser (e.g., `https://agencymanagement-backend.onrender.com`)
2. You should see: **"Agency System API running"**
3. If you see this, backend is working! ✅

---

## 🌐 PART 2: Deploy Frontend to Vercel

### Step 1: Go to Vercel
1. Visit [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"Add New..."** → **"Project"**

### Step 2: Import Repository
1. Find **phongthanh1412/AgencyManagement**
2. Click **"Import"**

### Step 3: Configure Project
Fill in these settings:

| Setting | Value |
|---------|-------|
| **Framework Preset** | `Vite` (should auto-detect) |
| **Root Directory** | `frontend` (click Edit and select frontend folder) |
| **Build Command** | `npm run build` (auto-filled) |
| **Output Directory** | `dist` (auto-filled) |
| **Install Command** | `npm install` (auto-filled) |

### Step 4: Add Environment Variable
**THIS IS CRITICAL!** Click **"Environment Variables"** and add:

| Name | Value |
|------|-------|
| `VITE_API_URL` | Your Render backend URL from Step 1.5 |

**Example**: 
- Name: `VITE_API_URL`
- Value: `https://agencymanagement-backend.onrender.com`

**⚠️ IMPORTANT**: Do NOT add `/api` at the end! The code already adds it.

### Step 5: Deploy Frontend
1. Click **"Deploy"**
2. Wait 1-2 minutes
3. You'll get a URL like: `https://your-project.vercel.app`
4. Click "Visit" to open your site

### Step 6: Test Frontend
1. Open your Vercel URL
2. Try to register a new user
3. If it works, you're done! 🎉

---

## 🔧 PART 3: Update CORS (Optional but Recommended)

Go back to Render and add one more environment variable:

| Key | Value |
|-----|-------|
| `FRONTEND_URL` | Your Vercel URL (e.g., `https://your-project.vercel.app`) |

This restricts your backend to only accept requests from your frontend.

---

## ❌ Troubleshooting

### Problem 1: "Failed to fetch" error when registering

**Solution:**
1. Go to Vercel → Your Project → Settings → Environment Variables
2. Check if `VITE_API_URL` is set correctly (WITHOUT `/api` at the end)
3. If you just added it or changed it, go to **Deployments** tab
4. Click the three dots (...) on the latest deployment
5. Click **"Redeploy"**
6. **CRITICAL**: Redeploying is required for env variables to take effect!

### Problem 2: Backend shows "Application failed to respond"

**Solution:**
1. Go to Render → Your Backend Service → Logs
2. Check for errors
3. Common issues:
   - Wrong MongoDB connection string
   - MongoDB not allowing connections from Render's IP (add 0.0.0.0/0 in MongoDB Atlas Network Access)

### Problem 3: Page shows error on refresh

**Cause**: This is normal for Vite/React apps with routing
**Solution**: Already fixed in vercel.json with rewrites

### Problem 4: Vercel shows "cd: frontend: No such file or directory"

**Solution**: Make sure "Root Directory" in Vercel is set to `frontend`

### Problem 5: Backend URL ends with `/api/api`

**Solution**: Don't add `/api` to `VITE_API_URL` - the code automatically adds it

---

## 📝 Checklist

**Backend (Render):**
- [ ] Service is "Live" with green dot
- [ ] Opening backend URL shows "Agency System API running"
- [ ] All 4 environment variables set (PORT, MONGODB_URI, JWT_SECRET, NODE_ENV)
- [ ] MongoDB connection string is correct
- [ ] MongoDB Atlas allows connections from anywhere (0.0.0.0/0)

**Frontend (Vercel):**
- [ ] Deployment successful (green checkmark)
- [ ] `VITE_API_URL` environment variable is set (WITHOUT /api at end)
- [ ] Redeployed after setting environment variable
- [ ] Root Directory is set to `frontend`
- [ ] Can open the site without errors

**Testing:**
- [ ] Can register a new user
- [ ] Can login
- [ ] Can see dashboard
- [ ] Can navigate to different pages

---

## 🎉 You're Done!

Your app is now live at:
- **Frontend**: Your Vercel URL
- **Backend**: Your Render URL

Share your frontend URL with others to let them use your app!
