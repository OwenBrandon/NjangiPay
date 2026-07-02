import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../state/theme_state.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _notifications = true;
  bool _sounds = true;
  bool _vibration = true;
  bool _autoSync = true;
  bool _offlineMode = false;

  @override
  Widget build(BuildContext context) {
    final themeState = Provider.of<ThemeState>(context);
    final colors = themeState.colors;

    final settingsSections = [
      {
        'title': 'Notifications',
        'items': [
          {
            'icon': LucideIcons.bell,
            'label': 'Push Notifications',
            'desc': 'Receive alerts for payments and tasks',
            'val': _notifications,
            'onToggle': (bool v) => setState(() => _notifications = v),
          },
          {
            'icon': LucideIcons.volume2,
            'label': 'Sound Effects',
            'desc': 'Play sounds for actions',
            'val': _sounds,
            'onToggle': (bool v) => setState(() => _sounds = v),
          },
          {
            'icon': LucideIcons.vibrate,
            'label': 'Vibration',
            'desc': 'Haptic feedback for interactions',
            'val': _vibration,
            'onToggle': (bool v) => setState(() => _vibration = v),
          },
        ],
      },
      {
        'title': 'Data & Sync',
        'items': [
          {
            'icon': LucideIcons.refreshCw,
            'label': 'Auto Sync',
            'desc': 'Automatically sync data when online',
            'val': _autoSync,
            'onToggle': (bool v) => setState(() => _autoSync = v),
          },
          {
            'icon': LucideIcons.wifi,
            'label': 'Offline Mode',
            'desc': 'Work without internet connection',
            'val': _offlineMode,
            'onToggle': (bool v) => setState(() => _offlineMode = v),
          },
        ],
      },
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('App Settings'),
        backgroundColor: themeState.isDarkMode ? colors.background : colors.primary,
        foregroundColor: themeState.isDarkMode ? colors.text : Colors.white,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ...settingsSections.map((section) {
              final items = section['items'] as List<Map<String, dynamic>>;

              return Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.only(left: 4, bottom: 12),
                    child: Text(
                      (section['title'] as String).toUpperCase(),
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: colors.textSecondary,
                        letterSpacing: 0.8,
                      ),
                    ),
                  ),
                  Container(
                    decoration: BoxDecoration(
                      color: colors.cardBg,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: colors.glassBorder),
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(20),
                      child: Column(
                        children: items.asMap().entries.map((entry) {
                          final idx = entry.key;
                          final item = entry.value;

                          return Container(
                            decoration: BoxDecoration(
                              border: idx < items.length - 1
                                  ? Border(
                                      bottom: BorderSide(color: colors.border.withOpacity(0.3)),
                                    )
                                  : null,
                            ),
                            padding: const EdgeInsets.all(16),
                            child: Row(
                              children: [
                                Container(
                                  width: 44,
                                  height: 44,
                                  decoration: BoxDecoration(
                                    color: colors.primary.withOpacity(0.15),
                                    borderRadius: BorderRadius.circular(14),
                                  ),
                                  child: Icon(item['icon'] as IconData, size: 20, color: colors.primary),
                                ),
                                const SizedBox(width: 14),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        item['label'] as String,
                                        style: TextStyle(
                                          fontSize: 15,
                                          fontWeight: FontWeight.w600,
                                          color: colors.text,
                                        ),
                                      ),
                                      const SizedBox(height: 2),
                                      Text(
                                        item['desc'] as String,
                                        style: TextStyle(
                                          fontSize: 13,
                                          color: colors.textSecondary,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                Switch(
                                  value: item['val'] as bool,
                                  onChanged: item['onToggle'] as void Function(bool),
                                  activeColor: colors.primary,
                                  trackColor: MaterialStateProperty.all(
                                    (item['val'] as bool)
                                        ? colors.primary.withOpacity(0.6)
                                        : colors.borderLight,
                                  ),
                                  thumbColor: MaterialStateProperty.all(Colors.white),
                                ),
                              ],
                            ),
                          );
                        }).toList(),
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                ],
              );
            }).toList(),

            // Actions Section
            Padding(
              padding: const EdgeInsets.only(left: 4, bottom: 12),
              child: Text(
                "ACTIONS",
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: colors.textSecondary,
                  letterSpacing: 0.8,
                ),
              ),
            ),
            Container(
              decoration: BoxDecoration(
                color: colors.cardBg,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: colors.glassBorder),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(20),
                child: Column(
                  children: [
                    InkWell(
                      onTap: () {
                        showDialog(
                          context: context,
                          builder: (context) => AlertDialog(
                            title: const Text('Offline Cache'),
                            content: const Text('Taxpayer local cache updated successfully.'),
                            actions: [
                              TextButton(
                                onPressed: () => Navigator.pop(context),
                                child: const Text('Close'),
                              ),
                            ],
                          ),
                        );
                      },
                      child: Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          border: Border(
                            bottom: BorderSide(color: colors.border.withOpacity(0.3)),
                          ),
                        ),
                        child: Row(
                          children: [
                            Container(
                              width: 44,
                              height: 44,
                              decoration: BoxDecoration(
                                color: colors.success.withOpacity(0.15),
                                borderRadius: BorderRadius.circular(14),
                              ),
                              child: Icon(LucideIcons.download, size: 20, color: colors.success),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    "Download Offline Data",
                                    style: TextStyle(
                                      fontSize: 15,
                                      fontWeight: FontWeight.w600,
                                      color: colors.text,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    "Cache taxpayer records locally",
                                    style: TextStyle(
                                      fontSize: 13,
                                      color: colors.textSecondary,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    InkWell(
                      onTap: () {
                        showDialog(
                          context: context,
                          builder: (context) => AlertDialog(
                            title: const Text('App Language'),
                            content: const Text('Language changes are restricted to English currently.'),
                            actions: [
                              TextButton(
                                onPressed: () => Navigator.pop(context),
                                child: const Text('Close'),
                              ),
                            ],
                          ),
                        );
                      },
                      child: Container(
                        padding: const EdgeInsets.all(16),
                        child: Row(
                          children: [
                            Container(
                              width: 44,
                              height: 44,
                              decoration: BoxDecoration(
                                color: colors.warning.withOpacity(0.15),
                                borderRadius: BorderRadius.circular(14),
                              ),
                              child: Icon(LucideIcons.globe, size: 20, color: colors.warning),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    "Change Language",
                                    style: TextStyle(
                                      fontSize: 15,
                                      fontWeight: FontWeight.w600,
                                      color: colors.text,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    "Currently: English",
                                    style: TextStyle(
                                      fontSize: 13,
                                      color: colors.textSecondary,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
