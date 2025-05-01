
import { Doctor } from '../models';

// Mocked doctors data
const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Wilson',
    specialization: 'General Practitioner',
    qualifications: ['MBBS', 'MD'],
    contactNumber: '555-123-4567',
    email: 'sarah.wilson@example.com',
    profilePicture: 'https://randomuser.me/api/portraits/women/68.jpg',
    dispensaries: ['1', '2'],
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-05-20')
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialization: 'Cardiologist',
    qualifications: ['MBBS', 'MD', 'DM Cardiology'],
    contactNumber: '555-987-6543',
    email: 'michael.chen@example.com',
    profilePicture: 'https://randomuser.me/api/portraits/men/45.jpg',
    dispensaries: ['1'],
    createdAt: new Date('2023-02-10'),
    updatedAt: new Date('2023-06-05')
  },
  {
    id: '3',
    name: 'Dr. Emily Johnson',
    specialization: 'Pediatrician',
    qualifications: ['MBBS', 'MD Pediatrics'],
    contactNumber: '555-234-5678',
    email: 'emily.johnson@example.com',
    profilePicture: 'https://randomuser.me/api/portraits/women/22.jpg',
    dispensaries: ['2'],
    createdAt: new Date('2023-03-05'),
    updatedAt: new Date('2023-07-15')
  }
];

export const DoctorService = {
  // Get all doctors
  getAllDoctors: async (): Promise<Doctor[]> => {
    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockDoctors;
  },

  // Get doctor by ID
  getDoctorById: async (id: string): Promise<Doctor | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockDoctors.find(doctor => doctor.id === id) || null;
  },

  // Get doctors by dispensary ID
  getDoctorsByDispensaryId: async (dispensaryId: string): Promise<Doctor[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockDoctors.filter(doctor => doctor.dispensaries.includes(dispensaryId));
  },

  // Add a new doctor (in a real API, this would create a new record)
  addDoctor: async (doctor: Omit<Doctor, 'id' | 'createdAt' | 'updatedAt'>): Promise<Doctor> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const newDoctor: Doctor = {
      ...doctor,
      id: Math.random().toString(36).substring(2, 11),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return newDoctor;
  },

  // Update doctor (in a real API, this would update the record in the database)
  updateDoctor: async (id: string, doctor: Partial<Doctor>): Promise<Doctor | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const existingDoctorIndex = mockDoctors.findIndex(d => d.id === id);
    
    if (existingDoctorIndex === -1) {
      return null;
    }

    const updatedDoctor = {
      ...mockDoctors[existingDoctorIndex],
      ...doctor,
      updatedAt: new Date()
    };
    
    return updatedDoctor;
  },

  // Delete doctor (in a real API, this would remove the record from the database)
  deleteDoctor: async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return true;
  }
};
