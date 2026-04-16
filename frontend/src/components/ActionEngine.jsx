import React from 'react';
import { ShieldAlert, ArrowUpCircle, Home, PhoneCall, Zap, Droplets, Wind, AlertTriangle } from 'lucide-react';

const ACTION_MAP = {
  flood: [
    { text: 'Move to higher ground immediately', icon: <ArrowUpCircle className="w-4 h-4" /> },
    { text: 'Avoid low-lying roads and underpasses', icon: <Droplets className="w-4 h-4" /> },
    { text: 'Shut off main gas and electrical valves', icon: <Zap className="w-4 h-4" /> }
  ],
  storm: [
    { text: 'Stay indoors away from windows', icon: <Home className="w-4 h-4" /> },
    { text: 'Secure loose outdoor items', icon: <Wind className="w-4 h-4" /> },
    { text: 'Charge all emergency communication devices', icon: <PhoneCall className="w-4 h-4" /> }
  ],
  general: [
    { text: 'Contact nearest District Authority Cell', icon: <PhoneCall className="w-4 h-4" /> },
    { text: 'Conserve phone battery for emergency use', icon: <Zap className="w-4 h-4" /> },
    { text: 'Follow official evacuation routes only', icon: <AlertTriangle className="w-4 h-4" /> }
  ]
};

const ActionEngine = ({ alert }) => {
  if (!alert) return null;

  const getActions = () => {
    const text = alert.title.toLowerCase() + alert.message.toLowerCase();
    if (text.includes('flood') || text.includes('rain') || text.includes('water')) return ACTION_MAP.flood;
    if (text.includes('storm') || text.includes('wind') || text.includes('cyclone')) return ACTION_MAP.storm;
    return ACTION_MAP.general;
  };

  const actions = getActions();

  return (
    <div className="mt-4 p-5 rounded-2xl border animate-in slide-in-from-left duration-500" style={{ backgroundColor: 'rgba(13,148,136,0.08)', borderColor: 'rgba(13,148,136,0.2)' }}>
      <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: '#0D9488' }}>
        <ShieldAlert className="w-4 h-4" />
        Survival Directive Engine
      </h4>
      
      <div className="space-y-3">
        {actions.map((action, idx) => (
          <div key={idx} className="flex items-start gap-3 group">
            <div className="p-1.5 rounded-lg group-hover:text-white transition-all" style={{ backgroundColor: 'rgba(13,148,136,0.12)', color: '#0D9488' }}>
              {action.icon}
            </div>
            <p className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">
              {action.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActionEngine;
