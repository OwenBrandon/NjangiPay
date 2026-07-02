import { useState } from 'react';
import { Settings, Save, Shield, User, Building, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { useMockData } from '../../contexts/MockDataContext';
import { useAuth } from '../../contexts/AuthContext';

export default function TaxpayerProfile() {
  const { taxpayers, updateTaxpayer } = useMockData();
  const { currentUser } = useAuth();
  
  const taxpayer = taxpayers.find(t => t.userId === currentUser?.id || t.email === currentUser?.email);

  const [representative, setRepresentative] = useState(taxpayer?.name || 'Jennifer Martinez');
  const [email, setEmail] = useState(taxpayer?.email || 'jennifer@abccorp.com');
  const [address, setAddress] = useState(taxpayer?.address || '123 Acme Boulevard, Douala');

  const solidCard = 'bg-white rounded-2xl border border-slate-200/60 shadow-lg shadow-blue-900/5 overflow-hidden';

  const handleSave = () => {
    if (!representative.trim() || !email.trim() || !address.trim()) {
      toast.error('Validation Error', { description: 'Please fill in all profile fields.' });
      return;
    }
    if (taxpayer) {
      updateTaxpayer({
        ...taxpayer,
        name: representative,
        email,
        address
      });
    }
    toast.success('Profile Saved Successfully', {
      description: 'Your registered details have been updated on the government registry.'
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
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Registry Identity</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">My Profile</h1>
          <p className="text-sm text-slate-500 font-medium">View and update your corporate tax identity credentials</p>
        </div>
        
        <button 
          onClick={handleSave}
          className="flex items-center gap-3 px-8 py-4 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-blue-600 transition-all shadow-lg shadow-slate-200"
        >
          <Save className="size-4" />
          Save Changes
        </button>
      </div>

      {/* Main Grid Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Left Form fields */}
        <div className={`${solidCard} lg:col-span-2 p-8 lg:p-12 shadow-sm space-y-8`}>
          <div>
            <h3 className="text-xl font-black text-slate-900 uppercase">Taxpayer Registry Info</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Official registered details for filing returns</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest font-mono block">Registered Business Name</label>
              <div className="relative">
                <Building className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="text"
                  readOnly
                  value={taxpayer?.businessName || taxpayer?.name || "Acme Corporation Ltd"}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-100 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest font-mono block">Tax Identification Number (TIN)</label>
              <div className="relative">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="text"
                  readOnly
                  value={taxpayer?.tin || "TIN-9812-441-A"}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-100 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 font-mono outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest font-mono block">Authorized Representative</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="text"
                  value={representative}
                  onChange={(e) => setRepresentative(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest font-mono block">Contact Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-3 md:col-span-2">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest font-mono block">Registered Office Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Info Box */}
        <div className="space-y-8">
          <div className={`${solidCard} p-8 shadow-sm space-y-6`}>
            <div className="flex items-center gap-2">
              <Settings className="size-4 text-slate-400" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">System Settings</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all rounded-2xl">
                <div>
                  <div className="text-xs font-bold text-slate-800">Email Notifications</div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-wide mt-0.5">Receive alert updates</div>
                </div>
                <div className="size-5 rounded bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">ON</div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all rounded-2xl">
                <div>
                  <div className="text-xs font-bold text-slate-800">Two-Factor Auth (2FA)</div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-wide mt-0.5">SMS verification check</div>
                </div>
                <div className="size-5 rounded bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">ON</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
