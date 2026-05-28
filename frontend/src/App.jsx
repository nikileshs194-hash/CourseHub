import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Courses from './pages/Courses';
import Registrations from './pages/Registrations';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import './index.css';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <BrowserRouter>
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
        <Sidebar open={sidebarOpen} />
        <div style={{
          marginLeft: sidebarOpen ? '240px' : '0px',
          flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh',
          transition: 'margin-left 0.3s ease',
        }}>
          <Navbar onToggleSidebar={() => setSidebarOpen(o => !o)} sidebarOpen={sidebarOpen} />
          <main style={{ marginTop: '64px', flex: 1, padding: '24px 28px', overflowY: 'auto' }}>
            <Routes>
              <Route path="/"              element={<Dashboard />} />
              <Route path="/students"      element={<Students />} />
              <Route path="/courses"       element={<Courses />} />
              <Route path="/registrations" element={<Registrations />} />
              <Route path="/reports"       element={<Reports />} />
              <Route path="/settings"      element={<Settings />} />
            </Routes>
          </main>
          <footer style={{
            textAlign: 'center', padding: '14px',
            fontSize: '12px', color: '#9ca3af',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#fff',
          }}>
            © 2024 Maharaja Institute of Technology, Mysore. All Rights Reserved.
          </footer>
        </div>
      </div>
    </BrowserRouter>
  );
}
