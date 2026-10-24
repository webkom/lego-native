import { PushNotificationsProvider } from '@/components/PushNotificationsProvider';
import { HeroUINativeProvider } from 'heroui-native';
import { userAtom } from '@/lib/atoms/user-atom';
import { PixelifySans_400Regular, useFonts } from '@expo-google-fonts/pixelify-sans';
import { PortalProvider } from '@gorhom/portal';
import { PortalHost } from '@rn-primitives/portal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAtomValue } from 'jotai/react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useUniwind } from 'uniwind';
import '../global.css';

const queryClient = new QueryClient();

const Layout = () => {
  useFonts({
    PixelifySans_400Regular,
  });

  const user = useAtomValue(userAtom);
  const { theme } = useUniwind();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
        <GestureHandlerRootView className="bg-background flex-1">
          <SafeAreaProvider>
            <PortalProvider>
              <HeroUINativeProvider>
                <PushNotificationsProvider isLoggedIn={user?.id !== undefined}>
                  <StatusBar style="auto" />
                  <Stack
                    screenOptions={{
                      headerShown: false,
                    }}
                  />
                  <PortalHost />
                </PushNotificationsProvider>
              </HeroUINativeProvider>
            </PortalProvider>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default Layout;
