import EventsDigest from '@/components/screens/home/events-digest';
import Poll from '@/components/screens/home/poll';
import { useEvents } from '@/lib/hooks/useEvents';
import { Image as ExpoImage } from 'expo-image';
import { useTheme } from 'expo-router/react-navigation';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';

const SafeAreaView = withUniwind(RNSafeAreaView);
const Image = withUniwind(ExpoImage);

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
  const theme = useTheme();
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
        className="flex h-full w-full flex-1 justify-center gap-5 px-4">
        {theme.dark ? (
          <Image
            source={require('@/assets/images/abakus-logo-light.png')}
            className="w-50 mt-safe-offset-2 mb-5 h-10"
          />
        ) : (
          <Image
            source={require('@/assets/images/abakus-logo-dark.png')}
            className="w-50 mt-safe-offset-2 h-10"
          />
        )}
        <Poll />
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
