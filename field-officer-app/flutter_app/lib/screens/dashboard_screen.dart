import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:intl/intl.dart';
import '../state/app_state.dart';
import '../state/theme_state.dart';
import 'defaulters_screen.dart';
import 'record_payment_screen.dart';
import 'create_invoice_screen.dart';
import 'create_log_screen.dart';
import 'receipt_screen.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  String _getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }

  String _formatCurrency(double amount) {
    final formatter = NumberFormat.currency(symbol: '', decimalDigits: 0);
    return '${formatter.format(amount).trim()} FCFA';
  }

  @override
  Widget build(BuildContext context) {
    final themeState = Provider.of<ThemeState>(context);
    final appState = Provider.of<AppState>(context);
    final colors = themeState.colors;
    final stats = appState.stats;

    final progressPercentage = stats.dailyTarget > 0
        ? (stats.todayCollections / stats.dailyTarget * 100).clamp(0.0, 100.0)
        : 0.0;

    final todayDate = DateFormat('EEE, MMM d').format(DateTime.now());

    final recentPayments = appState.payments.take(3).toList();
    final recentVisits = appState.visitLogs.take(2).toList();

    return Scaffold(
      body: Stack(
        children: [
          // Background Gradient header
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            height: 300,
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [colors.gradientStart, colors.gradientMid, colors.gradientEnd],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
              ),
            ),
          ),
          SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.only(bottom: 30),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Header
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              _getGreeting(),
                              style: TextStyle(
                                fontSize: 14,
                                color: colors.textSecondary,
                                letterSpacing: 0.3,
                              ),
                            ),
                            Text(
                              'Officer Onana',
                              style: TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.w700,
                                color: colors.text,
                                letterSpacing: -0.4,
                              ),
                            ),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                          decoration: BoxDecoration(
                            color: colors.glass,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: colors.glassBorder),
                          ),
                          child: Text(
                            todayDate,
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: colors.primary,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 10),

                  // Target Card
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.15),
                            blurRadius: 14,
                            offset: const Offset(0, 6),
                          ),
                        ],
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(16),
                        child: Container(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: themeState.isDarkMode
                                  ? [const Color(0xFF0A2647), const Color(0xFF0A84FF)]
                                  : [const Color(0xFF004C99), const Color(0xFF0066CC)],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            ),
                            border: themeState.isDarkMode
                                ? Border.all(color: colors.primary.withOpacity(0.18))
                                : null,
                          ),
                          padding: const EdgeInsets.all(20),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      const Text(
                                        "Today's Collection",
                                        style: TextStyle(
                                          fontSize: 13,
                                          color: Colors.white70,
                                          fontWeight: FontWeight.w500,
                                          letterSpacing: 0.3,
                                        ),
                                      ),
                                      const SizedBox(height: 6),
                                      Text(
                                        _formatCurrency(stats.todayCollections),
                                        style: const TextStyle(
                                          fontSize: 32,
                                          fontWeight: FontWeight.w700,
                                          color: Colors.white,
                                          letterSpacing: -0.8,
                                        ),
                                      ),
                                    ],
                                  ),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                    decoration: BoxDecoration(
                                      color: Colors.white.withOpacity(0.25),
                                      borderRadius: BorderRadius.circular(20),
                                    ),
                                    child: Row(
                                      children: [
                                        const Icon(LucideIcons.trendingUp, size: 14, color: Colors.white),
                                        const SizedBox(width: 4),
                                        Text(
                                          "${progressPercentage.toStringAsFixed(0)}%",
                                          style: const TextStyle(
                                            fontSize: 13,
                                            fontWeight: FontWeight.w600,
                                            color: Colors.white,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 20),
                              // Progress Bar with TweenAnimation
                              Container(
                                height: 8,
                                decoration: BoxDecoration(
                                  color: Colors.white.withOpacity(0.25),
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: LayoutBuilder(
                                  builder: (context, constraints) {
                                    return TweenAnimationBuilder<double>(
                                      tween: Tween<double>(begin: 0, end: progressPercentage / 100),
                                      duration: const Duration(milliseconds: 1200),
                                      builder: (context, value, _) {
                                        return Stack(
                                          children: [
                                            Container(
                                              width: constraints.maxWidth * value,
                                              decoration: BoxDecoration(
                                                color: Colors.white,
                                                borderRadius: BorderRadius.circular(4),
                                              ),
                                            ),
                                          ],
                                        );
                                      },
                                    );
                                  },
                                ),
                              ),
                              const SizedBox(height: 14),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    "Target: ${_formatCurrency(stats.dailyTarget)}",
                                    style: const TextStyle(
                                      fontSize: 13,
                                      color: Colors.white70,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                  Text(
                                    stats.todayCollections >= stats.dailyTarget
                                        ? '✓ Target reached!'
                                        : '${_formatCurrency(stats.dailyTarget - stats.todayCollections)} to go',
                                    style: const TextStyle(
                                      fontSize: 13,
                                      color: Colors.white,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 28),

                  // Quick Actions
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 20),
                        child: Text(
                          "QUICK ACTIONS",
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: colors.textSecondary,
                            letterSpacing: 0.5,
                          ),
                        ),
                      ),
                      const SizedBox(height: 14),
                      SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: Row(
                          children: [
                            _buildQuickAction(
                              icon: LucideIcons.search,
                              label: 'Search',
                              color: colors.primary,
                              onTap: () => appState.setTab(1),
                              colors: colors,
                            ),
                            _buildQuickAction(
                              icon: LucideIcons.qrCode,
                              label: 'Scan QR',
                              color: colors.primaryDark,
                              onTap: () => appState.setTab(1),
                              colors: colors,
                            ),
                            _buildQuickAction(
                              icon: LucideIcons.receipt,
                              label: 'Payment',
                              color: colors.success,
                              onTap: () => Navigator.push(
                                context,
                                MaterialPageRoute(builder: (_) => const RecordPaymentScreen()),
                              ),
                              colors: colors,
                            ),
                            _buildQuickAction(
                              icon: LucideIcons.fileText,
                              label: 'Invoice',
                              color: colors.accent,
                              onTap: () => Navigator.push(
                                context,
                                MaterialPageRoute(builder: (_) => const CreateInvoiceScreen()),
                              ),
                              colors: colors,
                            ),
                            _buildQuickAction(
                              icon: LucideIcons.clipboardList,
                              label: 'Log Visit',
                              color: colors.danger,
                              onTap: () => Navigator.push(
                                context,
                                MaterialPageRoute(builder: (_) => const CreateLogScreen()),
                              ),
                              colors: colors,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 24),

                  // Today's Overview Grid
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "TODAY'S OVERVIEW",
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: colors.textSecondary,
                            letterSpacing: 0.5,
                          ),
                        ),
                        const SizedBox(height: 14),
                        Row(
                          children: [
                            Expanded(
                              child: _buildStatCard(
                                icon: LucideIcons.users,
                                value: stats.totalVisits.toString(),
                                label: 'Visits',
                                color: colors.primary,
                                onTap: () => appState.setTab(3),
                                colors: colors,
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: _buildStatCard(
                                icon: LucideIcons.checkCircle,
                                value: stats.successfulCollections.toString(),
                                label: 'Collected',
                                color: colors.success,
                                onTap: () => appState.setTab(2),
                                colors: colors,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        Row(
                          children: [
                            Expanded(
                              child: _buildStatCard(
                                icon: LucideIcons.clock,
                                value: stats.pendingPayments.toString(),
                                label: 'Pending',
                                color: colors.warning,
                                onTap: () => appState.setTab(2),
                                colors: colors,
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: _buildStatCard(
                                icon: LucideIcons.alertTriangle,
                                value: stats.defaultersCount.toString(),
                                label: 'Defaulters',
                                color: colors.danger,
                                onTap: () => Navigator.push(
                                  context,
                                  MaterialPageRoute(builder: (_) => const DefaultersScreen()),
                                ),
                                colors: colors,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Recent Payments Card Feed
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: Container(
                      decoration: BoxDecoration(
                        color: colors.cardBg,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: colors.glassBorder),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.08),
                            blurRadius: 12,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                "Recent Payments",
                                style: TextStyle(
                                  fontSize: 17,
                                  fontWeight: FontWeight.w600,
                                  color: colors.text,
                                ),
                              ),
                              TextButton(
                                onPressed: () => appState.setTab(2),
                                child: Row(
                                  children: [
                                    Text(
                                      "View All",
                                      style: TextStyle(
                                        fontSize: 13,
                                        fontWeight: FontWeight.w500,
                                        color: colors.primary,
                                      ),
                                    ),
                                    Icon(LucideIcons.chevronRight, size: 16, color: colors.primary),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 10),
                          recentPayments.isEmpty
                              ? Center(
                                  child: Padding(
                                    padding: const EdgeInsets.symmetric(vertical: 20),
                                    child: Text(
                                      "No payments recorded today",
                                      style: TextStyle(
                                        fontSize: 13,
                                        color: colors.textLight,
                                      ),
                                    ),
                                  ),
                                )
                              : ListView.separated(
                                  shrinkWrap: true,
                                  physics: const NeverScrollableScrollPhysics(),
                                  itemCount: recentPayments.length,
                                  separatorBuilder: (_, __) => Divider(color: colors.border),
                                  itemBuilder: (context, index) {
                                    final payment = recentPayments[index];
                                    final isConfirmed = payment.status == 'confirmed';

                                    return ListTile(
                                      contentPadding: EdgeInsets.zero,
                                      onTap: () => Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                          builder: (_) => ReceiptScreen(paymentId: payment.id),
                                        ),
                                      ),
                                      leading: Container(
                                        width: 4,
                                        height: 36,
                                        decoration: BoxDecoration(
                                          color: isConfirmed ? colors.success : colors.warning,
                                          borderRadius: BorderRadius.circular(2),
                                        ),
                                      ),
                                      title: Text(
                                        payment.taxpayerName,
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                        style: TextStyle(
                                          fontSize: 15,
                                          fontWeight: FontWeight.w600,
                                          color: colors.text,
                                        ),
                                      ),
                                      subtitle: Text(
                                        payment.time,
                                        style: TextStyle(
                                          fontSize: 12,
                                          color: colors.textSecondary,
                                        ),
                                      ),
                                      trailing: Column(
                                        mainAxisAlignment: MainAxisAlignment.center,
                                        crossAxisAlignment: CrossAxisAlignment.end,
                                        children: [
                                          Text(
                                            _formatCurrency(payment.amount),
                                            style: TextStyle(
                                              fontSize: 15,
                                              fontWeight: FontWeight.w700,
                                              color: colors.text,
                                            ),
                                          ),
                                          const SizedBox(height: 4),
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                                            decoration: BoxDecoration(
                                              color: isConfirmed
                                                  ? colors.success.withOpacity(0.15)
                                                  : colors.warning.withOpacity(0.15),
                                              borderRadius: BorderRadius.circular(20),
                                            ),
                                            child: Text(
                                              payment.status.toUpperCase(),
                                              style: TextStyle(
                                                fontSize: 10,
                                                fontWeight: FontWeight.w600,
                                                color: isConfirmed ? colors.success : colors.warning,
                                                letterSpacing: 0.3,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                    );
                                  },
                                ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Recent Visits Card Feed
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: Container(
                      decoration: BoxDecoration(
                        color: colors.cardBg,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: colors.glassBorder),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.08),
                            blurRadius: 12,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                "Recent Visits",
                                style: TextStyle(
                                  fontSize: 17,
                                  fontWeight: FontWeight.w600,
                                  color: colors.text,
                                ),
                              ),
                              TextButton(
                                onPressed: () => appState.setTab(3),
                                child: Row(
                                  children: [
                                    Text(
                                      "View All",
                                      style: TextStyle(
                                        fontSize: 13,
                                        fontWeight: FontWeight.w500,
                                        color: colors.primary,
                                      ),
                                    ),
                                    Icon(LucideIcons.chevronRight, size: 16, color: colors.primary),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 10),
                          recentVisits.isEmpty
                              ? Center(
                                  child: Padding(
                                    padding: const EdgeInsets.symmetric(vertical: 20),
                                    child: Text(
                                      "No visits logged today",
                                      style: TextStyle(
                                        fontSize: 13,
                                        color: colors.textLight,
                                      ),
                                    ),
                                  ),
                                )
                              : ListView.separated(
                                  shrinkWrap: true,
                                  physics: const NeverScrollableScrollPhysics(),
                                  itemCount: recentVisits.length,
                                  separatorBuilder: (_, __) => Divider(color: colors.border),
                                  itemBuilder: (context, index) {
                                    final visit = recentVisits[index];
                                    final isSuccess = visit.outcome == 'successful';

                                    return Padding(
                                      padding: const EdgeInsets.symmetric(vertical: 8),
                                      child: Row(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Container(
                                            width: 4,
                                            height: 48,
                                            decoration: BoxDecoration(
                                              color: isSuccess ? colors.success : colors.warning,
                                              borderRadius: BorderRadius.circular(2),
                                            ),
                                          ),
                                          const SizedBox(width: 12),
                                          Expanded(
                                            child: Column(
                                              crossAxisAlignment: CrossAxisAlignment.start,
                                              children: [
                                                Text(
                                                  visit.taxpayerName,
                                                  maxLines: 1,
                                                  overflow: TextOverflow.ellipsis,
                                                  style: TextStyle(
                                                    fontSize: 15,
                                                    fontWeight: FontWeight.w600,
                                                    color: colors.text,
                                                  ),
                                                ),
                                                const SizedBox(height: 4),
                                                Text(
                                                  visit.address,
                                                  maxLines: 1,
                                                  overflow: TextOverflow.ellipsis,
                                                  style: TextStyle(
                                                    fontSize: 13,
                                                    color: colors.textSecondary,
                                                  ),
                                                ),
                                                const SizedBox(height: 6),
                                                Row(
                                                  children: [
                                                    Text(
                                                      visit.time,
                                                      style: TextStyle(
                                                        fontSize: 11,
                                                        color: colors.textLight,
                                                      ),
                                                    ),
                                                    Container(
                                                      width: 3,
                                                      height: 3,
                                                      margin: const EdgeInsets.symmetric(horizontal: 6),
                                                      decoration: BoxDecoration(
                                                        color: colors.textLight,
                                                        shape: BoxShape.circle,
                                                      ),
                                                    ),
                                                    Text(
                                                      visit.purpose,
                                                      style: TextStyle(
                                                        fontSize: 11,
                                                        color: colors.textLight,
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                              ],
                                            ),
                                          ),
                                          const SizedBox(width: 8),
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                                            decoration: BoxDecoration(
                                              color: isSuccess
                                                  ? colors.success.withOpacity(0.15)
                                                  : colors.warning.withOpacity(0.15),
                                              borderRadius: BorderRadius.circular(20),
                                            ),
                                            child: Text(
                                              isSuccess ? 'Success' : 'Follow-up',
                                              style: TextStyle(
                                                fontSize: 10,
                                                fontWeight: FontWeight.w600,
                                                color: isSuccess ? colors.success : colors.warning,
                                                letterSpacing: 0.3,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                    );
                                  },
                                ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickAction({
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onTap,
    required AppColors colors,
  }) {
    return Container(
      width: 72,
      margin: const EdgeInsets.symmetric(horizontal: 4),
      child: GestureDetector(
        onTap: onTap,
        child: Column(
          children: [
            Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                color: color.withOpacity(0.15),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: colors.glassBorder),
              ),
              child: Icon(icon, size: 22, color: color),
            ),
            const SizedBox(height: 8),
            Text(
              label,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w500,
                color: colors.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard({
    required IconData icon,
    required String value,
    required String label,
    required Color color,
    required VoidCallback onTap,
    required AppColors colors,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: colors.cardBg,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: colors.glassBorder),
        ),
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: color.withOpacity(0.15),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(icon, size: 18, color: color),
            ),
            const SizedBox(height: 12),
            Text(
              value,
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w700,
                color: colors.text,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              label,
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w500,
                color: colors.textSecondary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
