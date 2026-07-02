import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Search, User, Mail, Phone, MapPin, Calendar, FileCheck, AlertTriangle, History, Shield, CheckCircle, Terminal, X, ArrowUpRight, Check, AlertCircle, MessageSquare } from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';
import { toast } from 'sonner';

export default function UserLookup() {
  const navigate = useNavigate();
  const { taxpayers } = useMockData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTaxpayer, setSelectedTaxpayer] = useState(taxpayers[0] || null as any);

  useEffect(() => {
    if (taxpayers.length > 0 && !selectedTaxpayer) {
      setSelectedTaxpayer(taxpayers[0]);
    }
  }, [taxpayers]);

  // Modal display states
  const [showHashModal, setShowHashModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Hash audit states
  const [activeHashAudit, setActiveHashAudit] = useState(false);
  const [hashProgress, setHashProgress] = useState(0);
  const [hashVerified, setHashVerified] = useState(false);

  // Form states
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactPriority, setContactPriority] = useState('Medium');

  const [incidentSubject, setIncidentSubject] = useState('');
  const [incidentPriority, setIncidentPriority] = useState('Medium');
  const [incidentDesc, setIncidentDesc] = useState('');

  // Taxpayer-specific logs
  const [taxpayerTickets, setTaxpayerTickets] = useState<Record<string, Array<{id: string, subject: string, status: string, date: string}>>>({
    '1': [
      { id: 'TKT-1024', subject: 'Portal Login Issue', status: 'resolved', date: 'May 02' },
      { id: 'TKT-1002', subject: 'Refund Request #881', status: 'closed', date: 'Apr 28' },
    ],
    '2': [
      { id: 'TKT-1105', subject: 'Payment Offset Delay', status: 'resolved', date: 'May 10' },
    ],
    '3': [
      { id: 'TKT-1804', subject: 'Portal Login Issue', status: 'resolved', date: 'May 02' },
      { id: 'TKT-1802', subject: 'Refund Request #881', status: 'closed', date: 'Apr 28' },
      { id: 'TKT-0962', subject: 'TIN Verification', status: 'resolved', date: 'Apr 15' },
    ],
    '5': [
      { id: 'TKT-1440', subject: 'VAT Verification Error', status: 'resolved', date: 'May 14' },
    ],
  });

  const [taxpayerCompliance, setTaxpayerCompliance] = useState<Record<string, Array<{label: string, status: 'verified' | 'pending' | 'none'}>>>({
    '1': [
      { label: 'Business License', status: 'verified' },
      { label: 'ID Verification', status: 'verified' },
      { label: 'TIN Certificate', status: 'verified' },
      { label: 'Tax Clearance', status: 'pending' },
    ],
    '2': [
      { label: 'Business License', status: 'verified' },
      { label: 'ID Verification', status: 'verified' },
      { label: 'TIN Certificate', status: 'pending' },
      { label: 'Tax Clearance', status: 'none' },
    ],
    '3': [
      { label: 'Business License', status: 'verified' },
      { label: 'ID Verification', status: 'verified' },
      { label: 'TIN Certificate', status: 'pending' },
      { label: 'Tax Clearance', status: 'none' },
    ],
    '5': [
      { label: 'Business License', status: 'verified' },
      { label: 'ID Verification', status: 'verified' },
      { label: 'TIN Certificate', status: 'verified' },
      { label: 'Tax Clearance', status: 'verified' },
    ],
  });

  const glassCard = 'bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] overflow-hidden';
  const terminalGrid = "bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:30px_30px]";

  const filteredTaxpayers = taxpayers.filter(tp =>
    tp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tp.tin.includes(searchQuery)
  );

  const selectedIncidents = taxpayerTickets[selectedTaxpayer.id] || [
    { id: 'TKT-0821', subject: 'General Tax Inquiry', status: 'resolved', date: 'Mar 15' }
  ];

  const selectedCompliance = taxpayerCompliance[selectedTaxpayer.id] || [
    { label: 'Business License', status: 'pending' },
    { label: 'ID Verification', status: 'none' },
    { label: 'TIN Certificate', status: 'none' },
    { label: 'Tax Clearance', status: 'none' },
  ];

  const runHashAudit = () => {
    setActiveHashAudit(true);
    setHashProgress(0);
    setHashVerified(false);
  };

  React.useEffect(() => {
    if (!activeHashAudit || hashProgress >= 100) return;
    const timer = setTimeout(() => {
      setHashProgress(p => {
        if (p >= 100) {
          setActiveHashAudit(false);
          setHashVerified(true);
          return 100;
        }
        return p + 20;
      });
    }, 150);
    return () => clearTimeout(timer);
  }, [activeHashAudit, hashProgress]);

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentSubject.trim()) {
      toast.error('Subject is required');
      return;
    }
    const newId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newIncident = {
      id: newId,
      subject: incidentSubject,
      status: 'open',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
    };
    
    setTaxpayerTickets(prev => ({
      ...prev,
      [selectedTaxpayer.id]: [newIncident, ...(prev[selectedTaxpayer.id] || [])]
    }));
    
    setShowIncidentModal(false);
    setIncidentSubject('');
    setIncidentDesc('');
    toast.success('Incident Created', { description: `Incident node ${newId} logged successfully.` });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactSubject.trim() || !contactMessage.trim()) {
      toast.error('Subject and message are required');
      return;
    }
    setShowContactModal(false);
    setContactSubject('');
    setContactMessage('');
    toast.success('Dispatch Transmitted', {
      description: `Telemetry message on "${contactSubject}" sent to taxpayer secure node.`
    });
  };

  const handleVerifyDoc = (docLabel: string) => {
    setTaxpayerCompliance(prev => {
      const currentList = prev[selectedTaxpayer.id] || [
        { label: 'Business License', status: 'pending' },
        { label: 'ID Verification', status: 'none' },
        { label: 'TIN Certificate', status: 'none' },
        { label: 'Tax Clearance', status: 'none' },
      ];
      // Check if doc exists in compliance
      const exists = currentList.some(doc => doc.label === docLabel);
      let updatedList = [];
      if (exists) {
        updatedList = currentList.map(doc => 
          doc.label === docLabel ? { ...doc, status: 'verified' as const } : doc
        );
      } else {
        updatedList = [...currentList, { label: docLabel, status: 'verified' as const }];
      }
      return {
        ...prev,
        [selectedTaxpayer.id]: updatedList
      };
    });
    toast.success('Document Verified', { description: `${docLabel} status set to VERIFIED.` });
  };

  const handleToggleStatus = () => {
    const newStatus = selectedTaxpayer.status === 'active' ? 'suspended' : 'active';
    selectedTaxpayer.status = newStatus;
    setSelectedTaxpayer({ ...selectedTaxpayer, status: newStatus });
    setShowStatusModal(false);
    toast.success('Taxpayer Status Updated', {
      description: `Taxpayer ${selectedTaxpayer.name} status is now ${newStatus.toUpperCase()}.`
    });
  };

  if (!selectedTaxpayer) {
    return <div className="p-12 text-center font-black uppercase tracking-widest text-slate-400">Loading taxpayer data...</div>;
  }

  return (
    <div className={`min-h-screen bg-[#f8fafc] relative overflow-hidden ${terminalGrid} p-8 lg:p-12`}>
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] size-[50%] bg-blue-400/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] size-[50%] bg-indigo-400/5 blur-[120px] rounded-full" />
      </div>

      {/* Header Section */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="px-3 py-1 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] italic">Forensic Identity Lookup</div>
            <div className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] font-mono">INTELLIGENCE_READY</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.9]">
            Taxpayer <span className="text-blue-600 underline decoration-slate-900 decoration-8 underline-offset-8">Lookup</span>
          </h1>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-[0.4em] mt-8 flex items-center gap-3 italic">
            <Terminal className="size-4 text-blue-600" />
            Verify Profiles and Identify Support Resolution History
          </p>
        </div>
        
        <button 
          onClick={() => {
            setHashVerified(false);
            setHashProgress(0);
            setActiveHashAudit(false);
            setShowHashModal(true);
          }}
          className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
        >
          <Shield className="size-4 animate-pulse" />
          Verify Identity Hash
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
        {/* Search Results Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search name or TIN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/80 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all font-medium"
            />
          </div>
          
          <div className={`${glassCard} max-h-[600px] overflow-y-auto divide-y divide-slate-100 border-none shadow-[0_24px_48px_-12px_rgba(0,0,0,0.03)]`}>
            <div className="px-5 py-4 bg-white/50 border-b border-slate-100 flex items-center justify-between">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">SEARCH_RESULTS</span>
              <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest font-mono">{filteredTaxpayers.length} found</span>
            </div>
            {filteredTaxpayers.map((tp) => (
              <button
                key={tp.id}
                onClick={() => setSelectedTaxpayer(tp)}
                className={`w-full p-5 flex items-start gap-4 hover:bg-slate-50/50 transition-colors text-left ${
                  selectedTaxpayer.id === tp.id ? 'bg-slate-900/5 border-l-4 border-slate-900' : ''
                }`}
              >
                <div className="size-9 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-black uppercase italic flex-shrink-0">
                  {tp.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-black text-slate-800 truncate uppercase tracking-wider">{tp.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-1 tracking-wider">{tp.tin}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Taxpayer Detail View */}
        <div className="lg:col-span-3 space-y-8">
          <div className={`${glassCard} p-8 lg:p-10 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.03)] border-none`}>
            <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-6">
              <div className="flex items-center gap-6 flex-wrap">
                <div className="size-20 rounded-xl bg-slate-900 text-white flex items-center justify-center text-3xl font-black uppercase italic shadow-lg shadow-slate-900/10">
                  {selectedTaxpayer.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">{selectedTaxpayer.name}</h2>
                  <div className="flex items-center gap-4 mt-3 flex-wrap">
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <Shield className="size-4 text-blue-600" />
                      TIN: <span className="font-mono text-slate-800 font-black">{selectedTaxpayer.tin}</span>
                    </span>
                    <button 
                      onClick={() => setShowStatusModal(true)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border hover:scale-105 active:scale-95 transition-all ${
                        selectedTaxpayer.status === 'active' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'
                      }`}
                    >
                      {selectedTaxpayer.status}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowContactModal(true)}
                  className="px-5 py-3 border border-slate-200 text-slate-700 bg-white/50 rounded-2xl text-[10px] font-black uppercase tracking-wider hover:bg-white transition-colors"
                >
                  Contact Node
                </button>
                <button 
                  onClick={() => setShowIncidentModal(true)}
                  className="px-5 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-wider hover:bg-slate-800 transition-colors shadow-sm"
                >
                  Create Incident
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono pb-2 border-b border-slate-100">CONTACT_TELEMETRY</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs">
                    <Mail className="size-4 text-slate-400" />
                    <span className="text-slate-800 font-medium">{selectedTaxpayer.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <Phone className="size-4 text-slate-400" />
                    <span className="text-slate-800 font-medium">{selectedTaxpayer.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <MapPin className="size-4 text-slate-400" />
                    <span className="text-slate-800 font-medium leading-relaxed">{selectedTaxpayer.address}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono pb-2 border-b border-slate-100">SYSTEM_METADATA</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs">
                    <Calendar className="size-4 text-slate-400" />
                    <span className="text-slate-800 font-medium">Registry: {new Date(selectedTaxpayer.registrationDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <FileCheck className="size-4 text-slate-400" />
                    <span className="text-slate-800 font-medium">{selectedTaxpayer.region} Jurisdiction Office</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono pb-2 border-b border-slate-100">INCIDENT_ALERTS</h4>
                <div className="p-4 bg-orange-500/10 rounded-2xl border border-orange-500/20">
                  <div className="flex items-center gap-2 text-orange-600 font-black text-[10px] uppercase tracking-wider mb-1.5">
                    <AlertTriangle className="size-4" /> {selectedIncidents.filter(i => i.status === 'open').length} Open Incidents
                  </div>
                  <p className="text-[9px] text-orange-600/90 leading-relaxed font-medium">Taxpayer reports session timeout anomalies during VAT filing cycles.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Ticket History */}
            <div className={`${glassCard} p-6 shadow-sm border-none`}>
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200/50">
                <h3 className="text-xs font-black text-slate-800 uppercase italic flex items-center gap-2">
                  <History className="size-4 text-blue-600" />
                  Incident Log
                </h3>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">LAST_{selectedIncidents.length}_NODES</span>
              </div>
              <div className="space-y-3">
                {selectedIncidents.map((t, i) => (
                  <div 
                    key={i} 
                    onClick={() => {
                      toast.info('Accessing Incident Details', { description: `Redirecting to ticketing node for ${t.id}` });
                      navigate(`/support/tickets/1`);
                    }}
                    className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-100/50 hover:border-blue-300 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono font-black text-slate-400 group-hover:text-blue-600 transition-colors">{t.id}</span>
                      <span className="text-xs font-bold text-slate-800">{t.subject}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-black text-slate-400 uppercase font-mono">{t.date}</span>
                      {t.status === 'resolved' || t.status === 'closed' ? (
                        <CheckCircle className="size-3.5 text-emerald-500" />
                      ) : (
                        <AlertCircle className="size-3.5 text-blue-500 animate-pulse" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Documents */}
            <div className={`${glassCard} p-6 shadow-sm border-none`}>
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200/50">
                <h3 className="text-xs font-black text-slate-800 uppercase italic flex items-center gap-2">
                  <FileCheck className="size-4 text-blue-600" />
                  Compliance Matrix
                </h3>
                <button 
                  onClick={() => setShowDocsModal(true)}
                  className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline font-mono"
                >
                  VIEW_ALL_DOCS
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {selectedCompliance.map((doc, i) => (
                  <button 
                    key={i} 
                    onClick={() => {
                      if (doc.status !== 'verified') {
                        handleVerifyDoc(doc.label);
                      } else {
                        toast.info('Document Verified', { description: `${doc.label} is already approved.` });
                      }
                    }}
                    className="p-4 border border-slate-200/60 rounded-2xl bg-white/50 hover:bg-white hover:border-blue-300 hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col justify-between text-left group"
                  >
                    <div className="text-[10px] font-black text-slate-800 uppercase tracking-wide mb-2 group-hover:text-blue-600 transition-colors">{doc.label}</div>
                    <span className={`text-[8px] font-black uppercase tracking-widest ${
                      doc.status === 'verified' ? 'text-emerald-600' : 
                      doc.status === 'pending' ? 'text-orange-600' : 'text-slate-400'
                    }`}>
                      {doc.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verify Cryptographic Identity Modal */}
      {showHashModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => { if (!activeHashAudit) setShowHashModal(false); }} />
          <div className="relative bg-slate-950 border border-white/10 rounded-2xl p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] w-full max-w-md animate-in zoom-in-95 duration-300 text-white">
            <button 
              disabled={activeHashAudit}
              onClick={() => setShowHashModal(false)} 
              className="absolute top-6 right-6 p-2 text-slate-400 hover:bg-white/5 rounded-xl disabled:opacity-30"
            >
              <X className="size-4" />
            </button>
            <h3 className="text-xl font-black uppercase italic tracking-tighter mb-2 flex items-center gap-2">
              <Shield className="size-5 text-blue-400 animate-pulse" />
              Cryptographic Audit
            </h3>
            <p className="text-[9px] text-slate-500 uppercase tracking-widest font-mono mb-6">Taxpayer: {selectedTaxpayer.name}</p>

            <div className="space-y-6">
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 font-mono">TIN Identity Digest</div>
                <div className="text-[10px] font-mono text-slate-300 break-all select-all">
                  SHA256_{selectedTaxpayer.tin}_NODE_CRYPT_SEC_0x{selectedTaxpayer.id}A79F
                </div>
              </div>

              {activeHashAudit ? (
                <div className="py-6 text-center">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.2em] mb-4 animate-pulse">Scanning blockchain nodes...</div>
                  <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/10 max-w-xs mx-auto">
                    <div className="bg-blue-500 h-full rounded-full transition-all duration-300" style={{ width: `${hashProgress}%` }} />
                  </div>
                  <div className="text-sm font-mono mt-2 text-blue-400">{hashProgress}%</div>
                </div>
              ) : hashVerified ? (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
                  <CheckCircle className="size-5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">Audit Match Confirmed</div>
                    <p className="text-[9px] text-slate-400 leading-normal mt-0.5 font-mono">TIN signature matches decentralised government registry state.</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-3 text-slate-400">
                  <AlertCircle className="size-5 text-blue-400 flex-shrink-0" />
                  <p className="text-[9px] leading-relaxed font-mono">Run a distributed node check to ensure this profile has not been tampered with.</p>
                </div>
              )}

              <button
                disabled={activeHashAudit}
                onClick={runHashAudit}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md disabled:opacity-40"
              >
                {activeHashAudit ? 'Auditing Hash Node...' : hashVerified ? 'Re-Audit Identity' : 'Run Hash Audit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Node Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setShowContactModal(false)} />
          <form onSubmit={handleContactSubmit} className="relative bg-white rounded-xl p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] w-full max-w-md animate-in zoom-in-95 duration-300">
            <button type="button" onClick={() => setShowContactModal(false)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-xl"><X className="size-4" /></button>
            <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-2 flex items-center gap-2">
              <MessageSquare className="size-6 text-blue-600" />
              Contact Node
            </h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono mb-8">Send telemetry message to: {selectedTaxpayer.name}</p>

            <div className="space-y-6 mb-8">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Subject</label>
                <input
                  type="text"
                  placeholder="E.G. COMPLIANCE EXCEPTION ALERT"
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-wider text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Priority Level</label>
                <div className="flex gap-4">
                  {['Low', 'Medium', 'High'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setContactPriority(p)}
                      className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-wider border-2 transition-all
                        ${contactPriority === p 
                          ? 'border-blue-500 bg-blue-50 text-blue-600' 
                          : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Message Dispatch</label>
                <textarea
                  placeholder="ENTER_TELEMETRY_DISPATCH..."
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg">
              Send Telemetry Dispatch
            </button>
          </form>
        </div>
      )}

      {/* Create Incident Modal */}
      {showIncidentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setShowIncidentModal(false)} />
          <form onSubmit={handleCreateIncident} className="relative bg-white rounded-xl p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] w-full max-w-md animate-in zoom-in-95 duration-300">
            <button type="button" onClick={() => setShowIncidentModal(false)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-xl"><X className="size-4" /></button>
            <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-2 flex items-center gap-2">
              <AlertCircle className="size-6 text-rose-500" />
              Create Incident
            </h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono mb-8">Log support ticket for: {selectedTaxpayer.name}</p>

            <div className="space-y-6 mb-8">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Ticket Subject</label>
                <input
                  type="text"
                  placeholder="E.G. VAT RECONCILIATION ANOMALY"
                  value={incidentSubject}
                  onChange={(e) => setIncidentSubject(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-wider text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Priority</label>
                <select
                  value={incidentPriority}
                  onChange={(e) => setIncidentPriority(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-wider text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {['Low', 'Medium', 'High', 'Urgent'].map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Description</label>
                <textarea
                  placeholder="ENTER_INCIDENT_DETAILS..."
                  value={incidentDesc}
                  onChange={(e) => setIncidentDesc(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-mono uppercase focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg">
              Log Incident Node
            </button>
          </form>
        </div>
      )}

      {/* Compliance Documents Modal */}
      {showDocsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setShowDocsModal(false)} />
          <div className="relative bg-white rounded-2xl p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] w-full max-w-lg animate-in zoom-in-95 duration-300">
            <button type="button" onClick={() => setShowDocsModal(false)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-xl"><X className="size-4" /></button>
            <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-2 flex items-center gap-2">
              <FileCheck className="size-6 text-blue-600" />
              Compliance Vault
            </h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono mb-8">Taxpayer compliance documents matrix</p>

            <div className="space-y-4 max-h-[350px] overflow-y-auto mb-8 pr-2">
              {selectedCompliance.map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div>
                    <div className="text-[11px] font-black text-slate-800 uppercase tracking-wide">{doc.label}</div>
                    <div className="text-[8px] font-black text-slate-400 font-mono tracking-widest uppercase mt-0.5">Status: {doc.status}</div>
                  </div>
                  
                  {doc.status !== 'verified' ? (
                    <button
                      onClick={() => handleVerifyDoc(doc.label)}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <Check className="size-3" />
                      Verify Document
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 text-emerald-600 font-black text-[9px] uppercase tracking-widest">
                      <CheckCircle className="size-4" />
                      Approved
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button 
              onClick={() => setShowDocsModal(false)}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
            >
              Close Compliance Vault
            </button>
          </div>
        </div>
      )}

      {/* Toggle Taxpayer Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setShowStatusModal(false)} />
          <div className="relative bg-white rounded-xl p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] w-full max-w-md animate-in zoom-in-95 duration-300">
            <button onClick={() => setShowStatusModal(false)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-xl"><X className="size-4" /></button>
            <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-2 flex items-center gap-2">
              <AlertTriangle className="size-6 text-orange-500 animate-pulse" />
              Toggle Status
            </h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono mb-8">Update profile state for: {selectedTaxpayer.name}</p>

            <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl mb-8">
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Are you sure you want to change the status of <strong>{selectedTaxpayer.name}</strong> from <span className="uppercase font-bold text-blue-600">{selectedTaxpayer.status}</span> to <span className="uppercase font-bold text-orange-600">{selectedTaxpayer.status === 'active' ? 'suspended' : 'active'}</span>?
              </p>
            </div>

            <div className="flex gap-4">
              <button 
                type="button"
                onClick={() => setShowStatusModal(false)} 
                className="flex-1 py-4 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleToggleStatus}
                className="flex-1 py-4 bg-slate-900 text-white hover:bg-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg"
              >
                Confirm Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
