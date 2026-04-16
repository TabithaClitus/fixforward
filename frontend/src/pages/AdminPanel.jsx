import React, { useState, useEffect } from 'react';
import { Send, AlertCircle, FileText, CheckCircle, RefreshCw, ShieldAlert, WifiOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminPanel = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOffline] = useState(!navigator.onLine);
  const [alertForm, setAlertForm] = useState({
    title: '',
    message: '',
    priority: 'Medium'
  });
  const [statusMsg, setStatusMsg] = useState('');

  const fetchData = async () => {
    try {
      const alertRes = await axios.get('http://localhost:8000/alerts');
      setAlerts(alertRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    setStatusMsg('Sending Broadcast...');
    try {
      await axios.post('http://localhost:8000/alerts/create', alertForm);
      setStatusMsg('Alert Broadcast Successful!');
      setAlertForm({ title: '', message: '', priority: 'Medium' });
      fetchData();
      setTimeout(() => setStatusMsg(''), 3000);
    } catch (error) {
      setStatusMsg('Error sending alert');
    }
  };

  return (
    <div style={{ width: '100vw', minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0F172A' }}>
      {/* Header */}
      <header style={{
        flex: '0 0 auto',
        height: '72px',
        borderBottom: '2px solid #1E293B',
        backgroundColor: '#001F3F',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: '32px',
        paddingRight: '32px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '200px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'linear-gradient(135deg, #00D9FF 0%, #0099CC 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0, 217, 255, 0.3)' }}>
            <ShieldAlert style={{ width: '24px', height: '24px', color: 'white' }} />
          </div>
          <div>
            <span style={{ fontSize: '22px', fontWeight: '900', color: '#00D9FF', letterSpacing: '2px', display: 'block' }}>SCCIN</span>
            <span style={{ fontSize: '10px', color: '#64748B', letterSpacing: '1px', textTransform: 'uppercase' }}>Administration</span>
          </div>
        </div>

        <nav style={{ display: 'flex', gap: '24px', alignItems: 'center', flex: '1', justifyContent: 'center' }}>
          {[
            { label: 'Feed', icon: '📡', path: '/dashboard' },
            { label: 'Report', icon: '📋', path: '/report' },
            { label: 'Check', icon: '✓', path: '/check' },
            { label: 'Admin', icon: '⚙️', path: '/admin' },
            { label: 'Settings', icon: '🔧', path: '/settings' }
          ].map(({ label, icon, path }) => (
            <Link
              key={label}
              to={path}
              style={{
                fontSize: '13px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                color: label === 'Admin' ? '#00D9FF' : '#94A3B8',
                textDecoration: 'none',
                padding: '8px 12px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: label === 'Admin' ? 'rgba(0, 217, 255, 0.1)' : 'transparent',
                transition: 'all 0.3s',
                cursor: 'pointer',
                border: label === 'Admin' ? '1px solid rgba(0, 217, 255, 0.2)' : 'none'
              }}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '200px', justifyContent: 'flex-end' }}>
          {isOffline && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              fontWeight: 'bold',
              padding: '6px 12px',
              borderRadius: '6px',
              backgroundColor: 'rgba(255, 107, 107, 0.15)',
              color: '#FF6B6B'
            }}>
              <WifiOff style={{ width: '16px', height: '16px' }} />
              <span>OFFLINE</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div style={{ flex: '1', display: 'flex', overflow: 'hidden', padding: '32px', gap: '32px' }}>
        {/* Left Form Section */}
        <div style={{ width: '360px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
          
          {/* Alert Creation Form */}
          <div style={{
            backgroundColor: '#0A3B5C',
            borderRadius: '12px',
            padding: '28px',
            border: '1px solid #1E4D6B',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            position: 'sticky',
            top: '0'
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: '900', color: '#FFD700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '24px', margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertCircle style={{ width: '20px', height: '20px' }} />
              Issue Alert
            </h2>
            
            <form onSubmit={handleCreateAlert} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Alert Title */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '10px', fontWeight: '900', color: '#A1A5B1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Alert Title</label>
                <input
                  type="text"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    backgroundColor: '#052447',
                    border: '1px solid #1E4D6B',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    transition: 'all 0.3s'
                  }}
                  placeholder="e.g. Flash Flood Alert"
                  value={alertForm.title}
                  onChange={(e) => setAlertForm({...alertForm, title: e.target.value})}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#00D9FF';
                    e.target.style.boxShadow = '0 0 12px rgba(0, 217, 255, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#1E4D6B';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                />
              </div>
              
              {/* Priority Level */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '10px', fontWeight: '900', color: '#A1A5B1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Priority Level</label>
                <select 
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    backgroundColor: '#052447',
                    border: '1px solid #1E4D6B',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    transition: 'all 0.3s',
                    cursor: 'pointer'
                  }}
                  value={alertForm.priority}
                  onChange={(e) => setAlertForm({...alertForm, priority: e.target.value})}
                >
                  <option value="High" style={{ backgroundColor: '#052447', color: '#FF6B6B' }}>Critical / High</option>
                  <option value="Medium" style={{ backgroundColor: '#052447', color: '#FFD700' }}>Moderate / Medium</option>
                  <option value="Low" style={{ backgroundColor: '#052447', color: '#00D9FF' }}>Info / Low</option>
                </select>
              </div>

              {/* Broadcast Message */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '10px', fontWeight: '900', color: '#A1A5B1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Broadcast Message</label>
                <textarea
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '12px 14px',
                    backgroundColor: '#052447',
                    border: '1px solid #1E4D6B',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    transition: 'all 0.3s'
                  }}
                  placeholder="Details of the emergency..."
                  value={alertForm.message}
                  onChange={(e) => setAlertForm({...alertForm, message: e.target.value})}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#00D9FF';
                    e.target.style.boxShadow = '0 0 12px rgba(0, 217, 255, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#1E4D6B';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!alertForm.title || !alertForm.message}
                style={{
                  width: '100%',
                  padding: '14px',
                  marginTop: '8px',
                  backgroundColor: !alertForm.title || !alertForm.message ? '#2A5F7F' : '#FFD700',
                  color: '#000000',
                  fontSize: '12px',
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: !alertForm.title || !alertForm.message ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)',
                  opacity: !alertForm.title || !alertForm.message ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                  if (alertForm.title && alertForm.message) {
                    e.target.style.boxShadow = '0 6px 16px rgba(255, 215, 0, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (alertForm.title && alertForm.message) {
                    e.target.style.boxShadow = '0 4px 12px rgba(255, 215, 0, 0.3)';
                  }
                }}
              >
                <Send style={{ width: '14px', height: '14px' }} />
                Broadcast to All
              </button>

              {/* Status Message */}
              {statusMsg && (
                <div style={{
                  padding: '12px',
                  backgroundColor: statusMsg.includes('Success') ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 107, 107, 0.15)',
                  border: `1px solid ${statusMsg.includes('Success') ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 107, 107, 0.3)'}`,
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  color: statusMsg.includes('Success') ? '#10B981' : '#FF6B6B',
                  textAlign: 'center'
                }}>
                  {statusMsg}
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Right Content Section */}
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
          
          {/* Quick Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <StatCard label="Total Alerts" value={alerts.length} icon="🚨" color="#FFD700" />
            <StatCard label="Active Users" value="1,280" icon="👥" color="#00D9FF" />
            <StatCard label="Unverified Reports" value="12" icon="📋" color="#FF6B6B" />
          </div>

          {/* Recent Broadcasts Table */}
          <div style={{
            backgroundColor: '#0A3B5C',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #1E4D6B',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            flex: '1',
            minHeight: '0'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: '900', color: '#00D9FF', textTransform: 'uppercase', marginBottom: '16px', margin: '0 0 16px 0' }}>📡 Recent Broadcasts</h3>
            <div style={{ overflowX: 'auto', flex: '1', minHeight: '0' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #1E4D6B' }}>
                    <th style={{ paddingBottom: '12px', paddingRight: '16px', fontSize: '10px', fontWeight: '900', color: '#A1A5B1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Timestamp</th>
                    <th style={{ paddingBottom: '12px', paddingRight: '16px', fontSize: '10px', fontWeight: '900', color: '#A1A5B1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Title</th>
                    <th style={{ paddingBottom: '12px', paddingRight: '16px', fontSize: '10px', fontWeight: '900', color: '#A1A5B1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Priority</th>
                    <th style={{ paddingBottom: '12px', paddingRight: '16px', fontSize: '10px', fontWeight: '900', color: '#A1A5B1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {alerts.length > 0 ? alerts.slice(0, 10).map(a => (
                    <tr key={a.id} style={{ borderBottom: '1px solid #1E4D6B', transition: 'all 0.2s' }} 
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 217, 255, 0.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ paddingTop: '12px', paddingBottom: '12px', paddingRight: '16px', fontSize: '11px', color: '#64748B' }}>
                        {new Date(a.timestamp).toLocaleString()}
                      </td>
                      <td style={{ paddingTop: '12px', paddingBottom: '12px', paddingRight: '16px', fontSize: '12px', fontWeight: '600', color: '#FFFFFF' }}>
                        {a.title}
                      </td>
                      <td style={{ paddingTop: '12px', paddingBottom: '12px', paddingRight: '16px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          color: a.priority === 'High' ? '#FF6B6B' : a.priority === 'Medium' ? '#FFD700' : '#00D9FF',
                          backgroundColor: a.priority === 'High' ? 'rgba(255, 107, 107, 0.15)' : a.priority === 'Medium' ? 'rgba(255, 215, 0, 0.15)' : 'rgba(0, 217, 255, 0.15)'
                        }}>
                          {a.priority}
                        </span>
                      </td>
                      <td style={{ paddingTop: '12px', paddingBottom: '12px', paddingRight: '16px', display: 'flex', alignItems: 'center', gap: '6px', color: '#10B981', fontSize: '11px', fontWeight: 'bold' }}>
                        <CheckCircle style={{ width: '14px', height: '14px' }} />
                        Sent
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" style={{ paddingTop: '24px', textAlign: 'center', color: '#64748B', fontSize: '12px' }}>
                        No broadcasts yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}} />
    </div>
  );
};

const StatCard = ({ label, value, icon, color }) => (
  <div style={{
    backgroundColor: '#0A3B5C',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #1E4D6B',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'all 0.3s'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.borderColor = color;
    e.currentTarget.style.boxShadow = `0 4px 12px ${color}40`;
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.borderColor = '#1E4D6B';
    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
  }}>
    <div>
      <p style={{ fontSize: '10px', fontWeight: '900', color: '#A1A5B1', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 8px 0' }}>
        {label}
      </p>
      <p style={{ fontSize: '28px', fontWeight: '900', color: color, margin: 0 }}>
        {value}
      </p>
    </div>
    <div style={{ fontSize: '32px', opacity: 0.8 }}>
      {icon}
    </div>
  </div>
);

export default AdminPanel;
