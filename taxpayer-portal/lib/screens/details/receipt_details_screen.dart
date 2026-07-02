import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import 'package:qr_flutter/qr_flutter.dart';

import '../../core/theme/app_theme.dart';
import '../../core/models/models.dart';
import '../../core/api/api_service.dart';

class ReceiptDetailsScreen extends StatefulWidget {
  final String id;
  const ReceiptDetailsScreen({super.key, required this.id});

  @override
  State<ReceiptDetailsScreen> createState() => _ReceiptDetailsScreenState();
}

class _ReceiptDetailsScreenState extends State<ReceiptDetailsScreen> {
  bool _isLoading = true;
  Receipt? _receipt;

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  Future<void> _fetchData() async {
    final api = context.read<ApiService>();
    try {
      final receipts = await api.getReceipts();
      setState(() {
        _receipt = receipts.cast<Receipt?>().firstWhere((r) => r?.id == widget.id, orElse: () => null);
        _isLoading = false;
      });
    } catch (e) {
      debugPrint('Error fetching data: $e');
      setState(() => _isLoading = false);
    }
  }

  String _formatCurrency(double amount) {
    return NumberFormat.currency(locale: 'fr_CM', symbol: 'FCFA ', decimalDigits: 0).format(amount);
  }

  String _formatDate(String dateStr) {
    try {
      final date = DateTime.parse(dateStr);
      return DateFormat('dd MMM yyyy, hh:mm a').format(date);
    } catch (_) {
      return dateStr;
    }
  }

  String get _qrData {
    if (_receipt == null) return '';
    final qr = _receipt!.qrCode;
    if (qr.isNotEmpty && qr != 'null') return qr;
    return 'RECEIPT:${_receipt!.receiptNumber}|AMT:${_receipt!.amount}|DATE:${_receipt!.date}|TAX:${_receipt!.taxType}|BIZ:${_receipt!.businessName}|VERIFIED:${_receipt!.verified}';
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

    if (_receipt == null) {
      return Scaffold(
        backgroundColor: colors.background,
        appBar: AppBar(backgroundColor: colors.background, elevation: 0),
        body: Center(child: Text('Receipt not found', style: TextStyle(color: colors.textSecondary, fontSize: 16))),
      );
    }

    return Scaffold(
      backgroundColor: colors.background,
      appBar: AppBar(
        backgroundColor: colors.background,
        elevation: 0,
        iconTheme: IconThemeData(color: colors.text),
        title: Text('Receipt', style: TextStyle(color: colors.text, fontWeight: FontWeight.w600)),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16).copyWith(bottom: 40),
        children: [
          // ── Official Receipt Card ──
          Container(
            decoration: BoxDecoration(
              color: colors.surface,
              borderRadius: BorderRadius.circular(20),
              boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.06), blurRadius: 16, offset: const Offset(0, 4))],
            ),
            child: Column(
              children: [
                // Header
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 20),
                  decoration: BoxDecoration(
                    color: colors.primary,
                    borderRadius: const BorderRadius.only(topLeft: Radius.circular(20), topRight: Radius.circular(20)),
                  ),
                  child: Column(
                    children: [
                      Container(
                        width: 48,
                        height: 48,
                        decoration: BoxDecoration(color: Colors.white.withOpacity(0.2), borderRadius: BorderRadius.circular(14)),
                        child: const Icon(LucideIcons.receipt, color: Colors.white, size: 24),
                      ),
                      const SizedBox(height: 12),
                      const Text('OFFICIAL TAX RECEIPT', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: Colors.white, letterSpacing: 2)),
                      const SizedBox(height: 4),
                      const Text('Buea Municipal Council', style: TextStyle(fontSize: 11, color: Colors.white70, letterSpacing: 0.5)),
                      const SizedBox(height: 2),
                      const Text('Government Revenue Authority', style: TextStyle(fontSize: 10, color: Colors.white54)),
                    ],
                  ),
                ),

