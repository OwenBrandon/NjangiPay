import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer
} from 'recharts';
import { Ticket, Clock, CheckCircle, TrendingUp, Download, Calendar, Filter, Activity, PieChart, Shield, X, FileText, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const ticketVolume7Days = [
  { day: 'Mon', count: 12 },
  { day: 'Tue', count: 18 },
  { day: 'Wed', count: 15 },
  { day: 'Thu', count: 22 },
  { day: 'Fri', count: 14 },
  { day: 'Sat', count: 4 },
  { day: 'Sun', count: 3 },
];

const ticketVolume30Days = [
  { day: 'Mon', count: 42 },
  { day: 'Tue', count: 56 },
  { day: 'Wed', count: 38 },
  { day: 'Thu', count: 64 },
  { day: 'Fri', count: 45 },
  { day: 'Sat', count: 12 },
  { day: 'Sun', count: 8 },
];

const ticketVolume90Days = [
  { day: 'Mon', count: 120 },
  { day: 'Tue', count: 160 },
  { day: 'Wed', count: 110 },
  { day: 'Thu', count: 185 },
  { day: 'Fri', count: 130 },
  { day: 'Sat', count: 40 },
  { day: 'Sun', count: 25 },
];

const categoryDistribution = [
  { name: 'Technical Support', value: 45, color: '#3b82f6' },
  { name: 'Tax Filing Issues', value: 30, color: '#10b981' },
  { name: 'Account Access', value: 15, color: '#f59e0b' },
  { name: 'General Inquiry', value: 10, color: '#6366f1' },
];

const ForensicTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950/90 backdrop-blur-xl border border-white/10 p-5 shadow-2xl rounded-2xl min-w-[200px]">
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 pb-2 border-b border-white/5 font-mono">
          ANALYTICS_TELEMETRY
        </div>
        <div className="space-y-3">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-8">
              <div className="flex items-center gap-2">
                <div className="size-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">{entry.name}</span>
              </div>
              <span className="text-sm font-black text-white font-mono italic">
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function SupportReports() {
  const [selectedRange, setSelectedRange] = useState<'7 Days' | '30 Days' | '90 Days'>('30 Days');
  const [showRangeDropdown, setShowRangeDropdown] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exporting, setExporting] = useState(false);

  // Dynamic Volume Chart Data
  const volumeData = selectedRange === '7 Days' ? ticketVolume7Days :
                     selectedRange === '90 Days' ? ticketVolume90Days :
                     ticketVolume30Days;

  // Dynamic KPIs depending on selected range
  const responseTimes = { '7 Days': '8m 12s', '30 Days': '12m 45s', '90 Days': '15m 30s' };
  const resolutionRates = { '7 Days': '96.8%', '30 Days': '94.2%', '90 Days': '91.5%' };
  const dailyVolumes = { '7 Days': '18', '30 Days': '48', '90 Days': '125' };
  const csatScores = { '7 Days': '4.9 / 5.0', '30 Days': '4.8 / 5.0', '90 Days': '4.7 / 5.0' };

  const kpis = [
    { label: 'Avg. First Response', value: responseTimes[selectedRange], change: selectedRange === '7 Days' ? '-22%' : '-15%', isGood: true, icon: Clock, color: 'blue', sub: 'RESPONSE_SLA_METRIC' },
    { label: 'Resolution Rate', value: resolutionRates[selectedRange], change: selectedRange === '7 Days' ? '+4.1%' : '+2.4%', isGood: true, icon: CheckCircle, color: 'emerald', sub: 'RESOLVE_RATIO' },
    { label: 'Daily Ticket Volume', value: dailyVolumes[selectedRange], change: selectedRange === '7 Days' ? '-10 new' : '+8 new', isGood: selectedRange === '7 Days', icon: Ticket, color: 'orange', sub: 'INGRESS_TICKET_RATE' },
    { label: 'CSAT Score', value: csatScores[selectedRange], change: 'Excellent', isGood: true, icon: TrendingUp, color: 'purple', sub: 'CUSTOMER_SATISFACTION' },
  ];

  const handleExport = () => {
    setExporting(true);
    setExportProgress(0);
    setShowExportModal(true);
  };

  useEffect(() => {
    if (!exporting) return;
    if (exportProgress >= 100) {
      const timer = setTimeout(() => {
        setExporting(false);
        setShowExportModal(false);
        toast.success('Audit Report Exported', { 
          description: `support_analytics_${selectedRange.replace(' ', '_').toLowerCase()}_audit.pdf downloaded successfully.` 
        });
      }, 500);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => {
      setExportProgress(p => p + 20);
    }, 150);
    return () => clearTimeout(timer);
  }, [exporting, exportProgress, selectedRange]);

  const glassCard = 'bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] overflow-hidden';
  const terminalGrid = "bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:30px_30px]";

  return (
    <div className={`min-h-screen bg-[#f8fafc] relative overflow-hidden ${terminalGrid} p-8 lg:p-12`}>
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] size-[50%] bg-blue-400/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] size-[50%] bg-indigo-400/5 blur-[120px] rounded-full" />
      </div>

      {/* Header Section */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="px-3 py-1 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] italic">Helpdesk Operations</div>
            <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] font-mono">ANALYTICS_ACTIVE</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.9]">
            Helpdesk <span className="text-blue-600 underline decoration-slate-900 decoration-8 underline-offset-8">Analytics</span>
          </h1>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-[0.4em] mt-8 flex items-center gap-3 italic">
            <Activity className="size-4 text-blue-600" />
            Monitor Support Performance and Taxpayer Satisfaction Metrics
          </p>
        </div>
        
        <div className="flex items-center gap-4 relative">
          <div className="relative">
            <button 
              onClick={() => setShowRangeDropdown(!showRangeDropdown)}
              className="flex items-center gap-3 px-6 py-4 bg-white border border-slate-200 text-slate-800 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 transition-all shadow-sm"
            >
              <Calendar className="size-4" />
              {selectedRange}
            </button>
            {showRangeDropdown && (
              <div className="absolute right-0 top-16 z-50 bg-white border border-slate-200 rounded-xl shadow-xl w-48 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-150">
                {['7 Days', '30 Days', '90 Days'].map((range) => (
                  <button
                    key={range}
                    onClick={() => {
                      setSelectedRange(range as any);
                      setShowRangeDropdown(false);
                      toast.success(`Filter Updated`, { description: `Analytics range set to ${range}.` });
                    }}
                    className={`w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-wider transition-colors
                      ${selectedRange === range 
                        ? 'bg-blue-600 text-white' 
                        : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button 
            onClick={handleExport}
            className="flex items-center gap-3 px-6 py-4 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
          >
            <Download className="size-4" />
            Export Audit
          </button>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 relative z-10">
        {kpis.map((kpi, idx) => (
          <div key={idx} className={`${glassCard} p-8 group relative overflow-hidden transition-all duration-500 hover:translate-y-[-4px] hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]`}>
            {/* Watermark */}
            <div className="absolute -right-4 -bottom-6 size-40 text-slate-900/[0.03] transition-all duration-700 group-hover:scale-110 group-hover:-rotate-12">
              <kpi.icon className="size-full" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="p-4 bg-white shadow-sm border border-slate-100 rounded-2xl">
                  <kpi.icon className="size-6 text-slate-800" />
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] font-mono">{kpi.sub}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{kpi.label}</div>
              <div className="text-4xl font-black text-slate-900 italic tracking-tighter uppercase font-mono mb-2">
                {kpi.value}
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black uppercase tracking-wider ${kpi.isGood ? 'text-emerald-600' : 'text-orange-600'}`}>
                  {kpi.change}
                </span>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic">vs last cycle</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Visualizations Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 relative z-10">
        {/* Ticket Volume Chart */}
        <div className={`${glassCard} p-8 lg:p-10 lg:col-span-2 relative group`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Activity className="size-6 text-blue-600" />
                <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-blue-600 decoration-4 underline-offset-4">Incoming Ticket Volume</h3>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-3">Weekly ticket distribution trend</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-wider border border-blue-500/20">
              <Filter className="size-3" /> By Category
            </div>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={volumeData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="ticketVolumeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.6}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 900 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 900 }} dx={-10} />
              <Tooltip content={<ForensicTooltip />} cursor={{ fill: '#f8fafc' }} />
              <Bar dataKey="count" fill="url(#ticketVolumeGrad)" name="Tickets" barSize={40} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Issue Category Mix */}
        <div className={`${glassCard} p-8 lg:p-10 relative group`}>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <PieChart className="size-6 text-indigo-600" />
              <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-indigo-600 decoration-4 underline-offset-4">Issue Category</h3>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-3">Distribution patterns by department</p>
          </div>

          <div className="space-y-6">
            {categoryDistribution.map((cat, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider">
                  <span className="text-slate-500 flex items-center gap-2">
                    <span className="size-2 rounded-full" style={{ backgroundColor: cat.color }}></span>
                    {cat.name}
                  </span>
                  <span className="text-slate-800 font-mono">{cat.value}%</span>
                </div>
                <div className="w-full bg-slate-100/50 border border-slate-200/40 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ backgroundColor: cat.color, width: `${cat.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-5 bg-slate-900 rounded-3xl relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[8px] text-blue-400 uppercase font-black tracking-widest mb-1 font-mono">TOP_RESOLVER_NODE</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white uppercase italic">Mike Chen</span>
                <span className="text-xs text-emerald-400 font-mono font-black">128 RESOLVES</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Audit Table */}
      <div className={`${glassCard} overflow-hidden relative z-10`}>
        <div className="px-8 py-6 border-b border-slate-200/50 flex flex-col sm:flex-row sm:items-center justify-between bg-white/50 gap-4">
          <div>
            <h3 className="text-xl font-black text-slate-900 uppercase italic">Support Performance Audit</h3>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest font-mono mt-1">Diagnostic benchmark matrices</p>
          </div>
          <button 
            onClick={() => toast.success('Historical Benchmark Initiated', { description: 'Generating excel dataset support_benchmarks_2026.csv...' })}
            className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline text-left"
          >
            Download Historical Data
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {[
            { metric: 'First Contact Resolution', target: '85%', actual: '88.4%', trend: 'up' },
            { metric: 'Average Hold Time', target: '< 2m', actual: '1m 12s', trend: 'down' },
            { metric: 'Ticket Escalation Rate', target: '< 10%', actual: '6.2%', trend: 'down' },
            { metric: 'Taxpayer Satisfaction (NPS)', target: '70+', actual: '78', trend: 'up' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-slate-50/50 transition-colors gap-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl bg-white shadow-sm border border-slate-100 text-slate-800`}>
                  <Shield className="size-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800 uppercase italic tracking-wide">{item.metric}</h4>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest font-mono mt-1">Benchmark Target: {item.target}</p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-sm font-black text-slate-900 font-mono mb-1">{item.actual}</div>
                <div className={`text-[9px] font-black uppercase tracking-widest ${
                  (item.trend === 'up' && item.metric !== 'Ticket Escalation Rate') || (item.trend === 'down' && item.metric === 'Ticket Escalation Rate') 
                  ? 'text-emerald-600' : 'text-blue-600'
                }`}>
                  {item.trend === 'up' ? 'Exceeding' : 'Meeting'} Target Benchmark
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Audit Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => { if (!exporting) setShowExportModal(false); }} />
          <div className="relative bg-slate-900 border border-white/10 rounded-2xl p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] w-full max-w-md animate-in zoom-in-95 duration-300 text-white">
            {!exporting && (
              <button 
                onClick={() => setShowExportModal(false)} 
                className="absolute top-6 right-6 p-2 text-slate-400 hover:bg-white/5 rounded-xl"
              >
                <X className="size-4" />
              </button>
            )}
            <h3 className="text-xl font-black uppercase italic tracking-tighter mb-2 flex items-center gap-2">
              <FileText className="size-5 text-blue-400" />
              Audit Generator
            </h3>
            <p className="text-[9px] text-slate-500 uppercase tracking-widest font-mono mb-6">Range: {selectedRange}</p>

            <div className="space-y-6">
              {exportProgress < 100 ? (
                <div className="py-6 text-center">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.2em] mb-4 animate-pulse">Compiling analytics telemetry...</div>
                  <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/10 max-w-xs mx-auto">
                    <div className="bg-blue-500 h-full rounded-full transition-all duration-300" style={{ width: `${exportProgress}%` }} />
                  </div>
                  <div className="text-sm font-mono mt-2 text-blue-400">{exportProgress}%</div>
                </div>
              ) : (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
                  <CheckCircle2 className="size-5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">Report Generated</div>
                    <p className="text-[9px] text-slate-400 leading-normal mt-0.5 font-mono">Telemetry package transmitted and downloaded successfully.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
