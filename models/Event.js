const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
    },
    date: {
      type: String,
      required: [true, 'Please add a date'],
    },
    time: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      default: null,
    },
    // Track who's attending
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Event', eventSchema);
