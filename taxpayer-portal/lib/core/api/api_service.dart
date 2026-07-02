import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart' hide AuthState;
import '../models/models.dart';

class ApiService {
  SupabaseClient get _client => Supabase.instance.client;

  String? get _userId => _client.auth.currentUser?.id;

  Future<String?> _getTaxpayerId() async {
    if (_userId == null) return null;
    try {
      final res = await _client.from('users').select('id').eq('auth_id', _userId!).maybeSingle();
      if (res == null) return null;
      final userId = res['id'] as String;
      final tp = await _client.from('taxpayers').select('id').eq('user_id', userId).maybeSingle();
      return tp?['id'] as String?;
    } catch (e) {
      debugPrint('_getTaxpayerId error: $e');
      return null;
    }
  }

  Future<TaxpayerProfile> getProfile() async {
    final authUser = _client.auth.currentUser;
    if (authUser == null) return _emptyProfile();

    // Try DB first
    final user = await _client.from('users').select('*').eq('auth_id', authUser.id).maybeSingle();
    if (user != null) {
      final tp = await _client.from('taxpayers').select('*').eq('user_id', user['id']).maybeSingle();
      return TaxpayerProfile(
        id: user['id'] ?? '',
        name: user['name'] ?? '',
        email: user['email'] ?? '',
        phone: tp?['phone'] ?? user['phone'] ?? '',
        tin: tp?['tin'] ?? '',
        address: tp?['address'] ?? '',
      );
    }

    // Fallback to auth metadata (trigger may not have created DB rows)
    final meta = authUser.userMetadata;
    return TaxpayerProfile(
      id: authUser.id,
      name: meta?['name'] as String? ?? authUser.email?.split('@').first ?? '',
      email: authUser.email ?? '',
      phone: meta?['phone'] as String? ?? '',
      tin: meta?['tin'] as String? ?? '',
      address: meta?['address'] as String? ?? '',
    );
  }

  Future<DashboardSummary> getDashboardSummary() async {
    final tpId = await _getTaxpayerId();
    if (tpId == null) return DashboardSummary(totalDue: 0, totalOverdue: 0, totalPaid: 0, pendingAssessments: 0, activeBusinesses: 0);

    final assessments = await _client.from('assessments').select('amount, amount_paid, status').eq('taxpayer_id', tpId);
    final businesses = await _client.from('businesses').select('id').eq('taxpayer_id', tpId);

    double totalDue = 0, totalOverdue = 0, totalPaid = 0;
    int pending = 0;
    for (final a in (assessments as List)) {
      final amount = (a['amount'] as num?)?.toDouble() ?? 0;
      final paid = (a['amount_paid'] as num?)?.toDouble() ?? 0;
      final status = a['status'] as String? ?? '';
      totalPaid += paid;
      if (status == 'overdue') totalOverdue += (amount - paid);
      if (status != 'paid') totalDue += (amount - paid);
      if (status == 'pending' || status == 'unpaid') pending++;
    }

    return DashboardSummary(
      totalDue: totalDue,
      totalOverdue: totalOverdue,
      totalPaid: totalPaid,
      pendingAssessments: pending,
      activeBusinesses: (businesses as List).length,
    );
  }

  Future<List<Business>> getBusinesses() async {
    final tpId = await _getTaxpayerId();
    if (tpId == null) return [];
    final res = await _client.from('businesses').select('*, branches(*), documents(*)').eq('taxpayer_id', tpId);
    return (res as List).map((b) => Business.fromJson(_snakeToCamel(b))).toList();
  }

  Future<Business?> getBusinessById(String id) async {
    final res = await _client.from('businesses').select('*, branches(*), documents(*)').eq('id', id).maybeSingle();
    if (res == null) return null;
    return Business.fromJson(_snakeToCamel(res));
  }

  Future<List<Assessment>> getAssessments() async {
    final tpId = await _getTaxpayerId();
    if (tpId == null) return [];
    final res = await _client.from('assessments').select('*').eq('taxpayer_id', tpId).order('assessment_date', ascending: false);
    return (res as List).map((a) => Assessment.fromJson(_snakeToCamel(a))).toList();
  }

  Future<Assessment?> getAssessmentById(String id) async {
    final res = await _client.from('assessments').select('*').eq('id', id).maybeSingle();
    if (res == null) return null;
    return Assessment.fromJson(_snakeToCamel(res));
  }

  Future<List<Payment>> getPayments() async {
    final tpId = await _getTaxpayerId();
    if (tpId == null) return [];
    final res = await _client.from('payments').select('*').eq('taxpayer_id', tpId).order('payment_date', ascending: false);
    return (res as List).map((p) => Payment.fromJson(_snakeToCamel(p))).toList();
  }

  Future<List<Receipt>> getReceipts() async {
    final tpId = await _getTaxpayerId();
    if (tpId == null) return [];
    final payments = await _client.from('payments').select('id').eq('taxpayer_id', tpId);
    final paymentIds = (payments as List).map((p) => p['id'] as String).toList();
    if (paymentIds.isEmpty) return [];
    final res = await _client.from('receipts').select('*').inFilter('payment_id', paymentIds);
    return (res as List).map((r) => Receipt.fromJson(_snakeToCamel(r))).toList();
  }

