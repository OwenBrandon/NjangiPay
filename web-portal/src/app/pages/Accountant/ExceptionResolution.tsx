import { getColorClass } from '../../utils/colorClasses';
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
  ArrowLeft, Terminal, ShieldAlert, CheckCircle, 
  AlertTriangle, RefreshCcw, Activity, ShieldCheck, 
  FileSearch, Search, Server, Clock
} from 'lucide-react';
import { toast } from 'sonner';

export default function ExceptionResolution() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resolving, setResolving] = useState(false);

  const glassCard = 'bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] overflow-hidden';
  const terminalGrid = "bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:30px_30px]";

  const handleResolve = () => {
    setResolving(true);
    setTimeout(() => {
      toast.success('Exception Resolved', { description: `Log ${id} successfully reconciled and archived.` });
      navigate('/accountant/exceptions');
    }, 1500);
  };

  return (
    <div className={`min-h-screen bg-[#f8fafc] relative overflow-hidden ${terminalGrid} pb-20`}>
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] size-[50%] bg-rose-500/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] size-[50%] bg-orange-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto p-6 lg:p-10 mt-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <button
              onClick={() => navigate('/accountant/exceptions')}
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-rose-600 transition-colors mb-8 font-mono"
            >
              <ArrowLeft className="size-4" />
              Back to Exceptions
            </button>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="px-4 py-1.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] italic shadow-lg">Security Node</div>
              <div className="size-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
              <span className="text-[10px] font-black text-rose-600 uppercase tracking-[0.3em] font-mono">EXCEPTION_STATE_ACTIVE</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.9]">
              Resolve <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-orange-600 underline decoration-rose-600 decoration-8 underline-offset-8">Exception</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => toast.info('Trace Triggered', { description: 'Scanning external nodes for lost packets.' })}
              className="group flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-slate-100 text-slate-700 rounded-2xl hover:border-orange-500 hover:text-orange-600 transition-all font-black uppercase text-[10px] tracking-[0.2em] shadow-sm"
            >
              <Search className="size-4 transition-transform group-hover:scale-110" />
              Deep Trace
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className={`${glassCard} p-8 lg:p-10 relative group`}>
              <div className="absolute top-8 right-8 p-3 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 shadow-sm">
                <ShieldAlert className="size-8" />
              </div>
              
              <div className="mb-10 border-b border-slate-100 pb-8">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] font-mono block mb-2">Exception Ref</span>
                <h3 className="text-3xl font-black font-mono text-slate-800 tracking-tight">{id || 'TRX-UNKNOWN'}</h3>
                <div className="flex items-center gap-4 mt-4">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-orange-100 bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-[0.2em] font-mono">
                    <div className="size-1.5 rounded-full bg-orange-500 animate-pulse" />
                    REQUIRES_REVIEW
                  </span>
                  <span className="text-sm font-black text-slate-500 tracking-tight">System Flagged 2 hours ago</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-xl transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="size-5 text-orange-500" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Issue Type</span>
                  </div>
                  <div className="text-lg font-black text-slate-900 uppercase italic tracking-tighter">Amount Mismatch</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Severity: HIGH_ALERT</div>
                </div>

                <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-xl transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <Server className="size-5 text-indigo-500" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Temporal Node</span>
                  </div>
                  <div className="text-lg font-black text-slate-900 uppercase italic tracking-tighter">Gateway Timeout</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Node: GTB_API_04</div>
                </div>
              </div>

              <div className="mt-6 p-8 bg-rose-50/30 rounded-3xl border border-rose-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black text-rose-600 uppercase tracking-[0.3em] block mb-2">Disputed Asset Value</span>
                  <div className="text-5xl font-black text-rose-900 tracking-tighter italic">{"FCFA "}12,450.00</div>
                </div>
              </div>
            </div>

            <div className={`${glassCard} p-8 lg:p-10`}>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight italic mb-8 flex items-center gap-3 underline decoration-slate-900 decoration-4 underline-offset-4 w-fit">
                <Terminal className="size-5 text-slate-400" />
                Resolution Logic Matrix
              </h3>

              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Select Resolution Protocol</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-start gap-4 p-5 bg-white border-2 border-slate-100 rounded-2xl cursor-pointer hover:border-emerald-500 transition-colors has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50/30">
                      <input type="radio" name="protocol" className="mt-1" defaultChecked />
                      <div>
                        <div className="text-xs font-black uppercase text-slate-900 tracking-widest">Force Match</div>
                        <div className="text-[10px] font-bold text-slate-500 mt-1 leading-relaxed">Override variance and force system to accept gateway amount.</div>
                      </div>
                    </label>
                    <label className="flex items-start gap-4 p-5 bg-white border-2 border-slate-100 rounded-2xl cursor-pointer hover:border-rose-500 transition-colors has-[:checked]:border-rose-500 has-[:checked]:bg-rose-50/30">
                      <input type="radio" name="protocol" className="mt-1" />
                      <div>
                        <div className="text-xs font-black uppercase text-slate-900 tracking-widest">Reject Transaction</div>
                        <div className="text-[10px] font-bold text-slate-500 mt-1 leading-relaxed">Nullify record and dispatch failure notification to taxpayer.</div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Audit Justification</label>
                  <textarea 
                    rows={4}
                    placeholder="Enter cryptographic justification for manual logic override..."
                    className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-colors resize-none"
                  />
                </div>

                <button 
                  onClick={handleResolve}
                  disabled={resolving}
                  className="w-full py-5 bg-slate-950 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-slate-800 hover:scale-[1.01] transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {resolving ? (
                    <>
                      <RefreshCcw className="size-4 animate-spin" />
                      Executing Logic...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="size-4" />
                      Commit Resolution
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className={`${glassCard} p-8 lg:p-10`}>
              <div className="flex items-center gap-3 mb-8">
                <Activity className="size-5 text-rose-600" />
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight italic underline decoration-rose-600 decoration-4 underline-offset-4">Error Trace</h3>
              </div>
              
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                {[
                  { time: '14:30:12', msg: 'Transaction Initiated', icon: CheckCircle, color: 'emerald' },
                  { time: '14:31:05', msg: 'Gateway Auth Sent', icon: Activity, color: 'blue' },
                  { time: '14:32:55', msg: 'No Response from Gateway', icon: Clock, color: 'orange' },
                  { time: '14:35:00', msg: 'System Timeout Triggered', icon: AlertTriangle, color: 'rose' },
                ].map((event, i) => (
                  <div key={i} className="relative flex items-center gap-6 group">
                    <div className={`flex items-center justify-center size-10 rounded-full border-4 border-white ${getColorClass(event.color, 'bg50')} ${getColorClass(event.color, 'text500')} shadow shrink-0 z-10 group-hover:scale-110 transition-transform`}>
                      <event.icon className="size-4" />
                    </div>
                    <div>
                      <div className={`text-[10px] font-black uppercase ${getColorClass(event.color, 'text600')} tracking-widest font-mono mb-1`}>{event.time}</div>
                      <div className="text-xs font-black text-slate-900 uppercase tracking-tight">{event.msg}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`${glassCard} p-8 lg:p-10`}>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                <FileSearch className="size-4 text-slate-400" />
                Reference Logs
              </h3>
              <div className="space-y-3">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3 cursor-pointer hover:border-blue-500 hover:bg-white transition-all">
                  <Terminal className="size-4 text-slate-400" />
                  <div>
                    <div className="text-[10px] font-black text-slate-700 font-mono">SYS_AUTH_LOG.json</div>
                    <div className="text-[9px] font-bold text-slate-400 mt-0.5">12 KB • System Dump</div>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3 cursor-pointer hover:border-blue-500 hover:bg-white transition-all">
                  <ShieldCheck className="size-4 text-slate-400" />
                  <div>
                    <div className="text-[10px] font-black text-slate-700 font-mono">NIBSS_RESPONSE.xml</div>
                    <div className="text-[9px] font-bold text-slate-400 mt-0.5">Empty Packet</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
