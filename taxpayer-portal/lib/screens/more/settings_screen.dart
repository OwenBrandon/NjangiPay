import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';

import '../../core/auth/auth_state.dart';
import '../../core/theme/app_theme.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _notificationsEnabled = true;
  bool _biometricsEnabled = false;

  void _showComingSoon(String title) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(title),
        content: const Text('This feature is coming soon.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final themeProvider = context.watch<ThemeProvider>();
    final colors = themeProvider.colors;
    final themeMode = themeProvider.themeMode;

    return Scaffold(
      backgroundColor: colors.background,
      appBar: AppBar(
        title: Text('Settings', style: TextStyle(color: colors.text)),
        backgroundColor: colors.surface,
        elevation: 0,
        iconTheme: IconThemeData(color: colors.text),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16).copyWith(bottom: 40),
        children: [
          _buildSectionTitle('Appearance', colors),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: colors.surface,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(color: colors.primary.withOpacity(0.05), blurRadius: 8, offset: const Offset(0, 2)),
              ],
            ),
            child: Row(
              children: [
                _buildThemeOption(ThemeMode.light, 'Light', LucideIcons.sun, themeMode, themeProvider, colors),
                const SizedBox(width: 10),
                _buildThemeOption(ThemeMode.dark, 'Dark', LucideIcons.moon, themeMode, themeProvider, colors),
                const SizedBox(width: 10),
                _buildThemeOption(ThemeMode.system, 'System', LucideIcons.smartphone, themeMode, themeProvider, colors),
              ],
            ),
          ),
          const SizedBox(height: 24),
          _buildSectionTitle('Preferences', colors),
          Container(
            decoration: BoxDecoration(
              color: colors.surface,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(color: colors.primary.withOpacity(0.05), blurRadius: 8, offset: const Offset(0, 2)),
              ],
            ),
            child: Column(
              children: [
                _buildSwitchRow(LucideIcons.bell, 'Push Notifications', 'Receive payment reminders', colors.warning, _notificationsEnabled, (v) => setState(() => _notificationsEnabled = v), colors),
                Container(height: 1, color: colors.border),
                _buildSwitchRow(LucideIcons.lock, 'Biometric Login', 'Use Face ID or fingerprint', colors.success, _biometricsEnabled, (v) => setState(() => _biometricsEnabled = v), colors),
              ],
            ),
          ),
          const SizedBox(height: 24),
          _buildSectionTitle('General', colors),
          Container(
            decoration: BoxDecoration(
              color: colors.surface,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(color: colors.primary.withOpacity(0.05), blurRadius: 8, offset: const Offset(0, 2)),
              ],
            ),
            child: Column(
              children: [
                _buildLinkRow(LucideIcons.globe, 'Language', 'Change app language', colors.info, 'English', () => _showComingSoon('Language'), colors),
                Container(height: 1, color: colors.border),
                _buildLinkRow(LucideIcons.helpCircle, 'Help Center', 'FAQs and support', colors.secondary, null, () => _showComingSoon('Help Center'), colors),
              ],
            ),
          ),
          const SizedBox(height: 24),
          Container(
            padding: const EdgeInsets.symmetric(vertical: 20),
            decoration: BoxDecoration(
              color: colors.surface,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(color: colors.primary.withOpacity(0.05), blurRadius: 8, offset: const Offset(0, 2)),
              ],
            ),
            child: Column(
              children: [
                Icon(LucideIcons.info, size: 24, color: colors.textLight),
                const SizedBox(height: 8),
                Text('Taxpayer Portal', style: TextStyle(fontSize: 14, color: colors.textSecondary)),
                const SizedBox(height: 4),
                Text('Version 1.0.0 (Build 1)', style: TextStyle(fontSize: 12, color: colors.textLight)),
              ],
            ),
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            height: 50,
            child: ElevatedButton.icon(
              onPressed: () async {
                await context.read<AuthState>().logout();
                if (context.mounted) context.go('/sign-in');
              },
              icon: const Icon(LucideIcons.logOut, size: 18),
              label: const Text('Sign Out', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700)),
              style: ElevatedButton.styleFrom(
                backgroundColor: colors.danger.withValues(alpha: 0.1),
                foregroundColor: colors.danger,
                elevation: 0,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title, AppColors colors) {
    return Padding(
      padding: const EdgeInsets.only(left: 4, bottom: 10),
      child: Text(
        title.toUpperCase(),
        style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: colors.textSecondary, letterSpacing: 0.5),
      ),
    );
  }

  Widget _buildThemeOption(ThemeMode mode, String label, IconData icon, ThemeMode currentMode, ThemeProvider themeProvider, AppColors colors) {
    final isActive = currentMode == mode;
    return Expanded(
      child: GestureDetector(
        onTap: () => themeProvider.setThemeMode(mode),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 12),
          decoration: BoxDecoration(
            color: isActive ? colors.primary.withOpacity(0.15) : colors.surfaceSecondary,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: isActive ? colors.primary : Colors.transparent, width: 2),
          ),
          child: Stack(
            clipBehavior: Clip.none,
            alignment: Alignment.center,
            children: [
              Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(color: isActive ? colors.primary : colors.background, shape: BoxShape.circle),
                    alignment: Alignment.center,
                    child: Icon(icon, size: 22, color: isActive ? Colors.white : colors.textSecondary),
                  ),
                  const SizedBox(height: 8),
                  Text(label, style: TextStyle(fontSize: 13, fontWeight: isActive ? FontWeight.w600 : FontWeight.w500, color: isActive ? colors.primary : colors.textSecondary)),
                ],
              ),
              if (isActive)
                Positioned(
                  top: -6,
                  right: -6,
                  child: Container(
                    width: 20,
                    height: 20,
                    decoration: BoxDecoration(color: colors.primary, shape: BoxShape.circle),
                    alignment: Alignment.center,
                    child: const Icon(LucideIcons.check, size: 12, color: Colors.white),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSwitchRow(IconData icon, String label, String subtitle, Color iconColor, bool value, Function(bool) onChanged, AppColors colors) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(color: iconColor.withOpacity(0.15), borderRadius: BorderRadius.circular(10)),
            alignment: Alignment.center,
            child: Icon(icon, size: 20, color: iconColor),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: TextStyle(fontSize: 15, fontWeight: FontWeight.w500, color: colors.text)),
                const SizedBox(height: 2),
                Text(subtitle, style: TextStyle(fontSize: 12, color: colors.textSecondary)),
              ],
            ),
          ),
          Switch(
            value: value,
            onChanged: onChanged,
            activeColor: colors.primary,
            activeTrackColor: colors.primary.withOpacity(0.5),
            inactiveTrackColor: colors.border,
            inactiveThumbColor: colors.textLight,
          )
        ],
      ),
    );
  }

  Widget _buildLinkRow(IconData icon, String label, String subtitle, Color iconColor, String? value, VoidCallback onTap, AppColors colors) {
    return GestureDetector(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(color: iconColor.withOpacity(0.15), borderRadius: BorderRadius.circular(10)),
              alignment: Alignment.center,
              child: Icon(icon, size: 20, color: iconColor),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(label, style: TextStyle(fontSize: 15, fontWeight: FontWeight.w500, color: colors.text)),
                  const SizedBox(height: 2),
                  Text(subtitle, style: TextStyle(fontSize: 12, color: colors.textSecondary)),
                ],
              ),
            ),
            if (value != null) ...[
              Text(value, style: TextStyle(fontSize: 14, color: colors.textSecondary)),
              const SizedBox(width: 8),
            ],
            Icon(LucideIcons.chevronRight, size: 18, color: colors.textLight),
          ],
        ),
      ),
    );
  }
}
