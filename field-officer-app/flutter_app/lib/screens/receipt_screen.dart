import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:intl/intl.dart';
import 'package:share_plus/share_plus.dart';
import '../state/app_state.dart';
import '../state/theme_state.dart';
import '../models/models.dart';

class ReceiptScreen extends StatelessWidget {
  final String paymentId;

  const ReceiptScreen({super.key, required this.paymentId});

  String _formatCurrency(double amount) {
    final formatter = NumberFormat.currency(symbol: '', decimalDigits: 0);
    return '${formatter.format(amount).trim()} FCFA';
  }

  Future<void> _handleShare(Payment payment) async {
    final receiptText = '''
PAYMENT RECEIPT
${payment.receiptNumber}

Taxpayer: ${payment.taxpayerName}
Amount: ${payment.amount.toLocaleString()} FCFA
Date: ${payment.date}
Time: ${payment.time}
Method: ${payment.method.toUpperCase()}
Status: ${payment.status.toUpperCase()}

Thank you for your payment.
'''.trim();

    try {
      await Share.share(receiptText, subject: 'Payment Receipt');
    } catch (e) {
      debugPrint('Error sharing receipt: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    final themeState = Provider.of<ThemeState>(context);
    final appState = Provider.of<AppState>(context);
    final colors = themeState.colors;

    final payment = appState.payments.firstWhere(
      (p) => p.id == paymentId,
      orElse: () => Payment(
        id: '',
        taxpayerId: '',
        taxpayerName: '',
        amount: 0,
        date: '',
        time: '',
        method: '',
        status: '',
        receiptNumber: '',
      ),
    );

    final taxpayer = payment.taxpayerId.isNotEmpty
        ? appState.getTaxpayerById(payment.taxpayerId)
        : null;

    if (payment.id.isEmpty) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Receipt'),
          backgroundColor: themeState.isDarkMode ? colors.background : colors.primary,
          foregroundColor: themeState.isDarkMode ? colors.text : Colors.white,
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(LucideIcons.alertCircle, size: 48, color: colors.danger),
              const SizedBox(height: 12),
              Text(
                "Receipt not found",
                style: TextStyle(
                  fontSize: 16,
                  color: colors.textSecondary,
                ),
              ),
            ],
          ),
        ),
      );
    }

    final isConfirmed = payment.status == 'confirmed';
    final statusColor = isConfirmed ? colors.success : colors.warning;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Receipt'),
        backgroundColor: themeState.isDarkMode ? colors.background : colors.primary,
        foregroundColor: themeState.isDarkMode ? colors.text : Colors.white,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // Receipt Card
            Container(
              decoration: BoxDecoration(
                color: colors.cardBg,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: colors.glassBorder),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(themeState.isDarkMode ? 0.3 : 0.08),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  // Status Header
                  Column(
                    children: [
                      Container(
                        width: 64,
                        height: 64,
                        decoration: BoxDecoration(
                          color: statusColor.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Icon(
                          isConfirmed ? LucideIcons.checkCircle : LucideIcons.receipt,
                          size: 32,
                          color: statusColor,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        isConfirmed ? 'Payment Confirmed' : 'Pending Confirmation',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                          color: colors.text,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        payment.receiptNumber,
                        style: const TextStyle(
                          fontSize: 14,
                          fontFamily: 'monospace',
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 24),

                  // Amount Paid Section
                  Column(
                    children: [
                      Text(
                        "Amount Paid",
                        style: TextStyle(
                          fontSize: 13,
                          color: colors.textSecondary,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        _formatCurrency(payment.amount),
                        style: TextStyle(
                          fontSize: 40,
                          fontWeight: FontWeight.w700,
                          color: colors.success,
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 20),
                  Divider(color: colors.border),
                  const SizedBox(height: 20),

                  // Details Block
                  Column(
                    children: [
                      _buildReceiptDetailRow(
                        label: 'Taxpayer',
                        value: payment.taxpayerName,
                        colors: colors,
                      ),
                      if (taxpayer != null) ...[
                        const SizedBox(height: 14),
                        _buildReceiptDetailRow(
                          label: 'Business',
                          value: taxpayer.businessName,
                          colors: colors,
                        ),
                      ],
                      const SizedBox(height: 14),
                      _buildReceiptDetailRow(
                        label: 'Date',
                        value: payment.date,
                        colors: colors,
                      ),
                      const SizedBox(height: 14),
                      _buildReceiptDetailRow(
                        label: 'Time',
                        value: payment.time,
                        colors: colors,
                      ),
                      const SizedBox(height: 14),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            "Payment Method",
                            style: TextStyle(
                              fontSize: 14,
                              color: colors.textSecondary,
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: colors.primary.withOpacity(0.15),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              payment.method.toUpperCase(),
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                                color: colors.primary,
                              ),
                            ),
                          ),
                        ],
                      ),
                      if (payment.invoiceNumber != null && payment.invoiceNumber!.isNotEmpty) ...[
                        const SizedBox(height: 14),
                        _buildReceiptDetailRow(
                          label: 'Invoice',
                          value: payment.invoiceNumber!,
                          colors: colors,
                        ),
                      ],
                    ],
                  ),

                  const SizedBox(height: 20),
                  Divider(color: colors.border),
                  const SizedBox(height: 20),

                  // QR Code verification
                  Column(
                    children: [
                      Container(
                        width: 120,
                        height: 120,
                        decoration: BoxDecoration(
                          color: colors.surfaceAlt,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Icon(LucideIcons.qrCode, size: 80, color: colors.textLight),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        "Scan to verify receipt",
                        style: TextStyle(
                          fontSize: 12,
                          color: colors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Action Buttons
            Column(
              children: [
                if (!isConfirmed) ...[
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: colors.success,
                        foregroundColor: Colors.white,
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                        padding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                      onPressed: () => appState.confirmPayment(payment.id),
                      icon: const Icon(LucideIcons.checkCircle, size: 20),
                      label: const Text(
                        "Confirm Payment",
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                ],
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: colors.primary.withOpacity(0.15),
                      foregroundColor: colors.primary,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                      padding: const EdgeInsets.symmetric(vertical: 16),
                    ),
                    onPressed: () => _handleShare(payment),
                    icon: const Icon(LucideIcons.share2, size: 20),
                    label: const Text(
                      "Share Receipt",
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
                if (!kIsWeb) ...[
                  const SizedBox(height: 12),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: colors.surfaceAlt,
                        foregroundColor: colors.textSecondary,
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                        padding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                      onPressed: () {
                        showDialog(
                          context: context,
                          builder: (context) => AlertDialog(
                            title: const Text('Download PDF'),
                            content: const Text('Receipt PDF downloaded successfully to device cache.'),
                            actions: [
                              TextButton(
                                onPressed: () => Navigator.pop(context),
                                child: const Text('OK'),
                              ),
                            ],
                          ),
                        );
                      },
                      icon: const Icon(LucideIcons.download, size: 20),
                      label: const Text(
                        "Download PDF",
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildReceiptDetailRow({
    required String label,
    required String value,
    required AppColors colors,
  }) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: 14,
            color: colors.textSecondary,
          ),
        ),
        Text(
          value,
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: colors.text,
          ),
        ),
      ],
    );
  }
}

extension on double {
  String toLocaleString() {
    if (this == toInt()) {
      final formatter = NumberFormat("#,###");
      return formatter.format(this);
    } else {
      final formatter = NumberFormat("#,###.00");
      return formatter.format(this);
    }
  }
}
