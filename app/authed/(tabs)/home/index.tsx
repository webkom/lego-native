import EventsDigest from '@/components/screens/home/events-digest';
import Poll from '@/components/screens/home/poll';
import { useEvents } from '@/lib/hooks/useEvents';
import { Image as ExpoImage } from 'expo-image';
import { useTheme } from 'expo-router/react-navigation';
import { RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';

const SafeAreaView = withUniwind(RNSafeAreaView);
const Image = withUniwind(ExpoImage);

const HomePage = () => {
  const theme = useTheme();
  const { data: events, refetch, isRefetching } = useEvents();
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
    <SafeAreaView edges={['left', 'right']} className="h-full w-full flex-1">
      <ScrollView
        className="w-full flex-1"
        contentContainerClassName="flex flex-col justify-start gap-5 px-4 pb-28"
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}>
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

        <EventsDigest presentations={presentations} socialEvents={other} />

        <Poll />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomePage;
