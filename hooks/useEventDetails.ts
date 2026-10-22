import { getWaitingListPosition } from '@/lib/getWaitingListPosition';
import { useEvent } from '@/lib/hooks/useEvent';
import { isAfter } from 'date-fns';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useTimer } from 'react-timer-hook';
import { useEventAttendance } from './useEventAttendance';
import { useUnansweredEventSurveys } from './useEventSurveys';
import { useRegistrationEligibility } from './useRegistrationEligibility';

/**
 * A wrapper hook that combines event details, attendance, and registration eligibility into a single hook
 * for easier consumption in components. It also computes some derived states.
 * @param eventId The id of the event to fetch details for.
 * @returns An object containing event details, attendance status, registration eligibility, and handlers for sign up and sign off.
 */
export const useEventDetails = (eventId: string) => {
  const router = useRouter();
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [timerExpiredForTime, setTimerExpiredForTime] = useState<string | null>(null);

  const {
    data: event,
    isLoading: isEventLoading,
    isRefetching: isRefetchingEvent,
    isError: isEventError,
  } = useEvent(eventId);

  const { data: eligibilityData, isLoading: isEligibilityLoading } =
    useRegistrationEligibility(eventId);

  const earliestRegistrationTimeStr = eligibilityData?.earliestRegistrationTime;

  const handleRegistrationOpen = useCallback(() => {
    if (earliestRegistrationTimeStr) {
      setTimerExpiredForTime(earliestRegistrationTimeStr);
    }
  }, [earliestRegistrationTimeStr]);

  const registrationTimer = useTimer({
    expiryTimestamp: new Date(earliestRegistrationTimeStr ?? new Date()),
    onExpire: handleRegistrationOpen,
    autoStart: false,
  });

  const { restart } = registrationTimer;

  // Restart timer when eligibility data loads with a future registration time
  useEffect(() => {
    if (!earliestRegistrationTimeStr) return;

    const expiry = new Date(earliestRegistrationTimeStr);
    if (isAfter(new Date(), expiry)) {
      return;
    }

    restart(expiry, true);
  }, [earliestRegistrationTimeStr, restart]);

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

  const earliestRegistrationTime = useMemo(() => {
    return earliestRegistrationTimeStr ? new Date(earliestRegistrationTimeStr) : null;
  }, [earliestRegistrationTimeStr]);

  const canRegister = useMemo(() => {
    if (!earliestRegistrationTime) return false;
    return (
      isAfter(new Date(), earliestRegistrationTime) ||
      timerExpiredForTime === earliestRegistrationTimeStr
    );
  }, [earliestRegistrationTime, timerExpiredForTime, earliestRegistrationTimeStr]);

  const waitingListPositions = useMemo(
    () => getWaitingListPosition(userRegistration, event),
    [userRegistration, event]
  );

  const isAttendanceActionLoading =
    signUp.status === 'pending' || isAttendanceLoading || (!isUserSignedUp && !turnstileToken);

  const isLoading = (isEventLoading || isAttendanceLoading) && !event;
  const isError = !eventId || isEventError || isAttendanceError;

  const isPastUnregistrationDeadline = useMemo(() => {
    if (!event?.unregistrationDeadline) return null;
    return isAfter(new Date(), new Date(event?.unregistrationDeadline));
  }, [event?.unregistrationDeadline]);

  const isPastRegistrationDeadline = useMemo(() => {
    if (!event?.registrationCloseTime) return null;
    return isAfter(new Date(), new Date(event?.registrationCloseTime));
  }, [event?.registrationCloseTime]);

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
    canRegister,
    registrationTimer,
    regsitrationDisallowed: eligibilityData?.registrationDisallowed,
    willBeWaitlisted: eligibilityData?.willBeWaitingList,
    isRegistrationDelayed: eligibilityData?.isRegistrationDelayed,
    earliestRegistrationTime,
    isEligibilityLoading,
    eligibilityReason: eligibilityData?.reason,
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
    isPastUnregistrationDeadline,
    isPastRegistrationDeadline,
  };
};
