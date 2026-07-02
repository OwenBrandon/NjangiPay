import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../auth/auth_state.dart';
import '../../screens/auth/sign_in_screen.dart';
import '../../screens/auth/sign_up_screen.dart';
import '../../screens/auth/pending_approval_screen.dart';
import '../../screens/placeholder_screens.dart';
import '../../screens/tabs/main_tabs_screen.dart';
import '../../screens/dashboard/dashboard_screen.dart';
import '../../screens/businesses/businesses_screen.dart';
import '../../screens/payments/payments_screen.dart';
import '../../screens/more/more_screen.dart';
import '../../screens/modals/make_payment_screen.dart';
import '../../screens/modals/register_business_screen.dart';
import '../../screens/modals/submit_dispute_screen.dart';
import '../../screens/details/assessment_details_screen.dart';
import '../../screens/details/business_details_screen.dart';
import '../../screens/details/dispute_details_screen.dart';
import '../../screens/details/receipt_details_screen.dart';
import '../../screens/payments/assessments_screen.dart';
import '../../screens/payments/receipts_screen.dart';
import '../../screens/more/disputes_screen.dart';
import '../../screens/more/notifications_screen.dart';
import '../../screens/more/profile_screen.dart';
import '../../screens/more/settings_screen.dart';

final GlobalKey<NavigatorState> _rootNavigatorKey = GlobalKey<NavigatorState>(debugLabel: 'root');

class AppRouter {
  static GoRouter createRouter(BuildContext context) {
    final auth = context.read<AuthState>();
    return GoRouter(
      navigatorKey: _rootNavigatorKey,
      initialLocation: '/sign-in',
      refreshListenable: auth,
      redirect: (context, state) {
        final isAuthenticated = auth.isAuthenticated;
        final isAuthRoute = state.matchedLocation == '/sign-in' || state.matchedLocation == '/sign-up';
        final isPendingRoute = state.matchedLocation == '/pending-approval';

        if (!isAuthenticated && !isAuthRoute) return '/sign-in';
        if (isAuthenticated && isAuthRoute) {
          return auth.isPendingApproval ? '/pending-approval' : '/dashboard';
        }
        if (isAuthenticated && auth.isPendingApproval && !isPendingRoute && !isAuthRoute) {
          return '/pending-approval';
        }
        if (isAuthenticated && !auth.isPendingApproval && isPendingRoute) {
          return '/dashboard';
        }
        return null;
      },
      routes: [
        GoRoute(path: '/sign-in', builder: (context, state) => const SignInScreen()),
        GoRoute(path: '/pending-approval', builder: (context, state) => const PendingApprovalScreen()),
        GoRoute(path: '/sign-up', builder: (context, state) => const SignUpScreen()),
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) {
          return MainTabsScreen(navigationShell: navigationShell);
        },
        branches: [
          // Dashboard Tab
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/dashboard',
                builder: (context, state) => const DashboardScreen(),
              ),
            ],
          ),
          // Businesses Tab
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/businesses',
                builder: (context, state) => const BusinessesScreen(),
              ),
            ],
          ),
          // Payments Tab
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/payments',
                builder: (context, state) => const PaymentsScreen(),
                routes: [
                  GoRoute(
                    path: 'assessments',
                    builder: (context, state) => const AssessmentsScreen(),
                  ),
                  GoRoute(
                    path: 'receipts',
                    builder: (context, state) => const ReceiptsScreen(),
                  ),
                ],
              ),
            ],
          ),
          // More Tab
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/more',
                builder: (context, state) => const MoreScreen(),
                routes: [
                  GoRoute(
                    path: 'disputes',
                    builder: (context, state) => const DisputesScreen(),
                  ),
                  GoRoute(
                    path: 'notifications',
                    builder: (context, state) => const NotificationsScreen(),
                  ),
                  GoRoute(
                    path: 'profile',
                    builder: (context, state) => const ProfileScreen(),
                  ),
                  GoRoute(
                    path: 'settings',
                    builder: (context, state) => const SettingsScreen(),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
      
      // Modals and Details outside tabs
      GoRoute(
        path: '/register-business',
        parentNavigatorKey: _rootNavigatorKey,
        pageBuilder: (context, state) => const MaterialPage(
          fullscreenDialog: true,
          child: RegisterBusinessScreen(),
        ),
      ),
      GoRoute(
        path: '/make-payment',
        parentNavigatorKey: _rootNavigatorKey,
        pageBuilder: (context, state) => MaterialPage(
          fullscreenDialog: true,
          child: MakePaymentScreen(assessmentId: state.uri.queryParameters['assessmentId']),
        ),
      ),
      GoRoute(
        path: '/submit-dispute',
        parentNavigatorKey: _rootNavigatorKey,
        pageBuilder: (context, state) => const MaterialPage(
          fullscreenDialog: true,
          child: SubmitDisputeScreen(),
        ),
      ),
      GoRoute(
        path: '/receipt-details',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => ReceiptDetailsScreen(id: state.uri.queryParameters['id'] ?? ''),
      ),
      GoRoute(
        path: '/assessment-details',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => AssessmentDetailsScreen(id: state.uri.queryParameters['id'] ?? ''),
      ),
      GoRoute(
        path: '/dispute-details',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => DisputeDetailsScreen(id: state.uri.queryParameters['id'] ?? ''),
      ),
      GoRoute(
        path: '/business-details',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => BusinessDetailsScreen(id: state.uri.queryParameters['id'] ?? ''),
      ),
    ],
  );
  }
}
