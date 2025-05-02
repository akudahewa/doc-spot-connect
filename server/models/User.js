
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true,
    unique: true
  },
  passwordHash: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    required: true,
    enum: ['super_admin', 'dispensary_admin', 'dispensary_staff']
  },
  dispensaryIds: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Dispensary' 
  }],
  isActive: { 
    type: Boolean, 
    default: true 
  },
  lastLogin: Date
}, { 
  timestamps: {
    createdAt: true,
    updatedAt: true
  } 
});

module.exports = mongoose.model('User', userSchema);
