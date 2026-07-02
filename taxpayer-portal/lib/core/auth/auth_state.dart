import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class AuthState extends ChangeNotifier {
  bool _isAuthenticated = false;
  bool _isLoading = true;
  String? _currentUserTin;
  String? _currentUserName;
  String _taxpayerStatus = 'active';
  String? _lastError;

  bool get isAuthenticated => _isAuthenticated;
  bool get isLoading => _isLoading;
  String? get currentUserTin => _currentUserTin;
  String? get currentUserName => _currentUserName;
  String get taxpayerStatus => _taxpayerStatus;
  bool get isPendingApproval => _taxpayerStatus == 'pending';
  String? get lastError => _lastError;

  SupabaseClient get _client => Supabase.instance.client;

  AuthState() {
    _loadSession();
  }

  Future<void> _loadSession() async {
    try {
      final session = _client.auth.currentSession;
      if (session != null) {
        _isAuthenticated = true;
        await _loadUserProfile();
      }
    } catch (e) {
      debugPrint('Error loading auth session: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }

    _client.auth.onAuthStateChange.listen((data) async {
      final session = data.session;
      if (session != null) {
        _isAuthenticated = true;
        await _loadUserProfile();
      } else {
        _isAuthenticated = false;
        _currentUserTin = null;
        _currentUserName = null;
        _taxpayerStatus = 'active';
      }
      notifyListeners();
    });
  }

  Future<void> _loadUserProfile() async {
    try {
      final authUser = _client.auth.currentUser;
      if (authUser == null) return;

      // Try DB lookup first: auth_id → users → taxpayers
      final user = await _client.from('users').select('id, name').eq('auth_id', authUser.id).maybeSingle();
      if (user != null) {
        _currentUserName = user['name'] as String?;
        final tp = await _client.from('taxpayers').select('tin, status').eq('user_id', user['id']).maybeSingle();
        if (tp != null) {
          _currentUserTin = tp['tin'] as String?;
          _taxpayerStatus = (tp['status'] as String?) ?? 'active';
        } else {
          _taxpayerStatus = 'active';
        }
      } else {
        // Fallback to auth metadata (DB trigger may not have run yet)
        final meta = authUser.userMetadata;
        _currentUserName = meta?['name'] as String?;
        _currentUserTin = meta?['tin'] as String?;
        _taxpayerStatus = 'active';
      }
    } catch (e) {
      debugPrint('Profile load error: $e');
      _taxpayerStatus = 'active';
    }
  }

  Future<void> refreshStatus() async {
    await _loadUserProfile();
    notifyListeners();
  }

  Future<bool> login(String tinOrEmail, String password) async {
    _lastError = null;
    if (tinOrEmail.trim().isEmpty || password.isEmpty) {
      _lastError = 'Please enter your email and password.';
      notifyListeners();
      return false;
    }
    if (password.length < 6) {
      _lastError = 'Password must be at least 6 characters.';
      notifyListeners();
      return false;
    }

    try {
      String email = tinOrEmail.trim();

      // If user entered a TIN (not an email), look up their email from the taxpayers table
      if (!email.contains('@')) {
        final tp = await _client.from('taxpayers').select('email').eq('tin', email).maybeSingle();
        if (tp != null && tp['email'] != null) {
          email = tp['email'] as String;
        } else {
          // Also try users table
          final user = await _client.from('users').select('email').eq('name', email).maybeSingle();
          if (user != null && user['email'] != null) {
            email = user['email'] as String;
          } else {
            _lastError = 'No account found with that TIN. Try using your email address instead.';
            notifyListeners();
            return false;
          }
        }
      }

      final res = await _client.auth.signInWithPassword(email: email, password: password);
      if (res.session != null) {
        _isAuthenticated = true;
        await _loadUserProfile();
        notifyListeners();
        return true;
      }
      _lastError = 'Login failed. Please check your credentials.';
      notifyListeners();
      return false;
    } on AuthException catch (e) {
      _lastError = e.message == 'Invalid login credentials'
          ? 'Incorrect email or password. Please try again.'
          : e.message;
      notifyListeners();
      return false;
    } catch (e) {
      _lastError = 'Connection error. Please check your internet and try again.';
      debugPrint('Login error: $e');
      notifyListeners();
      return false;
    }
  }

  Future<bool> register({
    required String fullName,
    required String email,
    required String phone,
    required String address,
    required String tin,
    String? businessName,
    required String region,
    required List<String> taxTypes,
    required String password,
  }) async {
    _lastError = null;
    if (fullName.trim().isEmpty || email.trim().isEmpty || tin.trim().isEmpty) {
      _lastError = 'Please fill in all required fields.';
      notifyListeners();
      return false;
    }
    if (password.length < 6) {
      _lastError = 'Password must be at least 6 characters.';
      notifyListeners();
      return false;
    }

    try {
      final res = await _client.auth.signUp(
        email: email.trim(),
        password: password,
        data: {
          'name': fullName.trim(),
          'role': 'taxpayer',
          'tin': tin.trim(),
          'phone': phone.trim(),
          'address': address.trim(),
          'region': region,
          'business_name': businessName,
          'tax_types': taxTypes,
        },
      );

      if (res.user != null) {
        _isAuthenticated = true;
        _currentUserTin = tin.trim();
        _currentUserName = fullName.trim();
        _taxpayerStatus = 'pending';
        _lastError = null;
        notifyListeners();
        return true;
      }
      _lastError = 'Registration failed. Please try again.';
      notifyListeners();
      return false;
    } on AuthException catch (e) {
      if (e.message.contains('already registered')) {
        _lastError = 'An account with this email already exists. Try signing in instead.';
      } else {
        _lastError = e.message;
      }
      notifyListeners();
      return false;
    } catch (e) {
      _lastError = 'Connection error: $e';
      debugPrint('Register error: $e');
      notifyListeners();
      return false;
    }
  }

  Future<void> logout() async {
    try {
      await _client.auth.signOut();
    } catch (e) {
      debugPrint('Error signing out: $e');
    }
    _isAuthenticated = false;
    _currentUserTin = null;
    _currentUserName = null;
    _taxpayerStatus = 'active';
    notifyListeners();
  }
}
