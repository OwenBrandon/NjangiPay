import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';

import '../../core/theme/app_theme.dart';
import '../../core/models/models.dart';
import '../../core/api/api_service.dart';
import '../../core/utils/auto_refresh_mixin.dart';

class DisputesScreen extends StatefulWidget {
  const DisputesScreen({super.key});

  @override
  State<DisputesScreen> createState() => _DisputesScreenState();
}

class _DisputesScreenState extends State<DisputesScreen> with AutoRefreshMixin {
  bool _isLoading = true;
  bool _isRefreshing = false;
  List<Dispute> _allDisputes = [];
  String _filter = 'all';

  final List<Map<String, String>> _filterOptions = [
    {'key': 'all', 'label': 'All'},
    {'key': 'submitted', 'label': 'Submitted'},
    {'key': 'under_review', 'label': 'Under Review'},
    {'key': 'resolved', 'label': 'Resolved'},
    {'key': 'rejected', 'label': 'Rejected'},
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
      final disputes = await api.getDisputes();
      setState(() {
        _allDisputes = disputes;
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

  Color _getStatusColor(DisputeStatus status, AppColors colors) {
    switch (status) {
      case DisputeStatus.submitted: return colors.info;
      case DisputeStatus.underReview: return colors.warning;
      case DisputeStatus.resolved: return colors.success;
      case DisputeStatus.rejected: return colors.danger;
    }
  }

  IconData _getStatusIcon(DisputeStatus status) {
    switch (status) {
      case DisputeStatus.submitted: return LucideIcons.clock;
      case DisputeStatus.underReview: return LucideIcons.alertCircle;
      case DisputeStatus.resolved: return LucideIcons.checkCircle;
      case DisputeStatus.rejected: return LucideIcons.xCircle;
    }
  }

  String _getStatusLabel(DisputeStatus status) {
    switch (status) {
      case DisputeStatus.submitted: return 'Submitted';
      case DisputeStatus.underReview: return 'Under Review';
      case DisputeStatus.resolved: return 'Resolved';
      case DisputeStatus.rejected: return 'Rejected';
    }
  }

  @override
  Widget build(BuildContext context) {
    final themeProvider = context.watch<ThemeProvider>();
    final colors = themeProvider.colors;

    final filteredDisputes = _allDisputes.where((d) {
      if (_filter == 'all') return true;
      if (_filter == 'under_review' && d.status == DisputeStatus.underReview) return true;
      return d.status.name == _filter;
    }).toList();

    return Scaffold(
      backgroundColor: colors.background,
      appBar: AppBar(
        title: Text('Disputes', style: TextStyle(color: colors.text)),
        backgroundColor: colors.surface,
        elevation: 0,
        iconTheme: IconThemeData(color: colors.text),
      ),
      body: Stack(
        children: [
          Column(
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
                        child: filteredDisputes.isEmpty
                            ? ListView(
                                physics: const AlwaysScrollableScrollPhysics(),
                                children: [
                                  Container(
                                    height: 300,
                                    alignment: Alignment.center,
                                    child: Column(
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      children: [
                                        Icon(LucideIcons.alertCircle, size: 48, color: colors.textLight),
                                        const SizedBox(height: 16),
                                        Text('No disputes found', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600, color: colors.text)),
                                        const SizedBox(height: 4),
                                        Text(
                                          _filter == 'all' ? 'Submit a new dispute if you have any issues' : 'Try changing your filter selection',
                                          style: TextStyle(fontSize: 14, color: colors.textSecondary),
                                          textAlign: TextAlign.center,
                                        ),
                                      ],
                                    ),
                                  )
                                ],
                              )
                            : ListView.builder(
                                padding: const EdgeInsets.all(16).copyWith(bottom: 100),
                                physics: const AlwaysScrollableScrollPhysics(),
                                itemCount: filteredDisputes.length,
                                itemBuilder: (context, index) {
                                  final dispute = filteredDisputes[index];
                                  final statusColor = _getStatusColor(dispute.status, colors);

                                  return GestureDetector(
                                    onTap: () => context.push('/dispute-details?id=${dispute.id}'),
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
                                                  Text(dispute.referenceNumber, style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: colors.text)),
                                                  const SizedBox(height: 5),
                                                  Container(
                                                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                                    decoration: BoxDecoration(color: colors.surfaceSecondary, borderRadius: BorderRadius.circular(8)),
                                                    child: Text(
                                                      dispute.category.name[0].toUpperCase() + dispute.category.name.substring(1),
                                                      style: TextStyle(fontSize: 11, fontWeight: FontWeight.w500, color: colors.textSecondary),
                                                    ),
                                                  ),
                                                ],
                                              ),
                                              Container(
                                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                                                decoration: BoxDecoration(color: statusColor.withOpacity(0.15), borderRadius: BorderRadius.circular(12)),
                                                child: Row(
                                                  mainAxisSize: MainAxisSize.min,
                                                  children: [
                                                    Icon(_getStatusIcon(dispute.status), size: 14, color: statusColor),
                                                    const SizedBox(width: 5),
                                                    Text(
                                                      _getStatusLabel(dispute.status),
                                                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: statusColor),
                                                    ),
                                                  ],
                                                ),
                                              ),
                                            ],
                                          ),
                                          const SizedBox(height: 14),
                                          Text(dispute.subject, style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500, color: colors.text)),
                                          const SizedBox(height: 8),
                                          Text(
                                            dispute.description,
                                            style: TextStyle(fontSize: 13, color: colors.textSecondary, height: 1.5),
                                            maxLines: 2,
                                            overflow: TextOverflow.ellipsis,
                                          ),
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
                                                      Text('Submitted:', style: TextStyle(fontSize: 11, color: colors.textLight)),
                                                      const SizedBox(height: 2),
                                                      Text(dispute.submittedDate, style: TextStyle(fontSize: 13, fontWeight: FontWeight.w500, color: colors.text)),
                                                    ],
                                                  ),
                                                ),
                                                Expanded(
                                                  child: Column(
                                                    crossAxisAlignment: CrossAxisAlignment.start,
                                                    children: [
                                                      Text('Updated:', style: TextStyle(fontSize: 11, color: colors.textLight)),
                                                      const SizedBox(height: 2),
                                                      Text(dispute.lastUpdated, style: TextStyle(fontSize: 13, fontWeight: FontWeight.w500, color: colors.text)),
                                                    ],
                                                  ),
                                                ),
                                                Icon(LucideIcons.chevronRight, size: 18, color: colors.textLight),
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
          Positioned(
            bottom: 24,
            right: 24,
            child: GestureDetector(
              onTap: () => context.push('/submit-dispute'),
              child: Container(
                width: 58,
                height: 58,
                decoration: BoxDecoration(
                  color: colors.primary,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(color: colors.primary.withOpacity(0.35), blurRadius: 10, offset: const Offset(0, 6)),
                  ],
                ),
                alignment: Alignment.center,
                child: const Icon(LucideIcons.plus, size: 26, color: Colors.white),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
