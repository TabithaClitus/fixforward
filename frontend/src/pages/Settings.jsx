import React, { useState } from 'react';
import { Globe, Zap, Bell, User, Cloud, HardDrive, Shield, ShieldAlert, WifiOff } from 'lucide-react';
import { Link } from 'react-router-dom';

const Settings = () => {
  const [lang, setLang] = useState('en');
  const [lowBandwidth, setLowBandwidth] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [isOffline] = useState(!navigator.onLine);
  const user = JSON.parse(localStorage.getItem('sccin_user') || '{}');

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
            <span style={{ fontSize: '10px', color: '#64748B', letterSpacing: '1px', textTransform: 'uppercase' }}>Settings</span>
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
                color: label === 'Settings' ? '#00D9FF' : '#94A3B8',
                textDecoration: 'none',
                padding: '8px 12px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: label === 'Settings' ? 'rgba(0, 217, 255, 0.1)' : 'transparent',
                transition: 'all 0.3s',
                cursor: 'pointer',
                border: label === 'Settings' ? '1px solid rgba(0, 217, 255, 0.2)' : 'none'
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
      <div style={{ flex: '1', display: 'flex', overflow: 'hidden', padding: '32px' }}>
        <div style={{ flex: '1', maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto', width: '100%' }}>
          
          {/* Title */}
          <div style={{ marginBottom: '16px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#FFFFFF', margin: '0 0 8px 0' }}>⚙️ Settings & Preferences</h1>
            <p style={{ fontSize: '14px', color: '#A1A5B1', margin: 0 }}>Customize how SCCIN works for your device and network.</p>
          </div>

          {/* Account Information */}
          <div style={{
            backgroundColor: '#0A3B5C',
            borderRadius: '12px',
            padding: '28px',
            border: '1px solid #1E4D6B',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}>
            <h2 style={{ fontSize: '12px', fontWeight: '900', color: '#00D9FF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <User style={{ width: '18px', height: '18px' }} />
              Account Information
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                fontWeight: '900',
                backgroundColor: 'rgba(0, 217, 255, 0.15)',
                color: '#00D9FF'
              }}>
                {user.name?.[0] || 'U'}
              </div>
              <div>
                <p style={{ fontSize: '16px', fontWeight: '900', color: '#FFFFFF', margin: '0 0 6px 0' }}>
                  {user.name || 'User'}
                </p>
                <p style={{ fontSize: '13px', color: '#A1A5B1', margin: '0 0 8px 0' }}>
                  {user.phone || 'No phone'}
                </p>
                <span style={{ display: 'inline-block', padding: '6px 12px', backgroundColor: 'rgba(0, 217, 255, 0.1)', borderRadius: '8px', fontSize: '10px', fontWeight: '900', color: '#00D9FF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {user.role || 'User'} Account
                </span>
              </div>
            </div>
          </div>

          {/* Connectivity & Data */}
          <div style={{
            backgroundColor: '#0A3B5C',
            borderRadius: '12px',
            padding: '28px',
            border: '1px solid #1E4D6B',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}>
            <h2 style={{ fontSize: '12px', fontWeight: '900', color: '#00D9FF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '24px', margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Cloud style={{ width: '18px', height: '18px' }} />
              Connectivity & Data
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Low Bandwidth Mode */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '20px', borderBottom: '1px solid #1E4D6B' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255, 215, 0, 0.15)',
                    color: '#FFD700',
                    flex: '0 0 auto'
                  }}>
                    <Zap style={{ width: '20px', height: '20px' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '900', color: '#FFFFFF', margin: '0 0 6px 0' }}>Low Bandwidth Mode</p>
                    <p style={{ fontSize: '12px', color: '#A1A5B1', margin: 0, lineHeight: '1.5' }}>Reduce data usage, compress reports, and disable animations.</p>
                  </div>
                </div>
                <ToggleSwitch isOn={lowBandwidth} onChange={setLowBandwidth} />
              </div>

              {/* Language Preference */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0, 217, 255, 0.15)',
                    color: '#00D9FF',
                    flex: '0 0 auto'
                  }}>
                    <Globe style={{ width: '20px', height: '20px' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '900', color: '#FFFFFF', margin: '0 0 6px 0' }}>Language</p>
                    <p style={{ fontSize: '12px', color: '#A1A5B1', margin: 0, lineHeight: '1.5' }}>Switch interface to your local language.</p>
                  </div>
                </div>
                <select
                  style={{
                    backgroundColor: '#052447',
                    border: '1px solid #1E4D6B',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#00D9FF';
                    e.target.style.boxShadow = '0 0 12px rgba(0, 217, 255, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#1E4D6B';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="en" style={{ backgroundColor: '#052447', color: '#FFFFFF' }}>English (Global)</option>
                  <option value="ta" style={{ backgroundColor: '#052447', color: '#FFFFFF' }}>Tamil (தமிழ்)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Storage & Maintenance */}
          <div style={{
            backgroundColor: '#0A3B5C',
            borderRadius: '12px',
            padding: '28px',
            border: '1px solid #1E4D6B',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}>
            <h2 style={{ fontSize: '12px', fontWeight: '900', color: '#00D9FF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <HardDrive style={{ width: '18px', height: '18px' }} />
              Storage & Maintenance
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #1E4D6B' }}>
                <span style={{ fontSize: '13px', color: '#A1A5B1' }}>Offline Cache Size</span>
                <span style={{ fontSize: '14px', fontWeight: '900', color: '#00D9FF' }}>1.2 MB</span>
              </div>
              <button style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #FF6B6B',
                backgroundColor: 'transparent',
                color: '#FF6B6B',
                fontSize: '12px',
                fontWeight: '900',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 107, 107, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}>
                Clear Local Emergency Cache
              </button>
            </div>
          </div>

          {/* Security Info */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            fontSize: '11px',
            color: '#64748B',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            padding: '20px',
            backgroundColor: 'rgba(0, 217, 255, 0.05)',
            borderRadius: '10px',
            border: '1px solid rgba(0, 217, 255, 0.1)',
            letterSpacing: '0.5px'
          }}>
            <Shield style={{ width: '16px', height: '16px', color: '#00D9FF' }} />
            End-to-End P2P Propagation Enabled
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

// Toggle Switch Component
const ToggleSwitch = ({ isOn, onChange }) => (
  <button
    onClick={() => onChange(!isOn)}
    style={{
      width: '56px',
      height: '32px',
      borderRadius: '999px',
      border: 'none',
      backgroundColor: isOn ? '#00D9FF' : '#2A5F7F',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      paddingLeft: isOn ? '28px' : '4px',
      transition: 'all 0.3s',
      boxShadow: isOn ? '0 4px 12px rgba(0, 217, 255, 0.3)' : 'none'
    }}
  >
    <div style={{
      width: '24px',
      height: '24px',
      borderRadius: '999px',
      backgroundColor: 'white',
      transition: 'all 0.3s',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
    }} />
  </button>
);

export default Settings;
