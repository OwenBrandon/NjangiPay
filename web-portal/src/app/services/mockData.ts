import type {
  User,
  Taxpayer,
  TaxReturn,
  Payment,
  Assessment,
  AuditCase,
  SupportTicket,
  Article,
  ArticleCategory,
  InspectionReport,
  Receipt,
  Invoice,
  Region,
  TaxType,
  ApiHealth,
  ErrorLog,
  SystemNotification,
} from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Marie-Thérèse Atangana',
    email: 'mt.atangana@dgi.cm',
    role: 'super_admin',
  },
  {
    id: '2',
    name: 'Pierre Nkoulou',
    email: 'p.nkoulou@dgi.cm',
    role: 'tax_admin',
    region: 'South West Region',
  },
  {
    id: '3',
    name: 'Cécile Manga',
    email: 'c.manga@dgi.cm',
    role: 'accountant',
  },
  {
    id: '4',
    name: 'Jean-Baptiste Onana',
    email: 'jb.onana@dgi.cm',
    role: 'auditor',
  },
  {
    id: '5',
    name: 'Hervé Biya',
    email: 'h.biya@dgi.cm',
    role: 'tax_admin',
    region: 'Littoral Region',
  },
  {
    id: '6',
    name: 'Nadège Meka',
    email: 'n.meka@dgi.cm',
    role: 'support_staff',
  },
  {
    id: '7',
    name: 'Blaise Ndjock',
    email: 'b.ndjock@dgi.cm',
    role: 'content_manager',
  },
  {
    id: '8',
    name: 'Jean-Pierre Mbarga',
    email: 'jpmbarga@mbargacommerce.cm',
    role: 'taxpayer',
  },
];

// Mock Regions
export const mockRegions: Region[] = [
  {
    id: '1',
    name: 'Adamawa Region',
    code: 'AD',
    taxOffice: 'Ngaoundéré Tax Office',
    taxpayerCount: 8200,
    revenueTarget: 18000000,
    revenueCollected: 15500000,
  },
  {
    id: '2',
    name: 'Centre Region',
    code: 'CE',
    taxOffice: 'Yaoundé Central Tax Office',
    taxpayerCount: 45000,
    revenueTarget: 150000000,
    revenueCollected: 142000000,
  },
  {
    id: '3',
    name: 'East Region',
    code: 'ES',
    taxOffice: 'Bertoua Tax Office',
    taxpayerCount: 10987,
    revenueTarget: 28000000,
    revenueCollected: 25600000,
  },
  {
    id: '4',
    name: 'Far North Region',
    code: 'FN',
    taxOffice: 'Maroua Tax Office',
    taxpayerCount: 12500,
    revenueTarget: 25000000,
    revenueCollected: 22100000,
  },
  {
    id: '5',
    name: 'Littoral Region',
    code: 'LT',
    taxOffice: 'Douala Central Tax Office',
    taxpayerCount: 52000,
    revenueTarget: 180000000,
    revenueCollected: 175000000,
  },
  {
    id: '6',
    name: 'North Region',
    code: 'NO',
    taxOffice: 'Garoua Tax Office',
    taxpayerCount: 8765,
    revenueTarget: 22000000,
    revenueCollected: 19800000,
  },
  {
    id: '7',
    name: 'North West Region',
    code: 'NW',
    taxOffice: 'Bamenda Tax Office',
    taxpayerCount: 15000,
    revenueTarget: 32000000,
    revenueCollected: 28000000,
  },
  {
    id: '8',
    name: 'South Region',
    code: 'SU',
    taxOffice: 'Ebolowa Tax Office',
    taxpayerCount: 13567,
    revenueTarget: 38000000,
    revenueCollected: 34100000,
  },
  {
    id: '9',
    name: 'South West Region',
    code: 'SW',
    taxOffice: 'Buea Tax Office',
    taxpayerCount: 18000,
    revenueTarget: 45000000,
    revenueCollected: 41000000,
  },
  {
    id: '10',
    name: 'West Region',
    code: 'WE',
    taxOffice: 'Bafoussam Tax Office',
    taxpayerCount: 22000,
    revenueTarget: 55000000,
    revenueCollected: 49000000,
  },
];

