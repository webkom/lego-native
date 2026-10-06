import { DescriptionSection } from '@/components/screens/event/description-section';
import {
  BusinessDetails,
  ErrorState,
  EventActionBar,
  EventNotices,
  EventQuickFacts,
  LoadingState,
  RegistrationPools,
  TitleSection,
} from '@/components/screens/event/event-page';
import { HeroSection } from '@/components/screens/event/hero-section';
import { Turnstile } from '@/components/screens/event/turnstile';
import { useEventDetails } from '@/hooks/useEventDetails';
import { components } from '@/lib/types/schema';
import { Text } from '@expo/ui';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Alert, Spinner, Typography } from 'heroui-native';
import { AnimatePresence, MotiView } from 'moti';
import { useCallback, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EventsPage() {
  const insets = useSafeAreaInsets();

  // Get event details from route params
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const {
    attendeesCount,
    canSignUp,
    event,
    eventId,
    handleBack,
    handleSignUp,
    turnstileToken,
    setTurnstileToken,
    isAttendanceActionLoading,
    isError,
    isLoading,
    isRefetchingEvent,
    isUserSignedUp,
    refetchSurveys,
    totalCapacity,
    totalCurrentPenalties,
    unansweredSurveys,
    waitingListPositions,
  } = useEventDetails(id?.toString() ?? '');

  // Derived states
  const isAttendanceButtonLoading = isAttendanceActionLoading || isRefetchingEvent;

  const [scroll, setScroll] = useState(0);
  const handleScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = e.nativeEvent.contentOffset.y;
    setScroll(offset);
  }, []);

  if (!eventId) {
    return <ErrorState onBack={handleBack} />;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState onBack={handleBack} />;
  }

  const waitingCount =
    typeof event?.waitingRegistrationCount === 'number'
      ? event?.waitingRegistrationCount
      : parseInt(event?.waitingRegistrationCount ?? '0', 10) || 0;

  return (
    <View className="bg-background flex-1">
      <StatusBar style="auto" />

      <View className="flex-1 overflow-hidden">
        <AnimatePresence>
          {isRefetchingEvent && (
            <MotiView
              key="refreshing-indicator"
              from={{ translateY: -100, opacity: 0 }}
              animate={{ translateY: 0, opacity: 1 }}
              exit={{ translateY: -100, opacity: 0 }}
              className="absolute top-5 z-20 w-full items-center">
              <View className="bg-surface border-border/80 flex-row items-center gap-2 rounded-full border px-4 py-2 shadow-lg">
                <Spinner size="sm" color="accent" />
                <Typography type="body-xs" className="text-accent font-semibold">
                  Oppdaterer...
                </Typography>
              </View>
            </MotiView>
          )}
        </AnimatePresence>

        <ScrollView
          onScroll={handleScroll}
          scrollEventThrottle={16}
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 140 }}
          showsVerticalScrollIndicator={false}>
          <View className="flex-col gap-6 px-4" style={{ paddingTop: Math.max(insets.top, 12) }}>
            {/* Hero Cover with floating back and share buttons */}
            <HeroSection event={event} onBack={handleBack} />

            {/* Event Category Badge, Title & Host Attribution */}
            <TitleSection event={event} />

            {/* Unified Notices (Penalty warning, Registration opening countdown, Unregistration deadline, Unanswered surveys) */}
            <EventNotices
              event={event}
              totalCurrentPenalties={totalCurrentPenalties}
              canSignUp={Boolean(canSignUp)}
              isUserSignedUp={isUserSignedUp}
              unansweredSurveys={unansweredSurveys}
              onSurveyClosed={refetchSurveys}
            />

            {/* 2x2 Quick Facts Grid (Tid, Sted/MazeMap, Pris, Kapasitet) */}
            <EventQuickFacts
              event={event}
              attendeesCount={attendeesCount}
              totalCapacity={totalCapacity}
            />

            {/* Waitlist Card */}
            {waitingCount > 0 && (
              <Alert status="warning">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>Venteliste</Alert.Title>
                  <Alert.Description>
                    {waitingCount === 1
                      ? '1 person står i kø for ledig plass'
                      : `${waitingCount} personer står i kø for ledig plass`}
                    {'. '}{' '}
                    {!isUserSignedUp &&
                      canSignUp &&
                      'Du havner på venteliste hvis du melder deg på.'}
                  </Alert.Description>
                </Alert.Content>
              </Alert>
            )}

            {/* Event Description Section */}
            <DescriptionSection
              description={event?.text ?? 'Ingen beskrivelse'}
              previewDescription={
                event?.description ?? event?.text.substring(0, 200) ?? 'Ingen beskrivelse'
              }
            />

            {/* Registration Pools & Capacity Progress Bars */}
            <RegistrationPools
              pools={event?.pools}
              waitingRegistrationCount={event?.waitingRegistrationCount}
              mergeTime={event?.mergeTime}
            />

            {/* Company Details if applicable */}
            {event?.company !== undefined && (
              <BusinessDetails
                company={event.company as unknown as components['schemas']['CompanyDetail']}
              />
            )}

            {/* Captcha verification */}
            {canSignUp && (
              <Turnstile
                onTokenReceived={(token: string) => {
                  setTurnstileToken(token);
                }}
              />
            )}
          </View>
        </ScrollView>
      </View>

      <EventActionBar
        canSignUp={canSignUp ?? false}
        turnstileToken={turnstileToken}
        isUserSignedUp={isUserSignedUp ?? waitingListPositions !== undefined}
        eventId={event?.id.toString() ?? ''}
        scroll={scroll}
        isLoading={isAttendanceButtonLoading}
        onSignUp={handleSignUp}
        onSignOff={() => router.push(`/authed/(stacks)/event/${eventId}/unregister`)}
      />
    </View>
  );
}
