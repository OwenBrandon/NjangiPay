import { useState } from 'react';
import { Banknote, Plus, Receipt, CreditCard, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { toast } from 'sonner';
import { useMockData } from '../../contexts/MockDataContext';
import { useAuth } from '../../contexts/AuthContext';
import type { Payment } from '../../types';
import PaymentSimulator from '../../components/shared/PaymentSimulator';

export default function PaymentsPage() {
  const { payments, assessments, addPayment, taxpayers } = useMockData();
  const { currentUser } = useAuth();

  const labelStyle = "block text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-2";
  const inputStyle = "w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all";
  const solidCard = 'bg-white rounded-2xl border border-slate-200/60 shadow-lg shadow-blue-900/5 overflow-hidden';

  const currentTaxpayer = taxpayers.find(t => t.userId === currentUser?.id || t.email === currentUser?.email);
  const taxpayerPayments = payments.filter(p => p.taxpayerId === currentTaxpayer?.id);
  const unpaidAssessments = assessments.filter(a => a.taxpayerId === currentTaxpayer?.id && ['pending', 'unpaid', 'partial', 'overdue', 'approved'].includes(a.status));

  const [showPayModal, setShowPayModal] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<string>('');
  const [taxType, setTaxType] = useState('VAT');
  const [method, setMethod] = useState<'bank_transfer' | 'mobile_money' | 'card' | 'cash' | 'pos' | 'check'>('bank_transfer');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPaid = taxpayerPayments
    .filter(p => p.status === 'completed')
    .reduce((acc, pay) => acc + pay.amount, 0);

  const totalOutstanding = unpaidAssessments.reduce((acc, a) => acc + (a.amount - a.amountPaid), 0);

  const taxTypeNames: Record<string, string> = {
    VAT: 'Value Added Tax (VAT)',
    CIT: 'Corporate Income Tax (CIT)',
    WHT: 'Withholding Tax (WHT)',
    PIT: 'Personal Income Tax (PIT)',
    BLT: 'Business License Tax (Patente)',
    PT: 'Property Tax',
  };

  const handleSelectAssessment = (assessmentId: string) => {
    const a = assessments.find(x => x.id === assessmentId);
    if (a) {
      setSelectedAssessment(assessmentId);
      setTaxType(a.taxType);
      setAmount(String(a.amount - a.amountPaid));
    }
  };

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Invalid Amount', { description: 'Please enter a positive payment amount.' });
      return;
    }
    setShowPayModal(false);
    setShowSimulator(true);
  };

  const handlePaymentComplete = (transactionRef: string) => {
    const amountNum = parseFloat(amount);
    const newTxn: Payment = {
      id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      taxpayerId: currentTaxpayer?.id || currentUser?.id || '8',
      assessmentId: selectedAssessment || undefined,
      amount: amountNum,
      taxType,
      paymentMethod: method,
      status: 'completed',
      transactionRef,
      paymentDate: new Date().toISOString()
    };

    addPayment(newTxn);
    setShowSimulator(false);
    setAmount('');
    setSelectedAssessment('');

    toast.success('Payment Completed & Receipt Generated', {
      description: `${amountNum.toLocaleString()} FCFA paid for ${taxTypeNames[taxType] || taxType}. Transaction: ${transactionRef}`
    });
  };

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
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Gateway</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">My Payments</h1>
          <p className="text-sm text-slate-500 font-medium">Make secure payments and view payment history</p>
        </div>
        
        <button 
          onClick={() => setShowPayModal(true)}
          className="flex items-center gap-3 px-8 py-4 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-blue-600 transition-all shadow-lg shadow-slate-200"
        >
          <Plus className="size-4" />
          New Transaction
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        <div className={`${solidCard} border-t-4 border-t-blue-500 p-8`}>
          <div className="flex justify-between items-start mb-4">
            <span className="text-[8px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 px-2 py-0.5 rounded">BALANCE_DUE</span>
            <Banknote className="size-4 text-slate-400" />
          </div>
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Outstanding Balance</span>
          <span className="text-3xl font-black text-slate-950">FCFA {totalOutstanding.toLocaleString()}</span>
        </div>

        <div className={`${solidCard} border-t-4 border-t-emerald-500 p-8`}>
          <div className="flex justify-between items-start mb-4">
            <span className="text-[8px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded">TOTAL_PAID</span>
            <Receipt className="size-4 text-slate-400" />
          </div>
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Total Paid (YTD)</span>
          <span className="text-3xl font-black text-slate-950">
            FCFA {totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        <div className={`${solidCard} border-t-4 border-t-purple-500 p-8`}>
          <div className="flex justify-between items-start mb-4">
            <span className="text-[8px] font-black uppercase tracking-wider bg-purple-50 text-purple-600 px-2 py-0.5 rounded">GATEWAY_ONLINE</span>
            <CreditCard className="size-4 text-slate-400" />
          </div>
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Connected Method</span>
          <span className="text-3xl font-black text-slate-950">DIRECT_DEBIT</span>
        </div>
      </div>

      {/* Payments History Table */}
      <div className={`${solidCard} relative z-10`}>
        <div className="px-8 py-6 border-b border-slate-200/50 bg-white/50">
          <h3 className="text-lg font-black text-slate-900 uppercase">Transaction Ledger</h3>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Record of all completed transactions</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-200/50 text-[9px] font-black text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Transaction ID</th>
                <th className="px-8 py-5">Date</th>
                <th className="px-8 py-5">Tax Type</th>
                <th className="px-8 py-5">Method</th>
                <th className="px-8 py-5">Amount</th>
                <th className="px-8 py-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {taxpayerPayments.length > 0 ? (
                taxpayerPayments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5 font-mono font-bold text-xs text-slate-900">{pay.id}</td>
                    <td className="px-8 py-5 text-xs text-slate-500 font-medium">
                      {new Date(pay.paymentDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-5 text-xs font-bold text-slate-800">{taxTypeNames[pay.taxType] || pay.taxType}</td>
                    <td className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-wider">{pay.paymentMethod.toUpperCase()}</td>
                    <td className="px-8 py-5 text-sm font-black text-slate-950">FCFA {pay.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-8 py-5 text-right">
                      <span className="inline-flex px-2.5 py-1 rounded-full border border-emerald-300 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-wider">
                        {pay.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-xs text-slate-500">No transactions recorded.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pay Modal Dialog */}
      <Dialog open={showPayModal} onOpenChange={setShowPayModal}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl p-8 bg-white border border-slate-100 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">New Transaction</DialogTitle>
            <DialogDescription className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
              Initiate a new tax payment
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleStartPayment} className="space-y-6 mt-4">
            {/* Unpaid Assessments */}
            {unpaidAssessments.length > 0 && (
              <div>
                <label className={labelStyle}>Pay Outstanding Assessment</label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {unpaidAssessments.map(a => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => handleSelectAssessment(a.id)}
                      className={`w-full text-left p-3 rounded-xl border-2 transition-all ${selectedAssessment === a.id ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-slate-300'}`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-xs font-bold text-slate-800">{a.taxType} — {a.period}</span>
                          <span className={`ml-2 text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${a.status === 'overdue' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>{a.status}</span>
                        </div>
                        <span className="text-sm font-black text-slate-900">{(a.amount - a.amountPaid).toLocaleString()} FCFA</span>
                      </div>
                      {a.referenceNumber && <p className="text-[9px] text-slate-400 font-mono mt-1">{a.referenceNumber}</p>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className={labelStyle}>Tax Category</label>
              <select
                value={taxType}
                onChange={(e) => { setTaxType(e.target.value); setSelectedAssessment(''); }}
                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xs font-black text-slate-800 focus:bg-white focus:border-blue-500 outline-none tracking-widest uppercase"
              >
                <option value="VAT">Value Added Tax (VAT)</option>
                <option value="CIT">Corporate Income Tax (CIT)</option>
                <option value="PIT">Personal Income Tax (PIT)</option>
                <option value="BLT">Business License Tax (Patente)</option>
                <option value="PT">Property Tax</option>
              </select>
            </div>
            <div>
              <label className={labelStyle}>Payment Method</label>
              <select 
                value={method} 
                onChange={(e) => setMethod(e.target.value as any)} 
                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xs font-black text-slate-800 focus:bg-white focus:border-blue-500 outline-none tracking-widest uppercase"
              >
                <option value="bank_transfer">Bank Transfer</option>
                <option value="mobile_money">Mobile Money</option>
                <option value="card">Card Payment</option>
                <option value="cash">Cash</option>
                <option value="pos">POS Terminal</option>
                <option value="check">Check</option>
              </select>
            </div>
            <div>
              <label className={labelStyle}>Amount (FCFA )</label>
              <input 
                type="number" 
                required
                placeholder="e.g. 50000" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                className={inputStyle} 
              />
            </div>
            <DialogFooter className="mt-8">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-200 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Processing Payment...' : 'Authorize Payment'}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {showSimulator && (
        <PaymentSimulator
          amount={parseFloat(amount) || 0}
          method={method}
          onComplete={handlePaymentComplete}
          onCancel={() => setShowSimulator(false)}
        />
      )}
    </div>
  );
}
