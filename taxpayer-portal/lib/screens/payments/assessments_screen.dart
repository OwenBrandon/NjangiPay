import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';

import '../../core/theme/app_theme.dart';
import '../../core/models/models.dart';
import '../../core/api/api_service.dart';
import '../../core/utils/auto_refresh_mixin.dart';

class AssessmentsScreen extends StatefulWidget {
  const AssessmentsScreen({super.key});

  @override
  State<AssessmentsScreen> createState() => _AssessmentsScreenState();
}

class _AssessmentsScreenState extends State<AssessmentsScreen> with AutoRefreshMixin {
  bool _isLoading = true;
  bool _isRefreshing = false;
  List<Assessment> _allAssessments = [];
  String _filter = 'all';

  final List<Map<String, String>> _filterOptions = [
    {'key': 'all', 'label': 'All'},
    {'key': 'unpaid', 'label': 'Unpaid'},
    {'key': 'overdue', 'label': 'Overdue'},
    {'key': 'partial', 'label': 'Partial'},
    {'key': 'paid', 'label': 'Paid'},
  ];

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
      final assessments = await api.getAssessments();
      setState(() {
        _allAssessments = assessments;
        _isLoading = false;
        _isRefreshing = false;
      });
    } catch (e) {
      debugPrint('Error fetching data: $e');
      setState(() {
        _isLoading = false;
        _isRefreshing = false;
      });
    }
  }

  Future<void> _onRefresh() async {
    setState(() => _isRefreshing = true);
    await _fetchData();
  }

  String _formatCurrency(double amount) {
    return NumberFormat.currency(locale: 'fr_CM', symbol: 'FCFA ', decimalDigits: 0).format(amount);
  }

  Color _getStatusColor(AssessmentStatus status, AppColors colors) {
    switch (status) {
      case AssessmentStatus.paid: return colors.success;
      case AssessmentStatus.unpaid: return colors.info;
      case AssessmentStatus.overdue: return colors.danger;
      case AssessmentStatus.partial: return colors.warning;
      case AssessmentStatus.pending: return colors.warning;
      case AssessmentStatus.approved: return colors.info;
      case AssessmentStatus.disputed: return colors.danger;
    }
  }

  @override
  Widget build(BuildContext context) {
    final themeProvider = context.watch<ThemeProvider>();
    final colors = themeProvider.colors;

    final filteredAssessments = _allAssessments.where((a) {
      if (_filter == 'all') return true;
      return a.status.name == _filter;
    }).toList();

    return Scaffold(
      backgroundColor: colors.background,
      appBar: AppBar(
        title: Text('Assessments', style: TextStyle(color: colors.text)),
        backgroundColor: colors.surface,
        elevation: 0,
        iconTheme: IconThemeData(color: colors.text),
      ),
      body: Column(
        children: [
          Container(
            height: 60,
            decoration: BoxDecoration(
              color: colors.surface,
              border: Border(bottom: BorderSide(color: colors.border)),
            ),
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              children: _filterOptions.map((opt) {
                final isSelected = _filter == opt['key'];
                return GestureDetector(
                  onTap: () => setState(() => _filter = opt['key']!),
                  child: Container(
                    margin: const EdgeInsets.only(right: 8),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: isSelected ? colors.primary : colors.surfaceSecondary,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      opt['label']!,
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                        color: isSelected ? Colors.white : colors.textSecondary,
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
          Expanded(
            child: _isLoading
                ? Center(child: CircularProgressIndicator(color: colors.primary))
                : RefreshIndicator(
                    onRefresh: _onRefresh,
                    color: colors.primary,
                    child: filteredAssessments.isEmpty
                        ? ListView(
                            physics: const AlwaysScrollableScrollPhysics(),
                            children: [
                              Container(
                                height: 300,
                                alignment: Alignment.center,
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(LucideIcons.filter, size: 48, color: colors.textLight),
                                    const SizedBox(height: 16),
                                    Text('No assessments found', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600, color: colors.text)),
                                    const SizedBox(height: 4),
                                    Text('Try changing your filter selection', style: TextStyle(fontSize: 14, color: colors.textSecondary)),
                                  ],
                                ),
                              )
                            ],
                          )
                        : ListView.builder(
                            padding: const EdgeInsets.all(16).copyWith(bottom: 24),
                            physics: const AlwaysScrollableScrollPhysics(),
                            itemCount: filteredAssessments.length,
                            itemBuilder: (context, index) {
                              final assessment = filteredAssessments[index];
                              final statusColor = _getStatusColor(assessment.status, colors);
                              final isPending = assessment.status != AssessmentStatus.paid;

                              return GestureDetector(
                                onTap: () => context.push('/assessment-details?id=${assessment.id}'),
                                child: Container(
                                  margin: const EdgeInsets.only(bottom: 12),
                                  padding: const EdgeInsets.all(18),
                                  decoration: BoxDecoration(
                                    color: colors.surface,
                                    borderRadius: BorderRadius.circular(18),
                                    boxShadow: [
                                      BoxShadow(color: colors.primary.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, 4))
                                    ],
                                  ),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              Text(assessment.referenceNumber, style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: colors.text)),
                                              const SizedBox(height: 3),
                                              Text(assessment.businessName, style: TextStyle(fontSize: 13, color: colors.textSecondary)),
                                            ],
                                          ),
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                                            decoration: BoxDecoration(color: statusColor.withOpacity(0.15), borderRadius: BorderRadius.circular(12)),
                                            child: Row(
                                              mainAxisSize: MainAxisSize.min,
                                              children: [
                                                Container(width: 7, height: 7, decoration: BoxDecoration(color: statusColor, shape: BoxShape.circle)),
                                                const SizedBox(width: 6),
                                                Text(
                                                  assessment.status.name[0].toUpperCase() + assessment.status.name.substring(1),
                                                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: statusColor),
                                                ),
                                              ],
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 14),
                                      Text(assessment.description, style: TextStyle(fontSize: 14, color: colors.text)),
                                      const SizedBox(height: 14),
                                      Container(
                                        padding: const EdgeInsets.only(top: 14),
                                        decoration: BoxDecoration(border: Border(top: BorderSide(color: colors.border))),
                                        child: Row(
                                          children: [
                                            Expanded(
                                              child: Column(
                                                crossAxisAlignment: CrossAxisAlignment.start,
                                                children: [
                                                  Text('Tax Period', style: TextStyle(fontSize: 11, color: colors.textSecondary)),
                                                  const SizedBox(height: 3),
                                                  Text(assessment.taxPeriod, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: colors.text)),
                                                ],
                                              ),
                                            ),
                                            Expanded(
                                              child: Column(
                                                crossAxisAlignment: CrossAxisAlignment.start,
                                                children: [
                                                  Text('Due Date', style: TextStyle(fontSize: 11, color: colors.textSecondary)),
                                                  const SizedBox(height: 3),
                                                  Text(assessment.dueDate, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: colors.text)),
                                                ],
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                      Container(
                                        margin: const EdgeInsets.only(top: 14),
                                        padding: const EdgeInsets.only(top: 14),
                                        decoration: BoxDecoration(border: Border(top: BorderSide(color: colors.border))),
                                        child: Row(
                                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                          crossAxisAlignment: CrossAxisAlignment.center,
                                          children: [
                                            Column(
                                              crossAxisAlignment: CrossAxisAlignment.start,
                                              children: [
                                                Text(isPending ? 'Amount Due' : 'Amount Paid', style: TextStyle(fontSize: 11, color: colors.textSecondary)),
                                                Text(_formatCurrency(assessment.amount - assessment.amountPaid), style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: colors.text)),
                                                if (assessment.amountPaid > 0 && isPending)
                                                  Text('(${_formatCurrency(assessment.amountPaid)} paid)', style: TextStyle(fontSize: 11, color: colors.success, height: 1.5)),
                                              ],
                                            ),
                                            Row(
                                              children: [
                                                if (isPending)
                                                  GestureDetector(
                                                    onTap: () => context.push('/make-payment?assessmentId=${assessment.id}'),
                                                    child: Container(
                                                      margin: const EdgeInsets.only(right: 12),
                                                      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                                                      decoration: BoxDecoration(color: colors.primary, borderRadius: BorderRadius.circular(10)),
                                                      child: const Text('Pay Now', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Colors.white)),
                                                    ),
                                                  ),
                                                Icon(LucideIcons.chevronRight, size: 20, color: colors.textLight),
                                              ],
                                            )
                                          ],
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            },
                          ),
                  ),
          ),
        ],
      ),
    );
  }
}
