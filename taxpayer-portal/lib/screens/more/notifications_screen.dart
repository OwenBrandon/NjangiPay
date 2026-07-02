import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';

import '../../core/theme/app_theme.dart';
import '../../core/models/models.dart';
import '../../core/api/api_service.dart';
import '../../core/utils/auto_refresh_mixin.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> with AutoRefreshMixin {
  bool _isLoading = true;
  bool _isRefreshing = false;
  List<AppNotification> _notifications = [];

  @override
  Duration get refreshInterval => const Duration(seconds: 15);

  @override
  Future<void> onRefresh() => _fetchData();

  @override
  void initState() {
    super.initState();
    _fetchData();
    startAutoRefresh();
  }

  Future<void> _fetchData() async {
    final api = context.read<ApiService>();
    try {
      final notifications = await api.getNotifications();
      setState(() {
        _notifications = notifications;
        _isLoading = false;
        _isRefreshing = false;
      });
    } catch (e) {
      debugPrint('Error fetching data: $e');
      setState(() {
        _isLoading = false;
        _isRefreshing = false;
      });
    }
  }

  Future<void> _onRefresh() async {
    setState(() => _isRefreshing = true);
    await _fetchData();
  }

  void _markAllAsRead() {
    setState(() {
      _notifications = _notifications.map((n) => AppNotification(
        id: n.id,
        title: n.title,
        message: n.message,
        date: n.date,
        type: n.type,
        read: true,
      )).toList();
    });
  }

  void _markAsRead(String id) {
    setState(() {
      final index = _notifications.indexWhere((n) => n.id == id);
      if (index != -1) {
        final n = _notifications[index];
        _notifications[index] = AppNotification(
          id: n.id,
          title: n.title,
          message: n.message,
          date: n.date,
          type: n.type,
          read: true,
        );
      }
    });
  }

  IconData _getIcon(NotificationType type) {
    switch (type) {
      case NotificationType.reminder: return LucideIcons.bell;
      case NotificationType.payment: return LucideIcons.creditCard;
      case NotificationType.assessment: return LucideIcons.fileText;
      case NotificationType.dispute: return LucideIcons.messageSquare;
      case NotificationType.system: return LucideIcons.settings;
    }
  }

  Color _getIconColor(NotificationType type, AppColors colors) {
    switch (type) {
      case NotificationType.reminder: return colors.warning;
      case NotificationType.payment: return colors.success;
      case NotificationType.assessment: return colors.info;
      case NotificationType.dispute: return colors.danger;
      case NotificationType.system: return colors.textSecondary;
    }
  }

  @override
  Widget build(BuildContext context) {
    final themeProvider = context.watch<ThemeProvider>();
    final colors = themeProvider.colors;

    final unreadCount = _notifications.where((n) => !n.read).length;

    return Scaffold(
      backgroundColor: colors.background,
      appBar: AppBar(
        title: Text('Notifications', style: TextStyle(color: colors.text)),
        backgroundColor: colors.surface,
        elevation: 0,
        iconTheme: IconThemeData(color: colors.text),
      ),
      body: Column(
        children: [
          if (unreadCount > 0)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              decoration: BoxDecoration(
                color: colors.surface,
                border: Border(bottom: BorderSide(color: colors.border)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('$unreadCount unread', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: colors.textSecondary)),
                  GestureDetector(
                    onTap: _markAllAsRead,
                    child: Row(
                      children: [
                        Icon(LucideIcons.checkCheck, size: 16, color: colors.primary),
                        const SizedBox(width: 6),
                        Text('Mark all as read', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: colors.primary)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          Expanded(
            child: _isLoading
                ? Center(child: CircularProgressIndicator(color: colors.primary))
                : RefreshIndicator(
                    onRefresh: _onRefresh,
                    color: colors.primary,
                    child: _notifications.isEmpty
                        ? ListView(
                            physics: const AlwaysScrollableScrollPhysics(),
                            children: [
                              Container(
                                height: 400,
                                alignment: Alignment.center,
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(LucideIcons.bell, size: 48, color: colors.textLight),
                                    const SizedBox(height: 16),
                                    Text('No notifications', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600, color: colors.text)),
                                    const SizedBox(height: 4),
                                    Text('You\'re all caught up! Check back later.', style: TextStyle(fontSize: 14, color: colors.textSecondary)),
                                  ],
                                ),
                              )
                            ],
                          )
                        : ListView.builder(
                            padding: const EdgeInsets.all(16).copyWith(bottom: 24),
                            physics: const AlwaysScrollableScrollPhysics(),
                            itemCount: _notifications.length,
                            itemBuilder: (context, index) {
                              final notification = _notifications[index];
                              final iconColor = _getIconColor(notification.type, colors);

                              return GestureDetector(
                                onTap: () => _markAsRead(notification.id),
                                child: Container(
                                  margin: const EdgeInsets.only(bottom: 10),
                                  padding: const EdgeInsets.all(16),
                                  decoration: BoxDecoration(
                                    color: !notification.read ? colors.primary.withOpacity(0.08) : colors.surface,
                                    borderRadius: BorderRadius.circular(14),
                                    border: Border(left: BorderSide(color: !notification.read ? colors.primary : Colors.transparent, width: 3)),
                                    boxShadow: [
                                      BoxShadow(color: colors.primary.withOpacity(0.03), blurRadius: 4, offset: const Offset(0, 1))
                                    ],
                                  ),
                                  child: Row(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Container(
                                        width: 44,
                                        height: 44,
                                        decoration: BoxDecoration(color: iconColor.withOpacity(0.15), borderRadius: BorderRadius.circular(12)),
                                        alignment: Alignment.center,
                                        child: Icon(_getIcon(notification.type), size: 18, color: iconColor),
                                      ),
                                      const SizedBox(width: 14),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Row(
                                              crossAxisAlignment: CrossAxisAlignment.center,
                                              children: [
                                                Expanded(
                                                  child: Text(notification.title, style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: colors.text)),
                                                ),
                                                if (!notification.read)
                                                  Container(width: 8, height: 8, decoration: BoxDecoration(color: colors.primary, shape: BoxShape.circle)),
                                              ],
                                            ),
                                            const SizedBox(height: 5),
                                            Text(notification.message, style: TextStyle(fontSize: 13, color: colors.textSecondary, height: 1.4)),
                                            const SizedBox(height: 8),
                                            Text(notification.date, style: TextStyle(fontSize: 11, color: colors.textLight)),
                                          ],
                                        ),
                                      )
                                    ],
                                  ),
                                ),
                              );
                            },
                          ),
                  ),
          ),
        ],
      ),
    );
  }
}
