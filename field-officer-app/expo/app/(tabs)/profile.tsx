import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Moon, 
  Sun,
  ChevronRight,
  Bell,
  HelpCircle,
  FileText,
  LogOut,
  Settings,
  Award,
  Calendar,
  Target
} from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';


export default function ProfileScreen() {
  const router = useRouter();
  const { theme, isDarkMode, toggleTheme } = useTheme();


  const officerData = {
    name: 'Adamu Mohammed',
    email: 'adamu.mohammed@tax.gov.ng',
    phone: '+234 803 456 7890',
    employeeId: 'FO-2024-0892',
    zone: 'Zone A - Central District',
    department: 'Field Operations',
    joinDate: 'March 2022',
    rank: 'Senior Field Officer',
  };

  const performanceStats = [
    { label: 'This Month', value: '₦2.4M', icon: Target, color: theme.success },
    { label: 'Total Visits', value: '156', icon: MapPin, color: theme.primary },
    { label: 'Rating', value: '4.8★', icon: Award, color: theme.warning },
  ];

  const menuItems = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Edit Profile', route: '/profile/edit' },
        { icon: Bell, label: 'Notifications', route: '/profile/notifications' },
        { icon: Shield, label: 'Security', route: '/profile/security' },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: Settings, label: 'App Settings', route: '/profile/settings' },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help Center', route: '/profile/help' },
        { icon: FileText, label: 'Terms & Privacy', route: '/profile/terms' },
      ],
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={isDarkMode ? ['#000000', '#1C1C1E'] : ['#004C99', '#0066CC']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Profile</Text>
          </View>

          <View style={styles.profileSection}>
            <View style={[styles.avatarContainer, { borderColor: isDarkMode ? theme.primary : '#FFFFFF' }]}>
              <LinearGradient
                colors={isDarkMode ? [theme.primary, theme.primaryLight] : ['#FFFFFF', '#F2F2F7']}
                style={styles.avatarGradient}
              >
                <Text style={[styles.avatarText, { color: isDarkMode ? '#FFFFFF' : theme.primary }]}>
                  {officerData.name.split(' ').map(n => n[0]).join('')}
                </Text>
              </LinearGradient>
            </View>
            <Text style={styles.officerName}>{officerData.name}</Text>
            <View style={styles.badgeContainer}>
              <View style={[styles.rankBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <Shield size={12} color="#FFFFFF" />
                <Text style={styles.rankText}>{officerData.rank}</Text>
              </View>
            </View>
            <Text style={styles.employeeId}>{officerData.employeeId}</Text>
          </View>

          <View style={[styles.statsContainer, { backgroundColor: theme.cardBg, borderColor: theme.glassBorder }]}>
            {performanceStats.map((stat, index) => (
              <View 
                key={stat.label} 
                style={[
                  styles.statItem,
                  index < performanceStats.length - 1 && { 
                    borderRightWidth: 1, 
                    borderRightColor: theme.border 
                  }
                ]}
              >
                <View style={[styles.statIconBg, { backgroundColor: stat.color + '15' }]}>
                  <stat.icon size={18} color={stat.color} />
                </View>
                <Text style={[styles.statValue, { color: theme.text }]}>{stat.value}</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{stat.label}</Text>
              </View>
            ))}
          </View>

          <View style={[styles.infoCard, { backgroundColor: theme.cardBg, borderColor: theme.glassBorder }]}>
            <Text style={[styles.infoTitle, { color: theme.text }]}>Officer Information</Text>
            
            <View style={styles.infoRow}>
              <View style={[styles.infoIconBg, { backgroundColor: theme.primary + '15' }]}>
                <Mail size={16} color={theme.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Email</Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>{officerData.email}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={[styles.infoIconBg, { backgroundColor: theme.success + '15' }]}>
                <Phone size={16} color={theme.success} />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Phone</Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>{officerData.phone}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={[styles.infoIconBg, { backgroundColor: theme.warning + '15' }]}>
                <MapPin size={16} color={theme.warning} />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Assigned Zone</Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>{officerData.zone}</Text>
              </View>
            </View>

            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <View style={[styles.infoIconBg, { backgroundColor: theme.accent + '15' }]}>
                <Calendar size={16} color={theme.accent} />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Joined</Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>{officerData.joinDate}</Text>
              </View>
            </View>
          </View>

          <View style={[styles.themeCard, { backgroundColor: theme.cardBg, borderColor: theme.glassBorder }]}>
            <View style={styles.themeRow}>
              <View style={styles.themeLeft}>
                <View style={[styles.themeIconBg, { backgroundColor: isDarkMode ? theme.primary + '15' : theme.warning + '15' }]}>
                  {isDarkMode ? (
                    <Moon size={20} color={theme.primary} />
                  ) : (
                    <Sun size={20} color={theme.warning} />
                  )}
                </View>
                <View>
                  <Text style={[styles.themeLabel, { color: theme.text }]}>Dark Mode</Text>
                  <Text style={[styles.themeDesc, { color: theme.textSecondary }]}>
                    {isDarkMode ? 'Currently enabled' : 'Currently disabled'}
                  </Text>
                </View>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: theme.borderLight, true: theme.primary + '60' }}
                thumbColor={isDarkMode ? theme.primary : '#FFFFFF'}
              />
            </View>
          </View>

          {menuItems.map((section) => (
            <View 
              key={section.title} 
              style={[styles.menuSection, { backgroundColor: theme.cardBg, borderColor: theme.glassBorder }]}
            >
              <Text style={[styles.menuSectionTitle, { color: theme.textSecondary }]}>{section.title}</Text>
              {section.items.map((item, index) => (
                <Pressable
                  key={item.label}
                  style={[
                    styles.menuItem,
                    index < section.items.length - 1 && { 
                      borderBottomWidth: 1, 
                      borderBottomColor: theme.border 
                    }
                  ]}
                  onPress={() => router.push(item.route as never)}
                >
                  <View style={styles.menuItemLeft}>
                    <View style={[styles.menuIconBg, { backgroundColor: theme.primary + '10' }]}>
                      <item.icon size={18} color={theme.primary} />
                    </View>
                    <Text style={[styles.menuItemLabel, { color: theme.text }]}>{item.label}</Text>
                  </View>
                  <ChevronRight size={20} color={theme.textLight} />
                </Pressable>
              ))}
            </View>
          ))}

          <Pressable style={[styles.logoutButton, { backgroundColor: theme.danger + '10' }]}>
            <LogOut size={20} color={theme.danger} />
            <Text style={[styles.logoutText, { color: theme.danger }]}>Log Out</Text>
          </Pressable>

          <Text style={[styles.versionText, { color: theme.textLight }]}>Version 1.0.0</Text>

          <View style={styles.bottomPadding} />
        </ScrollView>
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700' as const,
  },
  officerName: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  rankText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  employeeId: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  statIconBg: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500' as const,
  },
  infoCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  infoIconBg: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
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
  themeCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  themeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  themeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  themeIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  themeDesc: {
    fontSize: 13,
    marginTop: 2,
  },
  menuSection: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 6,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  menuSectionTitle: {
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  menuIconBg: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemLabel: {
    fontSize: 15,
    fontWeight: '500' as const,
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 10,
    marginBottom: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    marginBottom: 10,
  },
  bottomPadding: {
    height: 20,
  },
});
