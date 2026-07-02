import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';

import '../../core/theme/app_theme.dart';
import '../../core/models/models.dart';
import '../../core/api/api_service.dart';
import '../../core/utils/auto_refresh_mixin.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> with AutoRefreshMixin {
  bool _isLoading = true;
  TaxpayerProfile _profile = TaxpayerProfile(id: '', name: '', email: '', phone: '', tin: '', address: '');
  DashboardSummary _summary = DashboardSummary(totalDue: 0, totalOverdue: 0, totalPaid: 0, pendingAssessments: 0, activeBusinesses: 0);
  List<AppNotification> _notifications = [];
  List<Assessment> _recentAssessments = [];

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
        api.getProfile(),
        api.getDashboardSummary(),
        api.getNotifications(),
        api.getAssessments(),
      ]);

      setState(() {
        _profile = results[0] as TaxpayerProfile;
        _summary = results[1] as DashboardSummary;
        _notifications = results[2] as List<AppNotification>;
        final assessments = results[3] as List<Assessment>;
        _recentAssessments = assessments.take(3).toList();
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
    if (_isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    final themeProvider = context.watch<ThemeProvider>();
    final colors = themeProvider.colors;
    final isDark = themeProvider.isDark;
    final unreadCount = _notifications.where((n) => !n.read).length;

    return Scaffold(
      backgroundColor: colors.background,
      body: RefreshIndicator(
        onRefresh: _fetchData,
        color: colors.primary,
        child: CustomScrollView(
          slivers: [
            SliverAppBar(
              backgroundColor: colors.primary,
              expandedHeight: 140.0,
              floating: false,
              pinned: true,
              flexibleSpace: FlexibleSpaceBar(
                background: SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.only(left: 20, right: 20, top: 16),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Welcome back,',
                              style: TextStyle(fontSize: 14, color: Colors.white.withOpacity(0.8)),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              _profile.name,
                              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              'TIN: ${_profile.tin}',
                              style: TextStyle(fontSize: 13, color: Colors.white.withOpacity(0.7)),
                            ),
                          ],
                        ),
                        Row(
                          children: [
                            Stack(
                              clipBehavior: Clip.none,
                              children: [
                                _HeaderButton(
                                  icon: LucideIcons.bell,
                                  onTap: () => context.push('/more/notifications'),
                                ),
                                if (unreadCount > 0)
                                  Positioned(
                                    top: -4,
                                    right: -4,
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 4),
                                      constraints: const BoxConstraints(minWidth: 18, minHeight: 18),
                                      decoration: BoxDecoration(
                                        color: colors.danger,
                                        borderRadius: BorderRadius.circular(10),
                                      ),
                                      alignment: Alignment.center,
                                      child: Text(
                                        unreadCount.toString(),
                                        style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white),
                                      ),
                                    ),
                                  ),
                              ],
                            ),
                            const SizedBox(width: 12),
                            _HeaderButton(
                              icon: LucideIcons.settings,
                              onTap: () => context.go('/more'),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.only(bottom: 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildSummarySection(colors, isDark),
                    _buildStatsRow(colors, isDark),
                    _buildQuickActions(colors, isDark),
                    _buildRecentAssessments(colors, isDark),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSummarySection(AppColors colors, bool isDark) {
    return Transform.translate(
      offset: const Offset(0, -20),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Tax Summary',
              style: TextStyle(fontSize: 17, fontWeight: FontWeight.w600, color: colors.text),
            ),
            const SizedBox(height: 14),
            Row(
              children: [
                Expanded(
                  child: _SummaryCard(
                    title: 'Overdue',
                    amount: _formatCurrency(_summary.totalOverdue),
                    amountColor: colors.danger,
                    icon: LucideIcons.alertCircle,
                    iconColor: colors.danger,
                    borderColor: colors.danger,
                    colors: colors,
                    isDark: isDark,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _SummaryCard(
                    title: 'Due',
                    amount: _formatCurrency(_summary.totalDue),
                    amountColor: colors.warning,
                    icon: LucideIcons.clock,
                    iconColor: colors.warning,
                    borderColor: colors.warning,
                    colors: colors,
                    isDark: isDark,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _SummaryCard(
                    title: 'Paid (YTD)',
                    amount: _formatCurrency(_summary.totalPaid),
                    amountColor: colors.success,
                    icon: LucideIcons.checkCircle2,
                    iconColor: colors.success,
                    borderColor: colors.success,
                    colors: colors,
                    isDark: isDark,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatsRow(AppColors colors, bool isDark) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Row(
        children: [
          Expanded(
            child: _StatCard(
              number: _summary.pendingAssessments.toString(),
              label: 'Pending Assessments',
              icon: LucideIcons.fileText,
              iconColor: colors.info,
              colors: colors,
              isDark: isDark,
              onTap: () => context.go('/payments/assessments'),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: _StatCard(
              number: _summary.activeBusinesses.toString(),
              label: 'Active Businesses',
              icon: LucideIcons.building2,
              iconColor: colors.secondary,
              colors: colors,
              isDark: isDark,
              onTap: () => context.go('/businesses'),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: _StatCard(
              number: _summary.totalPaid > 100000 ? '156K+' : _formatCurrency(_summary.totalPaid),
              label: 'Total Paid',
              icon: LucideIcons.trendingUp,
              iconColor: colors.primary,
              colors: colors,
              isDark: isDark,
              onTap: () => context.go('/payments/receipts'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActions(AppColors colors, bool isDark) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 28),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Quick Actions',
            style: TextStyle(fontSize: 17, fontWeight: FontWeight.w600, color: colors.text),
          ),
          const SizedBox(height: 14),
          Row(
            children: [
              Expanded(
                child: _QuickActionBtn(
                  label: 'Register Business',
                  icon: LucideIcons.building2,
                  iconBgColor: colors.primary,
                  colors: colors,
                  isDark: isDark,
                  onTap: () => context.push('/register-business'),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _QuickActionBtn(
                  label: 'Make Payment',
                  icon: LucideIcons.fileText,
                  iconBgColor: colors.secondary,
                  colors: colors,
                  isDark: isDark,
                  onTap: () => context.push('/make-payment'),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _QuickActionBtn(
                  label: 'File Dispute',
                  icon: LucideIcons.alertCircle,
                  iconBgColor: colors.warning,
                  colors: colors,
                  isDark: isDark,
                  onTap: () => context.push('/submit-dispute'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildRecentAssessments(AppColors colors, bool isDark) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Recent Assessments',
                style: TextStyle(fontSize: 17, fontWeight: FontWeight.w600, color: colors.text),
              ),
              GestureDetector(
                onTap: () => context.go('/payments/assessments'),
                child: Text(
                  'View All',
                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: colors.primary),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          ..._recentAssessments.map((a) => _AssessmentCard(
                assessment: a,
                colors: colors,
                isDark: isDark,
                onTap: () => context.push('/assessment-details?id=${a.id}'),
              )),
        ],
      ),
    );
  }
}

class _HeaderButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;

  const _HeaderButton({required this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 40,
        height: 40,
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.15),
          borderRadius: BorderRadius.circular(12),
        ),
        alignment: Alignment.center,
        child: Icon(icon, color: Colors.white, size: 20),
      ),
    );
  }
}

class _SummaryCard extends StatelessWidget {
  final String title;
  final String amount;
  final Color amountColor;
  final IconData icon;
  final Color iconColor;
  final Color borderColor;
  final AppColors colors;
  final bool isDark;

  const _SummaryCard({
    required this.title,
    required this.amount,
    required this.amountColor,
    required this.icon,
    required this.iconColor,
    required this.borderColor,
    required this.colors,
    required this.isDark,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: isDark ? colors.glass : colors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border(top: BorderSide(color: borderColor, width: 3)),
        boxShadow: [
          BoxShadow(
            color: colors.cardShadow.withOpacity(isDark ? 0.3 : 0.08),
            offset: const Offset(0, 4),
            blurRadius: 12,
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 32,
            height: 32,
            decoration: BoxDecoration(
              color: iconColor.withOpacity(0.15),
              borderRadius: BorderRadius.circular(8),
            ),
            alignment: Alignment.center,
            child: Icon(icon, color: iconColor, size: 18),
          ),
          const SizedBox(height: 8),
          Text(
            title,
            style: TextStyle(fontSize: 11, fontWeight: FontWeight.w500, color: colors.textSecondary),
          ),
          const SizedBox(height: 4),
          Text(
            amount,
            style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: amountColor),
          ),
        ],
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String number;
  final String label;
  final IconData icon;
  final Color iconColor;
  final AppColors colors;
  final bool isDark;
  final VoidCallback onTap;

  const _StatCard({
    required this.number,
    required this.label,
    required this.icon,
    required this.iconColor,
    required this.colors,
    required this.isDark,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: isDark ? colors.glass : colors.surface,
          borderRadius: BorderRadius.circular(16),
          border: isDark ? Border.all(color: colors.glassBorder) : null,
          boxShadow: [
            BoxShadow(
              color: colors.cardShadow.withOpacity(isDark ? 0.2 : 0.05),
              offset: const Offset(0, 2),
              blurRadius: 8,
            ),
          ],
        ),
        alignment: Alignment.center,
        child: Column(
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: iconColor.withOpacity(0.15),
                borderRadius: BorderRadius.circular(12),
              ),
              alignment: Alignment.center,
              child: Icon(icon, color: iconColor, size: 22),
            ),
            const SizedBox(height: 10),
            Text(
              number,
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: colors.text),
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(fontSize: 11, color: colors.textSecondary),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}

class _QuickActionBtn extends StatelessWidget {
  final String label;
  final IconData icon;
  final Color iconBgColor;
  final AppColors colors;
  final bool isDark;
  final VoidCallback onTap;

  const _QuickActionBtn({
    required this.label,
    required this.icon,
    required this.iconBgColor,
    required this.colors,
    required this.isDark,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isDark ? colors.glass : colors.surface,
          borderRadius: BorderRadius.circular(16),
          border: isDark ? Border.all(color: colors.glassBorder) : null,
          boxShadow: [
            BoxShadow(
              color: colors.cardShadow.withOpacity(isDark ? 0.2 : 0.05),
              offset: const Offset(0, 2),
              blurRadius: 8,
            ),
          ],
        ),
        alignment: Alignment.center,
        child: Column(
          children: [
            Container(
              width: 52,
              height: 52,
              decoration: BoxDecoration(
                color: iconBgColor,
                borderRadius: BorderRadius.circular(14),
              ),
              alignment: Alignment.center,
              child: Icon(icon, color: Colors.white, size: 22),
            ),
            const SizedBox(height: 10),
            Text(
              label,
              style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: colors.text),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}

class _AssessmentCard extends StatelessWidget {
  final Assessment assessment;
  final AppColors colors;
  final bool isDark;
  final VoidCallback onTap;

  const _AssessmentCard({
    required this.assessment,
    required this.colors,
    required this.isDark,
    required this.onTap,
  });

  Color _getStatusColor() {
    switch (assessment.status) {
      case AssessmentStatus.overdue:
        return colors.danger;
      case AssessmentStatus.paid:
        return colors.success;
      case AssessmentStatus.partial:
        return colors.statusPartial;
      case AssessmentStatus.unpaid:
      default:
        return colors.warning;
    }
  }

  @override
  Widget build(BuildContext context) {
    final statusColor = _getStatusColor();
    final NumberFormat currencyFormatter = NumberFormat.currency(locale: 'fr_CM', symbol: 'FCFA ', decimalDigits: 0);
    final remaining = assessment.amount - assessment.amountPaid;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(14),
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
              width: 10,
              height: 10,
              margin: const EdgeInsets.only(right: 12),
              decoration: BoxDecoration(
                color: statusColor,
                shape: BoxShape.circle,
              ),
            ),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    assessment.referenceNumber,
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: colors.text),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    assessment.description,
                    style: TextStyle(fontSize: 12, color: colors.textSecondary),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    assessment.businessName,
                    style: TextStyle(fontSize: 11, color: colors.textLight),
                  ),
                ],
              ),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  currencyFormatter.format(remaining),
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: colors.text),
                ),
                const SizedBox(height: 2),
                Text(
                  assessment.status.name[0].toUpperCase() + assessment.status.name.substring(1),
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.w500, color: statusColor),
                ),
              ],
            ),
            const SizedBox(width: 8),
            Icon(LucideIcons.chevronRight, size: 16, color: colors.textLight),
          ],
        ),
      ),
    );
  }
}
