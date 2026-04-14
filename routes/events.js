const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  deleteEvent,
  attendEvent,
  unattendEvent,
} = require('../controllers/eventController');
const { protect, admin } = require('../middleware/auth');

router.use(protect);

// Student routes
router.get('/', getEvents);
router.get('/:id', getEventById);
router.post('/:id/attend', attendEvent);
router.delete('/:id/attend', unattendEvent);

// Admin-only routes
router.post('/', admin, createEvent);
router.delete('/:id', admin, deleteEvent);

module.exports = router;
