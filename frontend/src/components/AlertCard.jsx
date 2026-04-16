import React from 'react';
import { AlertCircle, Clock, Volume2, Share2, ShieldCheck, TrendingUp, Info, Activity, BrainCircuit, Fingerprint, Building2 } from 'lucide-react';
import { speak } from '../utils/voice';
import { getTrustScore, analyzeContentWithEvolution, getAuthoritySigil } from '../services/AIClient';
import ActionEngine from './ActionEngine';

const S = {
  glass: { background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)' },
  teal: '#0D9488',
  red: '#EF4444',
  amber: '#F59E0B',
  redBg: 'rgba(239,68,68,0.1)',
  amberBg: 'rgba(245,158,11,0.1)',
  tealBg: 'rgba(13,148,136,0.1)',
};

const AlertCard = ({ alert, onShare }) => {
  const trustScore = getTrustScore(alert);
  const sigil = getAuthoritySigil(alert);
  const analysis = analyzeContentWithEvolution(alert);
  const [showXAI, setShowXAI] = React.useState(false);
  
  React.useEffect(() => {
    if (alert.priority === 'High' && !alert._voiced) {
      handleSpeak();
      alert._voiced = true;
    }
  }, []);

  const getPriorityStyle = () => {
    switch (alert.priority.toUpperCase()) {
      case 'HIGH': return { borderColor: S.red, textColor: S.red, bgColor: S.redBg };
      case 'MEDIUM': return { borderColor: S.amber, textColor: S.amber, bgColor: S.amberBg };
      default: return { borderColor: S.teal, textColor: S.teal, bgColor: S.tealBg };
    }
  };

  const priorityStyle = getPriorityStyle();

  const handleSpeak = () => {
    const text = `${alert.title}. ${alert.message}`;
    speak(text);
  };

  return (
    <div style={{
      ...S.glass,
      padding: 24,
      borderRadius: 16,
      borderLeft: `4px solid ${priorityStyle.borderColor}`,
      marginBottom: 16,
      transition: 'transform 0.2s'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, color: 'white', flex: 1, margin: 0 }}>
          <AlertCircle style={{ width: 20, height: 20, flexShrink: 0 }} />
          {alert.title}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
          <span style={{
            padding: '6px 12px',
            borderRadius: 4,
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: priorityStyle.textColor,
            backgroundColor: priorityStyle.bgColor,
            border: `1px solid ${priorityStyle.borderColor}`,
            margin: 0
          }}>
            {alert.priority}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, color: '#475569' }}>
            <TrendingUp style={{ color: S.teal, width: 12, height: 12 }} />
            {alert.spreadCount || 1} Nodes
          </div>
        </div>
      </div>

      {sigil && (
        <div style={{
          marginBottom: 16,
          padding: 12,
          borderRadius: 12,
          background: 'rgba(16,185,129,0.1)',
          border: '1px solid rgba(16,185,129,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          animation: 'slideInRight 0.7s ease'
        }}>
           <Building2 style={{ color: '#34D399', width: 20, height: 20, flexShrink: 0 }} />
           <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 10, fontWeight: 900, color: '#34D399', textTransform: 'uppercase', lineHeight: 1.2, marginBottom: 4, margin: 0 }}>{sigil.label}</p>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{sigil.org}</p>
           </div>
           <div style={{ padding: '4px 12px', borderRadius: '50%', background: '#34D399', color: 'white', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', flexShrink: 0 }}>
             {sigil.status}
           </div>
        </div>
      )}

      <p style={{ color: '#cbd5e1', fontSize: 16, lineHeight: 1.6, marginBottom: 20, margin: 0, paddingBottom: 20 }}>
        {alert.message}
      </p>

      <ActionEngine alert={alert} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20, marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => setShowXAI(!showXAI)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              padding: 6,
              borderRadius: '50%',
              background: trustScore > 75 ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
              color: trustScore > 75 ? '#34D399' : S.red,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
               <ShieldCheck style={{ width: 18, height: 18 }} />
            </div>
            <span style={{ fontSize: 10, fontWeight: 900, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              AI Trust Index: {trustScore}%
            </span>
          </div>
           <span style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4, color: S.teal }}>
             {showXAI ? 'Hide' : 'Explain'} 
             <Info style={{ width: 16, height: 16 }} />
          </span>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.05)', height: 8, borderRadius: 999, overflow: 'hidden' }}>
          <div 
            style={{
              height: '100%',
              width: `${trustScore}%`,
              background: trustScore > 80 ? '#34D399' : trustScore > 50 ? S.amber : S.red,
              transition: 'all 1s',
              borderRadius: 999
            }}
          />
        </div>

        {showXAI && analysis && (
          <div style={{ padding: 16, borderRadius: 16, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 12, animation: 'slideInDown 0.3s ease' }}>
            <XAIScoreBar label="Source Reliability" value={analysis.breakdown.source} icon={<Fingerprint style={{ width: 16, height: 16 }} />} />
            <XAIScoreBar label="Pattern Correlation" value={analysis.breakdown.pattern} icon={<Activity style={{ width: 16, height: 16 }} />} />
            <XAIScoreBar label="Linguistic Context" value={analysis.breakdown.linguistic} icon={<BrainCircuit style={{ width: 16, height: 16 }} />} />
            <p style={{ fontSize: 10, color: '#94A3B8', fontWeight: 500, fontStyle: 'italic', marginTop: 12, marginBottom: 0, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.05)', margin: 0 }}>
              Analysis provided by local Decentralized Intelligence Hub.
            </p>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: '#94A3B8' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 500 }}>
            <Clock style={{ width: 16, height: 16 }} />
            {new Date(alert.timestamp).toLocaleTimeString()}
          </span>
          {alert.verified && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 500, color: 'rgba(52,212,168,0.8)' }}>
              <ShieldCheck style={{ width: 16, height: 16 }} />
              Verified Official
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button 
            onClick={handleSpeak}
            style={{
              padding: 10,
              borderRadius: '50%',
              background: 'transparent',
              color: '#94A3B8',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94A3B8'; }}
            title="Read Aloud"
          >
            <Volume2 style={{ width: 20, height: 20 }} />
          </button>
          <button 
            onClick={() => onShare && onShare(alert)}
            style={{
              padding: 10,
              borderRadius: '50%',
              background: 'transparent',
              color: '#94A3B8',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94A3B8'; }}
            title="Propagate via Mesh"
          >
            <Share2 style={{ width: 20, height: 20 }} />
          </button>
        </div>
      </div>
    </div>
  );
};

const XAIScoreBar = ({ label, value, icon }) => (
  <div style={{ flex: 1 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {icon}
        <span style={{ fontSize: 10, fontWeight: 900, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</span>
      </div>
      <span style={{ fontSize: 10, fontWeight: 900, color: 'white' }}>{value}%</span>
    </div>
    <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 999, overflow: 'hidden' }}>
      <div 
        style={{
          height: '100%',
          background: S.teal,
          transition: 'all 1s',
          borderRadius: 999,
          width: `${value}%`
        }}
      />
    </div>
  </div>
);

export default AlertCard;
