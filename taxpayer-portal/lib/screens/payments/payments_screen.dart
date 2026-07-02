import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';

import '../../core/theme/app_theme.dart';
import '../../core/models/models.dart';
import '../../core/api/api_service.dart';
import '../../core/utils/auto_refresh_mixin.dart';

class PaymentsScreen extends StatefulWidget {
  const PaymentsScreen({super.key});

  @override
  State<PaymentsScreen> createState() => _PaymentsScreenState();
}

class _PaymentsScreenState extends State<PaymentsScreen> with AutoRefreshMixin {
  bool _isLoading = true;
  List<Assessment> _assessments = [];
  List<Payment> _payments = [];
  List<Receipt> _receipts = [];

  @override
  Duration get refreshInterval => const Duration(seconds: 30);

  @override
  Future<void> onRefresh() => _fetchData();

  @override
  void initState() {
    super.initState();
    _fetchData();
    startAutoRefresh();
  }

  Future<void> _fetchData() async {
    final api = context.read<ApiService>();
    try {
      final results = await Future.wait([
        api.getAssessments(),
        api.getPayments(),
        api.getReceipts(),
      ]);
      setState(() {
        _assessments = results[0] as List<Assessment>;
        _payments = results[1] as List<Payment>;
        _receipts = results[2] as List<Receipt>;
        _isLoading = false;
      });
    } catch (e) {
      debugPrint('Error fetching data: $e');
      setState(() {
        _isLoading = false;
      });
    }
  }

  String _formatCurrency(double amount) {
    return NumberFormat.currency(locale: 'fr_CM', symbol: 'FCFA ', decimalDigits: 0).format(amount);
  }

  @override
  Widget build(BuildContext context) {
    final themeProvider = context.watch<ThemeProvider>();
    final colors = themeProvider.colors;
    final isDark = themeProvider.isDark;

    if (_isLoading) {
      return Scaffold(
        backgroundColor: colors.background,
        body: Center(child: CircularProgressIndicator(color: colors.primary)),
      );
    }

    final unpaidAssessments = _assessments.where((a) =>
        a.status == AssessmentStatus.unpaid ||
        a.status == AssessmentStatus.overdue ||
        a.status == AssessmentStatus.partial).toList();
    final overdueCount = _assessments.where((a) => a.status == AssessmentStatus.overdue).length;
    final totalUnpaid = unpaidAssessments.fold(0.0, (sum, a) => sum + (a.amount - a.amountPaid));

    return Scaffold(
      backgroundColor: colors.background,
      appBar: AppBar(
        title: Text('Payments', style: TextStyle(color: colors.text, fontWeight: FontWeight.bold)),
        backgroundColor: colors.surface,
        elevation: 0,
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1.0),
          child: Container(color: colors.border, height: 1.0),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16).copyWith(bottom: 100),
        children: [
          _buildSummaryCard(colors, totalUnpaid, unpaidAssessments.length, overdueCount),
          const SizedBox(height: 20),
          _buildMenuSection(colors, isDark),
          const SizedBox(height: 20),
          _buildRecentSection(colors, isDark),
        ],
      ),
    );
  }

  Widget _buildSummaryCard(AppColors colors, double totalUnpaid, int unpaidCount, int overdueCount) {
    return Container(
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        color: colors.primary,
        borderRadius: BorderRadius.circular(22),
        boxShadow: [
          BoxShadow(
            color: colors.primary.withOpacity(0.3),
            offset: const Offset(0, 8),
            blurRadius: 16,
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Outstanding Balance',
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: Colors.white.withOpacity(0.8)),
              ),
              if (overdueCount > 0)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFF6961).withOpacity(0.25),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    children: [
                      const Icon(LucideIcons.alertCircle, size: 12, color: Color(0xFFFF6961)),
                      const SizedBox(width: 5),
                      Text(
                        '$overdueCount Overdue',
                        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFFFF6961)),
                      ),
                    ],
                  ),
                ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            _formatCurrency(totalUnpaid),
            style: const TextStyle(fontSize: 36, fontWeight: FontWeight.bold, color: Colors.white),
          ),
          const SizedBox(height: 6),
          Text(
            '$unpaidCount pending assessment${unpaidCount != 1 ? 's' : ''}',
            style: TextStyle(fontSize: 13, color: Colors.white.withOpacity(0.7)),
          ),
          const SizedBox(height: 18),
          GestureDetector(
            onTap: () => context.push('/make-payment'),
            child: Container(
              padding: const EdgeInsets.symmetric(vertical: 16),
              decoration: BoxDecoration(
                color: colors.secondary,
                borderRadius: BorderRadius.circular(14),
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(LucideIcons.creditCard, size: 20, color: Colors.white),
                  SizedBox(width: 10),
                  Text(
                    'Make a Payment',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Colors.white),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMenuSection(AppColors colors, bool isDark) {
    return Container(
      decoration: BoxDecoration(
        color: isDark ? colors.glass : colors.surface,
        borderRadius: BorderRadius.circular(18),
        border: isDark ? Border.all(color: colors.glassBorder) : null,
        boxShadow: [
          BoxShadow(
            color: colors.cardShadow.withOpacity(isDark ? 0.2 : 0.05),
            offset: const Offset(0, 2),
            blurRadius: 8,
          ),
        ],
      ),
      child: Column(
        children: [
          _MenuItem(
            title: 'Assessments / Invoices',
            subtitle: 'View all tax assessments',
            icon: LucideIcons.fileText,
            iconColor: colors.info,
            badgeCount: _assessments.length,
            colors: colors,
            onTap: () => context.go('/payments/assessments'),
          ),
          Divider(color: colors.border, height: 1, thickness: 1),
          _MenuItem(
            title: 'Receipts',
            subtitle: 'Download payment receipts',
            icon: LucideIcons.receipt,
            iconColor: colors.success,
            badgeCount: _receipts.length,
            colors: colors,
            onTap: () => context.go('/payments/receipts'),
          ),
          Divider(color: colors.border, height: 1, thickness: 1),
          _MenuItem(
            title: 'Payment History',
            subtitle: 'View past transactions',
            icon: LucideIcons.trendingUp,
            iconColor: colors.primary,
            badgeCount: _payments.length,
            colors: colors,
            onTap: () => context.go('/payments/assessments'),
          ),
        ],
      ),
    );
  }

  Widget _buildRecentSection(AppColors colors, bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Recent Payments',
          style: TextStyle(fontSize: 17, fontWeight: FontWeight.w600, color: colors.text),
        ),
        const SizedBox(height: 14),
        if (_payments.isEmpty)
          Container(
            padding: const EdgeInsets.symmetric(vertical: 40),
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: isDark ? colors.glass : colors.surface,
              borderRadius: BorderRadius.circular(14),
              border: isDark ? Border.all(color: colors.glassBorder) : null,
            ),
            child: Column(
              children: [
                Icon(LucideIcons.creditCard, size: 40, color: colors.textLight),
                const SizedBox(height: 12),
                Text('No payments yet', style: TextStyle(fontSize: 14, color: colors.textSecondary)),
              ],
            ),
          )
        else
          ..._payments.take(3).map((p) => _PaymentCard(payment: p, colors: colors, isDark: isDark)),
      ],
    );
  }
}

