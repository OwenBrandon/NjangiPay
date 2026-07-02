import { 
  FileText, Clock, CheckCircle, Archive, Tag, 
  TrendingUp, Eye, MessageSquare, Calendar,
  ChevronRight, ArrowUpRight, Plus, Terminal
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMockData } from '../../contexts/MockDataContext';
import { Link } from 'react-router';

const viewsData = [
  { date: 'May 1', views: 1200, engagement: 450 },
  { date: 'May 2', views: 1500, engagement: 580 },
  { date: 'May 3', views: 1100, engagement: 390 },
  { date: 'May 4', views: 1800, engagement: 720 },
  { date: 'May 5', views: 2200, engagement: 890 },
  { date: 'May 6', views: 2100, engagement: 850 },
  { date: 'May 7', views: 2500, engagement: 1100 },
];

const ForensicTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-800">
          <Calendar className="size-3.5 text-blue-400" />
          <span className="text-[10px] font-black text-slate-400 font-mono uppercase tracking-widest">{label}</span>
        </div>
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-8">
              <div className="flex items-center gap-2">
                <div className="size-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">{entry.name}</span>
              </div>
              <span className="text-sm font-black text-white font-mono italic">
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function ContentDashboard() {
  const { articles } = useMockData();
  const totalArticles = articles.length;
  const published     = articles.filter(a => a.status === 'published').length;
  const drafts        = articles.filter(a => a.status === 'draft').length;

  const glassCard = 'bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] overflow-hidden';
  const terminalGrid = "bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:30px_30px]";

  const kpis = [
    { 
      title: "Total Library", 
      value: totalArticles, 
      sub: "TOTAL_NODES", 
      icon: FileText, 
      borderColor: 'border-t-blue-500/50', 
      badgeColor: 'bg-blue-50 text-blue-600', 
      glow: 'from-blue-500/20 to-transparent' 
    },
    { 
      title: "Public Views", 
      value: "42.8k", 
      sub: "TRAFFIC_TELEMETRY", 
      icon: Eye, 
      borderColor: 'border-t-emerald-500/50', 
      badgeColor: 'bg-emerald-50 text-emerald-600', 
      glow: 'from-emerald-500/20 to-transparent' 
    },
    { 
      title: "Pending Drafts", 
      value: drafts, 
      sub: "DRAFT_PIPELINE", 
      icon: Clock, 
      borderColor: 'border-t-yellow-500/50', 
      badgeColor: 'bg-yellow-50 text-yellow-600', 
      glow: 'from-yellow-500/20 to-transparent' 
    },
    { 
      title: "Engagement", 
      value: "12.5%", 
      sub: "INTERACTIVE_RATE", 
      icon: TrendingUp, 
      borderColor: 'border-t-purple-500/50', 
      badgeColor: 'bg-purple-50 text-purple-600', 
      glow: 'from-purple-500/20 to-transparent' 
    },
  ];

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
            <div className="px-3 py-1 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] italic">Knowledge Terminal</div>
            <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] font-mono">TELEMETRY_ON</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.9]">
            Content <span className="text-blue-600 underline decoration-slate-900 decoration-8 underline-offset-8">Intelligence</span>
          </h1>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-[0.4em] mt-8 flex items-center gap-3 italic">
            <Terminal className="size-4 text-blue-600" />
            Performance telemetry and knowledge base management
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-3 px-6 py-4 bg-white border border-slate-200 text-slate-800 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 transition-all shadow-sm">
            <Calendar className="size-4" />
            May 2026
          </button>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 relative z-10">
        {kpis.map((kpi, idx) => (
          <div 
            key={idx} 
            className={`${glassCard} border-t-4 ${kpi.borderColor} p-8 group relative overflow-hidden transition-all duration-500 hover:translate-y-[-6px] hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)]`}
          >
            {/* Ambient Glow */}
            <div className={`absolute -right-16 -bottom-16 size-48 bg-gradient-radial ${kpi.glow} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
            
            {/* Watermark */}
            <div className="absolute -right-4 -bottom-4 size-24 text-slate-900/[0.02] transition-all duration-700 group-hover:scale-125 group-hover:-rotate-12 pointer-events-none">
              <kpi.icon className="size-full" />
            </div>

            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex items-center justify-between mb-6">
                <span className={`inline-flex px-2.5 py-1 rounded-md text-[8px] font-black uppercase tracking-wider font-mono ${kpi.badgeColor}`}>
                  {kpi.sub}
                </span>
                <kpi.icon className="size-5 text-slate-400 group-hover:text-slate-900 transition-colors" />
              </div>
              
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">{kpi.title}</span>
                <span className="text-5xl font-black text-slate-900 font-mono tracking-tighter block mb-4 italic">
                  {kpi.value}
                </span>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest font-mono">STATUS: ACTIVE</span>
                <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 relative z-10">
        {/* Main Analytics Area */}
        <div className={`${glassCard} lg:col-span-2 p-8 lg:p-10 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.03)] border-none`}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-blue-600 decoration-4 underline-offset-4">Knowledge Base Reach</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-3">Daily views and engagement telemetry</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-blue-500" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Views</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-emerald-500" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Engagement</span>
              </div>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={viewsData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} />
                <Tooltip content={<ForensicTooltip />} />
                <Area name="Views" type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                <Area name="Engagement" type="monotone" dataKey="engagement" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorEngagement)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Performing */}
        <div className={`${glassCard} lg:col-span-1 p-8 lg:p-10 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.03)] border-none flex flex-col justify-between`}>
          <div>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase italic">Trending Content</h3>
              <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Full Report</button>
            </div>
            <div className="space-y-6">
              {articles.slice(0, 4).map((article, i) => (
                <div key={article.id} className="flex items-center gap-4 group cursor-pointer">
                  <div className="size-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-mono font-black italic text-xs transition-all group-hover:scale-105 group-hover:bg-blue-600">
                    0{i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-700 truncate group-hover:text-blue-600 transition-colors">{article.title}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-[9px] font-black text-slate-400 font-mono uppercase tracking-wider"><Eye className="size-3 text-slate-400" /> {(12 - i) * 1.2}k</span>
                      <span className="flex items-center gap-1 text-[9px] font-black text-emerald-500 font-mono uppercase tracking-wider"><ArrowUpRight className="size-3" /> +1{i}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 p-6 bg-slate-900 rounded-xl border border-slate-800 shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest font-mono">Live Status Feed</span>
                <div className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-xs text-white font-black uppercase tracking-wider italic leading-normal">842 Taxpayers currently browsing the knowledge base</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        {/* Recent Activity */}
        <div className={`${glassCard} p-8 lg:p-10 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.03)] border-none`}>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase italic">Content Pipeline</h3>
            <div className="flex gap-2">
              <span className="px-2.5 py-1 bg-yellow-50 text-yellow-600 border border-yellow-100 rounded-md text-[8px] font-black uppercase tracking-wider font-mono">{drafts} Drafts</span>
              <span className="px-2.5 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-md text-[8px] font-black uppercase tracking-wider font-mono">{articles.filter(a => a.status === 'scheduled').length} Scheduled</span>
            </div>
          </div>
          <div className="space-y-4">
            {articles.filter(a => a.status === 'draft').map((article) => (
              <div key={article.id} className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-white transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 bg-slate-900 text-white rounded-xl group-hover:bg-blue-600 transition-colors">
                    <Clock className="size-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{article.title}</h4>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Last edited 2 hours ago by {article.author}</p>
                  </div>
                </div>
                <ChevronRight className="size-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Create New Article', desc: 'Draft knowledge base content', icon: Plus, link: '/content/articles/create', badge: 'NEW_DRAFT', bg: 'hover:border-blue-200 hover:shadow-blue-500/5 hover:translate-y-[-4px]', iconBg: 'bg-blue-50 text-blue-600' },
            { label: 'Manage Categories', desc: 'Organize library taxonomy', icon: Tag, link: '/content/categories', badge: 'TAXONOMY', bg: 'hover:border-emerald-200 hover:shadow-emerald-500/5 hover:translate-y-[-4px]', iconBg: 'bg-emerald-50 text-emerald-600' },
            { label: 'Publishing Calendar', desc: 'View scheduled content', icon: Calendar, link: '/content/articles', badge: 'SCHEDULE', bg: 'hover:border-orange-200 hover:shadow-orange-500/5 hover:translate-y-[-4px]', iconBg: 'bg-orange-50 text-orange-600' },
            { label: 'Content Audit', desc: 'Review archived articles', icon: Archive, link: '/content/articles', badge: 'ARCHIVES', bg: 'hover:border-slate-300 hover:shadow-slate-500/5 hover:translate-y-[-4px]', iconBg: 'bg-slate-100 text-slate-600' },
          ].map((item, i) => (
            <Link 
              key={i} 
              to={item.link} 
              className={`${glassCard} p-6 border-none flex flex-col justify-between cursor-pointer transition-all duration-300 ${item.bg} shadow-[0_12px_24px_-8px_rgba(0,0,0,0.03)] group`}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-3 rounded-xl ${item.iconBg} group-hover:scale-105 transition-transform`}>
                    <item.icon className="size-4" />
                  </div>
                  <span className="text-[8px] font-black text-slate-400 font-mono tracking-widest">{item.badge}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{item.label}</h4>
                <p className="text-[10px] text-slate-400 leading-normal">{item.desc}</p>
              </div>
              <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100/50">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest font-mono">Execute Node</span>
                <ArrowUpRight className="size-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
