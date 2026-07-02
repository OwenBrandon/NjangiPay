import { View, Text, StyleSheet, ScrollView, Pressable, Share, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { CheckCircle, Receipt, Share2, Download, QrCode, AlertCircle } from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import { useTheme } from '@/context/ThemeContext';

export default function ReceiptScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { payments, confirmPayment, getTaxpayerById } = useApp();
  const { theme, isDarkMode } = useTheme();

  const payment = payments.find(p => p.id === id);
  const taxpayer = payment ? getTaxpayerById(payment.taxpayerId) : null;

  if (!payment) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.errorContainer}>
          <AlertCircle size={48} color={theme.danger} />
          <Text style={[styles.errorText, { color: theme.textSecondary }]}>Receipt not found</Text>
        </View>
      </View>
    );
  }

  const handleShare = async () => {
    const receiptText = `
PAYMENT RECEIPT
${payment.receiptNumber}

Taxpayer: ${payment.taxpayerName}
Amount: ₦${payment.amount.toLocaleString()}
Date: ${payment.date}
Time: ${payment.time}
Method: ${payment.method.toUpperCase()}
Status: ${payment.status.toUpperCase()}

Thank you for your payment.
    `.trim();

    try {
      await Share.share({ message: receiptText, title: 'Payment Receipt' });
    } catch (error) {
      console.log('Error sharing receipt:', error);
    }
  };

  const handleConfirm = () => {
    confirmPayment(payment.id);
  };

  const isConfirmed = payment.status === 'confirmed';
  const statusColor = isConfirmed ? theme.success : theme.warning;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[
          styles.receiptCard,
          {
            backgroundColor: theme.cardBg,
            borderColor: theme.glassBorder,
            borderWidth: 1,
            shadowOpacity: isDarkMode ? 0.3 : 0.08,
          },
        ]}>
          <View style={styles.header}>
            <View style={[styles.statusIcon, { backgroundColor: statusColor + '20' }]}>
              {isConfirmed ? (
                <CheckCircle size={32} color={theme.success} />
              ) : (
                <Receipt size={32} color={theme.warning} />
              )}
            </View>
            <Text style={[styles.statusTitle, { color: theme.text }]}>
              {isConfirmed ? 'Payment Confirmed' : 'Pending Confirmation'}
            </Text>
            <Text style={[styles.receiptNumber, { color: theme.textSecondary }]}>{payment.receiptNumber}</Text>
          </View>

          <View style={styles.amountSection}>
            <Text style={[styles.amountLabel, { color: theme.textSecondary }]}>Amount Paid</Text>
            <Text style={[styles.amount, { color: theme.success }]}>₦{payment.amount.toLocaleString()}</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Taxpayer</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>{payment.taxpayerName}</Text>
            </View>
            {taxpayer && (
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Business</Text>
                <Text style={[styles.detailValue, { color: theme.text }]}>{taxpayer.businessName}</Text>
              </View>
            )}
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Date</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>{payment.date}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Time</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>{payment.time}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Payment Method</Text>
              <Text style={[styles.methodBadge, { backgroundColor: theme.primary + '15', color: theme.primary }]}>
                {payment.method.toUpperCase()}
              </Text>
            </View>
            {payment.invoiceNumber && (
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Invoice</Text>
                <Text style={[styles.detailValue, { color: theme.text }]}>{payment.invoiceNumber}</Text>
              </View>
            )}
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.qrSection}>
            <View style={[styles.qrPlaceholder, { backgroundColor: theme.surfaceAlt }]}>
              <QrCode size={80} color={theme.textLight} />
            </View>
            <Text style={[styles.qrText, { color: theme.textSecondary }]}>Scan to verify receipt</Text>
          </View>
        </View>

        <View style={styles.actions}>
          {payment.status === 'pending' && (
            <Pressable style={[styles.actionBtn, { backgroundColor: theme.success }]} onPress={handleConfirm}>
              <CheckCircle size={20} color={theme.white} />
              <Text style={[styles.actionBtnText, { color: theme.white }]}>Confirm Payment</Text>
            </Pressable>
          )}
          <Pressable style={[styles.actionBtn, { backgroundColor: theme.primary + '15' }]} onPress={handleShare}>
            <Share2 size={20} color={theme.primary} />
            <Text style={[styles.actionBtnText, { color: theme.primary }]}>Share Receipt</Text>
          </Pressable>
          {Platform.OS !== 'web' && (
            <Pressable style={[styles.actionBtn, { backgroundColor: theme.surfaceAlt }]}>
              <Download size={20} color={theme.textSecondary} />
              <Text style={[styles.actionBtnText, { color: theme.textSecondary }]}>Download PDF</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { marginTop: 12, fontSize: 16 },
  scrollContent: { padding: 20 },
  receiptCard: {
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },
  header: { alignItems: 'center', marginBottom: 24 },
  statusIcon: { width: 64, height: 64, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  statusTitle: { fontSize: 18, fontWeight: '600' as const, marginBottom: 4 },
  receiptNumber: { fontSize: 14, fontFamily: 'monospace' },
  amountSection: { alignItems: 'center', marginBottom: 24 },
  amountLabel: { fontSize: 13, marginBottom: 4 },
  amount: { fontSize: 40, fontWeight: '700' as const },
  divider: { height: 1, marginVertical: 20 },
  detailsSection: { gap: 14 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailLabel: { fontSize: 14 },
  detailValue: { fontSize: 14, fontWeight: '500' as const },
  methodBadge: {
    fontSize: 14,
    fontWeight: '600' as const,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
  },
  qrSection: { alignItems: 'center', paddingTop: 8 },
  qrPlaceholder: { width: 120, height: 120, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  qrText: { fontSize: 12 },
  actions: { marginTop: 20, gap: 12 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 14, gap: 10 },
  actionBtnText: { fontSize: 16, fontWeight: '600' as const },
});
