import { AttendanceButton } from '@/components/screens/event/attendance-button';
import { Text } from '@/components/ui/text';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import { BlurView as ExpoBlurView } from 'expo-blur';
import { useTheme } from 'expo-router/react-navigation';
import { AnimatePresence, MotiView } from 'moti';
import { RefObject, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { withUniwind } from 'uniwind';

const BlurView = withUniwind(ExpoBlurView);

type EventActionBarProps = {
  canSignOff: boolean;
  canSignUp: boolean;
  turnstileToken: string | null;
  isUserSignedUp: boolean;
  eventId: string;
  scroll: number;
  isLoading: boolean;
  blurTarget?: RefObject<View | null>;
  onSignUp: () => Promise<void> | undefined;
  onSignOff: () => void;
};

export function EventActionBar({
  canSignUp,
  canSignOff,
  turnstileToken,
  isUserSignedUp,
  eventId,
  scroll,
  isLoading,
  blurTarget,
  onSignUp,
  onSignOff,
}: EventActionBarProps) {
  const theme = useTheme();
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
    <View className="absolute inset-x-0 bottom-0">
      <AnimatePresence>
        {!turnstileToken && !isUserSignedUp && (
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
      <BlurView
        intensity={80}
        tint={theme.dark ? 'dark' : 'light'}
        blurTarget={blurTarget}
        blurMethod="dimezisBlurView"
        className="pb-safe-offset-0 border-border bg-background/70 w-full border-t px-5 py-4">
        <AttendanceButton
          isUserSignedUp={isUserSignedUp}
          canSignOff={canSignOff}
          scroll={scroll}
          isLoading={isLoading}
          onSignUp={() => onSignUp()?.then(() => triggerFeedback())}
          onSignOff={() => onSignOff()}
        />
      </BlurView>
    </View>
  );
}
