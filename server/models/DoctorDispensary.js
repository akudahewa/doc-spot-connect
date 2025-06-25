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
    default: 0
  },
  dispensaryFee: {
    type: Number,
    default: 0
  },
  bookingCommission: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create a compound index to ensure unique doctor-dispensary combinations
doctorDispensarySchema.index({ doctorId: 1, dispensaryId: 1 }, { unique: true });

const DoctorDispensary = mongoose.model('DoctorDispensary', doctorDispensarySchema);

module.exports = DoctorDispensary;
