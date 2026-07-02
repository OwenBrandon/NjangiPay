import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:supabase_flutter/supabase_flutter.dart' hide AuthState;
import 'config/supabase_config.dart';
import 'state/app_state.dart';
import 'state/auth_state.dart';
import 'state/theme_state.dart';
import 'screens/navigation_home.dart';
import 'screens/auth/sign_in_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Supabase.initialize(
    url: SupabaseConfig.url,
    anonKey: SupabaseConfig.anonKey,
  );
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AppState()),
        ChangeNotifierProvider(create: (_) => AuthState()),
        ChangeNotifierProvider(create: (_) => ThemeState()),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<ThemeState>(
      builder: (context, themeState, _) {
        final colors = themeState.colors;
        
        return MaterialApp(
          title: 'Field Officer App',
          debugShowCheckedModeBanner: false,
          themeMode: themeState.isDarkMode ? ThemeMode.dark : ThemeMode.light,
          theme: ThemeData(
            useMaterial3: true,
            brightness: Brightness.light,
            primaryColor: colors.primary,
            scaffoldBackgroundColor: colors.background,
            colorScheme: ColorScheme.light(
              primary: colors.primary,
              secondary: colors.secondary,
              surface: colors.surface,
              error: colors.danger,
            ),
            fontFamily: 'Inter',
            cardTheme: CardThemeData(
              color: colors.cardBg,
              elevation: 2,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
            ),
            appBarTheme: AppBarTheme(
              backgroundColor: colors.primary,
              foregroundColor: Colors.white,
              elevation: 0,
            ),
          ),
          darkTheme: ThemeData(
            useMaterial3: true,
            brightness: Brightness.dark,
            primaryColor: colors.primary,
            scaffoldBackgroundColor: colors.background,
            colorScheme: ColorScheme.dark(
              primary: colors.primary,
              secondary: colors.secondary,
              surface: colors.surface,
              error: colors.danger,
            ),
            fontFamily: 'Inter',
            cardTheme: CardThemeData(
              color: colors.cardBg,
              elevation: 2,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
            ),
            appBarTheme: AppBarTheme(
              backgroundColor: colors.backgroundSecondary,
              foregroundColor: colors.text,
              elevation: 0,
            ),
          ),
          home: Consumer<AuthState>(
            builder: (context, auth, _) {
              if (auth.isLoading) {
                return Scaffold(
                  backgroundColor: colors.background,
                  body: Center(
                    child: Column(mainAxisSize: MainAxisSize.min, children: [
                      Container(
                        width: 64, height: 64,
                        decoration: BoxDecoration(
                          color: colors.primary,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: const Icon(Icons.shield, color: Colors.white, size: 28),
                      ),
                      const SizedBox(height: 16),
                      Text('DGI Field Officer', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: colors.text)),
                      const SizedBox(height: 20),
                      SizedBox(width: 24, height: 24, child: CircularProgressIndicator(strokeWidth: 2.5, color: colors.primary)),
                    ]),
                  ),
                );
              }
              return auth.isAuthenticated ? const NavigationHome() : const SignInScreen();
            },
          ),
        );
      },
    );
  }
}
