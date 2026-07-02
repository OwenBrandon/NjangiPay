import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { Check, MapPin, FileSearch, CheckCircle, RefreshCw } from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import { useTheme } from '@/context/ThemeContext';
import { VisitLog } from '@/types';

type VisitPurpose = 'collection' | 'inspection' | 'verification' | 'follow-up';
type VisitOutcome = 'successful' | 'not-available' | 'refused' | 'rescheduled';

export default function CreateLogScreen() {
  const router = useRouter();
  const { taxpayers, addVisitLog, getTaxpayerById } = useApp();
  const { theme } = useTheme();

  const [selectedTaxpayerId, setSelectedTaxpayerId] = useState('');
  const [purpose, setPurpose] = useState<VisitPurpose>('collection');
  const [outcome, setOutcome] = useState<VisitOutcome>('successful');
  const [notes, setNotes] = useState('');
  const [showTaxpayerList, setShowTaxpayerList] = useState(false);

  const selectedTaxpayer = getTaxpayerById(selectedTaxpayerId);

  const purposeOptions: { value: VisitPurpose; label: string; icon: typeof MapPin }[] = [
    { value: 'collection', label: 'Collection', icon: MapPin },
    { value: 'inspection', label: 'Inspection', icon: FileSearch },
    { value: 'verification', label: 'Verification', icon: CheckCircle },
    { value: 'follow-up', label: 'Follow-up', icon: RefreshCw },
  ];

  const outcomeOptions: { value: VisitOutcome; label: string; color: string }[] = [
    { value: 'successful', label: 'Successful', color: theme.success },
    { value: 'not-available', label: 'Not Available', color: theme.warning },
    { value: 'refused', label: 'Refused', color: theme.danger },
    { value: 'rescheduled', label: 'Rescheduled', color: theme.primary },
  ];

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!selectedTaxpayerId) throw new Error('Please select a taxpayer');
      const now = new Date();
      const log: Omit<VisitLog, 'id'> = {
        taxpayerId: selectedTaxpayerId,
        taxpayerName: selectedTaxpayer?.name || '',
        address: selectedTaxpayer?.address || '',
        date: now.toISOString().split('T')[0],
        time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        purpose,
        outcome,
        notes,
      };
      return addVisitLog(log);
    },
    onSuccess: () => {
      Alert.alert('Visit Logged', 'Visit log has been saved successfully.', [
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
                  <Text style={[styles.taxpayerItemOwner, { color: theme.textSecondary }]}>{t.name} • {t.address}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.text }]}>Visit Purpose *</Text>
          <View style={styles.purposeGrid}>
            {purposeOptions.map((opt) => {
              const active = purpose === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  style={[
                    styles.purposeBtn,
                    {
                      backgroundColor: active ? theme.primary : theme.surface,
                      borderColor: active ? theme.primary : theme.border,
                    },
                  ]}
                  onPress={() => setPurpose(opt.value)}
                >
                  <opt.icon size={20} color={active ? theme.white : theme.textSecondary} />
                  <Text style={[styles.purposeBtnText, { color: active ? theme.white : theme.textSecondary }]}>
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.text }]}>Visit Outcome *</Text>
          <View style={styles.outcomeList}>
            {outcomeOptions.map((opt) => {
              const active = outcome === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  style={[
                    styles.outcomeBtn,
                    {
                      backgroundColor: active ? opt.color + '20' : theme.surface,
                      borderColor: active ? opt.color : theme.border,
                    },
                  ]}
                  onPress={() => setOutcome(opt.value)}
                >
                  {active && (
                    <View style={[styles.outcomeCheck, { backgroundColor: opt.color }]}>
                      <Check size={12} color={theme.white} />
                    </View>
                  )}
                  <Text style={[styles.outcomeBtnText, { color: active ? opt.color : theme.textSecondary }]}>
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.text }]}>Notes</Text>
          <TextInput
            style={[styles.notesInput, inputStyle]}
            placeholder="Add notes about the visit..."
            placeholderTextColor={theme.textLight}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        <Pressable
          style={[styles.submitBtn, { backgroundColor: theme.primary }, createMutation.isPending && styles.submitBtnDisabled]}
          onPress={() => createMutation.mutate()}
          disabled={createMutation.isPending}
        >
          <Text style={[styles.submitBtnText, { color: theme.white }]}>
            {createMutation.isPending ? 'Saving...' : 'Save Visit Log'}
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
  selectBtn: { borderRadius: 12, padding: 16, borderWidth: 1 },
  taxpayerList: { marginTop: 8, borderRadius: 12, borderWidth: 1, overflow: 'hidden', maxHeight: 250 },
  taxpayerItem: { padding: 14 },
  taxpayerItemName: { fontSize: 15, fontWeight: '500' as const, marginBottom: 2 },
  taxpayerItemOwner: { fontSize: 13 },
  purposeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  purposeBtn: { width: '48%', flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 12, padding: 14, borderWidth: 2 },
  purposeBtnText: { fontSize: 14, fontWeight: '500' as const },
  outcomeList: { gap: 10 },
  outcomeBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 12, padding: 16, borderWidth: 2 },
  outcomeCheck: { width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  outcomeBtnText: { fontSize: 15, fontWeight: '500' as const },
  notesInput: { borderRadius: 12, padding: 16, fontSize: 15, borderWidth: 1, minHeight: 120 },
  submitBtn: { borderRadius: 14, padding: 18, alignItems: 'center', marginTop: 8 },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { fontSize: 16, fontWeight: '600' as const },
});
