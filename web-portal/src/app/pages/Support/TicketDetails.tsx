import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Send, Paperclip, Clock, User, Tag, AlertCircle, CheckCircle, MessageSquare, Phone, Video, MoreVertical, Terminal, Shield, UserCheck, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Card } from '../../components/ui/card';
import { Avatar } from '../../components/ui/avatar';
import { toast } from 'sonner';
import { useMockData } from '../../contexts/MockDataContext';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface TicketResponse {
  id: string;
  message: string;
  date: string;
  isOfficial: boolean;
  authorId?: string;
  authorName?: string;
}

export default function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateTicket, tickets, taxpayers, users } = useMockData();
  const { currentUser } = useAuth();
  const ticket = tickets.find(t => t.id === id);

  const [responses, setResponses] = useState<TicketResponse[]>([]);
  const [loadingResponses, setLoadingResponses] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);

  const glassCard = 'bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] overflow-hidden';
  const terminalGrid = "bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:30px_30px]";

  const statusStyles: Record<string, string> = {
    open:        'bg-orange-500/10 text-orange-600 border-orange-500/20',
    in_progress: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    under_review:'bg-purple-500/10 text-purple-600 border-purple-500/20',
    resolved:    'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    closed:      'bg-slate-500/10 text-slate-600 border-slate-500/20',
  };

  const priorityStyles: Record<string, string> = {
    high:   'bg-red-500/10 text-red-600 border-red-500/20',
    urgent: 'bg-red-500/10 text-red-600 border-red-500/20',
    medium: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    low:    'bg-slate-500/10 text-slate-600 border-slate-500/20',
  };

  const taxpayer = ticket?.taxpayerId ? taxpayers.find(tp => tp.id === ticket.taxpayerId) : null;

  // Load on mount + auto-refresh conversation every 10s
  useEffect(() => {
    if (!id) return;
    loadResponses();
    const interval = setInterval(() => {
      loadResponses();
    }, 10_000);
    return () => clearInterval(interval);
  }, [id]);

  const loadResponses = async () => {
    setLoadingResponses(true);
    const { data, error } = await supabase
      .from('support_ticket_responses')
      .select('*, users:author_id(name)')
      .eq('ticket_id', id!)
      .order('date', { ascending: true });

    if (!error && data) {
      setResponses(data.map(r => ({
        id: r.id,
        message: r.message,
        date: r.date || r.created_at,
        isOfficial: r.is_official,
        authorId: r.author_id,
        authorName: r.users?.name || undefined,
      })));
    }
    setLoadingResponses(false);
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentElement;
      if (container) {
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [responses]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !id) return;
    setIsSending(true);

    let authorId: string | null = null;
    if (currentUser) {
      const matchedUser = users.find(u => u.email === currentUser.email);
      authorId = matchedUser?.id || null;
    }

    const { data, error } = await supabase.from('support_ticket_responses').insert({
      ticket_id: id,
      message: newMessage.trim(),
      is_official: true,
      author_id: authorId,
      date: new Date().toISOString(),
    }).select('*, users:author_id(name)').single();

    if (!error && data) {
      setResponses(prev => [...prev, {
        id: data.id,
        message: data.message,
        date: data.date,
        isOfficial: true,
        authorId: data.author_id,
        authorName: data.users?.name || currentUser?.name || 'Support Agent',
      }]);
      setNewMessage('');
      toast.success('Response sent to taxpayer');

      if (ticket && ticket.status === 'open') {
        updateTicket({ ...ticket, status: 'in_progress' });
        await supabase.from('support_tickets').update({ status: 'in_progress' }).eq('id', id);
      }
    } else {
      toast.error('Failed to send message', { description: error?.message });
    }
    setIsSending(false);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!ticket || !id) return;
    const updated = { ...ticket, status: newStatus as any };
    if (newStatus === 'resolved' || newStatus === 'closed') {
      updated.resolvedDate = new Date().toISOString();
    }
    updateTicket(updated);
    await supabase.from('support_tickets').update({
      status: newStatus,
      ...(newStatus === 'resolved' || newStatus === 'closed' ? { resolved_date: new Date().toISOString() } : {}),
    }).eq('id', id);
    toast.success('Status updated', { description: `Ticket is now ${newStatus.replace('_', ' ')}` });
  };

  const handlePriorityChange = async (newPriority: string) => {
    if (!ticket || !id) return;
    updateTicket({ ...ticket, priority: newPriority as any });
    await supabase.from('support_tickets').update({ priority: newPriority }).eq('id', id);
    toast.success('Priority updated', { description: `Priority set to ${newPriority}` });
  };

  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
      if (diffInHours < 24) return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch { return timestamp; }
  };

  if (!ticket) {
    return (
      <div className={`min-h-screen bg-[#f8fafc] ${terminalGrid} p-8 lg:p-12 flex items-center justify-center`}>
        <div className="text-center">
          <h2 className="text-2xl font-black text-slate-900 mb-2">Ticket Not Found</h2>
          <p className="text-sm text-slate-500 mb-6">The ticket you're looking for doesn't exist or was removed.</p>
          <button onClick={() => navigate('/support/tickets')} className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold">
            Back to Queue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#f8fafc] relative overflow-hidden ${terminalGrid} p-8 lg:p-12`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] size-[50%] bg-blue-400/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] size-[50%] bg-indigo-400/5 blur-[120px] rounded-full" />
      </div>

      {showMoreMenu && <div className="fixed inset-0 z-30" onClick={() => setShowMoreMenu(false)} />}

      {/* Resolve Modal */}
      {showResolveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setShowResolveModal(false)} />
          <div className="relative bg-white rounded-xl p-10 shadow-2xl w-full max-w-md animate-in zoom-in-90 duration-300">
            <button onClick={() => setShowResolveModal(false)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-xl"><X className="size-4" /></button>
            <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-2">Resolve Incident</h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono mb-8">{ticket.ticketNumber}</p>
            <div className="space-y-3 mb-8">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Resolution Type</div>
              {['Issue Resolved - User Satisfied', 'Technical Fix Applied', 'User Error - Guidance Given', 'Referred to Specialist'].map(opt => (
                <label key={opt} className="flex items-center gap-3 p-4 rounded-2xl border border-slate-100 hover:border-emerald-400 cursor-pointer transition-colors">
                  <input type="radio" name="resolve" className="accent-emerald-500" />
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">{opt}</span>
                </label>
              ))}
            </div>
            <button
              onClick={() => { setShowResolveModal(false); handleStatusChange('resolved'); }}
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest"
            >
              Confirm Resolution
            </button>
          </div>
        </div>
      )}

      {/* Escalate Modal */}
      {showEscalateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setShowEscalateModal(false)} />
          <div className="relative bg-white rounded-xl p-10 shadow-2xl w-full max-w-md animate-in zoom-in-90 duration-300">
            <button onClick={() => setShowEscalateModal(false)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-xl"><X className="size-4" /></button>
            <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-2">Escalate Ticket</h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono mb-8">{ticket.ticketNumber}</p>
            <div className="space-y-3 mb-8">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Escalate To</div>
              {['Technical Team', 'Senior Support Manager', 'Tax Authority Division', 'Legal Compliance'].map(opt => (
                <label key={opt} className="flex items-center gap-3 p-4 rounded-2xl border border-slate-100 hover:border-rose-400 cursor-pointer transition-colors">
                  <input type="radio" name="escalate" className="accent-rose-500" />
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">{opt}</span>
                </label>
              ))}
            </div>
            <button
              onClick={() => { setShowEscalateModal(false); handlePriorityChange('urgent'); toast.success('Ticket Escalated', { description: 'Priority raised and team notified.' }); }}
              className="w-full py-4 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest"
            >
              Confirm Escalation
            </button>
          </div>
        </div>
      )}

      {/* Reassign Modal */}
      {showReassignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setShowReassignModal(false)} />
          <div className="relative bg-white rounded-xl p-10 shadow-2xl w-full max-w-md animate-in zoom-in-90 duration-300">
            <button onClick={() => setShowReassignModal(false)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-xl"><X className="size-4" /></button>
            <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-2">Reassign Ticket</h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono mb-8">{ticket.ticketNumber}</p>
            <div className="space-y-3 mb-8">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Assign To Agent</div>
              {users.filter(u => u.role === 'support_staff' || u.role === 'tax_admin').map(agent => (
                <label key={agent.id} className="flex items-center gap-3 p-4 rounded-2xl border border-slate-100 hover:border-blue-400 cursor-pointer transition-colors">
                  <input type="radio" name="agent" value={agent.id} className="accent-blue-500" />
                  <div className="size-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-[10px] font-black">{agent.name.charAt(0)}</div>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 block">{agent.name}</span>
                    <span className="text-[9px] text-slate-400 uppercase">{agent.role.replace('_', ' ')}</span>
                  </div>
                </label>
              ))}
            </div>
            <button
              onClick={() => { setShowReassignModal(false); toast.success('Ticket Reassigned', { description: 'Ticket assigned to new agent.' }); }}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest"
            >
              Confirm Reassignment
            </button>
          </div>
        </div>
      )}

      {/* Header Actions */}
      <div className="relative z-10 flex items-center justify-between mb-8 gap-4">
        <button
          onClick={() => navigate('/support/tickets')}
          className="flex items-center gap-3 px-6 py-3 border border-slate-200 text-slate-700 bg-white/50 rounded-2xl text-[10px] font-black uppercase tracking-wider hover:bg-white transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Queue
        </button>
        <div className="flex items-center gap-2 relative">
          <Button
            onClick={() => toast.info('Voice Call Initiated', { description: `Calling ${taxpayer?.phone || 'taxpayer'}...` })}
            variant="outline" size="sm" className="rounded-xl text-[10px] font-black uppercase tracking-wider py-5 px-4"
          >
            <Phone className="size-4 mr-2" />
            Voice Call
          </Button>
          <div className="relative">
            <Button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              variant="outline" size="sm" className="rounded-xl py-5 px-3"
            >
              <MoreVertical className="size-4" />
            </Button>
            {showMoreMenu && (
              <div className="absolute right-0 top-12 z-40 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden w-44 animate-in fade-in zoom-in-95 duration-150">
                {[
                  { label: 'Print Ticket', action: () => { setShowMoreMenu(false); toast.info('Print Ready'); }},
                  { label: 'Email Summary', action: () => { setShowMoreMenu(false); toast.success('Email Sent'); }},
                ].map(({ label, action }) => (
                  <button key={label} onClick={action} className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-wide text-slate-700 hover:bg-slate-50 transition-colors">
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Info */}
          <Card className={`${glassCard} p-8 lg:p-10 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.03)] border-none`}>
            <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <Badge className={`px-3 py-1 text-[9px] font-black uppercase tracking-wider border ${statusStyles[ticket.status] || statusStyles.open}`}>
                    {ticket.status.replace('_', ' ')}
                  </Badge>
                  <Badge className={`px-3 py-1 text-[9px] font-black uppercase tracking-wider border ${priorityStyles[ticket.priority] || priorityStyles.medium}`}>
                    {ticket.priority} Priority
                  </Badge>
                  {ticket.category && (
                    <Badge className="px-3 py-1 text-[9px] font-black uppercase tracking-wider border bg-slate-100 text-slate-600 border-slate-200">
                      {ticket.category}
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic mb-2">{ticket.subject}</h1>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">TICKET_ID: {ticket.ticketNumber}</div>
              </div>
            </div>
            <p className="text-sm text-slate-600 bg-slate-50 border border-slate-100 p-6 rounded-3xl leading-relaxed italic">{ticket.description}</p>
            <div className="flex items-center gap-4 mt-4 text-[10px] text-slate-400 font-mono">
              <span className="flex items-center gap-1.5"><Clock className="size-3.5" /> Created {formatTime(ticket.createdDate)}</span>
              {ticket.resolvedDate && <span className="flex items-center gap-1.5"><CheckCircle className="size-3.5 text-emerald-500" /> Resolved {formatTime(ticket.resolvedDate)}</span>}
            </div>
          </Card>

          {/* Live Chat Window */}
          <Card className={`${glassCard} flex flex-col h-[650px] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.03)] border-none`}>
            <div className="px-8 py-5 border-b border-slate-200/50 bg-white/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="size-5 text-blue-600" />
                <h3 className="text-sm font-black text-slate-800 uppercase italic">Conversation</h3>
              </div>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-3 py-1 text-[9px] font-black uppercase tracking-wider">
                <div className="size-1.5 bg-emerald-500 rounded-full mr-2 animate-pulse" />
                {responses.length} messages
              </Badge>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {loadingResponses ? (
                <div className="text-center py-16 text-sm text-slate-400">Loading conversation...</div>
              ) : responses.length === 0 ? (
                <div className="text-center py-16">
                  <MessageSquare className="size-10 text-slate-300 mx-auto mb-4" />
                  <p className="text-sm text-slate-400">No messages yet. Send a response to start the conversation.</p>
                </div>
              ) : (
                responses.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isOfficial ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-3 max-w-[80%] ${msg.isOfficial ? 'flex-row-reverse' : ''}`}>
                      <Avatar className="size-9 bg-slate-900 border border-white/20 text-white flex items-center justify-center flex-shrink-0 rounded-xl">
                        <span className="text-xs font-black uppercase italic">
                          {msg.isOfficial ? (msg.authorName?.charAt(0) || 'A') : (taxpayer?.name?.charAt(0) || 'T')}
                        </span>
                      </Avatar>
                      <div className={`flex flex-col ${msg.isOfficial ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                            {msg.isOfficial ? (msg.authorName || 'Support Agent') : (taxpayer?.name || 'Taxpayer')}
                          </span>
                          <span className="text-[9px] font-black text-slate-400 font-mono">{formatTime(msg.date)}</span>
                        </div>
                        <div className={`p-4 rounded-3xl ${
                          msg.isOfficial
                            ? 'bg-slate-900 text-white rounded-tr-none'
                            : 'bg-white border border-slate-200/80 text-slate-700 rounded-tl-none shadow-sm shadow-slate-100'
                        }`}>
                          <p className="text-xs leading-relaxed font-medium">{msg.message}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {ticket.status !== 'resolved' && ticket.status !== 'closed' ? (
              <div className="px-8 py-5 border-t border-slate-200/50 bg-white/50">
                <div className="flex gap-3">
                  <Input
                    placeholder="Type your response to the taxpayer..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1 rounded-xl h-11 bg-white border border-slate-200 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isSending || !newMessage.trim()}
                    className="rounded-xl size-11 flex items-center justify-center p-0 bg-slate-900 hover:bg-slate-800 text-white flex-shrink-0 disabled:opacity-50"
                  >
                    <Send className="size-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="px-8 py-4 border-t border-slate-200/50 bg-emerald-50 text-center">
                <span className="text-xs font-bold text-emerald-700">This ticket has been {ticket.status}.</span>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          {/* Ticket Metadata */}
          <Card className={`${glassCard} p-6 shadow-sm border-none`}>
            <h3 className="text-sm font-black text-slate-800 uppercase italic mb-6 flex items-center gap-2 pb-3 border-b border-slate-200/50">
              <Terminal className="size-4 text-blue-600" />
              Ticket Metadata
            </h3>
            <div className="space-y-5">
              <div>
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono mb-2">STATUS</div>
                <Select value={ticket.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-full bg-white/50 border border-slate-200 rounded-xl text-xs font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-slate-200 rounded-xl">
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono mb-2">PRIORITY</div>
                <Select value={ticket.priority} onValueChange={handlePriorityChange}>
                  <SelectTrigger className="w-full bg-white/50 border border-slate-200 rounded-xl text-xs font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-slate-200 rounded-xl">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono mb-1">CATEGORY</div>
                <div className="text-xs font-bold text-slate-800 capitalize">{ticket.category || 'General'}</div>
              </div>
              <div>
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono mb-1">ASSIGNED_AGENT</div>
                <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <UserCheck className="size-3.5 text-blue-600" />
                  {ticket.assignedTo ? users.find(u => u.id === ticket.assignedTo)?.name || ticket.assignedTo : 'Unassigned'}
                </div>
              </div>
            </div>
          </Card>

          {/* Taxpayer Details Card */}
          <Card className={`${glassCard} p-6 shadow-sm border-none`}>
            <h3 className="text-sm font-black text-slate-800 uppercase italic mb-6 flex items-center gap-2 pb-3 border-b border-slate-200/50">
              <Shield className="size-4 text-emerald-600" />
              Taxpayer Identity
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="size-4 text-slate-400 mt-0.5" />
                <div className="flex-1">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Taxpayer Name</div>
                  <div className="text-xs font-bold text-slate-800">{taxpayer?.name || 'Unknown'}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Tag className="size-4 text-slate-400 mt-0.5" />
                <div className="flex-1">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Registry TIN</div>
                  <div className="text-xs font-mono font-black text-slate-800">{taxpayer?.tin || 'N/A'}</div>
                </div>
              </div>
              {taxpayer?.email && (
                <div className="flex items-start gap-3">
                  <MessageSquare className="size-4 text-slate-400 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Email</div>
                    <div className="text-xs font-bold text-slate-800">{taxpayer.email}</div>
                  </div>
                </div>
              )}
              {taxpayer?.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="size-4 text-slate-400 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Phone</div>
                    <div className="text-xs font-bold text-slate-800">{taxpayer.phone}</div>
                  </div>
                </div>
              )}
              {taxpayer?.region && (
                <div className="flex items-start gap-3">
                  <Tag className="size-4 text-slate-400 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Region</div>
                    <div className="text-xs font-bold text-slate-800">{taxpayer.region}</div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Actions Card */}
          <Card className={`${glassCard} p-6 shadow-sm border-none`}>
            <h3 className="text-sm font-black text-slate-800 uppercase italic mb-6 pb-3 border-b border-slate-200/50">
              Quick Actions
            </h3>
            <div className="space-y-2.5">
              <Button
                onClick={() => setShowResolveModal(true)}
                variant="outline" size="sm" className="w-full justify-start rounded-xl text-[9px] font-black uppercase tracking-wider py-4 border-emerald-500/20 bg-emerald-500/5 text-emerald-600 hover:bg-emerald-500/10"
              >
                <CheckCircle className="size-4 mr-2" />
                Resolve Ticket
              </Button>
              <Button
                onClick={() => setShowEscalateModal(true)}
                variant="outline" size="sm" className="w-full justify-start rounded-xl text-[9px] font-black uppercase tracking-wider py-4 border-rose-500/20 bg-rose-500/5 text-rose-600 hover:bg-rose-500/10"
              >
                <AlertCircle className="size-4 mr-2" />
                Escalate
              </Button>
              <Button
                onClick={() => setShowReassignModal(true)}
                variant="outline" size="sm" className="w-full justify-start rounded-xl text-[9px] font-black uppercase tracking-wider py-4 bg-white hover:bg-slate-50 text-slate-800"
              >
                <User className="size-4 mr-2" />
                Reassign
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
