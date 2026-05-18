# Smart Leads Dashboard

A production-style Full Stack MERN CRM dashboard built with:

- React + TypeScript
- Node.js + Express + TypeScript
- MongoDB Atlas
- JWT Authentication
- Role-Based Access Control
- Docker

This project was built as a technical internship assignment following scalable software engineering practices.

---

# Features

## Authentication

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- bcrypt Password Hashing
- Role-Based Access Control

## Leads Management

- Create Lead
- Update Lead
- Delete Lead
- View Leads
- Search Leads
- Filter Leads
- Sort Leads
- Pagination

## Advanced Features

- Debounced Search
- CSV Export
- Responsive Dashboard UI
- Docker Support
- Centralized Error Handling

---

# Tech Stack

## Frontend

- React.js
- TypeScript
- Tailwind CSS
- Axios
- React Router

## Backend

- Node.js
- Express.js
- TypeScript
- MongoDB + Mongoose
- JWT
- bcrypt

## DevOps

- Docker
- Docker Compose

---

# Folder Structure

```bash
Smart-leads-dashboard
|
├── frontend
│
├── backend
│
├── docker-compose.yml
│
└── README.md
```

---

# Environment Variables

## Root `.env`

Create a `.env` file in the root folder:

```env
PORT=5000

MONGO_URI=your_mongodb_atlas_connection_string

JWT_SECRET=your_jwt_secret
```

---

# Installation

## 1. Clone Repository

```bash
git clone https://github.com/RohanKoriya/Smart-Leads-Dashboard.git3e
```

---

## 2. Navigate To Project

```bash
cd Smart-leads-dashboard
```

---

# Run Using Docker (Recommended)

## Start Application

```bash
docker compose up --build
```

---

## Frontend

```bash
http://localhost:5173
```

---

## Backend

```bash
http://localhost:5000
```

---

# Run Without Docker

---

## Backend Setup

```bash
cd backend

npm install

npm run dev
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

# API Endpoints

## API Documentation

See:

- API_DOCUMENTATION.md

# Roles

## Admin

- Full access
- Can delete leads

## Sales User

- Can manage leads
- Cannot delete leads

---

# Screenshots

Add screenshots here later.

Examples:

- Login Page
- Dashboard
- Create Lead Modal
- Filtering
- CSV Export

---

# Future Improvements

- Dark Mode
- Charts & Analytics
- Email Integration
- Lead Activity Timeline
- Refresh Tokens
- Unit Testing
- CI/CD Pipeline

---

# Author

Rohan Koriya