// Mock Tax Types
export const mockTaxTypes: TaxType[] = [
  {
    id: '1',
    name: 'Value Added Tax (TVA)',
    code: 'VAT',
    rate: 19.25,
    description: 'Taxe sur la Valeur Ajoutée — standard rate on goods and services',
    filingFrequency: 'monthly',
  },
  {
    id: '2',
    name: 'Corporate Income Tax',
    code: 'CIT',
    rate: 33,
    description: 'Impôt sur les Sociétés — tax on corporate profits',
    filingFrequency: 'annually',
  },
  {
    id: '3',
    name: 'Personal Income Tax',
    code: 'PIT',
    rate: 35,
    description: 'Impôt sur le Revenu des Personnes Physiques',
    filingFrequency: 'annually',
  },
  {
    id: '4',
    name: 'Business License Tax',
    code: 'BLT',
    rate: 0,
    description: 'Patente — annual business license fee',
    filingFrequency: 'annually',
  },
  {
    id: '5',
    name: 'Property Tax',
    code: 'PT',
    rate: 0.5,
    description: 'Impôt Foncier — tax on property ownership',
    filingFrequency: 'annually',
  },
];

// Mock Taxpayers
export const mockTaxpayers: Taxpayer[] = [
  {
    id: '1',
    name: 'Jean-Pierre Mbarga',
    tin: 'CMR-TIN-100234567',
    businessName: 'Ets Mbarga Commerce Général',
    email: 'jpmbarga@mbargacommerce.cm',
    phone: '+237 699 123 456',
    address: '15 Rue du Marché Central, Buea',
    region: 'South West Region',
    registrationDate: '2020-01-15',
    status: 'active',
    taxType: ['VAT', 'CIT'],
  },
  {
    id: '2',
    name: 'Françoise Ngo Biyack',
    tin: 'CMR-TIN-100987654',
    businessName: 'Boutique Chez Françoise',
    email: 'francoise@chefrancoise.cm',
    phone: '+237 677 234 567',
    address: '42 Avenue Commerciale, Bertoua',
    region: 'South West Region',
    registrationDate: '2019-06-20',
    status: 'active',
    taxType: ['VAT', 'PIT'],
  },
  {
    id: '3',
    name: 'Emmanuel Tchoupo',
    tin: 'CMR-TIN-101122334',
    businessName: 'Tchoupo Construction SARL',
    email: 'etchoupo@tchoupoconst.cm',
    phone: '+237 655 345 678',
    address: '8 Quartier Industriel, Buea',
    region: 'South West Region',
    registrationDate: '2021-03-10',
    status: 'active',
    taxType: ['VAT', 'CIT', 'BLT'],
  },
  {
    id: '4',
    name: 'Aïssatou Saidou',
    tin: 'CMR-TIN-105544332',
    businessName: 'Cabinet Saidou Consulting',
    email: 'aissatou@saidouconsult.cm',
    phone: '+237 690 456 789',
    address: '21 Rue de la Paix, Yaoundé',
    region: 'Centre Region',
    registrationDate: '2022-08-05',
    status: 'pending',
    taxType: ['PIT', 'BLT'],
  },
  {
    id: '5',
    name: 'Paul-Henri Fotso',
    tin: 'CMR-TIN-109988776',
    businessName: 'Fotso Industries SA',
    email: 'phfotso@fotsoindustries.cm',
    phone: '+237 670 567 890',
    address: '65 Zone Industrielle, Douala',
    region: 'Littoral Region',
    registrationDate: '2018-11-25',
    status: 'active',
    taxType: ['VAT', 'CIT', 'BLT', 'PT'],
  },
  {
    id: '6',
    name: 'Sandrine Ekotto',
    tin: 'CMR-TIN-106677889',
    businessName: 'Ekotto Tech Solutions',
    email: 'sekotto@ekottotech.cm',
    phone: '+237 681 678 901',
    address: '12 Rue de la Technologie, Buea',
    region: 'South West Region',
    registrationDate: '2023-02-14',
    status: 'suspended',
    taxType: ['VAT', 'CIT'],
  },
];

