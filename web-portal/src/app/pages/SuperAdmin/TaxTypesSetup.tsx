import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Database, ShieldAlert, Cpu } from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';

export default function TaxTypesSetup() {
  const { taxTypes, addTaxType, updateTaxType } = useMockData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ name: string; code: string; rate: number; description: string; filingFrequency: 'monthly' | 'quarterly' | 'annually' }>({ name: '', code: '', rate: 0, description: '', filingFrequency: 'monthly' });
  
  const filteredTaxTypes = taxTypes.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeploy = () => {
    if (isEditMode && editingId) {
      updateTaxType({
        id: editingId,
        name: formData.name,
        code: formData.code,
        rate: formData.rate,
        description: formData.description,
        filingFrequency: formData.filingFrequency
      });
      toast.success('Tax Protocol Updated Successfully');
    } else {
      addTaxType({
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        code: formData.code,
        rate: formData.rate,
        description: formData.description,
        filingFrequency: formData.filingFrequency
      });
      toast.success('Tax Protocol Initialized Successfully');
    }
    setShowDialog(false);
  };

  const handleEditClick = (type: any) => {
    setIsEditMode(true);
    setEditingId(type.id);
    setFormData({
      name: type.name,
      code: type.code,
      rate: type.rate,
      description: type.description || '',
      filingFrequency: type.filingFrequency
    });
    setShowDialog(true);
  };

  const handleCreateClick = () => {
    setIsEditMode(false);
    setEditingId(null);
    setFormData({ name: '', code: '', rate: 0, description: '', filingFrequency: 'monthly' });
    setShowDialog(true);
  };

  const handleDelete = () => toast.error('Security Policy: Cannot delete core tax schemas');

  const glassCard = 'bg-white rounded-2xl border border-slate-200/60 shadow-2xl shadow-blue-900/5 overflow-hidden';

  return (
    <div className="min-h-screen bg-[#f1f5f9] relative overflow-hidden">
      {/* Intelligence Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="p-6 lg:p-10 space-y-12 relative z-10">
        {/* Command Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="size-3 rounded-full bg-blue-500 animate-ping absolute inset-0" />
                <div className="size-3 rounded-full bg-blue-600 relative" />
              </div>
              <span className="px-3 py-1 bg-blue-100/50 border border-blue-200 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Tax Protocol Hub</span>
              <span className="text-slate-400">•</span>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Core Tax Schemas</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">Tax Types Setup</h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleCreateClick}
              className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-200/50 hover:scale-105"
            >
              <Plus className="size-5" />
              Initialize Tax Node
            </button>
          </div>
        </div>

        {/* Matrix Container */}
        <div className={`${glassCard}`}>
          
          {/* Command Search */}
          <div className="px-8 py-6 border-b border-slate-100/50 bg-white/40 flex items-center justify-between">
            <div className="relative w-full max-w-xl">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
              <input
                type="text"
                placeholder="SEARCH TAX PROTOCOLS..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-black text-slate-800 placeholder:text-slate-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-inner tracking-widest"
              />
            </div>
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <Cpu className="size-3" /> System Synchronized
            </div>
          </div>

          {/* Forensic Data Grid */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-slate-50/80">
                <tr>
                  <th className="px-8 py-6 text-left text-[11px] font-black italic text-slate-800 uppercase tracking-[0.2em] border-b border-slate-100 w-64">
                    Tax Name Protocol
                  </th>
                  <th className="px-6 py-6 text-left text-[11px] font-black italic text-slate-800 uppercase tracking-[0.2em] border-b border-slate-100">
                    Node Code
                  </th>
                  <th className="px-6 py-6 text-left text-[11px] font-black italic text-slate-800 uppercase tracking-[0.2em] border-b border-slate-100">
                    Default Parameter
                  </th>
                  <th className="px-6 py-6 text-left text-[11px] font-black italic text-slate-800 uppercase tracking-[0.2em] border-b border-slate-100">
                    Filing Velocity
                  </th>
                  <th className="px-8 py-6 text-right text-[11px] font-black italic text-slate-800 uppercase tracking-[0.2em] border-b border-slate-100">
                    Tactical Controls
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50">
                {filteredTaxTypes.map((type) => (
                  <tr key={type.id} className="hover:bg-blue-50/20 transition-all border-b border-slate-50 last:border-0 group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-[1rem] shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors border border-blue-100 group-hover:border-blue-600">
                          <Database className="size-4" />
                        </div>
                        <div>
                          <span className="block text-sm font-black text-slate-800 tracking-tight group-hover:text-blue-900">{type.name}</span>
                          <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Core Revenue Metric</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 font-black uppercase tracking-widest text-[10px] rounded-lg">
                        {type.code}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg font-black text-slate-900 tracking-tighter">{type.rate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border ${
                        type.filingFrequency.toLowerCase() === 'monthly' 
                          ? 'bg-purple-50 text-purple-700 border-purple-200' 
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {type.filingFrequency}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEditClick(type)}
                          className="p-2.5 text-slate-400 bg-white border border-slate-200 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 rounded-xl transition-all shadow-sm"
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
          
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-3 text-slate-500">
            <ShieldAlert className="size-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Modification of tax schema requires administrative super-clearance</span>
          </div>
        </div>
      </div>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3 uppercase italic">
              <Database className="size-6 text-blue-500" />
              {isEditMode ? 'Modify Tax Node' : 'Initialize Tax Node'}
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-slate-500 italic">
              {isEditMode ? 'Modify parameters of an existing tax schema.' : 'Create a new operational tax schema on the core network.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 my-4">
            <input 
              type="text"
              placeholder="TAX NAME (e.g. Value Added Tax)"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xs font-black text-slate-800 focus:border-blue-500 focus:bg-white outline-none tracking-widest italic uppercase"
            />
            <input 
              type="text"
              placeholder="TAX CODE (e.g. VAT)"
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value})}
              className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xs font-black text-slate-800 focus:border-blue-500 focus:bg-white outline-none tracking-widest italic uppercase"
            />
            <input 
              type="number"
              placeholder="DEFAULT RATE %"
              value={formData.rate || ''}
              onChange={(e) => setFormData({...formData, rate: Number(e.target.value)})}
              className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xs font-black text-slate-800 focus:border-blue-500 focus:bg-white outline-none tracking-widest italic uppercase"
            />
            <input 
              type="text"
              placeholder="DESCRIPTION"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xs font-black text-slate-800 focus:border-blue-500 focus:bg-white outline-none tracking-widest italic uppercase"
            />
            <select
              value={formData.filingFrequency}
              onChange={(e) => setFormData({...formData, filingFrequency: e.target.value as 'monthly' | 'quarterly' | 'annually'})}
              className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xs font-black text-slate-800 focus:border-blue-500 focus:bg-white outline-none tracking-widest italic uppercase appearance-none"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annually">Annually</option>
            </select>
          </div>
          <DialogFooter className="mt-4">
            <button onClick={() => setShowDialog(false)} className="px-6 py-3 border border-slate-200 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50">Abort</button>
            <button onClick={handleDeploy} className="px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-md">
              {isEditMode ? 'Update Node' : 'Deploy Node'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
