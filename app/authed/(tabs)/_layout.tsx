import TabBar from '@/components/tab-bar';
import { BlurTargetView } from 'expo-blur';
import { Tabs } from 'expo-router';
import React, { useRef } from 'react';
import { View } from 'react-native';

const TabLayout = () => {
  const blurTargetRef = useRef<View>(null);

  return (
    <View className="flex-1">
      <BlurTargetView ref={blurTargetRef} style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            headerShown: false,
          }}
          tabBar={() => null}>
          <Tabs.Screen
            name="profile/index"
            options={{
              title: 'Hjem',
            }}
          />
          <Tabs.Screen
            name="events/index"
            options={{
              title: 'Arrangementer',
            }}
          />
          <Tabs.Screen
            name="abaid/index"
            options={{
              title: 'AbaID',
            }}
          />
        </Tabs>
      </BlurTargetView>
      <TabBar blurTarget={blurTargetRef} />
    </View>
  );
};

export default TabLayout;
