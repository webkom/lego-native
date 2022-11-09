import React from "react";
import moment from "moment";
import { Box, Flex, Text, Image, Link } from "native-base";
import { EVENT_CONSTANTS } from "../../lib/types";

function EventItem(
  id: number,
  title: string,
  cover: string,
  location: string,
  eventType: string,
  startTime: string
) {
  const eventTypeToString = (eventT: string) => {
    return EVENT_CONSTANTS[eventT] || EVENT_CONSTANTS.other;
  };

  return (
    <Link href={`https://abakus.no/events/${id}`} isExternal key={id}>
      <Box
        rounded="8"
        overflow="hidden"
        borderWidth="3"
        borderColor="red.900"
        width="365"
        height="260"
        shadow="30"
        bg="white"
        key={id}
        alignItems="center"
      >
        <Image
          source={{ uri: cover }}
          alt="Alternate Text"
          width="100%"
          height={110}
        />
        <Text
          color="coolGray.800"
          mt="3"
          fontWeight="medium"
          fontSize="xl"
          textAlign="center"
        >
          {title}
        </Text>
        <Text mt="2" fontSize="sm" textAlign="center" color="coolGray.700">
          {`${moment(startTime)
            .utc(true)
            .format("MMM.Do.HH:mm")} ⊙ ${location} ⊙ ${eventTypeToString(
            eventType
          )}`}
        </Text>
        <Flex>
          <Text mt="2" fontSize={18} fontWeight="medium" color="red.900">
            Til Påmelding
          </Text>
        </Flex>
      </Box>
    </Link>
  );
}

export default EventItem;
