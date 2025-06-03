
import React, { useState, useEffect } from 'react';
import { ReportService, type DoctorPerformance as DoctorPerformanceType } from '@/api/services/ReportService';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';

const DoctorPerformance: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<DoctorPerformanceType | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  useEffect(() => {
    if (selectedDoctor) {
      fetchReport();
    }
  }, [selectedDoctor, startDate, endDate]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ReportService.getDoctorPerformance(
        selectedDoctor,
        startDate,
        endDate
      );
      setReport(data);
    } catch (err) {
      setError('Failed to load doctor performance report');
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
      <h1 className="text-3xl font-bold mb-6">Doctor Performance Report</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <Label htmlFor="doctor">Doctor</Label>
          <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
            <SelectTrigger>
              <SelectValue placeholder="Select Doctor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="doctor1">Dr. John Doe</SelectItem>
              <SelectItem value="doctor2">Dr. Jane Smith</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Start Date</Label>
          <Calendar
            mode="single"
            selected={startDate}
            onSelect={(date) => date && setStartDate(date)}
            className="rounded-md border"
          />
        </div>
        
        <div>
          <Label>End Date</Label>
          <Calendar
            mode="single"
            selected={endDate}
            onSelect={(date) => date && setEndDate(date)}
            className="rounded-md border"
          />
        </div>
      </div>

      {report && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Total Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{report.totalBookings || 0}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  {report.completionRate?.toFixed(1) || 0}%
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Cancellation Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-600">
                  {report.cancellationRate?.toFixed(1) || 0}%
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Avg. Consultation Time</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600">
                  {report.averageConsultationTime?.toFixed(0) || 0} min
                </p>
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
                      <th className="border border-gray-300 p-2">Date</th>
                      <th className="border border-gray-300 p-2">Time Slot</th>
                      <th className="border border-gray-300 p-2">Status</th>
                      <th className="border border-gray-300 p-2">Dispensary</th>
                      <th className="border border-gray-300 p-2">Checked In</th>
                      <th className="border border-gray-300 p-2">Completed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.bookings?.map((booking) => (
                      <tr key={booking.id}>
                        <td className="border border-gray-300 p-2">
                          {format(new Date(booking.date), 'MMM d, yyyy')}
                        </td>
                        <td className="border border-gray-300 p-2">{booking.timeSlot}</td>
                        <td className="border border-gray-300 p-2">{booking.status}</td>
                        <td className="border border-gray-300 p-2">{booking.dispensary.name}</td>
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
        </>
      )}
    </div>
  );
};

export default DoctorPerformance;
