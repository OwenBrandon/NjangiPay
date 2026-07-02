import { useState, useEffect, useRef } from 'react';
import { Plus, Clock, ChevronRight, BookOpen, ArrowUpRight, MessageSquare, Send, ArrowLeft, X } from 'lucide-react';
import { Link } from 'react-router';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { useMockData } from '../../contexts/MockDataContext';
import { supabase } from '../../lib/supabase';
import type { SupportTicket } from '../../types';

interface TicketResponse {
  id: string;
  message: string;
  date: string;
  isOfficial: boolean;
  authorId?: string;
}

export default function TaxpayerSupport() {
  const glassCard = 'bg-white rounded-2xl border border-slate-200/60 shadow-lg shadow-blue-900/5 overflow-hidden';
  const labelStyle = "block text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-2";
  const inputStyle = "w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all";

  const { currentUser } = useAuth();
  const { tickets, addTicket, addTicketResponse, articles, taxpayers } = useMockData();

  const currentTaxpayer = taxpayers.find(tp => tp.userId === currentUser?.id || tp.email === currentUser?.email);
  const taxpayerTickets = tickets.filter(t =>
    t.taxpayerId === currentTaxpayer?.id || t.taxpayerId === currentUser?.id
  );
  const publishedArticles = articles
    .filter(a => a.status === 'published')
    .sort((a, b) => new Date(b.publishDate || b.updatedDate).getTime() - new Date(a.publishDate || a.updatedDate).getTime())
    .slice(0, 4);

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('registration');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ticket detail view state
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [responses, setResponses] = useState<TicketResponse[]>([]);
  const [loadingResponses, setLoadingResponses] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      toast.error('Validation Error', { description: 'Please fill in the subject and description.' });
      return;
    }

    setIsSubmitting(true);

    const taxpayerId = currentTaxpayer?.id || currentUser?.id || '';
    const ticketNumber = `TKT-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

    const { data, error } = await supabase.from('support_tickets').insert({
      taxpayer_id: taxpayerId,
      ticket_number: ticketNumber,
      category: category,
      subject: subject.trim(),
      description: description.trim(),
      status: 'open',
      priority: 'medium',
      created_date: new Date().toISOString(),
    }).select().single();

    setIsSubmitting(false);

    if (error || !data) {
      toast.error('Failed to submit', { description: error?.message || 'Please try again.' });
      return;
    }

    const newTicket: SupportTicket = {
      id: data.id,
      ticketNumber: data.ticket_number,
      taxpayerId: data.taxpayer_id,
      subject: data.subject,
      description: data.description,
      status: data.status,
      priority: data.priority,
      category: data.category,
      createdDate: data.created_date,
    };

    addTicket(newTicket);
    setShowRequestModal(false);
    setSubject('');
    setDescription('');
    setCategory('registration');

    toast.success('Support Request Logged', {
      description: `Ticket ${newTicket.ticketNumber} has been created.`
    });
  };

  const fetchResponses = async (ticketId: string) => {
    const { data, error } = await supabase
      .from('support_ticket_responses')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('date', { ascending: true });

    if (!error && data) {
      setResponses(data.map(r => ({
        id: r.id,
        message: r.message,
        date: r.date || r.created_at,
        isOfficial: r.is_official,
        authorId: r.author_id,
      })));
    }
  };

  const openTicketDetail = async (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setLoadingResponses(true);
    setResponses([]);
    await fetchResponses(ticket.id);
    setLoadingResponses(false);
  };

  // Auto-refresh conversation every 10s when viewing a ticket
  useEffect(() => {
    if (!selectedTicket) return;
    const interval = setInterval(() => {
      fetchResponses(selectedTicket.id);
    }, 10_000);
    return () => clearInterval(interval);
  }, [selectedTicket]);

  const handleSendResponse = async () => {
    if (!newMessage.trim() || !selectedTicket) return;
    setIsSending(true);

    let authorId: string | null = null;
    if (currentUser?.id) {
      const { data: userRow } = await supabase.from('users').select('id').eq('email', currentUser.email).maybeSingle();
      authorId = userRow?.id || null;
      if (!authorId) {
        const { data: authRow } = await supabase.from('users').select('id').eq('auth_id', (await supabase.auth.getUser()).data.user?.id || '').maybeSingle();
        authorId = authRow?.id || null;
      }
    }

    const { data, error } = await supabase.from('support_ticket_responses').insert({
      ticket_id: selectedTicket.id,
      message: newMessage.trim(),
      is_official: false,
      author_id: authorId,
      date: new Date().toISOString(),
    }).select().single();

    if (!error && data) {
      setResponses(prev => [...prev, {
        id: data.id,
        message: data.message,
        date: data.date,
        isOfficial: data.is_official,
        authorId: data.author_id,
      }]);
      setNewMessage('');
      toast.success('Message sent');
    } else {
      toast.error('Failed to send message');
    }
    setIsSending(false);
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      open: 'bg-orange-50 text-orange-600 border-orange-200/50',
      in_progress: 'bg-blue-50 text-blue-600 border-blue-200/50',
      under_review: 'bg-purple-50 text-purple-600 border-purple-200/50',
      resolved: 'bg-emerald-50 text-emerald-600 border-emerald-200/50',
      closed: 'bg-slate-50 text-slate-600 border-slate-200/50',
    };
    return styles[status] || styles.open;
  };

  const formatDate = (d: string) => {
    try { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); }
    catch { return d; }
  };

  // If a ticket is selected, show the detail/conversation view
  if (selectedTicket) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] relative overflow-hidden p-8 lg:p-12">
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Header */}
          <button
            onClick={() => { setSelectedTicket(null); setResponses([]); }}
            className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all mb-6"
          >
            <ArrowLeft className="size-4" />
            Back to Tickets
          </button>

          {/* Ticket Info Card */}
          <div className={`${glassCard} p-8 mb-6`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[9px] font-black text-slate-400 font-mono uppercase tracking-widest">
                {selectedTicket.ticketNumber}
              </span>
              <span className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase border ${statusBadge(selectedTicket.status)}`}>
                {selectedTicket.status.replace('_', ' ')}
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight mb-2">{selectedTicket.subject}</h2>
            <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl leading-relaxed">{selectedTicket.description}</p>
            <div className="flex items-center gap-4 mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5"><Clock className="size-3.5" /> {formatDate(selectedTicket.createdDate)}</span>
              {selectedTicket.category && <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-500">{selectedTicket.category}</span>}
            </div>
          </div>

          {/* Conversation */}
          <div className={`${glassCard} flex flex-col`} style={{ minHeight: 400 }}>
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
              <MessageSquare className="size-4 text-blue-600" />
              <span className="text-sm font-black text-slate-800 uppercase">Conversation</span>
              <span className="text-[10px] text-slate-400 ml-auto">{responses.length} messages</span>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ maxHeight: 400 }}>
              {loadingResponses ? (
                <div className="text-center py-12 text-sm text-slate-400">Loading messages...</div>
              ) : responses.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="size-8 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-400">No messages yet. Send a message to start the conversation.</p>
                </div>
              ) : (
                responses.map((r) => (
                  <div key={r.id} className={`flex ${r.isOfficial ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl ${
                      r.isOfficial
                        ? 'bg-blue-50 border border-blue-100 text-slate-800 rounded-tl-none'
                        : 'bg-slate-900 text-white rounded-tr-none'
                    }`}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-[9px] font-black uppercase tracking-wider ${r.isOfficial ? 'text-blue-600' : 'text-slate-400'}`}>
                          {r.isOfficial ? 'Support Agent' : 'You'}
                        </span>
                        <span className={`text-[9px] font-mono ${r.isOfficial ? 'text-blue-400' : 'text-slate-500'}`}>
                          {formatDate(r.date)}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed">{r.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            {selectedTicket.status !== 'resolved' && selectedTicket.status !== 'closed' && (
              <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendResponse(); } }}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
                />
                <button
                  onClick={handleSendResponse}
                  disabled={isSending || !newMessage.trim()}
                  className="px-5 py-3 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-all disabled:opacity-50 flex items-center gap-2 text-xs font-bold"
                >
                  {isSending ? 'Sending...' : <><Send className="size-4" /> Send</>}
                </button>
              </div>
            )}

            {(selectedTicket.status === 'resolved' || selectedTicket.status === 'closed') && (
              <div className="px-6 py-4 border-t border-slate-100 bg-emerald-50 text-center">
                <span className="text-xs font-bold text-emerald-700">This ticket has been {selectedTicket.status}.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

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
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Support Services</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mt-2">Help & Support</h1>
          <p className="text-sm text-slate-500 font-medium">Submit support tickets and get help from agents</p>
        </div>

        <button
          onClick={() => setShowRequestModal(true)}
          className="flex items-center gap-3 px-8 py-4 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-blue-600 transition-all shadow-lg shadow-slate-200"
        >
          <Plus className="size-4" />
          Create Support Request
        </button>
      </div>

      {/* Ticket Stats */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-4xl">
        {[
          { label: 'Total', value: taxpayerTickets.length, color: 'text-blue-600' },
          { label: 'Open', value: taxpayerTickets.filter(t => t.status === 'open').length, color: 'text-orange-600' },
          { label: 'In Progress', value: taxpayerTickets.filter(t => t.status === 'in_progress').length, color: 'text-blue-600' },
          { label: 'Resolved', value: taxpayerTickets.filter(t => t.status === 'resolved' || t.status === 'closed').length, color: 'text-emerald-600' },
        ].map((s, i) => (
          <div key={i} className={`${glassCard} p-5`}>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</div>
            <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Ticket Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 max-w-4xl">
        {taxpayerTickets.length === 0 && (
          <div className="col-span-2 text-center py-16">
            <MessageSquare className="size-12 text-slate-300 mx-auto mb-4" />
            <p className="text-sm text-slate-400 font-medium">No support tickets yet. Create one to get help.</p>
          </div>
        )}
        {taxpayerTickets.map((tkt) => (
          <div
            key={tkt.id}
            onClick={() => openTicketDetail(tkt)}
            className={`${glassCard} p-8 hover:translate-y-[-4px] hover:shadow-lg transition-all duration-300 group flex flex-col justify-between cursor-pointer`}
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-[8px] font-black text-slate-400 font-mono tracking-widest uppercase bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                  {tkt.category || 'GENERAL'}
                </span>
                <span className={`inline-flex px-2 py-0.5 rounded text-[8px] font-black font-mono border uppercase ${statusBadge(tkt.status)}`}>
                  {tkt.status.replace('_', ' ')}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors leading-tight">{tkt.subject}</h4>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Ticket ID: {tkt.ticketNumber}</span>
            </div>

            <div className="mt-8 flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 text-slate-400 font-mono text-[9px] font-black uppercase">
                <Clock className="size-3.5" />
                Created {new Date(tkt.createdDate).toLocaleDateString()}
              </div>
              <ChevronRight className="size-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        ))}
      </div>

      {/* Knowledge Base / Published Guides */}
      {publishedArticles.length > 0 && (
        <div className="relative z-10 mt-16 max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="size-5 text-blue-600" />
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Knowledge Base & Guides</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {publishedArticles.map((article) => (
              <Link
                key={article.id}
                to={`/resources/article/${article.slug}`}
                className={`${glassCard} p-6 hover:translate-y-[-4px] hover:shadow-lg transition-all duration-300 group flex flex-col justify-between`}
              >
                <div>
                  <span className="inline-block text-[8px] font-black text-blue-600 font-mono tracking-widest uppercase bg-blue-50 border border-blue-100 px-2 py-0.5 rounded mb-3">
                    {article.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-tight">{article.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium mt-2 line-clamp-2">{article.content}</p>
                </div>
                <div className="mt-6 flex items-center justify-end pt-4 border-t border-slate-100">
                  <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1 group-hover:underline">
                    Read Guide <ArrowUpRight className="size-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Support Request Modal Dialog */}
      <Dialog open={showRequestModal} onOpenChange={setShowRequestModal}>
        <DialogContent className="sm:max-w-[500px] rounded-xl p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">Create Support Request</DialogTitle>
            <DialogDescription className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
              Submit an incident report to helpdesk officers
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitRequest} className="space-y-6 mt-4">
            <div>
              <label className={labelStyle}>Subject</label>
              <input
                type="text"
                required
                placeholder="e.g. Discrepancy in Q1 VAT assessment"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={inputStyle}
              />
            </div>
            <div>
              <label className={labelStyle}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xs font-black text-slate-800 focus:bg-white focus:border-blue-500 outline-none tracking-widest uppercase"
              >
                <option value="registration">TIN & Business Registration</option>
                <option value="assessment">Tax Assessment & Calculations</option>
                <option value="payment">Payment Gateway & Receipts</option>
                <option value="filing">Filing Guidelines & Forms</option>
                <option value="general">General Inquiry</option>
              </select>
            </div>
            <div>
              <label className={labelStyle}>Description Details</label>
              <textarea
                required
                rows={4}
                placeholder="Describe your issue in detail so agents can assist you..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-32 px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:bg-white focus:border-blue-500 outline-none resize-none transition-all"
              />
            </div>
            <DialogFooter className="mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-200 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting Request...' : 'Submit Support Request'}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
