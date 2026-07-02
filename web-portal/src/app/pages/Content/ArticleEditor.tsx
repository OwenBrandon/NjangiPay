import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
  ArrowLeft, Save, Globe, Eye, Image as ImageIcon, 
  Settings, Clock, Check, Bold, Italic, List, Link as LinkIcon, Type,
  Monitor, Smartphone, Tablet, Calendar, Edit3, Terminal, EyeOff
} from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import type { Article } from '../../types';

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

export default function ArticleEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { articles, categories, addArticle, updateArticle } = useMockData();
  const { currentUser } = useAuth();
  const isEditing = !!id;
  const article = isEditing ? articles.find(a => a.id === id) : null;

  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [activeDevice, setActiveDevice] = useState<'monitor' | 'tablet' | 'phone'>('monitor');
  const [formData, setFormData] = useState({
    title: article?.title || '',
    content: article?.content || '',
    category: article?.category || categories[0]?.name || 'General',
    status: article?.status || 'draft',
    author: article?.author || currentUser?.name || 'Content Manager',
    tags: article?.tags?.join(', ') || '',
    publishDate: article?.publishDate ? article.publishDate.split('T')[0] : '',
    publishTime: article?.publishDate?.includes('T') ? article.publishDate.split('T')[1].slice(0, 5) : '09:00',
  });

  // Combine the selected date + time into a Date, or null if no date chosen
  const getScheduledDate = (): Date | null => {
    if (!formData.publishDate) return null;
    const dt = new Date(`${formData.publishDate}T${formData.publishTime || '00:00'}`);
    return isNaN(dt.getTime()) ? null : dt;
  };

  const persistArticle = (status: Article['status']) => {
    if (!formData.title.trim()) {
      toast.error('Title Required', { description: 'Please enter an article title before saving.' });
      return;
    }

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const scheduled = getScheduledDate();
    const tags = formData.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    let finalStatus = status;
    let publishDate: string | undefined;

    if (status === 'scheduled') {
      if (!scheduled) {
        toast.error('Schedule Date Required', { description: 'Please select a publish date and time to schedule this article.' });
        return;
      }
      if (scheduled.getTime() <= now.getTime()) {
        // Scheduled time is now/past — publish immediately
        finalStatus = 'published';
        publishDate = now.toISOString();
      } else {
        publishDate = scheduled.toISOString();
      }
    } else if (status === 'published') {
      // Publish Now always goes live immediately
      publishDate = now.toISOString();
    } else {
      // Draft — retain a chosen date as metadata if present
      publishDate = scheduled ? scheduled.toISOString() : article?.publishDate;
    }

    const payload: Article = {
      id: article?.id ?? `ART-${Date.now()}`,
      title: formData.title.trim(),
      slug: slugify(formData.title) || `article-${Date.now()}`,
      content: formData.content,
      category: formData.category,
      status: finalStatus,
      author: formData.author,
      tags,
      publishDate,
      createdDate: article?.createdDate ?? today,
      updatedDate: today,
    };

    if (isEditing) {
      updateArticle(payload);
    } else {
      addArticle(payload);
    }

    setFormData(prev => ({ ...prev, status: finalStatus }));

    const scheduledLabel = scheduled
      ? scheduled.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
      : '';
    const messages: Record<string, string> = {
      published: `"${payload.title}" is now live on the public portal.`,
      scheduled: `"${payload.title}" will be published on ${scheduledLabel}.`,
      draft: `"${payload.title}" has been saved.`,
      archived: `"${payload.title}" has been archived.`,
    };
    const titles: Record<string, string> = {
      published: 'Article Published',
      scheduled: 'Article Scheduled',
      draft: isEditing ? 'Article Updated' : 'Draft Saved',
      archived: 'Article Archived',
    };
    toast.success(titles[finalStatus], { description: messages[finalStatus] });
    navigate('/content/articles');
  };

  const handleSave = () => persistArticle(formData.status as Article['status']);
  const handlePublish = () => persistArticle('published');
  const handleSchedule = () => persistArticle('scheduled');

  const glassCard = 'bg-white/90 backdrop-blur-xl border border-white/40 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] overflow-hidden';
  const terminalGrid = "bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:30px_30px]";

  return (
    <div className={`min-h-[calc(100vh-3.5rem)] bg-[#f8fafc] ${terminalGrid} flex flex-col relative overflow-hidden`}>
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] size-[50%] bg-blue-400/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] size-[50%] bg-indigo-400/5 blur-[120px] rounded-full" />
      </div>

      {/* Editor Header */}
      <div className="relative z-20 h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-8 flex items-center justify-between sticky top-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/content/articles')}
            className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
          >
            <ArrowLeft className="size-4.5" />
          </button>
          <div className="w-px h-6 bg-slate-200" />
          <div>
            <h1 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              {isEditing ? 'Edit Article' : 'Create New Article'}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <div className={`size-1.5 rounded-full ${formData.status === 'published' ? 'bg-emerald-500 animate-pulse' : 'bg-yellow-500 animate-pulse'}`} />
              <span className="text-[9px] font-black text-slate-400 font-mono uppercase tracking-widest">{formData.status}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
              isPreviewMode 
              ? 'bg-blue-50 border-blue-200 text-blue-600' 
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {isPreviewMode ? <Edit3 className="size-3.5" /> : <Eye className="size-3.5" />}
            {isPreviewMode ? 'Editor View' : 'Live Preview'}
          </button>
          <div className="w-px h-6 bg-slate-200" />
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-950 text-white border border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-slate-800 transition-all shadow-md shadow-slate-200"
          >
            <Save className="size-3.5" />
            {isEditing ? 'Update Article' : 'Save as Draft'}
          </button>
          <button
            onClick={handlePublish}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-md shadow-emerald-100"
          >
            <Globe className="size-3.5" />
            Publish Now
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Editor Main Area */}
        <div className={`flex-1 overflow-y-auto ${isPreviewMode ? 'bg-slate-100/50' : 'bg-white/80 backdrop-blur-xl'}`}>
          {isPreviewMode ? (
            <div className="max-w-4xl mx-auto my-8 space-y-6 px-4">
              {/* Device Toggle */}
              <div className="flex justify-center">
                <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm gap-1">
                  {[
                    { id: 'monitor', icon: Monitor, label: 'Monitor' },
                    { id: 'tablet', icon: Tablet, label: 'Tablet' },
                    { id: 'phone', icon: Smartphone, label: 'Phone' },
                  ].map((device) => (
                    <button 
                      key={device.id} 
                      onClick={() => setActiveDevice(device.id as any)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                        activeDevice === device.id
                        ? 'bg-slate-900 text-white shadow-sm' 
                        : 'text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      <device.icon className="size-3.5" />
                      {device.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview Viewport Frame */}
              <div className={`bg-white rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-slate-200 overflow-hidden min-h-[700px] transition-all duration-500 mx-auto ${
                activeDevice === 'monitor' ? 'max-w-4xl' :
                activeDevice === 'tablet' ? 'max-w-xl' : 'max-w-sm'
              }`}>
                <div className="h-2 bg-blue-600" />
                <div className="p-12 space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-wider font-mono border border-blue-200/50">
                        {formData.category}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 font-mono uppercase">Read duration: 5 MINS</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 leading-tight tracking-tight uppercase italic">
                      {formData.title || 'Enter your article title...'}
                    </h1>
                    <div className="flex items-center gap-3 py-4 border-y border-slate-100">
                      <div className="size-10 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-black uppercase italic">
                        {formData.author.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">{formData.author}</div>
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Content Lead • {new Date().toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                  <div className="prose prose-slate max-w-none">
                    <div 
                      className="text-slate-600 leading-relaxed text-sm whitespace-pre-wrap font-medium"
                      dangerouslySetInnerHTML={{ __html: formData.content || 'Start writing your article content here...' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Toolbar */}
              <div className="h-14 border-b border-slate-200/50 px-8 flex items-center gap-2 bg-slate-50/50">
                <div className="flex items-center gap-1.5 pr-4 border-r border-slate-200">
                  <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-white rounded-lg transition-all" title="Text Type"><Type className="size-4" /></button>
                  <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-white rounded-lg transition-all font-black text-sm" title="Bold">B</button>
                  <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-white rounded-lg transition-all italic text-sm" title="Italic">I</button>
                </div>
                <div className="flex items-center gap-1.5 pr-4 border-r border-slate-200">
                  <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-white rounded-lg transition-all" title="List"><List className="size-4" /></button>
                  <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-white rounded-lg transition-all" title="Insert Link"><LinkIcon className="size-4" /></button>
                  <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-white rounded-lg transition-all" title="Insert Image"><ImageIcon className="size-4" /></button>
                </div>
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-auto font-mono flex items-center gap-2">
                  <Terminal className="size-3.5 text-blue-500" />
                  AUTOSAVE_NODE_ON: 12:45 PM
                </div>
              </div>

              {/* Title & Body Input */}
              <div className="flex-1 p-12 overflow-y-auto">
                <div className="max-w-4xl mx-auto space-y-8">
                  <textarea
                    placeholder="Enter Article Title..."
                    className="w-full text-4xl font-black text-slate-900 border-none outline-none placeholder:text-slate-200 resize-none h-auto min-h-[60px] uppercase italic tracking-tight"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                  <div className="w-full h-px bg-slate-100" />
                  <textarea
                    placeholder="Write your content here... Supports markdown and rich formatting."
                    className="w-full text-base text-slate-700 leading-relaxed border-none outline-none placeholder:text-slate-200 resize-none min-h-[500px]"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Controls */}
        <div className="w-85 border-l border-slate-200 bg-white/95 backdrop-blur-xl flex flex-col z-20 shadow-[-12px_0_24px_-8px_rgba(0,0,0,0.03)]">
          <div className="p-6 border-b border-slate-200/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="size-4 text-slate-400" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Publishing Node</h3>
            </div>
            <span className="text-[8px] font-black text-slate-400 font-mono">CFG_V1.0</span>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Taxonomy */}
            <div className="space-y-4">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono block">Article Category</label>
              <div className="grid grid-cols-1 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setFormData({ ...formData, category: cat.name })}
                    className={`flex items-center justify-between p-3.5 rounded-xl border text-xs font-bold transition-all ${
                      formData.category === cat.name
                      ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm'
                      : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
                    }`}
                  >
                    {cat.name}
                    {formData.category === cat.name && <Check className="size-4" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full h-px bg-slate-100" />

            {/* Tags */}
            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono block">Search Tags</label>
              <input
                type="text"
                placeholder="e.g. VAT, Filing, Support"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all text-slate-700 font-medium"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
              <p className="text-[9px] text-slate-400 leading-relaxed italic">Separate tags with commas. Helps with taxpayer search indexing.</p>
            </div>

            <div className="w-full h-px bg-slate-100" />

            {/* Schedule */}
            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono block">Scheduling Queue</label>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 hover:border-slate-300 focus-within:border-blue-400 focus-within:bg-white transition-all cursor-pointer">
                  <Calendar className="size-4 text-slate-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Publish Date</span>
                    <input
                      type="date"
                      value={formData.publishDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                      className="w-full bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer"
                    />
                  </div>
                </label>
                <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 hover:border-slate-300 focus-within:border-blue-400 focus-within:bg-white transition-all cursor-pointer">
                  <Clock className="size-4 text-slate-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Queue Time</span>
                    <input
                      type="time"
                      value={formData.publishTime}
                      onChange={(e) => setFormData({ ...formData, publishTime: e.target.value })}
                      className="w-full bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer"
                    />
                  </div>
                </label>

                {formData.publishDate && (
                  <p className="text-[9px] font-bold text-blue-600 leading-relaxed flex items-center gap-1.5 px-1">
                    <Clock className="size-3 shrink-0" />
                    {getScheduledDate() && getScheduledDate()!.getTime() > Date.now()
                      ? `Queued for ${getScheduledDate()!.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}`
                      : 'Selected time is in the past — will publish immediately.'}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleSchedule}
                  className="flex items-center justify-center gap-2 p-3.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-blue-700 transition-all shadow-md shadow-blue-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  disabled={!formData.publishDate}
                >
                  <Calendar className="size-3.5" />
                  Schedule Publication
                </button>

                {formData.publishDate && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, publishDate: '', publishTime: '09:00' })}
                    className="text-[9px] font-black text-slate-400 hover:text-rose-500 uppercase tracking-widest transition-colors"
                  >
                    Clear Schedule
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Active Collaboration */}
          <div className="p-6 bg-slate-50/50 border-t border-slate-200/50">
            <div className="flex items-center gap-2 mb-4">
              <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest font-mono">Active Collaborators (02)</span>
            </div>
            <div className="flex -space-x-2">
              <div className="size-8 rounded-lg border-2 border-white bg-slate-900 text-white flex items-center justify-center text-[10px] font-black uppercase italic">
                A
              </div>
              <div className="size-8 rounded-lg border-2 border-white bg-blue-600 text-white flex items-center justify-center text-[10px] font-black uppercase italic">
                J
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
