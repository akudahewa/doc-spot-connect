
import { Report, ReportType } from '../models';

// Mock report data
const mockReports: Report[] = [
  {
    id: '1',
    type: ReportType.DAILY_BOOKINGS,
    title: 'Daily Bookings Summary',
    parameters: { date: '2023-08-10' },
    generatedBy: '1', // Super Admin
    startDate: new Date('2023-08-10'),
    endDate: new Date('2023-08-10'),
    data: {
      totalBookings: 25,
      completedBookings: 18,
      cancelledBookings: 3,
      noShowBookings: 4,
      bookingsByDoctor: [
        { doctorId: '1', doctorName: 'Dr. Smith', bookings: 10 },
        { doctorId: '2', doctorName: 'Dr. Johnson', bookings: 15 },
      ]
    },
    createdAt: new Date('2023-08-11'),
    updatedAt: new Date('2023-08-11')
  },
  {
    id: '2',
    type: ReportType.MONTHLY_SUMMARY,
    title: 'Monthly Performance Report',
    parameters: { month: '07', year: '2023' },
    generatedBy: '1', // Super Admin
    dispensaryId: '1', // City Health Clinic
    startDate: new Date('2023-07-01'),
    endDate: new Date('2023-07-31'),
    data: {
      totalBookings: 320,
      completedBookings: 280,
      cancelledBookings: 25,
      noShowBookings: 15,
      revenue: 32000,
      popularDoctors: [
        { doctorId: '1', doctorName: 'Dr. Smith', bookings: 120 },
        { doctorId: '3', doctorName: 'Dr. Williams', bookings: 100 }
      ],
      bookingsByDay: [
        { day: '2023-07-01', count: 12 },
        { day: '2023-07-02', count: 8 },
        // More days would be here...
      ]
    },
    createdAt: new Date('2023-08-02'),
    updatedAt: new Date('2023-08-02')
  },
];

export const ReportService = {
  // Get all reports
  getAllReports: async (): Promise<Report[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockReports;
  },
  
  // Get reports by dispensary
  getReportsByDispensary: async (dispensaryId: string): Promise<Report[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Filter reports by dispensary
    return mockReports.filter(report => 
      !report.dispensaryId || report.dispensaryId === dispensaryId
    );
  },
  
  // Generate a new report
  generateReport: async (
    type: ReportType,
    title: string,
    parameters: Record<string, any>,
    generatedBy: string,
    dispensaryId?: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<Report> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real implementation, this would process data from the database
    const now = new Date();
    const reportStartDate = startDate || now;
    const reportEndDate = endDate || now;
    
    // Generate mock report data based on type
    let reportData: Record<string, any> = {};
    
    switch (type) {
      case ReportType.DAILY_BOOKINGS:
        reportData = {
          totalBookings: Math.floor(Math.random() * 50) + 10,
          completedBookings: Math.floor(Math.random() * 40) + 5,
          cancelledBookings: Math.floor(Math.random() * 10),
          noShowBookings: Math.floor(Math.random() * 5),
          bookingsByDoctor: [
            { doctorId: '1', doctorName: 'Dr. Smith', bookings: Math.floor(Math.random() * 20) + 5 },
            { doctorId: '2', doctorName: 'Dr. Johnson', bookings: Math.floor(Math.random() * 15) + 5 },
          ]
        };
        break;
        
      case ReportType.MONTHLY_SUMMARY:
        reportData = {
          totalBookings: Math.floor(Math.random() * 500) + 100,
          completedBookings: Math.floor(Math.random() * 400) + 50,
          cancelledBookings: Math.floor(Math.random() * 50),
          noShowBookings: Math.floor(Math.random() * 30),
          revenue: Math.floor(Math.random() * 50000) + 10000,
          popularDoctors: [
            { doctorId: '1', doctorName: 'Dr. Smith', bookings: Math.floor(Math.random() * 150) + 50 },
            { doctorId: '3', doctorName: 'Dr. Williams', bookings: Math.floor(Math.random() * 100) + 50 }
          ]
        };
        break;
        
      case ReportType.DOCTOR_PERFORMANCE:
        reportData = {
          doctors: [
            {
              doctorId: '1',
              doctorName: 'Dr. Smith',
              totalPatients: Math.floor(Math.random() * 300) + 100,
              avgRating: (Math.random() * 2) + 3,
              completionRate: Math.floor(Math.random() * 30) + 70
            },
            {
              doctorId: '2',
              doctorName: 'Dr. Johnson',
              totalPatients: Math.floor(Math.random() * 300) + 100,
              avgRating: (Math.random() * 2) + 3,
              completionRate: Math.floor(Math.random() * 30) + 70
            }
          ]
        };
        break;
        
      case ReportType.DISPENSARY_REVENUE:
        reportData = {
          totalRevenue: Math.floor(Math.random() * 100000) + 50000,
          revenueByService: [
            { service: 'Consultation', revenue: Math.floor(Math.random() * 50000) + 20000 },
            { service: 'Treatment', revenue: Math.floor(Math.random() * 30000) + 15000 },
            { service: 'Medication', revenue: Math.floor(Math.random() * 20000) + 10000 }
          ],
          revenueByDoctor: [
            { doctorId: '1', doctorName: 'Dr. Smith', revenue: Math.floor(Math.random() * 25000) + 10000 },
            { doctorId: '2', doctorName: 'Dr. Johnson', revenue: Math.floor(Math.random() * 20000) + 8000 }
          ],
          revenueByMonth: [
            { month: 'January', revenue: Math.floor(Math.random() * 15000) + 8000 },
            { month: 'February', revenue: Math.floor(Math.random() * 15000) + 8000 }
          ]
        };
        break;
        
      default:
        reportData = { message: 'No data available for this report type' };
    }
    
    // Create new report
    const newReport: Report = {
      id: Math.random().toString(36).substring(2, 11),
      type,
      title,
      parameters,
      generatedBy,
      dispensaryId,
      startDate: reportStartDate,
      endDate: reportEndDate,
      data: reportData,
      createdAt: now,
      updatedAt: now
    };
    
    // In a real implementation, this would save the report to the database
    mockReports.push(newReport);
    
    return newReport;
  }
};
