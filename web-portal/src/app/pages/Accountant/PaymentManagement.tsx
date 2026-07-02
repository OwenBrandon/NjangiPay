import { getColorClass } from '../../utils/colorClasses';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { 
  Search, Filter, RefreshCw, Activity, Terminal, Clock, Eye, Download,
  TrendingUp, CheckCircle, AlertCircle
} from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';
import { Link } from 'react-router';

export default function PaymentManagement() {
  const { taxpayers, payments } = useMockData();
  const [searchTerm, setSearchTerm] = useState('');
  const glassCard = 'bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] overflow-hidden';
  const terminalGrid = "bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:30px_30px]";

  const filteredPayments = payments.filter(payment =>
    payment.transactionRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.taxType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`min-h-screen bg-[#f8fafc] relative overflow-hidden ${terminalGrid}`}>
      {/* Background Blobs */}
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
                  <span className="text-[10px] font-black text-blue-700 uppercase tracking-[0.4em]">Transaction Terminal</span>
                  <span className="text-slate-300">/</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Node: TXN-MATRIX-01</span>
                </div>
                <div className="h-1 w-32 bg-blue-600/10 mt-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 w-full animate-loading shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-none italic uppercase">
              Payment <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Management</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={() => toast.success('Ledger Exported', { description: 'Secure transaction matrix downloaded.' })} className="group flex items-center gap-4 px-8 py-5 bg-white border-2 border-slate-100 text-slate-600 rounded-xl text-[11px] font-black uppercase tracking-[0.3em] transition-all hover:border-blue-500 hover:text-blue-600 shadow-sm">
              <Download className="size-4" />
              <span>Export Ledger</span>
            </button>
            <button onClick={() => toast.info('Syncing Nodes', { description: 'Establishing connection to primary banking nodes...' })} className="group relative flex items-center gap-4 px-8 py-5 bg-slate-950 text-white rounded-xl text-[11px] font-black uppercase tracking-[0.3em] overflow-hidden transition-all hover:scale-[1.03] hover:shadow-[0_30px_60px_-15px_rgba(15,23,42,0.4)] active:scale-[0.97]">
              <RefreshCw className="size-4 relative z-10 transition-transform group-hover:rotate-180 duration-700" />
              <span className="relative z-10">Sync Transactions</span>
            </button>
          </div>
        </div>

        {/* Tactical KPI Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Revenue', value: 'FCFA 2,459,320', trend: '+14.2%', trendUp: true, icon: TrendingUp, color: 'blue' },
            { label: 'Successful Transactions', value: '4,892', trend: '+5.1%', trendUp: true, icon: CheckCircle, color: 'emerald' },
            { label: 'Pending Exceptions', value: '18', trend: '-2.4%', trendUp: false, icon: AlertCircle, color: 'orange' },
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
                      placeholder="SCANNING_FOR_TRANSACTIONS..."
                      className="pl-12 pr-6 py-4 bg-white border-2 border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 w-[320px] transition-all placeholder:text-slate-300"
                    />
                  </div>
                  <button onClick={() => toast.info('Advanced Filters Triggered', { description: 'Opening parameter matrix.' })} className="flex items-center gap-3 text-[11px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-[0.2em] transition-all">
                    <Filter className="size-4" />
                    Filters
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tracking {filteredPayments.length} Active Nodes</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr>
                      <th className="px-8 py-6 text-left text-[10px] font-black italic text-slate-400 uppercase tracking-[0.2em]">Transaction Ref</th>
                      <th className="px-6 py-6 text-left text-[10px] font-black italic text-slate-400 uppercase tracking-[0.2em]">Taxpayer Identity</th>
                      <th className="px-6 py-6 text-left text-[10px] font-black italic text-slate-400 uppercase tracking-[0.2em]">Temporal Node</th>
                      <th className="px-6 py-6 text-left text-[10px] font-black italic text-slate-400 uppercase tracking-[0.2em]">Tax Type</th>
                      <th className="px-6 py-6 text-left text-[10px] font-black italic text-slate-400 uppercase tracking-[0.2em]">Amount</th>
                      <th className="px-6 py-6 text-left text-[10px] font-black italic text-slate-400 uppercase tracking-[0.2em]">Status</th>
                      <th className="px-8 py-6 text-right text-[10px] font-black italic text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPayments.map((payment) => {
                      const taxpayer = taxpayers.find(t => t.id === payment.taxpayerId);
                      return (
                        <tr key={payment.id} className="hover:bg-blue-50/20 transition-all group">
                          <td className="px-8 py-6">
                            <span className="text-xs font-black text-slate-900 tracking-tight font-mono">{payment.transactionRef}</span>
                          </td>
                          <td className="px-6 py-6">
                            <div className="text-sm font-black text-slate-900 tracking-tighter">{taxpayer?.name}</div>
                            <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-1">{taxpayer?.tin}</div>
                          </td>
                          <td className="px-6 py-6">
                            <div className="flex items-center gap-2 text-slate-500 font-mono italic text-[11px] font-bold">
                              <Clock className="size-3.5" />
                              {new Date(payment.paymentDate).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-6">
                            <span className="text-xs font-black text-slate-600 tracking-tight uppercase">{payment.taxType}</span>
                          </td>
                          <td className="px-6 py-6">
                            <span className="text-sm font-black text-slate-900 tracking-tighter">FCFA ${payment.amount.toLocaleString()}</span>
                          </td>
                          <td className="px-6 py-6">
                            <span
                              className={`inline-flex px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                                payment.status === 'completed'
                                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                  : payment.status === 'pending'
                                  ? 'bg-orange-50 text-orange-600 border-orange-100'
                                  : payment.status === 'failed'
                                  ? 'bg-rose-50 text-rose-600 border-rose-100'
                                  : 'bg-blue-50 text-blue-600 border-blue-100'
                              }`}
                            >
                              {payment.status}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center justify-end">
                              <Link
                                to={`/accountant/payments/${payment.id}`}
                                className="group relative p-3 bg-white border-2 border-slate-100 rounded-2xl transition-all hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-110 active:scale-95"
                              >
                                <Eye className="size-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-10">
            {/* Payment Telemetry */}
            <div className={`${glassCard} p-8 relative overflow-hidden group`}>
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Activity className="size-24 text-slate-900" />
              </div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] mb-8 italic underline decoration-blue-600 decoration-4 underline-offset-4 w-fit">Matrix Summary</h3>
              <div className="space-y-6 relative z-10">
                {[
                  { label: 'Total Volume', value: 'FCFA 845.2K', sub: '+12.5% M/M', color: 'blue' },
                  { label: 'Completed TXNs', value: '1,429', sub: '98% SUCCESS RATE', color: 'emerald' },
                  { label: 'Pending / Failed', value: '34', sub: 'ACTION REQUIRED', color: 'orange' },
                ].map((stat, i) => {
                  const statTextColor = 
                    stat.color === 'emerald' ? 'text-emerald-700' :
                    stat.color === 'orange' ? 'text-orange-700' :
                    'text-blue-700';
                  
                  const textOpacityMap: Record<string, string> = {
                    emerald: 'text-emerald-600/70',
                    orange: 'text-orange-600/70',
                    blue: 'text-blue-600/70',
                  };
                  const textOpacityClass = textOpacityMap[stat.color] || 'text-blue-600/70';

                  const bgClassMap: Record<string, string> = {
                    emerald: 'bg-emerald-50/50',
                    orange: 'bg-orange-50/50',
                    blue: 'bg-blue-50/50',
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
