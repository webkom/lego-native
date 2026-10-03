import React from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import EventItem from '../../../../components/eventItem';
import { StatusBar } from 'expo-status-bar';
import Header from '@/components/header';
import type { components } from '@/lib/types/schema';
import { useEvents } from '@/lib/hooks/useEvents';
import { EVENTS_LIMIT, others, presentations } from '@/lib/constants/events';

type EventTypeEnum = components['schemas']['EventTypeEnum'];

const EventsPage = () => {
  const events = useEvents();

  if (events.isLoading) {
    return (
      <View className="h-full flex-row items-center justify-center space-x-3">
        <StatusBar style="auto" />
        <ActivityIndicator size="large" color="#dc2626" />
        <Text className="text-xl font-semibold text-red-600">Laster inn...</Text>
      </View>
    );
  }

  if (events.isError || !events.data) {
    return (
      <View className="flex-1 items-center justify-center">
        <StatusBar style="auto" />
        <Text className="text-base text-red-600">Klarer ikke å laste inn arrangementer.</Text>
      </View>
    );
  }

  const mapEvents = (eventTypes: EventTypeEnum[]) => {
    return events.data.results
      .filter((event) => eventTypes.includes(event.eventType))
      .slice(0, EVENTS_LIMIT)
      .map((event) => <EventItem key={event.id} id={event.id} event={event} />);
  };

  const eventPresentations = mapEvents(presentations);
  const eventOthers = mapEvents(others);

  return (
    <>
      <Header className="bg-background" />
      <Text className="bg-background p-4 text-4xl font-bold">Arrangementer</Text>
      <ScrollView className="bg-background mb-20 h-4/5 w-full flex-1">
        <Text className="pl-4 text-2xl font-semibold">Bedpres og kurs</Text>
        <View className="mb-5 flex-col items-center gap-2.5 space-y-5 p-4">
          {eventPresentations}
        </View>
        <Text className="pl-4 text-2xl font-semibold">Sosialt</Text>
        <View className="flex-col items-center gap-2.5 space-y-5 p-4">{eventOthers}</View>
      </ScrollView>
    </>
  );
};

export default EventsPage;
