const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['schedule', 'announcement', 'assignment', 'system'],
      required: [true, 'Please add a notification type'],
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // createdAt acts as the notification timestamp
  }
);

// Index for fast queries
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
