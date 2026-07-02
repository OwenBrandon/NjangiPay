import { View, Text, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';
import { Stack } from 'expo-router';
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  FileQuestion, 
  Book,
  ChevronRight,
  ExternalLink
} from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

export default function HelpScreen() {
  const { theme, isDarkMode } = useTheme();

  const supportOptions = [
    {
      icon: Phone,
      label: 'Call Support',
      description: 'Speak with our support team',
      action: () => Linking.openURL('tel:+2348001234567'),
      color: theme.success,
    },
    {
      icon: Mail,
      label: 'Email Support',
      description: 'support@tax.gov.ng',
      action: () => Linking.openURL('mailto:support@tax.gov.ng'),
      color: theme.primary,
    },
    {
      icon: MessageCircle,
      label: 'Live Chat',
      description: 'Chat with us in real-time',
      action: () => {},
      color: theme.accent,
    },
  ];

  const faqs = [
    {
      question: 'How do I record a payment?',
      answer: 'Navigate to the Dashboard and tap "Payment" in Quick Actions, or go to the Payments tab and tap the + button.',
    },
    {
      question: 'Can I work offline?',
      answer: 'Yes! Enable Offline Mode in Settings. Your data will sync automatically when you reconnect to the internet.',
    },
    {
      question: 'How do I generate a receipt?',
      answer: 'After recording a payment, a receipt is automatically generated. You can view it from the Payments tab.',
    },
    {
      question: 'How do I scan a QR code?',
      answer: 'From the Search tab, tap the QR icon next to the search bar. Point your camera at the taxpayer\'s QR code.',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          headerTitle: 'Help Center',
          headerStyle: { backgroundColor: isDarkMode ? theme.background : theme.primary },
          headerTintColor: isDarkMode ? theme.text : '#FFFFFF',
        }} 
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Contact Support</Text>
          <View style={[styles.sectionCard, { backgroundColor: theme.cardBg, borderColor: theme.glassBorder }]}>
            {supportOptions.map((option, index) => (
              <Pressable
                key={option.label}
                style={[
                  styles.supportItem,
                  index < supportOptions.length - 1 && { 
                    borderBottomWidth: 1, 
                    borderBottomColor: theme.border 
                  }
                ]}
                onPress={option.action}
              >
                <View style={styles.supportLeft}>
                  <View style={[styles.iconBg, { backgroundColor: option.color + '15' }]}>
                    <option.icon size={22} color={option.color} />
                  </View>
                  <View style={styles.supportInfo}>
                    <Text style={[styles.supportLabel, { color: theme.text }]}>{option.label}</Text>
                    <Text style={[styles.supportDesc, { color: theme.textSecondary }]}>{option.description}</Text>
                  </View>
                </View>
                <ExternalLink size={18} color={theme.textLight} />
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Frequently Asked Questions</Text>
          <View style={[styles.sectionCard, { backgroundColor: theme.cardBg, borderColor: theme.glassBorder }]}>
            {faqs.map((faq, index) => (
              <View
                key={faq.question}
                style={[
                  styles.faqItem,
                  index < faqs.length - 1 && { 
                    borderBottomWidth: 1, 
                    borderBottomColor: theme.border 
                  }
                ]}
              >
                <View style={styles.faqHeader}>
                  <FileQuestion size={18} color={theme.primary} />
                  <Text style={[styles.faqQuestion, { color: theme.text }]}>{faq.question}</Text>
                </View>
                <Text style={[styles.faqAnswer, { color: theme.textSecondary }]}>{faq.answer}</Text>
              </View>
            ))}
          </View>
        </View>

        <Pressable style={[styles.guideButton, { backgroundColor: theme.primary + '10' }]}>
          <Book size={20} color={theme.primary} />
          <Text style={[styles.guideText, { color: theme.primary }]}>View User Guide</Text>
          <ChevronRight size={18} color={theme.primary} />
        </Pressable>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.8,
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  supportItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  supportLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBg: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  supportInfo: {
    flex: 1,
  },
  supportLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  supportDesc: {
    fontSize: 13,
  },
  faqItem: {
    padding: 16,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: '600' as const,
    flex: 1,
  },
  faqAnswer: {
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 28,
  },
  guideButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 10,
  },
  guideText: {
    fontSize: 16,
    fontWeight: '600' as const,
    flex: 1,
  },
});
