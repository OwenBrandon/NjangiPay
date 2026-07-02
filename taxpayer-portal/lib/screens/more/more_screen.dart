import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';

import '../../core/theme/app_theme.dart';
import '../../core/models/models.dart';
import '../../core/api/api_service.dart';
import '../../core/utils/auto_refresh_mixin.dart';

class MoreScreen extends StatefulWidget {
  const MoreScreen({super.key});

  @override
  State<MoreScreen> createState() => _MoreScreenState();
}

class _MoreScreenState extends State<MoreScreen> with AutoRefreshMixin {
  bool _isLoading = true;
  TaxpayerProfile _profile = TaxpayerProfile(id: '', name: '', email: '', phone: '', tin: '', address: '');
  List<AppNotification> _notifications = [];
  List<Dispute> _disputes = [];

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
        api.getNotifications(),
        api.getDisputes(),
      ]);
      setState(() {
        _profile = results[0] as TaxpayerProfile;
        _notifications = results[1] as List<AppNotification>;
        _disputes = results[2] as List<Dispute>;
        _isLoading = false;
      });
    } catch (e) {
      debugPrint('Error fetching data: $e');
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _handleLogout() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Sign Out'),
        content: const Text('Are you sure you want to sign out?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              // Handle sign out logic
            },
            child: const Text('Sign Out', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
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

    final unreadNotifications = _notifications.where((n) => !n.read).length;
    final activeDisputes = _disputes.where((d) => d.status == DisputeStatus.submitted || d.status == DisputeStatus.underReview).length;

    return Scaffold(
      backgroundColor: colors.background,
      appBar: AppBar(
        title: const Text('More', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 28)),
        backgroundColor: colors.primary,
        elevation: 0,
        centerTitle: false,
        toolbarHeight: 80,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16).copyWith(bottom: 32),
        children: [
          _buildProfileCard(colors, isDark),
          const SizedBox(height: 16),
          _buildSecurityBanner(colors),
          const SizedBox(height: 16),
          _buildMenuSection(colors, isDark, unreadNotifications, activeDisputes),
          const SizedBox(height: 16),
          GestureDetector(
            onTap: _handleLogout,
            child: Container(
              padding: const EdgeInsets.symmetric(vertical: 16),
              decoration: BoxDecoration(
                color: colors.danger.withOpacity(0.12),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: colors.danger.withOpacity(0.25)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(LucideIcons.logOut, size: 20, color: colors.danger),
                  const SizedBox(width: 10),
                  Text('Sign Out', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: colors.danger)),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          Text(
            'Version 1.0.0',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 12, color: colors.textLight),
          ),
        ],
      ),
    );
  }

  Widget _buildProfileCard(AppColors colors, bool isDark) {
    final initials = _profile.name.split(' ').take(2).map((e) => e.isNotEmpty ? e[0] : '').join().toUpperCase();

    return GestureDetector(
      onTap: () => context.go('/more/profile'),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isDark ? colors.glass : colors.surface,
          borderRadius: BorderRadius.circular(18),
          border: isDark ? Border.all(color: colors.glassBorder) : null,
          boxShadow: [
            BoxShadow(
              color: colors.cardShadow.withOpacity(isDark ? 0.25 : 0.08),
              offset: const Offset(0, 4),
              blurRadius: 12,
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              width: 60,
              height: 60,
              decoration: BoxDecoration(
                color: colors.primary,
                borderRadius: BorderRadius.circular(16),
              ),
              alignment: Alignment.center,
              child: Text(
                initials,
                style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white),
              ),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(_profile.name, style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600, color: colors.text)),
                  const SizedBox(height: 3),
                  Text(_profile.tin, style: TextStyle(fontSize: 13, color: colors.textSecondary)),
                ],
              ),
            ),
            Icon(LucideIcons.chevronRight, size: 22, color: colors.textLight),
          ],
        ),
      ),
    );
  }

  Widget _buildSecurityBanner(AppColors colors) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: colors.success.withOpacity(0.12),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: colors.success.withOpacity(0.25)),
      ),
      child: Row(
        children: [
          Icon(LucideIcons.shield, size: 20, color: colors.success),
          const SizedBox(width: 10),
          Text(
            'Your account is secure',
            style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: colors.success),
          ),
        ],
      ),
    );
  }

  Widget _buildMenuSection(AppColors colors, bool isDark, int unreadNotifications, int activeDisputes) {
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
            icon: LucideIcons.user,
            label: 'My Profile',
            subtitle: 'View and edit your details',
            iconColor: colors.primary,
            colors: colors,
            onTap: () => context.go('/more/profile'),
          ),
          Divider(color: colors.border, height: 1, thickness: 1),
          _MenuItem(
            icon: LucideIcons.bell,
            label: 'Notifications',
            subtitle: 'Reminders and alerts',
            iconColor: colors.warning,
            badge: unreadNotifications > 0 ? unreadNotifications : null,
            colors: colors,
            onTap: () => context.go('/more/notifications'),
          ),
          Divider(color: colors.border, height: 1, thickness: 1),
          _MenuItem(
            icon: LucideIcons.alertCircle,
            label: 'Disputes & Complaints',
            subtitle: 'Submit and track issues',
            iconColor: colors.danger,
            badge: activeDisputes > 0 ? activeDisputes : null,
            colors: colors,
            onTap: () => context.go('/more/disputes'),
          ),
          Divider(color: colors.border, height: 1, thickness: 1),
          _MenuItem(
            icon: LucideIcons.fileText,
            label: 'Tax Guide',
            subtitle: 'Learn about tax obligations',
            iconColor: colors.info,
            colors: colors,
            onTap: () {
              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Coming soon')));
            },
          ),
          Divider(color: colors.border, height: 1, thickness: 1),
          _MenuItem(
            icon: LucideIcons.helpCircle,
            label: 'Help & Support',
            subtitle: 'FAQs and contact us',
            iconColor: colors.secondary,
            colors: colors,
            onTap: () {
              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Coming soon')));
            },
          ),
          Divider(color: colors.border, height: 1, thickness: 1),
          _MenuItem(
            icon: LucideIcons.settings,
            label: 'Settings',
            subtitle: 'App preferences & theme',
            iconColor: colors.textSecondary,
            colors: colors,
            onTap: () => context.go('/more/settings'),
          ),
        ],
      ),
    );
  }
}

