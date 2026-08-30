# B.Harry Logistic Services - Fullstack Web Application

A modern, interactive, and high-performance logistics platform for **B.Harry Logistic Services**, featuring live GPS route tracking across Nigeria, real-time freight cost calculator, client portal, Python/Django REST API backend, and React/Vite frontend.

---

## 🚀 Live Tech Stack

- **Frontend**: React 18, Vite, Framer Motion, Leaflet Maps, Lucide Icons, TailwindCSS. (Configured for **Vercel**)
- **Backend**: Python 3.13, Django 5.0, Django REST Framework, SimpleJWT, WhiteNoise, Gunicorn. (Configured for **Render**)
- **Authentication**: JWT Token Auth & Google OAuth One-Tap Sign In.
- **Routing & Maps**: Interactive Leaflet dark tile maps displaying real-time vehicle movement, speed, temperature, and highway waypoints across Nigerian states.

---

## 🛠️ Step-by-Step GitHub & Live Hosting Guide

### Step 1: Push Code to GitHub
Open your terminal in the root directory (`harry_logistic`) and run:

```bash
# 1. Initialize Git repository
git init

# 2. Add all files (the root .gitignore automatically excludes node_modules and venv)
git add .

# 3. Commit the code
git commit -m "Initial commit of B.Harry Logistics fullstack application"

# 4. Connect to your GitHub repository (replace with your repo URL)
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/bharry-logistics.git

# 5. Push to GitHub
git push -u origin main
```

---

### Step 2: Deploy Backend to Render.com
1. Log in to [Render.com](https://render.com).
2. Click **New +** ➔ **Web Service**.
3. Connect your GitHub repository.
4. Select the **`/backend`** folder as your **Root Directory**.
5. Render will automatically detect the build configuration from `render.yaml` or you can fill:
   - **Environment**: `Python 3`
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn harrylic_backend.wsgi:application`
6. Add Environment Variable:
   - `SECRET_KEY`: `django-insecure-bharry-logistics-super-secret-key-2026` (or generate your own)
7. Click **Deploy Web Service**. Render will build and give you a live URL like:
   `https://bharry-logistics-backend.onrender.com`

---

### Step 3: Deploy Frontend to Vercel.com
1. Log in to [Vercel.com](https://vercel.com).
2. Click **Add New...** ➔ **Project**.
3. Import your GitHub repository (`bharry-logistics`).
4. Select **`/frontend`** as the **Root Directory**.
5. Add Environment Variable:
   - `VITE_API_URL`: `https://bharry-logistics-backend.onrender.com/api`
6. Click **Deploy**. Vercel will build the React site and provide your live domain!

---

## 📁 Repository Structure

```
harry_logistic/
├── .gitignore               # Root gitignore excluding venv, node_modules, sqlite
├── README.md                # Project documentation & live hosting guide
├── backend/                 # Django REST API Backend
│   ├── Procfile             # Render WSGI start command
│   ├── build.sh             # Render automated build & migration script
│   ├── render.yaml          # Render deployment spec
│   ├── requirements.txt     # Python dependencies (Django, DRF, Whitenoise, etc.)
│   ├── manage.py
│   ├── harrylic_backend/    # Main settings & URL routing
│   └── apps/
│       ├── authentication/  # User models, JWT & Google Sign-In
│       ├── tracking/        # Live GPS telemetry & Nigerian route waypoints
│       └── quotes/          # Distance-based Nigerian freight rate calculator
└── frontend/                # React Vite Frontend
    ├── vercel.json          # Vercel SPA routing rewrite config
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── components/      # LiveMapTracker, Hero, QuoteCalculator, AuthModal, etc.
        └── services/        # API client connected to Django backend
```
