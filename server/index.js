
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import routes
const doctorRoutes = require('./routes/doctorRoutes');
const dispensaryRoutes = require('./routes/dispensaryRoutes');
const authRoutes = require('./routes/authRoutes');
const timeSlotRoutes = require('./routes/timeSlotRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/doctor-reservation')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Routes
app.use('/api/doctors', doctorRoutes);
app.use('/api/dispensaries', dispensaryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/timeslots', timeSlotRoutes);
app.use('/api/bookings', bookingRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('Doctor Reservation API is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
