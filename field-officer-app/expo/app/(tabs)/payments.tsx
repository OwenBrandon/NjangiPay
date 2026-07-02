import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Receipt, Filter, CreditCard, Banknote, Smartphone } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';
import { Payment } from '@/types';

type FilterType = 'all' | 'confirmed' | 'pending';

export default function PaymentsScreen() {
  const router = useRouter();
  const { theme, isDarkMode } = useTheme();
  const { payments } = useApp();
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredPayments = payments.filter((p) => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  const getMethodIcon = (method: Payment['method']) => {
    switch (method) {
      case 'cash':
        return <Banknote size={16} color={theme.textSecondary} />;
      case 'transfer':
        return <Smartphone size={16} color={theme.textSecondary} />;
      case 'pos':
        return <CreditCard size={16} color={theme.textSecondary} />;
    }
  };

  const renderPayment = ({ item }: { item: Payment }) => (
    <Pressable
      style={[styles.paymentCard, { backgroundColor: theme.cardBg, borderColor: theme.glassBorder }]}
      onPress={() => router.push(`/receipt/${item.id}`)}
    >
      <View style={styles.paymentHeader}>
        <View style={[styles.receiptIcon, { backgroundColor: theme.primary + '15' }]}>
          <Receipt size={20} color={theme.primary} />
        </View>
        <View style={styles.paymentInfo}>
          <Text style={[styles.taxpayerName, { color: theme.text }]}>{item.taxpayerName}</Text>
          <Text style={[styles.receiptNumber, { color: theme.textSecondary }]}>{item.receiptNumber}</Text>
        </View>
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.status === 'confirmed' ? theme.success + '20' : theme.warning + '20' }
        ]}>
          <Text style={[
            styles.statusText,
            { color: item.status === 'confirmed' ? theme.success : theme.warning }
          ]}>
            {item.status}
          </Text>
        </View>
      </View>

      <View style={[styles.paymentDetails, { borderTopColor: theme.border }]}>
        <View style={styles.detailItem}>
          <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Amount</Text>
          <Text style={[styles.detailValue, { color: theme.text }]}>₦{item.amount.toLocaleString()}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Method</Text>
          <View style={styles.methodContainer}>
            {getMethodIcon(item.method)}
            <Text style={[styles.methodText, { color: theme.text }]}>{item.method}</Text>
          </View>
        </View>
        <View style={styles.detailItem}>
          <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Time</Text>
          <Text style={[styles.detailValue, { color: theme.text }]}>{item.time}</Text>
        </View>
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
            <Text style={styles.title}>Payments</Text>
            <Text style={styles.subtitle}>Today&apos;s payment records</Text>
          </View>
          <Pressable
            style={[styles.addButton, { backgroundColor: theme.inputBg }]}
            onPress={() => router.push('/payment/record')}
          >
            <Plus size={22} color={theme.primary} />
          </Pressable>
        </View>

        <View style={styles.filterContainer}>
          <View style={styles.filterHeader}>
            <Filter size={16} color="rgba(255, 255, 255, 0.8)" />
            <Text style={styles.filterLabel}>Filter</Text>
          </View>
          <View style={styles.filterButtons}>
            {(['all', 'confirmed', 'pending'] as FilterType[]).map((f) => (
              <Pressable
                key={f}
                style={[
                  styles.filterBtn, 
                  filter === f && [styles.filterBtnActive, { backgroundColor: theme.inputBg }],
                  isDarkMode && filter !== f && { backgroundColor: theme.primary + '20', borderColor: theme.primary + '40' }
                ]}
                onPress={() => setFilter(f)}
              >
                <Text style={[
                  styles.filterBtnText, 
                  filter === f && { color: theme.primary }
                ]}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={[styles.listContainer, { backgroundColor: theme.background }]}>
          <FlatList
            data={filteredPayments}
            renderItem={renderPayment}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Receipt size={48} color={theme.textLight} />
                <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No payments found</Text>
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
    height: 240,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterBtnActive: {
    borderColor: 'transparent',
  },
  filterBtnText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: 'rgba(255, 255, 255, 0.9)',
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
  paymentCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  receiptIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  taxpayerName: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  receiptNumber: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500' as const,
    textTransform: 'capitalize' as const,
  },
  paymentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  detailItem: {
    gap: 4,
  },
  detailLabel: {
    fontSize: 11,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  methodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  methodText: {
    fontSize: 14,
    fontWeight: '500' as const,
    textTransform: 'capitalize' as const,
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
