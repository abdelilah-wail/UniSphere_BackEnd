const Notification = require('../models/Notification');

// ─────────────────────────────────────────────────────
// @desc    Get user's notifications
// @route   GET /api/notifications
// @access  Private
// ─────────────────────────────────────────────────────
const getNotifications = async (req, res) => {
  try {
    const { unread } = req.query;

    let query = { user: req.user._id };

    // Filter unread only
    if (unread === 'true') {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    // Also return unread count for the badge
    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      isRead: false,
    });

    res.json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error('Get notifications error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────────────
// @desc    Mark a single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
// ─────────────────────────────────────────────────────
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Make sure user owns this notification
    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────────────
// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
// ─────────────────────────────────────────────────────
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { isRead: true }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all as read error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────────────
// @desc    Create a notification (for a specific user)
// @route   POST /api/notifications
// @access  Private/Admin
// ─────────────────────────────────────────────────────
const createNotification = async (req, res) => {
  try {
    const { userId, type, title, description } = req.body;

    const notification = await Notification.create({
      user: userId,
      type,
      title,
      description,
    });

    res.status(201).json(notification);
  } catch (error) {
    console.error('Create notification error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────────────
// @desc    Send notification to ALL users (broadcast)
// @route   POST /api/notifications/broadcast
// @access  Private/Admin
// ─────────────────────────────────────────────────────
const broadcastNotification = async (req, res) => {
  try {
    const { type, title, description } = req.body;
    const User = require('../models/User');

    // Get all user IDs
    const users = await User.find().select('_id');

    // Create a notification for each user
    const notifications = users.map((user) => ({
      user: user._id,
      type,
      title,
      description,
    }));

    await Notification.insertMany(notifications);

    res.status(201).json({
      message: `Notification sent to ${users.length} users`,
    });
  } catch (error) {
    console.error('Broadcast notification error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────────────
// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
// ─────────────────────────────────────────────────────
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Make sure user owns this notification
    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await notification.deleteOne();
    res.json({ message: 'Notification removed' });
  } catch (error) {
    console.error('Delete notification error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  createNotification,
  broadcastNotification,
  deleteNotification,
};
