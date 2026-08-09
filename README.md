# HireTrack

HireTrack is a full-stack web app that helps students track job and internship applications in one place. Register, log in, add applications, update their status through the pipeline, and see live analytics on a personalized dashboard.

**Live:** https://hiretrack-client.onrender.com (client) · https://hiretrack-server.onrender.com/api/health (server health)

## Features
- Email + password auth with JWT
- Protected routes on both client and server
- CRUD for applications (company, role, type, status, notes)
- Pipeline statuses: Applied → OA → Interview → Offer / Rejected
- Dashboard analytics (total, active, offers, rejected)
- Editorial red-themed UI with dedicated Landing, Applications, Analytics, and Settings surfaces

## Tech stack
- **Frontend:** React 19, Vite, Tailwind CSS, React Router v7, Axios
- **Backend:** Node.js 20+, Express 4, Mongoose 8, JWT, bcryptjs
- **Database:** MongoDB Atlas
- **Deploy:** Render (Node web service + static site, blueprint in `render.yaml`)

## Project structure
```
hiretrack/
├── client/          # Vite + React app
│   ├── src/{api,components,layouts,pages,services,utils}
│   └── .env.example
├── server/          # Express API
│   ├── src/{config,controllers,middleware,models,routes}
│   ├── index.js
│   └── .env.example
└── render.yaml      # Render blueprint (both services)
```

## Local development

**Server**
```
cd server
cp .env.example .env      # fill in MONGO_URI and JWT_SECRET
npm install
npm run dev               # http://localhost:5000
```

**Client**
```
cd client
cp .env.example .env.local
npm install
npm run dev               # http://localhost:5173
```

## Environment variables

**Server** (`server/.env`)
- `MONGO_URI` — MongoDB Atlas connection string (required)
- `JWT_SECRET` — long random string used to sign tokens (required)
- `CLIENT_URL` — comma-separated CORS allowlist for production; leave empty locally
- `PORT` — optional, defaults to 5000

**Client** (`client/.env.local`)
- `VITE_API_URL` — API base URL, must include `/api` suffix (e.g. `http://localhost:5000/api`)

Startup will fail fast if `MONGO_URI` or `JWT_SECRET` is missing on the server.

## Deployment (Render)

`render.yaml` defines both services as a Blueprint. Push to `main`, then in Render:
1. New → Blueprint → point at this repo
2. Fill in secrets in the dashboard: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (server) and `VITE_API_URL` (client)
3. Apply — server exposes `/api/health` for Render's healthcheck

## Author
Tanay Singh — BTech CSE
