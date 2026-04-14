const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// ─────────────────────────────────────────────────────
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// ─────────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, password, studentId } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Check if studentId is taken (if provided)
    if (studentId) {
      const studentIdExists = await User.findOne({ studentId });
      if (studentIdExists) {
        return res.status(400).json({ message: 'Student ID already registered' });
      }
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      studentId,
    });

    // Return user data + token
    res.status(201).json({
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
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────────────
// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
// ─────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Return user data + token
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
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { register, login };