// Mock Tax Returns
export const mockTaxReturns: TaxReturn[] = [
  {
    id: '1',
    taxpayerId: '1',
    period: '2026-03',
    taxType: 'VAT',
    amount: 45000,
    status: 'filed',
    filingDate: '2026-04-05',
    dueDate: '2026-04-10',
  },
  {
    id: '2',
    taxpayerId: '1',
    period: '2026-02',
    taxType: 'VAT',
    amount: 42000,
    status: 'filed',
    filingDate: '2026-03-08',
    dueDate: '2026-03-10',
  },
  {
    id: '3',
    taxpayerId: '2',
    period: '2026-03',
    taxType: 'VAT',
    amount: 28000,
    status: 'not_filed',
    dueDate: '2026-04-10',
  },
  {
    id: '4',
    taxpayerId: '3',
    period: '2026-03',
    taxType: 'VAT',
    amount: 67000,
    status: 'filed',
    filingDate: '2026-04-04',
    dueDate: '2026-04-10',
  },
  {
    id: '5',
    taxpayerId: '5',
    period: '2026-02',
    taxType: 'VAT',
    amount: 89000,
    status: 'overdue',
    dueDate: '2026-03-10',
  },
  {
    id: '6',
    taxpayerId: '8',
    period: '2025-fy',
    taxType: 'CIT',
    amount: 125000,
    status: 'filed',
    filingDate: '2025-12-15',
    dueDate: '2025-12-31',
  },
  {
    id: '7',
    taxpayerId: '8',
    period: '2025-q4',
    taxType: 'VAT',
    amount: 32400,
    status: 'filed',
    filingDate: '2026-01-10',
    dueDate: '2026-01-15',
  },
  {
    id: '8',
    taxpayerId: '8',
    period: '2026-q1',
    taxType: 'VAT',
    amount: 28000,
    status: 'filed',
    filingDate: '2026-04-05',
    dueDate: '2026-04-15',
  },
];

// Mock Payments
export const mockPayments: Payment[] = [
  {
    id: '1',
    taxpayerId: '1',
    amount: 45000,
    taxType: 'VAT',
    paymentMethod: 'bank_transfer',
    status: 'completed',
    transactionRef: 'TXN20260405001',
    paymentDate: '2026-04-05T10:30:00',
    reconciledDate: '2026-04-06T09:15:00',
  },
  {
    id: '2',
    taxpayerId: '3',
    amount: 67000,
    taxType: 'VAT',
    paymentMethod: 'mobile_money',
    status: 'completed',
    transactionRef: 'TXN20260404001',
    paymentDate: '2026-04-04T14:20:00',
    reconciledDate: '2026-04-05T08:30:00',
  },
  {
    id: '3',
    taxpayerId: '2',
    amount: 28000,
    taxType: 'VAT',
    paymentMethod: 'bank_transfer',
    status: 'pending',
    transactionRef: 'TXN20260408001',
    paymentDate: '2026-04-08T16:45:00',
  },
  {
    id: '4',
    taxpayerId: '4',
    amount: 15000,
    taxType: 'PIT',
    paymentMethod: 'check',
    status: 'failed',
    transactionRef: 'TXN20260407001',
    paymentDate: '2026-04-07T11:00:00',
  },
  {
    id: '5',
    taxpayerId: '5',
    amount: 89000,
    taxType: 'VAT',
    paymentMethod: 'bank_transfer',
    status: 'completed',
    transactionRef: 'TXN20260403001',
    paymentDate: '2026-04-03T09:30:00',
    reconciledDate: '2026-04-04T10:00:00',
  },
];

