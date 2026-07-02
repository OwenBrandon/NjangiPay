import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class AuthState extends ChangeNotifier {
  bool _isAuthenticated = false;
  bool _isLoading = true;
  String? _officerName;
  String? _officerId;
  String? _officerRegion;
  String? _errorMessage;

  bool get isAuthenticated => _isAuthenticated;
  bool get isLoading => _isLoading;
  String? get officerName => _officerName;
  String? get officerId => _officerId;
  String? get officerRegion => _officerRegion;
  String? get errorMessage => _errorMessage;

  SupabaseClient get _client => Supabase.instance.client;

  AuthState() {
    _loadSession();
  }

  Future<void> _loadSession() async {
    try {
      final session = _client.auth.currentSession;
      if (session != null) {
        final meta = session.user.userMetadata;
        _isAuthenticated = true;
        _officerName = meta?['name'] as String? ?? 'Field Officer';
        _officerId = meta?['staff_id'] as String? ?? session.user.id.substring(0, 8);
        _officerRegion = meta?['region'] as String? ?? 'Buea Centre';
      }
    } catch (e) {
      debugPrint('Error loading auth session: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }

    _client.auth.onAuthStateChange.listen((data) {
      final session = data.session;
      if (session != null) {
        final meta = session.user.userMetadata;
        _isAuthenticated = true;
        _officerName = meta?['name'] as String? ?? 'Field Officer';
        _officerId = meta?['staff_id'] as String?;
        _officerRegion = meta?['region'] as String?;
      } else {
        _isAuthenticated = false;
        _officerName = null;
        _officerId = null;
        _officerRegion = null;
      }
      notifyListeners();
    });
  }

  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }

  Future<bool> login(String staffId, String password) async {
    _errorMessage = null;
    notifyListeners();

    if (staffId.trim().isEmpty) {
      _errorMessage = 'Staff ID / Badge Number is required.';
      notifyListeners();
      return false;
    }
    if (password.trim().isEmpty) {
      _errorMessage = 'Password is required.';
      notifyListeners();
      return false;
    }

    try {
      final email = staffId.contains('@') ? staffId.trim() : '${staffId.trim().toLowerCase()}@dgi.cm';
      final res = await _client.auth.signInWithPassword(email: email, password: password);
      if (res.session != null) {
        final meta = res.user?.userMetadata;
        _isAuthenticated = true;
        _officerName = meta?['name'] as String? ?? 'Officer ${staffId.toUpperCase()}';
        _officerId = staffId.toUpperCase();
        _officerRegion = meta?['region'] as String? ?? 'Buea Centre';
        _errorMessage = null;
        notifyListeners();
        return true;
      }
      _errorMessage = 'Authentication failed. Please check your credentials.';
      notifyListeners();
      return false;
    } on AuthException catch (e) {
      _errorMessage = e.message;
      notifyListeners();
      return false;
    } catch (e) {
      _errorMessage = 'Connection error. Please try again.';
      notifyListeners();
      return false;
    }
  }

  Future<bool> register({
    required String fullName,
    required String staffId,
    required String email,
    required String phone,
    required String region,
    required String department,
    String? supervisorName,
    required String password,
    required String confirmPassword,
  }) async {
    _errorMessage = null;
    notifyListeners();

    if (fullName.trim().isEmpty) { _errorMessage = 'Full name is required.'; notifyListeners(); return false; }
    if (staffId.trim().isEmpty) { _errorMessage = 'Staff / Badge ID is required.'; notifyListeners(); return false; }
    if (email.trim().isEmpty || !RegExp(r'^[^@]+@[^@]+\.[^@]+$').hasMatch(email.trim())) {
      _errorMessage = 'Valid email address is required.'; notifyListeners(); return false;
    }
    if (password.length < 8) { _errorMessage = 'Password must be at least 8 characters.'; notifyListeners(); return false; }
    if (password != confirmPassword) { _errorMessage = 'Passwords do not match.'; notifyListeners(); return false; }

    try {
      final res = await _client.auth.signUp(
        email: email.trim(),
        password: password,
        data: {
          'name': fullName.trim(),
          'role': 'field_officer',
          'staff_id': staffId.trim().toUpperCase(),
          'phone': phone.trim(),
          'region': region,
          'department': department,
          'supervisor': supervisorName,
        },
      );

      if (res.user != null) {
        _isAuthenticated = true;
        _officerName = fullName.trim();
        _officerId = staffId.trim().toUpperCase();
        _officerRegion = region;
        _errorMessage = null;
        notifyListeners();
        return true;
      }
      _errorMessage = 'Registration failed. Please try again.';
      notifyListeners();
      return false;
    } on AuthException catch (e) {
      _errorMessage = e.message;
      notifyListeners();
      return false;
    } catch (e) {
      _errorMessage = 'Connection error. Please try again.';
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
    _officerName = null;
    _officerId = null;
    _officerRegion = null;
    _errorMessage = null;
    notifyListeners();
  }
}
