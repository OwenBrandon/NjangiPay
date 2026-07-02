import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';

import '../../core/theme/app_theme.dart';
import '../../core/models/models.dart';
import '../../core/api/api_service.dart';

class MakePaymentScreen extends StatefulWidget {
  final String? assessmentId;
  const MakePaymentScreen({super.key, this.assessmentId});

  @override
  State<MakePaymentScreen> createState() => _MakePaymentScreenState();
}

class _MakePaymentScreenState extends State<MakePaymentScreen> {
  bool _isLoading = true;
  bool _isSubmitting = false;
  List<Assessment> _unpaidAssessments = [];
  Assessment? _selectedAssessment;
  PaymentMethod? _paymentMethod;
  String _momoProvider = '';
  final TextEditingController _momoNumberController = TextEditingController();
  final TextEditingController _amountController = TextEditingController();
  bool _showAssessmentPicker = false;

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  @override
  void dispose() {
    _momoNumberController.dispose();
    _amountController.dispose();
    super.dispose();
  }

  Future<void> _fetchData() async {
    final api = context.read<ApiService>();
    try {
      final assessments = await api.getAssessments();
      final unpaid = assessments
          .where((a) =>
              a.status == AssessmentStatus.unpaid ||
              a.status == AssessmentStatus.overdue ||
              a.status == AssessmentStatus.partial)
          .toList();
      setState(() {
        _unpaidAssessments = unpaid;
        if (widget.assessmentId != null && widget.assessmentId!.isNotEmpty) {
          final match = unpaid.cast<Assessment?>().firstWhere(
            (a) => a?.id == widget.assessmentId,
            orElse: () => null,
          );
          if (match != null) {
            _selectedAssessment = match;
            _amountController.text = (match.amount - match.amountPaid).toString();
          }
        }
        _isLoading = false;
      });
    } catch (e) {
      debugPrint('Error fetching data: $e');
      setState(() {
        _isLoading = false;
      });
    }
  }

  String _formatCurrency(double amount) {
    return NumberFormat.currency(locale: 'fr_CM', symbol: 'FCFA ', decimalDigits: 0).format(amount);
  }

