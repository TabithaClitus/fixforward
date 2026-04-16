import React from 'react';
import { Share2, Zap, Server, ShieldCheck, Activity, Wifi, WifiOff } from 'lucide-react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { getMeshStats } from '../services/MeshNetwork';

const S = {
  glass: { background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)' },
  teal: '#0D9488',
  red: '#EF4444',
  amber: '#F59E0B',
  tealBg: 'rgba(13,148,136,0.1)',
  tealBorder: 'rgba(13,148,136,0.3)',
};

const StatusPanel = () => {
  const { mode, isOnline } = useNetworkStatus();
  const stats = getMeshStats();

  return (
    <div style={{
      ...S.glass,
      padding: 32,
      borderRadius: 40,
      position: 'sticky',
      top: 96,
      display: 'flex',
      flexDirection: 'column',
      gap: 32,
      boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
      overflow: 'hidden'
    }}>
      {/* Background decoration */}
      <div style={{ position: 'absolute', top: 0, right: 0, padding: 16, opacity: 0.05 }}>
        <Activity style={{ width: 128, height: 128 }} />
      </div>

      <div style={{ position: 'relative', zIndex: 10 }}>
        <h3 style={{ fontSize: 18, fontWeight: 900, color: 'white', marginBottom: 28, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
          System Telemetry
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#34D399', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <StatRow 
            label="Central Link" 
            value={isOnline ? 'Online' : 'Offline'} 
            icon={isOnline ? <Wifi style={{ color: '#34D399', width: 16, height: 16 }} /> : <WifiOff style={{ color: S.red, width: 16, height: 16 }} />}
            status={isOnline ? 'ok' : 'error'}
          />
          <StatRow 
            label="Mesh Protocol" 
            value="Active (Layer-3)" 
            icon={<Share2 style={{ color: S.teal, width: 16, height: 16 }} />}
            status="ok"
          />
          <StatRow 
            label="Local Edge Hub" 
            value={mode === 'LOCAL_HUB' ? 'Connected' : 'Scanning...'} 
            icon={<Server style={{ color: S.amber, width: 16, height: 16 }} />}
            status={mode === 'LOCAL_HUB' ? 'ok' : 'warning'}
          />
        </div>
      </div>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />

      <div style={{ position: 'relative', zIndex: 10 }}>
        <p style={{ fontSize: 10, fontWeight: 900, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 20, margin: 0, paddingBottom: 20 }}>Decentralized Stats</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ padding: 16, borderRadius: 16, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)' }}>
             <p style={{ fontSize: 20, fontWeight: 900, color: 'white', marginBottom: 6, margin: 0 }}>{stats.activeNodes}</p>
             <p style={{ fontSize: 10, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.15em', margin: 0 }}>Nearby Nodes</p>
          </div>
          <div style={{ padding: 16, borderRadius: 16, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)' }}>
             <p style={{ fontSize: 20, fontWeight: 900, color: 'white', marginBottom: 6, margin: 0 }}>{(stats.reliabilityScore * 100).toFixed(0)}%</p>
             <p style={{ fontSize: 10, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.15em', margin: 0 }}>Mesh Health</p>
          </div>
        </div>
      </div>

      <div style={{
        padding: 16,
        borderRadius: 16,
        border: `1px solid ${S.tealBorder}`,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: S.tealBg,
        position: 'relative',
        zIndex: 10
      }}>
        <ShieldCheck style={{ color: S.teal, width: 20, height: 20, flexShrink: 0 }} />
        <div>
          <p style={{ fontSize: 10, fontWeight: 900, color: 'white', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4, margin: 0 }}>On-Device AI Active</p>
          <p style={{ fontSize: 10, color: '#94A3B8', lineHeight: 1.5, margin: 0 }}>Verification working 100% offline.</p>
        </div>
      </div>
    </div>
  );
};

const StatRow = ({ label, value, icon, status }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4, paddingBottom: 4 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
      <div style={{
        padding: 10,
        borderRadius: 8,
        transition: 'all 0.2s',
        background: status === 'ok' ? 'rgba(16,185,129,0.1)' : status === 'warning' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {icon}
      </div>
      <span style={{ fontSize: 14, fontWeight: 700, color: '#cbd5e1' }}>{label}</span>
    </div>
    <span style={{
      fontSize: 10,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      marginLeft: 12,
      color: status === 'ok' ? '#34D399' : status === 'warning' ? '#F59E0B' : '#EF4444'
    }}>
      {value}
    </span>
  </div>
);

export default StatusPanel;
