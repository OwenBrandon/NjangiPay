import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AppColors {
  final Color primary;
  final Color primaryLight;
  final Color primaryDark;
  
  final Color secondary;
  final Color secondaryLight;
  final Color secondaryDark;
  
  final Color accent;
  final Color accentLight;
  
  final Color danger;
  final Color dangerLight;
  final Color dangerDark;
  
  final Color success;
  final Color warning;
  final Color info;
  
  final Color background;
  final Color surface;
  final Color surfaceSecondary;
  
  final Color text;
  final Color textSecondary;
  final Color textLight;
  final Color textInverse;
  
  final Color border;
  final Color borderLight;
  
  final Color statusPaid;
  final Color statusUnpaid;
  final Color statusOverdue;
  final Color statusPending;
  final Color statusPartial;

  final Color glass;
  final Color glassBorder;
  final Color glassLight;
  
  final Color cardShadow;
  final Color overlay;

  const AppColors({
    required this.primary,
    required this.primaryLight,
    required this.primaryDark,
    required this.secondary,
    required this.secondaryLight,
    required this.secondaryDark,
    required this.accent,
    required this.accentLight,
    required this.danger,
    required this.dangerLight,
    required this.dangerDark,
    required this.success,
    required this.warning,
    required this.info,
    required this.background,
    required this.surface,
    required this.surfaceSecondary,
    required this.text,
    required this.textSecondary,
    required this.textLight,
    required this.textInverse,
    required this.border,
    required this.borderLight,
    required this.statusPaid,
    required this.statusUnpaid,
    required this.statusOverdue,
    required this.statusPending,
    required this.statusPartial,
    required this.glass,
    required this.glassBorder,
    required this.glassLight,
    required this.cardShadow,
    required this.overlay,
  });
}

class AppTheme {
  static const lightColors = AppColors(
    primary: Color(0xFF0066CC),
    primaryLight: Color(0xFF3399FF),
    primaryDark: Color(0xFF004C99),
    secondary: Color(0xFF00C896),
    secondaryLight: Color(0xFF33E6B8),
    secondaryDark: Color(0xFF00A67D),
    accent: Color(0xFFFF9500),
    accentLight: Color(0xFFFFB84D),
    danger: Color(0xFFFF3B30),
    dangerLight: Color(0xFFFF6961),
    dangerDark: Color(0xFFCC2F26),
    success: Color(0xFF34C759),
    warning: Color(0xFFFF9500),
    info: Color(0xFF007AFF),
    background: Color(0xFFF2F2F7),
    surface: Color(0xFFFFFFFF),
    surfaceSecondary: Color(0xFFE5E5EA),
    text: Color(0xFF1C1C1E),
    textSecondary: Color(0xFF636366),
    textLight: Color(0xFFAEAEB2),
    textInverse: Color(0xFFFFFFFF),
    border: Color(0xFFD1D1D6),
    borderLight: Color(0xFFE5E5EA),
    statusPaid: Color(0xFF34C759),
    statusUnpaid: Color(0xFF007AFF),
    statusOverdue: Color(0xFFFF3B30),
    statusPending: Color(0xFFFF9500),
    statusPartial: Color(0xFFAF52DE),
    glass: Color(0xD9FFFFFF), // rgba(255, 255, 255, 0.85)
    glassBorder: Color(0x4DFFFFFF), // rgba(255, 255, 255, 0.3)
    glassLight: Color(0x99FFFFFF), // rgba(255, 255, 255, 0.6)
    cardShadow: Color(0xFF000000),
    overlay: Color(0x66000000), // rgba(0, 0, 0, 0.4)
  );

