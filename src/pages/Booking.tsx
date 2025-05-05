
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookingForm from '@/components/BookingForm';
import { useSearchParams } from 'react-router-dom';

const Booking = () => {
  const [searchParams] = useSearchParams();
  const doctorId = searchParams.get('doctorId') || undefined;
  const dispensaryId = searchParams.get('dispensaryId') || undefined;
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Book Your Appointment</h1>
            <p className="text-gray-600 mt-2">
              Select your preferred doctor, location, date, and appointment time
            </p>
          </div>
          
          <BookingForm
            initialDoctorId={doctorId}
            initialDispensaryId={dispensaryId}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Booking;
