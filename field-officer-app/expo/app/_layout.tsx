import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from '@/context/AppContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { theme, isDarkMode } = useTheme();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen 
          name="taxpayer/[id]" 
          options={{ 
            headerShown: true,
            headerTitle: 'Taxpayer Details',
            headerStyle: { backgroundColor: isDarkMode ? theme.background : theme.primary },
            headerTintColor: isDarkMode ? theme.text : '#FFFFFF',
            presentation: 'card',
          }} 
        />
        <Stack.Screen 
          name="receipt/[id]" 
          options={{ 
            headerShown: true,
            headerTitle: 'Receipt',
            headerStyle: { backgroundColor: isDarkMode ? theme.background : theme.primary },
            headerTintColor: isDarkMode ? theme.text : '#FFFFFF',
            presentation: 'modal',
          }} 
        />
        <Stack.Screen 
          name="invoice/create" 
          options={{ 
            headerShown: true,
            headerTitle: 'Create Invoice',
            headerStyle: { backgroundColor: isDarkMode ? theme.background : theme.primary },
            headerTintColor: isDarkMode ? theme.text : '#FFFFFF',
            presentation: 'modal',
          }} 
        />
        <Stack.Screen 
          name="payment/record" 
          options={{ 
            headerShown: true,
            headerTitle: 'Record Payment',
            headerStyle: { backgroundColor: isDarkMode ? theme.background : theme.primary },
            headerTintColor: isDarkMode ? theme.text : '#FFFFFF',
            presentation: 'modal',
          }} 
        />
        <Stack.Screen 
          name="log/create" 
          options={{ 
            headerShown: true,
            headerTitle: 'New Visit Log',
            headerStyle: { backgroundColor: isDarkMode ? theme.background : theme.primary },
            headerTintColor: isDarkMode ? theme.text : '#FFFFFF',
            presentation: 'modal',
          }} 
        />
        <Stack.Screen 
          name="profile/settings" 
          options={{ 
            headerShown: true,
            presentation: 'card',
          }} 
        />
        <Stack.Screen 
          name="profile/help" 
          options={{ 
            headerShown: true,
            presentation: 'card',
          }} 
        />
        <Stack.Screen 
          name="profile/terms" 
          options={{ 
            headerShown: true,
            presentation: 'card',
          }} 
        />
      </Stack>
      <StatusBar style={isDarkMode ? 'light' : 'light'} />
    </>
  );
}

export default function RootLayout() {
  useEffect(() => {
    console.log('Field Officer App initialized');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <ThemeProvider>
          <RootLayoutNav />
        </ThemeProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}
