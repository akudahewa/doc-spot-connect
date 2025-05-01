
import { Link } from 'react-router-dom';
import { Calendar, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-medical-600" />
              <span className="font-bold text-xl text-gray-800">DocSpot Connect</span>
            </div>
            <p className="text-gray-600">
              Streamlining doctor appointments for small dispensaries.
              Skip the queue, book online.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-600 hover:text-medical-600">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/booking" className="text-gray-600 hover:text-medical-600">
                  Book an Appointment
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="text-gray-600 hover:text-medical-600">
                  Our Doctors
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-medical-600">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-medical-600" />
                <a href="mailto:info@docspot-connect.com" className="text-gray-600 hover:text-medical-600">
                  info@docspot-connect.com
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-medical-600" />
                <a href="tel:+1-555-123-4567" className="text-gray-600 hover:text-medical-600">
                  +1-555-123-4567
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} DocSpot Connect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
