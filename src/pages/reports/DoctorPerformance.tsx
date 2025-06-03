import React, { useState, useEffect } from 'react';
import { ReportService, DoctorPerformance } from '@/api/services/ReportService';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const DoctorPerformance: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<DoctorPerformance | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  useEffect(() => {
    if (selectedDoctor) {
      fetchReport();
    }
  }, [selectedDoctor, startDate, endDate]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ReportService.getDoctorPerformance(
        selectedDoctor,
        startDate,
        endDate
      );
      setReport(data);
    } catch (err) {
      setError('Failed to load doctor performance report');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Doctor Performance Report
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Doctor</InputLabel>
            <Select
              value={selectedDoctor}
              label="Doctor"
              onChange={(e) => setSelectedDoctor(e.target.value)}
            >
              {/* Add your doctors list here */}
              <MenuItem value="doctor1">Dr. John Doe</MenuItem>
              <MenuItem value="doctor2">Dr. Jane Smith</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => newValue && setStartDate(newValue)}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) => newValue && setEndDate(newValue)}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Bookings
              </Typography>
              <Typography variant="h5">
                {report?.totalBookings || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Completion Rate
              </Typography>
              <Typography variant="h5" color="primary">
                {report?.completionRate.toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Cancellation Rate
              </Typography>
              <Typography variant="h5" color="error">
                {report?.cancellationRate.toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Avg. Consultation Time
              </Typography>
              <Typography variant="h5" color="info.main">
                {report?.averageConsultationTime.toFixed(0)} min
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Time Slot</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Dispensary</TableCell>
              <TableCell>Checked In</TableCell>
              <TableCell>Completed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {report?.bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{format(new Date(booking.date), 'MMM d, yyyy')}</TableCell>
                <TableCell>{booking.timeSlot}</TableCell>
                <TableCell>{booking.status}</TableCell>
                <TableCell>{booking.dispensary.name}</TableCell>
                <TableCell>
                  {booking.checkedInTime
                    ? format(new Date(booking.checkedInTime), 'HH:mm')
                    : '-'}
                </TableCell>
                <TableCell>
                  {booking.completedTime
                    ? format(new Date(booking.completedTime), 'HH:mm')
                    : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DoctorPerformance; 