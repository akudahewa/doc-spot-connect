
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock, MapPin } from 'lucide-react';

const Appointments = () => {
  const navigate = useNavigate();

  const appointments = [
    {
      id: 1,
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      date: 'Today',
      time: '2:30 PM',
      location: 'City Medical Center',
      status: 'confirmed'
    },
    {
      id: 2,
      doctor: 'Dr. Michael Chen',
      specialty: 'General Medicine',
      date: 'Tomorrow',
      time: '10:00 AM',
      location: 'Downtown Clinic',
      status: 'pending'
    },
    {
      id: 3,
      doctor: 'Dr. Emily Davis',
      specialty: 'Pediatrics',
      date: 'March 25',
      time: '3:45 PM',
      location: 'Children\'s Hospital',
      status: 'confirmed'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="flex items-center mb-6 pt-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/')}
          className="mr-3"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">My Appointments</h1>
      </div>

      {/* Upcoming Appointments */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Upcoming</h2>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <Card key={appointment.id} className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{appointment.doctor}</CardTitle>
                    <p className="text-sm text-gray-600">{appointment.specialty}</p>
                  </div>
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{appointment.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{appointment.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{appointment.location}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Reschedule
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Book New Appointment */}
      <Button 
        onClick={() => navigate('/doctors')} 
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        Book New Appointment
      </Button>
    </div>
  );
};

export default Appointments;
