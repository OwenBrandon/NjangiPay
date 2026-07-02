import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, MapPin, Clock, CheckCircle, XCircle, AlertCircle, Calendar } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';
import { VisitLog } from '@/types';

export default function LogsScreen() {
  const router = useRouter();
  const { theme, isDarkMode } = useTheme();
  const { visitLogs } = useApp();

  const getOutcomeIcon = (outcome: VisitLog['outcome']) => {
    switch (outcome) {
      case 'successful':
        return <CheckCircle size={16} color={theme.success} />;
      case 'not-available':
        return <XCircle size={16} color={theme.warning} />;
      case 'refused':
        return <AlertCircle size={16} color={theme.danger} />;
      case 'rescheduled':
        return <Calendar size={16} color={theme.primary} />;
    }
  };

  const getOutcomeColor = (outcome: VisitLog['outcome']) => {
    switch (outcome) {
      case 'successful':
        return theme.success;
      case 'not-available':
        return theme.warning;
      case 'refused':
        return theme.danger;
      case 'rescheduled':
        return theme.primary;
    }
  };

  const getPurposeLabel = (purpose: VisitLog['purpose']) => {
    switch (purpose) {
      case 'collection':
        return 'Payment Collection';
      case 'inspection':
        return 'Site Inspection';
      case 'verification':
        return 'Document Verification';
      case 'follow-up':
        return 'Follow-up Visit';
    }
  };

  const renderVisitLog = ({ item }: { item: VisitLog }) => (
    <View style={[styles.logCard, { backgroundColor: theme.cardBg, borderColor: theme.glassBorder }]}>
      <View style={styles.logHeader}>
        <View style={[styles.purposeBadge, { backgroundColor: theme.primary + '15' }]}>
          <Text style={[styles.purposeText, { color: theme.primary }]}>
            {getPurposeLabel(item.purpose)}
          </Text>
        </View>
        <View style={styles.outcomeContainer}>
          {getOutcomeIcon(item.outcome)}
          <Text style={[styles.outcomeText, { color: getOutcomeColor(item.outcome) }]}>
            {item.outcome.replace('-', ' ')}
          </Text>
        </View>
      </View>

      <View style={styles.logInfo}>
        <Text style={[styles.taxpayerName, { color: theme.text }]}>{item.taxpayerName}</Text>
        <View style={styles.infoRow}>
          <MapPin size={14} color={theme.textSecondary} />
          <Text style={[styles.infoText, { color: theme.textSecondary }]}>{item.address}</Text>
        </View>
        <View style={styles.infoRow}>
          <Clock size={14} color={theme.textSecondary} />
          <Text style={[styles.infoText, { color: theme.textSecondary }]}>{item.date} at {item.time}</Text>
        </View>
      </View>

      {item.notes && (
        <View style={[styles.notesContainer, { backgroundColor: theme.surfaceAlt }]}>
          <Text style={[styles.notesLabel, { color: theme.textSecondary }]}>Notes</Text>
          <Text style={[styles.notesText, { color: theme.text }]}>{item.notes}</Text>
        </View>
      )}
    </View>
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
            <Text style={styles.title}>Visit Logs</Text>
            <Text style={styles.subtitle}>Inspection and visit records</Text>
          </View>
          <Pressable
            style={[styles.addButton, { backgroundColor: theme.inputBg }]}
            onPress={() => router.push('/log/create')}
          >
            <Plus size={22} color={theme.primary} />
          </Pressable>
        </View>

        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, isDarkMode && { backgroundColor: theme.primary + '20', borderColor: theme.primary + '40' }]}>
            <Text style={styles.summaryValue}>{visitLogs.length}</Text>
            <Text style={styles.summaryLabel}>Total Visits</Text>
          </View>
          <View style={[styles.summaryCard, isDarkMode && { backgroundColor: theme.success + '20', borderColor: theme.success + '40' }]}>
            <Text style={[styles.summaryValue, { color: isDarkMode ? theme.success : '#FFFFFF' }]}>
              {visitLogs.filter(l => l.outcome === 'successful').length}
            </Text>
            <Text style={styles.summaryLabel}>Successful</Text>
          </View>
          <View style={[styles.summaryCard, isDarkMode && { backgroundColor: theme.warning + '20', borderColor: theme.warning + '40' }]}>
            <Text style={[styles.summaryValue, { color: isDarkMode ? theme.warning : '#FFFFFF' }]}>
              {visitLogs.filter(l => l.outcome === 'not-available').length}
            </Text>
            <Text style={styles.summaryLabel}>Not Available</Text>
          </View>
        </View>

        <View style={[styles.listContainer, { backgroundColor: theme.background }]}>
          <FlatList
            data={visitLogs}
            renderItem={renderVisitLog}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <MapPin size={48} color={theme.textLight} />
                <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No visit logs yet</Text>
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
    height: 280,
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
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
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
  logCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  purposeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  purposeText: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  outcomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  outcomeText: {
    fontSize: 12,
    fontWeight: '500' as const,
    textTransform: 'capitalize' as const,
  },
  logInfo: {
    marginBottom: 12,
  },
  taxpayerName: {
    fontSize: 17,
    fontWeight: '600' as const,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    flex: 1,
  },
  notesContainer: {
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
  },
  notesLabel: {
    fontSize: 11,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 13,
    lineHeight: 20,
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
