
const mongoose = require('mongoose');

const doctorDispensarySchema = new mongoose.Schema({
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
  doctorFee: {
    type: Number,
    required: true,
    min: 0
  },
  dispensaryFee: {
    type: Number,
    required: true,
    min: 0
  },
  bookingCommission: {
    type: Number,
    required: true,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Ensure unique combination of doctor and dispensary
doctorDispensarySchema.index({ doctorId: 1, dispensaryId: 1 }, { unique: true });

module.exports = mongoose.model('DoctorDispensary', doctorDispensarySchema);
