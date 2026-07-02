import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  ArrowLeft, ShieldCheck, Banknote, FileText, Calendar, 
  User, Layers, Zap, Info, ArrowRight, Save, History, 
  Target, Activity, Globe, Scale
} from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

const TAX_RATES: Record<string, { rate: string; description: string; inputLabel: string }> = {
  VAT: { rate: '19.25%', description: 'TVA — 19.25% of taxable revenue', inputLabel: 'Taxable Revenue (FCFA)' },
  CIT: { rate: '33%', description: 'Impôt sur les Sociétés — 33% of corporate profit', inputLabel: 'Corporate Profit (FCFA)' },
  PIT: { rate: '11-35%', description: 'Progressive rate on personal income', inputLabel: 'Annual Income (FCFA)' },
  BLT: { rate: 'Fixed', description: 'Patente — annual business license fee', inputLabel: 'Business Category' },
  PT: { rate: '0.5%', description: 'Impôt Foncier — 0.5% of property value', inputLabel: 'Property Value (FCFA)' },
};

function calculateTaxLocally(taxType: string, taxableAmount: number, category: string = 'small'): number {
  switch (taxType) {
    case 'VAT': return Math.round(taxableAmount * 0.1925);
    case 'CIT': return Math.round(taxableAmount * 0.33);
    case 'PIT': {
      let tax = 0, remaining = taxableAmount;
      if (remaining > 2000000) { tax += 2000000 * 0.11; remaining -= 2000000; } else return Math.round(remaining * 0.11);
      if (remaining > 1000000) { tax += 1000000 * 0.165; remaining -= 1000000; } else return Math.round(tax + remaining * 0.165);
      if (remaining > 2000000) { tax += 2000000 * 0.275; remaining -= 2000000; } else return Math.round(tax + remaining * 0.275);
      return Math.round(tax + remaining * 0.35);
    }
    case 'BLT': return category === 'large' ? 350000 : category === 'medium' ? 150000 : 50000;
    case 'PT': return Math.round(taxableAmount * 0.005);
    default: return Math.round(taxableAmount * 0.1925);
  }
}

