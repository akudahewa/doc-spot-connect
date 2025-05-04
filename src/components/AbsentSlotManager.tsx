
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { TimeSlotService } from '@/api/services';
import { AbsentTimeSlot } from '@/api/models';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarDays, Trash2 } from 'lucide-react';

interface AbsentSlotManagerProps {
  doctorId: string;
  dispensaryId: string;
}

const AbsentSlotManager = ({ doctorId, dispensaryId }: AbsentSlotManagerProps) => {
  const { toast } = useToast();
  const [absentSlots, setAbsentSlots] = useState<AbsentTimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // New absent slot state
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('17:00');
  const [reason, setReason] = useState<string>('');
  
  const fetchAbsentSlots = async () => {
    try {
      setIsLoading(true);
      // Get dates for current and next month
      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      const endDate = new Date(today.getFullYear(), today.getMonth() + 2, 0);
      
      const fetchedAbsentSlots = await TimeSlotService.getAbsentTimeSlots(
        doctorId,
        dispensaryId,
        startDate,
        endDate
      );
      setAbsentSlots(fetchedAbsentSlots);
    } catch (error) {
      console.error('Error fetching absent slots:', error);
      toast({
        title: 'Error',
        description: 'Failed to load absent slots',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAbsentSlots();
  }, [doctorId, dispensaryId]);
  
  const handleAddAbsentSlot = async () => {
    if (!date) {
      toast({
        title: 'Error',
        description: 'Please select a date',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      await TimeSlotService.addAbsentTimeSlot({
        doctorId,
        dispensaryId,
        date,
        startTime,
        endTime,
        reason
      });
      
      toast({
        title: 'Success',
        description: 'Absent slot added successfully'
      });
      
      // Reset form
      setDate(undefined);
      setStartTime('09:00');
      setEndTime('17:00');
      setReason('');
      
      // Refresh absent slots
      fetchAbsentSlots();
    } catch (error) {
      console.error('Error adding absent slot:', error);
      toast({
        title: 'Error',
        description: 'Failed to add absent slot',
        variant: 'destructive'
      });
    }
  };
  
  const handleDeleteAbsentSlot = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this absent slot?')) return;
    
    try {
      await TimeSlotService.deleteAbsentTimeSlot(id);
      
      toast({
        title: 'Success',
        description: 'Absent slot deleted successfully'
      });
      
      // Remove from local state
      setAbsentSlots(prev => prev.filter(slot => slot.id !== id));
    } catch (error) {
      console.error('Error deleting absent slot:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete absent slot',
        variant: 'destructive'
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <Card className="p-4 bg-gray-50">
          <h3 className="text-lg font-medium mb-4">Add New Absent Time Slot</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : <span>Select a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                    disabled={(date) => {
                      const now = new Date();
                      return date < now && !(date.getDate() === now.getDate() && 
                                           date.getMonth() === now.getMonth() && 
                                           date.getFullYear() === now.getFullYear());
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
            
            <div className="lg:col-span-2">
              <Label htmlFor="reason">Reason (Optional)</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason for absence"
                rows={1}
              />
            </div>
            
            <div className="lg:col-span-5">
              <Button onClick={handleAddAbsentSlot}>
                Add Absent Slot
              </Button>
            </div>
          </div>
        </Card>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Upcoming Absent Slots</h3>
        
        {isLoading ? (
          <p>Loading absent slots...</p>
        ) : absentSlots.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No absent slots configured</p>
        ) : (
          <div className="space-y-4">
            {absentSlots.map((slot) => (
              <Card key={slot.id} className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <Label>Date</Label>
                    <p className="mt-1">{format(new Date(slot.date), 'PPP')}</p>
                  </div>
                  
                  <div>
                    <Label>Time</Label>
                    <p className="mt-1">{slot.startTime} - {slot.endTime}</p>
                  </div>
                  
                  <div className="lg:col-span-2">
                    <Label>Reason</Label>
                    <p className="mt-1">{slot.reason || 'Not specified'}</p>
                  </div>
                  
                  <div className="flex items-end justify-end">
                    <Button 
                      variant="destructive" 
                      onClick={() => handleDeleteAbsentSlot(slot.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Remove
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AbsentSlotManager;
