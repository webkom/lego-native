import { Spinner } from 'heroui-native';
import { View } from 'react-native';

export function LoadingState() {
  return (
    <View className="bg-background flex-1 items-center justify-center">
      <Spinner size="lg" />
    </View>
  );
}
