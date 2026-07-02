import { getColorClass } from '../../utils/colorClasses';
import { useParams, useNavigate } from 'react-router';
import { 
  ArrowLeft, Edit, Mail, Phone, MapPin, Calendar, 
  FileText, Plus, ShieldCheck, Banknote, Activity,
  Clock, CreditCard, ChevronRight, Download, MoreHorizontal,
  Building2, Hash, Globe, Zap, AlertCircle
} from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';
import { toast } from 'sonner';

export default function TaxpayerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { taxpayers, taxReturns: allTaxReturns, payments: allPayments } = useMockData();
  const taxpayer = taxpayers.find(t => t.id === id);
  const taxReturns = allTaxReturns.filter(tr => tr.taxpayerId === id);
  const payments = allPayments.filter(p => p.taxpayerId === id);

  if (!taxpayer) {
    return <div className="p-6">Taxpayer not found</div>;
  }

  const initials = taxpayer.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const totalPaid = payments.reduce((acc, p) => acc + (p.status === 'completed' ? p.amount : 0), 0);
  const outstanding = taxReturns.reduce((acc, r) => acc + (r.status === 'overdue' ? r.amount : 0), 0);

  const glassCard = 'bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden';

  return (
    <div className="p-6 space-y-8">
      {/* Surgical Navigation & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/tax-admin/taxpayers')}
            className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-blue-600 rounded-2xl transition-all shadow-sm group"
          >
            <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[10px] font-black uppercase tracking-wider">Forensic View</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-400 font-bold tracking-tight">ID: {taxpayer.id}</span>
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Taxpayer Profile</h1>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={() => toast.success('Audit Report Generated')} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-100 text-slate-600 rounded-2xl text-xs font-bold hover:bg-slate-50 transition-all shadow-sm">
            <Download className="size-4" />
            Audit Report
          </button>
          <button onClick={() => toast.success('Protocols Assigned Successfully')} className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-2xl text-xs font-bold hover:bg-blue-100 transition-all">
            <Plus className="size-4" />
            Assign Protocols
          </button>
          <button 
            onClick={() => navigate(`/tax-admin/taxpayers/${taxpayer.id}/edit`)}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-xs font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
          >
            <Edit className="size-4" />
            Modify Record
          </button>
        </div>
      </div>

      {/* Profile Intelligence Header */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex flex-col lg:flex-row lg:items-center gap-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-bl-[200px] -mr-32 -mt-32 opacity-30 group-hover:scale-110 transition-transform duration-700" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 flex-1">
          <div className="size-24 rounded-xl bg-slate-900 flex items-center justify-center text-2xl font-black text-white shadow-2xl shadow-slate-200 ring-8 ring-slate-50">
            {initials}
          </div>
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <h2 className="text-3xl font-black text-slate-800 tracking-tighter">{taxpayer.name}</h2>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                taxpayer.status === 'active' ? 'bg-emerald-50 text-emerald-500 border border-emerald-100' : 'bg-yellow-50 text-yellow-500 border border-yellow-100'
              }`}>
                {taxpayer.status}
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-slate-500 font-bold">
              <div className="flex items-center gap-2"><Building2 className="size-4 text-blue-600" /> {taxpayer.businessName || 'Strategic Individual'}</div>
              <div className="flex items-center gap-2"><Hash className="size-4 text-purple-600" /> {taxpayer.tin}</div>
              <div className="flex items-center gap-2"><Globe className="size-4 text-emerald-600" /> {taxpayer.region} Node</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4 border-t lg:border-t-0 lg:border-l border-slate-100 pt-8 lg:pt-0 lg:pl-10">
          <div className="text-center lg:text-left">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fiscal Compliance</div>
            <div className="text-3xl font-black text-slate-800 tracking-tight">87.5<span className="text-lg text-slate-400 font-bold">%</span></div>
            <div className="flex items-center gap-1 mt-1 justify-center lg:justify-start">
              <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[87.5%]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Telemetry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Contribution', value: `FCFA ${totalPaid.toLocaleString()}`, icon: Banknote, color: 'blue' },
          { label: 'Overdue Threshold', value: `FCFA ${outstanding.toLocaleString()}`, icon: AlertCircle, color: 'red' },
          { label: 'Active Protocols', value: taxpayer.taxType.length, icon: Activity, color: 'emerald' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex items-center gap-5 group hover:shadow-lg transition-all">
            <div className={`p-4 ${getColorClass(stat.color, 'bg50')} ${getColorClass(stat.color, 'text600')} rounded-2xl group-hover:rotate-12 transition-transform`}>
              <stat.icon className="size-6" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">{stat.label}</div>
              <div className="text-xl font-black text-slate-900">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Details Nodes */}
        <div className="lg:col-span-1 space-y-6">
          <div className={`${glassCard} p-8`}>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.15em] mb-8 flex items-center gap-2">
              <Zap className="size-4 text-blue-500" />
              Identity Nodes
            </h3>
            <div className="space-y-8">
              {[
                { label: 'Primary Terminal', value: taxpayer.email, icon: Mail },
                { label: 'Comms Link', value: taxpayer.phone, icon: Phone },
                { label: 'Geographic Node', value: taxpayer.address, icon: MapPin },
                { label: 'Onboarding Log', value: new Date(taxpayer.registrationDate).toLocaleDateString(), icon: Calendar },
              ].map((node, i) => (
                <div key={i} className="flex gap-4 group cursor-pointer">
                  <div className="p-3 bg-slate-50 text-slate-500 rounded-2xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                    <node.icon className="size-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{node.label}</div>
                    <div className="text-sm font-bold text-slate-700 leading-tight">{node.value}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-10 pt-8 border-t border-slate-100">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-4">Tax Portfolio</h3>
              <div className="flex flex-wrap gap-2">
                {taxpayer.taxType.map((type) => (
                  <span key={type} className="px-3 py-1.5 bg-blue-50/50 text-blue-600 border border-blue-100 rounded-xl text-[10px] font-black uppercase tracking-wider">
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Activity Streams */}
        <div className="lg:col-span-2 space-y-8">
          {/* Tax Returns Stream */}
          <div className={glassCard}>
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <FileText className="size-5" />
                </div>
                <h3 className="text-lg font-black text-slate-800">Return Log</h3>
              </div>
              <button onClick={() => toast('Tax Return Quick Actions opened')} className="p-2 text-slate-400 hover:text-slate-800 transition-colors"><MoreHorizontal className="size-5" /></button>
            </div>
            <div className="divide-y divide-slate-50">
              {taxReturns.map((taxReturn) => (
                <div key={taxReturn.id} className="p-6 hover:bg-slate-50/50 transition-all group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white border border-slate-100 rounded-xl group-hover:border-blue-200 transition-colors">
                        <Activity className="size-5 text-slate-400 group-hover:text-blue-500" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-800">{taxReturn.taxType} • {taxReturn.period}</div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Due Date: {new Date(taxReturn.dueDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-slate-800">{"FCFA "}{taxReturn.amount.toLocaleString()}</div>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest mt-2 border ${
                        taxReturn.status === 'filed' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' :
                        taxReturn.status === 'overdue' ? 'bg-red-50 text-red-500 border-red-100' : 'bg-yellow-50 text-yellow-500 border-yellow-100'
                      }`}>
                        {taxReturn.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Stream */}
          <div className={glassCard}>
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                  <CreditCard className="size-5" />
                </div>
                <h3 className="text-lg font-black text-slate-800">Payment Matrix</h3>
              </div>
              <button onClick={() => toast('Payment Matrix Quick Actions opened')} className="p-2 text-slate-400 hover:text-slate-800 transition-colors"><MoreHorizontal className="size-5" /></button>
            </div>
            <div className="divide-y divide-slate-50">
              {payments.map((payment) => (
                <div key={payment.id} className="p-6 hover:bg-slate-50/50 transition-all group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white border border-slate-100 rounded-xl group-hover:border-emerald-200 transition-colors">
                        <Banknote className="size-5 text-slate-400 group-hover:text-emerald-500" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-800">{payment.taxType}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                          {new Date(payment.paymentDate).toLocaleDateString()} • {payment.paymentMethod.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-slate-800">{"FCFA "}{payment.amount.toLocaleString()}</div>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest mt-2 border ${
                        payment.status === 'completed' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-yellow-50 text-yellow-500 border-yellow-100'
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => toast.info('Fetching historic records from archive...')} className="w-full p-4 bg-slate-50 text-slate-400 hover:text-emerald-600 font-bold text-xs uppercase tracking-widest transition-all">
              Load Historic Records
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
