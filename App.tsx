import React from "react";
import NotificationProvider from "./components/NotificationProvider";
import ScreenManager from "./components/ScreenManager";

export default function App() {
  return (
    <NotificationProvider>
      <ScreenManager />
    </NotificationProvider>
  );
}
