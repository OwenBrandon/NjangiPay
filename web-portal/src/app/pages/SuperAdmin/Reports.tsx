import { getColorClass } from '../../utils/colorClasses';
import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, Banknote, Users, ShieldCheck, 
  Download, Calendar, Globe, PieChart as PieIcon,
  ArrowUpRight
} from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';
import { toast } from 'sonner';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

const taxTypeData = [
  { name: 'VAT', value: 74.2, percentage: 40, color: '#3b82f6' },
  { name: 'Corporate Tax', value: 46.5, percentage: 25, color: '#a855f7' },
  { name: 'Income Tax', value: 37.1, percentage: 20, color: '#10b981' },
  { name: 'Withholding Tax', value: 18.4, percentage: 10, color: '#f97316' },
  { name: 'Property Tax', value: 8.3, percentage: 5, color: '#ec4899' },
];

export default function SuperAdminReports() {
  const { regions } = useMockData();
  const [timeRange, setTimeRange] = useState('Last 12 Months');

  const regionData = regions.map(r => ({
    name: r.name,
    target: r.revenueTarget / 1000000,
    collected: r.revenueCollected / 1000000,
    percentage: r.revenueTarget ? Math.round((r.revenueCollected / r.revenueTarget) * 100) : 0
  }));

  const glassCard = 'bg-white rounded-2xl border border-slate-200/60 shadow-2xl shadow-blue-900/5 overflow-hidden';

  return (
    <div className="min-h-screen bg-[#f1f5f9] relative overflow-hidden">
      {/* Intelligence Background Blobs */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[25%] right-[5%] w-[25%] h-[25%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="p-6 lg:p-10 space-y-12 relative z-10">
        {/* Intelligence Command Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="size-3 rounded-full bg-blue-500 animate-ping absolute inset-0" />
                <div className="size-3 rounded-full bg-blue-600 relative" />
              </div>
              <span className="px-3 py-1 bg-blue-100/50 border border-blue-200 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Global Terminal</span>
              <span className="text-slate-400">•</span>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Super Admin Node</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">Global Reports</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => setTimeRange(timeRange === 'Last 12 Months' ? 'Year to Date' : 'Last 12 Months')}
              className="flex items-center gap-2 px-7 py-3.5 bg-white border border-slate-200 text-slate-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
            >
              <Calendar className="size-4" />
              {timeRange}
            </button>
            <button 
              onClick={() => {
                toast.success('Data Export Initiated');
                const headers = 'Region Name,Revenue Target (Millions),Revenue Collected (Millions),Completion Percentage\n';
                const rows = regionData.map(r => 
                  `"${r.name}",${r.target.toFixed(2)},${r.collected.toFixed(2)},${r.percentage}%`
                ).join('\n');
                const csvContent = headers + rows;
                
                setTimeout(() => {
                  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.setAttribute('href', url);
                  link.setAttribute('download', `global_revenue_report_${new Date().toISOString().split('T')[0]}.csv`);
                  link.style.visibility = 'hidden';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  toast.success('Export Completed');
                }, 1000);
              }}
              className="flex items-center gap-2 px-7 py-3.5 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-200/50"
            >
              <Download className="size-4" />
              Export Data
            </button>
          </div>
        </div>

        {/* Intelligence KPI Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Total Annual Revenue', value: 'FCFA 184.5M', trend: '+12.5%', icon: Banknote, color: 'blue', up: true },
            { label: 'Total Taxpayers', value: '61,010', trend: '+5.2%', icon: Users, color: 'purple', up: true },
            { label: 'Compliance Rate', value: '88.4%', trend: '-1.2%', icon: ShieldCheck, color: 'emerald', up: false },
          ].map((kpi, i) => (
            <div key={i} className={`group relative bg-white rounded-2xl border border-slate-100 p-9 shadow-lg hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-700 overflow-hidden cursor-default`}>
              <div className={`absolute -top-16 -right-16 w-40 h-40 ${getColorClass(kpi.color, 'bg500_5')} rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-1000`} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div 
                    className="p-5 shadow-md rounded-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-white/50"
                    style={{ background: '#0d1929', color: '#38bdf8' }}
                  >
                    <kpi.icon className="size-7" />
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black tracking-[0.1em] uppercase ${kpi.up ? 'bg-sky-100 text-sky-600' : 'bg-rose-100 text-rose-600'}`}>
                    {kpi.up ? <ArrowUpRight className="size-3" /> : <TrendingDown className="size-3" />}
                    {kpi.trend}
                  </div>
                </div>
                <div className="text-[11px] font-black text-slate-600 uppercase tracking-[0.25em] mb-3">{kpi.label}</div>
                <div className="text-5xl font-black text-slate-900 tracking-tighter group-hover:text-blue-600 transition-colors">{kpi.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Global Analytic Terminals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Regional Revenue Matrix */}
          <div className={`${glassCard} flex flex-col`}>
            <div className="p-10 border-b border-white/50 bg-white/30 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Regional Revenue</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Collection velocity against targets</p>
              </div>
              <div className="p-4 bg-emerald-100 text-emerald-600 rounded-xl shadow-sm">
                <Globe className="size-6" />
              </div>
            </div>
            
            <div className="p-10 flex-1">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={regionData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 900 }} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 900 }} width={100} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '25px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', padding: '20px' }}
                    itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                    formatter={(value: number) => `FCFA ${value.toFixed(1)}M`}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', paddingTop: '20px' }} />
                  <Bar dataKey="collected" fill="#10b981" radius={[0, 10, 10, 0]} name="Collected" barSize={12} />
                  <Bar dataKey="target" fill="#cbd5e1" radius={[0, 10, 10, 0]} name="Target" barSize={12} />
                </BarChart>
              </ResponsiveContainer>
              
              <div className="mt-6 flex flex-wrap gap-4">
                {regionData.slice(0, 3).map((r) => (
                  <div key={r.name} className="flex-1 bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between group">
                    <div>
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{r.name}</div>
                      <div className="text-xl font-black text-slate-900 tracking-tighter group-hover:text-emerald-600 transition-colors">${r.collected.toFixed(1)}M</div>
                    </div>
                    <div className={`size-10 rounded-full flex items-center justify-center text-[10px] font-black ${r.percentage >= 85 ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' : 'bg-orange-100 text-orange-600 border border-orange-200'}`}>
                      {r.percentage}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Revenue Breakdown Matrix */}
          <div className={`${glassCard} flex flex-col`}>
            <div className="p-10 border-b border-white/50 bg-white/30 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Tax Type Breakdown</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Portfolio revenue distribution</p>
              </div>
              <div className="p-4 bg-purple-100 text-purple-600 rounded-xl shadow-sm">
                <PieIcon className="size-6" />
              </div>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center p-10">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie 
                    data={taxTypeData} 
                    cx="50%" cy="50%" 
                    innerRadius={90} 
                    outerRadius={130} 
                    paddingAngle={5} 
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {taxTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '25px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', padding: '20px' }}
                    itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                    formatter={(value: number) => `FCFA ${value.toFixed(1)}M`}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="grid grid-cols-2 gap-x-8 gap-y-6 mt-10 w-full">
                {taxTypeData.map((item) => (
                  <div key={item.name} className="group cursor-pointer">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="size-3 rounded-full transition-transform group-hover:scale-150 shadow-sm" style={{ backgroundColor: item.color }} />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest truncate">{item.name}</span>
                    </div>
                    <div className="flex items-end gap-3 ml-6">
                      <div className="text-2xl font-black text-slate-900 tracking-tighter group-hover:text-blue-600 transition-colors">${item.value}M</div>
                      <div className="text-[10px] font-black text-slate-400 mb-1.5">{item.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 w-full">
                <p className="text-xs text-slate-500 leading-relaxed font-bold italic text-center">
                  "VAT remains the primary revenue driver, contributing 40% of the total collection. 
                  Growth in Corporate Tax was notably strong in Q1."
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
