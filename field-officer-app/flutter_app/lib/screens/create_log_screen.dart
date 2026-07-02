import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../state/app_state.dart';
import '../state/theme_state.dart';

class CreateLogScreen extends StatefulWidget {
  final String? taxpayerId;

  const CreateLogScreen({super.key, this.taxpayerId});

  @override
  State<CreateLogScreen> createState() => _CreateLogScreenState();
}

class _CreateLogScreenState extends State<CreateLogScreen> {
  String? _selectedTaxpayerId;
  String _purpose = 'collection'; // 'collection', 'inspection', 'verification', 'follow-up'
  String _outcome = 'successful'; // 'successful', 'not-available', 'refused', 'rescheduled'
  final TextEditingController _notesController = TextEditingController();
  bool _showTaxpayerList = false;
  bool _isPending = false;

  @override
  void initState() {
    super.initState();
    _selectedTaxpayerId = widget.taxpayerId;
  }

  @override
  void dispose() {
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _submitForm(AppState appState) async {
    final taxpayerIdVal = _selectedTaxpayerId;
    final notesVal = _notesController.text;

    if (taxpayerIdVal == null || taxpayerIdVal.isEmpty) {
      _showAlert('Error', 'Please select a taxpayer.');
      return;
    }

    setState(() {
      _isPending = true;
    });

    // Simulate database write
    await Future.delayed(const Duration(milliseconds: 600));

    try {
      await appState.addVisitLog(taxpayerIdVal, _purpose, _outcome, notesVal);
      setState(() {
        _isPending = false;
      });

      if (mounted) {
        showDialog(
          context: context,
          builder: (context) => AlertDialog(
            title: const Text('Visit Logged'),
            content: const Text('Visit log has been saved successfully.'),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.pop(context); // Pop Dialog
                  Navigator.pop(context); // Pop Screen
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

    final purposeOptions = [
      {'value': 'collection', 'label': 'Collection', 'icon': LucideIcons.mapPin},
      {'value': 'inspection', 'label': 'Inspection', 'icon': LucideIcons.search},
      {'value': 'verification', 'label': 'Verification', 'icon': LucideIcons.checkCircle},
      {'value': 'follow-up', 'label': 'Follow-up', 'icon': LucideIcons.refreshCw},
    ];

    final outcomeOptions = [
      {'value': 'successful', 'label': 'Successful', 'color': colors.success},
      {'value': 'not-available', 'label': 'Not Available', 'color': colors.warning},
      {'value': 'refused', 'label': 'Refused', 'color': colors.danger},
      {'value': 'rescheduled', 'label': 'Rescheduled', 'color': colors.primary},
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('New Visit Log'),
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

            // Visit Purpose Section
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Visit Purpose *",
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: colors.text,
                  ),
                ),
                const SizedBox(height: 10),
                GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    crossAxisSpacing: 10,
                    mainAxisSpacing: 10,
                    childAspectRatio: 2.2,
                  ),
                  itemCount: purposeOptions.length,
                  itemBuilder: (context, index) {
                    final opt = purposeOptions[index];
                    final active = _purpose == opt['value'];

                    return GestureDetector(
                      onTap: () {
                        setState(() {
                          _purpose = opt['value'] as String;
                        });
                      },
                      child: Container(
                        decoration: BoxDecoration(
                          color: active ? colors.primary : colors.surface,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: active ? colors.primary : colors.border,
                            width: 2,
                          ),
                        ),
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              opt['icon'] as IconData,
                              size: 20,
                              color: active ? Colors.white : colors.textSecondary,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              opt['label'] as String,
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w500,
                                color: active ? Colors.white : colors.textSecondary,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ],
            ),

            const SizedBox(height: 24),

            // Visit Outcome Section
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Visit Outcome *",
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: colors.text,
                  ),
                ),
                const SizedBox(height: 10),
                Column(
                  children: outcomeOptions.map((opt) {
                    final value = opt['value'] as String;
                    final active = _outcome == value;
                    final outcomeColor = opt['color'] as Color;

                    return Padding(
                      padding: const EdgeInsets.only(bottom: 10),
                      child: GestureDetector(
                        onTap: () {
                          setState(() {
                            _outcome = value;
                          });
                        },
                        child: Container(
                          decoration: BoxDecoration(
                            color: active ? outcomeColor.withOpacity(0.2) : colors.surface,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: active ? outcomeColor : colors.border,
                              width: 2,
                            ),
                          ),
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                          child: Row(
                            children: [
                              if (active) ...[
                                Container(
                                  width: 20,
                                  height: 20,
                                  decoration: BoxDecoration(
                                    color: outcomeColor,
                                    shape: BoxShape.circle,
                                  ),
                                  child: const Icon(LucideIcons.check, size: 12, color: Colors.white),
                                ),
                                const SizedBox(width: 12),
                              ],
                              Text(
                                opt['label'] as String,
                                style: TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w500,
                                  color: active ? outcomeColor : colors.textSecondary,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ],
            ),

            const SizedBox(height: 24),

            // Notes Section
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Notes",
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: colors.text,
                  ),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: _notesController,
                  maxLines: 4,
                  style: TextStyle(color: colors.text, fontSize: 15),
                  decoration: inputStyle.copyWith(
                    hintText: "Add notes about the visit...",
                    hintStyle: TextStyle(color: colors.textLight),
                  ),
                ),
              ],
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
                        "Save Visit Log",
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
