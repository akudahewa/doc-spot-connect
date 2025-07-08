
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, Activity, Thermometer, Scale } from 'lucide-react';

const PatientDashboard = () => {
  const navigate = useNavigate();

  const vitals = [
    { icon: Heart, label: 'Heart Rate', value: '72 bpm', color: 'text-red-600' },
    { icon: Activity, label: 'Blood Pressure', value: '120/80', color: 'text-green-600' },
    { icon: Thermometer, label: 'Temperature', value: '98.6°F', color: 'text-blue-600' },
    { icon: Scale, label: 'Weight', value: '165 lbs', color: 'text-purple-600' },
  ];

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
        <h1 className="text-2xl font-bold text-gray-800">Patient Dashboard</h1>
      </div>

      {/* Patient Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Welcome back, John Doe</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Last visit: March 15, 2024</p>
          <p className="text-sm text-green-600 mt-1">● Healthy Status</p>
        </CardContent>
      </Card>

      {/* Vitals Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {vitals.map((vital, index) => (
          <Card key={index} className="shadow-sm">
            <CardContent className="p-4 text-center">
              <vital.icon className={`h-8 w-8 mx-auto mb-2 ${vital.color}`} />
              <p className="text-sm text-gray-600 mb-1">{vital.label}</p>
              <p className="text-lg font-semibold">{vital.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <Button 
          onClick={() => navigate('/appointments')} 
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Book New Appointment
        </Button>
        <Button 
          onClick={() => navigate('/doctors')} 
          variant="outline" 
          className="w-full"
        >
          Find Specialists
        </Button>
      </div>
    </div>
  );
};

export default PatientDashboard;
