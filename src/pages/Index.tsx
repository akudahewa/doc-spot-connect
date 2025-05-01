
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroBanner from '@/components/HeroBanner';
import DoctorCard from '@/components/DoctorCard';
import DispensaryCard from '@/components/DispensaryCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Doctor, Dispensary } from '@/api/models';
import { DoctorService, DispensaryService } from '@/api/services';
import { Stethoscope, Calendar, Clock, CheckCircle } from 'lucide-react';

const Index = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [dispensaries, setDispensaries] = useState<Dispensary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch featured doctors and dispensaries
        const allDoctors = await DoctorService.getAllDoctors();
        const allDispensaries = await DispensaryService.getAllDispensaries();
        
        setDoctors(allDoctors);
        setDispensaries(allDispensaries);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <HeroBanner />
        
        {/* Featured Doctors */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Our Doctors</h2>
                <p className="text-gray-600">Meet our team of specialists</p>
              </div>
              <Button asChild variant="outline">
                <Link to="/doctors">View All</Link>
              </Button>
            </div>
            
            {isLoading ? (
              <div className="text-center py-12">Loading doctors...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.slice(0, 3).map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </div>
            )}
          </div>
        </section>
        
        {/* Featured Dispensaries */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Our Dispensaries</h2>
                <p className="text-gray-600">Find a location near you</p>
              </div>
            </div>
            
            {isLoading ? (
              <div className="text-center py-12">Loading dispensaries...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {dispensaries.map((dispensary) => (
                  <DispensaryCard 
                    key={dispensary.id} 
                    dispensary={dispensary} 
                    doctorCount={dispensary.doctors.length}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
        
        {/* How It Works */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">How It Works</h2>
              <p className="text-gray-600 mt-2">Book your appointment in 3 simple steps</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 medical-gradient rounded-lg">
                <div className="bg-medical-100 p-4 rounded-full inline-flex items-center justify-center mb-4">
                  <Stethoscope className="h-8 w-8 text-medical-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">1. Select Doctor & Dispensary</h3>
                <p className="text-gray-600">
                  Choose from our network of qualified doctors and convenient locations.
                </p>
              </div>
              
              <div className="text-center p-6 medical-gradient rounded-lg">
                <div className="bg-medical-100 p-4 rounded-full inline-flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-medical-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">2. Pick a Date & Time</h3>
                <p className="text-gray-600">
                  Browse available slots and select a time that works for you.
                </p>
              </div>
              
              <div className="text-center p-6 medical-gradient rounded-lg">
                <div className="bg-medical-100 p-4 rounded-full inline-flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-medical-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">3. Confirm Your Booking</h3>
                <p className="text-gray-600">
                  Provide your details and receive instant confirmation.
                </p>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <Button asChild size="lg" className="bg-medical-600 hover:bg-medical-700">
                <Link to="/booking">
                  Book Your Appointment Now
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