export default function CreateAssessment() {
  const navigate = useNavigate();
  const { taxpayers, addAssessment } = useMockData();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    taxpayerId: '',
    taxType: 'VAT',
    period: '',
    taxableAmount: '',
    businessCategory: 'small',
    dueDate: '',
    notes: '',
  });

  const selectedTaxpayer = taxpayers.find(t => t.id === formData.taxpayerId);
  const taxableNum = Number(formData.taxableAmount) || 0;
  const calculatedTax = calculateTaxLocally(formData.taxType, taxableNum, formData.businessCategory);
  const rateInfo = TAX_RATES[formData.taxType] || TAX_RATES.VAT;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.taxpayerId || !formData.period || !formData.dueDate) {
      return toast.error('Incomplete Fields', { description: 'Please fill all required fiscal fields.' });
    }

    if (formData.taxType !== 'BLT' && (taxableNum <= 0)) {
      return toast.error('Invalid Taxable Base', { description: 'Enter a positive taxable base amount.' });
    }

    const today = new Date().toISOString().split('T')[0];
    if (formData.dueDate < today) {
      return toast.error('Invalid Due Date', { description: 'The due date cannot be in the past.' });
    }

    const taxpayer = taxpayers.find(t => t.id === formData.taxpayerId);
    await addAssessment({
      id: '',
      taxpayerId: formData.taxpayerId,
      businessName: taxpayer?.businessName || taxpayer?.name,
      referenceNumber: `ASS-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
      description: `${formData.taxType} Assessment for ${formData.period} (Base: ${taxableNum.toLocaleString()} FCFA)`,
      taxType: formData.taxType,
      period: formData.period,
      amount: calculatedTax,
      amountPaid: 0,
      dueDate: formData.dueDate,
      status: 'unpaid',
      assessedBy: currentUser?.id || '',
      assessmentDate: today
    });
    toast.success('Assessment Created', {
      description: `${formData.taxType} assessment of ${calculatedTax.toLocaleString()} FCFA created for ${selectedTaxpayer?.name}.`
    });

    navigate('/tax-admin/assessments');
  };

  const glassCard = 'bg-white rounded-2xl border border-slate-200/60 shadow-2xl shadow-blue-900/5 overflow-hidden';
  const inputStyle = "w-full pl-12 pr-6 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 placeholder:text-slate-500 focus:ring-12 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all shadow-sm";
  const labelStyle = "flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-3 ml-2";

  return (
    <div className="min-h-screen bg-[#f1f5f9] relative overflow-hidden">
      {/* Dynamic Background Blobs */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="p-6 lg:p-10 space-y-12 relative z-10 max-w-7xl mx-auto">
        {/* Surgical Navigation Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <button
              onClick={() => navigate('/tax-admin/assessments')}
              className="group flex items-center gap-3 px-5 py-2 bg-white/50 hover:bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-600 transition-all shadow-sm hover:shadow-md"
            >
              <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
              Evaluation Matrix
            </button>
            <div className="flex items-center gap-3 mt-4">
              <span className="px-3 py-1 bg-blue-100/50 border border-blue-200 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Protocol Initiation</span>
              <span className="text-slate-400">•</span>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Fiscal Evaluation Node</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">Create Assessment</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="px-6 py-4 bg-blue-50 border border-blue-100 rounded-3xl text-blue-700 flex items-center gap-4 shadow-sm">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-wider opacity-60">System Status</div>
                <div className="text-sm font-black uppercase tracking-widest">Protocol Active</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          {/* Main Assessment Form */}
          <div className={`xl:col-span-2 ${glassCard} p-10 lg:p-14`}>
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Taxpayer Selection */}
                <div className="space-y-1">
                  <label className={labelStyle}>
                    <User className="size-3.5" />
                    Target Taxpayer
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-slate-900 text-white rounded-lg transition-transform group-focus-within:rotate-12">
                      <User className="size-4" />
                    </div>
                    <select
                      value={formData.taxpayerId}
                      onChange={(e) => setFormData({ ...formData, taxpayerId: e.target.value })}
                      className={inputStyle}
                      required
                    >
                      <option value="">Select Evaluation Entity...</option>
                      {taxpayers.map((taxpayer) => (
                        <option key={taxpayer.id} value={taxpayer.id}>
                          {taxpayer.name} ({taxpayer.tin})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tax Type */}
                <div className="space-y-1">
                  <label className={labelStyle}>
                    <Layers className="size-3.5" />
                    Fiscal Portfolio
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 text-white rounded-lg transition-transform group-focus-within:scale-110">
                      <Layers className="size-4" />
                    </div>
                    <select
                      value={formData.taxType}
                      onChange={(e) => setFormData({ ...formData, taxType: e.target.value })}
                      className={inputStyle}
                    >
                      <option value="VAT">Value Added Tax (VAT)</option>
                      <option value="CIT">Corporate Income Tax (CIT)</option>
                      <option value="PIT">Personal Income Tax (PIT)</option>
                      <option value="WHT">Withholding Tax (WHT)</option>
                      <option value="PT">Property Tax (PT)</option>
                    </select>
                  </div>
                </div>

                {/* Period */}
                <div className="space-y-1">
                  <label className={labelStyle}>
                    <History className="size-3.5" />
                    Temporal Period
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-500 text-white rounded-lg">
                      <Calendar className="size-4" />
                    </div>
                    <input
                      type="month"
                      value={formData.period}
                      onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                      className={inputStyle}
                      required
                    />
                  </div>
                </div>

                {/* Due Date */}
                <div className="space-y-1">
                  <label className={labelStyle}>
                    <Target className="size-3.5" />
                    Settlement Horizon
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-blue-500 text-white rounded-lg">
                      <Zap className="size-4" />
                    </div>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className={inputStyle}
                      required
                    />
                  </div>
                </div>

                {/* Taxable Base Amount */}
                <div className={`${formData.taxType === 'BLT' ? '' : 'md:col-span-2'} space-y-1`}>
                  <label className={labelStyle}>
                    <Banknote className="size-3.5" />
                    {rateInfo.inputLabel}
                  </label>
                  {formData.taxType === 'BLT' ? (
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-rose-600 text-white rounded-lg">
                        <Banknote className="size-4" />
                      </div>
                      <select
                        value={formData.businessCategory}
                        onChange={(e) => setFormData({ ...formData, businessCategory: e.target.value })}
                        className={inputStyle}
                      >
                        <option value="small">Small Business (&lt; 10M FCFA) — 50,000 FCFA</option>
                        <option value="medium">Medium Business (10M-50M FCFA) — 150,000 FCFA</option>
                        <option value="large">Large Business (&gt; 50M FCFA) — 350,000 FCFA</option>
                      </select>
                    </div>
                  ) : (
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-rose-600 text-white rounded-lg group-focus-within:animate-pulse">
                        <Banknote className="size-4" />
                      </div>
                      <input
                        type="number"
                        value={formData.taxableAmount}
                        onChange={(e) => setFormData({ ...formData, taxableAmount: e.target.value })}
                        className={`${inputStyle} text-lg font-black text-slate-900`}
                        placeholder="Enter taxable base amount"
                        required
                      />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 tracking-widest uppercase">
                        FCFA
                      </div>
                    </div>
                  )}
                </div>

                {/* Business Category (shown next to taxable base for BLT) */}
                {formData.taxType === 'BLT' && <div />}

                {/* Tax Calculation Preview */}
                <div className="md:col-span-2 p-6 bg-blue-50 border border-blue-100 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest">
                    <Scale className="size-3.5" />
                    Tax Calculation Preview
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600">Tax Type & Rate</span>
                    <span className="text-xs font-black text-slate-900">{formData.taxType} — {rateInfo.rate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600">Taxable Base</span>
                    <span className="text-xs font-black text-slate-900">{formData.taxType === 'BLT' ? formData.businessCategory.toUpperCase() : `${taxableNum.toLocaleString()} FCFA`}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-blue-200">
                    <span className="text-sm font-black text-blue-900 uppercase">Calculated Tax Amount</span>
                    <span className="text-xl font-black text-blue-900 font-mono">{calculatedTax.toLocaleString()} FCFA</span>
                  </div>
                  <p className="text-[10px] text-blue-500 italic">{rateInfo.description}</p>
                </div>

                {/* Notes */}
                <div className="md:col-span-2 space-y-1">
                  <label className={labelStyle}>
                    <FileText className="size-3.5" />
                    Technical Annotations
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-6 p-1.5 bg-slate-400 text-white rounded-lg">
                      <Info className="size-4" />
                    </div>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={4}
                      className={`${inputStyle} h-40 resize-none pt-6 align-top`}
                      placeholder="Enter evaluation notes, context, or technical justifications..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 pt-8 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-slate-900 text-white rounded-3xl text-sm font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 group"
                >
                  Initiate Protocol
                  <ArrowRight className="size-5 group-hover:translate-x-1.5 transition-transform" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/tax-admin/assessments')}
                  className="flex-1 px-8 py-5 border border-slate-200 text-slate-600 rounded-3xl text-sm font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                >
                  Abort Evaluation
                </button>
              </div>
            </form>
          </div>

          {/* Real-time Preview Node */}
          <div className="space-y-8">
            <div className={`${glassCard} p-8 bg-white border-blue-100 shadow-2xl shadow-blue-900/10 relative overflow-hidden group`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-16 -mt-16 opacity-50 group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-10">
                  <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
                    <Globe className="size-6" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Evaluation Preview</div>
                    <div className="text-sm font-black uppercase tracking-widest text-slate-900">Protocol Node #402</div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Primary Entity</div>
                    <div className="text-xl font-black text-slate-900 truncate">{selectedTaxpayer?.name || 'Awaiting Target...'}</div>
                    <div className="text-xs text-blue-600 font-bold uppercase tracking-widest mt-1">TIN: {selectedTaxpayer?.tin || 'XXX-XXX-XXX'}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Portfolio</div>
                      <div className="text-sm font-black uppercase tracking-widest text-slate-800">{formData.taxType}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Horizon</div>
                      <div className="text-sm font-black uppercase tracking-widest text-slate-800">{formData.period || '---'}</div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-slate-100">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Evaluation principal</div>
                    <div className="text-5xl font-black tracking-tighter text-blue-600">
                      {"FCFA "}{calculatedTax.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${glassCard} p-8 bg-blue-50/50 border-blue-100`}>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                  <Scale className="size-5" />
                </div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Legal Alignment</h4>
              </div>
              <p className="text-xs text-slate-500 font-bold leading-relaxed">
                By initiating this evaluation protocol, you confirm that the fiscal principal of 
                <span className="text-blue-600 px-1">{"FCFA "}{calculatedTax.toLocaleString()}</span> 
                aligns with the current regional tax frameworks and legislative thresholds.
              </p>
              <div className="mt-8 p-4 bg-white rounded-2xl border border-blue-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-2 rounded-full bg-blue-500" />
                  <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Compliance Check</span>
                </div>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Optimal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
