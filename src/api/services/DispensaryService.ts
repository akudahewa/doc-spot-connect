
import { Dispensary } from '../models';

// Mocked dispensaries data
const mockDispensaries: Dispensary[] = [
  {
    id: '1',
    name: 'City Health Clinic',
    address: '123 Main Street, Downtown, City',
    contactNumber: '555-789-1234',
    email: 'info@cityhealthclinic.com',
    description: 'A modern health clinic providing comprehensive healthcare services.',
    doctors: ['1', '2'],
    createdAt: new Date('2022-11-20'),
    updatedAt: new Date('2023-04-15')
  },
  {
    id: '2',
    name: 'Westside Medical Center',
    address: '456 Elm Avenue, Westside, City',
    contactNumber: '555-456-7890',
    email: 'contact@westsidemedical.com',
    description: 'Specialized medical center with state-of-the-art facilities.',
    doctors: ['1', '3'],
    createdAt: new Date('2023-01-05'),
    updatedAt: new Date('2023-05-10')
  }
];

export const DispensaryService = {
  // Get all dispensaries
  getAllDispensaries: async (): Promise<Dispensary[]> => {
    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockDispensaries;
  },

  // Get dispensary by ID
  getDispensaryById: async (id: string): Promise<Dispensary | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockDispensaries.find(dispensary => dispensary.id === id) || null;
  },

  // Get dispensaries by doctor ID
  getDispensariesByDoctorId: async (doctorId: string): Promise<Dispensary[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockDispensaries.filter(dispensary => dispensary.doctors.includes(doctorId));
  },

  // Add a new dispensary (in a real API, this would create a new record)
  addDispensary: async (dispensary: Omit<Dispensary, 'id' | 'createdAt' | 'updatedAt'>): Promise<Dispensary> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const newDispensary: Dispensary = {
      ...dispensary,
      id: Math.random().toString(36).substring(2, 11),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return newDispensary;
  },

  // Update dispensary (in a real API, this would update the record in the database)
  updateDispensary: async (id: string, dispensary: Partial<Dispensary>): Promise<Dispensary | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const existingDispensaryIndex = mockDispensaries.findIndex(d => d.id === id);
    
    if (existingDispensaryIndex === -1) {
      return null;
    }

    const updatedDispensary = {
      ...mockDispensaries[existingDispensaryIndex],
      ...dispensary,
      updatedAt: new Date()
    };
    
    return updatedDispensary;
  },

  // Delete dispensary (in a real API, this would remove the record from the database)
  deleteDispensary: async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return true;
  }
};
