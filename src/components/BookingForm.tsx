
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
  const [availableSlots, setAvailableSlots] = useState<AvailableTimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [selectedAppointmentNumber, setSelectedAppointmentNumber] = useState<number | null>(null);
  const [selectedEstimatedTime, setSelectedEstimatedTime] = useState<string | null>(null);
  
  // Patient info
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [symptoms, setSymptoms] = useState('');
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
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
  
  // Load available slots when doctor, dispensary, and date are selected
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!selectedDoctor || !selectedDispensary || !selectedDate) return;
      
      try {
        setIsLoading(true);
        const slots = await BookingService.getAvailableTimeSlots(
          selectedDoctor,
          selectedDispensary,
          selectedDate
        );
        setAvailableSlots(slots);
        setSelectedSlot('');
        setSelectedAppointmentNumber(null);
        setSelectedEstimatedTime(null);
      } catch (error) {
        console.error('Error loading available slots:', error);
        toast({
          title: 'Error',
          description: 'Failed to load available time slots',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAvailableSlots();
  }, [selectedDoctor, selectedDispensary, selectedDate, toast]);
  
  const handleBooking = async () => {
    if (!selectedDoctor || !selectedDispensary || !selectedDate || !selectedSlot || !name || !phone || !selectedAppointmentNumber) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // In a real system, you would check if the patient already exists
      // and either use their ID or create a new patient
      
      // For this demo, assume we create a booking directly
      await BookingService.createBooking({
        patientId: `temp-${phone}`, // In a real system, this would be a real patient ID
        doctorId: selectedDoctor,
        dispensaryId: selectedDispensary,
        bookingDate: selectedDate,
        timeSlot: selectedSlot,
        appointmentNumber: selectedAppointmentNumber,
        estimatedTime: selectedEstimatedTime || '',
        status: BookingStatus.SCHEDULED,
        symptoms: symptoms,
      });
      
      toast({
        title: 'Booking Confirmed!',
        description: `Your appointment #${selectedAppointmentNumber} has been booked for ${format(selectedDate, 'PPP')} at approximately ${selectedEstimatedTime}`,
      });
      
      // Reset the form
      setSelectedSlot('');
      setSelectedAppointmentNumber(null);
      setSelectedEstimatedTime(null);
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
  
  const handleSlotSelection = (slot: AvailableTimeSlot) => {
    setSelectedSlot(slot.timeSlot);
    setSelectedAppointmentNumber(slot.appointmentNumber);
    setSelectedEstimatedTime(slot.estimatedTime);
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
                <Label>Select Appointment Time</Label>
                
                {isLoading ? (
                  <div className="text-center py-8">Loading available appointments...</div>
                ) : availableSlots.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No available appointments for the selected date
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {availableSlots.map((slot) => (
                      <Card 
                        key={slot.appointmentNumber}
                        className={`cursor-pointer transition-all ${
                          selectedSlot === slot.timeSlot
                            ? 'ring-2 ring-primary border-primary'
                            : 'hover:border-gray-300'
                        }`}
                        onClick={() => handleSlotSelection(slot)}
                      >
                        <CardContent className="p-4 flex flex-col">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center text-gray-600">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{slot.estimatedTime}</span>
                            </div>
                            <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded">
                              {slot.minutesPerPatient} mins
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              <span className="font-medium">Appointment #{slot.appointmentNumber}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <Button
                onClick={() => setCurrentStep(1)}
                disabled={!selectedDoctor || !selectedDispensary || !selectedDate || !selectedSlot}
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
            {selectedAppointmentNumber && selectedEstimatedTime && (
              <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-200">
                <h3 className="font-medium text-gray-700 mb-2">Appointment Summary</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Date</p>
                    <p className="font-medium">{format(selectedDate!, 'PPP')}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Estimated Time</p>
                    <p className="font-medium">{selectedEstimatedTime}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Appointment</p>
                    <p className="font-medium">#{selectedAppointmentNumber}</p>
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
