import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import {
  LayoutDashboard, Users, FileText, Banknote, Search, Settings, FileCheck,
  Smartphone, HeadphonesIcon, UserCircle, Shield, TrendingUp, Building2,
  ClipboardList, Receipt, AlertTriangle, BookOpen, LogOut, HelpCircle,
  Activity, Bell, FileBarChart, Map, Gavel, CheckCircle, Plus, ShieldAlert,
  ShieldCheck, BarChart3, Tag,
} from 'lucide-react';
import type { UserRole } from '../../types';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const roleNavSections: Record<UserRole, NavSection[]> = {
  super_admin: [
    { label: 'Overview', items: [
      { label: 'Dashboard', path: '/super-admin', icon: LayoutDashboard },
      { label: 'Global Reports', path: '/super-admin/reports', icon: FileBarChart },
    ]},
    { label: 'Users', items: [
      { label: 'User Management', path: '/super-admin/users', icon: Users },
      { label: 'Roles & Permissions', path: '/super-admin/roles', icon: Shield },
    ]},
    { label: 'Tax Setup', items: [
      { label: 'System Config', path: '/super-admin/config', icon: Settings },
      { label: 'Tax Types', path: '/super-admin/config/tax-types', icon: Building2 },
      { label: 'Tax Rates', path: '/super-admin/config/tax-rates', icon: Banknote },
      { label: 'Regions', path: '/super-admin/config/regions', icon: Map },
    ]},
    { label: 'Maintenance', items: [
      { label: 'System Monitoring', path: '/super-admin/monitoring', icon: Activity },
      { label: 'Notifications', path: '/super-admin/notifications', icon: Bell },
      { label: 'Audit Logs', path: '/super-admin/audit-logs', icon: FileCheck },
    ]},
  ],
  tax_admin: [
    { label: 'Overview', items: [
      { label: 'Dashboard', path: '/tax-admin', icon: LayoutDashboard },
      { label: 'Analytics', path: '/tax-admin/analytics', icon: TrendingUp },
    ]},
    { label: 'Taxpayer Management', items: [
      { label: 'Taxpayer List', path: '/tax-admin/taxpayers', icon: Users },
      { label: 'Approve Registrations', path: '/tax-admin/taxpayers/approve', icon: CheckCircle },
      { label: 'Approve Businesses', path: '/tax-admin/businesses/approve', icon: Building2 },
    ]},
    { label: 'Compliance', items: [
      { label: 'Compliance Status', path: '/tax-admin/compliance', icon: FileCheck },
      { label: 'Manage Penalties', path: '/tax-admin/compliance/penalties', icon: Gavel },
    ]},
    { label: 'Assessments', items: [
      { label: 'Tax Assessments', path: '/tax-admin/assessments', icon: Receipt },
      { label: 'Create Assessment', path: '/tax-admin/assessments/create', icon: Plus },
    ]},
    { label: 'Operations', items: [
      { label: 'Field Operations', path: '/tax-admin/field-operations', icon: Smartphone },
      { label: 'Reports', path: '/tax-admin/reports', icon: FileBarChart },
    ]},
  ],
  accountant: [
    { label: 'Overview', items: [
      { label: 'Dashboard', path: '/accountant', icon: LayoutDashboard },
      { label: 'Revenue Analytics', path: '/accountant/analytics', icon: TrendingUp },
    ]},
    { label: 'Payment Management', items: [
      { label: 'Transactions', path: '/accountant/payments', icon: Banknote },
      { label: 'Reconciliation', path: '/accountant/reconciliation', icon: FileCheck },
      { label: 'Exceptions', path: '/accountant/exceptions', icon: ShieldAlert },
    ]},
    { label: 'Adjustments', items: [
      { label: 'Refunds', path: '/accountant/refunds', icon: Receipt },
      { label: 'Reports', path: '/accountant/reports', icon: FileBarChart },
    ]},
  ],
  auditor: [
    { label: 'Overview', items: [
      { label: 'Audit Dashboard', path: '/auditor', icon: LayoutDashboard },
    ]},
    { label: 'Audit Cases', items: [
      { label: 'Case Management', path: '/auditor/cases', icon: ClipboardList },
    ]},
    { label: 'Intelligence', items: [
      { label: 'Risk & Fraud', path: '/auditor/risk-detection', icon: ShieldAlert },
    ]},
    { label: 'Reports', items: [
      { label: 'Audit Reports', path: '/auditor/reports', icon: ShieldCheck },
    ]},
  ],
  support_staff: [
    { label: 'Overview', items: [
      { label: 'Support Dashboard', path: '/support', icon: LayoutDashboard },
    ]},
    { label: 'Helpdesk', items: [
      { label: 'Ticket Queue', path: '/support/tickets', icon: HeadphonesIcon },
    ]},
    { label: 'Intelligence', items: [
      { label: 'User Lookup', path: '/support/lookup', icon: Search },
      { label: 'Support Reports', path: '/support/reports', icon: BarChart3 },
    ]},
  ],
  content_manager: [
    { label: 'Overview', items: [
      { label: 'Intelligence', path: '/content', icon: LayoutDashboard },
    ]},
    { label: 'Content Studio', items: [
      { label: 'Article Manager', path: '/content/articles', icon: FileText },
      { label: 'Create New', path: '/content/articles/create', icon: Plus },
    ]},
    { label: 'Taxonomy', items: [
      { label: 'Category Lab', path: '/content/categories', icon: Tag },
    ]},
  ],
  taxpayer: [
    { label: 'Overview', items: [
      { label: 'Dashboard', path: '/taxpayer', icon: LayoutDashboard },
      { label: 'Profile', path: '/taxpayer/profile', icon: UserCircle },
    ]},
    { label: 'Tax Services', items: [
      { label: 'Tax Obligations', path: '/taxpayer/obligations', icon: FileText },
      { label: 'Filing', path: '/taxpayer/filing', icon: FileCheck },
      { label: 'Payments', path: '/taxpayer/payments', icon: Banknote },
      { label: 'Records', path: '/taxpayer/records', icon: Receipt },
    ]},
    { label: 'Help', items: [
      { label: 'Support', path: '/taxpayer/support', icon: HeadphonesIcon },
    ]},
  ],
};

