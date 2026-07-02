import React, { useState } from 'react';
import { MapPin, Search, Plus, Edit, Trash2, Building2, TrendingUp, Network, Activity, Focus, LocateFixed, X } from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { toast } from 'sonner';

export default function RegionsManagement() {
  const { regions, addRegion, updateRegion } = useMockData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', code: '', taxOffice: '' });
  
  const filteredRegions = regions.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.taxOffice.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeploy = () => {
    if (isEditMode && editingId) {
      const existingRegion = regions.find(r => r.id === editingId);
      if (existingRegion) {
        updateRegion({
          ...existingRegion,
          name: formData.name,
          code: formData.code,
          taxOffice: formData.taxOffice
        });
        toast.success('Hub Updated Successfully');
      }
    } else {
      addRegion({
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        code: formData.code,
        taxOffice: formData.taxOffice,
        taxpayerCount: 0,
        revenueTarget: 1000000,
        revenueCollected: 0
      });
      toast.success('New Hub Deployed Successfully');
    }
    setShowDialog(false);
  };

  const handleEditClick = (region: any) => {
    setIsEditMode(true);
    setEditingId(region.id);
    setFormData({
      name: region.name,
      code: region.code,
      taxOffice: region.taxOffice
    });
    setShowDialog(true);
  };

  const handleCreateClick = () => {
    setIsEditMode(false);
    setEditingId(null);
    setFormData({ name: '', code: '', taxOffice: '' });
    setShowDialog(true);
  };

  const handleDelete = () => {
    toast.error('Deletion of Core Node requires Level 5 Authorization.');
  };

  const glassCard = 'bg-white rounded-2xl border border-slate-200/60 shadow-2xl shadow-blue-900/5 overflow-hidden';

  return (
    <div className="min-h-screen bg-[#f1f5f9] relative overflow-hidden">
      {/* Intelligence Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="p-6 lg:p-10 space-y-12 relative z-10">
        {/* Deployment Command Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="size-3 rounded-full bg-emerald-500 animate-ping absolute inset-0" />
                <div className="size-3 rounded-full bg-emerald-600 relative" />
              </div>
              <span className="px-3 py-1 bg-emerald-100/50 border border-emerald-200 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Deployment Hub</span>
              <span className="text-slate-400">•</span>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Node Management Terminal</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">Regions Management</h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleCreateClick}
              className="flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200/50 hover:scale-105"
            >
              <Plus className="size-5" />
              Deploy New Hub
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          {/* Forensic Data Grid (Left/Main Column) */}
          <div className={`xl:col-span-2 ${glassCard} flex flex-col max-h-[800px]`}>
            {/* Command Search */}
            <div className="px-8 py-6 border-b border-slate-100/50 bg-white/40 flex items-center justify-between shrink-0">
              <div className="relative w-full max-w-xl">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="LOCATE REGIONAL NODES..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-black text-slate-800 placeholder:text-slate-300 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-inner tracking-widest"
                />
              </div>
              <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <Network className="size-3" /> Map Grid Active
              </div>
            </div>

            {/* Scrollable Matrix */}
            <div className="overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <table className="w-full border-collapse">
                <thead className="bg-slate-50/80 sticky top-0 z-20 backdrop-blur">
                  <tr>
                    <th className="px-8 py-6 text-left text-[11px] font-black italic text-slate-800 uppercase tracking-[0.2em] border-b border-slate-100 w-64">
                      Regional Sector
                    </th>
                    <th className="px-6 py-6 text-left text-[11px] font-black italic text-slate-800 uppercase tracking-[0.2em] border-b border-slate-100">
                      Primary Node
                    </th>
                    <th className="px-6 py-6 text-left text-[11px] font-black italic text-slate-800 uppercase tracking-[0.2em] border-b border-slate-100">
                      Population Density
                    </th>
                    <th className="px-8 py-6 text-right text-[11px] font-black italic text-slate-800 uppercase tracking-[0.2em] border-b border-slate-100">
                      Tactical Controls
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50">
                  {filteredRegions.map((region) => (
                    <tr key={region.id} className="hover:bg-emerald-50/20 transition-all border-b border-slate-50 last:border-0 group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-[1rem] shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-colors border border-emerald-100 group-hover:border-emerald-600">
                            <MapPin className="size-4" />
                          </div>
                          <div>
                            <span className="block text-sm font-black text-slate-800 tracking-tight group-hover:text-emerald-900">{region.name}</span>
                            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 flex items-center gap-1.5">
                              <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">{region.code}</span>
                              • SECTOR ID
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                            <Building2 className="size-3.5 text-slate-400" />
                          </div>
                          <span className="text-xs font-bold text-slate-600 tracking-wide">{region.taxOffice}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-1.5">
                          <span className="text-lg font-black text-slate-900 tracking-tighter">{region.taxpayerCount.toLocaleString()}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleEditClick(region)}
                            className="p-2.5 text-slate-400 bg-white border border-slate-200 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 rounded-xl transition-all shadow-sm"
                          >
                            <Edit className="size-4" />
                          </button>
                          <button 
                            onClick={handleDelete}
                            className="p-2.5 text-slate-400 bg-white border border-slate-200 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 rounded-xl transition-all shadow-sm"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Regional Telemetry Sidebar (Right Column) */}
          <div className="space-y-10">
            
            {/* Network Node Metrics */}
            <div className={`${glassCard} flex flex-col`}>
              <div className="p-8 border-b border-white/50 bg-white/40 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-100 text-slate-600 rounded-[1rem] shadow-sm">
                    <Activity className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Network Telemetry</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Live Regional Metrics</p>
                  </div>
                </div>
              </div>
              
              <div className="p-8 space-y-8 flex-1">
                {/* Optimal Node Indicator */}
                <div className="p-6 bg-emerald-50 rounded-xl border-2 border-emerald-100 relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/20 rounded-full blur-[20px] group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-emerald-500 rounded-xl shadow-md shadow-emerald-500/20">
                        <TrendingUp className="size-4 text-white" />
                      </div>
                      <span className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.2em]">Optimal Node</span>
                    </div>
                    <div className="text-2xl font-black text-slate-900 tracking-tight">Centre Region</div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1.5 w-full bg-emerald-200/50 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[92%] rounded-full" />
                      </div>
                      <span className="text-[10px] font-black text-emerald-600 tracking-widest">92%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-5 bg-slate-50/50 p-6 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Total Active Nodes</div>
                    <div className="text-lg font-black text-slate-900">10</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Field Operatives</div>
                    <div className="text-lg font-black text-slate-900">145</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Signal Latency</div>
                    <div className="text-lg font-black text-slate-900">1.2 <span className="text-[10px] text-slate-400">DAYS</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Strategic Expansion Protocol */}
            <div className="bg-slate-900 rounded-2xl p-8 lg:p-10 relative overflow-hidden group hover:shadow-2xl hover:shadow-emerald-900/20 transition-all">
              <LocateFixed className="absolute -right-10 -bottom-10 size-64 text-emerald-500/10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 pointer-events-none" />
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                    <Focus className="size-5" />
                  </div>
                  <h3 className="text-xl font-black text-white tracking-tight">Strategic Expansion</h3>
                </div>
                
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                  <p className="text-[11px] font-bold text-slate-300 leading-relaxed uppercase tracking-wide">
                    Protocol execution for the new <span className="text-emerald-400 font-black border-b border-dashed border-emerald-500/50 pb-0.5">Coastal Region Node</span> is underway.
                  </p>
                  <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-700">
                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Target Deployment</span>
                    <span className="text-xs font-black text-white bg-slate-800 px-3 py-1 rounded-lg border border-slate-600">SEP 2026</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3 uppercase italic">
              <Building2 className="size-6 text-emerald-500" />
              {isEditMode ? 'Modify Hub' : 'Deploy Node'}
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-slate-500 italic">
              {isEditMode ? 'Modify parameters of an existing regional node.' : 'Provision a new regional headquarters node.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 my-4">
            <input 
              type="text"
              placeholder="REGION NAME"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xs font-black text-slate-800 focus:border-emerald-500 focus:bg-white outline-none tracking-widest italic uppercase"
            />
            <input 
              type="text"
              placeholder="REGION CODE (e.g. CR-01)"
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value})}
              className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xs font-black text-slate-800 focus:border-emerald-500 focus:bg-white outline-none tracking-widest italic uppercase"
            />
            <input 
              type="text"
              placeholder="TAX OFFICE LOCATION"
              value={formData.taxOffice}
              onChange={(e) => setFormData({...formData, taxOffice: e.target.value})}
              className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xs font-black text-slate-800 focus:border-emerald-500 focus:bg-white outline-none tracking-widest italic uppercase"
            />
          </div>
          <DialogFooter className="mt-4">
            <button onClick={() => setShowDialog(false)} className="px-6 py-3 border border-slate-200 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50">Abort</button>
            <button onClick={handleDeploy} className="px-6 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 shadow-md">
              {isEditMode ? 'Update Hub' : 'Deploy Hub'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
