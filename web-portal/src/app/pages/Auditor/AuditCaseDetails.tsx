import { getColorClass } from '../../utils/colorClasses';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { 
  ArrowLeft, AlertTriangle, Clock, FileText, CheckCircle, Shield, 
  User, Banknote, Activity, Zap, ShieldCheck, History, 
  ChevronRight, MoreHorizontal, Download, Eye, ExternalLink,
  Lock, Fingerprint, Crosshair, TrendingUp, TrendingDown, Layers, RefreshCcw, X, Upload
} from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';
import { supabase } from '../../lib/supabase';
import type { AuditCase } from '../../types';

export default function AuditCaseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { taxpayers } = useMockData();
  const [auditCase, setAuditCase] = useState<AuditCase | null>(null);
  const taxpayer = auditCase ? taxpayers.find(t => t.id === auditCase.taxpayerId) : null;
  const [showEscalateModal, setShowEscalateModal] = useState(false);

  useEffect(() => {
    supabase.from('audit_cases').select('*').eq('id', id).maybeSingle().then(({ data }) => {
      if (data) setAuditCase({
        id: data.id, taxpayerId: data.taxpayer_id, caseNumber: data.case_number,
        status: data.status, priority: data.priority, assignedTo: data.assigned_to,
        openedDate: data.opened_date, closedDate: data.closed_date,
        findings: data.findings, riskScore: data.risk_score,
      });
    });
  }, [id]);
  const [showTerminateModal, setShowTerminateModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [escalateReason, setEscalateReason] = useState('');

  const glassCard = 'bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] overflow-hidden';
  const terminalGrid = "bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:30px_30px]";

  if (!auditCase || !taxpayer) {
    return <div className="p-12 text-center font-black uppercase tracking-widest text-slate-400">Node not found in registry</div>;
  }

  const isCritical = auditCase.riskScore > 75;

  return (
    <div className={`min-h-screen bg-[#f8fafc] relative overflow-hidden ${terminalGrid} p-8 lg:p-12`}>
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] size-[50%] bg-blue-400/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] size-[50%] bg-rose-400/5 blur-[120px] rounded-full" />

      {/* Header Section */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="flex-1">
          <button
            onClick={() => navigate('/auditor/cases')}
            className="flex items-center gap-3 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all mb-8 shadow-sm group"
          >
            <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
            Registry Exit
          </button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="px-3 py-1 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] italic">Investigation Node</div>
            <div className={`size-1.5 rounded-full animate-pulse ${isCritical ? 'bg-rose-500' : 'bg-emerald-500'}`} />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] font-mono">NODE_ACTIVE_{auditCase.id.slice(-4)}</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.9] mb-4">
            {auditCase.caseNumber.split('-')[0]} <span className={`${isCritical ? 'text-rose-600' : 'text-blue-600'} underline decoration-slate-900 decoration-8 underline-offset-8`}>{auditCase.caseNumber.split('-')[1]}</span>
          </h1>
          
          <p className="text-sm text-slate-400 font-bold uppercase tracking-[0.4em] mt-8 flex items-center gap-3">
            <Crosshair className={`size-4 ${isCritical ? 'text-rose-600' : 'text-blue-600'}`} />
            Forensic analysis for {taxpayer.name}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowEscalateModal(true)}
            className="px-8 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-xl transition-all shadow-sm hover:border-orange-400 hover:text-orange-600"
          >
            Escalate Protocol
          </button>
          <button 
            onClick={() => setShowTerminateModal(true)}
            className={`px-8 py-4 ${isCritical ? 'bg-rose-600 shadow-rose-200' : 'bg-emerald-600 shadow-emerald-200'} text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg`}
          >
            Terminate Case
          </button>
        </div>

        {/* Escalate Modal */}
        {showEscalateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setShowEscalateModal(false)} />
            <div className="relative bg-white rounded-xl p-10 shadow-2xl w-full max-w-md animate-in zoom-in-90 duration-300">
              <button onClick={() => setShowEscalateModal(false)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-xl"><X className="size-4" /></button>
              <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-2">Escalate Protocol</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono mb-8">Case: {auditCase?.caseNumber}</p>
              <div className="space-y-4 mb-8">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Escalation Level</div>
                {['Senior Auditor Review', 'Legal Department', 'Tax Authority Oversight', 'Criminal Investigation Unit'].map(opt => (
                  <label key={opt} className="flex items-center gap-3 p-4 rounded-2xl border border-slate-100 hover:border-orange-400 cursor-pointer transition-colors">
                    <input type="radio" name="escalate" value={opt} onChange={(e) => setEscalateReason(e.target.value)} className="accent-orange-500" />
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">{opt}</span>
                  </label>
                ))}
              </div>
              <button 
                onClick={() => { setShowEscalateModal(false); toast.success('Protocol Escalated', { description: escalateReason || 'Case escalated to higher authority.' }); }}
                className="w-full py-4 bg-orange-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-700 transition-all"
              >
                Confirm Escalation
              </button>
            </div>
          </div>
        )}

        {/* Terminate Modal */}
        {showTerminateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setShowTerminateModal(false)} />
            <div className="relative bg-white rounded-xl p-10 shadow-2xl w-full max-w-md animate-in zoom-in-90 duration-300">
              <button onClick={() => setShowTerminateModal(false)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-xl"><X className="size-4" /></button>
              <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-2">Terminate Case</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono mb-4">Case: {auditCase?.caseNumber}</p>
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl mb-8">
                <p className="text-xs text-rose-700 font-bold">This action will close the case and archive all associated evidence. This cannot be undone.</p>
              </div>
              <div className="space-y-4 mb-8">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Closure Reason</div>
                {['Investigation Complete - No Violation', 'Settled Out of Court', 'Insufficient Evidence', 'Transferred to Prosecution'].map(opt => (
                  <label key={opt} className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 hover:border-rose-400 cursor-pointer transition-colors">
                    <input type="radio" name="terminate" value={opt} className="accent-rose-500" />
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">{opt}</span>
                  </label>
                ))}
              </div>
              <button 
                onClick={() => { setShowTerminateModal(false); navigate('/auditor/cases'); toast.success('Case Terminated', { description: 'Case archived and removed from active registry.' }); }}
                className="w-full py-4 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all"
              >
                Confirm Termination
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Timeline & Indicators */}
        <div className="lg:col-span-2 space-y-10">
          {/* Tactical Timeline */}
          <div className={`${glassCard} p-8 lg:p-10 relative group`}>
            <div className="absolute top-8 right-8 flex items-center gap-2">
              <History className="size-4 text-blue-500" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] italic font-mono">PROTOCOL_TIMELINE_V1</span>
            </div>
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="size-6 text-blue-600" />
                <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-blue-600 decoration-4 underline-offset-4">Audit Case Timeline</h3>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-3">High-fidelity sequence of forensic investigative actions</p>
            </div>
            
            <div className="space-y-12 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
              {[
                { date: 'May 05, 2024', title: 'Registry Node Flagged', desc: 'AI detected unusual round-number transaction patterns across Q1 clusters.', icon: AlertTriangle, color: 'rose' },
                { date: 'May 06, 2024', title: 'Auditor Node Assigned', desc: 'Case assigned to Lead Forensic Auditor for surgical data review.', icon: User, color: 'blue' },
                { date: 'May 06, 2024', title: 'Formal Evidence Request', desc: 'Protocol 4-A initiated: Request for Q1 bank statements sent to taxpayer.', icon: FileText, color: 'orange' },
              ].map((step, i) => (
                <div key={i} className="relative pl-14 group/step">
                  <div className={`absolute left-0 top-0 size-10 rounded-2xl bg-white border-2 border-slate-100 shadow-sm flex items-center justify-center group-hover/step:${getColorClass(step.color, 'border400')} transition-all`}>
                    <step.icon className={`size-4 ${getColorClass(step.color, 'text500')}`} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 italic">{step.date}</div>
                    <h4 className="text-lg font-black text-slate-900 uppercase italic tracking-tighter group-hover/step:text-blue-600 transition-colors">{step.title}</h4>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed mt-2 max-w-2xl">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Indicators Grid */}
          <div className={`${glassCard} p-8 lg:p-10 relative group`}>
            <div className="absolute top-8 right-8 flex items-center gap-2">
              <Fingerprint className="size-4 text-rose-500" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] italic font-mono">RISK_NODES_MAP</span>
            </div>
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <Crosshair className="size-6 text-rose-600" />
                <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-rose-600 decoration-4 underline-offset-4">Forensic Risk Indicators</h3>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-3">Surgical analysis of individual threat vectors</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Temporal Anomaly Frequency', score: 85, icon: Clock, color: 'rose' },
                { label: 'Related Entity Connectivity', score: 42, icon: Layers, color: 'blue' },
                { label: 'Refund/Offset Discrepancies', score: 91, icon: RefreshCcw, color: 'rose' },
                { label: 'Registry ID Multiplicity', score: 15, icon: ShieldCheck, color: 'emerald' },
              ].map((risk, i) => (
                <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:bg-white hover:shadow-xl transition-all group/risk">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-2 ${getColorClass(risk.color, 'bg500_10')} rounded-xl`}>
                      <risk.icon className={`size-4 ${getColorClass(risk.color, 'text600')}`} />
                    </div>
                    <div className="text-xl font-black text-slate-900 font-mono italic">{risk.score}%</div>
                  </div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">{risk.label}</div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${risk.score > 75 ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]' : 'bg-blue-600'}`} 
                      style={{ width: `${risk.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Case Summary & Evidence */}
        <div className="space-y-10">
          {/* Case Summary Card */}
          <div className="relative group bg-slate-950 p-10 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="absolute -right-12 -bottom-12 size-48 text-blue-500/10 group-hover:scale-125 transition-transform duration-700">
              <Shield className="size-full" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-blue-500/20 rounded-2xl border border-blue-500/30">
                  <Shield className="size-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white uppercase italic tracking-tighter">Case Summary</h3>
                  <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest font-mono">ID: {auditCase.id.slice(0, 12)}...</div>
                </div>
              </div>
              
              <div className="space-y-6">
                {[
                  { label: 'Target Entity', value: taxpayer.name, icon: User },
                  { label: 'Entity Registry', value: taxpayer.tin, icon: Lock, mono: true },
                  { label: 'Risk Telemetry', value: `${auditCase.riskScore} / 100`, icon: AlertTriangle, color: isCritical ? 'text-rose-400' : 'text-blue-400' },
                  { label: 'Threat Liability', value: 'FCFA 45.2M', icon: Banknote, mono: true },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0 group/item">
                    <div className="flex items-center gap-3">
                      <item.icon className="size-4 text-slate-500 group-hover/item:text-blue-400 transition-colors" />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
                    </div>
                    <span className={`text-xs font-black uppercase italic tracking-tighter ${item.color || 'text-slate-200'} ${item.mono ? 'font-mono' : ''}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => navigate(`/auditor/taxpayer/${taxpayer.id}`)}
                className="w-full mt-10 py-5 bg-white text-slate-950 hover:bg-blue-600 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl"
              >
                <Eye className="size-4" />
                Open 360° Profile
              </button>
            </div>
          </div>

          {/* Evidence Vault */}
          <div className={`${glassCard} p-8 lg:p-10 relative group`}>
            <div className="absolute top-8 right-8">
              <Lock className="size-4 text-emerald-500" />
            </div>
            <div className="mb-8">
              <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-emerald-600 decoration-4 underline-offset-4 italic">Evidence Vault</h3>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-3 italic">Secure forensic document repository</p>
            </div>
            
            <div className="space-y-4">
              {[
                { name: 'VAT_Q1_FORENSIC.pdf', size: '2.4 MB', status: 'VERIFIED' },
                { name: 'BANK_NODES_MAY.pdf', size: '1.2 MB', status: 'VERIFIED' },
                { name: 'CLUSTER_4_INVOICES.zip', size: '15.8 MB', status: 'SCANNING' },
              ].map((file, i) => (
                <div 
                  key={i} 
                  onClick={() => toast.success('Download Started', { description: `${file.name} (${file.size}) downloading...` })}
                  className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-lg transition-all group/file cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover/file:bg-emerald-500 group-hover/file:text-white transition-all">
                      <FileText className="size-5" />
                    </div>
                    <div>
                      <div className="text-[11px] font-black text-slate-900 italic tracking-tighter uppercase mb-1">{file.name}</div>
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{file.size} • {file.status}</div>
                    </div>
                  </div>
                  <Download className="size-4 text-slate-300 group-hover/file:text-emerald-500 transition-colors" />
                </div>
              ))}

              {/* Upload Modal */}
              {showUploadModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                  <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setShowUploadModal(false)} />
                  <div className="relative bg-white rounded-xl p-10 shadow-2xl w-full max-w-md animate-in zoom-in-90 duration-300">
                    <button onClick={() => setShowUploadModal(false)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-xl"><X className="size-4" /></button>
                    <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-2">Upload Evidence</h3>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono mb-8">Add documents to evidence vault</p>
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center mb-6 hover:border-emerald-400 transition-colors">
                      <Upload className="size-8 text-slate-300 mx-auto mb-3" />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Drop files here or click to browse</p>
                    </div>
                    <button 
                      onClick={() => { setShowUploadModal(false); toast.success('Evidence Uploaded', { description: 'Document added to secure evidence vault.' }); }}
                      className="w-full py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest"
                    >
                      Upload to Vault
                    </button>
                  </div>
                </div>
              )}

              <button 
                onClick={() => setShowUploadModal(true)}
                className="w-full mt-4 py-4 border-2 border-dashed border-slate-200 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50/30 transition-all flex items-center justify-center gap-3"
              >
                <Zap className="size-4" />
                Upload Evidence Node
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
