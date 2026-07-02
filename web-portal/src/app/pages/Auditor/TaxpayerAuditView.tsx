import { getColorClass } from '../../utils/colorClasses';
import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { 
  ArrowLeft, Shield, FileCheck, Receipt, AlertTriangle, 
  Search, History, Download, TrendingUp, Banknote,
  Activity, Zap, Crosshair, Globe, Lock, Fingerprint,
  Calendar, Clock, RefreshCcw, Eye, FileText, Target
} from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';

export default function TaxpayerAuditView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { taxpayers, taxReturns, payments: allPayments } = useMockData();
  const taxpayer = taxpayers.find(t => t.id === (id || ''));
  const filings = taxReturns.filter(tr => tr.taxpayerId === (id || ''));
  const payments = allPayments.filter(p => p.taxpayerId === (id || ''));

  const glassCard = 'bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] overflow-hidden';
  const terminalGrid = "bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:30px_30px]";

  if (!taxpayer) {
    return <div className="p-12 text-center font-black uppercase tracking-widest text-slate-400 font-mono">NODE_NOT_FOUND_IN_REGISTRY</div>;
  }

  return (
    <div className={`min-h-screen bg-[#f8fafc] relative overflow-hidden ${terminalGrid} p-8 lg:p-12`}>
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] size-[50%] bg-blue-400/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] size-[50%] bg-emerald-400/5 blur-[120px] rounded-full" />

      {/* Header Section */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all mb-8 shadow-sm group"
          >
            <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
            Registry Backtrack
          </button>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="px-3 py-1 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] italic">360° Forensic Node</div>
            <div className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] font-mono">RESTRICTED_ACCESS_7.4</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.9]">
            Forensic <span className="text-blue-600 underline decoration-slate-900 decoration-8 underline-offset-8">Audit View</span>
          </h1>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-[0.4em] mt-8 flex items-center gap-3 italic">
            <Fingerprint className="size-4 text-blue-600" />
            Surgical analysis for {taxpayer.name} • TIN: {taxpayer.tin}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => toast.success('Export Ready', { description: `Audit file for ${taxpayer.name} is downloading.` })}
            className="flex items-center gap-2 px-8 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-xl transition-all shadow-sm"
          >
            <Download className="size-4" />
            Export Audit File
          </button>
          <button 
            onClick={() => toast.success('Investigation Started', { description: `New investigation case opened for ${taxpayer.name}.` })}
            className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            <Shield className="size-4" />
            Start Investigation
          </button>
        </div>
      </div>

      {/* KPI Matrix */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {[
          { label: 'Total Revenue', value: 'FCFA 452.8k', icon: Banknote, color: 'emerald', sub: 'LIQUID_ASSETS', glow: 'from-emerald-500/20 to-transparent' },
          { label: 'Compliance Rate', value: '92%', icon: FileCheck, color: 'blue', sub: 'REGISTRY_PARITY', glow: 'from-blue-500/20 to-transparent' },
          { label: 'Risk Flags', value: '14', icon: AlertTriangle, color: 'rose', sub: 'THREAT_NODES', glow: 'from-rose-500/20 to-transparent' },
          { label: 'Audit Count', value: '3', icon: History, color: 'purple', sub: 'HISTORICAL_THREADS', glow: 'from-purple-500/20 to-transparent' },
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
              <div className={`text-5xl font-black text-slate-900 italic tracking-tighter uppercase group-hover:${getColorClass(kpi.color, 'text600')} transition-colors duration-500 font-mono`}>
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

      {/* Two-Column Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        {/* Filing History */}
        <div className={`${glassCard} p-8 lg:p-10 relative group`}>
          <div className="absolute top-8 right-8 flex items-center gap-2">
            <FileText className="size-4 text-blue-500" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] italic font-mono">FILING_TELEMETRY</span>
          </div>
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="size-6 text-blue-600" />
              <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-blue-600 decoration-4 underline-offset-4">Filing History Telemetry</h3>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-3">Surgical analysis of historical tax return submissions</p>
          </div>
          <div className="space-y-4">
            {filings.map((filing) => (
              <div key={filing.id} className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:shadow-xl transition-all group/f cursor-pointer">
                <div className="flex items-center gap-5">
                  <div className="size-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center group-hover/f:bg-blue-600 group-hover/f:text-white transition-all">
                    <FileCheck className="size-5" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900 uppercase italic tracking-tighter group-hover/f:text-blue-600 transition-colors">{filing.taxType} • {filing.period}</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">FILED: {new Date(filing.filingDate || filing.dueDate).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-slate-900 font-mono italic tracking-tighter uppercase">{"FCFA "}{filing.amount.toLocaleString()}</div>
                  <span className={`text-[9px] font-black uppercase tracking-widest ${filing.status === 'filed' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {filing.status} PROTOCOL
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction Log */}
        <div className={`${glassCard} p-8 lg:p-10 relative group`}>
          <div className="absolute top-8 right-8 flex items-center gap-2">
            <RefreshCcw className="size-4 text-emerald-500" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] italic font-mono">FISCAL_LOG_V1</span>
          </div>
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <Receipt className="size-6 text-emerald-600" />
              <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-emerald-600 decoration-4 underline-offset-4">Fiscal Transaction Log</h3>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-3">High-fidelity sequence of verified financial interactions</p>
          </div>
          <div className="space-y-4">
            {payments.slice(0, 5).map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:shadow-xl transition-all group/p cursor-pointer">
                <div className="flex items-center gap-5">
                  <div className="size-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center group-hover/p:bg-emerald-600 group-hover/p:text-white transition-all">
                    <Receipt className="size-5" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900 font-mono uppercase italic tracking-tighter group-hover/p:text-emerald-600 transition-colors">{payment.transactionRef}</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{payment.paymentMethod.replace('_', ' ')} • NODE_Q1</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-slate-900 font-mono italic tracking-tighter uppercase">{"FCFA "}{payment.amount.toLocaleString()}</div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{payment.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Behavioral Anomalies */}
      <div className="relative group bg-slate-950 p-12 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="absolute -right-16 -top-16 size-64 text-rose-500/10 group-hover:scale-125 transition-transform duration-700">
          <AlertTriangle className="size-full" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-3 bg-rose-500/20 rounded-2xl border border-rose-500/30">
              <Zap className="size-6 text-rose-400" />
            </div>
            <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Behavioral Risk Anomalies</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { tag: 'Timing Anomaly', desc: 'Surgical detection of frequent filings after 10 PM on weekends across multiple nodes.', priority: 'medium', icon: Clock },
              { tag: 'Amount Rounding', desc: 'AI scan shows 90% of transactions are precise multiples of 1,000, indicating manual intervention.', priority: 'high', icon: Target },
              { tag: 'Entity Linkage', desc: 'Critical cross-linkage: Shared IP address detected with 3 other high-risk TIN entities.', priority: 'critical', icon: Globe },
            ].map((anomaly, i) => (
              <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden group/a hover:bg-white/10 transition-all duration-500">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="px-4 py-1.5 bg-white/10 rounded-xl border border-white/10">
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest italic">{anomaly.tag}</span>
                    </div>
                    <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border
                      ${anomaly.priority === 'critical' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 
                        anomaly.priority === 'high' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 
                        'bg-slate-700 text-slate-400 border-white/10'}`}
                    >
                      {anomaly.priority} THREAT
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed group-hover/a:text-white transition-colors">{anomaly.desc}</p>
                </div>
                <div className="absolute right-0 bottom-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <anomaly.icon className="size-20 text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
