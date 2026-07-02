import { getColorClass } from '../../utils/colorClasses';
import React, { useState } from 'react';
import { 
  AlertTriangle, Shield, TrendingUp, Eye, FileText, Users, Banknote, 
  AlertCircle, CheckCircle, XCircle, Activity, Zap, Search, Filter, 
  Download, Target, Layers, Globe, Fingerprint, Lock, Crosshair,
  ArrowUpRight, ArrowDownRight, TrendingDown, Calendar, Clock, RefreshCcw
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, 
  ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
  AreaChart, Area
} from 'recharts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

const riskScoreData = [
  { date: 'Jan', high: 12, medium: 45, low: 234 },
  { date: 'Feb', high: 18, medium: 52, low: 198 },
  { date: 'Mar', high: 15, medium: 48, low: 221 },
  { date: 'Apr', high: 22, medium: 67, low: 189 },
];

const anomalyData = [
  { x: 15000, y: 45, z: 85, taxpayer: 'TP-001', risk: 'high' },
  { x: 25000, y: 12, z: 35, taxpayer: 'TP-002', risk: 'low' },
  { x: 45000, y: 78, z: 92, taxpayer: 'TP-003', risk: 'critical' },
  { x: 32000, y: 34, z: 55, taxpayer: 'TP-004', risk: 'medium' },
  { x: 18000, y: 56, z: 68, taxpayer: 'TP-005', risk: 'medium' },
  { x: 28000, y: 23, z: 42, taxpayer: 'TP-007', risk: 'low' },
  { x: 38000, y: 67, z: 78, taxpayer: 'TP-008', risk: 'high' },
];

const patternHistoryData = {
  temporal: [
    { month: 'Jan', volume: 120, threats: 15 },
    { month: 'Feb', volume: 150, threats: 18 },
    { month: 'Mar', volume: 220, threats: 32 },
    { month: 'Apr', volume: 180, threats: 22 },
    { month: 'May', volume: 290, threats: 45 },
  ],
  vat: [
    { month: 'Jan', volume: 450, threats: 42 },
    { month: 'Feb', volume: 480, threats: 51 },
    { month: 'Mar', volume: 390, threats: 38 },
    { month: 'Apr', volume: 620, threats: 74 },
    { month: 'May', volume: 510, threats: 59 },
  ],
  identity: [
    { month: 'Jan', volume: 80, threats: 4 },
    { month: 'Feb', volume: 95, threats: 7 },
    { month: 'Mar', volume: 110, threats: 9 },
    { month: 'Apr', volume: 140, threats: 14 },
    { month: 'May', volume: 130, threats: 11 },
  ],
};

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

