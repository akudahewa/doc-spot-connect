import { Booking, BookingStatus } from '../models';
import axios from 'axios';
import { TimeSlotService, AvailableTimeSlot, TimeSlotAvailability } from './TimeSlotService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
      throw new Error('Failed to fetch bookings');
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
      throw new Error('Failed to fetch booking details');
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
      throw new Error('Failed to fetch patient bookings');
    }
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
      
      // Format booking date to only send the date part (YYYY-MM-DD)
      // This ensures that no time zone conversion issues occur
      const formattedDate = bookingData.bookingDate.toISOString().split('T')[0];
      
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
      throw new Error('Failed to update booking status');
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
      throw new Error('Failed to cancel booking');
    }
  },

  // Get available time slots for a doctor at a dispensary on a specific date
  getAvailableTimeSlots: async (
    doctorId: string,
    dispensaryId: string,
    date: Date
  ): Promise<TimeSlotAvailability> => {
    try {
      return TimeSlotService.getAvailableTimeSlots(doctorId, dispensaryId, date);
    } catch (error) {
      console.error('Error fetching available time slots:', error);
      throw new Error('Failed to fetch available time slots');
    }
  }
};
