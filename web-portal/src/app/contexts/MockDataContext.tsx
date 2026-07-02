import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  User, Taxpayer, Region, TaxType, Business,
  AuditLogItem, Assessment, TaxReturn, SupportTicket,
  FraudReport, ContactMessage, Payment, Article, ArticleCategory
} from '../types';
import { supabase } from '../lib/supabase';

// Helpers: convert snake_case DB rows ↔ camelCase TS models
function snakeToCamel(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    result[camelKey] = value;
  }
  return result;
}

function camelToSnake(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) continue;
    const snakeKey = key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
    result[snakeKey] = value;
  }
  return result;
}

interface MockDataContextType {
  users: User[];
  taxpayers: Taxpayer[];
  businesses: Business[];
  regions: Region[];
  taxTypes: TaxType[];
  auditLogs: AuditLogItem[];
  assessments: Assessment[];
  taxReturns: TaxReturn[];
  tickets: SupportTicket[];
  fraudReports: FraudReport[];
  contactMessages: ContactMessage[];
  payments: Payment[];
  articles: Article[];
  categories: ArticleCategory[];

  addUser: (user: User) => void;
  addPayment: (payment: Payment) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;
  addTaxpayer: (taxpayer: Taxpayer) => void;
  updateTaxpayer: (taxpayer: Taxpayer) => void;
  deleteTaxpayer: (id: string) => void;
  updateBusiness: (business: Business) => void;

  addAssessment: (assessment: Assessment) => Promise<void>;
  updateAssessment: (assessment: Assessment) => void;

  addTaxReturn: (taxReturn: TaxReturn) => void;
  updateTaxReturn: (taxReturn: TaxReturn) => void;

  addRegion: (region: Region) => void;
  updateRegion: (region: Region) => void;
  addTaxType: (taxType: TaxType) => void;
  updateTaxType: (taxType: TaxType) => void;
  addAuditLog: (log: Omit<AuditLogItem, 'id' | 'timestamp'>) => void;

  addTicket: (ticket: SupportTicket) => void;
  updateTicket: (ticket: SupportTicket) => void;
  addFraudReport: (report: FraudReport) => void;
  addContactMessage: (msg: ContactMessage) => void;

  addArticle: (article: Article) => void;
  updateArticle: (article: Article) => void;
  deleteArticle: (id: string) => void;
  addCategory: (category: ArticleCategory) => void;
  updateCategory: (category: ArticleCategory) => void;
  deleteCategory: (id: string) => void;

  addTicketResponse: (ticketId: string, message: string, isOfficial: boolean) => void;
  refreshData: () => Promise<void>;
}

const MockDataContext = createContext<MockDataContextType | null>(null);

// Generic fetch helper
async function fetchTable<T>(table: string, transform?: (row: any) => T): Promise<T[]> {
  const { data, error } = await supabase.from(table).select('*');
  if (error || !data) return [];
  return data.map((row) => (transform ? transform(row) : snakeToCamel(row) as T));
}

// Generic upsert helper
async function upsertRow(table: string, data: Record<string, any>, id?: string) {
  const snakeData = camelToSnake(data);
  if (id) {
    return supabase.from(table).update(snakeData).eq('id', id);
  }
  return supabase.from(table).insert(snakeData);
}

