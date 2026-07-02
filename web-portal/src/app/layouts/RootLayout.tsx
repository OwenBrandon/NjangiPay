import { Outlet, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { toast } from 'sonner';

const roleRoutes = [
  { prefix: '/super-admin', role: 'super_admin' },
  { prefix: '/tax-admin', role: 'tax_admin' },
  { prefix: '/accountant', role: 'accountant' },
  { prefix: '/auditor', role: 'auditor' },
  { prefix: '/support', role: 'support_staff' },
  { prefix: '/content', role: 'content_manager' },
  { prefix: '/taxpayer', role: 'taxpayer' },
];

export default function RootLayout() {
  const { currentUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading) return;
    if (!currentUser) {
      if (location.pathname !== '/login') {
        navigate('/login');
      }
      return;
    }

    // Role-based authorization guard
    const path = location.pathname;
    const matchedRoute = roleRoutes.find(r => path.startsWith(r.prefix));
    if (matchedRoute && currentUser.role !== matchedRoute.role) {
      const userRoute = roleRoutes.find(r => r.role === currentUser.role);
      const targetPath = userRoute ? userRoute.prefix : '/login';
      navigate(targetPath, { replace: true });
      toast.error('Access Denied', {
        description: `Your account is not authorized to access ${path}.`
      });
    }
  }, [currentUser, isLoading, navigate, location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 rounded-full border-4 border-slate-200 border-t-blue-900 animate-spin" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Loading...</span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
