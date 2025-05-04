
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Doctor, Dispensary } from '@/api/models';
import { DoctorService, DispensaryService } from '@/api/services';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Edit, Trash2, MapPin } from 'lucide-react';

const ViewDoctor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [dispensaries, setDispensaries] = useState<Dispensary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchDoctorData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const doctorData = await DoctorService.getDoctorById(id);
        setDoctor(doctorData);
        
        if (doctorData && doctorData.dispensaries?.length > 0) {
          // Fetch associated dispensaries
          const dispensariesData = await DispensaryService.getDispensariesByDoctorId(id);
          setDispensaries(dispensariesData);
        }
      } catch (error) {
        console.error('Error fetching doctor data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load doctor information',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDoctorData();
  }, [id, toast]);
  
  const handleDelete = async () => {
    if (!id) return;
    
    if (!window.confirm('Are you sure you want to delete this doctor?')) return;
    
    try {
      await DoctorService.deleteDoctor(id);
      toast({
        title: 'Success',
        description: 'Doctor deleted successfully'
      });
      navigate('/admin/doctors');
    } catch (error) {
      console.error('Error deleting doctor:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete doctor',
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
            <p>Loading doctor information...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!doctor) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <Card>
            <CardHeader>
              <CardTitle>Doctor Not Found</CardTitle>
              <CardDescription>
                The doctor you are looking for doesn't exist or has been removed
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => navigate('/admin/doctors')}>
                Back to Doctors
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
          <h1 className="text-3xl font-bold">Doctor Details</h1>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/admin/doctors/edit/${id}`)}
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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <div className="aspect-[4/3] relative">
                <img
                  src={doctor.profilePicture || 'https://randomuser.me/api/portraits/lego/0.jpg'}
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>{doctor.name}</CardTitle>
                <CardDescription>
                  <Badge className="mr-2">{doctor.specialization}</Badge>
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Professional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Qualifications</h3>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {doctor.qualifications.map((qualification, index) => (
                      <Badge key={index} variant="secondary">
                        {qualification}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
                  <div className="mt-1">
                    <p>
                      <span className="font-medium">Email:</span>{' '}
                      <a href={`mailto:${doctor.email}`} className="text-medical-600 hover:underline">
                        {doctor.email}
                      </a>
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{' '}
                      <a href={`tel:${doctor.contactNumber}`} className="text-medical-600 hover:underline">
                        {doctor.contactNumber}
                      </a>
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Associated Dispensaries</h3>
                  <div className="mt-1">
                    {dispensaries.length === 0 ? (
                      <p className="text-gray-400">No associated dispensaries</p>
                    ) : (
                      <div className="space-y-2 mt-2">
                        {dispensaries.map(dispensary => (
                          <div 
                            key={dispensary.id}
                            className="p-3 bg-gray-50 rounded-md"
                          >
                            <h4 className="font-medium">{dispensary.name}</h4>
                            <div className="flex items-start mt-1 text-sm text-gray-500">
                              <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                              <span>{dispensary.address}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => navigate('/admin/doctors')}
                  className="w-full"
                >
                  Back to Doctors List
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

export default ViewDoctor;
