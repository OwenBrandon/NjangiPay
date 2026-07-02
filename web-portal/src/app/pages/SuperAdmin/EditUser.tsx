import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Save, Terminal, Shield, User as UserIcon, Mail, Globe } from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';
import { toast } from 'sonner';
import { UserRole } from '../../types';

export default function EditUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { users, updateUser } = useMockData();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '' as UserRole | '',
    region: '',
  });

  useEffect(() => {
    const user = users.find(u => u.id === id);
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        region: user.region || '',
      });
    }
  }, [id, users]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    updateUser({
      id,
      name: formData.name,
      email: formData.email,
      role: formData.role as UserRole,
      region: formData.region || undefined,
    });
    
    toast.success('User Details Updated Successfully');
    navigate('/super-admin/users');
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
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 max-w-2xl">
        <div>
          <button
            onClick={() => navigate('/super-admin/users')}
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-slate-800 transition-colors mb-6 font-mono"
          >
            <ArrowLeft className="size-4" />
            Back to Users
          </button>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="px-3 py-1 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] italic">Identity Node</div>
            <div className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] font-mono">SECURE_NODE_UPDATE</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.9]">
            Edit <span className="text-blue-600 underline decoration-slate-900 decoration-8 underline-offset-8">User</span>
          </h1>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-[0.4em] mt-8 flex items-center gap-3 italic">
            <Terminal className="size-4 text-blue-600" />
            Update user details and permissions in real-time
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className={`${glassCard} p-8 lg:p-12 max-w-2xl relative z-10 shadow-sm`}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className={labelStyle}>Full Name</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
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
            <label className={labelStyle}>Role</label>
            <div className="relative">
              <Shield className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as import('../../types').UserRole })}
                className={`${inputStyle} pl-11 appearance-none`}
              >
                <option value="taxpayer">Taxpayer</option>
                <option value="tax_admin">Tax Admin</option>
                <option value="accountant">Accountant</option>
                <option value="auditor">Auditor</option>

                <option value="support_staff">Support Staff</option>
                <option value="content_manager">Content Manager</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className={labelStyle}>Region (Optional)</label>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
              <select
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                className={`${inputStyle} pl-11 appearance-none`}
              >
                <option value="">No Region</option>
                <option value="Central Region">Central Region</option>
                <option value="Western Region">Western Region</option>
                <option value="Eastern Region">Eastern Region</option>
                <option value="Northern Region">Northern Region</option>
                <option value="Southern Region">Southern Region</option>
              </select>
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
              onClick={() => navigate('/super-admin/users')}
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
