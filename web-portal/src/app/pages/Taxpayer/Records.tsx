import { useState } from 'react';
import { FileText, Download, Terminal, Search, Filter, CheckCircle, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';
import { useMockData } from '../../contexts/MockDataContext';
import { useAuth } from '../../contexts/AuthContext';

export default function TaxpayerRecords() {
  const glassCard = 'bg-white rounded-2xl border border-slate-200/60 shadow-lg shadow-blue-900/5 overflow-hidden';
  const terminalGrid = "";
  const { taxReturns, taxpayers } = useMockData();
  const { currentUser } = useAuth();

  const currentTaxpayer = taxpayers.find(t => t.userId === currentUser?.id || t.email === currentUser?.email);
  const taxpayerReturns = taxReturns.filter(tr => tr.taxpayerId === currentTaxpayer?.id && tr.status === 'filed');

  const mockRecords = taxpayerReturns.map(tr => ({
    id: tr.id.startsWith('TR-') ? tr.id.replace('TR-', 'REC-') : `REC-0${tr.id}`,
    year: tr.period.split('-')[0] || '2026',
    type: `${tr.taxType} Return - ${tr.period.split('-')[1]?.toUpperCase() || 'Annual'}`,
    submitted: tr.filingDate || 'Pending',
    amount: `FCFA ${tr.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
    status: tr.status === 'filed' ? 'PROCESSED' : tr.status.toUpperCase(),
  }));

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'CIT' | 'VAT'>('ALL');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const filteredRecords = mockRecords.filter(rec => {
    const matchesSearch = rec.type.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          rec.year.includes(searchQuery) ||
                          rec.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'ALL' || 
                          (filterType === 'CIT' && rec.type.includes('CIT')) || 
                          (filterType === 'VAT' && rec.type.includes('VAT'));
    return matchesSearch && matchesFilter;
  });

  const handleDownloadReceipt = (rec: typeof mockRecords[0]) => {
    const receiptContent = `==================================================
GOVERNMENT REVENUE AUTHORITY
TAX FILING RECEIPT
==================================================
Receipt ID:       ${rec.id}
Tax Year:         ${rec.year}
Return Type:      ${rec.type}
Submission Date:  ${rec.submitted}
Assessed Tax:     ${rec.amount}
Filing Status:    ${rec.status}
==================================================
This is a legally binding receipt of tax return filing.
Generated on:     ${new Date().toLocaleString()}
==================================================`;

    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `receipt_${rec.id}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Receipt Download Completed', {
      description: `Receipt for ${rec.type} (${rec.id}) has been saved.`
    });
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] relative overflow-hidden p-8 lg:p-12">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Header Section */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="size-3 rounded-full bg-blue-500 animate-ping absolute inset-0" />
              <div className="size-3 rounded-full bg-blue-600 relative" />
            </div>
            <span className="px-3 py-1 bg-blue-100/50 border border-blue-200 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Taxpayer Portal</span>
            <span className="text-slate-400">•</span>
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Records Archive</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mt-2">Filing Records</h1>
          <p className="text-sm text-slate-500 font-medium">View your complete history of filing returns and receipts</p>
        </div>
      </div>

      {/* Filter Options */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search records by year or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all placeholder:text-slate-400 text-slate-700 font-medium"
          />
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="flex items-center gap-2 px-5 py-3 border border-slate-200 text-slate-700 bg-white/80 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-wider hover:bg-white transition-colors"
          >
            <Filter className="size-3.5" />
            Filter: {filterType}
          </button>
          
          {showFilterDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 overflow-hidden">
              <button 
                onClick={() => { setFilterType('ALL'); setShowFilterDropdown(false); }} 
                className="w-full text-left px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors uppercase tracking-wider"
              >
                Show All
              </button>
              <button 
                onClick={() => { setFilterType('CIT'); setShowFilterDropdown(false); }} 
                className="w-full text-left px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors uppercase tracking-wider"
              >
                Corporate Tax (CIT)
              </button>
              <button 
                onClick={() => { setFilterType('VAT'); setShowFilterDropdown(false); }} 
                className="w-full text-left px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors uppercase tracking-wider"
              >
                Value Added Tax (VAT)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Records Table */}
      <div className={`${glassCard} relative z-10`}>
        <div className="px-8 py-6 border-b border-slate-200/50 bg-white/50">
          <h3 className="text-lg font-black text-slate-900 uppercase">Filing History</h3>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Submitted tax returns and official receipt download links</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-200/50 text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">
              <tr>
                <th className="px-8 py-5">Record ID</th>
                <th className="px-8 py-5">Tax Year</th>
                <th className="px-8 py-5">Return Type</th>
                <th className="px-8 py-5">Submission Date</th>
                <th className="px-8 py-5">Assessed Tax</th>
                <th className="px-8 py-5">Filing Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5 font-mono font-bold text-xs text-slate-900">{rec.id}</td>
                  <td className="px-8 py-5 text-xs text-slate-500 font-mono font-bold">{rec.year}</td>
                  <td className="px-8 py-5 text-xs font-bold text-slate-800">{rec.type}</td>
                  <td className="px-8 py-5 text-xs text-slate-500 font-mono font-medium">{rec.submitted}</td>
                  <td className="px-8 py-5 text-sm font-black text-slate-900 font-mono">{rec.amount}</td>
                  <td className="px-8 py-5">
                    <span className="inline-flex px-2.5 py-1 rounded-full border border-blue-200/50 bg-blue-50 text-blue-600 text-[8px] font-black uppercase tracking-wider font-mono">
                      {rec.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => handleDownloadReceipt(rec)}
                      className="inline-flex items-center justify-center size-8 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 rounded-xl transition-all shadow-sm" 
                      title="Download Receipt"
                    >
                      <Download className="size-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-8 py-10 text-center text-xs font-bold text-slate-400">
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
