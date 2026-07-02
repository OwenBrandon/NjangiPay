import { View, Text, StyleSheet, ScrollView, Pressable, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useRef, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  TrendingUp, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Search,
  QrCode,
  Receipt,
  FileText,
  ClipboardList,
  ChevronRight
} from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';

export default function DashboardScreen() {
  const router = useRouter();
  const { theme, isDarkMode } = useTheme();
  const { stats, payments, visitLogs } = useApp();
  const progressAnim = useRef(new Animated.Value(0)).current;

  const progressPercentage = Math.min((stats.todayCollections / stats.dailyTarget) * 100, 100);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progressPercentage,
      duration: 1200,
      useNativeDriver: false,
    }).start();
  }, [progressPercentage, progressAnim]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const recentPayments = payments.slice(0, 3);
  const recentVisits = visitLogs.slice(0, 2);

  const quickActions = [
    { 
      icon: Search, 
      label: 'Search', 
      color: theme.primary,
      onPress: () => router.push('/search')
    },
    { 
      icon: QrCode, 
      label: 'Scan QR', 
      color: theme.primaryDark,
      onPress: () => router.push('/search')
    },
    { 
      icon: Receipt, 
      label: 'Payment', 
      color: theme.success,
      onPress: () => router.push('/payment/record')
    },
    { 
      icon: FileText, 
      label: 'Invoice', 
      color: theme.accent,
      onPress: () => router.push('/invoice/create')
    },
    { 
      icon: ClipboardList, 
      label: 'Log Visit', 
      color: theme.danger,
      onPress: () => router.push('/log/create')
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={[theme.gradientStart, theme.gradientMid, theme.gradientEnd]}
        style={styles.gradientBg}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.greeting, { color: theme.textSecondary }]}>{getGreeting()}</Text>
              <Text style={[styles.officerName, { color: theme.text }]}>Officer Adamu</Text>
            </View>
            <View style={[styles.dateBadge, { backgroundColor: theme.glass, borderColor: theme.glassBorder }]}>
              <Text style={[styles.dateText, { color: theme.primary }]}>{todayDate}</Text>
            </View>
          </View>

          <View style={styles.targetCard}>
            <LinearGradient
              colors={isDarkMode ? ['#0A2647', '#0A84FF'] : ['#004C99', '#0066CC']}
              style={styles.targetGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={[styles.targetCardInner, isDarkMode && { borderWidth: 1, borderColor: theme.primary + '30' }]}>
                <View style={styles.targetHeader}>
                  <View>
                    <Text style={styles.targetLabel}>Today&apos;s Collection</Text>
                    <Text style={styles.targetAmount}>{formatCurrency(stats.todayCollections)}</Text>
                  </View>
                  <View style={styles.targetBadge}>
                    <TrendingUp size={14} color="#FFF" />
                    <Text style={styles.targetBadgeText}>{progressPercentage.toFixed(0)}%</Text>
                  </View>
                </View>
                <View style={styles.progressContainer}>
                  <Animated.View style={[styles.progressBar, { width: progressWidth, backgroundColor: isDarkMode ? theme.primary : '#FFFFFF' }]} />
                </View>
                <View style={styles.targetFooter}>
                  <Text style={styles.targetSubtext}>
                    Target: {formatCurrency(stats.dailyTarget)}
                  </Text>
                  <Text style={styles.remainingText}>
                    {stats.todayCollections >= stats.dailyTarget 
                      ? '✓ Target reached!' 
                      : `${formatCurrency(stats.dailyTarget - stats.todayCollections)} to go`}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.quickActionsContainer}>
            <Text style={[styles.quickActionsTitle, { color: theme.textSecondary }]}>Quick Actions</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickActionsScroll}
            >
              {quickActions.map((action, index) => (
                <Pressable 
                  key={index} 
                  style={styles.quickActionItem}
                  onPress={action.onPress}
                  testID={`quick-action-${action.label.toLowerCase()}`}
                >
                  <View style={[styles.quickActionIcon, { backgroundColor: action.color + '15', borderColor: theme.glassBorder }]}>
                    <action.icon size={22} color={action.color} />
                  </View>
                  <Text style={[styles.quickActionLabel, { color: theme.textSecondary }]}>{action.label}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <View style={styles.statsContainer}>
            <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Today&apos;s Overview</Text>
            <View style={styles.statsGrid}>
              <Pressable 
                style={[styles.statCard, { backgroundColor: theme.cardBg, borderColor: theme.glassBorder }]} 
                onPress={() => router.push('/logs')}
                testID="stat-visits"
              >
                <View style={[styles.statIconContainer, { backgroundColor: theme.primary + '15' }]}>
                  <Users size={18} color={theme.primary} />
                </View>
                <Text style={[styles.statValue, { color: theme.text }]}>{stats.totalVisits}</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Visits</Text>
              </Pressable>

              <Pressable 
                style={[styles.statCard, { backgroundColor: theme.cardBg, borderColor: theme.glassBorder }]} 
                onPress={() => router.push('/payments')}
                testID="stat-collected"
              >
                <View style={[styles.statIconContainer, { backgroundColor: theme.success + '15' }]}>
                  <CheckCircle size={18} color={theme.success} />
                </View>
                <Text style={[styles.statValue, { color: theme.text }]}>{stats.successfulCollections}</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Collected</Text>
              </Pressable>

              <Pressable 
                style={[styles.statCard, { backgroundColor: theme.cardBg, borderColor: theme.glassBorder }]} 
                onPress={() => router.push('/payments')}
                testID="stat-pending"
              >
                <View style={[styles.statIconContainer, { backgroundColor: theme.warning + '15' }]}>
                  <Clock size={18} color={theme.warning} />
                </View>
                <Text style={[styles.statValue, { color: theme.text }]}>{stats.pendingPayments}</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Pending</Text>
              </Pressable>

              <Pressable 
                style={[styles.statCard, { backgroundColor: theme.cardBg, borderColor: theme.glassBorder }]} 
                onPress={() => router.push('/defaulters')}
                testID="stat-defaulters"
              >
                <View style={[styles.statIconContainer, { backgroundColor: theme.danger + '15' }]}>
                  <AlertTriangle size={18} color={theme.danger} />
                </View>
                <Text style={[styles.statValue, { color: theme.text }]}>{stats.defaultersCount}</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Defaulters</Text>
              </Pressable>
            </View>
          </View>

          <View style={[styles.section, { backgroundColor: theme.cardBg, borderColor: theme.glassBorder }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Payments</Text>
              <Pressable 
                onPress={() => router.push('/payments')} 
                style={styles.seeAllBtn}
                testID="see-all-payments"
              >
                <Text style={[styles.seeAllText, { color: theme.primary }]}>View All</Text>
                <ChevronRight size={16} color={theme.primary} />
              </Pressable>
            </View>
            {recentPayments.length > 0 ? (
              recentPayments.map((payment, index) => (
                <Pressable
                  key={payment.id}
                  style={[
                    styles.paymentItem,
                    { borderBottomColor: theme.border },
                    index === recentPayments.length - 1 && styles.lastItem
                  ]}
                  onPress={() => router.push(`/receipt/${payment.id}`)}
                  testID={`payment-item-${payment.id}`}
                >
                  <View style={styles.paymentLeft}>
                    <View style={[
                      styles.paymentIndicator,
                      { backgroundColor: payment.status === 'confirmed' ? theme.success : theme.warning }
                    ]} />
                    <View style={styles.paymentInfo}>
                      <Text style={[styles.paymentName, { color: theme.text }]} numberOfLines={1}>{payment.taxpayerName}</Text>
                      <Text style={[styles.paymentTime, { color: theme.textSecondary }]}>{payment.time}</Text>
                    </View>
                  </View>
                  <View style={styles.paymentRight}>
                    <Text style={[styles.paymentAmount, { color: theme.text }]}>{formatCurrency(payment.amount)}</Text>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: payment.status === 'confirmed' ? theme.success + '15' : theme.warning + '15' }
                    ]}>
                      <Text style={[
                        styles.statusText,
                        { color: payment.status === 'confirmed' ? theme.success : theme.warning }
                      ]}>
                        {payment.status}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyText, { color: theme.textLight }]}>No payments recorded today</Text>
              </View>
            )}
          </View>

          <View style={[styles.section, { backgroundColor: theme.cardBg, borderColor: theme.glassBorder }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Visits</Text>
              <Pressable 
                onPress={() => router.push('/logs')} 
                style={styles.seeAllBtn}
                testID="see-all-visits"
              >
                <Text style={[styles.seeAllText, { color: theme.primary }]}>View All</Text>
                <ChevronRight size={16} color={theme.primary} />
              </Pressable>
            </View>
            {recentVisits.length > 0 ? (
              recentVisits.map((visit, index) => (
                <View 
                  key={visit.id} 
                  style={[
                    styles.visitItem,
                    { borderBottomColor: theme.border },
                    index === recentVisits.length - 1 && styles.lastItem
                  ]}
                >
                  <View style={styles.visitLeft}>
                    <View style={[
                      styles.visitIndicator,
                      { backgroundColor: visit.outcome === 'successful' ? theme.success : theme.warning }
                    ]} />
                    <View style={styles.visitInfo}>
                      <Text style={[styles.visitName, { color: theme.text }]} numberOfLines={1}>{visit.taxpayerName}</Text>
                      <Text style={[styles.visitAddress, { color: theme.textSecondary }]} numberOfLines={1}>{visit.address}</Text>
                      <View style={styles.visitMeta}>
                        <Text style={[styles.visitTime, { color: theme.textLight }]}>{visit.time}</Text>
                        <View style={[styles.visitDot, { backgroundColor: theme.textLight }]} />
                        <Text style={[styles.visitPurpose, { color: theme.textLight }]}>{visit.purpose}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={[
                    styles.outcomeBadge,
                    { backgroundColor: visit.outcome === 'successful' ? theme.success + '15' : theme.warning + '15' }
                  ]}>
                    <Text style={[
                      styles.outcomeText,
                      { color: visit.outcome === 'successful' ? theme.success : theme.warning }
                    ]}>
                      {visit.outcome === 'successful' ? 'Success' : 'Follow-up'}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyText, { color: theme.textLight }]}>No visits logged today</Text>
              </View>
            )}
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBg: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 14,
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  officerName: {
    fontSize: 24,
    fontWeight: '700' as const,
    letterSpacing: -0.4,
  },
  dateBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  targetCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 6,
  },
  targetGradient: {
    borderRadius: 16,
  },
  targetCardInner: {
    padding: 20,
    borderRadius: 16,
  },
  targetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  targetLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 6,
    fontWeight: '500' as const,
    letterSpacing: 0.3,
  },
  targetAmount: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    letterSpacing: -0.8,
  },
  targetBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  targetBadgeText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  progressContainer: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 14,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  targetFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  targetSubtext: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500' as const,
  },
  remainingText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600' as const,
  },
  quickActionsContainer: {
    marginBottom: 24,
  },
  quickActionsTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    marginBottom: 14,
    paddingHorizontal: 20,
  },
  quickActionsScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  quickActionItem: {
    alignItems: 'center',
    width: 72,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700' as const,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500' as const,
  },
  section: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600' as const,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  paymentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  lastItem: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIndicator: {
    width: 4,
    height: 36,
    borderRadius: 2,
    marginRight: 12,
  },
  paymentInfo: {
    flex: 1,
    marginRight: 12,
  },
  paymentName: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  paymentTime: {
    fontSize: 12,
  },
  paymentRight: {
    alignItems: 'flex-end',
  },
  paymentAmount: {
    fontSize: 15,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.3,
  },
  visitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  visitLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  visitIndicator: {
    width: 4,
    height: 48,
    borderRadius: 2,
    marginRight: 12,
  },
  visitInfo: {
    flex: 1,
    marginRight: 12,
  },
  visitName: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  visitAddress: {
    fontSize: 13,
    marginBottom: 6,
  },
  visitMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  visitTime: {
    fontSize: 11,
  },
  visitDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    marginHorizontal: 6,
  },
  visitPurpose: {
    fontSize: 11,
    textTransform: 'capitalize' as const,
  },
  outcomeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  outcomeText: {
    fontSize: 10,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.3,
  },
  emptyState: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
  },
  bottomPadding: {
    height: 10,
  },
});
