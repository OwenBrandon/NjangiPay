import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';

import '../../core/theme/app_theme.dart';
import '../../core/models/models.dart';
import '../../core/api/api_service.dart';

class SubmitDisputeScreen extends StatefulWidget {
  const SubmitDisputeScreen({super.key});

  @override
  State<SubmitDisputeScreen> createState() => _SubmitDisputeScreenState();
}

class _SubmitDisputeScreenState extends State<SubmitDisputeScreen> {
  DisputeCategory? _category;
  final _refController = TextEditingController();
  final _subjectController = TextEditingController();
  final _descController = TextEditingController();
  List<String> _attachments = [];
  bool _showCategoryPicker = false;
  bool _isSubmitting = false;

  final List<Map<String, dynamic>> _categories = [
    {'key': DisputeCategory.assessment, 'label': 'Assessment Issue', 'desc': 'Dispute tax assessment amount or calculation'},
    {'key': DisputeCategory.payment, 'label': 'Payment Issue', 'desc': 'Payment not reflected or incorrect'},
    {'key': DisputeCategory.registration, 'label': 'Registration Issue', 'desc': 'Business registration problems'},
    {'key': DisputeCategory.other, 'label': 'Other', 'desc': 'Other complaints or inquiries'},
  ];

  @override
  void dispose() {
    _refController.dispose();
    _subjectController.dispose();
    _descController.dispose();
    super.dispose();
  }

