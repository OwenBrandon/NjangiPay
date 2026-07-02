import { getColorClass } from '../../utils/colorClasses';
import React, { useState } from 'react';
import { Link } from 'react-router';
import { 
  Plus, Search, Edit, Trash2, Shield, Users,
  Activity, ArrowUpRight, ShieldCheck, Database, 
  MoreVertical, Mail, MapPin, Zap
} from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../../components/ui/sheet';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from '../../components/ui/alert-dialog';
import { toast } from 'sonner';

export default function UserManagement() {
  const { users, deleteUser } = useMockData();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  
  const itemsPerPage = 5;
  const roleLabels: Record<string, string> = {
    super_admin: 'Super Admin',
    tax_admin: 'Tax Admin',
    accountant: 'Accountant',
    auditor: 'Auditor',

    support_staff: 'Support Staff',
    content_manager: 'Content Manager',
    taxpayer: 'Taxpayer',
  };

  const roleColors: Record<string, string> = {
    super_admin: 'rose',
    tax_admin: 'purple',
    accountant: 'emerald',
    auditor: 'blue',

    support_staff: 'sky',
    content_manager: 'pink',
    taxpayer: 'slate',
  };

  const glassCard = 'bg-white rounded-2xl border border-slate-200/60 shadow-2xl shadow-blue-900/5 overflow-hidden';

  const activeAdmins = users.filter(u => u.role === 'super_admin' || u.role === 'tax_admin').length;

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (roleLabels[u.role] && roleLabels[u.role].toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete);
      toast.success('Personnel Purged', { description: 'The node has been completely removed from the registry.' });
      setUserToDelete(null);
      // Adjust page if we deleted the last item on the current page
      if (paginatedUsers.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }
    }
  };
  return (
    <div className="min-h-screen bg-[#f1f5f9] relative overflow-hidden">
      {/* Intelligence Background Blobs */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="p-6 lg:p-10 space-y-12 relative z-10">
        {/* Intelligence Command Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="size-3 rounded-full bg-blue-500 animate-ping absolute inset-0" />
                <div className="size-3 rounded-full bg-blue-600 relative" />
              </div>
              <span className="px-3 py-1 bg-blue-100/50 border border-blue-200 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Global Roster</span>
              <span className="text-slate-400">•</span>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Access Control Terminal</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">User Management</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/super-admin/users/create"
              className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-200/50 hover:scale-105"
            >
              <Plus className="size-5" />
              Initialize User Node
            </Link>
          </div>
        </div>

        {/* Intelligence KPI Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Total Personnel', value: users.length.toLocaleString(), trend: 'Optimal', icon: Users, color: 'blue' },
            { label: 'Admin Nodes', value: activeAdmins, trend: 'Secure', icon: ShieldCheck, color: 'purple' },

          ].map((kpi, i) => (
            <div key={i} className={`group relative bg-white rounded-2xl border border-slate-100 p-9 shadow-lg hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-700 overflow-hidden cursor-default`}>
              <div className={`absolute -top-16 -right-16 w-40 h-40 ${getColorClass(kpi.color, 'bg500_5')} rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-1000`} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div 
                    className="p-5 shadow-md rounded-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-white/50"
                    style={{ background: '#0d1929', color: '#38bdf8' }}
                  >
                    <kpi.icon className="size-7" />
                  </div>
                  <div className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-[0.1em] uppercase bg-slate-100 text-slate-500`}>
                    {kpi.trend}
                  </div>
                </div>
                <div className="text-[11px] font-black text-slate-600 uppercase tracking-[0.25em] mb-3">{kpi.label}</div>
                <div className="text-5xl font-black text-slate-900 tracking-tighter group-hover:text-blue-600 transition-colors">{kpi.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Registry Terminal */}
        <div className={`${glassCard}`}>
          <div className="p-8 lg:p-10 border-b border-white/50 bg-white/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-blue-100 text-blue-600 rounded-xl shadow-sm">
                <Database className="size-6" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">System Roster</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Active Personnel Registry</p>
              </div>
            </div>

            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
              <input
                type="text"
                placeholder="SEARCH REGISTRY..."
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 outline-none text-[11px] font-black uppercase tracking-widest text-slate-700 placeholder:text-slate-400 shadow-inner transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-10 py-5 text-left text-[11px] font-black italic text-slate-800 uppercase tracking-[0.2em]">Personnel Information</th>
                  <th className="px-10 py-5 text-left text-[11px] font-black italic text-slate-800 uppercase tracking-[0.2em]">Role & Clearance</th>
                  <th className="px-10 py-5 text-left text-[11px] font-black italic text-slate-800 uppercase tracking-[0.2em]">Regional Hub</th>
                  <th className="px-10 py-5 text-right text-[11px] font-black italic text-slate-800 uppercase tracking-[0.2em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/30">
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => {
                    const rColor = roleColors[user.role] || 'slate';
                    const initials = user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
                    
                    return (
                      <tr 
                        key={user.id} 
                        className="hover:bg-slate-50/50 transition-all group relative border-b border-slate-100 last:border-0 cursor-pointer"
                        onClick={() => setSelectedUser(user)}
                      >
                        <td className="px-10 py-6 relative">
                          <div className={`absolute left-0 top-0 bottom-0 w-1 ${getColorClass(rColor, 'bg500')} opacity-0 group-hover:opacity-100 transition-opacity`} />
                          <div className="flex items-center gap-5">
                            <div className="relative">
                              <div 
                                className="size-12 rounded-2xl flex items-center justify-center text-[11px] font-black text-slate-600 bg-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 group-hover:rotate-6 shadow-sm"
                              >
                                {initials}
                              </div>
                            </div>
                            <div>
                              <div className="text-base font-black text-slate-900 tracking-tight leading-tight">{user.name}</div>
                              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                                <Mail className="size-3 text-slate-300" /> {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${getColorClass(rColor, 'bg50')} ${getColorClass(rColor, 'text600')} border ${getColorClass(rColor, 'border100')}`}>
                            <Shield className="size-3" />
                            {roleLabels[user.role]}
                          </span>
                        </td>
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-3 text-xs font-black text-slate-700">
                            <div className="p-2 bg-blue-50/50 border border-blue-100/50 rounded-xl group-hover:bg-white group-hover:border-blue-200 transition-all shadow-sm">
                              <MapPin className="size-3.5 text-blue-500 group-hover:text-blue-600" />
                            </div>
                            {user.region || 'Global Clearance'}
                          </div>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <div className="flex items-center justify-end gap-3 transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0">
                            <Link 
                              to={`/super-admin/users/${user.id}/edit`}
                              className="p-3 bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 rounded-2xl transition-all shadow-sm"
                              title="Modify"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Edit className="size-5" />
                            </Link>
                            <button 
                              className="p-3 bg-white border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 rounded-2xl transition-all shadow-sm" 
                              title="Purge"
                              onClick={(e) => {
                                e.stopPropagation();
                                setUserToDelete(user.id);
                              }}
                            >
                              <Trash2 className="size-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="px-12 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 text-slate-300">
                          <Search className="size-12" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-black text-slate-900 uppercase tracking-widest">No Intelligence Nodes Found</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-10 py-6 border-t border-slate-100/50 bg-slate-50/30 flex items-center justify-between">
            <span className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <Zap className="size-4 text-emerald-500 animate-pulse" />
              Indexing {filteredUsers.length} Active Nodes (Page {currentPage} of {totalPages})
            </span>
            <div className="flex gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="px-6 py-2.5 bg-white border border-slate-200 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-slate-900 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="px-6 py-2.5 bg-white border border-slate-200 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-slate-900 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* User Details Slide-over */}
      <Sheet open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <SheetContent className="bg-slate-900 text-white border-l-slate-800 w-[400px] sm:w-[540px]">
          <SheetHeader className="mb-8">
            <SheetTitle className="text-2xl font-black tracking-tight text-white">Personnel Dossier</SheetTitle>
            <SheetDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
              Classified Identification Record
            </SheetDescription>
          </SheetHeader>
          
          {selectedUser && (
            <div className="space-y-8">
              <div className="flex items-center gap-6 pb-8 border-b border-slate-800">
                <div className="size-20 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center text-3xl font-black border border-blue-500/30">
                  {selectedUser.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight">{selectedUser.name}</h3>
                  <p className="text-sm text-slate-400 font-medium mt-1">{selectedUser.email}</p>
                  <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Shield className="size-3" />
                    {roleLabels[selectedUser.role]}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Operational Parameters</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Region</div>
                    <div className="text-sm font-black text-white">{selectedUser.region || 'Global Clearance'}</div>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Status</div>
                    <div className="text-sm font-black text-emerald-400 flex items-center gap-2">
                      <div className="size-2 bg-emerald-400 rounded-full animate-pulse" /> Active
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Recent Activity Forensics</h4>
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-2xl border border-slate-700/30">
                      <Activity className="size-4 text-blue-400" />
                      <div>
                        <div className="text-xs font-black text-white">Authorized access to central node</div>
                        <div className="text-[10px] text-slate-500 font-medium mt-0.5">{i * 2} hours ago</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black text-slate-900 tracking-tight">Confirm Purge</AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-medium text-slate-500">
              This action will permanently delete this personnel node from the system registry. This cannot be undone. Are you certain you wish to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel className="rounded-xl border-slate-200 text-slate-600 font-bold uppercase tracking-widest text-[11px] py-6">Abort</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 rounded-xl font-black uppercase tracking-widest text-[11px] py-6 shadow-xl shadow-red-200">
              Execute Purge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
