import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Backlog from './pages/Backlog';
import ThisWeek from './pages/ThisWeek';
import NextWeek from './pages/NextWeek';
import Today from './pages/Today';
import Timeline from './pages/Timeline';
import Reports from './pages/Reports';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/backlog" element={<Backlog />} />
          <Route path="/today" element={<Today />} />
          <Route path="/this-week" element={<ThisWeek />} />
          <Route path="/next-week" element={<NextWeek />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;