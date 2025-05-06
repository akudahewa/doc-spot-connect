
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DoctorService, DispensaryService, BookingService } from '@/api/services';
import { Doctor, Dispensary } from '@/api/models';
import { AvailableTimeSlot } from '@/api/services/TimeSlotService';
import BookingStep1 from './BookingStep1';
import BookingStep2 from './BookingStep2';
import { format } from 'date-fns';

interface BookingFormProps {
  initialDoctorId?: string;
  initialDispensaryId?: string;
}

const BookingForm = ({ initialDoctorId, initialDispensaryId }: BookingFormProps) => {
  const { toast } = useToast();
  
  // Form state
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [dispensaries, setDispensaries] = useState<Dispensary[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedDispensary, setSelectedDispensary] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [nextAppointment, setNextAppointment] = useState<AvailableTimeSlot | null>(null);
  
  // Patient info
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [symptoms, setSymptoms] = useState('');
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [dateError, setDateError] = useState<string | null>(null);
  
  // Load initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all doctors
        const allDoctors = await DoctorService.getAllDoctors();
        setDoctors(allDoctors);
        
        // Fetch all dispensaries
        const allDispensaries = await DispensaryService.getAllDispensaries();
        setDispensaries(allDispensaries);
        
        // Set initial selections if provided
        if (initialDoctorId) {
          setSelectedDoctor(initialDoctorId);
        }
        
        if (initialDispensaryId) {
          setSelectedDispensary(initialDispensaryId);
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load doctors and dispensaries',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInitialData();
  }, [initialDoctorId, initialDispensaryId, toast]);
  
  // Filter dispensaries when doctor changes
  useEffect(() => {
    const fetchDoctorDispensaries = async () => {
      if (!selectedDoctor) return;
      
      try {
        setIsLoading(true);
        const doctorDispensaries = await DispensaryService.getDispensariesByDoctorId(selectedDoctor);
        setDispensaries(doctorDispensaries);
        
        // If the currently selected dispensary is not in the list, reset it
        if (selectedDispensary && !doctorDispensaries.some(d => d.id === selectedDispensary)) {
          setSelectedDispensary('');
        }
      } catch (error) {
        console.error('Error loading doctor dispensaries:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDoctorDispensaries();
  }, [selectedDoctor, selectedDispensary]);
  
  // Filter doctors when dispensary changes
  useEffect(() => {
    const fetchDispensaryDoctors = async () => {
      if (!selectedDispensary) return;
      
      try {
        setIsLoading(true);
        const dispensaryDoctors = await DoctorService.getDoctorsByDispensaryId(selectedDispensary);
        setDoctors(dispensaryDoctors);
        
        // If the currently selected doctor is not in the list, reset it
        if (selectedDoctor && !dispensaryDoctors.some(d => d.id === selectedDoctor)) {
          setSelectedDoctor('');
        }
      } catch (error) {
        console.error('Error loading dispensary doctors:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDispensaryDoctors();
  }, [selectedDispensary, selectedDoctor]);
  
  // Load next available appointment when doctor, dispensary, and date are selected
  useEffect(() => {
    const fetchNextAppointment = async () => {
      if (!selectedDoctor || !selectedDispensary || !selectedDate) return;
      
      try {
        setIsLoading(true);
        setDateError(null);
        
        const nextAvailable = await BookingService.getNextAvailableAppointment(
          selectedDoctor,
          selectedDispensary,
          selectedDate
        );
        
        if (nextAvailable) {
          setNextAppointment(nextAvailable);
        } else {
          setNextAppointment(null);
          setDateError('No appointments available for this date. Please select another date.');
        }
      } catch (error) {
        console.error('Error loading next available appointment:', error);
        setNextAppointment(null);
        setDateError('Failed to load appointment information. The doctor may not be available on this date.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNextAppointment();
  }, [selectedDoctor, selectedDispensary, selectedDate]);
  
  const handleBooking = async () => {
    if (!selectedDoctor || !selectedDispensary || !selectedDate || !name || !phone || !nextAppointment) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Create booking
      await BookingService.createBooking({
        patientName: name,
        patientPhone: phone,
        patientEmail: email || undefined,
        symptoms: symptoms || undefined,
        doctorId: selectedDoctor,
        dispensaryId: selectedDispensary,
        bookingDate: selectedDate,
      });
      
      toast({
        title: 'Booking Confirmed!',
        description: `Your appointment #${nextAppointment.appointmentNumber} has been booked for ${format(selectedDate, 'PPP')} at ${nextAppointment.estimatedTime}`,
      });
      
      // Reset the form
      setNextAppointment(null);
      setName('');
      setPhone('');
      setEmail('');
      setSymptoms('');
      setCurrentStep(0);
      
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: 'Booking Failed',
        description: 'There was an error creating your booking. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="pt-6">
        <Tabs defaultValue="appointment" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="appointment">Book Appointment</TabsTrigger>
            <TabsTrigger value="check" disabled>Check Booking Status</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appointment">
            <div className="space-y-6">
              {currentStep === 0 ? (
                <BookingStep1
                  doctors={doctors}
                  dispensaries={dispensaries}
                  selectedDoctor={selectedDoctor}
                  selectedDispensary={selectedDispensary}
                  selectedDate={selectedDate}
                  setSelectedDoctor={setSelectedDoctor}
                  setSelectedDispensary={setSelectedDispensary}
                  setSelectedDate={setSelectedDate}
                  nextAppointment={nextAppointment}
                  dateError={dateError}
                  isLoading={isLoading}
                  onContinue={() => setCurrentStep(1)}
                />
              ) : (
                <BookingStep2
                  nextAppointment={nextAppointment}
                  selectedDate={selectedDate}
                  name={name}
                  phone={phone}
                  email={email}
                  symptoms={symptoms}
                  setName={setName}
                  setPhone={setPhone}
                  setEmail={setEmail}
                  setSymptoms={setSymptoms}
                  isLoading={isLoading}
                  onBack={() => setCurrentStep(0)}
                  onConfirm={handleBooking}
                />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
