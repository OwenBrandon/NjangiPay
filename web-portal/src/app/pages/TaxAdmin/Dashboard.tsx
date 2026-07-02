import { getColorClass } from '../../utils/colorClasses';
import React from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { 
  Users, FileCheck, AlertTriangle, Banknote, 
  TrendingUp, Activity, ArrowUpRight, ArrowDownRight,
  MoreVertical, Calendar, Download, RefreshCcw,
  Target, ShieldCheck, Zap, Layers, History, Globe,
  Briefcase, TrendingDown, Clock, MousePointer2, Send
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { useMockData } from '../../contexts/MockDataContext';

const performanceData = [
  { day: 'Mon', revenue: 4200, target: 4000, compliance: 85 },
  { day: 'Tue', revenue: 3800, target: 4000, compliance: 82 },
  { day: 'Wed', revenue: 5100, target: 4000, compliance: 92 },
  { day: 'Thu', revenue: 4600, target: 4000, compliance: 88 },
  { day: 'Fri', revenue: 5800, target: 4000, compliance: 95 },
  { day: 'Sat', revenue: 3200, target: 4000, compliance: 78 },
  { day: 'Sun', revenue: 2900, target: 4000, compliance: 75 },
];

const distributionData = [
  { name: 'Direct Assessment', value: 45, color: '#3b82f6' },
  { name: 'VAT', value: 30, color: '#0ea5e9' },
  { name: 'Corporate Tax', value: 15, color: '#f59e0b' },
  { name: 'Property Tax', value: 10, color: '#6366f1' },
];

const glassCard = 'bg-white rounded-2xl border border-slate-200/60 shadow-2xl shadow-blue-900/5 overflow-hidden';

export default function TaxAdminDashboard() {
  const navigate = useNavigate();
  const { taxpayers, taxReturns, assessments } = useMockData();
  const regionName = 'Central Region';
  const totalTaxpayers = taxpayers.length;
  const filingRate = 87;
  const overdueReturns = taxReturns.filter(tr => tr.status === 'overdue').length;
  const pendingAssessments = assessments.filter(a => a.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#f1f5f9] relative overflow-hidden">
      {/* Surgical Operational Background Blobs */}
      <div className="absolute top-[-15%] left-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[25%] right-[5%] w-[30%] h-[30%] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="p-6 lg:p-10 space-y-12 relative z-10">
        {/* Surgical Command Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="size-3 rounded-full bg-blue-500 animate-ping absolute inset-0" />
                <div className="size-3 rounded-full bg-blue-600 relative" />
              </div>
              <span className="px-3 py-1 bg-blue-100/50 border border-blue-200 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Operational Terminal</span>
              <span className="text-slate-400">•</span>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">{regionName} Command Hub</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">Institutional Overview</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 p-1.5 bg-white/70 backdrop-blur-md border border-white rounded-3xl shadow-sm">
              <button onClick={() => toast.info('Timeframe Adjusted', { description: 'Showing Today telemetry' })} className="px-6 py-2.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-400/50">Today</button>
              <button onClick={() => toast.info('Timeframe Adjusted', { description: 'Showing Weekly telemetry' })} className="px-6 py-2.5 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-slate-900 transition-all">Weekly</button>
              <button onClick={() => toast.info('Timeframe Adjusted', { description: 'Showing Monthly telemetry' })} className="px-6 py-2.5 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-slate-900 transition-all">Monthly</button>
            </div>
            <button onClick={() => { toast.success('Dashboard Report Exported'); }} className="p-4 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:text-blue-600 transition-all shadow-sm">
              <Download className="size-5" />
            </button>
            <button onClick={() => toast.success('Telemetry Synced', { description: 'Operational nodes updated successfully.' })} className="p-4 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all">
              <RefreshCcw className="size-5" />
            </button>
          </div>
        </div>

        {/* KPI Command Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Total Taxpayers', value: totalTaxpayers.toLocaleString(), trend: '+5.2%', icon: Users, color: 'blue', accent: 'bg-blue-100/60' },
            { label: 'Filing Compliance', value: `${filingRate}%`, trend: '+2.4%', icon: FileCheck, color: 'sky', accent: 'bg-sky-100/60' },
            { label: 'Overdue Volume', value: overdueReturns, trend: '-1.8%', icon: AlertTriangle, color: 'rose', accent: 'bg-rose-100/60' },
            { label: 'Pending Assessments', value: pendingAssessments, trend: '+12%', icon: Banknote, color: 'amber', accent: 'bg-amber-100/60' },
          ].map((kpi, i) => (
            <div key={i} className={`group relative bg-white rounded-2xl border border-slate-100 p-9 shadow-lg hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-700 overflow-hidden cursor-default`}>
              <div className={`absolute -top-16 -right-16 w-40 h-40 ${getColorClass(kpi.color, 'bg500_5')} rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-1000`} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div 
                    className="p-5 shadow-md rounded-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-white/50"
                    style={{ background: '#0d1929', color: '#38bdf8' }}
                  >
                    <kpi.icon className="size-7" />
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black tracking-[0.1em] uppercase ${kpi.trend.startsWith('+') ? 'bg-sky-100 text-sky-600' : 'bg-rose-100 text-rose-600'}`}>
                    {kpi.trend.startsWith('+') ? <ArrowUpRight className="size-3" /> : <TrendingDown className="size-3" />}
                    {kpi.trend}
                  </div>
                </div>
                <div className="text-[11px] font-black text-slate-600 uppercase tracking-[0.25em] mb-3">{kpi.label}</div>
                <div className="text-5xl font-black text-slate-900 tracking-tighter group-hover:text-blue-600 transition-colors">{kpi.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Revenue Intelligence Terminal */}
          <div className={`lg:col-span-2 ${glassCard} p-10 lg:p-14`}>
            <div className="flex items-center justify-between mb-12">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Operational Performance</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Financial telemetry and compliance threshold analysis</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3"><div className="size-3 rounded-full bg-blue-500 shadow-lg" /><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue Flow</span></div>
                <div className="flex items-center gap-3"><div className="size-3 rounded-full bg-emerald-500 shadow-lg" /><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compliance</span></div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 900 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 900 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '25px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', padding: '20px' }}
                  itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="compliance" stroke="#0ea5e9" strokeWidth={4} fillOpacity={1} fill="url(#colorComp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Portfolio Distribution Mix */}
          <div className={`${glassCard} p-10 lg:p-14 flex flex-col`}>
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Portfolio Mix</h3>
              <button className="p-3 text-slate-400 hover:bg-slate-50 rounded-2xl transition-all"><MoreVertical className="size-6" /></button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie 
                    data={distributionData} 
                    cx="50%" cy="50%" 
                    innerRadius={80} 
                    outerRadius={110} 
                    paddingAngle={10} 
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-8 mt-12 w-full">
                {distributionData.map((item) => (
                  <div key={item.name} className="group cursor-pointer">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="size-3 rounded-full transition-transform group-hover:scale-150 shadow-sm" style={{ backgroundColor: item.color }} />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.name}</span>
                    </div>
                    <div className="text-xl font-black text-slate-900 ml-6 tracking-tighter group-hover:text-blue-600 transition-colors">{item.value}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Surgical Operational Logs */}
          <div className={`${glassCard}`}>
            <div className="p-10 lg:p-12 border-b border-white/50 bg-white/30 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-blue-100 text-blue-600 rounded-xl shadow-sm">
                  <Zap className="size-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Operational Log</h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Real-time registry activity</p>
                </div>
              </div>
              <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black tracking-[0.2em] animate-pulse border border-emerald-100">REAL-TIME</span>
            </div>
            <div className="divide-y divide-slate-100/50 max-h-[500px] overflow-y-auto custom-scrollbar">
              {taxpayers.slice(0, 8).map((taxpayer) => (
                <div key={taxpayer.id} className="p-8 hover:bg-blue-50/30 transition-all group cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="size-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-lg font-black text-white group-hover:bg-blue-600 transition-all shadow-xl">
                        {taxpayer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">{taxpayer.name}</div>
                        <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{taxpayer.tin} • <span className="text-blue-500">{taxpayer.region}</span></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{new Date(taxpayer.registrationDate).toLocaleDateString()}</div>
                      <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        taxpayer.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        <div className={`size-2 rounded-full ${taxpayer.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'} shadow-sm`} />
                        {taxpayer.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/tax-admin/taxpayers')} className="w-full p-6 bg-slate-50/50 text-slate-500 hover:text-blue-600 font-black text-[10px] uppercase tracking-[0.3em] transition-all border-t border-slate-100">
              Access Full Global Roster
            </button>
          </div>

          {/* Quick Strategic Action Matrix */}
          <div className="grid grid-cols-2 gap-8">
            {[
              { label: 'Asset Assessment', desc: 'Execute fiscal audits & intelligence', icon: Target, color: 'blue', bg: 'bg-blue-50', border: 'border-blue-100', route: '/tax-admin/assessments/create' },
              { label: 'Security Protocols', desc: 'Configure multi-node access nodes', icon: ShieldCheck, color: 'sky', bg: 'bg-sky-50', border: 'border-sky-100', toast: 'Security protocols updated' },
              { label: 'Data Warehouse', desc: 'Archive historic fiscal records', icon: Layers, color: 'purple', bg: 'bg-purple-50', border: 'border-purple-100', toast: 'Accessing secure data warehouse...' },

              { label: 'History Monitor', desc: 'Review audit trail telemetry', icon: History, color: 'indigo', bg: 'bg-indigo-50', border: 'border-indigo-100', route: '/tax-admin/reports' },
              { label: 'Global Intel', desc: 'View international tax nodes', icon: Globe, color: 'rose', bg: 'bg-rose-50', border: 'border-rose-100', route: '/tax-admin/field-operations' },
            ].map((action, i) => (
              <button 
                key={i} 
                onClick={() => {
                  if (action.route) navigate(action.route);
                  else if (action.toast) toast.info(action.toast);
                }}
                className={`bg-white p-10 rounded-2xl border border-slate-100 shadow-lg hover:shadow-2xl hover:shadow-slate-300/50 hover:-translate-y-2 transition-all duration-500 text-left group overflow-hidden relative`}
              >
                <div className={`absolute -top-10 -right-10 w-24 h-24 ${action.bg} rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-700 blur-2xl`} />
                <div 
                  className={`p-5 w-fit rounded-xl mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-sm border`}
                  style={{ background: '#0d1929', color: '#38bdf8' }}
                >
                  <action.icon className="size-7" />
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-3 tracking-tight group-hover:text-blue-600 transition-colors uppercase">{action.label}</h4>
                <p className="text-xs text-slate-600 font-bold leading-relaxed">{action.desc}</p>
                <div className="mt-8 flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                  Initialize Protocol
                  <ArrowUpRight className="size-3" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
