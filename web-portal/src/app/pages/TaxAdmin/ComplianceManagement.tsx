import React, { useState, useMemo } from 'react';
import { useMockData } from '../../contexts/MockDataContext';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { 
  AlertTriangle, CheckCircle, Clock, Gavel, Search, Filter, 
  TrendingDown, ShieldAlert, FileText, Send, Eye, SearchCode,
  ArrowRight, Download, Zap, MapPin, X, Calendar, ShieldCheck
} from 'lucide-react';
import { Link, useNavigate } from 'react-router';

export default function ComplianceManagement() {
  const navigate = useNavigate();
  const { taxpayers, taxReturns } = useMockData();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Overdue');
  const [showFilters, setShowFilters] = useState(false);
  
  // Notice Modal State
  const [noticeTaxpayer, setNoticeTaxpayer] = useState<any>(null);
  const [noticeMessage, setNoticeMessage] = useState('');

  const filed = taxReturns.filter(tr => tr.status === 'filed');
  const notFiled = taxReturns.filter(tr => tr.status === 'not_filed');
  const overdue = taxReturns.filter(tr => tr.status === 'overdue');

  const glassCard = 'bg-blue-50/40 backdrop-blur-3xl rounded-2xl border border-white/60 shadow-2xl shadow-blue-900/5 overflow-hidden';

  // Real-time Filtering Logic
  const filteredReturns = useMemo(() => {
    return taxReturns.filter(tr => {
      const taxpayer = taxpayers.find(t => t.id === tr.taxpayerId);
      const matchesSearch = 
        taxpayer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        taxpayer?.tin.includes(searchTerm) ||
        tr.taxType.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTab = 
        activeTab === 'All' || 
        (activeTab === 'Overdue' && tr.status === 'overdue') ||
        (activeTab === 'Not Filed' && tr.status === 'not_filed') ||
        (activeTab === 'Filed' && tr.status === 'filed');
      
      return matchesSearch && matchesTab;
    });
  }, [searchTerm, activeTab, taxReturns, taxpayers]);

  return (
    <div className="min-h-screen bg-[#f1f5f9] relative overflow-hidden">
      {/* Dynamic Vibrant Background Blobs */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-rose-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[25%] right-[5%] w-[25%] h-[25%] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="p-6 lg:p-10 space-y-12 relative z-10">
        {/* Surgical Command Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="size-3 rounded-full bg-rose-500 animate-ping absolute inset-0" />
                <div className="size-3 rounded-full bg-rose-600 relative" />
              </div>
              <span className="px-3 py-1 bg-rose-100/50 border border-rose-200 text-rose-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Compliance Protocol</span>
              <span className="text-slate-400">•</span>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Live Enforcement Hub</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">Compliance Management</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => { toast.success('Intelligence Report Generated'); }} className="flex items-center gap-2 px-7 py-3.5 bg-white border border-slate-200 text-slate-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
              <Download className="size-4" />
              Intelligence Report
            </button>
            <Link
              to="/tax-admin/compliance/penalties"
              className="flex items-center gap-2 px-7 py-3.5 bg-rose-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-xl shadow-rose-200/50"
            >
              <Gavel className="size-4" />
              Manage Penalties
            </Link>
          </div>
        </div>

        {/* Premium Compliance Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Compliance Score', value: '78%', subLabel: 'OVERALL SYSTEM HEALTH', icon: ShieldCheck, color: 'blue' },
            { label: 'Overdue Filings', value: overdue.length, subLabel: 'ACTIONABLE VIOLATIONS', icon: AlertTriangle, color: 'rose' },
            { label: 'Revenue at Risk', value: 'FCFA 420M', subLabel: 'POTENTIAL FISCAL LEAKAGE', icon: TrendingDown, color: 'amber' },
            { label: 'Audit Velocity', value: '14/mo', subLabel: 'FORENSIC THROUGHPUT', icon: SearchCode, color: 'purple' },
          ].map((kpi, i) => (
            <div key={i} className={`group relative bg-white border border-slate-200/60 rounded-2xl p-10 transition-all duration-500 overflow-hidden cursor-default`}>
              {/* Large Background Icon Node */}
              <kpi.icon className="absolute right-[-15%] bottom-[-15%] size-48 text-slate-100/50 group-hover:scale-110 transition-transform duration-1000" strokeWidth={1} />
              
              <div className="relative z-10 flex flex-col gap-8">
                <div className="flex items-center gap-6">
                  <div 
                    className={`p-4 rounded-xl shadow-xl transition-all duration-500 ${kpi.color === 'rose' ? 'bg-rose-100/80 text-rose-600 shadow-rose-900/5 border border-rose-200/50' : 'bg-[#0d1929] text-[#38bdf8] shadow-slate-900/10'} group-hover:scale-110 group-hover:rotate-6`}
                  >
                    <kpi.icon className="size-6" strokeWidth={2.5} />
                  </div>
                  <div className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">{kpi.label}</div>
                </div>

                <div className="space-y-1">
                  <div className={`text-6xl font-black tracking-tighter transition-colors ${kpi.color === 'rose' ? 'text-rose-600' : 'text-slate-950'}`}>{kpi.value}</div>
                  <div className={`text-[10px] font-black italic uppercase tracking-wider ${kpi.color === 'rose' ? 'text-rose-500' : 'text-blue-500'}`}>{kpi.subLabel}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Compliance Terminal */}
        <div className="bg-white rounded-2xl p-3 shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          {/* Advanced Search & Results Control */}
          <div className="px-8 py-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="relative flex-1 max-w-xl group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
                <Search className="size-5 text-slate-400 group-focus-within:text-rose-500 transition-all" />
                <div className="w-px h-4 bg-slate-200 group-focus-within:bg-rose-200 transition-all" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Initialize node search..."
                className="w-full pl-20 pr-8 py-5 bg-white border-2 border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-400 focus:border-rose-500 focus:shadow-[0_0_30px_-5px_rgba(244,63,94,0.15)] outline-none transition-all shadow-sm"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-full flex items-center gap-2 shadow-sm">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing</span>
                <span className="text-[10px] font-black text-lime-500 uppercase tracking-widest">{filteredReturns.length}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">of</span>
                <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{taxReturns.length}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nodes</span>
              </div>
              
              <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-100">
                {['Overdue', 'Not Filed', 'Filed', 'All'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setActiveTab(status)}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeTab === status 
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/20' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Data Grid Surface */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-10 py-5 text-left text-[11px] font-black italic text-slate-800 uppercase tracking-[0.2em]">Strategic Entity</th>
                  <th className="px-10 py-5 text-left text-[11px] font-black italic text-slate-800 uppercase tracking-[0.2em]">Filing Node</th>
                  <th className="px-10 py-5 text-left text-[11px] font-black italic text-slate-800 uppercase tracking-[0.2em]">Fiscal Horizon</th>
                  <th className="px-10 py-5 text-left text-[11px] font-black italic text-slate-800 uppercase tracking-[0.2em]">Fiscal Load</th>
                  <th className="px-10 py-5 text-left text-[11px] font-black italic text-slate-800 uppercase tracking-[0.2em]">Risk Node</th>
                  <th className="px-10 py-5 text-right text-[11px] font-black italic text-slate-800 uppercase tracking-[0.2em]">Enforcement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/30">
                {filteredReturns.length > 0 ? (
                  filteredReturns.map((tr) => {
                    const taxpayer = taxpayers.find(t => t.id === tr.taxpayerId);
                    const daysOverdue = tr.status === 'overdue' ? Math.floor(
                      (new Date().getTime() - new Date(tr.dueDate).getTime()) / (1000 * 60 * 60 * 24)
                    ) : 0;
                    const initials = taxpayer?.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'TX';
                    
                    return (
                      <tr key={tr.id} className="hover:bg-slate-50/50 transition-all group relative border-b border-slate-100 last:border-0">
                        <td className="px-10 py-6 relative">
                          <div className="flex items-center gap-5">
                            <div 
                              className="size-12 rounded-2xl flex items-center justify-center text-[11px] font-black text-slate-600 bg-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 group-hover:rotate-6 shadow-sm"
                            >
                              {initials}
                            </div>
                            <div>
                              <div className="text-base font-black text-slate-900 tracking-tight leading-tight">{taxpayer?.name}</div>
                              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 italic">
                                TIN: {taxpayer?.tin}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-12 py-5">
                          <span className="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] group-hover:border-rose-200 group-hover:text-rose-600 transition-all">
                            {tr.taxType}
                          </span>
                        </td>
                        <td className="px-12 py-5">
                          <div className="flex items-center gap-2 text-xs font-black text-slate-600">
                            <Calendar className="size-3.5 text-blue-500" />
                            {tr.period}
                          </div>
                        </td>
                        <td className="px-12 py-5">
                          <div className="text-sm font-mono text-slate-700 font-black tracking-tight">
                            {"FCFA "}{tr.amount.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-12 py-5">
                          {tr.status === 'overdue' ? (
                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl border border-rose-200 bg-rose-50/80 text-rose-700 shadow-sm group-hover:shadow-md transition-all">
                              <div className="size-2 rounded-full bg-rose-500 group-hover:animate-ping" />
                              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{daysOverdue} Days Overdue</span>
                            </div>
                          ) : (
                            <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-2xl border ${tr.status === 'filed' ? 'border-sky-200 bg-sky-50/80 text-sky-700' : 'border-amber-200 bg-amber-50/80 text-amber-700'}`}>
                              <div className={`size-2 rounded-full ${tr.status === 'filed' ? 'bg-sky-500' : 'bg-amber-500'}`} />
                              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{tr.status.replace('_', ' ')}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-12 py-5 text-right">
                          <div className="flex items-center justify-end gap-3 transition-all">
                            <button 
                              onClick={() => navigate(`/tax-admin/taxpayers/${taxpayer?.id}`)}
                              className="p-3 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-2xl transition-all shadow-sm border border-blue-100 hover:shadow-xl hover:shadow-blue-200/50"
                              title="View History"
                            >
                              <Eye className="size-5" />
                            </button>
                            <button 
                              onClick={() => {
                                toast.success('Audit Case Initiated', { description: `Forensic audit assigned for ${taxpayer?.name || 'entity'}.` });
                                navigate('/tax-admin/assessments/create');
                              }}
                              className="p-3 bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white rounded-2xl transition-all shadow-sm border border-amber-100 hover:shadow-xl hover:shadow-amber-200/50"
                              title="Initiate Audit"
                            >
                              <SearchCode className="size-5" />
                            </button>
                            <button 
                              onClick={() => {
                                setNoticeTaxpayer(taxpayer);
                                setNoticeMessage(`STRICT COMPLIANCE NOTICE\n\nDear ${taxpayer?.name || 'Entity'},\n\nOur automated systems have flagged unresolved compliance anomalies associated with TIN: ${taxpayer?.tin || 'XXX'}.\n\nPlease remit the outstanding fiscal load to avoid further punitive protocols.\n\nEnforcement Division`);
                              }}
                              className="p-3 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-2xl transition-all shadow-sm border border-rose-100 hover:shadow-xl hover:shadow-rose-200/50"
                              title="Issue Notice"
                            >
                              <Send className="size-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-12 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 text-slate-300">
                          <CheckCircle className="size-12" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Compliance Integrity Verified</p>
                          <p className="text-xs text-slate-400 font-bold">No entities found matching the current risk parameters.</p>
                        </div>
                        <button 
                          onClick={() => { setSearchTerm(''); setActiveTab('Overdue'); }}
                          className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
                        >
                          Refresh Enforcement Hub
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Telemetry */}
          <div className="px-12 py-8 border-t border-slate-200/50 bg-blue-50/20 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.25em]">
              <div className="flex items-center gap-3">
                <span className="text-slate-900">SYSTEM HEALTH:</span>
                <span className="px-3 py-1 bg-white border border-blue-200 text-blue-700 rounded-lg shadow-sm font-mono tracking-tighter">OPTIMAL PROTOCOL</span>
              </div>
              <div className="flex items-center gap-3 pl-8 border-l border-slate-200">
                <span className="text-slate-900">NODES LOADED:</span>
                <span className="font-mono text-slate-700">{filteredReturns.length}</span>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => toast.info('Loading next data cluster from central DB...')} className="px-8 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 hover:border-rose-500 hover:text-rose-600 transition-all shadow-lg shadow-slate-200 group flex items-center gap-3">
                Next Data Cluster
                <ArrowRight className="size-4 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Issue Notice Dialog */}
      <Dialog open={!!noticeTaxpayer} onOpenChange={(open) => !open && setNoticeTaxpayer(null)}>
        <DialogContent className="sm:max-w-xl bg-white rounded-3xl p-0 overflow-hidden border-0 shadow-2xl">
          <DialogHeader className="px-8 pt-8 pb-4 bg-slate-50 border-b border-slate-100">
            <DialogTitle className="text-2xl font-black text-slate-900">Issue Enforcement Notice</DialogTitle>
            <DialogDescription className="text-slate-500 font-bold mt-2">
              Drafting secure communication to <span className="text-rose-600">{noticeTaxpayer?.name}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Message Content</label>
              <textarea
                value={noticeMessage}
                onChange={(e) => setNoticeMessage(e.target.value)}
                className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none resize-none transition-all"
              />
            </div>
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Delivery Protocol</span>
              </div>
              <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Priority Terminal</span>
            </div>
          </div>
          <DialogFooter className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex gap-4">
            <button
              onClick={() => setNoticeTaxpayer(null)}
              className="px-6 py-3 border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-wider hover:bg-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                toast.success('Notice Sent Securely', { description: `Message delivered to ${noticeTaxpayer?.name}` });
                setNoticeTaxpayer(null);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-wider hover:bg-rose-700 transition-all shadow-lg shadow-rose-200/50 group"
            >
              <Send className="size-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              Dispatch Notice
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
