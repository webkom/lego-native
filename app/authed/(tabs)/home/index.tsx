import EventsDigest from '@/components/screens/home/events-digest';
import { useEvents } from '@/lib/hooks/useEvents';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  return (
    <>
      <SafeAreaView className="flex h-full w-full items-center justify-center px-4">
        <EventsDigest
          isRefetching={isRefetching}
          onRefetch={refetch}
          events={allEvents}
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
