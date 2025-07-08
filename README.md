# MatchyApp 🤝

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-active-brightgreen)
![Frontend](https://img.shields.io/badge/frontend-Vercel-black?logo=vercel)
![Backend](https://img.shields.io/badge/backend-Render-blue?logo=render)

MatchyApp is a simple mentor-mentee matching web app built to help incubators and accelerators connect mentors with mentees. It allows mentees to find mentors, send mentorship requests, book sessions, and receive feedback. Mentors can manage requests, set availability, and leave feedback after sessions. Admins can view all users, assign mentors, and monitor the whole process.

This project was built by me, **Ochuko**, as part of my software development journey.

---

## 🔧 Tech Stack

- **Frontend:** React, TypeScript, TailwindCSS, Axios
- **Backend:** Node.js, Express, TypeScript, MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Email Service:** Nodemailer (Gmail used for reminders)
- **Hosting:** Vercel (Frontend) & Render (Backend)

---

## ✨ Features (CRUD + More)

### ✅ Auth
- Register & Login based on role: Mentee, Mentor, Admin
- JWT-based secure sessions

### ✅ Profiles (CRUD)
- View & update profile info for mentors and mentees

### ✅ Mentorship Requests (CRUD)
- Mentees send mentorship requests to mentors
- Mentors accept/reject requests
- Admins can assign mentors manually

### ✅ Sessions (CRUD)
- Mentees book sessions with mentors
- View upcoming sessions
- Email reminders are sent to both users after booking

### ✅ Feedback (CRUD)
- Mentees give session ratings
- Mentors write feedback after sessions

### ✅ Availability (CRUD)
- Mentors add available time slots for sessions

---

## 📁 Project Folder Structure

MatchyApp/
│
├── Backend/
│ ├── controller/
│ ├── config/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── utils/
│ └── index.js
│
├── m-frontend/
│ └── src/
│ ├── components/
│ ├── pages/
│ ├── context/
│ ├── routes/
│ ├── services/
│ ├── utils/
│ └── App.tsx
│
├── .gitignore
├── README.md ← you are here ✅


---

## 🚀 Getting Started

### Prerequisites

- Node.js + npm
- MongoDB
- Gmail account for email service

---

### Installation

```bash
# Clone the repo
git clone https://github.com/Chuky006/MatchyApp.git

# Backend setup
cd MatchyApp/Backend
npm install

# Create .env file from template
cp .env.example .env
# Add your environment variables (see below)

npm run dev

# Frontend setup (in a new terminal)
cd ../m-frontend
npm install
npm run dev

🔐 Backend .env Example
Create a .env file inside the Backend folder and add:

PORT=5000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret-key
CLIENT_URL=https://matchy-app.vercel.app

EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASS=your-gmail-app-password

📬 API Routes Summary
🔑 Auth
POST /api/auth/register – Register user

POST /api/auth/login – Login user

GET /api/auth/me – Get current logged-in user

👤 Profile
GET /api/profile/me – View profile

PUT /api/profile/editProfile – Edit profile

📩 Requests
POST /api/requests – Send mentorship request

GET /api/requests/sent – View sent requests (mentee)

GET /api/requests/received – View received requests (mentor)

PUT /api/requests/:id – Update request status

📅 Sessions
POST /api/sessions – Book session

GET /api/sessions – View sessions

PUT /api/sessions/:sessionId/mentee-feedback – Mentee submits rating

PUT /api/sessions/:sessionId/mentor-feedback – Mentor submits feedback

📆 Availability
POST /api/availability – Set mentor availability

GET /api/availability/:mentorId – View mentor's slots

🛡 Role-Based Access
Admin: Full control over users, sessions, and assignments

Mentor: Respond to requests, manage availability, provide feedback

Mentee: Request mentorship, book sessions, rate sessions

💌 Email Feature
Nodemailer is used to send automatic email reminders when a session is booked.

It uses your Gmail account (via app password) securely from environment variables.

📝 License
This project is open-source under the MIT License.

🙋‍♂️ Author
Built by Ochuko
GitHub: @Chuky006
