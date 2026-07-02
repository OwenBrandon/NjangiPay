import { getColorClass } from '../../utils/colorClasses';
import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { 
  Search, Filter, CheckCircle, AlertTriangle, RefreshCw, Upload, Smartphone, Landmark,
  ShieldCheck, Activity, Terminal, Clock, ArrowUpRight, TrendingDown, TrendingUp, AlertCircle, X, ChevronRight
} from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';

export default function Reconciliation() {
  const { payments } = useMockData();
  const [activeTab, setActiveTab] = useState<'bank' | 'mobile'>('bank');
  const glassCard = 'bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] overflow-hidden';
  const terminalGrid = "bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:30px_30px]";

  const bankData = [
    { date: '2024-04-12', ref: 'TRX-998822', sys: 1250, bank: 1250, diff: 0, status: 'match' },
    { date: '2024-04-12', ref: 'TRX-998834', sys: 850, bank: 0, diff: -850, status: 'missing_bank' },
    { date: '2024-04-11', ref: 'TRX-998845', sys: 2100, bank: 2100, diff: 0, status: 'match' },
    { date: '2024-04-11', ref: 'TRX-998856', sys: 450.5, bank: 450.0, diff: 0.5, status: 'mismatch' },
  ];

  const mobileData = [
    { date: '2024-04-13', ref: 'MOB-554411', sys: 300, bank: 300, diff: 0, status: 'match' },
    { date: '2024-04-13', ref: 'MOB-554422', sys: 150, bank: 150, diff: 0, status: 'match' },
    { date: '2024-04-12', ref: 'MOB-554433', sys: 500, bank: 450, diff: -50, status: 'mismatch' },
    { date: '2024-04-12', ref: 'MOB-554444', sys: 200, bank: 0, diff: -200, status: 'missing_bank' },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [resolvingItem, setResolvingItem] = useState<any>(null);
  const currentData = activeTab === 'bank' ? bankData : mobileData;
  const filteredData = useMemo(() => {
    return currentData.filter(item => 
      item.ref.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [currentData, searchTerm]);

  return (
    <div className={`min-h-screen bg-[#f8fafc] relative overflow-hidden ${terminalGrid}`}>
      {/* Reconciliation Background Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/5 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="p-6 lg:p-10 space-y-10 relative z-10 max-w-[1600px] mx-auto">
        {/* Compact Elite Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative group cursor-pointer">
                <div className="size-5 rounded-full bg-blue-500/20 animate-ping absolute inset-0" />
                <div className="size-5 rounded-full bg-blue-600 relative border-[3px] border-white shadow-xl" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-blue-700 uppercase tracking-[0.4em]">Audit Terminal</span>
                  <span className="text-slate-300">/</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Node: RECON-MATRIX-01</span>
                </div>
                <div className="h-1 w-32 bg-blue-600/10 mt-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 w-full animate-loading shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-none italic uppercase">
              Financial <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Reconciliation</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={() => toast.success('Statement Imported', { description: 'Parsing external node logic...' })} className="group flex items-center gap-4 px-8 py-5 bg-white border-2 border-slate-100 text-slate-600 rounded-xl text-[11px] font-black uppercase tracking-[0.3em] transition-all hover:border-blue-500 hover:text-blue-600 shadow-sm">
              <Upload className="size-4" />
              <span>Import Statement</span>
            </button>
            <button onClick={() => toast.info('Syncing Records', { description: 'Aligning temporal nodes across systems.' })} className="group relative flex items-center gap-4 px-8 py-5 bg-slate-950 text-white rounded-xl text-[11px] font-black uppercase tracking-[0.3em] overflow-hidden transition-all hover:scale-[1.03] hover:shadow-[0_30px_60px_-15px_rgba(15,23,42,0.4)] active:scale-[0.97]">
              <RefreshCw className="size-4 relative z-10 transition-transform group-hover:rotate-180 duration-700" />
              <span className="relative z-10">Sync Records</span>
            </button>
          </div>
        </div>

        {/* Tactical Tab Interface */}
        <div className="flex gap-4 p-2 bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-xl shadow-lg w-fit">
          <button
            onClick={() => setActiveTab('bank')}
            className={`flex items-center gap-3 px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'bank' ? 'bg-blue-600 text-white shadow-xl scale-[1.02]' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Landmark className="size-4" />
            Bank vs System
          </button>
          <button
            onClick={() => setActiveTab('mobile')}
            className={`flex items-center gap-3 px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'mobile' ? 'bg-blue-600 text-white shadow-xl scale-[1.02]' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Smartphone className="size-4" />
            Mobile Money
          </button>
        </div>

        {/* Tactical KPI Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Reconciled', value: 'FCFA 1.42M', trend: '+8.4%', trendUp: true, icon: TrendingUp, color: 'emerald' },
            { label: 'Pending Sync', value: '342 Nodes', trend: '-1.2%', trendUp: true, icon: RefreshCw, color: 'blue' },
            { label: 'Critical Variance', value: 'FCFA 4,250', trend: '+0.5%', trendUp: false, icon: AlertCircle, color: 'rose' },
          ].map((kpi, i) => (
            <div key={i} className={`${glassCard} p-6 relative group transition-all hover:scale-[1.02]`}>
              <div className={`absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity`}>
                <kpi.icon className={`size-16 ${getColorClass(kpi.color, 'text600')}`} />
              </div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">{kpi.label}</span>
                  <div className={`p-2 ${getColorClass(kpi.color, 'bg50')} border ${getColorClass(kpi.color, 'border100')} rounded-xl`}>
                    <kpi.icon className={`size-4 ${getColorClass(kpi.color, 'text600')}`} />
                  </div>
                </div>
                <div>
                  <div className={`text-3xl font-black text-slate-900 tracking-tighter italic`}>{kpi.value}</div>
                  <div className={`flex items-center gap-1 mt-2 text-[10px] font-bold uppercase tracking-widest ${kpi.trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {kpi.trend} VS LAST MONTH
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            {/* Forensic Data Matrix */}
            <div className={glassCard}>
              <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="SCANNING_FOR_DISCREPANCIES..."
                      className="pl-12 pr-6 py-4 bg-white border-2 border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 w-[320px] transition-all placeholder:text-slate-300"
                    />
                  </div>
                  <button onClick={() => toast.info('Filters Accessed', { description: 'Opening parameter matrix.' })} className="flex items-center gap-3 text-[11px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-[0.2em] transition-all">
                    <Filter className="size-4" />
                    Filters
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing {filteredData.length} Unreconciled Logic Units</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr>
                      <th className="px-8 py-6 text-left text-[10px] font-black italic text-slate-400 uppercase tracking-[0.2em]">Temporal Node</th>
                      <th className="px-6 py-6 text-left text-[10px] font-black italic text-slate-400 uppercase tracking-[0.2em]">Registry Ref</th>
                      <th className="px-6 py-6 text-left text-[10px] font-black italic text-slate-400 uppercase tracking-[0.2em]">System Asset</th>
                      <th className="px-6 py-6 text-left text-[10px] font-black italic text-slate-400 uppercase tracking-[0.2em]">External Asset</th>
                      <th className="px-6 py-6 text-left text-[10px] font-black italic text-slate-400 uppercase tracking-[0.2em]">Variance</th>
                      <th className="px-8 py-6 text-right text-[10px] font-black italic text-slate-400 uppercase tracking-[0.2em]">Action Protocol</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredData.map((item, i) => (
                      <tr key={i} className="hover:bg-blue-50/20 transition-all group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3 text-slate-500 font-mono italic text-[11px] font-bold">
                            <Clock className="size-3.5" />
                            {item.date}
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <span className="text-xs font-black text-slate-900 tracking-tight font-mono">{item.ref}</span>
                        </td>
                        <td className="px-6 py-6 text-sm font-black text-slate-900 tracking-tighter">FCFA ${item.sys.toLocaleString()}</td>
                        <td className="px-6 py-6">
                          {item.bank > 0 ? (
                            <span className="text-sm font-black text-slate-500 tracking-tighter">FCFA ${item.bank.toLocaleString()}</span>
                          ) : (
                            <div className="flex items-center gap-2 px-3 py-1 bg-rose-50 border border-rose-100 rounded-lg w-fit">
                              <AlertTriangle className="size-3 text-rose-500" />
                              <span className="text-[10px] font-black text-rose-600 uppercase tracking-tight">NULL_EXTERNAL</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-6">
                          <span className={`text-sm font-black tracking-tighter ${item.diff === 0 ? 'text-emerald-600' : 'text-rose-600 underline decoration-2'}`}>
                            {item.diff === 0 ? 'NOMINAL' : `$${item.diff.toLocaleString()}`}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          {item.status === 'match' ? (
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                              <CheckCircle className="size-3.5" /> SECURE_MATCH
                            </span>
                          ) : (
                            <button onClick={() => setResolvingItem(item)} className="group relative px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-slate-950 hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20">
                              Resolve Logic
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-10">
            {/* Reconciliation Telemetry */}
            <div className={`${glassCard} p-8 relative overflow-hidden group`}>
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Activity className="size-24 text-slate-900" />
              </div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] mb-8 italic underline decoration-blue-600 decoration-4 underline-offset-4 w-fit">Matrix Summary</h3>
              <div className="space-y-6 relative z-10">
                {[
                  { label: 'Perfect Matches', value: '1,284', sub: '92% INTEGRITY', color: 'emerald' },
                  { label: 'Total Mismatches', value: '12', sub: 'SURGICAL REVIEW', color: 'rose' },
                  { label: 'Pending Sync', value: '36', sub: 'AWAITING NODE', color: 'orange' },
                ].map((stat, i) => {
                  const statTextColor = 
                    stat.color === 'emerald' ? 'text-emerald-700' :
                    stat.color === 'rose' ? 'text-rose-700' :
                    'text-orange-700';
                  
                  const textOpacityMap: Record<string, string> = {
                    emerald: 'text-emerald-600/70',
                    rose: 'text-rose-600/70',
                    orange: 'text-orange-600/70',
                  };
                  const textOpacityClass = textOpacityMap[stat.color] || 'text-orange-600/70';
                  
                  const bgClassMap: Record<string, string> = {
                    emerald: 'bg-emerald-50/50',
                    rose: 'bg-rose-50/50',
                    orange: 'bg-orange-50/50',
                  };
                  const bgClass = bgClassMap[stat.color] || 'bg-slate-50/50';

                  return (
                    <div key={i} className={`p-6 ${bgClass} border-2 ${getColorClass(stat.color, 'border100')} rounded-xl transition-all hover:scale-[1.02] hover:shadow-xl`}>
                      <div className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] mb-2">{stat.label}</div>
                      <div className={`text-4xl font-black ${statTextColor} tracking-tighter italic uppercase`}>{stat.value}</div>
                      <div className={`text-[9px] font-black ${textOpacityClass} mt-2 tracking-[0.3em] font-mono`}>{stat.sub}</div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Resolution Hover Page (Modal) */}
      {resolvingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-10 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setResolvingItem(null)} />
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-100">
            {/* Left Panel: Discrepancy Details */}
            <div className="w-full md:w-1/2 p-10 bg-slate-50 border-r border-slate-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="px-3 py-1.5 bg-rose-100 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-2">
                    <AlertTriangle className="size-3" /> Action Required
                  </div>
                </div>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic mb-2">Resolve Logic</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-10">Manual audit and alignment of system vs external node required.</p>

                <div className="space-y-6">
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] font-mono block mb-1">Temporal Node</span>
                    <div className="text-lg font-black text-slate-900 italic tracking-tight">{resolvingItem.date}</div>
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] font-mono block mb-1">Registry Ref</span>
                    <div className="text-xl font-black text-blue-600 tracking-tighter">{resolvingItem.ref}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">System Asset</span>
                      <div className="text-xl font-black text-slate-900 italic tracking-tighter">FCFA ${resolvingItem.sys.toLocaleString()}</div>
                    </div>
                    <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">External Asset</span>
                      <div className="text-xl font-black text-slate-900 italic tracking-tighter">FCFA ${resolvingItem.bank.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-10 p-5 bg-rose-50/50 rounded-2xl border border-rose-100 flex items-center justify-between">
                <span className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em]">Detected Variance</span>
                <span className="text-2xl font-black text-rose-600 italic tracking-tighter underline decoration-rose-300 decoration-2 underline-offset-4">
                  ${resolvingItem.diff.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Right Panel: Resolution Form */}
            <div className="w-full md:w-1/2 p-10 bg-white flex flex-col justify-between relative">
              <button 
                onClick={() => setResolvingItem(null)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="size-5" />
              </button>

              <div className="mt-8">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                  <Terminal className="size-4 text-slate-400" /> Resolution Protocol
                </h3>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Resolution Action</label>
                    <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-colors">
                      <option>Force Match (Ignore Variance)</option>
                      <option>Adjust System Ledger</option>
                      <option>Request Bank Reversal</option>
                      <option>Flag for Legal Audit</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Adjustment Value ($)</label>
                    <input 
                      type="number" 
                      defaultValue={Math.abs(resolvingItem.diff)}
                      className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-colors font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Justification Remarks</label>
                    <textarea 
                      rows={3}
                      placeholder="Enter cryptographic justification for manual logic override..."
                      className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                <button 
                  onClick={() => setResolvingItem(null)}
                  className="flex-1 py-4 bg-white border-2 border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:border-slate-300 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    toast.success('Logic Resolved', { description: `Variance on ${resolvingItem.ref} has been successfully neutralized.` });
                    setResolvingItem(null);
                  }}
                  className="flex-[2] flex items-center justify-center gap-2 py-4 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-700 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-emerald-600/20"
                >
                  Confirm Alignment <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-loading { animation: loading 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