// Mock Assessments
export const mockAssessments: Assessment[] = [
  {
    id: '1',
    taxpayerId: '2',
    businessName: 'Garcia Retail Store',
    referenceNumber: 'ASS-2026-001234',
    description: 'Value Added Tax (VAT) Assessment',
    taxType: 'VAT',
    amount: 28000,
    amountPaid: 0,
    period: '2026-03',
    status: 'pending',
    assessedBy: 'Michael Chen',
    assessmentDate: '2026-04-08',
    dueDate: '2026-04-20',
  },
  {
    id: '2',
    taxpayerId: '4',
    businessName: 'Taylor Consulting',
    referenceNumber: 'ASS-2026-001235',
    description: 'Personal Income Tax Assessment',
    taxType: 'PIT',
    amount: 18000,
    amountPaid: 0,
    period: '2025',
    status: 'approved',
    assessedBy: 'Michael Chen',
    assessmentDate: '2026-03-15',
    dueDate: '2026-04-30',
  },
  {
    id: '3',
    taxpayerId: '5',
    businessName: 'Wilson Manufacturing',
    referenceNumber: 'ASS-2026-001236',
    description: 'Corporate Income Tax Assessment',
    taxType: 'CIT',
    amount: 125000,
    amountPaid: 0,
    period: '2025',
    status: 'disputed',
    assessedBy: 'Michael Chen',
    assessmentDate: '2026-03-20',
    dueDate: '2026-05-15',
  },
];

// Mock Audit Cases
export const mockAuditCases: AuditCase[] = [
  {
    id: '1',
    taxpayerId: '5',
    caseNumber: 'AUD-2026-001',
    status: 'in_progress',
    priority: 'high',
    assignedTo: 'David Williams',
    openedDate: '2026-03-01',
    riskScore: 78,
  },
  {
    id: '2',
    taxpayerId: '3',
    caseNumber: 'AUD-2026-002',
    status: 'open',
    priority: 'medium',
    assignedTo: 'David Williams',
    openedDate: '2026-03-15',
    riskScore: 65,
  },
  {
    id: '3',
    taxpayerId: '6',
    caseNumber: 'AUD-2026-003',
    status: 'flagged',
    priority: 'critical',
    assignedTo: 'David Williams',
    openedDate: '2026-02-20',
    findings: 'Suspicious transaction patterns detected',
    riskScore: 92,
  },
  {
    id: '4',
    taxpayerId: '1',
    caseNumber: 'AUD-2025-089',
    status: 'closed',
    priority: 'low',
    assignedTo: 'David Williams',
    openedDate: '2025-11-10',
    closedDate: '2026-01-15',
    findings: 'No major issues found',
    riskScore: 32,
  },
];

// Mock Support Tickets
export const mockSupportTickets: SupportTicket[] = [
  {
    id: '1',
    ticketNumber: 'TKT-2026-0401',
    taxpayerId: '1',
    subject: 'Unable to submit VAT return',
    description: 'Getting error when trying to submit VAT return for March 2026',
    status: 'in_progress',
    priority: 'high',
    assignedTo: 'Lisa Brown',
    createdDate: '2026-04-08T09:30:00',
  },
  {
    id: '2',
    ticketNumber: 'TKT-2026-0402',
    taxpayerId: '2',
    subject: 'Payment not reflected',
    description: 'Made payment yesterday but still showing as pending',
    status: 'open',
    priority: 'medium',
    createdDate: '2026-04-08T14:20:00',
  },
  {
    id: '3',
    ticketNumber: 'TKT-2026-0403',
    taxpayerId: '4',
    subject: 'TIN registration issue',
    description: 'Need to update business address on TIN certificate',
    status: 'resolved',
    priority: 'low',
    assignedTo: 'Lisa Brown',
    createdDate: '2026-04-05T11:00:00',
    resolvedDate: '2026-04-07T16:45:00',
  },
  {
    id: '4',
    ticketNumber: 'TKT-2026-0404',
    subject: 'Password reset request',
    description: 'Cannot access taxpayer portal, forgot password',
    status: 'resolved',
    priority: 'urgent',
    assignedTo: 'Lisa Brown',
    createdDate: '2026-04-09T08:00:00',
    resolvedDate: '2026-04-09T08:30:00',
  },
];

