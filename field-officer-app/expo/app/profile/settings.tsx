import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { 
  Bell, 
  Vibrate, 
  Volume2, 
  Download, 
  Wifi,
  Globe,
  RefreshCw
} from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useState } from 'react';

export default function SettingsScreen() {
  const { theme, isDarkMode } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);

  const settingsItems = [
    {
      title: 'Notifications',
      items: [
        { 
          icon: Bell, 
          label: 'Push Notifications', 
          description: 'Receive alerts for payments and tasks',
          value: notifications,
          onToggle: setNotifications
        },
        { 
          icon: Volume2, 
          label: 'Sound Effects', 
          description: 'Play sounds for actions',
          value: sounds,
          onToggle: setSounds
        },
        { 
          icon: Vibrate, 
          label: 'Vibration', 
          description: 'Haptic feedback for interactions',
          value: vibration,
          onToggle: setVibration
        },
      ],
    },
    {
      title: 'Data & Sync',
      items: [
        { 
          icon: RefreshCw, 
          label: 'Auto Sync', 
          description: 'Automatically sync data when online',
          value: autoSync,
          onToggle: setAutoSync
        },
        { 
          icon: Wifi, 
          label: 'Offline Mode', 
          description: 'Work without internet connection',
          value: offlineMode,
          onToggle: setOfflineMode
        },
      ],
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          headerTitle: 'App Settings',
          headerStyle: { backgroundColor: isDarkMode ? theme.background : theme.primary },
          headerTintColor: isDarkMode ? theme.text : '#FFFFFF',
        }} 
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {settingsItems.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>{section.title}</Text>
            <View style={[styles.sectionCard, { backgroundColor: theme.cardBg, borderColor: theme.glassBorder }]}>
              {section.items.map((item, index) => (
                <View
                  key={item.label}
                  style={[
                    styles.settingItem,
                    index < section.items.length - 1 && { 
                      borderBottomWidth: 1, 
                      borderBottomColor: theme.border 
                    }
                  ]}
                >
                  <View style={styles.settingLeft}>
                    <View style={[styles.iconBg, { backgroundColor: theme.primary + '15' }]}>
                      <item.icon size={20} color={theme.primary} />
                    </View>
                    <View style={styles.settingInfo}>
                      <Text style={[styles.settingLabel, { color: theme.text }]}>{item.label}</Text>
                      <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>{item.description}</Text>
                    </View>
                  </View>
                  <Switch
                    value={item.value}
                    onValueChange={item.onToggle}
                    trackColor={{ false: '#E2E8F0', true: theme.primary + '60' }}
                    thumbColor={item.value ? theme.primary : '#FFFFFF'}
                  />
                </View>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Actions</Text>
          <View style={[styles.sectionCard, { backgroundColor: theme.cardBg, borderColor: theme.glassBorder }]}>
            <Pressable style={styles.actionItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconBg, { backgroundColor: theme.success + '15' }]}>
                  <Download size={20} color={theme.success} />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingLabel, { color: theme.text }]}>Download Offline Data</Text>
                  <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>Cache taxpayer records locally</Text>
                </View>
              </View>
            </Pressable>
            <Pressable style={[styles.actionItem, { borderBottomWidth: 0 }]}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconBg, { backgroundColor: theme.warning + '15' }]}>
                  <Globe size={20} color={theme.warning} />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingLabel, { color: theme.text }]}>Change Language</Text>
                  <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>Currently: English</Text>
                </View>
              </View>
            </Pressable>
          </View>
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
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  iconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  settingDesc: {
    fontSize: 13,
  },
  actionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
});
