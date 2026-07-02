import React, { useState, useMemo } from 'react';
import {
  CheckCircle, XCircle, Eye, ArrowLeft, Search,
  Building2, Globe, Clock, ShieldCheck, FileText,
  MapPin, AlertCircle, X
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useMockData } from '../../contexts/MockDataContext';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import type { Business } from '../../types';

export default function ApproveBusinesses() {
  const navigate = useNavigate();
  const { businesses, taxpayers, updateBusiness } = useMockData();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Pending');
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  const pendingBusinesses = businesses.filter(b => b.status === 'pending');
  const physicalCount = pendingBusinesses.filter(b => b.businessType === 'physical').length;
  const virtualCount = pendingBusinesses.filter(b => b.businessType === 'virtual').length;

  const getOwnerName = (taxpayerId: string) => {
    const tp = taxpayers.find(t => t.id === taxpayerId);
    return tp?.name || 'Unknown';
  };

  const getOwnerTin = (taxpayerId: string) => {
    const tp = taxpayers.find(t => t.id === taxpayerId);
    return tp?.tin || '';
  };

  const tabTotal = useMemo(() => {
    if (activeTab === 'Pending') return businesses.filter(b => b.status === 'pending').length;
    if (activeTab === 'In-Review') return businesses.filter(b => b.status === 'in_review').length;
    if (activeTab === 'Actioned') return businesses.filter(b => b.status === 'active' || b.status === 'suspended').length;
    return businesses.length;
  }, [activeTab, businesses]);

  const filteredBusinesses = useMemo(() => {
    return businesses.filter(b => {
      const ownerName = getOwnerName(b.taxpayerId);
      const matchesSearch =
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.tin && b.tin.includes(searchTerm)) ||
        (b.registrationNumber && b.registrationNumber.includes(searchTerm));

      let matchesTab = false;
      if (activeTab === 'Pending') matchesTab = b.status === 'pending';
      else if (activeTab === 'In-Review') matchesTab = b.status === 'in_review';
      else if (activeTab === 'Actioned') matchesTab = b.status === 'active' || b.status === 'suspended';
      else matchesTab = true;

      return matchesSearch && matchesTab;
    });
  }, [searchTerm, activeTab, businesses, taxpayers]);

  const handleApprove = (business: Business) => {
    updateBusiness({ ...business, status: 'active' });
    toast.success('Business Approved', { description: `${business.name} is now active.` });
    setSelectedBusiness(null);
  };

  const handleReject = (business: Business) => {
    updateBusiness({ ...business, status: 'suspended' });
    toast.error('Business Rejected', { description: `${business.name} has been rejected.` });
    setSelectedBusiness(null);
  };

  const handleSetInReview = (business: Business) => {
    updateBusiness({ ...business, status: 'in_review' });
    toast.info('Set to In-Review', { description: `${business.name} is now under review.` });
    setSelectedBusiness(null);
  };

  const handleApproveAll = () => {
    if (pendingBusinesses.length === 0) return toast.info('No pending businesses to approve');
    pendingBusinesses.forEach(b => updateBusiness({ ...b, status: 'active' }));
    toast.success('Batch Approved', { description: `Approved ${pendingBusinesses.length} businesses.` });
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-amber-50 text-amber-700 border-amber-200',
      in_review: 'bg-blue-50 text-blue-700 border-blue-200',
      active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      suspended: 'bg-red-50 text-red-700 border-red-200',
    };
    return styles[status] || 'bg-slate-50 text-slate-700 border-slate-200';
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] relative overflow-hidden">
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="p-6 lg:p-10 space-y-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/tax-admin/taxpayers')}
                className="group flex items-center gap-2 p-2 bg-white/80 hover:bg-white rounded-xl border border-slate-200 transition-all shadow-sm"
              >
                <ArrowLeft className="size-4 text-slate-500 group-hover:-translate-x-1 transition-transform" />
              </button>
              <span className="px-3 py-1 bg-indigo-100/50 border border-indigo-200 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Business Review</span>
              <span className="text-slate-400">{'•'}</span>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Registration Queue</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">Business Approvals</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={handleApproveAll} className="flex items-center gap-2 px-7 py-3.5 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-200/50">
              <CheckCircle className="size-4" />
              Approve All Pending
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Pending', value: pendingBusinesses.length, subLabel: 'Awaiting Review', icon: FileText, color: 'blue' },
            { label: 'Physical', value: physicalCount, subLabel: 'Location Verification', icon: Building2, color: 'amber' },
            { label: 'Virtual', value: virtualCount, subLabel: 'Document Verification', icon: Globe, color: 'sky' },
            { label: 'Total Registered', value: businesses.filter(b => b.status === 'active').length, subLabel: 'Active Businesses', icon: ShieldCheck, color: 'emerald' },
          ].map((kpi, i) => (
            <div key={i} className="group relative bg-white border border-slate-200/60 rounded-2xl p-10 transition-all duration-500 overflow-hidden cursor-default">
              <kpi.icon className="absolute right-[-15%] bottom-[-15%] size-48 text-slate-100/50 group-hover:scale-110 transition-transform duration-1000" strokeWidth={1} />
              <div className="relative z-10 flex flex-col gap-8">
                <div className="flex items-center gap-6">
                  <div className="p-4 rounded-xl shadow-xl shadow-slate-900/10" style={{ background: '#0d1929', color: '#38bdf8' }}>
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

        {/* Table */}
        <div className="bg-white rounded-2xl p-3 shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
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
                placeholder="Search business name, owner, TIN..."
                className="w-full pl-20 pr-8 py-5 bg-white border-2 border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-400 focus:border-blue-500 focus:shadow-[0_0_30px_-5px_rgba(59,130,246,0.15)] outline-none transition-all shadow-sm"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-full flex items-center gap-2 shadow-sm">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing</span>
                <span className="text-[10px] font-black text-lime-500 uppercase tracking-widest">{filteredBusinesses.length}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">of</span>
                <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{tabTotal}</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-100">
                {['Pending', 'In-Review', 'Actioned', 'All'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeTab === tab
                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-10 py-5 text-left text-[11px] font-black italic text-slate-800 uppercase tracking-[0.2em]">Business Name</th>
                  <th className="px-10 py-5 text-left text-[11px] font-black italic text-slate-800 uppercase tracking-[0.2em]">Type</th>
                  <th className="px-10 py-5 text-left text-[11px] font-black italic text-slate-800 uppercase tracking-[0.2em]">Owner</th>
                  <th className="px-10 py-5 text-left text-[11px] font-black italic text-slate-800 uppercase tracking-[0.2em]">Region</th>
                  <th className="px-10 py-5 text-left text-[11px] font-black italic text-slate-800 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-10 py-5 text-right text-[11px] font-black italic text-slate-800 uppercase tracking-[0.2em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredBusinesses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-sm text-slate-400">
                      No businesses found in this category.
                    </td>
                  </tr>
                ) : (
                  filteredBusinesses.map((business) => (
                    <tr key={business.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${business.businessType === 'physical' ? 'bg-blue-50' : 'bg-purple-50'}`}>
                            {business.businessType === 'physical'
                              ? <Building2 className="size-5 text-blue-600" />
                              : <Globe className="size-5 text-purple-600" />
                            }
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900">{business.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono mt-1">{business.tin || 'No TIN'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          business.businessType === 'physical' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                        }`}>
                          {business.businessType}
                        </span>
                      </td>
                      <td className="px-10 py-6">
                        <div className="text-sm font-medium text-slate-700">{getOwnerName(business.taxpayerId)}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{getOwnerTin(business.taxpayerId)}</div>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <MapPin className="size-3.5 text-slate-400" />
                          {business.region || 'N/A'}
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <span className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-wider ${statusBadge(business.status)}`}>
                          {business.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedBusiness(business)}
                            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all"
                            title="View Details"
                          >
                            <Eye className="size-4" />
                          </button>
                          {business.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(business)}
                                className="p-2.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-700 transition-all"
                                title="Approve"
                              >
                                <CheckCircle className="size-4" />
                              </button>
                              <button
                                onClick={() => handleSetInReview(business)}
                                className="p-2.5 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-700 transition-all"
                                title="Set In-Review"
                              >
                                <Clock className="size-4" />
                              </button>
                              <button
                                onClick={() => handleReject(business)}
                                className="p-2.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 transition-all"
                                title="Reject"
                              >
                                <XCircle className="size-4" />
                              </button>
                            </>
                          )}
                          {business.status === 'in_review' && (
                            <>
                              <button
                                onClick={() => handleApprove(business)}
                                className="p-2.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-700 transition-all"
                                title="Approve"
                              >
                                <CheckCircle className="size-4" />
                              </button>
                              <button
                                onClick={() => handleReject(business)}
                                className="p-2.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 transition-all"
                                title="Reject"
                              >
                                <XCircle className="size-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Details Dialog */}
      <Dialog open={!!selectedBusiness} onOpenChange={() => setSelectedBusiness(null)}>
        <DialogContent className="sm:max-w-[550px] rounded-2xl p-8 bg-white border border-slate-100 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">Business Details</DialogTitle>
            <DialogDescription className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
              Review business registration
            </DialogDescription>
          </DialogHeader>

          {selectedBusiness && (
            <div className="space-y-6 mt-4">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${selectedBusiness.businessType === 'physical' ? 'bg-blue-50' : 'bg-purple-50'}`}>
                  {selectedBusiness.businessType === 'physical'
                    ? <Building2 className="size-8 text-blue-600" />
                    : <Globe className="size-8 text-purple-600" />
                  }
                </div>
                <div>
                  <div className="text-xl font-black text-slate-900">{selectedBusiness.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      selectedBusiness.businessType === 'physical' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                    }`}>
                      {selectedBusiness.businessType}
                    </span>
                    <span className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase ${statusBadge(selectedBusiness.status)}`}>
                      {selectedBusiness.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-5 space-y-4">
                {[
                  { label: 'Owner', value: getOwnerName(selectedBusiness.taxpayerId) },
                  { label: 'Owner TIN', value: getOwnerTin(selectedBusiness.taxpayerId) },
                  { label: 'Business TIN', value: selectedBusiness.tin || 'Not assigned' },
                  { label: 'Reg. Number', value: selectedBusiness.registrationNumber || 'N/A' },
                  { label: 'Email', value: selectedBusiness.email || 'N/A' },
                  { label: 'Phone', value: selectedBusiness.phone || 'N/A' },
                  { label: 'Address', value: selectedBusiness.address },
                  { label: 'Region', value: selectedBusiness.region || 'N/A' },
                  { label: 'Registered', value: selectedBusiness.registeredDate },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{row.label}</span>
                    <span className="text-sm font-bold text-slate-800">{row.value}</span>
                  </div>
                ))}
              </div>

              {selectedBusiness.businessType === 'physical' && selectedBusiness.status === 'pending' && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="size-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-bold text-amber-800">Physical Location Verification</div>
                    <div className="text-xs text-amber-600 mt-1">Consider dispatching a field officer to verify the business address before approval.</div>
                  </div>
                </div>
              )}

              <DialogFooter className="flex gap-3">
                {(selectedBusiness.status === 'pending' || selectedBusiness.status === 'in_review') && (
                  <>
                    <button
                      onClick={() => handleReject(selectedBusiness)}
                      className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-red-100 transition-all"
                    >
                      <XCircle className="size-4" />
                      Reject
                    </button>
                    {selectedBusiness.status === 'pending' && (
                      <button
                        onClick={() => handleSetInReview(selectedBusiness)}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-blue-100 transition-all"
                      >
                        <Clock className="size-4" />
                        In-Review
                      </button>
                    )}
                    <button
                      onClick={() => handleApprove(selectedBusiness)}
                      className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200/50"
                    >
                      <CheckCircle className="size-4" />
                      Approve
                    </button>
                  </>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
