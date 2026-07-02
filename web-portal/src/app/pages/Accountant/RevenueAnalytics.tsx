import { getColorClass } from '../../utils/colorClasses';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart 
} from 'recharts';
import { 
  Banknote, TrendingUp, TrendingDown, Users, Calendar, Download, Filter, 
  ArrowUpRight, ArrowDownRight, Activity, Terminal, ShieldCheck, Globe, History, RefreshCcw, Layers, Clock, AlertTriangle, X, FileText, FileSpreadsheet
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

const monthlyRevenue = [
  { month: 'JUL', revenue: 845000, target: 900000, previous: 780000, collections: 782000 },
  { month: 'AUG', revenue: 923000, target: 920000, previous: 820000, collections: 895000 },
  { month: 'SEP', revenue: 978000, target: 950000, previous: 890000, collections: 945000 },
  { month: 'OCT', revenue: 1050000, target: 980000, previous: 920000, collections: 1020000 },
  { month: 'NOV', revenue: 1120000, target: 1000000, previous: 980000, collections: 1089000 },
  { month: 'DEC', revenue: 1245000, target: 1100000, previous: 1050000, collections: 1198000 },
  { month: 'JAN', revenue: 1180000, target: 1150000, previous: 1100000, collections: 1145000 },
  { month: 'FEB', revenue: 1290000, target: 1200000, previous: 1150000, collections: 1256000 },
  { month: 'MAR', revenue: 1350000, target: 1250000, previous: 1200000, collections: 1320000 },
  { month: 'APR', revenue: 1410000, target: 1300000, previous: 1250000, collections: 1378000 },
];

const waveData = [
  { month: 'JUL', revenue: 500, collections: 500, target: 500, previous: 500 },
  { month: 'AUG', revenue: 530, collections: 470, target: 510, previous: 490 },
  { month: 'SEP', revenue: 650, collections: 380, target: 550, previous: 450 },
  { month: 'OCT', revenue: 780, collections: 550, target: 450, previous: 650 },
  { month: 'NOV', revenue: 450, collections: 720, target: 350, previous: 550 },
  { month: 'DEC', revenue: 350, collections: 650, target: 550, previous: 420 },
  { month: 'JAN', revenue: 450, collections: 480, target: 680, previous: 380 },
  { month: 'FEB', revenue: 490, collections: 490, target: 530, previous: 470 },
  { month: 'MAR', revenue: 500, collections: 500, target: 500, previous: 500 },
  { month: 'APR', revenue: 500, collections: 500, target: 500, previous: 500 },
];

const baseHeatmapData = [
  { time: '8 am', values: [1, 2, 2, 3, 2, 1, 1] },
  { time: '10 am', values: [3, 4, 3, 5, 4, 2, 1] },
  { time: '12 pm', values: [4, 5, 4, 5, 5, 3, 2] },
  { time: '2 pm', values: [3, 4, 4, 5, 4, 2, 1] },
  { time: '4 pm', values: [2, 3, 3, 4, 3, 1, 1] },
  { time: '6 pm', values: [1, 2, 1, 2, 2, 1, 1] },
];

const revenueBySource = [
  { name: 'VAT_UNIT', value: 4250000, percentage: 35, color: '#3b82f6', growth: 12.5 },
  { name: 'CIT_UNIT', value: 3650000, percentage: 30, color: '#8b5cf6', growth: 8.3 },
  { name: 'PIT_UNIT', value: 2430000, percentage: 20, color: '#ec4899', growth: 15.7 },
  { name: 'WHT_UNIT', value: 1215000, percentage: 10, color: '#f59e0b', growth: -2.1 },
  { name: 'OTHER_NODES', value: 607500, percentage: 5, color: '#10b981', growth: 5.4 },
];

const dailyCollections = [
  { date: 'MON', amount: 45000, transactions: 234 },
  { date: 'TUE', amount: 52000, transactions: 289 },
  { date: 'WED', amount: 48000, transactions: 256 },
  { date: 'THU', amount: 61000, transactions: 312 },
  { date: 'FRI', amount: 58000, transactions: 298 },
  { date: 'SAT', amount: 23000, transactions: 145 },
  { date: 'SUN', amount: 12000, transactions: 87 },
];

const paymentMethods = [
  { method: 'BANK_TRANS', amount: 5650000, percentage: 58, transactions: 2345 },
  { method: 'MOBILE_PAY', amount: 2920000, percentage: 30, transactions: 4567 },
  { method: 'POS_GATE', amount: 876000, percentage: 9, transactions: 1234 },
  { method: 'CASH_NODE', amount: 292000, percentage: 3, transactions: 456 },
];

const topContributors = [
  { name: 'ABC Manufacturing Ltd', amount: 850000, type: 'CIT', status: 'paid', change: 15 },
  { name: 'XYZ Telecom Inc', amount: 720000, type: 'VAT', status: 'paid', change: 8 },
  { name: 'Global Trading Co', amount: 680000, type: 'WHT', status: 'pending', change: -3 },
  { name: 'Tech Solutions Ltd', amount: 560000, type: 'CIT', status: 'paid', change: 22 },
  { name: 'Retail Enterprises', amount: 490000, type: 'VAT', status: 'paid', change: 5 },
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
              <span className="text-sm font-black text-white font-mono italic tracking-tighter">FCFA ${entry.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-white/10 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-3 text-emerald-400" />
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em]">DATA_INTEGRITY</span>
            </div>
            <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function RevenueAnalytics() {
  const [timeRange, setTimeRange] = useState('monthly');
  const [streamTab, setStreamTab] = useState('revenue');
  const [activityTab, setActivityTab] = useState('weekly');
  const [showTemporalModal, setShowTemporalModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const handleTemporalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowTemporalModal(false);
    toast.success('Timeline Matrix Adjusted', { description: 'Graphs and nodes rerendered based on new temporal constraints.' });
  };

  const handleExportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowExportModal(false);
    toast.success('Export Initialized', { description: 'Analytics matrix downloaded.' });
  };
  
  const glassCard = 'bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] overflow-hidden';
  const terminalGrid = "bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:30px_30px]";

  const currentMonthRevenue = monthlyRevenue[monthlyRevenue.length - 1].revenue;
  const previousMonthRevenue = monthlyRevenue[monthlyRevenue.length - 2].revenue;
  const revenueGrowth = ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;

  const currentStreamData = streamTab === 'revenue' ? waveData : [...waveData].map(d => ({ ...d, revenue: d.revenue * 1.15, collections: d.collections * 1.05 }));
  const currentActivityData = activityTab === 'weekly' ? baseHeatmapData : baseHeatmapData.map((row, i) => ({ ...row, values: row.values.map(v => Math.min(5, Math.max(1, v + (i % 2 === 0 ? 1 : -1)))) }));

  return (
    <div className={`min-h-screen bg-[#f8fafc] relative overflow-hidden ${terminalGrid}`}>
      {/* Revenue Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-500/5 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

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
                  <span className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.4em]">Analytics Node</span>
                  <span className="text-slate-300">/</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Node: REV-ANALYTICS-X</span>
                </div>
                <div className="h-1 w-32 bg-emerald-600/10 mt-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 w-full animate-loading shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-none italic uppercase">
              Revenue <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Analytics</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Select defaultValue="april">
              <SelectTrigger className="w-[180px] bg-white border-2 border-slate-100 rounded-xl h-[60px] text-[11px] font-black uppercase tracking-widest outline-none focus:border-emerald-500 transition-all">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                <SelectItem value="april">April 2026</SelectItem>
                <SelectItem value="march">March 2026</SelectItem>
                <SelectItem value="february">February 2026</SelectItem>
              </SelectContent>
            </Select>
            <button onClick={() => setShowTemporalModal(true)} className="p-5 bg-white border-2 border-slate-100 text-slate-400 rounded-xl hover:text-emerald-600 hover:border-emerald-500 transition-all shadow-sm">
              <Calendar className="size-5" />
            </button>
            <button onClick={() => setShowExportModal(true)} className="group relative flex items-center gap-4 px-8 py-5 bg-slate-950 text-white rounded-xl text-[11px] font-black uppercase tracking-[0.3em] overflow-hidden transition-all hover:scale-[1.03] shadow-xl">
              <Download className="size-4 relative z-10 transition-transform group-hover:translate-y-0.5" />
              <span className="relative z-10">Export Dataset</span>
            </button>
          </div>
        </div>

        {/* KPI Command Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Total Revenue', value: `FCFA ${(currentMonthRevenue / 1000).toFixed(0)}K`, trend: `+${revenueGrowth.toFixed(1)}%`, icon: Banknote, color: 'emerald', sub: 'REV_STREAM' },
            { label: 'Collections', value: '97.7%', trend: '+2.1%', icon: TrendingUp, color: 'blue', sub: 'INTAKE_VELOCITY' },
            { label: 'Active Units', value: '3,457', trend: '+8.3%', icon: Users, color: 'purple', sub: 'NODE_COUNT' },
            { label: 'Avg Transaction', value: `FCFA ${((currentMonthRevenue / 3457)).toFixed(0)}`, trend: '+5.2%', icon: Activity, color: 'orange', sub: 'UNIT_VALUE' },
          ].map((kpi, i) => (
            <div key={i} className={`group relative bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 p-8 shadow-xl hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-700 overflow-hidden`}>
              <div className={`absolute -top-16 -right-16 w-48 h-48 ${getColorClass(kpi.color, 'bg500_5')} rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-1000`} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="p-4 bg-slate-950 text-white rounded-xl shadow-2xl border border-white/10">
                    <kpi.icon className="size-6 text-emerald-400" />
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black tracking-[0.1em] uppercase ${kpi.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {kpi.trend.startsWith('+') ? <ArrowUpRight className="size-3" /> : <TrendingDown className="size-3" />}
                    {kpi.trend}
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`size-1 rounded-full ${getColorClass(kpi.color, 'bg500')}`} />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] font-mono">{kpi.sub}</span>
                </div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{kpi.label}</div>
                <div className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">{kpi.value}</div>
              </div>
            </div>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-10">
          <TabsList className="bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-xl p-2 shadow-lg w-fit">
            {['overview', 'sources', 'collections', 'reconciliation'].map((tab) => (
              <TabsTrigger 
                key={tab} 
                value={tab}
                className="px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all"
              >
                {tab.toUpperCase()}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className={`lg:col-span-2 ${glassCard} p-8 lg:p-10 relative group`}>
                <div className="absolute top-8 right-8 flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] italic font-mono">FLOW_VELOCITY_STABLE</span>
                </div>
                <div className="mb-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingUp className="size-5 text-emerald-600" />
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-emerald-600 decoration-4 underline-offset-4">
                        {streamTab === 'revenue' ? 'Revenue Stream Analysis' : 'Strategic Projections'}
                      </h3>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-3">
                      {streamTab === 'revenue' ? 'Temporal collection metrics vs tactical targets' : 'Forecasting fiscal growth and target projections'}
                    </p>
                  </div>
                  <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
                    {['revenue', 'projections'].map(tab => (
                      <button 
                        key={tab}
                        onClick={() => setStreamTab(tab)}
                        className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${streamTab === tab ? 'bg-white text-emerald-600 shadow-md border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={currentStreamData} margin={{ top: 20, right: 20, left: -20, bottom: 20 }}>
                    <defs>
                      <filter id="glowPink" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="15" stdDeviation="15" floodColor="#ec4899" floodOpacity="0.4" />
                      </filter>
                      <filter id="glowBlue" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="15" stdDeviation="15" floodColor="#06b6d4" floodOpacity="0.3" />
                      </filter>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} horizontal={true} opacity={0.5} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 900 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 900 }} dx={-10} domain={[200, 900]} />
                    <Tooltip content={<ForensicTooltip />} />
                    <Legend 
                      verticalAlign="top" 
                      align="right" 
                      iconType="circle"
                      wrapperStyle={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', paddingBottom: '20px', letterSpacing: '0.2em' }} 
                    />
                    <Line type="basis" dataKey="revenue" stroke="#8b5cf6" strokeWidth={4} dot={false} name="Gross Revenue" animationDuration={1000} />
                    <Line type="basis" dataKey="collections" stroke="#ec4899" strokeWidth={4} dot={false} name="Actual Collections" filter="url(#glowPink)" animationDuration={1000} />
                    <Line type="basis" dataKey="target" stroke="#f59e0b" strokeWidth={4} dot={false} name="Strategic Target" animationDuration={1000} />
                    <Line type="basis" dataKey="previous" stroke="#06b6d4" strokeWidth={4} dot={false} name="Previous Cycle" filter="url(#glowBlue)" animationDuration={1000} />
                  </LineChart>
                </ResponsiveContainer>

                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-slate-100">
                  {[
                    { label: streamTab === 'revenue' ? 'Peak Velocity' : 'Peak Projection', value: streamTab === 'revenue' ? '845 Units' : '1.2k Units', trend: '+12%', color: 'emerald' },
                    { label: 'Average Target', value: streamTab === 'revenue' ? '450 Base' : '680 Base', trend: 'Stable', color: 'blue' },
                    { label: 'Current Phase', value: streamTab === 'revenue' ? 'Expansion' : 'Scaling', trend: 'Active', color: 'purple' },
                    { label: 'Node Variance', value: '±4.2%', trend: '-1.5%', color: 'orange' },
                  ].map((stat, i) => (
                    <div key={i} className="flex flex-col gap-2 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
                        <div className={`size-1.5 rounded-full ${getColorClass(stat.color, 'bg500')}`} />
                      </div>
                      <div className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">{stat.value}</div>
                      <div className={`text-[9px] font-black uppercase tracking-widest ${stat.trend.startsWith('-') ? 'text-rose-500' : 'text-emerald-500'}`}>{stat.trend}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${glassCard} p-8 lg:p-10 relative group`}>
                <div className="absolute top-8 right-8 flex items-center gap-2">
                  <Activity className="size-4 text-emerald-500" />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] italic font-mono">QUICK_STATS_STREAM</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase mb-8 italic underline decoration-slate-900 decoration-4 underline-offset-4">Key Telemetry</h3>
                <div className="space-y-6">
                  {[
                    { label: 'YTD Revenue', value: 'FCFA 12.5M', change: 15.3, trend: 'up' },
                    { label: 'Target Ratio', value: '108.5%', change: 8.5, trend: 'up' },
                    { label: 'Efficiency', value: '97.7%', change: 2.1, trend: 'up' },
                    { label: 'Daily Average', value: 'FCFA 47K', change: -1.2, trend: 'down' },
                    { label: 'Outstanding', value: 'FCFA 234K', change: -12.5, trend: 'down' },
                  ].map((stat, idx) => (
                    <div key={idx} className="p-6 bg-slate-50/50 border border-slate-100 rounded-xl hover:bg-white hover:shadow-xl transition-all group/stat">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
                        <div className={`flex items-center gap-1 text-[10px] font-black ${stat.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {stat.trend === 'up' ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                          <span>{Math.abs(stat.change)}%</span>
                        </div>
                      </div>
                      <div className="text-2xl font-black text-slate-900 italic tracking-tighter group-hover/stat:text-emerald-600 transition-colors uppercase">{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className={`${glassCard} p-8 lg:p-10 relative group`}>
                <div className="absolute top-8 right-8">
                  <ArrowUpRight className="size-5 text-slate-400 group-hover:text-emerald-600 transition-colors cursor-pointer" />
                </div>
                <div className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3">
                      <Activity className="size-6 text-emerald-600" />
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-emerald-600 decoration-4 underline-offset-4">
                        {activityTab === 'weekly' ? 'Weekly Activity Log' : 'Monthly Performance'}
                      </h3>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-3">
                      {activityTab === 'weekly' ? 'Transaction density across temporal nodes' : 'Aggregated transaction volume across monthly nodes'}
                    </p>
                  </div>
                  <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
                    {['weekly', 'monthly'].map(tab => (
                      <button 
                        key={tab}
                        onClick={() => setActivityTab(tab)}
                        className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activityTab === tab ? 'bg-white text-emerald-600 shadow-md border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2.5">
                  <div className="flex ml-14">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                      <div key={day} className="flex-1 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">{day}</div>
                    ))}
                  </div>
                  {currentActivityData.map((row, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-10 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">{row.time}</div>
                      <div className="flex flex-1 gap-2.5">
                        {row.values.map((val, j) => {
                          const bg = 
                            val === 1 ? 'bg-slate-100' :
                            val === 2 ? 'bg-emerald-100' :
                            val === 3 ? 'bg-emerald-300' :
                            val === 4 ? 'bg-emerald-500' : 'bg-emerald-700 shadow-lg shadow-emerald-500/30';
                          return (
                            <div key={j} className={`flex-1 aspect-[4/3] rounded-xl ${bg} transition-all duration-300 hover:scale-110 hover:ring-2 hover:ring-emerald-400 cursor-pointer`} />
                          )
                        })}
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-end items-center gap-2 mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>Less</span>
                    <div className="flex gap-1.5 ml-2 mr-2">
                      <div className="w-5 h-3 rounded bg-slate-100"></div>
                      <div className="w-5 h-3 rounded bg-emerald-100"></div>
                      <div className="w-5 h-3 rounded bg-emerald-300"></div>
                      <div className="w-5 h-3 rounded bg-emerald-500"></div>
                      <div className="w-5 h-3 rounded bg-emerald-700"></div>
                    </div>
                    <span>More</span>
                  </div>
                </div>
              </div>

              <div className={`${glassCard} p-8 lg:p-10 relative group`}>
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-2">
                    <Layers className="size-5 text-indigo-600" />
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-indigo-600 decoration-4 underline-offset-4">Top Contributor Matrix</h3>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-3">High-impact revenue nodes currently active</p>
                </div>
                <div className="space-y-4">
                  {topContributors.map((contributor, idx) => (
                    <div key={idx} className="p-6 bg-slate-50/50 border border-slate-100 rounded-xl hover:bg-white hover:shadow-xl transition-all group/item">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                          <div className="size-12 rounded-2xl bg-slate-950 flex items-center justify-center text-lg font-black text-white italic group-hover/item:bg-emerald-600 transition-all shadow-xl">
                            {contributor.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-black text-slate-900 uppercase italic tracking-tight group-hover/item:text-emerald-600 transition-colors">{contributor.name}</div>
                            <div className="flex items-center gap-3 mt-1.5">
                              <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[9px] font-black text-slate-500 uppercase tracking-widest">{contributor.type}</span>
                              <div className="size-1 rounded-full bg-slate-300" />
                              <span className={`text-[9px] font-black uppercase tracking-widest ${contributor.status === 'paid' ? 'text-emerald-600' : 'text-orange-600'}`}>
                                {contributor.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-black text-slate-900 italic tracking-tighter uppercase">{"FCFA "}{(contributor.amount / 1000).toFixed(0)}K</div>
                          <div className={`flex items-center justify-end gap-1 text-[10px] font-black mt-1 ${contributor.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {contributor.change >= 0 ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                            <span>{Math.abs(contributor.change)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sources" className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className={`${glassCard} p-8 lg:p-10 relative group`}>
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-2">
                    <Globe className="size-5 text-blue-600" />
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-blue-600 decoration-4 underline-offset-4">Revenue Allocation Matrix</h3>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-3">Distribution of revenue across operational units</p>
                </div>
                <div className="flex flex-col items-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={revenueBySource}
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
                        {revenueBySource.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<ForensicTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-6 w-full mt-8">
                    {revenueBySource.map((source, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                        <div className="size-3 rounded-full" style={{ backgroundColor: source.color }} />
                        <div className="flex-1">
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{source.name}</div>
                          <div className="text-sm font-black text-slate-900 italic tracking-tighter">{"FCFA "}{(source.value / 1000000).toFixed(1)}M ({source.percentage}%)</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={`${glassCard} p-8 lg:p-10 relative group`}>
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="size-5 text-emerald-600" />
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-emerald-600 decoration-4 underline-offset-4">Unit Performance Ledger</h3>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-3">Comparative growth velocity per revenue node</p>
                </div>
                <div className="space-y-6">
                  {revenueBySource.sort((a, b) => b.growth - a.growth).map((source, i) => (
                    <div key={i} className="group/unit">
                      <div className="flex justify-between items-end mb-3">
                        <div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{source.name}</span>
                          <h4 className="text-lg font-black text-slate-900 italic tracking-tighter uppercase group-hover/unit:text-emerald-600 transition-colors">Revenue Stream {i+1}</h4>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs font-black italic ${source.growth >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {source.growth >= 0 ? '+' : ''}{source.growth}% Growth
                          </span>
                        </div>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-1000"
                          style={{ 
                            width: `${Math.max(20, (source.value / 4250000) * 100)}%`,
                            backgroundColor: source.color 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="collections" className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className={`${glassCard} p-8 lg:p-10 relative group`}>
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="size-5 text-indigo-600" />
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-indigo-600 decoration-4 underline-offset-4">Collection Efficiency Trend</h3>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-3">Monitoring target billing vs actual liquid collections</p>
              </div>
              <ResponsiveContainer width="100%" height={380}>
                <ComposedChart data={monthlyRevenue} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorActualColl" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 900 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 900 }} dx={-10} />
                  <Tooltip content={<ForensicTooltip />} cursor={{ fill: '#f8fafc' }} />
                  <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', paddingBottom: '30px', letterSpacing: '0.1em' }} />
                  <Bar dataKey="target" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Billed Amount" barSize={40} />
                  <Area type="monotone" dataKey="collections" stroke="#10b981" strokeWidth={4} fill="url(#colorActualColl)" name="Collected" animationDuration={2000} />
                  <Line type="monotone" dataKey="collections" stroke="#10b981" strokeWidth={0} dot={{ r: 4, fill: '#fff', strokeWidth: 3, stroke: '#10b981' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className={`${glassCard} p-8 lg:p-10 relative group`}>
                <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase mb-8 italic underline decoration-emerald-600 decoration-4 underline-offset-4">Channel Velocity</h3>
                <div className="space-y-8">
                  {paymentMethods.map((method, i) => (
                    <div key={i} className="flex items-center gap-6 p-6 bg-slate-50/50 border border-slate-100 rounded-3xl hover:bg-white hover:shadow-xl transition-all group/method">
                      <div className="size-16 rounded-2xl bg-slate-950 flex items-center justify-center text-white shadow-2xl group-hover/method:bg-emerald-600 transition-colors">
                        <Terminal className="size-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{method.method}</span>
                          <span className="text-sm font-black text-emerald-600 italic tracking-tighter">{method.percentage}% Share</span>
                        </div>
                        <div className="text-xl font-black text-slate-900 italic tracking-tighter uppercase mb-2">{"FCFA "}{(method.amount / 1000000).toFixed(2)}M</div>
                        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${method.percentage}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${glassCard} p-8 lg:p-10 relative group`}>
                <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase mb-8 italic underline decoration-blue-600 decoration-4 underline-offset-4">Real-time Node Activity</h3>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 border-l-4 border-emerald-500 bg-emerald-50/20 rounded-r-2xl">
                      <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                      <div className="flex-1">
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Entry Node: {(Math.random() * 1000).toFixed(0)}</div>
                        <div className="text-sm font-black text-slate-900 italic uppercase">Transaction Verified • {"FCFA "}{(Math.random() * 50).toFixed(1)}k</div>
                      </div>
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">2m ago</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reconciliation" className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className={`${glassCard} p-8 lg:p-10 relative group`}>
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                  <ShieldCheck className="size-5 text-emerald-600" />
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-emerald-600 decoration-4 underline-offset-4">Fiscal Parity Audit</h3>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-3">Real-time parity check between internal ledger and banking nodes</p>
              </div>
              <ResponsiveContainer width="100%" height={380}>
                <BarChart data={monthlyRevenue} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 900 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 900 }} dx={-10} />
                  <Tooltip content={<ForensicTooltip />} cursor={{ fill: '#f8fafc' }} />
                  <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', paddingBottom: '30px', letterSpacing: '0.1em' }} />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Registry" barSize={12} />
                  <Bar dataKey="collections" fill="#10b981" radius={[4, 4, 0, 0]} name="Bank Nodes" barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: 'Unreconciled Nodes', value: '14', color: 'rose', sub: 'ACTION_REQUIRED', icon: AlertTriangle },
                { label: 'System Lag', value: '45ms', color: 'emerald', sub: 'HEALTH_STABLE', icon: Activity },
                { label: 'Audit Coverage', value: '99.8%', color: 'blue', sub: 'HIGH_FIDELITY', icon: ShieldCheck },
              ].map((kpi, i) => {
                const borderMap: Record<string, string> = {
                  rose: 'border-rose-500/20',
                  emerald: 'border-emerald-500/20',
                  blue: 'border-blue-500/20',
                };
                const borderClass = borderMap[kpi.color] || 'border-blue-500/20';
                return (
                  <div key={i} className="relative group bg-slate-950 p-8 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                    <div className={`absolute -right-8 -bottom-8 size-40 ${getColorClass(kpi.color, 'text500')} opacity-10 group-hover:scale-125 transition-transform duration-700`}>
                      <kpi.icon className="size-full" />
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-8">
                        <div className={`p-3 ${getColorClass(kpi.color, 'bg500_20')} rounded-xl`}>
                          <kpi.icon className={`size-5 ${getColorClass(kpi.color, 'text400')}`} />
                        </div>
                        <div className={`px-3 py-1 ${getColorClass(kpi.color, 'bg500_10')} ${getColorClass(kpi.color, 'text400')} text-[9px] font-black uppercase tracking-widest rounded-lg border ${borderClass}`}>
                          {kpi.sub}
                        </div>
                      </div>
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{kpi.label}</div>
                      <div className="text-4xl font-black text-white italic tracking-tighter uppercase group-hover:text-emerald-400 transition-colors">{kpi.value}</div>
                      <div className="mt-6 flex items-center gap-2">
                        <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full ${getColorClass(kpi.color, 'bg500')} w-3/4`} />
                        </div>
                        <span className="text-[9px] font-black text-slate-500 font-mono italic">NODE_OK</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Temporal Controls Modal */}
      {showTemporalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-10 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowTemporalModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-10 border border-slate-100">
            <button onClick={() => setShowTemporalModal(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
              <X className="size-5" />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <Calendar className="size-6" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Temporal Controls</h2>
            </div>
            <form onSubmit={handleTemporalSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">From Date</label>
                  <input type="date" required className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-emerald-500 transition-colors font-mono text-slate-500" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">To Date</label>
                  <input type="date" required className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-emerald-500 transition-colors font-mono text-slate-500" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Resolution Level</label>
                <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-emerald-500 transition-colors appearance-none">
                  <option>Daily Aggregate</option>
                  <option>Weekly View</option>
                  <option>Monthly Rollup</option>
                </select>
              </div>
              <button type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-500/20">
                Apply Timeline
              </button>
            </form>
          </div>
        </div>
      )}

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
              Export Dataset
            </h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-8">Select Payload Format</p>
            <form onSubmit={handleExportSubmit} className="space-y-4 text-left">
              <label className="flex items-center gap-4 p-4 border-2 border-slate-100 rounded-2xl cursor-pointer hover:border-emerald-500 has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50 transition-colors">
                <input type="radio" name="format" defaultChecked className="mt-0.5 text-emerald-600 focus:ring-emerald-500" />
                <div className="flex items-center gap-3">
                  <FileText className="size-5 text-emerald-600" />
                  <div>
                    <div className="text-xs font-black uppercase text-slate-900 tracking-widest">PDF Document</div>
                    <div className="text-[9px] font-bold text-slate-400">Secure Read-Only</div>
                  </div>
                </div>
              </label>
              <label className="flex items-center gap-4 p-4 border-2 border-slate-100 rounded-2xl cursor-pointer hover:border-blue-500 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 transition-colors">
                <input type="radio" name="format" className="mt-0.5 text-blue-600 focus:ring-blue-500" />
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="size-5 text-blue-600" />
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
