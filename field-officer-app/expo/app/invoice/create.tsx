import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { Plus, Trash2, Check } from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import { useTheme } from '@/context/ThemeContext';
import { Invoice, InvoiceItem } from '@/types';

export default function CreateInvoiceScreen() {
  const { taxpayerId } = useLocalSearchParams<{ taxpayerId?: string }>();
  const router = useRouter();
  const { taxpayers, addInvoice, getTaxpayerById } = useApp();
  const { theme } = useTheme();

  const preselectedTaxpayer = taxpayerId ? getTaxpayerById(taxpayerId) : null;

  const [selectedTaxpayerId, setSelectedTaxpayerId] = useState(taxpayerId || '');
  const [items, setItems] = useState<InvoiceItem[]>([{ description: '', amount: 0 }]);
  const [dueDate, setDueDate] = useState('');
  const [showTaxpayerList, setShowTaxpayerList] = useState(false);

  const selectedTaxpayer = getTaxpayerById(selectedTaxpayerId);
  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

  const addItem = () => setItems([...items, { description: '', amount: 0 }]);
  const removeItem = (index: number) => {
    if (items.length > 1) setItems(items.filter((_, i) => i !== index));
  };
  const updateItem = (index: number, field: 'description' | 'amount', value: string) => {
    const updated = [...items];
    if (field === 'amount') updated[index].amount = parseFloat(value) || 0;
    else updated[index].description = value;
    setItems(updated);
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!selectedTaxpayerId) throw new Error('Please select a taxpayer');
      if (items.some(item => !item.description || item.amount <= 0)) throw new Error('Please fill all invoice items');
      if (!dueDate) throw new Error('Please set a due date');

      const invoice: Omit<Invoice, 'id' | 'invoiceNumber'> = {
        taxpayerId: selectedTaxpayerId,
        taxpayerName: selectedTaxpayer?.name || '',
        amount: totalAmount,
        dueDate,
        createdDate: new Date().toISOString().split('T')[0],
        status: 'unpaid',
        items,
      };
      return addInvoice(invoice);
    },
    onSuccess: (newInvoice) => {
      Alert.alert('Invoice Created', `Invoice Number: ${newInvoice.invoiceNumber}`, [
        { text: 'Done', onPress: () => router.back() },
      ]);
    },
    onError: (error: Error) => {
      Alert.alert('Error', error.message);
    },
  });

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
          <Text style={[styles.label, { color: theme.text }]}>Invoice Items *</Text>
          {items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemInputs}>
                <TextInput
                  style={[styles.itemDescription, inputStyle]}
                  placeholder="Description"
                  placeholderTextColor={theme.textLight}
                  value={item.description}
                  onChangeText={(v) => updateItem(index, 'description', v)}
                />
                <TextInput
                  style={[styles.itemAmount, inputStyle]}
                  placeholder="Amount"
                  placeholderTextColor={theme.textLight}
                  keyboardType="numeric"
                  value={item.amount > 0 ? item.amount.toString() : ''}
                  onChangeText={(v) => updateItem(index, 'amount', v)}
                />
              </View>
              {items.length > 1 && (
                <Pressable style={styles.removeBtn} onPress={() => removeItem(index)}>
                  <Trash2 size={18} color={theme.danger} />
                </Pressable>
              )}
            </View>
          ))}
          <Pressable style={[styles.addItemBtn, { borderColor: theme.primary }]} onPress={addItem}>
            <Plus size={18} color={theme.primary} />
            <Text style={[styles.addItemText, { color: theme.primary }]}>Add Item</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.text }]}>Due Date *</Text>
          <TextInput
            style={[styles.input, inputStyle]}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={theme.textLight}
            value={dueDate}
            onChangeText={setDueDate}
          />
        </View>

        <View style={[styles.totalCard, { backgroundColor: theme.primary + '12', borderColor: theme.primary + '30' }]}>
          <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>Total Amount</Text>
          <Text style={[styles.totalAmount, { color: theme.primary }]}>₦{totalAmount.toLocaleString()}</Text>
        </View>

        <Pressable
          style={[styles.submitBtn, { backgroundColor: theme.primary }, createMutation.isPending && styles.submitBtnDisabled]}
          onPress={() => createMutation.mutate()}
          disabled={createMutation.isPending}
        >
          <Text style={[styles.submitBtnText, { color: theme.white }]}>
            {createMutation.isPending ? 'Creating...' : 'Create Invoice'}
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
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  itemInputs: { flex: 1, flexDirection: 'row', gap: 10 },
  itemDescription: { flex: 2, borderRadius: 10, padding: 14, fontSize: 14, borderWidth: 1 },
  itemAmount: { flex: 1, borderRadius: 10, padding: 14, fontSize: 14, borderWidth: 1 },
  removeBtn: { padding: 10 },
  addItemBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: 10, borderWidth: 1, borderStyle: 'dashed' },
  addItemText: { fontSize: 14, fontWeight: '500' as const },
  totalCard: { borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 24, borderWidth: 1 },
  totalLabel: { fontSize: 13, marginBottom: 4 },
  totalAmount: { fontSize: 32, fontWeight: '700' as const },
  submitBtn: { borderRadius: 14, padding: 18, alignItems: 'center' },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { fontSize: 16, fontWeight: '600' as const },
});
