import React from 'react';
import { useNavigate } from 'react-router';
import { ShieldAlert, ArrowLeft, Building2 } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Vibrant Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 space-y-6 text-center relative z-10">
        {/* Brand Header */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600">
            <Building2 className="size-5 text-white" />
          </div>
          <div className="text-left">
            <div className="text-slate-900 font-black text-sm leading-tight uppercase tracking-wider">GRA Portal</div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Government Revenue Authority</div>
          </div>
        </div>

        {/* Warning Icon */}
        <div className="size-16 rounded-full bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
          <ShieldAlert className="size-8" />
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">404 - Not Found</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Routing Address Invalid</p>
          <p className="text-xs text-slate-500 leading-relaxed font-semibold max-w-xs mx-auto pt-2">
            The security node address you entered does not exist or has been relocated within the network ledger.
          </p>
        </div>

        {/* Actions */}
        <div className="pt-4 space-y-3">
          <button
            onClick={() => navigate('/portal')}
            className="w-full flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl transition-all shadow text-xs uppercase tracking-widest"
          >
            Go to Portal Home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-xl transition-all text-xs uppercase tracking-widest"
          >
            <ArrowLeft className="size-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
