import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../state/app_state.dart';
import '../state/theme_state.dart';
import 'create_log_screen.dart';

class LogsScreen extends StatelessWidget {
  const LogsScreen({super.key});

  String _capitalizeOutcome(String outcome) {
    return outcome
        .split('-')
        .map((word) => word.isEmpty ? '' : '${word[0].toUpperCase()}${word.substring(1)}')
        .join(' ');
  }

  Widget _getOutcomeIcon(String outcome, AppColors colors) {
    switch (outcome.toLowerCase()) {
      case 'successful':
        return Icon(LucideIcons.checkCircle, size: 16, color: colors.success);
      case 'not-available':
        return Icon(LucideIcons.xCircle, size: 16, color: colors.warning);
      case 'refused':
        return Icon(LucideIcons.alertCircle, size: 16, color: colors.danger);
      case 'rescheduled':
        return Icon(LucideIcons.calendar, size: 16, color: colors.primary);
      default:
        return Icon(LucideIcons.info, size: 16, color: colors.textSecondary);
    }
  }

  Color _getOutcomeColor(String outcome, AppColors colors) {
    switch (outcome.toLowerCase()) {
      case 'successful':
        return colors.success;
      case 'not-available':
        return colors.warning;
      case 'refused':
        return colors.danger;
      case 'rescheduled':
        return colors.primary;
      default:
        return colors.textSecondary;
    }
  }

  String _getPurposeLabel(String purpose) {
    switch (purpose.toLowerCase()) {
      case 'collection':
        return 'Payment Collection';
      case 'inspection':
        return 'Site Inspection';
      case 'verification':
        return 'Document Verification';
      case 'follow-up':
        return 'Follow-up Visit';
      default:
        return purpose;
    }
  }

