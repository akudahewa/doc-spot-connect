
import axios from 'axios';
import { Dispensary, Doctor } from '../models';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const DispensaryService = {
  // Get all dispensaries
  getAllDispensaries: async (): Promise<Dispensary[]> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${API_URL}/dispensaries`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      return response.data.map((dispensary: any) => ({
        ...dispensary,
        id: dispensary._id,
        createdAt: new Date(dispensary.createdAt),
        updatedAt: new Date(dispensary.updatedAt)
      }));
    } catch (error) {
      console.error('Error fetching dispensaries:', error);
      throw new Error('Failed to fetch dispensaries');
    }
  },

  // Get dispensary by ID
  getDispensaryById: async (id: string): Promise<Dispensary | null> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${API_URL}/dispensaries/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.data) return null;
      
      return {
        ...response.data,
        id: response.data._id,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt)
      };
    } catch (error) {
      console.error(`Error fetching dispensary with ID ${id}:`, error);
      throw new Error('Failed to fetch dispensary');
    }
  },

  getDispensariesByIds: async (ids: string[]):Promise<Dispensary[]> => {
    const token = localStorage.getItem('auth_token');
    const response = await axios.post(
      `${API_URL}/dispensaries/by-ids`,
      { ids },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log(response.data);
    if (!response.data) return null;
      
    return response.data.map((dispensary: any) => ({
      ...dispensary,
      id: dispensary._id,
    }));
  },

  

  // Get dispensaries by doctor ID
  getDispensariesByDoctorId: async (doctorId: string): Promise<Dispensary[]> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${API_URL}/dispensaries/doctor/${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      return response.data.map((dispensary: any) => ({
        ...dispensary,
        id: dispensary._id,
        createdAt: new Date(dispensary.createdAt),
        updatedAt: new Date(dispensary.updatedAt)
      }));
    } catch (error) {
      console.error(`Error fetching dispensaries for doctor ${doctorId}:`, error);
      throw new Error('Failed to fetch dispensaries for doctor');
    }
  },

  // Get dispensaries by location (within radius)
  getDispensariesByLocation: async (
    latitude: number, 
    longitude: number, 
    radiusKm: number = 10
  ): Promise<Dispensary[]> => {
    try {
      const response = await axios.get(`${API_URL}/dispensaries/location/nearby`, {
        params: { latitude, longitude, radiusKm }
      });
      
      return response.data.map((dispensary: any) => ({
        ...dispensary,
        id: dispensary._id,
        createdAt: new Date(dispensary.createdAt),
        updatedAt: new Date(dispensary.updatedAt)
      }));
    } catch (error) {
      console.error('Error fetching nearby dispensaries:', error);
      throw new Error('Failed to fetch nearby dispensaries');
    }
  },

  // Add a new dispensary
  addDispensary: async (dispensary: Omit<Dispensary, 'id' | 'createdAt' | 'updatedAt'>): Promise<Dispensary> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.post(`${API_URL}/dispensaries`, dispensary, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      return {
        ...response.data,
        id: response.data._id,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt)
      };
    } catch (error) {
      console.error('Error adding dispensary:', error);
      throw new Error('Failed to add dispensary');
    }
  },

  // Update dispensary
  updateDispensary: async (id: string, dispensary: Partial<Dispensary>): Promise<Dispensary | null> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.put(`${API_URL}/dispensaries/${id}`, dispensary, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.data) return null;
      
      return {
        ...response.data,
        id: response.data._id,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt)
      };
    } catch (error) {
      console.error(`Error updating dispensary with ID ${id}:`, error);
      throw new Error('Failed to update dispensary');
    }
  },

  // Delete dispensary
  deleteDispensary: async (id: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('auth_token');
      await axios.delete(`${API_URL}/dispensaries/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return true;
    } catch (error) {
      console.error(`Error deleting dispensary with ID ${id}:`, error);
      throw new Error('Failed to delete dispensary');
    }
  }
};