  static const darkColors = AppColors(
    primary: Color(0xFF0A84FF),
    primaryLight: Color(0xFF409CFF),
    primaryDark: Color(0xFF0066CC),
    secondary: Color(0xFF30D158),
    secondaryLight: Color(0xFF63E086),
    secondaryDark: Color(0xFF28A745),
    accent: Color(0xFFFF9F0A),
    accentLight: Color(0xFFFFB340),
    danger: Color(0xFFFF453A),
    dangerLight: Color(0xFFFF6961),
    dangerDark: Color(0xFFCC362E),
    success: Color(0xFF30D158),
    warning: Color(0xFFFF9F0A),
    info: Color(0xFF0A84FF),
    background: Color(0xFF000000),
    surface: Color(0xFF1C1C1E),
    surfaceSecondary: Color(0xFF2C2C2E),
    text: Color(0xFFFFFFFF),
    textSecondary: Color(0xFF98989D),
    textLight: Color(0xFF636366),
    textInverse: Color(0xFF000000),
    border: Color(0xFF38383A),
    borderLight: Color(0xFF2C2C2E),
    statusPaid: Color(0xFF30D158),
    statusUnpaid: Color(0xFF0A84FF),
    statusOverdue: Color(0xFFFF453A),
    statusPending: Color(0xFFFF9F0A),
    statusPartial: Color(0xFFBF5AF2),
    glass: Color(0xD92C2C2E), // rgba(44, 44, 46, 0.85)
    glassBorder: Color(0x1AFFFFFF), // rgba(255, 255, 255, 0.1)
    glassLight: Color(0x992C2C2E), // rgba(44, 44, 46, 0.6)
    cardShadow: Color(0xFF000000),
    overlay: Color(0x99000000), // rgba(0, 0, 0, 0.6)
  );

  static ThemeData getLightTheme() {
    return ThemeData(
      brightness: Brightness.light,
      primaryColor: lightColors.primary,
      scaffoldBackgroundColor: lightColors.background,
      colorScheme: ColorScheme.light(
        primary: lightColors.primary,
        secondary: lightColors.secondary,
        surface: lightColors.surface,
        error: lightColors.danger,
        onPrimary: lightColors.textInverse,
        onSecondary: lightColors.textInverse,
        onSurface: lightColors.text,
        onError: lightColors.textInverse,
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: lightColors.surface,
        foregroundColor: lightColors.text,
        elevation: 0,
      ),
      dividerTheme: DividerThemeData(
        color: lightColors.border,
        thickness: 1,
      ),
      textTheme: TextTheme(
        bodyLarge: TextStyle(color: lightColors.text),
        bodyMedium: TextStyle(color: lightColors.textSecondary),
      ),
    );
  }

  static ThemeData getDarkTheme() {
    return ThemeData(
      brightness: Brightness.dark,
      primaryColor: darkColors.primary,
      scaffoldBackgroundColor: darkColors.background,
      colorScheme: ColorScheme.dark(
        primary: darkColors.primary,
        secondary: darkColors.secondary,
        surface: darkColors.surface,
        error: darkColors.danger,
        onPrimary: darkColors.textInverse,
        onSecondary: darkColors.textInverse,
        onSurface: darkColors.text,
        onError: darkColors.textInverse,
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: darkColors.surface,
        foregroundColor: darkColors.text,
        elevation: 0,
      ),
      dividerTheme: DividerThemeData(
        color: darkColors.border,
        thickness: 1,
      ),
      textTheme: TextTheme(
        bodyLarge: TextStyle(color: darkColors.text),
        bodyMedium: TextStyle(color: darkColors.textSecondary),
      ),
    );
  }
}

class ThemeProvider extends ChangeNotifier {
  static const String _themeStorageKey = '@app_theme_mode';
  
  ThemeMode _themeMode = ThemeMode.system;
  bool _isLoading = true;

  ThemeMode get themeMode => _themeMode;
  bool get isLoading => _isLoading;

  bool get isDark {
    if (_themeMode == ThemeMode.system) {
      return WidgetsBinding.instance.platformDispatcher.platformBrightness == Brightness.dark;
    }
    return _themeMode == ThemeMode.dark;
  }

  AppColors get colors => isDark ? AppTheme.darkColors : AppTheme.lightColors;

  ThemeProvider() {
    _loadTheme();
  }

  Future<void> _loadTheme() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final stored = prefs.getString(_themeStorageKey);
      if (stored == 'light') {
        _themeMode = ThemeMode.light;
      } else if (stored == 'dark') {
        _themeMode = ThemeMode.dark;
      } else {
        _themeMode = ThemeMode.system;
      }
    } catch (e) {
      debugPrint('Error loading theme: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> setThemeMode(ThemeMode mode) async {
    _themeMode = mode;
    notifyListeners();
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_themeStorageKey, mode.name);
    } catch (e) {
      debugPrint('Error saving theme: $e');
    }
  }
}
