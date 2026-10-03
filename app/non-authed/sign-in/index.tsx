import Button from '@/components/button';
import Input from '@/components/input';
import { useSignIn } from '@/lib/hooks/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import { z } from 'zod';

const AbakusLogo = require('@/assets/images/abakus-logo.png');
const BlurBackground = require('@/assets/images/blur-background.png');

const formSchema = z.object({
  username: z.string().min(1, 'Brukernavn er påkrevd'),
  password: z.string().min(1, 'Passord er påkrevd'),
});

const SignInPage = () => {
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

      <View className="z-30 flex h-full w-full flex-col items-center justify-center gap-5 px-10">
        <Image
          source={AbakusLogo}
          className="top-safe-offset-20 absolute h-32 w-72 max-w-full"
          resizeMode="contain"
        />
        <View className="bottom-safe-offset-10 absolute flex w-full flex-col items-center gap-5">
          {/* This is just temporary, for easy debugging and stuff */}
          <Text className="text-on-background mt-10 w-full text-center text-lg font-semibold">
            Laget med 🌚 av Webkom
          </Text>
        </View>
        <Text
          style={{
            fontFamily: 'PixelifySans_400Regular',
          }}
          className="text-primary text-5xl">
          &gt; Velkommen
        </Text>

        <Controller
          control={form.control}
          name={'username'}
          render={({ field, fieldState }) => (
            <Input
              className="mt-5 w-full"
              label="Brukernavn"
              error={fieldState.error?.message}
              inputProps={{
                value: field.value,
                onBlur: field.onBlur,
                onChangeText: field.onChange,
                autoCapitalize: 'none',
                autoComplete: 'username',
              }}
            />
          )}
        />

        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Input
              className="w-full"
              label="Passord"
              inputProps={{
                ...field,
                secureTextEntry: true,
                value: field.value,
                onBlur: field.onBlur,
                onChangeText: field.onChange,
                autoComplete: 'password',
              }}
              error={fieldState.error?.message}
            />
          )}
        />

        <Button
          size="lg"
          className="mt-5 w-full max-w-[300px] rounded-full"
          onPress={() => {
            form.handleSubmit(handleSubmit)();
          }}>
          <Text className="text-on-primary text-xl font-semibold">
            {auth.isPending && <ActivityIndicator color="#FFFFFF" size="large" />}
            {!auth.isPending && 'Logg inn'}
          </Text>
        </Button>

        <Text>{auth.isError && 'Noe gikk galt under innlogging'}</Text>
      </View>
    </View>
  );
};

export default SignInPage;
