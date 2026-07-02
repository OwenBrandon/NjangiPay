import { AlertCircle, Calendar, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router';
import { useMockData } from '../../contexts/MockDataContext';
import { useAuth } from '../../contexts/AuthContext';

export default function TaxObligations() {
  const { taxpayers } = useMockData();
  const { currentUser } = useAuth();
  
  const taxpayer = taxpayers.find(t => t.userId === currentUser?.id || t.email === currentUser?.email);
  const activeTaxTypes = taxpayer?.taxType || ['VAT', 'CIT'];

  const solidCard = 'bg-white rounded-2xl border border-slate-200/60 shadow-lg shadow-blue-900/5 overflow-hidden';

  const obligationsList = [
    { type: 'Value Added Tax (VAT)', code: 'VAT', frequency: 'Monthly', deadline: '10th of every month', status: 'CRITICAL', color: 'text-rose-500 bg-rose-50 border-rose-200/50' },
    { type: 'Corporate Income Tax (CIT)', code: 'CIT', frequency: 'Annually', deadline: '30th April annually', status: 'PENDING', color: 'text-orange-500 bg-orange-50 border-orange-200/50' },
    { type: 'Withholding Tax (WHT)', code: 'WHT', frequency: 'Monthly', deadline: '21st of every month', status: 'COMPLIANT', color: 'text-emerald-500 bg-emerald-50 border-emerald-200/50' },
    { type: 'Personal Income Tax (PIT)', code: 'PIT', frequency: 'Annually', deadline: '30th April annually', status: 'PENDING', color: 'text-slate-500 bg-slate-50 border-slate-200/50' },
  ].filter(ob => activeTaxTypes.includes(ob.code));

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
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Obligations</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">Tax Obligations</h1>
          <p className="text-sm text-slate-500 font-medium">View your active registered tax obligations and submission deadlines</p>
        </div>
      </div>

      {/* Obligations Grid list */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {obligationsList.map((ob, idx) => (
          <div 
            key={idx} 
            className={`${solidCard} p-8 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-[8px] font-black text-slate-500 tracking-widest uppercase bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
                  {ob.code}_ANNUAL
                </span>
                <span className={`inline-flex px-2 py-0.5 rounded text-[8px] font-black border ${ob.color}`}>
                  {ob.status}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight group-hover:text-blue-600 transition-colors">{ob.type}</h3>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-6">Frequency: {ob.frequency}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Filing Deadline</span>
                <span className="text-xs font-bold text-slate-800">{ob.deadline}</span>
              </div>
              <Link
                to="/taxpayer/filing"
                className="inline-flex items-center justify-center size-8 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 rounded-xl transition-all shadow-sm"
              >
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
