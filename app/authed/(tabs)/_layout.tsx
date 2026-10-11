import TabBar from '@/components/tab-bar';
import { useUser } from '@/lib/hooks/useUser';
import { Tabs } from 'expo-router';

import React from 'react';

const TabLayout = () => {
  const user = useUser();
  const isWebkom = user?.isWebkom;

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
        tabBar={(props) => <TabBar {...props} />}>
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
        <Tabs.Screen
          name="dashboard/index"
          options={{
            title: 'Dashboard',
            href: isWebkom ? undefined : null,
          }}
        />
      </Tabs>
    </>
  );
};

export default TabLayout;