  void _handleAttachment() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Add Attachment'),
        content: const Text('Select a file to attach'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel', style: TextStyle(color: Colors.red)),
          ),
          TextButton(
            onPressed: () {
              setState(() {
                _attachments.add('Attachment_${_attachments.length + 1}.pdf');
              });
              Navigator.pop(context);
            },
            child: const Text('Choose File'),
          ),
        ],
      ),
    );
  }

  void _handleSubmit() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Submit Dispute'),
        content: const Text('Are you sure you want to submit this dispute?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel', style: TextStyle(color: Colors.red)),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(ctx);
              _processSubmission();
            },
            child: const Text('Submit'),
          ),
        ],
      ),
    );
  }

  Future<void> _processSubmission() async {
    setState(() => _isSubmitting = true);

    final api = context.read<ApiService>();
    final categoryStr = _category == DisputeCategory.assessment ? 'assessment'
        : _category == DisputeCategory.payment ? 'payment'
        : _category == DisputeCategory.registration ? 'registration'
        : 'other';

    final ticketNumber = await api.submitDispute(
      category: categoryStr,
      subject: _subjectController.text.trim(),
      description: _descController.text.trim(),
    );

    setState(() => _isSubmitting = false);
    if (!mounted) return;

    if (ticketNumber != null) {
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (ctx) => AlertDialog(
          title: Row(
            children: [
              Icon(LucideIcons.checkCircle, color: Colors.green, size: 24),
              const SizedBox(width: 10),
              const Text('Dispute Submitted'),
            ],
          ),
          content: Text('Your dispute has been submitted successfully.\n\nReference: $ticketNumber\n\nYou will receive updates on the status of your dispute.'),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(ctx);
                context.pop();
              },
              child: const Text('OK'),
            ),
          ],
        ),
      );
    } else {
      showDialog(
        context: context,
        builder: (ctx) => AlertDialog(
          title: const Text('Submission Failed'),
          content: const Text('There was an error submitting your dispute. Please try again.'),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('OK')),
          ],
        ),
      );
    }
  }

  bool _canSubmit() {
    if (_isSubmitting) return false;
    return _category != null && _subjectController.text.trim().isNotEmpty && _descController.text.trim().isNotEmpty;
  }

  @override
  Widget build(BuildContext context) {
    final themeProvider = context.watch<ThemeProvider>();
    final colors = themeProvider.colors;

    return Scaffold(
      backgroundColor: colors.background,
      appBar: AppBar(
        title: Text('Submit Dispute', style: TextStyle(color: colors.text)),
        backgroundColor: colors.surface,
        elevation: 0,
        iconTheme: IconThemeData(color: colors.text),
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(16).copyWith(bottom: 40),
              children: [
                _buildCategorySection(colors),
                const SizedBox(height: 24),
                _buildFormSection('Reference Number (Optional)', _refController, 'e.g., ASS-2024-XXXXX or PAY-2024-XXXXX', colors, helperText: 'If your dispute is related to a specific assessment or payment, enter its reference number'),
                const SizedBox(height: 24),
                _buildFormSection('Subject *', _subjectController, 'Brief summary of your dispute', colors, maxLength: 100),
                const SizedBox(height: 24),
                _buildFormSection('Description *', _descController, 'Provide detailed information about your dispute. Include relevant dates, amounts, and any supporting facts.', colors, maxLength: 1000, isMultiline: true),
                const SizedBox(height: 24),
                _buildAttachmentsSection(colors),
                const SizedBox(height: 24),
                _buildInfoBox(colors),
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
              onPressed: _canSubmit() ? _handleSubmit : null,
              style: ElevatedButton.styleFrom(
                backgroundColor: colors.primary,
                disabledBackgroundColor: colors.textLight,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: _isSubmitting
                  ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                  : const Text('Submit Dispute', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Colors.white)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCategorySection(AppColors colors) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Dispute Category *', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: colors.text)),
        const SizedBox(height: 10),
        GestureDetector(
          onTap: () => setState(() => _showCategoryPicker = !_showCategoryPicker),
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
                  _category != null ? _categories.firstWhere((c) => c['key'] == _category)['label'] : 'Select a category',
                  style: TextStyle(fontSize: 15, color: _category != null ? colors.text : colors.textLight),
                ),
                Icon(LucideIcons.chevronDown, size: 20, color: colors.textSecondary),
              ],
            ),
          ),
        ),
        if (_showCategoryPicker)
          Container(
            margin: const EdgeInsets.only(top: 8),
            decoration: BoxDecoration(
              color: colors.surface,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: colors.border),
            ),
            child: Column(
              children: _categories.map((c) {
                final isSelected = _category == c['key'];
                return InkWell(
                  onTap: () {
                    setState(() {
                      _category = c['key'];
                      _showCategoryPicker = false;
                    });
                  },
                  child: Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: isSelected ? colors.primary.withOpacity(0.1) : Colors.transparent,
                      border: Border(bottom: BorderSide(color: colors.border)),
                    ),
                    child: Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(c['label'], style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: colors.text)),
                              const SizedBox(height: 2),
                              Text(c['desc'], style: TextStyle(fontSize: 12, color: colors.textSecondary)),
                            ],
                          ),
                        ),
                        if (isSelected)
                          Icon(LucideIcons.check, size: 18, color: colors.primary),
                      ],
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
      ],
    );
  }

  Widget _buildFormSection(String label, TextEditingController controller, String hint, AppColors colors, {String? helperText, int? maxLength, bool isMultiline = false}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: colors.text)),
        const SizedBox(height: 10),
        TextField(
          controller: controller,
          maxLines: isMultiline ? 6 : 1,
          maxLength: maxLength,
          style: TextStyle(fontSize: 15, color: colors.text),
          onChanged: (_) => setState(() {}),
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: TextStyle(color: colors.textLight),
            filled: true,
            fillColor: colors.surface,
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: colors.border)),
            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: colors.border)),
            counterStyle: TextStyle(color: colors.textLight, fontSize: 11),
          ),
        ),
        if (helperText != null)
          Padding(
            padding: const EdgeInsets.only(top: 6),
            child: Text(helperText, style: TextStyle(fontSize: 12, color: colors.textSecondary)),
          ),
      ],
    );
  }

  Widget _buildAttachmentsSection(AppColors colors) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Attachments', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: colors.text)),
        const SizedBox(height: 6),
        Text('Upload supporting documents (receipts, calculations, correspondence)', style: TextStyle(fontSize: 12, color: colors.textSecondary)),
        const SizedBox(height: 12),
        if (_attachments.isNotEmpty)
          Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: Column(
              children: _attachments.asMap().entries.map((entry) {
                int idx = entry.key;
                String att = entry.value;
                return Container(
                  margin: const EdgeInsets.only(bottom: 8),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(color: colors.success.withOpacity(0.1), borderRadius: BorderRadius.circular(8)),
                  child: Row(
                    children: [
                      Icon(LucideIcons.check, size: 16, color: colors.success),
                      const SizedBox(width: 10),
                      Expanded(child: Text(att, style: TextStyle(fontSize: 13, color: colors.text))),
                      GestureDetector(
                        onTap: () {
                          setState(() {
                            _attachments.removeAt(idx);
                          });
                        },
                        child: Text('Remove', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: colors.danger)),
                      ),
                    ],
                  ),
                );
              }).toList(),
            ),
          ),
        GestureDetector(
          onTap: _handleAttachment,
          child: Container(
            padding: const EdgeInsets.symmetric(vertical: 14),
            decoration: BoxDecoration(
              color: colors.primary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: colors.primary, style: BorderStyle.solid),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(LucideIcons.upload, size: 20, color: colors.primary),
                const SizedBox(width: 10),
                Text('Add Attachment', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: colors.primary)),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildInfoBox(AppColors colors) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: colors.info.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border(left: BorderSide(color: colors.info, width: 3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('What happens next?', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: colors.info)),
          const SizedBox(height: 8),
          Text('1. Your dispute will be reviewed within 5-7 business days\n2. You may be contacted for additional information\n3. You will receive a notification when the status changes\n4. Track your dispute in the Disputes section', style: TextStyle(fontSize: 13, color: colors.text, height: 1.5)),
        ],
      ),
    );
  }
}
