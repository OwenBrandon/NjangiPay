import React, { useState } from 'react';
import { Link } from 'react-router';
import { Search, Ticket, Clock, CheckCircle, AlertCircle, Eye, User, MessageSquare, Terminal, SlidersHorizontal } from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';

export default function TicketList() {
  const { tickets, taxpayers } = useMockData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  const glassCard = 'bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] overflow-hidden';
  const terminalGrid = "bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:30px_30px]";

  const statusStyles: Record<string, string> = {
    open:        'bg-orange-500/10 text-orange-600 border-orange-500/20',
    in_progress: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    under_review:'bg-purple-500/10 text-purple-600 border-purple-500/20',
    resolved:    'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    closed:      'bg-slate-500/10 text-slate-600 border-slate-500/20',
  };

  const priorityStyles: Record<string, string> = {
    high:   'bg-red-500/10 text-red-600 border-red-500/20',
    urgent: 'bg-red-500/10 text-red-600 border-red-500/20',
    medium: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    low:    'bg-slate-500/10 text-slate-600 border-slate-500/20',
  };

  const unassignedCount = tickets.filter(t => !t.assignedTo && t.status !== 'resolved' && t.status !== 'closed').length;
  const awaitingResponseCount = tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;
  const urgentCount = tickets.filter(t => t.priority === 'high' || t.priority === 'urgent').length;

  const filteredTickets = tickets.filter(t => {
    const taxpayer = t.taxpayerId ? taxpayers.find(tp => tp.id === t.taxpayerId) : null;
    const matchSearch = !searchQuery ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      taxpayer?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'all' || t.status === filterStatus;
    const matchPriority = filterPriority === 'all' || t.priority === filterPriority;
    return matchSearch && matchStatus && matchPriority;
  }).sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
    if (sortBy === 'priority') {
      const order: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 };
      return (order[a.priority] ?? 2) - (order[b.priority] ?? 2);
    }
    return 0;
  });

  return (
    <div className={`min-h-screen bg-[#f8fafc] relative overflow-hidden ${terminalGrid} p-8 lg:p-12`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] size-[50%] bg-blue-400/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] size-[50%] bg-indigo-400/5 blur-[120px] rounded-full" />
      </div>

      {/* Header Section */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="px-3 py-1 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] italic">Queue Operations</div>
            <div className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] font-mono">QUEUE_ACTIVE</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.9]">
            Ticket <span className="text-blue-600 underline decoration-slate-900 decoration-8 underline-offset-8">Queue</span>
          </h1>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-[0.4em] mt-8 flex items-center gap-3 italic">
            <Terminal className="size-4 text-blue-600" />
            Manage and Respond to Taxpayer Support Requests
          </p>
        </div>
      </div>

      {/* Stats Cards - Real Data */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 relative z-10">
        {[
          { label: 'Unassigned', count: unassignedCount, icon: User, color: 'text-blue-600', bg: 'bg-blue-500/10 border-blue-500/20' },
          { label: 'Awaiting Response', count: awaitingResponseCount, icon: MessageSquare, color: 'text-orange-600', bg: 'bg-orange-500/10 border-orange-500/20' },
          { label: 'High / Urgent', count: urgentCount, icon: Clock, color: 'text-red-600', bg: 'bg-red-500/10 border-red-500/20' },
        ].map((stat, i) => (
          <div key={i} className={`${glassCard} p-6 flex items-center justify-between group hover:translate-y-[-2px] transition-all`}>
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div>
              <div className="text-3xl font-black text-slate-800 font-mono italic">{stat.count}</div>
            </div>
            <div className={`p-4 ${stat.bg} ${stat.color} border rounded-2xl`}>
              <stat.icon className="size-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Queue Table Card */}
      <div className={`${glassCard} relative z-10`}>
        <div className="px-8 py-6 border-b border-slate-200/50 flex flex-col md:flex-row md:items-center justify-between bg-white/50 gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by ticket #, subject or taxpayer..."
                className="w-full pl-11 pr-4 py-3 bg-white/50 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all font-medium"
              />
            </div>
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className={`flex items-center justify-center gap-2 px-5 py-3 border rounded-2xl text-[10px] font-black uppercase tracking-wider transition-colors ${showFilterPanel || filterStatus !== 'all' || filterPriority !== 'all' ? 'border-blue-400 bg-blue-50 text-blue-600' : 'border-slate-200 text-slate-700 bg-white/50 hover:bg-white'}`}
            >
              <SlidersHorizontal className="size-3.5" />
              All Filters {(filterStatus !== 'all' || filterPriority !== 'all') ? '•' : ''}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Sort:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="text-[10px] font-black uppercase tracking-wider text-slate-700 bg-transparent outline-none cursor-pointer border-b border-slate-300 pb-1"
            >
              <option value="newest">Newest First</option>
              <option value="priority">Priority (High-Low)</option>
            </select>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilterPanel && (
          <div className="px-8 py-6 bg-slate-50/50 border-b border-slate-200/50 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Status</div>
              <div className="flex flex-wrap gap-2">
                {['all', 'open', 'in_progress', 'under_review', 'resolved', 'closed'].map(s => (
                  <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all ${filterStatus === s ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'}`}>{s.replace('_', ' ')}</button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Priority</div>
              <div className="flex flex-wrap gap-2">
                {['all', 'urgent', 'high', 'medium', 'low'].map(p => (
                  <button key={p} onClick={() => setFilterPriority(p)} className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all ${filterPriority === p ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'}`}>{p}</button>
                ))}
              </div>
            </div>
            <button onClick={() => { setFilterStatus('all'); setFilterPriority('all'); }} className="self-end px-4 py-2 border border-slate-200 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-colors">Reset Filters</button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-200/50 text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">
              <tr>
                <th className="px-8 py-5">Ticket Info</th>
                <th className="px-8 py-5">Taxpayer</th>
                <th className="px-8 py-5">Category</th>
                <th className="px-8 py-5">Priority</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-sm text-slate-400">No tickets found matching your filters.</td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => {
                  const taxpayer = ticket.taxpayerId ? taxpayers.find(tp => tp.id === ticket.taxpayerId) : null;
                  return (
                    <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <Link
                            to={`/support/tickets/${ticket.id}`}
                            className="text-sm font-black text-slate-800 hover:text-blue-600 transition-colors block truncate max-w-xs"
                          >
                            {ticket.subject}
                          </Link>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-mono mt-1">
                            {ticket.ticketNumber} • Created {new Date(ticket.createdDate).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-[10px] font-black uppercase italic">
                            {taxpayer?.name.charAt(0) || 'U'}
                          </div>
                          <span className="text-xs font-bold text-slate-800">{taxpayer?.name || 'Guest User'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-xs font-black uppercase tracking-wider text-slate-500">
                        {ticket.category || 'General'}
                      </td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex px-2.5 py-1 rounded-md text-[8px] font-black uppercase tracking-wider border ${priorityStyles[ticket.priority] || priorityStyles.medium}`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${statusStyles[ticket.status] || statusStyles.open}`}>
                          {ticket.status === 'open' ? <AlertCircle className="size-3" /> :
                           ticket.status === 'in_progress' ? <Clock className="size-3" /> :
                           <CheckCircle className="size-3" />}
                          {ticket.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <Link
                          to={`/support/tickets/${ticket.id}`}
                          className="inline-flex items-center justify-center size-9 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 rounded-xl transition-all shadow-sm group-hover:scale-105"
                        >
                          <Eye className="size-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
