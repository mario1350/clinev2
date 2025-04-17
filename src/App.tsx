import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import LeadsOverview from './pages/LeadsOverview';
import ClientProgress from './pages/ClientProgress';
import TaskManagement from './pages/TaskManagement';
import SolarDesign from './pages/SolarDesign';
import Engineering from './pages/Engineering';
import ScenarioAnalysis from './pages/ScenarioAnalysis';
import Referrals from './pages/Referrals';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leads" element={<LeadsOverview />} />
          <Route path="/clients" element={<ClientProgress />} />
          <Route path="/tasks" element={<TaskManagement />} />
          <Route path="/design" element={<SolarDesign />} />
          <Route path="/engineering" element={<Engineering />} />
          <Route path="/analysis" element={<ScenarioAnalysis />} />
          <Route path="/referrals" element={<Referrals />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;