import { getColorClass } from '../../utils/colorClasses';
import React, { useState, useEffect } from 'react';
import { 
  FileText, Download, Search, Filter, Plus, Calendar, ShieldCheck, 
  Eye, Activity, Zap, History, ChevronRight, MoreHorizontal,
  ArrowUpDown, CheckCircle, Clock, AlertTriangle, Crosshair, Globe,
  X, FileSpreadsheet, Key, ShieldAlert
} from 'lucide-react';
import { toast } from 'sonner';

export default function AuditReports() {
  const [searchQuery, setSearchQuery] = useState('');
  const [reportsList, setReportsList] = useState([
    { id: 'AUD-REP-992', cat: 'Forensic Audit', name: 'Global Logistics', date: 'May 05, 2024', risk: 'High', status: 'final', notes: 'Identified minor Temporal Anomaly discrepancies in invoice patterns.' },
    { id: 'AUD-REP-985', cat: 'Routine Review', name: 'Alpha Tech', date: 'May 02, 2024', risk: 'Low', status: 'draft', notes: 'Standard annual filing verification. All nodes balanced.' },
    { id: 'AUD-REP-978', cat: 'Fraud Investigation', name: 'Central Power', date: 'Apr 28, 2024', risk: 'Critical', status: 'final', notes: 'Suspicious transaction pattern matching temporal offset clusters.' },
    { id: 'AUD-REP-971', cat: 'Sectoral Audit', name: 'Douala Retail', date: 'Apr 25, 2024', risk: 'Medium', status: 'final', notes: 'Retail tax filings variance scan completed.' },
    { id: 'AUD-REP-964', cat: 'Compliance Audit', name: 'Standard Trust', date: 'Jun 12, 2024', risk: 'Low', status: 'scheduled', notes: 'Scheduled review of corporate income compliance.' },
    { id: 'AUD-REP-957', cat: 'Risk Assessment', name: 'Express Freight', date: 'Jun 18, 2024', risk: 'High', status: 'scheduled', notes: 'Pre-audit risk evaluation based on temporal signals.' },
    { id: 'AUD-REP-950', cat: 'Tax Investigation', name: 'Metro Foods', date: 'May 20, 2024', risk: 'Medium', status: 'draft', notes: 'Reviewing raw ledger files for VAT input deductions.' },
    { id: 'AUD-REP-943', cat: 'Forensic Audit', name: 'Apex Energy', date: 'Jul 01, 2024', risk: 'Critical', status: 'scheduled', notes: 'Forensic cluster scan planned for energy sector offsets.' },
  ]);

  const [activeTab, setActiveTab] = useState<'all' | 'final' | 'draft' | 'scheduled'>('all');
  
  // Modal states
  const [showInitModal, setShowInitModal] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showExamineModal, setShowExamineModal] = useState(false);
  const [showBriefModal, setShowBriefModal] = useState(false);

  // Form states for report initialization
  const [newRepName, setNewRepName] = useState('');
  const [newRepCat, setNewRepCat] = useState('Forensic Audit');
  const [newRepRisk, setNewRepRisk] = useState('Low');
  const [newRepStatus, setNewRepStatus] = useState<'final' | 'draft' | 'scheduled'>('draft');
  const [newRepNotes, setNewRepNotes] = useState('');

  // Selected report for detail view
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  // Advanced filter inputs
  const [filterCat, setFilterCat] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');

  // AI Brief Generation progress simulation
  const [briefProgress, setBriefProgress] = useState(0);
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);

  const glassCard = 'bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] overflow-hidden';
  const terminalGrid = "bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:30px_30px]";

  const selectedReport = reportsList.find(r => r.id === selectedReportId);

  const handleInitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRepName.trim()) {
      toast.error('Entity Name is required');
      return;
    }
    const newId = `AUD-REP-${Math.floor(100 + Math.random() * 900)}`;
    const newReport = {
      id: newId,
      cat: newRepCat,
      name: newRepName,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      risk: newRepRisk,
      status: newRepStatus,
      notes: newRepNotes || 'No custom findings recorded.'
    };
    setReportsList([newReport, ...reportsList]);
    setShowInitModal(false);
    setNewRepName('');
    setNewRepNotes('');
    toast.success('Report Initialized', { description: `${newId} successfully added to database.` });
  };

  const startBriefGeneration = () => {
    setBriefProgress(0);
    setIsGeneratingBrief(true);
    setShowBriefModal(true);
  };

  useEffect(() => {
    if (!isGeneratingBrief || briefProgress >= 100) return;
    const interval = setInterval(() => {
      setBriefProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 10;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [isGeneratingBrief, briefProgress]);

  const filteredReports = reportsList.filter(r => {
    const matchSearch = r.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cat.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTab = activeTab === 'all' || r.status === activeTab;
    const matchCat = filterCat === 'all' || r.cat === filterCat;
    const matchRisk = filterRisk === 'all' || r.risk === filterRisk;
    return matchSearch && matchTab && matchCat && matchRisk;
  });

  return (
    <div className={`min-h-screen bg-[#f8fafc] relative overflow-hidden ${terminalGrid} p-8 lg:p-12`}>
      {/* Background Blobs */}
      <div className="absolute top-[-10%] right-[-10%] size-[50%] bg-blue-400/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] size-[50%] bg-emerald-400/5 blur-[120px] rounded-full" />

      {/* Header Section */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="px-3 py-1 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] italic">Report Repository</div>
            <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] font-mono">ARCHIVE_READY</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.9]">
            Reports <span className="text-emerald-600 underline decoration-slate-900 decoration-8 underline-offset-8">Center</span>
          </h1>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-[0.4em] mt-8 flex items-center gap-3">
            <FileText className="size-4 text-emerald-600" />
            Formal Findings & Historical Audit Documentation
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowInitModal(true)}
            className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-xl transition-all shadow-lg"
          >
            <Plus className="size-4" />
            Initialize New Report
          </button>
        </div>
      </div>

      {/* KPI Matrix */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {[
          { id: 'final', label: 'Finalized Reports', value: `${120 + reportsList.filter(r => r.status === 'final').length}`, icon: ShieldCheck, color: 'emerald', sub: 'AUDIT_COMPLETE', glow: 'from-emerald-500/20 to-transparent' },
          { id: 'draft', label: 'Pending Review', value: `${15 + reportsList.filter(r => r.status === 'draft').length}`, icon: FileText, color: 'blue', sub: 'AWAITING_SIGN', glow: 'from-blue-500/20 to-transparent' },
          { id: 'scheduled', label: 'Scheduled Audits', value: `${38 + reportsList.filter(r => r.status === 'scheduled').length}`, icon: Calendar, color: 'orange', sub: 'UPCOMING_Q2', glow: 'from-orange-500/20 to-transparent' },
        ].map((kpi, idx) => (
          <div 
            key={idx} 
            onClick={() => setActiveTab(activeTab === kpi.id ? 'all' : kpi.id as any)}
            className={`${glassCard} p-8 group relative overflow-hidden transition-all duration-500 hover:translate-y-[-4px] hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] cursor-pointer border-2
              ${activeTab === kpi.id 
                ? (kpi.id === 'final' ? 'border-emerald-500 bg-emerald-50/20 shadow-md' : kpi.id === 'draft' ? 'border-blue-500 bg-blue-50/20 shadow-md' : 'border-orange-500 bg-orange-50/20 shadow-md') 
                : 'border-white/40'}`}
          >
            {/* Background Glow */}
            <div className={`absolute -right-20 -bottom-20 size-64 bg-gradient-radial ${kpi.glow} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
            
            {/* Refined Watermark */}
            <div className={`absolute -right-4 -bottom-6 size-40 text-slate-900/[0.03] ${getColorClass(kpi.color, 'hoverScaleText500_06')} group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700`}>
              <kpi.icon className="size-full" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className={`p-4 bg-white shadow-sm border border-slate-100 rounded-2xl group-hover:${getColorClass(kpi.color, 'border200')} transition-colors`}>
                  <kpi.icon className={`size-6 ${getColorClass(kpi.color, 'text600')}`} />
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2">
                    <div className={`size-1.5 rounded-full ${getColorClass(kpi.color, 'bg500')} animate-pulse`} />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] font-mono">{kpi.sub}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">{kpi.label}</div>
              <div className={`text-6xl font-black text-slate-900 italic tracking-tighter uppercase group-hover:${getColorClass(kpi.color, 'text600')} transition-colors duration-500`}>
                {kpi.value}
              </div>
              
              <div className="mt-6 flex items-center gap-2">
                <div className="h-1 w-12 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${getColorClass(kpi.color, 'bg500')} w-2/3`} />
                </div>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic">Node Status: Active</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reports Table Section */}
      <div className={`relative z-10 ${glassCard} mb-12`}>
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1 relative max-w-xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="SEARCH_REPORTS..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-14 pr-8 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
            />
          </div>
          <button 
            onClick={() => setShowFilterPanel(true)}
            className={`flex items-center gap-2 px-6 py-4 bg-white border rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-xl transition-all
              ${(filterCat !== 'all' || filterRisk !== 'all' || activeTab !== 'all') ? 'border-emerald-500 text-emerald-600 bg-emerald-50/10' : 'border-slate-200'}`}
          >
            <Filter className="size-4" />
            Advanced Filters {(filterCat !== 'all' || filterRisk !== 'all' || activeTab !== 'all') ? '•' : ''}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/30 border-b border-slate-100">
              <tr>
                <th className="px-8 py-6 text-left">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Report Identifier <ArrowUpDown className="size-3" />
                  </div>
                </th>
                <th className="px-8 py-6 text-left">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Audit Category
                  </div>
                </th>
                <th className="px-8 py-6 text-left">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Taxpayer Entity
                  </div>
                </th>
                <th className="px-8 py-6 text-left">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Completion Node
                  </div>
                </th>
                <th className="px-8 py-6 text-left">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Risk Outcome
                  </div>
                </th>
                <th className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Actions
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {filteredReports.map((report, i) => (
                <tr key={i} className="group hover:bg-slate-50/80 transition-all duration-300">
                  <td className="px-8 py-6">
                    <span className="text-sm font-black text-slate-900 font-mono tracking-tighter italic uppercase group-hover:text-emerald-600 transition-colors">
                      {report.id}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-black text-slate-900 uppercase italic tracking-tighter">{report.cat}</div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">PROTOCOL_7_SIG</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-black text-slate-700 uppercase italic tracking-tighter">{report.name}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <Clock className="size-3 text-slate-400" />
                      <span className="text-sm font-black text-slate-500 font-mono italic tracking-tighter uppercase">{report.date}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border
                      ${report.risk === 'Critical' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                        report.risk === 'High' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                        'bg-emerald-50 text-emerald-600 border-emerald-100'}`}
                    >
                      {report.risk}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => { setSelectedReportId(report.id); setShowExamineModal(true); }}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                      >
                        <Eye className="size-3" />
                        Examine
                      </button>
                      <button 
                        onClick={() => toast.success('Download Ready', { description: `${report.id} downloading...` })}
                        className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl hover:text-slate-700 transition-colors"
                      >
                        <Download className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-16 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    No reports match your filters or search terms.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Intelligence Brief Section */}
      <div className="relative group bg-slate-950 p-12 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="absolute -right-16 -top-16 size-64 text-emerald-500/10 group-hover:scale-125 transition-transform duration-700">
          <Globe className="size-full" />
        </div>
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-500/20 rounded-2xl border border-emerald-500/30">
                <Zap className="size-6 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Automated Risk Summaries</h3>
            </div>
            <p className="text-lg text-slate-400 font-medium leading-relaxed mb-8">
              Generate AI-powered intelligence briefs from multiple audit cases to identify regional or sectoral trends with 99.8% precision.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-emerald-500" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">REGIONAL_SCAN</span>
              </div>
              <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-emerald-500" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">SECTOR_PARITY</span>
              </div>
            </div>
          </div>
          <button 
            onClick={startBriefGeneration}
            className="w-full lg:w-auto px-10 py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-emerald-900/40 flex items-center justify-center gap-3"
          >
            <Crosshair className="size-5" />
            Generate Intelligence Brief
          </button>
        </div>
      </div>

      {/* Initialize New Report Modal */}
      {showInitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setShowInitModal(false)} />
          <form onSubmit={handleInitReport} className="relative bg-white rounded-xl p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] w-full max-w-md animate-in zoom-in-95 duration-300">
            <button type="button" onClick={() => setShowInitModal(false)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-xl"><X className="size-4" /></button>
            <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-2 flex items-center gap-2">
              <Plus className="size-6 text-emerald-600" />
              Initialize Report
            </h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono mb-8">Create a new report profile</p>
            
            <div className="space-y-6 mb-8">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Entity Name</label>
                <input
                  type="text"
                  placeholder="E.G. GLOBAL INC"
                  value={newRepName}
                  onChange={(e) => setNewRepName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-wider text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Audit Category</label>
                <select
                  value={newRepCat}
                  onChange={(e) => setNewRepCat(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-wider text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {['Forensic Audit', 'Routine Review', 'Fraud Investigation', 'Sectoral Audit', 'Compliance Audit', 'Risk Assessment', 'Tax Investigation'].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Risk Outcome</label>
                  <select
                    value={newRepRisk}
                    onChange={(e) => setNewRepRisk(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-wider text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {['Low', 'Medium', 'High', 'Critical'].map(risk => (
                      <option key={risk} value={risk}>{risk}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Status</label>
                  <select
                    value={newRepStatus}
                    onChange={(e) => setNewRepStatus(e.target.value as any)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-wider text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="final">Finalized</option>
                    <option value="draft">Pending Review</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Findings / Notes</label>
                <textarea
                  placeholder="ENTER_REPORT_NOTES..."
                  value={newRepNotes}
                  onChange={(e) => setNewRepNotes(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-mono uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-100">
              Initialize Report Node
            </button>
          </form>
        </div>
      )}

      {/* Advanced Filters Panel */}
      {showFilterPanel && (
        <div className="fixed inset-0 z-50 flex animate-in fade-in duration-200">
          <div className="flex-1 bg-slate-950/40 backdrop-blur-sm" onClick={() => setShowFilterPanel(false)} />
          <div className="w-96 bg-white shadow-2xl p-8 flex flex-col gap-6 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tighter">Filter Reports</h3>
              <button onClick={() => setShowFilterPanel(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X className="size-4" /></button>
            </div>
            
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Category</div>
              <select
                value={filterCat}
                onChange={(e) => setFilterCat(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-wider text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Categories</option>
                {['Forensic Audit', 'Routine Review', 'Fraud Investigation', 'Sectoral Audit', 'Compliance Audit', 'Risk Assessment', 'Tax Investigation'].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Risk Outcome</div>
              <div className="flex flex-wrap gap-2">
                {['all', 'Low', 'Medium', 'High', 'Critical'].map(risk => (
                  <button
                    key={risk}
                    type="button"
                    onClick={() => setFilterRisk(risk)}
                    className={`py-2 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all
                      ${filterRisk === risk 
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' 
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
                  >
                    {risk}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Status Node Filter</div>
              <div className="flex flex-wrap gap-2">
                {['all', 'final', 'draft', 'scheduled'].map(status => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setActiveTab(status as any)}
                    className={`py-2 px-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all
                      ${activeTab === status 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
                  >
                    {status === 'all' ? 'All Statuses' : status === 'draft' ? 'Pending Review' : status}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => { setFilterCat('all'); setFilterRisk('all'); setActiveTab('all'); setShowFilterPanel(false); }}
              className="mt-auto py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      )}

      {/* Examine Report Modal */}
      {showExamineModal && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm" onClick={() => { setShowExamineModal(false); setSelectedReportId(null); }} />
          <div className="relative bg-white rounded-2xl p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] w-full max-w-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
            <button onClick={() => { setShowExamineModal(false); setSelectedReportId(null); }} className="absolute top-8 right-8 p-2 hover:bg-slate-100 rounded-xl"><X className="size-4" /></button>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 bg-slate-900 text-white rounded-full text-[9px] font-black uppercase tracking-[0.2em] italic">Report Node Detail</div>
              <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] font-mono">{selectedReport.id}</span>
            </div>

            <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter mb-8 decoration-emerald-500 decoration-4 underline underline-offset-4">
              {selectedReport.name}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Audit Category</div>
                <div className="text-sm font-black text-slate-900 uppercase tracking-tight">{selectedReport.cat}</div>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Risk Outcome Telemetry</div>
                <span className={`inline-flex px-3 py-1 mt-1 rounded-lg text-[9px] font-black uppercase tracking-widest border
                  ${selectedReport.risk === 'Critical' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                    selectedReport.risk === 'High' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                    'bg-emerald-50 text-emerald-600 border-emerald-100'}`}
                >
                  {selectedReport.risk} RISK
                </span>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Completion Node Date</div>
                <div className="text-sm font-black text-slate-700 font-mono">{selectedReport.date}</div>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Database status</div>
                <div className="text-sm font-black text-slate-700 uppercase tracking-tight">{selectedReport.status === 'final' ? 'Finalized' : selectedReport.status === 'draft' ? 'Pending Review' : 'Scheduled'}</div>
              </div>
            </div>

            <div className="mb-8">
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Findings Summary & Notes</div>
              <div className="p-5 bg-slate-950 text-emerald-400 font-mono text-[11px] rounded-2xl border border-white/5 uppercase leading-relaxed">
                {selectedReport.notes}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-emerald-600" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Digitally Signed by Lead Auditor</span>
              </div>
              <button 
                onClick={() => { toast.success('Download Initiated', { description: `${selectedReport.id} PDF document downloading...` }); }}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md"
              >
                <Download className="size-3.5" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Brief Generator Modal */}
      {showBriefModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-sm" onClick={() => { if (!isGeneratingBrief || briefProgress === 100) setShowBriefModal(false); }} />
          <div className="relative bg-slate-950 border border-white/10 rounded-2xl p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] w-full max-w-xl animate-in zoom-in-95 duration-300 text-white">
            <button 
              disabled={isGeneratingBrief && briefProgress < 100}
              onClick={() => { setShowBriefModal(false); setIsGeneratingBrief(false); }} 
              className="absolute top-8 right-8 p-2 text-slate-400 hover:bg-white/5 rounded-xl disabled:opacity-30"
            >
              <X className="size-4" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <Zap className="size-6 text-emerald-400 animate-bounce" />
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">AI Intelligence Scanner</h3>
            </div>

            {briefProgress < 100 ? (
              <div className="py-12 text-center">
                <div className="text-sm font-mono text-slate-400 uppercase tracking-[0.2em] mb-6 animate-pulse">Running sectoral scans & trend compilation...</div>
                <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden max-w-md mx-auto p-0.5 border border-white/10">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-300" style={{ width: `${briefProgress}%` }} />
                </div>
                <div className="text-lg font-mono font-black mt-4 text-emerald-400">{briefProgress}%</div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-[11px] text-emerald-400 font-bold uppercase tracking-wide">
                  Analysis complete. Precision rating: 99.8%. Cross-referenced 124 records.
                </div>
                <div>
                  <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 font-mono">Synthesized Intelligence Brief</div>
                  <div className="p-6 bg-white/5 border border-white/10 rounded-3xl font-mono text-[11px] uppercase text-slate-200 leading-relaxed max-h-60 overflow-y-auto">
                    [Summary Node 01]: High-concentration VAT offset irregularities identified under the Transport & Logistics sector in South-West regional clusters. Variance threshold exceeded by 18.2%.<br/><br/>
                    [Summary Node 02]: Temporal anomaly vectors detected in corporate income declarations indicate system-wide round-number patterns in energy sector entities.<br/><br/>
                    [Recommendation]: Initiate surgical audits on top 5 outlying logistics taxpayers in Littoral & Centre regions.
                  </div>
                </div>
                <button 
                  onClick={() => {
                    toast.success('Report Exported', { description: 'Intelligence brief exported as PDF report.' });
                    setShowBriefModal(false);
                  }}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                >
                  <Download className="size-4" />
                  Export Scan Report
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
