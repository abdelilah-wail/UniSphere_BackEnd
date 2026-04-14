const express = require('express');
const router = express.Router();
const { getNews, getNewsById, createNews, deleteNews } = require('../controllers/newsController');
const { protect, admin } = require('../middleware/auth');

router.use(protect);

// Student routes
router.get('/', getNews);
router.get('/:id', getNewsById);

// Admin-only routes
router.post('/', admin, createNews);
router.delete('/:id', admin, deleteNews);

module.exports = router;
