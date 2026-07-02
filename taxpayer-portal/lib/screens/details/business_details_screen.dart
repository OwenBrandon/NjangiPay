import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';

import '../../core/theme/app_theme.dart';
import '../../core/models/models.dart';
import '../../core/api/api_service.dart';

class BusinessDetailsScreen extends StatefulWidget {
  final String id;
  const BusinessDetailsScreen({super.key, required this.id});

  @override
  State<BusinessDetailsScreen> createState() => _BusinessDetailsScreenState();
}

class _BusinessDetailsScreenState extends State<BusinessDetailsScreen> {
  bool _isLoading = true;
  Business? _business;

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  Future<void> _fetchData() async {
    final api = context.read<ApiService>();
    try {
      final businesses = await api.getBusinesses();
      setState(() {
        _business = businesses.cast<Business?>().firstWhere((b) => b?.id == widget.id, orElse: () => null);
        _isLoading = false;
      });
    } catch (e) {
      debugPrint('Error fetching data: $e');
      setState(() {
        _isLoading = false;
      });
    }
  }

  Color _getStatusColor(BusinessStatus status, AppColors colors) {
    switch (status) {
      case BusinessStatus.active: return colors.success;
      case BusinessStatus.pending: return colors.warning;
      case BusinessStatus.suspended: return colors.danger;
      case BusinessStatus.inactive: return colors.textLight;
      case BusinessStatus.inReview: return colors.info;
      case BusinessStatus.defaulter: return colors.danger;
    }
  }

  IconData _getStatusIcon(BusinessStatus status) {
    switch (status) {
      case BusinessStatus.active: return LucideIcons.checkCircle;
      case BusinessStatus.pending: return LucideIcons.clock;
      case BusinessStatus.suspended: return LucideIcons.alertTriangle;
      case BusinessStatus.inactive: return LucideIcons.minusCircle;
      case BusinessStatus.inReview: return LucideIcons.search;
      case BusinessStatus.defaulter: return LucideIcons.alertOctagon;
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

    if (_business == null) {
      return Scaffold(
        backgroundColor: colors.background,
        appBar: AppBar(backgroundColor: colors.background, elevation: 0),
        body: Center(child: Text('Business not found', style: TextStyle(color: colors.textSecondary, fontSize: 16))),
      );
    }

    final statusColor = _getStatusColor(_business!.status, colors);

    return Scaffold(
      backgroundColor: colors.background,
      appBar: AppBar(backgroundColor: colors.background, elevation: 0, iconTheme: IconThemeData(color: colors.text)),
      body: ListView(
        padding: const EdgeInsets.all(16).copyWith(bottom: 32),
        children: [
          Column(
            children: [
              Container(
                width: 72,
                height: 72,
                decoration: BoxDecoration(
                  color: _business!.type == BusinessType.physical ? colors.primary.withOpacity(0.15) : colors.secondary.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(18),
                ),
                alignment: Alignment.center,
                child: Icon(
                  _business!.type == BusinessType.physical ? LucideIcons.building2 : LucideIcons.globe,
                  size: 32,
                  color: _business!.type == BusinessType.physical ? colors.primary : colors.secondary,
                ),
              ),
              const SizedBox(height: 16),
              Text(_business!.name, style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: colors.text), textAlign: TextAlign.center),
              const SizedBox(height: 4),
              Text(_business!.registrationNumber, style: TextStyle(fontSize: 13, color: colors.textSecondary)),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                decoration: BoxDecoration(color: statusColor.withOpacity(0.15), borderRadius: BorderRadius.circular(20)),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(_getStatusIcon(_business!.status), size: 16, color: statusColor),
                    const SizedBox(width: 6),
                    Text(
                      _business!.status.name[0].toUpperCase() + _business!.status.name.substring(1),
                      style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: statusColor),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          _buildSectionCard('Business Information', colors, [
            _buildDetailRow(LucideIcons.fileText, 'TIN', _business!.tin, colors),
            _buildDetailRow(
                _business!.type == BusinessType.physical ? LucideIcons.building2 : LucideIcons.globe,
                'Business Type',
                _business!.type.name[0].toUpperCase() + _business!.type.name.substring(1),
                colors),
            _buildDetailRow(LucideIcons.calendar, 'Registration Date', _business!.registeredDate, colors),
          ]),
          _buildSectionCard('Contact Information', colors, [
            _buildDetailRow(LucideIcons.mail, 'Email', _business!.email, colors),
            _buildDetailRow(LucideIcons.phone, 'Phone', _business!.phone, colors),
            _buildDetailRow(LucideIcons.mapPin, 'Address', _business!.address, colors),
          ]),
          if (_business!.branches.isNotEmpty)
            Container(
              margin: const EdgeInsets.only(bottom: 16),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: colors.surface, borderRadius: BorderRadius.circular(16)),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Branches (${_business!.branches.length})', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: colors.text)),
                  const SizedBox(height: 16),
                  ..._business!.branches.map((b) => Container(
                        margin: const EdgeInsets.only(bottom: 10),
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(color: colors.surfaceSecondary, borderRadius: BorderRadius.circular(12)),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(b.name, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: colors.text)),
                                if (b.isHeadquarters)
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                    decoration: BoxDecoration(color: colors.primary, borderRadius: BorderRadius.circular(8)),
                                    child: const Text('HQ', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white)),
                                  ),
                              ],
                            ),
                            const SizedBox(height: 6),
                            Text(b.address, style: TextStyle(fontSize: 13, color: colors.textSecondary)),
                            const SizedBox(height: 2),
                            Text(b.phone, style: TextStyle(fontSize: 12, color: colors.textLight)),
                          ],
                        ),
                      ))
                ],
              ),
            ),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(color: colors.surface, borderRadius: BorderRadius.circular(16)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Documents (${_business!.documents.length})', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: colors.text)),
                const SizedBox(height: 16),
                ..._business!.documents.map((d) {
                  final docStatusColor = d.status == 'verified'
                      ? colors.success
                      : d.status == 'pending'
                          ? colors.warning
                          : colors.danger;
                  return Container(
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    decoration: BoxDecoration(border: Border(bottom: BorderSide(color: colors.border))),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(d.name, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: colors.text)),
                              const SizedBox(height: 2),
                              Text('Uploaded: ${d.uploadedDate}', style: TextStyle(fontSize: 11, color: colors.textLight)),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(color: docStatusColor.withOpacity(0.15), borderRadius: BorderRadius.circular(10)),
                          child: Text(
                            d.status[0].toUpperCase() + d.status.substring(1),
                            style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: docStatusColor),
                          ),
                        ),
                      ],
                    ),
                  );
                })
              ],
            ),
          )
        ],
      ),
    );
  }

  Widget _buildSectionCard(String title, AppColors colors, List<Widget> children) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: colors.surface, borderRadius: BorderRadius.circular(16)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: colors.text)),
          const SizedBox(height: 16),
          ...children,
        ],
      ),
    );
  }

  Widget _buildDetailRow(IconData icon, String label, String value, AppColors colors) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12),
      decoration: BoxDecoration(border: Border(bottom: BorderSide(color: colors.border))),
      child: Row(
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(color: colors.primary.withOpacity(0.1), borderRadius: BorderRadius.circular(10)),
            alignment: Alignment.center,
            child: Icon(icon, size: 18, color: colors.primary),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: TextStyle(fontSize: 12, color: colors.textSecondary)),
                const SizedBox(height: 2),
                Text(value, style: TextStyle(fontSize: 15, fontWeight: FontWeight.w500, color: colors.text)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
