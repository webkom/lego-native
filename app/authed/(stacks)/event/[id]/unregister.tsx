import { useEventDetails } from '@/hooks/useEventDetails';
import { format, isAfter } from 'date-fns';
import { nb } from 'date-fns/locale';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Button, Typography } from 'heroui-native';
import { CircleAlert, ClockAlert } from 'lucide-react-native';
import { useState } from 'react';
import { Alert as SystemAlert, Text, View, ActivityIndicator } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';

const SafeAreaView = withUniwind(RNSafeAreaView);

const UnregisterPage = () => {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const { handleSignOff, event } = useEventDetails(id?.toString() ?? '');
  const [isLoading, setIsLoading] = useState(false);

  const unregistrationDeadline = event?.unregistrationDeadline
    ? new Date(event.unregistrationDeadline)
    : null;
  const isPastUnregisterDeadline =
    unregistrationDeadline && !isNaN(unregistrationDeadline.getTime())
      ? isAfter(new Date(), unregistrationDeadline)
      : false;

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
    <SafeAreaView className="h-full">
      <View className="flex-1 items-center justify-center">
        <View className="flex w-full max-w-xl flex-col items-center gap-5 px-10">
          <Typography className="" type="h1">
            Er du sikker på at du vil avregistrere?
          </Typography>
          {isPastUnregisterDeadline && unregistrationDeadline && (
            <Alert
              // icon={isPastUnregisterDeadline ? CircleAlert : ClockAlert}
              status={isPastUnregisterDeadline ? 'danger' : 'default'}>
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>
                  {isPastUnregisterDeadline ? 'Avmelding gir prikk' : 'Avmeldingsfrist'}
                </Alert.Title>
                <Alert.Description>
                  {isPastUnregisterDeadline
                    ? `Fristen var ${format(unregistrationDeadline, "d. MMM 'kl.' HH:mm", {
                        locale: nb,
                      })}.`
                    : `${format(unregistrationDeadline, "EEEE d. MMMM 'kl.' HH:mm", { locale: nb })}`}
                </Alert.Description>
              </Alert.Content>
            </Alert>
          )}
        </View>

        <View className="absolute bottom-0 w-full p-4">
          <Button
            variant={'danger'}
            size="lg"
            className="h-16"
            // className="h-16 w-full text-nowrap rounded-full shadow-md"
            onPress={signOff}>
            {isLoading ? (
              <ActivityIndicator className="text-primary-foreground" />
            ) : (
              <Text className="text-primary-foreground text-nowrap text-lg font-bold">Jepp</Text>
            )}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default UnregisterPage;
