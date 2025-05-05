const express = require('express');
const router = express.Router();
const TimeSlotConfig = require('../models/TimeSlotConfig');
const AbsentTimeSlot = require('../models/AbsentTimeSlot');
const mongoose = require('mongoose');

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

// New endpoint to get available time slots with appointment numbers
router.get('/available/:doctorId/:dispensaryId/:date', async (req, res) => {
  try {
    const { doctorId, dispensaryId, date } = req.params;
    
    // Parse the date
    const bookingDate = new Date(date);
    
    // Get day of week (0-6, where 0 is Sunday)
    const dayOfWeek = bookingDate.getDay();
    
    // 1. Get the regular time slot configuration for this day
    const timeSlotConfig = await TimeSlotConfig.findOne({
      doctorId: doctorId,
      dispensaryId: dispensaryId,
      dayOfWeek: dayOfWeek
    });
    
    if (!timeSlotConfig) {
      return res.status(200).json([]);
    }
    
    // 2. Check if there's a modified/absent session for this specific date
    const absentSlot = await AbsentTimeSlot.findOne({
      doctorId: doctorId,
      dispensaryId: dispensaryId,
      date: {
        $gte: new Date(bookingDate.setHours(0, 0, 0, 0)),
        $lte: new Date(bookingDate.setHours(23, 59, 59, 999))
      }
    });
    
    // Variables to hold session details
    let startTime, endTime, minutesPerPatient, maxPatients;
    
    // If completely absent, return no slots
    if (absentSlot && !absentSlot.isModifiedSession) {
      return res.status(200).json([]);
    } 
    // If modified session, use those parameters
    else if (absentSlot && absentSlot.isModifiedSession) {
      startTime = absentSlot.startTime;
      endTime = absentSlot.endTime;
      maxPatients = absentSlot.maxPatients || timeSlotConfig.maxPatients;
      minutesPerPatient = absentSlot.minutesPerPatient || timeSlotConfig.minutesPerPatient;
    } 
    // Otherwise use the regular config
    else {
      startTime = timeSlotConfig.startTime;
      endTime = timeSlotConfig.endTime;
      maxPatients = timeSlotConfig.maxPatients;
      minutesPerPatient = timeSlotConfig.minutesPerPatient;
    }
    
    // 3. Get already booked appointments for this day
    const BookingModel = mongoose.models.Booking || mongoose.model('Booking', new mongoose.Schema({}));
    const existingBookings = await BookingModel.find({
      doctorId: doctorId,
      dispensaryId: dispensaryId,
      bookingDate: {
        $gte: new Date(bookingDate.setHours(0, 0, 0, 0)),
        $lte: new Date(bookingDate.setHours(23, 59, 59, 999))
      },
      status: { $ne: 'cancelled' }
    }).sort({ appointmentNumber: 1 });
    
    // 4. Calculate available time slots
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const sessionStartTime = new Date(bookingDate);
    sessionStartTime.setHours(startHour, startMinute, 0, 0);
    
    const sessionEndTime = new Date(bookingDate);
    sessionEndTime.setHours(endHour, endMinute, 0, 0);
    
    // Calculate total session duration in minutes
    const totalSessionMinutes = 
      (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
    
    // Calculate max possible appointments based on time and minutes per patient
    const maxPossibleAppointments = Math.min(
      maxPatients,
      Math.floor(totalSessionMinutes / minutesPerPatient)
    );
    
    // Generate time slots
    const availableSlots = [];
    
    for (let i = 1; i <= maxPossibleAppointments; i++) {
      // Check if this appointment number is already booked
      const isBooked = existingBookings.some(booking => booking.appointmentNumber === i);
      
      if (!isBooked) {
        // Calculate the estimated time for this appointment
        const appointmentOffset = (i - 1) * minutesPerPatient; // Minutes from start time
        const appointmentTime = new Date(sessionStartTime);
        appointmentTime.setMinutes(appointmentTime.getMinutes() + appointmentOffset);
        
        const hours = appointmentTime.getHours().toString().padStart(2, '0');
        const minutes = appointmentTime.getMinutes().toString().padStart(2, '0');
        const estimatedTime = `${hours}:${minutes}`;
        
        // Calculate the time slot range (e.g., "18:00-18:20")
        const endOfAppointment = new Date(appointmentTime);
        endOfAppointment.setMinutes(endOfAppointment.getMinutes() + minutesPerPatient);
        
        const endHours = endOfAppointment.getHours().toString().padStart(2, '0');
        const endMinutes = endOfAppointment.getMinutes().toString().padStart(2, '0');
        
        const timeSlot = `${hours}:${minutes}-${endHours}:${endMinutes}`;
        
        availableSlots.push({
          appointmentNumber: i,
          timeSlot,
          estimatedTime,
          minutesPerPatient
        });
      }
    }
    
    res.status(200).json(availableSlots);
  } catch (error) {
    console.error('Error getting available time slots:', error);
    res.status(500).json({
      message: 'Error fetching available time slots',
      error: error.message
    });
  }
});

module.exports = router;
