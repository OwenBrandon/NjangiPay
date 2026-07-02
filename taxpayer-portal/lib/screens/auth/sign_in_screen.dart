import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import '../../core/auth/auth_state.dart';
import '../../core/theme/app_theme.dart';

class SignInScreen extends StatefulWidget {
  const SignInScreen({super.key});

  @override
  State<SignInScreen> createState() => _SignInScreenState();
}

class _SignInScreenState extends State<SignInScreen> {
  final _formKey = GlobalKey<FormState>();
  final _tinController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;
  bool _rememberMe = false;
  bool _isLoading = false;
  String? _errorMessage;

  @override
  void dispose() {
    _tinController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _handleLogin() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() { _isLoading = true; _errorMessage = null; });

    final auth = context.read<AuthState>();
    final success = await auth.login(_tinController.text, _passwordController.text);

    if (mounted) {
      setState(() { _isLoading = false; });
      if (success) {
        context.go('/dashboard');
      } else {
        setState(() { _errorMessage = auth.lastError ?? 'Invalid credentials. Please check your TIN/Email and password.'; });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = context.watch<ThemeProvider>();
    final colors = theme.colors;
    final isDark = theme.isDark;

    return Scaffold(
      backgroundColor: colors.background,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
            child: Column(
              children: [
                // Logo & Branding
                Container(
                  width: 64, height: 64,
                  decoration: BoxDecoration(
                    color: colors.primary,
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [BoxShadow(color: colors.primary.withValues(alpha: 0.3), blurRadius: 24, offset: const Offset(0, 8))],
                  ),
                  child: const Icon(LucideIcons.building2, color: Colors.white, size: 28),
                ),
                const SizedBox(height: 16),
                Text('TaxMS Portal', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: colors.text, letterSpacing: -0.5)),
                const SizedBox(height: 4),
                Text('Government Revenue Authority', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: colors.textSecondary, letterSpacing: 0.5)),
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: const Color(0xFF34C759).withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: const Color(0xFF34C759).withValues(alpha: 0.3)),
                  ),
                  child: Row(mainAxisSize: MainAxisSize.min, children: [
                    Icon(LucideIcons.lock, size: 12, color: const Color(0xFF34C759)),
                    const SizedBox(width: 6),
                    Text('SECURED CONNECTION', style: TextStyle(fontSize: 9, fontWeight: FontWeight.w800, color: const Color(0xFF34C759), letterSpacing: 1.5)),
                  ]),
                ),

                const SizedBox(height: 36),

                // Form Card
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
                      Text('Sign in to your portal', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: colors.text)),
                      const SizedBox(height: 4),
                      Text('Enter your taxpayer credentials', style: TextStyle(fontSize: 13, color: colors.textSecondary)),
                      const SizedBox(height: 24),

                      // Error message
                      if (_errorMessage != null) ...[
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
                            Expanded(child: Text(_errorMessage!, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: colors.danger))),
                          ]),
                        ),
                        const SizedBox(height: 16),
                      ],

                      // TIN field
                      Text('TIN / Email Address', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: colors.textSecondary, letterSpacing: 0.5)),
                      const SizedBox(height: 8),
                      TextFormField(
                        controller: _tinController,
                        style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: colors.text),
                        decoration: _inputDecoration(colors, 'Enter your TIN or email', LucideIcons.user),
                        validator: (v) => (v == null || v.trim().isEmpty) ? 'TIN or email is required' : null,
                        textInputAction: TextInputAction.next,
                      ),
                      const SizedBox(height: 18),

                      // Password field
                      Text('Password', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: colors.textSecondary, letterSpacing: 0.5)),
                      const SizedBox(height: 8),
                      TextFormField(
                        controller: _passwordController,
                        obscureText: _obscurePassword,
                        style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: colors.text),
                        decoration: _inputDecoration(colors, 'Enter your password', LucideIcons.lock).copyWith(
                          suffixIcon: IconButton(
                            icon: Icon(_obscurePassword ? LucideIcons.eyeOff : LucideIcons.eye, size: 18, color: colors.textLight),
                            onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                          ),
                        ),
                        validator: (v) => (v == null || v.length < 6) ? 'Password must be at least 6 characters' : null,
                        onFieldSubmitted: (_) => _handleLogin(),
                      ),
                      const SizedBox(height: 14),

                      // Remember me + Forgot
                      Row(children: [
                        SizedBox(
                          width: 20, height: 20,
                          child: Checkbox(
                            value: _rememberMe,
                            onChanged: (v) => setState(() => _rememberMe = v ?? false),
                            activeColor: colors.primary,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
                            side: BorderSide(color: colors.border),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text('Remember me', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: colors.textSecondary)),
                        const Spacer(),
                        GestureDetector(
                          onTap: () => ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text('Please contact your regional tax office for credential recovery.'), behavior: SnackBarBehavior.floating),
                          ),
                          child: Text('Forgot password?', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: colors.primary)),
                        ),
                      ]),

                      const SizedBox(height: 24),

                      // Login button
                      SizedBox(
                        width: double.infinity, height: 52,
                        child: ElevatedButton(
                          onPressed: _isLoading ? null : _handleLogin,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: colors.primary,
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                            elevation: 0,
                          ),
                          child: _isLoading
                              ? const SizedBox(width: 22, height: 22, child: CircularProgressIndicator(strokeWidth: 2.5, color: Colors.white))
                              : Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                                  Text('Sign In to Portal', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, letterSpacing: 0.5)),
                                  const SizedBox(width: 8),
                                  const Icon(LucideIcons.arrowRight, size: 18),
                                ]),
                        ),
                      ),
                    ]),
                  ),
                ),

                const SizedBox(height: 24),

                // Register link
                Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                  Text("Don't have an account? ", style: TextStyle(fontSize: 13, color: colors.textSecondary)),
                  GestureDetector(
                    onTap: () => context.go('/sign-up'),
                    child: Text('Register', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: colors.primary)),
                  ),
                ]),

                const SizedBox(height: 32),

                // Copyright
                Text('© 2026 Government Revenue Authority (GRA)', style: TextStyle(fontSize: 10, color: colors.textLight, letterSpacing: 0.3)),
                const SizedBox(height: 4),
                Text('All Rights Reserved', style: TextStyle(fontSize: 10, color: colors.textLight)),
              ],
            ),
          ),
        ),
      ),
    );
  }

  InputDecoration _inputDecoration(AppColors colors, String hint, IconData icon) {
    return InputDecoration(
      hintText: hint,
      hintStyle: TextStyle(fontSize: 13, color: colors.textLight, fontWeight: FontWeight.w500),
      prefixIcon: Icon(icon, size: 18, color: colors.textLight),
      filled: true,
      fillColor: colors.background,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: colors.border)),
      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: colors.border.withValues(alpha: 0.5))),
      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: colors.primary, width: 1.5)),
      errorBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: colors.danger)),
      focusedErrorBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: colors.danger, width: 1.5)),
      errorStyle: TextStyle(fontSize: 11, fontWeight: FontWeight.w600),
    );
  }
}
