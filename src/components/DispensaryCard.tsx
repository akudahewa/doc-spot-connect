
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import { Dispensary } from '@/api/models';

interface DispensaryCardProps {
  dispensary: Dispensary;
  doctorCount?: number;
}

const DispensaryCard = ({ dispensary, doctorCount }: DispensaryCardProps) => {
  return (
    <Card>
      <CardHeader>
        <h3 className="font-bold text-lg">{dispensary.name}</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex items-start space-x-2">
            <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
            <span className="text-gray-600">{dispensary.address}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-gray-500" />
            <a href={`tel:${dispensary.contactNumber}`} className="text-medical-600 hover:underline">
              {dispensary.contactNumber}
            </a>
          </div>
          
          {dispensary.email && (
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <a href={`mailto:${dispensary.email}`} className="text-medical-600 hover:underline">
                {dispensary.email}
              </a>
            </div>
          )}
        </div>
        
        {doctorCount !== undefined && (
          <div className="text-sm text-gray-600">
            {doctorCount} {doctorCount === 1 ? 'doctor' : 'doctors'} available
          </div>
        )}
        
        <Button asChild className="w-full bg-medical-600 hover:bg-medical-700">
          <Link to={`/booking?dispensaryId=${dispensary.id}`}>
            View Available Doctors
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default DispensaryCard;
