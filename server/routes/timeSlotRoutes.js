
const express = require('express');
const router = express.Router();
const TimeSlotConfig = require('../models/TimeSlotConfig');
const AbsentTimeSlot = require('../models/AbsentTimeSlot');

// Get time slots for a doctor at a specific dispensary
router.get('/config/doctor/:doctorId/dispensary/:dispensaryId', async (req, res) => {
  try {
    const { doctorId, dispensaryId } = req.params;
    
    const timeSlots = await TimeSlotConfig.find({
      doctorId: doctorId,
      dispensaryId: dispensaryId
    });
    
    res.status(200).json(timeSlots);
  } catch (error) {
    console.error('Error getting time slots:', error);
    res.status(500).json({ message: 'Error fetching time slots', error: error.message });
  }
});

// Get all time slots for a dispensary
router.get('/config/dispensary/:dispensaryId', async (req, res) => {
  try {
    const timeSlots = await TimeSlotConfig.find({
      dispensaryId: req.params.dispensaryId
    }).populate('doctorId', 'name');
    
    res.status(200).json(timeSlots);
  } catch (error) {
    console.error('Error getting dispensary time slots:', error);
    res.status(500).json({ message: 'Error fetching time slots', error: error.message });
  }
});

// Add a new time slot configuration
router.post('/config', async (req, res) => {
  try {
    const timeSlotConfig = new TimeSlotConfig(req.body);
    await timeSlotConfig.save();
    res.status(201).json(timeSlotConfig);
  } catch (error) {
    console.error('Error creating time slot config:', error);
    res.status(500).json({ message: 'Error creating time slot config', error: error.message });
  }
});

// Update a time slot configuration
router.put('/config/:id', async (req, res) => {
  try {
    const timeSlotConfig = await TimeSlotConfig.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!timeSlotConfig) {
      return res.status(404).json({ message: 'Time slot configuration not found' });
    }
    
    res.status(200).json(timeSlotConfig);
  } catch (error) {
    console.error('Error updating time slot config:', error);
    res.status(500).json({ message: 'Error updating time slot config', error: error.message });
  }
});

// Delete a time slot configuration
router.delete('/config/:id', async (req, res) => {
  try {
    const timeSlotConfig = await TimeSlotConfig.findByIdAndDelete(req.params.id);
    
    if (!timeSlotConfig) {
      return res.status(404).json({ message: 'Time slot configuration not found' });
    }
    
    res.status(200).json({ message: 'Time slot configuration deleted successfully' });
  } catch (error) {
    console.error('Error deleting time slot config:', error);
    res.status(500).json({ message: 'Error deleting time slot config', error: error.message });
  }
});

// Get absent time slots
router.get('/absent/doctor/:doctorId/dispensary/:dispensaryId', async (req, res) => {
  try {
    const { doctorId, dispensaryId } = req.params;
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }
    
    const absentSlots = await AbsentTimeSlot.find({
      doctorId: doctorId,
      dispensaryId: dispensaryId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    });
    
    res.status(200).json(absentSlots);
  } catch (error) {
    console.error('Error getting absent time slots:', error);
    res.status(500).json({ message: 'Error fetching absent time slots', error: error.message });
  }
});

// Add an absent time slot
router.post('/absent', async (req, res) => {
  try {
    const absentSlot = new AbsentTimeSlot(req.body);
    await absentSlot.save();
    res.status(201).json(absentSlot);
  } catch (error) {
    console.error('Error creating absent time slot:', error);
    res.status(500).json({ message: 'Error creating absent time slot', error: error.message });
  }
});

// Delete an absent time slot
router.delete('/absent/:id', async (req, res) => {
  try {
    const absentSlot = await AbsentTimeSlot.findByIdAndDelete(req.params.id);
    
    if (!absentSlot) {
      return res.status(404).json({ message: 'Absent time slot not found' });
    }
    
    res.status(200).json({ message: 'Absent time slot deleted successfully' });
  } catch (error) {
    console.error('Error deleting absent time slot:', error);
    res.status(500).json({ message: 'Error deleting absent time slot', error: error.message });
  }
});

module.exports = router;
