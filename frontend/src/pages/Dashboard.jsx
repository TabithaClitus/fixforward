import React, { useState, useEffect } from 'react';
import { 
  Radio, ShieldAlert, WifiOff, Cloud, RefreshCw, Share2, AlertCircle 
} from 'lucide-react';
import { getCachedAlerts, saveAlert } from '../services/OfflineStore';
import { subscribeToMesh, broadcastToMesh, getMeshStats } from '../services/MeshNetwork';
import { analyzeContentOffline } from '../services/AIClient';
import { useAlertEngine } from '../hooks/useAlertEngine';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const meshStats = getMeshStats();
  const { processedAlerts, criticalAlert } = useAlertEngine(alerts);

  const fetchAlerts = async () => {
    try {
      setError(null);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await axios.get(`${apiUrl}/alerts`);
      setAlerts(response.data || []);
      if (response.data) {
        response.data.forEach(a => saveAlert(a));
      }
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
      try {
        const cached = await getCachedAlerts();
        setAlerts(cached || []);
        if (!isOffline) {
          setError('Backend unavailable. Showing cached data.');
        }
      } catch (cacheErr) {
        setError('Unable to load alerts.');
        setAlerts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const unsubscribe = subscribeToMesh((payload) => {
      if (payload.type === 'NEW_ALERT' || payload.type === 'MESH_PROPAGATE') {
        setAlerts(prev => {
          if (prev.find(a => a.id === payload.data.id)) return prev;
          return [payload.data, ...prev];
        });
        saveAlert(payload.data);
      }
    });

    const handleNetworkChange = () => setIsOffline(!navigator.onLine);
    window.addEventListener('online', handleNetworkChange);
    window.addEventListener('offline', handleNetworkChange);

    return () => {
      unsubscribe();
      window.removeEventListener('online', handleNetworkChange);
      window.removeEventListener('offline', handleNetworkChange);
    };
  }, []);

  const handlePropagate = (alert) => {
    broadcastToMesh('MESH_PROPAGATE', alert);
  };

  const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  const criticalCount = alerts.filter(a => a.priority === 'High').length;
  const activeNodePercent = Math.min(100, (meshStats.activeNodes / 10) * 100);

  if (loading) {
    return (
      <div style={{ width: '100vw', height: '100vh', backgroundColor: '#0A0E27', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <RefreshCw style={{ width: '48px', height: '48px', color: '#14B8A6', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: '#94A3B8', fontWeight: 'bold' }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0F172A' }}>
      {/* Error Banner */}
      {error && (
        <div style={{ backgroundColor: '#7F1D1D', borderBottom: '1px solid #B91C1C', padding: '12px 32px', fontSize: '14px', fontWeight: 'bold', color: '#FECACA' }}>
          ⚠️ {error}
        </div>
      )}

      {/* UNIFIED HEADER */}
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
        {/* Logo + Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '200px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'linear-gradient(135deg, #00D9FF 0%, #0099CC 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0, 217, 255, 0.3)' }}>
            <ShieldAlert style={{ width: '24px', height: '24px', color: 'white' }} />
          </div>
          <div>
            <span style={{ fontSize: '22px', fontWeight: '900', color: '#00D9FF', letterSpacing: '2px', display: 'block' }}>SCCIN</span>
            <span style={{ fontSize: '10px', color: '#64748B', letterSpacing: '1px', textTransform: 'uppercase' }}>Disaster Intelligence</span>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ display: 'flex', gap: '24px', alignItems: 'center', flex: '1', justifyContent: 'center' }}>
          {[
            { label: 'Feed', icon: '📡' },
            { label: 'Report', icon: '📋' },
            { label: 'Check', icon: '✓' },
            { label: 'Admin', icon: '⚙️' },
            { label: 'Settings', icon: '🔧' }
          ].map(({ label, icon }) => (
            <button
              key={label}
              style={{
                fontSize: '13px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                color: '#94A3B8',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s',
                padding: '8px 12px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#00D9FF';
                e.target.style.backgroundColor = 'rgba(0, 217, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#94A3B8';
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {/* Status Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', minWidth: '200px', justifyContent: 'flex-end' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            fontSize: '12px', 
            fontWeight: 'bold',
            padding: '6px 12px',
            borderRadius: '6px',
            backgroundColor: isOffline ? 'rgba(239, 68, 68, 0.15)' : 'rgba(0, 217, 255, 0.15)',
            color: isOffline ? '#EF4444' : '#00D9FF'
          }}>
            {isOffline ? (
              <>
                <WifiOff style={{ width: '16px', height: '16px' }} />
                <span>OFFLINE</span>
              </>
            ) : (
              <>
                <Cloud style={{ width: '16px', height: '16px' }} />
                <span>SYNCED</span>
              </>
            )}
          </div>
          <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 'bold', letterSpacing: '1px' }}>{currentTime}</span>
        </div>
      </header>

      {/* Main Content - 3 Column Layout */}
      <div style={{ flex: '1', display: 'flex', overflow: 'hidden' }}>
        {/* LEFT SIDEBAR */}
        <div style={{ width: '340px', borderRight: '2px solid #1E293B', backgroundColor: '#001F3F', overflow: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Quick Stats */}
          <div style={{ backgroundColor: '#0A3B5C', borderRadius: '10px', padding: '20px', border: '1px solid #1E4D6B', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' }}>
            <h3 style={{ fontSize: '11px', fontWeight: '900', color: '#00D9FF', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '16px', margin: '0 0 16px 0' }}>📊 Quick Stats</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#A1A5B1' }}>Active Alerts</span>
                <span style={{ fontSize: '18px', fontWeight: '900', color: '#00D9FF' }}>{alerts.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#A1A5B1' }}>Critical</span>
                <span style={{ fontSize: '18px', fontWeight: '900', color: criticalCount > 0 ? '#FF6B6B' : '#00D9FF' }}>{criticalCount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#A1A5B1' }}>Queued</span>
                <span style={{ fontSize: '18px', fontWeight: '900', color: '#FFD700' }}>{processedAlerts?.length || 0}</span>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div style={{ backgroundColor: '#0A3B5C', borderRadius: '10px', padding: '20px', border: '1px solid #1E4D6B', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' }}>
            <h3 style={{ fontSize: '11px', fontWeight: '900', color: '#00D9FF', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '16px', margin: '0 0 16px 0' }}>🔗 System Status</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <p style={{ fontSize: '11px', color: '#64748B', marginBottom: '4px', margin: '0 0 4px 0' }}>Central Link</p>
                <p style={{ fontSize: '13px', fontWeight: 'bold', color: isOffline ? '#FF6B6B' : '#00D9FF', margin: 0 }}>{isOffline ? 'Severed' : 'Active'}</p>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: '#64748B', marginBottom: '4px', margin: '0 0 4px 0' }}>Mesh Network</p>
                <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#00D9FF', margin: 0 }}>{meshStats.activeNodes > 0 ? 'Active' : 'Idle'}</p>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: '#64748B', marginBottom: '4px', margin: '0 0 4px 0' }}>Edge Hub</p>
                <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#00D9FF', margin: 0 }}>{activeNodePercent.toFixed(0)}%</p>
              </div>
            </div>
          </div>

          {/* Mesh Health */}
          <div style={{ backgroundColor: '#0A3B5C', borderRadius: '10px', padding: '20px', border: '1px solid #1E4D6B', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' }}>
            <h3 style={{ fontSize: '11px', fontWeight: '900', color: '#00D9FF', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '16px', margin: '0 0 16px 0' }}>🌐 Mesh Health</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', color: '#A1A5B1' }}>Network</span>
                <span style={{ fontSize: '13px', fontWeight: '900', color: '#00D9FF' }}>{activeNodePercent.toFixed(0)}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#1E4D6B', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'linear-gradient(90deg, #00D9FF 0%, #0099CC 100%)', width: `${activeNodePercent}%`, transition: 'width 0.3s' }} />
              </div>
              <p style={{ fontSize: '11px', color: '#A1A5B1', margin: 0 }}>{meshStats.activeNodes} nodes connected</p>
            </div>
          </div>

          {/* Report Button */}
          <Link
            to="/report"
            style={{
              padding: '14px 16px',
              background: 'linear-gradient(135deg, #FF6B6B 0%, #CC3333 100%)',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '13px',
              borderRadius: '8px',
              textAlign: 'center',
              textDecoration: 'none',
              display: 'block',
              cursor: 'pointer',
              transition: 'all 0.3s',
              border: 'none',
              boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)',
              marginTop: 'auto'
            }}
            onMouseEnter={(e) => e.target.style.boxShadow = '0 6px 16px rgba(255, 107, 107, 0.5)'}
            onMouseLeave={(e) => e.target.style.boxShadow = '0 4px 12px rgba(255, 107, 107, 0.3)'}
          >
            🚨 Report Emergency
          </Link>
        </div>

        {/* CENTER PANEL */}
        <div style={{ flex: '1', borderRight: '2px solid #1E293B', backgroundColor: '#0F172A', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '24px', gap: '20px' }}>
          {/* Hero Alert */}
          {criticalAlert ? (
            <div style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.15) 0%, rgba(204, 51, 51, 0.15) 100%)', border: '2px solid #FF6B6B', borderRadius: '12px', boxShadow: '0 4px 12px rgba(255, 107, 107, 0.2)' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <AlertCircle style={{ width: '28px', height: '28px', color: '#FF6B6B', flex: '0 0 auto', marginTop: '2px' }} />
                <div style={{ flex: '1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#FFFFFF', margin: 0 }}>{criticalAlert.title}</h2>
                    <span style={{ padding: '6px 14px', background: 'linear-gradient(135deg, #FF6B6B 0%, #CC3333 100%)', color: 'white', fontSize: '11px', fontWeight: 'bold', borderRadius: '6px' }}>CRITICAL</span>
                  </div>
                  <p style={{ fontSize: '14px', color: '#E2E8F0', marginBottom: '12px', margin: '0 0 12px 0' }}>{criticalAlert.message?.substring(0, 150)}</p>
                  <div style={{ display: 'flex', gap: '24px', fontSize: '12px', color: '#94A3B8' }}>
                    <span>📍 {criticalAlert.location || 'Multiple'}</span>
                    <span>⏰ {new Date(criticalAlert.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ height: '128px', backgroundColor: '#0A3B5C', borderRadius: '12px', border: '2px solid #1E4D6B', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Radio style={{ width: '32px', height: '32px', color: '#1E4D6B', marginBottom: '8px' }} />
              <p style={{ fontSize: '13px', color: '#64748B', fontWeight: 'bold', margin: 0 }}>✓ ALL CLEAR</p>
            </div>
          )}

          {/* Alert Feed */}
          <div style={{ flex: '1', display: 'flex', flexDirection: 'column', minHeight: 0, backgroundColor: '#0A3B5C', borderRadius: '12px', border: '1px solid #1E4D6B', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' }}>
            <div style={{ flex: '0 0 auto', padding: '16px 20px', borderBottom: '1px solid #1E4D6B', backgroundColor: '#052447' }}>
              <h3 style={{ fontSize: '11px', fontWeight: '900', color: '#00D9FF', textTransform: 'uppercase', letterSpacing: '1.5px', margin: 0 }}>
                📡 Alert Feed ({processedAlerts?.length || 0})
              </h3>
            </div>
            <div style={{ flex: '1', overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {processedAlerts && processedAlerts.length > 0 ? (
                processedAlerts.slice(0, 12).map(alert => (
                  <AlertItemCompact
                    key={alert.id}
                    alert={alert}
                    onPropagate={() => handlePropagate(alert)}
                  />
                ))
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748B', fontSize: '13px' }}>
                  No alerts
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ width: '340px', backgroundColor: '#001F3F', overflow: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* AI Insights */}
          <div style={{ backgroundColor: '#0A3B5C', borderRadius: '10px', padding: '20px', border: '1px solid #1E4D6B', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' }}>
            <h3 style={{ fontSize: '11px', fontWeight: '900', color: '#00D9FF', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '16px', margin: '0 0 16px 0' }}>🤖 AI Insights</h3>
            {criticalAlert ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', color: '#A1A5B1' }}>Trust Score</span>
                    <span style={{ fontSize: '13px', fontWeight: '900', color: '#00D9FF' }}>92%</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#1E4D6B', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: 'linear-gradient(90deg, #00D9FF 0%, #0099CC 100%)', width: '75%' }} />
                  </div>
                </div>
                <button style={{ width: '100%', padding: '10px', fontSize: '12px', fontWeight: 'bold', backgroundColor: '#1E4D6B', color: '#00D9FF', border: '1px solid #1E4D6B', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={(e) => { e.target.backgroundColor = '#2A5F7F'; e.target.boxShadow = '0 4px 12px rgba(0, 217, 255, 0.2)'; }} onMouseLeave={(e) => { e.target.backgroundColor = '#1E4D6B'; e.target.boxShadow = 'none'; }}>
                  Analyze Report
                </button>
              </div>
            ) : (
              <p style={{ fontSize: '12px', color: '#A1A5B1', margin: 0 }}>No critical alert</p>
            )}
          </div>

          {/* Actions */}
          <div style={{ backgroundColor: '#0A3B5C', borderRadius: '10px', padding: '20px', border: '1px solid #1E4D6B', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' }}>
            <h3 style={{ fontSize: '11px', fontWeight: '900', color: '#00D9FF', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '16px', margin: '0 0 16px 0' }}>⚡ Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { icon: '📍', label: 'View Location' },
                { icon: '👥', label: 'Notify Responders' },
                { icon: '📣', label: 'Broadcast Update' },
                { icon: '✓', label: 'Verify Content' }
              ].map((action, i) => (
                <button
                  key={i}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    backgroundColor: '#1E4D6B',
                    color: '#A1A5B1',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    borderRadius: '8px',
                    border: '1px solid #1E4D6B',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#2A5F7F';
                    e.target.style.color = '#00D9FF';
                    e.target.style.borderColor = '#00D9FF';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#1E4D6B';
                    e.target.style.color = '#A1A5B1';
                    e.target.style.borderColor = '#1E4D6B';
                  }}
                >
                  <span>{action.icon}</span>
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Telemetry */}
          <div style={{ backgroundColor: '#0A3B5C', borderRadius: '10px', padding: '20px', border: '1px solid #1E4D6B', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' }}>
            <h3 style={{ fontSize: '11px', fontWeight: '900', color: '#00D9FF', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '16px', margin: '0 0 16px 0' }}>📊 Telemetry</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', color: '#A1A5B1' }}>Nodes</span>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#00D9FF' }}>{meshStats.activeNodes}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', color: '#A1A5B1' }}>Spread Speed</span>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#00D9FF' }}>1.2s</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', color: '#A1A5B1' }}>Load</span>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#FFD700' }}>42%</span>
              </div>
            </div>
          </div>

          {/* Offline Status */}
          {isOffline && (
            <div style={{ backgroundColor: 'rgba(255, 107, 107, 0.15)', border: '1px solid #FF6B6B', borderRadius: '10px', padding: '16px', boxShadow: '0 4px 12px rgba(255, 107, 107, 0.2)' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#FF6B6B', margin: '0 0 4px 0' }}>⚠️ OFFLINE MODE</p>
              <p style={{ fontSize: '11px', color: '#FFA5A5', margin: 0 }}>Using local mesh network</p>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ width: '340px', backgroundColor: '#001F3F', overflow: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* AI Insights */}
          <div style={{ backgroundColor: '#0A3B5C', borderRadius: '10px', padding: '20px', border: '1px solid #1E4D6B', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' }}>
            <h3 style={{ fontSize: '11px', fontWeight: '900', color: '#00D9FF', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '16px', margin: '0 0 16px 0' }}>🤖 AI Insights</h3>
            {criticalAlert ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', color: '#A1A5B1' }}>Trust Score</span>
                    <span style={{ fontSize: '13px', fontWeight: '900', color: '#00D9FF' }}>92%</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#1E4D6B', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: 'linear-gradient(90deg, #00D9FF 0%, #0099CC 100%)', width: '75%' }} />
                  </div>
                </div>
                <button style={{ width: '100%', padding: '10px', fontSize: '12px', fontWeight: 'bold', backgroundColor: '#1E4D6B', color: '#00D9FF', border: '1px solid #1E4D6B', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={(e) => { e.target.style.backgroundColor = '#2A5F7F'; e.target.style.boxShadow = '0 4px 12px rgba(0, 217, 255, 0.2)'; }} onMouseLeave={(e) => { e.target.style.backgroundColor = '#1E4D6B'; e.target.style.boxShadow = 'none'; }}>
                  Analyze Report
                </button>
              </div>
            ) : (
              <p style={{ fontSize: '12px', color: '#A1A5B1', margin: 0 }}>No critical alert</p>
            )}
          </div>

          {/* Actions */}
          <div style={{ backgroundColor: '#0A3B5C', borderRadius: '10px', padding: '20px', border: '1px solid #1E4D6B', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' }}>
            <h3 style={{ fontSize: '11px', fontWeight: '900', color: '#00D9FF', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '16px', margin: '0 0 16px 0' }}>⚡ Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { icon: '📍', label: 'View Location' },
                { icon: '👥', label: 'Notify Responders' },
                { icon: '📣', label: 'Broadcast Update' },
                { icon: '✓', label: 'Verify Content' }
              ].map((action, i) => (
                <button
                  key={i}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    backgroundColor: '#1E4D6B',
                    color: '#A1A5B1',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    borderRadius: '8px',
                    border: '1px solid #1E4D6B',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#2A5F7F';
                    e.target.style.color = '#00D9FF';
                    e.target.style.borderColor = '#00D9FF';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#1E4D6B';
                    e.target.style.color = '#A1A5B1';
                    e.target.style.borderColor = '#1E4D6B';
                  }}
                >
                  <span>{action.icon}</span>
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Telemetry */}
          <div style={{ backgroundColor: '#0A3B5C', borderRadius: '10px', padding: '20px', border: '1px solid #1E4D6B', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' }}>
            <h3 style={{ fontSize: '11px', fontWeight: '900', color: '#00D9FF', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '16px', margin: '0 0 16px 0' }}>📊 Telemetry</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', color: '#A1A5B1' }}>Nodes</span>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#00D9FF' }}>{meshStats.activeNodes}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', color: '#A1A5B1' }}>Spread Speed</span>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#00D9FF' }}>1.2s</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', color: '#A1A5B1' }}>Load</span>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#FFD700' }}>42%</span>
              </div>
            </div>
          </div>

          {/* Offline Status */}
          {isOffline && (
            <div style={{ backgroundColor: 'rgba(255, 107, 107, 0.15)', border: '1px solid #FF6B6B', borderRadius: '10px', padding: '16px', boxShadow: '0 4px 12px rgba(255, 107, 107, 0.2)' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#FF6B6B', margin: '0 0 4px 0' }}>⚠️ OFFLINE MODE</p>
              <p style={{ fontSize: '11px', color: '#FFA5A5', margin: 0 }}>Using local mesh network</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* Alert Item Component */
const AlertItemCompact = ({ alert, onPropagate }) => {
  const priorityColor = {
    'High': '#FF6B6B',
    'Medium': '#FFD700',
    'Low': '#00D9FF'
  }[alert.priority] || '#00D9FF';

  return (
    <div style={{ padding: '12px', backgroundColor: '#052447', borderRadius: '8px', border: '1px solid #1E4D6B', cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)' }} onMouseEnter={(e) => { e.target.style.borderColor = '#00D9FF'; e.target.style.backgroundColor = '#0A3B5C'; e.target.style.boxShadow = '0 4px 12px rgba(0, 217, 255, 0.2)'; }} onMouseLeave={(e) => { e.target.style.borderColor = '#1E4D6B'; e.target.style.backgroundColor = '#052447'; e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)'; }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', flex: '0 0 auto', marginTop: '4px', backgroundColor: priorityColor, boxShadow: `0 0 8px ${priorityColor}` }} />
        <div style={{ flex: '1', minWidth: 0 }}>
          <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#FFFFFF', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{alert.title}</p>
          <p style={{ fontSize: '12px', color: '#A1A5B1', margin: '4px 0 0 0', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>{alert.message}</p>
          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '6px' }}>
            <span style={{ color: priorityColor, fontWeight: 'bold' }}>{alert.priority}</span> • {new Date(alert.timestamp).toLocaleTimeString()}
          </div>
        </div>
        <button
          onClick={() => onPropagate()}
          style={{
            flex: '0 0 auto',
            padding: '6px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#64748B',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.color = '#00D9FF'}
          onMouseLeave={(e) => e.target.style.color = '#64748B'}
          title="Share alert"
        >
          <Share2 style={{ width: '14px', height: '14px' }} />
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
