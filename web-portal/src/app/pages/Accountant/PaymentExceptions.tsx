import { getColorClass } from '../../utils/colorClasses';
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { 
  ShieldAlert, AlertCircle, Search, Filter, ArrowRight, Eye, Flag, 
  Terminal, Activity, Clock
} from 'lucide-react';

export default function PaymentExceptions() {
  const [activeTab, setActiveTab] = React.useState<'all' | 'critical'>('all');
  const glassCard = 'bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] overflow-hidden';
  const terminalGrid = "bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:30px_30px]";

  const allExceptions = [
    { ref: 'TRX-998822', type: 'Invalid Auth Code', amount: 1250, time: '2 mins ago', severity: 'high' },
    { ref: 'TRX-998124', type: 'Amount Mismatch', amount: 450, time: '1 hour ago', severity: 'medium' },
    { ref: 'TRX-997541', type: 'Duplicate Ref', amount: 8900, time: '3 hours ago', severity: 'high' },
    { ref: 'TRX-996321', type: 'Bank Timeout', amount: 210, time: '5 hours ago', severity: 'low' },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const displayedExceptions = useMemo(() => {
    let data = activeTab === 'all' 
      ? allExceptions 
      : allExceptions.filter(ex => ex.severity === 'high');
      
    if (searchTerm) {
      data = data.filter(ex => 
        ex.ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return data;
  }, [activeTab, searchTerm]);

  return (
    <div className={`min-h-screen bg-[#f8fafc] relative overflow-hidden ${terminalGrid}`}>
      {/* Background Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-red-500/5 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="p-6 lg:p-10 space-y-10 relative z-10 max-w-[1600px] mx-auto">
        {/* Compact Elite Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative group cursor-pointer">
                <div className="size-5 rounded-full bg-red-500/20 animate-ping absolute inset-0" />
                <div className="size-5 rounded-full bg-red-600 relative border-[3px] border-white shadow-xl" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-red-700 uppercase tracking-[0.4em]">Audit Terminal</span>
                  <span className="text-slate-300">/</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Node: EXCEPTION-MATRIX-01</span>
                </div>
                <div className="h-1 w-32 bg-red-600/10 mt-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-red-600 w-full animate-loading shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-none italic uppercase">
              Payment <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">Exceptions</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={() => toast.info('Filter Options Open', { description: 'Adjust parameter matrix.' })} className="group flex items-center gap-4 px-8 py-5 bg-white border-2 border-slate-100 text-slate-600 rounded-xl text-[11px] font-black uppercase tracking-[0.3em] transition-all hover:border-red-500 hover:text-red-600 shadow-sm">
              <Filter className="size-4" />
              <span>Filter Logs</span>
            </button>
            <button onClick={() => toast.error('Audit Mode Engaged', { description: 'Activating forensic scan...' })} className="group relative flex items-center gap-4 px-8 py-5 bg-slate-950 text-white rounded-xl text-[11px] font-black uppercase tracking-[0.3em] overflow-hidden transition-all hover:scale-[1.03] hover:shadow-[0_30px_60px_-15px_rgba(15,23,42,0.4)] active:scale-[0.97]">
              <ShieldAlert className="size-4 relative z-10 group-hover:text-red-400 transition-colors" />
              <span className="relative z-10">Fraud Audit Mode</span>
            </button>
          </div>
        </div>

        {/* Tactical KPI Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Failed Payments', count: 12, icon: AlertCircle, color: 'red' },
            { label: 'Mismatch Records', count: 8, icon: Search, color: 'orange' },
            { label: 'Suspicious Activities', count: 3, icon: Flag, color: 'purple' },
          ].map((stat, i) => (
            <div key={i} className={`${glassCard} p-6 relative group transition-all hover:scale-[1.02] border-t-4 border-t-${stat.color}-500`}>
              <div className={`absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity`}>
                <stat.icon className={`size-16 ${getColorClass(stat.color, 'text600')}`} />
              </div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">{stat.label}</span>
                  <div className={`p-2 ${getColorClass(stat.color, 'bg50')} border ${getColorClass(stat.color, 'border100')} rounded-xl`}>
                    <stat.icon className={`size-4 ${getColorClass(stat.color, 'text600')}`} />
                  </div>
                </div>
                <div>
                  <div className={`text-4xl font-black text-slate-900 tracking-tighter italic`}>{stat.count}</div>
                  <div className={`flex items-center gap-1 mt-2 text-[10px] font-bold uppercase tracking-widest ${getColorClass(stat.color, 'text500')}`}>
                    REQUIRES REVIEW
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
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="SCANNING_EXCEPTION_LOGS..."
                      className="pl-12 pr-6 py-4 bg-white border-2 border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/5 w-[320px] transition-all placeholder:text-slate-300"
                    />
                  </div>
                </div>
                <div className="flex gap-2 bg-white p-1 rounded-2xl border border-slate-200">
                  <button 
                    onClick={() => setActiveTab('all')}
                    className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-colors ${activeTab === 'all' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-900'}`}
                  >
                    All Nodes
                  </button>
                  <button 
                    onClick={() => setActiveTab('critical')}
                    className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-colors ${activeTab === 'critical' ? 'bg-red-50 text-red-600' : 'text-slate-400 hover:text-red-600'}`}
                  >
                    Critical
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr>
                      <th className="px-8 py-6 text-left text-[10px] font-black italic text-slate-400 uppercase tracking-[0.2em]">Severity</th>
                      <th className="px-6 py-6 text-left text-[10px] font-black italic text-slate-400 uppercase tracking-[0.2em]">Transaction Ref</th>
                      <th className="px-6 py-6 text-left text-[10px] font-black italic text-slate-400 uppercase tracking-[0.2em]">Issue Type</th>
                      <th className="px-6 py-6 text-left text-[10px] font-black italic text-slate-400 uppercase tracking-[0.2em]">Amount</th>
                      <th className="px-6 py-6 text-left text-[10px] font-black italic text-slate-400 uppercase tracking-[0.2em]">Temporal Node</th>
                      <th className="px-8 py-6 text-right text-[10px] font-black italic text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {displayedExceptions.map((ex, i) => (
                      <tr key={i} className="hover:bg-red-50/20 transition-all group">
                        <td className="px-8 py-6">
                          <span className={`inline-flex px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                            ex.severity === 'high' ? 'bg-red-50 text-red-600 border-red-100' :
                            ex.severity === 'medium' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                            'bg-blue-50 text-blue-600 border-blue-100'
                          }`}>
                            {ex.severity}_ALERT
                          </span>
                        </td>
                        <td className="px-6 py-6">
                          <span className="text-xs font-black text-slate-900 tracking-tight font-mono">{ex.ref}</span>
                        </td>
                        <td className="px-6 py-6">
                          <span className="text-sm font-black text-slate-700 tracking-tighter uppercase">{ex.type}</span>
                        </td>
                        <td className="px-6 py-6">
                          <span className="text-sm font-black text-slate-900 tracking-tighter">FCFA ${ex.amount.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-2 text-slate-500 font-mono italic text-[11px] font-bold">
                            <Clock className="size-3.5" />
                            {ex.time}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => navigate(`/accountant/payments/${ex.ref}`)} className="group/btn relative p-3 bg-white border-2 border-slate-100 rounded-2xl transition-all hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-110 active:scale-95" title="View Details">
                              <Eye className="size-4 text-slate-400 group-hover/btn:text-blue-600 transition-colors" />
                            </button>
                            <button onClick={() => navigate(`/accountant/exceptions/${ex.ref}`)} className="group/btn relative p-3 bg-white border-2 border-slate-100 rounded-2xl transition-all hover:border-red-500 hover:shadow-lg hover:shadow-red-500/20 hover:scale-110 active:scale-95" title="Resolve Exception">
                              <ArrowRight className="size-4 text-slate-400 group-hover/btn:text-red-600 transition-colors" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-10">
            {/* Quick Actions Panel */}
            <div className={`${glassCard} p-8 relative overflow-hidden group border-t-4 border-t-blue-500`}>
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Activity className="size-24 text-slate-900" />
              </div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] mb-8 italic underline decoration-blue-600 decoration-4 underline-offset-4 w-fit">System Directives</h3>
              <div className="space-y-4 relative z-10">
                <button onClick={() => toast.success('Report Initiated', { description: 'Generating anomaly report.' })} className="flex items-center justify-between w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl transition-all hover:border-blue-500 hover:shadow-md group/action">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-sm group-hover/action:text-blue-600">
                      <Terminal className="size-4" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-700">Generate Report</span>
                  </div>
                  <ArrowRight className="size-4 text-slate-300 group-hover/action:text-blue-600 transition-colors" />
                </button>
                <button onClick={() => toast.warning('Bulk Escalation Triggered')} className="flex items-center justify-between w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl transition-all hover:border-red-500 hover:shadow-md group/action">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-sm group-hover/action:text-red-600">
                      <ShieldAlert className="size-4" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-700">Bulk Escalate</span>
                  </div>
                  <ArrowRight className="size-4 text-slate-300 group-hover/action:text-red-600 transition-colors" />
                </button>
                <button onClick={() => toast.info('Secure Comms Open', { description: 'Pinging bank node...' })} className="flex items-center justify-between w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl transition-all hover:border-orange-500 hover:shadow-md group/action">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-sm group-hover/action:text-orange-600">
                      <Activity className="size-4" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-700">Contact Bank</span>
                  </div>
                  <ArrowRight className="size-4 text-slate-300 group-hover/action:text-orange-600 transition-colors" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

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
