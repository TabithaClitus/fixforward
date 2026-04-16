import React from 'react';
import { Wifi, WifiOff, Server, Radio } from 'lucide-react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

const S = {
  teal: '#0D9488',
  red: '#EF4444',
  amber: '#F59E0B',
};

const NetworkIndicator = () => {
  const { isOnline, isLocalHub, mode } = useNetworkStatus();

  const getStatusContent = () => {
    switch (mode) {
      case 'CLOUD':
        return {
          icon: <Wifi style={{ color: '#34D399', width: 16, height: 16 }} />,
          text: 'Cloud Synchronized',
          style: { 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8, 
            padding: '6px 12px', 
            borderRadius: 999, 
            background: 'rgba(16,185,129,0.1)', 
            color: '#34D399', 
            border: '1px solid rgba(16,185,129,0.25)',
            fontSize: 12,
            fontWeight: 600
          }
        };
      case 'LOCAL_HUB':
        return {
          icon: <Server style={{ color: S.amber, width: 16, height: 16 }} />,
          text: 'Local Edge Server',
          style: { 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8, 
            padding: '6px 12px', 
            borderRadius: 999, 
            background: 'rgba(245,158,11,0.1)', 
            color: S.amber, 
            border: '1px solid rgba(245,158,11,0.25)',
            fontSize: 12,
            fontWeight: 600
          }
        };
      case 'MESH':
        return {
          icon: <Radio style={{ color: S.red, width: 16, height: 16, animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />,
          text: 'Mesh Network Mode',
          style: { 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8, 
            padding: '6px 12px', 
            borderRadius: 999, 
            background: 'rgba(239,68,68,0.1)', 
            color: S.red, 
            border: '1px solid rgba(239,68,68,0.25)',
            fontSize: 12,
            fontWeight: 600
          }
        };
      default:
        return {
          icon: <WifiOff style={{ color: '#94A3B8', width: 16, height: 16 }} />,
          text: 'Disconnected',
          style: { 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8, 
            padding: '6px 12px', 
            borderRadius: 999, 
            background: 'rgba(100,116,139,0.1)', 
            color: '#94A3B8', 
            border: '1px solid rgba(100,116,139,0.25)',
            fontSize: 12,
            fontWeight: 600
          }
        };
    }
  };

  const status = getStatusContent();

  return (
    <div style={status.style}>
      {status.icon}
      <span>{status.text}</span>
    </div>
  );
};

export default NetworkIndicator;
