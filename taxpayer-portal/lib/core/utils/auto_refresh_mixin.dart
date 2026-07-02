import 'dart:async';
import 'package:flutter/widgets.dart';

/// Mixin that adds periodic auto-refresh to any StatefulWidget.
///
/// Usage:
///   class _MyScreenState extends State<MyScreen> with AutoRefreshMixin {
///     @override
///     Duration get refreshInterval => const Duration(seconds: 30);
///
///     @override
///     Future<void> onRefresh() => _fetchData();
///
///     @override
///     void initState() {
///       super.initState();
///       startAutoRefresh();
///     }
///   }
mixin AutoRefreshMixin<T extends StatefulWidget> on State<T> {
  Timer? _refreshTimer;

  Duration get refreshInterval => const Duration(seconds: 30);

  Future<void> onRefresh();

  void startAutoRefresh() {
    _refreshTimer?.cancel();
    _refreshTimer = Timer.periodic(refreshInterval, (_) {
      if (mounted) onRefresh();
    });
  }

  void stopAutoRefresh() {
    _refreshTimer?.cancel();
    _refreshTimer = null;
  }

  @override
  void dispose() {
    _refreshTimer?.cancel();
    super.dispose();
  }
}
