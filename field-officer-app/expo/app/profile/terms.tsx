import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function TermsScreen() {
  const { theme, isDarkMode } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          headerTitle: 'Terms & Privacy',
          headerStyle: { backgroundColor: isDarkMode ? theme.background : theme.primary },
          headerTintColor: isDarkMode ? theme.text : '#FFFFFF',
        }} 
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.glassBorder }]}>
          <Text style={[styles.title, { color: theme.text }]}>Terms of Service</Text>
          <Text style={[styles.lastUpdated, { color: theme.textSecondary }]}>Last updated: January 2025</Text>
          
          <Text style={[styles.sectionTitle, { color: theme.text }]}>1. Acceptance of Terms</Text>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            By accessing and using this Field Officer application, you accept and agree to be bound by the terms and provisions of this agreement.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>2. Use of Service</Text>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            This application is provided exclusively for authorized field officers of the tax collection authority. Unauthorized use is strictly prohibited.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>3. Data Collection</Text>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            The app collects location data, payment records, and visit logs as part of normal operations. All data is securely stored and used only for official purposes.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>4. User Responsibilities</Text>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            Users are responsible for maintaining the confidentiality of their login credentials and for all activities that occur under their account.
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.glassBorder }]}>
          <Text style={[styles.title, { color: theme.text }]}>Privacy Policy</Text>
          <Text style={[styles.lastUpdated, { color: theme.textSecondary }]}>Last updated: January 2025</Text>
          
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Information We Collect</Text>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            • Personal identification information{'\n'}
            • Location data during field operations{'\n'}
            • Payment transaction records{'\n'}
            • Visit logs and inspection notes
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>How We Use Your Information</Text>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            We use the collected information to facilitate tax collection operations, generate reports, and improve service delivery.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>Data Security</Text>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            We implement appropriate security measures to protect your personal information against unauthorized access, alteration, or disclosure.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  lastUpdated: {
    fontSize: 13,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
  },
});
