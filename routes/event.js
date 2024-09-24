const express = require('express');
const { authenticateJWT, authorizeRole } = require('../middleware/auth');
const Event = require('../models/Event');
const router = express.Router();

// POST /events (Admin only)
router.post('/', authenticateJWT, authorizeRole('Admin'), async (req, res) => {
  const { name, description, date } = req.body;
  const newEvent = new Event({ name, description, date });
  await newEvent.save();
  res.status(201).json(newEvent);
});

// GET /events (Everyone)
router.get('/', authenticateJWT, async (req, res) => {
  const events = await Event.find().populate('registrations');
  res.json(events);
});

// POST /register-event/:eventId (Users only)
router.post('/register-event/:eventId', authenticateJWT, authorizeRole('User'), async (req, res) => {
  const event = await Event.findById(req.params.eventId);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  event.registrations.push(req.user._id);
  await event.save();
  res.status(200).json({ message: 'Registered successfully' });
});

module.exports = router;
