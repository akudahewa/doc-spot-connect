
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import AdminDashboard from './pages/AdminDashboard';
import Booking from './pages/Booking';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Doctors from './pages/Doctors';
import AdminDoctors from './pages/AdminDoctors';
import CreateDoctor from './pages/CreateDoctor';
import EditDoctor from './pages/EditDoctor';
import ViewDoctor from './pages/ViewDoctor';
import AdminDispensaries from './pages/AdminDispensaries';
import CreateDispensary from './pages/CreateDispensary';
import EditDispensary from './pages/EditDispensary';
import ViewDispensary from './pages/ViewDispensary';
import './App.css';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/callback" element={<AuthCallback />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/doctors" element={<Doctors />} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        
        {/* Admin Doctors Routes */}
        <Route path="/admin/doctors" element={<AdminDoctors />} />
        <Route path="/admin/doctors/create" element={<CreateDoctor />} />
        <Route path="/admin/doctors/edit/:id" element={<EditDoctor />} />
        <Route path="/admin/doctors/view/:id" element={<ViewDoctor />} />
        
        {/* Admin Dispensaries Routes */}
        <Route path="/admin/dispensaries" element={<AdminDispensaries />} />
        <Route path="/admin/dispensaries/create" element={<CreateDispensary />} />
        <Route path="/admin/dispensaries/edit/:id" element={<EditDispensary />} />
        <Route path="/admin/dispensaries/view/:id" element={<ViewDispensary />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
