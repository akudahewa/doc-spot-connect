
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ReportType } from '@/api/models';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock report data generator
const generateMockReportData = (reportType: ReportType) => {
  switch (reportType) {
    case ReportType.DAILY_BOOKINGS:
      return {
        date: new Date().toISOString().split('T')[0],
        totalBookings: Math.floor(Math.random() * 40) + 10,
        checkedIn: Math.floor(Math.random() * 20) + 5,
        completed: Math.floor(Math.random() * 15) + 5,
        cancelled: Math.floor(Math.random() * 5),
        noShow: Math.floor(Math.random() * 3),
        byHour: [
          { hour: '9:00', count: Math.floor(Math.random() * 5) + 1 },
          { hour: '10:00', count: Math.floor(Math.random() * 5) + 2 },
          { hour: '11:00', count: Math.floor(Math.random() * 5) + 3 },
          { hour: '12:00', count: Math.floor(Math.random() * 5) + 2 },
          { hour: '13:00', count: Math.floor(Math.random() * 5) + 1 },
          { hour: '14:00', count: Math.floor(Math.random() * 5) + 3 },
          { hour: '15:00', count: Math.floor(Math.random() * 5) + 2 },
          { hour: '16:00', count: Math.floor(Math.random() * 5) + 1 },
        ]
      };
    
    case ReportType.MONTHLY_SUMMARY:
      return {
        month: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        totalBookings: Math.floor(Math.random() * 500) + 100,
        totalPatients: Math.floor(Math.random() * 300) + 50,
        avgBookingsPerDay: Math.floor(Math.random() * 20) + 10,
        cancellationRate: (Math.random() * 10).toFixed(1) + '%',
        topDoctors: [
          { name: 'Dr. Sarah Wilson', bookings: Math.floor(Math.random() * 100) + 50 },
          { name: 'Dr. Michael Chen', bookings: Math.floor(Math.random() * 100) + 40 },
          { name: 'Dr. Emily Johnson', bookings: Math.floor(Math.random() * 100) + 30 }
        ],
        byWeek: [
          { week: 'Week 1', count: Math.floor(Math.random() * 50) + 20 },
          { week: 'Week 2', count: Math.floor(Math.random() * 50) + 20 },
          { week: 'Week 3', count: Math.floor(Math.random() * 50) + 20 },
          { week: 'Week 4', count: Math.floor(Math.random() * 50) + 20 },
        ]
      };
    
    case ReportType.DOCTOR_PERFORMANCE:
      return {
        period: 'Last 30 days',
        doctors: [
          {
            name: 'Dr. Sarah Wilson',
            totalAppointments: Math.floor(Math.random() * 100) + 50,
            avgPatientsPerDay: (Math.random() * 10 + 5).toFixed(1),
            onTimeRate: (Math.random() * 20 + 80).toFixed(1) + '%',
            patientSatisfaction: (Math.random() * 2 + 3).toFixed(1) + '/5'
          },
          {
            name: 'Dr. Michael Chen',
            totalAppointments: Math.floor(Math.random() * 100) + 40,
            avgPatientsPerDay: (Math.random() * 10 + 4).toFixed(1),
            onTimeRate: (Math.random() * 20 + 80).toFixed(1) + '%',
            patientSatisfaction: (Math.random() * 2 + 3).toFixed(1) + '/5'
          },
          {
            name: 'Dr. Emily Johnson',
            totalAppointments: Math.floor(Math.random() * 100) + 30,
            avgPatientsPerDay: (Math.random() * 10 + 3).toFixed(1),
            onTimeRate: (Math.random() * 20 + 80).toFixed(1) + '%',
            patientSatisfaction: (Math.random() * 2 + 3).toFixed(1) + '/5'
          }
        ]
      };
    
    case ReportType.DISPENSARY_REVENUE:
      return {
        period: 'Last 30 days',
        totalRevenue: '$' + (Math.floor(Math.random() * 10000) + 5000),
        dispensaries: [
          {
            name: 'City Health Clinic',
            revenue: '$' + (Math.floor(Math.random() * 3000) + 2000),
            appointments: Math.floor(Math.random() * 100) + 50,
            avgRevenuePerAppointment: '$' + (Math.floor(Math.random() * 50) + 30)
          },
          {
            name: 'Westside Medical Center',
            revenue: '$' + (Math.floor(Math.random() * 3000) + 1500),
            appointments: Math.floor(Math.random() * 100) + 40,
            avgRevenuePerAppointment: '$' + (Math.floor(Math.random() * 50) + 30)
          },
          {
            name: 'Eastside Family Practice',
            revenue: '$' + (Math.floor(Math.random() * 2000) + 1000),
            appointments: Math.floor(Math.random() * 100) + 30,
            avgRevenuePerAppointment: '$' + (Math.floor(Math.random() * 40) + 30)
          },
          {
            name: 'Northside Wellness Center',
            revenue: '$' + (Math.floor(Math.random() * 1000) + 500),
            appointments: Math.floor(Math.random() * 50) + 20,
            avgRevenuePerAppointment: '$' + (Math.floor(Math.random() * 30) + 30)
          }
        ]
      };
      
    default:
      return {};
  }
};

