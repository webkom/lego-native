import Icon from '@/components/icon';
import { useEventDetails } from '@/hooks/useEventDetails';
import { EventTypeConfig } from '@/lib/types/eventColors';
import { format, isAfter } from 'date-fns';
import { nb } from 'date-fns/locale';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Button, Card, Chip, Typography } from 'heroui-native';
import { AnimatePresence, MotiView } from 'moti';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert as SystemAlert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';
import { withUniwind } from 'uniwind';

const SafeAreaView = withUniwind(RNSafeAreaView);

const COOKIE_PATH =
  'M126.828 14.2757C128.574 12.8498 129.448 12.1369 130.245 11.5351C149.03 -2.64515 174.97 -2.64515 193.755 11.5351C194.552 12.1369 195.425 12.8498 197.172 14.2757C197.952 14.9121 198.342 15.2304 198.727 15.5333C207.567 22.4788 218.406 26.4148 229.652 26.7636C230.143 26.7788 230.647 26.7851 231.654 26.7976C233.911 26.8255 235.039 26.8395 236.037 26.8898C259.563 28.0742 279.435 44.7107 284.689 67.6205C284.912 68.5929 285.121 69.6991 285.541 71.9115C285.728 72.8992 285.822 73.393 285.922 73.8723C288.219 84.8623 293.986 94.8285 302.377 102.308C302.743 102.635 303.125 102.963 303.888 103.618C305.599 105.087 306.454 105.821 307.187 106.5C324.445 122.495 328.95 147.983 318.215 168.903C317.76 169.791 317.208 170.773 316.104 172.737C315.611 173.613 315.364 174.052 315.132 174.483C309.812 184.375 307.809 195.708 309.418 206.82C309.488 207.304 309.569 207.8 309.732 208.792C310.096 211.014 310.278 212.125 310.402 213.115C313.318 236.436 300.347 258.851 278.647 267.992C277.726 268.379 276.67 268.778 274.559 269.574C273.617 269.929 273.146 270.107 272.69 270.289C262.241 274.455 253.406 281.852 247.48 291.395C247.221 291.811 246.964 292.243 246.449 293.108C245.297 295.043 244.721 296.011 244.178 296.849C231.387 316.584 207.011 325.436 184.498 318.521C183.543 318.228 182.477 317.856 180.347 317.112C179.396 316.78 178.921 316.614 178.455 316.461C167.767 312.951 156.233 312.951 145.545 316.461C145.079 316.614 144.603 316.78 143.652 317.112C141.522 317.856 140.457 318.228 139.502 318.521C116.989 325.436 92.6128 316.584 79.8221 296.849C79.2792 296.011 78.7029 295.043 77.5503 293.108C77.0358 292.243 76.7785 291.811 76.52 291.395C70.5939 281.852 61.7583 274.455 51.3096 270.289C50.8539 270.107 50.3827 269.929 49.4404 269.574C47.3294 268.778 46.274 268.379 45.3529 267.992C23.6523 258.851 10.6819 236.436 13.598 213.115C13.7218 212.125 13.9039 211.014 14.2682 208.792C14.4308 207.8 14.5121 207.304 14.5822 206.82C16.1908 195.708 14.188 184.375 8.86748 174.483C8.63542 174.052 8.389 173.613 7.89616 172.737C6.79213 170.773 6.24011 169.791 5.78449 168.903C-4.95014 147.983 -0.445588 122.495 16.8128 106.5C17.5454 105.821 18.4007 105.087 20.1113 103.618C20.875 102.963 21.2568 102.635 21.6228 102.308C30.0134 94.8285 35.7804 84.8623 38.0777 73.8723C38.1779 73.393 38.2715 72.8992 38.4588 71.9115C38.8783 69.6991 39.088 68.5928 39.311 67.6205C44.5652 44.7107 64.4369 28.0742 87.9623 26.8898C88.9608 26.8395 90.0891 26.8255 92.3458 26.7976C93.3531 26.7851 93.8568 26.7788 94.3473 26.7636C105.594 26.4148 116.432 22.4788 125.272 15.5333C125.658 15.2304 126.048 14.9121 126.828 14.2757Z';

type MascotMood = 'default' | 'couch' | 'study' | 'sleep' | 'food' | 'busy';

type Excuse = {
  id: MascotMood;
  label: string;
  emoji: string;
  punchline: string;
};

