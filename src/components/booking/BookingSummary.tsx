import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookingService, BookingSummary } from '@/api/services/BookingService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

const BookingSummary = () => {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [summary, setSummary] = useState<BookingSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!transactionId) return;
      
      try {
        setIsLoading(true);
        const data = await BookingService.getBookingSummary(transactionId);
        setSummary(data);
      } catch (error) {
        console.error('Error fetching booking summary:', error);
        toast({
          title: 'Error',
          description: 'Failed to load booking summary',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, [transactionId, toast]);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!summary) {
    return <div className="flex justify-center items-center min-h-screen">Booking not found</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Booking Confirmation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center text-sm text-muted-foreground">
            Transaction ID: {summary.transactionId}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Appointment Details</h3>
              <p>Date: {format(summary.bookingDate, 'PPP')}</p>
              <p>Time: {summary.timeSlot}</p>
              <p>Appointment #: {summary.appointmentNumber}</p>
              <p>Estimated Time: {summary.estimatedTime}</p>
              <p>Status: {summary.status}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Patient Information</h3>
              <p>Name: {summary.patient.name}</p>
              <p>Phone: {summary.patient.phone}</p>
              {summary.patient.email && <p>Email: {summary.patient.email}</p>}
            </div>

            <div>
              <h3 className="font-semibold mb-2">Doctor Information</h3>
              <p>Name: {summary.doctor.name}</p>
              <p>Specialization: {summary.doctor.specialization}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Dispensary Information</h3>
              <p>Name: {summary.dispensary.name}</p>
              <p>Address: {summary.dispensary.address}</p>
            </div>
          </div>

          {summary.symptoms && (
            <div>
              <h3 className="font-semibold mb-2">Symptoms</h3>
              <p>{summary.symptoms}</p>
            </div>
          )}

          <div className="flex justify-center space-x-4">
            <Button onClick={() => navigate('/')}>
              Back to Home
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              Print Summary
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingSummary;
