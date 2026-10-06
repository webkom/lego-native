import { Button } from 'heroui-native';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

type UnregisterActionBarProps = {
  isLoading: boolean;
  onKeepRegistration: () => void;
  onSignOff: () => void;
};

export function UnregisterActionBar({
  isLoading,
  onKeepRegistration,
  onSignOff,
}: UnregisterActionBarProps) {
  return (
    <View className="border-border bg-background/95 w-full border-t px-6 py-4 backdrop-blur-md">
      <Button
        variant="primary"
        size="lg"
        className="h-14 w-full rounded-2xl shadow-md"
        onPress={onKeepRegistration}>
        <Text className="text-primary-foreground text-center text-base font-bold">
          Nei, jeg blir med likevel! 🎉
        </Text>
      </Button>

      <Button
        variant="ghost"
        size="md"
        className="mt-2.5 w-full"
        isDisabled={isLoading}
        onPress={onSignOff}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#ef4444" />
        ) : (
          <Text className="text-danger text-center text-sm font-medium">
            Ja, meld meg av likevel 💔
          </Text>
        )}
      </Button>
    </View>
  );
}
