import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:intl/intl.dart';
import '../state/app_state.dart';
import '../state/theme_state.dart';
import 'receipt_screen.dart';

class RecordPaymentScreen extends StatefulWidget {
  final String? taxpayerId;

  const RecordPaymentScreen({super.key, this.taxpayerId});

  @override
  State<RecordPaymentScreen> createState() => _RecordPaymentScreenState();
}

class _RecordPaymentScreenState extends State<RecordPaymentScreen> {
  String? _selectedTaxpayerId;
  final TextEditingController _amountController = TextEditingController();
  String _method = 'cash'; // 'cash', 'bank_transfer', 'mobile_money', 'card', 'pos', 'check'
  bool _showTaxpayerList = false;
  bool _isPending = false;

  @override
  void initState() {
    super.initState();
    _selectedTaxpayerId = widget.taxpayerId;
  }

  @override
  void dispose() {
    _amountController.dispose();
    super.dispose();
  }

  String _formatCurrency(double amount) {
    final formatter = NumberFormat.currency(symbol: '', decimalDigits: 0);
    return '${formatter.format(amount).trim()} FCFA';
  }

  Future<void> _submitForm(AppState appState, AppColors colors) async {
    final taxpayerIdVal = _selectedTaxpayerId;
    final amountVal = double.tryParse(_amountController.text) ?? 0.0;

    if (taxpayerIdVal == null || taxpayerIdVal.isEmpty || amountVal <= 0) {
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('Error'),
          content: const Text('Please fill all required fields and enter a valid amount.'),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('OK'),
            ),
          ],
        ),
      );
      return;
    }

    setState(() {
      _isPending = true;
    });

    // Simulate network delay / database insertion
    await Future.delayed(const Duration(milliseconds: 600));

    final newPayment = await appState.addPayment(amountVal, taxpayerIdVal, _method);

    setState(() {
      _isPending = false;
    });

    if (mounted) {
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('Payment Recorded'),
          content: Text('Receipt: ${newPayment.receiptNumber}'),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context); // Pop Dialog
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(
                    builder: (_) => ReceiptScreen(paymentId: newPayment.id),
                  ),
                );
              },
              child: Text('View Receipt', style: TextStyle(color: colors.primary, fontWeight: FontWeight.bold)),
            ),
            TextButton(
              onPressed: () {
                Navigator.pop(context); // Pop Dialog
                Navigator.pop(context); // Go back
              },
              child: Text('Done', style: TextStyle(color: colors.textSecondary)),
            ),
          ],
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final themeState = Provider.of<ThemeState>(context);
    final appState = Provider.of<AppState>(context);
    final colors = themeState.colors;

    final preselectedTaxpayer = widget.taxpayerId != null
        ? appState.getTaxpayerById(widget.taxpayerId!)
        : null;

    final selectedTaxpayer = _selectedTaxpayerId != null
        ? appState.getTaxpayerById(_selectedTaxpayerId!)
        : null;

    final inputStyle = InputDecoration(
      filled: true,
      fillColor: colors.inputBg,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: colors.border),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: colors.primary, width: 2),
      ),
    );

    final enterAmountText = _amountController.text;
    final parsedAmount = double.tryParse(enterAmountText) ?? 0.0;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Record Payment'),
        backgroundColor: themeState.isDarkMode ? colors.background : colors.primary,
        foregroundColor: themeState.isDarkMode ? colors.text : Colors.white,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Taxpayer Selection
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Select Taxpayer *",
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: colors.text,
                  ),
                ),
                const SizedBox(height: 10),
                preselectedTaxpayer != null
                    ? Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: colors.success.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: colors.success.withOpacity(0.3)),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  preselectedTaxpayer.businessName,
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w600,
                                    color: colors.text,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  preselectedTaxpayer.name,
                                  style: TextStyle(
                                    fontSize: 13,
                                    color: colors.textSecondary,
                                  ),
                                ),
                              ],
                            ),
                            Container(
                              width: 32,
                              height: 32,
                              decoration: BoxDecoration(
                                color: colors.success.withOpacity(0.25),
                                shape: BoxShape.circle,
                              ),
                              child: Icon(LucideIcons.check, color: colors.success, size: 18),
                            ),
                          ],
                        ),
                      )
                    : Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          GestureDetector(
                            onTap: () {
                              setState(() {
                                _showTaxpayerList = !_showTaxpayerList;
                              });
                            },
                            child: Container(
                              width: double.infinity,
                              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                              decoration: BoxDecoration(
                                color: colors.inputBg,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: colors.border),
                              ),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    selectedTaxpayer != null
                                        ? selectedTaxpayer.businessName
                                        : 'Choose a taxpayer',
                                    style: TextStyle(
                                      fontSize: 16,
                                      color: selectedTaxpayer != null ? colors.text : colors.textSecondary,
                                      fontWeight: selectedTaxpayer != null ? FontWeight.w500 : FontWeight.w400,
                                    ),
                                  ),
                                  Icon(LucideIcons.chevronDown, color: colors.textSecondary, size: 20),
                                ],
                              ),
                            ),
                          ),
                          if (_showTaxpayerList) ...[
                            const SizedBox(height: 8),
                            Container(
                              decoration: BoxDecoration(
                                color: colors.surface,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: colors.border),
                              ),
                              constraints: const BoxConstraints(maxHeight: 200),
                              child: ListView.separated(
                                shrinkWrap: true,
                                itemCount: appState.taxpayers.length,
                                separatorBuilder: (_, __) => Divider(height: 1, color: colors.borderLight),
                                itemBuilder: (context, idx) {
                                  final taxpayerItem = appState.taxpayers[idx];
                                  final isSelected = _selectedTaxpayerId == taxpayerItem.id;

                                  return ListTile(
                                    tileColor: isSelected ? colors.primary.withOpacity(0.15) : null,
                                    title: Text(
                                      taxpayerItem.businessName,
                                      style: TextStyle(
                                        fontSize: 15,
                                        fontWeight: FontWeight.w500,
                                        color: colors.text,
                                      ),
                                    ),
                                    subtitle: Text(
                                      taxpayerItem.name,
                                      style: TextStyle(
                                        fontSize: 13,
                                        color: colors.textSecondary,
                                      ),
                                    ),
                                    onTap: () {
                                      setState(() {
                                        _selectedTaxpayerId = taxpayerItem.id;
                                        _showTaxpayerList = false;
                                      });
                                    },
                                  );
                                },
                              ),
                            ),
                          ],
                        ],
                      ),
              ],
            ),

            const SizedBox(height: 24),

            // Amount Input
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Amount (FCFA) *",
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: colors.text,
                  ),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: _amountController,
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  onChanged: (val) {
                    setState(() {});
                  },
                  style: TextStyle(color: colors.text, fontSize: 16),
                  decoration: inputStyle.copyWith(
                    hintText: "Enter amount",
                    hintStyle: TextStyle(color: colors.textLight),
                  ),
                ),
                if (selectedTaxpayer != null) ...[
                  const SizedBox(height: 8),
                  Text(
                    "Outstanding: ${_formatCurrency(selectedTaxpayer.outstandingAmount)}",
                    style: TextStyle(
                      fontSize: 13,
                      color: colors.textSecondary,
                    ),
                  ),
                ],
              ],
            ),

            const SizedBox(height: 24),

            // Payment Method Selector
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Payment Method *",
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: colors.text,
                  ),
                ),
                const SizedBox(height: 10),
                Row(
                  children: [
                    _buildMethodButton(
                      value: 'cash',
                      label: 'Cash',
                      icon: LucideIcons.banknote,
                      colors: colors,
                    ),
                    const SizedBox(width: 12),
                    _buildMethodButton(
                      value: 'bank_transfer',
                      label: 'Transfer',
                      icon: LucideIcons.building2,
                      colors: colors,
                    ),
                    const SizedBox(width: 12),
                    _buildMethodButton(
                      value: 'pos',
                      label: 'POS',
                      icon: LucideIcons.creditCard,
                      colors: colors,
                    ),
                  ],
                ),
              ],
            ),

            const SizedBox(height: 24),

            // Summary Card
            if (selectedTaxpayer != null && parsedAmount > 0)
              Container(
                width: double.infinity,
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
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "Payment Summary",
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: colors.text,
                      ),
                    ),
                    const SizedBox(height: 16),
                    _buildSummaryRow('Taxpayer', selectedTaxpayer.businessName, colors),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Amount', style: TextStyle(fontSize: 14, color: colors.textSecondary)),
                        Text(
                          _formatCurrency(parsedAmount),
                          style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: colors.success),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    _buildSummaryRow('Method', _method.toUpperCase(), colors),
                  ],
                ),
              ),

            const SizedBox(height: 24),

            // Submit Button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: colors.primary,
                  foregroundColor: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14),
                  ),
                  padding: const EdgeInsets.symmetric(vertical: 18),
                ),
                onPressed: _isPending ? null : () => _submitForm(appState, colors),
                child: _isPending
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                        ),
                      )
                    : const Text(
                        "Record Payment",
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMethodButton({
    required String value,
    required String label,
    required IconData icon,
    required AppColors colors,
  }) {
    final active = _method == value;

    return Expanded(
      child: GestureDetector(
        onTap: () {
          setState(() {
            _method = value;
          });
        },
        child: Container(
          decoration: BoxDecoration(
            color: active ? colors.primary : colors.surface,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: active ? colors.primary : colors.border, width: 2),
          ),
          padding: const EdgeInsets.symmetric(vertical: 16),
          child: Column(
            children: [
              Icon(icon, size: 24, color: active ? Colors.white : colors.textSecondary),
              const SizedBox(height: 8),
              Text(
                label,
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w500,
                  color: active ? Colors.white : colors.textSecondary,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSummaryRow(String label, String value, AppColors colors) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: TextStyle(fontSize: 14, color: colors.textSecondary)),
        Text(
          value,
          style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: colors.text),
        ),
      ],
    );
  }
}
