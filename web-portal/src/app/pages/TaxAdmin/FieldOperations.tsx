import { getColorClass } from '../../utils/colorClasses';
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { useMockData } from '../../contexts/MockDataContext';
import { supabase } from '../../lib/supabase';
import type { InspectionReport } from '../../types';
import { 
  MapPin, User, Calendar, AlertCircle, CheckCircle, 
  Search, Filter, Plus, Radio, Zap, Target, ShieldCheck, 
  ArrowRight, Download, Activity, Globe, Send, Archive,
  Eye, FileText, MoreVertical, Briefcase
} from 'lucide-react';

export default function FieldOperations() {
  const navigate = useNavigate();
  const { taxpayers } = useMockData();
  const [inspectionReports, setInspectionReports] = useState<InspectionReport[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    supabase.from('field_visits').select('*').then(({ data }) => {
      if (data) setInspectionReports(data.map((r: any) => ({
        id: r.id, taxpayerId: r.taxpayer_id, inspectorId: r.officer_id,
        businessName: r.business_name, location: r.location,
        inspectionDate: r.visit_date, inspectionTime: r.visit_time,
        purpose: r.purpose, findings: r.findings || '',
        violations: r.violations || [], outcome: r.outcome,
        status: r.status, notes: r.notes, photos: r.photos || [],
      })));
    });
  }, []);
  const [activeTab, setActiveTab] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  
  // Notice Modal State
  const [noticeOperation, setNoticeOperation] = useState<any>(null);
  const [noticeMessage, setNoticeMessage] = useState('');

  const glassCard = 'bg-blue-50/40 backdrop-blur-3xl rounded-2xl border border-white/60 shadow-2xl shadow-blue-900/5 overflow-hidden';

  // Real-time Filtering Logic
  const filteredReports = useMemo(() => {
    return inspectionReports.filter(report => {
      const matchesSearch = 
        report.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.findings.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTab = 
        activeTab === 'All' || 
        (activeTab === 'Pending' && report.status === 'pending_review') ||
        (activeTab === 'Completed' && report.status === 'completed');
      
      return matchesSearch && matchesTab;
    });
  }, [searchTerm, activeTab]);

  return (
    <div className="min-h-screen bg-[#f1f5f9] relative overflow-hidden">
      {/* Tactical Background Blobs */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[25%] right-[5%] w-[25%] h-[25%] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="p-6 lg:p-10 space-y-12 relative z-10">
        {/* Tactical Command Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="size-3 rounded-full bg-blue-500 animate-ping absolute inset-0" />
                <div className="size-3 rounded-full bg-blue-600 relative" />
              </div>
              <span className="px-3 py-1 bg-blue-100/50 border border-blue-200 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Operational Node</span>
              <span className="text-slate-400">•</span>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Field Intel Terminal</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">Field Operations</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => { toast.success('Live Deployment Map Printed'); }} className="flex items-center gap-2 px-7 py-3.5 bg-white border border-slate-200 text-slate-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
              <Globe className="size-4" />
              Live Deployment
            </button>
            <button onClick={() => toast.success('Team Deployment Initiated', { description: 'Alpha squad deployed to target sector.' })} className="flex items-center gap-2 px-7 py-3.5 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-200/50">
              <Plus className="size-4" />
              Deploy Team
            </button>
          </div>
        </div>

        {/* Operational KPI Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Field Inspections', value: inspectionReports.length, trend: 'Monthly', icon: Target, color: 'blue', accent: 'bg-blue-100/60' },
            { label: 'Pending Review', value: inspectionReports.filter(r => r.status === 'pending_review').length, trend: 'Critical', icon: AlertCircle, color: 'amber', accent: 'bg-amber-100/60' },
            { label: 'Active Officers', value: '08', trend: 'In Field', icon: Radio, color: 'sky', accent: 'bg-sky-100/60' },
            { label: 'Violation Velocity', value: '14%', trend: 'Stable', icon: Activity, color: 'rose', accent: 'bg-rose-100/60' },
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

        {/* Intel Terminal Card */}
        <div className={glassCard}>
          {/* Search & Tabs Terminal */}
          <div className="px-12 py-8 border-b border-slate-200/50 bg-blue-50/20 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-5 flex-1">
              <div className="relative flex-1 max-w-2xl group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-blue-600 transition-all" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search Operations, Teams, or Locations..."
                  className="w-full pl-16 pr-8 py-4.5 bg-white border border-slate-200 rounded-3xl text-sm font-bold placeholder:text-slate-400 focus:ring-12 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all shadow-sm"
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center gap-3 px-8 py-4.5 bg-white border rounded-3xl text-xs font-black uppercase tracking-widest transition-all shadow-sm group ${showFilters ? 'border-blue-500 text-blue-600' : 'border-slate-200 text-slate-700'}`}
              >
                <Filter className={`size-4 transition-transform duration-700 ${showFilters ? 'rotate-180' : ''}`} />
                Sector Filters
              </button>
            </div>
            
            <div className="flex items-center gap-2 p-2 bg-blue-100/30 rounded-3xl border border-blue-200/50">
              {['All', 'Ongoing', 'Pending', 'Completed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === tab 
                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-400/50' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Operation Nodes Grid */}
          <div className="p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredReports.map((report) => {
                const taxpayer = taxpayers.find(t => t.id === report.taxpayerId);
                return (
                  <div key={report.id} className="group bg-white rounded-2xl border border-slate-100 p-8 shadow-sm hover:shadow-2xl hover:shadow-emerald-900/5 transition-all duration-500 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 group-hover:scale-150 transition-transform duration-1000 opacity-30 rounded-bl-full" />
                    
                    <div className="flex items-start justify-between mb-8 relative z-10">
                      <div className="flex items-center gap-5">
                        <div 
                          className="size-14 rounded-2xl flex items-center justify-center text-white group-hover:bg-blue-600 transition-colors shadow-lg"
                          style={{ background: '#0d1929' }}
                        >
                          <Briefcase className="size-6" />
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">{report.businessName}</h4>
                          <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                            <span className="flex items-center gap-1.5"><User className="size-3" /> Inspector #{report.inspectorId}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1.5"><Calendar className="size-3" /> {new Date(report.inspectionDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest ${
                        report.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        report.status === 'pending_review' ? 'bg-amber-50 text-amber-600 border border-amber-100 animate-pulse' :
                        'bg-blue-50 text-blue-600 border border-blue-100'
                      }`}>
                        {report.status.replace('_', ' ')}
                      </div>
                    </div>

                    <div className="bg-slate-50/80 rounded-xl p-6 mb-8 border border-slate-100 group-hover:bg-white transition-colors">
                      <div className="flex items-center gap-2 mb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <FileText className="size-3.5" />
                        Operation Findings
                      </div>
                      <p className="text-sm font-bold text-slate-600 leading-relaxed italic">"{report.findings}"</p>
                    </div>

                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 pt-6 border-t border-slate-100">
                      <div className="flex flex-wrap gap-2">
                        {report.violations.length > 0 ? (
                          report.violations.map((violation, idx) => (
                            <span key={idx} className="flex items-center gap-2 px-4 py-1.5 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-100 shadow-sm">
                              <AlertCircle className="size-3" />
                              {violation}
                            </span>
                          ))
                        ) : (
                          <span className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
                            <ShieldCheck className="size-3" />
                            Compliant
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button onClick={() => navigate(`/tax-admin/taxpayers/${report.taxpayerId}`)} className="p-3 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm border border-blue-100" title="Review Report">
                          <Eye className="size-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setNoticeOperation(report);
                            setNoticeMessage(`FIELD OPERATION PROTOCOL\n\nTarget: ${report.businessName}\nLocation: ${report.location}\n\nOperation Findings: ${report.findings}\n\nImmediate compliance and rectification required. Inspector #${report.inspectorId} will follow up.`);
                          }}
                          className="p-3 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl transition-all shadow-sm border border-emerald-100" title="Flag Operation"
                        >
                          <Send className="size-4" />
                        </button>
                        <button onClick={() => toast.success('Operation Archived', { description: 'Log safely stored in deep registry.' })} className="p-3 bg-slate-50 text-slate-400 hover:bg-slate-600 hover:text-white rounded-xl transition-all shadow-sm border border-slate-100" title="Archive Node">
                          <Archive className="size-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      <MapPin className="size-3.5 text-emerald-500" />
                      Sector Horizon: {report.location}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Operation Footer Telemetry */}
          <div className="px-12 py-8 border-t border-slate-200/50 bg-blue-50/20 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.25em]">
              <div className="flex items-center gap-3">
                <span className="text-slate-900">SYSTEM VELOCITY:</span>
                <span className="px-3 py-1 bg-white border border-blue-200 text-blue-700 rounded-lg shadow-sm font-mono tracking-tighter">OPTIMAL PROTOCOL</span>
              </div>
              <div className="flex items-center gap-3 pl-8 border-l border-slate-200">
                <span className="text-slate-900">ACTIVE NODES:</span>
                <span className="font-mono text-slate-700">{filteredReports.length} Operation Logs</span>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => { toast.success('Operational Report Exported'); }} className="px-8 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 hover:border-blue-500 hover:text-blue-600 transition-all shadow-lg shadow-slate-200 group flex items-center gap-3">
                Full Operational Report
                <ArrowRight className="size-4 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Flag Operation Dialog */}
      <Dialog open={!!noticeOperation} onOpenChange={(open) => !open && setNoticeOperation(null)}>
        <DialogContent className="sm:max-w-xl bg-white rounded-3xl p-0 overflow-hidden border-0 shadow-2xl">
          <DialogHeader className="px-8 pt-8 pb-4 bg-slate-50 border-b border-slate-100">
            <DialogTitle className="text-2xl font-black text-slate-900">Flag Operational Node</DialogTitle>
            <DialogDescription className="text-slate-500 font-bold mt-2">
              Drafting secure memo for <span className="text-blue-600">{noticeOperation?.businessName}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Memo Content</label>
              <textarea
                value={noticeMessage}
                onChange={(e) => setNoticeMessage(e.target.value)}
                className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none resize-none transition-all"
              />
            </div>
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Routing Protocol</span>
              </div>
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Field Dispatch</span>
            </div>
          </div>
          <DialogFooter className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex gap-4">
            <button
              onClick={() => setNoticeOperation(null)}
              className="px-6 py-3 border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-wider hover:bg-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                toast.success('Memo Dispatched Successfully', { description: `Routed to inspector queue for ${noticeOperation?.businessName}` });
                setNoticeOperation(null);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-wider hover:bg-blue-700 transition-all shadow-lg shadow-blue-200/50 group"
            >
              <Send className="size-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              Dispatch Memo
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
