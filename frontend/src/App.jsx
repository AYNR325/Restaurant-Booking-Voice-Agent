import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import VoiceAgent from './pages/VoiceAgent.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

function App() {
  return (
    <Router>
      <div className="relative">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/agent" element={<VoiceAgent />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
