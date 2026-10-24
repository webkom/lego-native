import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { Alert } from 'heroui-native';
import React from 'react';
import { View } from 'react-native';

type UnregisterDeadlineNoticeProps = {
  unregistrationDeadline: Date | null;
  isPastUnregisterDeadline: boolean;
  isWaitlisted: boolean;
};

export function UnregisterDeadlineNotice({
  unregistrationDeadline,
  isPastUnregisterDeadline,
  isWaitlisted,
}: UnregisterDeadlineNoticeProps) {
  if (!unregistrationDeadline) {
    return null;
  }

  return (
    <View className="w-full">
      {isPastUnregisterDeadline ? (
        <Alert status="danger">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Prikk-alarm! 🚨</Alert.Title>
            <Alert.Description>
              {`Fristen for avmelding var ${format(unregistrationDeadline, "d. MMM 'kl.' HH:mm", {
                locale: nb,
              })}. Avmelding nå medfører 1 prikk.`}
            </Alert.Description>
          </Alert.Content>
        </Alert>
      ) : (
        <Alert status="default">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>{isWaitlisted ? 'Køplass frigis' : 'Innenfor fristen ✨'}</Alert.Title>
            <Alert.Description>
              {isWaitlisted
                ? 'Du gir fra deg plassen på ventelisten.'
                : `Avmeldingsfrist: ${format(unregistrationDeadline, "EEEE d. MMMM 'kl.' HH:mm", {
                    locale: nb,
                  })}.`}
            </Alert.Description>
          </Alert.Content>
        </Alert>
      )}
    </View>
  );
}
