import React, { useState } from "react";
import {
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  Button,
  Center,
  Image,
  Alert,
  HStack,
  IconButton,
  CloseIcon,
  Collapse,
  ScrollView,
} from "native-base";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    textAlign: "center",
  },
});

const image = require("../assets/abakus.png");

function LoginForm() {
  const [show, setShow] = useState(false);
  const WrongInformationGivenError = (
    <Collapse isOpen={show} duration={20}>
      <Alert
        w="285"
        status="error"
        marginTop="5"
        onTouchEndCapture={() => setShow(false)}
      >
        <VStack space={1} flexShrink={1} w="100%">
          <HStack
            flexShrink={1}
            space={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <HStack space={2} flexShrink={1} alignItems="center">
              <Alert.Icon />
              <Text fontSize="md" color="coolGray.800">
                Feil brukernavn eller passord
              </Text>
            </HStack>
            <IconButton
              variant="unstyled"
              _focus={{
                borderWidth: 0,
              }}
              icon={<CloseIcon size="3" />}
              _icon={{
                color: "coolGray.600",
              }}
            />
          </HStack>
        </VStack>
      </Alert>
    </Collapse>
  );
  return (
    <ScrollView w="100%" h="80">
      <Center w="100%">
        <Box safeArea p="2" py="8" w="90%" maxW="290">
          <Image source={image} alt="Alternate Text" width={80} height={55} />
          {WrongInformationGivenError}
          <Heading
            size="lg"
            fontWeight="600"
            color="coolGray.800"
            _dark={{
              color: "warmGray.50",
            }}
            style={styles.container}
          >
            <Text>Login</Text>
          </Heading>
          <VStack space={3} mt="5">
            <FormControl>
              <FormControl.Label>
                <Text>Brukernavn</Text>
              </FormControl.Label>
              <Input />
            </FormControl>
            <FormControl>
              <FormControl.Label>
                <Text>Passord</Text>
              </FormControl.Label>
              <Input type="password" />
            </FormControl>
            <Button mt="1" colorScheme="red" onPress={() => setShow(true)}>
              <Text>Logg inn</Text>
            </Button>
          </VStack>
        </Box>
      </Center>
    </ScrollView>
  );
}

export default LoginForm;
