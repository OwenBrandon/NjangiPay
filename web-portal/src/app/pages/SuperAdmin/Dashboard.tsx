import { getColorClass } from '../../utils/colorClasses';
import React, { useState } from 'react';
import { 
  Users, Shield, Activity, AlertTriangle, Cpu, HardDrive, Database, Globe,
  ArrowUpRight, TrendingDown, Download, RefreshCcw, MoreVertical,
  Zap, Target, ShieldCheck, Layers, History, Send, Terminal, Server
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';
import { useMockData } from '../../contexts/MockDataContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Progress } from '../../components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { toast } from 'sonner';

const activityData = [
  { date: 'Apr 1', logins: 245, actions: 1234, apiCalls: 45678, errors: 12 },
  { date: 'Apr 2', logins: 289, actions: 1456, apiCalls: 52341, errors: 8 },
  { date: 'Apr 3', logins: 312, actions: 1589, apiCalls: 58923, errors: 15 },
  { date: 'Apr 4', logins: 298, actions: 1423, apiCalls: 49876, errors: 6 },
  { date: 'Apr 5', logins: 334, actions: 1678, apiCalls: 61234, errors: 11 },
  { date: 'Apr 6', logins: 356, actions: 1789, apiCalls: 67890, errors: 9 },
  { date: 'Apr 7', logins: 378, actions: 1890, apiCalls: 72345, errors: 14 },
  { date: 'Apr 8', logins: 401, actions: 2012, apiCalls: 78901, errors: 7 },
  { date: 'Apr 9', logins: 423, actions: 2134, apiCalls: 83456, errors: 10 },
];

const performanceMetrics = [
  { time: '00:00', cpu: 45, memory: 62, disk: 38, network: 52 },
  { time: '04:00', cpu: 38, memory: 58, disk: 35, network: 45 },
  { time: '08:00', cpu: 72, memory: 75, disk: 48, network: 78 },
  { time: '12:00', cpu: 85, memory: 82, disk: 55, network: 88 },
  { time: '16:00', cpu: 68, memory: 71, disk: 42, network: 72 },
  { time: '20:00', cpu: 52, memory: 64, disk: 39, network: 58 },
];

const ForensicTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950/95 backdrop-blur-2xl border border-white/20 rounded-xl p-6 shadow-2xl animate-in fade-in zoom-in duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(99,102,241,0.05)_50%)] bg-[size:100%_4px] pointer-events-none" />
        <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-3 relative z-10">
          <Terminal className="size-3.5 text-indigo-400" />
          <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] italic font-mono">{label}</span>
        </div>
        <div className="space-y-3 relative z-10">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-10">
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)]" style={{ backgroundColor: entry.color }} />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{entry.name}</span>
              </div>
              <span className="text-sm font-black text-white font-mono italic tracking-tighter">{entry.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-white/10 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-3 text-emerald-400" />
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em]">NODE_SECURE</span>
            </div>
            <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const glassCard = 'bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] overflow-hidden';
const terminalGrid = "bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:30px_30px]";

