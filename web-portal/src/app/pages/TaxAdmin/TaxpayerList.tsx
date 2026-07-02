import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { 
  Search, Filter, Plus, Eye, Edit3, CheckCircle, 
  Users, UserPlus, AlertTriangle, TrendingUp, Download, 
  MoreHorizontal, ChevronDown, MapPin, 
  ShieldCheck, ShieldAlert, ArrowRight, Zap, Layers,
  ExternalLink, ArrowUpRight, History, X
} from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { toast } from 'sonner';

export default function TaxpayerList() {
  const { taxpayers, addTaxpayer } = useMockData();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', businessName: '', tin: '', email: '', phone: '', address: '', taxType: 'VAT', region: 'Central Region' });

  const statusStyles: Record<string, { bg: string, border: string, text: string, icon: any, shadow: string, indicator: string }> = {
    active:    { bg: 'bg-white', border: 'border-slate-100', text: 'text-lime-600', icon: ShieldCheck, shadow: 'shadow-slate-100', indicator: 'bg-lime-500' },
    pending:   { bg: 'bg-white',   border: 'border-slate-100',   text: 'text-amber-600',   icon: History,     shadow: 'shadow-slate-100',   indicator: 'bg-amber-500' },
    suspended: { bg: 'bg-white',    border: 'border-slate-100',    text: 'text-rose-600',    icon: ShieldAlert, shadow: 'shadow-slate-100',    indicator: 'bg-rose-500' },
    inactive:  { bg: 'bg-white',   border: 'border-slate-100',   text: 'text-slate-400',   icon: AlertTriangle, shadow: 'shadow-slate-100', indicator: 'bg-slate-400' },
    in_review: { bg: 'bg-white',   border: 'border-slate-100',   text: 'text-blue-600',    icon: History,     shadow: 'shadow-slate-100',   indicator: 'bg-blue-500' },
    defaulter: { bg: 'bg-white',   border: 'border-slate-100',   text: 'text-red-700',     icon: AlertTriangle, shadow: 'shadow-slate-100', indicator: 'bg-red-600' },
  };

  // Real-time Filtering Logic
  const filteredTaxpayers = useMemo(() => {
    return taxpayers.filter(taxpayer => {
      const matchesSearch = 
        taxpayer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        taxpayer.tin.includes(searchTerm) ||
        taxpayer.taxType.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (taxpayer.businessName && taxpayer.businessName.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesTab = activeTab === 'All' || taxpayer.status.toLowerCase() === activeTab.toLowerCase();
      
      return matchesSearch && matchesTab;
    });
  }, [searchTerm, activeTab]);

  const totalTaxpayers = taxpayers.length;
  const activeCount = taxpayers.filter(t => t.status === 'active').length;
  const pendingCount = taxpayers.filter(t => t.status === 'pending').length;

  const handleExport = () => {
    const headers = 'ID,Name,Business Name,TIN,Email,Phone,Region,Status,Registration Date,Address\n';
    const rows = taxpayers.map(t => 
      `"${t.id}","${t.name}","${t.businessName || ''}","${t.tin}","${t.email}","${t.phone}","${t.region}","${t.status}","${t.registrationDate}","${t.address || ''}"`
    ).join('\n');
    const csvContent = headers + rows;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `taxpayer_registry_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Registry Data Exported (CSV)');
  };

  const handleRegister = () => {
    if (!formData.name.trim()) {
      toast.error('Validation Error', { description: 'Entity Name is required.' });
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast.error('Validation Error', { description: 'A valid Email Address is required.' });
      return;
    }
    if (!formData.phone.trim()) {
      toast.error('Validation Error', { description: 'Phone Number is required.' });
      return;
    }
    if (!formData.address.trim()) {
      toast.error('Validation Error', { description: 'Physical Address is required.' });
      return;
    }

    addTaxpayer({
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      businessName: formData.businessName,
      tin: formData.tin || `TIN-${Math.floor(Math.random() * 900000) + 100000}`,
      email: formData.email,
      phone: formData.phone,
      taxType: [formData.taxType],
      status: 'pending',
      registrationDate: new Date().toISOString().split('T')[0],
      region: formData.region,
      address: formData.address
    });
    toast.success('Taxpayer Application Submitted', { description: 'Moved to Pending queue for approval.' });
    setShowRegister(false);
    setFormData({ name: '', businessName: '', tin: '', email: '', phone: '', address: '', taxType: 'VAT', region: 'Central Region' });
  };

  const glassCard = 'bg-blue-50/40 backdrop-blur-3xl rounded-2xl border border-white/60 shadow-2xl shadow-blue-900/5 overflow-hidden';

  return (
    <div className="min-h-screen bg-[#f1f5f9] relative overflow-hidden">
      {/* Dynamic Vibrant Background Blobs */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[25%] right-[5%] w-[25%] h-[25%] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[5%] w-[30%] h-[30%] bg-rose-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="p-6 lg:p-10 space-y-12 relative z-10">
        {/* Surgical Command Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="size-3 rounded-full bg-blue-500 animate-ping absolute inset-0" />
                <div className="size-3 rounded-full bg-blue-600 relative" />
              </div>
              <span className="px-3 py-1 bg-blue-100/50 border border-blue-200 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Surgical Registry Node</span>
              <span className="text-slate-400">•</span>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">SECURE ACCESS • v4.2.0</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">Taxpayer Intelligence</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={handleExport} className="group flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
              <Download className="size-4 group-hover:translate-y-0.5 transition-transform" />
              Export
            </button>
            <Link
              to="/tax-admin/taxpayers/approve"
              className="flex items-center gap-2 px-7 py-3.5 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-300/50"
            >
              <UserPlus className="size-4" />
              Applications
              {pendingCount > 0 && (
                <span className="ml-2 px-2.5 py-0.5 bg-blue-500 text-[10px] text-white rounded-lg animate-bounce">
                  {pendingCount}
                </span>
              )}
            </Link>
            <button onClick={() => setShowRegister(true)} className="flex items-center gap-2 px-7 py-3.5 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-200/50">
              <Plus className="size-4" />
              Register
            </button>
          </div>
        </div>

        {/* Tactical Intelligence KPI Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Total Entities', value: totalTaxpayers.toLocaleString(), subLabel: 'VERIFIED NODES IN REGISTRY', icon: Users, color: 'blue' },
            { label: 'Active Compliance', value: `${Math.round((activeCount / totalTaxpayers) * 100)}%`, subLabel: 'OPTIMIZED FISCAL HEALTH', icon: ShieldCheck, color: 'emerald' },
            { label: 'Pending Verification', value: pendingCount, subLabel: 'QUEUED INTELLIGENCE NODES', icon: History, color: 'amber' },
            { label: 'Projected Revenue', value: 'FCFA 2.4B', subLabel: 'STRATEGIC FISCAL TARGET', icon: TrendingUp, color: 'purple' },
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

        {/* Registry Command Terminal */}
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
                placeholder="Initialize node search..."
                className="w-full pl-20 pr-8 py-5 bg-white border-2 border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-400 focus:border-blue-500 focus:shadow-[0_0_30px_-5px_rgba(59,130,246,0.15)] outline-none transition-all shadow-sm"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-full flex items-center gap-2 shadow-sm">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing</span>
                <span className="text-[10px] font-black text-lime-500 uppercase tracking-widest">{filteredTaxpayers.length}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">of</span>
                <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{totalTaxpayers}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Results</span>
              </div>
              
              <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-100">
                {['All', 'Active', 'Pending', 'Suspended', 'Inactive'].map((status) => (
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

          {/* Expanded Filter Panel */}
          {showFilters && (
            <div className="px-12 py-6 bg-white/50 border-b border-slate-200/50 animate-in slide-in-from-top duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tax Type Portfolio</label>
                  <select className="w-full p-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-blue-500">
                    <option>All Portfolios</option>
                    <option>Value Added Tax (VAT)</option>
                    <option>Company Income Tax (CIT)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Regional Hub</label>
                  <select className="w-full p-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-blue-500">
                    <option>All Regions</option>
                    <option>Northern Region</option>
                    <option>Southern Region</option>
                    <option>Eastern Region</option>
                    <option>Western Region</option>
                  </select>
                </div>
                <div className="flex items-end gap-3">
                  <button className="flex-1 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all">
                    Apply Strategic Filter
                  </button>
                  <button 
                    onClick={() => { setSearchTerm(''); setActiveTab('All'); setShowFilters(false); }}
                    className="p-3 bg-slate-100 text-slate-500 rounded-2xl hover:bg-rose-50 hover:text-rose-600 transition-all"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Surgical Data Grid */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-10 py-5 text-left text-[11px] font-black italic text-slate-800 uppercase tracking-[0.2em]">Taxpayer Information</th>
                  <th className="px-10 py-5 text-left text-[11px] font-black italic text-slate-800 uppercase tracking-[0.2em]">TIN & Registry</th>
                  <th className="px-10 py-5 text-left text-[11px] font-black italic text-slate-800 uppercase tracking-[0.2em]">Tax Portfolios</th>
                  <th className="px-10 py-5 text-left text-[11px] font-black italic text-slate-800 uppercase tracking-[0.2em]">Regional Hub</th>
                  <th className="px-10 py-5 text-left text-[11px] font-black italic text-slate-800 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-10 py-5 text-right text-[11px] font-black italic text-slate-800 uppercase tracking-[0.2em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/30">
                {filteredTaxpayers.length > 0 ? (
                  filteredTaxpayers.map((taxpayer) => {
                    const status = statusStyles[taxpayer.status] || statusStyles.inactive;
                    const initials = taxpayer.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                    
                    return (
                      <tr key={taxpayer.id} className="hover:bg-slate-50/50 transition-all group relative border-b border-slate-100 last:border-0">
                        <td className="px-10 py-6 relative">
                          <div className="flex items-center gap-5">
                            <div className="relative">
                              <div 
                                className="size-12 rounded-2xl flex items-center justify-center text-[11px] font-black text-slate-600 bg-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 group-hover:rotate-6 shadow-sm"
                              >
                                {initials}
                              </div>
                            </div>
                            <div>
                              <div className="text-base font-black text-slate-900 tracking-tight leading-tight">{taxpayer.name}</div>
                              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 italic">
                                {taxpayer.businessName || 'Strategic Portfolio Node'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-12 py-5">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-mono text-slate-700 font-black tracking-tight">{taxpayer.tin}</span>
                            <div className="flex items-center gap-2 text-[9px] text-slate-400 font-black uppercase tracking-wider">
                              <Zap className="size-3 text-blue-500" />
                              {new Date(taxpayer.registrationDate).toLocaleDateString()}
                            </div>
                          </div>
                        </td>
                        <td className="px-12 py-5">
                          <div className="flex flex-wrap gap-2 max-w-[200px]">
                            {taxpayer.taxType.map((type) => (
                              <span
                                key={type}
                                className="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] group-hover:border-blue-200 group-hover:text-blue-600 transition-all shadow-sm"
                              >
                                {type}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-12 py-5">
                          <div className="flex items-center gap-3 text-xs font-black text-slate-700">
                            <div className="p-2 bg-blue-50/50 border border-blue-100/50 rounded-xl group-hover:bg-white group-hover:border-blue-200 transition-all shadow-sm">
                              <MapPin className="size-3.5 text-blue-500 group-hover:text-blue-600" />
                            </div>
                            {taxpayer.region}
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <div className={`inline-flex items-center gap-3 px-5 py-2 rounded-2xl bg-white border border-slate-100 shadow-sm group-hover:shadow-md transition-all`}>
                            <div className={`size-2 rounded-full ${status.indicator}`} />
                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${status.text}`}>{taxpayer.status}</span>
                          </div>
                        </td>
                        <td className="px-12 py-5 text-right">
                          <div className="flex items-center justify-end gap-3 transition-all">
                            <Link
                              to={`/tax-admin/taxpayers/${taxpayer.id}`}
                              className="p-3 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-2xl transition-all shadow-sm border border-blue-100 hover:shadow-xl hover:shadow-blue-200/50"
                              title="Details"
                            >
                              <Eye className="size-5" />
                            </Link>
                            <Link
                              to={`/tax-admin/taxpayers/${taxpayer.id}/edit`}
                              className="p-3 bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white rounded-2xl transition-all shadow-sm border border-amber-100 hover:shadow-xl hover:shadow-amber-200/50"
                              title="Edit"
                            >
                              <Edit3 className="size-5" />
                            </Link>
                            <button onClick={() => toast('Quick Actions menu opened.')} className="p-3 text-slate-400 hover:text-slate-900 transition-all">
                              <MoreHorizontal className="size-5 rotate-90" />
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
                          <Search className="size-12" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-black text-slate-900 uppercase tracking-widest">No Intelligence Nodes Found</p>
                          <p className="text-xs text-slate-400 font-bold">Try adjusting your search or filters to locate the entity.</p>
                        </div>
                        <button 
                          onClick={() => { setSearchTerm(''); setActiveTab('All'); }}
                          className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
                        >
                          Reset Registry View
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Command Pagination */}
          <div className="px-12 py-8 border-t border-slate-200/50 bg-blue-50/20 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.25em]">
              <div className="flex items-center gap-3">
                <span className="text-slate-900">NODE STATUS:</span>
                <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-800 shadow-sm font-mono">{filteredTaxpayers.length} / {totalTaxpayers}</span>
              </div>
              <div className="flex items-center gap-5 pl-8 border-l border-slate-200">
                <label>DENSITY:</label>
                <select className="bg-transparent font-black text-slate-900 outline-none cursor-pointer hover:text-blue-600 transition-colors">
                  <option>10 NODES / PAGE</option>
                  <option>25 NODES / PAGE</option>
                  <option>50 NODES / PAGE</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="px-8 py-3 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 cursor-not-allowed shadow-sm">
                Previous Cluster
              </button>
              <button className="px-8 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 hover:border-blue-500 hover:text-blue-600 transition-all shadow-lg shadow-slate-200 group flex items-center gap-3">
                Next Cluster
                <ArrowRight className="size-4 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showRegister} onOpenChange={setShowRegister}>
        <DialogContent className="rounded-xl max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3 uppercase italic">
              <UserPlus className="size-6 text-blue-500" />
              Register Taxpayer Node
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-slate-500 italic">
              Provision a new taxpayer entity into the core registry.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 my-4">
            <input type="text" placeholder="FULL NAME / ENTITY NAME" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="col-span-2 px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xs font-black text-slate-800 focus:border-blue-500 focus:bg-white outline-none tracking-widest uppercase" />
            <input type="text" placeholder="BUSINESS/TRADE NAME (OPTIONAL)" value={formData.businessName} onChange={e => setFormData({...formData, businessName: e.target.value})} className="col-span-2 px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xs font-black text-slate-800 focus:border-blue-500 focus:bg-white outline-none tracking-widest uppercase" />
            <input type="text" placeholder="TIN (AUTO-GENERATED IF BLANK)" value={formData.tin} onChange={e => setFormData({...formData, tin: e.target.value})} className="px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xs font-black text-slate-800 focus:border-blue-500 focus:bg-white outline-none tracking-widest uppercase" />
            <input type="email" placeholder="EMAIL ADDRESS" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xs font-black text-slate-800 focus:border-blue-500 focus:bg-white outline-none tracking-widest uppercase" />
            <input type="tel" placeholder="PHONE NUMBER" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xs font-black text-slate-800 focus:border-blue-500 focus:bg-white outline-none tracking-widest uppercase" />
            <input type="text" placeholder="PHYSICAL ADDRESS" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="col-span-2 px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xs font-black text-slate-800 focus:border-blue-500 focus:bg-white outline-none tracking-widest uppercase" />
            <select value={formData.taxType} onChange={e => setFormData({...formData, taxType: e.target.value})} className="px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xs font-black text-slate-800 focus:border-blue-500 focus:bg-white outline-none tracking-widest uppercase">
              <option value="VAT">Value Added Tax (VAT)</option>
              <option value="CIT">Company Income Tax (CIT)</option>
              <option value="PAYE">Pay As You Earn (PAYE)</option>
            </select>
            <select value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})} className="col-span-2 px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xs font-black text-slate-800 focus:border-blue-500 focus:bg-white outline-none tracking-widest uppercase">
              <option>Central Region</option>
              <option>Northern Region</option>
              <option>Southern Region</option>
              <option>Eastern Region</option>
              <option>Western Region</option>
            </select>
          </div>
          <DialogFooter className="mt-4">
            <button onClick={() => setShowRegister(false)} className="px-6 py-3 border border-slate-200 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50">Abort</button>
            <button onClick={handleRegister} className="px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-md">Register Entity</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Clock(props: any) {
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
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
