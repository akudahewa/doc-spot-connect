
import axios from 'axios';
import { TimeSlotConfig, AbsentTimeSlot } from '../models';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const TimeSlotService = {
  // Get time slots for a doctor at a specific dispensary
  getTimeSlotConfigsByDoctor: async (doctorId: string, dispensaryId: string): Promise<TimeSlotConfig[]> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(
        `${API_URL}/timeslots/config/doctor/${doctorId}/dispensary/${dispensaryId}`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      return response.data.map((slot: any) => ({
        ...slot,
        id: slot._id,
        doctorId: slot.doctorId,
        dispensaryId: slot.dispensaryId,
        createdAt: new Date(slot.createdAt),
        updatedAt: new Date(slot.updatedAt)
      }));
    } catch (error) {
      console.error('Error fetching time slot configs:', error);
      throw new Error('Failed to fetch time slot configurations');
    }
  },

  // Get all time slots for a dispensary
  getTimeSlotConfigsByDispensary: async (dispensaryId: string): Promise<TimeSlotConfig[]> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(
        `${API_URL}/timeslots/config/dispensary/${dispensaryId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      return response.data.map((slot: any) => ({
        ...slot,
        id: slot._id,
        doctorId: typeof slot.doctorId === 'object' ? slot.doctorId._id : slot.doctorId,
        dispensaryId: slot.dispensaryId,
        createdAt: new Date(slot.createdAt),
        updatedAt: new Date(slot.updatedAt)
      }));
    } catch (error) {
      console.error('Error fetching dispensary time slots:', error);
      throw new Error('Failed to fetch dispensary time slot configurations');
    }
  },

  // Add a new time slot configuration
  addTimeSlotConfig: async (timeSlotConfig: Omit<TimeSlotConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<TimeSlotConfig> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.post(
        `${API_URL}/timeslots/config`, 
        timeSlotConfig,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      return {
        ...response.data,
        id: response.data._id,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt)
      };
    } catch (error) {
      console.error('Error adding time slot config:', error);
      throw new Error('Failed to add time slot configuration');
    }
  },

  // Update a time slot configuration
  updateTimeSlotConfig: async (id: string, config: Partial<TimeSlotConfig>): Promise<TimeSlotConfig | null> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.put(
        `${API_URL}/timeslots/config/${id}`, 
        config,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (!response.data) return null;
      
      return {
        ...response.data,
        id: response.data._id,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt)
      };
    } catch (error) {
      console.error('Error updating time slot config:', error);
      throw new Error('Failed to update time slot configuration');
    }
  },

  // Delete a time slot configuration
  deleteTimeSlotConfig: async (id: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('auth_token');
      await axios.delete(`${API_URL}/timeslots/config/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return true;
    } catch (error) {
      console.error('Error deleting time slot config:', error);
      throw new Error('Failed to delete time slot configuration');
    }
  },

  // Get absent time slots for a doctor at a specific dispensary
  getAbsentTimeSlots: async (doctorId: string, dispensaryId: string, startDate: Date, endDate: Date): Promise<AbsentTimeSlot[]> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(
        `${API_URL}/timeslots/absent/doctor/${doctorId}/dispensary/${dispensaryId}`, 
        {
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
          },
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      return response.data.map((slot: any) => ({
        ...slot,
        id: slot._id,
        date: new Date(slot.date),
        createdAt: new Date(slot.createdAt),
        updatedAt: new Date(slot.updatedAt)
      }));
    } catch (error) {
      console.error('Error fetching absent time slots:', error);
      throw new Error('Failed to fetch absent time slots');
    }
  },

  // Add an absent time slot
  addAbsentTimeSlot: async (absentSlot: Omit<AbsentTimeSlot, 'id' | 'createdAt' | 'updatedAt'>): Promise<AbsentTimeSlot> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      // Convert date to ISO string if it's a Date object
      const slotToSend = {
        ...absentSlot,
        date: absentSlot.date instanceof Date ? absentSlot.date.toISOString() : absentSlot.date,
      };
      
      const response = await axios.post(
        `${API_URL}/timeslots/absent`, 
        slotToSend,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      return {
        ...response.data,
        id: response.data._id,
        date: new Date(response.data.date),
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt)
      };
    } catch (error) {
      console.error('Error adding absent time slot:', error);
      throw new Error('Failed to add absent time slot');
    }
  },

  // Delete an absent time slot
  deleteAbsentTimeSlot: async (id: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('auth_token');
      await axios.delete(`${API_URL}/timeslots/absent/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return true;
    } catch (error) {
      console.error('Error deleting absent time slot:', error);
      throw new Error('Failed to delete absent time slot');
    }
  }
};
