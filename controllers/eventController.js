const Event = require('../models/eventModel');

// Create Event (Admin Only)
exports.createEvent = async (req, res) => {
  const { name, description, date } = req.body;
  try {
    const event = new Event({ name, description, date });
    await event.save();
    res.status(201).json({ message: 'Event created successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get All Events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Register for Event
exports.registerEvent = async (req, res) => {
  const { eventId } = req.params;
  const { userId } = req.user;
  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    event.registeredUsers.push(userId);
    await event.save();
    res.status(200).json({ message: 'Registered for event successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Event Registrations (Admin Only)
exports.getEventRegistrations = async (req, res) => {
  const { eventId } = req.params;
  try {
    const event = await Event.findById(eventId).populate('registeredUsers', 'username');
    if (!event) return res.status(404).json({ error: 'Event not found' });

    res.json(event.registeredUsers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
