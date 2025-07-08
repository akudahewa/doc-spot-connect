
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MobileHome from './pages/MobileHome';
import PatientDashboard from './pages/PatientDashboard';
import DoctorsList from './pages/DoctorsList';
import Appointments from './pages/Appointments';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MobileHome />} />
        <Route path="/dashboard" element={<PatientDashboard />} />
        <Route path="/doctors" element={<DoctorsList />} />
        <Route path="/appointments" element={<Appointments />} />
      </Routes>
    </Router>
  );
};

export default App;
