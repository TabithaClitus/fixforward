import React, { useState, useEffect } from 'react';
import { Send, MapPin, MessageSquare, ShieldAlert, WifiOff, CheckCircle, RefreshCw, AlertTriangle, Radio, BrainCircuit } from 'lucide-react';
import { queueReport } from '../services/OfflineStore';
import { suggestAlertFromReports } from '../services/AIClient';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ReportIncident = () => {
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [suggestion, setSuggestion] = useState(null);
  const [oneTapMode, setOneTapMode] = useState(false);
  const [isOffline] = useState(!navigator.onLine);

  useEffect(() => {
    if (content.length > 10) {
      const mockReports = [
        { content: 'rising water' },
        { content: 'water entering houses' },
        { content }
      ];
      const result = suggestAlertFromReports(mockReports);
      setSuggestion(result);
    } else {
      setSuggestion(null);
    }
  }, [content]);

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    if (!content || !location) return;

    setIsSubmitting(true);
    const reportData = { content, location };

    try {
      if (navigator.onLine) {
        await axios.post('http://localhost:8000/reports', reportData);
        setStatus('success');
      } else {
        await queueReport(reportData);
        setStatus('queued');
      }
      setContent('');
      setLocation('');
    } catch (error) {
      await queueReport(reportData);
      setStatus('queued');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setStatus(null), 5000);
    }
  };

  const triggerOneTap = () => {
    setContent("CRITICAL EMERGENCY: IMMEDIATE ASSISTANCE REQUIRED");
    setLocation("Current GPS Bound");
    setOneTapMode(true);
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
            <span style={{ fontSize: '10px', color: '#64748B', letterSpacing: '1px', textTransform: 'uppercase' }}>Incident Report</span>
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
                color: label === 'Report' ? '#00D9FF' : '#94A3B8',
                textDecoration: 'none',
                padding: '8px 12px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: label === 'Report' ? 'rgba(0, 217, 255, 0.1)' : 'transparent',
                transition: 'all 0.3s',
                cursor: 'pointer',
                border: label === 'Report' ? '1px solid rgba(0, 217, 255, 0.2)' : 'none'
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
              <span>OFFLINE QUEUE</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div style={{ flex: '1', display: 'flex', overflow: 'hidden', padding: '32px' }}>
        {/* Left Form Section */}
        <div style={{ flex: '1', marginRight: '32px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
          
          {/* Form Card */}
          <div style={{
            backgroundColor: '#0A3B5C',
            borderRadius: '12px',
            padding: '32px',
            border: '1px solid #1E4D6B',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#00D9FF', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '24px', margin: 0, marginBottom: '24px' }}>📋 Describe Your Incident</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Content Textarea */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '11px', fontWeight: '900', color: '#A1A5B1', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  💬 What Are You Seeing?
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Describe the situation in detail... (e.g., Water rising on Main St., affecting buildings)"
                  style={{
                    width: '100%',
                    minHeight: '140px',
                    padding: '16px',
                    backgroundColor: '#052447',
                    border: '1px solid #1E4D6B',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    transition: 'all 0.3s'
                  }}
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

              {/* Location Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '11px', fontWeight: '900', color: '#A1A5B1', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  📍 Impact Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="District name, landmark, or area..."
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    backgroundColor: '#052447',
                    border: '1px solid #1E4D6B',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    transition: 'all 0.3s'
                  }}
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
                disabled={isSubmitting || !content || !location}
                style={{
                  width: '100%',
                  padding: '16px',
                  marginTop: '12px',
                  backgroundColor: isSubmitting || !content || !location ? '#2A5F7F' : '#00D9FF',
                  color: '#000000',
                  fontSize: '13px',
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: isSubmitting || !content || !location ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 12px rgba(0, 217, 255, 0.3)',
                  opacity: isSubmitting || !content || !location ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting && content && location) {
                    e.target.style.boxShadow = '0 6px 16px rgba(0, 217, 255, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting && content && location) {
                    e.target.style.boxShadow = '0 4px 12px rgba(0, 217, 255, 0.3)';
                  }
                }}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                    SUBMITTING
                  </>
                ) : (
                  <>
                    <Send style={{ width: '16px', height: '16px' }} />
                    INITIATE CLOUD SYNC
                  </>
                )}
              </button>

              {/* Status Messages */}
              {status === 'success' && (
                <div style={{
                  padding: '14px 16px',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '10px',
                  color: '#10B981',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  animation: 'fadeIn 0.3s'
                }}>
                  <CheckCircle style={{ width: '18px', height: '18px' }} />
                  Report broadcast successfully!
                </div>
              )}

              {status === 'queued' && (
                <div style={{
                  padding: '14px 16px',
                  backgroundColor: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '10px',
                  color: '#F59E0B',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <RefreshCw style={{ width: '18px', height: '18px' }} />
                  Offline. Queued for sync when online.
                </div>
              )}
            </form>
          </div>

          {/* AI Suggestion */}
          {suggestion && (
            <div style={{
              backgroundColor: 'rgba(255, 107, 107, 0.1)',
              borderRadius: '12px',
              padding: '24px',
              border: '2px solid #FF6B6B',
              boxShadow: '0 4px 12px rgba(255, 107, 107, 0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <BrainCircuit style={{ width: '20px', height: '20px', color: '#FF6B6B' }} />
                <h3 style={{ fontSize: '13px', fontWeight: '900', color: '#FF6B6B', textTransform: 'uppercase', margin: 0 }}>🤖 AI Alert Suggestion</h3>
                <span style={{ marginLeft: 'auto', fontSize: '10px', fontWeight: '900', backgroundColor: '#FF6B6B', color: 'white', padding: '6px 12px', borderRadius: '20px' }}>URGENT</span>
              </div>
              <p style={{ fontSize: '14px', color: '#E2E8F0', marginBottom: '16px', lineHeight: '1.6', margin: '0 0 16px 0' }}>
                Based on your report and nearby data, the system suggests triggering a <strong>"{suggestion.title}"</strong> alert. This will escalate to the regional mesh network.
              </p>
              <button style={{
                padding: '12px 20px',
                backgroundColor: '#FF6B6B',
                color: 'white',
                fontSize: '11px',
                fontWeight: '900',
                textTransform: 'uppercase',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.boxShadow = '0 6px 16px rgba(255, 107, 107, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = '0 4px 12px rgba(255, 107, 107, 0.3)';
              }}>
                Elevate Alert
              </button>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
          
          {/* One-Tap Emergency Button */}
          <div style={{
            backgroundColor: '#0A3B5C',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #1E4D6B',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertTriangle style={{ width: '18px', height: '18px', color: '#FF6B6B' }} />
              <h3 style={{ fontSize: '12px', fontWeight: '900', color: '#FF6B6B', textTransform: 'uppercase', margin: 0 }}>One-Tap Mode</h3>
            </div>
            <p style={{ fontSize: '12px', color: '#A1A5B1', lineHeight: '1.5', margin: 0 }}>
              In high-stress situations, use the emergency trigger to send a critical signal with location data instantly.
            </p>
            <button
              onClick={triggerOneTap}
              disabled={oneTapMode}
              style={{
                width: '100%',
                padding: '24px',
                backgroundColor: oneTapMode ? '#2A5F7F' : '#FF6B6B',
                color: 'white',
                fontSize: '13px',
                fontWeight: '900',
                textTransform: 'uppercase',
                borderRadius: '10px',
                border: 'none',
                cursor: oneTapMode ? 'not-allowed' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                transition: 'all 0.3s',
                boxShadow: oneTapMode ? 'none' : '0 4px 12px rgba(255, 107, 107, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!oneTapMode) {
                  e.target.style.boxShadow = '0 6px 16px rgba(255, 107, 107, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (!oneTapMode) {
                  e.target.style.boxShadow = '0 4px 12px rgba(255, 107, 107, 0.3)';
                }
              }}
            >
              <ShieldAlert style={{ width: '32px', height: '32px' }} />
              <span>{oneTapMode ? '⚡ SIGNAL SENT' : '🚨 TRIGGER SIGNAL'}</span>
            </button>
          </div>

          {/* Mesh Reach Info */}
          <div style={{
            backgroundColor: '#0A3B5C',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #1E4D6B',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Radio style={{ width: '16px', height: '16px', color: '#00D9FF' }} />
              <span style={{ fontSize: '11px', fontWeight: '900', color: '#00D9FF', textTransform: 'uppercase' }}>Mesh Reach</span>
            </div>
            <p style={{ fontSize: '12px', color: '#A1A5B1', fontStyle: 'italic', lineHeight: '1.5', margin: 0 }}>
              "Your report jumps across local nodes instantly, even if central hub is unreachable."
            </p>
          </div>

          {/* Tips Card */}
          <div style={{
            backgroundColor: 'rgba(0, 217, 255, 0.1)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(0, 217, 255, 0.2)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}>
            <h4 style={{ fontSize: '11px', fontWeight: '900', color: '#00D9FF', textTransform: 'uppercase', marginBottom: '12px', margin: '0 0 12px 0' }}>💡 Tips</h4>
            <ul style={{ fontSize: '11px', color: '#A1A5B1', lineHeight: '1.6', paddingLeft: '16px', margin: 0 }}>
              <li>Be specific with location names</li>
              <li>Include affected populations if known</li>
              <li>Update if situation evolves</li>
            </ul>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}} />
    </div>
  );
};

export default ReportIncident;
