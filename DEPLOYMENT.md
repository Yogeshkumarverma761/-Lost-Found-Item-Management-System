# 🚀 Deployment Guide

Follow these steps to deploy the Lost & Found Item Management System.

## 🔙 Backend (Render)
1. **Create Web Service**: Connect your GitHub repo.
2. **Root Directory**: `backend`
3. **Build Command**: `npm install`
4. **Start Command**: `node server.js`
5. **Environment Variables**:
   - `MONGO_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A secure string for JWT.
   - `FRONTEND_URL`: Your Vercel frontend URL (e.g., `https://myapp.vercel.app`).

## 🔜 Frontend (Vercel)
1. **Create Project**: Connect your GitHub repo.
2. **Root Directory**: `frontend`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Environment Variables**:
   - `VITE_API_URL`: Your Render backend URL + `/api` (e.g., `https://mybackend.onrender.com/api`).

---

## 🛠️ Local Development
To run both backend and frontend locally from the root:
```bash
npm run dev
```
