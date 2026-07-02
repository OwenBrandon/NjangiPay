import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Save, Terminal, Shield, Calendar, AlertCircle } from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';
import { toast } from 'sonner';
import type { Assessment } from '../../types';

export default function EditAssessment() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { assessments, taxpayers, updateAssessment } = useMockData();
  const [formData, setFormData] = useState({
    taxpayerName: '',
    taxType: '',
    amount: 0,
    period: '',
    dueDate: '',
    status: '',
  });

  useEffect(() => {
    const assessment = assessments.find(a => a.id === id);
    if (assessment) {
      const taxpayer = taxpayers.find(t => t.id === assessment.taxpayerId);
      setFormData({
        taxpayerName: taxpayer?.name || 'Unknown',
        taxType: assessment.taxType,
        amount: assessment.amount,
        period: assessment.period,
        dueDate: assessment.dueDate,
        status: assessment.status,
      });
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const existing = assessments.find(a => a.id === id);
    if (existing) {
      updateAssessment({
        ...existing,
        taxType: formData.taxType,
        amount: formData.amount,
        period: formData.period,
        dueDate: formData.dueDate,
        status: formData.status as Assessment['status'],
      });
      toast.success('Assessment Node Updated', { description: 'Modifications saved to the registry.' });
      navigate('/tax-admin/assessments');
    }
  };

  const glassCard = 'bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] overflow-hidden';
  const terminalGrid = "bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:30px_30px]";
  const labelStyle = "block text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono mb-2";
  const inputStyle = "w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 placeholder:text-slate-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all";

  return (
    <div className={`min-h-screen bg-[#f8fafc] relative overflow-hidden ${terminalGrid} p-8 lg:p-12`}>
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] size-[50%] bg-blue-400/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] size-[50%] bg-indigo-400/5 blur-[120px] rounded-full" />
      </div>

      {/* Header Section */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 max-w-3xl">
        <div>
          <button
            onClick={() => navigate('/tax-admin/assessments')}
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-slate-800 transition-colors mb-6 font-mono"
          >
            <ArrowLeft className="size-4" />
            Back to Assessments
          </button>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="px-3 py-1 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] italic">Assessment System</div>
            <div className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] font-mono">RECORD_UPDATE_ON</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.9]">
            Edit <span className="text-blue-600 underline decoration-slate-900 decoration-8 underline-offset-8">Assessment</span>
          </h1>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-[0.4em] mt-8 flex items-center gap-3 italic">
            <Terminal className="size-4 text-blue-600" />
            Modify assessment parameters for {formData.taxpayerName}
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className={`${glassCard} p-8 lg:p-12 max-w-3xl relative z-10 shadow-sm`}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label className={labelStyle}>Taxpayer Reference</label>
              <input
                type="text"
                value={formData.taxpayerName}
                disabled
                className="w-full px-5 py-4 bg-slate-100/50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-500 cursor-not-allowed outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className={labelStyle}>Tax Type Node</label>
              <div className="relative">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                <select
                  value={formData.taxType}
                  onChange={(e) => setFormData({ ...formData, taxType: e.target.value })}
                  className={`${inputStyle} pl-11 appearance-none`}
                >
                  <option value="VAT">Value Added Tax (VAT)</option>
                  <option value="CIT">Corporate Income Tax (CIT)</option>
                  <option value="PIT">Personal Income Tax (PIT)</option>
                  <option value="WHT">Withholding Tax (WHT)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelStyle}>Tax Filing Period</label>
              <input
                type="text"
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                className={inputStyle}
                required
              />
            </div>

            <div className="space-y-2">
              <label className={labelStyle}>Assessed Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 font-mono">{"FCFA "}</span>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                  className={`${inputStyle} pl-9 font-mono`}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelStyle}>Due Date Deadline</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className={`${inputStyle} pl-11`}
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className={labelStyle}>Assessment Status</label>
              <div className="relative">
                <AlertCircle className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className={`${inputStyle} pl-11 appearance-none`}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                  <option value="partial">Partial</option>
                  <option value="disputed">Disputed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-slate-100">
            <button
              type="submit"
              className="flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-wider hover:bg-slate-800 transition-all shadow-md shadow-slate-200"
            >
              <Save className="size-4" />
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => navigate('/tax-admin/assessments')}
              className="px-8 py-3.5 border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-wider hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
