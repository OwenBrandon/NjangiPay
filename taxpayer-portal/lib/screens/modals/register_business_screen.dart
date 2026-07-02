import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';

import '../../core/theme/app_theme.dart';
import '../../core/models/models.dart';
import '../../core/api/api_service.dart';

class RegisterBusinessScreen extends StatefulWidget {
  const RegisterBusinessScreen({super.key});

  @override
  State<RegisterBusinessScreen> createState() => _RegisterBusinessScreenState();
}

class _RegisterBusinessScreenState extends State<RegisterBusinessScreen> {
  int _step = 1;
  BusinessType? _businessType;
  
  final _nameController = TextEditingController();
  final _regNumController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _addressController = TextEditingController();
  final _descController = TextEditingController();
  
  List<String> _documents = [];
  bool _isSubmitting = false;

  @override
  void dispose() {
    _nameController.dispose();
    _regNumController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _addressController.dispose();
    _descController.dispose();
    super.dispose();
  }

  Future<void> _handleSubmit() async {
    setState(() => _isSubmitting = true);

    final api = context.read<ApiService>();
    final typeStr = _businessType == BusinessType.virtual ? 'virtual' : 'physical';
    final businessId = await api.registerBusiness(
      businessType: typeStr,
      name: _nameController.text.trim(),
      email: _emailController.text.trim(),
      phone: _phoneController.text.trim(),
      address: _addressController.text.trim().isEmpty ? 'N/A' : _addressController.text.trim(),
      registrationNumber: _regNumController.text.trim().isEmpty ? null : _regNumController.text.trim(),
      description: _descController.text.trim().isEmpty ? null : _descController.text.trim(),
    );

    setState(() => _isSubmitting = false);
    if (!mounted) return;

    if (businessId != null) {
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (ctx) => AlertDialog(
          title: Row(
            children: [
              Icon(LucideIcons.checkCircle, color: Colors.green, size: 24),
              const SizedBox(width: 10),
              const Expanded(child: Text('Registration Submitted')),
            ],
          ),
          content: Text(
            'Your ${_businessType == BusinessType.virtual ? 'virtual' : 'physical'} business "${_nameController.text.trim()}" has been submitted for review.\n\n'
            '${_businessType == BusinessType.physical ? 'A field officer may be dispatched to verify your business location.\n\n' : ''}'
            'You will receive a notification once the registration is approved by the Tax Administration.',
          ),
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
          title: const Text('Registration Failed'),
          content: const Text('There was an error submitting your business registration. Please try again.'),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('OK')),
          ],
        ),
      );
    }
  }

  void _handleDocumentUpload() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Upload Document'),
        content: const Text('Select a document to upload'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel', style: TextStyle(color: Colors.red)),
          ),
          TextButton(
            onPressed: () {
              setState(() {
                _documents.add('Document_${_documents.length + 1}.pdf');
              });
              Navigator.pop(context);
            },
            child: const Text('Choose File'),
          ),
        ],
      ),
    );
  }

  bool _canProceed() {
    if (_isSubmitting) return false;
    if (_step == 1) return _businessType != null;
    if (_step == 2) {
      return _nameController.text.isNotEmpty && _emailController.text.isNotEmpty && _phoneController.text.isNotEmpty;
    }
    return true;
  }

  @override
  Widget build(BuildContext context) {
    final themeProvider = context.watch<ThemeProvider>();
    final colors = themeProvider.colors;

    return Scaffold(
      backgroundColor: colors.background,
      appBar: AppBar(
        title: Text('Register Business', style: TextStyle(color: colors.text)),
        backgroundColor: colors.surface,
        elevation: 0,
        iconTheme: IconThemeData(color: colors.text),
      ),
      body: Column(
        children: [
          _buildProgressBar(colors),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(20).copyWith(bottom: 40),
              children: [
                if (_step == 1) _buildStep1(colors),
                if (_step == 2) _buildStep2(colors),
                if (_step == 3) _buildStep3(colors),
              ],
            ),
          ),
          _buildFooter(colors),
        ],
      ),
    );
  }

  Widget _buildProgressBar(AppColors colors) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 40),
      decoration: BoxDecoration(
        color: colors.surface,
        border: Border(bottom: BorderSide(color: colors.border)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          _buildProgressStep('1', _step >= 1, colors),
          _buildProgressLine(_step >= 2, colors),
          _buildProgressStep('2', _step >= 2, colors),
          _buildProgressLine(_step >= 3, colors),
          _buildProgressStep('3', _step >= 3, colors),
        ],
      ),
    );
  }

  Widget _buildProgressStep(String label, bool isActive, AppColors colors) {
    return Container(
      width: 32,
      height: 32,
      decoration: BoxDecoration(
        color: isActive ? colors.primary : colors.surfaceSecondary,
        shape: BoxShape.circle,
      ),
      alignment: Alignment.center,
      child: Text(
        label,
        style: TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.w600,
          color: isActive ? Colors.white : colors.textSecondary,
        ),
      ),
    );
  }

  Widget _buildProgressLine(bool isActive, AppColors colors) {
    return Expanded(
      child: Container(
        height: 2,
        margin: const EdgeInsets.symmetric(horizontal: 8),
        color: isActive ? colors.primary : colors.border,
      ),
    );
  }

  Widget _buildStep1(AppColors colors) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Select Business Type', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: colors.text)),
        const SizedBox(height: 8),
        Text('Choose the type of business you want to register', style: TextStyle(fontSize: 14, color: colors.textSecondary)),
        const SizedBox(height: 24),
        _buildTypeCard(BusinessType.physical, 'Physical Business', 'Business with a physical location such as a shop, office, or warehouse', LucideIcons.building2, colors.primary, colors),
        _buildTypeCard(BusinessType.virtual, 'Virtual Business', 'Online business without a physical location, such as e-commerce or digital services', LucideIcons.globe, colors.secondary, colors),
      ],
    );
  }

  Widget _buildTypeCard(BusinessType type, String title, String desc, IconData icon, Color primaryColor, AppColors colors) {
    final isSelected = _businessType == type;
    return GestureDetector(
      onTap: () => setState(() => _businessType = type),
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isSelected ? primaryColor.withOpacity(0.08) : colors.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: isSelected ? primaryColor : Colors.transparent, width: 2),
        ),
        child: Row(
          children: [
            Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(color: primaryColor.withOpacity(0.15), borderRadius: BorderRadius.circular(14)),
              alignment: Alignment.center,
              child: Icon(icon, size: 28, color: primaryColor),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: colors.text)),
                  const SizedBox(height: 4),
                  Text(desc, style: TextStyle(fontSize: 13, color: colors.textSecondary, height: 1.3)),
                ],
              ),
            ),
            if (isSelected)
              Container(
                width: 28,
                height: 28,
                decoration: BoxDecoration(color: colors.primary, shape: BoxShape.circle),
                alignment: Alignment.center,
                child: const Icon(LucideIcons.check, size: 18, color: Colors.white),
              )
          ],
        ),
      ),
    );
  }

  Widget _buildStep2(AppColors colors) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Business Details', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: colors.text)),
        const SizedBox(height: 8),
        Text('Provide information about your business', style: TextStyle(fontSize: 14, color: colors.textSecondary)),
        const SizedBox(height: 24),
        _buildFormGroup('Business Name *', _nameController, 'Enter business name', colors),
        _buildFormGroup('Registration Number', _regNumController, 'e.g., BRN-2024-XXXXX', colors),
        _buildFormGroup('Email Address *', _emailController, 'business@email.com', colors, keyboardType: TextInputType.emailAddress),
        _buildFormGroup('Phone Number *', _phoneController, '+237 6XX XXX XXX', colors, keyboardType: TextInputType.phone),
        if (_businessType == BusinessType.physical)
          _buildFormGroup('Business Address *', _addressController, 'Enter full address', colors, isMultiline: true),
        _buildFormGroup('Business Description', _descController, 'Brief description of your business activities', colors, isMultiline: true),
      ],
    );
  }

  Widget _buildFormGroup(String label, TextEditingController controller, String hint, AppColors colors, {TextInputType? keyboardType, bool isMultiline = false}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 18),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: colors.text)),
          const SizedBox(height: 8),
          TextField(
            controller: controller,
            keyboardType: keyboardType,
            maxLines: isMultiline ? 3 : 1,
            style: TextStyle(fontSize: 15, color: colors.text),
            onChanged: (_) => setState(() {}),
            decoration: InputDecoration(
              hintText: hint,
              hintStyle: TextStyle(color: colors.textLight),
              filled: true,
              fillColor: colors.surface,
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: colors.border)),
              enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: colors.border)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStep3(AppColors colors) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Upload Documents', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: colors.text)),
        const SizedBox(height: 8),
        Text('Upload required documents for verification', style: TextStyle(fontSize: 14, color: colors.textSecondary)),
        const SizedBox(height: 24),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(color: colors.surface, borderRadius: BorderRadius.circular(12)),
          child: Column(
            children: [
              _buildDocItem('Business Registration Certificate', colors),
              _buildDocItem('TIN Certificate', colors),
              _buildDocItem('ID of Business Owner', colors, isLast: true),
            ],
          ),
        ),
        if (_documents.isNotEmpty) ...[
          const SizedBox(height: 20),
          Text('Uploaded Documents', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: colors.text)),
          const SizedBox(height: 10),
          ..._documents.map((d) => Container(
            margin: const EdgeInsets.only(bottom: 8),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(color: colors.success.withOpacity(0.1), borderRadius: BorderRadius.circular(8)),
            child: Row(
              children: [
                Icon(LucideIcons.check, size: 16, color: colors.success),
                const SizedBox(width: 10),
                Text(d, style: TextStyle(fontSize: 13, color: colors.text)),
              ],
            ),
          )),
        ],
        const SizedBox(height: 20),
        GestureDetector(
          onTap: _handleDocumentUpload,
          child: Container(
            padding: const EdgeInsets.symmetric(vertical: 16),
            decoration: BoxDecoration(
              color: colors.primary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: colors.primary, style: BorderStyle.solid), // Dart flutter doesn't support dashed easily out of box
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(LucideIcons.upload, size: 20, color: colors.primary),
                const SizedBox(width: 10),
                Text('Upload Document', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: colors.primary)),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildDocItem(String name, AppColors colors, {bool isLast = false}) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 10),
      decoration: BoxDecoration(border: isLast ? null : Border(bottom: BorderSide(color: colors.border))),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(name, style: TextStyle(fontSize: 14, color: colors.text)),
          Text('Required', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: colors.danger)),
        ],
      ),
    );
  }

  Widget _buildFooter(AppColors colors) {
    return Container(
      padding: const EdgeInsets.all(16).copyWith(bottom: 32),
      decoration: BoxDecoration(
        color: colors.surface,
        border: Border(top: BorderSide(color: colors.border)),
      ),
      child: Row(
        children: [
          if (_step > 1) ...[
            TextButton(
              onPressed: () => setState(() => _step--),
              style: TextButton.styleFrom(
                backgroundColor: colors.surfaceSecondary,
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: Text('Back', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: colors.textSecondary)),
            ),
            const SizedBox(width: 12),
          ],
          Expanded(
            child: ElevatedButton(
              onPressed: _canProceed()
                  ? () {
                      if (_step < 3) {
                        setState(() => _step++);
                      } else {
                        _handleSubmit();
                      }
                    }
                  : null,
              style: ElevatedButton.styleFrom(
                backgroundColor: colors.primary,
                disabledBackgroundColor: colors.textLight,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  _isSubmitting
                      ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                      : Text(_step == 3 ? 'Submit Registration' : 'Continue', style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: Colors.white)),
                  if (_step < 3) ...[
                    const SizedBox(width: 6),
                    const Icon(LucideIcons.chevronRight, size: 18, color: Colors.white),
                  ]
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
