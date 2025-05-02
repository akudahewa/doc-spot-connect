
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

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://myclinicuser:1qaz2wsx@E@myclinic-cluster.ht5hi.mongodb.net/?retryWrites=true&w=majority&appName=myclinic-cluster';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/doctors', doctorRoutes);
app.use('/api/dispensaries', dispensaryRoutes);
app.use('/api/timeslots', timeSlotRoutes);
app.use('/api/auth', authRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('MyClinic API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