// Mock Articles
export const mockArticles: Article[] = [
  {
    id: '1',
    title: 'New VAT Filing Procedures for 2026',
    slug: 'new-vat-filing-procedures-2026',
    content: 'Starting April 2026, all VAT taxpayers must use the new online filing system...',
    category: 'Announcements',
    status: 'published',
    author: 'Robert Taylor',
    publishDate: '2026-03-01',
    createdDate: '2026-02-25',
    updatedDate: '2026-02-28',
  },
  {
    id: '2',
    title: 'Understanding Corporate Income Tax Deductions',
    slug: 'understanding-cit-deductions',
    content: 'This guide explains the allowable deductions for corporate income tax...',
    category: 'Tax Guides',
    status: 'published',
    author: 'Robert Taylor',
    publishDate: '2026-02-15',
    createdDate: '2026-02-10',
    updatedDate: '2026-02-14',
  },
  {
    id: '3',
    title: 'Important Deadline Changes for Q2 2026',
    slug: 'deadline-changes-q2-2026',
    content: 'Due to the public holiday, filing deadlines have been adjusted...',
    category: 'Announcements',
    status: 'draft',
    author: 'Robert Taylor',
    createdDate: '2026-04-08',
    updatedDate: '2026-04-09',
  },
];

// Mock Article Categories
export const mockCategories: ArticleCategory[] = [
  { id: '1', name: 'Announcements', description: 'Public announcements and deadline alerts', color: 'bg-orange-500' },
  { id: '2', name: 'Tax Guides', description: 'Step-by-step instructions for taxpayers', color: 'bg-blue-500' },
  { id: '3', name: 'Tax Laws', description: 'Legal documents and official regulations', color: 'bg-emerald-500' },
  { id: '4', name: 'Forms & Documents', description: 'Downloadable forms and templates', color: 'bg-purple-500' },
  { id: '5', name: 'FAQs', description: 'Frequently asked questions and answers', color: 'bg-pink-500' },
  { id: '6', name: 'News', description: 'Latest updates from the revenue authority', color: 'bg-cyan-500' },
];

// Mock Inspection Reports
export const mockInspectionReports: InspectionReport[] = [
  {
    id: '1',
    taxpayerId: '2',
    inspectorId: '5',
    businessName: 'Garcia Retail Store',
    location: '456 Commerce Ave, Western City',
    inspectionDate: '2026-04-07',
    inspectionTime: '09:15 AM',
    purpose: 'inspection',
    findings: 'Business operating normally, all licenses displayed',
    violations: [],
    outcome: 'successful',
    status: 'completed',
    notes: 'All documentation in order. Business cooperative.',
  },
  {
    id: '2',
    taxpayerId: '6',
    inspectorId: '5',
    businessName: 'Lee Tech Solutions',
    location: '987 Tech Plaza, Central City',
    inspectionDate: '2026-04-06',
    inspectionTime: '10:30 AM',
    purpose: 'verification',
    findings: 'Business premises found closed during business hours',
    violations: ['Unregistered employees', 'Missing tax certificate display'],
    outcome: 'not_available',
    status: 'pending_review',
    notes: 'Premises closed. Follow-up visit scheduled.',
  },
];

// Mock Receipts
export const mockReceipts: Receipt[] = [
  {
    id: 'r1',
    paymentId: '1',
    receiptNumber: 'RCP-2026-001',
    businessName: 'ABC Trading Ltd',
    amount: 45000,
    date: '2026-04-05',
    taxPeriod: '2026-03',
    taxType: 'VAT',
    qrCode: 'QR-VERIFY-001',
    verified: true,
  },
  {
    id: 'r2',
    paymentId: '5',
    receiptNumber: 'RCP-2026-002',
    businessName: 'Wilson Manufacturing',
    amount: 89000,
    date: '2026-04-03',
    taxPeriod: '2026-03',
    taxType: 'VAT',
    qrCode: 'QR-VERIFY-002',
    verified: true,
  },
];

