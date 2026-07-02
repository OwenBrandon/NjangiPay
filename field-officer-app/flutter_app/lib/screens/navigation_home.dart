import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../state/app_state.dart';
import '../state/theme_state.dart';
import 'dashboard_screen.dart';
import 'search_screen.dart';
import 'payments_screen.dart';
import 'logs_screen.dart';
import 'profile_screen.dart';

class NavigationHome extends StatefulWidget {
  const NavigationHome({super.key});

  @override
  State<NavigationHome> createState() => _NavigationHomeState();
}

class _NavigationHomeState extends State<NavigationHome> {
  final List<Widget> _screens = [
    const DashboardScreen(),
    const SearchScreen(),
    const PaymentsScreen(),
    const LogsScreen(),
    const ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    final themeState = Provider.of<ThemeState>(context);
    final appState = Provider.of<AppState>(context);
    final colors = themeState.colors;

    return Scaffold(
      body: IndexedStack(
        index: appState.currentTab,
        children: _screens,
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          border: Border(
            top: BorderSide(
              color: colors.tabBarBorder,
              width: 0.5,
            ),
          ),
          boxShadow: [
            BoxShadow(
              color: colors.white.withOpacity(themeState.isDarkMode ? 0.05 : 0.08),
              blurRadius: 12,
              offset: const Offset(0, -4),
            ),
          ],
        ),
        child: BottomNavigationBar(
          currentIndex: appState.currentTab,
          onTap: (index) {
            appState.setTab(index);
          },
          backgroundColor: colors.tabBar,
          selectedItemColor: colors.primary,
          unselectedItemColor: colors.textLight,
          type: BottomNavigationBarType.fixed,
          selectedLabelStyle: const TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.w500,
          ),
          unselectedLabelStyle: const TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.w500,
          ),
          elevation: 0,
          items: const [
            BottomNavigationBarItem(
              icon: Icon(LucideIcons.layoutDashboard),
              label: 'Dashboard',
            ),
            BottomNavigationBarItem(
              icon: Icon(LucideIcons.search),
              label: 'Search',
            ),
            BottomNavigationBarItem(
              icon: Icon(LucideIcons.wallet),
              label: 'Payments',
            ),
            BottomNavigationBarItem(
              icon: Icon(LucideIcons.clipboardList),
              label: 'Visits',
            ),
            BottomNavigationBarItem(
              icon: Icon(LucideIcons.user),
              label: 'Profile',
            ),
          ],
        ),
      ),
    );
  }
}
