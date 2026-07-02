import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Save, Terminal, Shield, User, Mail, Globe, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { useMockData } from '../../contexts/MockDataContext';
import type { Taxpayer } from '../../types';

export default function EditTaxpayer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { taxpayers, updateTaxpayer } = useMockData();
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    email: '',
    phone: '',
    address: '',
    region: '',
    status: '',
  });

  useEffect(() => {
    const taxpayer = taxpayers.find(t => t.id === id);
    if (taxpayer) {
      setFormData({
        name: taxpayer.name,
        businessName: taxpayer.businessName || '',
        email: taxpayer.email,
        phone: taxpayer.phone,
        address: taxpayer.address,
        region: taxpayer.region,
        status: taxpayer.status,
      });
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const existing = taxpayers.find(t => t.id === id);
    if (existing) {
      updateTaxpayer({
        ...existing,
        name: formData.name,
        businessName: formData.businessName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        region: formData.region,
        status: formData.status as Taxpayer['status'],
      });
      toast.success('Taxpayer Node Updated Successfully');
      navigate(`/tax-admin/taxpayers/${id}`);
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
            onClick={() => navigate('/tax-admin/taxpayers')}
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-slate-800 transition-colors mb-6 font-mono"
          >
            <ArrowLeft className="size-4" />
            Back to Taxpayers
          </button>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="px-3 py-1 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] italic">Registry Terminal</div>
            <div className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] font-mono">REGISTRY_MODIFY_ON</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.9]">
            Edit <span className="text-blue-600 underline decoration-slate-900 decoration-8 underline-offset-8">Taxpayer</span>
          </h1>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-[0.4em] mt-8 flex items-center gap-3 italic">
            <Terminal className="size-4 text-blue-600" />
            Update taxpayer account credentials and sector region assignment
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className={`${glassCard} p-8 lg:p-12 max-w-3xl relative z-10 shadow-sm`}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={labelStyle}>Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`${inputStyle} pl-11`}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelStyle}>Business Name</label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className={inputStyle}
              />
            </div>

            <div className="space-y-2">
              <label className={labelStyle}>Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`${inputStyle} pl-11`}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelStyle}>Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={inputStyle}
                required
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className={labelStyle}>Physical Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={`${inputStyle} pl-11`}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelStyle}>Region Sector</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                <select
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className={`${inputStyle} pl-11 appearance-none`}
                >
                  <option value="Central Region">Central Region</option>
                  <option value="Western Region">Western Region</option>
                  <option value="Eastern Region">Eastern Region</option>
                  <option value="Northern Region">Northern Region</option>
                  <option value="Southern Region">Southern Region</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelStyle}>Account Status</label>
              <div className="relative">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className={`${inputStyle} pl-11 appearance-none`}
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                  <option value="inactive">Inactive</option>
                  <option value="in_review">In Review</option>
                  <option value="defaulter">Defaulter</option>
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
              onClick={() => navigate('/tax-admin/taxpayers')}
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
