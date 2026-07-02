import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Pressable, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, ScanLine, User, MapPin, Phone, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';
import { Taxpayer } from '@/types';

export default function SearchScreen() {
  const router = useRouter();
  const { theme, isDarkMode } = useTheme();
  const { taxpayers, searchTaxpayers } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Taxpayer[]>(taxpayers);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setResults(taxpayers);
    } else {
      setResults(searchTaxpayers(query));
    }
  }, [taxpayers, searchTaxpayers]);

  const handleQRScan = () => {
    if (Platform.OS === 'web') {
      Alert.alert('QR Scanner', 'QR scanning is not available on web. Please use the mobile app.');
      return;
    }
    Alert.alert('QR Scanner', 'QR scanner would open here. Scan taxpayer QR code to find their record.');
  };

  const getStatusColor = (status: Taxpayer['status']) => {
    switch (status) {
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

  const renderTaxpayer = ({ item }: { item: Taxpayer }) => (
    <Pressable
      style={[styles.taxpayerCard, { backgroundColor: theme.cardBg, borderColor: theme.glassBorder }]}
      onPress={() => router.push(`/taxpayer/${item.id}`)}
    >
      <View style={styles.taxpayerHeader}>
        <View style={[styles.avatarContainer, { backgroundColor: theme.primary + '15' }]}>
          <User size={24} color={theme.primary} />
        </View>
        <View style={styles.taxpayerInfo}>
          <Text style={[styles.businessName, { color: theme.text }]}>{item.businessName}</Text>
          <Text style={[styles.ownerName, { color: theme.textSecondary }]}>{item.name}</Text>
        </View>
        <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
      </View>

      <View style={[styles.taxpayerDetails, { borderBottomColor: theme.border }]}>
        <View style={styles.detailRow}>
          <MapPin size={14} color={theme.textSecondary} />
          <Text style={[styles.detailText, { color: theme.textSecondary }]}>{item.address}</Text>
        </View>
        <View style={styles.detailRow}>
          <Phone size={14} color={theme.textSecondary} />
          <Text style={[styles.detailText, { color: theme.textSecondary }]}>{item.phone}</Text>
        </View>
      </View>

      <View style={styles.taxpayerFooter}>
        <View style={styles.outstandingContainer}>
          <Text style={[styles.outstandingLabel, { color: theme.textSecondary }]}>Outstanding</Text>
          <Text style={[styles.outstandingAmount, { color: theme.danger }]}>₦{item.outstandingAmount.toLocaleString()}</Text>
        </View>
        <View style={[styles.viewBtn, { backgroundColor: theme.primary + '15' }]}>
          <Text style={[styles.viewBtnText, { color: theme.primary }]}>View</Text>
          <ChevronRight size={16} color={theme.primary} />
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
          <Text style={styles.title}>Search Taxpayer</Text>
          <Text style={styles.subtitle}>Find by name, business, or QR code</Text>
        </View>

        <View style={styles.searchContainer}>
          <View style={[styles.searchInputContainer, { backgroundColor: theme.inputBg }]}>
            <Search size={20} color={theme.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: theme.text }]}
              placeholder="Search taxpayers..."
              placeholderTextColor={theme.textSecondary}
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>
          <Pressable style={[styles.qrButton, isDarkMode && { backgroundColor: theme.primary + '30', borderColor: theme.primary + '50' }]} onPress={handleQRScan}>
            <ScanLine size={24} color={isDarkMode ? theme.primary : '#FFFFFF'} />
          </Pressable>
        </View>

        <View style={[styles.resultsContainer, { backgroundColor: theme.background }]}>
          <View style={styles.resultsHeader}>
            <Text style={[styles.resultsCount, { color: theme.textSecondary }]}>{results.length} taxpayer{results.length !== 1 ? 's' : ''} found</Text>
          </View>

          <FlatList
            data={results}
            renderItem={renderTaxpayer}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
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
    height: 220,
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
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    height: 52,
    fontSize: 16,
  },
  qrButton: {
    width: 52,
    height: 52,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  resultsContainer: {
    flex: 1,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  resultsHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  separator: {
    height: 12,
  },
  taxpayerCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  taxpayerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  taxpayerInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  ownerName: {
    fontSize: 13,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  taxpayerDetails: {
    gap: 8,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 13,
  },
  taxpayerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  outstandingContainer: {
    gap: 2,
  },
  outstandingLabel: {
    fontSize: 11,
  },
  outstandingAmount: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  viewBtnText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
});
