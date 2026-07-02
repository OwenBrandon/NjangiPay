import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { Banknote, Smartphone, CreditCard, Check } from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import { useTheme } from '@/context/ThemeContext';
import { Payment } from '@/types';

type PaymentMethod = 'cash' | 'transfer' | 'pos';

export default function RecordPaymentScreen() {
  const { taxpayerId } = useLocalSearchParams<{ taxpayerId?: string }>();
  const router = useRouter();
  const { taxpayers, addPayment, getTaxpayerById } = useApp();
  const { theme } = useTheme();

  const preselectedTaxpayer = taxpayerId ? getTaxpayerById(taxpayerId) : null;

  const [selectedTaxpayerId, setSelectedTaxpayerId] = useState(taxpayerId || '');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<PaymentMethod>('cash');
  const [showTaxpayerList, setShowTaxpayerList] = useState(false);

  const selectedTaxpayer = getTaxpayerById(selectedTaxpayerId);

  const recordMutation = useMutation({
    mutationFn: async () => {
      if (!selectedTaxpayerId || !amount) {
        throw new Error('Please fill all required fields');
      }

      const now = new Date();
      const payment: Omit<Payment, 'id' | 'receiptNumber'> = {
        taxpayerId: selectedTaxpayerId,
        taxpayerName: selectedTaxpayer?.name || '',
        amount: parseFloat(amount),
        date: now.toISOString().split('T')[0],
        time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        method,
        status: 'pending',
      };

      return addPayment(payment);
    },
    onSuccess: (newPayment) => {
      Alert.alert(
        'Payment Recorded',
        `Receipt: ${newPayment.receiptNumber}`,
        [
          { text: 'View Receipt', onPress: () => router.replace(`/receipt/${newPayment.id}`) },
          { text: 'Done', onPress: () => router.back() },
        ]
      );
    },
    onError: (error: Error) => {
      Alert.alert('Error', error.message);
    },
  });

  const methodOptions = [
    { value: 'cash' as const, label: 'Cash', icon: Banknote },
    { value: 'transfer' as const, label: 'Transfer', icon: Smartphone },
    { value: 'pos' as const, label: 'POS', icon: CreditCard },
  ];

  const inputStyle = {
    backgroundColor: theme.inputBg,
    color: theme.text,
    borderColor: theme.border,
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.text }]}>Select Taxpayer *</Text>
          {preselectedTaxpayer ? (
            <View style={[styles.selectedTaxpayer, { backgroundColor: theme.success + '15', borderColor: theme.success + '30' }]}>
              <View style={styles.taxpayerInfo}>
                <Text style={[styles.taxpayerName, { color: theme.text }]}>{preselectedTaxpayer.businessName}</Text>
                <Text style={[styles.taxpayerOwner, { color: theme.textSecondary }]}>{preselectedTaxpayer.name}</Text>
              </View>
              <View style={[styles.checkIcon, { backgroundColor: theme.success + '25' }]}>
                <Check size={18} color={theme.success} />
              </View>
            </View>
          ) : (
            <>
              <Pressable
                style={[styles.selectBtn, inputStyle]}
                onPress={() => setShowTaxpayerList(!showTaxpayerList)}
              >
                <Text style={{ fontSize: 16, color: selectedTaxpayer ? theme.text : theme.textSecondary, fontWeight: selectedTaxpayer ? '500' : '400' }}>
                  {selectedTaxpayer ? selectedTaxpayer.businessName : 'Choose a taxpayer'}
                </Text>
              </Pressable>
              {showTaxpayerList && (
                <View style={[styles.taxpayerList, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  {taxpayers.map((t, idx) => (
                    <Pressable
                      key={t.id}
                      style={[
                        styles.taxpayerItem,
                        idx < taxpayers.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.borderLight },
                        selectedTaxpayerId === t.id && { backgroundColor: theme.primary + '15' },
                      ]}
                      onPress={() => {
                        setSelectedTaxpayerId(t.id);
                        setShowTaxpayerList(false);
                      }}
                    >
                      <Text style={[styles.taxpayerItemName, { color: theme.text }]}>{t.businessName}</Text>
                      <Text style={[styles.taxpayerItemOwner, { color: theme.textSecondary }]}>{t.name}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.text }]}>Amount (₦) *</Text>
          <TextInput
            style={[styles.input, inputStyle]}
            placeholder="Enter amount"
            placeholderTextColor={theme.textLight}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          {selectedTaxpayer && (
            <Text style={[styles.helperText, { color: theme.textSecondary }]}>
              Outstanding: ₦{selectedTaxpayer.outstandingAmount.toLocaleString()}
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.text }]}>Payment Method *</Text>
          <View style={styles.methodGrid}>
            {methodOptions.map((opt) => {
              const active = method === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  style={[
                    styles.methodBtn,
                    {
                      backgroundColor: active ? theme.primary : theme.surface,
                      borderColor: active ? theme.primary : theme.border,
                    },
                  ]}
                  onPress={() => setMethod(opt.value)}
                >
                  <opt.icon size={24} color={active ? theme.white : theme.textSecondary} />
                  <Text style={[styles.methodBtnText, { color: active ? theme.white : theme.textSecondary }]}>
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {selectedTaxpayer && amount && (
          <View style={[styles.summaryCard, { backgroundColor: theme.cardBg, borderColor: theme.glassBorder }]}>
            <Text style={[styles.summaryTitle, { color: theme.text }]}>Payment Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Taxpayer</Text>
              <Text style={[styles.summaryValue, { color: theme.text }]}>{selectedTaxpayer.businessName}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Amount</Text>
              <Text style={[styles.summaryAmount, { color: theme.success }]}>₦{parseFloat(amount || '0').toLocaleString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Method</Text>
              <Text style={[styles.summaryValue, { color: theme.text }]}>{method.toUpperCase()}</Text>
            </View>
          </View>
        )}

        <Pressable
          style={[styles.submitBtn, { backgroundColor: theme.primary }, recordMutation.isPending && styles.submitBtnDisabled]}
          onPress={() => recordMutation.mutate()}
          disabled={recordMutation.isPending}
        >
          <Text style={[styles.submitBtnText, { color: theme.white }]}>
            {recordMutation.isPending ? 'Recording...' : 'Record Payment'}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  section: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600' as const, marginBottom: 10 },
  input: { borderRadius: 12, padding: 16, fontSize: 16, borderWidth: 1 },
  helperText: { marginTop: 8, fontSize: 13 },
  selectBtn: { borderRadius: 12, padding: 16, borderWidth: 1 },
  selectedTaxpayer: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, padding: 16, borderWidth: 1 },
  taxpayerInfo: { flex: 1 },
  taxpayerName: { fontSize: 16, fontWeight: '600' as const, marginBottom: 2 },
  taxpayerOwner: { fontSize: 13 },
  checkIcon: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  taxpayerList: { marginTop: 8, borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
  taxpayerItem: { padding: 14 },
  taxpayerItemName: { fontSize: 15, fontWeight: '500' as const, marginBottom: 2 },
  taxpayerItemOwner: { fontSize: 13 },
  methodGrid: { flexDirection: 'row', gap: 12 },
  methodBtn: { flex: 1, borderRadius: 14, padding: 16, alignItems: 'center', gap: 8, borderWidth: 2 },
  methodBtnText: { fontSize: 13, fontWeight: '500' as const },
  summaryCard: { borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 1 },
  summaryTitle: { fontSize: 16, fontWeight: '600' as const, marginBottom: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  summaryLabel: { fontSize: 14 },
  summaryValue: { fontSize: 14, fontWeight: '500' as const },
  summaryAmount: { fontSize: 18, fontWeight: '700' as const },
  submitBtn: { borderRadius: 14, padding: 18, alignItems: 'center' },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { fontSize: 16, fontWeight: '600' as const },
});
