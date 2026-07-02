import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AppColors {
  final Color primary;
  final Color primaryLight;
  final Color primaryDark;
  final Color secondary;
  final Color secondaryLight;
  final Color accent;
  final Color accentLight;
  final Color warning;
  final Color danger;
  final Color success;
  final Color background;
  final Color backgroundSecondary;
  final Color surface;
  final Color surfaceSecondary;
  final Color surfaceAlt;
  final Color text;
  final Color textSecondary;
  final Color textLight;
  final Color textInverse;
  final Color border;
  final Color borderLight;
  final Color white;
  final Color headerBg;
  final Color cardBg;
  final Color tabBar;
  final Color tabBarBorder;
  final Color gradientStart;
  final Color gradientMid;
  final Color gradientEnd;
  final List<Color> headerGradient;
  final Color inputBg;
  final Color glass;
  final Color glassBorder;

  AppColors({
    required this.primary,
    required this.primaryLight,
    required this.primaryDark,
    required this.secondary,
    required this.secondaryLight,
    required this.accent,
    required this.accentLight,
    required this.warning,
    required this.danger,
    required this.success,
    required this.background,
    required this.backgroundSecondary,
    required this.surface,
    required this.surfaceSecondary,
    required this.surfaceAlt,
    required this.text,
    required this.textSecondary,
    required this.textLight,
    required this.textInverse,
    required this.border,
    required this.borderLight,
    required this.white,
    required this.headerBg,
    required this.cardBg,
    required this.tabBar,
    required this.tabBarBorder,
    required this.gradientStart,
    required this.gradientMid,
    required this.gradientEnd,
    required this.headerGradient,
    required this.inputBg,
    required this.glass,
    required this.glassBorder,
  });

  static final light = AppColors(
    primary: const Color(0xFF0066CC),
    primaryLight: const Color(0xFF3399FF),
    primaryDark: const Color(0xFF004C99),
    secondary: const Color(0xFF00C896),
    secondaryLight: const Color(0xFF33E6B8),
    accent: const Color(0xFFFF9500),
    accentLight: const Color(0xFFFFB340),
    warning: const Color(0xFFFF9500),
    danger: const Color(0xFFFF3B30),
    success: const Color(0xFF34C759),
    background: const Color(0xFFF2F2F7),
    backgroundSecondary: const Color(0xFFE5E5EA),
    surface: const Color(0xFFFFFFFF),
    surfaceSecondary: const Color(0xFFE5E5EA),
    surfaceAlt: const Color(0xFFE5E5EA),
    text: const Color(0xFF1C1C1E),
    textSecondary: const Color(0xFF636366),
    textLight: const Color(0xFFAEAEB2),
    textInverse: const Color(0xFFFFFFFF),
    border: const Color(0xFFD1D1D6),
    borderLight: const Color(0xFFE5E5EA),
    white: const Color(0xFFFFFFFF),
    headerBg: const Color(0xFF0066CC),
    cardBg: const Color(0xFFFFFFFF),
    tabBar: const Color(0xD9FFFFFF),
    tabBarBorder: const Color(0xFFD1D1D6),
    gradientStart: const Color(0xFFE5F0FB),
    gradientMid: const Color(0xFFF2F2F7),
    gradientEnd: const Color(0xFFFFFFFF),
    headerGradient: const [Color(0xFF004C99), Color(0xFF0066CC), Color(0xFF3399FF)],
    inputBg: const Color(0xFFFFFFFF),
    glass: const Color(0xD9FFFFFF),
    glassBorder: const Color(0x4DFFFFFF),
  );

  static final dark = AppColors(
    primary: const Color(0xFF0A84FF),
    primaryLight: const Color(0xFF409CFF),
    primaryDark: const Color(0xFF0066CC),
    secondary: const Color(0xFF30D158),
    secondaryLight: const Color(0xFF63E086),
    accent: const Color(0xFFFF9F0A),
    accentLight: const Color(0xFFFFB340),
    warning: const Color(0xFFFF9F0A),
    danger: const Color(0xFFFF453A),
    success: const Color(0xFF30D158),
    background: const Color(0xFF000000),
    backgroundSecondary: const Color(0xFF1C1C1E),
    surface: const Color(0xFF1C1C1E),
    surfaceSecondary: const Color(0xFF2C2C2E),
    surfaceAlt: const Color(0xFF2C2C2E),
    text: const Color(0xFFFFFFFF),
    textSecondary: const Color(0xFF98989D),
    textLight: const Color(0xFF636366),
    textInverse: const Color(0xFF000000),
    border: const Color(0xFF38383A),
    borderLight: const Color(0xFF2C2C2E),
    white: const Color(0xFFFFFFFF),
    headerBg: const Color(0xFF1C1C1E),
    cardBg: const Color(0xD92C2C2E),
    tabBar: const Color(0xFF1C1C1E),
    tabBarBorder: const Color(0xFF38383A),
    gradientStart: const Color(0xFF000000),
    gradientMid: const Color(0xFF000000),
    gradientEnd: const Color(0xFF1C1C1E),
    headerGradient: const [Color(0xFF000000), Color(0xFF1C1C1E), Color(0xFF2C2C2E)],
    inputBg: const Color(0xFF1C1C1E),
    glass: const Color(0xD92C2C2E),
    glassBorder: const Color(0x1AFFFFFF),
  );
}

class ThemeState extends ChangeNotifier {
  static const _storageKey = 'app_theme_mode';
  bool _isDarkMode = false;
  bool _isLoading = true;

  bool get isDarkMode => _isDarkMode;
  bool get isLoading => _isLoading;
  AppColors get colors => _isDarkMode ? AppColors.dark : AppColors.light;

  ThemeState() {
    _loadThemePreference();
  }

  Future<void> _loadThemePreference() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final stored = prefs.getString(_storageKey);
      if (stored != null) {
        _isDarkMode = (stored == 'dark');
      }
    } catch (e) {
      debugPrint('Error loading theme preference: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> toggleTheme() async {
    _isDarkMode = !_isDarkMode;
    notifyListeners();
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_storageKey, _isDarkMode ? 'dark' : 'light');
    } catch (e) {
      debugPrint('Error saving theme preference: $e');
    }
  }

  Future<void> setTheme(String mode) async {
    _isDarkMode = (mode == 'dark');
    notifyListeners();
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_storageKey, mode);
    } catch (e) {
      debugPrint('Error saving theme preference: $e');
    }
  }
}
