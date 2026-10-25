import Icon from '@/components/icon';
import {
  UnregisterActionBar,
  UnregisterDeadlineNotice,
  UnregisterEventCard,
} from '@/components/screens/event/unregister-page';
import { useEventDetails } from '@/lib/hooks/useEventDetails';
import { isAfter } from 'date-fns';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import { router, useLocalSearchParams } from 'expo-router';
import { Typography } from 'heroui-native';
import { MotiView } from 'moti';
import { useEffect, useState } from 'react';
import { ScrollView, Alert as SystemAlert, TouchableOpacity, View } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';

const SafeAreaView = withUniwind(RNSafeAreaView);

const UnregisterPage = () => {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const {
    handleSignOff,
    event,
    waitingListPositions,
    isLoading: eventLoading,
  } = useEventDetails(id?.toString() ?? '');
  const [isLoading, setIsLoading] = useState(false);

  const soundSource = require('@/assets/audio/confirmation-pop.mp3');
  const player = useAudioPlayer(soundSource);

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: false,
      interruptionMode: 'mixWithOthers',
    });
  }, []);

  const unregistrationDeadline = event?.unregistrationDeadline
    ? new Date(event.unregistrationDeadline)
    : null;
  const isPastUnregisterDeadline =
    unregistrationDeadline && !isNaN(unregistrationDeadline.getTime())
      ? isAfter(new Date(), unregistrationDeadline)
      : false;

  const isWaitlisted = waitingListPositions !== undefined;

  const handleKeepRegistration = () => {
    try {
      player.seekTo(0);
      player.play();
    } catch {
      // Audio is best effort
    }
    router.back();
  };

  const signOff = () => {
    setIsLoading(true);
    handleSignOff()
      .then(() => {
        router.back();
      })
      .catch((error) => {
        const errorMessage =
          error instanceof Error
            ? error.message
            : typeof error === 'string'
              ? error
              : 'En feil oppstod under avregistrering. Vennligst prøv igjen senere.';
        SystemAlert.alert('Feil', errorMessage);
        router.back();
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <SafeAreaView className="bg-background flex-1">
      {/* Top Navigation Bar */}
      <View className="flex-row items-center justify-between px-5 py-3">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          className="bg-surface border-border/80 h-10 w-10 items-center justify-center rounded-full border shadow-sm">
          <Icon name="ArrowLeft" size={20} className="text-default-foreground" />
        </TouchableOpacity>
        <Typography type="body-sm" className="text-accent-foreground font-semibold">
          Avmelding
        </Typography>
        <View className="w-10" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}>
        <View className="flex-col items-center gap-6 px-6 pt-2">
          <View className="items-center">
            <Typography type="h2" className="mt-4 text-center font-bold">
              {isWaitlisted ? 'Vil du forlate ventelisten?' : 'Vil du melde deg av?'}
            </Typography>
          </View>

          {/* Event Preview Card */}

          {!eventLoading && (
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 300 }}
              className="flex w-full flex-col items-center gap-6">
              {event && <UnregisterEventCard event={event} isWaitlisted={isWaitlisted} />}

              {/* Deadline / Penalty Notice */}
              <UnregisterDeadlineNotice
                unregistrationDeadline={unregistrationDeadline}
                isPastUnregisterDeadline={isPastUnregisterDeadline}
                isWaitlisted={isWaitlisted}
              />
            </MotiView>
          )}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <UnregisterActionBar
        isLoading={isLoading}
        onKeepRegistration={handleKeepRegistration}
        onSignOff={signOff}
      />
    </SafeAreaView>
  );
};

export default UnregisterPage;
