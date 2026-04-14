const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    courseName: {
      type: String,
      required: [true, 'Please add a course name'],
      trim: true,
    },
    lectureInfo: {
      type: String,
      default: '',
    },
    day: {
      type: String,
      required: [true, 'Please add a day'],
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    startTime: {
      type: String,
      required: [true, 'Please add a start time'],
    },
    endTime: {
      type: String,
      required: [true, 'Please add an end time'],
    },
    room: {
      type: String,
      required: [true, 'Please add a room'],
    },
    teacher: {
      type: String,
      required: [true, 'Please add a teacher name'],
    },
    // Colors for the Flutter card UI
    cardColor: {
      type: String,
      default: '#F3E5F5', // Light purple
    },
    textColor: {
      type: String,
      default: '#1A1A1A',
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast day-based queries
scheduleSchema.index({ user: 1, day: 1 });

module.exports = mongoose.model('Schedule', scheduleSchema);
