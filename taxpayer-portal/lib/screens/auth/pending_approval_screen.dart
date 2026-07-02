import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import '../../core/auth/auth_state.dart';
import '../../core/theme/app_theme.dart';

class PendingApprovalScreen extends StatelessWidget {
  const PendingApprovalScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = context.watch<ThemeProvider>();
    final auth = context.watch<AuthState>();
    final colors = theme.colors;

    return Scaffold(
      backgroundColor: colors.background,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 48),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Logo
                Container(
                  width: 72, height: 72,
                  decoration: BoxDecoration(
                    color: colors.primary,
                    borderRadius: BorderRadius.circular(22),
                    boxShadow: [BoxShadow(color: colors.primary.withValues(alpha: 0.3), blurRadius: 24, offset: const Offset(0, 8))],
                  ),
                  child: const Icon(LucideIcons.building2, color: Colors.white, size: 32),
                ),
                const SizedBox(height: 24),
                Text('TaxMS Portal', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: colors.text)),
                const SizedBox(height: 4),
                Text('Government Revenue Authority', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: colors.textSecondary)),

                const SizedBox(height: 48),

                // Status card
                Container(
                  padding: const EdgeInsets.all(32),
                  decoration: BoxDecoration(
                    color: colors.surface,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: const Color(0xFFFF9500).withValues(alpha: 0.3)),
                    boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.06), blurRadius: 24, offset: const Offset(0, 8))],
                  ),
                  child: Column(children: [
                    Container(
                      width: 64, height: 64,
                      decoration: BoxDecoration(
                        color: const Color(0xFFFF9500).withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Icon(LucideIcons.clock, size: 32, color: Color(0xFFFF9500)),
                    ),
                    const SizedBox(height: 20),
                    Text('Registration Pending', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: colors.text)),
                    const SizedBox(height: 8),
                    Text(
                      'Your taxpayer account is awaiting approval from a Tax Administrator. You will have full access once your registration is approved.',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 13, color: colors.textSecondary, height: 1.5),
                    ),
                    const SizedBox(height: 24),

                    // User info
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: colors.background,
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                        _infoRow(colors, 'Name', auth.currentUserName ?? '—'),
                        const SizedBox(height: 8),
                        _infoRow(colors, 'TIN', auth.currentUserTin ?? '—'),
                        const SizedBox(height: 8),
                        _infoRow(colors, 'Status', 'PENDING APPROVAL'),
                      ]),
                    ),

                    const SizedBox(height: 24),

                    // Refresh button
                    SizedBox(
                      width: double.infinity, height: 50,
                      child: ElevatedButton.icon(
                        onPressed: () async {
                          await auth.refreshStatus();
                        },
                        icon: const Icon(LucideIcons.refreshCw, size: 18),
                        label: const Text('Check Approval Status', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700)),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: colors.primary,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          elevation: 0,
                        ),
                      ),
                    ),
                  ]),
                ),

                const SizedBox(height: 24),

                // Logout
                TextButton.icon(
                  onPressed: () => auth.logout(),
                  icon: Icon(LucideIcons.logOut, size: 16, color: colors.textSecondary),
                  label: Text('Sign Out', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: colors.textSecondary)),
                ),

                const SizedBox(height: 32),
                Text('© 2026 Government Revenue Authority (GRA)', style: TextStyle(fontSize: 10, color: colors.textLight)),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _infoRow(AppColors colors, String label, String value) {
    return Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
      Text(label, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: colors.textSecondary)),
      Text(value, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: colors.text)),
    ]);
  }
}
