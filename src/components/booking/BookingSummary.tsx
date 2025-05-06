
import React from 'react';
import { AvailableTimeSlot } from '@/api/services/TimeSlotService';
import { format } from 'date-fns';

interface BookingSummaryProps {
  appointment: AvailableTimeSlot;
  date: Date;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ appointment, date }) => {
  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-200">
      <h3 className="font-medium text-gray-700 mb-2">Appointment Summary</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Date</p>
          <p className="font-medium">{format(date, 'PPP')}</p>
        </div>
        <div>
          <p className="text-gray-500">Time</p>
          <p className="font-medium">{appointment.estimatedTime}</p>
        </div>
        <div>
          <p className="text-gray-500">Appointment</p>
          <p className="font-medium">#{appointment.appointmentNumber}</p>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
