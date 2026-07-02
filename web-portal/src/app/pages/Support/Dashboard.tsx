import React, { useState } from 'react';
import { Ticket, Clock, CheckCircle, AlertCircle, ArrowUpRight, Shield, MessageSquare, Terminal, Users, Layers, Activity } from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';
import { Link } from 'react-router';
import { toast } from 'sonner';

export default function SupportDashboard() {
  const { tickets, taxpayers } = useMockData();
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('all');

  const totalTickets      = tickets.length;
  const openTickets       = tickets.filter(t => t.status === 'open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in_progress').length;
  const resolvedTickets   = tickets.filter(t => t.status === 'resolved').length;

  const filteredTickets = tickets.filter(t => 
    activeStatusFilter === 'all' ? true : t.status === activeStatusFilter
  );

  const glassCard = 'bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] overflow-hidden';
  const terminalGrid = "bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:30px_30px]";

  const statusStyles: Record<string, string> = {
    open:        'bg-orange-500/10 text-orange-600 border-orange-500/20',
    in_progress: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    resolved:    'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  };

  const priorityStyles: Record<string, string> = {
    high:   'bg-red-500/10 text-red-600 border-red-500/20',
    medium: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    low:    'bg-slate-500/10 text-slate-600 border-slate-500/20',
  };

  const kpis = [
    { 
      label: 'Total Incidents', 
      value: totalTickets, 
      icon: Ticket, 
      glow: 'from-blue-500/20 to-transparent',
      borderColor: 'border-t-blue-500/50',
      badgeColor: 'bg-blue-50 text-blue-600',
      sub: 'TOTAL_QUEUE_LOAD',
      statusKey: 'all'
    },
    { 
      label: 'Open Requests', 
      value: openTickets, 
      icon: AlertCircle, 
      glow: 'from-orange-500/20 to-transparent',
      borderColor: 'border-t-orange-500/50',
      badgeColor: 'bg-orange-50 text-orange-600',
      sub: 'ATTENTION_REQUIRED',
      statusKey: 'open'
    },
    { 
      label: 'In Progress', 
      value: inProgressTickets, 
      icon: Clock, 
      glow: 'from-amber-500/20 to-transparent',
      borderColor: 'border-t-amber-500/50',
      badgeColor: 'bg-amber-50 text-amber-600',
      sub: 'ACTIVE_TELEMETRY',
      statusKey: 'in_progress'
    },
    { 
      label: 'Resolved Nodes', 
      value: resolvedTickets, 
      icon: CheckCircle, 
      glow: 'from-emerald-500/20 to-transparent',
      borderColor: 'border-t-emerald-500/50',
      badgeColor: 'bg-emerald-50 text-emerald-600',
      sub: 'SOLVED_COMPLIANCE',
      statusKey: 'resolved'
    },
  ];

  return (
    <div className={`min-h-screen bg-[#f8fafc] relative overflow-hidden ${terminalGrid} p-8 lg:p-12`}>
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] size-[50%] bg-blue-400/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] size-[50%] bg-indigo-400/5 blur-[120px] rounded-full" />
      </div>

      {/* Header Section */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="px-3 py-1 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] italic">Support Hub Terminal</div>
            <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] font-mono">SYSTEM_ONLINE</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.9]">
            Support <span className="text-blue-600 underline decoration-slate-900 decoration-8 underline-offset-8">Dashboard</span>
          </h1>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-[0.4em] mt-8 flex items-center gap-3 italic">
            <Terminal className="size-4 text-blue-600" />
            Ticketing Forensics & Taxpayer Resolution System
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Link 
            to="/support/tickets"
            className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
          >
            <MessageSquare className="size-4" />
            Open Ticket Queue
          </Link>
        </div>
      </div>

      {/* Reworked Premium KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 relative z-10">
        {kpis.map((kpi, idx) => (
          <div 
            key={idx} 
            onClick={() => {
              setActiveStatusFilter(kpi.statusKey);
              toast.info('Filter Applied', { description: `Showing requests with status: ${kpi.statusKey.toUpperCase()}` });
            }}
            className={`${glassCard} border-t-4 ${kpi.borderColor} p-8 group relative overflow-hidden transition-all duration-500 hover:translate-y-[-6px] hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] cursor-pointer
              ${activeStatusFilter === kpi.statusKey ? 'ring-2 ring-blue-500 bg-blue-500/5' : ''}`}
          >
            {/* Ambient Radial Gradient Glow */}
            <div className={`absolute -right-16 -bottom-16 size-48 bg-gradient-radial ${kpi.glow} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
            
            {/* Custom Icon Watermark background */}
            <div className="absolute -right-4 -bottom-4 size-24 text-slate-900/[0.02] transition-all duration-700 group-hover:scale-125 group-hover:-rotate-12 pointer-events-none">
              <kpi.icon className="size-full" />
            </div>

            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex items-center justify-between mb-6">
                <span className={`inline-flex px-2.5 py-1 rounded-md text-[8px] font-black uppercase tracking-wider font-mono ${kpi.badgeColor}`}>
                  {kpi.sub}
                </span>
                <kpi.icon className="size-5 text-slate-400 group-hover:text-slate-900 transition-colors" />
              </div>
              
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">{kpi.label}</span>
                <span className="text-5xl font-black text-slate-900 font-mono tracking-tighter block mb-4 italic">
                  {kpi.value}
                </span>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest font-mono">STATUS: {activeStatusFilter === kpi.statusKey ? 'SELECTED' : 'ACTIVE'}</span>
                <div className={`size-1.5 rounded-full ${activeStatusFilter === kpi.statusKey ? 'bg-blue-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Redesigned High-Design Real Table */}
      <div className={`${glassCard} relative z-10`}>
        <div className="px-8 py-7 border-b border-slate-200/50 flex flex-col md:flex-row md:items-center justify-between bg-white/50 gap-4">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-blue-600 decoration-4 underline-offset-4 flex items-center gap-3">
              Recent Support Requests
              {activeStatusFilter !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-wider normal-case font-sans">
                  Status: {activeStatusFilter.replace('_', ' ')}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveStatusFilter('all');
                    }}
                    className="hover:text-red-300 transition-colors ml-1 font-bold text-sm text-white"
                  >
                    ×
                  </button>
                </span>
              )}
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-3">Live feed of active system incidents</p>
          </div>
          <Link 
            to="/support/tickets" 
            className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors"
          >
            View Entire Queue <ArrowUpRight className="size-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-200/50 text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">
              <tr>
                <th className="px-8 py-5">Incident ID</th>
                <th className="px-8 py-5">Subject Details</th>
                <th className="px-8 py-5">Taxpayer Identity</th>
                <th className="px-8 py-5">Priority Level</th>
                <th className="px-8 py-5">Queue Status</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTickets.slice(0, 5).map((ticket) => {
                const taxpayer = ticket.taxpayerId ? taxpayers.find(tp => tp.id === ticket.taxpayerId) : null;
                return (
                  <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5 text-xs font-mono font-black text-slate-500">
                      {ticket.ticketNumber}
                    </td>
                    <td className="px-8 py-5">
                      <Link
                        to={`/support/tickets/${ticket.id}`}
                        className="text-xs font-bold text-slate-800 hover:text-blue-600 transition-colors block truncate max-w-[240px]"
                      >
                        {ticket.subject}
                      </Link>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mt-1">
                        Reported {new Date(ticket.createdDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2.5">
                        <div className="size-7 rounded-lg bg-slate-900 text-white flex items-center justify-center text-[10px] font-black uppercase italic">
                          {taxpayer?.name.charAt(0) || 'U'}
                        </div>
                        <span className="text-xs font-bold text-slate-700">{taxpayer?.name || 'Guest User'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex px-2.5 py-1 rounded-md text-[8px] font-black uppercase tracking-wider border ${priorityStyles[ticket.priority]}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${statusStyles[ticket.status]}`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <Link
                        to={`/support/tickets/${ticket.id}`}
                        className="inline-flex items-center justify-center size-8 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 rounded-xl transition-all shadow-sm group-hover:scale-105"
                      >
                        <ArrowUpRight className="size-4" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

