import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import Icon from '@/components/icon';
import { penaltyHours } from '@/lib/penalties';
import { format, isAfter } from 'date-fns';
import { nb } from 'date-fns/locale';
import { Link } from 'expo-router';
import { CircleAlert, ClockAlert } from 'lucide-react-native';
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
}

export function EventNotices({
  event,
  totalCurrentPenalties = 0,
  canSignUp = false,
  isUserSignedUp = false,
  unansweredSurveys = [],
  onSurveyClosed,
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

  if (!showSurveyWarning && !showPenaltyWarning && !unregistrationDeadline && !isFutureActivation) {
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
      {/* 1. Penalty Warning */}
      {showPenaltyWarning && (
        <Link
          className="w-full"
          href="https://abakus.no/pages/arrangementer/26-arrangementsregler"
          asChild>
          <TouchableOpacity activeOpacity={0.8}>
            <Card className="border-destructive/30 bg-destructive/10 w-full py-3">
              <CardContent className="flex-row items-center gap-3">
                <View className="bg-destructive/20 h-8 w-8 items-center justify-center rounded-lg">
                  <Icon name="TriangleAlert" size={16} className="text-destructive" />
                </View>
                <View className="flex-1">
                  <Text className="text-destructive text-xs font-bold uppercase tracking-wider">
                    Du har {totalCurrentPenalties} prikk{totalCurrentPenalties !== 1 ? 'er' : ''}
                  </Text>
                  <Text className="text-destructive/90 text-xs">
                    {totalCurrentPenalties > 2
                      ? `Påmelding forskjøvet med ${penaltyHours(totalCurrentPenalties)} timer.`
                      : 'Du legges på venteliste ved påmelding.'}
                  </Text>
                </View>
                <Icon name="ChevronRight" size={16} className="text-destructive" />
              </CardContent>
            </Card>
          </TouchableOpacity>
        </Link>
      )}

      {/* 2. Registration Opens Countdown / Alert */}
      {isFutureActivation && !isUserSignedUp && (
        <Card className="border-primary/20 bg-primary/5 py-3">
          <CardContent className="flex-row items-center gap-3">
            <View className="bg-primary/10 h-8 w-8 items-center justify-center rounded-lg">
              <Icon name="Clock" size={16} className="text-primary" />
            </View>
            <View className="flex-1">
              <Text className="text-primary text-xs font-bold uppercase tracking-wider">
                Påmelding åpner snart
              </Text>
              <Text className="text-muted-foreground text-xs">
                Åpner {format(activationTime, "EEEE d. MMMM 'kl.' HH:mm", { locale: nb })}
              </Text>
            </View>
          </CardContent>
        </Card>
      )}

      {/* 3. Unregistration Deadline Notice */}
      {unregistrationDeadline && (
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
    </View>
  );
}

export default EventNotices;
