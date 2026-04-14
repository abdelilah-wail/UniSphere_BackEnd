const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  unenrollCourse,
} = require('../controllers/courseController');
const { protect, admin } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Student routes
router.get('/', getCourses);
router.get('/:id', getCourseById);
router.post('/:id/enroll', enrollCourse);
router.delete('/:id/enroll', unenrollCourse);

// Admin-only routes
router.post('/', admin, createCourse);
router.put('/:id', admin, updateCourse);
router.delete('/:id', admin, deleteCourse);

module.exports = router;
