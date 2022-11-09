import React from "react";
import { NativeBaseProvider } from "native-base";
import EventList from "../components/Admissions/EventList";

function Events() {
  return (
    <NativeBaseProvider>
      <EventList />
    </NativeBaseProvider>
  );
}

export default Events;
