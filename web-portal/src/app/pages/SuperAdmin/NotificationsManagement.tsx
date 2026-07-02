import { getColorClass } from '../../utils/colorClasses';
import { useState, useEffect } from 'react';
import { Bell, Send, Users, Info, AlertTriangle, CheckCircle, Clock, Zap, Target, Signal, Cpu, ShieldAlert, X, Activity, Radio, BarChart3, Fingerprint, Server } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

export default function NotificationsManagement() {
  const [showCreate, setShowCreate] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('notifications').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setNotifications(data || []);
    });
  }, []);
  
  // Premium Design Tokens - Reduced Sizes
  const glassCard = 'bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] overflow-hidden';
  const packetCard = 'bg-white/40 backdrop-blur-md rounded-xl border border-white/60 p-6 transition-all duration-700 hover:shadow-[0_30px_60px_-15px_rgba(99,102,241,0.15)] hover:-translate-y-1.5 group relative overflow-hidden';
  const terminalGrid = "bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:30px_30px]";

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="size-4 text-blue-500" />;
      case 'warning': return <AlertTriangle className="size-4 text-orange-500" />;
      case 'success': return <CheckCircle className="size-4 text-emerald-500" />;
      default: return <Info className="size-4 text-slate-500" />;
    }
  };

  const getTypeGlow = (type: string) => {
    switch (type) {
      case 'info': return 'bg-blue-500/10 text-blue-600 border-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.1)]';
      case 'warning': return 'bg-orange-500/10 text-orange-600 border-orange-200 shadow-[0_0_15px_rgba(249,115,22,0.1)]';
      case 'success': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200 shadow-[0_0_15_rgba(16,185,129,0.1)]';
      default: return 'bg-slate-500/10 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className={`min-h-screen bg-[#f8fafc] relative overflow-hidden ${terminalGrid}`}>
      {/* Dynamic Background Depth */}
      <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] bg-indigo-500/5 rounded-full blur-[180px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[80%] h-[80%] bg-purple-500/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="p-6 lg:p-10 space-y-10 relative z-10 max-w-[1600px] mx-auto">
        {/* Advanced Command Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative group cursor-pointer">
                <div className="size-5 rounded-full bg-indigo-500/20 animate-ping absolute inset-0" />
                <div className="size-5 rounded-full bg-indigo-600 relative border-[3px] border-white shadow-xl transition-transform group-hover:scale-110" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-indigo-700 uppercase tracking-[0.4em]">Global Broadcast Hub</span>
                  <span className="text-slate-300">/</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Node: SA-MASTER</span>
                </div>
                <div className="h-1 w-32 bg-indigo-600/10 mt-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 w-1/3 animate-loading shadow-[0_0_8px_rgba(79,70,229,0.5)]" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-none italic uppercase">
              Broadcast <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Terminal</span>
            </h1>
          </div>
          
          <button
            onClick={() => setShowCreate(true)}
            className="group relative flex items-center gap-4 px-8 py-5 bg-slate-950 text-white rounded-xl text-[11px] font-black uppercase tracking-[0.3em] overflow-hidden transition-all hover:scale-[1.03] hover:shadow-[0_30px_60px_-15px_rgba(15,23,42,0.4)] active:scale-[0.97]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[size:200%_auto] animate-gradient-x" />
            <Send className="size-4 relative z-10 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            <span className="relative z-10">Engage Protocol</span>
            <div className="absolute top-0 -inset-full h-full w-1/2 z-20 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-10 group-hover:animate-shine" />
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          {/* Broadcast Log (Left Section) */}
          <div className="xl:col-span-8 space-y-8">
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-100">
                  <Radio className="size-4 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase italic">Archive</h3>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-1.5">Active Protocol Streams</p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-6">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/60 border border-slate-200 rounded-full text-[9px] font-black text-slate-700 uppercase tracking-widest shadow-sm">
                  <Fingerprint className="size-3 text-indigo-500" /> SECURE_LINK
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {notifications.map((notif, idx) => (
                <div key={notif.id} className={packetCard}>
                  <div className={`absolute -right-20 -top-20 size-48 rounded-full blur-[60px] opacity-0 group-hover:opacity-10 transition-opacity duration-700 ${notif.type === 'info' ? 'bg-blue-500' : notif.type === 'warning' ? 'bg-orange-500' : 'bg-emerald-500'}`} />
                  
                  <div className="flex items-start gap-8 relative z-10">
                    <div className="flex flex-col items-center gap-4 shrink-0 pt-1">
                      <div className={`p-4 rounded-xl border-2 transition-all duration-700 ${getTypeGlow(notif.type)} group-hover:rotate-[360deg] shadow-lg`}>
                        {getTypeIcon(notif.type)}
                      </div>
                      <div className="w-1 h-14 bg-gradient-to-b from-slate-200 to-transparent rounded-full" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-[9px] font-black text-white bg-slate-900 px-3 py-1 rounded-lg border border-slate-700 uppercase tracking-widest shadow-md italic">
                            STREAM-{(idx + 101).toString(16).toUpperCase()}
                          </span>
                          <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
                            <Clock className="size-3 text-indigo-400" />
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 opacity-50">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className={`size-1 rounded-full ${i === 0 ? 'bg-indigo-500 animate-pulse' : 'bg-indigo-300'}`} />
                          ))}
                        </div>
                      </div>

                      <h4 className="text-xl font-black text-slate-900 tracking-tight mb-2 group-hover:text-indigo-600 transition-colors uppercase italic">{notif.title}</h4>
                      <p className="text-sm font-bold text-slate-500 leading-relaxed mb-6 group-hover:text-slate-700 transition-colors italic line-clamp-2">
                        "{notif.message}"
                      </p>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 border-t border-slate-100 pt-6">
                        <div className="space-y-2">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-1.5">
                            <Target className="size-2.5 text-indigo-500" /> Target
                          </span>
                          <div className="bg-white px-3 py-2 rounded-xl border border-slate-100 shadow-sm transition-all group-hover:border-indigo-100">
                            <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{notif.targetAudience}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-1.5">
                            <Signal className="size-2.5 text-emerald-500" /> Delivery
                          </span>
                          <div className="bg-white px-3 py-2 rounded-xl border border-slate-100 shadow-sm transition-all group-hover:border-emerald-100">
                            <span className="text-[10px] font-black text-slate-700 tracking-widest italic">{notif.sentCount.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="hidden lg:flex flex-col space-y-2">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-1.5">
                            <Activity className="size-2.5 text-blue-500" /> Integrity
                          </span>
                          <div className="h-4 flex items-center gap-1 pt-1">
                            {[...Array(6)].map((_, i) => (
                              <div key={i} className="h-full w-1 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500" style={{ height: `${Math.random() * 60 + 40}%` }} />
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-end">
                          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-md transition-all hover:bg-indigo-600 hover:scale-105 active:scale-95 group/btn">
                            Analytics <Send className="size-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Telemetry Sidebar (Right Section) */}
          <div className="xl:col-span-4 space-y-8">
            {/* Impact Telemetry Card */}
            <div className={glassCard}>
              <div className="p-8 border-b border-slate-100 bg-slate-50/30">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-xl shadow-indigo-200">
                    <BarChart3 className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tighter leading-none uppercase italic">Telemetry</h3>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
                       <span className="size-1.5 bg-indigo-500 rounded-full animate-ping" /> GLOBAL SYNC
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-8 space-y-8">
                {[
                  { label: 'Volume', value: '14,040', color: 'indigo', icon: <Send className="size-4" /> },
                  { label: 'Velocity', value: '68%', color: 'blue', icon: <Signal className="size-4" />, progress: 68 },
                  { label: 'Delta', value: '24%', color: 'emerald', icon: <Zap className="size-4" />, progress: 24 },
                ].map((stat, i) => (
                  <div key={i} className="space-y-3 group/stat">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 ${getColorClass(stat.color, 'bg50')} ${getColorClass(stat.color, 'text600')} rounded-xl border ${getColorClass(stat.color, 'border100')} transition-transform group-hover/stat:scale-110`}>
                          {stat.icon}
                        </div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
                      </div>
                      <span className={`text-2xl font-black tracking-tighter ${getColorClass(stat.color, 'text600')} font-mono italic`}>{stat.value}</span>
                    </div>
                    {stat.progress && (
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/50">
                        <div 
                          className={`h-full bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-400 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)] transition-all duration-1000 relative`} 
                          style={{ width: `${stat.progress}%` }} 
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Tactical Command Intelligence Card */}
            <div className="bg-slate-950 rounded-2xl p-8 relative overflow-hidden group border border-white/5 shadow-2xl">
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(99,102,241,0.06)_50%)] bg-[size:100%_4px] pointer-events-none animate-scanline" />
              <Zap className="absolute -right-12 -bottom-12 size-56 text-indigo-500/[0.03] group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000 pointer-events-none" />
              
              <div className="relative z-10 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-500 text-white rounded-2xl shadow-[0_0_20px_rgba(99,102,241,0.5)] border border-indigo-400/50 transition-transform group-hover:scale-110 group-hover:rotate-6">
                      <Fingerprint className="size-5" />
                    </div>
                    <h3 className="text-xl font-black text-white tracking-tighter leading-none uppercase italic underline decoration-indigo-500 decoration-4 underline-offset-4">Intel</h3>
                  </div>
                  <div className="px-3 py-1 border border-indigo-500/40 rounded-full bg-indigo-500/10">
                    <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.4em] animate-pulse">CLASSIFIED</span>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-xl p-6 backdrop-blur-xl">
                    <p className="text-xs font-black text-slate-300 leading-relaxed uppercase tracking-wider italic font-mono">
                      "TARGETED BROADCASTS IN <span className="text-indigo-400 underline decoration-indigo-400/50 decoration-2 underline-offset-4">REGION-ALFA</span> EXHIBIT A <span className="text-emerald-400">42%</span> VELOCITY INCREASE."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Broadcast Initializer Protocol (Compact Modal) */}
      {showCreate && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-2xl flex items-center justify-center z-50 p-4 lg:p-6">
          <div className="bg-white rounded-2xl shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)] w-full max-w-2xl overflow-hidden border border-white/20 animate-in fade-in zoom-in duration-500 relative">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-5">
                <div className="p-3.5 bg-slate-950 text-white rounded-2xl shadow-xl transition-transform hover:scale-105 active:scale-95">
                  <Send className="size-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tighter leading-none italic uppercase underline decoration-indigo-600 decoration-4 underline-offset-4">Initializer</h2>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
                    <span className="size-1.5 bg-indigo-500 rounded-full animate-ping" />
                    CONFIGURING TRANSMISSION MATRIX
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowCreate(false)} 
                className="p-4 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 rounded-2xl transition-all hover:scale-110 hover:rotate-90 active:scale-90 shadow-sm"
              >
                <X className="size-5" />
              </button>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 gap-8">
                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-4 italic">Identifier</label>
                  <div className="relative group">
                    <input 
                      type="text" 
                      placeholder="ENTER_IDENTIFIER..."
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-base font-black text-slate-800 placeholder:text-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/5 outline-none transition-all shadow-inner tracking-widest italic uppercase"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-4 italic">Payload Matrix</label>
                  <textarea 
                    rows={3}
                    placeholder="ENCODE TRANSMISSION PAYLOAD..."
                    className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-black text-slate-800 placeholder:text-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/5 outline-none transition-all shadow-inner tracking-wider resize-none italic uppercase"
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-4 italic">Severity</label>
                    <div className="relative group">
                      <select className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-[11px] font-black text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/5 outline-none transition-all shadow-inner tracking-widest appearance-none cursor-pointer uppercase italic">
                        <option value="info">TIER_1: INF_SYNC</option>
                        <option value="warning">TIER_2: CRIT_VOX</option>
                        <option value="success">TIER_3: STABLE_SYS</option>
                      </select>
                      <Cpu className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 size-4 group-hover:text-indigo-500 transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-4 italic">Target Sector</label>
                    <div className="relative group">
                      <select className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-[11px] font-black text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/5 outline-none transition-all shadow-inner tracking-widest appearance-none cursor-pointer uppercase italic">
                        <option value="all">SECTOR: GLOBAL_NET</option>
                        <option value="taxpayer">SECTOR: XPAY_NODES</option>
                        <option value="tax_admin">SECTOR: ADMIN_CORE</option>
                      </select>
                      <Users className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 size-4 group-hover:text-indigo-500 transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-950 rounded-xl p-6 border border-white/5 flex items-center justify-between group overflow-hidden relative shadow-lg">
                <div className="flex items-center gap-5 relative z-10">
                  <div className="p-3 bg-emerald-500 text-white rounded-2xl shadow-lg transition-transform group-hover:scale-105">
                    <ShieldAlert className="size-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-white uppercase tracking-[0.2em] italic leading-tight">
                      AUTH Clearance: <span className="text-indigo-400">LEVEL_9</span>
                    </p>
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em] mt-1 italic animate-pulse">Node: Prime Ready</p>
                  </div>
                </div>
                <Fingerprint className="size-10 text-slate-800 group-hover:text-indigo-500/20 transition-all duration-700 relative z-10" />
              </div>
            </div>
            
            <div className="px-10 py-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-8">
              <button 
                onClick={() => setShowCreate(false)}
                className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-rose-600 transition-all italic"
              >
                Abort Protocol
              </button>
              <button 
                onClick={() => {
                  toast.success('Transmission Engaged: Protocol Executed Successfully');
                  setShowCreate(false);
                }}
                className="px-10 py-5 bg-slate-950 text-white rounded-xl text-[11px] font-black uppercase tracking-[0.3em] hover:bg-indigo-600 transition-all shadow-xl hover:scale-[1.03] active:scale-[0.97] italic"
              >
                Execute Transmission
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Style Inject */}
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes shine {
          100% { left: 125%; }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-scanline { animation: scanline 12s linear infinite; }
        .animate-loading { animation: loading 3s ease-in-out infinite; }
        .animate-shine { animation: shine 1.5s ease-in-out infinite; }
        .animate-gradient-x { animation: gradient-x 5s ease infinite; }
        .vertical-text { writing-mode: vertical-rl; text-orientation: mixed; }
        select { -webkit-appearance: none; appearance: none; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
}