                // Verified badge
                if (_receipt!.verified)
                  Container(
                    margin: const EdgeInsets.only(top: 16),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                    decoration: BoxDecoration(color: colors.success.withOpacity(0.12), borderRadius: BorderRadius.circular(20)),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(LucideIcons.shieldCheck, size: 14, color: colors.success),
                        const SizedBox(width: 6),
                        Text('Verified & Authentic', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: colors.success, letterSpacing: 0.5)),
                      ],
                    ),
                  ),

                // Amount
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 20),
                  child: Column(
                    children: [
                      Text('Amount Paid', style: TextStyle(fontSize: 12, color: colors.textSecondary, fontWeight: FontWeight.w500)),
                      const SizedBox(height: 6),
                      Text(_formatCurrency(_receipt!.amount), style: TextStyle(fontSize: 34, fontWeight: FontWeight.w800, color: colors.success, letterSpacing: -1)),
                    ],
                  ),
                ),

                // Dashed divider
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Row(
                    children: List.generate(40, (i) => Expanded(
                      child: Container(
                        height: 1,
                        color: i.isEven ? colors.border : Colors.transparent,
                      ),
                    )),
                  ),
                ),

                // Details
                Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    children: [
                      _buildRow('Receipt No.', _receipt!.receiptNumber, colors, isBold: true),
                      _buildRow('Date', _formatDate(_receipt!.date), colors),
                      _buildRow('Tax Type', _receipt!.taxType, colors),
                      _buildRow('Tax Period', _receipt!.taxPeriod, colors),
                      _buildRow('Business', _receipt!.businessName, colors),
                      _buildRow('Payment ID', _receipt!.paymentId.length > 12 ? '${_receipt!.paymentId.substring(0, 12)}...' : _receipt!.paymentId, colors, isLast: true),
                    ],
                  ),
                ),

                // Dashed divider
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Row(
                    children: List.generate(40, (i) => Expanded(
                      child: Container(
                        height: 1,
                        color: i.isEven ? colors.border : Colors.transparent,
                      ),
                    )),
                  ),
                ),

                // QR Code
                Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: colors.border, width: 1),
                        ),
                        child: QrImageView(
                          data: _qrData,
                          version: QrVersions.auto,
                          size: 180,
                          backgroundColor: Colors.white,
                          eyeStyle: const QrEyeStyle(eyeShape: QrEyeShape.square, color: Color(0xFF1a1a2e)),
                          dataModuleStyle: const QrDataModuleStyle(dataModuleShape: QrDataModuleShape.square, color: Color(0xFF1a1a2e)),
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text('Scan to verify receipt', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: colors.textSecondary)),
                      const SizedBox(height: 4),
                      Text(
                        _receipt!.receiptNumber,
                        style: TextStyle(fontSize: 10, fontFamily: 'monospace', color: colors.textLight, letterSpacing: 1),
                      ),
                    ],
                  ),
                ),

                // Footer
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 20),
                  decoration: BoxDecoration(
                    color: colors.surfaceSecondary,
                    borderRadius: const BorderRadius.only(bottomLeft: Radius.circular(20), bottomRight: Radius.circular(20)),
                  ),
                  child: Text(
                    'This is a computer-generated receipt and does not require a signature.',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 10, color: colors.textLight, fontStyle: FontStyle.italic),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // Action buttons
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: _handleDownload,
                  icon: const Icon(LucideIcons.download, size: 18, color: Colors.white),
                  label: const Text('Download', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Colors.white)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: colors.primary,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: _handleShare,
                  icon: Icon(LucideIcons.share2, size: 18, color: colors.primary),
                  label: Text('Share', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: colors.primary)),
                  style: OutlinedButton.styleFrom(
                    side: BorderSide(color: colors.primary, width: 1.5),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildRow(String label, String value, AppColors colors, {bool isBold = false, bool isLast = false}) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 10),
      decoration: BoxDecoration(border: isLast ? null : Border(bottom: BorderSide(color: colors.border.withOpacity(0.5)))),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(fontSize: 13, color: colors.textSecondary)),
          const SizedBox(width: 16),
          Flexible(
            child: Text(
              value,
              textAlign: TextAlign.end,
              style: TextStyle(fontSize: 13, fontWeight: isBold ? FontWeight.w700 : FontWeight.w500, color: colors.text),
            ),
          ),
        ],
      ),
    );
  }

  void _handleDownload() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Receipt ${_receipt!.receiptNumber} ready for download'), backgroundColor: const Color(0xFF1a1a2e)),
    );
  }

  void _handleShare() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Share options will appear here'), backgroundColor: Color(0xFF1a1a2e)),
    );
  }
}
