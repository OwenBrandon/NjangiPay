import { View, Text, StyleSheet, FlatList, Pressable, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { AlertTriangle, MapPin, Phone, Calendar, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';
import { Taxpayer } from '@/types';

export default function DefaultersScreen() {
  const router = useRouter();
  const { theme, isDarkMode } = useTheme();
  const { getDefaulters } = useApp();
  const defaulters = getDefaulters();

  const totalOutstanding = defaulters.reduce((sum, d) => sum + d.outstandingAmount, 0);

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone.replace(/\s/g, '')}`);
  };

  const getLastPaymentText = (date: string | null) => {
    if (!date) return 'Never paid';
    const lastPayment = new Date(date);
    const now = new Date();
    const diffMonths = Math.floor((now.getTime() - lastPayment.getTime()) / (1000 * 60 * 60 * 24 * 30));
    if (diffMonths < 1) return 'Less than a month ago';
    if (diffMonths === 1) return '1 month ago';
    return `${diffMonths} months ago`;
  };

  const renderDefaulter = ({ item }: { item: Taxpayer }) => (
    <Pressable
      style={[styles.defaulterCard, { backgroundColor: theme.cardBg, borderColor: theme.glassBorder, borderLeftColor: theme.danger }]}
      onPress={() => router.push(`/taxpayer/${item.id}`)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.defaulterInfo}>
          <Text style={[styles.businessName, { color: theme.text }]}>{item.businessName}</Text>
          <Text style={[styles.ownerName, { color: theme.textSecondary }]}>{item.name}</Text>
        </View>
        <View style={[styles.outstandingBadge, { backgroundColor: theme.danger + '15' }]}>
          <Text style={[styles.outstandingAmount, { color: theme.danger }]}>₦{item.outstandingAmount.toLocaleString()}</Text>
        </View>
      </View>

      <View style={[styles.cardDetails, { borderBottomColor: theme.border }]}>
        <View style={styles.detailRow}>
          <MapPin size={14} color={theme.textSecondary} />
          <Text style={[styles.detailText, { color: theme.textSecondary }]} numberOfLines={1}>{item.address}</Text>
        </View>
        <View style={styles.detailRow}>
          <Calendar size={14} color={theme.textSecondary} />
          <Text style={[styles.detailText, { color: theme.textSecondary }]}>Last payment: {getLastPaymentText(item.lastPaymentDate)}</Text>
        </View>
        <View style={styles.detailRow}>
          <AlertTriangle size={14} color={theme.danger} />
          <Text style={[styles.detailText, { color: theme.danger }]}>{item.taxType}</Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        <Pressable style={[styles.callBtn, { backgroundColor: theme.primary + '15' }]} onPress={() => handleCall(item.phone)}>
          <Phone size={16} color={theme.primary} />
          <Text style={[styles.callBtnText, { color: theme.primary }]}>Call</Text>
        </Pressable>
        <Pressable style={[styles.viewBtn, { backgroundColor: theme.primary }]} onPress={() => router.push(`/taxpayer/${item.id}`)}>
          <Text style={styles.viewBtnText}>View Details</Text>
          <ChevronRight size={16} color="#FFFFFF" />
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={isDarkMode ? ['#000000', '#1C1C1E', '#2C2C2E'] : ['#004C99', '#0066CC', '#3399FF']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Defaulters</Text>
            <Text style={styles.subtitle}>Zone A assigned defaulters</Text>
          </View>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: theme.inputBg, borderColor: theme.danger + '30' }]}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <View style={[styles.alertIconContainer, { backgroundColor: theme.danger + '15' }]}>
                <AlertTriangle size={22} color={theme.danger} />
              </View>
              <View style={styles.summaryText}>
                <Text style={[styles.summaryValue, { color: theme.text }]}>{defaulters.length}</Text>
                <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Defaulters</Text>
              </View>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <View style={styles.summaryItem}>
              <View style={styles.summaryText}>
                <Text style={[styles.summaryValue, { color: theme.text }]}>₦{totalOutstanding.toLocaleString()}</Text>
                <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Total Outstanding</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.listContainer, { backgroundColor: theme.background }]}>
          <FlatList
            data={defaulters}
            renderItem={renderDefaulter}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <AlertTriangle size={48} color={theme.textLight} />
                <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No defaulters in your zone</Text>
              </View>
            }
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    height: 260,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  summaryCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  alertIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryText: {
    gap: 2,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  summaryLabel: {
    fontSize: 12,
  },
  divider: {
    width: 1,
    height: 40,
    marginHorizontal: 16,
  },
  listContainer: {
    flex: 1,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  listContent: {
    padding: 20,
  },
  separator: {
    height: 12,
  },
  defaulterCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  defaulterInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: 17,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  ownerName: {
    fontSize: 13,
  },
  outstandingBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  outstandingAmount: {
    fontSize: 14,
    fontWeight: '700' as const,
  },
  cardDetails: {
    gap: 8,
    paddingBottom: 14,
    borderBottomWidth: 1,
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  callBtnText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  viewBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
  },
  viewBtnText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 15,
  },
});
