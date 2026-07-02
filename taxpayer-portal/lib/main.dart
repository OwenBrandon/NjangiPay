import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:supabase_flutter/supabase_flutter.dart' hide AuthState;

import 'core/theme/app_theme.dart';
import 'core/router/app_router.dart';
import 'core/api/api_service.dart';
import 'core/auth/auth_state.dart';
import 'core/config/supabase_config.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Supabase.initialize(
    url: SupabaseConfig.url,
    anonKey: SupabaseConfig.anonKey,
  );
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => ThemeProvider()),
        ChangeNotifierProvider(create: (_) => AuthState()),
        Provider(create: (_) => ApiService()),
      ],
      child: const TaxpayerPortalApp(),
    ),
  );
}

class TaxpayerPortalApp extends StatefulWidget {
  const TaxpayerPortalApp({super.key});

  @override
  State<TaxpayerPortalApp> createState() => _TaxpayerPortalAppState();
}

class _TaxpayerPortalAppState extends State<TaxpayerPortalApp> {
  GoRouter? _router;

  @override
  Widget build(BuildContext context) {
    _router ??= AppRouter.createRouter(context);

    return Consumer<ThemeProvider>(
      builder: (context, themeProvider, child) {
        if (themeProvider.isLoading) {
          return const MaterialApp(
            home: Scaffold(
              body: Center(child: CircularProgressIndicator()),
            ),
          );
        }

        final lightTheme = AppTheme.getLightTheme();
        final darkTheme = AppTheme.getDarkTheme();

        return MaterialApp.router(
          title: 'Taxpayer Portal',
          debugShowCheckedModeBanner: false,
          theme: lightTheme.copyWith(
            textTheme: GoogleFonts.interTextTheme(lightTheme.textTheme),
          ),
          darkTheme: darkTheme.copyWith(
            textTheme: GoogleFonts.interTextTheme(darkTheme.textTheme),
          ),
          themeMode: themeProvider.themeMode,
          routerConfig: _router!,
        );
      },
    );
  }
}
