import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { Bell, Search, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const roleLabels: Record<string, string> = {
  super_admin: 'Super Administrator',
  tax_admin: 'Tax Administrator',
  accountant: 'Accountant',
  auditor: 'Auditor',
  support_staff: 'Support Staff',
  content_manager: 'Content Manager',
  taxpayer: 'Taxpayer',
};

const roleBadgeColors: Record<string, string> = {
  super_admin: 'bg-purple-100 text-purple-700',
  tax_admin: 'bg-blue-100 text-blue-700',
  accountant: 'bg-green-100 text-green-700',
  auditor: 'bg-orange-100 text-orange-700',
  support_staff: 'bg-yellow-100 text-yellow-700',
  content_manager: 'bg-pink-100 text-pink-700',
  taxpayer: 'bg-slate-100 text-slate-700',
};

interface SearchPageItem {
  title: string;
  path: string;
  keywords: string[];
  description: string;
}

const searchPages: Record<string, SearchPageItem[]> = {
  super_admin: [
    { title: 'Dashboard', path: '/super-admin', keywords: ['home', 'dashboard', 'overview'], description: 'System status & key metrics' },
    { title: 'User Management', path: '/super-admin/users', keywords: ['users', 'accounts', 'edit user', 'create user'], description: 'Manage system users & access control' },
    { title: 'Role Permissions Matrix', path: '/super-admin/roles', keywords: ['roles', 'permissions', 'matrix', 'access'], description: 'Audit and modify role rights matrix' },
    { title: 'System Configuration', path: '/super-admin/config', keywords: ['config', 'settings', 'tax types', 'regions'], description: 'Setup tax nodes & regions configuration' },
    { title: 'System Monitoring', path: '/super-admin/monitoring', keywords: ['monitoring', 'logs', 'api', 'health'], description: 'Realtime health diagnostics & Latency logs' },
    { title: 'Notifications Management', path: '/super-admin/notifications', keywords: ['notifications', 'alerts', 'broadcast'], description: 'Broadcast alert updates to taxpayer portals' },
    { title: 'System Analytics & Reports', path: '/super-admin/reports', keywords: ['reports', 'inflows', 'analytics', 'revenue'], description: 'Consolidated strategic inflow analytics' },
    { title: 'Audit Trail Logs', path: '/super-admin/audit-logs', keywords: ['audit logs', 'trails', 'security'], description: 'Inspect global ledger action audit trail' },
  ],
  tax_admin: [
    { title: 'Dashboard', path: '/tax-admin', keywords: ['home', 'dashboard', 'overview'], description: 'Regional overview and task metrics' },
    { title: 'Taxpayer Registry List', path: '/tax-admin/taxpayers', keywords: ['taxpayers', 'registry', 'taxpayer list'], description: 'Manage regional taxpayers details' },
    { title: 'Approve Registrations', path: '/tax-admin/taxpayers/approve', keywords: ['approve', 'registrations', 'pending'], description: 'Review and approve pending taxpayer nodes' },
    { title: 'Compliance & Audits', path: '/tax-admin/compliance', keywords: ['compliance', 'audits', 'cases'], description: 'Track compliance alerts & case priorities' },
    { title: 'Penalties & Fines', path: '/tax-admin/compliance/penalties', keywords: ['penalties', 'fines', 'debt'], description: 'Manage outstanding violation penalties' },
    { title: 'Assessments Registry', path: '/tax-admin/assessments', keywords: ['assessments', 'tax assessments', 'due'], description: 'Track and issue tax obligation assessments' },
    { title: 'Create Tax Assessment', path: '/tax-admin/assessments/create', keywords: ['create assessment', 'issue'], description: 'Issue a structured assessment ledger node' },
    { title: 'Field Operations & Inspections', path: '/tax-admin/field-operations', keywords: ['inspections', 'field ops', 'reports'], description: 'Manage inspector reports and site visits' },
    { title: 'Regional Reports', path: '/tax-admin/reports', keywords: ['reports', 'downloads', 'inflow'], description: 'Generate regional revenue inflow files' },
    { title: 'Inflow Analytics', path: '/tax-admin/analytics', keywords: ['analytics', 'charts', 'inflow'], description: 'Detailed regional revenue charts analysis' },
  ],
  accountant: [
    { title: 'Dashboard', path: '/accountant', keywords: ['home', 'dashboard', 'overview'], description: 'Total settled volumes and gateway status' },
    { title: 'Payments Ledger', path: '/accountant/payments', keywords: ['payments', 'transactions', 'ledger'], description: 'Track bank transfers and mobile payments' },
    { title: 'Bank Reconciliation Matrix', path: '/accountant/reconciliation', keywords: ['reconciliation', 'variance', 'matches'], description: 'Align system records against bank statements' },
    { title: 'Payment Exceptions', path: '/accountant/exceptions', keywords: ['exceptions', 'variance', 'mismatch'], description: 'Resolve payment disputes and failed routes' },
    { title: 'Refunds & Adjustments', path: '/accountant/refunds', keywords: ['refunds', 'adjustments', 'ledger'], description: 'Approve asset credits and refund actions' },
    { title: 'Financial Reports', path: '/accountant/reports', keywords: ['reports', 'reconciliations', 'inflow'], description: 'Generate financial reconciliation logs' },
    { title: 'Revenue Analytics', path: '/accountant/analytics', keywords: ['analytics', 'revenue', 'charts'], description: 'Detailed financial inflows graphs analytics' },
  ],
  auditor: [
    { title: 'Dashboard', path: '/auditor', keywords: ['home', 'dashboard', 'overview'], description: 'Track priority cases & global compliance score' },
    { title: 'Audit Cases', path: '/auditor/cases', keywords: ['cases', 'audit cases', 'active'], description: 'Manage registered tax audit investigations' },
    { title: 'Risk & Fraud Detection', path: '/auditor/risk-detection', keywords: ['risk', 'fraud', 'flags'], description: 'Analyze potential tax evasion cases' },
    { title: 'Audit Reports', path: '/auditor/reports', keywords: ['reports', 'audits', 'findings'], description: 'Generate compliance check reports' },
  ],
  support_staff: [
    { title: 'Dashboard', path: '/support', keywords: ['home', 'dashboard', 'overview'], description: 'Assigned tickets and support score' },
    { title: 'Ticket List', path: '/support/tickets', keywords: ['tickets', 'support', 'issues'], description: 'Manage taxpayer support requests' },
    { title: 'Support Reports', path: '/support/reports', keywords: ['reports', 'metrics'], description: 'Performance and ticket resolution times' },
    { title: 'Taxpayer Lookup', path: '/support/lookup', keywords: ['lookup', 'taxpayer search', 'find'], description: 'Find registry information for taxpayer nodes' },
  ],
  content_manager: [
    { title: 'Dashboard', path: '/content', keywords: ['home', 'dashboard', 'overview'], description: 'Published guides and article reviews' },
    { title: 'Article List', path: '/content/articles', keywords: ['articles', 'guides', 'news'], description: 'Manage taxpayer guides and news' },
    { title: 'Create Article', path: '/content/articles/create', keywords: ['create article', 'news'], description: 'Write a new taxpayer filing guideline' },
    { title: 'Categories Management', path: '/content/categories', keywords: ['categories', 'tags'], description: 'Setup tax categorizations' },
  ],
  taxpayer: [
    { title: 'Dashboard', path: '/taxpayer', keywords: ['home', 'dashboard', 'overview'], description: 'Tax overview and outstanding returns' },
    { title: 'My Profile', path: '/taxpayer/profile', keywords: ['profile', 'settings', 'tin'], description: 'View corporate tax identity registry info' },
    { title: 'Tax Obligations', path: '/taxpayer/obligations', keywords: ['obligations', 'deadlines', 'due dates'], description: 'Active filing requirements and deadlines' },
    { title: 'File Tax Return', path: '/taxpayer/filing', keywords: ['filing', 'file return', 'submit'], description: 'Complete filing step guide' },
    { title: 'Payments Portal', path: '/taxpayer/payments', keywords: ['payments', 'transactions', 'pay'], description: 'Initialize secure payment gateway' },
    { title: 'Filing Records History', path: '/taxpayer/records', keywords: ['records', 'receipts', 'history'], description: 'Complete history of filing submissions' },
    { title: 'Help & Support', path: '/taxpayer/support', keywords: ['support', 'help', 'ticket'], description: 'Open helpdesk ticket request' },
  ],
};

export default function Header() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const userMenuContainerRef = useRef<HTMLDivElement>(null);
  const notificationsContainerRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<Array<{id: string; title: string; message: string; createdAt: string; read: boolean}>>([]);

  useEffect(() => {
    supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(10).then(({ data }) => {
      if (data && data.length > 0) {
        setNotifications(data.map((n: any) => ({ id: n.id, title: n.title, message: n.message, createdAt: n.created_at, read: false })));
      }
    });
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const initials = currentUser?.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? '';

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (userMenuContainerRef.current && !userMenuContainerRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notificationsContainerRef.current && !notificationsContainerRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const role = currentUser?.role || 'taxpayer';
  const availablePages = searchPages[role] || [];
  
  const filteredPages = searchQuery.trim()
    ? availablePages.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const handleSuggestionClick = (path: string) => {
    navigate(path);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center px-6 gap-4 shrink-0">
      {/* Search */}
      <div className="flex-1 max-w-sm" ref={searchContainerRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search portal..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
          
          {showSuggestions && searchQuery.trim() !== '' && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto divide-y divide-slate-100">
              {filteredPages.length > 0 ? (
                filteredPages.map((page, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSuggestionClick(page.path)}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors flex flex-col"
                  >
                    <span className="text-xs font-bold text-slate-800">{page.title}</span>
                    <span className="text-[10px] text-slate-500 mt-0.5 leading-normal">{page.description}</span>
                    <span className="text-[9px] text-blue-600 font-mono mt-1">{page.path}</span>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-xs text-slate-400 italic">
                  No matching pages found for this role.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1" />

      {/* Date */}
      <div className="hidden md:block text-xs text-slate-400 shrink-0">{today}</div>

      {/* Notifications */}
      <div className="relative" ref={notificationsContainerRef}>
        <button 
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 rounded-lg hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-colors"
        >
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 size-1.5 bg-red-500 rounded-full animate-pulse" />
          )}
        </button>

        {showNotifications && (
          <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-800 tracking-wider">System Notifications ({unreadCount})</span>
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllAsRead}
                  className="text-[9px] text-blue-600 hover:text-blue-700 font-bold uppercase tracking-wider bg-transparent border-0 cursor-pointer"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
              {notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  onClick={() => handleMarkAsRead(notif.id)}
                  className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer text-left ${notif.read ? 'opacity-60' : 'bg-blue-50/20'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      {!notif.read && <span className="size-1.5 rounded-full bg-blue-500 shrink-0" />}
                      {notif.title}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 font-bold">{new Date(notif.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-normal font-medium">{notif.message}</p>
                </div>
              ))}
              {notifications.length === 0 && (
                <div className="px-4 py-8 text-center text-xs text-slate-400 italic">No notifications</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-slate-200" />

      {/* User */}
      {currentUser && (
        <div className="relative" ref={userMenuContainerRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 pl-1 pr-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors group cursor-pointer"
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold shrink-0">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-slate-700 leading-tight">{currentUser.name}</div>
              <div className={`inline-flex text-[10px] px-1.5 py-0.5 rounded-full font-medium mt-0.5 ${roleBadgeColors[currentUser.role] ?? 'bg-slate-100 text-slate-600'}`}>
                {roleLabels[currentUser.role]}
              </div>
            </div>
            <ChevronDown className="size-3 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 bg-slate-50/50">
                <p className="text-xs font-semibold text-slate-900 leading-none mb-1">{currentUser.name}</p>
                <p className="text-[10px] text-slate-400 font-mono truncate">{currentUser.email}</p>
              </div>
              <div className="py-1">
                {currentUser.role === 'taxpayer' && (
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/taxpayer/profile');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors cursor-pointer"
                  >
                    My Profile
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-red-50 text-xs font-medium text-red-600 transition-colors cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

