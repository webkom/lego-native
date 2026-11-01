import { userAtom } from '@/lib/atoms/user-atom';
import { useAuth } from '@/lib/hooks/useAuth';
import { Link, useRouter, useTheme } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button, Surface, Typography } from 'heroui-native';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { Image, KeyboardAvoidingView, View } from 'react-native';

const BlurBackground = require('@/assets/images/blur-background.png');

const SignInPage = () => {
  const theme = useTheme();
  const user = useAtomValue(userAtom);
  const router = useRouter();
  const { authenticate } = useAuth();
  useEffect(() => {
    if (!router) return;

    if (user) {
      router.replace('/authed/(tabs)/events');
    }
  }, [router, user]);

  // const handleSubmit = (data: z.infer<typeof formSchema>) => {
  //   void auth.signInAsync({ ...data }).then(() => {
  //     router.push('non-authed/onboarding');
  //   });
  // };

  const handleSignIn = () => {
    authenticate();
  };

  return (
    <View className="relative flex h-full flex-col">
      <StatusBar style="auto" />
      <Image
        source={BlurBackground}
        className="absolute inset-0 h-full w-full"
        resizeMode="cover"
      />

      <View className="pt-safe-offset-2 z-30 flex h-full w-full flex-col items-center justify-center gap-5">
        <View className="flex-1 flex-col items-center justify-center">
          <Image
            source={
              theme.dark
                ? require('@/assets/images/abakus-logo-light.png')
                : require('@/assets/images/abakus-logo-dark.png')
            }
            className="h-32 w-72 max-w-full"
            resizeMode="contain"
          />
        </View>
        {/* <View className="bottom-safe-offset-10 absolute flex w-full flex-col items-center gap-5">
          <Text className="text-on-background mt-10 w-full text-center text-lg font-semibold">
            Laget med 🌚 av Webkom
          </Text>
        </View> */}
        <KeyboardAvoidingView className="w-full">
          <Surface className="rounded-t-4xl pb-safe-offset-5 flex h-fit w-full flex-col items-center gap-5 pt-10">
            <View className="flex flex-col items-center gap-2">
              <Typography type="h1">Logg inn</Typography>
              <Typography type="body-sm">
                Har du ikke en bruker? Registrer deg gjennom{' '}
                <Link href="https://abakus.no/" className="text-primary">
                  abakus.no
                </Link>
              </Typography>
            </View>
            {/* <Text
            style={{
              fontFamily: 'PixelifySans_400Regular',
            }}
            className="text-primary text-5xl">
            &gt; Velkommen
          </Text> */}

            <Button
              size="lg"
              variant="danger"
              className="mt-5 w-full"
              onPress={() => {
                handleSignIn();
              }}>
              Logg inn
              {/* <Text className="text-on-primary text-xl font-semibold">
              {auth.isPending && <ActivityIndicator color="#FFFFFF" size="large" />}
              {!auth.isPending && 'Logg inn'}
            </Text> */}
            </Button>

            {/* <Text>{auth.isError && 'Noe gikk galt under innlogging'}</Text> */}
          </Surface>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export default SignInPage;
