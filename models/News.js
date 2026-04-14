const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    date: {
      type: String,
      default: () => {
        return new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      },
    },
    // Badge color for the Flutter news card UI
    badgeColor: {
      type: String,
      default: '#63003C',
    },
    // Optional: link to full article or image
    imageUrl: {
      type: String,
      default: null,
    },
    author: {
      type: String,
      default: 'Admin',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('News', newsSchema);
