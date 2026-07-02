import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:intl/intl.dart';
import '../state/app_state.dart';
import '../state/theme_state.dart';
import '../models/models.dart';

class CreateInvoiceScreen extends StatefulWidget {
  final String? taxpayerId;

  const CreateInvoiceScreen({super.key, this.taxpayerId});

  @override
  State<CreateInvoiceScreen> createState() => _CreateInvoiceScreenState();
}

class _CreateInvoiceScreenState extends State<CreateInvoiceScreen> {
  String? _selectedTaxpayerId;
  List<InvoiceItem> _items = [InvoiceItem(description: '', amount: 0.0)];
  final TextEditingController _dueDateController = TextEditingController();
  bool _showTaxpayerList = false;
  bool _isPending = false;

  final List<TextEditingController> _descriptionControllers = [TextEditingController()];
  final List<TextEditingController> _amountControllers = [TextEditingController()];

  @override
  void initState() {
    super.initState();
    _selectedTaxpayerId = widget.taxpayerId;
    // Set default due date: 30 days from now
    final defaultDueDate = DateTime.now().add(const Duration(days: 30));
    _dueDateController.text = DateFormat('yyyy-MM-dd').format(defaultDueDate);
  }

  @override
  void dispose() {
    _dueDateController.dispose();
    for (var c in _descriptionControllers) {
      c.dispose();
    }
    for (var c in _amountControllers) {
      c.dispose();
    }
    super.dispose();
  }

  String _formatCurrency(double amount) {
    final formatter = NumberFormat.currency(symbol: '', decimalDigits: 0);
    return '${formatter.format(amount).trim()} FCFA';
  }

  void _addItem() {
    setState(() {
      _items.add(InvoiceItem(description: '', amount: 0.0));
      _descriptionControllers.add(TextEditingController());
      _amountControllers.add(TextEditingController());
    });
  }

  void _removeItem(int index) {
    if (_items.length > 1) {
      setState(() {
        _items.removeAt(index);
        _descriptionControllers[index].dispose();
        _descriptionControllers.removeAt(index);
        _amountControllers[index].dispose();
        _amountControllers.removeAt(index);
      });
    }
  }

  void _updateItemAmount(int index, String value) {
    final doubleAmt = double.tryParse(value) ?? 0.0;
    setState(() {
      _items[index] = InvoiceItem(
        description: _descriptionControllers[index].text,
        amount: doubleAmt,
      );
    });
  }

  void _updateItemDescription(int index, String value) {
    setState(() {
      _items[index] = InvoiceItem(
        description: value,
        amount: _items[index].amount,
      );
    });
  }

