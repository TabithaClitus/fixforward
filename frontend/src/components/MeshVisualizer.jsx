import React, { useEffect, useState } from 'react';
import { Share2, Zap } from 'lucide-react';

const S = {
  teal: '#0D9488',
  amber: '#F59E0B',
  amberBg: 'rgba(245,158,11,0.1)',
};

const MeshVisualizer = ({ activeNodes }) => {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => (p + 1) % 4);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'relative',
      height: 96,
      width: '100%',
      borderRadius: 24,
      overflow: 'hidden',
      padding: 16,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 24,
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.1)',
    }}>
      {/* Simulation Grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.1,
        pointerEvents: 'none',
        backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative', zIndex: 10 }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            padding: 12,
            borderRadius: '50%',
            background: S.teal,
            color: 'white',
            boxShadow: '0 0 20px rgba(13,148,136,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Share2 style={{ width: 20, height: 20 }} />
          </div>
          {/* Pulsing rings */}
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: `1px solid ${S.teal}`,
                opacity: pulse === i ? 0 : 0.3,
                transform: pulse === i ? 'scale(2.5)' : 'scale(1)',
                transition: 'all 0.8s',
                boxShadow: pulse === i ? 'none' : '0 0 10px rgba(13,148,136,0.6)'
              }}
            />
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 10, fontWeight: 900, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.2em', lineHeight: 1.2 }}>Mesh Propagation Active</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20, fontWeight: 900, color: 'white' }}>{activeNodes} Local Nodes</span>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
          </div>
        </div>
      </div>

      <div style={{ height: '100%', width: 1, background: 'rgba(255,255,255,0.1)', margin: '0 8px' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ padding: 8, borderRadius: 12, background: S.amberBg, color: S.amber }}>
          <Zap style={{ width: 16, height: 16 }} />
        </div>
        <div>
           <p style={{ fontSize: 9, fontWeight: 900, color: '#475569', textTransform: 'uppercase', margin: '0 0 2px 0' }}>Spread Speed</p>
           <p style={{ fontSize: 14, fontWeight: 900, color: 'white', margin: 0 }}>1.2s avg/hop</p>
        </div>
      </div>
    </div>
  );
};

export default MeshVisualizer;
