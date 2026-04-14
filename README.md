# UniSphere Backend API

A robust Node.js/Express backend for the Flutter UniSphere mobile application. This API provides comprehensive campus management features including authentication, user profiles, courses, schedules, news, events, and notifications.

## 🚀 Features

- **Authentication** - User registration, login, JWT token management
- **User Management** - Profile updates, password changes, user preferences
- **Course Management** - Browse courses, enrollment, course details
- **Schedule Management** - Class schedules, timetables
- **News & Events** - Campus news and event management
- **Notifications** - Real-time notification system
- **Security** - Password hashing with bcryptjs, JWT authentication
- **Database** - MongoDB with Mongoose ODM
- **CORS** - Cross-origin resource sharing enabled for mobile clients

---

## 📋 Prerequisites

- **Node.js** v14 or higher
- **npm** or yarn package manager
- **MongoDB** (local or cloud-based like MongoDB Atlas)
- **Git** for version control

---

## 🔧 Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/unisphere-backend.git
cd unisphere-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the root directory:
```env
# Server
NODE_ENV=development
PORT=5001

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/unisphere?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_minimum_32_characters
JWT_EXPIRE=7d

# CORS
CLIENT_URL=http://localhost:3000
```

### 4. Start the server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

Server will run at `http://localhost:5001`

---

## 📁 Project Structure

```
unisphere-backend/
├── config/
│   └── db.js                 # MongoDB connection configuration
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── userController.js     # User management logic
│   └── courseController.js   # Course management logic
├── middleware/
│   ├── auth.js               # JWT authentication middleware
│   └── errorHandler.js       # Centralized error handling
├── models/
│   ├── User.js               # User schema
│   ├── Course.js             # Course schema
│   └── ...                   # Other schemas
├── routes/
│   ├── auth.js               # Authentication routes
│   ├── users.js              # User routes
│   ├── courses.js            # Course routes
│   └── ...                   # Other routes
├── utils/
│   └── generateToken.js      # JWT token generation
├── .env                      # Environment variables (git ignored)
├── .gitignore                # Git ignore rules
├── package.json              # Project dependencies
├── README.md                 # This file
└── server.js                 # Main server file
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| POST | `/api/auth/refresh-token` | Refresh JWT token |

### Users
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/users/profile` | Get user profile | ✅ |
| PUT | `/api/users/profile` | Update user profile | ✅ |
| PUT | `/api/users/password` | Change password | ✅ |

### Courses
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/courses` | Get all courses | ✅ |
| GET | `/api/courses/:id` | Get course details | ✅ |
| POST | `/api/courses` | Create course (admin) | ✅ |
| PUT | `/api/courses/:id` | Update course (admin) | ✅ |
| DELETE | `/api/courses/:id` | Delete course (admin) | ✅ |
| POST | `/api/courses/:id/enroll` | Enroll in course | ✅ |

### Schedule
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/schedule` | Get user schedule | ✅ |

### News & Events
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/news` | Get news articles | ✅ |
| GET | `/api/events` | Get events | ✅ |

### Notifications
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/notifications` | Get user notifications | ✅ |

---

## 🔐 Authentication

The API uses **JWT (JSON Web Tokens)** for authentication.

### How it works:
1. User registers or logs in
2. Server returns a JWT token
3. Client includes token in request headers: `Authorization: Bearer <token>`
4. Server verifies token via `protect` middleware
5. If valid, request continues; if invalid, returns 401 Unauthorized

