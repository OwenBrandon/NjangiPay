import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
  ArrowLeft, Terminal, Receipt, CreditCard, Clock, CheckCircle, 
  AlertTriangle, RefreshCcw, Download, User, Building, MapPin, 
  Mail, Phone, FileText, Activity, ShieldCheck, Landmark
} from 'lucide-react';
import { toast } from 'sonner';

export default function PaymentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const glassCard = 'bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] overflow-hidden';
  const terminalGrid = "bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:30px_30px]";

  const timeline = [
    { time: '14:30:12', title: 'Payment Initiated', desc: 'Taxpayer initiated debit via Web Portal', icon: User, status: 'completed' },
    { time: '14:31:05', title: 'Gateway Processing', desc: 'GTB_DIRECT_DEBIT authorization secure', icon: CreditCard, status: 'completed' },
    { time: '14:31:55', title: 'Central Bank Clearance', desc: 'NIBSS routing and settlement confirmed', icon: Landmark, status: 'completed' },
    { time: '14:32:00', title: 'Registry Update', desc: 'Taxpayer ledger actively credited', icon: Terminal, status: 'completed' },
  ];

  return (
    <div className={`min-h-screen bg-[#f8fafc] relative overflow-hidden ${terminalGrid} pb-20`}>
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] size-[50%] bg-blue-500/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] size-[50%] bg-indigo-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto p-6 lg:p-10 mt-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <button
              onClick={() => navigate('/accountant/payments')}
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-blue-600 transition-colors mb-8 font-mono"
            >
              <ArrowLeft className="size-4" />
              Back to Ledger
            </button>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="px-4 py-1.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] italic shadow-lg">Telemetry Node</div>
              <div className="size-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] font-mono">TXN_VERIFY_OK</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.9]">
              Payment <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 underline decoration-blue-600 decoration-8 underline-offset-8">Details</span>
            </h1>
          </div>

          {/* Action Command Bar */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => toast.success('Receipt Generated', { description: 'Secure PDF payload downloaded.' })}
              className="group flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-slate-100 text-slate-700 rounded-2xl hover:border-blue-500 hover:text-blue-600 transition-all font-black uppercase text-[10px] tracking-[0.2em] shadow-sm"
            >
              <Download className="size-4 transition-transform group-hover:-translate-y-0.5" />
              Export
            </button>
            <button 
              onClick={() => toast.error('Payment Flagged', { description: 'Forwarded to auditor queue for review.' })}
              className="group flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-slate-100 text-slate-700 rounded-2xl hover:border-orange-500 hover:text-orange-600 transition-all font-black uppercase text-[10px] tracking-[0.2em] shadow-sm"
            >
              <AlertTriangle className="size-4 transition-transform group-hover:scale-110" />
              Flag Issue
            </button>
            <button 
              onClick={() => toast.info('Reversal Initiated', { description: 'Reconciliation sequence triggered.' })}
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-slate-950 border border-slate-800 text-white rounded-2xl hover:bg-slate-800 transition-all font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl hover:scale-[1.02]"
            >
              <RefreshCcw className="size-4 transition-transform group-hover:-rotate-90" />
              Reverse
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Primary Details Panel */}
            <div className={`${glassCard} p-8 lg:p-10 relative group`}>
              <div className="absolute top-8 right-8 p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 shadow-sm">
                <ShieldCheck className="size-8" />
              </div>
              
              <div className="mb-10 border-b border-slate-100 pb-8">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] font-mono block mb-2">Transaction Ref</span>
                <h3 className="text-3xl font-black font-mono text-slate-800 tracking-tight">{id || 'TXN-984A-XCV-7721'}</h3>
                <div className="flex items-center gap-4 mt-4">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-emerald-100 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] font-mono">
                    <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    SETTLED
                  </span>
                  <span className="text-sm font-black text-slate-500 tracking-tight">May 18, 2026 • 14:32 WAT</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-xl transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <Receipt className="size-5 text-blue-500" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Assessment Type</span>
                  </div>
                  <div className="text-lg font-black text-slate-900 uppercase italic tracking-tighter">Value Added Tax</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Period: Q2 2026</div>
                </div>

                <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-xl transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <CreditCard className="size-5 text-indigo-500" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Payment Channel</span>
                  </div>
                  <div className="text-lg font-black text-slate-900 uppercase italic tracking-tighter">GTB Direct Debit</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Ref: GTB-883920-PAY</div>
                </div>
              </div>

              <div className="mt-6 p-8 bg-blue-50/30 rounded-3xl border border-blue-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] block mb-2">Total Assessed Value</span>
                  <div className="text-5xl font-black text-blue-900 tracking-tighter italic">{"FCFA "}45,500.00</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Base: FCFA 45,500.00</div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Penalty: {"FCFA "}0.00</div>
                  <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Fully Paid</div>
                </div>
              </div>
            </div>

            {/* Taxpayer Entity Profile */}
            <div className={`${glassCard} p-8 lg:p-10 relative`}>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight italic mb-8 flex items-center gap-3 underline decoration-slate-900 decoration-4 underline-offset-4 w-fit">
                <Building className="size-5 text-slate-400" />
                Entity Profile
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] block mb-1">Registered Name</span>
                    <div className="text-lg font-black text-slate-900 uppercase tracking-tight">Acme Holdings PLC</div>
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] block mb-1">Tax Identification Number</span>
                    <div className="text-sm font-black text-slate-700 font-mono tracking-widest bg-slate-100 w-fit px-3 py-1 rounded-md">TIN-9876543210</div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-sm font-bold text-slate-600">
                    <Mail className="size-4 text-slate-400" />
                    finance@acmeholdings.com
                  </div>
                  <div className="flex items-center gap-4 text-sm font-bold text-slate-600">
                    <Phone className="size-4 text-slate-400" />
                    +237 800 123 4567
                  </div>
                  <div className="flex items-start gap-4 text-sm font-bold text-slate-600">
                    <MapPin className="size-4 text-slate-400 mt-1" />
                    <span className="leading-relaxed">14 Industrial Layout, <br/>Victoria Island, Douala</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Timeline & Meta */}
          <div className="space-y-8">
            
            {/* Audit Timeline */}
            <div className={`${glassCard} p-8 lg:p-10`}>
              <div className="flex items-center gap-3 mb-8">
                <Activity className="size-5 text-indigo-600" />
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight italic underline decoration-indigo-600 decoration-4 underline-offset-4">Audit Timeline</h3>
              </div>
              
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                {timeline.map((event, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    {/* Icon */}
                    <div className="flex items-center justify-center size-10 rounded-full border-4 border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:scale-110 transition-transform group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100">
                      <event.icon className="size-4" />
                    </div>
                    {/* Content */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-white border border-slate-100 shadow-sm group-hover:border-indigo-500 group-hover:shadow-md transition-all">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-[10px] font-black uppercase text-indigo-600 tracking-widest font-mono">{event.time}</div>
                      </div>
                      <div className="text-xs font-black text-slate-900 uppercase tracking-tight mb-1">{event.title}</div>
                      <div className="text-[10px] font-bold text-slate-500 leading-relaxed">{event.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Documents */}
            <div className={`${glassCard} p-8 lg:p-10`}>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                <FileText className="size-4 text-slate-400" />
                Attached Files
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'VAT_Assessment_Notice.pdf', size: '1.2 MB' },
                  { name: 'Bank_Clearance_Slip.png', size: '450 KB' }
                ].map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:border-blue-500 cursor-pointer transition-all group">
                    <div className="flex items-center gap-3">
                      <FileText className="size-4 text-blue-500 group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="text-[10px] font-black text-slate-700 font-mono">{file.name}</div>
                        <div className="text-[9px] font-bold text-slate-400 mt-0.5">{file.size}</div>
                      </div>
                    </div>
                    <Download className="size-4 text-slate-300 group-hover:text-blue-600" />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

