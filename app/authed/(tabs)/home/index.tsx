import EventsDigest from '@/components/screens/home/events-digest';
import { useEvents } from '@/lib/hooks/useEvents';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';

const SafeAreaView = withUniwind(RNSafeAreaView);

// const presentations = mapEvents([
//     EventType.COMPANY_PRESENTATION,
//     EventType.LUNCH_PRESENTATION,
//     EventType.ALTERNATIVE_PRESENTATION,
//     EventType.COURSE,
//     EventType.BREAKFAST_TALK,
//     EventType.NEXUS_EVENT,
//   ]);
//   const other = mapEvents([
//     EventType.OTHER,
//     EventType.EVENT,
//     EventType.SOCIAL,
//     EventType.PARTY,
//     EventType.GALA,
//   ]);

const HomePage = () => {
  const {
    data: events,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    isRefetching,
  } = useEvents();
  const allEvents = events?.pages.flatMap((page) => page.results) ?? [];
  const presentations = allEvents
    .filter((e) => {
      const t = e.eventType;
      return (
        t === 'company_presentation' ||
        t === 'lunch_presentation' ||
        t === 'alternative_presentation' ||
        t === 'course' ||
        t === 'breakfast_talk' ||
        t === 'nexus_event'
      );
    })
    .slice(0, 3);

  const other = allEvents
    .filter((e) => {
      const t = e.eventType;
      return t === 'other' || t === 'event' || t === 'social' || t === 'party' || t === 'gala';
    })
    .slice(0, 3);

  return (
    <>
      <SafeAreaView
        edges={['left', 'right']}
        className="flex h-full w-full flex-1 items-center justify-center px-4">
        <EventsDigest
          isRefetching={isRefetching}
          onRefetch={refetch}
          presentations={presentations}
          socialEvents={other}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
        />
      </SafeAreaView>
    </>
  );
};

export default HomePage;
