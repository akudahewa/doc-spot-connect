
const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const Booking = require('../models/Booking');
const Doctor = require('../models/Doctor');
const Dispensary = require('../models/Dispensary');
const authMiddleware = require('../middleware/authMiddleware');

// Get all reports
router.get('/', authMiddleware, async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    console.error('Error getting reports:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get reports by dispensary
router.get('/dispensary/:dispensaryId', authMiddleware, async (req, res) => {
  try {
    const reports = await Report.find({
      dispensaryId: req.params.dispensaryId
    }).sort({ createdAt: -1 });
    
    res.json(reports);
  } catch (error) {
    console.error('Error getting dispensary reports:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate daily bookings report
router.post('/generate/daily-bookings', authMiddleware, async (req, res) => {
  try {
    const { title, startDate, endDate, dispensaryId } = req.body;
    
    // Find bookings within the date range
    const bookingQuery = {
      bookingDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };
    
    if (dispensaryId) {
      bookingQuery.dispensaryId = dispensaryId;
    }
    
    const bookings = await Booking.find(bookingQuery);
    
    // Process booking data for the report
    const totalBookings = bookings.length;
    const completedBookings = bookings.filter(b => b.status === 'completed').length;
    const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;
    const noShowBookings = bookings.filter(b => b.status === 'no_show').length;
    
    // Group bookings by doctor
    const doctorBookings = {};
    for (const booking of bookings) {
      const doctorId = booking.doctorId.toString();
      if (!doctorBookings[doctorId]) {
        const doctor = await Doctor.findById(doctorId);
        doctorBookings[doctorId] = {
          doctorId,
          doctorName: doctor ? doctor.name : 'Unknown Doctor',
          bookings: 0
        };
      }
      doctorBookings[doctorId].bookings++;
    }
    
    const bookingsByDoctor = Object.values(doctorBookings);
    
    // Create the report data
    const reportData = {
      totalBookings,
      completedBookings,
      cancelledBookings,
      noShowBookings,
      bookingsByDoctor
    };
    
    // Create a new report
    const report = new Report({
      type: 'daily_bookings',
      title: title || 'Daily Bookings Report',
      parameters: { startDate, endDate, dispensaryId },
      generatedBy: req.user.id,
      dispensaryId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      data: reportData
    });
    
    await report.save();
    res.json(report);
    
  } catch (error) {
    console.error('Error generating daily bookings report:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate monthly summary report
router.post('/generate/monthly-summary', authMiddleware, async (req, res) => {
  try {
    const { title, startDate, endDate, dispensaryId } = req.body;
    
    // Find bookings within the date range
    const bookingQuery = {
      bookingDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };
    
    if (dispensaryId) {
      bookingQuery.dispensaryId = dispensaryId;
    }
    
    const bookings = await Booking.find(bookingQuery);
    
    // Process booking data for the report
    const totalBookings = bookings.length;
    const completedBookings = bookings.filter(b => b.status === 'completed').length;
    const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;
    const noShowBookings = bookings.filter(b => b.status === 'no_show').length;
    
    // Calculate revenue (assuming each completed booking has a fixed price of $100)
    const revenue = completedBookings * 100;
    
    // Group bookings by doctor
    const doctorBookings = {};
    for (const booking of bookings) {
      const doctorId = booking.doctorId.toString();
      if (!doctorBookings[doctorId]) {
        const doctor = await Doctor.findById(doctorId);
        doctorBookings[doctorId] = {
          doctorId,
          doctorName: doctor ? doctor.name : 'Unknown Doctor',
          bookings: 0
        };
      }
      doctorBookings[doctorId].bookings++;
    }
    
    // Sort doctors by number of bookings
    const popularDoctors = Object.values(doctorBookings)
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 5);
    
    // Create the report data
    const reportData = {
      totalBookings,
      completedBookings,
      cancelledBookings,
      noShowBookings,
      revenue,
      popularDoctors
    };
    
    // Create a new report
    const report = new Report({
      type: 'monthly_summary',
      title: title || 'Monthly Summary Report',
      parameters: { startDate, endDate, dispensaryId },
      generatedBy: req.user.id,
      dispensaryId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      data: reportData
    });
    
    await report.save();
    res.json(report);
    
  } catch (error) {
    console.error('Error generating monthly summary report:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get session report (bookings for a specific doctor, dispensary, and date)
router.get('/session/:doctorId/:dispensaryId/:date', authMiddleware, async (req, res) => {
  try {
    const { doctorId, dispensaryId, date } = req.params;
    
    // Create start and end date for the specified date
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    
    const bookings = await Booking.find({
      doctorId,
      dispensaryId,
      bookingDate: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ appointmentNumber: 1 });
    
    res.json(bookings);
  } catch (error) {
    console.error('Error getting session report:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate doctor performance report
router.post('/generate/doctor-performance', authMiddleware, async (req, res) => {
  try {
    const { title, startDate, endDate, dispensaryId } = req.body;
    
    // Get all doctors, optionally filtered by dispensary
    let doctorQuery = {};
    if (dispensaryId) {
      doctorQuery.dispensaries = dispensaryId;
    }
    
    const doctors = await Doctor.find(doctorQuery);
    
    // For each doctor, get performance metrics
    const doctorPerformanceData = [];
    
    for (const doctor of doctors) {
      const doctorId = doctor._id;
      
      // Find bookings for this doctor within the date range
      const bookingQuery = {
        doctorId,
        bookingDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
      
      if (dispensaryId) {
        bookingQuery.dispensaryId = dispensaryId;
      }
      
      const doctorBookings = await Booking.find(bookingQuery);
      
      const totalPatients = doctorBookings.length;
      const completedAppointments = doctorBookings.filter(b => b.status === 'completed').length;
      
      // Calculate completion rate as a percentage
      const completionRate = totalPatients > 0 
        ? Math.round((completedAppointments / totalPatients) * 100) 
        : 0;
      
      // Mock average rating (would come from a real ratings system)
      const avgRating = 4 + Math.random();
      
      doctorPerformanceData.push({
        doctorId: doctorId.toString(),
        doctorName: doctor.name,
        totalPatients,
        avgRating: avgRating > 5 ? 5 : avgRating,
        completionRate
      });
    }
    
    // Create the report data
    const reportData = {
      doctors: doctorPerformanceData
    };
    
    // Create a new report
    const report = new Report({
      type: 'doctor_performance',
      title: title || 'Doctor Performance Report',
      parameters: { startDate, endDate, dispensaryId },
      generatedBy: req.user.id,
      dispensaryId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      data: reportData
    });
    
    await report.save();
    res.json(report);
    
  } catch (error) {
    console.error('Error generating doctor performance report:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate dispensary revenue report
router.post('/generate/dispensary-revenue', authMiddleware, async (req, res) => {
  try {
    const { title, startDate, endDate, dispensaryId } = req.body;
    
    // Find bookings within the date range for the specified dispensary
    const bookingQuery = {
      bookingDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      },
      status: 'completed' // Only count completed bookings for revenue
    };
    
    if (dispensaryId) {
      bookingQuery.dispensaryId = dispensaryId;
    }
    
    const bookings = await Booking.find(bookingQuery);
    
    // Calculate total revenue (assuming each completed booking has a fixed price of $100)
    const totalRevenue = bookings.length * 100;
    
    // Mock revenue by service (would come from a real system with service details)
    const revenueByService = [
      { service: 'Consultation', revenue: Math.floor(totalRevenue * 0.6) },
      { service: 'Treatment', revenue: Math.floor(totalRevenue * 0.3) },
      { service: 'Medication', revenue: Math.floor(totalRevenue * 0.1) }
    ];
    
    // Group bookings by doctor
    const doctorRevenue = {};
    for (const booking of bookings) {
      const doctorId = booking.doctorId.toString();
      if (!doctorRevenue[doctorId]) {
        const doctor = await Doctor.findById(doctorId);
        doctorRevenue[doctorId] = {
          doctorId,
          doctorName: doctor ? doctor.name : 'Unknown Doctor',
          revenue: 0
        };
      }
      doctorRevenue[doctorId].revenue += 100; // $100 per completed booking
    }
    
    const revenueByDoctor = Object.values(doctorRevenue);
    
    // Create mock revenue by month data
    const revenueByMonth = [
      { month: 'January', revenue: Math.floor(Math.random() * 10000) + 5000 },
      { month: 'February', revenue: Math.floor(Math.random() * 10000) + 5000 }
    ];
    
    // Create the report data
    const reportData = {
      totalRevenue,
      revenueByService,
      revenueByDoctor,
      revenueByMonth
    };
    
    // Create a new report
    const report = new Report({
      type: 'dispensary_revenue',
      title: title || 'Dispensary Revenue Report',
      parameters: { startDate, endDate, dispensaryId },
      generatedBy: req.user.id,
      dispensaryId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      data: reportData
    });
    
    await report.save();
    res.json(report);
    
  } catch (error) {
    console.error('Error generating dispensary revenue report:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
