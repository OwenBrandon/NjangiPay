import React, { useState } from 'react';
import { Shield, Save, RotateCcw, AlertCircle, Lock } from 'lucide-react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from '../../components/ui/alert-dialog';
import { toast } from 'sonner';

const roles = [
  'Super Admin',
  'Tax Admin',
  'Accountant',
  'Auditor',

  'Support Staff',
  'Content Manager',
  'Taxpayer',
];

const permissions = [
  { category: 'User Management', items: ['Create Users', 'Edit Users', 'Delete Users', 'Assign Roles'] },
  { category: 'Tax Operations', items: ['View Taxpayers', 'Create Assessments', 'Approve Returns', 'Issue Penalties'] },
  { category: 'Financial', items: ['Process Payments', 'Reconcile Accounts', 'Issue Refunds', 'View Reports'] },
  { category: 'Audit', items: ['Create Audit Cases', 'Close Cases', 'Flag Transactions', 'Generate Reports'] },
  { category: 'System', items: ['System Config', 'View Audit Logs', 'Manage Content', 'API Access'] },
];

const getInitialPermission = (role: string, item: string): boolean => {
  const r = role.toLowerCase();
  const i = item.toLowerCase();
  
  if (r === 'super admin') return true;
  
  if (r === 'tax admin') {
    return i.includes('view taxpayers') || i.includes('create assessments') || 
           i.includes('approve returns') || i.includes('issue penalties') || 
           i.includes('view reports');
  }
  
  if (r === 'accountant') {
    return i.includes('process payments') || i.includes('reconcile accounts') || 
           i.includes('issue refunds') || i.includes('view reports');
  }
  
  if (r === 'auditor') {
    return i.includes('create audit cases') || i.includes('close cases') || 
           i.includes('flag transactions') || i.includes('generate reports') ||
           i.includes('view taxpayers') || i.includes('view reports');
  }
  
  if (r === 'support staff') {
    return i.includes('view taxpayers') || i.includes('view reports') ||
           i.includes('api access');
  }
  
  if (r === 'content manager') {
    return i.includes('manage content') || i.includes('system config');
  }
  
  if (r === 'taxpayer') {
    return i.includes('process payments') || i.includes('view reports');
  }
  
  return false;
};

const initialState = permissions.reduce((acc, group) => {
  group.items.forEach(item => {
    roles.forEach(role => {
      acc[`${role}-${item}`] = getInitialPermission(role, item);
    });
  });
  return acc;
}, {} as Record<string, boolean>);

export default function RolePermissionManagement() {
  const glassCard = 'bg-white rounded-2xl border border-slate-200/60 shadow-2xl shadow-blue-900/5 overflow-hidden';
  
  const [permissionState, setPermissionState] = useState(initialState);
  const [showConfirm, setShowConfirm] = useState(false);

  const togglePermission = (role: string, item: string) => {
    setPermissionState(prev => ({ ...prev, [`${role}-${item}`]: !prev[`${role}-${item}`] }));
  };

  const revertMatrix = () => {
    setPermissionState(initialState);
    toast("Matrix Reverted", { description: "Restored to last saved configuration." });
  };

  const handleCommit = () => {
    setShowConfirm(false);
    toast.success("Security Policies Committed", { description: "New authorization matrix deployed across all nodes." });
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] relative overflow-hidden">
      {/* Intelligence Background Blobs */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-rose-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="p-6 lg:p-10 space-y-12 relative z-10">
        {/* Surgical Command Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="size-3 rounded-full bg-rose-500 animate-ping absolute inset-0" />
                <div className="size-3 rounded-full bg-rose-600 relative" />
              </div>
              <span className="px-3 py-1 bg-rose-100/50 border border-rose-200 text-rose-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Security Protocol</span>
              <span className="text-slate-400">•</span>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Access Control Matrix</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">Roles & Permissions</h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={revertMatrix} className="flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[11px] font-black uppercase tracking-widest hover:text-slate-900 hover:bg-slate-50 transition-all shadow-sm hover:shadow-md">
              <RotateCcw className="size-4" />
              Revert Matrix
            </button>
            <button onClick={() => setShowConfirm(true)} className="flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-300/50 hover:scale-105">
              <Save className="size-4" />
              Commit Security Policies
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {permissions.map((permGroup) => (
            <div key={permGroup.category} className={`${glassCard} transition-all duration-500 hover:shadow-blue-900/10 group`}>
              <div className="bg-white/40 border-b border-slate-100 px-8 py-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-100 text-slate-600 rounded-[1rem] shadow-sm group-hover:bg-rose-100 group-hover:text-rose-600 transition-colors">
                    <Shield className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">{permGroup.category}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Category Security Node</p>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                  <Lock className="size-3" />
                  Protected Resource
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-8 py-5 text-left text-[11px] font-black italic text-slate-800 uppercase tracking-[0.2em] border-b border-slate-100 w-64 sticky left-0 bg-slate-50/90 backdrop-blur z-10 shadow-[10px_0_15px_-5px_rgba(0,0,0,0.02)]">
                        Authorization Target
                      </th>
                      {roles.map((role) => (
                        <th key={role} className="px-6 py-5 text-center text-[10px] font-black italic text-slate-600 uppercase tracking-[0.1em] border-b border-slate-100 min-w-[120px]">
                          {role}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/50">
                    {permGroup.items.map((perm) => (
                      <tr key={perm} className="hover:bg-blue-50/20 transition-all relative border-b border-slate-50 last:border-0">
                        <td className="px-8 py-5 text-sm font-black text-slate-700 tracking-tight sticky left-0 bg-white z-10 shadow-[10px_0_15px_-5px_rgba(0,0,0,0.02)] border-r border-slate-50/50 group-hover:bg-blue-50/10 transition-colors">
                          {perm}
                        </td>
                        {roles.map((role) => {
                          return (
                            <td key={role} className="px-6 py-5 text-center relative group/toggle">
                              <label className="relative inline-flex items-center justify-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={permissionState[`${role}-${perm}`] || false}
                                  onChange={() => togglePermission(role, perm)}
                                  className="sr-only peer"
                                />
                                <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500 shadow-inner group-hover/toggle:shadow-md transition-all"></div>
                                <div className="absolute inset-0 rounded-full opacity-0 peer-checked:opacity-20 peer-checked:bg-rose-500 blur-md transition-opacity duration-300 pointer-events-none" />
                              </label>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer info block */}
        <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center gap-4">
          <AlertCircle className="size-5 text-slate-400" />
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">
            Modifying authorization matrices takes immediate effect across the network. Exercise extreme caution.
          </p>
        </div>

      </div>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="rounded-xl border-rose-500/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Shield className="size-6 text-rose-500" />
              Confirm Security Matrix
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-medium text-slate-500">
              Deploying these authorization changes will immediately modify access levels across all network nodes. Are you absolutely certain you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel className="rounded-xl border-slate-200 text-slate-600 font-bold uppercase tracking-widest text-[11px] py-6 hover:bg-slate-100">Abort Deployment</AlertDialogCancel>
            <AlertDialogAction onClick={handleCommit} className="bg-rose-600 hover:bg-rose-700 rounded-xl font-black uppercase tracking-widest text-[11px] py-6 shadow-xl shadow-rose-200">
              Execute Deployment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
