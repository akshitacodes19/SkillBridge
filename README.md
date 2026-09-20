SkillBridge 🔗

SkillBridge is a skill-sharing platform that helps users connect with others based on the skills they can teach and the skills they want to learn.

Users can discover suitable skill partners, communicate in real time, request skill swaps, and manage their learning connections. An admin panel provides tools for monitoring and managing the platform.

🚀 Features
👤 User Features
🔐 User registration and login
👤 User profile management
🖼️ Profile photo support
🛠️ Add skills you can teach
📚 Add skills you want to learn
🔍 Smart skill matching
🔄 Skill swap requests
⭐ User ratings and reviews
💬 Real-time chat
🔔 Platform messages
📊 User skill information
🤝 Smart Matching

SkillBridge provides intelligent skill matching based on:

Skills offered by users
Skills wanted by users
Mutual skill compatibility
Multi-way skill matching

Users can discover potential learning partners instead of manually searching through all users.

🔄 3-Person Multi-Way Skill Matching

SkillBridge supports multi-way skill exchanges involving three users.

For example:

User A teaches → User B
User B teaches → User C
User C teaches → User A

This allows users to participate in skill exchanges even when a direct two-person match is not available.

💬 Real-Time Chat

Users can communicate with their skill partners through real-time messaging.

Features include:

Real-time messages
Chat interface
Conversation history
Socket.IO based communication
🔁 Skill Swaps

Users can request skill exchanges with other users.

A swap can contain:

Skill offered
Skill requested
Recipient
Optional message
Swap status
Creation date
🛡️ Admin Panel

SkillBridge includes a dedicated admin panel for platform management.

🔐 Admin Authentication
Separate admin login
JWT-based authentication
Protected admin routes
Admin-only backend APIs
📊 Dashboard Statistics

The admin dashboard provides platform statistics such as:

Total users
Active users
Banned users
Total skills
Total skill swaps
Average user rating
👥 User Management

Admins can:

View all users
View user information
Monitor account status
Ban users
Unban users

Banned users are prevented from logging into the platform.

🛠️ Skill Moderation

Admins can review user skills and remove inappropriate or unwanted skills.

Supports moderation of:

Skills offered
Skills wanted
🔄 Swap Monitoring

Admins can monitor skill swaps across the platform.

The admin can view:

Requester
Recipient
Offered skill
Requested skill
Swap status
Optional message
Creation date
📢 Platform Messages

Admins can send platform-wide messages to users.

Each message contains:

Title
Message content
Creation date

Users can view platform messages through the application.

📄 Individual User Reports

Admins can download individual user review and feedback reports as CSV files.

Reports can include:

Reviewer name
Reviewer email
Rating
Comment
Review date
Helpful votes
Not helpful votes
Verification status
User response
Response date
🧰 Tech Stack
Frontend
React.js
React Router
Tailwind CSS
Axios
Socket.IO Client
Backend
Node.js
Express.js
MongoDB
Mongoose
Socket.IO
JSON Web Tokens (JWT)
📁 Project Structure

SkillBridge/

├── client/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ │ ├── AdminLogin.js
│ │ │ ├── AdminPanel.js
│ │ │ ├── Chat.js
│ │ │ ├── CycleMatches.js
│ │ │ ├── Swaps.js
│ │ │ └── smartmatches.js
│ │ ├── config/
│ │ │ └── api.js
│ │ └── App.js
│ │
│ └── package.json
│
├── server/
│ ├── models/
│ │ ├── User.js
│ │ ├── ChatMessage.js
│ │ └── PlatformMessage.js
│ │
│ ├── routes/
│ │ ├── auth.js
│ │ ├── chat.js
│ │ ├── cycles.js
│ │ ├── matching.js
│ │ ├── platformMessages.js
│ │ ├── swaps.js
│ │ └── users.js
│ │
│ ├── middleware/
│ │ └── auth.js
│ │
│ └── index.js
│
└── README.md

⚙️ Installation
1. Clone the repository

git clone https://github.com/akshitacodes19/SkillBridge.git

2. Navigate into the project

cd SkillBridge

3. Install frontend dependencies

cd client
npm install

4. Install backend dependencies

cd ../server
npm install

🔑 Environment Variables

Create the required environment files for the frontend and backend.

Example backend configuration:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000

Configure the frontend API URL according to your local environment.

▶️ Running the Application
Start the backend

cd server
npm start

Backend:

http://localhost:5000

Start the frontend

Open another terminal:

cd client
npm start

Frontend:

http://localhost:3000

🔐 Admin Access

The application contains a separate admin login and protected admin dashboard.

Admin routes include:

/admin/login
/admin

Administrative operations are protected using authentication and admin authorization middleware.

🔄 Main SkillBridge Workflow

Register / Login
↓
Create Profile
↓
Add Skills Offered
↓
Add Skills Wanted
↓
Find Skill Matches
↓
Connect With Users
↓
Chat in Real Time
↓
Request Skill Swap
↓
Complete Skill Exchange
↓
Rate / Review User

🛡️ Security

SkillBridge uses:

JWT authentication
Protected API routes
Admin authorization
Banned-user protection
Authenticated real-time communication
Protected administrative operations
🌟 Project Highlights

SkillBridge combines:

Skill Discovery + Smart Matching + Multi-Way Exchanges + Real-Time Communication + Skill Swaps + Reviews + Administration

The goal is to create a platform where users can learn from each other by exchanging knowledge and skills.

👩‍💻 Author

Akshita

GitHub:

https://github.com/akshitacodes19

📌 Future Enhancements

Possible future improvements include:

Email notifications
Advanced recommendation algorithms
Skill verification
Improved reporting and analytics
Notifications for swap requests
Enhanced user discovery
More detailed admin analytics