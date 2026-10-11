import Header from '@/components/header';
import { DashboardScreen } from '@/components/screens/dashboard/dashboard-screen';
import { Text } from '@/components/ui/text';
import { useUser } from '@/lib/hooks/useUser';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button } from 'heroui-native';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DashboardPage = () => {
  const user = useUser();
  const router = useRouter();

  if (!user?.isWebkom) {
    return (
      <View className="bg-background flex-1">
        <Header className="bg-background" />
        <StatusBar style="auto" />
        <View className="flex-1 items-center justify-center p-8">
          <Text className="text-foreground text-center text-xl font-bold">Ingen tilgang</Text>
          <Text className="text-muted-foreground mt-2 text-center text-sm">
            Dette dashbordet er kun tilgjengelig for medlemmer av Webkom.
          </Text>
          <Button
            variant="secondary"
            className="mt-6"
            onPress={() => router.replace('/authed/(tabs)/events')}>
            Gå til arrangementer
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-background flex-1">
      <StatusBar style="auto" />
      <DashboardScreen />
    </View>
  );
};

export default DashboardPage;
