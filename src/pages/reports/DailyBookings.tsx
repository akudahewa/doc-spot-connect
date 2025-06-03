import React, { useState, useEffect } from 'react';
import { ReportService, DailyBookingSummary } from '@/api/services/ReportService';
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
  Box
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const DailyBookings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<DailyBookingSummary | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    fetchReport();
  }, [selectedDate]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ReportService.getDailyBookings(selectedDate);
      setReport(data);
    } catch (err) {
      setError('Failed to load daily bookings report');
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
        Daily Bookings Report
      </Typography>

      <Box sx={{ mb: 3 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Select Date"
            value={selectedDate}
            onChange={(newValue: Date | null) => {
              if (newValue) {
                setSelectedDate(newValue);
              }
            }}
          />
        </LocalizationProvider>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Bookings
              </Typography>
              <Typography variant="h5">
                {report?.total || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Completed
              </Typography>
              <Typography variant="h5" color="primary">
                {report?.completed || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Cancelled
              </Typography>
              <Typography variant="h5" color="error">
                {report?.cancelled || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                No Shows
              </Typography>
              <Typography variant="h5" color="warning.main">
                {report?.noShow || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Time Slot</TableCell>
              <TableCell>Patient Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Dispensary</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Checked In</TableCell>
              <TableCell>Completed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {report?.bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.timeSlot}</TableCell>
                <TableCell>{booking.patientName}</TableCell>
                <TableCell>{booking.patientPhone}</TableCell>
                <TableCell>{booking.doctor.name}</TableCell>
                <TableCell>{booking.dispensary.name}</TableCell>
                <TableCell>{booking.status}</TableCell>
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

export default DailyBookings; 