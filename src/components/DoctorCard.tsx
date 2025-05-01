
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Doctor } from '@/api/models';

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard = ({ doctor }: DoctorCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-[4/3] relative">
        <img 
          src={doctor.profilePicture || 'https://randomuser.me/api/portraits/lego/0.jpg'} 
          alt={doctor.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex flex-col space-y-1">
          <h3 className="font-bold text-lg">{doctor.name}</h3>
          <Badge variant="outline" className="text-xs self-start">
            {doctor.specialization}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="text-sm text-gray-500 mb-2">
            Qualifications:
          </div>
          <div className="flex flex-wrap gap-1">
            {doctor.qualifications.map((qualification, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {qualification}
              </Badge>
            ))}
          </div>
        </div>
        <Button asChild className="w-full bg-medical-600 hover:bg-medical-700">
          <Link to={`/booking?doctorId=${doctor.id}`}>
            Book Appointment
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default DoctorCard;
