
import { Booking, BookingStatus } from '../models';
import axios from 'axios';
import { TimeSlotService, AvailableTimeSlot } from './TimeSlotService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Mocked bookings data - will be replaced with API calls in real implementation
const mockBookings: Booking[] = [
  {
    id: '1',
    patientId: 'p1',
    doctorId: '1',
    dispensaryId: '1',
    bookingDate: new Date('2023-07-10'), // A Monday
    timeSlot: '18:00-18:20',
    appointmentNumber: 1,
    estimatedTime: '18:00',
    status: BookingStatus.COMPLETED,
    notes: 'Regular checkup',
    symptoms: 'Headache, fever',
    isPaid: true,
    isPatientVisited: true,
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
    appointmentNumber: 2,
    estimatedTime: '18:20',
    status: BookingStatus.COMPLETED,
    symptoms: 'Cough, cold',
    isPaid: true,
    isPatientVisited: true,
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
    appointmentNumber: 1,
    estimatedTime: '18:00',
    status: BookingStatus.SCHEDULED,
    symptoms: 'Annual checkup',
    isPaid: false,
    isPatientVisited: false,
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
    try {
      const token = localStorage.getItem('auth_token');
      const formattedDate = date.toISOString().split('T')[0];
      
      const response = await axios.get(
        `${API_URL}/bookings/doctor/${doctorId}/dispensary/${dispensaryId}/date/${formattedDate}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      return response.data.map((booking: any) => ({
        ...booking,
        id: booking._id,
        bookingDate: new Date(booking.bookingDate),
        checkedInTime: booking.checkedInTime ? new Date(booking.checkedInTime) : undefined,
        completedTime: booking.completedTime ? new Date(booking.completedTime) : undefined,
        createdAt: new Date(booking.createdAt),
        updatedAt: new Date(booking.updatedAt)
      }));
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // Fall back to mock data for demo purposes
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockBookings.filter(booking => 
        booking.doctorId === doctorId &&
        booking.dispensaryId === dispensaryId &&
        booking.bookingDate.toDateString() === date.toDateString()
      );
    }
  },

  // Get a booking by ID
  getBookingById: async (id: string): Promise<Booking | null> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(
        `${API_URL}/bookings/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (!response.data) return null;
      
      return {
        ...response.data,
        id: response.data._id,
        bookingDate: new Date(response.data.bookingDate),
        checkedInTime: response.data.checkedInTime ? new Date(response.data.checkedInTime) : undefined,
        completedTime: response.data.completedTime ? new Date(response.data.completedTime) : undefined,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt)
      };
    } catch (error) {
      console.error('Error fetching booking by ID:', error);
      // Fall back to mock data
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockBookings.find(booking => booking.id === id) || null;
    }
  },

  // Get all bookings for a patient
  getBookingsByPatient: async (patientId: string): Promise<Booking[]> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(
        `${API_URL}/bookings/patient/${patientId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      return response.data.map((booking: any) => ({
        ...booking,
        id: booking._id,
        bookingDate: new Date(booking.bookingDate),
        checkedInTime: booking.checkedInTime ? new Date(booking.checkedInTime) : undefined,
        completedTime: booking.completedTime ? new Date(booking.completedTime) : undefined,
        createdAt: new Date(booking.createdAt),
        updatedAt: new Date(booking.updatedAt)
      }));
    } catch (error) {
      console.error('Error fetching patient bookings:', error);
      // Fall back to mock data
      await new Promise(resolve => setTimeout(resolve, 400));
      return mockBookings.filter(booking => booking.patientId === patientId);
    }
  },

  // Create a new booking
  createBooking: async (booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'isPaid' | 'isPatientVisited'>): Promise<Booking> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      // Format booking date if it's a Date object
      const bookingToSend = {
        ...booking,
        bookingDate: booking.bookingDate instanceof Date 
          ? booking.bookingDate.toISOString() 
          : booking.bookingDate,
      };
      
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
      
      // For mock purposes, create a simulated response
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const newBooking: Booking = {
        ...booking,
        id: Math.random().toString(36).substring(2, 11),
        isPaid: false,
        isPatientVisited: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      return newBooking;
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
      
      // Prepare data to send
      const updateData = {
        status,
        ...additionalInfo,
        checkedInTime: additionalInfo?.checkedInTime instanceof Date 
          ? additionalInfo.checkedInTime.toISOString() 
          : additionalInfo?.checkedInTime,
        completedTime: additionalInfo?.completedTime instanceof Date
          ? additionalInfo.completedTime.toISOString()
          : additionalInfo?.completedTime
      };
      
      const response = await axios.patch(
        `${API_URL}/bookings/${id}/status`, 
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (!response.data) return null;
      
      return {
        ...response.data,
        id: response.data._id,
        bookingDate: new Date(response.data.bookingDate),
        checkedInTime: response.data.checkedInTime ? new Date(response.data.checkedInTime) : undefined,
        completedTime: response.data.completedTime ? new Date(response.data.completedTime) : undefined,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt)
      };
    } catch (error) {
      console.error('Error updating booking status:', error);
      
      // Mock response
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
    }
  },

  // Cancel a booking
  cancelBooking: async (id: string, reason?: string): Promise<Booking | null> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.patch(
        `${API_URL}/bookings/${id}/cancel`, 
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (!response.data) return null;
      
      return {
        ...response.data,
        id: response.data._id,
        bookingDate: new Date(response.data.bookingDate),
        checkedInTime: response.data.checkedInTime ? new Date(response.data.checkedInTime) : undefined,
        completedTime: response.data.completedTime ? new Date(response.data.completedTime) : undefined,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt)
      };
    } catch (error) {
      console.error('Error cancelling booking:', error);
      
      // Mock response
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
    }
  },

  // Get available time slots for a doctor at a dispensary on a specific date
  getAvailableTimeSlots: async (
    doctorId: string,
    dispensaryId: string,
    date: Date
  ): Promise<AvailableTimeSlot[]> => {
    try {
      return TimeSlotService.getAvailableTimeSlots(doctorId, dispensaryId, date);
    } catch (error) {
      console.error('Error fetching available time slots:', error);
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // In a real system, you would:
      // 1. Get the time slot configuration for that day of week
      // 2. Check for any absent time slots
      // 3. Check existing bookings
      // 4. Calculate available slots
      
      // For this mock, we'll return some fake available slots
      const dayOfWeek = date.getDay();
      
      // Define variables for different day scenarios
      let slots: AvailableTimeSlot[] = [];
      const minutesPerPatient = 20;
      
      // Return different slots based on the day
      if (dayOfWeek === 0) { // Sunday
        for (let i = 1; i <= 12; i++) {
          const hour = Math.floor((i - 1) / 3) + 10;
          const minute = ((i - 1) % 3) * 20;
          const endMinute = (minute + minutesPerPatient) % 60;
          const endHour = hour + Math.floor((minute + minutesPerPatient) / 60);
          
          slots.push({
            appointmentNumber: i,
            timeSlot: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}-${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`,
            estimatedTime: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
            minutesPerPatient
          });
        }
      } else if (dayOfWeek === 6) { // Saturday
        for (let i = 1; i <= 12; i++) {
          const hour = Math.floor((i - 1) / 3) + 12;
          const minute = ((i - 1) % 3) * 20;
          const endMinute = (minute + minutesPerPatient) % 60;
          const endHour = hour + Math.floor((minute + minutesPerPatient) / 60);
          
          slots.push({
            appointmentNumber: i,
            timeSlot: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}-${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`,
            estimatedTime: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
            minutesPerPatient
          });
        }
      } else { // Weekdays
        for (let i = 1; i <= 12; i++) {
          const hour = Math.floor((i - 1) / 3) + 18;
          const minute = ((i - 1) % 3) * 20;
          const endMinute = (minute + minutesPerPatient) % 60;
          const endHour = hour + Math.floor((minute + minutesPerPatient) / 60);
          
          slots.push({
            appointmentNumber: i,
            timeSlot: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}-${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`,
            estimatedTime: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
            minutesPerPatient
          });
        }
      }
      
      return slots;
    }
  }
};