class _MenuItem extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final Color iconColor;
  final int badgeCount;
  final AppColors colors;
  final VoidCallback onTap;

  const _MenuItem({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.iconColor,
    required this.badgeCount,
    required this.colors,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: iconColor.withOpacity(0.15),
                borderRadius: BorderRadius.circular(14),
              ),
              alignment: Alignment.center,
              child: Icon(icon, color: iconColor, size: 24),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: colors.text)),
                  const SizedBox(height: 3),
                  Text(subtitle, style: TextStyle(fontSize: 12, color: colors.textSecondary)),
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
              decoration: BoxDecoration(
                color: colors.surfaceSecondary,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                badgeCount.toString(),
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: colors.textSecondary),
              ),
            ),
            const SizedBox(width: 10),
            Icon(LucideIcons.chevronRight, size: 20, color: colors.textLight),
          ],
        ),
      ),
    );
  }
}

class _PaymentCard extends StatelessWidget {
  final Payment payment;
  final AppColors colors;
  final bool isDark;

  const _PaymentCard({required this.payment, required this.colors, required this.isDark});

  String _methodLabel(PaymentMethod m) {
    switch (m) {
      case PaymentMethod.mobileMoney: return 'Mobile Money';
      case PaymentMethod.bankTransfer: return 'Bank Transfer';
      case PaymentMethod.card: return 'Card Payment';
      case PaymentMethod.cash: return 'Cash';
      case PaymentMethod.pos: return 'POS Terminal';
      case PaymentMethod.check: return 'Check';
    }
  }

  @override
  Widget build(BuildContext context) {
    final statusColor = payment.status == PaymentStatus.completed
        ? colors.success
        : payment.status == PaymentStatus.pending
            ? colors.warning
            : colors.danger;

    return Container(
      padding: const EdgeInsets.all(16),
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: isDark ? colors.glass : colors.surface,
        borderRadius: BorderRadius.circular(14),
        border: isDark ? Border.all(color: colors.glassBorder) : null,
        boxShadow: [
          BoxShadow(
            color: colors.cardShadow.withOpacity(isDark ? 0.15 : 0.03),
            offset: const Offset(0, 1),
            blurRadius: 4,
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: statusColor.withOpacity(0.15),
              borderRadius: BorderRadius.circular(12),
            ),
            alignment: Alignment.center,
            child: Icon(
              payment.status == PaymentStatus.completed ? LucideIcons.creditCard : LucideIcons.clock,
              color: statusColor,
              size: 20,
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(payment.referenceNumber, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: colors.text)),
                const SizedBox(height: 2),
                Text(_methodLabel(payment.method), style: TextStyle(fontSize: 12, color: colors.textSecondary)),
                const SizedBox(height: 2),
                Text(payment.date, style: TextStyle(fontSize: 11, color: colors.textLight)),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                NumberFormat.currency(locale: 'fr_CM', symbol: 'FCFA ', decimalDigits: 0).format(payment.amount),
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: colors.text),
              ),
              const SizedBox(height: 3),
              Text(
                payment.status.name[0].toUpperCase() + payment.status.name.substring(1),
                style: TextStyle(fontSize: 11, fontWeight: FontWeight.w500, color: statusColor),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
