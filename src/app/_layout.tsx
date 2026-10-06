import * as Notifications from 'expo-notifications';
import { Stack, router } from 'expo-router';
import * as SplashScreenModule from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageToggle } from '@/components/LanguageToggle';
import { TasksProvider } from '@/context/TasksContext';
import { I18nProvider, useI18n } from '@/i18n/I18nContext';
import { ThemeProvider, useTheme } from '@/theme/ThemeContext';

// Mantiene el splash visible hasta que el layout está listo (se llama en scope de módulo).
SplashScreenModule.preventAutoHideAsync().catch(() => {});

function useNotificationObserver() {
  useEffect(() => {
    const redirect = (notification: Notifications.Notification) => {
      const url = notification.request.content.data?.url;
      if (typeof url !== 'string') return;
      const match = url.match(/^\/task\/(\d{4}-\d{2}-\d{2})$/);
      if (match) {
        router.push({ pathname: '/task/[date]', params: { date: match[1] } });
      } else {
        router.push('/');
      }
    };

    const lastResponse = Notifications.getLastNotificationResponse();
    if (lastResponse?.notification) {
      redirect(lastResponse.notification);
    }

    const subscription = Notifications.addNotificationResponseReceivedListener((response) =>
      redirect(response.notification),
    );
    return () => subscription.remove();
  }, []);
}

function AppStack() {
  const { colors, isDark } = useTheme();
  const { t } = useI18n();
  useNotificationObserver();

  useEffect(() => {
    SplashScreenModule.hideAsync().catch(() => {});
  }, []);

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.primary,
          headerTitleStyle: { color: colors.text },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: t('app.title'),
            headerRight: () => (
              <View style={styles.headerActions}>
                <LanguageToggle />
                <ThemeToggle />
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="task/[date]"
          options={{ title: t('header.dayTasks') }}
        />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </>
  );
}

const styles = StyleSheet.create({
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

export default function RootLayout() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <TasksProvider>
          <AppStack />
        </TasksProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
