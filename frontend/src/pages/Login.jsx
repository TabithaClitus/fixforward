import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Phone, Lock, HeartPulse } from 'lucide-react';
import axios from 'axios';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    name: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let payload;
      
      if (isLogin) {
        // Login: only send phone and password
        payload = {
          phone: formData.phone,
          password: formData.password
        };
      } else {
        // Register: send all fields
        payload = {
          name: formData.name,
          phone: formData.phone,
          password: formData.password,
          role: formData.role
        };
      }
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const endpoint = isLogin ? '/login' : '/register';
      const response = await axios.post(`${apiUrl}${endpoint}`, payload);
      
      if (isLogin) {
        localStorage.setItem('sccin_token', response.data.access_token);
        localStorage.setItem('sccin_user', JSON.stringify(response.data.user));
        navigate('/dashboard');
      } else {
        setIsLogin(true);
        setError('Registration successful. Please login.');
      }
    } catch (err) {
      console.error('Full error object:', err);
      console.error('Error response:', err.response);
      
      let errorMsg = 'Something went wrong';
      
      if (err.response?.data?.detail) {
        errorMsg = err.response.data.detail;
      } else if (err.message === 'Network Error') {
        errorMsg = 'Backend server not running. Make sure http://localhost:8000 is accessible.';
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', overflow: 'hidden', position: 'relative', backgroundColor: '#0F172A' }}>
      <style>{`
        input::placeholder {
          color: rgba(255, 255, 255, 0.4) !important;
        }
        input::-webkit-input-placeholder {
          color: rgba(255, 255, 255, 0.4) !important;
        }
        input:-moz-placeholder {
          color: rgba(255, 255, 255, 0.4) !important;
        }
        input::-moz-placeholder {
          color: rgba(255, 255, 255, 0.4) !important;
        }
      `}</style>
      {/* Background blobs */}
      <div style={{ position: 'absolute', top: 0, left: -80, width: 288, height: 288, borderRadius: '9999px', filter: 'blur(100px)', backgroundColor: 'rgba(0, 217, 255, 0.08)' }} />
      <div style={{ position: 'absolute', bottom: 0, right: -80, width: 384, height: 384, borderRadius: '9999px', filter: 'blur(100px)', backgroundColor: 'rgba(255, 215, 0, 0.06)' }} />

      <div
        style={{
          maxWidth: '448px',
          width: '100%',
          position: 'relative',
          zIndex: 10,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
          backgroundColor: '#0A3B5C',
          border: '1px solid rgba(0, 217, 255, 0.15)',
          borderRadius: '16px',
          padding: '48px 40px'
        }}
      >
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '20px', marginBottom: '24px', backgroundColor: 'rgba(0, 217, 255, 0.1)', transition: 'all 0.3s' }}>
            <Shield style={{ width: 48, height: 48, color: '#00D9FF', transition: 'transform 0.3s' }} />
          </div>
          <h1 style={{ fontSize: '48px', fontWeight: 900, color: 'white', letterSpacing: '2px', marginBottom: '12px', textTransform: 'uppercase' }}>SCCIN</h1>
          <p style={{ fontSize: '14px', color: '#A1A5B1', lineHeight: 1.6 }}>Smart Centralized Communication & Information Network</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{ padding: '12px 16px', borderRadius: '10px', marginBottom: '24px', fontSize: '14px', textAlign: 'center', fontWeight: 500, backgroundColor: 'rgba(255, 107, 107, 0.1)', border: '1px solid rgba(255, 107, 107, 0.25)', color: '#FF6B6B' }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!isLogin && (
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Full Name"
                style={{ width: '100%', border: '1px solid rgba(0, 217, 255, 0.2)', borderRadius: '10px', padding: '12px 16px', fontSize: '14px', color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.03)', outline: 'none', transition: 'all 0.3s', paddingLeft: '48px' }}
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                onFocus={(e) => e.target.style.borderColor = '#00D9FF'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(0, 217, 255, 0.2)'}
                required
              />
            </div>
          )}
          
          <div style={{ position: 'relative' }}>
            <Phone style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: '#64748B' }} />
            <input
              type="text"
              placeholder="Phone Number"
              style={{ width: '100%', border: '1px solid rgba(0, 217, 255, 0.2)', borderRadius: '10px', padding: '12px 16px 12px 48px', fontSize: '14px', color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.03)', outline: 'none', transition: 'all 0.3s', boxSizing: 'border-box' }}
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              onFocus={(e) => e.target.style.borderColor = '#00D9FF'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(0, 217, 255, 0.2)'}
              required
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: '#64748B' }} />
            <input
              type="password"
              placeholder="Password"
              style={{ width: '100%', border: '1px solid rgba(0, 217, 255, 0.2)', borderRadius: '10px', padding: '12px 16px 12px 48px', fontSize: '14px', color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.03)', outline: 'none', transition: 'all 0.3s', boxSizing: 'border-box' }}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              onFocus={(e) => e.target.style.borderColor = '#00D9FF'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(0, 217, 255, 0.2)'}
              required
            />
          </div>

          {!isLogin && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingTop: '8px' }}>
              <button
                type="button"
                style={{ padding: '12px 16px', borderRadius: '8px', border: '2px solid ' + (formData.role === 'user' ? '#00D9FF' : 'rgba(255,255,255,0.2)'), fontWeight: 700, transition: 'all 0.3s', backgroundColor: formData.role === 'user' ? 'rgba(0, 217, 255, 0.1)' : 'transparent', color: formData.role === 'user' ? '#00D9FF' : '#94A3B8', cursor: 'pointer' }}
                onClick={() => setFormData({...formData, role: 'user'})}
              >
                User
              </button>
              <button
                type="button"
                style={{ padding: '12px 16px', borderRadius: '8px', border: '2px solid ' + (formData.role === 'admin' ? '#00D9FF' : 'rgba(255,255,255,0.2)'), fontWeight: 700, transition: 'all 0.3s', backgroundColor: formData.role === 'admin' ? 'rgba(0, 217, 255, 0.1)' : 'transparent', color: formData.role === 'admin' ? '#00D9FF' : '#94A3B8', cursor: 'pointer' }}
                onClick={() => setFormData({...formData, role: 'admin'})}
              >
                Admin
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', color: 'white', fontWeight: 700, padding: '14px 16px', borderRadius: '10px', boxShadow: '0 10px 25px rgba(0, 217, 255, 0.2)', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '14px', marginTop: '24px', backgroundColor: '#00D9FF', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
            onMouseEnter={(e) => !loading && (e.target.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        {/* Toggle Button */}
        <button
          onClick={() => setIsLogin(!isLogin)}
          style={{ width: '100%', textAlign: 'center', marginTop: '32px', color: '#64748B', transition: 'color 0.3s', fontSize: '13px', fontWeight: 500, backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
          onMouseEnter={(e) => e.target.style.color = 'white'}
          onMouseLeave={(e) => e.target.style.color = '#64748B'}
        >
          {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
        </button>

        {/* Test Credentials Info */}
        {isLogin && (
          <div style={{ marginTop: '24px', padding: '12px 14px', borderRadius: '8px', backgroundColor: 'rgba(0, 217, 255, 0.08)', border: '1px solid rgba(0, 217, 255, 0.15)', fontSize: '12px', color: '#A1A5B1', lineHeight: 1.5 }}>
            <div style={{ fontWeight: 600, color: '#00D9FF', marginBottom: '6px' }}>Test Credentials:</div>
            <div>Phone: <span style={{ color: 'white', fontFamily: 'monospace' }}>123</span></div>
            <div>Password: <span style={{ color: 'white', fontFamily: 'monospace' }}>admin</span></div>
          </div>
        )}

        <div style={{ marginTop: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '11px', color: '#64748B', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>
          <HeartPulse style={{ width: 14, height: 14 }} />
          System Active & Secure
        </div>
      </div>
    </div>
  );
};

const RefreshCw = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M3 21v-5h5"></path></svg>
);

export default Login;
