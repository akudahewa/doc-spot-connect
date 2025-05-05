
import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { format, addDays } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { DoctorService, DispensaryService, BookingService } from '@/api/services';
import { Doctor, Dispensary, BookingStatus } from '@/api/models';
import { AvailableTimeSlot } from '@/api/services/TimeSlotService';
import { Clock, Calendar as CalendarIcon, User } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(addDays(new Date(), 1));
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
  
  // Render the appropriate step
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <Label htmlFor="doctor">Select Doctor</Label>
                <Select
                  value={selectedDoctor}
                  onValueChange={setSelectedDoctor}
                  disabled={isLoading}
                >
                  <SelectTrigger id="doctor" className="w-full">
                    <SelectValue placeholder="Choose a doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialization}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-4">
                <Label htmlFor="dispensary">Select Dispensary</Label>
                <Select
                  value={selectedDispensary}
                  onValueChange={setSelectedDispensary}
                  disabled={isLoading}
                >
                  <SelectTrigger id="dispensary" className="w-full">
                    <SelectValue placeholder="Choose a dispensary" />
                  </SelectTrigger>
                  <SelectContent>
                    {dispensaries.map((dispensary) => (
                      <SelectItem key={dispensary.id} value={dispensary.id}>
                        {dispensary.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <Label>Select Date</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => {
                  // Disable past dates and dates more than 30 days in the future
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return date < today || date > addDays(today, 30);
                }}
                className="rounded-md border mx-auto"
              />
            </div>
            
            {selectedDoctor && selectedDispensary && selectedDate && (
              <div className="space-y-4 mt-6">
                <Label>Available Appointment</Label>
                
                {isLoading ? (
                  <div className="text-center py-8">Loading appointment information...</div>
                ) : dateError ? (
                  <Alert variant="destructive" className="my-4">
                    <AlertTitle>Not Available</AlertTitle>
                    <AlertDescription>{dateError}</AlertDescription>
                  </Alert>
                ) : nextAppointment ? (
                  <Card className="border-primary">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <User className="h-5 w-5 mr-2 text-primary" />
                          <span className="font-medium">Appointment #{nextAppointment.appointmentNumber}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{nextAppointment.estimatedTime}</span>
                        </div>
                        <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {nextAppointment.minutesPerPatient} mins
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ) : null}
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <Button
                onClick={() => setCurrentStep(1)}
                disabled={!selectedDoctor || !selectedDispensary || !selectedDate || !nextAppointment}
                className="bg-medical-600 hover:bg-medical-700"
              >
                Continue
              </Button>
            </div>
          </>
        );
      
      case 1:
        return (
          <>
            {nextAppointment && (
              <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-200">
                <h3 className="font-medium text-gray-700 mb-2">Appointment Summary</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Date</p>
                    <p className="font-medium">{format(selectedDate!, 'PPP')}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Time</p>
                    <p className="font-medium">{nextAppointment.estimatedTime}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Appointment</p>
                    <p className="font-medium">#{nextAppointment.appointmentNumber}</p>
                  </div>
                </div>
              </div>
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
                <Button variant="outline" onClick={() => setCurrentStep(0)}>
                  Back
                </Button>
                
                <Button
                  onClick={handleBooking}
                  disabled={isLoading || !name || !phone}
                  className="bg-medical-600 hover:bg-medical-700"
                >
                  {isLoading ? 'Processing...' : 'Confirm Booking'}
                </Button>
              </div>
            </div>
          </>
        );
      
      default:
        return null;
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
              {renderStep()}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
