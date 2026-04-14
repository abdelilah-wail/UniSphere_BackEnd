const Schedule = require('../models/Schedule');

// ─────────────────────────────────────────────────────
// @desc    Get user's schedule (optionally filter by day)
// @route   GET /api/schedule
// @access  Private
// ─────────────────────────────────────────────────────
const getSchedule = async (req, res) => {
  try {
    const { day } = req.query;

    let query = { user: req.user._id };

    // Filter by day if provided
    if (day) {
      query.day = day;
    }

    const schedule = await Schedule.find(query).sort({ startTime: 1 });

    res.json(schedule);
  } catch (error) {
    console.error('Get schedule error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────────────
// @desc    Add a schedule entry
// @route   POST /api/schedule
// @access  Private
// ─────────────────────────────────────────────────────
const addScheduleEntry = async (req, res) => {
  try {
    const {
      courseName,
      lectureInfo,
      day,
      startTime,
      endTime,
      room,
      teacher,
      cardColor,
      textColor,
    } = req.body;

    const entry = await Schedule.create({
      user: req.user._id,
      courseName,
      lectureInfo,
      day,
      startTime,
      endTime,
      room,
      teacher,
      cardColor,
      textColor,
    });

    res.status(201).json(entry);
  } catch (error) {
    console.error('Add schedule error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────────────
// @desc    Update a schedule entry
// @route   PUT /api/schedule/:id
// @access  Private
// ─────────────────────────────────────────────────────
const updateScheduleEntry = async (req, res) => {
  try {
    const entry = await Schedule.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: 'Schedule entry not found' });
    }

    // Make sure user owns this entry
    if (entry.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this entry' });
    }

    // Update fields
    const fields = [
      'courseName', 'lectureInfo', 'day', 'startTime',
      'endTime', 'room', 'teacher', 'cardColor', 'textColor',
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        entry[field] = req.body[field];
      }
    });

    const updatedEntry = await entry.save();
    res.json(updatedEntry);
  } catch (error) {
    console.error('Update schedule error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────────────
// @desc    Delete a schedule entry
// @route   DELETE /api/schedule/:id
// @access  Private
// ─────────────────────────────────────────────────────
const deleteScheduleEntry = async (req, res) => {
  try {
    const entry = await Schedule.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: 'Schedule entry not found' });
    }

    // Make sure user owns this entry
    if (entry.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this entry' });
    }

    await entry.deleteOne();
    res.json({ message: 'Schedule entry removed' });
  } catch (error) {
    console.error('Delete schedule error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────────────
// @desc    Bulk add schedule entries (seed a full week)
// @route   POST /api/schedule/bulk
// @access  Private
// ─────────────────────────────────────────────────────
const bulkAddSchedule = async (req, res) => {
  try {
    const { entries } = req.body;

    if (!entries || !Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({ message: 'Please provide an array of schedule entries' });
    }

    // Attach user ID to each entry
    const entriesWithUser = entries.map((entry) => ({
      ...entry,
      user: req.user._id,
    }));

    const created = await Schedule.insertMany(entriesWithUser);

    res.status(201).json({
      message: `${created.length} schedule entries added`,
      entries: created,
    });
  } catch (error) {
    console.error('Bulk add schedule error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getSchedule,
  addScheduleEntry,
  updateScheduleEntry,
  deleteScheduleEntry,
  bulkAddSchedule,
};
