import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Home, AlertTriangle, FileText, CheckCircle, Settings, LogOut } from 'lucide-react';
import NetworkIndicator from './NetworkIndicator';

const S = {
  glass: { background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)' },
  glassDark: { background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)' },
  teal: '#0D9488',
  red: '#EF4444',
  amber: '#F59E0B',
  dark: '#0F172A',
  tealBg: 'rgba(13,148,136,0.1)',
  redBg: 'rgba(239,68,68,0.1)',
  amberBg: 'rgba(245,158,11,0.1)',
  tealBorder: 'rgba(13,148,136,0.3)',
  redBorder: 'rgba(239,68,68,0.3)',
  amberBorder: 'rgba(245,158,11,0.3)',
};

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('sccin_user') || '{}');
  const isAdmin = user.role === 'admin';

  const handleLogout = () => {
    localStorage.removeItem('sccin_user');
    localStorage.removeItem('sccin_token');
    navigate('/login');
  };

  if (!localStorage.getItem('sccin_token')) return null;

  return (
    <nav
      style={{
        ...S.glassDark,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Shield style={{ color: S.teal, width: 28, height: 28 }} />
        <span style={{ fontSize: 20, fontWeight: 900, color: 'white', letterSpacing: '-0.02em', display: 'none' }} className="sm:inline">SCCIN</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <NavLink to="/dashboard" icon={<Home style={{ width: 20, height: 20 }} />} label="Feed" />
        <NavLink to="/report" icon={<AlertTriangle style={{ width: 20, height: 20 }} />} label="Report" />
        <NavLink to="/verify" icon={<CheckCircle style={{ width: 20, height: 20 }} />} label="Check" />
        {isAdmin && <NavLink to="/admin" icon={<FileText style={{ width: 20, height: 20 }} />} label="Admin" />}
        <NavLink to="/settings" icon={<Settings style={{ width: 20, height: 20 }} />} label="Settings" />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <NetworkIndicator />
        <button 
          onClick={handleLogout}
          style={{
            padding: '10px',
            background: 'transparent',
            color: '#94A3B8',
            border: 'none',
            cursor: 'pointer',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => { e.target.style.background = 'rgba(255,255,255,0.05)'; e.target.style.color = 'white'; }}
          onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#94A3B8'; }}
          title="Logout"
        >
          <LogOut style={{ width: 20, height: 20 }} />
        </button>
      </div>
    </nav>
  );
};

const NavLink = ({ to, icon, label }) => (
  <Link 
    to={to}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '8px 14px',
      borderRadius: 8,
      color: '#94A3B8',
      textDecoration: 'none',
      transition: 'all 0.2s',
      fontSize: 12,
      fontWeight: 700,
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'white'; }}
    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94A3B8'; }}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
  </Link>
);

export default Navbar;
