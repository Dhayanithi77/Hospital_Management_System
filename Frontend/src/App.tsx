import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import Doctors from './pages/Doctors';
import Shifts from './pages/Shifts';
import Staff from './pages/Staff';
import Attendance from './pages/Attendance';
import Payroll from './pages/Payroll';
import Notifications from './pages/Notifications';
import AIInsights from './pages/AIInsights';
import ChatBot from './components/ui/ChatBot';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar />
        
        <div className="flex-1 ml-64 flex flex-col min-h-screen">
          <Navbar />
          
          
          <main className="p-8 flex-1">
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/doctors" element={<Doctors />} />
                <Route path="/shifts" element={<Shifts />} />
                <Route path="/staff" element={<Staff />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/payroll" element={<Payroll />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/ai-insights" element={<AIInsights />} />
              </Routes>
            </div>
          </main>

          <footer className="p-8 text-center text-slate-400 text-xs border-t border-slate-200 bg-white">
            &copy; 2023 MedPro Admin Systems. All rights reserved. Professional Healthcare Management.
          </footer>
        </div>
      </div>
    </Router>
  );
}
