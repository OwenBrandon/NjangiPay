import React, { useState } from 'react';
import { toast } from 'sonner';
import { 
  Download, FileText, Calendar, PieChart, TrendingUp, Filter,
  Activity, Terminal, ShieldCheck, Globe, History, ArrowUpRight, 
  TrendingDown, RefreshCcw, X, CheckCircle2, Lock, FileSpreadsheet
} from 'lucide-react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell, AreaChart, Area
} from 'recharts';

const revenueData = [
  { day: 'MON', amount: 45000 },
  { day: 'TUE', amount: 52000 },
  { day: 'WED', amount: 48000 },
  { day: 'THU', amount: 61000 },
  { day: 'FRI', amount: 55000 },
  { day: 'SAT', amount: 22000 },
  { day: 'SUN', amount: 15000 },
];

const categoryData = [
  { name: 'VAT_UNIT', value: 45, color: '#3b82f6' },
  { name: 'CIT_UNIT', value: 30, color: '#10b981' },
  { name: 'PIT_UNIT', value: 15, color: '#f59e0b' },
  { name: 'OTHER_NODES', value: 10, color: '#6366f1' },
];

const ForensicTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950/95 backdrop-blur-2xl border border-white/20 rounded-xl p-6 shadow-2xl animate-in fade-in zoom-in duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(59,130,246,0.05)_50%)] bg-[size:100%_4px] pointer-events-none" />
        <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-3 relative z-10">
          <Terminal className="size-3.5 text-blue-400" />
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
              <ShieldCheck className="size-3 text-blue-400" />
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em]">FISCAL_SECURE</span>
            </div>
            <div className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function FinancialReports() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showTemporalModal, setShowTemporalModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [previewReport, setPreviewReport] = useState<any>(null);

  const glassCard = 'bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] overflow-hidden';
  const terminalGrid = "bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:30px_30px]";

  const handleRefresh = () => {
    setIsRefreshing(true);
    toast.info('Initializing Node Sync', { description: 'Contacting central servers...' });
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Sync Complete', { description: 'Intelligence feed updated successfully.' });
    }, 2500);
  };

  const handleTemporalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowTemporalModal(false);
    toast.success('Timeline Matrix Adjusted', { description: 'Graphs and nodes rerendered based on new temporal constraints.' });
  };

  const handleExportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowExportModal(false);
    toast.success('Export Initialized', { description: 'Compiling payload. Download will begin shortly.' });
  };

  const reportsList = [
    { name: 'Daily Inflow Summary', date: 'MAY_06_2024', size: '2.4 MB', type: 'PDF_FORMAT' },
    { name: 'Weekly Reconciliation Audit', date: 'MAY_05_2024', size: '1.8 MB', type: 'XLSX_DATA' },
    { name: 'Monthly Tax Type Breakdown', date: 'APR_30_2024', size: '4.2 MB', type: 'PDF_FORMAT' },
    { name: 'Year-to-Date Revenue Forecast', date: 'APR_15_2024', size: '12.5 MB', type: 'DOCX_PROTO' },
  ];

  return (
    <div className={`min-h-screen bg-[#f8fafc] relative overflow-hidden ${terminalGrid}`}>
      {/* Strategic Operational Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-500/5 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="p-6 lg:p-10 space-y-10 relative z-10 max-w-[1600px] mx-auto pb-20">
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
                  <span className="text-[10px] font-black text-blue-700 uppercase tracking-[0.4em]">Strategic Hub</span>
                  <span className="text-slate-300">/</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Node: REPORT-SEC-X</span>
                </div>
                <div className="h-1 w-32 bg-blue-600/10 mt-1.5 rounded-full overflow-hidden">
                  <div className={`h-full bg-blue-600 w-full shadow-[0_0_8px_rgba(37,99,235,0.5)] ${isRefreshing ? 'animate-loading' : ''}`} />
                </div>
              </div>
            </div>
            <h1 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-none italic uppercase">
              Strategic <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Intelligence</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={() => setShowTemporalModal(true)} className="group flex items-center gap-4 px-8 py-5 bg-white border-2 border-slate-100 text-slate-600 rounded-xl text-[11px] font-black uppercase tracking-[0.3em] transition-all hover:border-blue-500 hover:text-blue-600 shadow-sm">
              <Calendar className="size-4" />
              <span>Temporal Range</span>
            </button>
            <button onClick={() => setShowExportModal(true)} className="group relative flex items-center gap-4 px-8 py-5 bg-slate-950 text-white rounded-xl text-[11px] font-black uppercase tracking-[0.3em] overflow-hidden transition-all hover:scale-[1.03] hover:shadow-[0_30px_60px_-15px_rgba(15,23,42,0.4)] active:scale-[0.97]">
              <Download className="size-4 relative z-10 transition-transform group-hover:translate-y-0.5" />
              <span className="relative z-10">Export Matrix</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className={`lg:col-span-2 ${glassCard} p-8 lg:p-10 relative group`}>
            <div className="absolute top-8 right-8 flex items-center gap-2">
              <div className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] italic font-mono">FLOW_VELOCITY_STABLE</span>
            </div>
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="size-5 text-blue-600" />
                <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-blue-600 decoration-4 underline-offset-4">Revenue Intake Trends</h3>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-3">High-velocity collection stream protocol (Weekly Aggregate)</p>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 900 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 900 }} />
                <Tooltip content={<ForensicTooltip />} cursor={{ fill: 'rgba(59,130,246,0.03)' }} />
                <Bar dataKey="amount" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={45} name="Total Inflow" animationDuration={2000}>
                  {revenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 3 ? '#4f46e5' : '#3b82f6'} fillOpacity={index === 3 ? 1 : 0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className={`${glassCard} p-8 lg:p-10 relative group`}>
            <div className="absolute top-8 right-8 flex items-center gap-2">
              <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] italic font-mono">TYPE_SYNC_OK</span>
            </div>
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <PieChart className="size-5 text-emerald-600" />
                <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-emerald-600 decoration-4 underline-offset-4">Unit Allocation</h3>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-3">Distribution across active fiscal sectors</p>
            </div>
            <div className="space-y-8 mt-4">
              {categoryData.map((cat, i) => (
                <div key={i} className="space-y-3 group/item cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-2 rounded-full shadow-sm group-hover/item:scale-125 transition-transform" style={{ backgroundColor: cat.color }} />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover/item:text-slate-900 transition-colors">{cat.name}</span>
                    </div>
                    <span className="text-[11px] font-black text-slate-900 font-mono italic">{cat.value}%</span>
                  </div>
                  <div className="w-full bg-slate-100/50 rounded-full h-1.5 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000 group-hover:brightness-110" style={{ backgroundColor: cat.color, width: `${cat.value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 p-6 bg-slate-950 rounded-xl border border-white/10 shadow-2xl group-hover:scale-[1.02] transition-all duration-500">
              <div className="flex items-center gap-3 mb-2">
                <Globe className="size-4 text-blue-400" />
                <p className="text-[9px] text-slate-500 uppercase font-black tracking-[0.3em]">PRIMARY_SECTOR_SYNC</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-white italic tracking-tight">Central Node Delta</span>
                <span className="text-xs text-blue-400 font-black font-mono tracking-tighter">+FCFA 1.2M</span>
              </div>
            </div>
          </div>
        </div>

        <div className={glassCard}>
          <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <History className="size-5 text-indigo-600" />
              <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-indigo-600 decoration-4 underline-offset-4">Generated Intelligence</h3>
            </div>
            <button onClick={handleRefresh} disabled={isRefreshing} className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline transition-all disabled:opacity-50">
              <RefreshCcw className={`size-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Refresh Protocol'}</span>
            </button>
          </div>
          <div className="divide-y divide-slate-100/50">
            {reportsList.map((report, i) => (
              <div key={i} onClick={() => setPreviewReport(report)} className="flex items-center justify-between p-8 hover:bg-indigo-50/20 transition-all group cursor-pointer">
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-slate-950 text-white rounded-xl shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-white/10 flex-shrink-0">
                    <FileText className="size-6 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors uppercase italic">{report.name}</h4>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] font-mono">{report.date}</span>
                      <div className="size-1 rounded-full bg-slate-300" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] font-mono">{report.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 tracking-widest uppercase italic group-hover:bg-slate-950 group-hover:text-white group-hover:border-slate-950 transition-all">
                    {report.type}
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); toast.success(`${report.name} Downloaded`, { description: `Securely acquired ${report.size}.` }); }} className="p-4 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border-2 border-transparent hover:border-indigo-100">
                    <Download className="size-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODALS */}

      {/* Temporal Controls Modal */}
      {showTemporalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-10 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowTemporalModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-10 border border-slate-100">
            <button onClick={() => setShowTemporalModal(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
              <X className="size-5" />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <Calendar className="size-6" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Temporal Controls</h2>
            </div>
            <form onSubmit={handleTemporalSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">From Date</label>
                  <input type="date" required className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-colors font-mono text-slate-500" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">To Date</label>
                  <input type="date" required className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-colors font-mono text-slate-500" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Resolution Level</label>
                <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-colors appearance-none">
                  <option>Daily Aggregate</option>
                  <option>Weekly View</option>
                  <option>Monthly Rollup</option>
                </select>
              </div>
              <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-500/20">
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
              Export Matrix
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

      {/* Preview Report Modal */}
      {previewReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-10 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setPreviewReport(null)} />
          <div className="relative w-full max-w-4xl h-[80vh] bg-slate-50 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 bg-white border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <FileText className="size-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">{previewReport.name}</h2>
                  <div className="flex items-center gap-3 mt-1 text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">
                    <span>{previewReport.date}</span>
                    <span className="size-1 rounded-full bg-slate-300" />
                    <span className="flex items-center gap-1 text-emerald-500"><Lock className="size-3" /> SECURE PREVIEW</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => { setPreviewReport(null); toast.success(`${previewReport.name} Downloaded`); }} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-colors">
                  <Download className="size-3.5" /> Download Payload
                </button>
                <button onClick={() => setPreviewReport(null)} className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors">
                  <X className="size-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-10 bg-slate-100/50 flex items-center justify-center">
              {/* Fake Document Sheet */}
              <div className="w-full max-w-2xl bg-white min-h-full shadow-md rounded-md p-12 border border-slate-200 pointer-events-none">
                <div className="border-b-2 border-slate-900 pb-6 mb-8 flex justify-between items-end">
                  <div>
                    <div className="text-3xl font-black italic tracking-tighter uppercase text-slate-900">{previewReport.name}</div>
                    <div className="text-sm font-bold text-slate-500 mt-2 uppercase tracking-widest">OFFICIAL FISCAL REPORT</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black font-mono text-slate-400">ID: DOC-{Math.floor(Math.random() * 100000)}</div>
                    <div className="text-xs font-black font-mono text-slate-400 mt-1">{previewReport.date}</div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="h-4 bg-slate-100 rounded w-full" />
                  <div className="h-4 bg-slate-100 rounded w-[90%]" />
                  <div className="h-4 bg-slate-100 rounded w-[95%]" />
                  <div className="h-4 bg-slate-100 rounded w-[80%]" />
                  
                  <div className="py-6 flex justify-center">
                    <div className="size-48 rounded-full border-8 border-slate-100 flex items-center justify-center">
                      <PieChart className="size-16 text-slate-200" />
                    </div>
                  </div>

                  <div className="h-4 bg-slate-100 rounded w-[85%]" />
                  <div className="h-4 bg-slate-100 rounded w-[90%]" />
                  <div className="h-4 bg-slate-100 rounded w-full" />
                </div>
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