// Mock Invoices
export const mockInvoices: Invoice[] = [
  {
    id: 'inv1',
    invoiceNumber: 'INV-2026-0001',
    taxpayerId: '2',
    taxpayerName: 'Maria Garcia',
    amount: 28000,
    dueDate: '2026-04-20',
    createdDate: '2026-04-08',
    status: 'unpaid',
    items: [
      { description: 'VAT Assessment Q1 2026', amount: 25000 },
      { description: 'Late Filing Penalty', amount: 3000 },
    ],
  },
];

// Mock API Health
export const mockApiHealth: ApiHealth[] = [
  { service: 'Authentication Service', status: 'healthy', latency: 45, lastChecked: '2026-05-06T06:00:00' },
  { service: 'Tax Assessment Engine', status: 'healthy', latency: 120, lastChecked: '2026-05-06T06:00:00' },
  { service: 'Payment Gateway Integration', status: 'degraded', latency: 850, lastChecked: '2026-05-06T06:00:00' },
  { service: 'Database Cluster', status: 'healthy', latency: 12, lastChecked: '2026-05-06T06:00:00' },
  { service: 'Reporting API', status: 'healthy', latency: 210, lastChecked: '2026-05-06T06:00:00' },
  { service: 'Notification Service', status: 'down', latency: 0, lastChecked: '2026-05-06T06:00:00' },
];

// Mock Error Logs
export const mockErrorLogs: ErrorLog[] = [
  { id: '1', timestamp: '2026-05-06T05:45:12', level: 'error', message: 'Failed to process payment for TXN99882', source: 'PaymentGateway', userId: '8' },
  { id: '2', timestamp: '2026-05-06T05:30:00', level: 'warning', message: 'High CPU usage detected on Node 3', source: 'Infrastructure' },
  { id: '3', timestamp: '2026-05-06T05:15:22', level: 'error', message: 'Database connection timeout', source: 'DBConnector' },
  { id: '4', timestamp: '2026-05-06T04:50:11', level: 'info', message: 'System maintenance completed', source: 'SystemScheduler' },
];

// Mock Notifications
export const mockNotifications: SystemNotification[] = [
  { id: '1', title: 'System Maintenance', message: 'Scheduled maintenance on Sunday at 2 AM', type: 'warning', targetAudience: 'all', createdAt: '2026-05-05T10:00:00', sentCount: 1540 },
  { id: '2', title: 'New Tax Regulations', message: 'Please review the updated VAT guidelines for 2026', type: 'info', targetAudience: 'taxpayer', createdAt: '2026-05-04T09:00:00', sentCount: 12500 },
];

// Helper functions
export function getTaxpayerById(id: string): Taxpayer | undefined {
  return mockTaxpayers.find((t) => t.id === id);
}

export function getTaxReturnsByTaxpayerId(taxpayerId: string): TaxReturn[] {
  return mockTaxReturns.filter((tr) => tr.taxpayerId === taxpayerId);
}

export function getPaymentsByTaxpayerId(taxpayerId: string): Payment[] {
  return mockPayments.filter((p) => p.taxpayerId === taxpayerId);
}

export function getAssessmentsByTaxpayerId(taxpayerId: string): Assessment[] {
  return mockAssessments.filter((a) => a.taxpayerId === taxpayerId);
}

export function getAuditCasesByTaxpayerId(taxpayerId: string): AuditCase[] {
  return mockAuditCases.filter((ac) => ac.taxpayerId === taxpayerId);
}

export function getSupportTicketsByTaxpayerId(taxpayerId: string): SupportTicket[] {
  return mockSupportTickets.filter((st) => st.taxpayerId === taxpayerId);
}

export function getInspectionReportsByTaxpayerId(taxpayerId: string): InspectionReport[] {
  return mockInspectionReports.filter((ir) => ir.taxpayerId === taxpayerId);
}
