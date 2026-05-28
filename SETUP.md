# MIT Mysore Course Registration System — Setup Guide

## Step 1: Supabase Database Setup

1. Go to https://supabase.com and create a free account
2. Click "New Project" and name it `mit-mysore-crms`
3. Note down your **Database Password**
4. Once created, go to **Settings → Database**
5. Copy the **Connection String** (URI format):
   `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
6. Go to **SQL Editor** and run `database/schema.sql` (copy-paste entire file)
7. Then run `database/seed.sql` for sample data

## Step 2: Backend Setup

```bash
cd backend
# Create .env file
copy .env.example .env
# Edit .env and paste your Supabase connection string as DATABASE_URL
notepad .env

# Start backend
npm run dev
```

Backend runs at: http://localhost:5000
Test it: http://localhost:5000/api/health

## Step 3: Frontend Setup

```bash
cd frontend
npm run dev
```

Frontend runs at: http://localhost:5173

## Project Structure

```
DBMS/
├── frontend/          # React + Tailwind + Recharts
│   └── src/
│       ├── pages/     # Dashboard, Students, Courses, Registrations, Reports, Settings
│       ├── components/ # Sidebar, Navbar, Modal
│       └── services/  # API calls (axios)
├── backend/           # Node.js + Express
│   ├── routes/        # students, courses, registrations, dashboard
│   ├── controllers/   # Business logic
│   └── config/        # Database connection
└── database/
    ├── schema.sql     # Table definitions
    └── seed.sql       # Sample data (25 students, 35 courses, ~60 registrations)
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Health check |
| GET | /api/students | All students |
| POST | /api/students | Add student |
| PUT | /api/students/:id | Update student |
| DELETE | /api/students/:id | Delete student |
| GET | /api/courses | All courses |
| GET | /api/courses/semester/:sem | Courses by semester |
| POST | /api/courses | Add course |
| PUT | /api/courses/:id | Update course |
| DELETE | /api/courses/:id | Delete course |
| GET | /api/registrations | All registrations |
| POST | /api/registrations | Register student |
| DELETE | /api/registrations/:id | Remove registration |
| GET | /api/dashboard/stats | Dashboard statistics |
| GET | /api/dashboard/recent | Recent 5 registrations |
| GET | /api/dashboard/top-courses | Top 5 courses by registrations |

## Deployment

### Backend → Render
1. Push code to GitHub
2. Go to render.com → New Web Service
3. Connect your GitHub repo, select `backend/` folder
4. Set environment variable: `DATABASE_URL`
5. Build command: `npm install`
6. Start command: `npm start`

### Frontend → Vercel
1. Go to vercel.com → New Project
2. Connect GitHub repo, select `frontend/` folder
3. Set environment variable: `VITE_API_URL=https://your-render-url.onrender.com`
4. Update `frontend/src/services/api.js` to use `import.meta.env.VITE_API_URL`
