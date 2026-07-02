import { View, Text, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { User, MapPin, Phone, FileText, CreditCard, Calendar, AlertCircle } from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import { useTheme } from '@/context/ThemeContext';

export default function TaxpayerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getTaxpayerById, payments } = useApp();
  const { theme } = useTheme();

  const taxpayer = getTaxpayerById(id || '');
  const taxpayerPayments = payments.filter(p => p.taxpayerId === id);

  if (!taxpayer) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.errorContainer}>
          <AlertCircle size={48} color={theme.danger} />
          <Text style={[styles.errorText, { color: theme.textSecondary }]}>Taxpayer not found</Text>
        </View>
      </View>
    );
  }

  const handleCall = () => {
    Linking.openURL(`tel:${taxpayer.phone.replace(/\s/g, '')}`);
  };

  const getStatusColor = () => {
    switch (taxpayer.status) {
      case 'active':
        return theme.success;
      case 'defaulter':
        return theme.danger;
      case 'suspended':
        return theme.warning;
      default:
        return theme.textSecondary;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.profileSection, { backgroundColor: theme.primary }]}>
          <View style={[styles.avatarContainer, { backgroundColor: theme.accent + '20' }]}>
            <User size={40} color={theme.accent} />
          </View>
          <Text style={[styles.businessName, { color: theme.white }]}>{taxpayer.businessName}</Text>
          <Text style={[styles.ownerName, { color: theme.textLight }]}>{taxpayer.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '20' }]}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {taxpayer.status}
            </Text>
          </View>
        </View>

        <View style={[styles.infoCard, { backgroundColor: theme.cardBg, borderColor: theme.glassBorder, borderWidth: 1 }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Contact Information</Text>
          <View style={styles.infoRow}>
            <View style={[styles.infoIcon, { backgroundColor: theme.primary + '15' }]}>
              <MapPin size={18} color={theme.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Address</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>{taxpayer.address}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={[styles.infoIcon, { backgroundColor: theme.primary + '15' }]}>
              <Phone size={18} color={theme.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Phone</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>{taxpayer.phone}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={[styles.infoIcon, { backgroundColor: theme.primary + '15' }]}>
              <FileText size={18} color={theme.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Tax Type</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>{taxpayer.taxType}</Text>
            </View>
          </View>
          <View style={[styles.infoRow, { marginBottom: 0 }]}>
            <View style={[styles.infoIcon, { backgroundColor: theme.primary + '15' }]}>
              <Calendar size={18} color={theme.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Last Payment</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>
                {taxpayer.lastPaymentDate || 'Never'}
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.balanceCard, { backgroundColor: theme.danger + '12', borderColor: theme.danger + '30' }]}>
          <Text style={[styles.balanceLabel, { color: theme.textSecondary }]}>Outstanding Balance</Text>
          <Text style={[styles.balanceAmount, { color: theme.danger }]}>₦{taxpayer.outstandingAmount.toLocaleString()}</Text>
          <View style={[styles.qrCodeContainer, { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 }]}>
            <Text style={[styles.qrCodeLabel, { color: theme.textSecondary }]}>QR Code: {taxpayer.qrCode}</Text>
          </View>
        </View>

        <View style={styles.actionsCard}>
          <Pressable style={[styles.actionBtn, { backgroundColor: theme.primary }]} onPress={handleCall}>
            <Phone size={20} color={theme.white} />
            <Text style={[styles.actionBtnText, { color: theme.white }]}>Call Taxpayer</Text>
          </Pressable>
          <Pressable
            style={[styles.actionBtn, { backgroundColor: theme.primary + '15' }]}
            onPress={() => router.push({ pathname: '/payment/record', params: { taxpayerId: taxpayer.id } })}
          >
            <CreditCard size={20} color={theme.primary} />
            <Text style={[styles.actionBtnText, { color: theme.primary }]}>Record Payment</Text>
          </Pressable>
          <Pressable
            style={[styles.actionBtn, { backgroundColor: theme.primary + '15' }]}
            onPress={() => router.push({ pathname: '/invoice/create', params: { taxpayerId: taxpayer.id } })}
          >
            <FileText size={20} color={theme.primary} />
            <Text style={[styles.actionBtnText, { color: theme.primary }]}>Create Invoice</Text>
          </Pressable>
        </View>

        {taxpayerPayments.length > 0 && (
          <View style={[styles.historyCard, { backgroundColor: theme.cardBg, borderColor: theme.glassBorder, borderWidth: 1 }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Payment History</Text>
            {taxpayerPayments.map((payment, idx) => (
              <Pressable
                key={payment.id}
                style={[
                  styles.paymentItem,
                  idx < taxpayerPayments.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border },
                ]}
                onPress={() => router.push(`/receipt/${payment.id}`)}
              >
                <View style={styles.paymentInfo}>
                  <Text style={[styles.paymentAmount, { color: theme.text }]}>₦{payment.amount.toLocaleString()}</Text>
                  <Text style={[styles.paymentDate, { color: theme.textSecondary }]}>{payment.date} • {payment.time}</Text>
                </View>
                <View style={[
                  styles.paymentStatus,
                  { backgroundColor: payment.status === 'confirmed' ? theme.success + '20' : theme.warning + '20' },
                ]}>
                  <Text style={[
                    styles.paymentStatusText,
                    { color: payment.status === 'confirmed' ? theme.success : theme.warning },
                  ]}>
                    {payment.status}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  businessName: {
    fontSize: 22,
    fontWeight: '700' as const,
    marginBottom: 4,
    textAlign: 'center',
  },
  ownerName: {
    fontSize: 15,
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600' as const,
    textTransform: 'capitalize' as const,
  },
  infoCard: {
    margin: 16,
    borderRadius: 16,
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500' as const,
  },
  balanceCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
  },
  balanceLabel: {
    fontSize: 13,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700' as const,
    marginBottom: 12,
  },
  qrCodeContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  qrCodeLabel: {
    fontSize: 13,
    fontFamily: 'monospace',
  },
  actionsCard: {
    margin: 16,
    gap: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 10,
  },
  actionBtnText: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  historyCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
  },
  paymentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  paymentInfo: {
    gap: 2,
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  paymentDate: {
    fontSize: 12,
  },
  paymentStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  paymentStatusText: {
    fontSize: 12,
    fontWeight: '500' as const,
    textTransform: 'capitalize' as const,
  },
  bottomPadding: {
    height: 24,
  },
});
