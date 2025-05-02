
const mongoose = require('mongoose');

const absentTimeSlotSchema = new mongoose.Schema({
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
  date: { 
    type: Date, 
    required: true 
  },
  startTime: { 
    type: String, 
    required: true 
  },
  endTime: { 
    type: String, 
    required: true 
  },
  reason: String
}, { 
  timestamps: {
    createdAt: true,
    updatedAt: true
  } 
});

module.exports = mongoose.model('AbsentTimeSlot', absentTimeSlotSchema);
