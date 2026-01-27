# HireTrack 🚀

HireTrack is a full-stack web application that helps students track job and internship applications in one place. Users can register, log in, add applications, update their progress, and view real-time analytics on a personalized dashboard.

The goal of this project is to demonstrate real-world full-stack development skills including authentication, protected routes, CRUD operations, backend stability, and frontend–backend integration.

FEATURES
- User authentication (Register & Login)
- JWT-based protected routes
- Add job/internship applications
- Update application status (Applied, Interview, Offer, Rejected)
- Delete applications
- Dashboard analytics
- Secure backend with MongoDB
- Clean React + Tailwind UI

TECH STACK

Frontend:
- React (Vite)
- Tailwind CSS
- Axios

Backend:
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

PROJECT STRUCTURE

hiretrack
├── client
│   ├── src
│   │   ├── api
│   │   ├── pages
│   │   ├── services
│   │   ├── components
│   │   ├── utils
│   │   └── App.jsx
│   └── package.json
├── server
│   ├── src
│   │   ├── controllers
│   │   ├── models
│   │   ├── routes
│   │   ├── middleware
│   │   └── config
│   └── package.json
└── README.md

RUNNING THE PROJECT LOCALLY

BACKEND SETUP
1. Open terminal
2. Navigate to backend folder:
   cd server
3. Install dependencies:
   npm install
4. Start backend server:
   npm run dev
5. Backend runs on:
   http://localhost:5000

FRONTEND SETUP
1. Open a new terminal
2. Navigate to frontend folder:
   cd client
3. Install dependencies:
   npm install
4. Start frontend:
   npm run dev
5. Frontend runs on:
   http://localhost:5173

AUTHENTICATION FLOW
- User registers or logs in
- JWT token is returned by backend
- Token is stored in localStorage
- Protected routes require token
- Unauthorized access redirects to login

DASHBOARD ANALYTICS
- Total applications
- Active applications
- Offers received
- Rejected applications
- Data updates in real time

PROJECT STATUS
- Authentication: COMPLETE
- Applications CRUD: COMPLETE
- Dashboard analytics: COMPLETE
- Frontend–Backend integration: COMPLETE
- Backend stability: FIXED
- Ready for deployment

AUTHOR
Tanay Singh
BTech CSE Student
HireTrack – Full Stack Portfolio Project
