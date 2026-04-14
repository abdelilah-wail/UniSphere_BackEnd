const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, changePassword } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// All routes below require authentication
router.use(protect);

// GET /api/users/profile
router.get('/profile', getProfile);

// PUT /api/users/profile
router.put('/profile', updateProfile);

// PUT /api/users/password
router.put('/password', changePassword);

module.exports = router;
