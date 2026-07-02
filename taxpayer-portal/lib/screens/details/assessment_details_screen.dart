import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';

import '../../core/theme/app_theme.dart';
import '../../core/models/models.dart';
import '../../core/api/api_service.dart';

class AssessmentDetailsScreen extends StatefulWidget {
  final String id;
  const AssessmentDetailsScreen({super.key, required this.id});

  @override
  State<AssessmentDetailsScreen> createState() => _AssessmentDetailsScreenState();
}

class _AssessmentDetailsScreenState extends State<AssessmentDetailsScreen> {
  bool _isLoading = true;
  Assessment? _assessment;

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  Future<void> _fetchData() async {
    final api = context.read<ApiService>();
    try {
      final assessments = await api.getAssessments();
      setState(() {
        _assessment = assessments.cast<Assessment?>().firstWhere((a) => a?.id == widget.id, orElse: () => null);
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

  Color _getStatusColor(AssessmentStatus status, AppColors colors) {
    switch (status) {
      case AssessmentStatus.paid:
        return colors.success;
      case AssessmentStatus.unpaid:
        return colors.info;
      case AssessmentStatus.overdue:
        return colors.danger;
      case AssessmentStatus.partial:
        return colors.warning;
      case AssessmentStatus.pending:
        return colors.warning;
      case AssessmentStatus.approved:
        return colors.info;
      case AssessmentStatus.disputed:
        return colors.danger;
    }
  }

  @override
  Widget build(BuildContext context) {
    final themeProvider = context.watch<ThemeProvider>();
    final colors = themeProvider.colors;

    if (_isLoading) {
      return Scaffold(
        backgroundColor: colors.background,
        appBar: AppBar(backgroundColor: colors.background, elevation: 0),
        body: Center(child: CircularProgressIndicator(color: colors.primary)),
      );
    }

    if (_assessment == null) {
      return Scaffold(
        backgroundColor: colors.background,
        appBar: AppBar(backgroundColor: colors.background, elevation: 0),
        body: Center(child: Text('Assessment not found', style: TextStyle(color: colors.textSecondary, fontSize: 16))),
      );
    }

    final statusColor = _getStatusColor(_assessment!.status, colors);
    final isPending = _assessment!.status != AssessmentStatus.paid;

    return Scaffold(
      backgroundColor: colors.background,
      appBar: AppBar(
        backgroundColor: colors.background,
        elevation: 0,
        iconTheme: IconThemeData(color: colors.text),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16).copyWith(bottom: 32),
        children: [
          Column(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                decoration: BoxDecoration(
                  color: statusColor.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(width: 8, height: 8, decoration: BoxDecoration(color: statusColor, shape: BoxShape.circle)),
                    const SizedBox(width: 6),
                    Text(
                      _assessment!.status.name[0].toUpperCase() + _assessment!.status.name.substring(1),
                      style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: statusColor),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              Text(_assessment!.referenceNumber, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: colors.text)),
              const SizedBox(height: 4),
              Text(_assessment!.description, style: TextStyle(fontSize: 14, color: colors.textSecondary)),
            ],
          ),
          const SizedBox(height: 24),
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(color: colors.primary, borderRadius: BorderRadius.circular(16)),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Total Amount', style: TextStyle(fontSize: 14, color: Colors.white.withOpacity(0.8))),
                    Text(_formatCurrency(_assessment!.amount), style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Colors.white)),
                  ],
                ),
                if (_assessment!.amountPaid > 0) ...[
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Amount Paid', style: TextStyle(fontSize: 14, color: Colors.white.withOpacity(0.8))),
                      Text('- ${_formatCurrency(_assessment!.amountPaid)}', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: colors.secondaryLight)),
                    ],
                  ),
                ],
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  child: Divider(color: Colors.white.withOpacity(0.2), height: 1),
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Balance Due', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Colors.white)),
                    Text(_formatCurrency(_assessment!.amount - _assessment!.amountPaid), style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white)),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(color: colors.surface, borderRadius: BorderRadius.circular(16)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Assessment Details', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: colors.text)),
                const SizedBox(height: 16),
                _buildDetailRow(LucideIcons.building2, 'Business', _assessment!.businessName, colors),
                _buildDetailRow(LucideIcons.fileText, 'Tax Type', _assessment!.taxType, colors),
                _buildDetailRow(LucideIcons.calendar, 'Tax Period', _assessment!.taxPeriod, colors),
                _buildDetailRow(LucideIcons.calendar, 'Issue Date', _assessment!.issueDate, colors),
                _buildDetailRow(LucideIcons.calendar, 'Due Date', _assessment!.dueDate, colors, isDanger: _assessment!.status == AssessmentStatus.overdue),
              ],
            ),
          ),
          if (isPending) ...[
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: () => context.push('/make-payment?assessmentId=${_assessment!.id}'),
              icon: const Icon(LucideIcons.creditCard, size: 20, color: Colors.white),
              label: const Text('Pay Now', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Colors.white)),
              style: ElevatedButton.styleFrom(
                backgroundColor: colors.primary,
                minimumSize: const Size(double.infinity, 56),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
            const SizedBox(height: 12),
            OutlinedButton(
              onPressed: () => context.push('/submit-dispute'),
              style: OutlinedButton.styleFrom(
                side: BorderSide(color: colors.border),
                minimumSize: const Size(double.infinity, 56),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: Text('File a Dispute', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w500, color: colors.textSecondary)),
            ),
          ]
        ],
      ),
    );
  }

  Widget _buildDetailRow(IconData icon, String label, String value, AppColors colors, {bool isDanger = false}) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12),
      decoration: BoxDecoration(border: Border(bottom: BorderSide(color: colors.border))),
      child: Row(
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: isDanger ? colors.danger.withOpacity(0.1) : colors.primary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            alignment: Alignment.center,
            child: Icon(icon, size: 18, color: isDanger ? colors.danger : colors.primary),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: TextStyle(fontSize: 12, color: colors.textSecondary)),
                const SizedBox(height: 2),
                Text(value, style: TextStyle(fontSize: 15, fontWeight: FontWeight.w500, color: isDanger ? colors.danger : colors.text)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
