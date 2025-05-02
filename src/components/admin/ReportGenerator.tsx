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
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { ChevronDownIcon } from 'lucide-react';

const ReportGenerator = () => {
  const { toast } = useToast();
  const [reportType, setReportType] = useState<ReportType | ''>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });
  
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
            startDate: dateRange.startDate.toISOString(),
            endDate: dateRange.endDate.toISOString()
          }
        },
        currentUser.id,
        undefined, // dispensaryId (optional)
        dateRange.startDate,
        dateRange.endDate
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
      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="generate">Generate Report</TabsTrigger>
          <TabsTrigger value="history">Report History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generate" className="space-y-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate New Report</CardTitle>
              <CardDescription>
                Select parameters to generate a customized report
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="reportType">Report Type</Label>
                <Select value={reportType} onValueChange={(value) => handleReportTypeChange(value as ReportType)}>
                  <SelectTrigger className="w-full">
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
                <div className="relative">
                  <Button 
                    variant="outline" 
                    className="w-full justify-between"
                    onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                    type="button"
                  >
                    <span>
                      {dateRange.startDate.toLocaleDateString()} - {dateRange.endDate.toLocaleDateString()}
                    </span>
                    <ChevronDownIcon className="ml-2 h-4 w-4" />
                  </Button>
                  
                  {isDatePickerOpen && (
                    <div className="absolute z-10 mt-1 bg-white border rounded-md shadow-lg">
                      <DateRangePicker
                        ranges={[dateRange]}
                        onChange={(ranges) => {
                          const { selection } = ranges;
                          if (selection.startDate && selection.endDate) {
                            setDateRange(selection);
                          }
                        }}
                        moveRangeOnFirstSelection={false}
                      />
                      <div className="p-2 flex justify-end">
                        <Button 
                          size="sm"
                          onClick={() => setIsDatePickerOpen(false)}
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  )}
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
