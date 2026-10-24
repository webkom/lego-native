import { DescriptionSection } from '@/components/screens/event/description-section';
import {
  BusinessDetails,
  ErrorState,
  EventActionBar,
  EventNotices,
  EventQuickFacts,
  FeedbackForm,
  LoadingState,
  RefreshingBanner,
  RegistrationPools,
  TitleSection,
} from '@/components/screens/event/event-page';
import { HeroSection } from '@/components/screens/event/hero-section';
import { Turnstile } from '@/components/screens/event/turnstile';
import { useEventDetails } from '@/hooks/useEventDetails';
import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Typography } from 'heroui-native';
import { useCallback, useState } from 'react';
import { Image, NativeScrollEvent, NativeSyntheticEvent, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const RedGradient = require('@/assets/images/top-blur-red.png');

export default function EventsPage() {
  const insets = useSafeAreaInsets();

  // Get event details from route params
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const {
    attendeesCount,
    canRegister,
    canSignUpLater,
    canSignOff,
    requiresFeedback,
    earliestRegistrationTime,
    event,
    handleBack,
    handleNavigateToUnregister,
    handleSignUp,
    turnstileToken,
    setTurnstileToken,
    setFeedback,
    isAttendanceButtonLoading,
    isError,
    isLoading,
    isRefetchingEvent,
    eligibilityReason,
    isUserSignedUp,
    isSignedUpOrWaitlisted,
    refetchSurveys,
    totalCapacity,
    totalCurrentPenalties,
    unansweredSurveys,
    isPastRegistrationDeadline,
    willBeWaitlisted,
  } = useEventDetails(id?.toString() ?? '');

  const [scroll, setScroll] = useState(0);
  const handleScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = e.nativeEvent.contentOffset.y;
    setScroll(offset);
  }, []);

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError || !event) {
    return <ErrorState onBack={handleBack} />;
  }

  return (
    <View className="bg-background flex-1">
      <StatusBar style="auto" />

      <View className="flex-1 overflow-hidden">
        <RefreshingBanner visible={isRefetchingEvent} />

        <ScrollView
          onScroll={handleScroll}
          scrollEventThrottle={16}
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 140 }}
          showsVerticalScrollIndicator={false}>
          <Image source={RedGradient} className="absolute left-0 top-0 z-0 h-96 w-full" />
          <View className="flex-col gap-6 px-4" style={{ paddingTop: Math.max(insets.top, 12) }}>
            {/* Hero Cover with floating back and share buttons */}
            <HeroSection event={event} onBack={handleBack} />

            {/* Event Category Badge, Title & Host Attribution */}
            <TitleSection event={event} isRegistered={isUserSignedUp} />

            {/* Unified Notices (Penalty warning, Registration opening countdown, Unregistration deadline, Unanswered surveys, Waitlist) */}
            <EventNotices
              registrationClosed={isPastRegistrationDeadline}
              event={event}
              totalCurrentPenalties={totalCurrentPenalties}
              canSignUp={canRegister}
              penaltyRegistrationDate={earliestRegistrationTime}
              willBeWaitlisted={willBeWaitlisted ?? false}
              isUserSignedUp={isUserSignedUp}
              unansweredSurveys={unansweredSurveys}
              onSurveyClosed={refetchSurveys}
              canSignUpLater={canSignUpLater}
            />

            <FeedbackForm
              visible={requiresFeedback}
              feedbackDescription={event.feedbackDescription}
              onChangeText={setFeedback}
            />

            {/* 2x2 Quick Facts Grid (Tid, Sted/MazeMap, Pris, Kapasitet) */}
            <EventQuickFacts
              event={event}
              attendeesCount={attendeesCount}
              totalCapacity={totalCapacity}
            />

            {/* Event Description Section */}
            <DescriptionSection
              description={event.text || 'Ingen beskrivelse'}
              previewDescription={
                event.description || event.text.substring(0, 200) || 'Ingen beskrivelse'
              }
            />

            {/* Registration Pools & Capacity Progress Bars */}
            <RegistrationPools
              pools={event.pools}
              waitingRegistrationCount={event.waitingRegistrationCount}
              mergeTime={event.mergeTime}
            />

            {/* Company Details if applicable */}
            <BusinessDetails company={event.company} />

            {/* Captcha verification */}
            <Turnstile visible={canRegister} onTokenReceived={setTurnstileToken} />
          </View>
        </ScrollView>
      </View>

      <EventActionBar
        canSignUp={canRegister}
        canSignOff={canSignOff}
        turnstileToken={turnstileToken}
        isUserSignedUp={isSignedUpOrWaitlisted}
        eventId={event.id.toString()}
        scroll={scroll}
        isLoading={isAttendanceButtonLoading}
        onSignUp={handleSignUp}
        onSignOff={handleNavigateToUnregister}
      />
    </View>
  );
}
