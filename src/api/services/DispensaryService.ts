
import { Dispensary } from '../models';

// Mocked dispensaries data with location coordinates
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
    updatedAt: new Date('2023-04-15'),
    location: {
      latitude: 40.7128,
      longitude: -74.0060
    }
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
    updatedAt: new Date('2023-05-10'),
    location: {
      latitude: 40.7282,
      longitude: -74.0776
    }
  },
  {
    id: '3',
    name: 'Eastside Family Practice',
    address: '789 Oak Road, Eastside, City',
    contactNumber: '555-321-6547',
    email: 'info@eastsidepractice.com',
    description: 'Family-focused healthcare in a comfortable environment.',
    doctors: ['2', '3'],
    createdAt: new Date('2023-02-15'),
    updatedAt: new Date('2023-06-20'),
    location: {
      latitude: 40.7295,
      longitude: -73.9965
    }
  },
  {
    id: '4',
    name: 'Northside Wellness Center',
    address: '321 Pine Boulevard, Northside, City',
    contactNumber: '555-987-6543',
    email: 'hello@northsidewellness.com',
    description: 'Integrative approach to health and wellness.',
    doctors: ['2'],
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date('2023-07-05'),
    location: {
      latitude: 40.7831,
      longitude: -73.9712
    }
  }
];

// Helper function to calculate distance using Haversine formula
const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

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

  // Get dispensaries by location (within radius)
  getDispensariesByLocation: async (
    latitude: number, 
    longitude: number, 
    radiusKm: number = 10
  ): Promise<Dispensary[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return mockDispensaries.filter(dispensary => {
      if (!dispensary.location) return false;
      
      const distance = calculateDistance(
        latitude,
        longitude,
        dispensary.location.latitude,
        dispensary.location.longitude
      );
      
      return distance <= radiusKm;
    });
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
