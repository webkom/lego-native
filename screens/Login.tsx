import React from "react";
import { Center, NativeBaseProvider } from "native-base";
import LoginForm from "../components/LoginForm";

function Login() {
  return (
    <NativeBaseProvider>
      <Center flex={1} px="3">
        <LoginForm />
      </Center>
    </NativeBaseProvider>
  );
}

export default Login;
