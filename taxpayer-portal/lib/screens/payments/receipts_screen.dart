import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';

import '../../core/theme/app_theme.dart';
import '../../core/models/models.dart';
import '../../core/api/api_service.dart';
import '../../core/utils/auto_refresh_mixin.dart';

class ReceiptsScreen extends StatefulWidget {
  const ReceiptsScreen({super.key});

  @override
  State<ReceiptsScreen> createState() => _ReceiptsScreenState();
}

class _ReceiptsScreenState extends State<ReceiptsScreen> with AutoRefreshMixin {
  bool _isLoading = true;
  bool _isRefreshing = false;
  List<Receipt> _receipts = [];

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
      final receipts = await api.getReceipts();
      setState(() {
        _receipts = receipts;
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

  String _formatCurrency(double amount) {
    return NumberFormat.currency(locale: 'fr_CM', symbol: 'FCFA ', decimalDigits: 0).format(amount);
  }

  void _handleDownload(String receiptNumber) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Download Receipt'),
        content: Text('Receipt $receiptNumber will be downloaded to your device.'),
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

    return Scaffold(
      backgroundColor: colors.background,
      appBar: AppBar(
        title: Text('Receipts', style: TextStyle(color: colors.text)),
        backgroundColor: colors.surface,
        elevation: 0,
        iconTheme: IconThemeData(color: colors.text),
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator(color: colors.primary))
          : RefreshIndicator(
              onRefresh: _onRefresh,
              color: colors.primary,
              child: _receipts.isEmpty
                  ? ListView(
                      physics: const AlwaysScrollableScrollPhysics(),
                      children: [
                        Container(
                          height: 400,
                          alignment: Alignment.center,
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(LucideIcons.receipt, size: 48, color: colors.textLight),
                              const SizedBox(height: 16),
                              Text('No receipts yet', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600, color: colors.text)),
                              const SizedBox(height: 4),
                              Text('Your payment receipts will appear here', style: TextStyle(fontSize: 14, color: colors.textSecondary)),
                            ],
                          ),
                        )
                      ],
                    )
                  : ListView.builder(
                      padding: const EdgeInsets.all(16).copyWith(bottom: 24),
                      physics: const AlwaysScrollableScrollPhysics(),
                      itemCount: _receipts.length,
                      itemBuilder: (context, index) {
                        final receipt = _receipts[index];

                        return GestureDetector(
                          onTap: () => context.push('/receipt-details?id=${receipt.id}'),
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
                                  children: [
                                    Container(
                                      width: 52,
                                      height: 52,
                                      decoration: BoxDecoration(color: colors.success.withOpacity(0.15), borderRadius: BorderRadius.circular(14)),
                                      alignment: Alignment.center,
                                      child: Icon(LucideIcons.receipt, size: 26, color: colors.success),
                                    ),
                                    const SizedBox(width: 14),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(receipt.receiptNumber, style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: colors.text)),
                                          const SizedBox(height: 3),
                                          Text(receipt.businessName, style: TextStyle(fontSize: 13, color: colors.textSecondary)),
                                        ],
                                      ),
                                    ),
                                    if (receipt.verified)
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                                        decoration: BoxDecoration(color: colors.success.withOpacity(0.15), borderRadius: BorderRadius.circular(12)),
                                        child: Row(
                                          children: [
                                            Icon(LucideIcons.checkCircle, size: 12, color: colors.success),
                                            const SizedBox(width: 5),
                                            Text('Verified', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: colors.success)),
                                          ],
                                        ),
                                      ),
                                  ],
                                ),
                                const SizedBox(height: 18),
                                Container(
                                  padding: const EdgeInsets.all(14),
                                  decoration: BoxDecoration(color: colors.surfaceSecondary, borderRadius: BorderRadius.circular(14)),
                                  child: Column(
                                    children: [
                                      _buildDetailRow('Amount Paid', _formatCurrency(receipt.amount), colors, isAmount: true),
                                      const SizedBox(height: 12),
                                      _buildDetailRow('Tax Type', receipt.taxType, colors),
                                      const SizedBox(height: 12),
                                      _buildDetailRow('Tax Period', receipt.taxPeriod, colors),
                                      const SizedBox(height: 12),
                                      _buildDetailRow('Date', receipt.date, colors),
                                    ],
                                  ),
                                ),
                                const SizedBox(height: 18),
                                Row(
                                  children: [
                                    Expanded(
                                      child: OutlinedButton.icon(
                                        onPressed: () => _handleDownload(receipt.receiptNumber),
                                        icon: Icon(LucideIcons.download, size: 18, color: colors.primary),
                                        label: Text('Download', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: colors.primary)),
                                        style: OutlinedButton.styleFrom(
                                          side: BorderSide(color: colors.primary, width: 1.5),
                                          padding: const EdgeInsets.symmetric(vertical: 14),
                                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 12),
                                    Expanded(
                                      child: ElevatedButton.icon(
                                        onPressed: () => context.push('/receipt-details?id=${receipt.id}'),
                                        icon: const Icon(LucideIcons.qrCode, size: 18, color: Colors.white),
                                        label: const Text('View QR', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Colors.white)),
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: colors.primary,
                                          padding: const EdgeInsets.symmetric(vertical: 14),
                                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                        ),
                                      ),
                                    ),
                                  ],
                                )
                              ],
                            ),
                          ),
                        );
                      },
                    ),
            ),
    );
  }

  Widget _buildDetailRow(String label, String value, AppColors colors, {bool isAmount = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: TextStyle(fontSize: 13, color: colors.textSecondary)),
        Text(value, style: TextStyle(fontSize: isAmount ? 18 : 14, fontWeight: isAmount ? FontWeight.bold : FontWeight.w500, color: isAmount ? colors.success : colors.text)),
      ],
    );
  }
}
