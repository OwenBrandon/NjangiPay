import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/models.dart';
import 'mock_data.dart';

class AppState extends ChangeNotifier {
  static const _keyPayments = 'field_officer_payments';
  static const _keyVisitLogs = 'field_officer_visit_logs';
  static const _keyInvoices = 'field_officer_invoices';

  final List<Taxpayer> _taxpayers = List.from(mockTaxpayers);
  List<Payment> _payments = List.from(mockPayments);
  List<VisitLog> _visitLogs = List.from(mockVisitLogs);
  List<Invoice> _invoices = List.from(mockInvoices);
  int _currentTab = 0;
  bool _isLoading = true;

  List<Taxpayer> get taxpayers => _taxpayers;
  List<Payment> get payments => _payments;
  List<VisitLog> get visitLogs => _visitLogs;
  List<Invoice> get invoices => _invoices;
  int get currentTab => _currentTab;
  bool get isLoading => _isLoading;

  void setTab(int index) {
    _currentTab = index;
    notifyListeners();
  }

  AppState() {
    _loadStoredData();
  }

  Future<void> _loadStoredData() async {
    try {
      final prefs = await SharedPreferences.getInstance();

      final storedPayments = prefs.getString(_keyPayments);
      if (storedPayments != null) {
        final List<dynamic> decoded = jsonDecode(storedPayments);
        _payments = decoded.map((item) => Payment.fromJson(item)).toList();
      }

      final storedVisitLogs = prefs.getString(_keyVisitLogs);
      if (storedVisitLogs != null) {
        final List<dynamic> decoded = jsonDecode(storedVisitLogs);
        _visitLogs = decoded.map((item) => VisitLog.fromJson(item)).toList();
      }

      final storedInvoices = prefs.getString(_keyInvoices);
      if (storedInvoices != null) {
        final List<dynamic> decoded = jsonDecode(storedInvoices);
        _invoices = decoded.map((item) => Invoice.fromJson(item)).toList();
      }
    } catch (e) {
      debugPrint('Error loading stored data: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  OfficerStats get stats {
    final today = DateTime.now().toIso8601String().split('T')[0];
    final todayPayments = _payments.where((p) => p.date == today && p.status == 'confirmed').toList();
    final todayCollections = todayPayments.fold<double>(0.0, (sum, p) => sum + p.amount);

    final todayVisits = _visitLogs.where((v) => v.date == today).toList();
    final successfulVisits = todayVisits.where((v) => v.outcome == 'successful').toList();

    final pendingPaymentsCount = _payments.where((p) => p.status == 'pending').length;
    final defaultersCount = _taxpayers.where((t) => t.status == 'defaulter').length;

    return OfficerStats(
      todayCollections: todayCollections,
      dailyTarget: mockOfficerStats.dailyTarget,
      totalVisits: todayVisits.length,
      successfulCollections: successfulVisits.length,
      pendingPayments: pendingPaymentsCount,
      defaultersCount: defaultersCount,
    );
  }

  Future<Payment> addPayment(double amount, String taxpayerId, String method) async {
    final taxpayer = getTaxpayerById(taxpayerId);
    final now = DateTime.now();
    final timestamp = now.millisecondsSinceEpoch.toString();
    final dateStr = now.toIso8601String().split('T')[0];
    final timeStr = _formatTime(now);

    final newPayment = Payment(
      id: 'p$timestamp',
      taxpayerId: taxpayerId,
      taxpayerName: taxpayer?.name ?? '',
      amount: amount,
      date: dateStr,
      time: timeStr,
      method: method,
      status: 'pending',
      receiptNumber: 'RCP-$timestamp',
    );

    _payments.insert(0, newPayment);
    notifyListeners();

    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_keyPayments, jsonEncode(_payments.map((p) => p.toJson()).toList()));
    } catch (e) {
      debugPrint('Error saving payment: $e');
    }

    return newPayment;
  }

  Future<void> confirmPayment(String paymentId) async {
    _payments = _payments.map((p) {
      if (p.id == paymentId) {
        return p.copyWith(status: 'confirmed');
      }
      return p;
    }).toList();
    notifyListeners();

    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_keyPayments, jsonEncode(_payments.map((p) => p.toJson()).toList()));
    } catch (e) {
      debugPrint('Error confirming payment: $e');
    }
  }

  Future<VisitLog> addVisitLog(String taxpayerId, String purpose, String outcome, String notes) async {
    final taxpayer = getTaxpayerById(taxpayerId);
    final now = DateTime.now();
    final timestamp = now.millisecondsSinceEpoch.toString();
    final dateStr = now.toIso8601String().split('T')[0];
    final timeStr = _formatTime(now);

    final newLog = VisitLog(
      id: 'v$timestamp',
      taxpayerId: taxpayerId,
      taxpayerName: taxpayer?.name ?? '',
      address: taxpayer?.address ?? '',
      date: dateStr,
      time: timeStr,
      purpose: purpose,
      notes: notes,
      outcome: outcome,
    );

    _visitLogs.insert(0, newLog);
    notifyListeners();

    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_keyVisitLogs, jsonEncode(_visitLogs.map((v) => v.toJson()).toList()));
    } catch (e) {
      debugPrint('Error saving visit log: $e');
    }

    return newLog;
  }

  Future<Invoice> addInvoice(String taxpayerId, List<InvoiceItem> items, String dueDate) async {
    final taxpayer = getTaxpayerById(taxpayerId);
    final now = DateTime.now();
    final timestamp = now.millisecondsSinceEpoch.toString();
    final dateStr = now.toIso8601String().split('T')[0];
    final totalAmount = items.fold<double>(0.0, (sum, item) => sum + item.amount);

    final newInvoice = Invoice(
      id: 'inv$timestamp',
      invoiceNumber: 'INV-$timestamp',
      taxpayerId: taxpayerId,
      taxpayerName: taxpayer?.name ?? '',
      amount: totalAmount,
      dueDate: dueDate,
      createdDate: dateStr,
      status: 'unpaid',
      items: items,
    );

    _invoices.insert(0, newInvoice);
    notifyListeners();

    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_keyInvoices, jsonEncode(_invoices.map((inv) => inv.toJson()).toList()));
    } catch (e) {
      debugPrint('Error saving invoice: $e');
    }

    return newInvoice;
  }

  Taxpayer? getTaxpayerById(String id) {
    try {
      return _taxpayers.firstWhere((t) => t.id == id);
    } catch (_) {
      return null;
    }
  }

  List<Taxpayer> getDefaulters() {
    return _taxpayers.where((t) => t.status == 'defaulter').toList();
  }

  List<Taxpayer> searchTaxpayers(String query) {
    if (query.trim().isEmpty) return _taxpayers;
    final lowerQuery = query.toLowerCase();
    return _taxpayers.where((t) =>
        t.name.toLowerCase().contains(lowerQuery) ||
        t.businessName.toLowerCase().contains(lowerQuery) ||
        t.qrCode.toLowerCase().contains(lowerQuery)).toList();
  }

  String _formatTime(DateTime dateTime) {
    int hour = dateTime.hour;
    int minute = dateTime.minute;
    String period = 'AM';

    if (hour >= 12) {
      period = 'PM';
      if (hour > 12) {
        hour -= 12;
      }
    }
    if (hour == 0) {
      hour = 12;
    }

    String hourStr = hour.toString().padLeft(2, '0');
    String minuteStr = minute.toString().padLeft(2, '0');

    return '$hourStr:$minuteStr $period';
  }
}