const ReportGenerator = () => {
  const { toast } = useToast();
  const [selectedReportType, setSelectedReportType] = useState<ReportType>(ReportType.DAILY_BOOKINGS);
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleGenerateReport = () => {
    setIsLoading(true);
    
    // Simulate API call to generate report
    setTimeout(() => {
      const data = generateMockReportData(selectedReportType);
      setReportData(data);
      setIsLoading(false);
      
      toast({
        title: "Report Generated",
        description: `${getReportTypeName(selectedReportType)} has been generated successfully.`
      });
    }, 1500);
  };
  
  const getReportTypeName = (type: ReportType) => {
    switch (type) {
      case ReportType.DAILY_BOOKINGS:
        return 'Daily Bookings Report';
      case ReportType.MONTHLY_SUMMARY:
        return 'Monthly Summary Report';
      case ReportType.DOCTOR_PERFORMANCE:
        return 'Doctor Performance Report';
      case ReportType.DISPENSARY_REVENUE:
        return 'Dispensary Revenue Report';
      default:
        return 'Report';
    }
  };
  
  const renderReportContent = () => {
    if (!reportData) return null;
    
    switch (selectedReportType) {
      case ReportType.DAILY_BOOKINGS:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Daily Bookings - {reportData.date}</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-500">Total Bookings</p>
                <p className="text-2xl font-bold text-blue-700">{reportData.totalBookings}</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-500">Checked In</p>
                <p className="text-2xl font-bold text-green-700">{reportData.checkedIn}</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-purple-700">{reportData.completed}</p>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-500">Cancelled</p>
                <p className="text-2xl font-bold text-amber-700">{reportData.cancelled}</p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-500">No Show</p>
                <p className="text-2xl font-bold text-red-700">{reportData.noShow}</p>
              </div>
            </div>
            
            <div className="mt-8">
              <h4 className="text-lg font-medium mb-4">Bookings by Hour</h4>
              <div className="h-64 bg-gray-50 p-4 rounded-lg">
                <div className="h-full flex items-end">
                  {reportData.byHour.map((item: any, index: number) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="bg-medical-600 w-full max-w-[30px] rounded-t"
                        style={{ height: `${item.count * 10}%` }}
                      ></div>
                      <p className="text-xs mt-2">{item.hour}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      
      case ReportType.MONTHLY_SUMMARY:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Monthly Summary - {reportData.month}</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-500">Total Bookings</p>
                <p className="text-2xl font-bold text-blue-700">{reportData.totalBookings}</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-500">Total Patients</p>
                <p className="text-2xl font-bold text-green-700">{reportData.totalPatients}</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-500">Avg. Bookings/Day</p>
                <p className="text-2xl font-bold text-purple-700">{reportData.avgBookingsPerDay}</p>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-500">Cancellation Rate</p>
                <p className="text-2xl font-bold text-amber-700">{reportData.cancellationRate}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div>
                <h4 className="text-lg font-medium mb-4">Bookings by Week</h4>
                <div className="h-64 bg-gray-50 p-4 rounded-lg">
                  <div className="h-full flex items-end">
                    {reportData.byWeek.map((item: any, index: number) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div 
                          className="bg-medical-600 w-full max-w-[40px] rounded-t"
                          style={{ height: `${(item.count / 50) * 80}%` }}
                        ></div>
                        <p className="text-xs mt-2">{item.week}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-medium mb-4">Top Doctors</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {reportData.topDoctors.map((doctor: any, index: number) => (
                    <div key={index} className="mb-4 last:mb-0">
                      <div className="flex justify-between mb-1">
                        <span>{doctor.name}</span>
                        <span>{doctor.bookings} bookings</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-medical-600 rounded-full"
                          style={{ width: `${(doctor.bookings / 150) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      
      case ReportType.DOCTOR_PERFORMANCE:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Doctor Performance - {reportData.period}</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border rounded-lg">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Doctor</th>
                    <th className="py-3 px-6 text-center">Total Appointments</th>
                    <th className="py-3 px-6 text-center">Avg. Patients/Day</th>
                    <th className="py-3 px-6 text-center">On-Time Rate</th>
                    <th className="py-3 px-6 text-center">Patient Satisfaction</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                  {reportData.doctors.map((doctor: any, index: number) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-6 text-left whitespace-nowrap font-medium">
                        {doctor.name}
                      </td>
                      <td className="py-3 px-6 text-center">
                        {doctor.totalAppointments}
                      </td>
                      <td className="py-3 px-6 text-center">
                        {doctor.avgPatientsPerDay}
                      </td>
                      <td className="py-3 px-6 text-center">
                        {doctor.onTimeRate}
                      </td>
                      <td className="py-3 px-6 text-center">
                        {doctor.patientSatisfaction}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      
      case ReportType.DISPENSARY_REVENUE:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Dispensary Revenue - {reportData.period}</h3>
            
            <div className="bg-blue-50 p-4 rounded-lg text-center mb-8">
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-3xl font-bold text-blue-700">{reportData.totalRevenue}</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border rounded-lg">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Dispensary</th>
                    <th className="py-3 px-6 text-center">Revenue</th>
                    <th className="py-3 px-6 text-center">Appointments</th>
                    <th className="py-3 px-6 text-center">Avg. Revenue/Appointment</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                  {reportData.dispensaries.map((dispensary: any, index: number) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-6 text-left whitespace-nowrap font-medium">
                        {dispensary.name}
                      </td>
                      <td className="py-3 px-6 text-center font-semibold">
                        {dispensary.revenue}
                      </td>
                      <td className="py-3 px-6 text-center">
                        {dispensary.appointments}
                      </td>
                      <td className="py-3 px-6 text-center">
                        {dispensary.avgRevenuePerAppointment}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      
      default:
        return <p>No report data available.</p>;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Reports</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="report-type">Report Type</Label>
          <Select
            value={selectedReportType}
            onValueChange={(value) => setSelectedReportType(value as ReportType)}
          >
            <SelectTrigger id="report-type" className="w-full">
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ReportType.DAILY_BOOKINGS}>
                Daily Bookings Report
              </SelectItem>
              <SelectItem value={ReportType.MONTHLY_SUMMARY}>
                Monthly Summary Report
              </SelectItem>
              <SelectItem value={ReportType.DOCTOR_PERFORMANCE}>
                Doctor Performance Report
              </SelectItem>
              <SelectItem value={ReportType.DISPENSARY_REVENUE}>
                Dispensary Revenue Report
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleGenerateReport} 
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : 'Generate Report'}
          </Button>
        </div>
        
        {reportData && (
          <div className="mt-8 border-t pt-6">
            {renderReportContent()}
            
            <div className="mt-6 text-right">
              <Button variant="outline" className="mr-2">Export PDF</Button>
              <Button variant="outline">Export CSV</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportGenerator;
