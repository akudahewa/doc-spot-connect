
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Dispensary, Doctor } from '@/api/models';
import { DispensaryService, DoctorService } from '@/api/services';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Edit, Trash2, Mail, Phone, MapPin, User } from 'lucide-react';

const ViewDispensary = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dispensary, setDispensary] = useState<Dispensary | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchDispensaryData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const dispensaryData = await DispensaryService.getDispensaryById(id);
        setDispensary(dispensaryData);
        
        if (dispensaryData && dispensaryData.doctors?.length > 0) {
          // Fetch associated doctors
          const doctorsData = await DoctorService.getDoctorsByDispensaryId(id);
          setDoctors(doctorsData);
        }
      } catch (error) {
        console.error('Error fetching dispensary data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dispensary information',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDispensaryData();
  }, [id, toast]);
  
  const handleDelete = async () => {
    if (!id) return;
    
    if (!window.confirm('Are you sure you want to delete this dispensary?')) return;
    
    try {
      await DispensaryService.deleteDispensary(id);
      toast({
        title: 'Success',
        description: 'Dispensary deleted successfully'
      });
      navigate('/admin/dispensaries');
    } catch (error) {
      console.error('Error deleting dispensary:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete dispensary',
        variant: 'destructive'
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="flex justify-center items-center h-full">
            <p>Loading dispensary information...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!dispensary) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <Card>
            <CardHeader>
              <CardTitle>Dispensary Not Found</CardTitle>
              <CardDescription>
                The dispensary you are looking for doesn't exist or has been removed
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => navigate('/admin/dispensaries')}>
                Back to Dispensaries
              </Button>
            </CardFooter>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dispensary Details</h1>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/admin/dispensaries/edit/${id}`)}
            >
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
            <Button 
              variant="outline" 
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{dispensary.name}</CardTitle>
                <CardDescription>
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{dispensary.address}</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {dispensary.description && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Description</h3>
                    <p className="mt-1">{dispensary.description}</p>
                  </div>
                )}
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      <a href={`mailto:${dispensary.email}`} className="text-medical-600 hover:underline">
                        {dispensary.email}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      <a href={`tel:${dispensary.contactNumber}`} className="text-medical-600 hover:underline">
                        {dispensary.contactNumber}
                      </a>
                    </div>
                  </div>
                </div>
                
                {dispensary.location && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Location Coordinates</h3>
                      <div className="mt-1">
                        <p>Latitude: {dispensary.location.latitude}</p>
                        <p>Longitude: {dispensary.location.longitude}</p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Associated Doctors</CardTitle>
                <CardDescription>
                  {doctors.length} doctors working at this dispensary
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {doctors.length === 0 ? (
                  <p className="text-gray-400">No doctors associated with this dispensary</p>
                ) : (
                  doctors.map(doctor => (
                    <div 
                      key={doctor.id}
                      className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer"
                      onClick={() => navigate(`/admin/doctors/view/${doctor.id}`)}
                    >
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-medical-100 rounded-full flex items-center justify-center mr-3">
                          <User className="h-4 w-4 text-medical-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{doctor.name}</h4>
                          <p className="text-xs text-gray-500">{doctor.specialization}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => navigate('/admin/dispensaries')}
                  className="w-full"
                >
                  Back to Dispensaries List
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ViewDispensary;
