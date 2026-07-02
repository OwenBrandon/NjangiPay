import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';
import '../state/app_state.dart';
import '../state/theme_state.dart';
import 'record_payment_screen.dart';
import 'create_invoice_screen.dart';
import 'receipt_screen.dart';

class TaxpayerDetailScreen extends StatelessWidget {
  final String taxpayerId;

  const TaxpayerDetailScreen({super.key, required this.taxpayerId});

  String _formatCurrency(double amount) {
    final formatter = NumberFormat.currency(symbol: '', decimalDigits: 0);
    return '${formatter.format(amount).trim()} FCFA';
  }

  Future<void> _handleCall(String phone) async {
    final cleanPhone = phone.replaceAll(RegExp(r'\s+'), '');
    final uri = Uri.parse('tel:$cleanPhone');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  Color _getStatusColor(String status, AppColors colors) {
    switch (status) {
      case 'active':
        return colors.success;
      case 'defaulter':
        return colors.danger;
      case 'suspended':
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  }

  @override
  Widget build(BuildContext context) {
    final themeState = Provider.of<ThemeState>(context);
    final appState = Provider.of<AppState>(context);
    final colors = themeState.colors;

    final taxpayer = appState.getTaxpayerById(taxpayerId);
    final taxpayerPayments = appState.payments.where((p) => p.taxpayerId == taxpayerId).toList();

    if (taxpayer == null) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Taxpayer Details'),
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
                "Taxpayer not found",
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

    final statusColor = _getStatusColor(taxpayer.status, colors);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Taxpayer Details'),
        backgroundColor: themeState.isDarkMode ? colors.background : colors.primary,
        foregroundColor: themeState.isDarkMode ? colors.text : Colors.white,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.only(bottom: 30),
        child: Column(
          children: [
            // Profile Section
            Container(
              width: double.infinity,
              color: themeState.isDarkMode ? colors.backgroundSecondary : colors.primary,
              padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 20),
              child: Column(
                children: [
                  Container(
                    width: 80,
                    height: 80,
                    decoration: BoxDecoration(
                      color: colors.accent.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: Icon(LucideIcons.user, size: 40, color: colors.accent),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    taxpayer.businessName,
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w700,
                      color: colors.white,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    taxpayer.name,
                    style: TextStyle(
                      fontSize: 15,
                      color: colors.white.withOpacity(0.7),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: statusColor.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          width: 8,
                          height: 8,
                          decoration: BoxDecoration(
                            color: statusColor,
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          taxpayer.status,
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: statusColor,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // Contact Information Card
            Padding(
              padding: const EdgeInsets.all(16),
              child: Container(
                decoration: BoxDecoration(
                  color: colors.cardBg,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: colors.glassBorder),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.05),
                      blurRadius: 12,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "Contact Information",
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: colors.text,
                      ),
                    ),
                    const SizedBox(height: 16),
                    _buildInfoDetailRow(
                      icon: LucideIcons.mapPin,
                      label: 'Address',
                      value: taxpayer.address,
                      colors: colors,
                    ),
                    _buildInfoDetailRow(
                      icon: LucideIcons.phone,
                      label: 'Phone',
                      value: taxpayer.phone,
                      colors: colors,
                    ),
                    _buildInfoDetailRow(
                      icon: LucideIcons.fileText,
                      label: 'Tax Type',
                      value: taxpayer.taxType.join(', '),
                      colors: colors,
                    ),
                    _buildInfoDetailRow(
                      icon: LucideIcons.calendar,
                      label: 'Last Payment',
                      value: taxpayer.lastPaymentDate ?? 'Never',
                      colors: colors,
                      isLast: true,
                    ),
                  ],
                ),
              ),
            ),

            // Balance Card
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Container(
                width: double.infinity,
                decoration: BoxDecoration(
                  color: colors.danger.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: colors.danger.withOpacity(0.3)),
                ),
                padding: const EdgeInsets.all(20),
                child: Column(
                  children: [
                    Text(
                      "Outstanding Balance",
                      style: TextStyle(
                        fontSize: 13,
                        color: colors.textSecondary,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      _formatCurrency(taxpayer.outstandingAmount),
                      style: TextStyle(
                        fontSize: 32,
                        fontWeight: FontWeight.w700,
                        color: colors.danger,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      decoration: BoxDecoration(
                        color: colors.surface,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: colors.border),
                      ),
                      child: Text(
                        "QR Code: ${taxpayer.qrCode}",
                        style: TextStyle(
                          fontSize: 13,
                          fontFamily: 'monospace',
                          color: colors.textSecondary,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Actions Card
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: colors.primary,
                        foregroundColor: Colors.white,
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                      ),
                      onPressed: () => _handleCall(taxpayer.phone),
                      icon: const Icon(LucideIcons.phone, size: 20),
                      label: const Text(
                        "Call Taxpayer",
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: colors.primary.withOpacity(0.15),
                            foregroundColor: colors.primary,
                            elevation: 0,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            padding: const EdgeInsets.symmetric(vertical: 14),
                          ),
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => RecordPaymentScreen(taxpayerId: taxpayer.id),
                              ),
                            );
                          },
                          icon: const Icon(LucideIcons.creditCard, size: 20),
                          label: const Text(
                            "Record Payment",
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: colors.primary.withOpacity(0.15),
                            foregroundColor: colors.primary,
                            elevation: 0,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            padding: const EdgeInsets.symmetric(vertical: 14),
                          ),
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => CreateInvoiceScreen(taxpayerId: taxpayer.id),
                              ),
                            );
                          },
                          icon: const Icon(LucideIcons.fileText, size: 20),
                          label: const Text(
                            "Create Invoice",
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Payment History Card
            if (taxpayerPayments.isNotEmpty)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Container(
                  decoration: BoxDecoration(
                    color: colors.cardBg,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: colors.glassBorder),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.05),
                        blurRadius: 12,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Payment History",
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: colors.text,
                        ),
                      ),
                      const SizedBox(height: 10),
                      ListView.separated(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: taxpayerPayments.length,
                        separatorBuilder: (_, __) => Divider(color: colors.border),
                        itemBuilder: (context, idx) {
                          final payment = taxpayerPayments[idx];
                          final isConfirmed = payment.status == 'confirmed';

                          return ListTile(
                            contentPadding: EdgeInsets.zero,
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => ReceiptScreen(paymentId: payment.id),
                                ),
                              );
                            },
                            title: Text(
                              _formatCurrency(payment.amount),
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                                color: colors.text,
                              ),
                            ),
                            subtitle: Text(
                              "${payment.date} • ${payment.time}",
                              style: TextStyle(
                                fontSize: 12,
                                color: colors.textSecondary,
                              ),
                            ),
                            trailing: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: isConfirmed
                                    ? colors.success.withOpacity(0.2)
                                    : colors.warning.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                payment.status,
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w500,
                                  color: isConfirmed ? colors.success : colors.warning,
                                ),
                              ),
                            ),
                          );
                        },
                      ),
                    ],
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoDetailRow({
    required IconData icon,
    required String label,
    required String value,
    required AppColors colors,
    bool isLast = false,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12),
      decoration: BoxDecoration(
        border: isLast
            ? null
            : Border(
                bottom: BorderSide(color: colors.border.withOpacity(0.3)),
              ),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: colors.primary.withOpacity(0.15),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, size: 18, color: colors.primary),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 12,
                    color: colors.textSecondary,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  value,
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w500,
                    color: colors.text,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
