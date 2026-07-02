import { Link } from 'react-router';
import { Shield, Key, FileText, Landmark, Clock, CheckCircle, Ticket, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function TaxServices() {
  const { currentUser } = useAuth();
  const services = [
    {
      title: 'Taxpayer Registration & TIN Activation',
      icon: Key,
      publicRoute: '/register',
      privateRoute: '/portal',
      who: 'Individuals, registered corporate businesses, and designated tax representatives.',
      docs: ['Identity Document (NIN/Passport)', 'CAC Business Incorporation Certificate (for companies)', 'Valid utility bill showing business address.'],
      time: '1 to 2 business days.',
      fee: 'Free of charge.',
      steps: [
        'Select taxpayer category (Individual or Business).',
        'Enter TIN/CAC identification records.',
        'Upload verified supporting documentation files.',
        'Submit to regional GRA officers for verification & activation.'
      ]
    },
    {
      title: 'Filing Returns (CIT, VAT, PIT, WHT)',
      icon: FileText,
      publicRoute: '/login',
      privateRoute: '/taxpayer/filing',
      who: 'Active corporate entities and registered business partners.',
      docs: ['Financial Statement sheet', 'Deductible receipt logs', 'Withholding tax certificates.'],
      time: 'Instantaneous digital submission.',
      fee: 'No filing fees (subject to calculated tax rates).',
      steps: [
        'Access portal dashboard under taxpayer authentication.',
        'Initiate the Tax Filing wizard flow.',
        'Input audited gross revenues, deductions, and capital allowances.',
        'Verify declarations check and execute filing submission.'
      ]
    },
    {
      title: 'Online Payment Settlement',
      icon: Landmark,
      publicRoute: '/login',
      privateRoute: '/taxpayer/payments',
      who: 'All taxpayers with pending, overdue, or assessed tax balances.',
      docs: ['Official assessed return number or reference transaction ID.'],
      time: 'Settles within 10 minutes.',
      fee: 'Payment processor transaction gateway fees apply.',
      steps: [
        'Navigate to the payment segment inside the portal.',
        'Select pending assessment and choose settlement gateway method.',
        'Process secure authorization check.',
        'Download instant digital verification receipt.'
      ]
    },
    {
      title: 'Compliance, Certificates & Audits',
      icon: Shield,
      publicRoute: '/login',
      privateRoute: '/taxpayer/obligations',
      who: 'Taxpayers requesting Tax Clearance Certificates (TCC) or facing case audits.',
      docs: ['Complete filing ledger history records matching banking settles.'],
      time: 'Certificates generated within 3 business days.',
      fee: 'Free.',
      steps: [
        'Ensure zero outstanding variance checks across all obligation terms.',
        'Submit TCC request in self-service panel.',
        'Regional compliance office audits records ledger.',
        'Download secure PDF certificate once cleared.'
      ]
    },
    {
      title: 'Appeals, Disputes & Penalties',
      icon: AlertTriangle,
      publicRoute: '/login',
      privateRoute: '/taxpayer/support',
      who: 'Taxpayers seeking dispute resolutions on assessments or penalties waivers.',
      docs: ['Assessed ID documentation and audit case records.'],
      time: 'Dispute reviews take 5 to 10 business days.',
      fee: 'Free.',
      steps: [
        'Submit a support case citing calculation errors or reasons for penalty waiver.',
        'Provide supporting tax ledgers and correspondence.',
        'Compliance board reviews case parameters.',
        'Check dispute status on ledger updates.'
      ]
    },
    {
      title: 'Support Requests & Live Tickets',
      icon: Ticket,
      publicRoute: '/support-info',
      privateRoute: '/taxpayer/support',
      who: 'All portal visitors experiencing login issues or functional portal errors.',
      docs: ['None required (screenshot of error code recommended).'],
      time: 'First response within 4 hours.',
      fee: 'Free.',
      steps: [
        'Open Helpdesk panel in public Support channel.',
        'Input subject details, select relevant category, and write comments.',
        'Submit support request ticket.',
        'Receive updates via email notifications.'
      ]
    }
  ];

  return (
    <div className="flex-grow py-16 px-6 lg:px-12 bg-slate-50">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-xl mx-auto">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Portal Tax Services Directory</h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-normal">
            Information guidelines, timelines, and requirements to successfully complete operations
          </p>
        </div>

        {/* Services List */}
        <div className="space-y-8">
          {services.map((svc, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Icon & Intro */}
              <div className="lg:col-span-1 space-y-4 border-b lg:border-b-0 lg:border-r border-slate-200/60 pb-6 lg:pb-0 lg:pr-6">
                <div className="flex items-center justify-center size-12 bg-blue-50 text-blue-900 rounded-xl">
                  <svc.icon className="size-6" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-tight">{svc.title}</h3>
                
                <div className="space-y-2 pt-2">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Eligible User base</span>
                    <p className="text-xs font-semibold text-slate-700 mt-0.5">{svc.who}</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Processing Timeframe</span>
                    <p className="text-xs font-semibold text-slate-700 mt-0.5">{svc.time}</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Processing Fee</span>
                    <p className="text-xs font-semibold text-slate-700 mt-0.5">{svc.fee}</p>
                  </div>
                </div>
              </div>

              {/* Middle Column: Requirements & Steps */}
              <div className="lg:col-span-2 flex flex-col justify-between">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-3">Required Documents</h4>
                    <ul className="space-y-2 text-xs font-bold text-slate-700">
                      {svc.docs.map((doc, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-blue-900 select-none">•</span>
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-3">Step-by-Step Procedure</h4>
                    <ol className="space-y-2 text-xs font-bold text-slate-700">
                      {svc.steps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-slate-400 font-mono font-black">{idx + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                <div className="pt-8 flex items-center justify-end border-t border-slate-100 mt-6">
                  {(() => {
                    const getServiceRoute = () => {
                      if (!currentUser) return svc.publicRoute;
                      const role = currentUser.role;
                      if (role === 'taxpayer') return svc.privateRoute;

                      // Role-specific operational segments based on the service clicked
                      if (svc.title.includes('Registration')) {
                        if (role === 'tax_admin') return '/tax-admin/taxpayers/approve';
                        if (role === 'super_admin') return '/super-admin/users';
                      }
                      if (svc.title.includes('Filing')) {
                        if (role === 'tax_admin') return '/tax-admin/compliance';
                        if (role === 'auditor') return '/auditor/cases';
                      }
                      if (svc.title.includes('Payment')) {
                        if (role === 'accountant') return '/accountant/payments';
                      }
                      if (svc.title.includes('Compliance')) {
                        if (role === 'tax_admin') return '/tax-admin/compliance';
                        if (role === 'auditor') return '/auditor/cases';
                      }
                      if (svc.title.includes('Appeals') || svc.title.includes('Disputes')) {
                        if (role === 'tax_admin') return '/tax-admin/compliance/penalties';
                        if (role === 'support_staff') return '/support/tickets';
                      }
                      if (svc.title.includes('Support') || svc.title.includes('Tickets')) {
                        if (role === 'support_staff') return '/support/tickets';
                      }

                      // Default fallbacks to respective role dashboard bases
                      const roleRoutes: Record<string, string> = {
                        super_admin: '/super-admin',
                        tax_admin: '/tax-admin',
                        accountant: '/accountant',
                        auditor: '/auditor',
                        support_staff: '/support',
                        content_manager: '/content',
                      };
                      return roleRoutes[role] || '/portal';
                    };

                    return (
                      <Link
                        to={getServiceRoute()}
                        className="px-6 py-3 bg-blue-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-blue-800 transition-all shadow-sm"
                      >
                        Start Service Online
                      </Link>
                    );
                  })()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