export default function RiskFraudDetection() {
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const navigate = useNavigate();

  // Threat cases state
  const [threatCases, setThreatCases] = useState([
    { id: 'AUD-THR-201', taxpayer: 'Global Logistics', score: 85, category: 'VAT Offset Anomaly', priority: 'critical', date: 'May 20, 2026' },
    { id: 'AUD-THR-202', taxpayer: 'Alpha Tech', score: 68, category: 'Temporal Inconsistency', priority: 'high', date: 'May 22, 2026' },
    { id: 'AUD-THR-203', taxpayer: 'Central Power', score: 92, category: 'Multi-Entity Linking', priority: 'critical', date: 'May 24, 2026' },
    { id: 'AUD-THR-204', taxpayer: 'Standard Trust', score: 45, category: 'Rounding Pattern Alert', priority: 'medium', date: 'May 25, 2026' },
  ]);

  // Pattern states
  const [selectedPattern, setSelectedPattern] = useState<'temporal' | 'vat' | 'identity'>('temporal');

  // ML models state
  const [mlModels, setMlModels] = useState([
    { id: 'MOD-XGB-01', name: 'XGBoost VAT Anomaly Detector', version: 'v4.1.2', accuracy: 98.6, status: 'Active', precision: 99.1, recall: 98.2 },
    { id: 'MOD-NLC-02', name: 'Neural Link Identity Classifier', version: 'v2.0.1', accuracy: 94.1, status: 'Active', precision: 95.0, recall: 93.3 },
    { id: 'MOD-RFT-03', name: 'Random Forest Temporal Clusterer', version: 'v3.2.0', accuracy: 91.4, status: 'Maintenance', precision: 92.5, recall: 90.4 },
  ]);
  
  const [retrainingModelId, setRetrainingModelId] = useState<string | null>(null);
  const [retrainProgress, setRetrainProgress] = useState(0);

  const handleRetrainModel = (modelId: string) => {
    setMlModels(prev => prev.map(m => m.id === modelId ? { ...m, status: 'Training' } : m));
    setRetrainProgress(0);
    setRetrainingModelId(modelId);
  };

  React.useEffect(() => {
    if (!retrainingModelId) return;
    if (retrainProgress >= 100) {
      setMlModels(prev => prev.map(m => m.id === retrainingModelId ? { ...m, status: 'Active', accuracy: Number((m.accuracy + (Math.random() * 0.8 - 0.2)).toFixed(1)) } : m));
      toast.success('Model Retrained', {
        description: `Model ${retrainingModelId} retrained successfully and redeployed.`
      });
      setRetrainingModelId(null);
      return;
    }
    const timer = setTimeout(() => {
      setRetrainProgress(p => p + 10);
    }, 150);
    return () => clearTimeout(timer);
  }, [retrainingModelId, retrainProgress]);
  
  const glassCard = 'bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] overflow-hidden';
  const terminalGrid = "bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:30px_30px]";

  const getScatterColor = (risk: string) => {
    switch (risk) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#eab308';
      default: return '#10b981';
    }
  };

  return (
    <div className={`min-h-screen bg-[#f8fafc] relative overflow-hidden ${terminalGrid} p-8 lg:p-12`}>
      {/* Background Blobs */}
      <div className="absolute top-[-10%] right-[-10%] size-[50%] bg-rose-400/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] size-[50%] bg-blue-400/5 blur-[120px] rounded-full" />

      {/* Header Section */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="px-3 py-1 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] italic">Risk Forensic Terminal</div>
            <div className="size-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] font-mono">THREAT_LEVEL_HIGH</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.9]">
            Risk & <span className="text-rose-600 underline decoration-slate-900 decoration-8 underline-offset-8">Detection</span>
          </h1>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-[0.4em] mt-8 flex items-center gap-3 italic">
            <AlertTriangle className="size-4 text-rose-600" />
            AI-Powered Anomaly Detection & Fraud Intelligence
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/auditor/cases')}
            className="flex items-center gap-3 px-10 py-5 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-rose-700 transition-all shadow-xl shadow-rose-200"
          >
            <AlertTriangle className="size-5" />
            View Active Alerts
          </button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="relative z-10 space-y-10">
        <TabsList className="bg-white/50 backdrop-blur-xl border border-slate-200 p-1.5 rounded-xl inline-flex mb-8">
          <TabsTrigger value="overview" className="px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white shadow-sm transition-all">Overview</TabsTrigger>
          <TabsTrigger value="cases" className="px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white shadow-sm transition-all">Cases</TabsTrigger>
          <TabsTrigger value="patterns" className="px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white shadow-sm transition-all">Patterns</TabsTrigger>
          <TabsTrigger value="ml" className="px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white shadow-sm transition-all">ML Models</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-12">
          {/* KPI Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'Critical Cases', value: '1', icon: AlertTriangle, color: 'rose', sub: 'THREAT_NODE_COUNT', glow: 'from-rose-500/20 to-transparent' },
              { label: 'Under Investigation', value: '1', icon: Eye, color: 'orange', sub: 'ACTIVE_FORENSICS', glow: 'from-orange-500/20 to-transparent' },
              { label: 'At Risk Volume', value: 'FCFA 1.9M', icon: Banknote, color: 'purple', sub: 'LIQUID_THREAT_GAP', glow: 'from-purple-500/20 to-transparent' },
              { label: 'Detection Accuracy', value: '93.2%', icon: Target, color: 'emerald', sub: 'MODEL_CONFIDENCE', glow: 'from-emerald-500/20 to-transparent' },
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
                  <div className={`text-5xl font-black text-slate-900 italic tracking-tighter uppercase group-hover:${getColorClass(kpi.color, 'text600')} transition-colors duration-500 font-mono font-mono`}>
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

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className={`${glassCard} p-8 lg:p-10 relative group`}>
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="size-6 text-rose-600" />
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-rose-600 decoration-4 underline-offset-4">Risk Score Distribution</h3>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-3">Cases by risk level categorized over temporal cycles</p>
              </div>
              <ResponsiveContainer width="100%" height={380}>
                <BarChart data={riskScoreData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="distHigh" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={0.6}/>
                    </linearGradient>
                    <linearGradient id="distMed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.6}/>
                    </linearGradient>
                    <linearGradient id="distLow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#e2e8f0" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#cbd5e1" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 900 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 900 }} dx={-10} />
                  <Tooltip content={<ForensicTooltip />} cursor={{ fill: '#f8fafc' }} />
                  <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', paddingBottom: '30px', letterSpacing: '0.1em' }} />
                  <Bar dataKey="low" stackId="a" fill="url(#distLow)" name="Low Risk" barSize={45} />
                  <Bar dataKey="medium" stackId="a" fill="url(#distMed)" name="Medium Risk" barSize={45} />
                  <Bar dataKey="high" stackId="a" fill="url(#distHigh)" name="High Risk" barSize={45} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className={`${glassCard} p-8 lg:p-10 relative group`}>
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                  <Globe className="size-6 text-blue-600" />
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-blue-600 decoration-4 underline-offset-4">Anomaly Detection Map</h3>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-3">Transaction amount vs. risk frequency indicators</p>
              </div>
              <ResponsiveContainer width="100%" height={380}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                  <defs>
                    <filter id="scatterGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" />
                  <XAxis type="number" dataKey="x" name="Amount" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 900 }} />
                  <YAxis type="number" dataKey="y" name="Frequency" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 900 }} />
                  <ZAxis type="number" dataKey="z" range={[200, 1500]} />
                  <Tooltip content={<ForensicTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Registry Nodes" data={anomalyData}>
                    {anomalyData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={getScatterColor(entry.risk)} 
                        className="hover:opacity-80 transition-all cursor-pointer"
                        style={{ filter: entry.risk === 'critical' ? 'url(#scatterGlow)' : 'none' }}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-6 mt-6">
                {[
                  { label: 'Critical', color: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' },
                  { label: 'High', color: 'bg-orange-500' },
                  { label: 'Medium', color: 'bg-yellow-500' },
                  { label: 'Low', color: 'bg-green-500' }
                ].map((l, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`size-3 rounded-full ${l.color}`} />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Threat Cases Tab */}
        <TabsContent value="cases" className="space-y-8 animate-in fade-in duration-200">
          <div className={`${glassCard} p-8 lg:p-10`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-rose-600 decoration-4 underline-offset-4">Threat Investigation Queue</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-3">High-risk anomalies flagged by artificial intelligence models</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-slate-400 tracking-widest font-mono">Total Alerts: {threatCases.length}</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Alert Node</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Target Entity</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Anomaly Category</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Threat Score</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Flagged Date</th>
                    <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50">
                  {threatCases.map((tc) => (
                    <tr key={tc.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-5">
                        <span className="text-sm font-black text-slate-900 font-mono tracking-tighter italic uppercase group-hover:text-rose-600 transition-colors">{tc.id}</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm font-black text-slate-900 uppercase italic tracking-tighter">{tc.taxpayer}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">{tc.category}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-black font-mono ${tc.score > 80 ? 'text-rose-600' : 'text-orange-500'}`}>{tc.score}%</span>
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${tc.score > 80 ? 'bg-rose-500' : 'bg-orange-500'}`} style={{ width: `${tc.score}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-xs font-bold text-slate-400 font-mono">{tc.date}</span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              toast.success('Investigation Opened', { description: `Forensic audit log opened for ${tc.taxpayer}.` });
                              navigate('/auditor/cases');
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                          >
                            <Eye className="size-3" />
                            Investigate
                          </button>
                          <button
                            onClick={() => {
                              setThreatCases(threatCases.filter(c => c.id !== tc.id));
                              toast.success('Alert Dismissed', { description: `Threat node ${tc.id} dismissed from forensic workspace.` });
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm"
                          >
                            <XCircle className="size-3" />
                            Dismiss
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {threatCases.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        No pending threat alerts in the active investigation queue.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Anomaly Patterns Tab */}
        <TabsContent value="patterns" className="space-y-10 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Pattern Lists */}
            <div className="lg:col-span-1 space-y-6">
              <div className="mb-4">
                <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Identified Fraud Indicators</h3>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Select a pattern node to display historic occurrence statistics</p>
              </div>

              {[
                { id: 'temporal', title: 'Temporal Round-Numbers', score: 94, volume: 'FCFA 1.2M', desc: 'Uniform transaction roundings occurring near deadlines.' },
                { id: 'vat', title: 'VAT Offset Divergence', score: 88, volume: 'FCFA 2.8M', desc: 'VAT deductions deviation from sector benchmarks.' },
                { id: 'identity', title: 'Multi-Entity Linkage', score: 65, volume: 'FCFA 450K', desc: 'Matching bank or contact details across TINs.' },
              ].map((pattern) => (
                <div
                  key={pattern.id}
                  onClick={() => setSelectedPattern(pattern.id as any)}
                  className={`${glassCard} p-6 border-2 transition-all cursor-pointer relative overflow-hidden group
                    ${selectedPattern === pattern.id ? 'border-rose-500 bg-rose-50/10 shadow-lg' : 'border-white/40 hover:border-slate-300'}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black text-slate-900 uppercase italic tracking-tighter">{pattern.title}</span>
                    <span className={`text-[10px] font-black font-mono px-2 py-0.5 rounded ${pattern.score > 85 ? 'bg-rose-50 text-rose-600' : 'bg-orange-50 text-orange-600'}`}>{pattern.score}% Match</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">{pattern.desc}</p>
                  <div className="flex items-center justify-between border-t border-slate-100/50 pt-3">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Est. Loss Exposure</span>
                    <span className="text-xs font-black text-slate-900 font-mono italic">{pattern.volume}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pattern Analytics Chart */}
            <div className="lg:col-span-2">
              <div className={`${glassCard} p-8 lg:p-10 h-full`}>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-rose-600 decoration-4 underline-offset-4">
                      {selectedPattern === 'temporal' ? 'Temporal Round-Numbers' : selectedPattern === 'vat' ? 'VAT Offset Divergence' : 'Multi-Entity Linkage'} Trend Analysis
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-3">Monthly trend index of anomaly flag frequency</p>
                  </div>
                  <div className="size-8 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer" onClick={() => toast.info('Data Refreshed', { description: 'Latest fraud patterns re-indexed.' })}>
                    <RefreshCcw className="size-4" />
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={340}>
                  <AreaChart data={patternHistoryData[selectedPattern]} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="patternGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity={0.4}/>
                        <stop offset="100%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 900 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 900 }} />
                    <Tooltip content={<ForensicTooltip />} />
                    <Area type="monotone" dataKey="threats" stroke="#ef4444" strokeWidth={3} fill="url(#patternGlow)" name="Threat Incidence" />
                    <Area type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={1} strokeDasharray="5 5" fill="none" name="Anomaly Score Index" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ML Models Tab */}
        <TabsContent value="ml" className="space-y-8 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mlModels.map((model) => (
              <div key={model.id} className={`${glassCard} p-8 relative group overflow-hidden`}>
                <div className="absolute -right-12 -bottom-12 size-40 text-slate-100 group-hover:scale-110 group-hover:text-emerald-500/5 transition-all duration-700">
                  <Zap className="size-full" />
                </div>
                
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-black text-slate-400 font-mono tracking-widest uppercase">{model.id} • {model.version}</span>
                      <h4 className="text-lg font-black text-slate-900 uppercase italic tracking-tighter mt-1">{model.name}</h4>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border
                      ${model.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}
                    >
                      {model.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-4 border-y border-slate-100">
                    <div className="text-center">
                      <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Accuracy</div>
                      <div className="text-base font-black text-slate-800 mt-1 font-mono">{model.accuracy}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Precision</div>
                      <div className="text-base font-black text-slate-800 mt-1 font-mono">{model.precision}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Recall</div>
                      <div className="text-base font-black text-slate-800 mt-1 font-mono">{model.recall}%</div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleRetrainModel(model.id)}
                      disabled={retrainingModelId !== null}
                      className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-sm disabled:opacity-40"
                    >
                      {retrainingModelId === model.id ? `Retraining (${retrainProgress}%)` : 'Retrain Model'}
                    </button>
                    
                    <button
                      onClick={() => {
                        toast.success('Diagnostics Complete', {
                          description: `${model.name} verified: F1 Score is ${(2 * (model.precision * model.recall) / (model.precision + model.recall)).toFixed(1)}%.`
                        });
                      }}
                      className="py-3 px-4 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all text-slate-600"
                    >
                      Run Diagnostics
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Retrain Progress Loader Overlay */}
          {retrainingModelId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
              <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" />
              <div className="relative bg-white rounded-xl p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] w-full max-w-md animate-in zoom-in-95 duration-300">
                <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter mb-2 flex items-center gap-2">
                  <Activity className="size-5 text-emerald-500 animate-spin" />
                  Model Training Pipeline
                </h3>
                <p className="text-[9px] text-slate-400 uppercase tracking-widest font-mono mb-6">Running model fit simulation for: {mlModels.find(m => m.id === retrainingModelId)?.name}</p>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200 mb-4">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-300" style={{ width: `${retrainProgress}%` }} />
                </div>
                <div className="text-right text-xs font-mono font-black text-emerald-600">{retrainProgress}%</div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
