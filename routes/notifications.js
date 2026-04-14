const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  createNotification,
  broadcastNotification,
  deleteNotification,
} = require('../controllers/notificationController');
const { protect, admin } = require('../middleware/auth');

router.use(protect);

// Student routes
router.get('/', getNotifications);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

// Admin-only routes
router.post('/', admin, createNotification);
router.post('/broadcast', admin, broadcastNotification);

module.exports = router;