const EXCUSES: Excuse[] = [
  {
    id: 'couch',
    label: 'Sofaen vant',
    emoji: '🛋️',
    punchline: 'Sofaen er myk og varm, men samvittigheten blir hard... 🥺',
  },
  {
    id: 'study',
    label: "Må 'lese'",
    emoji: '📚',
    punchline: "Vi vet begge to at 'lesing' ender med 3 timer på TikTok... 📱👀",
  },
  {
    id: 'sleep',
    label: 'Søvnunderskudd',
    emoji: '😴',
    punchline: 'Powernap kurerer mye, men godt fellesskap kurerer alt! ☕✨',
  },
  {
    id: 'food',
    label: 'Ikke sulten',
    emoji: '🍕',
    punchline: 'Mer gratis mat/snacks til oss andre! (Men vi savner deg) 😋💔',
  },
  {
    id: 'busy',
    label: 'Ombestemt meg',
    emoji: '🤷',
    punchline: 'Den er grei, det er lov å ta en velfortjent pust i bakken! 🫶',
  },
];

const PlayfulCookieMascot = ({ mood }: { mood: MascotMood }) => {
  return (
    <View className="relative items-center justify-center">
      <MotiView
        from={{ scale: 0.95 }}
        animate={{
          scale: 1,
          translateY: [-3, 3, -3],
          rotate: ['-2deg', '2deg', '-2deg'],
        }}
        transition={{
          translateY: {
            loop: true,
            type: 'timing',
            duration: 3200,
          },
          rotate: {
            loop: true,
            type: 'timing',
            duration: 3600,
          },
        }}>
        <Svg width={140} height={138} viewBox="0 0 324 321">
          {/* Base cookie shape */}
          <Path d={COOKIE_PATH} fill="#FFE2E2" stroke="#FDA4AF" strokeWidth={3} />

          {/* Chocolate chips / crumbs */}
          <Circle cx="85" cy="85" r="7" fill="#881337" opacity={0.3} />
          <Circle cx="240" cy="88" r="8" fill="#881337" opacity={0.3} />
          <Circle cx="70" cy="195" r="7" fill="#881337" opacity={0.3} />
          <Circle cx="250" cy="198" r="6" fill="#881337" opacity={0.3} />
          <Circle cx="162" cy="70" r="8" fill="#881337" opacity={0.3} />

          {/* Rosy cheeks */}
          <Ellipse cx="92" cy="164" rx="14" ry="7" fill="#F43F5E" opacity={0.35} />
          <Ellipse cx="232" cy="164" rx="14" ry="7" fill="#F43F5E" opacity={0.35} />

          {/* Expressions according to mood */}
          {mood === 'couch' || mood === 'sleep' ? (
            <>
              {/* Sleeping curved eyelids */}
              <Path
                d="M 104 144 Q 118 135 132 144"
                stroke="#1C1917"
                strokeWidth={5}
                strokeLinecap="round"
                fill="none"
              />
              <Path
                d="M 192 144 Q 206 135 220 144"
                stroke="#1C1917"
                strokeWidth={5}
                strokeLinecap="round"
                fill="none"
              />
              {/* Relaxed slight smile */}
              <Path
                d="M 152 188 Q 162 195 172 188"
                stroke="#1C1917"
                strokeWidth={4}
                strokeLinecap="round"
                fill="none"
              />
            </>
          ) : mood === 'study' ? (
            <>
              {/* Round glasses */}
              <Circle cx="118" cy="142" r="23" stroke="#1C1917" strokeWidth="3.5" fill="none" />
              <Circle cx="206" cy="142" r="23" stroke="#1C1917" strokeWidth="3.5" fill="none" />
              <Path
                d="M 141 142 L 183 142"
                stroke="#1C1917"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <Circle cx="118" cy="140" r="10" fill="#1C1917" />
              <Circle cx="206" cy="140" r="10" fill="#1C1917" />
              <Circle cx="115" cy="137" r="3.5" fill="#FFFFFF" />
              <Circle cx="203" cy="137" r="3.5" fill="#FFFFFF" />
              <Path
                d="M 152 190 Q 162 196 172 190"
                stroke="#1C1917"
                strokeWidth={4}
                strokeLinecap="round"
                fill="none"
              />
            </>
          ) : mood === 'food' ? (
            <>
              {/* Happy squint eyes */}
              <Path
                d="M 104 144 Q 118 133 132 144"
                stroke="#1C1917"
                strokeWidth={5}
                strokeLinecap="round"
                fill="none"
              />
              <Path
                d="M 192 144 Q 206 133 220 144"
                stroke="#1C1917"
                strokeWidth={5}
                strokeLinecap="round"
                fill="none"
              />
              {/* Open mouth with pink tongue */}
              <Path d="M 148 182 Q 162 206 176 182 Z" fill="#E11D48" />
              <Path d="M 154 194 Q 162 190 170 194 Q 162 206 154 194 Z" fill="#FDA4AF" />
            </>
          ) : mood === 'busy' ? (
            <>
              {/* Winking right eye, open left eye */}
              <Circle cx="118" cy="142" r="16" fill="#1C1917" />
              <Circle cx="113" cy="137" r="6" fill="#FFFFFF" />
              <Path
                d="M 192 144 Q 206 135 220 144"
                stroke="#1C1917"
                strokeWidth={5}
                strokeLinecap="round"
                fill="none"
              />
              {/* Sheepish smile */}
              <Path
                d="M 148 190 Q 164 195 176 187"
                stroke="#1C1917"
                strokeWidth={4}
                strokeLinecap="round"
                fill="none"
              />
              {/* Sweat drop */}
              <Path
                d="M 238 120 C 238 120 245 130 245 135 C 245 139 242 142 238 142 C 234 142 231 139 231 135 C 231 130 238 120 238 120 Z"
                fill="#38BDF8"
              />
            </>
          ) : (
            <>
              {/* Default: Big glossy puppy eyes */}
              <Circle cx="118" cy="142" r="16" fill="#1C1917" />
              <Circle cx="113" cy="137" r="6" fill="#FFFFFF" />
              <Circle cx="123" cy="147" r="2.8" fill="#FFFFFF" />
              <Circle cx="206" cy="142" r="16" fill="#1C1917" />
              <Circle cx="201" cy="137" r="6" fill="#FFFFFF" />
              <Circle cx="211" cy="147" r="2.8" fill="#FFFFFF" />
              {/* Sad eyebrows */}
              <Path
                d="M 98 118 Q 118 108 132 116"
                stroke="#1C1917"
                strokeWidth={4}
                strokeLinecap="round"
                fill="none"
              />
              <Path
                d="M 192 116 Q 206 108 226 118"
                stroke="#1C1917"
                strokeWidth={4}
                strokeLinecap="round"
                fill="none"
              />
              {/* Sad pout mouth */}
              <Path
                d="M 148 196 Q 162 184 176 196"
                stroke="#1C1917"
                strokeWidth={4}
                strokeLinecap="round"
                fill="none"
              />
              {/* Teardrop */}
              <Path
                d="M 226 156 C 226 156 235 169 235 176 C 235 181 231 185 226 185 C 221 185 217 181 217 176 C 217 169 226 156 226 156 Z"
                fill="#38BDF8"
              />
            </>
          )}
        </Svg>
      </MotiView>
    </View>
  );
};

