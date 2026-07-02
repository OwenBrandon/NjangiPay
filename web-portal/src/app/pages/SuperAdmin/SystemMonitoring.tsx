import { getColorClass } from '../../utils/colorClasses';
import React, { useState, useEffect } from 'react';
import { Activity, AlertCircle, CheckCircle2, XCircle, Clock, Server, Terminal, RefreshCw, Archive } from 'lucide-react';
import { mockApiHealth as initialApiHealth, mockErrorLogs } from '../../services/mockData';
import { toast } from 'sonner';

export default function SystemMonitoring() {
  const [apiHealth, setApiHealth] = useState(initialApiHealth);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    toast('Pinging nodes...');
    setTimeout(() => {
      setApiHealth(prev => prev.map(api => ({
        ...api,
        latency: Math.max(10, api.latency + (Math.random() > 0.5 ? 10 : -10))
      })));
      setIsRefreshing(false);
      toast.success('System Diagnostics Refreshed');
    }, 1500);
  };

  const glassCard = 'bg-white rounded-2xl border border-slate-200/60 shadow-2xl shadow-blue-900/5 overflow-hidden';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-emerald-500 bg-emerald-50 border-emerald-200';
      case 'degraded': return 'text-orange-500 bg-orange-50 border-orange-200';
      case 'down': return 'text-rose-500 bg-rose-50 border-rose-200';
      default: return 'text-slate-400 bg-slate-50 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle2 className="size-4" />;
      case 'degraded': return <AlertCircle className="size-4" />;
      case 'down': return <XCircle className="size-4" />;
      default: return null;
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level.toLowerCase()) {
      case 'error': return 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)] border border-rose-400';
      case 'warning': return 'bg-orange-400 text-white shadow-[0_0_15px_rgba(251,146,60,0.4)] border border-orange-300';
      case 'info': return 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] border border-blue-400';
      default: return 'bg-slate-500 text-white border border-slate-400';
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] relative overflow-hidden">
      {/* Intelligence Background Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-slate-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="p-6 lg:p-10 space-y-12 relative z-10">
        {/* Telemetry Command Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="size-3 rounded-full bg-emerald-500 animate-ping absolute inset-0" />
                <div className="size-3 rounded-full bg-emerald-600 relative" />
              </div>
              <span className="px-3 py-1 bg-emerald-100/50 border border-emerald-200 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">System Telemetry Hub</span>
              <span className="text-slate-400">•</span>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Live Operations Matrix</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">System Monitoring</h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleRefresh}
              className={`flex items-center gap-2 px-6 py-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-sm hover:bg-emerald-100 transition-colors ${isRefreshing ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <RefreshCw className={`size-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              Run Diagnostics
            </button>
          </div>
        </div>

        {/* System Service Nodes (API Health) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {apiHealth.map((api, index) => {
            const glowColor = api.status === 'healthy' ? 'emerald' : api.status === 'degraded' ? 'orange' : 'rose';
            
            return (
              <div key={api.service} className={`${glassCard} transition-all duration-500 hover:-translate-y-1 group relative flex flex-col`}>
                <div className={`absolute -right-16 -top-16 w-32 h-32 ${getColorClass(glowColor, 'bg500_10')} rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
                
                <div className="p-8 relative z-10 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <Server className="size-4 text-slate-400" />
                        <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight">{api.service}</h3>
                      </div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded-md">NODE {index + 1}</span>
                        • SYSTEM ROUTINE
                      </p>
                    </div>
                    
                    <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] shadow-sm ${getStatusColor(api.status)} shrink-0`}>
                      {getStatusIcon(api.status)}
                      {api.status}
                    </div>
                  </div>

                  <div className="mt-auto space-y-6">
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Response Latency</div>
                        <div className="text-3xl font-black text-slate-800 tracking-tighter flex items-baseline gap-1">
                          {api.latency > 0 ? api.latency : '\u2014'}
                          {api.latency > 0 && <span className="text-sm font-bold text-slate-400 tracking-normal uppercase">ms</span>}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Last Sync</div>
                        <div className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">2 MINS AGO</div>
                      </div>
                    </div>

                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          api.status === 'healthy' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 
                          api.status === 'degraded' ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 
                          'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]'
                        }`}
                        style={{ width: api.status === 'healthy' ? '100%' : api.status === 'degraded' ? '60%' : '0%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Forensic Error Grid */}
        <div className={`${glassCard}`}>
          <div className="px-8 py-6 border-b border-slate-100/50 bg-white/40 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-100 text-slate-600 rounded-[1rem] shadow-sm">
                <Terminal className="size-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">System Event Logs</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Raw Terminal Output</p>
              </div>
            </div>
            <button 
              onClick={() => toast('Archiving logs to cold storage...')}
              className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-slate-800 transition-colors"
            >
              <Archive className="size-4" />
              Access Full Archive
            </button>
          </div>

          <div className="overflow-x-auto bg-slate-900">
            <table className="w-full border-collapse">
              <thead className="bg-slate-950/80 border-b border-slate-800">
                <tr>
                  <th className="px-8 py-5 text-left text-[11px] font-black italic text-slate-400 uppercase tracking-[0.2em]">
                    Timestamp (UTC)
                  </th>
                  <th className="px-6 py-5 text-left text-[11px] font-black italic text-slate-400 uppercase tracking-[0.2em]">
                    Severity
                  </th>
                  <th className="px-6 py-5 text-left text-[11px] font-black italic text-slate-400 uppercase tracking-[0.2em]">
                    Source Node
                  </th>
                  <th className="px-8 py-5 text-left text-[11px] font-black italic text-slate-400 uppercase tracking-[0.2em]">
                    System Message
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {mockErrorLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/50 transition-all group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <Clock className="size-3.5 text-slate-500" />
                        <span className="font-mono text-xs font-bold text-slate-300 tracking-tight">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest inline-block ${getLevelBadge(log.level)}`}>
                        {log.level}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-300 font-black uppercase tracking-widest text-[10px] rounded-lg">
                        {log.source}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <code className="font-mono text-[13px] text-emerald-400 tracking-tight bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 block">
                        &gt; {log.message}
                      </code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
