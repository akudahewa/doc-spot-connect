
import axios from 'axios';
import { Booking, BookingStatus } from '@/api/models';
import { TimeSlotAvailability } from './TimeSlotService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface BookingCreateParams {
  doctorId: string;
  dispensaryId: string;
  bookingDate: Date;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  symptoms?: string;
}

export const BookingService = {
  // Get all bookings
  getAllBookings: async (): Promise<Booking[]> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(
        `${API_URL}/bookings`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data.map((booking: any) => ({
        id: booking._id,
        doctorId: booking.doctorId,
        dispensaryId: booking.dispensaryId,
        patientId: booking.patientId,
        patientName: booking.patientName,
        patientPhone: booking.patientPhone,
        patientEmail: booking.patientEmail,
        timeSlot: booking.timeSlot,
        appointmentNumber: booking.appointmentNumber,
        estimatedTime: booking.estimatedTime,
        status: booking.status,
        bookingDate: new Date(booking.bookingDate),
        symptoms: booking.symptoms,
        isPaid: booking.isPaid,
        isPatientVisited: booking.isPatientVisited,
        checkedInTime: booking.checkedInTime ? new Date(booking.checkedInTime) : undefined,
        completedTime: booking.completedTime ? new Date(booking.completedTime) : undefined,
        notes: booking.notes,
        createdAt: new Date(booking.createdAt),
        updatedAt: new Date(booking.updatedAt)
      }));
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw new Error('Failed to fetch bookings');
    }
  },

  // Get a specific booking
  getBooking: async (id: string): Promise<Booking> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(
        `${API_URL}/bookings/${id}`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const booking = response.data;
      return {
        id: booking._id,
        doctorId: booking.doctorId,
        dispensaryId: booking.dispensaryId,
        patientId: booking.patientId,
        patientName: booking.patientName,
        patientPhone: booking.patientPhone,
        patientEmail: booking.patientEmail,
        timeSlot: booking.timeSlot,
        appointmentNumber: booking.appointmentNumber,
        estimatedTime: booking.estimatedTime,
        status: booking.status,
        bookingDate: new Date(booking.bookingDate),
        symptoms: booking.symptoms,
        isPaid: booking.isPaid,
        isPatientVisited: booking.isPatientVisited,
        checkedInTime: booking.checkedInTime ? new Date(booking.checkedInTime) : undefined,
        completedTime: booking.completedTime ? new Date(booking.completedTime) : undefined,
        notes: booking.notes,
        createdAt: new Date(booking.createdAt),
        updatedAt: new Date(booking.updatedAt)
      };
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw new Error('Failed to fetch booking');
    }
  },

  // Get booking by patient ID
  getPatientBookings: async (patientId: string): Promise<Booking[]> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(
        `${API_URL}/bookings/patient/${patientId}`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data.map((booking: any) => ({
        id: booking._id,
        doctorId: booking.doctorId,
        dispensaryId: booking.dispensaryId,
        patientId: booking.patientId,
        patientName: booking.patientName,
        patientPhone: booking.patientPhone,
        patientEmail: booking.patientEmail,
        timeSlot: booking.timeSlot,
        appointmentNumber: booking.appointmentNumber,
        estimatedTime: booking.estimatedTime,
        status: booking.status,
        bookingDate: new Date(booking.bookingDate),
        symptoms: booking.symptoms,
        isPaid: booking.isPaid,
        isPatientVisited: booking.isPatientVisited,
        checkedInTime: booking.checkedInTime ? new Date(booking.checkedInTime) : undefined,
        completedTime: booking.completedTime ? new Date(booking.completedTime) : undefined,
        notes: booking.notes,
        createdAt: new Date(booking.createdAt),
        updatedAt: new Date(booking.updatedAt)
      }));
    } catch (error) {
      console.error('Error fetching patient bookings:', error);
      throw new Error('Failed to fetch patient bookings');
    }
  },

  // Create a new booking
  createBooking: async (booking: BookingCreateParams): Promise<Booking> => {
    try {
      const response = await axios.post(`${API_URL}/bookings`, booking);
      const createdBooking = response.data;
      
      return {
        id: createdBooking._id,
        doctorId: createdBooking.doctorId,
        dispensaryId: createdBooking.dispensaryId,
        patientId: createdBooking.patientId,
        patientName: createdBooking.patientName,
        patientPhone: createdBooking.patientPhone,
        patientEmail: createdBooking.patientEmail,
        timeSlot: createdBooking.timeSlot,
        appointmentNumber: createdBooking.appointmentNumber,
        estimatedTime: createdBooking.estimatedTime,
        status: createdBooking.status,
        bookingDate: new Date(createdBooking.bookingDate),
        symptoms: createdBooking.symptoms,
        isPaid: createdBooking.isPaid,
        isPatientVisited: createdBooking.isPatientVisited,
        checkedInTime: createdBooking.checkedInTime ? new Date(createdBooking.checkedInTime) : undefined,
        completedTime: createdBooking.completedTime ? new Date(createdBooking.completedTime) : undefined,
        notes: createdBooking.notes,
        createdAt: new Date(createdBooking.createdAt),
        updatedAt: new Date(createdBooking.updatedAt)
      };
    } catch (error) {
      console.error('Error creating booking:', error);
      throw new Error('Failed to create booking');
    }
  },

  // Update a booking status
  updateBookingStatus: async (
    id: string, 
    status: BookingStatus, 
    additionalData?: {
      checkedInTime?: Date,
      completedTime?: Date,
      notes?: string,
      isPaid?: boolean,
      isPatientVisited?: boolean
    }
  ): Promise<Booking> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.patch(
        `${API_URL}/bookings/${id}/status`, 
        { status, ...additionalData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedBooking = response.data;
      return {
        id: updatedBooking._id,
        doctorId: updatedBooking.doctorId,
        dispensaryId: updatedBooking.dispensaryId,
        patientId: updatedBooking.patientId,
        patientName: updatedBooking.patientName,
        patientPhone: updatedBooking.patientPhone,
        patientEmail: updatedBooking.patientEmail,
        timeSlot: updatedBooking.timeSlot,
        appointmentNumber: updatedBooking.appointmentNumber,
        estimatedTime: updatedBooking.estimatedTime,
        status: updatedBooking.status,
        bookingDate: new Date(updatedBooking.bookingDate),
        symptoms: updatedBooking.symptoms,
        isPaid: updatedBooking.isPaid,
        isPatientVisited: updatedBooking.isPatientVisited,
        checkedInTime: updatedBooking.checkedInTime ? new Date(updatedBooking.checkedInTime) : undefined,
        completedTime: updatedBooking.completedTime ? new Date(updatedBooking.completedTime) : undefined,
        notes: updatedBooking.notes,
        createdAt: new Date(updatedBooking.createdAt),
        updatedAt: new Date(updatedBooking.updatedAt)
      };
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw new Error('Failed to update booking status');
    }
  },

  // Cancel a booking
  cancelBooking: async (id: string, reason?: string): Promise<Booking> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.patch(
        `${API_URL}/bookings/${id}/cancel`, 
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const cancelledBooking = response.data;
      return {
        id: cancelledBooking._id,
        doctorId: cancelledBooking.doctorId,
        dispensaryId: cancelledBooking.dispensaryId,
        patientId: cancelledBooking.patientId,
        patientName: cancelledBooking.patientName,
        patientPhone: cancelledBooking.patientPhone,
        patientEmail: cancelledBooking.patientEmail,
        timeSlot: cancelledBooking.timeSlot,
        appointmentNumber: cancelledBooking.appointmentNumber,
        estimatedTime: cancelledBooking.estimatedTime,
        status: cancelledBooking.status,
        bookingDate: new Date(cancelledBooking.bookingDate),
        symptoms: cancelledBooking.symptoms,
        isPaid: cancelledBooking.isPaid,
        isPatientVisited: cancelledBooking.isPatientVisited,
        checkedInTime: cancelledBooking.checkedInTime ? new Date(cancelledBooking.checkedInTime) : undefined,
        completedTime: cancelledBooking.completedTime ? new Date(cancelledBooking.completedTime) : undefined,
        notes: cancelledBooking.notes,
        createdAt: new Date(cancelledBooking.createdAt),
        updatedAt: new Date(cancelledBooking.updatedAt)
      };
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw new Error('Failed to cancel booking');
    }
  },

  // Get next available appointment
  getNextAvailableAppointment: async (
    doctorId: string,
    dispensaryId: string,
    date: Date
  ): Promise<TimeSlotAvailability> => {
    try {
      // Format the date to ISO format for the API
      const formattedDate = date.toISOString().split('T')[0];
      const response = await axios.get(
        `${API_URL}/timeslots/available/${doctorId}/${dispensaryId}/${formattedDate}`
      );
      return response.data;
    } catch (error) {
      console.error('Error getting next available appointment:', error);
      return {
        available: false,
        message: 'Error fetching availability information'
      };
    }
  },
  
  // Get bookings for a specific doctor, dispensary and date
  getBookingsByDoctorDispensaryDate: async (
    doctorId: string,
    dispensaryId: string,
    date: string
  ): Promise<Booking[]> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(
        `${API_URL}/bookings/doctor/${doctorId}/dispensary/${dispensaryId}/date/${date}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data.map((booking: any) => ({
        id: booking._id,
        doctorId: booking.doctorId,
        dispensaryId: booking.dispensaryId,
        patientId: booking.patientId,
        patientName: booking.patientName,
        patientPhone: booking.patientPhone,
        patientEmail: booking.patientEmail,
        timeSlot: booking.timeSlot,
        appointmentNumber: booking.appointmentNumber,
        estimatedTime: booking.estimatedTime,
        status: booking.status,
        bookingDate: new Date(booking.bookingDate),
        symptoms: booking.symptoms,
        isPaid: booking.isPaid,
        isPatientVisited: booking.isPatientVisited,
        checkedInTime: booking.checkedInTime ? new Date(booking.checkedInTime) : undefined,
        completedTime: booking.completedTime ? new Date(booking.completedTime) : undefined,
        notes: booking.notes,
        createdAt: new Date(booking.createdAt),
        updatedAt: new Date(booking.updatedAt)
      }));
    } catch (error) {
      console.error('Error fetching bookings by date:', error);
      throw new Error('Failed to fetch bookings by date');
    }
  }
};
