
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import routes
const doctorRoutes = require('./routes/doctorRoutes');
const dispensaryRoutes = require('./routes/dispensaryRoutes');
const timeSlotRoutes = require('./routes/timeSlotRoutes');
const authRoutes = require('./routes/authRoutes');

// Import middleware
const { validateJwt } = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Set environment variable for development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

// Improved MongoDB connection with better error handling
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Server will continue to run without database connectivity.');
    // We don't exit the process so the server still runs for development
  });

// Public routes (no authentication required)
app.use('/api/auth', authRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('MyClinic API is running');
});

// Add a route for the base /api path to help with testing
app.get('/api', (req, res) => {
  res.json({ 
    status: 'API is running', 
    endpoints: ['/api/doctors', '/api/dispensaries', '/api/timeslots', '/api/auth'],
    auth: {
      type: 'Auth0',
      domain: process.env.AUTH0_DOMAIN,
      audience: process.env.AUTH0_AUDIENCE
    },
    environment: process.env.NODE_ENV
  });
});

// Protected routes (authentication required)
app.use('/api/doctors', validateJwt, doctorRoutes);
app.use('/api/dispensaries', validateJwt, dispensaryRoutes);
app.use('/api/timeslots', validateJwt, timeSlotRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
