import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../state/auth_state.dart';
import '../state/theme_state.dart';
import 'profile/settings_screen.dart';
import 'profile/help_screen.dart';
import 'profile/terms_screen.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final themeState = Provider.of<ThemeState>(context);
    final colors = themeState.colors;

    const officerData = {
      'name': 'Jean-Baptiste Onana',
      'email': 'jb.onana@dgi.cm',
      'phone': '+237 677 890 123',
      'employeeId': 'FO-2024-0892',
      'zone': 'Buea Centre',
      'department': 'Field Operations',
      'joinDate': 'March 2022',
      'rank': 'Senior Field Officer',
    };

    final performanceStats = [
      {'label': 'This Month', 'value': '2.4M FCFA', 'icon': LucideIcons.target, 'color': colors.success},
      {'label': 'Total Visits', 'value': '156', 'icon': LucideIcons.mapPin, 'color': colors.primary},
      {'label': 'Rating', 'value': '4.8★', 'icon': LucideIcons.award, 'color': colors.warning},
    ];

    return Scaffold(
      body: Stack(
        children: [
          // Background Gradient header
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            height: 280,
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: colors.headerGradient,
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
              ),
            ),
          ),
          SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.only(bottom: 30),
              child: Column(
                children: [
                  // Title
                  const Align(
                    alignment: Alignment.centerLeft,
                    child: Padding(
                      padding: EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                      child: Text(
                        "Profile",
                        style: TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.w700,
                          color: Colors.white,
                          letterSpacing: -0.4,
                        ),
                      ),
                    ),
                  ),

                  // Profile Section (Avatar & Employee ID)
                  Column(
                    children: [
                      Container(
                        width: 100,
                        height: 100,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: themeState.isDarkMode ? colors.primary : Colors.white,
                            width: 4,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.2),
                              blurRadius: 8,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: ClipOval(
                          child: Container(
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: themeState.isDarkMode
                                    ? [colors.primary, colors.primaryLight]
                                    : [Colors.white, const Color(0xFFF2F2F7)],
                              ),
                            ),
                            child: Center(
                              child: Text(
                                officerData['name']!
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join(''),
                                style: TextStyle(
                                  fontSize: 36,
                                  fontWeight: FontWeight.w700,
                                  color: themeState.isDarkMode ? Colors.white : colors.primary,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        officerData['name']!,
                        style: const TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.w700,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(LucideIcons.shield, size: 12, color: Colors.white),
                            const SizedBox(width: 6),
                            Text(
                              officerData['rank']!,
                              style: const TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: Colors.white,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        officerData['employeeId']!,
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.white.withOpacity(0.7),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 18),

                  // Performance Stats Card
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: Container(
                      decoration: BoxDecoration(
                        color: colors.cardBg,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: colors.glassBorder),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.1),
                            blurRadius: 12,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      padding: const EdgeInsets.all(16),
                      child: Row(
                        children: performanceStats.asMap().entries.map((entry) {
                          final idx = entry.key;
                          final stat = entry.value;

                          return Expanded(
                            child: Container(
                              decoration: BoxDecoration(
                                border: idx < performanceStats.length - 1
                                    ? Border(
                                        right: BorderSide(color: colors.border),
                                      )
                                    : null,
                              ),
                              padding: const EdgeInsets.symmetric(horizontal: 8),
                              child: Column(
                                children: [
                                  Container(
                                    width: 40,
                                    height: 40,
                                    decoration: BoxDecoration(
                                      color: (stat['color'] as Color).withOpacity(0.15),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Icon(
                                      stat['icon'] as IconData,
                                      size: 18,
                                      color: stat['color'] as Color,
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  Text(
                                    stat['value'] as String,
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.w700,
                                      color: colors.text,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    stat['label'] as String,
                                    style: TextStyle(
                                      fontSize: 11,
                                      fontWeight: FontWeight.w500,
                                      color: colors.textSecondary,
                                    ),
                                    textAlign: TextAlign.center,
                                  ),
                                ],
                              ),
                            ),
                          );
                        }).toList(),
                      ),
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Officer Information Card
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: Container(
                      decoration: BoxDecoration(
                        color: colors.cardBg,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: colors.glassBorder),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.08),
                            blurRadius: 12,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      padding: const EdgeInsets.all(18),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            "Officer Information",
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                              color: colors.text,
                            ),
                          ),
                          const SizedBox(height: 16),
                          _buildInfoRow(
                            icon: LucideIcons.mail,
                            label: 'Email',
                            value: officerData['email']!,
                            color: colors.primary,
                            colors: colors,
                          ),
                          _buildInfoRow(
                            icon: LucideIcons.phone,
                            label: 'Phone',
                            value: officerData['phone']!,
                            color: colors.success,
                            colors: colors,
                          ),
                          _buildInfoRow(
                            icon: LucideIcons.mapPin,
                            label: 'Assigned Zone',
                            value: officerData['zone']!,
                            color: colors.warning,
                            colors: colors,
                          ),
                          _buildInfoRow(
                            icon: LucideIcons.calendar,
                            label: 'Joined',
                            value: officerData['joinDate']!,
                            color: colors.accent,
                            colors: colors,
                            isLast: true,
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Dark Mode Card
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: Container(
                      decoration: BoxDecoration(
                        color: colors.cardBg,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: colors.glassBorder),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.08),
                            blurRadius: 12,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      padding: const EdgeInsets.all(18),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Container(
                                width: 44,
                                height: 44,
                                decoration: BoxDecoration(
                                  color: themeState.isDarkMode
                                      ? colors.primary.withOpacity(0.15)
                                      : colors.warning.withOpacity(0.15),
                                  shape: BoxShape.circle,
                                ),
                                child: Icon(
                                  themeState.isDarkMode ? LucideIcons.moon : LucideIcons.sun,
                                  color: themeState.isDarkMode ? colors.primary : colors.warning,
                                  size: 20,
                                ),
                              ),
                              const SizedBox(width: 14),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    "Dark Mode",
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w600,
                                      color: colors.text,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    themeState.isDarkMode ? 'Currently enabled' : 'Currently disabled',
                                    style: TextStyle(
                                      fontSize: 13,
                                      color: colors.textSecondary,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          Switch(
                            value: themeState.isDarkMode,
                            onChanged: (_) => themeState.toggleTheme(),
                            activeColor: colors.primary,
                            trackColor: MaterialStateProperty.all(
                              themeState.isDarkMode ? colors.primary.withOpacity(0.6) : colors.borderLight,
                            ),
                            thumbColor: MaterialStateProperty.all(Colors.white),
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Menu Sections
                  _buildMenuSection(
                    title: 'Account',
                    items: [
                      {'label': 'Edit Profile', 'icon': LucideIcons.user, 'screen': null},
                      {'label': 'Notifications', 'icon': LucideIcons.bell, 'screen': null},
                      {'label': 'Security', 'icon': LucideIcons.shield, 'screen': null},
                    ],
                    context: context,
                    colors: colors,
                  ),

                  const SizedBox(height: 16),

                  _buildMenuSection(
                    title: 'Preferences',
                    items: [
                      {'label': 'App Settings', 'icon': LucideIcons.settings, 'screen': const SettingsScreen()},
                    ],
                    context: context,
                    colors: colors,
                  ),

                  const SizedBox(height: 16),

                  _buildMenuSection(
                    title: 'Support',
                    items: [
                      {'label': 'Help Center', 'icon': LucideIcons.helpCircle, 'screen': const HelpScreen()},
                      {'label': 'Terms & Privacy', 'icon': LucideIcons.fileText, 'screen': const TermsScreen()},
                    ],
                    context: context,
                    colors: colors,
                  ),

                  const SizedBox(height: 24),

                  // Log Out Button
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: SizedBox(
                      width: double.infinity,
                      child: TextButton.icon(
                        style: TextButton.styleFrom(
                          backgroundColor: colors.danger.withOpacity(0.1),
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                        ),
                        onPressed: () {
                          showDialog(
                            context: context,
                            builder: (context) => AlertDialog(
                              title: const Text('Log Out'),
                              content: const Text('Are you sure you want to log out?'),
                              actions: [
                                TextButton(
                                  onPressed: () => Navigator.pop(context),
                                  child: Text('Cancel', style: TextStyle(color: colors.textSecondary)),
                                ),
                                TextButton(
                                  onPressed: () {
                                    Navigator.pop(context);
                                    context.read<AuthState>().logout();
                                  },
                                  child: Text('Log Out', style: TextStyle(color: colors.danger, fontWeight: FontWeight.bold)),
                                ),
                              ],
                            ),
                          );
                        },
                        icon: Icon(LucideIcons.logOut, color: colors.danger, size: 20),
                        label: Text(
                          "Log Out",
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: colors.danger,
                          ),
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 16),
                  Text(
                    "Version 1.0.0",
                    style: TextStyle(
                      fontSize: 12,
                      color: colors.textLight,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow({
    required IconData icon,
    required String label,
    required String value,
    required Color color,
    required AppColors colors,
    bool isLast = false,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12),
      decoration: BoxDecoration(
        border: isLast
            ? null
            : Border(
                bottom: BorderSide(color: colors.border.withOpacity(0.3)),
              ),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: color.withOpacity(0.15),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Icon(icon, size: 16, color: color),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 12,
                    color: colors.textSecondary,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  value,
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w500,
                    color: colors.text,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMenuSection({
    required String title,
    required List<Map<String, dynamic>> items,
    required BuildContext context,
    required AppColors colors,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Container(
        decoration: BoxDecoration(
          color: colors.cardBg,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: colors.glassBorder),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.08),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        padding: const EdgeInsets.all(6),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.only(left: 14, right: 14, top: 12, bottom: 8),
              child: Text(
                title.toUpperCase(),
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: colors.textSecondary,
                  letterSpacing: 0.5,
                ),
              ),
            ),
            ...items.asMap().entries.map((entry) {
              final idx = entry.key;
              final item = entry.value;

              return InkWell(
                onTap: () {
                  if (item['screen'] != null) {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => item['screen'] as Widget),
                    );
                  } else {
                    showDialog(
                      context: context,
                      builder: (context) => AlertDialog(
                        title: Text(item['label'] as String),
                        content: Text("Mock for ${item['label']} screen."),
                        actions: [
                          TextButton(
                            onPressed: () => Navigator.pop(context),
                            child: const Text('Close'),
                          ),
                        ],
                      ),
                    );
                  }
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 14),
                  decoration: BoxDecoration(
                    border: idx < items.length - 1
                        ? Border(
                            bottom: BorderSide(color: colors.border.withOpacity(0.3)),
                          )
                        : null,
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Container(
                            width: 40,
                            height: 40,
                            decoration: BoxDecoration(
                              color: colors.primary.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(14),
                            ),
                            child: Icon(
                              item['icon'] as IconData,
                              size: 18,
                              color: colors.primary,
                            ),
                          ),
                          const SizedBox(width: 14),
                          Text(
                            item['label'] as String,
                            style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w500,
                              color: colors.text,
                            ),
                          ),
                        ],
                      ),
                      Icon(LucideIcons.chevronRight, size: 20, color: colors.textLight),
                    ],
                  ),
                ),
              );
            }).toList(),
          ],
        ),
      ),
    );
  }
}