const roleDisplayNames: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  tax_admin: 'Tax Administrator',
  accountant: 'Accountant',
  auditor: 'Auditor',
  support_staff: 'Support Staff',
  content_manager: 'Content Manager',
  taxpayer: 'Taxpayer',
};

export default function Sidebar() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const sections = roleNavSections[currentUser.role] || [];
  const initials = currentUser.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="w-64 flex flex-col" style={{ background: '#0d1929' }}>
      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600 shrink-0">
            <Building2 className="size-5 text-white" />
          </div>
          <div>
            <div className="text-white font-semibold text-sm leading-tight">TaxMS Portal</div>
            <div className="text-xs mt-0.5" style={{ color: '#4a7aaa' }}>Government Revenue</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5">
        {sections.map((section) => (
          <div key={section.label}>
            <div
              className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: '#2d4e6e' }}
            >
              {section.label}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`size-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Need Help */}
      <div className="px-3 pb-3">
        <div
          onClick={() => {
            if (currentUser.role === 'taxpayer') {
              navigate('/taxpayer/support');
            } else {
              toast.info('Accessing System Documentation Guide', {
                description: 'Initiating documentation guide download...'
              });
              const helpContent = `==================================================
TAXMS CORE DOCUMENTATION GUIDE
==================================================
Role:            ${currentUser.role.toUpperCase()}
System:          Tax Management System (v4.2.0)
Access Level:    Secured
==================================================
Welcome to the TaxMS Portal. 
If you require immediate technical assistance or wish 
to read the complete regional tax frameworks, please 
contact the IT operations helpdesk.
==================================================`;
              const blob = new Blob([helpContent], { type: 'text/plain;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.setAttribute('href', url);
              link.setAttribute('download', `taxms_documentation_guide_${currentUser.role}.txt`);
              link.style.visibility = 'hidden';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
          }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 hover:bg-white/5"
          style={{ border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600/20">
            <HelpCircle className="size-4 text-blue-400" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-300">Need Help?</div>
            <div className="text-[10px]" style={{ color: '#2d4e6e' }}>Support & Docs</div>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="px-3 pb-4 border-t pt-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3 px-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-slate-200 truncate">{currentUser.name}</div>
            <div className="text-[10px] truncate" style={{ color: '#2d4e6e' }}>
              {roleDisplayNames[currentUser.role]}
            </div>
          </div>
          <button
            onClick={logout}
            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
            title="Logout"
          >
            <LogOut className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