### Example Request:
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  http://localhost:5001/api/users/profile
```

---

## 📦 Dependencies

```json
{
  "bcryptjs": "^2.4.3",      // Password hashing
  "cors": "^2.8.5",           // Cross-Origin Resource Sharing
  "dotenv": "^16.4.5",        // Environment variable management
  "express": "^4.21.0",       // Web framework
  "express-validator": "^7.2.0", // Input validation
  "jsonwebtoken": "^9.0.2",   // JWT authentication
  "mongoose": "^8.6.0",       // MongoDB ODM
  "nodemon": "^3.1.4"         // Dev: Auto-reload
}
```

---

## 🧪 Error Handling

The API returns standardized error responses:

### Success Response (200)
```json
{
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error Response (4xx/5xx)
```json
{
  "message": "Error description",
  "error": "Detailed error information"
}
```

### Common Status Codes
- **200** - OK
- **201** - Created
- **400** - Bad Request (Invalid input)
- **401** - Unauthorized (Missing/invalid token)
- **403** - Forbidden (Insufficient permissions)
- **404** - Not Found
- **500** - Internal Server Error

---

## 🛡️ Security Practices

✅ **Implemented:**
- JWT token-based authentication
- Password hashing with bcryptjs (salt rounds: 10)
- CORS protection
- Environment variable protection
- Input validation with express-validator
- Error messages don't expose sensitive details

⚠️ **Recommended for Production:**
```javascript
// Add rate limiting
npm install express-rate-limit

// Add helmet for security headers
npm install helmet

// Add request logging
npm install morgan

// Example usage:
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));
```

---

## 🚀 Deployment

### Deploy to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_production_secret
heroku config:set MONGODB_URI=your_mongodb_uri

# Deploy
git push heroku main
```

### Deploy to AWS/DigitalOcean
1. Add Procfile: `web: npm start`
2. Ensure MongoDB connection string uses production database
3. Set all environment variables in hosting platform
4. Deploy using platform's CLI or Git integration

---

## 📝 Usage Examples

### Register a new user
```bash
POST http://localhost:5001/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@university.edu",
  "password": "SecurePass123!",
  "studentId": "STU123456"
}
```

### Login user
```bash
POST http://localhost:5001/api/auth/login
Content-Type: application/json

{
  "email": "john@university.edu",
  "password": "SecurePass123!"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@university.edu"
  }
}
```

### Get user profile (authenticated)
```bash
GET http://localhost:5001/api/users/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

Response:
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@university.edu",
  "studentId": "STU123456",
  "createdAt": "2024-04-14T10:00:00.000Z"
}
```

---

## 🐛 Troubleshooting

### Connection Error: "Cannot POST /api/courses/course_id"
**Solution:** Replace `course_id` with an actual MongoDB ObjectId
```bash
# Wrong
GET http://localhost:5001/api/courses/course_id

# Correct
GET http://localhost:5001/api/courses/507f1f77bcf86cd799439011
```

### MongoDB Connection Failed
1. Check MONGODB_URI in `.env` file
2. Verify network access in MongoDB Atlas (IP whitelist)
3. Ensure credentials are correct
4. Test connection: `mongosh "mongodb+srv://..."`

### JWT Token Expired
- The token has expired - user needs to login again
- Implement token refresh endpoint for better UX

### CORS Error
- Ensure CLIENT_URL is set correctly in `.env`
- Add your frontend URL to CORS configuration in `server.js`

---

## 📚 API Documentation

Full API documentation can be viewed at:
```
http://localhost:5001/
```

This returns available endpoints and their descriptions.

---

## 🔄 Git Workflow

```bash
# Clone repository
git clone <repo-url>

# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push to remote
git push origin feature/new-feature

# Create pull request on GitHub
```

---

## 📞 Support & Contact

**Author:** Abdelilah Wail NEDJAR

**Issues:** Report bugs in GitHub Issues section

**Questions:** Check documentation or contact development team

---

## 📄 License

ISC License - See LICENSE file for details

---

## 🚦 API Status

| Component | Status |
|-----------|--------|
| Server | ✅ Running |
| MongoDB | ✅ Connected |
| Authentication | ✅ Active |
| Courses API | ✅ Operational |
| Users API | ✅ Operational |
| Events API | ✅ Operational |

Last Updated: April 14, 2026
