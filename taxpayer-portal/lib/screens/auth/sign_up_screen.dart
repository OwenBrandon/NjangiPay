import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import '../../core/auth/auth_state.dart';
import '../../core/theme/app_theme.dart';

class SignUpScreen extends StatefulWidget {
  const SignUpScreen({super.key});

  @override
  State<SignUpScreen> createState() => _SignUpScreenState();
}

class _SignUpScreenState extends State<SignUpScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _addressController = TextEditingController();
  final _tinController = TextEditingController();
  final _businessNameController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  bool _obscurePassword = true;
  bool _obscureConfirm = true;
  bool _acceptedTerms = false;
  bool _isLoading = false;
  String _selectedRegion = 'Southwest (Sud-Ouest)';
  final Map<String, bool> _taxTypes = {'VAT': false, 'CIT': false, 'PIT': false, 'WHT': false};

  static const _regions = [
    'Southwest (Sud-Ouest)', 'Centre', 'Littoral', 'Adamawa (Adamaoua)',
    'Far North (Extrême-Nord)', 'North (Nord)', 'Northwest (Nord-Ouest)',
    'South (Sud)', 'East (Est)', 'West (Ouest)',
  ];

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _addressController.dispose();
    _tinController.dispose();
    _businessNameController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  double get _passwordStrength {
    final p = _passwordController.text;
    if (p.isEmpty) return 0;
    double s = 0;
    if (p.length >= 8) s += 0.25;
    if (p.contains(RegExp(r'[A-Z]'))) s += 0.25;
    if (p.contains(RegExp(r'[0-9]'))) s += 0.25;
    if (p.contains(RegExp(r'[!@#$%^&*(),.?":{}|<>]'))) s += 0.25;
    return s;
  }

  String get _strengthLabel {
    final s = _passwordStrength;
    if (s <= 0.25) return 'Weak';
    if (s <= 0.5) return 'Fair';
    if (s <= 0.75) return 'Good';
    return 'Strong';
  }

  Color _strengthColor(AppColors colors) {
    final s = _passwordStrength;
    if (s <= 0.25) return colors.danger;
    if (s <= 0.5) return colors.warning;
    if (s <= 0.75) return colors.info;
    return colors.success;
  }

  Future<void> _handleRegister() async {
    if (!_formKey.currentState!.validate()) return;
    if (!_acceptedTerms) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('You must accept the Terms of Service to continue.'), behavior: SnackBarBehavior.floating),
      );
      return;
    }

    final selectedTaxTypes = _taxTypes.entries.where((e) => e.value).map((e) => e.key).toList();
    if (selectedTaxTypes.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select at least one tax obligation type.'), behavior: SnackBarBehavior.floating),
      );
      return;
    }

    setState(() => _isLoading = true);

    final auth = context.read<AuthState>();
    final success = await auth.register(
      fullName: _nameController.text,
      email: _emailController.text,
      phone: _phoneController.text,
      address: _addressController.text,
      tin: _tinController.text,
      businessName: _businessNameController.text.isNotEmpty ? _businessNameController.text : null,
      region: _selectedRegion,
      taxTypes: selectedTaxTypes,
      password: _passwordController.text,
    );

    if (mounted) {
      setState(() => _isLoading = false);
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Registration successful! Your account is pending approval.'),
            backgroundColor: Color(0xFF34C759),
            behavior: SnackBarBehavior.floating,
          ),
        );
        context.go('/pending-approval');
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(auth.lastError ?? 'Registration failed. Please try again.'),
            backgroundColor: const Color(0xFFFF3B30),
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    debugPrint('SIGNUP: _selectedRegion=$_selectedRegion (len=${_selectedRegion.length}), _regions contains it: ${_regions.contains(_selectedRegion)}');
    final theme = context.watch<ThemeProvider>();
    final colors = theme.colors;
    final isDark = theme.isDark;

    return Scaffold(
      backgroundColor: colors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
          child: Column(children: [
            // Header
            Container(
              width: 56, height: 56,
              decoration: BoxDecoration(
                color: colors.primary,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [BoxShadow(color: colors.primary.withValues(alpha: 0.3), blurRadius: 20, offset: const Offset(0, 6))],
              ),
              child: const Icon(LucideIcons.building2, color: Colors.white, size: 24),
            ),
            const SizedBox(height: 14),
            Text('Create Taxpayer Account', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: colors.text, letterSpacing: -0.3)),
            const SizedBox(height: 4),
            Text('Government Revenue Authority', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: colors.textSecondary)),
            const SizedBox(height: 28),

            // Form
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: colors.surface,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: colors.border.withValues(alpha: 0.5)),
                boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: isDark ? 0.3 : 0.06), blurRadius: 20, offset: const Offset(0, 4))],
              ),
              child: Form(
                key: _formKey,
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  // --- Personal Information ---
                  _sectionHeader(colors, LucideIcons.user, 'Personal Information'),
                  const SizedBox(height: 16),
                  _fieldLabel(colors, 'Full Name *'),
                  const SizedBox(height: 6),
                  TextFormField(
                    controller: _nameController,
                    style: _fieldStyle(colors),
                    decoration: _inputDecoration(colors, 'John Mensah', LucideIcons.user),
                    validator: (v) => (v == null || v.trim().isEmpty) ? 'Full name is required' : null,
                    textInputAction: TextInputAction.next,
                  ),
                  const SizedBox(height: 14),
                  _fieldLabel(colors, 'Email Address *'),
                  const SizedBox(height: 6),
                  TextFormField(
                    controller: _emailController,
                    keyboardType: TextInputType.emailAddress,
                    style: _fieldStyle(colors),
                    decoration: _inputDecoration(colors, 'john@email.com', LucideIcons.mail),
                    validator: (v) {
                      if (v == null || v.trim().isEmpty) return 'Email is required';
                      if (!RegExp(r'^[\w\-.]+@[\w\-.]+\.\w+$').hasMatch(v.trim())) return 'Enter a valid email address';
                      return null;
                    },
                    textInputAction: TextInputAction.next,
                  ),
                  const SizedBox(height: 14),
                  _fieldLabel(colors, 'Phone Number *'),
                  const SizedBox(height: 6),
                  TextFormField(
                    controller: _phoneController,
                    keyboardType: TextInputType.phone,
                    style: _fieldStyle(colors),
                    decoration: _inputDecoration(colors, '+237 6XX XXX XXX', LucideIcons.phone),
                    validator: (v) => (v == null || v.trim().isEmpty) ? 'Phone number is required' : null,
                    textInputAction: TextInputAction.next,
                  ),
                  const SizedBox(height: 14),
                  _fieldLabel(colors, 'Address *'),
                  const SizedBox(height: 6),
                  TextFormField(
                    controller: _addressController,
                    style: _fieldStyle(colors),
                    decoration: _inputDecoration(colors, '15 Rue du Marché, Buea', LucideIcons.mapPin),
                    validator: (v) => (v == null || v.trim().isEmpty) ? 'Address is required' : null,
                    textInputAction: TextInputAction.next,
                  ),

                  const SizedBox(height: 28),

                  // --- Tax Information ---
                  _sectionHeader(colors, LucideIcons.fileText, 'Tax Information'),
                  const SizedBox(height: 16),
                  _fieldLabel(colors, 'Taxpayer Identification Number (TIN) *'),
                  const SizedBox(height: 6),
                  TextFormField(
                    controller: _tinController,
                    style: _fieldStyle(colors),
                    decoration: _inputDecoration(colors, 'TIN-2026-XXXX', LucideIcons.hash).copyWith(
                      helperText: 'Your unique tax identification number',
                      helperStyle: TextStyle(fontSize: 11, color: colors.textLight),
                    ),
                    validator: (v) {
                      if (v == null || v.trim().isEmpty) return 'TIN is required';
                      if (v.trim().length < 8) return 'TIN must be at least 8 characters';
                      return null;
                    },
                    textInputAction: TextInputAction.next,
                  ),
                  const SizedBox(height: 14),
                  _fieldLabel(colors, 'Business Name (optional)'),
                  const SizedBox(height: 6),
                  TextFormField(
                    controller: _businessNameController,
                    style: _fieldStyle(colors),
                    decoration: _inputDecoration(colors, 'Mensah Electronics Ltd', LucideIcons.briefcase),
                    textInputAction: TextInputAction.next,
                  ),
                  const SizedBox(height: 14),
                  _fieldLabel(colors, 'Region *'),
                  const SizedBox(height: 6),
                  DropdownButtonFormField<String>(
                    value: _selectedRegion,
                    items: _regions.map((r) => DropdownMenuItem(value: r, child: Text(r, style: _fieldStyle(colors)))).toList(),
                    onChanged: (v) => setState(() => _selectedRegion = v ?? _selectedRegion),
                    decoration: _inputDecoration(colors, '', LucideIcons.map),
                    dropdownColor: colors.surface,
                  ),
                  const SizedBox(height: 14),
                  _fieldLabel(colors, 'Tax Obligation Types *'),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 10, runSpacing: 8,
                    children: _taxTypes.keys.map((type) {
                      final selected = _taxTypes[type]!;
                      return GestureDetector(
                        onTap: () => setState(() => _taxTypes[type] = !selected),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                          decoration: BoxDecoration(
                            color: selected ? colors.primary.withValues(alpha: 0.1) : colors.background,
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(color: selected ? colors.primary : colors.border.withValues(alpha: 0.5)),
                          ),
                          child: Text(type, style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: selected ? colors.primary : colors.textSecondary)),
                        ),
                      );
                    }).toList(),
                  ),

                  const SizedBox(height: 28),

                  // --- Security ---
                  _sectionHeader(colors, LucideIcons.shield, 'Security'),
                  const SizedBox(height: 16),
                  _fieldLabel(colors, 'Password *'),
                  const SizedBox(height: 6),
                  TextFormField(
                    controller: _passwordController,
                    obscureText: _obscurePassword,
                    style: _fieldStyle(colors),
                    decoration: _inputDecoration(colors, 'Min. 8 characters', LucideIcons.lock).copyWith(
                      suffixIcon: IconButton(
                        icon: Icon(_obscurePassword ? LucideIcons.eyeOff : LucideIcons.eye, size: 18, color: colors.textLight),
                        onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                      ),
                    ),
                    validator: (v) {
                      if (v == null || v.length < 8) return 'Password must be at least 8 characters';
                      return null;
                    },
                    onChanged: (_) => setState(() {}),
                    textInputAction: TextInputAction.next,
                  ),
                  if (_passwordController.text.isNotEmpty) ...[
                    const SizedBox(height: 10),
                    Row(children: [
                      Expanded(
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(4),
                          child: LinearProgressIndicator(
                            value: _passwordStrength,
                            backgroundColor: colors.border.withValues(alpha: 0.3),
                            color: _strengthColor(colors),
                            minHeight: 4,
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Text(_strengthLabel, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: _strengthColor(colors))),
                    ]),
                  ],
                  const SizedBox(height: 14),
                  _fieldLabel(colors, 'Confirm Password *'),
                  const SizedBox(height: 6),
                  TextFormField(
                    controller: _confirmPasswordController,
                    obscureText: _obscureConfirm,
                    style: _fieldStyle(colors),
                    decoration: _inputDecoration(colors, 'Re-enter your password', LucideIcons.lock).copyWith(
                      suffixIcon: IconButton(
                        icon: Icon(_obscureConfirm ? LucideIcons.eyeOff : LucideIcons.eye, size: 18, color: colors.textLight),
                        onPressed: () => setState(() => _obscureConfirm = !_obscureConfirm),
                      ),
                    ),
                    validator: (v) {
                      if (v != _passwordController.text) return 'Passwords do not match';
                      return null;
                    },
                  ),
                  const SizedBox(height: 18),

                  // Terms
                  Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    SizedBox(
                      width: 20, height: 20,
                      child: Checkbox(
                        value: _acceptedTerms,
                        onChanged: (v) => setState(() => _acceptedTerms = v ?? false),
                        activeColor: colors.primary,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
                        side: BorderSide(color: colors.border),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text.rich(TextSpan(children: [
                        TextSpan(text: 'I agree to the GRA ', style: TextStyle(fontSize: 12, color: colors.textSecondary)),
                        TextSpan(text: 'Terms of Service', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: colors.primary)),
                        TextSpan(text: ' and ', style: TextStyle(fontSize: 12, color: colors.textSecondary)),
                        TextSpan(text: 'Privacy Policy', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: colors.primary)),
                      ])),
                    ),
                  ]),

                  const SizedBox(height: 24),

                  // Register button
                  SizedBox(
                    width: double.infinity, height: 52,
                    child: ElevatedButton(
                      onPressed: _isLoading ? null : _handleRegister,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: colors.primary,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        elevation: 0,
                      ),
                      child: _isLoading
                          ? const SizedBox(width: 22, height: 22, child: CircularProgressIndicator(strokeWidth: 2.5, color: Colors.white))
                          : Text('Create Taxpayer Account', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, letterSpacing: 0.5)),
                    ),
                  ),
                ]),
              ),
            ),

            const SizedBox(height: 24),

            // Sign in link
            Row(mainAxisAlignment: MainAxisAlignment.center, children: [
              Text('Already have an account? ', style: TextStyle(fontSize: 13, color: colors.textSecondary)),
              GestureDetector(
                onTap: () => context.go('/sign-in'),
                child: Text('Sign In', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: colors.primary)),
              ),
            ]),

            const SizedBox(height: 24),
            Text('© 2026 Government Revenue Authority (GRA)', style: TextStyle(fontSize: 10, color: colors.textLight)),
          ]),
        ),
      ),
    );
  }

  Widget _sectionHeader(AppColors colors, IconData icon, String title) {
    return Row(children: [
      Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: colors.primary.withValues(alpha: 0.08),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Icon(icon, size: 16, color: colors.primary),
      ),
      const SizedBox(width: 10),
      Text(title, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: colors.text, letterSpacing: 0.3)),
    ]);
  }

  Widget _fieldLabel(AppColors colors, String text) =>
      Text(text, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: colors.textSecondary, letterSpacing: 0.3));

  TextStyle _fieldStyle(AppColors colors) =>
      TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: colors.text);

  InputDecoration _inputDecoration(AppColors colors, String hint, IconData icon) {
    return InputDecoration(
      hintText: hint,
      hintStyle: TextStyle(fontSize: 13, color: colors.textLight, fontWeight: FontWeight.w500),
      prefixIcon: Icon(icon, size: 18, color: colors.textLight),
      filled: true,
      fillColor: colors.background,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: colors.border)),
      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: colors.border.withValues(alpha: 0.5))),
      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: colors.primary, width: 1.5)),
      errorBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: colors.danger)),
      focusedErrorBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: colors.danger, width: 1.5)),
      errorStyle: TextStyle(fontSize: 11, fontWeight: FontWeight.w600),
    );
  }
}
