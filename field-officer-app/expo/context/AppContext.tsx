import { useState, useEffect, useMemo } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Taxpayer, Payment, VisitLog, Invoice, OfficerStats } from '@/types';
import { mockTaxpayers, mockPayments, mockVisitLogs, mockInvoices, mockOfficerStats } from '@/mocks/data';

const STORAGE_KEYS = {
  PAYMENTS: 'field_officer_payments',
  VISIT_LOGS: 'field_officer_visit_logs',
  INVOICES: 'field_officer_invoices',
};

export const [AppProvider, useApp] = createContextHook(() => {
  const [taxpayers] = useState<Taxpayer[]>(mockTaxpayers);
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [visitLogs, setVisitLogs] = useState<VisitLog[]>(mockVisitLogs);
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const [storedPayments, storedVisitLogs, storedInvoices] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.PAYMENTS),
        AsyncStorage.getItem(STORAGE_KEYS.VISIT_LOGS),
        AsyncStorage.getItem(STORAGE_KEYS.INVOICES),
      ]);

      if (storedPayments) setPayments(JSON.parse(storedPayments));
      if (storedVisitLogs) setVisitLogs(JSON.parse(storedVisitLogs));
      if (storedInvoices) setInvoices(JSON.parse(storedInvoices));
    } catch (error) {
      console.log('Error loading stored data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const stats: OfficerStats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayPayments = payments.filter(p => p.date === today && p.status === 'confirmed');
    const todayCollections = todayPayments.reduce((sum, p) => sum + p.amount, 0);
    const todayVisits = visitLogs.filter(v => v.date === today);
    const successfulVisits = todayVisits.filter(v => v.outcome === 'successful');
    const pendingPayments = payments.filter(p => p.status === 'pending').length;
    const defaultersCount = taxpayers.filter(t => t.status === 'defaulter').length;

    return {
      todayCollections,
      dailyTarget: mockOfficerStats.dailyTarget,
      totalVisits: todayVisits.length,
      successfulCollections: successfulVisits.length,
      pendingPayments,
      defaultersCount,
    };
  }, [payments, visitLogs, taxpayers]);

  const addPayment = async (payment: Omit<Payment, 'id' | 'receiptNumber'>) => {
    const newPayment: Payment = {
      ...payment,
      id: `p${Date.now()}`,
      receiptNumber: `RCP-${Date.now()}`,
    };
    const updated = [newPayment, ...payments];
    setPayments(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(updated));
    return newPayment;
  };

  const confirmPayment = async (paymentId: string) => {
    const updated = payments.map(p =>
      p.id === paymentId ? { ...p, status: 'confirmed' as const } : p
    );
    setPayments(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(updated));
  };

  const addVisitLog = async (log: Omit<VisitLog, 'id'>) => {
    const newLog: VisitLog = {
      ...log,
      id: `v${Date.now()}`,
    };
    const updated = [newLog, ...visitLogs];
    setVisitLogs(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.VISIT_LOGS, JSON.stringify(updated));
    return newLog;
  };

  const addInvoice = async (invoice: Omit<Invoice, 'id' | 'invoiceNumber'>) => {
    const newInvoice: Invoice = {
      ...invoice,
      id: `inv${Date.now()}`,
      invoiceNumber: `INV-${Date.now()}`,
    };
    const updated = [newInvoice, ...invoices];
    setInvoices(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(updated));
    return newInvoice;
  };

  const getTaxpayerById = (id: string) => taxpayers.find(t => t.id === id);

  const getDefaulters = () => taxpayers.filter(t => t.status === 'defaulter');

  const searchTaxpayers = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return taxpayers.filter(
      t =>
        t.name.toLowerCase().includes(lowerQuery) ||
        t.businessName.toLowerCase().includes(lowerQuery) ||
        t.qrCode.toLowerCase().includes(lowerQuery)
    );
  };

  return {
    taxpayers,
    payments,
    visitLogs,
    invoices,
    stats,
    isLoading,
    addPayment,
    confirmPayment,
    addVisitLog,
    addInvoice,
    getTaxpayerById,
    getDefaulters,
    searchTaxpayers,
  };
});