  Future<void> _submitForm(AppState appState) async {
    final taxpayerIdVal = _selectedTaxpayerId;
    final dueDateVal = _dueDateController.text;

    if (taxpayerIdVal == null || taxpayerIdVal.isEmpty) {
      _showAlert('Error', 'Please select a taxpayer.');
      return;
    }

    // Sync input controllers to items list
    for (int i = 0; i < _items.length; i++) {
      final desc = _descriptionControllers[i].text;
      final amt = double.tryParse(_amountControllers[i].text) ?? 0.0;
      _items[i] = InvoiceItem(description: desc, amount: amt);
    }

    if (_items.any((item) => item.description.trim().isEmpty || item.amount <= 0)) {
      _showAlert('Error', 'Please fill all invoice items with valid descriptions and amounts.');
      return;
    }

    if (dueDateVal.trim().isEmpty) {
      _showAlert('Error', 'Please set a due date.');
      return;
    }

    setState(() {
      _isPending = true;
    });

    // Simulate delay
    await Future.delayed(const Duration(milliseconds: 600));

    try {
      final newInvoice = await appState.addInvoice(taxpayerIdVal, _items, dueDateVal);
      setState(() {
        _isPending = false;
      });

      if (mounted) {
        showDialog(
          context: context,
          builder: (context) => AlertDialog(
            title: const Text('Invoice Created'),
            content: Text('Invoice Number: ${newInvoice.invoiceNumber}'),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.pop(context); // Pop Dialog
                  Navigator.pop(context); // Pop Screen back
                },
                child: const Text('Done', style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        );
      }
    } catch (e) {
      setState(() {
        _isPending = false;
      });
      _showAlert('Error', e.toString());
    }
  }

  void _showAlert(String title, String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(title),
        content: Text(message),
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
    final themeState = Provider.of<ThemeState>(context);
    final appState = Provider.of<AppState>(context);
    final colors = themeState.colors;

    final preselectedTaxpayer = widget.taxpayerId != null
        ? appState.getTaxpayerById(widget.taxpayerId!)
        : null;

    final selectedTaxpayer = _selectedTaxpayerId != null
        ? appState.getTaxpayerById(_selectedTaxpayerId!)
        : null;

    // Calculate dynamic total
    double totalAmount = 0.0;
    for (var c in _amountControllers) {
      totalAmount += double.tryParse(c.text) ?? 0.0;
    }

    final inputStyle = InputDecoration(
      filled: true,
      fillColor: colors.inputBg,
      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: BorderSide(color: colors.border),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: BorderSide(color: colors.primary, width: 2),
      ),
    );

    return Scaffold(
      appBar: AppBar(
        title: const Text('Create Invoice'),
        backgroundColor: themeState.isDarkMode ? colors.background : colors.primary,
        foregroundColor: themeState.isDarkMode ? colors.text : Colors.white,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Select Taxpayer Section
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

            // Invoice Items Section
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Invoice Items *",
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: colors.text,
                  ),
                ),
                const SizedBox(height: 10),
                ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: _items.length,
                  itemBuilder: (context, index) {
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: Row(
                        children: [
                          Expanded(
                            flex: 2,
                            child: TextField(
                              controller: _descriptionControllers[index],
                              onChanged: (val) => _updateItemDescription(index, val),
                              style: TextStyle(color: colors.text, fontSize: 14),
                              decoration: inputStyle.copyWith(
                                hintText: "Description",
                                hintStyle: TextStyle(color: colors.textLight),
                              ),
                            ),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            flex: 1,
                            child: TextField(
                              controller: _amountControllers[index],
                              keyboardType: TextInputType.number,
                              onChanged: (val) => _updateItemAmount(index, val),
                              style: TextStyle(color: colors.text, fontSize: 14),
                              decoration: inputStyle.copyWith(
                                hintText: "Amount",
                                hintStyle: TextStyle(color: colors.textLight),
                              ),
                            ),
                          ),
                          if (_items.length > 1) ...[
                            const SizedBox(width: 4),
                            IconButton(
                              icon: Icon(LucideIcons.trash2, color: colors.danger),
                              onPressed: () => _removeItem(index),
                            ),
                          ],
                        ],
                      ),
                    );
                  },
                ),
                const SizedBox(height: 4),
                // Add Item Button (dashed-style box border decoration)
                InkWell(
                  onTap: _addItem,
                  borderRadius: BorderRadius.circular(10),
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    decoration: BoxDecoration(
                      border: Border.all(
                        color: colors.primary,
                        style: BorderStyle.solid, // Flutter doesn't have dashed natively without packages, solid is a good default
                      ),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(LucideIcons.plus, color: colors.primary, size: 18),
                        const SizedBox(width: 8),
                        Text(
                          "Add Item",
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: colors.primary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 24),

            // Due Date
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Due Date *",
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: colors.text,
                  ),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: _dueDateController,
                  style: TextStyle(color: colors.text, fontSize: 16),
                  decoration: inputStyle.copyWith(
                    hintText: "YYYY-MM-DD",
                    hintStyle: TextStyle(color: colors.textLight),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 24),

            // Total Card
            Container(
              width: double.infinity,
              decoration: BoxDecoration(
                color: colors.primary.withOpacity(0.12),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: colors.primary.withOpacity(0.3)),
              ),
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  Text(
                    "Total Amount",
                    style: TextStyle(
                      fontSize: 13,
                      color: colors.textSecondary,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    _formatCurrency(totalAmount),
                    style: TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.w700,
                      color: colors.primary,
                    ),
                  ),
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
                onPressed: _isPending ? null : () => _submitForm(appState),
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
                        "Create Invoice",
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
}
