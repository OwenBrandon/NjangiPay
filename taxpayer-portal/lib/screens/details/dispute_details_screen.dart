import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';

import '../../core/theme/app_theme.dart';
import '../../core/models/models.dart';
import '../../core/api/api_service.dart';
import '../../core/utils/auto_refresh_mixin.dart';

class DisputeDetailsScreen extends StatefulWidget {
  final String id;
  const DisputeDetailsScreen({super.key, required this.id});

  @override
  State<DisputeDetailsScreen> createState() => _DisputeDetailsScreenState();
}

class _DisputeDetailsScreenState extends State<DisputeDetailsScreen> with AutoRefreshMixin {
  bool _isLoading = true;
  Dispute? _dispute;

  @override
  Duration get refreshInterval => const Duration(seconds: 10);

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
        _dispute = disputes.cast<Dispute?>().firstWhere((d) => d?.id == widget.id, orElse: () => null);
        _isLoading = false;
      });
    } catch (e) {
      debugPrint('Error fetching data: $e');
      setState(() {
        _isLoading = false;
      });
    }
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

  final TextEditingController _responseController = TextEditingController();
  bool _isSending = false;

  @override
  void dispose() {
    _responseController.dispose();
    super.dispose();
  }

  Future<void> _handleAddResponse() async {
    final message = _responseController.text.trim();
    if (message.isEmpty) return;

    setState(() => _isSending = true);

    final api = context.read<ApiService>();
    final success = await api.addDisputeResponse(
      ticketId: _dispute!.id,
      message: message,
    );

    if (!mounted) return;

    if (success) {
      _responseController.clear();
      await _fetchData();
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to send response. Please try again.')),
      );
    }
    setState(() => _isSending = false);
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

    if (_dispute == null) {
      return Scaffold(
        backgroundColor: colors.background,
        appBar: AppBar(backgroundColor: colors.background, elevation: 0),
        body: Center(child: Text('Dispute not found', style: TextStyle(color: colors.textSecondary, fontSize: 16))),
      );
    }

    final statusColor = _getStatusColor(_dispute!.status, colors);

    return Scaffold(
      backgroundColor: colors.background,
      appBar: AppBar(backgroundColor: colors.background, elevation: 0, iconTheme: IconThemeData(color: colors.text)),
      body: ListView(
        padding: const EdgeInsets.all(16).copyWith(bottom: 32),
        children: [
          Column(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                decoration: BoxDecoration(color: statusColor.withOpacity(0.15), borderRadius: BorderRadius.circular(20)),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(_getStatusIcon(_dispute!.status), size: 16, color: statusColor),
                    const SizedBox(width: 6),
                    Text(_getStatusLabel(_dispute!.status), style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: statusColor)),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              Text(_dispute!.referenceNumber, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: colors.text)),
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                decoration: BoxDecoration(color: colors.surfaceSecondary, borderRadius: BorderRadius.circular(10)),
                child: Text(_dispute!.category.name[0].toUpperCase() + _dispute!.category.name.substring(1), style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: colors.textSecondary)),
              ),
            ],
          ),
          const SizedBox(height: 20),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(color: colors.surface, borderRadius: BorderRadius.circular(16)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(_dispute!.subject, style: TextStyle(fontSize: 17, fontWeight: FontWeight.w600, color: colors.text)),
                const SizedBox(height: 10),
                Text(_dispute!.description, style: TextStyle(fontSize: 14, color: colors.textSecondary, height: 1.5)),
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.only(top: 14),
                  decoration: BoxDecoration(border: Border(top: BorderSide(color: colors.border))),
                  child: Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Submitted', style: TextStyle(fontSize: 11, color: colors.textLight)),
                            const SizedBox(height: 2),
                            Text(_dispute!.submittedDate, style: TextStyle(fontSize: 13, fontWeight: FontWeight.w500, color: colors.text)),
                          ],
                        ),
                      ),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Last Updated', style: TextStyle(fontSize: 11, color: colors.textLight)),
                            const SizedBox(height: 2),
                            Text(_dispute!.lastUpdated, style: TextStyle(fontSize: 13, fontWeight: FontWeight.w500, color: colors.text)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          if (_dispute!.attachments.isNotEmpty) ...[
            const SizedBox(height: 20),
            Text('Attachments (${_dispute!.attachments.length})', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: colors.text)),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(color: colors.surface, borderRadius: BorderRadius.circular(12)),
              child: Column(
                children: _dispute!.attachments.map((att) => Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(border: Border(bottom: BorderSide(color: colors.border))),
                  child: Row(
                    children: [
                      Icon(LucideIcons.paperclip, size: 16, color: colors.primary),
                      const SizedBox(width: 10),
                      Expanded(child: Text(att, style: TextStyle(fontSize: 13, color: colors.text))),
                    ],
                  ),
                )).toList(),
              ),
            ),
          ],
          const SizedBox(height: 20),
          Text('Timeline', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: colors.text)),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(color: colors.surface, borderRadius: BorderRadius.circular(12)),
            child: Column(
              children: [
                _buildTimelineItem(colors, 'Dispute Submitted', _dispute!.submittedDate, isFirst: true),
                ..._dispute!.responses.map((r) => _buildTimelineItem(colors, r.isOfficial ? 'Official Response' : 'Your Response', r.date, message: r.message, isOfficial: r.isOfficial)),
                if (_dispute!.status == DisputeStatus.resolved)
                  _buildTimelineItem(colors, 'Dispute Resolved', _dispute!.lastUpdated, isResolved: true),
              ],
            ),
          ),
          if (_dispute!.status == DisputeStatus.submitted || _dispute!.status == DisputeStatus.underReview) ...[
            const SizedBox(height: 20),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: colors.surface, borderRadius: BorderRadius.circular(16)),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Reply', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: colors.text)),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _responseController,
                    maxLines: 4,
                    style: TextStyle(fontSize: 14, color: colors.text),
                    decoration: InputDecoration(
                      hintText: 'Type your response here...',
                      hintStyle: TextStyle(color: colors.textLight),
                      filled: true,
                      fillColor: colors.surfaceSecondary,
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                    ),
                  ),
                  const SizedBox(height: 12),
                  ElevatedButton.icon(
                    onPressed: _isSending ? null : _handleAddResponse,
                    icon: _isSending
                        ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                        : const Icon(LucideIcons.send, size: 18, color: Colors.white),
                    label: Text(_isSending ? 'Sending...' : 'Send Response', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Colors.white)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: colors.primary,
                      minimumSize: const Size(double.infinity, 48),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                ],
              ),
            ),
          ]
        ],
      ),
    );
  }

  Widget _buildTimelineItem(AppColors colors, String title, String date, {String? message, bool isOfficial = false, bool isResolved = false, bool isFirst = false}) {
    final dotColor = isResolved ? colors.success : (isOfficial ? colors.primary : colors.border);
    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 12,
            height: 12,
            margin: const EdgeInsets.only(top: 4, right: 14),
            decoration: BoxDecoration(color: dotColor, shape: BoxShape.circle),
          ),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(title, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: colors.text)),
                    if (isOfficial) ...[
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(color: colors.primary.withOpacity(0.15), borderRadius: BorderRadius.circular(8)),
                        child: Text('Official', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: colors.primary)),
                      ),
                    ]
                  ],
                ),
                if (message != null)
                  Container(
                    margin: const EdgeInsets.symmetric(vertical: 6),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(color: colors.surfaceSecondary, borderRadius: BorderRadius.circular(10)),
                    child: Text(message, style: TextStyle(fontSize: 13, color: colors.textSecondary, height: 1.5)),
                  ),
                if (message == null) const SizedBox(height: 4),
                Text(date, style: TextStyle(fontSize: 11, color: colors.textLight)),
              ],
            ),
          )
        ],
      ),
    );
  }
}
