const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/event');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Configure CORS to allow requests from the frontend at localhost:3000
app.use(cors({
  origin: 'http://localhost:3000', // Allow only frontend origin
  credentials: true, // Allow credentials if needed (e.g., cookies, authorization headers)
}));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected...'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
