
import TimeSlotManagement from './pages/TimeSlotManagement';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/doctor/:doctorId/dispensary/:dispensaryId/time-slots" element={<TimeSlotManagement />} />
        {/* Add other routes here as needed */}
      </Routes>
    </Router>
  );
};

export default App;
