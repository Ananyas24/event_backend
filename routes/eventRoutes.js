const express = require('express');
const {
  createEvent,
  getEvents,
  registerEvent,
  getEventRegistrations,
} = require('../controllers/eventController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, adminMiddleware, createEvent);
router.get('/', getEvents);
router.post('/register/:eventId', authMiddleware, registerEvent);
router.get('/registrations/:eventId', authMiddleware, adminMiddleware, getEventRegistrations);

module.exports = router;
