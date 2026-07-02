import React from 'react';
import { toast } from 'sonner';
import { 
  Banknote, TrendingUp, AlertTriangle, CheckCircle, 
  Clock, ArrowUpRight, TrendingDown, Terminal, 
  ShieldCheck, Activity, Globe, Download, RefreshCcw, X, FileText, FileSpreadsheet
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { useMockData } from '../../contexts/MockDataContext';

const dailyRevenue = [
  { date: 'Apr 1', amount: 125, target: 150 },
  { date: 'Apr 2', amount: 143, target: 150 },
  { date: 'Apr 3', amount: 167, target: 155 },
  { date: 'Apr 4', amount: 134, target: 160 },
  { date: 'Apr 5', amount: 189, target: 165 },
  { date: 'Apr 6', amount: 156, target: 170 },
  { date: 'Apr 7', amount: 178, target: 175 },
  { date: 'Apr 8', amount: 192, target: 180 },
  { date: 'Apr 9', amount: 205, target: 185 },
];

const paymentMethods = [
  { name: 'Bank Transfer', value: 45, color: '#3b82f6' },
  { name: 'Mobile Pay', value: 38, color: '#10b981' },
  { name: 'Check System', value: 12, color: '#f59e0b' },
  { name: 'Cash Node', value: 8, color: '#8b5cf6' },
];

const ForensicTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950/95 backdrop-blur-2xl border border-white/20 rounded-xl p-6 shadow-2xl animate-in fade-in zoom-in duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(16,185,129,0.05)_50%)] bg-[size:100%_4px] pointer-events-none" />
        <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-3 relative z-10">
          <Terminal className="size-3.5 text-emerald-400" />
          <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] italic font-mono">{label}</span>
        </div>
        <div className="space-y-3 relative z-10">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-10">
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)]" style={{ backgroundColor: entry.color }} />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{entry.name}</span>
              </div>
              <span className="text-sm font-black text-white font-mono italic tracking-tighter">FCFA ${entry.value.toLocaleString()}k</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-white/10 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-3 text-emerald-400" />
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em]">FIN_SECURE</span>
            </div>
            <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function AccountantDashboard() {
  const navigate = useNavigate();
  const { payments } = useMockData();
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [showExportModal, setShowExportModal] = React.useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    toast.info('Initializing Node Sync', { description: 'Pulling latest telemetry...' });
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Sync Complete', { description: 'Telemetry feed updated.' });
    }, 2500);
  };

  const handleExportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowExportModal(false);
    toast.success('Export Initialized', { description: 'Matrix summary downloaded.' });
  };

  const glassCard = 'bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] overflow-hidden';
  const terminalGrid = "bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:30px_30px]";

  const totalAmount = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className={`min-h-screen bg-[#f8fafc] relative overflow-hidden ${terminalGrid}`}>
      {/* Financial Operational Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="p-6 lg:p-10 space-y-10 relative z-10 max-w-[1600px] mx-auto">
        {/* Compact Elite Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative group cursor-pointer">
                <div className="size-5 rounded-full bg-emerald-500/20 animate-ping absolute inset-0" />
                <div className="size-5 rounded-full bg-emerald-600 relative border-[3px] border-white shadow-xl" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.4em]">Financial Terminal</span>
                  <span className="text-slate-300">/</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Node: FIN-ALPHA-09</span>
                </div>
                <div className="h-1 w-32 bg-emerald-600/10 mt-1.5 rounded-full overflow-hidden">
                  <div className={`h-full bg-emerald-600 w-3/4 shadow-[0_0_8px_rgba(16,185,129,0.5)] ${isRefreshing ? 'animate-loading' : ''}`} />
                </div>
              </div>
            </div>
            <h1 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-none italic uppercase">
              Financial <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Overview</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={handleRefresh} disabled={isRefreshing} className="p-5 bg-white border-2 border-slate-100 text-slate-400 rounded-xl hover:text-emerald-600 hover:border-emerald-500 transition-all shadow-sm disabled:opacity-50">
              <RefreshCcw className={`size-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={() => setShowExportModal(true)} className="group relative flex items-center gap-4 px-8 py-5 bg-slate-950 text-white rounded-xl text-[11px] font-black uppercase tracking-[0.3em] overflow-hidden transition-all hover:scale-[1.03] hover:shadow-[0_30px_60px_-15px_rgba(15,23,42,0.4)] active:scale-[0.97]">
              <Download className="size-4 relative z-10 transition-transform group-hover:translate-y-0.5" />
              <span className="relative z-10">Export Registry</span>
            </button>
          </div>
        </div>

        {/* KPI Command Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Total Revenue', value: `FCFA {(totalAmount / 1000).toFixed(1)}k`, trend: '+12%', icon: Banknote, color: 'emerald', sub: 'FIN_RESERVE' },
            { label: 'Completed', value: '1,234', trend: '+5%', icon: CheckCircle, color: 'blue', sub: 'XPAY_SYNC' },
            { label: 'Pending Recon', value: '42', trend: '-2%', icon: Activity, color: 'orange', sub: 'NODE_QUEUED' },
            { label: 'Failed Protocol', value: '12', trend: '0.04%', icon: AlertTriangle, color: 'rose', sub: 'ERROR_LOG' },
          ].map((kpi, i) => {
            const glowBg = 
              kpi.color === 'emerald' ? 'bg-emerald-500/5' :
              kpi.color === 'blue' ? 'bg-blue-500/5' :
              kpi.color === 'orange' ? 'bg-orange-500/5' :
              'bg-rose-500/5';
            
            const iconText = 
              kpi.color === 'emerald' ? 'text-emerald-400' :
              kpi.color === 'blue' ? 'text-blue-400' :
              kpi.color === 'orange' ? 'text-orange-400' :
              'text-rose-400';
            
            const dotBg = 
              kpi.color === 'emerald' ? 'bg-emerald-500' :
              kpi.color === 'blue' ? 'bg-blue-500' :
              kpi.color === 'orange' ? 'bg-orange-500' :
              'bg-rose-500';

            return (
              <div key={i} className={`group relative bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 p-8 shadow-xl hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-700 overflow-hidden cursor-default`}>
                <div className={`absolute -top-16 -right-16 w-48 h-48 ${glowBg} rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-1000`} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="p-4 bg-slate-950 text-white rounded-xl shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-white/10">
                      <kpi.icon className={`size-6 ${iconText}`} />
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black tracking-[0.1em] uppercase ${kpi.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {kpi.trend.startsWith('+') ? <ArrowUpRight className="size-3" /> : <TrendingDown className="size-3" />}
                      {kpi.trend}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`size-1 rounded-full ${dotBg}`} />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] font-mono">{kpi.sub}</span>
                  </div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{kpi.label}</div>
                  <div className="text-4xl font-black text-slate-900 tracking-tighter group-hover:text-emerald-600 transition-colors italic uppercase">{kpi.value}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Financial Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Daily Revenue Trend */}
          <div className={`${glassCard} p-8 lg:p-10 relative group`}>
            <div className="absolute top-8 right-8 flex items-center gap-2">
              <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] italic font-mono">FIN_STREAM_ACTIVE</span>
            </div>
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="size-5 text-emerald-600" />
                <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-emerald-600 decoration-4 underline-offset-4">Revenue Velocity</h3>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-3">Temporal collection trends and fiscal trajectory</p>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={dailyRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }} dx={-10} />
                <Tooltip content={<ForensicTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area type="monotone" dataKey="target" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 4" fill="url(#colorTarget)" name="Target" animationDuration={1500} />
                <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={4} fill="url(#colorRevenue)" name="Revenue" animationDuration={1500} activeDot={{ r: 6, strokeWidth: 3, stroke: '#fff', fill: '#10b981' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Payment Methods */}
          <div className={`${glassCard} p-8 lg:p-10 relative group`}>
            <div className="absolute top-8 right-8 flex items-center gap-2">
              <div className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] italic font-mono">CHANNEL_SYNK: 100%</span>
            </div>
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <Globe className="size-5 text-blue-600" />
                <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-blue-600 decoration-4 underline-offset-4">Asset Distribution</h3>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-3">Payment channel allocation and volume metrics</p>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Tooltip content={<ForensicTooltip />} />
                <Pie
                  data={paymentMethods}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={8}
                  animationDuration={1500}
                >
                  {paymentMethods.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Forensic Transaction Matrix */}
        <div className={glassCard}>
          <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="size-5 text-emerald-600" />
              <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">Recent Transactions</h3>
            </div>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
              Live Feed: Monitoring {payments.length} Global Units
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-6 text-left text-[10px] font-black italic text-slate-400 uppercase tracking-[0.2em]">Registry Ref</th>
                  <th className="px-6 py-6 text-left text-[10px] font-black italic text-slate-400 uppercase tracking-[0.2em]">Temporal Node</th>
                  <th className="px-6 py-6 text-left text-[10px] font-black italic text-slate-400 uppercase tracking-[0.2em]">Protocol Type</th>
                  <th className="px-6 py-6 text-left text-[10px] font-black italic text-slate-400 uppercase tracking-[0.2em]">Channel</th>
                  <th className="px-6 py-6 text-left text-[10px] font-black italic text-slate-400 uppercase tracking-[0.2em]">Asset Value</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black italic text-slate-400 uppercase tracking-[0.2em]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((payment) => (
                  <tr key={payment.id} onClick={() => navigate(`/accountant/payments/${payment.transactionRef}`)} className="hover:bg-emerald-50/20 transition-all group cursor-pointer">
                    <td className="px-8 py-6">
                      <span className="text-xs font-black text-slate-900 tracking-tight font-mono">{payment.transactionRef}</span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3 text-slate-500 font-mono italic text-[11px] font-bold">
                        <Clock className="size-3.5" />
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl w-fit">
                        <Terminal className="size-3.5 text-slate-400" />
                        <span className="text-[11px] font-black text-slate-600 tracking-tight uppercase">{payment.taxType}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{payment.paymentMethod.replace('_', ' ')}</span>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-sm font-black text-slate-900 tracking-tighter">FCFA ${payment.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        payment.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        payment.status === 'pending'   ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        'bg-rose-50 text-rose-600 border-rose-100'
                      }`}>
                        <div className={`size-1.5 rounded-full ${payment.status === 'completed' ? 'bg-emerald-500 animate-pulse' : 'bg-current'}`} />
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Export Matrix Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-10 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowExportModal(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-10 border border-slate-100 text-center">
            <button onClick={() => setShowExportModal(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
              <X className="size-5" />
            </button>
            <div className="mx-auto w-16 h-16 rounded-full bg-slate-950 text-white flex items-center justify-center mb-6 shadow-xl shadow-slate-900/20">
              <Download className="size-8" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic mb-2">
              Export Registry
            </h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-8">Select Payload Format</p>
            <form onSubmit={handleExportSubmit} className="space-y-4 text-left">
              <label className="flex items-center gap-4 p-4 border-2 border-slate-100 rounded-2xl cursor-pointer hover:border-blue-500 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 transition-colors">
                <input type="radio" name="format" defaultChecked className="mt-0.5 text-blue-600 focus:ring-blue-500" />
                <div className="flex items-center gap-3">
                  <FileText className="size-5 text-blue-600" />
                  <div>
                    <div className="text-xs font-black uppercase text-slate-900 tracking-widest">PDF Document</div>
                    <div className="text-[9px] font-bold text-slate-400">Secure Read-Only</div>
                  </div>
                </div>
              </label>
              <label className="flex items-center gap-4 p-4 border-2 border-slate-100 rounded-2xl cursor-pointer hover:border-emerald-500 has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50 transition-colors">
                <input type="radio" name="format" className="mt-0.5 text-emerald-600 focus:ring-emerald-500" />
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="size-5 text-emerald-600" />
                  <div>
                    <div className="text-xs font-black uppercase text-slate-900 tracking-widest">Excel / CSV</div>
                    <div className="text-[9px] font-bold text-slate-400">Raw Data Format</div>
                  </div>
                </div>
              </label>
              <button type="submit" className="w-full py-4 mt-6 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 active:scale-95 transition-all shadow-xl shadow-slate-900/20">
                Execute Export
              </button>
            </form>
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
