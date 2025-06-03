import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export interface User {
  _id: string;
  auth0Id: string;
  name: string;
  email: string;
  dispensaryIds: string[];
  isActive: boolean;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Dispensary {
  _id: string;
  name: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDispensaryAssignment {
  userId: string;
  userName: string;
  userEmail: string;
  dispensaryId: string;
  dispensaryName: string;
  role: 'hospital_admin' | 'hospital_staff';
}

export interface UserWithDispensaryInfo {
  _id: string;
  auth0Id: string;
  name: string;
  email: string;
  isActive: boolean;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
  dispensaryAssignments: {
    dispensaryId: string;
    dispensaryName: string;
    role: 'hospital_admin' | 'hospital_staff';
  }[];
}

export const UserDispensaryService = {
  // Get all users with their dispensary assignments
  getAllUsers: async (): Promise<UserWithDispensaryInfo[]> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${API_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // The server returns the complete structure with dispensaryAssignments
      return response.data.map((user: any) => ({
        ...user,
        lastLogin: new Date(user.lastLogin),
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt),
        dispensaryAssignments: user.dispensaryAssignments || []
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  },

  // Get all dispensaries
  getAllDispensaries: async (): Promise<Dispensary[]> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${API_URL}/dispensaries`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.map((dispensary: any) => ({
        ...dispensary,
        createdAt: new Date(dispensary.createdAt),
        updatedAt: new Date(dispensary.updatedAt)
      }));
    } catch (error) {
      console.error('Error fetching dispensaries:', error);
      throw new Error('Failed to fetch dispensaries');
    }
  },

  // Get users by dispensary
  getUsersByDispensary: async (dispensaryId: string): Promise<UserWithDispensaryInfo[]> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${API_URL}/user-dispensary/dispensary/${dispensaryId}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.map((user: any) => ({
        ...user,
        lastLogin: new Date(user.lastLogin),
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt)
      }));
    } catch (error) {
      console.error('Error fetching dispensary users:', error);
      throw new Error('Failed to fetch dispensary users');
    }
  },

  // Get all user-dispensary assignments
  getAllAssignments: async (): Promise<UserDispensaryAssignment[]> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${API_URL}/user-dispensary/assignments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching assignments:', error);
      throw new Error('Failed to fetch assignments');
    }
  },

  // Assign user to dispensary
  assignUserToDispensary: async (
    userId: string, 
    dispensaryId: string, 
    role: 'hospital_admin' | 'hospital_staff'
  ): Promise<UserWithDispensaryInfo> => {
    try {
      console.log("trying to call assign users"); 
      const token = localStorage.getItem('auth_token');
      const response = await axios.post(
        `${API_URL}/user-dispensary/assign`,
        { userId, dispensaryId, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return {
        ...response.data.user,
        lastLogin: new Date(response.data.user.lastLogin),
        createdAt: new Date(response.data.user.createdAt),
        updatedAt: new Date(response.data.user.updatedAt)
      };
    } catch (error) {
      console.error('Error assigning user to dispensary:', error);
      throw new Error('Failed to assign user to dispensary');
    }
  },

  // Update user's role in dispensary
  updateUserRole: async (
    userId: string,
    dispensaryId: string,
    role: 'hospital_admin' | 'hospital_staff'
  ): Promise<UserWithDispensaryInfo> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.put(
        `${API_URL}/user-dispensary/update-role`,
        { userId, dispensaryId, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return {
        ...response.data.user,
        lastLogin: new Date(response.data.user.lastLogin),
        createdAt: new Date(response.data.user.createdAt),
        updatedAt: new Date(response.data.user.updatedAt)
      };
    } catch (error) {
      console.error('Error updating user role:', error);
      throw new Error('Failed to update user role');
    }
  },

  // Remove user from dispensary
  removeUserFromDispensary: async (userId: string, dispensaryId: string): Promise<UserWithDispensaryInfo> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.delete(
        `${API_URL}/user-dispensary/unassign`,
        {
          data: { userId, dispensaryId },
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return {
        ...response.data.user,
        lastLogin: new Date(response.data.user.lastLogin),
        createdAt: new Date(response.data.user.createdAt),
        updatedAt: new Date(response.data.user.updatedAt)
      };
    } catch (error) {
      console.error('Error removing user from dispensary:', error);
      throw new Error('Failed to remove user from dispensary');
    }
  }
}; 