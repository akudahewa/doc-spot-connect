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

  // Updated method to get the next available appointment
  getNextAvailableAppointment: async (
    doctorId: string,
    dispensaryId: string,
    date: Date
  ): Promise<TimeSlotAvailability> => {
    try {
      // Get all available slots for this date
      const availability = await TimeSlotService.getAvailableTimeSlots(doctorId, dispensaryId, date);
      // Format date to YYYY-MM-DD format without timezone conversion
      // const year = date.getFullYear();
      // const month = String(date.getMonth() + 1).padStart(2, '0');
      // const day = String(date.getDate()).padStart(2, '0');
      // const formattedDate = `${year}-${month}-${day}`;
      
      // console.log("Original date:", date);
      // console.log("Formatted date:", formattedDate);
      
      // const response = await axios.get(
      //   `${API_URL}/bookings/next-available/${doctorId}/${dispensaryId}/${formattedDate}`
      // );
      
      // Return the availability data, which includes availability status, session info, and slots
      return availability;
    } catch (error) {
      console.error('Error fetching next available appointment:', error);
      return {
        available: false,
        message: 'Error fetching availability information'
      };
    }
  },

  // Create a new booking
  createBooking: async (bookingData: {
    patientName: string;
    patientPhone: string;
    patientEmail?: string;
    symptoms?: string;
    doctorId: string;
    dispensaryId: string;
    bookingDate: Date;
  }): Promise<Booking> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      // Format booking date to YYYY-MM-DD format
      const year = bookingData.bookingDate.getFullYear();
      const month = String(bookingData.bookingDate.getMonth() + 1).padStart(2, '0');
      const day = String(bookingData.bookingDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      
      const bookingToSend = {
        ...bookingData,
        bookingDate: formattedDate,
      };
      
      console.log("Sending booking request:", bookingToSend);
      
      const response = await axios.post(
        `${API_URL}/bookings`, 
        bookingToSend,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      return {
        ...response.data,
        id: response.data._id,
        bookingDate: new Date(response.data.bookingDate),
        isPaid: response.data.isPaid || false,
        isPatientVisited: response.data.isPatientVisited || false,
        checkedInTime: response.data.checkedInTime ? new Date(response.data.checkedInTime) : undefined,
        completedTime: response.data.completedTime ? new Date(response.data.completedTime) : undefined,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt)
      };
    } catch (error) {
      console.error('Error creating booking:', error);
      throw new Error('Failed to create booking');
    }
  },

  // Update booking status
  updateBookingStatus: async (
    id: string, 
    status: BookingStatus,
    additionalInfo?: { 
      checkedInTime?: Date; 
      completedTime?: Date; 
      notes?: string;
      isPaid?: boolean;
      isPatientVisited?: boolean;
    }
  ): Promise<Booking | null> => {
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
