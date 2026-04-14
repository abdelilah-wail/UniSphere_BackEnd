const Event = require('../models/Event');

// ─────────────────────────────────────────────────────
// @desc    Get all events
// @route   GET /api/events
// @access  Private
// ─────────────────────────────────────────────────────
const getEvents = async (req, res) => {
  try {
    const { limit } = req.query;

    let query = Event.find()
      .select('-attendees')
      .sort({ createdAt: -1 });

    // Optional limit for home screen (e.g. ?limit=3)
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const events = await query;
    res.json(events);
  } catch (error) {
    console.error('Get events error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────────────
// @desc    Get single event with details
// @route   GET /api/events/:id
// @access  Private
// ─────────────────────────────────────────────────────
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const isAttending = event.attendees.includes(req.user._id);

    res.json({
      ...event.toObject(),
      isAttending,
      attendeeCount: event.attendees.length,
      attendees: undefined,
    });
  } catch (error) {
    console.error('Get event error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────────────
// @desc    Create an event
// @route   POST /api/events
// @access  Private/Admin
// ─────────────────────────────────────────────────────
const createEvent = async (req, res) => {
  try {
    const { title, location, date, time, description, imageUrl } = req.body;

    const event = await Event.create({
      title,
      location,
      date,
      time,
      description,
      imageUrl,
    });

    res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────────────
// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
// ─────────────────────────────────────────────────────
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await event.deleteOne();
    res.json({ message: 'Event removed' });
  } catch (error) {
    console.error('Delete event error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────────────
// @desc    Attend an event
// @route   POST /api/events/:id/attend
// @access  Private
// ─────────────────────────────────────────────────────
const attendEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.attendees.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already attending this event' });
    }

    event.attendees.push(req.user._id);
    await event.save();

    res.json({
      message: `You're attending ${event.title}`,
      attendeeCount: event.attendees.length,
    });
  } catch (error) {
    console.error('Attend event error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────────────
// @desc    Unattend an event
// @route   DELETE /api/events/:id/attend
// @access  Private
// ─────────────────────────────────────────────────────
const unattendEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (!event.attendees.includes(req.user._id)) {
      return res.status(400).json({ message: 'Not attending this event' });
    }

    event.attendees = event.attendees.filter(
      (id) => id.toString() !== req.user._id.toString()
    );
    await event.save();

    res.json({
      message: `You're no longer attending ${event.title}`,
      attendeeCount: event.attendees.length,
    });
  } catch (error) {
    console.error('Unattend event error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  deleteEvent,
  attendEvent,
  unattendEvent,
};
