import { useState } from 'react';
import { Search, HelpCircle, Mail, MessageSquare, AlertTriangle, ShieldCheck, Ticket, Plus, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { useMockData } from '../contexts/MockDataContext';

export default function SupportInfoPage() {
  const { addTicket, addFraudReport } = useMockData();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIssue, setExpandedIssue] = useState<number | null>(null);
  
  // Fraud Form states
  const [fraudCategory, setFraudCategory] = useState('PHISHING');
  const [fraudDescription, setFraudDescription] = useState('');
  const [isReporting, setIsReporting] = useState(false);

  // Support ticket form states
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('GENERAL');
  const [ticketDescription, setTicketDescription] = useState('');
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);

  const commonIssues = [
    {
      title: 'Cannot Log In or Recover Password',
      content: 'If you have forgotten your password or cannot access your registered phone number/email, please click the "Forgot Password" link on the login screen. You will be prompted to enter your registered email address or TIN. A verified recovery link will be sent. For security reasons, GRA support officers will never ask for your passwords directly.'
    },
    {
      title: 'Payment Made but Not Reflected in Ledger',
      content: 'Digital settlements via the portal gateway normally reconcile within 10 minutes. If your payment continues to show as pending after 24 hours, do not repay. Go to the support portal or helpdesk page, create a ticket under the "PAYMENTS" category, and paste your gateway transaction reference (e.g. TXN-XXXXXX). An accountant officer will manually query the bank records.'
    },
    {
      title: 'Filing Validation Error Message',
      content: 'Filing errors typically occur when calculated business expenses or deductions exceed the allowable thresholds defined by corporate tax guidelines. Check that business inflows, deductions, and capital allowances sum up correctly. Ensure that all supporting audited balance sheets are uploaded in acceptable formats (PDF/PNG).'
    },
    {
      title: 'TIN Activation and Registration Delays',
      content: 'New taxpayer registration requests undergo manual auditing by regional tax office administrators to verify identity data. This process typically takes 1 to 2 business days. You will receive an automated email notification with your tracking ID. If activation is delayed, verify that NIN or CAC registration documents were clearly uploaded.'
    },
    {
      title: 'Updating Registered Business Profile Details',
      content: 'To edit business office addresses or update representative representative names, log in to the taxpayer portal, navigate to the Profile Settings section, fill in the fields, and save changes. Updates will require verified security authorization and will update inside the government registry node.'
    }
  ];

  const handleReportFraud = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fraudDescription.trim()) {
      toast.error('Validation Error', { description: 'Please fill in the fraud details description.' });
      return;
    }

    setIsReporting(true);
    
    const newReport = {
      id: `FRD-${Date.now().toString().slice(-6)}`,
      description: fraudDescription,
      reportedAt: new Date().toISOString(),
      status: 'pending' as const
    };

    addFraudReport(newReport);

    setTimeout(() => {
      setIsReporting(false);
      setFraudDescription('');
      toast.success('Fraud Case Logged securely', {
        description: `Anonymous case ${newReport.id} has been submitted directly to the official anti-fraud enforcement division.`
      });
    }, 800);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketDescription.trim()) {
      toast.error('Validation Error', { description: 'Please fill in the ticket subject and description details.' });
      return;
    }

    setIsSubmittingTicket(true);
    
    const newTicket = {
      id: Math.random().toString(36).substr(2, 9),
      ticketNumber: `TKT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: ticketSubject,
      description: ticketDescription,
      status: 'open' as const,
      priority: 'medium' as const,
      createdDate: new Date().toISOString()
    };

    addTicket(newTicket);

    setTimeout(() => {
      setIsSubmittingTicket(false);
      setTicketSubject('');
      setTicketDescription('');
      toast.success('Support Request Logged', {
        description: `Support ticket ${newTicket.ticketNumber} created. Support team will review.`
      });
    }, 800);
  };

  const filteredIssues = commonIssues.filter(
    issue =>
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-grow py-16 px-6 lg:px-12 bg-slate-50">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-xl mx-auto">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">GRA Public Help Center</h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-normal">
            Search FAQ guidelines, submit tickets, or report anonymous fraud activities
          </p>
        </div>

        {/* Search Help Center */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm max-w-2xl mx-auto space-y-4">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
            <Search className="size-4 text-blue-900" />
            Search Help Center FAQs
          </h3>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search help topics (e.g. login, payment discrepancy, TIN)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs font-semibold focus:bg-white focus:border-blue-900 outline-none transition-all"
            />
          </div>
        </div>

        {/* Common Issues & Ticket Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* FAQ Accordion List (Left Column) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <HelpCircle className="size-5 text-blue-900" />
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-tight">Common Support Issues</h2>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden shadow-sm">
              {filteredIssues.map((issue, idx) => {
                const isExpanded = expandedIssue === idx;
                return (
                  <div key={idx} className="transition-all">
                    <button
                      onClick={() => setExpandedIssue(isExpanded ? null : idx)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50/50 transition-colors"
                    >
                      <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">{issue.title}</span>
                      <ChevronDown className={`size-4 text-slate-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                    {isExpanded && (
                      <div className="p-5 bg-slate-50 text-[11px] text-slate-600 leading-relaxed font-medium border-t border-slate-100 animate-in fade-in duration-200">
                        {issue.content}
                      </div>
                    )}
                  </div>
                );
              })}
              {filteredIssues.length === 0 && (
                <div className="p-6 text-center text-xs text-slate-400 italic font-bold">
                  No matching issues found. Try typing different keywords.
                </div>
              )}
            </div>
          </div>

          {/* Create Public Ticket Form (Right Column) */}
          <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
              <Ticket className="size-5 text-blue-900" />
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest">Submit Support Request</h2>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cannot access registration portal"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:border-blue-900 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Category</label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs font-black text-slate-700 outline-none uppercase tracking-wider"
                >
                  <option value="GENERAL">General Inquiries</option>
                  <option value="LOGIN">Login & Credentials Issues</option>
                  <option value="TIN">TIN Registry Updates</option>
                  <option value="PAYMENTS">Payment Gateway Disputes</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Description Details</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your issue so helpdesk agents can assist you..."
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-blue-900 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingTicket}
                className="w-full py-3.5 bg-blue-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-800 shadow transition-colors disabled:opacity-50"
              >
                {isSubmittingTicket ? 'Submitting...' : 'Submit Ticket'}
              </button>
            </form>
          </div>
        </div>

        {/* Emergency Anti-Fraud Box */}
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 shadow-sm max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-1 space-y-2 text-center md:text-left border-b md:border-b-0 md:border-r border-rose-200/60 pb-6 md:pb-0 md:pr-6">
            <div className="flex items-center justify-center size-10 bg-rose-100 text-rose-600 rounded-xl mx-auto md:mx-0">
              <AlertTriangle className="size-5" />
            </div>
            <h3 className="text-base font-extrabold text-rose-900 uppercase">Emergency Anti-Fraud Hotline</h3>
            <p className="text-[10px] text-rose-700 font-bold uppercase tracking-wide">GRA Enforcement Division</p>
          </div>

          <div className="md:col-span-2 space-y-4">
            <p className="text-xs font-semibold text-rose-800 leading-normal">
              Have you received a suspicious call, email, or SMS claiming to be from the Revenue Authority? Submit an anonymous report immediately. Your report is protected.
            </p>
            
            <form onSubmit={handleReportFraud} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                required
                placeholder="Enter details of suspicious link/phone/email..."
                value={fraudDescription}
                onChange={(e) => setFraudDescription(e.target.value)}
                className="flex-1 px-4 py-3 bg-white border border-rose-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500"
              />
              <button
                type="submit"
                disabled={isReporting}
                className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black uppercase tracking-wider disabled:opacity-50 transition-colors shadow-sm shadow-rose-200"
              >
                {isReporting ? 'Reporting...' : 'Report Fraud'}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
