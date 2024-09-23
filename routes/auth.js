const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  const userExist = await User.findOne({ username });
  if (userExist) return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword, role });

  await newUser.save();
  res.status(201).json({ message: 'User created successfully!' });
});


// Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  // Find the user
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  
  // Check the password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  // Generate JWT token
  const token = jwt.sign(
    { _id: user._id, role: user.role }, // Include user ID and role in token
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  
  // Return token and user info
  res.status(200).json({
    token,
    user: {
      _id: user._id,
      username: user.username,
      role: user.role
    }
  });
});


module.exports = router;
