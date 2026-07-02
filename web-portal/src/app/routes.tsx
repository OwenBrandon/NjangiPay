import React, { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router';

// Suspense HOC to wrap dynamically imported components
const withSuspense = (importFn: () => Promise<{ default: React.ComponentType<any> }>) => {
  const LazyComponent = lazy(importFn);
  return (props: any) => (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 rounded-full border-4 border-slate-200 border-t-blue-900 animate-spin" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Syncing Secure Node...</span>
        </div>
      </div>
    }>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Layouts
const PublicLayout = withSuspense(() => import('./layouts/PublicLayout'));
const RootLayout = withSuspense(() => import('./layouts/RootLayout'));

// Core Pages
const LoginPage = withSuspense(() => import('./pages/LoginPage'));
const IndexRedirect = withSuspense(() => import('./pages/IndexRedirect'));
const NotFound = withSuspense(() => import('./pages/NotFound'));

// Public Portal Pages
const PublicHome = withSuspense(() => import('./pages/PublicHome'));
const TaxServices = withSuspense(() => import('./pages/TaxServices'));
const RegisterPage = withSuspense(() => import('./pages/RegisterPage'));
const ResourcesPage = withSuspense(() => import('./pages/ResourcesPage'));
const PublicArticle = withSuspense(() => import('./pages/PublicArticle'));
const SupportInfoPage = withSuspense(() => import('./pages/SupportInfoPage'));
const ContactPage = withSuspense(() => import('./pages/ContactPage'));

// Super Admin
const SuperAdminDashboard = withSuspense(() => import('./pages/SuperAdmin/Dashboard'));
const UserManagement = withSuspense(() => import('./pages/SuperAdmin/UserManagement'));
const CreateUser = withSuspense(() => import('./pages/SuperAdmin/CreateUser'));
const RolePermissionManagement = withSuspense(() => import('./pages/SuperAdmin/RolePermissionManagement'));
const SystemConfiguration = withSuspense(() => import('./pages/SuperAdmin/SystemConfiguration'));
const AuditLogs = withSuspense(() => import('./pages/SuperAdmin/AuditLogs'));
const EditUser = withSuspense(() => import('./pages/SuperAdmin/EditUser'));
const SystemMonitoring = withSuspense(() => import('./pages/SuperAdmin/SystemMonitoring'));
const NotificationsManagement = withSuspense(() => import('./pages/SuperAdmin/NotificationsManagement'));
const SuperAdminReports = withSuspense(() => import('./pages/SuperAdmin/Reports'));
const TaxTypesSetup = withSuspense(() => import('./pages/SuperAdmin/TaxTypesSetup'));
const TaxRatesSetup = withSuspense(() => import('./pages/SuperAdmin/TaxRatesSetup'));
const RegionsManagement = withSuspense(() => import('./pages/SuperAdmin/RegionsManagement'));

// Tax Admin
const TaxAdminDashboard = withSuspense(() => import('./pages/TaxAdmin/Dashboard'));
const TaxpayerList = withSuspense(() => import('./pages/TaxAdmin/TaxpayerList'));
const TaxAdminTaxpayerProfile = withSuspense(() => import('./pages/TaxAdmin/TaxpayerProfile'));
const ComplianceManagement = withSuspense(() => import('./pages/TaxAdmin/ComplianceManagement'));
const TaxAssessmentList = withSuspense(() => import('./pages/TaxAdmin/TaxAssessmentList'));
const CreateAssessment = withSuspense(() => import('./pages/TaxAdmin/CreateAssessment'));
const FieldOperations = withSuspense(() => import('./pages/TaxAdmin/FieldOperations'));
const TaxAdminReports = withSuspense(() => import('./pages/TaxAdmin/Reports'));
const TaxAdminAnalytics = withSuspense(() => import('./pages/TaxAdmin/Analytics'));
const ApproveRegistration = withSuspense(() => import('./pages/TaxAdmin/ApproveRegistration'));
const ApproveBusinesses = withSuspense(() => import('./pages/TaxAdmin/ApproveBusinesses'));
const EditTaxpayer = withSuspense(() => import('./pages/TaxAdmin/EditTaxpayer'));
const EditAssessment = withSuspense(() => import('./pages/TaxAdmin/EditAssessment'));
const PenaltiesManagement = withSuspense(() => import('./pages/TaxAdmin/PenaltiesManagement'));

// Accountant
const AccountantDashboard = withSuspense(() => import('./pages/Accountant/Dashboard'));
const PaymentManagement = withSuspense(() => import('./pages/Accountant/PaymentManagement'));
const PaymentDetails = withSuspense(() => import('./pages/Accountant/PaymentDetails'));
const Reconciliation = withSuspense(() => import('./pages/Accountant/Reconciliation'));
const PaymentExceptions = withSuspense(() => import('./pages/Accountant/PaymentExceptions'));
const ExceptionResolution = withSuspense(() => import('./pages/Accountant/ExceptionResolution'));
const RefundsAdjustments = withSuspense(() => import('./pages/Accountant/RefundsAdjustments'));
const FinancialReports = withSuspense(() => import('./pages/Accountant/FinancialReports'));
const RevenueAnalytics = withSuspense(() => import('./pages/Accountant/RevenueAnalytics'));

// Auditor
const AuditorDashboard = withSuspense(() => import('./pages/Auditor/Dashboard'));
const AuditCaseList = withSuspense(() => import('./pages/Auditor/AuditCaseList'));
const AuditCaseDetails = withSuspense(() => import('./pages/Auditor/AuditCaseDetails'));
const TaxpayerAuditView = withSuspense(() => import('./pages/Auditor/TaxpayerAuditView'));
const RiskFraudDetection = withSuspense(() => import('./pages/Auditor/RiskFraudDetection'));
const AuditReports = withSuspense(() => import('./pages/Auditor/AuditReports'));

// Support Staff
const SupportDashboard = withSuspense(() => import('./pages/Support/Dashboard'));
const TicketList = withSuspense(() => import('./pages/Support/TicketList'));
const TicketDetails = withSuspense(() => import('./pages/Support/TicketDetails'));
const SupportReports = withSuspense(() => import('./pages/Support/SupportReports'));
const UserLookup = withSuspense(() => import('./pages/Support/UserLookup'));

// Content Manager
const ContentDashboard = withSuspense(() => import('./pages/Content/Dashboard'));
const ArticleList = withSuspense(() => import('./pages/Content/ArticleList'));
const ArticleEditor = withSuspense(() => import('./pages/Content/ArticleEditor'));
const CategoryManagement = withSuspense(() => import('./pages/Content/CategoryManagement'));

// Taxpayer
const TaxpayerDashboard = withSuspense(() => import('./pages/Taxpayer/Dashboard'));
const TaxpayerProfile = withSuspense(() => import('./pages/Taxpayer/Profile'));
const TaxObligations = withSuspense(() => import('./pages/Taxpayer/TaxObligations'));
const FilingPage = withSuspense(() => import('./pages/Taxpayer/Filing'));
const PaymentsPage = withSuspense(() => import('./pages/Taxpayer/Payments'));
const TaxpayerRecords = withSuspense(() => import('./pages/Taxpayer/Records'));
const TaxpayerSupport = withSuspense(() => import('./pages/Taxpayer/Support'));

export const router = createBrowserRouter([
  // 1. Public Portal Routes Layout
  {
    Component: PublicLayout,
    children: [
      { path: '/', Component: PublicHome },
      { path: '/services', Component: TaxServices },
      { path: '/register', Component: RegisterPage },
      { path: '/resources', Component: ResourcesPage },
      { path: '/resources/article/:slug', Component: PublicArticle },
      { path: '/support-info', Component: SupportInfoPage },
      { path: '/contact', Component: ContactPage },
    ],
  },
  
  // 2. Standalone Login Page
  {
    path: '/login',
    Component: LoginPage,
  },

  // 3. Secure Authenticated Layout
  {
    Component: RootLayout,
    children: [
      {
        path: '/portal',
        Component: IndexRedirect,
      },
      // Super Admin Routes
      {
        path: '/super-admin',
        children: [
          { index: true, Component: SuperAdminDashboard },
          { path: 'users', Component: UserManagement },
          { path: 'users/create', Component: CreateUser },
          { path: 'users/:id/edit', Component: EditUser },
          { path: 'roles', Component: RolePermissionManagement },
          { path: 'config', Component: SystemConfiguration },
          { path: 'config/tax-types', Component: TaxTypesSetup },
          { path: 'config/tax-rates', Component: TaxRatesSetup },
          { path: 'config/regions', Component: RegionsManagement },
          { path: 'monitoring', Component: SystemMonitoring },
          { path: 'notifications', Component: NotificationsManagement },
          { path: 'reports', Component: SuperAdminReports },
          { path: 'audit-logs', Component: AuditLogs },
        ],
      },
      // Tax Admin Routes
      {
        path: '/tax-admin',
        children: [
          { index: true, Component: TaxAdminDashboard },
          { path: 'taxpayers', Component: TaxpayerList },
          { path: 'taxpayers/approve', Component: ApproveRegistration },
          { path: 'businesses/approve', Component: ApproveBusinesses },
          { path: 'taxpayers/:id', Component: TaxAdminTaxpayerProfile },
          { path: 'taxpayers/:id/edit', Component: EditTaxpayer },
          { path: 'compliance', Component: ComplianceManagement },
          { path: 'compliance/penalties', Component: PenaltiesManagement },
          { path: 'assessments', Component: TaxAssessmentList },
          { path: 'assessments/create', Component: CreateAssessment },
          { path: 'assessments/:id/edit', Component: EditAssessment },
          { path: 'field-operations', Component: FieldOperations },
          { path: 'reports', Component: TaxAdminReports },
          { path: 'analytics', Component: TaxAdminAnalytics },
        ],
      },
      // Accountant Routes
      {
        path: '/accountant',
        children: [
          { index: true, Component: AccountantDashboard },
          { path: 'payments', Component: PaymentManagement },
          { path: 'payments/:id', Component: PaymentDetails },
          { path: 'reconciliation', Component: Reconciliation },
          { path: 'exceptions', Component: PaymentExceptions },
          { path: 'exceptions/:id', Component: ExceptionResolution },
          { path: 'refunds', Component: RefundsAdjustments },
          { path: 'reports', Component: FinancialReports },
          { path: 'analytics', Component: RevenueAnalytics },
        ],
      },
      // Auditor Routes
      {
        path: '/auditor',
        children: [
          { index: true, Component: AuditorDashboard },
          { path: 'cases', Component: AuditCaseList },
          { path: 'cases/:id', Component: AuditCaseDetails },
          { path: 'taxpayer/:id', Component: TaxpayerAuditView },
          { path: 'risk-detection', Component: RiskFraudDetection },
          { path: 'reports', Component: AuditReports },
        ],
      },
      // Support Staff Routes
      {
        path: '/support',
        children: [
          { index: true, Component: SupportDashboard },
          { path: 'tickets', Component: TicketList },
          { path: 'tickets/:id', Component: TicketDetails },
          { path: 'reports', Component: SupportReports },
          { path: 'lookup', Component: UserLookup },
        ],
      },
      // Content Manager Routes
      {
        path: '/content',
        children: [
          { index: true, Component: ContentDashboard },
          { path: 'articles', Component: ArticleList },
          { path: 'articles/create', Component: ArticleEditor },
          { path: 'articles/:id', Component: ArticleEditor },
          { path: 'categories', Component: CategoryManagement },
        ],
      },
      // Taxpayer Routes
      {
        path: '/taxpayer',
        children: [
          { index: true, Component: TaxpayerDashboard },
          { path: 'profile', Component: TaxpayerProfile },
          { path: 'obligations', Component: TaxObligations },
          { path: 'filing', Component: FilingPage },
          { path: 'payments', Component: PaymentsPage },
          { path: 'records', Component: TaxpayerRecords },
          { path: 'support', Component: TaxpayerSupport },
        ],
      },
      // Fallback route inside root layout
      { path: '*', Component: NotFound },
    ],
  },
]);
