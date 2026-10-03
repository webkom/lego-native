import { AttendanceButton } from '@/components/screens/event/attendance-button';
import { Text } from '@/components/ui/text';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import { AnimatePresence, MotiView } from 'moti';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

type EventActionBarProps = {
  canSignUp: boolean;
  turnstileToken: string | null;
  isUserSignedUp: boolean;
  eventId: string;
  scroll: number;
  isLoading: boolean;
  onSignUp: () => Promise<void> | undefined;
  onSignOff: () => void;
};

export function EventActionBar({
  canSignUp,
  turnstileToken,
  isUserSignedUp,
  eventId,
  scroll,
  isLoading,
  onSignUp,
  onSignOff,
}: EventActionBarProps) {
  const soundSource = require('@/assets/audio/confirmation-pop.mp3');
  const player = useAudioPlayer(soundSource);

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: false,
      interruptionMode: 'mixWithOthers',
    });
  }, []);

  const triggerFeedback = () => {
    player.seekTo(0);
    player.play();
  };

  if (!canSignUp && !isUserSignedUp) {
    return null;
  }

  return (
    <View className="pb-safe-offset-0 border-border bg-background absolute bottom-0 w-full border-t">
      <AnimatePresence>
        {!turnstileToken && (
          <View className="absolute -top-12 w-full items-center justify-center overflow-hidden">
            <MotiView
              key="verifying-message"
              className="bg-surface-tertiary rounded-full px-5 py-2"
              from={{ translateY: 100 }}
              animate={{ translateY: 0 }}
              exit={{ translateY: 100 }}>
              <MotiView
                key="verifying-message-content"
                className=" flex-row items-center gap-2"
                from={{ translateY: 100 }}
                animate={{ translateY: 0 }}
                exit={{ translateY: 100 }}
                transition={{
                  delay: 25,
                }}>
                <ActivityIndicator colorClassName="accent-primary" />
                <Text>Sjekker at du er et menneske</Text>
              </MotiView>
            </MotiView>
          </View>
        )}
      </AnimatePresence>
      <View className="px-5 py-4">
        <AttendanceButton
          isUserSignedUp={isUserSignedUp}
          eventId={eventId}
          scroll={scroll}
          isLoading={isLoading}
          onSignUp={() => onSignUp()?.then(() => triggerFeedback())}
          onSignOff={() => onSignOff()}
        />
      </View>
    </View>
  );
}
