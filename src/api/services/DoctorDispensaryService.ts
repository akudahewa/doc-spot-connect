
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export interface DoctorDispensaryFee {
  _id: string;
  doctorId: {
    _id: string;
    name: string;
    specialization: string;
  };
  dispensaryId: {
    _id: string;
    name: string;
    address: string;
  };
  doctorFee: number;
  dispensaryFee: number;
  bookingCommission: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FeeAssignmentRequest {
  doctorId: string;
  dispensaryId: string;
  doctorFee: number;
  dispensaryFee: number;
  bookingCommission: number;
}

export const DoctorDispensaryService = {
  // Get fee information for a specific doctor-dispensary combination
  getFeeInfo: async (doctorId: string, dispensaryId: string): Promise<DoctorDispensaryFee> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(
        `${API_URL}/doctor-dispensary/doctor/${doctorId}/dispensary/${dispensaryId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt)
      };
    } catch (error) {
      console.error('Error fetching fee information:', error);
      throw new Error('Failed to fetch fee information');
    }
  },

  // Assign or update fees for a doctor-dispensary combination
  assignFees: async (feeData: FeeAssignmentRequest): Promise<DoctorDispensaryFee> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.post(
        `${API_URL}/doctor-dispensary/assign-fees`,
        feeData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt)
      };
    } catch (error) {
      console.error('Error assigning fees:', error);
      throw new Error('Failed to assign fees');
    }
  },

  // Get all fee configurations for a doctor
  getDoctorFees: async (doctorId: string): Promise<DoctorDispensaryFee[]> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(
        `${API_URL}/doctor-dispensary/doctor/${doctorId}/fees`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.map((fee: any) => ({
        ...fee,
        createdAt: new Date(fee.createdAt),
        updatedAt: new Date(fee.updatedAt)
      }));
    } catch (error) {
      console.error('Error fetching doctor fees:', error);
      throw new Error('Failed to fetch doctor fees');
    }
  },

  // Get all fee configurations for a dispensary
  getDispensaryFees: async (dispensaryId: string): Promise<DoctorDispensaryFee[]> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(
        `${API_URL}/doctor-dispensary/dispensary/${dispensaryId}/fees`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.map((fee: any) => ({
        ...fee,
        createdAt: new Date(fee.createdAt),
        updatedAt: new Date(fee.updatedAt)
      }));
    } catch (error) {
      console.error('Error fetching dispensary fees:', error);
      throw new Error('Failed to fetch dispensary fees');
    }
  }
};