class _MenuItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final String subtitle;
  final Color iconColor;
  final int? badge;
  final AppColors colors;
  final VoidCallback onTap;

  const _MenuItem({
    required this.icon,
    required this.label,
    required this.subtitle,
    required this.iconColor,
    this.badge,
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
              width: 42,
              height: 42,
              decoration: BoxDecoration(
                color: iconColor.withOpacity(0.15),
                borderRadius: BorderRadius.circular(12),
              ),
              alignment: Alignment.center,
              child: Icon(icon, color: iconColor, size: 22),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(label, style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500, color: colors.text)),
                  const SizedBox(height: 2),
                  Text(subtitle, style: TextStyle(fontSize: 12, color: colors.textSecondary)),
                ],
              ),
            ),
            if (badge != null)
              Container(
                margin: const EdgeInsets.only(right: 10),
                padding: const EdgeInsets.symmetric(horizontal: 6),
                constraints: const BoxConstraints(minWidth: 22, minHeight: 22),
                decoration: BoxDecoration(
                  color: colors.danger,
                  borderRadius: BorderRadius.circular(10),
                ),
                alignment: Alignment.center,
                child: Text(
                  badge.toString(),
                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white),
                ),
              ),
            Icon(LucideIcons.chevronRight, size: 18, color: colors.textLight),
          ],
        ),
      ),
    );
  }
}
