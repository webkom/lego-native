import Button from '@/components/button';
import Card from '@/components/card';
import { Link } from 'expo-router';
import { MoveRightIcon } from 'lucide-react-native';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';

const SafeAreaView = withUniwind(RNSafeAreaView);

const BlurBackground = require('@/assets/images/blur-background.png');

const OnboardingPage = () => {
  return (
    <View className="bg-background h-screen w-screen">
      <Image source={BlurBackground} className="absolute h-full w-full" resizeMode="cover" />
      <SafeAreaView className="flex h-screen w-screen flex-col items-center justify-center gap-14 px-5">
        <Text
          style={{
            fontFamily: 'PixelifySans_400Regular',
          }}
          className="text-primary text-5xl">
          &gt; Nyttig å vite
        </Text>
        <View className="flex w-full flex-row flex-wrap gap-5">
          <View className="min-h-62.5  flex w-full flex-row gap-5">
            <Card title={'Bla gjennom arrangementer'} className="bg-primary-container/60 flex-1">
              <Text className="text-xl leading-tight">
                Meld deg enkelt på arrangementer gjennom appen
              </Text>
            </Card>
            <Card title={'Aba-ID lett tilgjengelig'} className="bg-primary-container/60 flex-1">
              <Text className="text-xl leading-tight">
                Ha Aba-IDen din klar for kontroll til enhver tid
              </Text>
            </Card>
          </View>
          <Card title={'Varslinger rett på telefonen'} className="bg-primary-container/60">
            <Text className="text-xl leading-tight">
              Få beskjed når påmelding til populære arrangementer nærmer seg{' '}
            </Text>
          </Card>
        </View>

        <Link href="/authed/(tabs)/home" asChild>
          <Button size="lg" className="max-w-75 w-full rounded-full">
            <MoveRightIcon className="text-on-primary" color={'#FFFFFF'} />
            <Text className="text-on-primary text-lg font-semibold">Til hjemskjermen</Text>
          </Button>
        </Link>
      </SafeAreaView>
    </View>
  );
};

export default OnboardingPage;
