import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import ReportIncident from './pages/ReportIncident';
import AIVerification from './pages/AIVerification';
import Settings from './pages/Settings';
import { syncEngine } from './services/SyncEngine';

function App() {
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  // Initialize background sync and auto-login
  React.useEffect(() => {
    // Auto-login on first load if not authenticated
    if (!localStorage.getItem('sccin_token')) {
      localStorage.setItem('sccin_token', 'auto-generated-token');
      localStorage.setItem('sccin_user', JSON.stringify({
        id: 1,
        name: 'Emergency Admin',
        phone: '123',
        role: 'admin'
      }));
    }
    setIsAuthenticated(true);
    setIsInitialized(true);
  }, []);

  // Don't render routes until auth is initialized
  if (!isInitialized) {
    return (
      <div
        className="min-h-screen text-slate-200 flex items-center justify-center"
        style={{ backgroundColor: '#0F172A' }}
      >
        <p style={{ color: '#94A3B8' }}>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <div
        className="min-h-screen text-slate-200"
        style={{ backgroundColor: '#0F172A' }}
      >
        <Navbar />
        <main className="transition-all duration-500">
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/dashboard" element={
              isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
            } />
            
            <Route path="/admin" element={
              isAuthenticated ? <AdminPanel /> : <Navigate to="/login" />
            } />
            
            <Route path="/report" element={
              isAuthenticated ? <ReportIncident /> : <Navigate to="/login" />
            } />
            
            <Route path="/verify" element={
              isAuthenticated ? <AIVerification /> : <Navigate to="/login" />
            } />
            
            <Route path="/settings" element={
              isAuthenticated ? <Settings /> : <Navigate to="/login" />
            } />

            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
