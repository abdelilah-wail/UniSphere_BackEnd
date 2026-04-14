const express = require('express');
const router = express.Router();
const {
  getSchedule,
  addScheduleEntry,
  updateScheduleEntry,
  deleteScheduleEntry,
  bulkAddSchedule,
} = require('../controllers/scheduleController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.get('/', getSchedule);
router.post('/', addScheduleEntry);
router.post('/bulk', bulkAddSchedule);
router.put('/:id', updateScheduleEntry);
router.delete('/:id', deleteScheduleEntry);

module.exports = router;
