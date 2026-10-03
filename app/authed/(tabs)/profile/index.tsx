import Button from '@/components/button';
import Dialog from '@/components/dialog';
import Icon from '@/components/icon';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useSignIn } from '@/lib/hooks/useAuth';
import { useUser } from '@/lib/hooks/useUser';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';

const SafeAreaView = withUniwind(RNSafeAreaView);

const RedGradient = require('@/assets/images/top-blur-red.png');

const ProfilePage = () => {
  const auth = useSignIn();

  const [show, setShow] = useState(false);
  const router = useRouter();

  const handleSignOut = () => {
    auth.signOut();
    router.replace('/non-authed/sign-in');
  };

  const user = useUser();
  return (
    <View className="pt-safe-offset-5 relative h-screen w-screen">
      {/* <Header className="absolute z-50" /> */}
      <Image source={RedGradient} className="absolute left-0 top-0 z-20 h-96 w-full" />
      <StatusBar style="auto" />
      <SafeAreaView className="z-20 h-full w-full px-10 pt-20">
        <View className="mx-auto flex flex-col items-center gap-2.5">
          <Avatar alt="Profile Picture">
            <AvatarImage source={{ uri: user?.profilePicture ?? '' }} />
          </Avatar>

          <Text
            style={{ fontFamily: 'RobotoFlex_400Regular' }}
            className="text-primary mt-2.5 text-center text-3xl font-bold">
            {user?.fullName}
          </Text>

          <View className="flex-row items-center gap-5">
            {user?.grade && (
              <Text className="text-on-background text-lg font-bold">{user?.grade}</Text>
            )}
            {user?.isAbakusMember && (
              <>
                <View className="bg-on-background/50 h-5 w-0.5" />
                <Text
                  style={{ fontFamily: 'RobotoFlex_400Regular' }}
                  className="text-on-background text-lg font-bold">
                  Abakus
                </Text>
              </>
            )}
          </View>

          <View className="mt-10 flex w-full flex-col gap-1">
            <Button className="w-full" list="top" variant="secondary">
              <Link
                href={`https://abakus.no/users/${user?.username}/settings/profile`}
                className="w-full">
                <View className="flex w-full flex-row items-center justify-center gap-2.5">
                  <Icon name="ExternalLink" className="text-on-primary" size={18} />
                  <Text className="text-on-primary text-center">Administrer</Text>
                </View>
              </Link>
            </Button>
            <Button
              className="w-full"
              innerClassName="w-full"
              variant="secondary"
              list="bottom"
              onPress={() => setShow((prev) => !prev)}>
              <Icon name="LogOut" size={18} className="text-on-error" />
              <Text className="text-on-error text-center">Logg ut</Text>
            </Button>
          </View>
        </View>
        <View className="flex h-full w-full items-center justify-center"></View>
      </SafeAreaView>
      <Dialog
        show={show}
        onDismiss={() => setShow(false)}
        className="flex flex-col items-center justify-evenly">
        <Text className="text-on-background mx-auto text-center text-3xl font-bold">
          Er du sikker på at du vil logge ut?
        </Text>
        <View className="w-full flex-col gap-2.5">
          {/* <Button
            className="flex-1 rounded-full"
            size="lg"
            variant="secondary"
            onPress={() => setShow(false)}>
            <Text className="text-xl text-on-primary">Avbryt</Text>
          </Button> */}
          <Button variant="error" className="flex-1 rounded-full" size="lg" onPress={handleSignOut}>
            <Text className="text-on-error text-xl">Logg ut</Text>
          </Button>
        </View>
      </Dialog>
    </View>
  );
};

export default ProfilePage;
