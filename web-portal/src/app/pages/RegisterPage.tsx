import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Shield, Key, User, Building2, CheckCircle2, ChevronRight, ChevronLeft, ArrowRight, Lock, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useMockData } from '../contexts/MockDataContext';

const steps = [
  { id: 1, name: 'Account Type' },
  { id: 2, name: 'Identity check' },
  { id: 3, name: 'Profile Details' },
  { id: 4, name: 'Security Setup' },
  { id: 5, name: 'Review Details' },
  { id: 6, name: 'Confirmation' }
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { addUser, addTaxpayer } = useMockData();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showDevPanel, setShowDevPanel] = useState(false);

  // Form states
  const [accountType, setAccountType] = useState<'individual' | 'business' | 'agent' | ''>('');
  
  // Identity validation states
  const [tin, setTin] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otpRequested, setOtpRequested] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');

  // Profile details states
  const [region, setRegion] = useState('Central Region');
  const [address, setAddress] = useState('');
  const [obligations, setObligations] = useState({ vat: false, cit: false, pit: false });

  // Security setup states
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [enable2fa, setEnable2fa] = useState(true);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Tracking details
  const [trackingId, setTrackingId] = useState('');

  const handleRequestOtp = () => {
    if (!email.trim() || !phone.trim()) {
      toast.error('Identity Error', { description: 'Please enter a valid email and phone number.' });
      return;
    }
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setOtpRequested(true);
    toast.success('Security OTP Dispatched', {
      description: `[SIMULATED SECURE SMS] Your verification code is: ${code}`
    });
  };

  const handleVerifyOtp = () => {
    if (otpCode === generatedOtp || otpCode === '4892') {
      setOtpVerified(true);
      toast.success('Identity Verified', { description: 'Your email and phone have been securely authenticated.' });
    } else {
      toast.error('Verification Failure', { description: 'Incorrect verification code. Check the generated SMS toast.' });
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && !accountType) {
      toast.error('Account Type Required', { description: 'Please select an account type to proceed.' });
      return;
    }
    if (currentStep === 2) {
      if (!tin.trim() || !name.trim() || !email.trim() || !phone.trim()) {
        toast.error('Validation Error', { description: 'Please fill in all identity fields.' });
        return;
      }
      if (!otpVerified) {
        toast.error('Verification Required', { description: 'Please request and verify the security OTP code before proceeding.' });
        return;
      }
    }
    if (currentStep === 3 && (!address.trim())) {
      toast.error('Validation Error', { description: 'Please enter your registered office or residential address.' });
      return;
    }
    if (currentStep === 4) {
      if (!password || !confirmPassword) {
        toast.error('Validation Error', { description: 'Please enter and confirm your password.' });
        return;
      }
      if (password !== confirmPassword) {
        toast.error('Password Mismatch', { description: 'Confirm password must match.' });
        return;
      }
      if (password.length < 8) {
        toast.error('Weak Password', { description: 'Password must be at least 8 characters long.' });
        return;
      }
    }

    setCurrentStep(prev => Math.min(prev + 1, steps.length));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      toast.error('Terms Unaccepted', { description: 'Please review and accept terms & privacy policies.' });
      return;
    }

    if (!tin || tin.trim().length < 8) {
      toast.error('Invalid TIN', { description: 'Please enter a valid pre-registered TIN number (e.g. TIN-2026-0001).' });
      return;
    }

    // Validate TIN against pre-registered list
    const { supabase } = await import('../lib/supabase');
    const { data: tinRecord } = await supabase
      .from('pre_registered_tins')
      .select('*')
      .eq('tin', tin.trim())
      .eq('status', 'available')
      .maybeSingle();

    if (!tinRecord) {
      toast.error('TIN Not Found', {
        description: 'This TIN is not in the system or has already been claimed. Please contact your regional tax office if you believe this is an error.'
      });
      return;
    }

    const genTrackingId = `REG-${Date.now().toString().slice(-6)}-${Math.floor(10 + Math.random() * 90)}`;
    setTrackingId(genTrackingId);

    const taxpayerId = `TP-${Date.now()}`;
    const newTaxpayer = {
      id: taxpayerId,
      name: name,
      tin: tin.trim(),
      businessName: tinRecord.business_name || name,
      email: email,
      phone: phone,
      address: address,
      region: region,
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'pending' as const,
      taxType: Object.keys(obligations).filter(k => (obligations as any)[k])
    };

    const newUser = {
      id: taxpayerId,
      name: name,
      email: email,
      role: 'taxpayer' as const,
      password: password
    };

    addUser(newUser);
    addTaxpayer(newTaxpayer);

    // Mark TIN as claimed
    supabase.from('pre_registered_tins')
      .update({ status: 'claimed', claimed_at: new Date().toISOString() })
      .eq('tin', tin.trim())
      .then();

    setCurrentStep(6);
    toast.success('Registration Submitted', {
      description: `Your taxpayer account registration has been submitted successfully and is pending administrator approval. Tracking ID: ${genTrackingId}`
    });
  };

  return (
    <div className="flex-grow py-12 px-6 lg:px-12 bg-slate-50 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between min-h-[520px]">
        
        {/* Header indicator */}
        <div className="px-8 py-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-blue-900" />
            <span className="text-xs font-black uppercase text-slate-800 tracking-wider">Guided Taxpayer Registration</span>
          </div>
          {currentStep < 6 && (
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">
              Step {currentStep} of 5
            </span>
          )}
        </div>

        {/* Wizard Progress Bar */}
        {currentStep < 6 && (
          <div className="h-1 bg-slate-100 relative">
            <div 
              className="h-full bg-blue-900 transition-all duration-300" 
              style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
            />
          </div>
        )}

        {/* Body content */}
        <div className="p-8 lg:p-10 flex-grow flex flex-col justify-between">
          <div>
            {/* STEP 1: Account Type */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-black text-slate-900 uppercase">Choose Account Type</h2>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Select the category that defines your tax registration</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'individual', title: 'Individual Taxpayer', desc: 'Personal income tax, individual properties, and sole traders registration.', icon: User },
                    { id: 'business', title: 'Business Taxpayer', desc: 'Registered companies (LTD, PLC), corporate entities, and partnerships.', icon: Building2 },
                    { id: 'agent', title: 'Tax Representative', desc: 'Designated tax agents, audit consultants, or corporate legal representatives.', icon: Shield }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setAccountType(item.id as any)}
                      className={`flex flex-col p-5 rounded-xl border text-left transition-all ${
                        accountType === item.id 
                          ? 'border-blue-900 bg-blue-50/20 shadow-sm' 
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`p-2 rounded-lg w-fit ${accountType === item.id ? 'bg-blue-900 text-white' : 'bg-slate-200 text-slate-600'}`}>
                        <item.icon className="size-4" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 mt-4 uppercase">{item.title}</h4>
                      <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-2">{item.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl text-[10px] text-slate-500 leading-normal font-medium">
                  <strong>Notice for Government Officials:</strong> GRA admin, auditor, accountant, or helpdesk representative accounts cannot self-register. Internal credentials must be provisioned by the Super Administrator office.
                </div>
              </div>
            )}

            {/* STEP 2: Identity check */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-black text-slate-900 uppercase">Verify Registry Identity</h2>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Provide legal identification and confirm details</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Taxpayer Identification Number (TIN)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. TIN-123456"
                      value={tin}
                      onChange={(e) => setTin(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:border-blue-900 outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Legal Name / Business Entity</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Acme Business Ltd"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:border-blue-900 outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="name@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:border-blue-900 outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Phone Number</label>
                    <input
                      type="text"
                      required
                      placeholder="+237..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:border-blue-900 outline-none"
                    />
                  </div>
                </div>

                {/* OTP Section */}
                <div className="p-5 bg-slate-50 border border-slate-200/60 rounded-xl space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">OTP Check</span>
                      <p className="text-xs font-bold text-slate-700 mt-0.5">Authenticate contact email & phone</p>
                    </div>
                    {!otpRequested ? (
                      <button
                        type="button"
                        onClick={handleRequestOtp}
                        className="px-4 py-2 bg-blue-900 text-white rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-blue-800 shadow-sm"
                      >
                        Request OTP Code
                      </button>
                    ) : (
                      <span className="text-[10px] font-black text-blue-900 uppercase tracking-wider font-mono">CODE_DISPATCHED</span>
                    )}
                  </div>

                  {otpRequested && !otpVerified && (
                    <div className="flex gap-3 items-center">
                      <input
                        type="text"
                        placeholder="Enter 4-digit code"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 font-mono focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-emerald-700 shadow-sm"
                      >
                        Verify OTP
                      </button>
                    </div>
                  )}

                  {otpVerified && (
                    <div className="text-[10px] font-black text-emerald-600 uppercase tracking-wide flex items-center gap-1.5 pt-2">
                      <span className="size-2 rounded-full bg-emerald-500 animate-pulse" /> Verified successfully. Identity records mapped.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3: Profile Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-black text-slate-900 uppercase">Profile Details</h2>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Specify regional office location and tax obligations</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Tax Office Region</label>
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-900 uppercase tracking-widest font-mono"
                    >
                      <option value="Central Region">Central Region Office</option>
                      <option value="Western Region">Western Region Office</option>
                      <option value="Eastern Region">Eastern Region Office</option>
                      <option value="Northern Region">Northern Region Office</option>
                      <option value="Southern Region">Southern Region Office</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Registered Address</label>
                    <input
                      type="text"
                      required
                      placeholder="Street address, city, state"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:border-blue-900 outline-none"
                    />
                  </div>

                  <div className="space-y-3 pt-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block mb-2">Select Obligations to Register</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { key: 'vat', label: 'Value Added Tax (VAT)' },
                        { key: 'cit', label: 'Corporate Income (CIT)' },
                        { key: 'pit', label: 'Personal Income (PIT)' }
                      ].map((ob) => (
                        <label key={ob.key} className="flex items-center gap-3.5 p-4 bg-slate-50 border border-slate-200/60 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                          <input
                            type="checkbox"
                            checked={(obligations as any)[ob.key]}
                            onChange={(e) => setObligations(prev => ({ ...prev, [ob.key]: e.target.checked }))}
                            className="size-4.5 rounded border-slate-300 text-blue-900 focus:ring-blue-900/10"
                          />
                          <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wide">{ob.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Security Setup */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-black text-slate-900 uppercase">Security Setup</h2>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Configure credentials and authorization safeguards</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-12 pl-4 pr-12 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:border-blue-900 outline-none"
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

                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Confirm Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:border-blue-900 outline-none"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Recovery Email</label>
                    <input
                      type="email"
                      placeholder="backup@email.com"
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:border-blue-900 outline-none"
                    />
                  </div>
                </div>

                {/* 2FA Toggle Card */}
                <div className="flex items-center justify-between p-5 bg-slate-50 border border-slate-200/60 rounded-xl">
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">2-Factor Authentication</span>
                    <span className="text-xs font-bold text-slate-800 block mt-0.5">Enable OTP code challenge during log in</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEnable2fa(!enable2fa)}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors shadow-sm ${
                      enable2fa ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {enable2fa ? 'Enabled' : 'Disabled'}
                  </button>
                </div>

                {/* Safety warning */}
                <div className="p-4 bg-rose-50 border border-rose-100 text-rose-800 rounded-xl text-[10px] font-medium leading-normal flex items-start gap-2.5">
                  <AlertTriangle className="size-4.5 text-rose-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Important Security notice:</strong> TaxMS will never ask for your account password or recovery credentials by phone, email, or chat support. Keep this password confidential.
                  </span>
                </div>
              </div>
            )}

            {/* STEP 5: Review details */}
            {currentStep === 5 && (
              <form onSubmit={handleSubmitRegistration} className="space-y-6">
                <div>
                  <h2 className="text-lg font-black text-slate-900 uppercase">Review Registration Details</h2>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Audit all parameters before ledger submission</p>
                </div>

                <div className="space-y-4 divide-y divide-slate-100 bg-slate-50 border border-slate-200/60 p-6 rounded-xl text-xs font-bold text-slate-700">
                  <div className="flex justify-between pb-3">
                    <span className="text-slate-500 uppercase text-[10px]">Account Category:</span>
                    <span className="uppercase text-slate-900">{accountType}</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-slate-500 uppercase text-[10px]">Taxpayer TIN:</span>
                    <span className="text-slate-900 font-mono">{tin}</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-slate-500 uppercase text-[10px]">Legal Entity Name:</span>
                    <span className="text-slate-900">{name}</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-slate-500 uppercase text-[10px]">Registered Region:</span>
                    <span className="text-slate-900">{region}</span>
                  </div>
                  <div className="flex justify-between pt-3">
                    <span className="text-slate-500 uppercase text-[10px]">Enabled Safeties:</span>
                    <span className="text-slate-900 uppercase font-mono">{enable2fa ? '2FA Enabled' : 'Password Only'}</span>
                  </div>
                </div>

                <label className="flex items-start gap-3.5 p-5 bg-slate-50 border border-slate-200/60 rounded-xl cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="size-4.5 rounded border-slate-300 text-blue-900 focus:ring-blue-900/10 mt-0.5"
                  />
                  <span className="text-[10px] font-bold text-slate-600 leading-relaxed uppercase tracking-wide">
                    I declare that all details provided correspond to officially registered CAC/federal identity records. I accept the GRA data protection rules and privacy guidelines.
                  </span>
                </label>
              </form>
            )}

            {/* STEP 6: Confirmation */}
            {currentStep === 6 && (
              <div className="space-y-6 text-center py-6">
                <div className="size-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <CheckCircle2 className="size-8" />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Application Received</h2>
                  <p className="text-xs font-semibold text-slate-500 max-w-md mx-auto">
                    Your taxpayer account request has been successfully logged to the central government registry queue.
                  </p>
                </div>

                <div className="p-5 bg-slate-50 border border-slate-200/60 rounded-xl max-w-sm mx-auto space-y-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono block">Tracking reference</span>
                  <span className="text-base font-extrabold text-blue-900 font-mono tracking-wider block">{trackingId}</span>
                </div>

                <div className="text-[11px] text-slate-500 max-w-md mx-auto space-y-4 pt-4 leading-normal">
                  <p className="font-semibold">
                    <strong>Expected review Timeline:</strong> GRA officers typically verify business registrations within <strong>2 to 3 business days</strong>. An activation token will be sent to <strong>{email}</strong> once verified.
                  </p>
                  <p className="font-bold text-slate-400 uppercase tracking-wide">
                    Next Step: Prepare corporate filing statement logs.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Controls Footer */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-8 mt-10">
            {currentStep > 1 && currentStep < 6 ? (
              <button
                type="button"
                onClick={handlePrevious}
                className="flex items-center gap-2 px-5 py-3 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft className="size-4" />
                Back
              </button>
            ) : currentStep === 6 ? (
              <div /> // empty placeholder
            ) : (
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-5 py-3 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors"
              >
                Exit Portal
              </button>
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-blue-800 transition-all shadow-sm"
              >
                Continue
                <ChevronRight className="size-4" />
              </button>
            ) : currentStep === 5 ? (
              <button
                type="button"
                onClick={handleSubmitRegistration}
                className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-md shadow-emerald-100"
              >
                Submit Application
                <ArrowRight className="size-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="px-8 py-3 bg-blue-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-blue-800 transition-all shadow-md"
              >
                Return to Login Page
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Collapsible Demo Control Panel */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-slate-900 text-white rounded-2xl border border-slate-700 shadow-2xl overflow-hidden max-w-sm w-80 transition-all duration-300">
          <button
            onClick={() => setShowDevPanel(!showDevPanel)}
            className="w-full px-5 py-3 bg-slate-950 flex items-center justify-between text-xs font-black tracking-wider uppercase text-slate-300"
          >
            <span>Demo Controls</span>
            <span>{showDevPanel ? 'Hide ▲' : 'Show ▼'}</span>
          </button>
          {showDevPanel && (
            <div className="p-5 space-y-4 text-[10px] text-slate-300 leading-relaxed border-t border-slate-800 bg-slate-900/90 backdrop-blur-md">
              <div>
                <span className="font-mono text-yellow-400 font-black block uppercase tracking-wider mb-1">Identity Check OTP</span>
                <p>Use code <code className="bg-slate-800 text-white px-2 py-0.5 rounded font-mono font-bold">4892</code> to verify email/phone details in Step 2.</p>
              </div>
              <div className="border-t border-slate-800 pt-3">
                <span className="font-mono text-blue-400 font-black block uppercase tracking-wider mb-1">Persistent Sign-in</span>
                <p>Once registered, you can log in immediately from the Login page using the email & password you configured.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
