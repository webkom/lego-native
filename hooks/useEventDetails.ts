import { useEvent } from '@/lib/hooks/useEvent';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useEventAttendance } from './useEventAttendance';
import { useUnansweredEventSurveys } from './useEventSurveys';
import { useRegistrationEligibility } from './useRegistrationEligibility';
import { getWaitingListPosition } from '@/lib/getWaitingListPosition';

/**
 * A wrapper hook that combines event details, attendance, and registration eligibility into a single hook
 * for easier consumption in components. It also computes some derived states.
 * @param eventId The id of the event to fetch details for.
 * @returns An object containing event details, attendance status, registration eligibility, and handlers for sign up and sign off.
 */
export const useEventDetails = (eventId: string) => {
  const router = useRouter();
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const {
    data: event,
    isLoading: isEventLoading,
    isRefetching: isRefetchingEvent,
    isError: isEventError,
  } = useEvent(eventId);

  const { data: eligibilityData, isLoading: isEligibilityLoading } =
    useRegistrationEligibility(eventId);

  const { unansweredSurveys, refetch: refetchSurveys } = useUnansweredEventSurveys(eventId);

  const {
    signUp,
    signOffAsync,
    isLoading: isAttendanceLoading,
    isError: isAttendanceError,
    isUserSignedUp,
    totalCapacity,
    attendees,
    totalCurrentPenalties,
    userRegistration,
  } = useEventAttendance({ id: eventId });

  const waitingListPositions = useMemo(
    () => getWaitingListPosition(userRegistration, event),
    [userRegistration, event]
  );

  // Computed states
  const canSignUp = Boolean(
    eligibilityData?.canRegisterNow && (isUserSignedUp || unansweredSurveys.length === 0)
  );
  const isAttendanceActionLoading =
    signUp.status === 'pending' || isAttendanceLoading || (!isUserSignedUp && !turnstileToken);

  const isLoading = (isEventLoading || isAttendanceLoading) && !event;
  const isError = !eventId || isEventError || isAttendanceError;

  // Actions
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleSignUp = useCallback(async () => {
    if (!turnstileToken) {
      Alert.alert('Verifikasjon ikke fullført', 'Vennligst prøv igjen senere.');
      return;
    }

    try {
      await signUp.mutateAsync({
        params: { path: { eventPk: eventId } },
        body: {
          feedback: '',
          captchaResponse: turnstileToken,
          id: Number(eventId),
        },
      });
    } catch (error) {
      console.error('Error during sign up:', error);
      Alert.alert('Påmelding mislyktes', 'Vennligst prøv igjen senere.');
    }
  }, [signUp, turnstileToken, eventId]);

  const handleSignOff = useCallback(async () => {
    try {
      await signOffAsync();
    } catch (error) {
      console.error('Error during sign off:', error);
    }
  }, [signOffAsync]);

  return {
    event,
    eventId,
    isLoading,
    isRefetchingEvent,
    isError,
    // Attendance & Registration
    canSignUp,
    isEligibilityLoading,
    isUserSignedUp,
    isAttendanceActionLoading,
    attendeesCount: attendees.length,
    totalCapacity,
    totalCurrentPenalties,
    unansweredSurveys,
    refetchSurveys,
    // Turnstile
    turnstileToken,
    setTurnstileToken,
    // Handlers
    handleBack,
    handleSignUp,
    handleSignOff,
    waitingListPositions,
  };
};
