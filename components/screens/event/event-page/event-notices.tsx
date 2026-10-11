import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from '@/components/icon';
import { penaltyHours } from '@/lib/penalties';
import { format, isAfter } from 'date-fns';
import { nb } from 'date-fns/locale';
import { Link } from 'expo-router';
import { UnansweredSurveysCard } from '@/components/events/UnansweredSurveysCard';
import { DetailedEvent } from '../types';
import { Alert } from 'heroui-native';

interface EventNoticesProps {
  event?: DetailedEvent;
  totalCurrentPenalties?: number;
  canSignUp?: boolean;
  isUserSignedUp?: boolean;
  unansweredSurveys?: number[];
  onSurveyClosed?: () => void;
  className?: string;
  registrationClosed?: boolean | null;
  registrationOffset?: Date | null;
}

export function EventNotices({
  event,
  registrationClosed = false,
  totalCurrentPenalties = 0,
  canSignUp = false,
  isUserSignedUp = false,
  unansweredSurveys = [],
  onSurveyClosed,
  registrationOffset,
  className,
}: EventNoticesProps) {
  const showSurveyWarning = Boolean(
    unansweredSurveys && unansweredSurveys.length > 0 && !isUserSignedUp
  );

  const showPenaltyWarning = Boolean(totalCurrentPenalties > 0 && !isUserSignedUp && canSignUp);

  const unregistrationDeadline = event?.unregistrationDeadline
    ? new Date(event.unregistrationDeadline)
    : null;
  const isPastUnregisterDeadline =
    unregistrationDeadline && !isNaN(unregistrationDeadline.getTime())
      ? isAfter(new Date(), unregistrationDeadline)
      : false;

  const activationTime = event?.activationTime ? new Date(event.activationTime) : null;
  const isFutureActivation =
    activationTime && !isNaN(activationTime.getTime()) && isAfter(activationTime, new Date());

  const waitingCount =
    typeof event?.waitingRegistrationCount === 'number'
      ? event?.waitingRegistrationCount
      : parseInt(event?.waitingRegistrationCount ?? '0', 10) || 0;
  const showWaitlistNotice = waitingCount > 0;

  if (
    !showSurveyWarning &&
    !registrationClosed &&
    !showPenaltyWarning &&
    !unregistrationDeadline &&
    !isFutureActivation &&
    !showWaitlistNotice
  ) {
    return null;
  }

  return (
    <View className={`gap-2.5 ${className ?? ''}`}>
      {/* 0. Unanswered Surveys Warning */}
      {showSurveyWarning && (
        <UnansweredSurveysCard
          unansweredSurveys={unansweredSurveys}
          onSurveyClosed={onSurveyClosed}
        />
      )}

      {/* 1. Registration closed Warning */}
      {registrationClosed && (
        <Alert status="accent">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Påmelding er stengt.</Alert.Title>
            <Alert.Description className="text-danger">
              Du kan ikke melde deg på dette arrangementet.
            </Alert.Description>
          </Alert.Content>
        </Alert>
      )}

      {!canSignUp && (
        <Alert status="danger" className="bg-danger-soft">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Beklager! Du kan ikke melde deg på</Alert.Title>
            <Alert.Description className="text-danger">
              Du kan dessverre ikke melde deg på dette arrangementet.
            </Alert.Description>
          </Alert.Content>
        </Alert>
      )}

      {/* 1. Penalty Warning */}
      {showPenaltyWarning && (
        <Link
          className="w-full"
          href="https://abakus.no/pages/arrangementer/26-arrangementsregler"
          asChild>
          <TouchableOpacity activeOpacity={0.8}>
            <Alert status="danger" className="bg-danger-soft">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>
                  Du har {totalCurrentPenalties} prikk{totalCurrentPenalties !== 1 ? 'er' : ''}
                </Alert.Title>
                <Alert.Description className="text-danger">
                  {totalCurrentPenalties > 2
                    ? `Påmelding forskjøvet med ${penaltyHours(totalCurrentPenalties)} timer.`
                    : 'Du legges på venteliste ved påmelding.'}
                </Alert.Description>
              </Alert.Content>
              <Icon name="Link" size={16} className="text-danger" />
            </Alert>
          </TouchableOpacity>
        </Link>
      )}

      {/* 2. Registration Opens Countdown / Alert */}
      {isFutureActivation && !isUserSignedUp && (
        <Alert status="accent">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Påmelding åpner snart</Alert.Title>
            <Alert.Description>
              Åpner {format(activationTime, "EEEE d. MMMM 'kl.' HH:mm", { locale: nb })}
            </Alert.Description>
          </Alert.Content>
        </Alert>
      )}

      {/* 3. Unregistration Deadline Notice */}
      {canSignUp && unregistrationDeadline && (
        <Alert status="danger" className="bg-danger-soft">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>
              {isPastUnregisterDeadline ? 'Avmeldingsfrist utløpt' : 'Avmeldingsfrist'}
            </Alert.Title>
            <Alert.Description className="text-danger">
              {isPastUnregisterDeadline
                ? `Fristen var ${format(unregistrationDeadline, "d. MMM 'kl.' HH:mm", {
                    locale: nb,
                  })}. Avmelding gir prikk.`
                : `${format(unregistrationDeadline, "EEEE d. MMMM 'kl.' HH:mm", { locale: nb })}`}
            </Alert.Description>
          </Alert.Content>
        </Alert>
      )}

      {/* 4. Waitlist Notice */}
      {showWaitlistNotice && (
        <Alert status="warning">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Venteliste</Alert.Title>
            <Alert.Description>
              {waitingCount === 1
                ? '1 person står i kø for ledig plass'
                : `${waitingCount} personer står i kø for ledig plass`}
              {'. '}
              {!isUserSignedUp && canSignUp && 'Du havner på venteliste hvis du melder deg på.'}
            </Alert.Description>
          </Alert.Content>
        </Alert>
      )}
    </View>
  );
}

export default EventNotices;
