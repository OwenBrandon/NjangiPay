import React, { useState, useRef } from 'react';
import { Banknote, FileText, AlertCircle, CheckCircle, Calendar, ArrowUpRight, X, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { useMockData } from '../../contexts/MockDataContext';
import { useAuth } from '../../contexts/AuthContext';

export default function TaxpayerDashboard() {
  const [showPaidModal, setShowPaidModal] = useState(false);
  const [showComplianceModal, setShowComplianceModal] = useState(false);
  const deadlinesRef = useRef<HTMLDivElement>(null);

  const { taxpayers, taxReturns, payments } = useMockData();
  const { currentUser } = useAuth();

  const taxpayer = taxpayers.find(t => t.userId === currentUser?.id || t.email === currentUser?.email);
  const taxpayerReturns = taxReturns.filter(tr => tr.taxpayerId === taxpayer?.id);
  const taxpayerPayments = payments.filter(p => p.taxpayerId === taxpayer?.id && p.status === 'completed');

  // Calculate Total Paid dynamically
  const totalPaidAmount = taxpayerPayments.reduce((sum, p) => sum + p.amount, 0);
  const formatAmount = (amt: number) => {
    if (amt >= 1000) {
      return `FCFA ${(amt / 1000).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}k`;
    }
    return `FCFA ${amt.toLocaleString()}`;
  };
  const totalPaidStr = formatAmount(totalPaidAmount);

  // Calculate Pending Returns dynamically
  const pendingReturnsCount = taxpayerReturns.filter(tr => tr.status === 'not_filed' || tr.status === 'overdue').length;

  // Upcoming Deadlines count
  const upcomingDeadlinesCount = pendingReturnsCount;

  // Compliance Score calculation
  const totalFilingRequirements = taxpayerReturns.length;
  const overdueCount = taxpayerReturns.filter(tr => tr.status === 'overdue').length;
  const complianceScoreVal = totalFilingRequirements > 0
    ? Math.max(0, 100 - Math.round((overdueCount / totalFilingRequirements) * 100))
    : 100;
  const complianceScoreStr = `${complianceScoreVal}%`;

  const solidCard = 'bg-white rounded-2xl border border-slate-200/60 shadow-lg shadow-blue-900/5 overflow-hidden';

  const kpis = [
    { title: "Total Paid", value: totalPaidStr, icon: Banknote, borderColor: 'border-t-emerald-500', badgeColor: 'bg-emerald-50 text-emerald-600', sub: 'TAXES_PAID', action: () => setShowPaidModal(true) },
    { title: "Pending Returns", value: pendingReturnsCount, icon: FileText, borderColor: 'border-t-orange-500', badgeColor: 'bg-orange-50 text-orange-600', sub: 'PENDING_RETURNS', action: () => deadlinesRef.current?.scrollIntoView({ behavior: 'smooth' }) },
    { title: "Upcoming Deadlines", value: upcomingDeadlinesCount, icon: AlertCircle, borderColor: 'border-t-rose-500', badgeColor: 'bg-rose-50 text-rose-600', sub: 'DUE_DATES', action: () => deadlinesRef.current?.scrollIntoView({ behavior: 'smooth' }) },
    { title: "Compliance Score", value: complianceScoreStr, icon: CheckCircle, borderColor: 'border-t-blue-500', badgeColor: 'bg-blue-50 text-blue-600', sub: 'COMPLIANCE_STATUS', action: () => setShowComplianceModal(true) },
  ];

  // Group taxpayer's payments by tax type
  const paymentsByType = taxpayerPayments.reduce((acc, p) => {
    acc[p.taxType] = (acc[p.taxType] || 0) + p.amount;
    return acc;
  }, {} as Record<string, number>);

  const taxTypeNames: Record<string, string> = {
    VAT: 'Value Added Tax (VAT)',
    CIT: 'Corporate Income Tax (CIT)',
    WHT: 'Withholding Tax (WHT)',
    PIT: 'Personal Income Tax (PIT)',
  };

  const paymentBreakdown = Object.entries(paymentsByType).map(([type, amount]) => {
    const pct = totalPaidAmount > 0 ? Math.round((amount / totalPaidAmount) * 100) : 0;
    const colors = ['bg-blue-600', 'bg-indigo-500', 'bg-emerald-500', 'bg-amber-500'];
    const colorIndex = Object.keys(taxTypeNames).indexOf(type) % colors.length;
    return {
      name: taxTypeNames[type] || `${type} Tax`,
      amount: `FCFA ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      pct,
      color: colors[colorIndex >= 0 ? colorIndex : 0]
    };
  });

  const upcomingDeadlines = taxpayerReturns
    .filter(tr => tr.status === 'not_filed' || tr.status === 'overdue')
    .map(tr => {
      const isOverdue = tr.status === 'overdue';
      return {
        tax: taxTypeNames[tr.taxType] || `${tr.taxType} Return`,
        code: `${tr.taxType}_RETURNS`,
        period: tr.period.toUpperCase(),
        due: new Date(tr.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
        amount: `FCFA ${tr.amount.toLocaleString()}`,
        status: isOverdue ? 'CRITICAL' : 'PENDING',
        color: isOverdue 
          ? 'text-rose-500 bg-rose-50 border-rose-200/50' 
          : 'text-orange-500 bg-orange-50 border-orange-200/50',
      };
    });

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-8 lg:p-12 space-y-10 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Header Section */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="size-3 rounded-full bg-blue-500 animate-ping absolute inset-0" />
              <div className="size-3 rounded-full bg-blue-600 relative" />
            </div>
            <span className="px-3 py-1 bg-blue-100/50 border border-blue-200 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Taxpayer Portal</span>
            <span className="text-slate-400">•</span>
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">{taxpayer?.businessName || taxpayer?.name || 'Overview'}</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">My Dashboard</h1>
          <p className="text-sm text-slate-500 font-medium">Your tax overview, outstanding returns and obligations</p>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        {kpis.map((kpi, idx) => (
          <div 
            key={idx} 
            onClick={kpi.action}
            className={`${solidCard} border-t-4 ${kpi.borderColor} p-8 group transition-all duration-500 hover:-translate-y-1 hover:shadow-xl cursor-pointer hover:bg-slate-50/50`}
          >
            <div className="flex flex-col h-full justify-between gap-6">
              <div className="flex items-center justify-between">
                <span className={`inline-flex px-2.5 py-1 rounded-md text-[8px] font-black uppercase tracking-wider ${kpi.badgeColor}`}>
                  {kpi.sub}
                </span>
                <kpi.icon className="size-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </div>
              
              <div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">{kpi.title}</span>
                <span className="text-4xl font-black text-slate-950 tracking-tight block">
                  {kpi.value}
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">STATUS: OK</span>
                <div className="size-1.5 rounded-full bg-emerald-500" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Deadlines */}
      <div ref={deadlinesRef} className={`${solidCard} p-8 lg:p-10 relative z-10 max-w-4xl`}>
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Upcoming Deadlines</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Active filing requirements due this period</p>
          </div>
          <Link 
            to="/taxpayer/obligations" 
            className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1"
          >
            View All Obligations <ArrowUpRight className="size-3.5" />
          </Link>
        </div>

        <div className="space-y-4">
          {upcomingDeadlines.length > 0 ? (
            upcomingDeadlines.map((item, idx) => (
              <div 
                key={idx} 
                className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-2xl hover:border-blue-200 hover:bg-white transition-all duration-300 group gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3.5 bg-slate-900 text-white rounded-xl group-hover:bg-blue-600 transition-colors">
                    <Calendar className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-800">{item.tax}</span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black border ${item.color}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <span>Period: {item.period}</span>
                      <span>•</span>
                      <span className="text-rose-500">Due: {item.due}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-6 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-right">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Est. Amount</span>
                    <span className="text-lg font-black text-slate-950">{item.amount}</span>
                  </div>
                  <Link
                    to="/taxpayer/filing"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-blue-600 transition-colors"
                  >
                    File Return
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-slate-50 border border-slate-100 rounded-2xl">
              <CheckCircle2 className="size-12 text-emerald-500 mx-auto mb-3" />
              <h4 className="text-sm font-black text-slate-900 uppercase">You're All Compliant!</h4>
              <p className="text-xs text-slate-500 mt-1">There are no outstanding or overdue tax returns required for filing.</p>
            </div>
          )}
        </div>
      </div>

      {/* Total Paid Modal */}
      {showPaidModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setShowPaidModal(false)} />
          <div className="relative bg-white rounded-2xl p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] w-full max-w-md animate-in zoom-in-95 duration-300">
            <button onClick={() => setShowPaidModal(false)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-xl"><X className="size-4" /></button>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2 flex items-center gap-2">
              <Banknote className="size-6 text-blue-600" />
              Paid Ledger Breakdown
            </h3>
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-8">Summary of YTD tax contributions</p>

            <div className="space-y-4 mb-8">
              {paymentBreakdown.length > 0 ? (
                paymentBreakdown.map((item, i) => (
                  <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-2">
                      <span>{item.name}</span>
                      <span className="font-black text-slate-950">{item.amount}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                      </div>
                      <span className="text-[9px] font-black text-slate-400">{item.pct}%</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-slate-500">No payment records found.</div>
              )}
            </div>

            <button 
              onClick={() => setShowPaidModal(false)}
              className="w-full py-4 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
            >
              Close Breakdown
            </button>
          </div>
        </div>
      )}

      {/* Compliance Score Modal */}
      {showComplianceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setShowComplianceModal(false)} />
          <div className="relative bg-white rounded-2xl p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] w-full max-w-md animate-in zoom-in-95 duration-300">
            <button onClick={() => setShowComplianceModal(false)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-xl"><X className="size-4" /></button>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2 flex items-center gap-2">
              <CheckCircle2 className="size-6 text-emerald-600" />
              Compliance Status
            </h3>
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-8">Registered tax authority status</p>

            <div className="space-y-4 mb-8">
              {[
                { label: 'Filing Integrity', desc: overdueCount === 0 ? 'No delayed returns on record' : `${overdueCount} overdue filing(s) on record`, status: overdueCount === 0 ? 'COMPLIANT' : 'WARNING', statusColor: overdueCount === 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-rose-50 border-rose-200 text-rose-600' },
                { label: 'Payment Accuracy', desc: 'Ledger reconciles to banking records', status: 'COMPLIANT', statusColor: 'bg-emerald-50 border-emerald-200 text-emerald-600' },
                { label: 'Document Integrity', desc: 'Registry records fully verified', status: 'COMPLIANT', statusColor: 'bg-emerald-50 border-emerald-200 text-emerald-600' },
                { label: 'Audit Flags', desc: '0 active investigation cases', status: 'CLEAR', statusColor: 'bg-emerald-50 border-emerald-200 text-emerald-600' },
              ].map((bench, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 border border-slate-100 rounded-xl">
                  <div>
                    <div className="text-xs font-bold text-slate-800">{bench.label}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{bench.desc}</div>
                  </div>
                  <span className={`px-2 py-0.5 border text-[8px] font-black rounded ${bench.statusColor}`}>
                    {bench.status}
                  </span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setShowComplianceModal(false)}
              className="w-full py-4 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
            >
              Close Benchmarks
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
