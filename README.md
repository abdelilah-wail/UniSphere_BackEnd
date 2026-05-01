Copy everything below into your `README.md` file at the root of `unisphere-backend/`.

---

```markdown
# 🌐 UniSphere Backend

A production-ready RESTful API for the **UniSphere** campus mobile app, built with **Node.js**, **Express**, **MongoDB**, and **JWT authentication**.

This backend powers the Flutter frontend with 33 API endpoints covering authentication, user profiles, courses, scheduling, news, events, and notifications.

---

## 🧱 Tech Stack

| Layer        | Technology                      |
| ------------ | ------------------------------- |
| Runtime      | Node.js                         |
| Framework    | Express.js                      |
| Database     | MongoDB + Mongoose              |
| Auth         | JWT (jsonwebtoken) + bcryptjs   |
| Validation   | express-validator               |
| Environment  | dotenv                          |
| CORS         | cors                            |
| Admin UI     | HTML, CSS, JavaScript (admin/index.html) |

---

## 📁 Project Structure

	admin/
		index.html                ← Admin dashboard (see below)
```
---

## 🛠️ Admin Dashboard (`admin/index.html`)

The project includes a modern, responsive **Admin Dashboard** for managing campus data and sending notifications.

**Features:**
- Secure login for admin users
- Dashboard with stats (events, news, notifications, users)
- Send push notifications to all users, students, or teachers
- Create and manage events and news
- View recent events/news in a card grid
- Light/dark mode toggle
- Responsive design for mobile/desktop

**How it works:**
- The dashboard interacts with backend API endpoints for authentication, notifications, events, and news
- Uses JWT authentication (admin credentials required)
- All actions (create, send, list) are performed via REST API calls

**To use:**
1. Open `admin/index.html` in your browser
2. Log in with an admin account (use any credentials for demo mode)
3. Use the dashboard to manage campus content and send notifications

---

unisphere-backend/

├── server.js                        ← Entry point

├── .env                             ← Environment variables

├── .gitignore

├── package.json

├── config/

│   └── db.js                        ← MongoDB connection

├── middleware/

│   ├── auth.js                      ← JWT verification + admin check

│   └── errorHandler.js              ← Global error handler

├── models/

│   ├── User.js                      ← User schema (auth + profile)

│   ├── Course.js                    ← Courses + embedded lessons

│   ├── Schedule.js                  ← Per-user timetable

│   ├── News.js                      ← Campus news

│   ├── Event.js                     ← Campus events + attendees

│   └── Notification.js              ← Per-user notifications

├── controllers/

│   ├── authController.js            ← Register & Login

│   ├── userController.js            ← Profile CRUD

│   ├── courseController.js          ← Course CRUD + enrollment

│   ├── scheduleController.js        ← Schedule CRUD + bulk

│   ├── newsController.js            ← News CRUD

│   ├── eventController.js           ← Event CRUD + attendance

│   └── notificationController.js    ← Notifications + broadcast

├── routes/

│   ├── auth.js

│   ├── users.js

│   ├── courses.js

│   ├── schedule.js

│   ├── news.js

│   ├── events.js

│   └── notifications.js

└── utils/

└── generateToken.js             ← JWT token helper

```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Postman](https://www.postman.com/) (for testing)

### Installation

```

# Clone the repository

git clone https://github.com/your-username/unisphere-backend.git

cd unisphere-backend

# Install dependencies

npm install

```

### Environment Variables

Create a `.env` file in the root directory:

```

PORT=5001

NODE_ENV=development

MONGO_URI=mongodb://[localhost:27017/unisphere](http://localhost:27017/unisphere)

JWT_SECRET=your_super_secret_key_here

JWT_EXPIRE=30d

```

> For MongoDB Atlas, replace `MONGO_URI` with your cloud connection string.

### Run the Server

```

# Development (with auto-restart)

npm run dev

# Production

npm start

```

You should see:

```

