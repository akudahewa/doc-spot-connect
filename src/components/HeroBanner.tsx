
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar, Clock, CheckCircle } from 'lucide-react';

const HeroBanner = () => {
  return (
    <div className="relative bg-gradient-to-r from-medical-700 to-medical-900 text-white">
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1584982751601-97dcc096659c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80')",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat"
        }} />
      </div>
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            Book Your Doctor Appointment Online
          </h1>
          
          <p className="text-lg md:text-xl mb-8 text-gray-100">
            Skip the queue and save time with our easy-to-use 
            online booking system for small dispensaries.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-medical-800 hover:bg-gray-100">
              <Link to="/booking">
                Book an Appointment
              </Link>
            </Button>
            
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link to="/doctors">
                View Our Doctors
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="bg-white py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4 py-2">
              <div className="bg-medical-50 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-medical-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Easy Booking</h3>
                <p className="text-sm text-gray-500">Book appointments in minutes</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 py-2">
              <div className="bg-medical-50 p-3 rounded-full">
                <Clock className="h-6 w-6 text-medical-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Save Time</h3>
                <p className="text-sm text-gray-500">Avoid waiting in long queues</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 py-2">
              <div className="bg-medical-50 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-medical-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Reliable Service</h3>
                <p className="text-sm text-gray-500">Track your booking status</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
