import React from 'react';
import { ShieldAlert, Zap, Radio, Volume2 } from 'lucide-react';
import { speak } from '../utils/voice';

const S = {
  glass: { background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)' },
  red: '#EF4444',
  amber: '#F59E0B',
};

const HeroAlert = ({ alert }) => {
  if (!alert) return null;

  const handleSpeak = () => {
    speak(`${alert.title}. ${alert.message}`);
  };

  return (
    <div style={{
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 40,
      background: S.red,
      padding: 4,
      boxShadow: '0 0 40px rgba(239,68,68,0.4)',
      marginBottom: 40
    }}>
      {/* Background Pulse */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(255,255,255,0.1)',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }} />
      
      <div style={{
        ...S.glass,
        borderRadius: 38,
        padding: 32,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 32,
        border: 'none',
        position: 'relative'
      }}>
        <div style={{
          padding: 28,
          borderRadius: 24,
          background: 'rgba(255,255,255,0.2)',
          animation: 'bounce 1s ease infinite',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          flexShrink: 0
        }}>
          <ShieldAlert style={{ width: 64, height: 64, color: 'white' }} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
            <span style={{
              padding: '8px 16px',
              borderRadius: 999,
              background: 'white',
              fontSize: 10,
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: S.red,
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}>
              Critical Emergency
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>
              <Zap style={{ color: S.amber, fill: S.amber, width: 16, height: 16 }} />
              Impact Detected
            </span>
          </div>
          <h2 style={{
            fontSize: 48,
            fontWeight: 900,
            color: 'white',
            marginBottom: 16,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            margin: 0
          }}>
            {alert.title}
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: 16,
            lineHeight: 1.6,
            maxWidth: '100%',
            margin: 0
          }}>
            {alert.message}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>
           <button 
             onClick={handleSpeak}
             style={{
               padding: '16px 24px',
               borderRadius: 16,
               background: 'white',
               color: S.red,
               fontWeight: 900,
               display: 'flex',
               alignItems: 'center',
               gap: 12,
               boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
               cursor: 'pointer',
               border: 'none',
               whiteSpace: 'nowrap'
             }}
           >
             <Volume2 style={{ width: 20, height: 20 }} />
             Broadcast Aloud
           </button>
           <div style={{
             padding: '16px 24px',
             borderRadius: 16,
             background: 'rgba(0,0,0,0.2)',
             color: 'rgba(255,255,255,0.9)',
             fontSize: 14,
             fontWeight: 700,
             display: 'flex',
             alignItems: 'center',
             gap: 12,
             backdropFilter: 'blur(4px)',
             whiteSpace: 'nowrap'
           }}>
             <Radio style={{ width: 20, height: 20, color: '#34D399' }} />
             {alert.spreadCount || 1} Nodes Active
           </div>
        </div>
      </div>
    </div>
  );
};

export default HeroAlert;
