import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { 
  Search, Eye, Filter, Download, ArrowUpDown, 
  AlertTriangle, ShieldCheck, Activity, Globe,
  MoreHorizontal, ChevronRight, ChevronLeft, FileText, X,
  FileSpreadsheet, SlidersHorizontal, CheckCircle, Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { useMockData } from '../../contexts/MockDataContext';
import { supabase } from '../../lib/supabase';
import { AuditCase } from '../../types';

const ITEMS_PER_PAGE = 6;

function mapAuditCase(r: any): AuditCase {
  return { id: r.id, taxpayerId: r.taxpayer_id, caseNumber: r.case_number, status: r.status, priority: r.priority, assignedTo: r.assigned_to, openedDate: r.opened_date, closedDate: r.closed_date, findings: r.findings, riskScore: r.risk_score };
}

export default function AuditCaseList() {
  const navigate = useNavigate();
  const { taxpayers, users } = useMockData();
  const [cases, setCases] = useState<AuditCase[]>([]);

  useEffect(() => {
    supabase.from('audit_cases').select('*').then(({ data }) => {
      if (data) setCases(data.map(mapAuditCase));
    });
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  
  // Modals visibility state
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  
  // Form states for modals
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [escalationDept, setEscalationDept] = useState('Senior Auditor Review');
  const [escalationPriority, setEscalationPriority] = useState<'critical' | 'high'>('critical');
  const [assignedAuditorId, setAssignedAuditorId] = useState('');
  const [closureReason, setClosureReason] = useState('Investigation Complete - No Violation');
  const [closureNotes, setClosureNotes] = useState('');

  const [activeKebab, setActiveKebab] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<'caseNumber' | 'riskScore'>('caseNumber');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [exportFormat, setExportFormat] = useState('csv');

  React.useEffect(() => {
    if (!activeKebab) return;
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.kebab-container')) {
        setActiveKebab(null);
      }
    };
    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, [activeKebab]);

  const glassCard = 'bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] overflow-hidden';
  const terminalGrid = "bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:30px_30px]";

  const selectedCase = cases.find(c => c.id === selectedCaseId);

  const filtered = cases.filter(c => {
    const taxpayer = taxpayers.find(t => t.id === c.taxpayerId);
    const matchSearch = c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      taxpayer?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    const matchPriority = filterPriority === 'all' || c.priority === filterPriority;
    return matchSearch && matchStatus && matchPriority;
  }).sort((a, b) => {
    const val = sortField === 'riskScore'
      ? (sortDir === 'asc' ? a.riskScore - b.riskScore : b.riskScore - a.riskScore)
      : (sortDir === 'asc' ? a.caseNumber.localeCompare(b.caseNumber) : b.caseNumber.localeCompare(a.caseNumber));
    return val;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSort = (field: 'caseNumber' | 'riskScore') => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const handleExport = (e: React.FormEvent) => {
    e.preventDefault();
    setShowExportModal(false);
    toast.success('Export Initiated', { description: `${filtered.length} cases exported as ${exportFormat.toUpperCase()}.` });
  };

  const handleKebabAction = (action: string, caseId: string) => {
    setActiveKebab(null);
    if (action === 'view') {
      navigate(`/auditor/cases/${caseId}`);
    } else if (action === 'flag') {
      setSelectedCaseId(caseId);
      const currentCase = cases.find(c => c.id === caseId);
      setEscalationPriority(currentCase?.priority === 'critical' ? 'critical' : 'high');
      setShowEscalateModal(true);
    } else if (action === 'assign') {
      setSelectedCaseId(caseId);
      const currentCase = cases.find(c => c.id === caseId);
      const auditorUser = users.find(u => u.name === currentCase?.assignedTo);
      setAssignedAuditorId(auditorUser?.id || '');
      setShowReassignModal(true);
    } else if (action === 'close') {
      setSelectedCaseId(caseId);
      const currentCase = cases.find(c => c.id === caseId);
      setClosureReason(currentCase?.findings || 'Investigation Complete - No Violation');
      setClosureNotes('');
      setShowCloseModal(true);
    }
  };

  const handleConfirmEscalation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaseId) return;
    const targetCase = cases.find(c => c.id === selectedCaseId);
    if (targetCase) {
      targetCase.priority = escalationPriority;
      targetCase.status = 'flagged';
    }
    setCases([...cases]);
    setShowEscalateModal(false);
    setSelectedCaseId(null);
    toast.success('Case Escalated', {
      description: `Case priority escalated to ${escalationPriority.toUpperCase()} under ${escalationDept}.`
    });
  };

  const handleConfirmReassign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaseId) return;
    const auditor = users.find(u => u.id === assignedAuditorId);
    if (!auditor) {
      toast.error('Invalid Auditor Selected');
      return;
    }
    const targetCase = cases.find(c => c.id === selectedCaseId);
    if (targetCase) {
      targetCase.assignedTo = auditor.name;
    }
    setCases([...cases]);
    setShowReassignModal(false);
    setSelectedCaseId(null);
    toast.success('Auditor Reassigned', {
      description: `Case successfully assigned to ${auditor.name}.`
    });
  };

  const handleConfirmClose = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaseId) return;
    const targetCase = cases.find(c => c.id === selectedCaseId);
    if (targetCase) {
      targetCase.status = 'closed';
      targetCase.closedDate = new Date().toISOString().split('T')[0];
      targetCase.findings = closureNotes || closureReason;
    }
    setCases([...cases]);
    setShowCloseModal(false);
    setSelectedCaseId(null);
    toast.success('Case Closed', {
      description: `Case closed with reason: ${closureReason}.`
    });
  };

  return (
    <div className={`min-h-screen bg-[#f8fafc] relative overflow-hidden ${terminalGrid} p-8 lg:p-12`}>
      {/* Background Blobs */}
      <div className="absolute top-[-10%] right-[-10%] size-[50%] bg-blue-400/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] size-[50%] bg-emerald-400/5 blur-[120px] rounded-full" />

      {/* Filter Slide Panel */}
      {showFilterPanel && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-slate-950/40 backdrop-blur-sm" onClick={() => setShowFilterPanel(false)} />
          <div className="w-96 bg-white shadow-2xl p-8 flex flex-col gap-6 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tighter">Filter Cases</h3>
              <button onClick={() => setShowFilterPanel(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X className="size-4" /></button>
            </div>
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Status</div>
              {['all', 'flagged', 'in_progress', 'open', 'closed'].map(s => (
                <label key={s} className="flex items-center gap-3 py-2 cursor-pointer hover:text-blue-600 transition-colors">
                  <input type="radio" name="status" value={s} checked={filterStatus === s} onChange={() => setFilterStatus(s)} className="accent-blue-600" />
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-700">{s.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Priority</div>
              {['all', 'critical', 'high', 'medium', 'low'].map(p => (
                <label key={p} className="flex items-center gap-3 py-2 cursor-pointer hover:text-blue-600 transition-colors">
                  <input type="radio" name="priority" value={p} checked={filterPriority === p} onChange={() => setFilterPriority(p)} className="accent-blue-600" />
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-700">{p}</span>
                </label>
              ))}
            </div>
            <button
              onClick={() => { setFilterStatus('all'); setFilterPriority('all'); setShowFilterPanel(false); setCurrentPage(1); }}
              className="mt-auto py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest"
            >
              Apply & Close
            </button>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setShowExportModal(false)} />
          <form onSubmit={handleExport} className="relative bg-white rounded-xl p-10 shadow-2xl w-full max-w-md animate-in zoom-in-90 duration-300">
            <button type="button" onClick={() => setShowExportModal(false)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-xl"><X className="size-4" /></button>
            <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-2">Export Registry</h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono mb-8">Export {filtered.length} filtered cases</p>
            <div className="space-y-4 mb-8">
              {[
                { value: 'csv', label: 'CSV Spreadsheet', icon: FileSpreadsheet },
                { value: 'pdf', label: 'PDF Report', icon: FileText },
                { value: 'json', label: 'JSON Data', icon: FileText },
              ].map(({ value, label, icon: Icon }) => (
                <label key={value} className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${exportFormat === value ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-blue-200'}`}>
                  <input type="radio" value={value} checked={exportFormat === value} onChange={() => setExportFormat(value)} className="sr-only" />
                  <Icon className={`size-5 ${exportFormat === value ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="text-sm font-black text-slate-900 uppercase tracking-wide">{label}</span>
                </label>
              ))}
            </div>
            <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
              Download Export
            </button>
          </form>
        </div>
      )}

      {/* Header Section */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="px-3 py-1 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] italic">Archive Terminal</div>
            <div className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] font-mono">REGISTRY_STREAM_01</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.9]">
            Registry <span className="text-blue-600 underline decoration-slate-900 decoration-8 underline-offset-8">Archive</span>
          </h1>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-[0.4em] mt-8 flex items-center gap-3">
            <FileText className="size-4 text-blue-600" />
            Comprehensive Forensic Case Repository
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="SEARCH_REGISTRY..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="pl-14 pr-8 py-4 bg-white/70 backdrop-blur-md border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
            />
          </div>
          <button 
            onClick={() => setShowFilterPanel(true)}
            className={`flex items-center gap-2 px-6 py-4 bg-white border rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-xl transition-all ${filterStatus !== 'all' || filterPriority !== 'all' ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-slate-200'}`}
          >
            <SlidersHorizontal className="size-4" />
            Filters {(filterStatus !== 'all' || filterPriority !== 'all') ? '•' : ''}
          </button>
          <button 
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-xl transition-all shadow-lg"
          >
            <Download className="size-4" />
            Export Data
          </button>
        </div>
      </div>

      {/* Main Registry Table */}
      <div className={`relative z-10 ${glassCard}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-6 text-left">
                  <button onClick={() => handleSort('caseNumber')} className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-slate-700 transition-colors">
                    Case Identifier <ArrowUpDown className={`size-3 ${sortField === 'caseNumber' ? 'text-blue-500' : ''}`} />
                  </button>
                </th>
                <th className="px-8 py-6 text-left">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Taxpayer Entity
                  </div>
                </th>
                <th className="px-8 py-6 text-left">
                  <button onClick={() => handleSort('riskScore')} className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-slate-700 transition-colors">
                    Risk Telemetry <ArrowUpDown className={`size-3 ${sortField === 'riskScore' ? 'text-blue-500' : ''}`} />
                  </button>
                </th>
                <th className="px-8 py-6 text-left">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Priority Node
                  </div>
                </th>
                <th className="px-8 py-6 text-left">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Protocol Status
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
              {paginated.map((auditCase) => {
                const taxpayer = taxpayers.find(t => t.id === auditCase.taxpayerId);
                const isCritical = auditCase.riskScore > 75;
                
                return (
                  <tr key={auditCase.id} className="group hover:bg-slate-50/80 transition-all duration-300">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`size-10 rounded-xl flex items-center justify-center text-[11px] font-black font-mono shadow-sm
                          ${isCritical ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-slate-900 text-white'}`}
                        >
                          {auditCase.caseNumber.slice(-2)}
                        </div>
                        <Link to={`/auditor/cases/${auditCase.id}`} className="text-sm font-black text-slate-900 font-mono tracking-tighter italic uppercase group-hover:text-blue-600 transition-colors">
                          {auditCase.caseNumber}
                        </Link>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-black text-slate-900 uppercase italic tracking-tighter">{taxpayer?.name}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {auditCase.taxpayerId.slice(0, 8)}...</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${auditCase.riskScore > 70 ? 'bg-rose-500' : auditCase.riskScore > 40 ? 'bg-orange-500' : 'bg-emerald-500'}`}
                            style={{ width: `${auditCase.riskScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-black text-slate-900 font-mono italic tracking-tighter">{auditCase.riskScore}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border
                        ${auditCase.priority === 'critical' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                          auditCase.priority === 'high' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                          'bg-slate-100 text-slate-500 border-slate-200'}`}
                      >
                        {auditCase.priority}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className={`size-1.5 rounded-full animate-pulse
                          ${auditCase.status === 'flagged' ? 'bg-rose-500' : 
                            auditCase.status === 'in_progress' ? 'bg-orange-500' : 
                            auditCase.status === 'closed' ? 'bg-emerald-500' : 'bg-blue-500'}`} 
                        />
                        <span className={`text-[10px] font-black uppercase tracking-widest
                          ${auditCase.status === 'flagged' ? 'text-rose-600' : 
                            auditCase.status === 'in_progress' ? 'text-orange-600' : 
                            auditCase.status === 'closed' ? 'text-emerald-600' : 'text-blue-600'}`}
                        >
                          {auditCase.status.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          to={`/auditor/cases/${auditCase.id}`} 
                          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                        >
                          <Eye className="size-3" />
                          Examine
                        </Link>
                        <div className="relative kebab-container">
                          <button 
                            onClick={() => setActiveKebab(activeKebab === auditCase.id ? null : auditCase.id)}
                            className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors"
                          >
                            <MoreHorizontal className="size-4" />
                          </button>
                          {activeKebab === auditCase.id && (
                            <div className="absolute right-0 top-10 z-40 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden w-44 animate-in fade-in zoom-in-95 duration-150">
                              {[
                                { action: 'view', label: 'View Details', icon: Eye },
                                { action: 'flag', label: 'Escalate Flag', icon: AlertTriangle },
                                { action: 'assign', label: 'Reassign', icon: Activity },
                                { action: 'close', label: 'Close Case', icon: CheckCircle },
                              ].map(({ action, label, icon: Icon }) => (
                                <button 
                                  key={action}
                                  onClick={() => handleKebabAction(action, auditCase.id)}
                                  className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-wide text-slate-700 hover:bg-slate-50 transition-colors text-left"
                                >
                                  <Icon className="size-3.5" />
                                  {label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-16 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    No cases match your search or filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer / Pagination */}
        <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Showing <span className="text-slate-900">{(currentPage - 1) * ITEMS_PER_PAGE + 1}{"\u2013"}{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}</span> of <span className="text-slate-900">{filtered.length}</span> active forensic nodes
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="size-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="size-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button 
                key={page} 
                onClick={() => setCurrentPage(page)}
                className={`size-8 rounded-lg flex items-center justify-center text-[10px] font-black
                  ${page === currentPage ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-400 hover:border-blue-400 hover:text-blue-600'}`}
              >
                {page}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="size-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Escalate Case Modal */}
      {showEscalateModal && selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm" onClick={() => { setShowEscalateModal(false); setSelectedCaseId(null); }} />
          <form onSubmit={handleConfirmEscalation} className="relative bg-white rounded-xl p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] w-full max-w-md animate-in zoom-in-95 duration-300">
            <button type="button" onClick={() => { setShowEscalateModal(false); setSelectedCaseId(null); }} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-xl"><X className="size-4" /></button>
            <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-2 flex items-center gap-2">
              <AlertTriangle className="size-6 text-orange-500 animate-pulse" />
              Escalate Case
            </h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono mb-8">Case: {selectedCase.caseNumber}</p>
            
            <div className="space-y-6 mb-8">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Escalation Priority</label>
                <div className="flex gap-4">
                  {['critical', 'high'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setEscalationPriority(p as 'critical' | 'high')}
                      className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-wider border-2 transition-all
                        ${escalationPriority === p 
                          ? 'border-orange-500 bg-orange-50 text-orange-600' 
                          : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Target Department</label>
                <select
                  value={escalationDept}
                  onChange={(e) => setEscalationDept(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-wider text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {['Senior Auditor Review', 'Legal Department', 'Tax Authority Oversight', 'Criminal Investigation Unit'].map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-orange-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-700 transition-all shadow-lg shadow-orange-100">
              Confirm Escalation
            </button>
          </form>
        </div>
      )}

      {/* Reassign Case Modal */}
      {showReassignModal && selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm" onClick={() => { setShowReassignModal(false); setSelectedCaseId(null); }} />
          <form onSubmit={handleConfirmReassign} className="relative bg-white rounded-xl p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] w-full max-w-md animate-in zoom-in-95 duration-300">
            <button type="button" onClick={() => { setShowReassignModal(false); setSelectedCaseId(null); }} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-xl"><X className="size-4" /></button>
            <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-2 flex items-center gap-2">
              <Activity className="size-6 text-blue-600" />
              Reassign Case
            </h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono mb-8">Case: {selectedCase.caseNumber}</p>
            
            <div className="space-y-6 mb-8">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Select Auditor</label>
                <select
                  value={assignedAuditorId}
                  onChange={(e) => setAssignedAuditorId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-wider text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Assignee...</option>
                  {users
                    .filter(u => u.role === 'auditor' || u.role === 'tax_admin')
                    .map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.role.replace('_', ' ')})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-100">
              Reassign Case
            </button>
          </form>
        </div>
      )}

      {/* Close Case Modal */}
      {showCloseModal && selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm" onClick={() => { setShowCloseModal(false); setSelectedCaseId(null); }} />
          <form onSubmit={handleConfirmClose} className="relative bg-white rounded-xl p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] w-full max-w-md animate-in zoom-in-95 duration-300">
            <button type="button" onClick={() => { setShowCloseModal(false); setSelectedCaseId(null); }} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-xl"><X className="size-4" /></button>
            <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-2 flex items-center gap-2">
              <CheckCircle className="size-6 text-rose-500" />
              Close Case
            </h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono mb-4">Case: {selectedCase.caseNumber}</p>
            
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl mb-6">
              <p className="text-xs text-rose-700 font-bold">This action will mark the case as resolved/closed and set a final resolution in the registry vault.</p>
            </div>

            <div className="space-y-6 mb-8">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Resolution Reason</label>
                <select
                  value={closureReason}
                  onChange={(e) => setClosureReason(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-wider text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {['Investigation Complete - No Violation', 'Settled Out of Court', 'Insufficient Evidence', 'Transferred to Prosecution'].map(reason => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Findings / Notes</label>
                <textarea
                  placeholder="ENTER_FINAL_FINDINGS..."
                  value={closureNotes}
                  onChange={(e) => setClosureNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-mono uppercase focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg shadow-rose-100">
              Archive & Close Case
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
