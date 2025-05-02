
const mongoose = require('mongoose');

const timeSlotConfigSchema = new mongoose.Schema({
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
  dayOfWeek: { 
    type: Number, 
    required: true,
    min: 0,
    max: 6
  },
  startTime: { 
    type: String, 
    required: true 
  },
  endTime: { 
    type: String, 
    required: true 
  },
  maxPatients: { 
    type: Number, 
    required: true 
  }
}, { 
  timestamps: {
    createdAt: true,
    updatedAt: true
  } 
});

module.exports = mongoose.model('TimeSlotConfig', timeSlotConfigSchema);
