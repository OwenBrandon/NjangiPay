export interface Taxpayer {
  id: string;
  name: string;
  businessName: string;
  phone: string;
  address: string;
  zone: string;
  taxType: string;
  outstandingAmount: number;
  lastPaymentDate: string | null;
  status: 'active' | 'defaulter' | 'suspended';
  qrCode: string;
}

export interface Payment {
  id: string;
  taxpayerId: string;
  taxpayerName: string;
  amount: number;
  date: string;
  time: string;
  method: 'cash' | 'transfer' | 'pos';
  status: 'pending' | 'confirmed' | 'cancelled';
  receiptNumber: string;
  invoiceNumber?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  taxpayerId: string;
  taxpayerName: string;
  amount: number;
  dueDate: string;
  createdDate: string;
  status: 'unpaid' | 'paid' | 'overdue';
  items: InvoiceItem[];
}

export interface InvoiceItem {
  description: string;
  amount: number;
}

export interface VisitLog {
  id: string;
  taxpayerId: string;
  taxpayerName: string;
  address: string;
  date: string;
  time: string;
  purpose: 'collection' | 'inspection' | 'verification' | 'follow-up';
  notes: string;
  outcome: 'successful' | 'not-available' | 'refused' | 'rescheduled';
  photoUri?: string;
}

export interface OfficerStats {
  todayCollections: number;
  dailyTarget: number;
  totalVisits: number;
  successfulCollections: number;
  pendingPayments: number;
  defaultersCount: number;
}
