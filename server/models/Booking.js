
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  dispensaryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dispensary',
    required: true
  },
  bookingDate: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true
  },
  appointmentNumber: {
    type: Number,
    required: true
  },
  estimatedTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'checked_in', 'completed', 'cancelled', 'no_show'],
    default: 'scheduled'
  },
  notes: {
    type: String
  },
  symptoms: {
    type: String
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  isPatientVisited: {
    type: Boolean,
    default: false
  },
  checkedInTime: {
    type: Date
  },
  completedTime: {
    type: Date
  },
  patientName: {
    type: String,
    required: true
  },
  patientPhone: {
    type: String,
    required: true
  },
  patientEmail: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
