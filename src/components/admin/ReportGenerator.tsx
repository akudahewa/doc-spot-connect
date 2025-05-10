
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ReportService } from '@/api/services/ReportService';
import { ReportType } from '@/api/models';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { format, addDays } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import ReportDetailGenerator from './ReportDetailGenerator';

const ReportGenerator = () => {
  const { toast } = useToast();
  const [reportType, setReportType] = useState<ReportType | ''>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 7));
  
  const handleReportTypeChange = (type: ReportType) => {
    setReportType(type);
  };
  
  const handleGenerateReport = async () => {
    if (!reportType) {
      toast({
        title: "Error",
        description: "Please select a report type.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Get current user from local storage
      const userJson = localStorage.getItem('current_user');
      if (!userJson) {
        throw new Error("User not found");
      }
      const currentUser = JSON.parse(userJson);
      
      // Generate report
      const report = await ReportService.generateReport(
        reportType,
        `${reportType.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}`,
        { 
          reportType, 
          dateRange: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
          }
        },
        currentUser.id,
        undefined, // dispensaryId (optional)
        startDate,
        endDate
      );
      
      toast({
        title: "Success",
        description: "Report generated successfully."
      });
      
      // In a real implementation, you'd likely redirect to a report view page
      console.log("Generated report:", report);
      
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Error",
        description: "Failed to generate report.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const reportTypes = [
    { value: ReportType.DAILY_BOOKINGS, label: 'Daily Bookings' },
    { value: ReportType.MONTHLY_SUMMARY, label: 'Monthly Summary' },
    { value: ReportType.DOCTOR_PERFORMANCE, label: 'Doctor Performance' },
    { value: ReportType.DISPENSARY_REVENUE, label: 'Dispensary Revenue' },
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="summary">Summary Reports</TabsTrigger>
          <TabsTrigger value="session">Session Reports</TabsTrigger>
          <TabsTrigger value="history">Report History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate Summary Report</CardTitle>
              <CardDescription>
                Select parameters to generate a customized report
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="reportType">Report Type</Label>
                <Select value={reportType} onValueChange={(value) => handleReportTypeChange(value as ReportType)}>
                  <SelectTrigger className="w-full" id="reportType">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Date Range</Label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="startDate" className="text-xs mb-1 block">Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left"
                          id="startDate"
                        >
                          {format(startDate, "PPP")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={(date) => date && setStartDate(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="flex-1">
                    <Label htmlFor="endDate" className="text-xs mb-1 block">End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left"
                          id="endDate"
                        >
                          {format(endDate, "PPP")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={(date) => date && setEndDate(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleGenerateReport}
                disabled={!reportType || isGenerating}
                className="w-full"
              >
                {isGenerating ? 'Generating...' : 'Generate Report'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="session" className="mt-4">
          <ReportDetailGenerator />
        </TabsContent>
        
        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Report History</CardTitle>
              <CardDescription>
                View and download previously generated reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-gray-500">
                Report history will appear here after generating reports.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportGenerator;
