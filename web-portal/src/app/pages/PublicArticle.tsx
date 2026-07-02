import { useParams, Link } from 'react-router';
import { ArrowLeft, Calendar, Tag, FileText } from 'lucide-react';
import { useMockData } from '../contexts/MockDataContext';

export default function PublicArticle() {
  const { slug } = useParams();
  const { articles } = useMockData();
  const article = articles.find(a => a.slug === slug && a.status === 'published');

  if (!article) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-24 px-6 bg-slate-50 text-center">
        <FileText className="size-12 text-slate-300 mb-4" />
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Article Not Available</h1>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2 max-w-sm">
          This article may have been unpublished or the link is incorrect.
        </p>
        <Link
          to="/resources"
          className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-blue-800 transition-all"
        >
          <ArrowLeft className="size-4" /> Back to Resources
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-grow py-16 px-6 lg:px-12 bg-slate-50">
      <article className="max-w-3xl mx-auto">
        <Link
          to="/resources"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-900 uppercase tracking-wider mb-8 transition-colors"
        >
          <ArrowLeft className="size-4" /> Back to Resources
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-900 rounded-full text-[10px] font-black uppercase tracking-wider">
            {article.category}
          </span>
          {article.publishDate && (
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <Calendar className="size-3.5" />
              {new Date(article.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          )}
        </div>

        <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-6">
          {article.title}
        </h1>

        <div className="flex items-center gap-3 pb-8 mb-8 border-b border-slate-200">
          <div className="size-10 rounded-lg bg-blue-900 text-white flex items-center justify-center text-sm font-black uppercase">
            {article.author.charAt(0)}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">{article.author}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Government Revenue Authority</div>
          </div>
        </div>

        <div className="prose prose-slate max-w-none">
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
            {article.content}
          </p>
        </div>

        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-12 pt-8 border-t border-slate-200">
            <Tag className="size-4 text-slate-400" />
            {article.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                {tag}
              </span>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}
