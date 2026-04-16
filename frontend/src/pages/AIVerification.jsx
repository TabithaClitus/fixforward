import React, { useState } from 'react';
import { Search, ShieldCheck, AlertCircle, XCircle, RefreshCw, Zap, ShieldAlert, WifiOff } from 'lucide-react';
import { analyzeContentOffline } from '../services/AIClient';
import { Link } from 'react-router-dom';

const AIVerification = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOffline] = useState(!navigator.onLine);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!text) return;
    setLoading(true);

    setTimeout(() => {
      const analysis = analyzeContentOffline(text);
      setResult(analysis);
      setLoading(false);
    }, 800);
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
            <span style={{ fontSize: '10px', color: '#64748B', letterSpacing: '1px', textTransform: 'uppercase' }}>Content Verification</span>
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
                color: label === 'Check' ? '#00D9FF' : '#94A3B8',
                textDecoration: 'none',
                padding: '8px 12px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: label === 'Check' ? 'rgba(0, 217, 255, 0.1)' : 'transparent',
                transition: 'all 0.3s',
                cursor: 'pointer',
                border: label === 'Check' ? '1px solid rgba(0, 217, 255, 0.2)' : 'none'
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
        {/* Left Form Section */}
        <div style={{ flex: '1', marginRight: '32px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
          
          {/* Input Card */}
          <div style={{
            backgroundColor: '#0A3B5C',
            borderRadius: '12px',
            padding: '32px',
            border: '1px solid #1E4D6B',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#00D9FF', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '24px', margin: '0 0 24px 0' }}>🔍 Verify Content</h2>
            
            <form onSubmit={handleAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* textarea */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '11px', fontWeight: '900', color: '#A1A5B1', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  📝 Paste Message or News Snippet
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter content to verify... (messages, broadcasts, rumors, etc.)"
                  style={{
                    width: '100%',
                    minHeight: '160px',
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
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !text}
                style={{
                  width: '100%',
                  padding: '16px',
                  marginTop: '12px',
                  backgroundColor: loading || !text ? '#2A5F7F' : '#00D9FF',
                  color: '#000000',
                  fontSize: '13px',
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: loading || !text ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 12px rgba(0, 217, 255, 0.3)',
                  opacity: loading || !text ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                  if (!loading && text) {
                    e.target.style.boxShadow = '0 6px 16px rgba(0, 217, 255, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading && text) {
                    e.target.style.boxShadow = '0 4px 12px rgba(0, 217, 255, 0.3)';
                  }
                }}
              >
                {loading ? (
                  <>
                    <RefreshCw style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                    ANALYZING
                  </>
                ) : (
                  <>
                    <Search style={{ width: '16px', height: '16px' }} />
                    ANALYZE AUTHENTICITY
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Card */}
          {result && (
            <div style={{
              backgroundColor: result.classification === 'Verified' ? 'rgba(16, 185, 129, 0.1)' : result.classification === 'Suspicious' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255, 107, 107, 0.1)',
              borderRadius: '12px',
              padding: '32px',
              border: '2px solid ' + (result.classification === 'Verified' ? 'rgba(16, 185, 129, 0.3)' : result.classification === 'Suspicious' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(255, 107, 107, 0.3)'),
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              animation: 'fadeIn 0.5s'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '20px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: result.classification === 'Verified' ? 'rgba(16, 185, 129, 0.2)' : result.classification === 'Suspicious' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 107, 107, 0.2)',
                  color: result.classification === 'Verified' ? '#10B981' : result.classification === 'Suspicious' ? '#F59E0B' : '#FF6B6B'
                }}>
                  {result.classification === 'Verified' && <ShieldCheck style={{ width: '32px', height: '32px' }} />}
                  {result.classification === 'Suspicious' && <AlertCircle style={{ width: '32px', height: '32px' }} />}
                  {result.classification === 'Fake' && <XCircle style={{ width: '32px', height: '32px' }} />}
                </div>
                <div style={{ flex: '1' }}>
                  <p style={{ fontSize: '11px', fontWeight: '900', color: '#A1A5B1', textTransform: 'uppercase', letterSpacing: '1px', margin: 0, marginBottom: '4px' }}>Classification</p>
                  <h2 style={{
                    fontSize: '28px',
                    fontWeight: '900',
                    margin: 0,
                    marginBottom: '6px',
                    color: result.classification === 'Verified' ? '#10B981' : result.classification === 'Suspicious' ? '#F59E0B' : '#FF6B6B'
                  }}>
                    {result.classification}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#00D9FF' }}>
                    <Zap style={{ width: '14px', height: '14px' }} />
                    <span>Verified Locally (Offline Engine)</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '11px', fontWeight: '900', color: '#A1A5B1', textTransform: 'uppercase', letterSpacing: '1px', margin: 0, marginBottom: '4px' }}>Confidence</p>
                  <p style={{ fontSize: '24px', fontWeight: '900', color: 'white', margin: 0 }}>{(result.confidence * 100).toFixed(0)}%</p>
                </div>
              </div>

              <p style={{ fontSize: '14px', color: '#E2E8F0', lineHeight: '1.6', marginBottom: '20px' }}>
                {result.reason}
              </p>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button style={{
                  flex: '1',
                  padding: '12px 16px',
                  backgroundColor: '#1E4D6B',
                  color: '#A1A5B1',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  borderRadius: '8px',
                  border: '1px solid #1E4D6B',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#2A5F7F';
                  e.target.style.borderColor = '#00D9FF';
                  e.target.style.color = '#00D9FF';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#1E4D6B';
                  e.target.style.borderColor = '#1E4D6B';
                  e.target.style.color = '#A1A5B1';
                }}>
                  Flag as Incorrect
                </button>
                <button style={{
                  flex: '1',
                  padding: '12px 16px',
                  backgroundColor: '#1E4D6B',
                  color: '#A1A5B1',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  borderRadius: '8px',
                  border: '1px solid #1E4D6B',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#2A5F7F';
                  e.target.style.borderColor = '#00D9FF';
                  e.target.style.color = '#00D9FF';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#1E4D6B';
                  e.target.style.borderColor = '#1E4D6B';
                  e.target.style.color = '#A1A5B1';
                }}>
                  View Detailed Analysis
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
          
          {/* How It Works */}
          <div style={{
            backgroundColor: '#0A3B5C',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #1E4D6B',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{ fontSize: '12px', fontWeight: '900', color: '#00D9FF', textTransform: 'uppercase', marginBottom: '16px', margin: '0 0 16px 0' }}>⚙️ How It Works</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ paddingBottom: '12px', borderBottom: '1px solid #1E4D6B' }}>
                <p style={{ fontSize: '11px', fontWeight: '900', color: '#00D9FF', textTransform: 'uppercase', margin: '0 0 6px 0' }}>Pattern Recognition</p>
                <p style={{ fontSize: '12px', color: '#A1A5B1', lineHeight: '1.5', margin: 0 }}>Analyzes linguistic styles, hyperbolic language, and disaster misinformation patterns.</p>
              </div>
              <div>
                <p style={{ fontSize: '11px', fontWeight: '900', color: '#00D9FF', textTransform: 'uppercase', margin: '0 0 6px 0' }}>Cross-Reference</p>
                <p style={{ fontSize: '12px', color: '#A1A5B1', lineHeight: '1.5', margin: 0 }}>Checks against verified broadcasts and known debunked rumors in the local database.</p>
              </div>
            </div>
          </div>

          {/* Verification Status */}
          <div style={{
            backgroundColor: 'rgba(0, 217, 255, 0.1)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(0, 217, 255, 0.2)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}>
            <h4 style={{ fontSize: '11px', fontWeight: '900', color: '#00D9FF', textTransform: 'uppercase', marginBottom: '12px', margin: '0 0 12px 0' }}>✓ Local Processing</h4>
            <p style={{ fontSize: '12px', color: '#A1A5B1', lineHeight: '1.5', margin: 0 }}>
              All verification happens on your device. No data is sent to external servers.
            </p>
          </div>

          {/* Classification Guide */}
          <div style={{
            backgroundColor: '#0A3B5C',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #1E4D6B',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}>
            <h4 style={{ fontSize: '11px', fontWeight: '900', color: '#00D9FF', textTransform: 'uppercase', marginBottom: '16px', margin: '0 0 16px 0' }}>📊 Classifications</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', flex: '0 0 auto' }}>✓</div>
                <div>
                  <p style={{ fontSize: '11px', fontWeight: '900', color: '#10B981', margin: '0 0 2px 0' }}>VERIFIED</p>
                  <p style={{ fontSize: '11px', color: '#A1A5B1', margin: 0 }}>Content matches verified sources</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', flex: '0 0 auto' }}>!</div>
                <div>
                  <p style={{ fontSize: '11px', fontWeight: '900', color: '#F59E0B', margin: '0 0 2px 0' }}>SUSPICIOUS</p>
                  <p style={{ fontSize: '11px', color: '#A1A5B1', margin: 0 }}>May contain unverified claims</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: 'rgba(255, 107, 107, 0.2)', color: '#FF6B6B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', flex: '0 0 auto' }}>✕</div>
                <div>
                  <p style={{ fontSize: '11px', fontWeight: '900', color: '#FF6B6B', margin: '0 0 2px 0' }}>FAKE</p>
                  <p style={{ fontSize: '11px', color: '#A1A5B1', margin: 0 }}>Confirmed misinformation detected</p>
                </div>
              </div>
            </div>
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

export default AIVerification;
