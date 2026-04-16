# SCCIN Deployment Guide

## Frontend Deployment (Vercel)

### Step 1: Push Code to GitHub
```bash
cd c:\Users\tabit\Downloads\fixforward\fixforward
git remote set-url origin https://github.com/TabithaClitus/fixforward.git
git push -u origin master
```

### Step 2: Deploy to Vercel

1. Go to **https://vercel.com**
2. Click **"New Project"**
3. Import your GitHub repository: `TabithaClitus/fixforward`
4. Configure project:
   - **Framework Preset:** Vite
   - **Root Directory:** `./frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

5. Add Environment Variables in Vercel:
   - Name: `VITE_API_URL`
   - Value: `https://your-backend-url.com` (you'll set this after deploying backend)

6. Click **"Deploy"**

---

## Backend Deployment Options

Choose ONE of the following:

### Option A: Deploy to Render (Easiest)

1. Go to **https://render.com**
2. Sign up with GitHub
3. Create **New Web Service**
4. Repository: `fixforward`
5. Configure:
   - **Name:** `fixforward-api`
   - **Runtime:** `python 3.11`
   - **Build Command:** `pip install -r backend/requirements.txt`
   - **Start Command:** `cd backend && python -m uvicorn main:app --host 0.0.0.0 --port 8000`
   - **Root Directory:** `.` (or leave empty)

6. Add Environment Variables:
   - None needed (it will run on their servers)

7. Copy the URL (e.g., `https://fixforward-api.onrender.com`)
8. Go back to Vercel → Settings → Environment Variables
9. Update `VITE_API_URL` to your Render URL

### Option B: Deploy to Railway

1. Go to **https://railway.app**
2. Sign up with GitHub
3. Create new project
4. Deploy from GitHub: `fixforward`
5. Configure:
   - **Start Command:** `cd backend && python -m uvicorn main:app --host 0.0.0.0 --port 8000`
   - **Requirements file path:** `backend/requirements.txt`

6. Get the public URL and update Vercel environment variable

### Option C: Deploy to Heroku Alternative (Fly.io)

1. Go to **https://fly.io**
2. Deploy CLI tool or use web interface
3. Point to the fixforward repository

---

## Post-Deployment

After deploying BOTH frontend and backend:

1. **Test the login:**
   - Go to your Vercel frontend URL
   - Login with Phone: `123`, Password: `admin`

2. **Database Notes:**
   - Each backend deployment will have its own database
   - Run the seed script on your backend platform to create test users

3. **Enable CORS:**
   - Update `main.py` backend CORS origins to include Vercel URL

---

## Quick Terminal Commands

```bash
# Check backend is healthy
curl https://your-backend-url/health

# View backend logs (on Render/Railway/Fly)
# Check their respective dashboards

# Redeploy from GitHub
# Just push new code to GitHub - auto-deploys to Vercel and backend service
```

---

## Troubleshooting

**"Backend server not running" error:**
- Check that backend service is deployed and running
- Verify VITE_API_URL environment variable is set in Vercel
- Check CORS is configured in backend main.py

**Login not working:**
- Ensure backend database is seeded with test user
- Check backend logs for SQL/auth errors

**Blank pages after login:**
- Clear browser cache
- Check browser console for API errors
- Verify backend endpoints are responding
