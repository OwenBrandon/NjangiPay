import { getColorClass } from '../../utils/colorClasses';
import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart, Area
} from 'recharts';
import { 
  ClipboardList, AlertTriangle, TrendingUp, CheckCircle, Shield, 
  Search, Filter, Download, ArrowUpRight, ArrowDownRight, Activity, Zap,
  Crosshair, Fingerprint, Eye, Lock, TrendingDown, Clock, Layers, X, FileText, FileSpreadsheet
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useMockData } from '../../contexts/MockDataContext';
import { supabase } from '../../lib/supabase';
import type { AuditCase } from '../../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';

const riskVelocity = [
  { month: 'JAN', low: 450, medium: 240, high: 120, risk: 15 },
  { month: 'FEB', low: 380, medium: 320, high: 180, risk: 28 },
  { month: 'MAR', low: 520, medium: 280, high: 150, risk: 22 },
  { month: 'APR', low: 410, medium: 390, high: 210, risk: 35 },
];

const auditAllocation = [
  { name: 'FLAGGED', value: 24, color: '#ef4444' },
  { name: 'IN_PROGRESS', value: 45, color: '#f59e0b' },
  { name: 'COMPLETED', value: 128, color: '#10b981' },
  { name: 'ARCHIVED', value: 22, color: '#64748b' },
];

const ForensicTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950/90 backdrop-blur-xl border border-white/10 p-5 shadow-2xl rounded-2xl min-w-[200px]">
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 pb-2 border-b border-white/5 font-mono">
          NODE_TELEMETRY_DATA
        </div>
        <div className="space-y-3">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-8">
              <div className="flex items-center gap-2">
                <div className="size-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">{entry.name}</span>
              </div>
              <span className="text-sm font-black text-white font-mono italic">
                {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function AuditorDashboard() {
  const [timeRange, setTimeRange] = useState('monthly');
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedTaxpayer, setSelectedTaxpayer] = useState<any | null>(null);
  const [auditCases, setAuditCases] = useState<AuditCase[]>([]);
  const navigate = useNavigate();
  const { taxpayers, updateTaxpayer } = useMockData();

  useEffect(() => {
    supabase.from('audit_cases').select('*').then(({ data }) => {
      if (data) setAuditCases(data.map((r: any) => ({
        id: r.id, taxpayerId: r.taxpayer_id, caseNumber: r.case_number,
        status: r.status, priority: r.priority, assignedTo: r.assigned_to,
        openedDate: r.opened_date, closedDate: r.closed_date,
        findings: r.findings, riskScore: r.risk_score,
      })));
    });
  }, []);

  const reviewTaxpayers = taxpayers.filter(t => t.status === 'in_review');

  const glassCard = 'bg-white rounded-2xl border border-slate-200/60 shadow-lg shadow-blue-900/5 overflow-hidden';
  const terminalGrid = "";

  const totalCases    = auditCases.length;
  const activeCases   = auditCases.filter(c => c.status === 'in_progress' || c.status === 'open').length;
  const flaggedCases  = auditCases.filter(c => c.status === 'flagged').length;
  const closedCases   = auditCases.filter(c => c.status === 'closed').length;

  return (
    <div className="min-h-screen bg-[#f1f5f9] relative overflow-hidden p-8 lg:p-12">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[120px]" />

      {/* Header Section */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="size-3 rounded-full bg-emerald-500 animate-ping absolute inset-0" />
              <div className="size-3 rounded-full bg-emerald-600 relative" />
            </div>
            <span className="px-3 py-1 bg-emerald-100/50 border border-emerald-200 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Operational Terminal</span>
            <span className="text-slate-400">•</span>
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Audit Command Hub</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mt-2">Audit Intelligence</h1>
          <p className="text-sm text-slate-500 font-medium">Registry Case Management & Risk Telemetry</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-white/50 backdrop-blur-sm p-1.5 rounded-2xl border border-slate-200">
            {['daily', 'weekly', 'monthly'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  timeRange === range ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'text-slate-400 hover:text-slate-900'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-8 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-xl transition-all shadow-sm"
          >
            <Download className="size-4" />
            Export Telemetry
          </button>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setShowExportModal(false)} />
          <div className="relative bg-white rounded-xl p-10 shadow-2xl w-full max-w-md animate-in zoom-in-90 duration-300">
            <button onClick={() => setShowExportModal(false)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-xl"><X className="size-4" /></button>
            <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-2">Export Telemetry</h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono mb-8">Download forensic audit data</p>
            <div className="space-y-3 mb-8">
              {[{ icon: FileSpreadsheet, label: 'CSV Report', desc: 'Spreadsheet format for analysis' }, { icon: FileText, label: 'PDF Summary', desc: 'Formatted forensic report' }].map(({ icon: Icon, label, desc }) => (
                <button key={label} onClick={() => { setShowExportModal(false); toast.success('Export Ready', { description: `${label} downloaded.` }); }} className="w-full flex items-center gap-4 p-4 border border-slate-100 rounded-2xl hover:border-blue-400 hover:bg-blue-50/30 transition-all text-left">
                  <Icon className="size-5 text-slate-400" />
                  <div>
                    <div className="text-[11px] font-black text-slate-900 uppercase tracking-wide">{label}</div>
                    <div className="text-[9px] text-slate-400 font-mono">{desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* KPI Matrix */}
      {/* KPI Matrix */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {[
          { label: 'Total Registry', value: totalCases, icon: ClipboardList, color: 'blue', sub: 'REGISTRY_VOLUME', glow: 'from-blue-500/20 to-transparent' },
          { label: 'Forensic Threads', value: activeCases, icon: Activity, color: 'emerald', sub: 'ACTIVE_PROTOCOLS', glow: 'from-emerald-500/20 to-transparent' },
          { label: 'Risk Flags', value: flaggedCases, icon: AlertTriangle, color: 'rose', sub: 'CRITICAL_NODES', glow: 'from-rose-500/20 to-transparent' },
          { label: 'Closed Cycles', value: closedCases, icon: CheckCircle, color: 'indigo', sub: 'SUCCESS_PARITY', glow: 'from-indigo-500/20 to-transparent' },
        ].map((kpi, idx) => (
          <div key={idx} className={`${glassCard} p-8 group relative overflow-hidden transition-all duration-500 hover:translate-y-[-4px] hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]`}>
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
              
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{kpi.label}</div>
              <div className={`text-5xl font-black text-slate-900 italic tracking-tighter uppercase group-hover:${getColorClass(kpi.color, 'text600')} transition-colors duration-500`}>
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

      {/* Charts Section */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
        <div className={`${glassCard} lg:col-span-2 p-8 lg:p-10 relative group`}>
          <div className="absolute top-8 right-8 flex items-center gap-2">
            <TrendingUp className="size-4 text-emerald-500" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] italic font-mono">RISK_VELOCITY_SCAN</span>
          </div>
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="size-6 text-emerald-600" />
              <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-emerald-600 decoration-4 underline-offset-4">Risk Velocity Profile</h3>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-3">Monitoring temporal risk patterns across registry nodes</p>
          </div>
          <ResponsiveContainer width="100%" height={380}>
            <ComposedChart data={riskVelocity} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="barGradientHigh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="barGradientMed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 900 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 900 }} dx={-10} />
              <Tooltip content={<ForensicTooltip />} cursor={{ fill: '#f8fafc' }} />
              <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', paddingBottom: '30px', letterSpacing: '0.1em' }} />
              <Bar dataKey="low" fill="#f1f5f9" radius={[4, 4, 0, 0]} name="Baseline" barSize={35} />
              <Bar dataKey="medium" fill="url(#barGradientMed)" radius={[4, 4, 0, 0]} name="Medium Risk" barSize={35} />
              <Area type="monotone" dataKey="high" stroke="#ef4444" strokeWidth={4} fill="url(#areaGradient)" name="High Priority" animationDuration={2000} />
              <Line type="basis" dataKey="risk" stroke="#10b981" strokeWidth={4} dot={{ r: 6, fill: '#fff', strokeWidth: 3, stroke: '#10b981' }} name="Node Density" filter="url(#glow)" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className={`${glassCard} p-8 lg:p-10 relative group`}>
          <div className="absolute top-8 right-8 flex items-center gap-2">
            <Lock className="size-4 text-emerald-500" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] italic font-mono">NODE_ALLOC_V1</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase mb-8 italic underline decoration-slate-900 decoration-4 underline-offset-4">Audit Allocation</h3>
          <div className="flex flex-col items-center justify-center h-[calc(100%-80px)]">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={auditAllocation}
                  cx="50%"
                  cy="50%"
                  innerRadius={85}
                  outerRadius={115}
                  paddingAngle={10}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={12}
                  animationDuration={1500}
                >
                  {auditAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<ForensicTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label Overlay */}
            <div className="absolute top-[58%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">TOTAL_NODES</div>
              <div className="text-4xl font-black text-slate-900 italic tracking-tighter">219</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 w-full mt-10">
              {auditAllocation.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-slate-50/50 border border-slate-100 rounded-xl hover:bg-white hover:shadow-lg transition-all group/item">
                  <div className="size-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <div>
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{item.name}</div>
                    <div className="text-sm font-black text-slate-900 italic tracking-tighter">{item.value} Nodes</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Cases Section */}
      <div className={`${glassCard} p-8 lg:p-10 relative group`}>
        <div className="absolute top-8 right-8 flex items-center gap-2">
          <Fingerprint className="size-4 text-blue-500" />
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] italic font-mono">ACTIVE_REGISTRY_FEED</span>
        </div>
        <div className="mb-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Crosshair className="size-6 text-blue-600" />
              <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-blue-600 decoration-4 underline-offset-4">Registry Feed</h3>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-3">Surgical monitoring of incoming forensic threads</p>
          </div>
          <button 
            onClick={() => navigate('/auditor/cases')}
            className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-xl transition-all"
          >
            View Full Registry
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {auditCases.slice(0, 4).map((audit, i) => (
            <div 
              key={i} 
              onClick={() => navigate(`/auditor/cases/${audit.id}`)}
              className="p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:bg-white hover:shadow-2xl transition-all group/node cursor-pointer"
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                  audit.priority === 'critical' ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' : 'bg-white border border-slate-200 text-slate-500'
                }`}>
                  {audit.priority}
                </div>
                <div className="text-[9px] font-black text-slate-400 font-mono italic">#{audit.id.slice(0, 8)}</div>
              </div>
              <div className="text-sm font-black text-slate-900 uppercase italic tracking-tighter mb-1 group-hover/node:text-blue-600 transition-colors">{audit.caseNumber}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">LIABILITY: FCFA 45.2M</div>
              
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className={`size-1.5 rounded-full ${audit.riskScore > 70 ? 'bg-rose-500 animate-pulse' : 'bg-blue-500'}`} />
                  <span className="text-[10px] font-black text-slate-900 font-mono italic">{audit.riskScore}% RISK</span>
                </div>
                <ArrowUpRight className="size-4 text-slate-300 group-hover/node:text-blue-600 group-hover/node:translate-x-1 group-hover/node:-translate-y-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Auditor Validation Queue Section */}
      <div className={`${glassCard} p-8 lg:p-10 relative group mt-10`}>
        <div className="absolute top-8 right-8 flex items-center gap-2">
          <Shield className="size-4 text-emerald-500 animate-pulse" />
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] italic font-mono">AUDITOR_VALIDATION_FEED</span>
        </div>
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <ClipboardList className="size-6 text-emerald-600" />
            <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-emerald-600 decoration-4 underline-offset-4">Validation Queue</h3>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-3">Final verification of taxpayer registrations sent for review</p>
        </div>

        {reviewTaxpayers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviewTaxpayers.map((taxpayer) => {
              const initials = taxpayer.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
              return (
                <div 
                  key={taxpayer.id}
                  className="p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:bg-white hover:shadow-2xl transition-all group/validation"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-200/60">
                      REFERRAL
                    </div>
                    <div className="text-[9px] font-black text-slate-400 font-mono italic">TIN: {taxpayer.tin}</div>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="size-10 rounded-xl flex items-center justify-center text-[10px] font-black bg-slate-200 text-slate-700">
                      {initials}
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-900 uppercase italic tracking-tighter leading-tight">{taxpayer.name}</div>
                      <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{taxpayer.region}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {taxpayer.taxType.map((type: string) => (
                      <span key={type} className="px-2.5 py-0.5 bg-white border border-slate-200 text-slate-500 rounded-md text-[8px] font-black uppercase">
                        {type}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => setSelectedTaxpayer(taxpayer)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md hover:shadow-xl cursor-pointer"
                  >
                    <CheckCircle className="size-4" />
                    Review & Validate
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center bg-slate-50 rounded-3xl border border-slate-100/60">
            <div className="size-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="size-6" />
            </div>
            <div className="text-xs font-black text-slate-900 uppercase tracking-widest">Queue Status Clear</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">No administrative referrals require auditor validation.</div>
          </div>
        )}
      </div>

      {/* Validation Dialog */}
      <Dialog open={!!selectedTaxpayer} onOpenChange={(open) => !open && setSelectedTaxpayer(null)}>
        <DialogContent className="sm:max-w-2xl bg-white rounded-3xl p-0 overflow-hidden border-0 shadow-2xl animate-in zoom-in-95 duration-200">
          <DialogHeader className="px-8 pt-8 pb-4 bg-slate-50 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 border rounded-full text-[9px] font-black tracking-widest uppercase bg-blue-50 text-blue-700 border-blue-200/60">
                REFERRAL REVIEW
              </span>
              <span className="text-[10px] font-mono text-slate-400 font-black">ID: {selectedTaxpayer?.id}</span>
            </div>
            <DialogTitle className="text-2xl font-black text-slate-900 mt-3 flex items-center gap-3">
              <Fingerprint className="size-6 text-emerald-600" />
              Final Validation: {selectedTaxpayer?.name}
            </DialogTitle>
            <DialogDescription className="text-slate-500 font-bold mt-2 uppercase tracking-wider text-[10px]">
              Perform Auditor Clearance and Registry Inscription
            </DialogDescription>
          </DialogHeader>

          {selectedTaxpayer && (
            <div className="p-8 space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Taxpayer Name</span>
                  <div className="text-sm font-black text-slate-800">{selectedTaxpayer.name}</div>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">TIN Reference</span>
                  <div className="text-sm font-black text-slate-800 font-mono">{selectedTaxpayer.tin}</div>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Contact Email</span>
                  <div className="text-sm font-black text-slate-800">{selectedTaxpayer.email}</div>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Contact Phone</span>
                  <div className="text-sm font-black text-slate-800 font-mono">{selectedTaxpayer.phone}</div>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl md:col-span-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Registered Address</span>
                  <div className="text-sm font-black text-slate-800">{selectedTaxpayer.address}</div>
                </div>
              </div>

              <div className="p-4 bg-amber-50/50 border border-amber-200/60 rounded-2xl flex items-start gap-3">
                <AlertTriangle className="size-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] font-black text-amber-800 uppercase tracking-wider">Auditor Clearance Action Required</div>
                  <p className="text-[9px] font-medium text-slate-600 mt-1 uppercase tracking-wide leading-normal">
                    This request was sent by the Tax Administrator for final registry clearance. Verify integrity markers and select action below to commit to state.
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
            <button
              onClick={() => setSelectedTaxpayer(null)}
              className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  updateTaxpayer({ ...selectedTaxpayer, status: 'suspended' });
                  setSelectedTaxpayer(null);
                  toast.error('Registration Rejected', { description: `${selectedTaxpayer.name} has been rejected by the auditor.` });
                }}
                className="px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors shadow-md shadow-rose-100 cursor-pointer"
              >
                Reject & Suspend
              </button>
              <button
                onClick={() => {
                  updateTaxpayer({ ...selectedTaxpayer, status: 'active' });
                  setSelectedTaxpayer(null);
                  toast.success('Registration Approved', { description: `${selectedTaxpayer.name} is now an active registry node.` });
                }}
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors shadow-md shadow-emerald-100 cursor-pointer"
              >
                Approve & Inscribe
              </button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
