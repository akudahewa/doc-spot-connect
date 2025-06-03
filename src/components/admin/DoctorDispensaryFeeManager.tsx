
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { DoctorService, DispensaryService, DoctorDispensaryService } from '@/api/services';
import { Doctor, Dispensary } from '@/api/models';
import { DoctorDispensaryFee } from '@/api/services/DoctorDispensaryService';
import { Plus } from 'lucide-react';

const DoctorDispensaryFeeManager: React.FC = () => {
  const { toast } = useToast();
  
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [dispensaries, setDispensaries] = useState<Dispensary[]>([]);
  const [feeConfigs, setFeeConfigs] = useState<DoctorDispensaryFee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form state
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDispensary, setSelectedDispensary] = useState('');
  const [doctorFee, setDoctorFee] = useState('');
  const [dispensaryFee, setDispensaryFee] = useState('');
  const [bookingCommission, setBookingCommission] = useState('');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const [doctorsData, dispensariesData] = await Promise.all([
          DoctorService.getAllDoctors(),
          DispensaryService.getAllDispensaries()
        ]);
        setDoctors(doctorsData);
        setDispensaries(dispensariesData);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load doctors and dispensaries',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDoctor || !selectedDispensary || !doctorFee || !dispensaryFee || !bookingCommission) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsLoading(true);
      await DoctorDispensaryService.assignFees({
        doctorId: selectedDoctor,
        dispensaryId: selectedDispensary,
        doctorFee: Number(doctorFee),
        dispensaryFee: Number(dispensaryFee),
        bookingCommission: Number(bookingCommission)
      });
      
      toast({
        title: 'Success',
        description: 'Fee configuration saved successfully'
      });
      
      // Reset form
      setSelectedDoctor('');
      setSelectedDispensary('');
      setDoctorFee('');
      setDispensaryFee('');
      setBookingCommission('');
      setIsDialogOpen(false);
      
      // Refresh fee configs if needed
      // You can add logic here to refresh the list
      
    } catch (error) {
      console.error('Error saving fee configuration:', error);
      toast({
        title: 'Error',
        description: 'Failed to save fee configuration',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Doctor-Dispensary Fee Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Fee Configuration
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Fee Configuration</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="doctor">Doctor</Label>
                <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialization}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dispensary">Dispensary</Label>
                <Select value={selectedDispensary} onValueChange={setSelectedDispensary}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Dispensary" />
                  </SelectTrigger>
                  <SelectContent>
                    {dispensaries.map((dispensary) => (
                      <SelectItem key={dispensary.id} value={dispensary.id}>
                        {dispensary.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="doctorFee">Doctor Fee</Label>
                <Input
                  id="doctorFee"
                  type="number"
                  value={doctorFee}
                  onChange={(e) => setDoctorFee(e.target.value)}
                  placeholder="Enter doctor fee"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dispensaryFee">Dispensary Fee</Label>
                <Input
                  id="dispensaryFee"
                  type="number"
                  value={dispensaryFee}
                  onChange={(e) => setDispensaryFee(e.target.value)}
                  placeholder="Enter dispensary fee"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bookingCommission">Booking Commission</Label>
                <Input
                  id="bookingCommission"
                  type="number"
                  value={bookingCommission}
                  onChange={(e) => setBookingCommission(e.target.value)}
                  placeholder="Enter booking commission"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Configuration'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fee Configurations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Fee configurations will be displayed here. You can view and manage doctor-dispensary fee combinations.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorDispensaryFeeManager;
