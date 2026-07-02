import { getColorClass } from '../../utils/colorClasses';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  ComposedChart
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Banknote, Users, FileText, AlertCircle, 
  Download, Filter, Calendar, Zap, Target, Activity, ShieldCheck, 
  ChevronRight, ArrowUpRight, MoreVertical, Layers, Globe, History,
  Compass, PieChart as PieIcon, Cpu, Database, Clock
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Button } from '../../components/ui/button';

const revenueData = [
  { month: 'Jan', vat: 24500, cit: 45000, pit: 18000, customs: 12000, target: 105000 },
  { month: 'Feb', vat: 28000, cit: 48000, pit: 19500, customs: 13500, target: 110000 },
  { month: 'Mar', vat: 32000, cit: 52000, pit: 21000, customs: 15000, target: 120000 },
  { month: 'Apr', vat: 45000, cit: 65000, pit: 28000, customs: 22000, target: 160000 },
  { month: 'May', vat: 38000, cit: 58000, pit: 24000, customs: 18000, target: 140000 },
  { month: 'Jun', vat: 55000, cit: 75000, pit: 32000, customs: 25000, target: 180000 },
  { month: 'Jul', vat: 48000, cit: 68000, pit: 30000, customs: 23000, target: 170000 },
  { month: 'Aug', vat: 42000, cit: 62000, pit: 26000, customs: 20000, target: 150000 },
  { month: 'Sep', vat: 40000, cit: 60000, pit: 25000, customs: 19000, target: 145000 },
  { month: 'Oct', vat: 44000, cit: 64000, pit: 27000, customs: 21000, target: 155000 },
  { month: 'Nov', vat: 38000, cit: 58000, pit: 24000, customs: 18000, target: 140000 },
  { month: 'Dec', vat: 35000, cit: 55000, pit: 22500, customs: 16500, target: 130000 },
];

const complianceData = [
  { month: 'Jan', rate: 78, cases: 1240, alert: 'Low' },
  { month: 'Feb', rate: 82, cases: 1350, alert: 'Low' },
  { month: 'Mar', rate: 85, cases: 1420, alert: 'Moderate' },
  { month: 'Apr', rate: 88, cases: 1560, alert: 'Moderate' },
  { month: 'May', rate: 84, cases: 1380, alert: 'Moderate' },
  { month: 'Jun', rate: 92, cases: 1640, alert: 'High' },
  { month: 'Jul', rate: 90, cases: 1590, alert: 'High' },
  { month: 'Aug', rate: 87, cases: 1450, alert: 'Moderate' },
  { month: 'Sep', rate: 89, cases: 1480, alert: 'Moderate' },
  { month: 'Oct', rate: 94, cases: 1720, alert: 'High' },
  { month: 'Nov', rate: 91, cases: 1610, alert: 'High' },
  { month: 'Dec', rate: 95, cases: 1750, alert: 'Strategic' },
];

const taxTypeDistribution = [
  { name: 'VAT', value: 35, color: '#3b82f6', amount: 125000 },
  { name: 'CIT', value: 30, color: '#6366f1', amount: 210000 },
  { name: 'PIT', value: 20, color: '#f59e0b', amount: 81000 },
  { name: 'Customs', value: 10, color: '#10b981', amount: 57000 },
  { name: 'Others', value: 5, color: '#94a3b8', amount: 23000 },
];

