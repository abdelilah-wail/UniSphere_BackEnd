const Course = require('../models/Course');
const mongoose = require('mongoose');

// ─────────────────────────────────────────────────────
// @desc    Get all courses
// @route   GET /api/courses
// @access  Private
// ─────────────────────────────────────────────────────
const getCourses = async (req, res) => {
  try {
    const { category, enrolled } = req.query;

    let query = {};

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter only enrolled courses for current user
    if (enrolled === 'true') {
      query.enrolledStudents = req.user._id;
    }

    const courses = await Course.find(query)
      .select('-enrolledStudents') // Don't send full student list
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (error) {
    console.error('Get courses error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────────────
// @desc    Get single course with full details
// @route   GET /api/courses/:id
// @access  Private
// ─────────────────────────────────────────────────────
const getCourseById = async (req, res) => {
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid course ID format' });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if current user is enrolled
    const isEnrolled = course.enrolledStudents.includes(req.user._id);

    res.json({
      ...course.toObject(),
      isEnrolled,
      enrolledCount: course.enrolledStudents.length,
      enrolledStudents: undefined, // Hide the full list
    });
  } catch (error) {
    console.error('Get course error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────────────
// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Admin
// ─────────────────────────────────────────────────────
const createCourse = async (req, res) => {
  try {
    const {
      name,
      instructor,
      instructorRole,
      totalDuration,
      credits,
      lessons,
      resources,
      category,
    } = req.body;

    const course = await Course.create({
      name,
      instructor,
      instructorRole,
      totalLessons: lessons ? lessons.length : 0,
      totalDuration,
      credits,
      lessons: lessons || [],
      resources: resources || [],
      category,
    });

    res.status(201).json(course);
  } catch (error) {
    console.error('Create course error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────────────
// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Admin
// ─────────────────────────────────────────────────────
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Update fields
    const fields = [
      'name', 'instructor', 'instructorRole', 'totalDuration',
      'credits', 'progress', 'lessons', 'resources', 'category',
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        course[field] = req.body[field];
      }
    });

    // Recalculate totalLessons if lessons were updated
    if (req.body.lessons) {
      course.totalLessons = req.body.lessons.length;
    }

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (error) {
    console.error('Update course error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────────────
// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
// ─────────────────────────────────────────────────────
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    await course.deleteOne();
    res.json({ message: 'Course removed' });
  } catch (error) {
    console.error('Delete course error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────────────
// @desc    Enroll current user in a course
// @route   POST /api/courses/:id/enroll
// @access  Private
// ─────────────────────────────────────────────────────
const enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    if (course.enrolledStudents.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    course.enrolledStudents.push(req.user._id);
    await course.save();

    res.json({ message: `Enrolled in ${course.name} successfully` });
  } catch (error) {
    console.error('Enroll error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────────────
// @desc    Unenroll current user from a course
// @route   DELETE /api/courses/:id/enroll
// @access  Private
// ─────────────────────────────────────────────────────
const unenrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if enrolled
    if (!course.enrolledStudents.includes(req.user._id)) {
      return res.status(400).json({ message: 'Not enrolled in this course' });
    }

    course.enrolledStudents = course.enrolledStudents.filter(
      (id) => id.toString() !== req.user._id.toString()
    );
    await course.save();

    res.json({ message: `Unenrolled from ${course.name}` });
  } catch (error) {
    console.error('Unenroll error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  unenrollCourse,
};
