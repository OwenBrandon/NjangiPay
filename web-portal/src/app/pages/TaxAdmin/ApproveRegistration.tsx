import React, { useState, useMemo } from 'react';
import { 
  CheckCircle, XCircle, Eye, ArrowLeft, Search, Filter, 
  UserPlus, History, ShieldCheck, Zap, Download, 
  MapPin, Clock, ArrowRight, X, AlertCircle, FileText
} from 'lucide-react';
import { useNavigate, Link } from 'react-router';
import { useMockData } from '../../contexts/MockDataContext';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import type { Taxpayer } from '../../types';

export default function ApproveRegistration() {
  const navigate = useNavigate();
  const { taxpayers, updateTaxpayer } = useMockData();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Pending');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTaxpayer, setSelectedTaxpayer] = useState<Taxpayer | null>(null);

  const pendingTaxpayers = taxpayers.filter(t => t.status === 'pending');
  const criticalCount = pendingTaxpayers.filter(t => t.taxType.includes('VAT') || t.taxType.includes('CIT')).length;

  const tabTotal = useMemo(() => {
    if (activeTab === 'Pending') return taxpayers.filter(t => t.status === 'pending').length;
    if (activeTab === 'In-Review') return taxpayers.filter(t => t.status === 'in_review').length;
    if (activeTab === 'Actioned') return taxpayers.filter(t => t.status === 'active' || t.status === 'suspended').length;
    return taxpayers.length;
  }, [activeTab, taxpayers]);

  const glassCard = 'bg-blue-50/40 backdrop-blur-3xl rounded-2xl border border-white/60 shadow-2xl shadow-blue-900/5 overflow-hidden';

  // Real-time Filtering Logic
  const filteredRequests = useMemo(() => {
    return taxpayers.filter(request => {
      const matchesSearch = 
        request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.tin.includes(searchTerm) ||
        (request.businessName && request.businessName.toLowerCase().includes(searchTerm.toLowerCase()));
      
      let matchesTab = false;
      if (activeTab === 'Pending') {
        matchesTab = request.status === 'pending';
      } else if (activeTab === 'In-Review') {
        matchesTab = request.status === 'in_review';
      } else if (activeTab === 'Actioned') {
        matchesTab = request.status === 'active' || request.status === 'suspended';
      } else {
        matchesTab = true; // All
      }
      
      return matchesSearch && matchesTab;
    });
  }, [searchTerm, activeTab, taxpayers]);

  const handleApprove = (taxpayer: any) => {
    updateTaxpayer({ ...taxpayer, status: 'active' });
    toast.success(`Application Approved`, { description: `${taxpayer.name} is now an active node.` });
  };

  const handleReject = (taxpayer: any) => {
    updateTaxpayer({ ...taxpayer, status: 'suspended' });
    toast.error(`Application Rejected`, { description: `${taxpayer.name} has been suspended.` });
  };

  const handleSetInReview = (taxpayer: any) => {
    updateTaxpayer({ ...taxpayer, status: 'in_review' });
    toast.info(`Application Under Review`, { description: `${taxpayer.name} has been set to in review status.` });
  };

  const handleApproveAll = () => {
    if (pendingTaxpayers.length === 0) return toast.info('No applications to approve');
    pendingTaxpayers.forEach(t => updateTaxpayer({ ...t, status: 'active' }));
    toast.success(`Batch Protocol Executed`, { description: `Approved ${pendingTaxpayers.length} nodes.` });
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] relative overflow-hidden">
      {/* Dynamic Vibrant Background Blobs */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[25%] right-[5%] w-[25%] h-[25%] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="p-6 lg:p-10 space-y-12 relative z-10">
        {/* Surgical Command Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/tax-admin/taxpayers')}
                className="group flex items-center gap-2 p-2 bg-white/80 hover:bg-white rounded-xl border border-slate-200 transition-all shadow-sm"
              >
                <ArrowLeft className="size-4 text-slate-500 group-hover:-translate-x-1 transition-transform" />
              </button>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-amber-100/50 border border-amber-200 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Review Queue</span>
                <span className="text-slate-400">•</span>
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Priority 1 Protocol</span>
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">Approve Registrations</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => toast.success('Batch Exported (CSV)')} className="flex items-center gap-2 px-7 py-3.5 bg-white border border-slate-200 text-slate-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
              <Download className="size-4" />
              Export Batch
            </button>
            <button onClick={handleApproveAll} className="flex items-center gap-2 px-7 py-3.5 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-200/50">
              <CheckCircle className="size-4" />
              Approve All Batch
            </button>
          </div>
        </div>

        {/* Premium KPI Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Pending Requests', value: pendingTaxpayers.length, subLabel: 'CRITICAL QUEUE NODES', icon: FileText, color: 'blue' },
            { label: 'High Priority', value: criticalCount, subLabel: 'URGENT REVIEW NODES', icon: AlertCircle, color: 'amber' },
            { label: 'Avg Review Time', value: '4.2h', subLabel: 'TEMPORAL EFFICIENCY', icon: Clock, color: 'sky' },
            { label: 'System Capacity', value: '94%', subLabel: 'OPTIMAL PROCESSING', icon: ShieldCheck, color: 'purple' },
          ].map((kpi, i) => (
            <div key={i} className={`group relative bg-white border border-slate-200/60 rounded-2xl p-10 transition-all duration-500 overflow-hidden cursor-default`}>
              {/* Large Background Icon Node */}
              <kpi.icon className="absolute right-[-15%] bottom-[-15%] size-48 text-slate-100/50 group-hover:scale-110 transition-transform duration-1000" strokeWidth={1} />
              
              <div className="relative z-10 flex flex-col gap-8">
                <div className="flex items-center gap-6">
                  <div 
                    className="p-4 rounded-xl shadow-xl shadow-slate-900/10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500"
                    style={{ background: '#0d1929', color: '#38bdf8' }}
                  >
                    <kpi.icon className="size-6" strokeWidth={2.5} />
                  </div>
                  <div className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">{kpi.label}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-6xl font-black text-slate-950 tracking-tighter">{kpi.value}</div>
                  <div className="text-[10px] font-black text-blue-500 italic uppercase tracking-wider">{kpi.subLabel}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Review Terminal */}
        <div className="bg-white rounded-2xl p-3 shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          {/* Advanced Search & Results Control */}
          <div className="px-8 py-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="relative flex-1 max-w-xl group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
                <Search className="size-5 text-slate-400 group-focus-within:text-blue-500 transition-all" />
                <div className="w-px h-4 bg-slate-200 group-focus-within:bg-blue-200 transition-all" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Identity Node, TIN, or Business..."
                className="w-full pl-20 pr-8 py-5 bg-white border-2 border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-400 focus:border-blue-500 focus:shadow-[0_0_30px_-5px_rgba(59,130,246,0.15)] outline-none transition-all shadow-sm"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-full flex items-center gap-2 shadow-sm">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing</span>
                <span className="text-[10px] font-black text-lime-500 uppercase tracking-widest">{filteredRequests.length}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">of</span>
                <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{tabTotal}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nodes</span>
              </div>
              
              <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-100">
                {['Pending', 'In-Review', 'Actioned', 'All'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setActiveTab(status)}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeTab === status 
                      ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table Surface */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-10 py-5 text-left text-[11px] font-black italic text-slate-800 uppercase tracking-[0.2em]">Registration Entity</th>
                  <th className="px-10 py-5 text-left text-[11px] font-black italic text-slate-800 uppercase tracking-[0.2em]">Sector Hub</th>
                  <th className="px-10 py-5 text-left text-[11px] font-black italic text-slate-800 uppercase tracking-[0.2em]">Regional Port</th>
                  <th className="px-10 py-5 text-left text-[11px] font-black italic text-slate-800 uppercase tracking-[0.2em]">Application Date</th>
                  <th className="px-10 py-5 text-right text-[11px] font-black italic text-slate-800 uppercase tracking-[0.2em]">Review Protocols</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/30">
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request) => {
                    const initials = request.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                    
                    return (
                      <tr key={request.id} className="hover:bg-slate-50/50 transition-all group relative border-b border-slate-100 last:border-0">
                        <td className="px-10 py-6 relative">
                          <div className="flex items-center gap-5">
                            <div 
                              className="size-12 rounded-2xl flex items-center justify-center text-[11px] font-black text-slate-600 bg-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 group-hover:rotate-6 shadow-sm"
                            >
                              {initials}
                            </div>
                            <div>
                              <div className="flex items-center gap-3">
                                <div className="text-base font-black text-slate-900 tracking-tight leading-tight">{request.name}</div>
                                <span className={`px-2 py-0.5 border rounded text-[8px] font-mono font-black ${
                                  request.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200/60' :
                                  request.status === 'in_review' ? 'bg-blue-50 text-blue-700 border-blue-200/60' :
                                  request.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' :
                                  'bg-rose-50 text-rose-700 border-rose-200/60'
                                }`}>
                                  {request.status === 'pending' ? 'PENDING' :
                                   request.status === 'in_review' ? 'IN REVIEW' :
                                   request.status === 'active' ? 'APPROVED' : 'REJECTED'}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 italic">
                                TIN: {request.tin}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-12 py-5">
                          <div className="flex flex-wrap gap-2">
                            {request.taxType.map(type => (
                              <span key={type} className="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-[0.1em]">
                                {type}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-12 py-5">
                          <div className="flex items-center gap-3 text-xs font-black text-slate-700">
                            <div className="p-2 bg-blue-50/50 border border-blue-100/50 rounded-xl">
                              <MapPin className="size-3.5 text-blue-500" />
                            </div>
                            {request.region}
                          </div>
                        </td>
                        <td className="px-12 py-5">
                          <div className="flex items-center gap-2 text-xs font-black text-slate-600">
                            <Clock className="size-3.5 text-amber-500" />
                            {request.registrationDate}
                          </div>
                        </td>
                        <td className="px-12 py-5 text-right">
                          <div className="flex items-center justify-end gap-3 transition-all">
                            <button 
                              onClick={() => setSelectedTaxpayer(request)}
                              className="p-3 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-2xl transition-all shadow-sm border border-blue-100 hover:shadow-xl hover:shadow-blue-200/50"
                              title="Details"
                            >
                              <Eye className="size-5" />
                            </button>
                            <button 
                              onClick={() => handleApprove(request)}
                              className="p-3 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-2xl transition-all shadow-sm border border-blue-100 hover:shadow-xl hover:shadow-blue-200/50"
                              title="Approve"
                            >
                              <CheckCircle className="size-5" />
                            </button>
                            <button 
                              onClick={() => handleReject(request)}
                              className="p-3 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-2xl transition-all shadow-sm border border-rose-100 hover:shadow-xl hover:shadow-rose-200/50"
                              title="Reject"
                            >
                              <XCircle className="size-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-12 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 text-slate-300">
                          <History className="size-12" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Registry Clear</p>
                          <p className="text-xs text-slate-400 font-bold">No pending registrations require immediate protocol review.</p>
                        </div>
                        <button 
                          onClick={() => { setSearchTerm(''); setActiveTab('Pending'); }}
                          className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
                        >
                          Refresh Queue
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
                <span className="text-slate-900">QUEUE STATUS:</span>
                <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-800 shadow-sm font-mono">{filteredRequests.length} Nodes</span>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="px-8 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 hover:border-blue-500 hover:text-blue-600 transition-all shadow-lg shadow-slate-200 group flex items-center gap-3">
                Next Batch
                <ArrowRight className="size-4 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      {/* View Details Dialog */}
      <Dialog open={!!selectedTaxpayer} onOpenChange={(open) => !open && setSelectedTaxpayer(null)}>
        <DialogContent className="sm:max-w-2xl bg-white rounded-3xl p-0 overflow-hidden border-0 shadow-2xl">
          <DialogHeader className="px-8 pt-8 pb-4 bg-slate-50 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 border rounded-full text-[9px] font-black tracking-widest uppercase ${
                selectedTaxpayer && (
                  selectedTaxpayer.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200/60' :
                  selectedTaxpayer.status === 'in_review' ? 'bg-blue-50 text-blue-700 border-blue-200/60' :
                  selectedTaxpayer.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' :
                  'bg-rose-50 text-rose-700 border-rose-200/60'
                )
              }`}>
                {selectedTaxpayer && (
                  selectedTaxpayer.status === 'pending' ? 'PENDING' :
                  selectedTaxpayer.status === 'in_review' ? 'IN REVIEW' :
                  selectedTaxpayer.status === 'active' ? 'APPROVED' : 'REJECTED'
                )}
              </span>
              <span className="text-[10px] font-mono text-slate-400 font-black">ID: {selectedTaxpayer?.id}</span>
            </div>
            <DialogTitle className="text-2xl font-black text-slate-900 mt-3 flex items-center gap-3">
              <FileText className="size-6 text-blue-600" />
              Registration Details: {selectedTaxpayer?.name}
            </DialogTitle>
            <DialogDescription className="text-slate-500 font-bold mt-2 uppercase tracking-wider text-[10px]">
              CAC & Identity Node Verification Protocol
            </DialogDescription>
          </DialogHeader>

          {selectedTaxpayer && (
            <div className="p-8 space-y-6">
              {/* Profile Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Legal Name</span>
                  <div className="text-sm font-black text-slate-800">{selectedTaxpayer.name}</div>
                </div>
                {selectedTaxpayer.businessName && selectedTaxpayer.businessName !== selectedTaxpayer.name && (
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Business Name</span>
                    <div className="text-sm font-black text-slate-800">{selectedTaxpayer.businessName}</div>
                  </div>
                )}
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">TIN / Entity Reference</span>
                  <div className="text-sm font-black text-slate-800 font-mono">{selectedTaxpayer.tin}</div>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Email Address</span>
                  <div className="text-sm font-black text-slate-800">{selectedTaxpayer.email}</div>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Phone Number</span>
                  <div className="text-sm font-black text-slate-800 font-mono">{selectedTaxpayer.phone}</div>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl md:col-span-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Registered Address</span>
                  <div className="text-sm font-black text-slate-800">{selectedTaxpayer.address}</div>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Regional Port / Office</span>
                  <div className="text-sm font-black text-slate-800">{selectedTaxpayer.region}</div>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Registration Date</span>
                  <div className="text-sm font-black text-slate-800 font-mono">{selectedTaxpayer.registrationDate}</div>
                </div>
              </div>

              {/* Verified Documents */}
              <div className="space-y-3">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Identity Checks & CAC Parity</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg border border-emerald-200">
                        <ShieldCheck className="size-4 text-emerald-600" />
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-emerald-800 uppercase tracking-wide">CAC Certificate</div>
                        <div className="text-[9px] font-bold text-slate-500 font-mono">VERIFIED_SECURE</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg border border-emerald-200">
                        <ShieldCheck className="size-4 text-emerald-600" />
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-emerald-800 uppercase tracking-wide">Identity NIN check</div>
                        <div className="text-[9px] font-bold text-slate-500 font-mono">PASSED_MATCH</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tax Obligations */}
              <div className="space-y-3">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Requested Tax Channels</span>
                <div className="flex flex-wrap gap-2">
                  {selectedTaxpayer.taxType.map(type => (
                    <span key={type} className="px-4 py-2 bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-3 sm:justify-between items-center">
            <button
              onClick={() => setSelectedTaxpayer(null)}
              className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-colors"
            >
              Cancel
            </button>
            
            <div className="flex items-center gap-3">
              {selectedTaxpayer && selectedTaxpayer.status !== 'in_review' && (
                <button
                  onClick={() => {
                    handleSetInReview(selectedTaxpayer);
                    setSelectedTaxpayer(null);
                  }}
                  className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md shadow-amber-100"
                >
                  Send to Review
                </button>
              )}
              {selectedTaxpayer && selectedTaxpayer.status !== 'active' && (
                <button
                  onClick={() => {
                    handleApprove(selectedTaxpayer);
                    setSelectedTaxpayer(null);
                  }}
                  className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md shadow-emerald-100"
                >
                  Approve Node
                </button>
              )}
              {selectedTaxpayer && selectedTaxpayer.status !== 'suspended' && (
                <button
                  onClick={() => {
                    handleReject(selectedTaxpayer);
                    setSelectedTaxpayer(null);
                  }}
                  className="px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md shadow-rose-100"
                >
                  Reject Entity
                </button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
