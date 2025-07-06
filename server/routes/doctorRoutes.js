
const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const Dispensary = require('../models/Dispensary');

// Get all doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find().populate('dispensaries', 'name');
    res.status(200).json(doctors);
  } catch (error) {
    console.error('Error getting doctors:', error);
    res.status(500).json({ message: 'Error fetching doctors', error: error.message });
  }
});

// Get doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('dispensaries', 'name');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.status(200).json(doctor);
  } catch (error) {
    console.error('Error getting doctor:', error);
    res.status(500).json({ message: 'Error fetching doctor', error: error.message });
  }
});

// Get doctors by dispensary ID
router.get('/dispensary/:dispensaryId', async (req, res) => {
  try {
    const dispensary = await Dispensary.findById(req.params.dispensaryId);
    if (!dispensary) {
      return res.status(404).json({ message: 'Dispensary not found' });
    }
    
    const doctors = await Doctor.find({ dispensaries: req.params.dispensaryId });
    res.status(200).json(doctors);
  } catch (error) {
    console.error('Error getting doctors by dispensary:', error);
    res.status(500).json({ message: 'Error fetching doctors', error: error.message });
  }
});

// POST /api/doctors/by-dispensaries
router.post('/by-dispensaries', async (req, res) => {
  try {
    const { dispensaryIds } = req.body; // expects { dispensaryIds: [id1, id2, ...] }
    if (!Array.isArray(dispensaryIds) || dispensaryIds.length === 0) {
      return res.status(400).json({ message: 'No dispensary IDs provided' });
    }
    // Find doctors who are associated with any of the given dispensary IDs
    const doctors = await Doctor.find({ dispensaries: { $in: dispensaryIds } });
    res.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors by dispensary IDs:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new doctor
router.post('/', async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    
    // Handle adding doctor to dispensaries
    if (req.body.dispensaries && req.body.dispensaries.length > 0) {
      for (const dispensaryId of req.body.dispensaries) {
        const dispensary = await Dispensary.findById(dispensaryId);
        if (dispensary) {
          dispensary.doctors.push(doctor._id);
          await dispensary.save();
        }
      }
    }
    
    await doctor.save();
    res.status(201).json(doctor);
  } catch (error) {
    console.error('Error creating doctor:', error);
    res.status(500).json({ message: 'Error creating doctor', error: error.message });
  }
});

// Update doctor
router.put('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    // Handle dispensary associations if they've changed
    if (req.body.dispensaries && JSON.stringify(doctor.dispensaries) !== JSON.stringify(req.body.dispensaries)) {
      // Remove doctor from old dispensaries that are not in the new list
      for (const oldDispId of doctor.dispensaries) {
        if (!req.body.dispensaries.includes(oldDispId.toString())) {
          const dispensary = await Dispensary.findById(oldDispId);
          if (dispensary) {
            dispensary.doctors = dispensary.doctors.filter(docId => docId.toString() !== doctor._id.toString());
            await dispensary.save();
          }
        }
      }
      
      // Add doctor to new dispensaries
      for (const newDispId of req.body.dispensaries) {
        if (!doctor.dispensaries.map(id => id.toString()).includes(newDispId)) {
          const dispensary = await Dispensary.findById(newDispId);
          if (dispensary && !dispensary.doctors.map(id => id.toString()).includes(doctor._id.toString())) {
            dispensary.doctors.push(doctor._id);
            await dispensary.save();
          }
        }
      }
    }
    
    // Update doctor fields
    Object.keys(req.body).forEach(key => {
      doctor[key] = req.body[key];
    });
    
    await doctor.save();
    res.status(200).json(doctor);
  } catch (error) {
    console.error('Error updating doctor:', error);
    res.status(500).json({ message: 'Error updating doctor', error: error.message });
  }
});

// Delete doctor
router.delete('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    // Remove doctor from dispensaries
    for (const dispensaryId of doctor.dispensaries) {
      const dispensary = await Dispensary.findById(dispensaryId);
      if (dispensary) {
        dispensary.doctors = dispensary.doctors.filter(docId => docId.toString() !== doctor._id.toString());
        await dispensary.save();
      }
    }
    
    await Doctor.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).json({ message: 'Error deleting doctor', error: error.message });
  }
});

module.exports = router;
