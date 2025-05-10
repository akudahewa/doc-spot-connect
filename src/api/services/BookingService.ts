import axios from 'axios';
import { Booking } from '../models';

// Mock booking data (replace with actual API calls later)
const mockBookings: Booking[] = [
  {
    id: '1',
    patientId: '101',
    doctorId: '1',
    dispensaryId: '1',
    bookingDate: new Date('2023-08-15T10:00:00'),
    timeSlot: '10:00-10:15',
    appointmentNumber: 1,
    estimatedTime: '10:00',
    status: 'scheduled',
    notes: 'Patient has a cough',
    symptoms: 'Cough, fever',
    isPaid: true,
    isPatientVisited: false,
    patientName: 'John Doe',
    patientPhone: '123-456-7890',
    patientEmail: 'john.doe@example.com',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    patientId: '102',
    doctorId: '2',
    dispensaryId: '2',
    bookingDate: new Date('2023-08-16T14:30:00'),
    timeSlot: '14:30-14:45',
    appointmentNumber: 2,
    estimatedTime: '14:30',
    status: 'completed',
    notes: 'Follow-up appointment',
    symptoms: 'None',
    isPaid: true,
    isPatientVisited: true,
    checkedInTime: new Date('2023-08-16T14:25:00'),
    completedTime: new Date('2023-08-16T14:40:00'),
    patientName: 'Jane Smith',
    patientPhone: '987-654-3210',
    patientEmail: 'jane.smith@example.com',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    patientId: '103',
    doctorId: '1',
    dispensaryId: '1',
    bookingDate: new Date('2023-08-15T11:00:00'),
    timeSlot: '11:00-11:15',
    appointmentNumber: 2,
    estimatedTime: '11:00',
    status: 'cancelled',
    notes: 'Patient cancelled',
    symptoms: 'N/A',
    isPaid: false,
    isPatientVisited: false,
    patientName: 'Alice Johnson',
    patientPhone: '555-123-4567',
    patientEmail: 'alice.johnson@example.com',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    patientId: '104',
    doctorId: '2',
    dispensaryId: '2',
    bookingDate: new Date('2023-08-16T09:00:00'),
    timeSlot: '09:00-09:15',
    appointmentNumber: 1,
    estimatedTime: '09:00',
    status: 'no_show',
    notes: 'Patient did not show up',
    symptoms: 'N/A',
    isPaid: false,
    isPatientVisited: false,
    patientName: 'Bob Williams',
    patientPhone: '111-222-3333',
    patientEmail: 'bob.williams@example.com',
    createdAt: new Date(),
    updatedAt: new Date()
  },
];

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

export const BookingService = {
  // Get all bookings
  getAllBookings: async (): Promise<Booking[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockBookings;
  },

  // Get booking by ID
  getBookingById: async (id: string): Promise<Booking | undefined> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockBookings.find(booking => booking.id === id);
  },

  // Create a new booking
  createBooking: async (booking: Booking): Promise<Booking> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Assign a new ID (in a real implementation, this would be handled by the database)
    const newBooking: Booking = { ...booking, id: Math.random().toString(36).substring(2, 15) };
    mockBookings.push(newBooking);
    return newBooking;
  },

  // Update an existing booking
  updateBooking: async (id: string, updatedBooking: Booking): Promise<Booking | undefined> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const index = mockBookings.findIndex(booking => booking.id === id);
    if (index !== -1) {
      mockBookings[index] = { ...updatedBooking, id };
      return mockBookings[index];
    }
    return undefined;
  },

  // Delete a booking
  deleteBooking: async (id: string): Promise<boolean> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const index = mockBookings.findIndex(booking => booking.id === id);
    if (index !== -1) {
      mockBookings.splice(index, 1);
      return true;
    }
    return false;
  },
  
  // Add this method to the BookingService object
  getBookingsByDoctorDispensaryDate: async (doctorId: string, dispensaryId: string, date: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      // Try to use the reports API endpoint for this
      const response = await axios.get(
        `${API_BASE_URL}/reports/session/${doctorId}/${dispensaryId}/${date}`, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching bookings for session:', error);
      
      // For development - mock data
      return mockBookings.filter(booking => 
        booking.doctorId === doctorId && 
        booking.dispensaryId === dispensaryId && 
        new Date(booking.bookingDate).toDateString() === new Date(date).toDateString()
      );
    }
  }
};
