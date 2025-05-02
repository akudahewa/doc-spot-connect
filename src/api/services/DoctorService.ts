
import axios from 'axios';
import { Doctor } from '../models';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const DoctorService = {
  // Get all doctors
  getAllDoctors: async (): Promise<Doctor[]> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${API_URL}/doctors`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      return response.data.map((doctor: any) => ({
        ...doctor,
        id: doctor._id,
        createdAt: new Date(doctor.createdAt),
        updatedAt: new Date(doctor.updatedAt)
      }));
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw new Error('Failed to fetch doctors');
    }
  },

  // Get doctor by ID
  getDoctorById: async (id: string): Promise<Doctor | null> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${API_URL}/doctors/${id}`, {
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
      console.error(`Error fetching doctor with ID ${id}:`, error);
      throw new Error('Failed to fetch doctor');
    }
  },

  // Get doctors by dispensary ID
  getDoctorsByDispensaryId: async (dispensaryId: string): Promise<Doctor[]> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${API_URL}/doctors/dispensary/${dispensaryId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      return response.data.map((doctor: any) => ({
        ...doctor,
        id: doctor._id,
        createdAt: new Date(doctor.createdAt),
        updatedAt: new Date(doctor.updatedAt)
      }));
    } catch (error) {
      console.error(`Error fetching doctors for dispensary ${dispensaryId}:`, error);
      throw new Error('Failed to fetch doctors for dispensary');
    }
  },

  // Add a new doctor
  addDoctor: async (doctor: Omit<Doctor, 'id' | 'createdAt' | 'updatedAt'>): Promise<Doctor> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.post(`${API_URL}/doctors`, doctor, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      return {
        ...response.data,
        id: response.data._id,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt)
      };
    } catch (error) {
      console.error('Error adding doctor:', error);
      throw new Error('Failed to add doctor');
    }
  },

  // Update doctor
  updateDoctor: async (id: string, doctor: Partial<Doctor>): Promise<Doctor | null> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.put(`${API_URL}/doctors/${id}`, doctor, {
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
      console.error(`Error updating doctor with ID ${id}:`, error);
      throw new Error('Failed to update doctor');
    }
  },

  // Delete doctor
  deleteDoctor: async (id: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('auth_token');
      await axios.delete(`${API_URL}/doctors/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return true;
    } catch (error) {
      console.error(`Error deleting doctor with ID ${id}:`, error);
      throw new Error('Failed to delete doctor');
    }
  }
};
