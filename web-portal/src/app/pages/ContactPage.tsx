import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { useMockData } from '../contexts/MockDataContext';

export default function ContactPage() {
  const { addContactMessage } = useMockData();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error('Validation Error', { description: 'Please fill in all contact fields.' });
      return;
    }

    setIsSubmitting(true);
    
    const newMsg = {
      id: `MSG-${Date.now().toString().slice(-6)}`,
      name: name,
      email: email,
      message: message,
      submittedAt: new Date().toISOString()
    };

    addContactMessage(newMsg);

    setTimeout(() => {
      setIsSubmitting(false);
      setName('');
      setEmail('');
      setMessage('');
      toast.success('Message Dispatched', {
        description: 'Thank you. A portal officer will follow up with you within 24 hours.'
      });
    }, 800);
  };

  const offices = [
    {
      name: 'Buea Municipal Council Tax Office',
      address: 'Rue Principale, Centre Administratif, Buea, South West Region',
      phone: '+237 222 610 100',
      email: 'boya@dgi.cm'
    },
    {
      name: 'Bertoua Regional Office',
      address: 'Avenue de la République, Bertoua, East Region',
      phone: '+237 222 241 200',
      email: 'bertoua@dgi.cm'
    },
    {
      name: 'Yaoundé Central Headquarters (DGI)',
      address: 'Boulevard du 20 Mai, Yaoundé, Centre Region',
      phone: '+237 222 230 900',
      email: 'info@dgi.cm'
    }
  ];

  return (
    <div className="flex-grow py-16 px-6 lg:px-12 bg-slate-50">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-xl mx-auto">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Contact Channels</h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-normal">
            Reach out to regional offices, call hotlines, or message helpdesk officers
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Office Details (Left 2 Columns) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-3">
              <MapPin className="size-5 text-blue-900" />
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-tight">GRA Regional Offices</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {offices.map((office, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide">{office.name}</h3>
                    <div className="flex items-start gap-2.5 text-xs font-medium text-slate-600">
                      <MapPin className="size-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>{office.address}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 border-t border-slate-100 pt-4 text-[11px] font-bold text-slate-500 font-mono">
                    <div className="flex items-center gap-2">
                      <Phone className="size-3.5" />
                      <span>{office.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-800">
                      <Mail className="size-3.5" />
                      <a href={`mailto:${office.email}`} className="hover:underline">{office.email}</a>
                    </div>
                  </div>
                </div>
              ))}

              {/* General Hotlines */}
              <div className="bg-blue-900 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-blue-200">General Support Hotlines</h3>
                  <p className="text-xs font-medium text-blue-100 leading-relaxed">
                    Available Monday to Friday, 8:00 AM to 5:00 PM (excluding federal holidays).
                  </p>
                </div>
                <div className="pt-6 space-y-2 border-t border-blue-800 text-xs font-bold font-mono">
                  <div className="flex items-center gap-2">
                    <Phone className="size-4 text-blue-300" />
                    <span>0800-TAX-GRA (Toll Free)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-blue-300" />
                    <span>09-GRA-HELP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Contact Form (Right Column) */}
          <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
              <Mail className="size-5 text-blue-900" />
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest">Send Online Message</h2>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:border-blue-900 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@company.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:border-blue-900 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Message Comments</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write details of your enquiry..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-blue-900 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-blue-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-800 shadow transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="size-3.5" />
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        {/* Live Chat Mock banner */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm max-w-2xl mx-auto flex items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
              <MessageCircle className="size-6" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase text-slate-800 tracking-wide">Live Helpdesk Support Chat</h3>
              <p className="text-[11px] text-slate-500 mt-1 font-medium leading-relaxed">
                Connect instantly to our tax experts system node queue. Average wait time: {"\u2264"} 2 minutes.
              </p>
            </div>
          </div>
          <button 
            onClick={() => toast.info('Connecting Live Chat Queue', { description: 'Seeking active support agent node...' })}
            className="px-5 py-2.5 bg-emerald-600 text-white text-xs font-black uppercase tracking-wider rounded-lg hover:bg-emerald-700 shadow-sm shadow-emerald-100"
          >
            Start Chat
          </button>
        </div>

      </div>
    </div>
  );
}
