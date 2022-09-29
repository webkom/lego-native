import { NativeBaseProvider, Center } from "native-base";
import React from "react";
import LoginForm from "../components/LoginForm";

function Dashboard() {
  return (
    <NativeBaseProvider>
      <Center flex={1} px="3">
        <LoginForm />
      </Center>
    </NativeBaseProvider>
  );
}

export default Dashboard;
