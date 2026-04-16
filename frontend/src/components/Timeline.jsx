import React from 'react';
import { Clock, Radio, ShieldAlert } from 'lucide-react';

const Timeline = ({ alerts }) => {
  const sortedAlerts = [...alerts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Clock className="w-6 h-6" style={{ color: '#0D9488' }} />
          Disaster Timeline
        </h2>
        <span className="text-xs font-black text-slate-500 uppercase tracking-widest bg-white/5 py-1 px-3 rounded-full">
          Chronological View
        </span>
      </div>

      <div className="relative border-l-2 border-white/5 ml-4 pl-8 space-y-12 pb-12">
        {sortedAlerts.map((alert, index) => (
          <div key={alert.id} className="relative group transition-all">
            {/* Dot */}
            <div
              className="absolute -left-[41px] top-1.5 w-5 h-5 rounded-full border-4 border-slate-900 transition-all group-hover:scale-125"
              style={{
                backgroundColor: alert.priority === 'High' ? '#EF4444' : '#0D9488',
                boxShadow: alert.priority === 'High' ? '0 0 15px rgba(239,68,68,0.5)' : 'none'
              }}
            />

            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-2">
               <span className="text-sm font-black text-slate-500 font-mono">
                {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <h3 className={`text-xl font-bold ${alert.priority === 'High' ? 'text-white' : 'text-slate-200'}`}>
                {alert.title}
              </h3>
            </div>

            <div className="p-5 rounded-2xl border-white/5 group-hover:bg-white/[0.08] transition-all" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <p className="text-slate-400 text-sm leading-relaxed">
                {alert.message}
              </p>
              
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase">
                  <Radio className="w-3.5 h-3.5" />
                  Propagation: {alert.spreadCount || 1} Nodes
                </div>
                {alert.priority === 'High' && (
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase" style={{ color: '#EF4444' }}>
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Critical Awareness
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {sortedAlerts.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            No events recorded in the current timeline.
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline;
