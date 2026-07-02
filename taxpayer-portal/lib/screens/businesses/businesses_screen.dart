import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';

import '../../core/theme/app_theme.dart';
import '../../core/models/models.dart';
import '../../core/api/api_service.dart';
import '../../core/utils/auto_refresh_mixin.dart';

class BusinessesScreen extends StatefulWidget {
  const BusinessesScreen({super.key});

  @override
  State<BusinessesScreen> createState() => _BusinessesScreenState();
}

class _BusinessesScreenState extends State<BusinessesScreen> with AutoRefreshMixin {
  bool _isLoading = true;
  List<Business> _businesses = [];
  String _filter = 'all';

  @override
  Duration get refreshInterval => const Duration(seconds: 30);

  @override
  Future<void> onRefresh() => _fetchBusinesses();

  @override
  void initState() {
    super.initState();
    _fetchBusinesses();
    startAutoRefresh();
  }

  Future<void> _fetchBusinesses() async {
    setState(() {
      _isLoading = true;
    });
    try {
      final api = context.read<ApiService>();
      final businesses = await api.getBusinesses();
      setState(() {
        _businesses = businesses;
        _isLoading = false;
      });
    } catch (e) {
      debugPrint('Error fetching businesses: $e');
      setState(() {
        _isLoading = false;
      });
    }
  }

  Widget _getStatusIcon(BusinessStatus status, AppColors colors) {
    switch (status) {
      case BusinessStatus.active:
        return Icon(LucideIcons.checkCircle, size: 14, color: colors.success);
      case BusinessStatus.pending:
        return Icon(LucideIcons.clock, size: 14, color: colors.warning);
      case BusinessStatus.suspended:
        return Icon(LucideIcons.alertTriangle, size: 14, color: colors.danger);
      case BusinessStatus.inactive:
        return Icon(LucideIcons.minusCircle, size: 14, color: colors.textLight);
      case BusinessStatus.inReview:
        return Icon(LucideIcons.search, size: 14, color: colors.info);
      case BusinessStatus.defaulter:
        return Icon(LucideIcons.alertOctagon, size: 14, color: colors.danger);
    }
  }

  Color _getStatusColor(BusinessStatus status, AppColors colors) {
    switch (status) {
      case BusinessStatus.active:
        return colors.success;
      case BusinessStatus.pending:
        return colors.warning;
      case BusinessStatus.suspended:
        return colors.danger;
      case BusinessStatus.inactive:
        return colors.textLight;
      case BusinessStatus.inReview:
        return colors.info;
      case BusinessStatus.defaulter:
        return colors.danger;
    }
  }

  @override
  Widget build(BuildContext context) {
    final themeProvider = context.watch<ThemeProvider>();
    final colors = themeProvider.colors;
    final isDark = themeProvider.isDark;

    final filteredBusinesses = _businesses.where((b) {
      if (_filter == 'all') return true;
      if (_filter == 'physical' && b.type == BusinessType.physical) return true;
      if (_filter == 'virtual' && b.type == BusinessType.virtual) return true;
      return false;
    }).toList();

    return Scaffold(
      backgroundColor: colors.background,
      appBar: AppBar(
        title: Text('Businesses', style: TextStyle(color: colors.text, fontWeight: FontWeight.bold)),
        backgroundColor: colors.surface,
        elevation: 0,
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(56.0),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: colors.surface,
              border: Border(bottom: BorderSide(color: colors.border)),
            ),
            child: Row(
              children: [
                _FilterBtn(
                  label: 'All (${_businesses.length})',
                  isActive: _filter == 'all',
                  onTap: () => setState(() => _filter = 'all'),
                  colors: colors,
                ),
                const SizedBox(width: 8),
                _FilterBtn(
                  label: 'Physical',
                  icon: LucideIcons.mapPin,
                  isActive: _filter == 'physical',
                  onTap: () => setState(() => _filter = 'physical'),
                  colors: colors,
                ),
                const SizedBox(width: 8),
                _FilterBtn(
                  label: 'Virtual',
                  icon: LucideIcons.globe,
                  isActive: _filter == 'virtual',
                  onTap: () => setState(() => _filter = 'virtual'),
                  colors: colors,
                ),
              ],
            ),
          ),
        ),
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator(color: colors.primary))
          : RefreshIndicator(
              onRefresh: _fetchBusinesses,
              color: colors.primary,
              child: filteredBusinesses.isEmpty
                  ? SingleChildScrollView(
                      physics: const AlwaysScrollableScrollPhysics(),
                      child: Container(
                        height: MediaQuery.of(context).size.height * 0.6,
                        alignment: Alignment.center,
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(LucideIcons.building2, size: 48, color: colors.textLight),
                            const SizedBox(height: 16),
                            Text(
                              'No businesses found',
                              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600, color: colors.text),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Register a new business to get started',
                              style: TextStyle(fontSize: 14, color: colors.textSecondary),
                            ),
                          ],
                        ),
                      ),
                    )
                  : ListView.builder(
                      padding: const EdgeInsets.all(16).copyWith(bottom: 100),
                      itemCount: filteredBusinesses.length,
                      itemBuilder: (context, index) {
                        final business = filteredBusinesses[index];
                        return _BusinessCard(
                          business: business,
                          colors: colors,
                          isDark: isDark,
                          getStatusIcon: (status) => _getStatusIcon(status, colors),
                          getStatusColor: (status) => _getStatusColor(status, colors),
                          onTap: () => context.push('/business-details?id=${business.id}'),
                        );
                      },
                    ),
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.push('/register-business'),
        backgroundColor: colors.primary,
        elevation: 8,
        child: const Icon(LucideIcons.plus, color: Colors.white, size: 26),
      ),
    );
  }
}

