import { useState, useEffect } from 'react';
import { X, Smartphone, Building2, CreditCard, CheckCircle, AlertCircle, Loader2, ArrowRight, Shield } from 'lucide-react';

interface PaymentSimulatorProps {
  amount: number;
  method: 'mobile_money' | 'bank_transfer' | 'card' | 'cash' | 'pos' | 'check';
  onComplete: (transactionRef: string) => void;
  onCancel: () => void;
}

type SimStep = 'details' | 'otp' | 'processing' | 'success' | 'failed';

const PROVIDERS = {
  mobile_money: [
    { id: 'mtn', name: 'MTN Mobile Money', color: 'bg-yellow-500' },
    { id: 'orange', name: 'Orange Money', color: 'bg-orange-500' },
    { id: 'nexttel', name: 'Nexttel Possa', color: 'bg-blue-600' },
  ],
  bank_transfer: [
    { id: 'afriland', name: 'Afriland First Bank', color: 'bg-blue-800' },
    { id: 'sgbc', name: 'Société Générale Cameroun', color: 'bg-red-600' },
    { id: 'bicec', name: 'BICEC', color: 'bg-green-700' },
    { id: 'ecobank', name: 'Ecobank Cameroun', color: 'bg-blue-500' },
  ],
};

export default function PaymentSimulator({ amount, method, onComplete, onCancel }: PaymentSimulatorProps) {
  const [step, setStep] = useState<SimStep>('details');
  const [provider, setProvider] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [progress, setProgress] = useState(0);
  const [processingText, setProcessingText] = useState('');
  const [txnRef, setTxnRef] = useState('');

  const formatAmount = (n: number) => `${n.toLocaleString()} FCFA`;

  const generateTxnRef = () => {
    const prefix = method === 'mobile_money' ? 'MOMO' : method === 'bank_transfer' ? 'BANK' : 'CARD';
    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`;
  };

  const handleSubmitDetails = () => {
    if (method === 'mobile_money') {
      if (!provider || !phoneNumber || phoneNumber.length < 9) return;
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otp);
      setStep('otp');
    } else if (method === 'bank_transfer') {
      if (!provider || !accountNumber) return;
      startProcessing();
    } else if (method === 'card' || method === 'pos') {
      if (!cardNumber || cardNumber.length < 16 || !cardExpiry || !cardCvv) return;
      startProcessing();
    } else {
      startProcessing();
    }
  };

  const handleVerifyOtp = () => {
    if (otpCode === generatedOtp || otpCode === '123456') {
      startProcessing();
    }
  };

  const startProcessing = () => {
    const ref = generateTxnRef();
    setTxnRef(ref);
    setStep('processing');
    setProgress(0);
  };

  useEffect(() => {
    if (step !== 'processing') return;
    if (progress >= 100) {
      const timer = setTimeout(() => setStep('success'), 500);
      return () => clearTimeout(timer);
    }

    const messages = [
      'Connecting to payment gateway...',
      'Verifying account details...',
      'Authenticating transaction...',
      'Processing payment...',
      'Confirming with bank...',
      'Transaction verified!',
    ];
    setProcessingText(messages[Math.min(Math.floor(progress / 20), messages.length - 1)]);

    const timer = setTimeout(() => setProgress((p) => Math.min(p + Math.random() * 18 + 5, 100)), 400);
    return () => clearTimeout(timer);
  }, [step, progress]);

  const handleDone = () => {
    onComplete(txnRef);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={step === 'processing' ? undefined : onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="size-5 text-blue-400" />
            <div>
              <div className="text-white text-sm font-bold">DGI Payment Gateway</div>
              <div className="text-slate-400 text-[10px] font-mono uppercase tracking-widest">Secure Transaction</div>
            </div>
          </div>
          {step !== 'processing' && (
            <button onClick={onCancel} className="text-slate-400 hover:text-white transition-colors">
              <X className="size-5" />
            </button>
          )}
        </div>

        {/* Amount bar */}
        <div className="px-6 py-3 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
          <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Amount Due</span>
          <span className="text-lg font-black text-blue-900 font-mono">{formatAmount(amount)}</span>
        </div>

        <div className="p-6">
          {/* STEP: Details */}
          {step === 'details' && (
            <div className="space-y-5">
              {method === 'mobile_money' && (
                <>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Select Provider</label>
                    <div className="grid grid-cols-3 gap-2">
                      {PROVIDERS.mobile_money.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setProvider(p.id)}
                          className={`p-3 rounded-xl border-2 text-center transition-all ${
                            provider === p.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className={`size-8 ${p.color} rounded-lg mx-auto mb-2 flex items-center justify-center`}>
                            <Smartphone className="size-4 text-white" />
                          </div>
                          <span className="text-[10px] font-bold text-slate-700 block">{p.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+237 6XX XXX XXX"
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>
                </>
              )}

              {method === 'bank_transfer' && (
                <>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Select Bank</label>
                    <div className="grid grid-cols-2 gap-2">
                      {PROVIDERS.bank_transfer.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setProvider(p.id)}
                          className={`p-3 rounded-xl border-2 text-center transition-all ${
                            provider === p.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className={`size-8 ${p.color} rounded-lg mx-auto mb-2 flex items-center justify-center`}>
                            <Building2 className="size-4 text-white" />
                          </div>
                          <span className="text-[10px] font-bold text-slate-700 block">{p.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Account Number</label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="Enter your bank account number"
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>
                </>
              )}

              {(method === 'card' || method === 'pos') && (
                <>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Card Number</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                        placeholder="4242 4242 4242 4242"
                        className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 font-mono placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Expiry</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value.slice(0, 5))}
                        placeholder="MM/YY"
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 font-mono placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">CVV</label>
                      <input
                        type="text"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        placeholder="123"
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 font-mono placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {(method === 'cash' || method === 'check') && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <p className="text-xs font-bold text-emerald-800">
                    {method === 'cash' ? 'Cash payment will be recorded by the field officer.' : 'Check payment will be processed after clearance (3-5 business days).'}
                  </p>
                </div>
              )}

              <button
                onClick={handleSubmitDetails}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
              >
                {method === 'mobile_money' ? 'Send OTP' : 'Process Payment'}
                <ArrowRight className="size-4" />
              </button>
            </div>
          )}

          {/* STEP: OTP Verification (mobile money) */}
          {step === 'otp' && (
            <div className="space-y-5 text-center">
              <div className="size-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto animate-pulse">
                <Smartphone className="size-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Verify Your Payment</h3>
                <p className="text-xs text-slate-500 mt-1">A verification code has been sent to <strong>{phoneNumber}</strong></p>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Simulated OTP: <span className="font-mono text-sm">{generatedOtp}</span></p>
              </div>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-xl font-bold text-center text-slate-800 font-mono tracking-[0.5em] placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              />
              <button
                onClick={handleVerifyOtp}
                disabled={otpCode.length < 6}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold rounded-xl text-sm transition-colors"
              >
                Verify & Pay {formatAmount(amount)}
              </button>
            </div>
          )}

          {/* STEP: Processing */}
          {step === 'processing' && (
            <div className="space-y-6 text-center py-4">
              <div className="size-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                <Loader2 className="size-8 animate-spin" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Processing Payment</h3>
                <p className="text-xs text-slate-500 mt-1 h-4">{processingText}</p>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Do not close this window</p>
            </div>
          )}

          {/* STEP: Success */}
          {step === 'success' && (
            <div className="space-y-5 text-center py-4">
              <div className="size-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle className="size-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Payment Successful!</h3>
                <p className="text-xs text-slate-500 mt-1">Your payment of <strong>{formatAmount(amount)}</strong> has been processed.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl text-left space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-bold">Transaction Ref</span>
                  <span className="font-mono font-bold text-slate-900">{txnRef}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-bold">Status</span>
                  <span className="font-bold text-emerald-600">COMPLETED</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-bold">Date</span>
                  <span className="font-mono font-bold text-slate-900">{new Date().toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={handleDone}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-colors"
              >
                Done — Return to Portal
              </button>
            </div>
          )}
        </div>

        {/* Security footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2">
          <div className="size-1.5 rounded-full bg-emerald-500" />
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">256-bit SSL Encrypted • DGI Secure Gateway</span>
        </div>
      </div>
    </div>
  );
}