  Future<List<Dispute>> getDisputes() async {
    final tpId = await _getTaxpayerId();
    if (tpId == null) return [];
    final res = await _client.from('support_tickets').select('*, support_ticket_responses(*)').eq('taxpayer_id', tpId).order('created_date', ascending: false);
    return (res as List).map((t) {
      final camel = _snakeToCamel(t);
      camel['referenceNumber'] = t['ticket_number'] ?? '';
      camel['category'] = _mapDisputeCategory(t['category'] as String?);
      camel['status'] = _mapDisputeStatus(t['status'] as String?);
      camel['submittedDate'] = t['created_date'] ?? '';
      camel['lastUpdated'] = t['updated_at'] ?? t['created_date'] ?? '';
      camel['attachments'] = (t['attachments'] as List?)?.cast<String>() ?? [];
      camel['responses'] = camel['supportTicketResponses'] ?? [];
      camel.remove('supportTicketResponses');
      return Dispute.fromJson(camel);
    }).toList();
  }

  Future<List<AppNotification>> getNotifications() async {
    final res = await _client.from('notifications').select('*').order('created_at', ascending: false).limit(20);
    return (res as List).map((n) => AppNotification(
      id: n['id'] ?? '',
      type: _parseNotifType(n['type'] as String?),
      title: n['title'] ?? '',
      message: n['message'] ?? '',
      date: n['created_at'] ?? '',
      read: false,
    )).toList();
  }

  Future<String?> makePayment({
    required String assessmentId,
    required double amount,
    required String taxType,
    required String paymentMethod,
    String? transactionRef,
  }) async {
    final tpId = await _getTaxpayerId();
    if (tpId == null) return null;
    try {
      final ref = transactionRef ?? 'TXN-${DateTime.now().millisecondsSinceEpoch}';
      final res = await _client.from('payments').insert({
        'taxpayer_id': tpId,
        'assessment_id': assessmentId.isEmpty ? null : assessmentId,
        'amount': amount,
        'tax_type': taxType,
        'payment_method': paymentMethod,
        'status': 'completed',
        'transaction_ref': ref,
        'payment_date': DateTime.now().toIso8601String(),
      }).select().single();
      return res['id'] as String?;
    } catch (e) {
      debugPrint('makePayment error: $e');
      return null;
    }
  }

  Future<String?> submitDispute({
    required String category,
    required String subject,
    required String description,
    String? assessmentId,
  }) async {
    final tpId = await _getTaxpayerId();
    if (tpId == null) return null;
    try {
      final ticketNum = 'TKT-${DateTime.now().year}-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}';
      final res = await _client.from('support_tickets').insert({
        'taxpayer_id': tpId,
        'ticket_number': ticketNum,
        'category': category,
        'subject': subject,
        'description': description,
        'status': 'open',
        'priority': 'medium',
        'assessment_id': assessmentId,
        'created_date': DateTime.now().toIso8601String(),
      }).select().single();
      return res['ticket_number'] as String? ?? ticketNum;
    } catch (e) {
      debugPrint('submitDispute error: $e');
      return null;
    }
  }

  Future<bool> addDisputeResponse({
    required String ticketId,
    required String message,
  }) async {
    try {
      final userId = _userId;
      String? dbUserId;
      if (userId != null) {
        final userRow = await _client.from('users').select('id').eq('auth_id', userId).maybeSingle();
        dbUserId = userRow?['id'] as String?;
      }
      await _client.from('support_ticket_responses').insert({
        'ticket_id': ticketId,
        'message': message,
        'is_official': false,
        'author_id': dbUserId,
      });
      await _client.from('support_tickets').update({
        'updated_at': DateTime.now().toIso8601String(),
      }).eq('id', ticketId);
      return true;
    } catch (e) {
      debugPrint('addDisputeResponse error: $e');
      return false;
    }
  }

  Future<String?> registerBusiness({
    required String businessType,
    required String name,
    required String email,
    required String phone,
    required String address,
    String? registrationNumber,
    String? description,
  }) async {
    final tpId = await _getTaxpayerId();
    if (tpId == null) return null;
    try {
      final tp = await _client.from('taxpayers').select('tin, region').eq('id', tpId).maybeSingle();
      final res = await _client.from('businesses').insert({
        'taxpayer_id': tpId,
        'name': name,
        'business_type': businessType,
        'registration_number': registrationNumber,
        'tin': tp?['tin'],
        'status': 'pending',
        'address': address,
        'email': email,
        'phone': phone,
        'region': tp?['region'],
      }).select().single();
      return res['id'] as String?;
    } catch (e) {
      debugPrint('registerBusiness error: $e');
      return null;
    }
  }

  // Helpers
  Map<String, dynamic> _snakeToCamel(Map<String, dynamic> m) {
    final result = <String, dynamic>{};
    for (final entry in m.entries) {
      final key = entry.key.replaceAllMapped(RegExp(r'_([a-z])'), (match) => match.group(1)!.toUpperCase());
      final value = entry.value;
      if (value is Map<String, dynamic>) {
        result[key] = _snakeToCamel(value);
      } else if (value is List) {
        result[key] = value.map((v) => v is Map<String, dynamic> ? _snakeToCamel(v) : v).toList();
      } else {
        result[key] = value;
      }
    }
    return result;
  }

  String _mapDisputeCategory(String? cat) {
    switch (cat) {
      case 'payment': return 'payment';
      case 'registration': return 'registration';
      case 'assessment': return 'assessment';
      default: return 'other';
    }
  }

  String _mapDisputeStatus(String? status) {
    switch (status) {
      case 'in_progress': case 'under_review': return 'under_review';
      case 'resolved': case 'closed': return 'resolved';
      case 'rejected': return 'rejected';
      default: return 'submitted';
    }
  }

  NotificationType _parseNotifType(String? type) {
    switch (type) {
      case 'success': return NotificationType.payment;
      case 'warning': return NotificationType.reminder;
      case 'error': return NotificationType.system;
      default: return NotificationType.system;
    }
  }

  TaxpayerProfile _emptyProfile() => TaxpayerProfile(id: '', name: '', email: '', phone: '', tin: '', address: '');
}
