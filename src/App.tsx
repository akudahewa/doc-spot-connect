
import TimeSlotManagement from './pages/TimeSlotManagement';
import Index from './pages/Index';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/AdminDashboard';
import AdminDoctors from './pages/AdminDoctors';
import AdminReports from './pages/AdminReports';
import AdminTimeSlots from './pages/AdminTimeSlots';
import Booking from './pages/Booking';
import Contact from './pages/Contact';
import Doctors from './pages/Doctors';
import Login from './pages/Login';
import CreateDoctor from './pages/CreateDoctor';
import EditDoctor from './pages/EditDoctor';
import ViewDoctor from './pages/ViewDoctor';
import CreateDispensary from './pages/CreateDispensary';
import EditDispensary from './pages/EditDispensary';
import ViewDispensary from './pages/ViewDispensary';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/doctors" element={<AdminDoctors />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/time-slots" element={<AdminTimeSlots />} />
        <Route path="/admin/doctors/create" element={<CreateDoctor />} />
        <Route path="/admin/doctors/edit/:id" element={<EditDoctor />} />
        <Route path="/admin/doctors/view/:id" element={<ViewDoctor />} />
        <Route path="/admin/dispensaries/create" element={<CreateDispensary />} />
        <Route path="/admin/dispensaries/edit/:id" element={<EditDispensary />} />
        <Route path="/admin/dispensaries/view/:id" element={<ViewDispensary />} />
        
        {/* Specific Routes */}
        <Route path="/doctor/:doctorId/dispensary/:dispensaryId/time-slots" element={<TimeSlotManagement />} />
        
        {/* Catch All - 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
