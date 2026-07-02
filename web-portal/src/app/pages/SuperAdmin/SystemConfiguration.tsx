import React from 'react';
import { Save, Database, Mail, CreditCard, Globe, RotateCcw, Server, Activity, Edit3, Plus, Settings } from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { toast } from 'sonner';

export default function SystemConfiguration() {
  const glassCard = 'bg-white rounded-2xl border border-slate-200/60 shadow-2xl shadow-blue-900/5 overflow-hidden';
  const labelStyle = "block text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-3";
  const inputStyle = "w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-inner";

  const { taxTypes, regions, addRegion, addTaxType } = useMockData();
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [showHubModal, setShowHubModal] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);

  const [taxName, setTaxName] = useState('');
  const [taxCode, setTaxCode] = useState('');
  const [taxRate, setTaxRate] = useState('');

  const [regionName, setRegionName] = useState('');
  const [regionCode, setRegionCode] = useState('');

  const handleCommit = () => {
    setIsCommitting(true);
    toast("Committing Global Settings...", { description: "Applying changes to all active nodes." });
    setTimeout(() => {
      setIsCommitting(false);
      toast.success("Settings Applied", { description: "Global configuration updated successfully." });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] relative overflow-hidden">
      {/* Intelligence Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="p-6 lg:p-10 space-y-12 relative z-10">
        {/* Surgical Command Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="size-3 rounded-full bg-emerald-500 animate-ping absolute inset-0" />
                <div className="size-3 rounded-full bg-emerald-600 relative" />
              </div>
              <span className="px-3 py-1 bg-emerald-100/50 border border-emerald-200 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Core Infrastructure</span>
              <span className="text-slate-400">•</span>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">System Config Terminal</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">Configuration</h1>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button className="flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[11px] font-black uppercase tracking-widest hover:text-slate-900 hover:bg-slate-50 transition-all shadow-sm hover:shadow-md">
              <RotateCcw className="size-4" />
              Reset Config
            </button>
            <button onClick={handleCommit} className="flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-300/50 hover:scale-105">
              <Save className={`size-4 ${isCommitting ? 'animate-pulse' : ''}`} />
              {isCommitting ? 'Committing...' : 'Commit Global Settings'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Tax Types Card */}
          <div className={`${glassCard} flex flex-col group`}>
            <div className="p-8 border-b border-white/50 bg-white/40 flex items-center justify-between transition-colors group-hover:bg-blue-50/30">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-100 text-slate-600 rounded-[1rem] shadow-sm group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                  <Database className="size-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Tax Matrix</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Active Portfolios</p>
                </div>
              </div>
            </div>
            <div className="p-8 flex-1 space-y-4 max-h-[460px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {taxTypes.map((taxType) => (
                <div key={taxType.id} className="group/item flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/5 transition-all">
                  <div className="flex flex-col gap-1">
                    <div className="text-sm font-black text-slate-900 tracking-tight">{taxType.name}</div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      <span className="px-2 py-0.5 bg-slate-200/50 rounded-md text-slate-600">{taxType.code}</span>
                      <span>•</span>
                      <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">{taxType.rate}% RATE</span>
                    </div>
                  </div>
                  <button className="p-3 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm opacity-0 group-hover/item:opacity-100 translate-x-2 group-hover/item:translate-x-0">
                    <Edit3 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-slate-100/50 bg-slate-50/50">
              <button onClick={() => setShowTaxModal(true)} className="w-full flex items-center justify-center gap-2 py-4 bg-white border-2 border-dashed border-slate-200 text-slate-500 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 transition-all">
                <Plus className="size-4" /> Initialize New Tax Node
              </button>
            </div>
          </div>

          {/* Regions Card */}
          <div className={`${glassCard} flex flex-col group`}>
            <div className="p-8 border-b border-white/50 bg-white/40 flex items-center justify-between transition-colors group-hover:bg-emerald-50/30">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-100 text-slate-600 rounded-[1rem] shadow-sm group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                  <Globe className="size-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Regional Hubs</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Deployment Zones</p>
                </div>
              </div>
            </div>
            <div className="p-8 flex-1 space-y-4 max-h-[460px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {regions.map((region) => (
                <div key={region.id} className="group/item flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-900/5 transition-all">
                  <div className="flex flex-col gap-1">
                    <div className="text-sm font-black text-slate-900 tracking-tight">{region.name}</div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      <span className="px-2 py-0.5 bg-slate-200/50 rounded-md text-slate-600">{region.code}</span>
                      <span>•</span>
                      <span className="text-slate-400">{region.taxOffice}</span>
                    </div>
                  </div>
                  <button className="p-3 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all shadow-sm opacity-0 group-hover/item:opacity-100 translate-x-2 group-hover/item:translate-x-0">
                    <Edit3 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-slate-100/50 bg-slate-50/50">
              <button onClick={() => setShowHubModal(true)} className="w-full flex items-center justify-center gap-2 py-4 bg-white border-2 border-dashed border-slate-200 text-slate-500 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all">
                <Plus className="size-4" /> Deploy New Hub
              </button>
            </div>
          </div>
        </div>

        {/* Email Configuration Terminal */}
        <div className={`${glassCard} group`}>
          <div className="p-8 border-b border-white/50 bg-white/40 flex items-center justify-between transition-colors group-hover:bg-purple-50/30">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-100 text-slate-600 rounded-[1rem] shadow-sm group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors">
                <Mail className="size-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">SMTP Protocol Configuration</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">System Communication Settings</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <Server className="size-3" /> Connectivity: Optimal
            </div>
          </div>
          <div className="p-8 lg:p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <label className={labelStyle}>SMTP Host</label>
              <input type="text" defaultValue="smtp.taxauth.gov" placeholder="ENTER HOST ADDRESS..." className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>SMTP Port</label>
              <input type="text" defaultValue="587" placeholder="ENTER PORT..." className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>From Email Address</label>
              <input type="email" defaultValue="noreply@taxauth.gov" placeholder="ENTER EMAIL..." className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>From Display Name</label>
              <input type="text" defaultValue="Tax Authority" placeholder="ENTER DISPLAY NAME..." className={inputStyle} />
            </div>
          </div>
        </div>

        {/* Payment Gateway Terminal */}
        <div className={`${glassCard} group`}>
          <div className="p-8 border-b border-white/50 bg-white/40 flex items-center justify-between transition-colors group-hover:bg-amber-50/30">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-100 text-slate-600 rounded-[1rem] shadow-sm group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
                <CreditCard className="size-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Financial Gateway Protocol</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Payment Processor Links</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <Activity className="size-3" /> Endpoint: Secured
            </div>
          </div>
          <div className="p-8 lg:p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <label className={labelStyle}>Gateway Provider Node</label>
              <select className={inputStyle}>
                <option>STRIPE (PRIMARY)</option>
                <option>PAYPAL</option>
                <option>MOBILE MONEY API</option>
              </select>
            </div>
            <div>
              <label className={labelStyle}>Secret API Key</label>
              <input type="password" defaultValue="sk_test_••••••••••••••••" placeholder="ENTER SECRET KEY..." className={inputStyle} />
            </div>
            <div className="md:col-span-2 lg:col-span-1">
              <label className={labelStyle}>Webhook Target URL</label>
              <input type="text" defaultValue="https://api.taxauth.gov/webhooks/payments" placeholder="ENTER WEBHOOK URL..." className={inputStyle} />
            </div>
            
            {/* Tactical Toggle Switch for Test Mode */}
            <div className="flex items-center h-full pt-6">
              <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-5 rounded-2xl w-full">
                <label className="relative inline-flex items-center justify-center cursor-pointer shrink-0">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500 shadow-inner"></div>
                  <div className="absolute inset-0 rounded-full opacity-0 peer-checked:opacity-20 peer-checked:bg-amber-500 blur-md transition-opacity duration-300 pointer-events-none" />
                </label>
                <div>
                  <div className="text-sm font-black text-slate-900 uppercase tracking-wide">Development Mode</div>
                  <div className="text-[10px] text-slate-400 font-bold">Simulate transactions without charging</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      {/* Modals */}
      <Dialog open={showTaxModal} onOpenChange={setShowTaxModal}>
        <DialogContent className="sm:max-w-[425px] rounded-xl p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">Initialize Tax Node</DialogTitle>
            <DialogDescription className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
              Deploy a new tax type protocol
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            <div>
              <label className={labelStyle}>Tax Name</label>
              <input 
                type="text" 
                placeholder="e.g. Luxury Tax" 
                value={taxName}
                onChange={(e) => setTaxName(e.target.value)}
                className={inputStyle} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelStyle}>Code</label>
                <input 
                  type="text" 
                  placeholder="e.g. LUX" 
                  value={taxCode}
                  onChange={(e) => setTaxCode(e.target.value)}
                  className={inputStyle} 
                />
              </div>
              <div>
                <label className={labelStyle}>Rate (%)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 15" 
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className={inputStyle} 
                />
              </div>
            </div>
          </div>
          <DialogFooter className="mt-8">
            <button onClick={() => {
              if (!taxName || !taxCode || !taxRate) {
                toast.error("Validation Error", { description: "Please fill all tax node fields." });
                return;
              }
              addTaxType({ 
                id: Math.floor(100 + Math.random() * 900).toString(), 
                name: taxName, 
                code: taxCode.toUpperCase(), 
                rate: parseFloat(taxRate) || 0, 
                description: `Standard ${taxCode.toUpperCase()} rate protocol`, 
                filingFrequency: 'monthly' 
              });
              setTaxName('');
              setTaxCode('');
              setTaxRate('');
              setShowTaxModal(false);
              toast.success("Tax Node Deployed");
            }} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-200 transition-all">
              Initialize Node
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showHubModal} onOpenChange={setShowHubModal}>
        <DialogContent className="sm:max-w-[425px] rounded-xl p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">Deploy Hub</DialogTitle>
            <DialogDescription className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
              Configure a new regional zone
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            <div>
              <label className={labelStyle}>Region Name</label>
              <input 
                type="text" 
                placeholder="e.g. Coastal Region" 
                value={regionName}
                onChange={(e) => setRegionName(e.target.value)}
                className={inputStyle} 
              />
            </div>
            <div>
              <label className={labelStyle}>Region Code</label>
              <input 
                type="text" 
                placeholder="e.g. COA" 
                value={regionCode}
                onChange={(e) => setRegionCode(e.target.value)}
                className={inputStyle} 
              />
            </div>
          </div>
          <DialogFooter className="mt-8">
            <button onClick={() => {
              if (!regionName || !regionCode) {
                toast.error("Validation Error", { description: "Please fill all regional hub fields." });
                return;
              }
              addRegion({ 
                id: Math.floor(100 + Math.random() * 900).toString(), 
                name: regionName, 
                code: regionCode.toUpperCase(), 
                taxOffice: `${regionName} Tax Office`, 
                taxpayerCount: 0, 
                revenueTarget: 50000000, 
                revenueCollected: 0 
              });
              setRegionName('');
              setRegionCode('');
              setShowHubModal(false);
              toast.success("Hub Deployed");
            }} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-200 transition-all">
              Deploy Protocol
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