const glassCard = 'bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-blue-900/5 overflow-hidden';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 backdrop-blur-2xl p-7 rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,0.6)] border border-white/10 relative mb-10 min-w-[260px] ring-1 ring-white/5">
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900/90 rotate-45 border-r border-b border-white/10" />
        <div className="flex items-center justify-between mb-5">
          <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">{label} TELEMETRY</div>
          <div className="size-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_#3b82f6]" />
        </div>
        <div className="space-y-6">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{entry.name}</span>
                <span className="text-lg font-black text-white tracking-tighter">
                  {typeof entry.value === 'number' ? 
                    (entry.name.includes('Rate') ? `${entry.value}%` : `FCFA ${entry.value.toLocaleString()}`) 
                    : entry.value}
                </span>
              </div>
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${entry.value}%`, backgroundColor: entry.color }} />
              </div>
            </div>
          ))}
          <div className="pt-5 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="size-3 text-emerald-400" />
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Case Volume</span>
            </div>
            <span className="text-sm font-black text-emerald-400">{payload[0].payload.cases}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function TaxAdminAnalytics() {
  const [activeNode, setActiveNode] = useState('revenue');
  const totalRevenue = 496000;
  const targetRevenue = 520000;

  return (
    <div className="min-h-screen bg-[#f1f5f9] relative overflow-hidden">
      {/* Strategic Intelligence Background Blobs */}
      <div className="absolute top-[-15%] left-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[60%] h-[60%] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[25%] right-[5%] w-[30%] h-[30%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="p-6 lg:p-10 space-y-12 relative z-10">
        {/* Surgical Intelligence Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="size-3 rounded-full bg-blue-500 animate-ping absolute inset-0" />
                <div className="size-3 rounded-full bg-blue-600 relative" />
              </div>
              <span className="px-3 py-1 bg-blue-100/50 border border-blue-200 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Strategic Intelligence</span>
              <span className="text-slate-400">•</span>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Real-time Telemetry Hub</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">Revenue Analytics</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 p-1.5 bg-white/70 backdrop-blur-md border border-white rounded-3xl shadow-sm">
              <Select defaultValue="2026">
                <SelectTrigger className="w-32 h-10 border-none bg-transparent shadow-none focus:ring-0 text-[10px] font-black uppercase tracking-widest">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="2026">FY 2026</SelectItem>
                  <SelectItem value="2025">FY 2025</SelectItem>
                  <SelectItem value="2024">FY 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <button onClick={() => toast.info('Temporal Scope Adjusted', { description: 'Re-aligning telemetry to selected timeframe.' })} className="flex items-center gap-2 px-7 py-3.5 bg-white border border-slate-200 text-slate-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
              <Calendar className="size-4" />
              Temporal Scope
            </button>
            <button onClick={() => { toast.success('Intelligence Exported'); }} className="flex items-center gap-2 px-7 py-3.5 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-400/50">
              <Download className="size-4" />
              Intelligence Export
            </button>
          </div>
        </div>

        {/* Intelligence KPI Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Total Revenue Node', value: `FCFA ${(totalRevenue / 1000).toFixed(0)}M`, trend: '+12.5%', icon: Banknote, color: 'blue', accent: 'bg-blue-100/60' },
            { label: 'Collection Rate', value: `${((totalRevenue / targetRevenue) * 100).toFixed(1)}%`, trend: '-2.3%', icon: Target, color: 'sky', accent: 'bg-sky-100/60' },
            { label: 'Active Entity Base', value: '45.2K', trend: '+8.2%', icon: Users, color: 'purple', accent: 'bg-purple-100/60' },
            { label: 'Pending Returns', value: '3,456', trend: '-5.4%', icon: FileText, color: 'amber', accent: 'bg-amber-100/60' },
          ].map((kpi, i) => (
            <div key={i} className={`group relative bg-white/60 backdrop-blur-xl rounded-2xl border border-white p-9 shadow-lg hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-700 overflow-hidden cursor-default`}>
              <div className={`absolute -top-16 -right-16 w-40 h-40 ${getColorClass(kpi.color, 'bg500_10')} rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-1000`} />
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
                <div className="text-[11px] font-black text-slate-500 uppercase tracking-[0.25em] mb-3">{kpi.label}</div>
                <div className="text-5xl font-black text-slate-900 tracking-tighter group-hover:text-blue-600 transition-colors">{kpi.value}</div>
              </div>
            </div>
          ))}
        </div>

        <Tabs defaultValue="revenue" className="space-y-12">
          <TabsList className="bg-white/50 backdrop-blur-md border border-white p-2 rounded-3xl h-18 shadow-xl w-fit">
            <TabsTrigger value="revenue" className="rounded-2xl px-8 h-12 data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-2xl text-[10px] font-black uppercase tracking-widest transition-all">Revenue Node</TabsTrigger>
            <TabsTrigger value="compliance" className="rounded-2xl px-8 h-12 data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-2xl text-[10px] font-black uppercase tracking-widest transition-all">Compliance Node</TabsTrigger>
            <TabsTrigger value="regional" className="rounded-2xl px-8 h-12 data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-2xl text-[10px] font-black uppercase tracking-widest transition-all">Regional Matrix</TabsTrigger>
            <TabsTrigger value="trends" className="rounded-2xl px-8 h-12 data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-2xl text-[10px] font-black uppercase tracking-widest transition-all">Temporal Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="space-y-12 focus:outline-none">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Tax Type Trajectory */}
              <div className={`lg:col-span-2 ${glassCard} p-10 lg:p-14 relative`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-bl-[200px] -mr-32 -mt-32 pointer-events-none" />
                <div className="flex items-center justify-between mb-12 relative z-10">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Tax Type Trajectory</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Monthly collection breakdown intelligence</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <Activity className="size-3.5 text-blue-600" />
                      Live Feed
                    </div>
                  </div>
                </div>
                <div className="relative h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData} margin={{ top: 60, right: 30, left: 20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorVat" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorCit" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorPit" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorCustoms" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 900 }} 
                        tickFormatter={(val) => val.toUpperCase()}
                        dy={15}
                      />
                      <YAxis hide />
                      <Tooltip 
                        content={<CustomTooltip />} 
                        cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '6 6' }}
                        position={{ y: -80 }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="vat" 
                        stroke="#10b981" 
                        strokeWidth={4} 
                        fillOpacity={1} 
                        fill="url(#colorVat)" 
                        name="VAT" 
                        dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6, fill: '#10b981', strokeWidth: 4, stroke: 'rgba(16, 185, 129, 0.2)' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="cit" 
                        stroke="#6366f1" 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill="url(#colorCit)" 
                        name="CIT" 
                        dot={false}
                        activeDot={{ r: 5, fill: '#6366f1', strokeWidth: 3, stroke: '#fff' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="pit" 
                        stroke="#f59e0b" 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill="url(#colorPit)" 
                        name="PIT" 
                        dot={false}
                        activeDot={{ r: 5, fill: '#f59e0b', strokeWidth: 3, stroke: '#fff' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="customs" 
                        stroke="#3b82f6" 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill="url(#colorCustoms)" 
                        name="Customs" 
                        dot={false}
                        activeDot={{ r: 5, fill: '#3b82f6', strokeWidth: 3, stroke: '#fff' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Portfolio Mix */}
              <div className={`${glassCard} p-10 lg:p-14 flex flex-col`}>
                <div className="mb-10">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Portfolio Mix</h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Direct contribution delta</p>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center relative">
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={taxTypeDistribution}
                        cx="50%" cy="50%"
                        innerRadius={85}
                        outerRadius={110}
                        paddingAngle={8}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {taxTypeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="w-full space-y-6 mt-12">
                    {taxTypeDistribution.slice(0, 4).map((tax) => (
                      <div key={tax.name} className="flex items-center justify-between group cursor-pointer transition-all">
                        <div className="flex items-center gap-4">
                          <div className="size-3 rounded-full transition-transform group-hover:scale-150 shadow-sm" style={{ backgroundColor: tax.color }} />
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{tax.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">{"FCFA "}{(tax.amount / 1000).toFixed(0)}K</div>
                          <div className="text-[10px] text-slate-400 font-black tracking-widest">{tax.value}% MIX</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Sector Performance */}
              <div className={`${glassCard} p-10 lg:p-14`}>
                <div className="flex items-center justify-between mb-12">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Sector Performance</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Strategic industry contribution matrix</p>
                  </div>
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shadow-sm"><Layers className="size-6" /></div>
                </div>
                <div className="space-y-10">
                  {[
                    { sector: 'Banking & Finance', amount: 125000, percentage: 89, color: 'bg-blue-500' },
                    { sector: 'Telecommunications', amount: 98000, percentage: 76, color: 'bg-emerald-500' },
                    { sector: 'Oil & Gas', amount: 87000, percentage: 68, color: 'bg-slate-400' },
                    { sector: 'Manufacturing', amount: 65000, percentage: 55, color: 'bg-purple-500' },
                  ].map((sector, idx) => (
                    <div key={idx} className="space-y-4 group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black text-slate-800 uppercase tracking-widest">{sector.sector}</span>
                          <div className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">Optimal</div>
                        </div>
                        <span className="text-lg font-black text-slate-900 tracking-tighter group-hover:text-blue-600 transition-colors">{"FCFA "}{(sector.amount / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner border border-slate-200/50">
                        <div
                          className={`${sector.color} h-full rounded-full transition-all duration-1000 group-hover:opacity-80 shadow-lg`}
                          style={{ width: `${sector.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Threshold Compliance */}
              <div className={`${glassCard} p-10 lg:p-14`}>
                <div className="flex items-center justify-between mb-12">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Threshold Compliance</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Target vs Actual variance analysis</p>
                  </div>
                  <div 
                    className="p-3 rounded-2xl shadow-sm"
                    style={{ background: '#0d1929', color: '#38bdf8' }}
                  >
                    <ShieldCheck className="size-6" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { month: 'January', actual: 99500, target: 105000, variance: -5.2 },
                    { month: 'February', actual: 109000, target: 110000, variance: -0.9 },
                    { month: 'March', actual: 120000, target: 120000, variance: 0 },
                    { month: 'April', actual: 129500, target: 130000, variance: -0.4 },
                  ].map((month, idx) => (
                    <div key={idx} className="p-7 bg-white/50 rounded-xl border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-emerald-900/5 transition-all group relative overflow-hidden">
                      <div className={`absolute top-0 right-0 w-2 h-full ${month.variance >= 0 ? 'bg-emerald-500' : 'bg-rose-500'} opacity-0 group-hover:opacity-100 transition-all`} />
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{month.month}</span>
                        <div className={`flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-full ${month.variance >= 0 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                          {month.variance >= 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                          {month.variance >= 0 ? '+' : ''}{month.variance.toFixed(1)}%
                        </div>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Collection</div>
                          <div className="text-2xl font-black text-slate-900 tracking-tighter group-hover:text-blue-600 transition-colors">{"FCFA "}{(month.actual / 1000).toFixed(0)}K</div>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Target</div>
                          <div className="text-sm font-black text-slate-600 tracking-tight">{"FCFA "}{(month.target / 1000).toFixed(0)}K</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-12 focus:outline-none">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Compliance Velocity */}
              <div className={`${glassCard} p-10 lg:p-14 relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-bl-[200px] -mr-32 -mt-32 pointer-events-none" />
                <div className="flex items-center justify-between mb-12 relative z-10">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Compliance Velocity</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Quarterly risk threshold analysis</p>
                  </div>
                  <div className="p-4 bg-emerald-600 text-white rounded-xl shadow-xl shadow-emerald-200 ring-4 ring-emerald-50">
                    <Activity className="size-6" />
                  </div>
                </div>

                {/* Tactical Intelligence Filters */}
                <div className="flex flex-wrap items-center gap-3 mb-12 relative z-10 border-b border-slate-100 pb-8">
                  <button onClick={() => toast.success('Sorting Applied')} className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-400/30 hover:-translate-y-0.5 transition-all">
                    <Filter className="size-3.5" /> 
                    Sort: Temporal
                  </button>
                  <button onClick={() => toast.info('Filter: All Nodes selected')} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 hover:border-slate-300 transition-all">
                    Entity: All Nodes
                  </button>
                  <button onClick={() => toast.info('Filter: Threshold adjusted')} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 hover:border-slate-300 transition-all">
                    Threshold: {'>'}80%
                  </button>
                  <div className="ml-auto hidden md:flex items-center gap-4">
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Horizon</span>
                      <span className="text-[11px] font-black text-slate-900 uppercase">12 Months Rolling</span>
                    </div>
                  </div>
                </div>
                <div className="relative h-[400px] mt-8 group/chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={complianceData} margin={{ top: 40, right: 10, left: 0, bottom: 20 }} barGap={8}>
                      <defs>
                        <linearGradient id="barGradBlue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563eb" />
                          <stop offset="100%" stopColor="#1d4ed8" />
                        </linearGradient>
                        <linearGradient id="barGradCyan" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#06b6d4" />
                          <stop offset="100%" stopColor="#0891b2" />
                        </linearGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="4" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>
                      <CartesianGrid strokeDasharray="1 4" stroke="#cbd5e1" vertical={false} strokeOpacity={0.3} />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: '#64748b', fontWeight: 900 }} 
                        tickFormatter={(val) => val.toUpperCase()}
                        dy={20}
                      />
                      <YAxis hide domain={[0, 100]} />
                      <Tooltip 
                        content={<CustomTooltip />} 
                        cursor={{ fill: 'rgba(241, 245, 249, 0.4)', radius: 20 }} 
                        position={{ y: -80 }}
                      />
                      <Bar 
                        dataKey="rate" 
                        name="Operational Flow" 
                        radius={[6, 6, 6, 6]} 
                        barSize={10}
                        background={{ fill: '#f8fafc', radius: 6 }}
                      >
                        {complianceData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill="url(#barGradBlue)"
                            fillOpacity={0.7}
                            className="hover:fill-opacity-100 transition-all duration-500 cursor-pointer"
                          />
                        ))}
                      </Bar>
                      <Bar 
                        dataKey="rate" 
                        name="Strategic Nodes" 
                        radius={[6, 6, 6, 6]} 
                        barSize={10}
                        background={{ fill: '#f8fafc', radius: 6 }}
                      >
                        {complianceData.map((entry, index) => (
                          <Cell 
                            key={`cell-strat-${index}`} 
                            fill={index === complianceData.length - 1 ? 'url(#barGradCyan)' : '#e2e8f0'}
                            fillOpacity={1}
                            className="hover:fill-cyan-500 transition-all duration-500 cursor-pointer"
                          />
                        ))}
                      </Bar>
                      <Line 
                        type="monotone" 
                        dataKey="rate" 
                        stroke="#06b6d4" 
                        strokeWidth={2} 
                        dot={{ r: 4, fill: '#06b6d4', strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: '#06b6d4', stroke: '#fff', strokeWidth: 2 }}
                        name="Velocity Trend"
                        filter="url(#glow)"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                {/* Strategic Insight Matrix */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 mt-16 pt-12 border-t border-slate-100 relative z-10">
                  <div className="space-y-3 group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="size-3 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]" />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] group-hover:text-blue-600 transition-colors">Operational Flow</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <div className="text-3xl font-black text-slate-900 tracking-tighter">{"FCFA "}842.5M</div>
                      <div className="text-[10px] font-black text-emerald-500 uppercase">+4.2%</div>
                    </div>
                  </div>
                  <div className="space-y-3 group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="size-3 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.4)]" />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] group-hover:text-cyan-500 transition-colors">Strategic Nodes</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <div className="text-3xl font-black text-slate-900 tracking-tighter">92.4%</div>
                      <div className="text-[10px] font-black text-slate-400 uppercase">AVG</div>
                    </div>
                  </div>
                  <div className="space-y-3 group cursor-pointer">
                    <div className="flex items-center gap-3 text-indigo-500">
                      <TrendingUp className="size-3.5" />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] group-hover:text-indigo-500 transition-colors">Velocity Trend</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <div className="text-3xl font-black text-emerald-500 tracking-tighter">+12.5%</div>
                      <div className="text-[10px] font-black text-slate-400 uppercase">DELTA</div>
                    </div>
                  </div>
                  <div className="space-y-3 group cursor-pointer">
                    <div className="flex items-center gap-3 text-rose-500">
                      <ShieldCheck className="size-3.5" />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] group-hover:text-rose-500 transition-colors">Risk Index</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <div className="text-3xl font-black text-rose-600 tracking-tighter">4.2%</div>
                      <div className="text-[10px] font-black text-slate-400 uppercase">FORECAST</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Critical Enforcement Alerts */}
              <div className={`${glassCard} p-10 lg:p-14`}>
                <div className="flex items-center justify-between mb-12">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Enforcement Alerts</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">High-severity compliance breaches</p>
                  </div>
                  <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl animate-pulse shadow-sm"><AlertCircle className="size-6" /></div>
                </div>
                <div className="space-y-6">
                  {[
                    { issue: 'Late Filing Node', count: 1234, severity: 'CRITICAL', trend: '+8%', icon: Clock, color: 'rose' },
                    { issue: 'Documentation Drift', count: 892, severity: 'MODERATE', trend: '-12%', icon: FileText, color: 'blue' },
                    { issue: 'Capital Payment Delays', count: 645, severity: 'HIGH', trend: '+15%', icon: Banknote, color: 'amber' },
                    { issue: 'Calculation Variance', count: 423, severity: 'LOW', trend: '-5%', icon: Cpu, color: 'emerald' },
                  ].map((issue, idx) => (
                    <div key={idx} className="flex items-center justify-between p-7 bg-white rounded-3xl group hover:shadow-2xl hover:shadow-slate-300/10 transition-all border border-slate-100 hover:border-blue-200 relative overflow-hidden cursor-pointer">
                      <div className={`absolute left-0 top-0 w-1.5 h-full ${
                        issue.severity === 'CRITICAL' ? 'bg-rose-500' : 
                        issue.severity === 'HIGH' ? 'bg-amber-500' : 
                        issue.severity === 'MODERATE' ? 'bg-blue-500' : 'bg-emerald-500'
                      }`} />
                      <div className="flex items-center gap-6">
                        <div className={`size-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 ${
                          issue.severity === 'CRITICAL' ? 'bg-rose-50 text-rose-600' : 
                          issue.severity === 'HIGH' ? 'bg-amber-50 text-amber-600' : 
                          issue.severity === 'MODERATE' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          <issue.icon className="size-6" />
                        </div>
                        <div>
                          <div className="text-sm font-black text-slate-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors">{issue.issue}</div>
                          <div className="text-[10px] text-slate-400 font-black tracking-[0.2em] uppercase mt-1">{issue.count} ACTIVE CASES</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-[9px] font-black px-4 py-2 rounded-full border ${
                          issue.severity === 'CRITICAL' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                          issue.severity === 'HIGH' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                          issue.severity === 'MODERATE' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        }`}>
                          {issue.severity}
                        </div>
                        <div className={`text-[10px] font-black mt-3 tracking-widest ${issue.trend.startsWith('+') ? 'text-rose-500' : 'text-emerald-500'}`}>
                          {issue.trend} DELTA
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="regional" className="space-y-12 focus:outline-none">
            {/* Regional Matrix Node */}
            <div className={`${glassCard} p-10 lg:p-14`}>
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Regional Matrix</h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Geospatial collection performance</p>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shadow-sm"><Globe className="size-6" /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { region: 'Douala Sector', collected: 285000, target: 300000, compliance: 92, trend: '+4.2%' },
                  { region: 'Yaoundé Node', collected: 195000, target: 200000, compliance: 88, trend: '+2.1%' },
                  { region: 'Rivers Cluster', collected: 178000, target: 180000, compliance: 90, trend: '+6.5%' },
                  { region: 'Kano Hub', collected: 145000, target: 150000, compliance: 85, trend: '-1.4%' },
                  { region: 'Oyo Station', collected: 132000, target: 140000, compliance: 82, trend: '+0.8%' },
                  { region: 'Delta Point', collected: 115000, target: 120000, compliance: 79, trend: '-2.2%' },
                ].map((region, idx) => (
                  <div key={idx} className="p-8 bg-white/50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-blue-900/5 transition-all group">
                    <div className="flex items-center justify-between mb-8">
                      <div className="text-sm font-black text-slate-900 uppercase tracking-widest">{region.region}</div>
                      <div className={`px-3 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase ${region.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                        {region.trend}
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="flex justify-between items-end">
                        <div className="text-2xl font-black text-slate-900 tracking-tighter">{"FCFA "}{(region.collected / 1000).toFixed(0)}K</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">OF {"FCFA "}{(region.target / 1000).toFixed(0)}K</div>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden shadow-inner">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all duration-1000 shadow-lg"
                          style={{ width: `${(region.collected / region.target) * 100}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Compliance</div>
                        <div className="text-xs font-black text-blue-600">{region.compliance}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-12 focus:outline-none">
            {/* Temporal Trends Node */}
            <div className={`${glassCard} p-10 lg:p-14`}>
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Temporal Trends</h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Long-term growth and seasonal intelligence</p>
                </div>
                <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl shadow-sm"><History className="size-6" /></div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="p-8 bg-slate-900 rounded-2xl text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden">
                  <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-500/20 rounded-full blur-[80px]" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-10">
                      <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                        <Cpu className="size-6 text-purple-400" />
                      </div>
                      <h4 className="text-sm font-black uppercase tracking-[0.25em]">Strategic Forecast</h4>
                    </div>
                    <div className="space-y-10">
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.25em] opacity-50 mb-3">Projected FY27 Revenue</div>
                        <div className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-400">{"FCFA "}1.42B</div>
                      </div>
                      <div className="grid grid-cols-2 gap-10 pt-10 border-t border-white/10">
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-2">Growth Factor</div>
                          <div className="text-xl font-black tracking-tight text-emerald-400">+18.2%</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-2">Confidence Node</div>
                          <div className="text-xl font-black tracking-tight text-blue-400">94.2%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  {[
                    { label: 'Seasonal Peak', value: 'Q1 (Jan-Mar)', trend: '+14% Deviation', icon: Compass, color: 'blue' },
                    { label: 'Collection Lag', value: 'Avg 12.4 Days', trend: '-2.1 Days Delta', icon: Database, color: 'emerald' },
                  ].map((stat, idx) => (
                    <div key={idx} className="p-10 bg-white/50 border border-slate-100 rounded-2xl flex items-center justify-between hover:bg-white hover:shadow-2xl hover:shadow-slate-300/10 transition-all group">
                      <div className="flex items-center gap-8">
                        <div className={`p-5 ${getColorClass(stat.color, 'bg50')} ${getColorClass(stat.color, 'text600')} rounded-xl group-hover:rotate-6 transition-transform shadow-sm`}>
                          <stat.icon className="size-7" />
                        </div>
                        <div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{stat.label}</div>
                          <div className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{stat.trend}</div>
                        <div className="text-[8px] text-slate-400 font-black uppercase tracking-widest mt-1">vs Prior Cycle</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

