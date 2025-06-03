
import React, { useState, useEffect } from 'react';
import { ReportService, type DailyBookingSummary } from '@/api/services/ReportService';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';

const DailyBookings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<DailyBookingSummary | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    fetchReport();
  }, [selectedDate]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ReportService.getDailyBookings(selectedDate);
      setReport(data);
    } catch (err) {
      setError('Failed to load daily bookings report');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Daily Bookings Report</h1>

      <div className="mb-6">
        <Label>Select Date</Label>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date: Date | undefined) => {
            if (date) {
              setSelectedDate(date);
            }
          }}
          className="rounded-md border"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{report?.total || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{report?.completed || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Cancelled</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{report?.cancelled || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">No Shows</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">{report?.noShow || 0}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 p-2 text-left">Time Slot</th>
                  <th className="border border-gray-300 p-2 text-left">Patient Name</th>
                  <th className="border border-gray-300 p-2 text-left">Phone</th>
                  <th className="border border-gray-300 p-2 text-left">Doctor</th>
                  <th className="border border-gray-300 p-2 text-left">Dispensary</th>
                  <th className="border border-gray-300 p-2 text-left">Status</th>
                  <th className="border border-gray-300 p-2 text-left">Checked In</th>
                  <th className="border border-gray-300 p-2 text-left">Completed</th>
                </tr>
              </thead>
              <tbody>
                {report?.bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="border border-gray-300 p-2">{booking.timeSlot}</td>
                    <td className="border border-gray-300 p-2">{booking.patientName}</td>
                    <td className="border border-gray-300 p-2">{booking.patientPhone}</td>
                    <td className="border border-gray-300 p-2">{booking.doctor.name}</td>
                    <td className="border border-gray-300 p-2">{booking.dispensary.name}</td>
                    <td className="border border-gray-300 p-2">{booking.status}</td>
                    <td className="border border-gray-300 p-2">
                      {booking.checkedInTime
                        ? format(new Date(booking.checkedInTime), 'HH:mm')
                        : '-'}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {booking.completedTime
                        ? format(new Date(booking.completedTime), 'HH:mm')
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyBookings;
