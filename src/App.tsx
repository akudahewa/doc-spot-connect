
import TimeSlotManagement from './pages/TimeSlotManagement';
import Index from './pages/Index';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/doctor/:doctorId/dispensary/:dispensaryId/time-slots" element={<TimeSlotManagement />} />
        <Route path="*" element={<NotFound />} />
        {/* Add other routes here as needed */}
      </Routes>
    </Router>
  );
};

export default App;