  @override
  Widget build(BuildContext context) {
    final themeState = Provider.of<ThemeState>(context);
    final appState = Provider.of<AppState>(context);
    final colors = themeState.colors;
    final visitLogs = appState.visitLogs;

    final totalVisits = visitLogs.length;
    final successfulVisits = visitLogs.where((l) => l.outcome == 'successful').length;
    final notAvailableVisits = visitLogs.where((l) => l.outcome == 'not-available').length;

    return Scaffold(
      body: Stack(
        children: [
          // Background Gradient header
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            height: 280,
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: colors.headerGradient,
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
              ),
            ),
          ),
          SafeArea(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            "Visit Logs",
                            style: TextStyle(
                              fontSize: 28,
                              fontWeight: FontWeight.w700,
                              color: Colors.white,
                              letterSpacing: -0.4,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            "Inspection and visit records",
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.white.withOpacity(0.8),
                            ),
                          ),
                        ],
                      ),
                      GestureDetector(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => const CreateLogScreen()),
                          );
                        },
                        child: Container(
                          width: 48,
                          height: 48,
                          decoration: BoxDecoration(
                            color: colors.inputBg,
                            borderRadius: BorderRadius.circular(14),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.2),
                                blurRadius: 8,
                                offset: const Offset(0, 4),
                              ),
                            ],
                          ),
                          child: Icon(LucideIcons.plus, color: colors.primary, size: 22),
                        ),
                      ),
                    ],
                  ),
                ),

                // Summary stats row
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Row(
                    children: [
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.25),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: Colors.white.withOpacity(0.3)),
                          ),
                          child: Column(
                            children: [
                              Text(
                                totalVisits.toString(),
                                style: const TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.w700,
                                  color: Colors.white,
                                ),
                              ),
                              const SizedBox(height: 4),
                              const Text(
                                "Total Visits",
                                style: TextStyle(
                                  fontSize: 11,
                                  color: Colors.white70,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: themeState.isDarkMode
                                ? colors.success.withOpacity(0.2)
                                : Colors.white.withOpacity(0.25),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(
                              color: themeState.isDarkMode
                                  ? colors.success.withOpacity(0.4)
                                  : Colors.white.withOpacity(0.3),
                            ),
                          ),
                          child: Column(
                            children: [
                              Text(
                                successfulVisits.toString(),
                                style: TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.w700,
                                  color: themeState.isDarkMode ? colors.success : Colors.white,
                                ),
                              ),
                              const SizedBox(height: 4),
                              const Text(
                                "Successful",
                                style: TextStyle(
                                  fontSize: 11,
                                  color: Colors.white70,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: themeState.isDarkMode
                                ? colors.warning.withOpacity(0.2)
                                : Colors.white.withOpacity(0.25),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(
                              color: themeState.isDarkMode
                                  ? colors.warning.withOpacity(0.4)
                                  : Colors.white.withOpacity(0.3),
                            ),
                          ),
                          child: Column(
                            children: [
                              Text(
                                notAvailableVisits.toString(),
                                style: TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.w700,
                                  color: themeState.isDarkMode ? colors.warning : Colors.white,
                                ),
                              ),
                              const SizedBox(height: 4),
                              const Text(
                                "Not Available",
                                style: TextStyle(
                                  fontSize: 11,
                                  color: Colors.white70,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // List Container
                Expanded(
                  child: Container(
                    decoration: BoxDecoration(
                      color: colors.background,
                      borderRadius: const BorderRadius.only(
                        topLeft: Radius.circular(28),
                        topRight: Radius.circular(28),
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.1),
                          blurRadius: 12,
                          offset: const Offset(0, -4),
                        ),
                      ],
                    ),
                    child: ClipRRect(
                      borderRadius: const BorderRadius.only(
                        topLeft: Radius.circular(28),
                        topRight: Radius.circular(28),
                      ),
                      child: visitLogs.isEmpty
                          ? Center(
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(LucideIcons.mapPin, size: 48, color: colors.textLight),
                                  const SizedBox(height: 12),
                                  Text(
                                    "No visit logs yet",
                                    style: TextStyle(
                                      fontSize: 15,
                                      color: colors.textSecondary,
                                    ),
                                  ),
                                ],
                              ),
                            )
                          : ListView.separated(
                              padding: const EdgeInsets.all(20),
                              itemCount: visitLogs.length,
                              separatorBuilder: (_, __) => const SizedBox(height: 12),
                              itemBuilder: (context, index) {
                                final log = visitLogs[index];

                                return Container(
                                  decoration: BoxDecoration(
                                    color: colors.cardBg,
                                    borderRadius: BorderRadius.circular(16),
                                    border: Border.all(color: colors.glassBorder),
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.black.withOpacity(0.05),
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
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                                            decoration: BoxDecoration(
                                              color: colors.primary.withOpacity(0.15),
                                              borderRadius: BorderRadius.circular(20),
                                            ),
                                            child: Text(
                                              _getPurposeLabel(log.purpose),
                                              style: TextStyle(
                                                fontSize: 12,
                                                fontWeight: FontWeight.w500,
                                                color: colors.primary,
                                              ),
                                            ),
                                          ),
                                          Row(
                                            children: [
                                              _getOutcomeIcon(log.outcome, colors),
                                              const SizedBox(width: 4),
                                              Text(
                                                _capitalizeOutcome(log.outcome),
                                                style: TextStyle(
                                                  fontSize: 12,
                                                  fontWeight: FontWeight.w500,
                                                  color: _getOutcomeColor(log.outcome, colors),
                                                ),
                                              ),
                                            ],
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 14),
                                      Text(
                                        log.taxpayerName,
                                        style: TextStyle(
                                          fontSize: 17,
                                          fontWeight: FontWeight.w600,
                                          color: colors.text,
                                        ),
                                      ),
                                      const SizedBox(height: 10),
                                      Row(
                                        children: [
                                          Icon(LucideIcons.mapPin, size: 14, color: colors.textSecondary),
                                          const SizedBox(width: 8),
                                          Expanded(
                                            child: Text(
                                              log.address,
                                              style: TextStyle(
                                                fontSize: 13,
                                                color: colors.textSecondary,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 6),
                                      Row(
                                        children: [
                                          Icon(LucideIcons.clock, size: 14, color: colors.textSecondary),
                                          const SizedBox(width: 8),
                                          Text(
                                            "${log.date} at ${log.time}",
                                            style: TextStyle(
                                              fontSize: 13,
                                              color: colors.textSecondary,
                                            ),
                                          ),
                                        ],
                                      ),
                                      if (log.notes.isNotEmpty) ...[
                                        const SizedBox(height: 12),
                                        Container(
                                          width: double.infinity,
                                          padding: const EdgeInsets.all(12),
                                          decoration: BoxDecoration(
                                            color: colors.surfaceAlt,
                                            borderRadius: BorderRadius.circular(12),
                                          ),
                                          child: Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              Text(
                                                "Notes",
                                                style: TextStyle(
                                                  fontSize: 11,
                                                  color: colors.textSecondary,
                                                ),
                                              ),
                                              const SizedBox(height: 4),
                                              Text(
                                                log.notes,
                                                style: TextStyle(
                                                  fontSize: 13,
                                                  height: 1.4,
                                                  color: colors.text,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ],
                                    ],
                                  ),
                                );
                              },
                            ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
