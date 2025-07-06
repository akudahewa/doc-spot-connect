import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DoctorService, DispensaryService } from '@/api/services';
import { Doctor, Dispensary } from '@/api/models';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, User, Building } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AdminTimeSlots = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [dispensaries, setDispensaries] = useState<Dispensary[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedDispensary, setSelectedDispensary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const userStr = localStorage.getItem('current_user');
        const user = userStr ? JSON.parse(userStr) : null;
        if (user?.dispensaryIds && user.dispensaryIds.length > 0) {
          console.log(user.dispensaryIds);
          const [doctorsData, dispensariesData] = await Promise.all([
            DoctorService.getDoctorsByDispensaryIds(user.dispensaryIds),
            DispensaryService.getDispensariesByIds(user.dispensaryIds)
          ]);
          console.log("::::::::: "+JSON.stringify(doctorsData));
          setDoctors(doctorsData);
          setDispensaries(dispensariesData);
        } else {
          const [doctorsData, dispensariesData] = await Promise.all([
            DoctorService.getAllDoctors(),
            DispensaryService.getAllDispensaries()
          ]);
          setDoctors(doctorsData);
          setDispensaries(dispensariesData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load doctors and dispensaries data',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  const handleManageTimeSlots = () => {
    if (!selectedDoctor || !selectedDispensary) {
      toast({
        title: 'Selection Required',
        description: 'Please select both a doctor and a dispensary',
        variant: 'destructive'
      });
      return;
    }

    navigate(`/doctor/${selectedDoctor}/dispensary/${selectedDispensary}/time-slots`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Time Slot Management</h1>
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Doctor and Dispensary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Select Doctor</label>
                <Select 
                  value={selectedDoctor} 
                  onValueChange={setSelectedDoctor}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map(doctor => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          {doctor.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Select Dispensary</label>
                <Select 
                  value={selectedDispensary} 
                  onValueChange={setSelectedDispensary}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a dispensary" />
                  </SelectTrigger>
                  <SelectContent>
                    {dispensaries.map(dispensary => (
                      <SelectItem key={dispensary.id} value={dispensary.id}>
                        <div className="flex items-center">
                          <Building className="mr-2 h-4 w-4" />
                          {dispensary.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button 
              className="w-full" 
              onClick={handleManageTimeSlots}
              disabled={!selectedDoctor || !selectedDispensary || isLoading}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Manage Time Slots
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Regular Time Slots</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Configure weekly recurring time slots for doctors at specific dispensaries</p>
              <ul className="list-disc pl-5 mb-4">
                <li>Set specific days and hours for each doctor</li>
                <li>Define maximum patients per time slot</li>
                <li>Create consistent weekly schedules</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Absent Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Manage exceptions for when doctors cannot attend their regular slots</p>
              <ul className="list-disc pl-5 mb-4">
                <li>Mark full days or specific hours as unavailable</li>
                <li>Record reasons for absences</li>
                <li>Prevent bookings during doctor absences</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminTimeSlots;
