const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// POST /register
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const newUser = new User({ username, password, role });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt for username:', username); // Log the login attempt

  const user = await User.findOne({ username });
  if (!user) {
      console.log('User not found');
      return res.status(400).json({ message: 'User not found' });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
      console.log('Invalid password for user:', username);
      return res.status(400).json({ message: 'Invalid password' });
  }

  try {
      const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log('Token generated:', token); // Log the token for debugging
      return res.json({ token, user });
  } catch (error) {
      console.error('Error generating token:', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
