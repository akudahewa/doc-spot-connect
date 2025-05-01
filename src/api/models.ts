
// API Models for Doctor Reservation System

// Base model for common fields
export interface BaseModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Doctor model
export interface Doctor extends BaseModel {
  name: string;
  specialization: string;
  qualifications: string[];
  contactNumber: string;
  email: string;
  profilePicture?: string;
  dispensaries: string[]; // IDs of associated dispensaries
}

// Dispensary model
export interface Dispensary extends BaseModel {
  name: string;
  address: string;
  contactNumber: string;
  email: string;
  description?: string;
  doctors: string[]; // IDs of associated doctors
  location?: {
    latitude: number;
    longitude: number;
  };
}

// Time slot configuration for doctor at a specific dispensary
export interface TimeSlotConfig extends BaseModel {
  doctorId: string;
  dispensaryId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // Format: "HH:MM" in 24-hour format
  endTime: string; // Format: "HH:MM" in 24-hour format
  maxPatients: number; // Maximum number of patients per slot
}

// Absent time slot (when doctor is unavailable)
export interface AbsentTimeSlot extends BaseModel {
  doctorId: string;
  dispensaryId: string;
  date: Date;
  startTime: string; // Format: "HH:MM" in 24-hour format
  endTime: string; // Format: "HH:MM" in 24-hour format
  reason?: string;
}

// Patient model
export interface Patient extends BaseModel {
  name: string;
  contactNumber: string;
  email?: string;
  dateOfBirth?: Date;
  gender?: 'Male' | 'Female' | 'Other';
  medicalHistory?: string[];
}

// Booking status enum
export enum BookingStatus {
  SCHEDULED = 'scheduled',
  CHECKED_IN = 'checked_in',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show'
}

// Booking model
export interface Booking extends BaseModel {
  patientId: string;
  doctorId: string;
  dispensaryId: string;
  bookingDate: Date;
  timeSlot: string; // Format: "HH:MM-HH:MM"
  status: BookingStatus;
  notes?: string;
  symptoms?: string;
  checkedInTime?: Date;
  completedTime?: Date;
}
