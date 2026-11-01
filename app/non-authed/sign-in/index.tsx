import { useSignIn } from '@/lib/hooks/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useTheme } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button, Input, Label, Surface, TextField } from 'heroui-native';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Image, KeyboardAvoidingView, Text, View } from 'react-native';
import { z } from 'zod';

const BlurBackground = require('@/assets/images/blur-background.png');

const formSchema = z.object({
  username: z.string().min(1, 'Brukernavn er påkrevd'),
  password: z.string().min(1, 'Passord er påkrevd'),
});

const SignInPage = () => {
  const theme = useTheme();
  const auth = useSignIn();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      password: '',
      username: '',
    },
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    void auth.signInAsync({ ...data }).then(() => {
      router.push('non-authed/onboarding');
    });
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
          <Surface className="rounded-t-4xl flex h-fit w-full flex-col items-center gap-3 pt-10">
            {/* <Text
            style={{
              fontFamily: 'PixelifySans_400Regular',
            }}
            className="text-primary text-5xl">
            &gt; Velkommen
          </Text> */}

            <Controller
              control={form.control}
              name={'username'}
              render={({ field, fieldState }) => (
                <TextField className="w-full">
                  <Label>Brukernavn</Label>
                  <Input
                    variant="secondary"
                    // error={fieldState.error?.message}
                    // inputProps={{
                    //   value: field.value,
                    //   onBlur: field.onBlur,
                    //   onChangeText: field.onChange,
                    //   autoCapitalize: 'none',
                    //   autoComplete: 'username',
                    // }}
                  />
                </TextField>
              )}
            />

            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <TextField className="w-full">
                  <Label>Passord</Label>
                  <Input
                    className="w-full"
                    // label="Passord"
                    // inputProps={{
                    //   ...field,
                    //   secureTextEntry: true,
                    //   value: field.value,
                    //   onBlur: field.onBlur,
                    //   onChangeText: field.onChange,
                    //   autoComplete: 'password',
                    // }}
                    // error={fieldState.error?.message}
                  />
                </TextField>
              )}
            />

            <Button
              size="lg"
              variant="danger"
              className="mt-10 w-full"
              onPress={() => {
                form.handleSubmit(handleSubmit)();
              }}>
              Logg inn
              {/* <Text className="text-on-primary text-xl font-semibold">
              {auth.isPending && <ActivityIndicator color="#FFFFFF" size="large" />}
              {!auth.isPending && 'Logg inn'}
            </Text> */}
            </Button>

            <Text>{auth.isError && 'Noe gikk galt under innlogging'}</Text>
          </Surface>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export default SignInPage;
