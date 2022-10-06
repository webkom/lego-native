import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native";
import Login from "../screens/Login";
import Dashboard from "../screens/Dashboard";
import Settings from "../screens/Settings";
import Events from "../screens/Events";

const SCREENS = [
  {
    name: "Dashboard",
    component: Dashboard,
    getIcon: (focused: boolean, color: string, size: number) => (
      <Ionicons
        name={focused ? "home" : "home-outline"}
        size={size}
        color={color}
      />
    ),
  },
  {
    name: "Settings",
    component: Settings,
    getIcon: (focused: boolean, color: string, size: number) => (
      <Ionicons
        name={focused ? "settings" : "settings-outline"}
        size={size}
        color={color}
      />
    ),
  },
  {
    name: "Events",
    component: Events,
    getIcon: (focused: boolean, color: string, size: number) => (
      <Ionicons
        name={focused ? "menu" : "menu-outline"}
        size={size}
        color={color}
      />
    ),
  },
];

const getScreenOptions = (routeName: string) => {
  const currentScreen = SCREENS.find((screen) => screen.name === routeName);

  if (!currentScreen) {
    throw new Error("Route name does not exist");
  }

  return {
    tabBarIcon: ({
      focused,
      color,
      size,
    }: {
      focused: boolean;
      color: string;
      size: number;
    }) => {
      return currentScreen.getIcon(focused, color, size);
    },
  };
};

const Tab = createBottomTabNavigator();

function ScreenManager() {
  // Temporary for screen mockup
  const [isAuthenticated] = useState(true);

  return isAuthenticated ? (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => getScreenOptions(route.name)}
        initialRouteName={SCREENS[0].name}
      >
        {SCREENS.map((screen) => (
          <Tab.Screen
            key={screen.name}
            name={screen.name}
            component={screen.component}
          />
        ))}
      </Tab.Navigator>
    </NavigationContainer>
  ) : (
    <SafeAreaView>
      <Login />
    </SafeAreaView>
  );
}

export default ScreenManager;