  void _handlePayment() {
    final amount = double.tryParse(_amountController.text) ?? 0;
    final methodStr = _paymentMethod == PaymentMethod.mobileMoney ? 'mobile_money' : 'bank_transfer';
    final methodLabel = _paymentMethod == PaymentMethod.mobileMoney ? 'Mobile Money' : 'Bank Transfer';

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Confirm Payment'),
        content: Text('You are about to pay ${_formatCurrency(amount)} via $methodLabel.${_paymentMethod == PaymentMethod.mobileMoney ? '\n\nA payment prompt will be sent to ${_momoNumberController.text}.' : ''}'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          TextButton(
            onPressed: () {
              Navigator.pop(ctx);
              _processPayment(amount, methodStr);
            },
            child: const Text('Confirm'),
          ),
        ],
      ),
    );
  }

  Future<void> _processPayment(double amount, String methodStr) async {
    setState(() => _isSubmitting = true);

    final api = context.read<ApiService>();
    final paymentId = await api.makePayment(
      assessmentId: _selectedAssessment?.id ?? '',
      amount: amount,
      taxType: _selectedAssessment?.taxType ?? 'VAT',
      paymentMethod: methodStr,
    );

    setState(() => _isSubmitting = false);

    if (!mounted) return;

    if (paymentId != null) {
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (ctx) => AlertDialog(
          title: Row(
            children: [
              Icon(LucideIcons.checkCircle, color: Colors.green, size: 24),
              const SizedBox(width: 10),
              const Text('Payment Successful'),
            ],
          ),
          content: Text('Your payment of ${_formatCurrency(amount)} has been processed successfully.\n\nA receipt has been auto-generated. You can view it in the Receipts section.'),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(ctx);
                context.pop();
              },
              child: const Text('Done'),
            ),
          ],
        ),
      );
    } else {
      showDialog(
        context: context,
        builder: (ctx) => AlertDialog(
          title: const Text('Payment Failed'),
          content: const Text('There was an error processing your payment. Please try again.'),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('OK')),
          ],
        ),
      );
    }
  }

  bool _canSubmit() {
    if (_isSubmitting) return false;
    if (_selectedAssessment == null || _paymentMethod == null || _amountController.text.isEmpty) return false;
    if (_paymentMethod == PaymentMethod.mobileMoney && (_momoNumberController.text.isEmpty || _momoProvider.isEmpty)) return false;
    return true;
  }

  @override
  Widget build(BuildContext context) {
    final themeProvider = context.watch<ThemeProvider>();
    final colors = themeProvider.colors;
    final isDark = themeProvider.isDark;

    return Scaffold(
      backgroundColor: colors.background,
      appBar: AppBar(
        title: Text('Make Payment', style: TextStyle(color: colors.text)),
        backgroundColor: colors.surface,
        iconTheme: IconThemeData(color: colors.text),
        elevation: 0,
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator(color: colors.primary))
          : Column(
              children: [
                Expanded(
                  child: ListView(
                    padding: const EdgeInsets.all(16).copyWith(bottom: 40),
                    children: [
                      _buildAssessmentSelection(colors, isDark),
                      const SizedBox(height: 24),
                      _buildPaymentMethodSection(colors, isDark),
                      const SizedBox(height: 24),
                      if (_paymentMethod == PaymentMethod.mobileMoney)
                        _buildMomoDetails(colors)
                      else if (_paymentMethod == PaymentMethod.bankTransfer)
                        _buildBankDetails(colors, isDark),
                      if (_paymentMethod != null) ...[
                        const SizedBox(height: 24),
                        _buildPaymentAmount(colors),
                      ]
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.all(16).copyWith(bottom: 32),
                  decoration: BoxDecoration(
                    color: colors.surface,
                    border: Border(top: BorderSide(color: colors.border)),
                  ),
                  child: ElevatedButton(
                    onPressed: _canSubmit() ? _handlePayment : null,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: colors.primary,
                      disabledBackgroundColor: colors.textLight,
                      minimumSize: const Size(double.infinity, 56),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: _isSubmitting
                        ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                        : Text(
                            _paymentMethod == PaymentMethod.mobileMoney ? 'Pay Now' : 'Submit Payment',
                            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Colors.white),
                          ),
                  ),
                ),
              ],
            ),
    );
  }

  Widget _buildAssessmentSelection(AppColors colors, bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Select Assessment', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: colors.text)),
        const SizedBox(height: 12),
        GestureDetector(
          onTap: () => setState(() => _showAssessmentPicker = !_showAssessmentPicker),
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: colors.surface,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: colors.border),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  _selectedAssessment?.referenceNumber ?? 'Select an assessment to pay',
                  style: TextStyle(fontSize: 15, color: _selectedAssessment != null ? colors.text : colors.textLight),
                ),
                Icon(LucideIcons.chevronDown, size: 20, color: colors.textSecondary),
              ],
            ),
          ),
        ),
        if (_showAssessmentPicker)
          Container(
            margin: const EdgeInsets.only(top: 8),
            decoration: BoxDecoration(
              color: colors.surface,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: colors.border),
            ),
            child: Column(
              children: _unpaidAssessments.map((a) => InkWell(
                onTap: () {
                  setState(() {
                    _selectedAssessment = a;
                    _amountController.text = (a.amount - a.amountPaid).toString();
                    _showAssessmentPicker = false;
                  });
                },
                child: Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: _selectedAssessment?.id == a.id ? colors.primary.withOpacity(0.1) : Colors.transparent,
                    border: Border(bottom: BorderSide(color: colors.border)),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(a.referenceNumber, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: colors.text)),
                            const SizedBox(height: 2),
                            Text(a.businessName, style: TextStyle(fontSize: 12, color: colors.textSecondary)),
                          ],
                        ),
                      ),
                      Text(
                        _formatCurrency(a.amount - a.amountPaid),
                        style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: colors.primary),
                      ),
                    ],
                  ),
                ),
              )).toList(),
            ),
          ),
        if (_selectedAssessment != null && !_showAssessmentPicker)
          Container(
            margin: const EdgeInsets.only(top: 12),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: colors.surfaceSecondary,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              children: [
                _buildSummaryRow('Business', _selectedAssessment!.businessName, colors),
                _buildSummaryRow('Tax Type', _selectedAssessment!.taxType, colors),
                _buildSummaryRow('Due Date', _selectedAssessment!.dueDate, colors),
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 6),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Amount Due', style: TextStyle(fontSize: 13, color: colors.textSecondary)),
                      Text(
                        _formatCurrency(_selectedAssessment!.amount - _selectedAssessment!.amountPaid),
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: colors.primary),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
      ],
    );
  }

  Widget _buildSummaryRow(String label, String value, AppColors colors) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(fontSize: 13, color: colors.textSecondary)),
          Text(value, style: TextStyle(fontSize: 13, fontWeight: FontWeight.w500, color: colors.text)),
        ],
      ),
    );
  }

  Widget _buildPaymentMethodSection(AppColors colors, bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Payment Method', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: colors.text)),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: GestureDetector(
                onTap: () => setState(() => _paymentMethod = PaymentMethod.mobileMoney),
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: _paymentMethod == PaymentMethod.mobileMoney ? colors.primary.withOpacity(0.08) : colors.surface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: _paymentMethod == PaymentMethod.mobileMoney ? colors.primary : Colors.transparent,
                      width: 2,
                    ),
                  ),
                  child: Column(
                    children: [
                      Container(
                        width: 52,
                        height: 52,
                        decoration: BoxDecoration(color: colors.warning.withOpacity(0.15), borderRadius: BorderRadius.circular(14)),
                        alignment: Alignment.center,
                        child: Icon(LucideIcons.smartphone, color: colors.warning, size: 24),
                      ),
                      const SizedBox(height: 10),
                      Text('Mobile Money', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: colors.text)),
                      const SizedBox(height: 4),
                      Text('MTN MoMo, Orange Money', textAlign: TextAlign.center, style: TextStyle(fontSize: 11, color: colors.textSecondary)),
                      if (_paymentMethod == PaymentMethod.mobileMoney)
                        Container(
                          margin: const EdgeInsets.only(top: 8),
                          width: 22,
                          height: 22,
                          decoration: BoxDecoration(color: colors.primary, shape: BoxShape.circle),
                          child: const Icon(LucideIcons.check, color: Colors.white, size: 14),
                        ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: GestureDetector(
                onTap: () => setState(() => _paymentMethod = PaymentMethod.bankTransfer),
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: _paymentMethod == PaymentMethod.bankTransfer ? colors.primary.withOpacity(0.08) : colors.surface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: _paymentMethod == PaymentMethod.bankTransfer ? colors.primary : Colors.transparent,
                      width: 2,
                    ),
                  ),
                  child: Column(
                    children: [
                      Container(
                        width: 52,
                        height: 52,
                        decoration: BoxDecoration(color: colors.primary.withOpacity(0.15), borderRadius: BorderRadius.circular(14)),
                        alignment: Alignment.center,
                        child: Icon(LucideIcons.building, color: colors.primary, size: 24),
                      ),
                      const SizedBox(height: 10),
                      Text('Bank Transfer', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: colors.text)),
                      const SizedBox(height: 4),
                      Text('Upload payment proof', textAlign: TextAlign.center, style: TextStyle(fontSize: 11, color: colors.textSecondary)),
                      if (_paymentMethod == PaymentMethod.bankTransfer)
                        Container(
                          margin: const EdgeInsets.only(top: 8),
                          width: 22,
                          height: 22,
                          decoration: BoxDecoration(color: colors.primary, shape: BoxShape.circle),
                          child: const Icon(LucideIcons.check, color: Colors.white, size: 14),
                        ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildMomoDetails(AppColors colors) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Mobile Money Details', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: colors.text)),
        const SizedBox(height: 16),
        Text('Provider', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: colors.text)),
        const SizedBox(height: 8),
        Row(
          children: ['MTN MoMo', 'Orange Money'].map((p) => Expanded(
            child: GestureDetector(
              onTap: () => setState(() => _momoProvider = p),
              child: Container(
                margin: const EdgeInsets.only(right: 8),
                padding: const EdgeInsets.symmetric(vertical: 12),
                decoration: BoxDecoration(
                  color: _momoProvider == p ? colors.primary : colors.surfaceSecondary,
                  borderRadius: BorderRadius.circular(10),
                ),
                alignment: Alignment.center,
                child: Text(
                  p,
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                    color: _momoProvider == p ? Colors.white : colors.textSecondary,
                  ),
                ),
              ),
            ),
          )).toList(),
        ),
        const SizedBox(height: 16),
        Text('Mobile Money Number', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: colors.text)),
        const SizedBox(height: 8),
        TextField(
          controller: _momoNumberController,
          keyboardType: TextInputType.phone,
          style: TextStyle(fontSize: 15, color: colors.text),
          decoration: InputDecoration(
            hintText: 'e.g., 6XX XXX XXX',
            hintStyle: TextStyle(color: colors.textLight),
            filled: true,
            fillColor: colors.surface,
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: colors.border)),
            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: colors.border)),
          ),
          onChanged: (_) => setState(() {}),
        ),
      ],
    );
  }

  Widget _buildBankDetails(AppColors colors, bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Bank Details', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: colors.text)),
        const SizedBox(height: 16),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: colors.surface,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Bank Name:', style: TextStyle(fontSize: 12, color: colors.textSecondary)),
              Text('Afriland First Bank', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: colors.text)),
              const SizedBox(height: 8),
              Text('Account Name:', style: TextStyle(fontSize: 12, color: colors.textSecondary)),
              Text('Direction Générale des Impôts (DGI)', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: colors.text)),
              const SizedBox(height: 8),
              Text('Account Number:', style: TextStyle(fontSize: 12, color: colors.textSecondary)),
              Text('1234567890', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: colors.text)),
              const SizedBox(height: 8),
              Text('Reference:', style: TextStyle(fontSize: 12, color: colors.textSecondary)),
              Text(_selectedAssessment?.referenceNumber ?? 'Select assessment', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: colors.text)),
            ],
          ),
        ),
        const SizedBox(height: 16),
        Container(
          padding: const EdgeInsets.symmetric(vertical: 16),
          decoration: BoxDecoration(
            color: colors.primary.withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: colors.primary),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(LucideIcons.upload, size: 20, color: colors.primary),
              const SizedBox(width: 10),
              Text('Upload Payment Proof', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: colors.primary)),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildPaymentAmount(AppColors colors) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Payment Amount', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: colors.text)),
        const SizedBox(height: 12),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          decoration: BoxDecoration(
            color: colors.surface,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: colors.border),
          ),
          child: Row(
            children: [
              Text('FCFA', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600, color: colors.textSecondary)),
              const SizedBox(width: 8),
              Expanded(
                child: TextField(
                  controller: _amountController,
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  style: TextStyle(fontSize: 24, fontWeight: FontWeight.w600, color: colors.text),
                  decoration: InputDecoration(
                    hintText: '0.00',
                    hintStyle: TextStyle(color: colors.textLight),
                    border: InputBorder.none,
                    contentPadding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                  onChanged: (_) => setState(() {}),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
