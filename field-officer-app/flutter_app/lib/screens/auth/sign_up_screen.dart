import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import '../../state/auth_state.dart';
import '../../state/theme_state.dart';

class SignUpScreen extends StatefulWidget {
  const SignUpScreen({super.key});

  @override
  State<SignUpScreen> createState() => _SignUpScreenState();
}

class _SignUpScreenState extends State<SignUpScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _staffIdController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _supervisorController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  bool _obscurePassword = true;
  bool _obscureConfirm = true;
  bool _acknowledged = false;
  bool _isLoading = false;
  String _selectedRegion = 'Buea Centre';
  String _selectedDepartment = 'Tax Collection';

  static const _regions = [
    'Buea Centre',
    'Buea Nord',
    'Buea Sud',
    'Bertoua District',
    'Batouri District',
    'Yokadouma District',
  ];

  static const _departments = [
    'Tax Collection',
    'Audit & Inspection',
    'Compliance',
    'Field Operations',
  ];

  @override
  void dispose() {
    _nameController.dispose();
    _staffIdController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _supervisorController.dispose();
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
    if (s <= 0.75) return colors.accent;
    return colors.success;
  }

  Future<void> _handleRegister() async {
    if (!_formKey.currentState!.validate()) return;
    if (!_acknowledged) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('You must confirm you are an authorized officer.'), behavior: SnackBarBehavior.floating),
      );
      return;
    }

    setState(() => _isLoading = true);

    final auth = context.read<AuthState>();
    auth.clearError();
    final success = await auth.register(
      fullName: _nameController.text,
      staffId: _staffIdController.text,
      email: _emailController.text,
      phone: _phoneController.text,
      region: _selectedRegion,
      department: _selectedDepartment,
      supervisorName: _supervisorController.text.isNotEmpty ? _supervisorController.text : null,
      password: _passwordController.text,
      confirmPassword: _confirmPasswordController.text,
    );

    if (mounted) {
      setState(() => _isLoading = false);
      if (success) {
        // Auth state change triggers main.dart to show NavigationHome
        Navigator.of(context).popUntil((route) => route.isFirst);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final themeState = context.watch<ThemeState>();
    final auth = context.watch<AuthState>();
    final colors = themeState.colors;
    final isDark = themeState.isDarkMode;

    return Scaffold(
      backgroundColor: colors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Icon(LucideIcons.arrowLeft, color: colors.text),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
          child: Column(children: [
            // Header
            Container(
              width: 56, height: 56,
              decoration: BoxDecoration(
                color: colors.primary,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [BoxShadow(color: colors.primary.withValues(alpha: 0.3), blurRadius: 20, offset: const Offset(0, 6))],
              ),
              child: const Icon(LucideIcons.shield, color: Colors.white, size: 24),
            ),
            const SizedBox(height: 14),
            Text('Request Officer Access', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: colors.text, letterSpacing: -0.3)),
            const SizedBox(height: 4),
            Text('Direction Générale des Impôts (DGI)', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: colors.textSecondary)),
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
                  // Error
                  if (auth.errorMessage != null) ...[
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: colors.danger.withValues(alpha: 0.08),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: colors.danger.withValues(alpha: 0.3)),
                      ),
                      child: Row(children: [
                        Icon(LucideIcons.alertCircle, size: 16, color: colors.danger),
                        const SizedBox(width: 10),
                        Expanded(child: Text(auth.errorMessage!, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: colors.danger))),
                      ]),
                    ),
                    const SizedBox(height: 16),
                  ],

                  // --- Officer Information ---
                  _sectionHeader(colors, LucideIcons.badgeCheck, 'Officer Information'),
                  const SizedBox(height: 16),
                  _buildField(colors, 'Full Name *', _nameController, 'Officer full name', LucideIcons.user,
                    validator: (v) => (v == null || v.trim().isEmpty) ? 'Required' : null),
                  _buildField(colors, 'Staff / Badge ID *', _staffIdController, 'e.g. OFF-2024-001', LucideIcons.hash,
                    validator: (v) => (v == null || v.trim().isEmpty) ? 'Required' : null),
                  _buildField(colors, 'Email Address *', _emailController, 'officer@dgi.cm', LucideIcons.mail,
                    keyboardType: TextInputType.emailAddress,
                    validator: (v) {
                      if (v == null || v.trim().isEmpty) return 'Required';
                      if (!RegExp(r'^[\w\-.]+@[\w\-.]+\.\w+$').hasMatch(v.trim())) return 'Invalid email';
                      return null;
                    }),
                  _buildField(colors, 'Phone Number *', _phoneController, '+237 6XX XXX XXX', LucideIcons.phone,
                    keyboardType: TextInputType.phone,
                    validator: (v) => (v == null || v.trim().isEmpty) ? 'Required' : null),

                  const SizedBox(height: 20),

                  // --- Assignment ---
                  _sectionHeader(colors, LucideIcons.mapPin, 'Assignment'),
                  const SizedBox(height: 16),
                  _fieldLabel(colors, 'Region / Zone *'),
                  const SizedBox(height: 6),
                  DropdownButtonFormField<String>(
                    value: _selectedRegion,
                    items: _regions.map((r) => DropdownMenuItem(value: r, child: Text(r, style: _fieldStyle(colors)))).toList(),
                    onChanged: (v) => setState(() => _selectedRegion = v ?? _selectedRegion),
                    decoration: _inputDecoration(colors, '', LucideIcons.map),
                    dropdownColor: colors.surface,
                  ),
                  const SizedBox(height: 14),
                  _fieldLabel(colors, 'Department *'),
                  const SizedBox(height: 6),
                  DropdownButtonFormField<String>(
                    value: _selectedDepartment,
                    items: _departments.map((d) => DropdownMenuItem(value: d, child: Text(d, style: _fieldStyle(colors)))).toList(),
                    onChanged: (v) => setState(() => _selectedDepartment = v ?? _selectedDepartment),
                    decoration: _inputDecoration(colors, '', LucideIcons.briefcase),
                    dropdownColor: colors.surface,
                  ),
                  const SizedBox(height: 14),
                  _buildField(colors, 'Supervisor Name (optional)', _supervisorController, 'Direct supervisor', LucideIcons.users),

                  const SizedBox(height: 20),

                  // --- Security ---
                  _sectionHeader(colors, LucideIcons.lock, 'Security'),
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
                    validator: (v) => (v == null || v.length < 8) ? 'Min. 8 characters' : null,
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
                    decoration: _inputDecoration(colors, 'Re-enter password', LucideIcons.lock).copyWith(
                      suffixIcon: IconButton(
                        icon: Icon(_obscureConfirm ? LucideIcons.eyeOff : LucideIcons.eye, size: 18, color: colors.textLight),
                        onPressed: () => setState(() => _obscureConfirm = !_obscureConfirm),
                      ),
                    ),
                    validator: (v) => (v != _passwordController.text) ? 'Passwords do not match' : null,
                  ),
                  const SizedBox(height: 18),

                  // Acknowledgment
                  Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    SizedBox(
                      width: 20, height: 20,
                      child: Checkbox(
                        value: _acknowledged,
                        onChanged: (v) => setState(() => _acknowledged = v ?? false),
                        activeColor: colors.primary,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
                        side: BorderSide(color: colors.border),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        'I confirm I am an authorized government officer and all information provided is accurate.',
                        style: TextStyle(fontSize: 12, color: colors.textSecondary, height: 1.4),
                      ),
                    ),
                  ]),

                  const SizedBox(height: 24),

                  // Submit button
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
                          : Text('Submit Access Request', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, letterSpacing: 0.5)),
                    ),
                  ),
                ]),
              ),
            ),

            const SizedBox(height: 24),

            // Sign in link
            Row(mainAxisAlignment: MainAxisAlignment.center, children: [
              Text('Already registered? ', style: TextStyle(fontSize: 13, color: colors.textSecondary)),
              GestureDetector(
                onTap: () => Navigator.pop(context),
                child: Text('Sign In', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: colors.primary)),
              ),
            ]),

            const SizedBox(height: 24),
            Text('© 2026 Direction Générale des Impôts (DGI) - Buea Municipality', style: TextStyle(fontSize: 10, color: colors.textLight)),
            const SizedBox(height: 24),
          ]),
        ),
      ),
    );
  }

  Widget _buildField(AppColors colors, String label, TextEditingController controller, String hint, IconData icon, {
    String? Function(String?)? validator,
    TextInputType? keyboardType,
  }) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      _fieldLabel(colors, label),
      const SizedBox(height: 6),
      TextFormField(
        controller: controller,
        style: _fieldStyle(colors),
        keyboardType: keyboardType,
        decoration: _inputDecoration(colors, hint, icon),
        validator: validator,
        textInputAction: TextInputAction.next,
      ),
      const SizedBox(height: 14),
    ]);
  }

  Widget _sectionHeader(AppColors colors, IconData icon, String title) {
    return Row(children: [
      Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(color: colors.primary.withValues(alpha: 0.08), borderRadius: BorderRadius.circular(10)),
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
      errorStyle: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600),
    );
  }
}
