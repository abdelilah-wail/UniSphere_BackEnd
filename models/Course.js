const mongoose = require('mongoose');

// ─── Lesson Sub-schema ─────────────────────────────
const lessonSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['completed', 'current', 'locked'],
    default: 'locked',
  },
});

// ─── Course Schema ─────────────────────────────────
const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a course name'],
      trim: true,
    },
    instructor: {
      type: String,
      required: [true, 'Please add an instructor name'],
    },
    instructorRole: {
      type: String,
      default: 'Lecturer',
    },
    totalLessons: {
      type: Number,
      default: 0,
    },
    totalDuration: {
      type: String,
      default: '0 hrs',
    },
    credits: {
      type: Number,
      default: 3,
      min: 1,
      max: 6,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 1, // 0.0 to 1.0 (percentage as decimal)
    },
    lessons: [lessonSchema],
    resources: [
      {
        type: String,
      },
    ],
    // Which users are enrolled in this course
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    // Category for home screen filtering
    category: {
      type: String,
      enum: ['Computer Science', 'Business', 'Engineering', 'Science', 'Arts', 'Other'],
      default: 'Other',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Course', courseSchema);
