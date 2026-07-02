import { useState } from 'react';
import { Link } from 'react-router';
import {
  FileText, Plus, Search, Filter, Eye, Edit3, Trash2,
  Calendar, CheckCircle, Clock, Globe, Lock, MoreHorizontal, Terminal
} from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';
import { toast } from 'sonner';

export default function ArticleList() {
  const { articles, deleteArticle } = useMockData();
  const [query, setQuery] = useState('');

  const glassCard = 'bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] overflow-hidden';
  const terminalGrid = "bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:30px_30px]";

  const statusStyles: Record<string, string> = {
    published: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    draft:     'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    scheduled: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    archived:  'bg-slate-500/10 text-slate-600 border-slate-500/20',
  };

  const q = query.trim().toLowerCase();
  const filteredArticles = q
    ? articles.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        (a.tags ?? []).some(t => t.toLowerCase().includes(q))
      )
    : articles;

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete "${title}"? This action cannot be undone.`)) {
      deleteArticle(id);
      toast.success('Article Deleted', { description: `"${title}" has been removed from the library.` });
    }
  };

  const handlePreview = (slug: string, status: string) => {
    if (status !== 'published') {
      toast.info('Draft Preview', { description: 'Only published articles are visible on the public portal.' });
      return;
    }
    window.open(`/resources/article/${slug}`, '_blank');
  };

  const stats = [
    { label: 'Total Articles', value: articles.length, icon: FileText, borderColor: 'border-t-blue-500/50', badgeColor: 'bg-blue-50 text-blue-600', sub: 'TOTAL_ARCHIVE' },
    { label: 'Published', value: articles.filter(a => a.status === 'published').length, icon: Globe, borderColor: 'border-t-emerald-500/50', badgeColor: 'bg-emerald-50 text-emerald-600', sub: 'PUBLIC_ACCESS' },
    { label: 'Pending Drafts', value: articles.filter(a => a.status === 'draft').length, icon: Lock, borderColor: 'border-t-yellow-500/50', badgeColor: 'bg-yellow-50 text-yellow-600', sub: 'DRAFT_NODES' },
    { label: 'Scheduled', value: articles.filter(a => a.status === 'scheduled').length, icon: Calendar, borderColor: 'border-t-purple-500/50', badgeColor: 'bg-purple-50 text-purple-600', sub: 'QUEUE_METRIC' },
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
            <div className="px-3 py-1 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] italic">Knowledge Base</div>
            <div className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] font-mono">ARCHIVE_MGMT</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.9]">
            Article <span className="text-blue-600 underline decoration-slate-900 decoration-8 underline-offset-8">Management</span>
          </h1>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-[0.4em] mt-8 flex items-center gap-3 italic">
            <Terminal className="size-4 text-blue-600" />
            Create, edit, and publish content for the Taxpayer portal
          </p>
        </div>
        
        <Link
          to="/content/articles/create"
          className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
        >
          <Plus className="size-4" />
          Create Article
        </Link>
      </div>

      {/* Modernized Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 relative z-10">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className={`${glassCard} border-t-4 ${stat.borderColor} p-6 group relative overflow-hidden transition-all duration-500 hover:translate-y-[-6px] hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)]`}
          >
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider font-mono ${stat.badgeColor}`}>
                  {stat.sub}
                </span>
                <stat.icon className="size-4.5 text-slate-400 group-hover:text-slate-950 transition-colors" />
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">{stat.label}</span>
                <span className="text-3xl font-black text-slate-900 font-mono tracking-tighter block italic">
                  {stat.value}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Table Container */}
      <div className={`${glassCard} relative z-10`}>
        <div className="px-8 py-7 border-b border-slate-200/50 flex flex-col md:flex-row md:items-center justify-between bg-white/50 gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles by title, author, or tags..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all placeholder:text-slate-400 text-slate-700"
              />
            </div>
            <button className="flex items-center gap-2 px-5 py-3 border border-slate-200 text-slate-700 bg-white/50 rounded-2xl text-[10px] font-black uppercase tracking-wider hover:bg-white transition-colors">
              <Filter className="size-3.5" />
              Filter by Category
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono hidden sm:block">Showing {filteredArticles.length} articles</div>
            <button className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
              <MoreHorizontal className="size-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-200/50 text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">
              <tr>
                <th className="px-8 py-5">Article Title</th>
                <th className="px-8 py-5">Category</th>
                <th className="px-8 py-5">Publish Date</th>
                <th className="px-8 py-5">Author</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredArticles.map((article) => (
                <tr key={article.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5 max-w-md">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">{article.title}</span>
                      <span className="text-[9px] font-black text-slate-400 mt-1 uppercase tracking-widest font-mono">SLUG: {article.slug}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-[8px] font-black uppercase tracking-wider border border-slate-200">
                      {article.category}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-xs text-slate-500 font-mono font-medium">
                    {article.publishDate ? new Date(article.publishDate).toLocaleDateString() : '\u2014'}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2.5">
                      <div className="size-7 rounded-lg bg-slate-900 text-white flex items-center justify-center text-[10px] font-black uppercase italic">
                        {article.author.charAt(0)}
                      </div>
                      <span className="text-xs font-bold text-slate-700">{article.author}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-wider ${statusStyles[article.status]}`}>
                      {article.status === 'published' ? <CheckCircle className="size-3" /> : 
                       article.status === 'draft' ? <Lock className="size-3" /> : 
                       <Clock className="size-3" />}
                      {article.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/content/articles/${article.id}`}
                        className="inline-flex items-center justify-center size-8 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 rounded-xl transition-all shadow-sm"
                        title="Edit Article"
                      >
                        <Edit3 className="size-3.5" />
                      </Link>
                      <button
                        onClick={() => handlePreview(article.slug, article.status)}
                        className="inline-flex items-center justify-center size-8 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 rounded-xl transition-all shadow-sm"
                        title="Preview on public portal"
                      >
                        <Eye className="size-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(article.id, article.title)}
                        className="inline-flex items-center justify-center size-8 bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 rounded-xl transition-all shadow-sm"
                        title="Delete"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredArticles.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-16 text-center">
                    <FileText className="size-8 text-slate-300 mx-auto mb-3" />
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono">
                      {query ? 'No articles match your search' : 'No articles yet — create your first one'}
                    </p>
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
