const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// ─── Load environment variables ────────────────
dotenv.config();

// ─── Connect to MongoDB ────────────────────────
connectDB();

// ─── Initialize Express ────────────────────────
const app = express();

// ─── Middleware ─────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ─── Welcome Route ─────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: '🚀 UniSphere API is running!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      courses: '/api/courses',
      schedule: '/api/schedule',
      news: '/api/news',
      events: '/api/events',
      notifications: '/api/notifications',
    },
  });
});

// ─── API Routes ────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/schedule', require('./routes/schedule'));
app.use('/api/news', require('./routes/news'));
app.use('/api/events', require('./routes/events'));
app.use('/api/notifications', require('./routes/notifications'));

// ─── 404 Handler (unknown routes) ───────────────
app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ─── Global Error Handler (must be last) ────────
app.use(errorHandler);

// ─── Start Server ──────────────────────────────
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(``);
  console.log(`⚡ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`📡 http://localhost:${PORT}`);
  console.log(``);
  console.log(`📚 Endpoints:`);
  console.log(`   POST   /api/auth/register`);
  console.log(`   POST   /api/auth/login`);
  console.log(`   GET    /api/users/profile`);
  console.log(`   PUT    /api/users/profile`);
  console.log(`   PUT    /api/users/password`);
  console.log(`   GET    /api/courses`);
  console.log(`   GET    /api/courses/:id`);
  console.log(`   POST   /api/courses (admin)`);
  console.log(`   PUT    /api/courses/:id (admin)`);
  console.log(`   DELETE /api/courses/:id (admin)`);
  console.log(`   POST   /api/courses/:id/enroll`);
  console.log(`   DELETE /api/courses/:id/enroll`);
  console.log(`   GET    /api/schedule`);
  console.log(`   POST   /api/schedule`);
  console.log(`   POST   /api/schedule/bulk`);
  console.log(`   PUT    /api/schedule/:id`);
  console.log(`   DELETE /api/schedule/:id`);
  console.log(`   GET    /api/news`);
  console.log(`   GET    /api/news/:id`);
  console.log(`   POST   /api/news (admin)`);
  console.log(`   DELETE /api/news/:id (admin)`);
  console.log(`   GET    /api/events`);
  console.log(`   GET    /api/events/:id`);
  console.log(`   POST   /api/events (admin)`);
  console.log(`   DELETE /api/events/:id (admin)`);
  console.log(`   POST   /api/events/:id/attend`);
  console.log(`   DELETE /api/events/:id/attend`);
  console.log(`   GET    /api/notifications`);
  console.log(`   PUT    /api/notifications/read-all`);
  console.log(`   PUT    /api/notifications/:id/read`);
  console.log(`   DELETE /api/notifications/:id`);
  console.log(`   POST   /api/notifications (admin)`);
  console.log(`   POST   /api/notifications/broadcast (admin)`);
  console.log(``);
});
