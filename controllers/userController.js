const User = require('../models/User');
const bcrypt = require('bcryptjs');

// ─────────────────────────────────────────────────────
// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
// ─────────────────────────────────────────────────────
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      studentId: user.studentId,
      role: user.role,
      avatar: user.avatar,
      gpa: user.gpa,
      creditsEarned: user.creditsEarned,
      totalCredits: user.totalCredits,
      yearLevel: user.yearLevel,
      preferences: user.preferences,
      privacy: user.privacy,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────────────
// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
// ─────────────────────────────────────────────────────
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update basic fields
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.studentId) user.studentId = req.body.studentId;
    if (req.body.avatar !== undefined) user.avatar = req.body.avatar;
    if (req.body.yearLevel) user.yearLevel = req.body.yearLevel;

    // Update preferences (partial update supported)
    if (req.body.preferences) {
      user.preferences = {
        ...user.preferences.toObject(),
        ...req.body.preferences,
      };
    }

    // Update privacy (partial update supported)
    if (req.body.privacy) {
      user.privacy = {
        ...user.privacy.toObject(),
        ...req.body.privacy,
      };
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      studentId: updatedUser.studentId,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      gpa: updatedUser.gpa,
      creditsEarned: updatedUser.creditsEarned,
      totalCredits: updatedUser.totalCredits,
      yearLevel: updatedUser.yearLevel,
      preferences: updatedUser.preferences,
      privacy: updatedUser.privacy,
    });
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────────────
// @desc    Change password
// @route   PUT /api/users/password
// @access  Private
// ─────────────────────────────────────────────────────
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: 'Please provide current password and new password',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: 'New password must be at least 6 characters',
      });
    }

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Set new password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getProfile, updateProfile, changePassword };
