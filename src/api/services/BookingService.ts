
import { Booking, BookingStatus } from '../models';

// Mocked bookings data
const mockBookings: Booking[] = [
  {
    id: '1',
    patientId: 'p1',
    doctorId: '1',
    dispensaryId: '1',
    bookingDate: new Date('2023-07-10'), // A Monday
    timeSlot: '18:00-18:20',
    status: BookingStatus.COMPLETED,
    notes: 'Regular checkup',
    symptoms: 'Headache, fever',
    checkedInTime: new Date('2023-07-10T18:05:00'),
    completedTime: new Date('2023-07-10T18:18:00'),
    createdAt: new Date('2023-07-05'),
    updatedAt: new Date('2023-07-10')
  },
  {
    id: '2',
    patientId: 'p2',
    doctorId: '1',
    dispensaryId: '1',
    bookingDate: new Date('2023-07-10'), // A Monday
    timeSlot: '18:20-18:40',
    status: BookingStatus.COMPLETED,
    symptoms: 'Cough, cold',
    checkedInTime: new Date('2023-07-10T18:15:00'),
    completedTime: new Date('2023-07-10T18:35:00'),
    createdAt: new Date('2023-07-08'),
    updatedAt: new Date('2023-07-10')
  },
  {
    id: '3',
    patientId: 'p3',
    doctorId: '1',
    dispensaryId: '1',
    bookingDate: new Date('2023-07-17'), // Next Monday
    timeSlot: '18:00-18:20',
    status: BookingStatus.SCHEDULED,
    symptoms: 'Annual checkup',
    createdAt: new Date('2023-07-12'),
    updatedAt: new Date('2023-07-12')
  }
];

export const BookingService = {
  // Get all bookings for a specific date, doctor, and dispensary
  getBookings: async (
    doctorId: string,
    dispensaryId: string,
    date: Date
  ): Promise<Booking[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Filter bookings by doctor, dispensary, and date
    return mockBookings.filter(booking => 
      booking.doctorId === doctorId &&
      booking.dispensaryId === dispensaryId &&
      booking.bookingDate.toDateString() === date.toDateString()
    );
  },

  // Get a booking by ID
  getBookingById: async (id: string): Promise<Booking | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockBookings.find(booking => booking.id === id) || null;
  },

  // Get all bookings for a patient
  getBookingsByPatient: async (patientId: string): Promise<Booking[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockBookings.filter(booking => booking.patientId === patientId);
  },

  // Create a new booking
  createBooking: async (booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // In a real system, you would validate:
    // 1. The doctor is available at that time
    // 2. The time slot is not already fully booked
    // 3. The doctor is not marked as absent
    
    const newBooking: Booking = {
      ...booking,
      id: Math.random().toString(36).substring(2, 11),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return newBooking;
  },

  // Update booking status
  updateBookingStatus: async (
    id: string, 
    status: BookingStatus,
    additionalInfo?: { checkedInTime?: Date; completedTime?: Date; notes?: string }
  ): Promise<Booking | null> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const existingBookingIndex = mockBookings.findIndex(b => b.id === id);
    
    if (existingBookingIndex === -1) {
      return null;
    }
    
    const updatedBooking = {
      ...mockBookings[existingBookingIndex],
      status,
      ...(additionalInfo || {}),
      updatedAt: new Date()
    };
    
    return updatedBooking;
  },

  // Cancel a booking
  cancelBooking: async (id: string, reason?: string): Promise<Booking | null> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const existingBookingIndex = mockBookings.findIndex(b => b.id === id);
    
    if (existingBookingIndex === -1) {
      return null;
    }
    
    const updatedBooking = {
      ...mockBookings[existingBookingIndex],
      status: BookingStatus.CANCELLED,
      notes: reason 
        ? `${mockBookings[existingBookingIndex].notes || ''} Cancellation reason: ${reason}`.trim()
        : mockBookings[existingBookingIndex].notes,
      updatedAt: new Date()
    };
    
    return updatedBooking;
  },

  // Get available time slots for a doctor at a dispensary on a specific date
  getAvailableTimeSlots: async (
    doctorId: string,
    dispensaryId: string,
    date: Date
  ): Promise<string[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // In a real system, you would:
    // 1. Get the time slot configuration for that day of week
    // 2. Check for any absent time slots
    // 3. Check existing bookings
    // 4. Calculate available slots
    
    // For this mock, we'll return some fake available slots
    const dayOfWeek = date.getDay();
    
    // Return different slots based on the day
    if (dayOfWeek === 0) { // Sunday
      return ['10:00-10:20', '10:20-10:40', '10:40-11:00', '11:00-11:20', 
              '11:20-11:40', '11:40-12:00', '12:00-12:20', '12:20-12:40', 
              '12:40-13:00', '13:00-13:20', '13:20-13:40', '13:40-14:00'];
    } else if (dayOfWeek === 6) { // Saturday
      return ['12:00-12:20', '12:20-12:40', '12:40-13:00', '13:00-13:20', 
              '13:20-13:40', '13:40-14:00', '14:00-14:20', '14:20-14:40', 
              '14:40-15:00', '15:00-15:20', '15:20-15:40', '15:40-16:00'];
    } else { // Weekdays
      return ['18:00-18:20', '18:20-18:40', '18:40-19:00', '19:00-19:20', 
              '19:20-19:40', '19:40-20:00', '20:00-20:20', '20:20-20:40', 
              '20:40-21:00', '21:00-21:20', '21:20-21:40', '21:40-22:00'];
    }
  }
};
