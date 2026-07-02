import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Undo2, CheckCircle2, XCircle, Search, Filter, Banknote, ArrowUpRight, Plus, Terminal, Clock, Eye, Activity, X, FileText } from 'lucide-react';

export default function RefundsAdjustments() {
  const [activeTab, setActiveTab] = useState<'refunds' | 'adjustments'>('refunds');
  
  const glassCard = 'bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] overflow-hidden';
  const terminalGrid = "bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:30px_30px]";

  const [records, setRecords] = useState([
    { id: 'REF-1002', name: 'John Doe Enterprise', reason: 'Overpayment on VAT', amount: 350, status: 'pending', date: '2024-05-10' },
    { id: 'REF-1005', name: 'Alpha Tech Solutions', reason: 'System Error - Double Charge', amount: 1200, status: 'approved', date: '2024-05-09' },
    { id: 'ADJ-8821', name: 'Global Logistics', reason: 'Manual Penalty Waiver', amount: 150, status: 'pending', date: '2024-05-10' },
    { id: 'ADJ-8845', name: 'Nexus Corp', reason: 'Late Fee Adjustment', amount: 500, status: 'approved', date: '2024-05-08' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal States
  const [showNewForm, setShowNewForm] = useState(false);
  const [quickAdjustType, setQuickAdjustType] = useState<'credit' | 'debit' | null>(null);
  const [viewRecord, setViewRecord] = useState<any>(null);

  const displayedRecords = useMemo(() => {
    let data = records.filter(item => activeTab === 'refunds' ? item.id.startsWith('REF') : item.id.startsWith('ADJ'));
    if (searchTerm) {
      data = data.filter(item => 
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.reason.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return data;
  }, [activeTab, searchTerm, records]);

  const handleAction = (id: string, newStatus: string) => {
    setRecords(records.map(r => r.id === id ? { ...r, status: newStatus } : r));
    toast.success(`Record ${id} has been ${newStatus}.`, { description: `Ledger dynamically updated.` });
  };

  const handleNewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowNewForm(false);
    toast.success(`${activeTab === 'refunds' ? 'Refund' : 'Adjustment'} Request Created`, { description: 'Forwarded to authorization queue.' });
  };

  const handleQuickAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    setQuickAdjustType(null);
    toast.success(`Manual Ledger Update Successful`, { description: 'Cryptographic hash appended to audit log.' });
  };

  return (
    <div className={`min-h-screen bg-[#f8fafc] relative overflow-hidden ${terminalGrid}`}>
      {/* Background Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/5 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="p-6 lg:p-10 space-y-10 relative z-10 max-w-[1600px] mx-auto pb-20">
        {/* Compact Elite Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative group cursor-pointer">
                <div className="size-5 rounded-full bg-blue-500/20 animate-ping absolute inset-0" />
                <div className="size-5 rounded-full bg-blue-600 relative border-[3px] border-white shadow-xl" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-blue-700 uppercase tracking-[0.4em]">Ledger Terminal</span>
                  <span className="text-slate-300">/</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Node: FISCAL-MATRIX-01</span>
                </div>
                <div className="h-1 w-32 bg-blue-600/10 mt-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 w-full animate-loading shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-none italic uppercase">
              Refunds & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Adjustments</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={() => toast.info('Filter Ledger Open', { description: 'Opening parameter matrix.' })} className="group flex items-center gap-4 px-8 py-5 bg-white border-2 border-slate-100 text-slate-600 rounded-xl text-[11px] font-black uppercase tracking-[0.3em] transition-all hover:border-blue-500 hover:text-blue-600 shadow-sm">
              <Filter className="size-4" />
              <span>Filter Ledger</span>
            </button>
            <button onClick={() => setShowNewForm(true)} className="group relative flex items-center gap-4 px-8 py-5 bg-slate-950 text-white rounded-xl text-[11px] font-black uppercase tracking-[0.3em] overflow-hidden transition-all hover:scale-[1.03] hover:shadow-[0_30px_60px_-15px_rgba(15,23,42,0.4)] active:scale-[0.97]">
              <Undo2 className="size-4 relative z-10 group-hover:-rotate-90 transition-transform duration-500" />
              <span className="relative z-10">New {activeTab === 'refunds' ? 'Refund' : 'Adjustment'}</span>
            </button>
          </div>
        </div>

        {/* Tactical Tab Interface */}
        <div className="flex gap-4 p-2 bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-xl shadow-lg w-fit">
          <button
            onClick={() => setActiveTab('refunds')}
            className={`flex items-center gap-3 px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'refunds' ? 'bg-blue-600 text-white shadow-xl scale-[1.02]' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Undo2 className="size-4" />
            Refund Requests
          </button>
          <button
            onClick={() => setActiveTab('adjustments')}
            className={`flex items-center gap-3 px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'adjustments' ? 'bg-blue-600 text-white shadow-xl scale-[1.02]' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <ArrowUpRight className="size-4" />
            Adjustment Approvals
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            {/* Forensic Data Matrix */}
            <div className={glassCard}>
              <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={`SCANNING_${activeTab.toUpperCase()}...`}
                      className="pl-12 pr-6 py-4 bg-white border-2 border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 w-[320px] transition-all placeholder:text-slate-300"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr>
                      <th className="px-8 py-6 text-left text-[10px] font-black italic text-slate-400 uppercase tracking-[0.2em]">Request ID</th>
                      <th className="px-6 py-6 text-left text-[10px] font-black italic text-slate-400 uppercase tracking-[0.2em]">Taxpayer</th>
                      <th className="px-6 py-6 text-left text-[10px] font-black italic text-slate-400 uppercase tracking-[0.2em]">Reason / Date</th>
                      <th className="px-6 py-6 text-left text-[10px] font-black italic text-slate-400 uppercase tracking-[0.2em]">Amount</th>
                      <th className="px-6 py-6 text-left text-[10px] font-black italic text-slate-400 uppercase tracking-[0.2em]">Status</th>
                      <th className="px-8 py-6 text-right text-[10px] font-black italic text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {displayedRecords.map((item, i) => (
                      <tr key={i} className="hover:bg-blue-50/20 transition-all group">
                        <td className="px-8 py-6">
                          <span className="text-xs font-black text-slate-900 tracking-tight font-mono">{item.id}</span>
                        </td>
                        <td className="px-6 py-6">
                          <span className="text-sm font-black text-slate-700 tracking-tighter uppercase">{item.name}</span>
                        </td>
                        <td className="px-6 py-6">
                          <div className="text-sm font-bold text-slate-500 tracking-tight">{item.reason}</div>
                          <div className="flex items-center gap-2 text-slate-400 font-mono italic text-[10px] font-bold mt-1">
                            <Clock className="size-3" />
                            {item.date}
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <span className="text-sm font-black text-slate-900 tracking-tighter">FCFA ${item.amount.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-6">
                          <span className={`inline-flex px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                            item.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            item.status === 'denied' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                            'bg-orange-50 text-orange-600 border-orange-100'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          {item.status === 'pending' ? (
                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleAction(item.id, 'approved')} className="flex items-center gap-2 px-4 py-2 border-2 border-emerald-100 text-emerald-600 bg-emerald-50 hover:bg-emerald-600 hover:text-white rounded-xl transition-colors font-black text-[10px] uppercase tracking-widest">
                                <CheckCircle2 className="size-3.5" /> Approve
                              </button>
                              <button onClick={() => handleAction(item.id, 'denied')} className="flex items-center gap-2 px-4 py-2 border-2 border-rose-100 text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white rounded-xl transition-colors font-black text-[10px] uppercase tracking-widest">
                                <XCircle className="size-3.5" /> Deny
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => setViewRecord(item)} className="group/btn relative p-3 bg-white border-2 border-slate-100 rounded-2xl transition-all hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-110 active:scale-95" title="View Details">
                              <Eye className="size-4 text-slate-400 group-hover/btn:text-blue-600 transition-colors" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Live Audit Trail */}
            <div className={`${glassCard} p-6`}>
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <Activity className="size-4 text-blue-500" />
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Live Audit Trail</h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">System Nominal</span>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { time: '14:02:45', action: 'Refund REF-1004 Processed', user: 'System Auto-Node' },
                  { time: '13:45:12', action: 'Adjustment ADJ-8820 Approved', user: 'Emily Rodriguez' },
                  { time: '11:20:05', action: 'New Refund Request REF-1005', user: 'Taxpayer Portal' },
                ].map((log, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-mono text-slate-400 font-bold">{log.time}</span>
                      <span className="text-xs font-bold text-slate-700">{log.action}</span>
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{log.user}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-10">
            {/* Refund Summary Panel */}
            <div className={`${glassCard} p-8 relative overflow-hidden group`}>
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Banknote className="size-24 text-slate-900" />
              </div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] mb-8 italic underline decoration-blue-600 decoration-4 underline-offset-4 w-fit">Summary Node</h3>
              
              <div className="space-y-6 relative z-10">
                <div className="p-6 bg-blue-50/50 border-2 border-blue-100 rounded-xl transition-all hover:scale-[1.02] hover:shadow-xl">
                  <div className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] mb-2">Total Refunded (MTD)</div>
                  <div className="text-4xl font-black text-blue-700 tracking-tighter italic uppercase">FCFA 12,450</div>
                </div>

                <div className="p-6 bg-orange-50/50 border-2 border-orange-100 rounded-xl transition-all hover:scale-[1.02] hover:shadow-xl">
                  <div className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] mb-2">Pending Requests</div>
                  <div className="text-4xl font-black text-orange-700 tracking-tighter italic uppercase">18</div>
                  <div className="w-full bg-orange-200/50 rounded-full h-1 mt-4 overflow-hidden">
                    <div className="bg-orange-500 h-full w-[65%] shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Adjustment Panel */}
            <div className={`${glassCard} p-8 border-t-4 border-t-indigo-500 relative overflow-hidden group`}>
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Terminal className="size-24 text-slate-900" />
              </div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] mb-6 italic underline decoration-indigo-600 decoration-4 underline-offset-4 w-fit">Quick Adjust</h3>
              <p className="text-[10px] font-bold text-slate-500 mb-6 tracking-wide leading-relaxed relative z-10">
                Apply manual credit or debit to a taxpayer ledger with reason.
              </p>
              
              <div className="space-y-3 relative z-10">
                <button onClick={() => setQuickAdjustType('credit')} className="flex items-center justify-between w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl transition-all hover:border-emerald-500 hover:shadow-md group/action">
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-700">Apply Credit</span>
                  <Plus className="size-4 text-emerald-500 transition-transform group-hover/action:scale-125" />
                </button>
                <button onClick={() => setQuickAdjustType('debit')} className="flex items-center justify-between w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl transition-all hover:border-rose-500 hover:shadow-md group/action">
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-700">Apply Debit</span>
                  <Undo2 className="size-4 text-rose-500 transition-transform group-hover/action:-rotate-90" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}

      {/* New Request Modal */}
      {showNewForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-10 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowNewForm(false)} />
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl p-10 border border-slate-100">
            <button onClick={() => setShowNewForm(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
              <X className="size-5" />
            </button>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic mb-8">
              New {activeTab === 'refunds' ? 'Refund' : 'Adjustment'}
            </h2>
            <form onSubmit={handleNewSubmit} className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Taxpayer TIN / Name</label>
                <input type="text" placeholder="e.g. TIN-9876543210" required className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Amount ($)</label>
                  <input type="number" placeholder="0.00" required className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-colors font-mono" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Date</label>
                  <input type="date" required className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-colors font-mono text-slate-500" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Justification Reason</label>
                <textarea rows={3} placeholder="Provide audit trail justification..." required className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-colors resize-none" />
              </div>
              <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-500/20">
                Submit Authorization
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Quick Adjust Modal */}
      {quickAdjustType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-10 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setQuickAdjustType(null)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-10 border border-slate-100 text-center">
            <button onClick={() => setQuickAdjustType(null)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
              <X className="size-5" />
            </button>
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 ${quickAdjustType === 'credit' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
              {quickAdjustType === 'credit' ? <Plus className="size-8" /> : <Undo2 className="size-8" />}
            </div>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic mb-8">
              Apply {quickAdjustType}
            </h2>
            <form onSubmit={handleQuickAdjust} className="space-y-6 text-left">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Target Ledger ID</label>
                <input type="text" placeholder="TRX- / TIN-" required className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-colors font-mono" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Value ($)</label>
                <input type="number" placeholder="0.00" required className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-colors font-mono" />
              </div>
              <button type="submit" className={`w-full py-4 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] active:scale-95 transition-all shadow-lg ${quickAdjustType === 'credit' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20'}`}>
                Execute {quickAdjustType}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* View Record Modal */}
      {viewRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-10 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setViewRecord(null)} />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-10 border border-slate-100">
            <button onClick={() => setViewRecord(null)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
              <X className="size-5" />
            </button>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
                <FileText className="size-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Ledger Record</h2>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] font-mono mt-1">{viewRecord.id}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] font-mono block mb-1">Taxpayer Entity</span>
                <div className="text-lg font-black text-slate-900 uppercase tracking-tight">{viewRecord.name}</div>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] font-mono block mb-1">Date Logged</span>
                <div className="text-lg font-black text-slate-900 tracking-tight font-mono">{viewRecord.date}</div>
              </div>
              <div className="col-span-2 p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] font-mono block mb-1">Stated Reason</span>
                <div className="text-sm font-bold text-slate-700 leading-relaxed">{viewRecord.reason}</div>
              </div>
              <div className="col-span-2 flex items-center justify-between p-6 bg-slate-900 rounded-2xl text-white">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Total Asset Value</span>
                <span className="text-3xl font-black italic tracking-tighter">FCFA ${viewRecord.amount.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button onClick={() => setViewRecord(null)} className="px-8 py-3 bg-white border-2 border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 transition-colors">
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-loading { animation: loading 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
