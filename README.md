# ResuAI – AI-Powered Resume Builder

---

Backend Repository : https://github.com/nachiket7-dev/ResuAI_backend

---

Frontend : https://resu-ai-frontend.vercel.app/

Backend : https://resuai-backend-5o18.onrender.com

---

## 1. Project Title

**ResuAI – Intelligent Resume Creation Platform**

---

## 2. Problem Statement

Creating a polished resume is tedious and time-consuming. Most people struggle to format their experience, highlight achievements, and tailor content for different roles. ResuAI solves this by combining a guided editing experience with AI-powered suggestions, making resume creation faster, smarter, and easier for all users.

---

## 3. System Architecture

Frontend (React + Redux + Vite)
│
▼
Backend API (Node.js + Express)
│
▼
Database (MongoDB Atlas)


**Authentication**: JWT-based login/signup  
**AI Integration**: OpenAI for summary and job description enhancement  
**Media Storage**: ImageKit for profile images and optional background removal  
**Hosting**:
- Frontend → Vercel
- Backend → Render/Railway
- Database → MongoDB Atlas

---

## 4. System Components

### Frontend
- React 19 + Vite
- React Router for routing
- Redux Toolkit for state management
- Axios for API communication
- Tailwind CSS for styling

### Backend
- Node.js + Express
- Mongoose (MongoDB)
- JWT + bcrypt for authentication
- Multer for uploads
- ImageKit SDK for image hosting & processing
- Gemini API for AI features

---

## 5. Key Features

| Category                     | Features                                                                 |
|-----------------------------|--------------------------------------------------------------------------|
| Authentication & Authorization | User registration, login, logout, protected routes with JWT             |
| CRUD Operations             | Create, read, update, delete resumes                                      |
| Frontend Routing            | Pages: Home, Login, Dashboard, Resume Builder, Preview                    |
| AI Assistance               | Enhance professional summary & job descriptions, parse PDF resumes        |
| Templates & Styling         | Choose templates, change accent colors, live preview                      |
| Resume Sharing              | Toggle public/private, shareable public resume URLs                       |
| File Uploads                | Profile image upload with optional background removal via ImageKit        |
| Hosting                     | Deployed frontend (Vercel) + backend (Render/Railway) + MongoDB Atlas     |

---

## 6. Tech Stack

| Layer         | Technologies                                                                 |
|---------------|-------------------------------------------------------------------------------|
| Frontend      | React, Redux Toolkit, React Router, Axios, Tailwind CSS (lucide icons)        |
| Backend       | Node.js, Express.js                                                           |
| Database      | MongoDB Atlas (Mongoose)                                                      |
| Authentication| JWT + bcrypt                                                                  |
| AI            | Gemini API (text generation, PDF parsing)                                     |
| Media Storage | ImageKit (image hosting + background removal)                                 |
| Hosting       | Vercel (frontend), Render/Railway (backend), MongoDB Atlas (database)         |

---

## 7. API Overview

| Endpoint                   | Method | Description                           | Access       |
|---------------------------|--------|---------------------------------------|--------------|
| `/api/users/register`     | POST   | Register a new user                   | Public       |
| `/api/users/login`        | POST   | Authenticate user & issue token       | Public       |
| `/api/users/resumes`      | GET    | Get all resumes for logged-in user    | Authenticated|
| `/api/resumes/create`     | POST   | Create a new resume                   | Authenticated|
| `/api/resumes/update`     | PUT    | Update resume content (JSON/FormData) | Authenticated|
| `/api/resumes/delete/:id` | DELETE | Delete a resume                       | Authenticated|
| `/api/resumes/get/:id`    | GET    | Get a single resume (private)         | Authenticated|
| `/api/resumes/public/:id` | GET    | Get public resume (public view)       | Public       |
| `/api/ai/enhance-pro-sum` | POST   | AI-enhanced professional summary      | Authenticated|
| `/api/ai/enhance-job-desc`| POST   | AI-enhanced job description           | Authenticated|
| `/api/ai/upload-resume`   | POST   | Extract data from PDF resume          | Authenticated|

---

## ✅ Summary

ResuAI is a full-stack resume builder with a modern UI, AI enhancements, customizable templates, ImageKit-powered image uploads, and public sharing features. It’s built for real-world usage and ready to deploy with frontend/backend hosting and a cloud database.
