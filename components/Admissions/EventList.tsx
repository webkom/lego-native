import React from "react";
import {
  ScrollView,
  VStack,
  Text,
  HStack,
  Spinner,
  Heading,
} from "native-base";
import EventItem from "./EventItem";
import useEvents from "../Hooks/useEvents";

function EventList() {
  const result = useEvents();

  if (result.isLoading) {
    return (
      <HStack space={2} justifyContent="center" top="50%">
        <Spinner accessibilityLabel="Loading posts" color="red.600" size="lg" />
        <Heading color="primary.500" fontSize="xl">
          <Text color="red.600">Loading</Text>
        </Heading>
      </HStack>
    );
  }

  if (result.isError) {
    return <Text>Error....</Text>;
  }

  return (
    <ScrollView w="100%" h="80">
      <VStack space={10} alignItems="center">
        {result.data.map((event) =>
          EventItem(
            event.id,
            event.title,
            event.cover,
            event.location,
            event.eventType,
            event.startTime
          )
        )}
      </VStack>
    </ScrollView>
  );
}

export default EventList;