const UnregisterPage = () => {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const { handleSignOff, event, waitingListPositions } = useEventDetails(id?.toString() ?? '');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedExcuse, setSelectedExcuse] = useState<MascotMood>('default');

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
  const config = event?.eventType ? EventTypeConfig[event.eventType] : undefined;

  const activeExcuse = EXCUSES.find((e) => e.id === selectedExcuse);

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
        SystemAlert.alert(
          'Feil',
          error ?? 'En feil oppstod under avregistrering. Vennligst prøv igjen senere.'
        );
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
        <Typography type="body-sm" className="text-muted-foreground font-semibold">
          Avmelding
        </Typography>
        <View className="w-10" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}>
        <View className="flex-col items-center gap-6 px-6 pt-2">
          {/* Mascot Section */}
          <View className="items-center">
            <View className="relative">
              <PlayfulCookieMascot mood={selectedExcuse} />
              {/* Floating mood badge */}
              <AnimatePresence>
                <MotiView
                  key={selectedExcuse}
                  from={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ type: 'spring', damping: 12 }}
                  className="bg-surface border-border absolute -right-2 -top-1 rounded-full border p-2 shadow-md">
                  <Text className="text-xl">{activeExcuse?.emoji ?? '🥺'}</Text>
                </MotiView>
              </AnimatePresence>
            </View>

            {/* Playful Headline */}
            <Typography type="h2" className="mt-4 text-center font-bold">
              {isWaitlisted ? 'Vil du forlate ventelisten? 🥺' : 'Er du sikker på dette, da?'}
            </Typography>

            {/* Punchline / commentary */}
            <View className="mt-2 min-h-12 items-center justify-center px-4">
              <AnimatePresence exitBeforeEnter>
                <MotiView
                  key={selectedExcuse}
                  from={{ opacity: 0, translateY: 6 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  exit={{ opacity: 0, translateY: -6 }}
                  transition={{ type: 'timing', duration: 200 }}
                  className="items-center">
                  <Typography type="body-sm" className="text-muted-foreground text-center italic">
                    {activeExcuse?.punchline ??
                      'Tenk på all moroa du går glipp av... Sofaen er der i morgen også ✨'}
                  </Typography>
                </MotiView>
              </AnimatePresence>
            </View>
          </View>

          {/* Event Preview Card */}
          {event && (
            <Card className="border-border/80 bg-surface/70 w-full overflow-hidden border p-4 shadow-sm">
              <View className="flex-row items-center justify-between gap-2">
                {config && (
                  <Chip size="sm" variant="soft" style={{ backgroundColor: `${config.color}25` }}>
                    <Text style={{ color: config.color }} className="text-xs font-semibold">
                      {config.displayName}
                    </Text>
                  </Chip>
                )}
                {isWaitlisted ? (
                  <Chip size="sm" variant="secondary" color="warning">
                    Venteliste
                  </Chip>
                ) : (
                  <Chip size="sm" variant="secondary" color="accent">
                    Påmeldt
                  </Chip>
                )}
              </View>

              <Typography type="h3" className="mt-2.5 font-bold" numberOfLines={2}>
                {event.title}
              </Typography>

              {event.startTime && (
                <View className="mt-2 flex-row items-center gap-1.5">
                  <Icon name="CalendarDays" size={14} className="text-default-foreground" />
                  <Typography type="body-xs" className="text-muted-foreground">
                    {format(new Date(event.startTime), "EEEE d. MMMM 'kl.' HH:mm", {
                      locale: nb,
                    })}
                  </Typography>
                </View>
              )}

              {event.location && (
                <View className="mt-1 flex-row items-center gap-1.5">
                  <Icon name="MapPin" size={14} className="text-default-foreground" />
                  <Typography type="body-xs" className="text-muted-foreground" numberOfLines={1}>
                    {event.location}
                  </Typography>
                </View>
              )}
            </Card>
          )}

          {/* Playful Excuse Selector */}
          {/* <View className="w-full">
            <Typography
              type="body-xs"
              className="text-muted-foreground mb-2.5 font-semibold uppercase tracking-wider">
              Hva er unnskyldningen din? (Vær ærlig 👀)
            </Typography>
            <View className="flex-row flex-wrap gap-2">
              {EXCUSES.map((excuse) => {
                const isSelected = selectedExcuse === excuse.id;
                return (
                  <Chip
                    key={excuse.id}
                    size="md"
                    variant={isSelected ? 'primary' : 'secondary'}
                    color={isSelected ? 'accent' : 'default'}
                    onPress={() => setSelectedExcuse(isSelected ? 'default' : excuse.id)}>
                    {`${excuse.emoji} ${excuse.label}`}
                  </Chip>
                );
              })}
            </View>
          </View> */}

          {/* Deadline / Penalty Notice */}
          <View className="w-full">
            {isPastUnregisterDeadline && unregistrationDeadline ? (
              <Alert status="danger">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>Prikk-alarm! 🚨</Alert.Title>
                  <Alert.Description>
                    {`Fristen var ${format(unregistrationDeadline, "d. MMM 'kl.' HH:mm", {
                      locale: nb,
                    })}. Avmelding nå medfører 1 prikk! Er det virkelig verdt det? 😬`}
                  </Alert.Description>
                </Alert.Content>
              </Alert>
            ) : unregistrationDeadline ? (
              <Alert status="default">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>
                    {isWaitlisted ? 'Køplass frigis' : 'Innenfor fristen ✨'}
                  </Alert.Title>
                  <Alert.Description>
                    {isWaitlisted
                      ? 'Du står på venteliste og får ingen prikk, men gir fra deg køplassen.'
                      : `Avmeldingsfrist: ${format(
                          unregistrationDeadline,
                          "EEEE d. MMMM 'kl.' HH:mm",
                          { locale: nb }
                        )}. Du slipper prikk, og noen i køen jubler!`}
                  </Alert.Description>
                </Alert.Content>
              </Alert>
            ) : null}
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="border-border bg-background/95 w-full border-t px-6 py-4 backdrop-blur-md">
        <Button
          variant="primary"
          size="lg"
          className="h-14 w-full rounded-2xl shadow-md"
          onPress={handleKeepRegistration}>
          <Text className="text-primary-foreground text-center text-base font-bold">
            Nei, jeg blir med likevel! 🎉
          </Text>
        </Button>

        <Button
          variant="ghost"
          size="md"
          className="mt-2.5 w-full"
          isDisabled={isLoading}
          onPress={signOff}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#ef4444" />
          ) : (
            <Text className="text-danger text-center text-sm font-medium">
              Ja, meld meg av likevel 💔
            </Text>
          )}
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default UnregisterPage;
