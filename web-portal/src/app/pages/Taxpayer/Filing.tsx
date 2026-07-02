import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { CheckCircle, FileText, Banknote, Upload, AlertCircle, ChevronRight, ChevronLeft, Download, Send, Terminal, X, ShieldAlert, Cpu } from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card } from '../../components/ui/card';
import { Checkbox } from '../../components/ui/checkbox';
import { Progress } from '../../components/ui/progress';
import { toast } from 'sonner';

const steps = [
  { id: 1, name: 'Tax Type', icon: FileText },
  { id: 2, name: 'Income Details', icon: Banknote },
  { id: 3, name: 'Deductions', icon: FileText },
  { id: 4, name: 'Documents', icon: Upload },
  { id: 5, name: 'Review & Submit', icon: CheckCircle },
];

export default function FilingPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showFilingModal, setShowFilingModal] = useState(false);
  const [filingProgress, setFilingProgress] = useState(0);
  const [filingPhase, setFilingPhase] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { addTaxReturn, taxpayers } = useMockData();
  const { currentUser } = useAuth();
  const currentTaxpayer = taxpayers.find(t => t.userId === currentUser?.id || t.email === currentUser?.email);

  const [formData, setFormData] = useState({
    taxType: '',
    period: '',
    grossIncome: '',
    otherIncome: '',
    totalIncome: '',
    businessExpenses: '',
    capitalAllowances: '',
    otherDeductions: '',
    totalDeductions: '',
    netIncome: '',
    taxableIncome: '',
    calculatedTax: '',
    documents: [] as File[],
    declaration: false,
  });

  useEffect(() => {
    if (!isSubmitting) return;
    if (filingProgress >= 100) {
      // Add tax return record to global mock data
      const taxpayerId = currentTaxpayer?.id || currentUser?.id || '8';
      const amountValue = parseFloat(formData.calculatedTax) || 0;
      addTaxReturn({
        id: `TR-${Date.now()}`,
        taxpayerId,
        period: formData.period || '2026-q1',
        taxType: (formData.taxType || 'vat').toUpperCase(),
        amount: amountValue,
        status: 'filed',
        filingDate: new Date().toISOString().split('T')[0],
        dueDate: '2026-06-30',
      });

      const timer = setTimeout(() => {
        setIsSubmitting(false);
        setShowFilingModal(false);
        toast.success('Tax Return Submitted', { 
          description: `${formData.taxType.toUpperCase()} return successfully submitted. Receipt REC-${Math.floor(1000 + Math.random()*9000)} generated.` 
        });
        navigate('/taxpayer/records');
      }, 800);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => {
      setFilingProgress(p => {
        const next = p + 25;
        if (next === 25) setFilingPhase('Verifying income details and business statement...');
        if (next === 50) setFilingPhase('Validating allowances and deductions compliance...');
        if (next === 75) setFilingPhase('Registering your return with the tax database...');
        if (next >= 100) setFilingPhase('Return successfully processed!');
        return Math.min(100, next);
      });
    }, 450);
    return () => clearTimeout(timer);
  }, [isSubmitting, filingProgress, formData.taxType, navigate]);

  const calculateTotals = () => {
    const totalIncome = (parseFloat(formData.grossIncome) || 0) + (parseFloat(formData.otherIncome) || 0);
    const totalDeductions = (parseFloat(formData.businessExpenses) || 0) +
                           (parseFloat(formData.capitalAllowances) || 0) +
                           (parseFloat(formData.otherDeductions) || 0);
    const taxableIncome = totalIncome - totalDeductions;
    const calculatedTax = taxableIncome * 0.3;

    setFormData(prev => ({
      ...prev,
      totalIncome: totalIncome.toFixed(2),
      totalDeductions: totalDeductions.toFixed(2),
      taxableIncome: taxableIncome.toFixed(2),
      calculatedTax: calculatedTax.toFixed(2),
    }));
  };

  const handleNext = () => {
    if (currentStep === 2 || currentStep === 3) {
      calculateTotals();
    }
    setCurrentStep(prev => Math.min(prev + 1, steps.length));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmitReturn = () => {
    setIsSubmitting(true);
    setFilingProgress(0);
    setFilingPhase('Initializing filing submission...');
    setShowFilingModal(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...Array.from(e.target.files!)],
      }));
    }
  };

  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  const glassCard = 'bg-white rounded-2xl border border-slate-200/60 shadow-lg shadow-blue-900/5 overflow-hidden';
  const terminalGrid = "";

  return (
    <div className="min-h-screen bg-[#f1f5f9] relative overflow-hidden p-8 lg:p-12">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] size-[50%] bg-blue-400/5 hidden rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] size-[50%] bg-indigo-400/5 hidden rounded-full" />
      </div>

      {/* Header Section */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 max-w-5xl mx-auto">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="size-3 rounded-full bg-blue-500 animate-ping absolute inset-0" />
              <div className="size-3 rounded-full bg-blue-600 relative" />
            </div>
            <span className="px-3 py-1 bg-blue-100/50 border border-blue-200 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Taxpayer Portal</span>
            <span className="text-slate-400">•</span>
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Filing Wizard</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mt-2">File Tax Return</h1>
          <p className="text-sm text-slate-500 font-medium">Complete the steps to submit your return to the agency</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        {/* Step Indicator Panel */}
        <div className={`${glassCard} p-8 shadow-sm`}>
          <div className="mb-6 relative">
            <div className="flex items-center justify-between relative z-10 flex-wrap sm:flex-nowrap gap-4">
              {steps.map((step, idx) => (
                <div key={step.id} className="flex items-center flex-1 justify-center sm:justify-start">
                  <div className="flex flex-col items-center">
                    <div className={`flex items-center justify-center size-12 rounded-2xl border-2 transition-all duration-300 ${
                      currentStep > step.id ? 'bg-emerald-500 border-emerald-500 shadow-md shadow-emerald-100' :
                      currentStep === step.id ? 'bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-200' :
                      'bg-white border-slate-200 text-slate-400'
                    }`}>
                      {currentStep > step.id ? (
                        <CheckCircle className="size-5 text-white" />
                      ) : (
                        <step.icon className="size-5" />
                      )}
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-wider mt-3 font-mono ${currentStep === step.id ? 'text-slate-900' : 'text-slate-400'}`}>
                      {step.name}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`h-0.5 hidden md:block flex-1 mx-4 mb-8 transition-colors duration-300 ${currentStep > step.id ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
          <Progress value={progress} className="h-1.5 bg-slate-100 [&>div]:bg-blue-600 transition-all rounded-full" />
        </div>

        {/* Wizard Step Body */}
        <div className={`${glassCard} p-8 lg:p-12 shadow-sm min-h-[400px] flex flex-col justify-between`}>
          <div className="flex-1">
            {currentStep === 1 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase italic mb-2">Select Tax Type and Period</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Choose the return parameters</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="taxType" className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Tax Type</Label>
                    <Select value={formData.taxType} onValueChange={(value) => setFormData(prev => ({ ...prev, taxType: value }))}>
                      <SelectTrigger id="taxType" className="h-12 bg-white/50 border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500">
                        <SelectValue placeholder="Select tax type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white rounded-2xl border-slate-200 shadow-xl">
                        <SelectItem value="cit" className="text-xs font-bold">Corporate Income Tax (CIT)</SelectItem>
                        <SelectItem value="vat" className="text-xs font-bold">Value Added Tax (VAT)</SelectItem>
                        <SelectItem value="pit" className="text-xs font-bold">Personal Income Tax (PIT)</SelectItem>
                        <SelectItem value="wht" className="text-xs font-bold">Withholding Tax (WHT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="period" className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Tax Period</Label>
                    <Select value={formData.period} onValueChange={(value) => setFormData(prev => ({ ...prev, period: value }))}>
                      <SelectTrigger id="period" className="h-12 bg-white/50 border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500">
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent className="bg-white rounded-2xl border-slate-200 shadow-xl">
                        <SelectItem value="2026-q1" className="text-xs font-bold">Q1 2026 (Jan - Mar)</SelectItem>
                        <SelectItem value="2026-q2" className="text-xs font-bold">Q2 2026 (Apr - Jun)</SelectItem>
                        <SelectItem value="2026-q3" className="text-xs font-bold">Q3 2026 (Jul - Sep)</SelectItem>
                        <SelectItem value="2026-q4" className="text-xs font-bold">Q4 2026 (Oct - Dec)</SelectItem>
                        <SelectItem value="2025-fy" className="text-xs font-bold">FY 2025 (Full Year)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {formData.taxType && (
                  <Card className="p-6 bg-blue-50/50 border-blue-200/50 rounded-3xl mt-8">
                    <div className="flex gap-4">
                      <AlertCircle className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-black text-blue-900 uppercase tracking-wider mb-2">Filing Requirements Checklist</h4>
                        <ul className="text-[10px] font-bold text-blue-700 space-y-2 uppercase tracking-wide">
                          <li>• Financial statements for the selected period</li>
                          <li>• Supporting documentation for all gross income and deductions</li>
                          <li>• Bank statements matching bank parameters</li>
                          <li>• Previous tax clearance document node if active</li>
                        </ul>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase italic mb-2">Income Details</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Enter all sources of revenue parameters</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="grossIncome" className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Gross Business Income</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold">{"FCFA "}</span>
                      <Input
                        id="grossIncome"
                        type="number"
                        placeholder="0.00"
                        className="h-12 pl-8 pr-4 bg-white/50 border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
                        value={formData.grossIncome}
                        onChange={(e) => setFormData(prev => ({ ...prev, grossIncome: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="otherIncome" className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Other Income</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold">{"FCFA "}</span>
                      <Input
                        id="otherIncome"
                        type="number"
                        placeholder="0.00"
                        className="h-12 pl-8 pr-4 bg-white/50 border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
                        value={formData.otherIncome}
                        onChange={(e) => setFormData(prev => ({ ...prev, otherIncome: e.target.value }))}
                      />
                    </div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Investment income, dividends, rental, etc.</p>
                  </div>
                </div>

                <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl mt-8">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest font-mono">Total Income Calculated</span>
                    <span className="text-2xl font-black text-white font-mono italic">
                      {"FCFA "}{((parseFloat(formData.grossIncome) || 0) + (parseFloat(formData.otherIncome) || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <Card className="p-6 bg-amber-50/50 border-amber-200/50 rounded-3xl">
                  <div className="flex gap-4">
                    <AlertCircle className="size-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-black text-amber-900 uppercase tracking-wider mb-2">Notice</h4>
                      <p className="text-[10px] font-bold text-amber-700 leading-normal uppercase tracking-wide">Ensure all income amounts are accurate and match your financial records. Misrepresentation may result in penalties.</p>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase italic mb-2">Deductions & Allowances</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Enter allowable deductions to calculate net taxable income</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="businessExpenses" className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Business Expenses</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold">{"FCFA "}</span>
                      <Input
                        id="businessExpenses"
                        type="number"
                        placeholder="0.00"
                        className="h-12 pl-8 pr-4 bg-white/50 border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
                        value={formData.businessExpenses}
                        onChange={(e) => setFormData(prev => ({ ...prev, businessExpenses: e.target.value }))}
                      />
                    </div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Rent, utilities, employee wages, etc.</p>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="capitalAllowances" className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Capital Allowances</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold">{"FCFA "}</span>
                      <Input
                        id="capitalAllowances"
                        type="number"
                        placeholder="0.00"
                        className="h-12 pl-8 pr-4 bg-white/50 border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
                        value={formData.capitalAllowances}
                        onChange={(e) => setFormData(prev => ({ ...prev, capitalAllowances: e.target.value }))}
                      />
                    </div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Depreciation on company assets</p>
                  </div>

                  <div className="space-y-3 md:col-span-2">
                    <Label htmlFor="otherDeductions" className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Other Deductions</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold">{"FCFA "}</span>
                      <Input
                        id="otherDeductions"
                        type="number"
                        placeholder="0.00"
                        className="h-12 pl-8 pr-4 bg-white/50 border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
                        value={formData.otherDeductions}
                        onChange={(e) => setFormData(prev => ({ ...prev, otherDeductions: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl space-y-4 mt-8">
                  <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">
                    <span>Total Deductions</span>
                    <span className="text-white">
                      {"FCFA "}{((parseFloat(formData.businessExpenses) || 0) + (parseFloat(formData.capitalAllowances) || 0) + (parseFloat(formData.otherDeductions) || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="h-px bg-slate-800" />
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest font-mono">Calculated Net Taxable Income</span>
                    <span className="text-2xl font-black text-white font-mono italic">
                      {"FCFA "}{Math.max(0, (parseFloat(formData.totalIncome) || 0) - ((parseFloat(formData.businessExpenses) || 0) + (parseFloat(formData.capitalAllowances) || 0) + (parseFloat(formData.otherDeductions) || 0))).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase italic mb-2">Upload Supporting Documents</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Attach files required to verify income claims</p>
                </div>

                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-10 text-center hover:border-blue-500 hover:bg-slate-50/50 transition-all duration-300 group">
                  <Upload className="size-12 text-slate-400 mx-auto mb-4 group-hover:scale-110 group-hover:text-blue-500 transition-all" />
                  <h3 className="text-sm font-bold text-slate-800 mb-2">Drag and drop files here, or browse</h3>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider mb-6">PDF, JPG, PNG up to 10MB each</p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Button variant="outline" className="h-11 px-6 border-slate-200 text-xs font-black uppercase tracking-wider rounded-xl bg-white hover:bg-slate-50" asChild>
                      <span>Browse Files</span>
                    </Button>
                  </label>
                </div>

                {formData.documents.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Uploaded Files ({formData.documents.length})</h3>
                    {formData.documents.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all group">
                        <div className="flex items-center gap-3.5">
                          <div className="p-3 bg-slate-900 text-white rounded-xl">
                            <FileText className="size-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800 truncate max-w-md">{file.name}</div>
                            <div className="text-[9px] font-black text-slate-400 font-mono uppercase mt-0.5">Size: {(file.size / 1024).toFixed(2)} KB</div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          className="h-9 px-3 text-[10px] font-black uppercase tracking-wider text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            documents: prev.documents.filter((_, i) => i !== idx),
                          }))}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <Card className="p-6 bg-blue-50/50 border-blue-200/50 rounded-3xl">
                  <h4 className="text-xs font-black text-blue-900 uppercase tracking-wider mb-2">Required Document Types</h4>
                  <ul className="text-[10px] font-bold text-blue-700 space-y-2 uppercase tracking-wide">
                    <li>• Audited balance sheets and statements</li>
                    <li>• Income bank ledger statements</li>
                    <li>• Deductible invoices & expenditure receipts</li>
                    <li>• Incorporation certificates</li>
                  </ul>
                </Card>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase italic mb-2">Review & Submit</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Verify all information before final submission</p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6 bg-white/50 rounded-3xl border border-slate-200/60 shadow-sm">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono mb-4">Tax Parameters</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500 font-bold">Tax Category:</span>
                          <span className="text-slate-900 font-black font-mono">{formData.taxType.toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500 font-bold">Tax Period:</span>
                          <span className="text-slate-900 font-black font-mono">{formData.period}</span>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6 bg-white/50 rounded-3xl border border-slate-200/60 shadow-sm">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono mb-4">Document Queue</h3>
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                        <FileText className="size-4 text-blue-500" />
                        <span>{formData.documents.length} File(s) queue uploaded</span>
                      </div>
                    </Card>
                  </div>

                  <Card className="p-8 bg-white/50 rounded-3xl border border-slate-200/60 shadow-sm">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono mb-6">Financial Statement</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 font-bold">Total Gross Revenues</span>
                        <span className="text-slate-900 font-mono font-black">{"FCFA "}{parseFloat(formData.totalIncome || '0').toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 font-bold">Allowable Deductions</span>
                        <span className="text-slate-900 font-mono font-black">{"FCFA "}{parseFloat(formData.totalDeductions || '0').toLocaleString()}</span>
                      </div>
                      <div className="h-px bg-slate-200" />
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 font-bold">Net Taxable Balance</span>
                        <span className="text-slate-900 font-mono font-black">{"FCFA "}{parseFloat(formData.taxableIncome || '0').toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-slate-800 font-black text-sm uppercase italic">Estimated Tax Payable (30%)</span>
                        <span className="text-2xl font-black text-blue-600 font-mono italic">{"FCFA "}{parseFloat(formData.calculatedTax || '0').toLocaleString()}</span>
                      </div>
                    </div>
                  </Card>

                  <div className="flex items-start gap-3.5 p-5 bg-white/50 border border-slate-200/60 rounded-3xl">
                    <Checkbox
                      id="declaration"
                      checked={formData.declaration}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, declaration: checked as boolean }))}
                      className="size-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/10 mt-0.5"
                    />
                    <label htmlFor="declaration" className="text-xs font-bold text-slate-600 cursor-pointer leading-relaxed uppercase tracking-wide">
                      I declare that the information provided in this return is true and accurate. I understand that providing false information may result in audit review and compliance penalties.
                    </label>
                  </div>

                  <Card className="p-6 bg-emerald-50/50 border-emerald-200/50 rounded-3xl">
                    <div className="flex gap-4">
                      <CheckCircle className="size-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-black text-emerald-900 uppercase tracking-wider mb-2">Submission Ready</h4>
                        <p className="text-[10px] font-bold text-emerald-700 leading-normal uppercase tracking-wide">Upon execution, a confirmation receipt is logged. Return processing requires 5-7 business days.</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </div>

          {/* Wizard Footer Controls */}
          <div className="flex items-center justify-between mt-12 pt-6 border-t border-slate-200/60">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="h-11 px-6 border-slate-200 text-xs font-black uppercase tracking-wider rounded-xl bg-white hover:bg-slate-50"
            >
              <ChevronLeft className="size-4 mr-1.5" />
              Previous Step
            </Button>

            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">
              Step {currentStep} of {steps.length}
            </div>

            {currentStep < steps.length ? (
              <Button 
                onClick={handleNext}
                className="h-11 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all"
              >
                Next Step
                <ChevronRight className="size-4 ml-1.5" />
              </Button>
            ) : (
              <Button
                disabled={!formData.declaration}
                onClick={handleSubmitReturn}
                className="h-11 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50 shadow-md shadow-emerald-100"
              >
                <Send className="size-4 mr-1.5" />
                Submit Return
              </Button>
            )}
          </div>
        </div>

        {/* Support Help Center Card */}
        <Card className="p-6 bg-blue-50/50 border-blue-200/50 rounded-3xl">
          <div className="flex gap-4">
            <AlertCircle className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-black text-blue-900 uppercase tracking-wider mb-2">Need assistance with your filing?</h4>
              <p className="text-[10px] font-bold text-blue-700 leading-normal uppercase tracking-wide">Contact our portal officers or download the documentation guide.</p>
              <div className="flex gap-3 mt-4">
                <Button 
                  onClick={() => navigate('/taxpayer/support')}
                  variant="outline" size="sm" className="bg-white border-blue-200/50 text-[9px] font-black uppercase tracking-wider rounded-lg h-9 hover:bg-slate-50"
                >
                  Contact Support
                </Button>
                <Button 
                  onClick={() => {
                    toast.success('Guide Download Initiated', { description: 'Downloading taxpayer_filing_guide_v2.txt...' });
                    const fileContent = `==================================================
TAXPAYER FILING COMPLIANCE GUIDE (v2)
==================================================
1. CHOOSE TAX OBLIGATION CATEGORY (VAT, CIT, PIT, WHT)
2. ENTER ACCURATE INFLOW / OUTFLOW REVENUE METRICS
3. ENSURE ALL CALCULATED DEDUCTIONS ALIGN WITH REGIONS
4. UPLOAD LEGALLY VERIFIED BUSINESS LEDGERS
5. REVIEW DECLARATION STATEMENT NODE SECURELY
==================================================`;
                    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.setAttribute('href', url);
                    link.setAttribute('download', 'taxpayer_filing_guide_v2.txt');
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  variant="outline" size="sm" className="bg-white border-blue-200/50 text-[9px] font-black uppercase tracking-wider rounded-lg h-9 hover:bg-slate-50"
                >
                  <Download className="size-3 mr-1" />
                  Filing Guide
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Submission Loading Modal */}
      {showFilingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" />
          <div className="relative bg-slate-900 border border-white/10 rounded-2xl p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] w-full max-w-md animate-in zoom-in-95 duration-300 text-white">
            <h3 className="text-xl font-black uppercase italic tracking-tighter mb-2 flex items-center gap-2">
              <Cpu className="size-5 text-blue-400 animate-spin" />
              Submitting Return...
            </h3>
            <p className="text-[9px] text-slate-500 uppercase tracking-widest font-mono mb-6">Type: {formData.taxType.toUpperCase()}</p>

            <div className="space-y-6">
              <div className="py-6 text-center">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.2em] mb-4 min-h-[30px]">{filingPhase}</div>
                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/10 max-w-xs mx-auto">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-300" style={{ width: `${filingProgress}%` }} />
                </div>
                <div className="text-sm font-mono mt-2 text-emerald-400">{filingProgress}%</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
