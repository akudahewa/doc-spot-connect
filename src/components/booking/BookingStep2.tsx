
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AvailableTimeSlot } from '@/api/services/TimeSlotService';
import { format } from 'date-fns';
import BookingSummary from './BookingSummary';

interface BookingStep2Props {
  nextAppointment: AvailableTimeSlot | null;
  selectedDate: Date | undefined;
  name: string;
  phone: string;
  email: string;
  symptoms: string;
  setName: (name: string) => void;
  setPhone: (phone: string) => void;
  setEmail: (email: string) => void;
  setSymptoms: (symptoms: string) => void;
  isLoading: boolean;
  onBack: () => void;
  onConfirm: () => void;
}

const BookingStep2: React.FC<BookingStep2Props> = ({
  nextAppointment,
  selectedDate,
  name,
  phone,
  email,
  symptoms,
  setName,
  setPhone,
  setEmail,
  setSymptoms,
  isLoading,
  onBack,
  onConfirm
}) => {
  return (
    <>
      {nextAppointment && selectedDate && (
        <BookingSummary
          appointment={nextAppointment}
          date={selectedDate}
        />
      )}
      
      <div className="space-y-6">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            required
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
            required
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="email">Email (Optional)</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="symptoms">Symptoms (Optional)</Label>
          <Input
            id="symptoms"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Briefly describe your symptoms"
            className="mt-1"
          />
        </div>
        
        <div className="pt-4 flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          
          <Button
            onClick={onConfirm}
            disabled={isLoading || !name || !phone}
            className="bg-medical-600 hover:bg-medical-700"
          >
            {isLoading ? 'Processing...' : 'Confirm Booking'}
          </Button>
        </div>
      </div>
    </>
  );
};

export default BookingStep2;
