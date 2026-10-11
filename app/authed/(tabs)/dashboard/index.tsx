import { DashboardScreen } from '@/components/screens/dashboard/dashboard-screen';
import { useUser } from '@/lib/hooks/useUser';
import { Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

const DashboardPage = () => {
  const user = useUser();

  if (!user?.isWebkom) {
    return <Redirect href="/authed/(tabs)/events" />;
  }

  return (
    <View className="bg-background flex-1">
      <StatusBar style="auto" />
      <DashboardScreen />
    </View>
  );
};

export default DashboardPage;
