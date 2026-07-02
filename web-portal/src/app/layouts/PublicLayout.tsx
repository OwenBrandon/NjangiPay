import { Outlet, Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Building2, Shield, Lock, ExternalLink } from 'lucide-react';
import { useEffect } from 'react';

export default function PublicLayout() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    } else {
      const scrollableMain = document.querySelector('main');
      if (scrollableMain) {
        scrollableMain.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 0);
      }
    }
  }, [location]);

  const handleDashboardRedirect = () => {
    navigate('/portal');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Tax Services', path: '/services' },
    { name: 'Resources', path: '/resources' },
    { name: 'Support', path: '/support-info' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      {/* Top Government Banner */}
      <div className="bg-slate-900 text-slate-300 py-1.5 px-6 text-[10px] flex items-center justify-between font-medium tracking-wider select-none shrink-0">
        <div className="flex items-center gap-2">
          <Shield className="size-3 text-blue-400" />
          <span>OFFICIAL GOVERNMENT PORTAL</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="size-3 text-emerald-400" />
          <span>SECURED CONNECTION (SSL 256-BIT ENCRYPTED)</span>
        </div>
      </div>

      {/* Main Top Navigation Header */}
      <header className="bg-white border-b border-slate-200 h-16 px-6 lg:px-12 flex items-center justify-between shadow-sm sticky top-0 z-40 shrink-0">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-900 text-white group-hover:bg-blue-800 transition-colors">
            <Building2 className="size-4.5" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-slate-900">TaxMS Portal</span>
            <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">GRA Services</span>
          </div>
        </Link>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`text-xs font-bold uppercase tracking-wider transition-colors py-2 border-b-2 ${
                  isActive
                    ? 'border-blue-900 text-blue-900 font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <button
              onClick={handleDashboardRedirect}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-blue-800 transition-all shadow-sm"
            >
              Go to Dashboard
              <ExternalLink className="size-3.5" />
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 bg-blue-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-blue-800 transition-all shadow-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Public Pages Viewport */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <Outlet />
      </main>

      {/* Public Footer */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 shrink-0">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-900 text-white">
                <Building2 className="size-4.5" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-white">TaxMS Portal</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
              Official online tax administration portal for the Government Revenue Authority. Authorized for citizen self-service filing, payments, and corporate tax tracking.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-[11px] text-slate-500 font-bold uppercase tracking-wider">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="hover:text-white transition-colors">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-white mb-4">Support & Help</h4>
            <ul className="space-y-2.5 text-[11px] text-slate-500 font-bold uppercase tracking-wider">
              <li><Link to="/support-info" className="hover:text-white transition-colors">Help Center FAQs</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Create Taxpayer Account</Link></li>
              <li><Link to="/resources" className="hover:text-white transition-colors">Filing Calendars</Link></li>
              <li><Link to="/support-info" className="hover:text-white transition-colors">Report Fraud Alert</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-white mb-4">Security & Trust</h4>
            <div className="p-4 bg-slate-800 rounded-xl border border-slate-800 text-[10px] text-slate-400 leading-normal font-medium">
              GRA TaxMS Portal uses bank-grade 256-bit SSL certificate protection. Government systems monitor all access logs to prevent data breaches and fraud.
            </div>
          </div>
        </div>

        <div className="bg-slate-950 py-6 text-center text-[10px] text-slate-500 font-medium tracking-widest uppercase border-t border-slate-900 select-none">
          {"\u00A9"} {new Date().getFullYear()} Government Revenue Authority (GRA). All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
