import React, { useState } from 'react';
import { Search, Filter, Download, Activity, ShieldCheck, Clock, Globe, AlertTriangle, ChevronLeft, ChevronRight, Terminal } from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../../components/ui/sheet';
import { toast } from 'sonner';

export default function AuditLogs() {
  const { auditLogs } = useMockData();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const itemsPerPage = 8;
  
  const filteredLogs = auditLogs.filter(log => 
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.resource.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleExport = () => {
    setIsExporting(true);
    toast("Initiating Secure Export...", { description: "Compiling telemetry data." });
    setTimeout(() => {
      setIsExporting(false);
      toast.success("Export Complete", { description: "Data archived and ready for download." });
    }, 2000);
  };

  const glassCard = 'bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] overflow-hidden';
  const terminalGrid = "bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:30px_30px]";

  return (
    <div className={`min-h-screen bg-[#f8fafc] relative overflow-hidden ${terminalGrid}`}>
      {/* Background Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-slate-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="p-6 lg:p-10 space-y-10 relative z-10 max-w-[1600px] mx-auto">
        {/* Compact Elite Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative group cursor-pointer">
                <div className="size-5 rounded-full bg-amber-500/20 animate-ping absolute inset-0" />
                <div className="size-5 rounded-full bg-amber-600 relative border-[3px] border-white shadow-xl" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-amber-700 uppercase tracking-[0.4em]">Security Audit Matrix</span>
                  <span className="text-slate-300">/</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Node: LOG-PRIME-01</span>
                </div>
                <div className="h-1 w-32 bg-amber-600/10 mt-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-600 w-2/3 animate-loading shadow-[0_0_8px_rgba(217,119,6,0.5)]" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-none italic uppercase">
              Audit <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">Logs</span>
            </h1>
          </div>
          
          <button onClick={handleExport} className="group relative flex items-center gap-4 px-8 py-5 bg-slate-950 text-white rounded-xl text-[11px] font-black uppercase tracking-[0.3em] overflow-hidden transition-all hover:scale-[1.03] hover:shadow-[0_30px_60px_-15px_rgba(15,23,42,0.4)] active:scale-[0.97]">
            <Download className={`size-4 relative z-10 transition-transform ${isExporting ? 'animate-bounce' : 'group-hover:translate-y-0.5'}`} />
            <span className="relative z-10">{isExporting ? 'Exporting...' : 'Secure Export Protocol'}</span>
          </button>
        </div>

        {/* Security Telemetry Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Log Velocity', value: '1.2k/hr', icon: <Activity className="size-5" />, color: 'blue' },
            { label: 'Security Level', value: 'OPTIMAL', icon: <ShieldCheck className="size-5" />, color: 'emerald' },
            { label: 'Access Failures', value: '0.04%', icon: <AlertTriangle className="size-5" />, color: 'rose' },
            { label: 'Uptime', value: '99.99%', icon: <Clock className="size-5" />, color: 'amber' },
          ].map((stat, i) => {
            const colorMap: Record<string, { text: string; bg: string; iconText: string }> = {
              blue: { text: 'text-blue-600', bg: 'bg-blue-50', iconText: 'text-blue-600' },
              emerald: { text: 'text-emerald-600', bg: 'bg-emerald-50', iconText: 'text-emerald-600' },
              rose: { text: 'text-rose-600', bg: 'bg-rose-50', iconText: 'text-rose-600' },
              amber: { text: 'text-amber-600', bg: 'bg-amber-50', iconText: 'text-amber-600' },
            };
            const colors = colorMap[stat.color] || colorMap.blue;
            return (
              <div key={i} className="bg-white/60 backdrop-blur-md rounded-xl p-6 border border-white/60 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-all">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{stat.label}</span>
                  <span className={`text-2xl font-black ${colors.text} tracking-tighter italic`}>{stat.value}</span>
                </div>
                <div className={`p-3 ${colors.bg} ${colors.iconText} rounded-2xl group-hover:scale-110 transition-transform`}>
                  {stat.icon}
                </div>
              </div>
            );
          })}
        </div>

        {/* Command Control & Forensic Matrix */}
        <div className={glassCard}>
          <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/30 flex flex-col md:flex-row md:items-center gap-6 justify-between">
            <div className="flex-1 relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
              <input
                type="text"
                placeholder="EXECUTE LOG QUERY..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-8 py-5 bg-white border-2 border-slate-100 rounded-xl text-sm font-black text-slate-800 placeholder:text-slate-300 focus:border-amber-500 focus:ring-8 focus:ring-amber-500/5 outline-none transition-all shadow-inner tracking-widest italic"
              />
            </div>
            <button onClick={() => setShowFilters(true)} className="flex items-center gap-3 px-8 py-5 bg-white border-2 border-slate-100 text-slate-600 rounded-xl text-[11px] font-black uppercase tracking-widest hover:border-amber-500 hover:text-amber-600 transition-all shadow-sm">
              <Filter className="size-4" />
              Advanced Filters
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-6 text-left text-[10px] font-black italic text-slate-400 uppercase tracking-[0.2em]">Timestamp</th>
                  <th className="px-6 py-6 text-left text-[10px] font-black italic text-slate-400 uppercase tracking-[0.2em]">Operator</th>
                  <th className="px-6 py-6 text-left text-[10px] font-black italic text-slate-400 uppercase tracking-[0.2em]">Action Protocol</th>
                  <th className="px-6 py-6 text-left text-[10px] font-black italic text-slate-400 uppercase tracking-[0.2em]">Resource Node</th>
                  <th className="px-6 py-6 text-left text-[10px] font-black italic text-slate-400 uppercase tracking-[0.2em]">IP Source</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black italic text-slate-400 uppercase tracking-[0.2em]">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedLogs.length > 0 ? paginatedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-amber-50/20 transition-all group">
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Clock className="size-4 text-slate-300" />
                        <span className="text-[11px] font-bold text-slate-500 font-mono italic">{log.timestamp}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-600 border border-slate-200">
                          {log.user.charAt(0)}
                        </div>
                        <span className="text-xs font-black text-slate-700 tracking-tight uppercase italic">{log.user}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl w-fit">
                        <Terminal className="size-3.5 text-slate-400" />
                        <span className="text-[11px] font-black text-slate-600 tracking-tight uppercase">{log.action}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-xs font-bold text-slate-500 tracking-tight font-mono">{log.resource}</span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Globe className="size-3.5" />
                        <span className="text-xs font-bold font-mono tracking-widest">{log.ip}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          log.status === 'success'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                            : 'bg-rose-50 text-rose-600 border-rose-100 shadow-[0_0_10px_rgba(225,29,72,0.1)]'
                        }`}
                      >
                        <div className={`size-1.5 rounded-full ${log.status === 'success' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                        {log.status}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-8 py-10 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">No records found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
              Matrix View: Showing {filteredLogs.length} Protocol Units (Page {currentPage} of {totalPages})
            </span>
            <div className="flex gap-4">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="p-3 border-2 border-slate-100 rounded-2xl text-slate-400 hover:border-amber-500 hover:text-amber-500 transition-all bg-white disabled:opacity-50">
                <ChevronLeft className="size-5" />
              </button>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className="p-3 border-2 border-slate-100 rounded-2xl text-slate-400 hover:border-amber-500 hover:text-amber-500 transition-all bg-white disabled:opacity-50">
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Sheet open={showFilters} onOpenChange={setShowFilters}>
        <SheetContent className="bg-slate-900 text-white border-l-amber-500/30">
          <SheetHeader>
            <SheetTitle className="text-amber-500 font-black tracking-widest uppercase">Advanced Query</SheetTitle>
            <SheetDescription className="text-slate-400">Configure multi-dimensional filters for log extraction.</SheetDescription>
          </SheetHeader>
          <div className="mt-8 space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Time Matrix</label>
              <select className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-slate-300 outline-none">
                <option>Last 24 Hours</option>
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Action Protocol</label>
              <select className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-slate-300 outline-none">
                <option>All Actions</option>
                <option>Authentication</option>
                <option>Data Modification</option>
                <option>System Config</option>
              </select>
            </div>
            <button onClick={() => setShowFilters(false)} className="w-full mt-4 bg-amber-600 hover:bg-amber-700 text-white font-black uppercase tracking-widest rounded-xl py-4 shadow-lg shadow-amber-900/20 transition-all">
              Apply Filters
            </button>
          </div>
        </SheetContent>
      </Sheet>

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
