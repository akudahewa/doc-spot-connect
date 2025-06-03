
const express = require('express');
const router = express.Router();
const DoctorDispensary = require('../models/DoctorDispensary');
const Doctor = require('../models/Doctor');
const Dispensary = require('../models/Dispensary');

// Get fee information for a doctor-dispensary combination
router.get('/doctor/:doctorId/dispensary/:dispensaryId', async (req, res) => {
  try {
    const { doctorId, dispensaryId } = req.params;
    
    const feeInfo = await DoctorDispensary.findOne({
      doctorId,
      dispensaryId,
      isActive: true
    }).populate('doctorId', 'name specialization')
      .populate('dispensaryId', 'name address');
    
    if (!feeInfo) {
      return res.status(404).json({ message: 'Fee information not found for this doctor-dispensary combination' });
    }
    
    res.json(feeInfo);
  } catch (error) {
    console.error('Error fetching fee information:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create or update fee information for a doctor-dispensary combination
router.post('/assign-fees', async (req, res) => {
  try {
    const { doctorId, dispensaryId, doctorFee, dispensaryFee, bookingCommission } = req.body;
    
    // Validate required fields
    if (!doctorId || !dispensaryId || doctorFee === undefined || dispensaryFee === undefined || bookingCommission === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if doctor and dispensary exist
    const doctor = await Doctor.findById(doctorId);
    const dispensary = await Dispensary.findById(dispensaryId);
    
    if (!doctor || !dispensary) {
      return res.status(404).json({ message: 'Doctor or dispensary not found' });
    }
    
    // Create or update the fee information
    const feeInfo = await DoctorDispensary.findOneAndUpdate(
      { doctorId, dispensaryId },
      {
        doctorFee: Number(doctorFee),
        dispensaryFee: Number(dispensaryFee),
        bookingCommission: Number(bookingCommission),
        isActive: true
      },
      { upsert: true, new: true }
    ).populate('doctorId', 'name specialization')
     .populate('dispensaryId', 'name address');
    
    res.json(feeInfo);
  } catch (error) {
    console.error('Error setting fee information:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all fee configurations for a doctor
router.get('/doctor/:doctorId/fees', async (req, res) => {
  try {
    const { doctorId } = req.params;
    
    const feeConfigs = await DoctorDispensary.find({
      doctorId,
      isActive: true
    }).populate('dispensaryId', 'name address');
    
    res.json(feeConfigs);
  } catch (error) {
    console.error('Error fetching doctor fee configurations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all fee configurations for a dispensary
router.get('/dispensary/:dispensaryId/fees', async (req, res) => {
  try {
    const { dispensaryId } = req.params;
    
    const feeConfigs = await DoctorDispensary.find({
      dispensaryId,
      isActive: true
    }).populate('doctorId', 'name specialization');
    
    res.json(feeConfigs);
  } catch (error) {
    console.error('Error fetching dispensary fee configurations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
