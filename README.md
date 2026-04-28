# React + Vite + Node + MySQL

This repository contains a simple full-stack demo app:

- `frontend/`: React + Vite app with a login form
- `backend/`: Node.js + Express API using Sequelize ORM and MySQL

## Setup

1. Install dependencies for both apps:
   - `cd backend && npm install`
   - `cd frontend && npm install`

2. Configure MySQL in `backend/.env` or use the defaults from `backend/.env.example`.
   - use `backend/.env.production.example` for production values

3. Configure frontend API base in `frontend/.env` or use `frontend/.env.example`.
   - use `frontend/.env.production` for production values
   - `VITE_API_BASE=http://localhost:4000/api/auth`

4. Start the backend server:
   - `cd backend && npm run dev`

5. Start the frontend app:
   - `cd frontend && npm run dev`

## Demo credentials

- Admin: `admin@admin.com`
- Password: `Admin123!`

- User: `demo@demo.com`
- Password: `Password123!`

## Notes

- Login uses JWT issued by the backend.
- Backend protects routes using JWT authentication middleware.
- The frontend stores the JWT in `localStorage` after login.
