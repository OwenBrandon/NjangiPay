import { FileText, Download, Calendar, HelpCircle, Video, BookOpen, Newspaper, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router';
import { useMockData } from '../contexts/MockDataContext';

export default function ResourcesPage() {
  const { articles } = useMockData();
  const publishedArticles = articles
    .filter(a => a.status === 'published')
    .sort((a, b) => new Date(b.publishDate || b.updatedDate).getTime() - new Date(a.publishDate || a.updatedDate).getTime());

  const faqs = [
    { q: 'How do I obtain a Taxpayer Identification Number (TIN)?', a: 'Individuals and businesses can apply online via the registration portal. You will need to provide your CAC certificates (for businesses) or a federal identification number (for individuals) to get validated.' },
    { q: 'What is the standard Value Added Tax (VAT) rate?', a: 'As of 2026, the standard Value Added Tax (VAT) rate is 15%, calculated on eligible goods and services, filed monthly.' },
    { q: 'How can I settle my tax balance online?', a: 'Once authenticated inside the secure taxpayer portal, you can navigate to the payments portal and select card, bank transfer, or mobile money gateway integrations to process the settlement.' },
    { q: 'What happens if I submit my return after the deadline?', a: 'Overdue returns are subject to compliance fines and penal interests as outlined in regional revenue regulations, unless a waiver appeal is submitted and approved.' }
  ];

  const handleDownload = (filename: string) => {
    toast.success('Download Initiated', {
      description: `Downloading ${filename} template document...`
    });

    const fileContent = `==================================================
GOVERNMENT REVENUE AUTHORITY
OFFICIAL DOCUMENT: ${filename.toUpperCase()}
==================================================
1. FILL IN ALL RELEVANT TAXPAYER IDENTIFICATION METRICS
2. ENTER DETAILED INCOME / DEDUCTIBLE RECORDS
3. RETRACT DUPLICATE TRANSACTION ENTRIES
4. ENSURE WET OR CRYPTOGRAPHIC SIGNATURE PRESENCE
==================================================`;
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-grow py-16 px-6 lg:px-12 bg-slate-50">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-xl mx-auto">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Taxpayer Resource Center</h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-normal">
            Download guides, view deadlines calendars, inspect forms, and read policies
          </p>
        </div>

        {/* Latest Published Articles */}
        {publishedArticles.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Newspaper className="size-5 text-blue-900" />
              <h2 className="text-lg font-black text-slate-900 uppercase">Latest Tax News & Guides</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publishedArticles.slice(0, 6).map((article) => (
                <Link
                  key={article.id}
                  to={`/resources/article/${article.slug}`}
                  className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <span className="inline-block px-2.5 py-0.5 bg-blue-50 text-blue-900 rounded-full text-[9px] font-black uppercase tracking-wider">
                      {article.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-blue-900 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium line-clamp-3">
                      {article.content}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-5 mt-1 border-t border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      {article.publishDate ? new Date(article.publishDate).toLocaleDateString() : ''}
                    </span>
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-blue-800 group-hover:underline flex items-center gap-1">
                      Read More <ArrowUpRight className="size-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Requirements Section (Target of anchor) */}
        <section id="requirements" className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm scroll-mt-20">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <BookOpen className="size-5 text-blue-900" />
            <h2 className="text-lg font-black text-slate-900 uppercase">Registration Requirements Checklist</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider">For Individual Taxpayers</h3>
              <ul className="space-y-3 text-xs font-bold text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="text-blue-900 select-none">•</span>
                  <span>National Identification Number (NIN) or verified Passport ID.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-blue-900 select-none">•</span>
                  <span>Proof of residency (valid lease agreement or utility bill).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-blue-900 select-none">•</span>
                  <span>Details of employer or active business income streams.</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider">For Corporate & Business Taxpayers</h3>
              <ul className="space-y-3 text-xs font-bold text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="text-blue-900 select-none">•</span>
                  <span>Corporate Affairs Commission (CAC) incorporation certificate.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-blue-900 select-none">•</span>
                  <span>Memorandum & Articles of Association papers.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-blue-900 select-none">•</span>
                  <span>Office location coordinates and representative ID details.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Downloadable Guides */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <FileText className="size-5 text-blue-900" />
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest">Filing Forms & Guides</h2>
            </div>
            
            <div className="space-y-4">
              {[
                { name: 'Corporate Tax Form 2026', size: 'PDF (2.4 MB)', file: 'corporate_tax_form_2026.pdf' },
                { name: 'VAT Return Monthly Template', size: 'CSV (120 KB)', file: 'vat_monthly_template.csv' },
                { name: 'Individual Income Filing Guide', size: 'TXT (80 KB)', file: 'individual_filing_guide.txt' },
                { name: 'Tax Agent Representative Auth Form', size: 'PDF (1.1 MB)', file: 'agent_authorization_form.pdf' }
              ].map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
                  <div>
                    <div className="text-xs font-bold text-slate-800">{doc.name}</div>
                    <div className="text-[9px] text-slate-400 font-mono mt-0.5">{doc.size}</div>
                  </div>
                  <button 
                    onClick={() => handleDownload(doc.file)}
                    className="p-2 bg-white border border-slate-200 text-slate-500 hover:text-blue-900 hover:border-blue-200 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Download Document"
                  >
                    <Download className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Filing Calendar & Video tutorials */}
          <div className="space-y-8">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <Calendar className="size-5 text-blue-900" />
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest">Filing Calendar & Dates</h2>
              </div>
              <ul className="space-y-4 text-xs font-bold text-slate-700">
                <li className="flex justify-between items-start gap-4">
                  <div>
                    <span className="block font-black text-blue-900">July 10, 2026</span>
                    <span className="text-[10px] text-slate-500 block uppercase">Monthly Obligation</span>
                  </div>
                  <span className="text-right">VAT Monthly Returns due for June 2026 operations.</span>
                </li>
                <li className="flex justify-between items-start gap-4">
                  <div>
                    <span className="block font-black text-blue-900">August 31, 2026</span>
                    <span className="text-[10px] text-slate-500 block uppercase">Annual Obligation</span>
                  </div>
                  <span className="text-right">Corporate Income Tax (CIT) annual filing for FY 2025.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <Video className="size-5 text-blue-900" />
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest">Video Tutorials</h2>
              </div>
              <div className="aspect-video bg-slate-900 text-slate-400 rounded-xl flex flex-col items-center justify-center border border-slate-800 p-6 text-center">
                <Video className="size-8 text-blue-400 mb-2 animate-pulse" />
                <p className="text-xs font-bold text-slate-300">Guided Portal Walkthrough Tutorial</p>
                <p className="text-[9px] text-slate-500 mt-1 uppercase tracking-wider font-mono">Stream URL: GraTutorials_v1.mp4</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs Accordion */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <HelpCircle className="size-5 text-blue-900" />
            <h2 className="text-lg font-black text-slate-900 uppercase">Frequently Asked Questions</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-5 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                <h4 className="text-xs font-black text-slate-900 uppercase leading-snug">{faq.q}</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