class _FilterBtn extends StatelessWidget {
  final String label;
  final IconData? icon;
  final bool isActive;
  final VoidCallback onTap;
  final AppColors colors;

  const _FilterBtn({
    required this.label,
    this.icon,
    required this.isActive,
    required this.onTap,
    required this.colors,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: isActive ? colors.primary : colors.surfaceSecondary,
          borderRadius: BorderRadius.circular(20),
        ),
        child: Row(
          children: [
            if (icon != null) ...[
              Icon(
                icon,
                size: 14,
                color: isActive ? Colors.white : colors.textSecondary,
              ),
              const SizedBox(width: 6),
            ],
            Text(
              label,
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w500,
                color: isActive ? Colors.white : colors.textSecondary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _BusinessCard extends StatelessWidget {
  final Business business;
  final AppColors colors;
  final bool isDark;
  final Widget Function(BusinessStatus) getStatusIcon;
  final Color Function(BusinessStatus) getStatusColor;
  final VoidCallback onTap;

  const _BusinessCard({
    required this.business,
    required this.colors,
    required this.isDark,
    required this.getStatusIcon,
    required this.getStatusColor,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        margin: const EdgeInsets.only(bottom: 12),
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
        child: Column(
          children: [
            Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: business.type == BusinessType.physical
                        ? colors.primary.withOpacity(0.15)
                        : colors.secondary.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  alignment: Alignment.center,
                  child: Icon(
                    business.type == BusinessType.physical ? LucideIcons.building2 : LucideIcons.globe,
                    size: 22,
                    color: business.type == BusinessType.physical ? colors.primary : colors.secondary,
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        business.name,
                        style: TextStyle(fontSize: 17, fontWeight: FontWeight.w600, color: colors.text),
                      ),
                      const SizedBox(height: 3),
                      Text(
                        business.registrationNumber,
                        style: TextStyle(fontSize: 13, color: colors.textSecondary),
                      ),
                    ],
                  ),
                ),
                Icon(LucideIcons.chevronRight, size: 20, color: colors.textLight),
              ],
            ),
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 14),
              child: Divider(color: colors.border, height: 1, thickness: 1),
            ),
            Column(
              children: [
                _buildDetailRow('TIN:', Text(business.tin, style: TextStyle(fontSize: 13, fontWeight: FontWeight.w500, color: colors.text))),
                const SizedBox(height: 10),
                _buildDetailRow(
                  'Type:',
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                    decoration: BoxDecoration(
                      color: colors.surfaceSecondary,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      business.type.name[0].toUpperCase() + business.type.name.substring(1),
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: colors.textSecondary),
                    ),
                  ),
                ),
                const SizedBox(height: 10),
                _buildDetailRow(
                  'Status:',
                  Row(
                    children: [
                      getStatusIcon(business.status),
                      const SizedBox(width: 5),
                      Text(
                        business.status.name[0].toUpperCase() + business.status.name.substring(1),
                        style: TextStyle(fontSize: 13, fontWeight: FontWeight.w500, color: getStatusColor(business.status)),
                      ),
                    ],
                  ),
                ),
                if (business.branches.isNotEmpty) ...[
                  const SizedBox(height: 10),
                  _buildDetailRow(
                    'Branches:',
                    Text(business.branches.length.toString(), style: TextStyle(fontSize: 13, fontWeight: FontWeight.w500, color: colors.text)),
                  ),
                ]
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, Widget valueWidget) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: TextStyle(fontSize: 13, color: colors.textSecondary)),
        valueWidget,
      ],
    );
  }
}
