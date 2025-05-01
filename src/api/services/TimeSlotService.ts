
import { TimeSlotConfig, AbsentTimeSlot } from '../models';

// Mocked time slot configurations
const mockTimeSlotConfigs: TimeSlotConfig[] = [
  {
    id: '1',
    doctorId: '1',
    dispensaryId: '1',
    dayOfWeek: 1, // Monday
    startTime: '18:00', // 6:00 PM
    endTime: '22:00', // 10:00 PM
    maxPatients: 15,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: '2',
    doctorId: '1',
    dispensaryId: '1',
    dayOfWeek: 2, // Tuesday
    startTime: '18:00',
    endTime: '22:00',
    maxPatients: 15,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: '3',
    doctorId: '1',
    dispensaryId: '1',
    dayOfWeek: 3, // Wednesday
    startTime: '18:00',
    endTime: '22:00',
    maxPatients: 15,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: '4',
    doctorId: '1',
    dispensaryId: '1',
    dayOfWeek: 4, // Thursday
    startTime: '18:00',
    endTime: '22:00',
    maxPatients: 15,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: '5',
    doctorId: '1',
    dispensaryId: '1',
    dayOfWeek: 5, // Friday
    startTime: '18:00',
    endTime: '22:00',
    maxPatients: 15,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: '6',
    doctorId: '1',
    dispensaryId: '1',
    dayOfWeek: 6, // Saturday
    startTime: '12:00', // 12:00 PM
    endTime: '16:00', // 4:00 PM
    maxPatients: 20,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: '7',
    doctorId: '1',
    dispensaryId: '2',
    dayOfWeek: 0, // Sunday
    startTime: '10:00', // 10:00 AM
    endTime: '14:00', // 2:00 PM
    maxPatients: 12,
    createdAt: new Date('2023-02-01'),
    updatedAt: new Date('2023-02-01')
  }
];

// Mocked absent time slots
const mockAbsentTimeSlots: AbsentTimeSlot[] = [
  {
    id: '1',
    doctorId: '1',
    dispensaryId: '1',
    date: new Date('2023-07-10'), // A Monday
    startTime: '18:00',
    endTime: '22:00',
    reason: 'Personal emergency',
    createdAt: new Date('2023-07-05'),
    updatedAt: new Date('2023-07-05')
  },
  {
    id: '2',
    doctorId: '1',
    dispensaryId: '2',
    date: new Date('2023-07-16'), // A Sunday
    startTime: '10:00',
    endTime: '14:00',
    reason: 'Conference attendance',
    createdAt: new Date('2023-07-01'),
    updatedAt: new Date('2023-07-01')
  }
];

export const TimeSlotService = {
  // Get time slots for a doctor at a specific dispensary
  getTimeSlotConfigsByDoctor: async (doctorId: string, dispensaryId: string): Promise<TimeSlotConfig[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockTimeSlotConfigs.filter(
      slot => slot.doctorId === doctorId && slot.dispensaryId === dispensaryId
    );
  },

  // Get all time slots for a dispensary
  getTimeSlotConfigsByDispensary: async (dispensaryId: string): Promise<TimeSlotConfig[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockTimeSlotConfigs.filter(slot => slot.dispensaryId === dispensaryId);
  },

  // Add a new time slot configuration
  addTimeSlotConfig: async (timeSlotConfig: Omit<TimeSlotConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<TimeSlotConfig> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newTimeSlotConfig: TimeSlotConfig = {
      ...timeSlotConfig,
      id: Math.random().toString(36).substring(2, 11),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return newTimeSlotConfig;
  },

  // Update a time slot configuration
  updateTimeSlotConfig: async (id: string, config: Partial<TimeSlotConfig>): Promise<TimeSlotConfig | null> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const existingConfigIndex = mockTimeSlotConfigs.findIndex(c => c.id === id);
    
    if (existingConfigIndex === -1) {
      return null;
    }

    const updatedConfig = {
      ...mockTimeSlotConfigs[existingConfigIndex],
      ...config,
      updatedAt: new Date()
    };
    
    return updatedConfig;
  },

  // Delete a time slot configuration
  deleteTimeSlotConfig: async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return true;
  },

  // Get absent time slots for a doctor at a specific dispensary
  getAbsentTimeSlots: async (doctorId: string, dispensaryId: string, startDate: Date, endDate: Date): Promise<AbsentTimeSlot[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockAbsentTimeSlots.filter(
      slot => 
        slot.doctorId === doctorId && 
        slot.dispensaryId === dispensaryId &&
        slot.date >= startDate &&
        slot.date <= endDate
    );
  },

  // Add an absent time slot
  addAbsentTimeSlot: async (absentSlot: Omit<AbsentTimeSlot, 'id' | 'createdAt' | 'updatedAt'>): Promise<AbsentTimeSlot> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newAbsentSlot: AbsentTimeSlot = {
      ...absentSlot,
      id: Math.random().toString(36).substring(2, 11),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return newAbsentSlot;
  },

  // Delete an absent time slot
  deleteAbsentTimeSlot: async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return true;
  }
};
