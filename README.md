# SkillBridge

# **Project:** SkillBridge – Skill Exchange Platform

SkillBridge is a modern full-stack web application that allows users to **share skills, discover people with complementary skills, and exchange knowledge through skill swaps**.

Users can create profiles, list the skills they can teach, specify the skills they want to learn, discover other users, and send or manage skill-swap requests.

## ✨ Features

### 👤 User Management

* Secure user registration and login
* JWT-based authentication
* Profile creation and editing
* Optional profile photo uploads
* Public/private profile settings

### 🧠 Skill Management

* Add skills you can teach
* Add skills you want to learn
* Add skill descriptions
* Specify proficiency and priority levels
* Set availability preferences

### 🔍 Search & Discovery

* Browse public user profiles
* Search users by skills
* Filter users by location
* Filter users by availability

### 🤝 Skill Swap Management

* Send skill-swap requests
* Accept or reject requests
* Cancel pending requests
* Mark completed swaps
* View swap history

### ⭐ Rating System

* Rate completed skill swaps
* Add feedback comments
* Build user reputation
* Display average ratings

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router
* Axios
* React Hook Form
* React Hot Toast
* Lucide React
* Tailwind CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs
* Multer
* Express Validator
* Helmet
* Express Rate Limit

---

## 📁 Project Structure

```text
SkillBridge/
├── server/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── index.js
│   ├── .env-template
│   └── package.json
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   └── index.js
│   └── package.json
│
├── package.json
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

* [Node.js](https://nodejs.org/)
* npm
* MongoDB Atlas account

### 1. Clone the repository

```bash
git clone <your-github-repository-url>
cd SkillBridge
```

### 2. Install dependencies

Install the root dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
cd server
npm install
```

Install frontend dependencies:

```bash
cd ../client
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `server` folder.

Use `.env-template` as a reference.

```env
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development
```

> **Important:** Never commit your `.env` file to GitHub.

### 4. Run the application

Start the backend from the project root:

```bash
npm start
```

The backend runs on:

```text
http://localhost:5000
```

In another terminal, start the frontend:

```bash
cd client
npm start
```

The frontend runs on:

```text
http://localhost:3000
```

---

## 🔄 Application Flow

```text
Register / Login
       ↓
Complete Profile
       ↓
Add Skills Offered & Wanted
       ↓
Browse / Search Users
       ↓
Send Skill Swap Request
       ↓
Accept / Reject Request
       ↓
Complete Skill Swap
       ↓
Rate & Review
```

---

## 🔐 Security

SkillBridge uses:

* JWT authentication
* Password hashing with bcryptjs
* Input validation
* Helmet security headers
* Rate limiting
* Environment variables for sensitive configuration

---

## 📌 API Overview

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Users

```text
GET    /api/users/browse
GET    /api/users/search
GET    /api/users/:id
PUT    /api/users/profile
POST   /api/users/profile-photo
POST   /api/users/skills-offered
POST   /api/users/skills-wanted
DELETE /api/users/skills-offered/:id
DELETE /api/users/skills-wanted/:id
```

### Skill Swaps

```text
POST /api/swaps
GET  /api/swaps/my-swaps
GET  /api/swaps/:id
PUT  /api/swaps/:id/accept
PUT  /api/swaps/:id/reject
PUT  /api/swaps/:id/complete
PUT  /api/swaps/:id/cancel
POST /api/swaps/:id/rate
```

### Skills

```text
GET /api/skills/popular
GET /api/skills/suggestions
```

---

## 🎯 Use Case

SkillBridge helps people learn from one another without requiring traditional paid courses.

For example:

> A user who knows Python can connect with someone who knows Java and exchange their knowledge through a skill swap.

This creates a community-driven environment where users can **teach what they know and learn what they need**.

---

## 📈 Future Improvements

Possible future enhancements include:

* Real-time chat between matched users
* Notifications
* Advanced recommendation system
* AI-powered skill matching
* Video meeting integration
* Achievement and badge system
* Improved analytics dashboard

---

## 📄 License

This project is intended for educational and portfolio purposes.
