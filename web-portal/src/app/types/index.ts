export type UserRole =
  | 'super_admin'
  | 'tax_admin'
  | 'accountant'
  | 'auditor'
  | 'support_staff'
  | 'content_manager'
  | 'taxpayer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  region?: string;
  avatar?: string;
  password?: string;
}

export interface Taxpayer {
  id: string;
  userId?: string;
  name: string;
  tin: string;
  businessName?: string;
  email: string;
  phone: string;
  address: string;
  region: string;
  registrationDate: string;
  status: 'active' | 'pending' | 'suspended' | 'inactive' | 'in_review' | 'defaulter';
  taxType: string[];
  qrCode?: string;
  outstandingAmount?: number;
}

export interface Business {
  id: string;
  taxpayerId: string;
  name: string;
  businessType: 'physical' | 'virtual';
  registrationNumber?: string;
  tin?: string;
  status: 'active' | 'pending' | 'suspended' | 'inactive' | 'in_review' | 'defaulter';
  registeredDate: string;
  address: string;
  email?: string;
  phone?: string;
  region?: string;
  taxpayerName?: string;
}

export interface TaxReturn {
  id: string;
  taxpayerId: string;
  period: string;
  taxType: string;
  amount: number;
  status: 'filed' | 'not_filed' | 'overdue' | 'pending_review';
  filingDate?: string;
  dueDate: string;
}

export interface Payment {
  id: string;
  taxpayerId: string;
  assessmentId?: string;
  amount: number;
  taxType: string;
  paymentMethod: 'bank_transfer' | 'mobile_money' | 'card' | 'cash' | 'pos' | 'check';
  status: 'pending' | 'processing' | 'completed' | 'confirmed' | 'failed' | 'cancelled' | 'refunded';
  transactionRef: string;
  receiptNumber?: string;
  paymentDate: string;
  paymentTime?: string;
  reconciledDate?: string;
}

export interface Assessment {
  id: string;
  taxpayerId: string;
  businessName?: string;
  referenceNumber?: string;
  description?: string;
  taxType: string;
  amount: number;
  amountPaid: number;
  period: string;
  status: 'pending' | 'approved' | 'unpaid' | 'paid' | 'overdue' | 'partial' | 'disputed';
  assessedBy: string;
  assessmentDate: string;
  dueDate: string;
}

export interface AuditCase {
  id: string;
  taxpayerId: string;
  caseNumber: string;
  status: 'open' | 'in_progress' | 'closed' | 'flagged';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo: string;
  openedDate: string;
  closedDate?: string;
  findings?: string;
  riskScore: number;
}

export interface SupportTicketResponse {
  id: string;
  message: string;
  date: string;
  isOfficial: boolean;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  taxpayerId?: string;
  category?: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'under_review' | 'resolved' | 'closed' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  createdDate: string;
  resolvedDate?: string;
  attachments?: string[];
  responses?: SupportTicketResponse[];
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  author: string;
  publishDate?: string;
  tags?: string[];
  createdDate: string;
  updatedDate: string;
}

export interface ArticleCategory {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface InspectionReport {
  id: string;
  taxpayerId: string;
  inspectorId: string;
  businessName: string;
  location: string;
  inspectionDate: string;
  inspectionTime?: string;
  purpose: 'collection' | 'inspection' | 'verification' | 'follow_up';
  findings: string;
  violations: string[];
  outcome: 'successful' | 'not_available' | 'refused' | 'rescheduled';
  status: 'completed' | 'pending_review' | 'approved';
  notes?: string;
  photos?: string[];
}

export interface Receipt {
  id: string;
  paymentId: string;
  receiptNumber: string;
  businessName: string;
  amount: number;
  date: string;
  taxPeriod: string;
  taxType: string;
  qrCode: string;
  verified: boolean;
}

export interface InvoiceItem {
  description: string;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  taxpayerId: string;
  taxpayerName?: string;
  amount: number;
  dueDate: string;
  createdDate: string;
  status: 'unpaid' | 'paid' | 'overdue';
  items: InvoiceItem[];
}

export interface Region {
  id: string;
  name: string;
  code: string;
  taxOffice: string;
  taxpayerCount: number;
  revenueTarget: number;
  revenueCollected: number;
}

export interface TaxType {
  id: string;
  name: string;
  code: string;
  rate: number;
  description: string;
  filingFrequency: 'monthly' | 'quarterly' | 'annually';
}

export interface ApiHealth {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  latency: number;
  lastChecked: string;
}

export interface ErrorLog {
  id: string;
  timestamp: string;
  level: 'error' | 'warning' | 'info';
  message: string;
  source: string;
  userId?: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  targetAudience: UserRole | 'all';
  createdAt: string;
  sentCount: number;
}

export interface AuditLogItem {
  id: string;
  user: string;
  action: string;
  resource: string;
  details?: string;
  timestamp: string;
  ip?: string;
  status: 'success' | 'failure';
}

export interface FraudReport {
  id: string;
  description: string;
  reportedAt: string;
  status: 'pending' | 'reviewed' | 'resolved';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  submittedAt: string;
}
