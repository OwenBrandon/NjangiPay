import { getColorClass } from '../../utils/colorClasses';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { 
  Download, TrendingUp, BarChart as BarIcon, FileText, 
  Calendar, Zap, ShieldCheck, Activity, Globe, Send, 
  Archive, Eye, MoreVertical, Layers, Search, Filter,
  Clock, Database, HardDrive, Cpu, PieChart as PieIcon, Banknote
} from 'lucide-react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';

const monthlyRevenue = [
  { month: 'Jan', revenue: 35, target: 40 },
  { month: 'Feb', revenue: 37, target: 40 },
  { month: 'Mar', revenue: 36, target: 42 },
  { month: 'Apr', revenue: 39, target: 42 },
];

const complianceRate = [
  { month: 'Jan', rate: 85, predicted: 84 },
  { month: 'Feb', rate: 88, predicted: 89 },
  { month: 'Mar', rate: 91, predicted: 90 },
  { month: 'Apr', rate: 87, predicted: 92 },
];

export default function TaxAdminReports() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Templates');
  const [previewReport, setPreviewReport] = useState<any>(null);
  const [dispatchReport, setDispatchReport] = useState<any>(null);

  const glassCard = 'bg-blue-50/40 backdrop-blur-3xl rounded-2xl border border-white/60 shadow-2xl shadow-blue-900/5 overflow-hidden';

  return (
    <div className="min-h-screen bg-[#f1f5f9] relative overflow-hidden">
      {/* Intelligence Background Blobs */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[25%] right-[5%] w-[25%] h-[25%] bg-slate-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="p-6 lg:p-10 space-y-12 relative z-10">
        {/* Intelligence Command Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="size-3 rounded-full bg-indigo-500 animate-ping absolute inset-0" />
                <div className="size-3 rounded-full bg-indigo-600 relative" />
              </div>
              <span className="px-3 py-1 bg-indigo-100/50 border border-indigo-200 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Intelligence Node</span>
              <span className="text-slate-400">•</span>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Fiscal Data Terminal</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">Regional Reports</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => toast.info('Data Sync Initiated', { description: 'Pulling latest nodes from regional databases.' })} className="flex items-center gap-2 px-7 py-3.5 bg-white border border-slate-200 text-slate-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
              <Clock className="size-4" />
              Schedule Sync
            </button>
            <button 
              onClick={() => {
                toast.success('Global Export Prepared');
                const headers = 'Month,Actual Revenue,Target Revenue\n';
                const rows = monthlyRevenue.map(m => `"${m.month}",${m.revenue},${m.target}`).join('\n');
                const csvContent = headers + rows;
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.setAttribute('href', url);
                link.setAttribute('download', `global_regional_revenue_${new Date().toISOString().split('T')[0]}.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }} 
              className="flex items-center gap-2 px-7 py-3.5 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200/50"
            >
              <Download className="size-4" />
              Global Export
            </button>
          </div>
        </div>

        {/* Intelligence KPI Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Generated Intel', value: '1,402', trend: 'Optimal', icon: Database, color: 'blue', accent: 'bg-blue-100/60' },
            { label: 'Data Integrity', value: '99.8%', trend: 'Verified', icon: ShieldCheck, color: 'sky', accent: 'bg-sky-100/60' },
            { label: 'Storage Nodes', value: '12.4GB', trend: 'Active', icon: HardDrive, color: 'indigo', accent: 'bg-indigo-100/60' },
            { label: 'Sync Velocity', value: '1.2ms', trend: 'Critical', icon: Cpu, color: 'purple', accent: 'bg-purple-100/60' },
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
                  <div className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-[0.1em] uppercase bg-white/50 text-slate-500`}>
                    {kpi.trend}
                  </div>
                </div>
                <div className="text-[11px] font-black text-slate-500 uppercase tracking-[0.25em] mb-3">{kpi.label}</div>
                <div className="text-5xl font-black text-slate-900 tracking-tighter group-hover:text-blue-600 transition-colors">{kpi.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Analytic Command Center */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Terminal */}
          <div className={glassCard}>
            <div className="p-10 border-b border-white/50 bg-white/30 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">Revenue Trajectory</h3>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">Institutional Inflow Analysis (FCFA  Millions)</p>
              </div>
              <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl shadow-sm">
                <Activity className="size-5" />
              </div>
            </div>
            <div className="p-10 pt-12">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyRevenue}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 900 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 900 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '15px' }}
                    itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" name="Actual Collection" />
                  <Area type="monotone" dataKey="target" stroke="#cbd5e1" strokeWidth={2} fill="none" strokeDasharray="5 5" name="Target Matrix" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Compliance Terminal */}
          <div className={glassCard}>
            <div className="p-10 border-b border-white/50 bg-white/30 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">Compliance Matrix</h3>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">Registry Filing Velocity Trend</p>
              </div>
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl shadow-sm">
                <ShieldCheck className="size-5" />
              </div>
            </div>
            <div className="p-10 pt-12">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={complianceRate}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 900 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 900 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '15px' }}
                    itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                  />
                  <Line type="monotone" dataKey="rate" stroke="#0ea5e9" strokeWidth={4} dot={{ fill: '#0ea5e9', r: 6, strokeWidth: 4, stroke: '#fff' }} name="Filing Accuracy" />
                  <Line type="monotone" dataKey="predicted" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Forecast Node" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Intelligence Nodes Hub */}
        <div className={glassCard}>
          <div className="p-10 lg:p-14 space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Intelligence Templates</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Select protocol for data extraction</p>
              </div>
              <div className="flex items-center gap-4 bg-white/50 p-2 rounded-3xl border border-white">
                {['Templates', 'Scheduled', 'Archives'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeTab === tab ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: 'Revenue Summary', description: 'Total revenue by tax type and regional nodes', icon: Banknote, color: 'blue' },
                { name: 'Taxpayer Register', description: 'Complete taxpayer listing and status matrix', icon: Users, color: 'indigo' },
                { name: 'Compliance Report', description: 'Filing and payment compliance intelligence', icon: ShieldCheck, color: 'sky' },
                { name: 'Defaulters List', description: 'Overdue returns and payment exceptions', icon: AlertTriangle, color: 'rose' },
                { name: 'Assessment Report', description: 'Tax assessments summary and disputed nodes', icon: FileText, color: 'purple' },
                { name: 'Regional Analysis', description: 'Performance and collection velocity by region', icon: Globe, color: 'amber' },
              ].map((report, idx) => (
                <div key={idx} className="group relative bg-white border border-slate-100 rounded-2xl p-8 hover:shadow-2xl hover:shadow-indigo-900/10 hover:border-indigo-200 transition-all duration-500 cursor-pointer overflow-hidden">
                  <div className={`absolute -top-10 -right-10 w-24 h-24 ${getColorClass(report.color, 'bg500_10')} rounded-full blur-[40px] group-hover:scale-150 transition-transform duration-700`} />
                  
                  <div className="flex items-start justify-between mb-8">
                    <div className={`p-4 ${getColorClass(report.color, 'bg50')} ${getColorClass(report.color, 'text600')} rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm border ${getColorClass(report.color, 'border100')}`}>
                      <report.icon className="size-6" />
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                      <button onClick={() => setPreviewReport(report)} className="p-2 bg-slate-50 text-slate-400 hover:bg-indigo-600 hover:text-white rounded-xl shadow-sm"><Eye className="size-4" /></button>
                      <button onClick={() => setDispatchReport(report)} className="p-2 bg-slate-50 text-slate-400 hover:bg-emerald-600 hover:text-white rounded-xl shadow-sm"><Send className="size-4" /></button>
                    </div>
                  </div>

                  <h4 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">{report.name}</h4>
                  <p className="text-xs text-slate-500 font-bold leading-relaxed mt-2">{report.description}</p>

                  <div className="mt-8 flex items-center justify-between border-t border-slate-50 pt-6">
                    <div className="flex items-center gap-2">
                      <div className={`size-2 rounded-full ${getColorClass(report.color, 'bg500')} animate-pulse`} />
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Protocol Available</span>
                    </div>
                    <button 
                      onClick={() => {
                        toast.success('Report Generated', { description: `${report.name} compiled successfully.` });
                        const docContent = `==================================================
TAXMS REGIONAL OFFICE REPORT
==================================================
Report Name:     ${report.name}
Description:     ${report.description}
Status:          COMPILED
Date:            ${new Date().toISOString().split('T')[0]}
==================================================
This is an automatically compiled report containing
recent tax metrics and regional telemetry summaries.
==================================================`;
                        const blob = new Blob([docContent], { type: 'text/plain;charset=utf-8;' });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.setAttribute('href', url);
                        link.setAttribute('download', `${report.name.toLowerCase().replace(/\s+/g, '_')}_report.txt`);
                        link.style.visibility = 'hidden';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }} 
                      className="flex items-center gap-2 px-5 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200"
                    >
                      Generate
                      <Zap className="size-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Telemetry */}
          <div className="px-12 py-8 border-t border-slate-200/50 bg-blue-50/20 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.25em]">
              <div className="flex items-center gap-3">
                <span className="text-slate-900">INTEL VELOCITY:</span>
                <span className="px-3 py-1 bg-white border border-indigo-200 text-indigo-700 rounded-lg shadow-sm font-mono tracking-tighter">OPTIMAL PROTOCOL</span>
              </div>
              <div className="flex items-center gap-3 pl-8 border-l border-slate-200">
                <span className="text-slate-900">DATA NODES:</span>
                <span className="font-mono text-slate-700">842,012 REGISTRY ITEMS</span>
              </div>
            </div>
            <div className="flex gap-4 text-xs font-black text-slate-400 uppercase tracking-widest">
              Last Sync: 2 Minutes Ago
            </div>
          </div>
        </div>
      </div>

      {/* Preview Report Dialog */}
      <Dialog open={!!previewReport} onOpenChange={(open) => !open && setPreviewReport(null)}>
        <DialogContent className="sm:max-w-3xl bg-white rounded-3xl p-0 overflow-hidden border-0 shadow-2xl">
          <DialogHeader className="px-8 pt-8 pb-4 bg-slate-50 border-b border-slate-100">
            <DialogTitle className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <Eye className="size-6 text-indigo-600" />
              Live Preview: {previewReport?.name}
            </DialogTitle>
            <DialogDescription className="text-slate-500 font-bold mt-2">
              Viewing compiled intelligence for {previewReport?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="p-8 h-96 flex items-center justify-center bg-slate-100/50">
            <div className="flex flex-col items-center gap-4 text-slate-400 animate-pulse">
              <Database className="size-16" />
              <div className="text-xs font-black uppercase tracking-widest">Rendering Data Nodes...</div>
            </div>
          </div>
          <DialogFooter className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex gap-4">
            <button
              onClick={() => setPreviewReport(null)}
              className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-wider hover:bg-white transition-colors"
            >
              Close Preview
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dispatch Report Dialog */}
      <Dialog open={!!dispatchReport} onOpenChange={(open) => !open && setDispatchReport(null)}>
        <DialogContent className="sm:max-w-xl bg-white rounded-3xl p-0 overflow-hidden border-0 shadow-2xl">
          <DialogHeader className="px-8 pt-8 pb-4 bg-slate-50 border-b border-slate-100">
            <DialogTitle className="text-2xl font-black text-slate-900">Dispatch Intelligence</DialogTitle>
            <DialogDescription className="text-slate-500 font-bold mt-2">
              Routing <span className="text-emerald-600">{dispatchReport?.name}</span> to operational teams.
            </DialogDescription>
          </DialogHeader>
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Distribution List</label>
              <input
                type="text"
                defaultValue="executive_board@taxms.gov, regional_directors@taxms.gov"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attached Memo (Optional)</label>
              <textarea
                placeholder="Add contextual intelligence..."
                className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none resize-none transition-all"
              />
            </div>
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Encryption Node</span>
              </div>
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Active</span>
            </div>
          </div>
          <DialogFooter className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex gap-4">
            <button
              onClick={() => setDispatchReport(null)}
              className="px-6 py-3 border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-wider hover:bg-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                toast.success('Report Dispatched', { description: `Securely routed ${dispatchReport?.name}.` });
                setDispatchReport(null);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200/50 group"
            >
              <Send className="size-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              Secure Dispatch
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Additional missing icons used in report list
function Users(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function AlertTriangle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}
