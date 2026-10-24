import Cookie from '@/components/cookie';
import { useUser } from '@/lib/hooks/useUser';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, Text, View } from 'react-native';
import QRCodeStyled from 'react-native-qrcode-styled';
const GreenGradient = require('@/assets/images/top-blur-green.png');

const AbaIDPage = () => {
  const user = useUser();
  return (
    <View className="relative h-screen w-screen">
      {/* <Header className="z-50" /> */}
      <StatusBar style="auto" />
      <Image source={GreenGradient} className="absolute left-0 top-0 z-20 h-96 w-full" />
      <View className="flex h-full w-full items-center justify-center">
        <View className="flex items-center justify-center">
          <View className="absolute">
            <Cookie />
          </View>
          {!user?.username && (
            <Text className="w-full px-20 text-center uppercase">Ingen brukerdata</Text>
          )}
          {user?.username && (
            <QRCodeStyled
              data={user?.username}
              style={{
                backgroundColor: 'transparent',
                borderRadius: 16,
                overflow: 'hidden',
              }}
              padding={20}
              pieceBorderRadius={'50%'}
              isPiecesGlued
              color={'#904a4b'}
              preserveAspectRatio="none"
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default AbaIDPage;