✅ MongoDB Connected: [localhost](http://localhost)

⚡ Server running in development mode on port 5001

📡 http://localhost:5001

```

---

## 🔗 API Endpoints

### 🔐 Authentication

| Method | Endpoint              | Description           | Auth |
| ------ | --------------------- | --------------------- | ---- |
| POST   | `/api/auth/register`  | Register a new user   | ❌   |
| POST   | `/api/auth/login`     | Login & get JWT token | ❌   |

### 👤 User Profile

| Method | Endpoint              | Description                  | Auth |
| ------ | --------------------- | ---------------------------- | ---- |
| GET    | `/api/users/profile`  | Get current user profile     | ✅   |
| PUT    | `/api/users/profile`  | Update profile & preferences | ✅   |
| PUT    | `/api/users/password` | Change password              | ✅   |

### 📚 Courses

| Method | Endpoint                    | Description               | Auth    |
| ------ | --------------------------- | ------------------------- | ------- |
| GET    | `/api/courses`              | List all courses          | ✅      |
| GET    | `/api/courses/:id`          | Get course detail         | ✅      |
| POST   | `/api/courses`              | Create course             | ✅ Admin |
| PUT    | `/api/courses/:id`          | Update course             | ✅ Admin |
| DELETE | `/api/courses/:id`          | Delete course             | ✅ Admin |
| POST   | `/api/courses/:id/enroll`   | Enroll in a course        | ✅      |
| DELETE | `/api/courses/:id/enroll`   | Unenroll from a course    | ✅      |

**Query params:** `?category=Computer Science` • `?enrolled=true`

### 📅 Schedule

| Method | Endpoint              | Description              | Auth |
| ------ | --------------------- | ------------------------ | ---- |
| GET    | `/api/schedule`       | Get user's schedule      | ✅   |
| POST   | `/api/schedule`       | Add schedule entry       | ✅   |
| POST   | `/api/schedule/bulk`  | Bulk add entries         | ✅   |
| PUT    | `/api/schedule/:id`   | Update entry             | ✅   |
| DELETE | `/api/schedule/:id`   | Delete entry             | ✅   |

**Query params:** `?day=Monday`

### 📰 News

| Method | Endpoint         | Description        | Auth    |
| ------ | ---------------- | ------------------ | ------- |
| GET    | `/api/news`      | List all news      | ✅      |
| GET    | `/api/news/:id`  | Get news article   | ✅      |
| POST   | `/api/news`      | Create news        | ✅ Admin |
| DELETE | `/api/news/:id`  | Delete news        | ✅ Admin |

**Query params:** `?limit=5`

### 🎉 Events

| Method | Endpoint                    | Description         | Auth    |
| ------ | --------------------------- | ------------------- | ------- |
| GET    | `/api/events`               | List all events     | ✅      |
| GET    | `/api/events/:id`           | Get event detail    | ✅      |
| POST   | `/api/events`               | Create event        | ✅ Admin |
| DELETE | `/api/events/:id`           | Delete event        | ✅ Admin |
| POST   | `/api/events/:id/attend`    | Attend an event     | ✅      |
| DELETE | `/api/events/:id/attend`    | Unattend an event   | ✅      |

**Query params:** `?limit=3`

### 🔔 Notifications

| Method | Endpoint                          | Description              | Auth    |
| ------ | --------------------------------- | ------------------------ | ------- |
| GET    | `/api/notifications`              | Get user notifications   | ✅      |
| PUT    | `/api/notifications/:id/read`     | Mark as read             | ✅      |
| PUT    | `/api/notifications/read-all`     | Mark all as read         | ✅      |
| DELETE | `/api/notifications/:id`          | Delete notification      | ✅      |
| POST   | `/api/notifications`              | Send to specific user    | ✅ Admin |
| POST   | `/api/notifications/broadcast`    | Send to all users        | ✅ Admin |

**Query params:** `?unread=true`

---

## 🔐 Authentication

The API uses **JWT Bearer tokens**. After login/register, include the token in all protected requests:

```

Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

```

### User Roles

| Role      | Permissions                                    |
| --------- | ---------------------------------------------- |
| `student` | Read data, manage own profile/schedule, enroll |
| `admin`   | All student permissions + create/delete content|

---

## 📊 Data Models

### User
- `name`, `email`, `password` (hashed), `studentId`, `role`
- `gpa`, `creditsEarned`, `totalCredits`, `yearLevel`
- `preferences` (push notifications, email notifications, dark mode)
- `privacy` (profile visible, show email, activity status, data sharing)

### Course
- `name`, `instructor`, `instructorRole`, `credits`, `category`
- `lessons[]` (number, title, duration, status: completed/current/locked)
- `resources[]`, `progress` (0.0-1.0), `enrolledStudents[]`

### Schedule
- `user`, `courseName`, `lectureInfo`, `day` (Monday-Sunday)
- `startTime`, `endTime`, `room`, `teacher`
- `cardColor`, `textColor` (hex strings for Flutter UI)

### News
- `title`, `description`, `date`, `badgeColor`, `imageUrl`, `author`

### Event
- `title`, `location`, `date`, `time`, `description`, `imageUrl`
- `attendees[]`

### Notification
- `user`, `type` (schedule/announcement/assignment/system)
- `title`, `description`, `isRead`

---

## ⚙️ Error Handling

The API includes a global error handler that catches:

| Error Type          | Status | Example                        |
| ------------------- | ------ | ------------------------------ |
| Invalid MongoDB ID  | 400    | Bad `:id` parameter            |
| Duplicate Key       | 400    | Email already registered       |
| Validation Error    | 400    | Missing required fields        |
| Invalid JWT         | 401    | Malformed or tampered token    |
| Expired JWT         | 401    | Token past expiration date     |
| Route Not Found     | 404    | Unknown endpoint               |
| Server Error        | 500    | Unexpected internal error      |

---

## 🧪 Testing

Use [Postman](https://www.postman.com/) to test all endpoints. Recommended flow:

1. `POST /api/auth/register` → Create a user
2. `POST /api/auth/login` → Get your token
3. Use the token for all subsequent requests
4. Change role to `admin` in MongoDB for admin endpoints

---

## 📈 Stats

| Metric     | Count |
| ---------- | ----- |
| Files      | 28    |
| Endpoints  | 33    |
| Models     | 6     |
| Middleware | 2     |

---

## 👨‍💻 Author

**Abdelilah Wail NEDJAR**
- University of Constantine 2 — FNTIC
- Email: abdelilah.nedjar@univ-constantine2.dz

---

## 📄 License

This project is licensed under the ISC License.
```

---

