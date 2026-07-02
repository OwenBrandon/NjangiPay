import { getColorClass } from '../../utils/colorClasses';
import React, { useState } from 'react';
import { Percent, ArrowUpRight, History, Activity, AlertTriangle, Zap, CheckCircle2 } from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';
import { toast } from 'sonner';

export default function TaxRatesSetup() {
  const { taxTypes, updateTaxType } = useMockData();
  const [localRates, setLocalRates] = useState<Record<string, number>>({});
  
  const glassCard = 'bg-white rounded-2xl border border-slate-200/60 shadow-2xl shadow-blue-900/5 overflow-hidden';

  return (
    <div className="min-h-screen bg-[#f1f5f9] relative overflow-hidden">
      {/* Intelligence Background Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="p-6 lg:p-10 space-y-12 relative z-10">
        {/* Fiscal Command Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="size-3 rounded-full bg-blue-500 animate-ping absolute inset-0" />
                <div className="size-3 rounded-full bg-blue-600 relative" />
              </div>
              <span className="px-3 py-1 bg-blue-100/50 border border-blue-200 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Fiscal Policy Hub</span>
              <span className="text-slate-400">•</span>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Rate Configuration Terminal</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">Tax Rates Setup</h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => toast.success('Global Rate Adjustment Initialized')}
              className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-200/50 hover:scale-105"
            >
              <Percent className="size-5" />
              Initialize Rate Adjustment
            </button>
          </div>
        </div>

        <div className="space-y-10">
          {/* Top Section: Operational Log & Telemetry */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Forensic Operational Log */}
            <div className={`${glassCard} lg:col-span-2`}>
              <div className="p-8 border-b border-white/50 bg-white/40 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-100 text-slate-600 rounded-[1rem] shadow-sm">
                    <History className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Operational Log</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Historical Rate Modifications</p>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-slate-100/50">
                {[
                  { type: 'VAT', from: 12, to: 15, date: '2024-01-01', user: 'Sarah Johnson' },
                  { type: 'PIT', from: 22, to: 25, date: '2023-06-15', user: 'Sarah Johnson' },
                ].map((change, i) => (
                  <div key={i} className="p-8 hover:bg-slate-50/50 transition-all group flex items-center justify-between">
                    <div>
                      <div className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                        {change.type} <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Adjustment Protocol</span>
                      </div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                        EXEC: {change.date} • NODE: {change.user}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 px-5 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm group-hover:border-emerald-200 transition-colors">
                      <div className="text-sm font-black text-slate-300 line-through">{change.from}%</div>
                      <div className="size-6 bg-emerald-100 rounded-full flex items-center justify-center">
                        <ArrowUpRight className="size-3.5 text-emerald-600" />
                      </div>
                      <div className="text-xl font-black text-emerald-600 tracking-tighter">{change.to}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Predictive Telemetry Box */}
            <div className="bg-orange-50/80 backdrop-blur-md rounded-2xl border-2 border-dashed border-orange-200 p-8 relative overflow-hidden group hover:bg-orange-50 transition-colors lg:col-span-1">
              <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <Zap className="size-48 text-orange-500" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-orange-100 text-orange-600 rounded-[1rem]">
                    <AlertTriangle className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-orange-900 tracking-tight">Predictive Telemetry</h3>
                    <p className="text-[9px] text-orange-600 font-black uppercase tracking-widest mt-0.5">Fiscal Impact Analysis</p>
                  </div>
                </div>
                <div className="bg-white/50 border border-orange-100 rounded-xl p-5 shadow-sm">
                  <p className="text-sm font-bold text-orange-800 leading-loose">
                    Calibrating <span className="px-2 py-1 bg-white border border-orange-200 rounded-lg font-black mx-1">VAT</span> from 
                    <span className="px-2 py-1 bg-white border border-orange-200 rounded-lg font-black text-slate-400 line-through mx-1">15%</span> to 
                    <span className="px-2 py-1 bg-orange-500 text-white border border-orange-600 rounded-lg font-black mx-1">16%</span> increases revenue by <span className="text-emerald-600 font-black text-lg underline decoration-emerald-200 decoration-2 underline-offset-4 whitespace-nowrap">{"FCFA "}12.4M</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Active Tax Rates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {taxTypes.map((type, i) => {
              const color = ['blue', 'purple', 'emerald', 'amber', 'rose'][i % 5];
              const displayRate = localRates[type.id] !== undefined ? localRates[type.id] : type.rate;
              return (
                <div key={type.id} className={`${glassCard} transition-all duration-500 hover:-translate-y-1 group relative flex flex-col`}>
                  <div className={`absolute -right-16 -top-16 w-32 h-32 ${getColorClass(color, 'bg500_10')} rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
                  
                  <div className="p-8 relative z-10 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div className={`p-4 ${getColorClass(color, 'bg50')} ${getColorClass(color, 'text600')} rounded-xl shadow-sm border ${getColorClass(color, 'border100')} shrink-0`}>
                          <Percent className="size-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight">{type.name}</h3>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded-md">{type.code}</span>
                            • ACTIVE
                          </p>
                        </div>
                      </div>
                      
                      <div className={`${getColorClass(color, 'bg50')} px-4 py-2 rounded-2xl border ${getColorClass(color, 'border100')} shadow-sm flex flex-col items-center justify-center shrink-0`}>
                        <div className={`text-[8px] ${getColorClass(color, 'text500')} font-black uppercase tracking-[0.2em] mb-1`}>Rate</div>
                        <div className={`text-2xl font-black ${getColorClass(color, 'text600')} tracking-tighter leading-none`}>{type.rate}%</div>
                      </div>
                    </div>

                    <div className="mt-auto space-y-4 bg-slate-50/50 p-5 rounded-3xl border border-slate-100">
                      <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.15em] ml-2">Calibrate Parameter</label>
                      <div className="flex flex-col gap-3">
                        <div className="relative">
                          <Percent className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                          <input 
                            type="number" 
                            value={displayRate}
                            onChange={(e) => setLocalRates({...localRates, [type.id]: Number(e.target.value)})}
                            className={`w-full pl-5 pr-10 py-3 bg-white border-2 border-slate-100 rounded-2xl text-base font-black text-slate-800 placeholder:text-slate-300 focus:bg-white focus:${getColorClass(color, 'border400')} focus:ring-4 ${getColorClass(color, 'focusRing500_10')} outline-none transition-all shadow-inner`}
                          />
                        </div>
                        <button 
                          onClick={() => {
                            updateTaxType({ ...type, rate: displayRate });
                            toast.success(`${type.name} Rate updated to ${displayRate}%`);
                          }}
                          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                        >
                          <CheckCircle2 className="size-3.5" /> Commit Target
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
