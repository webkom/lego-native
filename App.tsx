import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import NotificationProvider from "./components/NotificationProvider";
import ScreenManager from "./components/ScreenManager";

export default function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <ScreenManager />
      </NotificationProvider>
    </QueryClientProvider>
  );
}
