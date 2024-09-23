const express = require('express');
const Event = require('../models/Event');
const { authenticateJWT, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Create Event (Admin only)
router.post('/', async (req, res) => {
  const { name, description, date } = req.body;

  // Validate incoming data
  if (!name || !description || !date) {
    return res.status(400).json({ message: 'Please provide all required fields (name, description, date).' });
  }

  try {
    const newEvent = new Event({ name, description, date });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});



// Get all events (Admin and Users)
// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


// Register for Event (Users)
router.post('/register-event/:eventId', authenticateJWT, authorizeRole('User'), async (req, res) => {
  const { eventId } = req.params;

  // Validate if eventId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ message: 'Invalid event ID' });
  }

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Check if the user is already registered
    if (event.registrations.includes(req.user._id)) {
      return res.status(400).json({ message: 'User already registered for this event' });
    }

    event.registrations.push(req.user._id);
    await event.save();

    res.status(200).json({ message: 'Registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});




// Get event registrations (Admin only)
router.get('/event-registrations/:eventId', authenticateJWT, authorizeRole('Admin'), async (req, res) => {
  const event = await Event.findById(req.params.eventId).populate('registrations');
  res.status(200).json(event.registrations);
});

module.exports = router;