export default function SuperAdminDashboard() {
  const { users, taxpayers, regions } = useMockData();
  const [timeRange, setTimeRange] = useState('7d');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.role !== 'taxpayer').length;
  const totalTaxpayers = taxpayers.length;
  const activeSessions = 142;

  const regionData = regions.map(r => ({
    name: r.code,
    users: r.taxpayerCount,
    revenue: r.revenueCollected / 1000000,
  }));

  const roleDistribution = [
    { name: 'Taxpayers', value: taxpayers.length || 45230, color: '#3b82f6' },
    { name: 'Tax Admins', value: users.filter(u => u.role === 'tax_admin').length || 152, color: '#60a5fa' },
    { name: 'Accountants', value: users.filter(u => u.role === 'accountant').length || 89, color: '#93c5fd' },
    { name: 'Auditors', value: users.filter(u => u.role === 'auditor').length || 67, color: '#1d4ed8' },
    { name: 'Support Staff', value: users.filter(u => u.role === 'support_staff').length || 145, color: '#06b6d4' },
    { name: 'Content Managers', value: users.filter(u => u.role === 'content_manager').length || 23, color: '#8b5cf6' },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("System intelligence synchronized", {
        description: "All nodes reporting nominal status.",
      });
    }, 1500);
  };

  const handleDownload = () => {
    toast("Exporting telemetry...", {
      description: "Data archive will be available shortly.",
      duration: 3000,
    });
  };

  return (
    <div className={`min-h-screen bg-[#f8fafc] relative overflow-hidden ${terminalGrid}`}>
      <div className="absolute top-[-15%] left-[-10%] w-[70%] h-[70%] bg-blue-500/5 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[70%] h-[70%] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[20%] left-[30%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="p-6 lg:p-10 space-y-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="size-3 rounded-full bg-blue-500 animate-ping absolute inset-0" />
                <div className="size-3 rounded-full bg-blue-600 relative" />
              </div>
              <span className="px-3 py-1 bg-blue-100/50 border border-blue-200 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Operational Terminal</span>
              <span className="text-slate-400">•</span>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Super Admin Command Hub</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">System Intelligence</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 p-1.5 bg-white/70 backdrop-blur-md border border-white rounded-3xl shadow-sm">
              {['24h', '7d', '30d'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    timeRange === range
                      ? 'bg-slate-900 text-white shadow-xl shadow-slate-400/50'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            <button onClick={handleDownload} className="p-4 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:text-blue-600 transition-all shadow-sm">
              <Download className="size-5" />
            </button>
            <button 
              onClick={handleRefresh} 
              className="p-4 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all"
            >
              <RefreshCcw className={`size-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {[
            { label: 'Total Users', value: totalUsers.toLocaleString(), trend: '+12%', icon: Users, color: 'blue', sub: 'NETWORK_NODES' },
            { label: 'Active Staff', value: activeUsers, trend: '+5%', icon: Shield, color: 'purple', sub: 'AUTH_OPERATORS' },
            { label: 'Registered Taxpayers', value: totalTaxpayers.toLocaleString(), trend: '+8%', icon: Target, color: 'emerald', sub: 'XPAY_ASSETS' },
            { label: 'Active Sessions', value: activeSessions, trend: '-3%', icon: Activity, color: 'orange', sub: 'LIVE_STREAMS' },
          ].map((kpi, i) => (
            <div key={i} className={`group relative bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 p-8 shadow-xl hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-700 overflow-hidden cursor-default`}>
              <div className={`absolute -top-16 -right-16 w-48 h-48 ${getColorClass(kpi.color, 'bg500_5')} rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-1000`} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="p-4 bg-slate-950 text-white rounded-xl shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-white/10">
                    <kpi.icon className="size-6 text-indigo-400" />
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black tracking-[0.1em] uppercase ${kpi.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {kpi.trend.startsWith('+') ? <ArrowUpRight className="size-3" /> : <TrendingDown className="size-3" />}
                    {kpi.trend}
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`size-1 rounded-full ${
                    kpi.color === 'blue' ? 'bg-blue-500' : 
                    kpi.color === 'purple' ? 'bg-purple-500' : 
                    kpi.color === 'emerald' ? 'bg-emerald-500' : 
                    'bg-orange-500'
                  }`} />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] font-mono">{kpi.sub}</span>
                </div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{kpi.label}</div>
                <div className="text-4xl font-black text-slate-900 tracking-tighter group-hover:text-indigo-600 transition-colors italic uppercase">{kpi.value}</div>
              </div>
            </div>
          ))}
        </div>

        <Tabs defaultValue="activity" className="space-y-10">
          <TabsList className="bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-xl p-2 shadow-lg w-fit">
            {['activity', 'performance', 'users'].map((tab) => (
              <TabsTrigger 
                key={tab} 
                value={tab}
                className="px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all"
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="activity" className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className={`${glassCard} p-8 lg:p-10 relative group`}>
                <div className="absolute top-8 right-8 flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] italic font-mono">SIGNAL_STABLE</span>
                </div>
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-2">
                    <History className="size-5 text-indigo-600" />
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-indigo-600 decoration-4 underline-offset-4">Activity Stream</h3>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-3">Temporal user logins and action protocols</p>
                </div>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorLogins" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorActions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 900 }} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 900 }} 
                    />
                    <Tooltip content={<ForensicTooltip />} cursor={{ stroke: '#4f46e5', strokeWidth: 2, strokeDasharray: '5 5' }} />
                    <Area 
                      type="monotone" 
                      dataKey="logins" 
                      stroke="#4f46e5" 
                      strokeWidth={4} 
                      fillOpacity={1} 
                      fill="url(#colorLogins)" 
                      name="Logins"
                      animationDuration={1500}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="actions" 
                      stroke="#9333ea" 
                      strokeWidth={4} 
                      fillOpacity={1} 
                      fill="url(#colorActions)" 
                      name="Actions"
                      animationDuration={2000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="flex gap-10 mt-8 justify-center border-t border-slate-50 pt-8">
                  <div className="flex items-center gap-3 group/leg cursor-pointer">
                    <div className="size-2 rounded-full bg-indigo-600 shadow-[0_0_12px_rgba(79,70,229,0.5)] group-hover/leg:scale-125 transition-transform" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] group-hover/leg:text-indigo-600 transition-colors">Logins</span>
                  </div>
                  <div className="flex items-center gap-3 group/leg cursor-pointer">
                    <div className="size-2 rounded-full bg-purple-600 shadow-[0_0_12px_rgba(147,51,234,0.5)] group-hover/leg:scale-125 transition-transform" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] group-hover/leg:text-purple-600 transition-colors">Actions</span>
                  </div>
                </div>
              </div>

              <div className={`${glassCard} p-8 lg:p-10 relative group`}>
                <div className="absolute top-8 right-8 flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] italic font-mono">CORE_OPTIMIZED</span>
                </div>
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className="size-5 text-emerald-600" />
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-emerald-600 decoration-4 underline-offset-4">Signal Velocity</h3>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-3">Request throughput and forensic error rates</p>
                </div>
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 900 }} 
                    />
                    <YAxis 
                      yAxisId="left" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 900 }} 
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 900 }} 
                    />
                    <Tooltip content={<ForensicTooltip />} />
                    <Line 
                      yAxisId="left" 
                      type="monotone" 
                      dataKey="apiCalls" 
                      stroke="#10b981" 
                      strokeWidth={4} 
                      dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#10b981' }} 
                      activeDot={{ r: 8, strokeWidth: 0, fill: '#10b981' }}
                      name="API Calls"
                      animationDuration={2500}
                    />
                    <Line 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="errors" 
                      stroke="#ef4444" 
                      strokeWidth={4} 
                      dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#ef4444' }} 
                      activeDot={{ r: 8, strokeWidth: 0, fill: '#ef4444' }}
                      name="Errors"
                      animationDuration={3000}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="flex gap-10 mt-8 justify-center border-t border-slate-50 pt-8">
                  <div className="flex items-center gap-3 group/leg cursor-pointer">
                    <div className="size-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)] group-hover/leg:scale-125 transition-transform" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] group-hover/leg:text-emerald-600 transition-colors">API Calls</span>
                  </div>
                  <div className="flex items-center gap-3 group/leg cursor-pointer">
                    <div className="size-2 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)] group-hover/leg:scale-125 transition-transform" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] group-hover/leg:text-red-600 transition-colors">Errors</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${glassCard} p-8 lg:p-10 relative group`}>
              <div className="absolute top-8 right-8 flex items-center gap-2">
                <Target className="size-4 text-blue-500" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] italic font-mono">SECTOR_MAPPING_ACTIVE</span>
              </div>
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                  <Globe className="size-5 text-blue-600" />
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-blue-600 decoration-4 underline-offset-4">Strategic Matrix</h3>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-3">Geographical taxpayer density and revenue allocation</p>
              </div>
              <ResponsiveContainer width="100%" height={360}>
                <BarChart data={regionData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 900 }} 
                  />
                  <YAxis 
                    yAxisId="left" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 900 }} 
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 900 }} 
                  />
                  <Tooltip content={<ForensicTooltip />} />
                  <Legend 
                    verticalAlign="top" 
                    align="right" 
                    iconType="circle"
                    wrapperStyle={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', paddingBottom: '30px', letterSpacing: '0.2em' }} 
                  />
                  <Bar yAxisId="left" dataKey="users" fill="#4f46e5" radius={[6, 6, 0, 0]} name="Taxpayers" animationDuration={2000} />
                  <Bar yAxisId="right" dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} name="Revenue (M)" animationDuration={2500} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em]">LIVE_GEOSPATIAL_FEED</span>
                </div>
                <div className="text-[8px] font-black text-slate-300 uppercase tracking-[0.4em]">COORD_SYNC: 100%</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: 'CPU Usage', value: 68, icon: Cpu, color: 'blue' },
                { label: 'Memory', value: 71, icon: HardDrive, color: 'purple' },
                { label: 'Disk I/O', value: 42, icon: Database, color: 'emerald' },
                { label: 'Network', value: 72, icon: Globe, color: 'orange' },
              ].map((m) => (
                <div key={m.label} className={`${glassCard} p-8`}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`p-4 ${getColorClass(m.color, 'bg100')} ${getColorClass(m.color, 'text600')} rounded-xl shadow-sm`}>
                      <m.icon className="size-6" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{m.label}</div>
                      <div className="text-3xl font-black text-slate-900 tracking-tighter">{m.value}%</div>
                    </div>
                  </div>
                   <Progress value={m.value} className={`h-2 bg-slate-100 ${getColorClass(m.color, 'progressBg500')}`} />
                </div>
              ))}
            </div>

            <div className={`${glassCard} p-8 lg:p-10 relative group`}>
              <div className="absolute top-8 right-8 flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] italic font-mono">TELEMETRY_STREAM_ACTIVE</span>
              </div>
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="size-5 text-indigo-600" />
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-indigo-600 decoration-4 underline-offset-4">Resource Utilization</h3>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-3">Forensic hardware telemetry (CPU, Memory, Network, Disk)</p>
              </div>
              <ResponsiveContainer width="100%" height={360}>
                <LineChart data={performanceMetrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 900 }} 
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 900 }} domain={[0, 100]} />
                  <Tooltip content={<ForensicTooltip />} />
                  <Legend 
                    verticalAlign="top" 
                    align="right" 
                    iconType="circle"
                    wrapperStyle={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', paddingBottom: '30px', letterSpacing: '0.2em' }} 
                  />
                  <Line type="monotone" dataKey="cpu" stroke="#4f46e5" strokeWidth={4} dot={false} name="CPU %" animationDuration={2000} />
                  <Line type="monotone" dataKey="memory" stroke="#9333ea" strokeWidth={4} dot={false} name="Memory %" animationDuration={2500} />
                  <Line type="monotone" dataKey="disk" stroke="#10b981" strokeWidth={4} dot={false} name="Disk I/O %" animationDuration={3000} />
                  <Line type="monotone" dataKey="network" stroke="#f59e0b" strokeWidth={4} dot={false} name="Network %" animationDuration={3500} />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="size-4 text-indigo-500 animate-pulse" />
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em]">SYSTEM_HEALTH: NOMINAL</span>
                </div>
                <div className="flex gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="size-1 rounded-full bg-emerald-500" />
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className={`${glassCard}`}>
                <div className="p-10 border-b border-white/50 bg-white/30 flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">System Health</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Service status and uptime</p>
                  </div>
                </div>
                <div className="divide-y divide-slate-100/50">
                  {[
                    { name: 'API Services', status: 'operational', uptime: '99.98%', latency: '42ms' },
                    { name: 'Database', status: 'operational', uptime: '99.95%', latency: '12ms' },
                    { name: 'Payment Gateway', status: 'operational', uptime: '99.92%', latency: '156ms' },
                    { name: 'Mobile Services', status: 'degraded', uptime: '98.45%', latency: '234ms' },
                    { name: 'Cache Layer', status: 'operational', uptime: '99.99%', latency: '3ms' },
                  ].map((service) => (
                    <div key={service.name} className="p-8 hover:bg-slate-50 transition-all flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`size-3 rounded-full ${service.status === 'operational' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-amber-500 animate-pulse'}`} />
                        <span className="text-lg font-black text-slate-900 tracking-tight">{service.name}</span>
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${service.status === 'operational' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                          {service.status}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black text-slate-600">{service.latency}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{service.uptime}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${glassCard}`}>
                <div className="p-10 border-b border-white/50 bg-white/30 flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Recent Alerts</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">System notifications and warnings</p>
                  </div>
                </div>
                <div className="divide-y divide-slate-100/50">
                  {[
                    { type: 'warning', message: 'Database backup scheduled for tonight', time: '2 hours ago', priority: 'medium' },
                    { type: 'success', message: 'System update completed successfully', time: '5 hours ago', priority: 'low' },
                    { type: 'warning', message: 'High traffic detected on payment gateway', time: '8 hours ago', priority: 'high' },
                    { type: 'success', message: 'Security scan completed {"\u2014"} no issues', time: '1 day ago', priority: 'low' },
                  ].map((alert, idx) => (
                    <div key={idx} className="p-8 hover:bg-slate-50 transition-all flex gap-5">
                      <div className={`p-4 rounded-2xl h-fit shadow-sm ${alert.type === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        <AlertTriangle className="size-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="text-sm font-black text-slate-900 tracking-tight">{alert.message}</p>
                          <span className={`shrink-0 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            alert.priority === 'high' ? 'bg-red-100 text-red-600' :
                            alert.priority === 'medium' ? 'bg-amber-100 text-amber-600' :
                            'bg-slate-100 text-slate-500'
                          }`}>{alert.priority}</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{alert.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className={`${glassCard} p-8 lg:p-10 flex flex-col relative overflow-hidden group`}>
                <div className="absolute -right-20 -bottom-20 size-64 bg-indigo-500/5 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000" />
                <div className="flex items-center justify-between mb-10 relative z-10">
                  <div className="flex items-center gap-3">
                    <Layers className="size-5 text-indigo-600" />
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-indigo-600 decoration-4 underline-offset-4">Role Matrix</h3>
                  </div>
                  <div className="px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full">
                    <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">LIVE_NODES</span>
                  </div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center relative z-10">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie 
                        data={roleDistribution} 
                        cx="50%" cy="50%" 
                        innerRadius={80} 
                        outerRadius={110} 
                        paddingAngle={8} 
                        dataKey="value"
                        strokeWidth={0}
                        animationDuration={2000}
                      >
                        {roleDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<ForensicTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-x-10 gap-y-4 mt-8 w-full border-t border-slate-50 pt-8">
                    {roleDistribution.map((role) => (
                      <div key={role.name} className="flex items-center justify-between group/role cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="size-2 rounded-full shadow-sm group-hover/role:scale-125 transition-transform" style={{ backgroundColor: role.color }} />
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest truncate group-hover/role:text-slate-900 transition-colors">{role.name}</span>
                        </div>
                        <span className="text-[11px] font-black text-slate-900 font-mono italic">{role.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={`${glassCard}`}>
                <div className="p-10 border-b border-white/50 bg-white/30 flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-3 text-slate-400 hover:bg-slate-50 rounded-2xl transition-all"><MoreVertical className="size-6" /></button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => toast("Exporting session data...")}>Export Data</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast("Reloading active sessions...")}>Refresh</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Active Sessions</h3>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Real-time user activity</p>
                    </div>
                  </div>
                  <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black tracking-[0.2em] animate-pulse border border-emerald-100">REAL-TIME</span>
                </div>
                <div className="divide-y divide-slate-100/50 max-h-[500px] overflow-y-auto custom-scrollbar">
                  {[
                    { user: 'Jean-Pierre Mbarga', role: 'Tax Admin', location: 'Buea, East Region', duration: '2h 15m', ip: '197.210.x.x' },
                    { user: 'Sandrine Ekotto', role: 'Auditor', location: 'Yaoundé, Centre', duration: '45m', ip: '102.89.x.x' },
                    { user: 'Aïssatou Saidou', role: 'Accountant', location: 'Bertoua, East Region', duration: '1h 30m', ip: '197.234.x.x' },
                    { user: 'Paul-Henri Fotso', role: 'Support Staff', location: 'Douala, Littoral', duration: '20m', ip: '102.67.x.x' },
                  ].map((session, idx) => (
                    <div key={idx} className="p-8 hover:bg-blue-50/30 transition-all group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                          <div className="size-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-lg font-black text-white group-hover:bg-blue-600 transition-all shadow-xl">
                            {session.user.charAt(0)}
                          </div>
                          <div>
                            <div className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">{session.user}</div>
                            <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{session.role} • <span className="text-blue-500">{session.location}</span></div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{session.duration}</div>
                          <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border bg-emerald-50 text-emerald-600 border-emerald-100`}>
                            <div className="size-2 rounded-full bg-emerald-500 shadow-sm" />
                            {session.ip}
                          </span>
                        </div>
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
