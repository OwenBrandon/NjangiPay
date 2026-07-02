import { Link } from 'react-router';
import { ShieldCheck, FileText, Landmark, Key, BookOpen, HelpCircle, Clock, ArrowUpRight } from 'lucide-react';
import { useMockData } from '../contexts/MockDataContext';

export default function PublicHome() {
  const { articles } = useMockData();

  // Latest published content surfaced as live portal notices
  const publishedNotices = articles
    .filter((a) => a.status === 'published')
    .sort(
      (a, b) =>
        new Date(b.publishDate || b.updatedDate).getTime() -
        new Date(a.publishDate || a.updatedDate).getTime()
    )
    .slice(0, 3);

  const serviceCards = [
    {
      title: 'Register as a Taxpayer',
      desc: 'Obtain your unique Taxpayer Identification Number (TIN) and activate self-service.',
      icon: Key,
      link: '/register',
      color: 'blue'
    },
    {
      title: 'File Tax Returns',
      desc: 'Submit your CIT, VAT, PIT, and Withholding Tax forms online step-by-step.',
      icon: FileText,
      link: '/services',
      color: 'indigo'
    },
    {
      title: 'Make Payments Online',
      desc: 'Settle tax obligations instantly using bank transfers, credit cards, or mobile money.',
      icon: Landmark,
      link: '/services',
      color: 'emerald'
    },
    {
      title: 'View Records & Receipts',
      desc: 'Search history ledger nodes, view submitted returns, and download official certificates.',
      icon: ShieldCheck,
      link: '/services',
      color: 'teal'
    },
    {
      title: 'Request Portal Support',
      desc: 'Submit helpdesk request tickets, trace resolutions, and message regional officers.',
      icon: HelpCircle,
      link: '/support-info',
      color: 'purple'
    },
    {
      title: 'Read Tax Guidelines',
      desc: 'Access downloadable templates, filing calculators, FAQ guides, and glossaries.',
      icon: BookOpen,
      link: '/resources',
      color: 'amber'
    }
  ];

  return (
    <div className="flex-grow flex flex-col bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50/50 to-transparent py-16 lg:py-24 px-6 lg:px-12 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          <div className="lg:col-span-2 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-900 rounded-full text-[10px] font-black uppercase tracking-wider">
              <ShieldCheck className="size-3.5" />
              OFFICIAL SELF-SERVICE PORTAL
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Manage Your Taxes <span className="text-blue-900 underline decoration-blue-900/30 decoration-8 underline-offset-4">Securely</span> Online
            </h1>
            
            <p className="text-slate-600 text-sm font-medium leading-relaxed max-w-2xl">
              Register your profile, file tax returns, settle payments, audit transaction histories, and resolve filing obligations with direct support from the Government Revenue Authority.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Link
                to="/login"
                className="w-full sm:w-auto text-center px-8 py-3.5 bg-blue-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-blue-800 transition-all shadow-md"
              >
                Login to Portal
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto text-center px-8 py-3.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-all shadow-sm"
              >
                Create Taxpayer Account
              </Link>
            </div>

            <div className="pt-2">
              <Link
                to="/resources#requirements"
                className="text-xs font-bold text-blue-800 hover:text-blue-900 underline underline-offset-2 uppercase tracking-wide"
              >
                Check Registration Requirements {"\u2014"} What You Need
              </Link>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Clock className="size-4 text-blue-800" />
              Official Portal Notices
            </h3>
            
            <div className="space-y-4 divide-y divide-slate-100">
              {/* Live published content from the Content Management system */}
              {publishedNotices.map((notice) => (
                <Link
                  key={notice.id}
                  to={`/resources/article/${notice.slug}`}
                  className="block pt-3 first:pt-0 group"
                >
                  <span className="inline-block text-[9px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded mb-2">
                    {notice.category}
                  </span>
                  <p className="text-xs font-bold text-slate-800 group-hover:text-blue-900 transition-colors flex items-center gap-1">
                    {notice.title}
                    <ArrowUpRight className="size-3 text-slate-300 group-hover:text-blue-900 transition-colors" />
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1 font-medium leading-normal line-clamp-2">
                    {notice.content}
                  </p>
                </Link>
              ))}

              {/* Permanent security advisory (not content-managed) */}
              <div className="pt-3">
                <span className="inline-block text-[9px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 px-2 py-0.5 rounded mb-2">Security warning</span>
                <p className="text-xs font-bold text-slate-800">Phishing & Fraud Alert</p>
                <p className="text-[10px] text-slate-500 mt-1 font-medium leading-normal">
                  The Revenue Authority will never request passwords, card details, or OTP codes over the phone or email. Keep credentials safe.
                </p>
              </div>
            </div>

            <Link
              to="/resources"
              className="inline-flex items-center gap-1 text-[10px] font-black text-blue-800 hover:text-blue-900 uppercase tracking-widest hover:underline"
            >
              View All Updates <ArrowUpRight className="size-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Tax Services & Guidelines</h2>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">Access public resources or trigger portal actions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceCards.map((card, i) => (
            <Link
              key={i}
              to={card.link}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-center size-10 rounded-xl bg-slate-100 text-slate-700 group-hover:bg-blue-900 group-hover:text-white transition-colors">
                  <card.icon className="size-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight group-hover:text-blue-900 transition-colors">
                  {card.title}
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  {card.desc}
                </p>
              </div>
              <div className="text-[9px] font-extrabold uppercase tracking-widest text-blue-800 group-hover:underline pt-6 flex items-center gap-1">
                Access Service {"\u2192"}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust & Policy Section */}
      <section className="bg-slate-900 text-white py-16 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center md:text-left md:col-span-1 border-b md:border-b-0 md:border-r border-slate-800 pb-8 md:pb-0 md:pr-8">
            <h2 className="text-2xl font-extrabold tracking-tight uppercase text-blue-400">Security & Trust</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2">GRA Standards of Compliance</p>
          </div>

          {[
            {
              title: 'Official Receipts',
              desc: 'Every filing submission and payment transaction immediately triggers a digital verification receipt with automated status updates.'
            },
            {
              title: 'Role-Based Protection',
              desc: 'Official data can only be modified under strict authenticated permissions. Government audits monitor every single operational ledger override.'
            },
            {
              title: 'Privacy Safeguards',
              desc: 'We store corporate audit, taxpayer identity registries, and income reports under secure encryptions, compliant with federal privacy laws.'
            }
          ].map((item, idx) => (
            <div key={idx} className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-100">{item.title}</h4>
              <p className="text-[11px] text-slate-400 leading-normal font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
