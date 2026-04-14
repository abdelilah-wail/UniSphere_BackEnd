const News = require('../models/News');

// ─────────────────────────────────────────────────────
// @desc    Get all news
// @route   GET /api/news
// @access  Private
// ─────────────────────────────────────────────────────
const getNews = async (req, res) => {
  try {
    const { limit } = req.query;

    let query = News.find().sort({ createdAt: -1 });

    // Optional limit for home screen (e.g. ?limit=5)
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const news = await query;
    res.json(news);
  } catch (error) {
    console.error('Get news error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────────────
// @desc    Get single news article
// @route   GET /api/news/:id
// @access  Private
// ─────────────────────────────────────────────────────
const getNewsById = async (req, res) => {
  try {
    const article = await News.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'News article not found' });
    }

    res.json(article);
  } catch (error) {
    console.error('Get news by id error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────────────
// @desc    Create a news article
// @route   POST /api/news
// @access  Private/Admin
// ─────────────────────────────────────────────────────
const createNews = async (req, res) => {
  try {
    const { title, description, date, badgeColor, imageUrl, author } = req.body;

    const article = await News.create({
      title,
      description,
      date,
      badgeColor,
      imageUrl,
      author,
    });

    res.status(201).json(article);
  } catch (error) {
    console.error('Create news error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────────────
// @desc    Delete a news article
// @route   DELETE /api/news/:id
// @access  Private/Admin
// ─────────────────────────────────────────────────────
const deleteNews = async (req, res) => {
  try {
    const article = await News.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'News article not found' });
    }

    await article.deleteOne();
    res.json({ message: 'News article removed' });
  } catch (error) {
    console.error('Delete news error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getNews, getNewsById, createNews, deleteNews };