export const MockDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [taxpayers, setTaxpayers] = useState<Taxpayer[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [taxTypes, setTaxTypes] = useState<TaxType[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [taxReturns, setTaxReturns] = useState<TaxReturn[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [fraudReports, setFraudReports] = useState<FraudReport[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<ArticleCategory[]>([]);

  const REFRESH_INTERVAL_MS = 30_000; // 30 seconds

  const refreshData = useCallback(async () => {
    const [
      usersData, taxpayersData, regionsData, taxTypesData,
      logsData, assessmentsData, returnsData, ticketsData,
      fraudData, contactData, paymentsData, businessesData, articlesData, categoriesData
    ] = await Promise.all([
      fetchTable<User>('users', (r) => ({
        id: r.id, name: r.name, email: r.email, role: r.role,
        region: r.region || undefined, avatar: r.avatar_url || undefined,
      })),
      fetchTable<Taxpayer>('taxpayers', (r) => ({
        id: r.id, userId: r.user_id || undefined, name: r.name, tin: r.tin, businessName: r.business_name || undefined,
        email: r.email, phone: r.phone, address: r.address, region: r.region,
        registrationDate: r.registration_date, status: r.status,
        taxType: [], qrCode: r.qr_code || undefined, outstandingAmount: Number(r.outstanding_amount) || 0,
      })),
      fetchTable<Region>('regions', (r) => ({
        id: r.id, name: r.name, code: r.code, taxOffice: r.tax_office,
        taxpayerCount: r.taxpayer_count, revenueTarget: Number(r.revenue_target),
        revenueCollected: Number(r.revenue_collected),
      })),
      fetchTable<TaxType>('tax_types', (r) => ({
        id: r.id, name: r.name, code: r.code, rate: Number(r.rate),
        description: r.description, filingFrequency: r.filing_frequency,
      })),
      fetchTable<AuditLogItem>('audit_logs', (r) => ({
        id: r.id, user: r.user_name, action: r.action, resource: r.resource,
        details: r.details || undefined, timestamp: r.created_at,
        ip: r.ip_address || undefined, status: r.status,
      })),
      fetchTable<Assessment>('assessments', (r) => ({
        id: r.id, taxpayerId: r.taxpayer_id, businessName: r.business_name || undefined,
        referenceNumber: r.reference_number || undefined, description: r.description || undefined,
        taxType: r.tax_type, amount: Number(r.amount), amountPaid: Number(r.amount_paid),
        period: r.period, status: r.status, assessedBy: r.assessed_by || 'SYSTEM',
        assessmentDate: r.assessment_date, dueDate: r.due_date,
      })),
      fetchTable<TaxReturn>('tax_returns', (r) => ({
        id: r.id, taxpayerId: r.taxpayer_id, period: r.period, taxType: r.tax_type,
        amount: Number(r.amount), status: r.status, filingDate: r.filing_date || undefined,
        dueDate: r.due_date,
      })),
      fetchTable<SupportTicket>('support_tickets', (r) => ({
        id: r.id, ticketNumber: r.ticket_number, taxpayerId: r.taxpayer_id || undefined,
        category: r.category || undefined, subject: r.subject, description: r.description,
        status: r.status, priority: r.priority, assignedTo: r.assigned_to || undefined,
        createdDate: r.created_date, resolvedDate: r.resolved_date || undefined,
        attachments: r.attachments || [], responses: [],
      })),
      fetchTable<FraudReport>('fraud_reports', (r) => ({
        id: r.id, description: r.description, reportedAt: r.reported_at, status: r.status,
      })),
      fetchTable<ContactMessage>('contact_messages', (r) => ({
        id: r.id, name: r.name, email: r.email, message: r.message, submittedAt: r.submitted_at,
      })),
      fetchTable<Payment>('payments', (r) => ({
        id: r.id, taxpayerId: r.taxpayer_id, assessmentId: r.assessment_id || undefined,
        amount: Number(r.amount), taxType: r.tax_type, paymentMethod: r.payment_method,
        status: r.status, transactionRef: r.transaction_ref || '', receiptNumber: r.receipt_number || undefined,
        paymentDate: r.payment_date, paymentTime: r.payment_time || undefined,
        reconciledDate: r.reconciled_date || undefined,
      })),
      fetchTable<Business>('businesses', (r) => ({
        id: r.id, taxpayerId: r.taxpayer_id, name: r.name,
        businessType: r.business_type, registrationNumber: r.registration_number || undefined,
        tin: r.tin || undefined, status: r.status, registeredDate: r.registered_date,
        address: r.address, email: r.email || undefined, phone: r.phone || undefined,
        region: r.region || undefined,
      })),
      fetchTable<Article>('articles', (r) => ({
        id: r.id, title: r.title, slug: r.slug, content: r.content,
        category: r.category, status: r.status, author: r.author,
        publishDate: r.publish_date || undefined, tags: r.tags || [],
        createdDate: r.created_date, updatedDate: r.updated_date,
      })),
      fetchTable<ArticleCategory>('article_categories', (r) => ({
        id: r.id, name: r.name, description: r.description || '', color: r.color || 'bg-blue-500',
      })),
    ]);

    setUsers(usersData);
    setTaxpayers(taxpayersData);
    setRegions(regionsData);
    setTaxTypes(taxTypesData);
    setAuditLogs(logsData);
    setAssessments(assessmentsData);
    setTaxReturns(returnsData);
    setTickets(ticketsData);
    setFraudReports(fraudData);
    setContactMessages(contactData);
    setPayments(paymentsData);
    setBusinesses(businessesData);
    setArticles(articlesData);
    setCategories(categoriesData);
  }, []);

  // Load on mount + auto-refresh every 30s
  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [refreshData]);

  // ── Mutators: write to Supabase then update local state ──

  const addAuditLog = useCallback((log: Omit<AuditLogItem, 'id' | 'timestamp'>) => {
    const newLog: AuditLogItem = {
      ...log, id: crypto.randomUUID(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    supabase.from('audit_logs').insert({
      user_name: log.user, action: log.action, resource: log.resource,
      details: log.details || null, ip_address: log.ip || null, status: log.status,
    }).then();
    setAuditLogs((prev) => [newLog, ...prev]);
  }, []);

  const addUser = useCallback((user: User) => {
    supabase.from('users').insert({
      id: user.id, name: user.name, email: user.email, role: user.role, region: user.region || null,
    }).then();
    setUsers((prev) => [user, ...prev]);
    addAuditLog({ user: 'System', action: 'User Created', resource: `User: ${user.email}`, ip: '127.0.0.1', status: 'success' });
  }, [addAuditLog]);

  const updateUser = useCallback((updatedUser: User) => {
    supabase.from('users').update({
      name: updatedUser.name, email: updatedUser.email, role: updatedUser.role, region: updatedUser.region || null,
    }).eq('id', updatedUser.id).then();
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    addAuditLog({ user: 'System', action: 'User Updated', resource: `User: ${updatedUser.email}`, ip: '127.0.0.1', status: 'success' });
  }, [addAuditLog]);

  const deleteUser = useCallback((id: string) => {
    const user = users.find((u) => u.id === id);
    if (user && user.role === 'super_admin') {
      const count = users.filter((u) => u.role === 'super_admin').length;
      if (count <= 1) throw new Error('Cannot delete the last Super Admin.');
    }
    supabase.from('users').delete().eq('id', id).then();
    setUsers((prev) => prev.filter((u) => u.id !== id));
    if (user) {
      addAuditLog({ user: 'System', action: 'User Deleted', resource: `User: ${user.email}`, ip: '127.0.0.1', status: 'success' });
    }
  }, [users, addAuditLog]);

  const addTaxpayer = useCallback((taxpayer: Taxpayer) => {
    supabase.from('taxpayers').insert({
      id: taxpayer.id, name: taxpayer.name, tin: taxpayer.tin,
      business_name: taxpayer.businessName || null, email: taxpayer.email,
      phone: taxpayer.phone, address: taxpayer.address, region: taxpayer.region,
      registration_date: taxpayer.registrationDate, status: taxpayer.status,
      qr_code: taxpayer.qrCode || null,
    }).then();
    setTaxpayers((prev) => [taxpayer, ...prev]);
  }, []);

  const updateTaxpayer = useCallback(async (taxpayer: Taxpayer) => {
    setTaxpayers((prev) => prev.map((t) => (t.id === taxpayer.id ? taxpayer : t)));
    const { error } = await supabase.from('taxpayers').update({
      name: taxpayer.name, tin: taxpayer.tin, business_name: taxpayer.businessName || null,
      email: taxpayer.email, phone: taxpayer.phone, address: taxpayer.address,
      region: taxpayer.region, status: taxpayer.status,
    }).eq('id', taxpayer.id);
    if (error) {
      console.error('updateTaxpayer failed:', error.message, '- trying without RLS');
      // Fallback: try updating by tin (in case id format mismatch)
      const { error: err2 } = await supabase.from('taxpayers').update({
        status: taxpayer.status,
      }).eq('tin', taxpayer.tin);
      if (err2) console.error('updateTaxpayer fallback also failed:', err2.message);
    }
  }, []);

  const deleteTaxpayer = useCallback((id: string) => {
    supabase.from('taxpayers').delete().eq('id', id).then();
    setTaxpayers((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updateBusiness = useCallback(async (business: Business) => {
    setBusinesses((prev) => prev.map((b) => (b.id === business.id ? business : b)));
    const { error } = await supabase.from('businesses').update({
      status: business.status,
    }).eq('id', business.id);
    if (error) console.error('updateBusiness failed:', error.message);
    addAuditLog({ user: 'Tax Admin', action: `Business ${business.status === 'active' ? 'Approved' : business.status === 'suspended' ? 'Rejected' : 'Updated'}`, resource: `Business: ${business.name}`, ip: '127.0.0.1', status: 'success' });
  }, [addAuditLog]);

  const addAssessment = useCallback(async (assessment: Assessment) => {
    const insertData = {
      taxpayer_id: assessment.taxpayerId,
      business_name: assessment.businessName || null,
      reference_number: assessment.referenceNumber || `ASS-${Date.now()}`,
      description: assessment.description || null, tax_type: assessment.taxType,
      amount: assessment.amount, amount_paid: assessment.amountPaid || 0, period: assessment.period,
      status: assessment.status, assessed_by: (assessment.assessedBy && assessment.assessedBy !== 'SYSTEM' && assessment.assessedBy !== 'SYSTEM_ADMIN') ? assessment.assessedBy : null,
      assessment_date: assessment.assessmentDate, due_date: assessment.dueDate,
    };
    const { data, error } = await supabase.from('assessments').insert(insertData).select().single();
    if (error) {
      console.error('addAssessment DB error:', error.code, error.message);
      setAssessments((prev) => [assessment, ...prev]);
    } else if (data) {
      const saved: Assessment = {
        id: data.id, taxpayerId: data.taxpayer_id,
        businessName: data.business_name || undefined,
        referenceNumber: data.reference_number || undefined,
        description: data.description || undefined, taxType: data.tax_type,
        amount: Number(data.amount), amountPaid: Number(data.amount_paid),
        period: data.period, status: data.status, assessedBy: data.assessed_by || 'SYSTEM',
        assessmentDate: data.assessment_date, dueDate: data.due_date,
      };
      setAssessments((prev) => [saved, ...prev]);
    }
  }, []);

  const updateAssessment = useCallback((assessment: Assessment) => {
    supabase.from('assessments').update({
      tax_type: assessment.taxType, amount: assessment.amount,
      amount_paid: assessment.amountPaid, period: assessment.period,
      status: assessment.status, due_date: assessment.dueDate,
    }).eq('id', assessment.id).then();
    setAssessments((prev) => prev.map((a) => (a.id === assessment.id ? assessment : a)));
  }, []);

  const addTaxReturn = useCallback(async (taxReturn: TaxReturn) => {
    const { data, error } = await supabase.from('tax_returns').insert({
      taxpayer_id: taxReturn.taxpayerId, period: taxReturn.period,
      tax_type: taxReturn.taxType, amount: taxReturn.amount, status: taxReturn.status,
      filing_date: taxReturn.filingDate || null, due_date: taxReturn.dueDate,
    }).select().single();
    if (error) {
      console.error('addTaxReturn failed:', error.message);
      setTaxReturns((prev) => [taxReturn, ...prev]);
    } else if (data) {
      setTaxReturns((prev) => [{ ...taxReturn, id: data.id }, ...prev]);
    }
  }, []);

  const updateTaxReturn = useCallback((taxReturn: TaxReturn) => {
    supabase.from('tax_returns').update({
      status: taxReturn.status, filing_date: taxReturn.filingDate || null,
    }).eq('id', taxReturn.id).then();
    setTaxReturns((prev) => prev.map((tr) => (tr.id === taxReturn.id ? taxReturn : tr)));
  }, []);

  const addPayment = useCallback(async (payment: Payment) => {
    const { data, error } = await supabase.from('payments').insert({
      taxpayer_id: payment.taxpayerId,
      assessment_id: payment.assessmentId || null, amount: payment.amount,
      tax_type: payment.taxType, payment_method: payment.paymentMethod,
      status: payment.status, transaction_ref: payment.transactionRef,
      receipt_number: payment.receiptNumber || null, payment_date: payment.paymentDate,
    }).select().single();
    if (error) {
      console.error('addPayment failed:', error.message);
      setPayments((prev) => [payment, ...prev]);
    } else if (data) {
      setPayments((prev) => [{ ...payment, id: data.id }, ...prev]);
    }
    addAuditLog({ user: 'Taxpayer', action: 'Payment Completed', resource: `Txn: ${payment.id}`, ip: '127.0.0.1', status: 'success' });
  }, [addAuditLog]);

  const addRegion = useCallback((region: Region) => {
    supabase.from('regions').insert({
      id: region.id, name: region.name, code: region.code, tax_office: region.taxOffice,
      taxpayer_count: region.taxpayerCount, revenue_target: region.revenueTarget,
      revenue_collected: region.revenueCollected,
    }).then();
    setRegions((prev) => [...prev, region]);
  }, []);

  const updateRegion = useCallback((region: Region) => {
    supabase.from('regions').update({
      name: region.name, code: region.code, tax_office: region.taxOffice,
      taxpayer_count: region.taxpayerCount, revenue_target: region.revenueTarget,
      revenue_collected: region.revenueCollected,
    }).eq('id', region.id).then();
    setRegions((prev) => prev.map((r) => (r.id === region.id ? region : r)));
  }, []);

  const addTaxType = useCallback((taxType: TaxType) => {
    supabase.from('tax_types').insert({
      id: taxType.id, name: taxType.name, code: taxType.code, rate: taxType.rate,
      description: taxType.description, filing_frequency: taxType.filingFrequency,
    }).then();
    setTaxTypes((prev) => [...prev, taxType]);
  }, []);

  const updateTaxType = useCallback((taxType: TaxType) => {
    supabase.from('tax_types').update({
      name: taxType.name, code: taxType.code, rate: taxType.rate,
      description: taxType.description, filing_frequency: taxType.filingFrequency,
    }).eq('id', taxType.id).then();
    setTaxTypes((prev) => prev.map((t) => (t.id === taxType.id ? taxType : t)));
  }, []);

  const addTicket = useCallback(async (ticket: SupportTicket) => {
    const { data, error } = await supabase.from('support_tickets').insert({
      ticket_number: ticket.ticketNumber, taxpayer_id: ticket.taxpayerId || null,
      category: ticket.category || null, subject: ticket.subject, description: ticket.description,
      status: ticket.status, priority: ticket.priority, assigned_to: ticket.assignedTo || null,
      created_date: ticket.createdDate, attachments: ticket.attachments || [],
    }).select().single();
    if (error) {
      console.error('addTicket failed:', error.message);
      setTickets((prev) => [ticket, ...prev]);
    } else if (data) {
      setTickets((prev) => [{ ...ticket, id: data.id }, ...prev]);
    }
    addAuditLog({ user: 'Taxpayer', action: 'Support Ticket Logged', resource: `Ticket: ${ticket.ticketNumber}`, ip: '127.0.0.1', status: 'success' });
  }, [addAuditLog]);

  const updateTicket = useCallback((updatedTicket: SupportTicket) => {
    supabase.from('support_tickets').update({
      status: updatedTicket.status, priority: updatedTicket.priority,
      assigned_to: updatedTicket.assignedTo || null, resolved_date: updatedTicket.resolvedDate || null,
    }).eq('id', updatedTicket.id).then();
    setTickets((prev) => prev.map((t) => (t.id === updatedTicket.id ? updatedTicket : t)));
  }, []);

  const addFraudReport = useCallback((report: FraudReport) => {
    supabase.from('fraud_reports').insert({
      id: report.id, description: report.description, status: report.status,
    }).then();
    setFraudReports((prev) => [report, ...prev]);
  }, []);

  const addContactMessage = useCallback((msg: ContactMessage) => {
    supabase.from('contact_messages').insert({
      id: msg.id, name: msg.name, email: msg.email, message: msg.message,
    }).then();
    setContactMessages((prev) => [msg, ...prev]);
  }, []);

  const addArticle = useCallback((article: Article) => {
    supabase.from('articles').insert({
      id: article.id, title: article.title, slug: article.slug, content: article.content,
      category: article.category, status: article.status, author: article.author,
      publish_date: article.publishDate || null, tags: article.tags || [],
      created_date: article.createdDate, updated_date: article.updatedDate,
    }).then();
    setArticles((prev) => [article, ...prev]);
    addAuditLog({ user: 'Content Manager', action: article.status === 'published' ? 'Article Published' : 'Article Created', resource: `Article: ${article.title}`, ip: '127.0.0.1', status: 'success' });
  }, [addAuditLog]);

  const updateArticle = useCallback((article: Article) => {
    supabase.from('articles').update({
      title: article.title, slug: article.slug, content: article.content,
      category: article.category, status: article.status, author: article.author,
      publish_date: article.publishDate || null, tags: article.tags || [],
      updated_date: article.updatedDate,
    }).eq('id', article.id).then();
    setArticles((prev) => prev.map((a) => (a.id === article.id ? article : a)));
  }, []);

  const deleteArticle = useCallback((id: string) => {
    supabase.from('articles').delete().eq('id', id).then();
    setArticles((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const addCategory = useCallback((category: ArticleCategory) => {
    supabase.from('article_categories').insert({
      id: category.id, name: category.name, description: category.description, color: category.color,
    }).then();
    setCategories((prev) => [...prev, category]);
  }, []);

  const updateCategory = useCallback((category: ArticleCategory) => {
    supabase.from('article_categories').update({
      name: category.name, description: category.description, color: category.color,
    }).eq('id', category.id).then();
    setCategories((prev) => prev.map((c) => (c.id === category.id ? category : c)));
  }, []);

  const addTicketResponse = useCallback(async (ticketId: string, message: string, isOfficial: boolean) => {
    const responseId = crypto.randomUUID();
    await supabase.from('support_ticket_responses').insert({
      id: responseId,
      ticket_id: ticketId,
      message,
      is_official: isOfficial,
      date: new Date().toISOString(),
    });
    // Update ticket status to in_progress if it was open
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket && ticket.status === 'open') {
      await supabase.from('support_tickets').update({ status: 'in_progress' }).eq('id', ticketId);
      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'in_progress' as const } : t));
    }
  }, [tickets]);

  const deleteCategory = useCallback((id: string) => {
    supabase.from('article_categories').delete().eq('id', id).then();
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return (
    <MockDataContext.Provider value={{
      users, taxpayers, businesses, regions, taxTypes, auditLogs, assessments, taxReturns,
      tickets, fraudReports, contactMessages, payments, articles, categories,
      addUser, updateUser, deleteUser, addTaxpayer, updateTaxpayer, deleteTaxpayer, updateBusiness,
      addRegion, updateRegion, addTaxType, updateTaxType,
      addAssessment, updateAssessment, addTaxReturn, updateTaxReturn,
      addAuditLog, addTicket, updateTicket, addFraudReport, addContactMessage,
      addPayment, addArticle, updateArticle, deleteArticle,
      addCategory, updateCategory, deleteCategory,
      addTicketResponse,
      refreshData,
    }}>
      {children}
    </MockDataContext.Provider>
  );
};

export const useMockData = () => {
  const context = useContext(MockDataContext);
  if (!context) {
    throw new Error('useMockData must be used within a MockDataProvider');
  }
  return context;
};
