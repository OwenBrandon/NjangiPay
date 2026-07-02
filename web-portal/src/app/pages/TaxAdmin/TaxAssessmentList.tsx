import { getColorClass } from '../../utils/colorClasses';
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { useMockData } from '../../contexts/MockDataContext';
import { toast } from 'sonner';
import { 
  Plus, Search, Edit, Eye, Filter, CheckCircle, XCircle, 
  AlertCircle, History, TrendingUp, Banknote, Layers, 
  ArrowRight, Download, Zap, MapPin, X, Calendar, ShieldCheck,
  FileText, Activity
} from 'lucide-react';
export default function TaxAssessmentList() {
  const { taxpayers, assessments, updateAssessment } = useMockData();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const totalAmount = assessments.reduce((acc, a) => acc + a.amount, 0);
  const disputedCount = assessments.filter(a => a.status === 'disputed').length;

  const glassCard = 'bg-blue-50/40 backdrop-blur-3xl rounded-2xl border border-white/60 shadow-2xl shadow-blue-900/5 overflow-hidden';

  // Real-time Filtering Logic
  const filteredAssessments = useMemo(() => {
    return assessments.filter(assessment => {
      const taxpayer = taxpayers.find(t => t.id === assessment.taxpayerId);
      const matchesSearch = 
        taxpayer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        taxpayer?.tin.includes(searchTerm) ||
        assessment.taxType.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTab = 
        activeTab === 'All' || 
        (activeTab === 'Pending' && (assessment.status === 'pending' || assessment.status === 'unpaid')) ||
        (activeTab === 'Approved' && (assessment.status === 'approved' || assessment.status === 'paid')) ||
        (activeTab === 'Overdue' && assessment.status === 'overdue') ||
        (activeTab === 'Disputed' && assessment.status === 'disputed');
      
      return matchesSearch && matchesTab;
    });
  }, [searchTerm, activeTab, assessments, taxpayers]);

  return (
    <div className="min-h-screen bg-[#f1f5f9] relative overflow-hidden">
      {/* Dynamic Vibrant Background Blobs */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[25%] right-[5%] w-[25%] h-[25%] bg-slate-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="p-6 lg:p-10 space-y-12 relative z-10">
        {/* Surgical Command Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="size-3 rounded-full bg-blue-500 animate-ping absolute inset-0" />
                <div className="size-3 rounded-full bg-blue-600 relative" />
              </div>
              <span className="px-3 py-1 bg-blue-100/50 border border-blue-200 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Fiscal Evaluation</span>
              <span className="text-slate-400">•</span>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Assessment Matrix</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">Tax Assessments</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => toast.success('Intelligence Export Completed')} className="flex items-center gap-2 px-7 py-3.5 bg-white border border-slate-200 text-slate-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
              <Download className="size-4" />
              Intelligence Export
            </button>
            <Link
              to="/tax-admin/assessments/create"
              className="flex items-center gap-2 px-7 py-3.5 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-400/50"
            >
              <Plus className="size-4" />
              Create Assessment
            </Link>
          </div>
        </div>

        {/* Premium Assessment Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Assessment Portfolio', value: assessments.length, trend: 'Nodes', icon: Layers, color: 'blue', accent: 'bg-blue-100/60' },
            { label: 'Approved Volume', value: 'FCFA 1.2M', trend: '82%', icon: ShieldCheck, color: 'sky', accent: 'bg-sky-100/60' },
            { label: 'Disputed Nodes', value: disputedCount, trend: 'Critical', icon: AlertCircle, color: 'rose', accent: 'bg-rose-100/60' },
            { label: 'Avg Assessment', value: `FCFA ${assessments.length > 0 ? (totalAmount / assessments.length / 1000).toFixed(1) : 0}K`, trend: 'Stable', icon: Activity, color: 'purple', accent: 'bg-purple-100/60' },
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

        {/* Assessment Terminal */}
        <div className={glassCard}>
          {/* Tactical Search & Tabs */}
          <div className="px-12 py-8 border-b border-slate-200/50 bg-blue-50/20 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-5 flex-1">
              <div className="relative flex-1 max-w-2xl group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-blue-600 transition-all" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search Assessment ID, TIN, or Entity..."
                  className="w-full pl-16 pr-8 py-4.5 bg-white border border-slate-200 rounded-3xl text-sm font-bold placeholder:text-slate-400 focus:ring-12 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all shadow-sm"
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center gap-3 px-8 py-4.5 bg-white border rounded-3xl text-xs font-black uppercase tracking-widest transition-all shadow-sm group ${showFilters ? 'border-blue-500 text-blue-600' : 'border-slate-200 text-slate-700'}`}
              >
                <Filter className={`size-4 transition-transform duration-700 ${showFilters ? 'rotate-180' : ''}`} />
                Batch Filters
              </button>
            </div>
            
            <div className="flex items-center gap-2 p-2 bg-blue-100/30 rounded-3xl border border-blue-200/50">
              {['All', 'Pending', 'Approved', 'Overdue', 'Disputed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setActiveTab(status)}
                  className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === status 
                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-400/50' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Assessment Data Grid */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-50/50">
                  <th className="px-12 py-5 text-left border-b border-slate-200/50 text-[11px] uppercase font-black text-slate-500 tracking-[0.25em]">Strategic Entity</th>
                  <th className="px-12 py-5 text-left border-b border-slate-200/50 text-[11px] uppercase font-black text-slate-500 tracking-[0.25em]">Tax Portfolio</th>
                  <th className="px-12 py-5 text-left border-b border-slate-200/50 text-[11px] uppercase font-black text-slate-500 tracking-[0.25em]">Fiscal Node</th>
                  <th className="px-12 py-5 text-left border-b border-slate-200/50 text-[11px] uppercase font-black text-slate-500 tracking-[0.25em]">Due Horizon</th>
                  <th className="px-12 py-5 text-left border-b border-slate-200/50 text-[11px] uppercase font-black text-slate-500 tracking-[0.25em]">Evaluation Node</th>
                  <th className="px-12 py-5 text-right border-b border-slate-200/50 text-[11px] uppercase font-black text-slate-500 tracking-[0.25em]">Protocols</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/30">
                {filteredAssessments.length > 0 ? (
                  filteredAssessments.map((assessment) => {
                    const taxpayer = taxpayers.find(t => t.id === assessment.taxpayerId);
                    const initials = taxpayer?.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'TX';
                    
                    return (
                      <tr key={assessment.id} className="hover:bg-white/50 transition-all group relative">
                        <td className="px-12 py-5 relative">
                          <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 rounded-r-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-500`} />
                          
                          <div className="flex items-center gap-5">
                            <div 
                              className="size-12 rounded-2xl flex items-center justify-center text-[11px] font-black text-white group-hover:shadow-2xl group-hover:shadow-blue-300 transition-all duration-500 group-hover:rotate-6"
                              style={{ background: '#0d1929' }}
                            >
                              {initials}
                            </div>
                            <div>
                              <div className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">{taxpayer?.name}</div>
                              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                                TIN: {taxpayer?.tin}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-12 py-5">
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-[0.1em]">
                              {assessment.taxType}
                            </span>
                            <span className="px-3 py-1 bg-blue-50/50 border border-blue-100/50 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-[0.1em]">
                              {assessment.period}
                            </span>
                          </div>
                        </td>
                        <td className="px-12 py-5">
                          <div className="text-base font-mono text-slate-900 font-black tracking-tight group-hover:text-blue-600 transition-colors">
                            {"FCFA "}{assessment.amount.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-12 py-5">
                          <div className="flex items-center gap-2 text-xs font-black text-slate-600">
                            <Calendar className="size-3.5 text-blue-500" />
                            {new Date(assessment.dueDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-12 py-5">
                          <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-2xl border ${
                            assessment.status === 'approved' ? 'border-sky-200 bg-sky-50 text-sky-700' :
                            assessment.status === 'pending' ? 'border-amber-200 bg-amber-50 text-amber-700' :
                            assessment.status === 'disputed' ? 'border-rose-200 bg-rose-50 text-rose-700' :
                            assessment.status === 'paid' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' :
                            assessment.status === 'overdue' ? 'border-red-200 bg-red-50 text-red-700' :
                            assessment.status === 'partial' ? 'border-orange-200 bg-orange-50 text-orange-700' :
                            assessment.status === 'unpaid' ? 'border-slate-200 bg-slate-50 text-slate-700' :
                            'border-blue-200 bg-blue-50 text-blue-700'
                          }`}>
                            <div className={`size-2 rounded-full ${
                              assessment.status === 'approved' ? 'bg-sky-500' :
                              assessment.status === 'pending' ? 'bg-amber-500 animate-pulse' :
                              assessment.status === 'disputed' ? 'bg-rose-500 animate-ping' :
                              assessment.status === 'paid' ? 'bg-emerald-500' :
                              assessment.status === 'overdue' ? 'bg-red-500 animate-pulse' :
                              assessment.status === 'partial' ? 'bg-orange-500' :
                              assessment.status === 'unpaid' ? 'bg-slate-400' :
                              'bg-blue-500'
                            }`} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{assessment.status}</span>
                          </div>
                        </td>
                        <td className="px-12 py-5 text-right">
                          <div className="flex items-center justify-end gap-3 transition-all">
                            <Link 
                              to={`/tax-admin/assessments/${assessment.id}/edit`}
                              className="p-3 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-2xl transition-all shadow-sm border border-blue-100 hover:shadow-xl hover:shadow-blue-200/50"
                              title="Edit Node"
                            >
                              <Edit className="size-5" />
                            </Link>
                            <button 
                              onClick={() => {
                                updateAssessment({ ...assessment, status: 'approved' });
                                toast.success(`Assessment Approved`, { description: `Node verified for ${taxpayer?.name || 'entity'}.` });
                              }}
                              className="p-3 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-2xl transition-all shadow-sm border border-blue-100 hover:shadow-xl hover:shadow-blue-200/50"
                              title="Approve Node"
                            >
                              <CheckCircle className="size-5" />
                            </button>
                            <button 
                              onClick={() => {
                                updateAssessment({ ...assessment, status: 'disputed' });
                                toast.error(`Flagged as Dispute`, { description: `Investigation initiated for ${taxpayer?.name || 'entity'}.` });
                              }}
                              className="p-3 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-2xl transition-all shadow-sm border border-rose-100 hover:shadow-xl hover:shadow-rose-200/50"
                              title="Flag Dispute"
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
                    <td colSpan={6} className="px-12 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 text-slate-300">
                          <History className="size-12" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Assessment Matrix Clear</p>
                          <p className="text-xs text-slate-400 font-bold">No fiscal nodes found matching the current search parameters.</p>
                        </div>
                        <button 
                          onClick={() => { setSearchTerm(''); setActiveTab('Pending'); }}
                          className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
                        >
                          Refresh Evaluation Hub
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
                <span className="text-slate-900">EVALUATION RATIO:</span>
                <span className="px-3 py-1 bg-white border border-blue-200 text-blue-700 rounded-lg shadow-sm font-mono tracking-tighter">84% PROCESSED</span>
              </div>
              <div className="flex items-center gap-3 pl-8 border-l border-slate-200">
                <span className="text-slate-900">ACTIVE NODES:</span>
                <span className="font-mono text-slate-700">{filteredAssessments.length}</span>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => toast.info('Loading next data cluster from central DB...')} className="px-8 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 hover:border-blue-500 hover:text-blue-600 transition-all shadow-lg shadow-slate-200 group flex items-center gap-3">
                Next Cluster
                <ArrowRight className="size-4 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
