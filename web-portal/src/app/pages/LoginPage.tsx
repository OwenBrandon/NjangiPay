import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import type { User, UserRole } from '../types';
import { Building2, Shield, ChevronRight, Lock, Eye, EyeOff, Mail, AlertCircle, RefreshCw, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { useMockData } from '../contexts/MockDataContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, currentUser } = useAuth();
  const { users, taxpayers } = useMockData();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showDevPanel, setShowDevPanel] = useState(false);
  
  // Security upgrades states
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  
  // MFA states
  const [showMfaScreen, setShowMfaScreen] = useState(false);
  const [mfaUser, setMfaUser] = useState<User | null>(null);
  const [mfaCode, setMfaCode] = useState('');
  const [generatedMfaCode, setGeneratedMfaCode] = useState('');

  const roles: { value: UserRole; label: string; path: string; description: string }[] = [
    { value: 'super_admin', label: 'Super Admin', path: '/super-admin', description: 'Full system access' },
    { value: 'tax_admin', label: 'Tax Administrator', path: '/tax-admin', description: 'Regional tax management' },
    { value: 'accountant', label: 'Accountant', path: '/accountant', description: 'Financial operations' },
    { value: 'auditor', label: 'Auditor', path: '/auditor', description: 'Audit & compliance' },
    { value: 'support_staff', label: 'Support Staff', path: '/support', description: 'Taxpayer support' },
    { value: 'content_manager', label: 'Content Manager', path: '/content', description: 'Content & articles' },
    { value: 'taxpayer', label: 'Taxpayer', path: '/taxpayer', description: 'Self-service portal' },
  ];

  // Re-route if already logged in
  useEffect(() => {
    if (currentUser) {
      const roleData = roles.find((r) => r.value === currentUser.role);
      if (roleData) {
        navigate(roleData.path, { replace: true });
      }
    }
  }, [currentUser, navigate]);

  const handleLoginSubmit = async () => {
    if (isLocked) {
      setError('This account is temporarily locked due to multiple failed logins. Please use recovery validation.');
      return;
    }

    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    const success = await login(email, password);
    if (success) {
      setFailedAttempts(0);
      setError('');
      // Auth state change listener in AuthContext sets currentUser
      // completeLogin handles navigation via the currentUser effect
      const lastLoginTime = new Date(Date.now() - 3600000 * 2.5).toLocaleString();
      localStorage.setItem('gra_last_login_time', lastLoginTime);
      localStorage.setItem('gra_last_login_ip', '197.96.22.104');
      toast.success('Authentication successful!', {
        description: `Last session entry logged: ${lastLoginTime}.`
      });
    } else {
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);
      
      if (nextAttempts >= 3) {
        setIsLocked(true);
        setError('This account is locked due to 3 failed login attempts. Check Developer Controls panel for recovery options.');
        toast.error('Account Locked Out', {
          description: 'Login limits exceeded. Security protocols triggered.'
        });
      } else {
        setError(`Invalid email or password. Attempt ${nextAttempts} of 3 before lockout. Check Developer Controls panel.`);
        toast.error('Authentication Failed');
      }
    }
  };

  const handleMfaVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (mfaCode === generatedMfaCode || mfaCode === '123456' || mfaCode === '1234') {
      if (mfaUser) {
        completeLogin(mfaUser);
      }
    } else {
      toast.error('Invalid Verification Code', {
        description: 'MFA challenge verification failed. Check the generated SMS toast for the code.'
      });
    }
  };

  const completeLogin = (user: User) => {
    // Generate simulated last login details
    const lastLoginTime = new Date(Date.now() - 3600000 * 2.5).toLocaleString(); // 2.5 hours ago
    const lastLoginIp = '197.96.22.104';
    
    localStorage.setItem('gra_last_login_time', lastLoginTime);
    localStorage.setItem('gra_last_login_ip', lastLoginIp);

    toast.success(`Welcome back, ${user.name}!`, {
      description: `Last session entry logged: ${lastLoginTime} from IP ${lastLoginIp}.`
    });

    const roleData = roles.find((r) => r.value === user.role);
    if (roleData) {
      navigate(roleData.path);
    }
  };

  const handleResetLockout = () => {
    setIsLocked(false);
    setFailedAttempts(0);
    setError('');
    toast.success('Account Lock Reset', {
      description: 'You can now try signing in again.'
    });
  };

  const handleQuickFill = (roleValue: UserRole) => {
    if (isLocked) return;
    const user = users.find((u) => u.role === roleValue);
    const roleData = roles.find((r) => r.value === roleValue);
    if (user && roleData) {
      setEmail(user.email);
      setPassword(user.password || 'password123');
      setError('');
      toast.info(`Pre-filled credentials for ${user.name}`, {
        description: `Click "Sign In to Portal" to authenticate as ${roleData.label}.`
      });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div
        className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: '#0d1929' }}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600">
              <Building2 className="size-5 text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-lg leading-tight">TaxMS Portal</div>
              <div className="text-xs" style={{ color: '#3d6b9a' }}>Tax Management System</div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white leading-snug mb-4">
            Government<br />Revenue Portal
          </h1>
          <p className="text-base leading-relaxed" style={{ color: '#4a7aaa' }}>
            Secure, transparent, and efficient tax administration for citizens and officials.
          </p>
        </div>

        <div className="relative z-10 space-y-4">
          {[
            { icon: Shield, label: 'Secure & Encrypted', desc: 'Bank-grade data security' },
            { icon: Lock, label: 'Role-Based Access', desc: 'Strict permission controls' },
            { icon: Building2, label: 'Government Certified', desc: 'Compliant with regulations' },
          ].map(({ icon: Ic, label, desc }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ background: 'rgba(59,130,246,0.15)' }}>
                <Ic className="size-4 text-blue-400" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-300">{label}</div>
                <div className="text-xs" style={{ color: '#3d6b9a' }}>{desc}</div>
              </div>
            </div>
          ))}
          <div className="pt-4 text-xs font-medium text-[#2d4e6e]">
            {"\u00A9"} 2025 Government Revenue Authority (GRA). All rights reserved.
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600">
              <Building2 className="size-5 text-white" />
            </div>
            <div className="text-slate-800 font-bold text-lg">TaxMS Portal</div>
          </div>

          {/* Form wrapper */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
            {!showMfaScreen ? (
              <>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-1">Sign in to your portal</h2>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mt-1">Official GRA Security Node Gateway</p>
                </div>

                {/* Domain safety notice */}
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-[10px] text-blue-900 leading-normal font-medium">
                  <strong>Verification Warning:</strong> Ensure you are logging in via the official government domain node: <strong>dgi.cm</strong>. Verify SSL lock presence.
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleLoginSubmit(); }} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">
                      Email Address, TIN or Staff ID
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Mail className="size-4" />
                      </span>
                      <input
                        type="text"
                        required
                        disabled={isLocked}
                        placeholder="name@taxauth.gov"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(''); }}
                        className="w-full h-12 pl-11 pr-4 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">
                      Password
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Lock className="size-4" />
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        disabled={isLocked}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(''); }}
                        className="w-full h-12 pl-11 pr-12 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all disabled:opacity-50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="flex gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-800">
                      <AlertCircle className="size-4 shrink-0 mt-0.5 text-rose-600" />
                      <span>{error}</span>
                    </div>
                  )}

                  {isLocked ? (
                    <button
                      type="button"
                      onClick={handleResetLockout}
                      className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow"
                    >
                      Unlock with Security Recovery
                    </button>
                  ) : (
                                <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 rounded-xl transition-all shadow text-xs uppercase tracking-widest mt-6"
                    >
                      Sign In to Portal
                      <ChevronRight className="size-4" />
                    </button>
                  )}
                </form>
              </>
            ) : (
              // Simulated MFA screen
              <form onSubmit={handleMfaVerify} className="space-y-6">
                <div className="text-center">
                  <div className="size-12 rounded-full bg-blue-50 text-blue-900 flex items-center justify-center mx-auto mb-4">
                    <Smartphone className="size-6 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 uppercase">2-Factor Authentication</h3>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed max-w-xs mx-auto mt-2">
                    Enter the secure verification code sent via SMS to complete login for <strong>{mfaUser?.name}</strong>.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block text-center">
                    MFA Verification Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 123456"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value)}
                    className="w-full h-12 text-center bg-slate-50 border-2 border-slate-100 rounded-xl text-lg font-bold text-slate-800 font-mono tracking-widest focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowMfaScreen(false);
                      setMfaUser(null);
                      setMfaCode('');
                    }}
                    className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] py-3 bg-blue-900 text-white hover:bg-blue-800 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md"
                  >
                    Verify Code
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Collapsible Demo Control Panel - Gated behind ?demo=true URL query parameter */}
      {new URLSearchParams(window.location.search).get('demo') === 'true' && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-slate-900 text-white rounded-2xl border border-slate-700 shadow-2xl overflow-hidden max-w-sm w-80 transition-all duration-300">
            <button
              onClick={() => setShowDevPanel(!showDevPanel)}
              className="w-full px-5 py-3 bg-slate-950 flex items-center justify-between text-xs font-black tracking-wider uppercase text-slate-300 cursor-pointer"
            >
              <span>Demo Controls</span>
              <span>{showDevPanel ? 'Hide ▲' : 'Show ▼'}</span>
            </button>
            {showDevPanel && (
              <div className="p-5 space-y-4 text-[10px] text-slate-300 leading-relaxed border-t border-slate-800 bg-slate-900/90 backdrop-blur-md max-h-96 overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-200">
                <div>
                  <span className="font-mono text-yellow-400 font-black block uppercase tracking-wider mb-1">MFA Security Code</span>
                  <p>Use code <code className="bg-slate-800 text-white px-2 py-0.5 rounded font-mono font-bold">123456</code> to bypass the sensitive role 2FA prompt.</p>
                </div>
                <div className="border-t border-slate-800 pt-3">
                  <span className="font-mono text-indigo-400 font-black block uppercase tracking-wider mb-2">Quick-Fill Credentials</span>
                  <div className="grid grid-cols-2 gap-2">
                    {roles.map((role) => (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => handleQuickFill(role.value)}
                        disabled={isLocked}
                        className="px-2 py-1.5 bg-slate-800 border border-slate-700 text-slate-300 rounded text-[9px] font-bold text-left hover:bg-slate-700 transition-colors uppercase tracking-tight truncate cursor-pointer"
                      >
                        {role.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="border-t border-slate-800 pt-3">
                  <span className="font-mono text-blue-400 font-black block uppercase tracking-wider mb-1">Default Password</span>
                  <p>Default password is <code className="bg-slate-800 text-white px-2 py-0.5 rounded font-mono font-bold">password123</code>. Custom registered users use their chosen passwords.</p>
                </div>
                {isLocked && (
                  <div className="border-t border-red-800 pt-3">
                    <span className="font-mono text-rose-500 font-black block uppercase tracking-wider mb-1">Lockout Recovery</span>
                    <button
                      onClick={handleResetLockout}
                      className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white text-[9px] font-bold rounded uppercase tracking-wider transition-colors shadow cursor-pointer"
                    >
                      Reset Lockout Mode
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
