import Header from '@/components/header';
import Icon from '@/components/icon';
import EventsDigest from '@/components/screens/home/events-digest';
import PinnedArticle from '@/components/screens/home/pinned-article';
import Poll from '@/components/screens/home/poll';
import { useFrontPageData } from '@/lib/hooks/useFrontPageData';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { Link } from 'expo-router';
import { Button, Typography } from 'heroui-native';
import { RefreshControl, ScrollView, View } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';

const SafeAreaView = withUniwind(RNSafeAreaView);

const HomePage = () => {
  const { events, pinnedArticles, isRefetching, refetch } = useFrontPageData();
  const presentations = events
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

  const other = events
    .filter((e) => {
      const t = e.eventType;
      return t === 'other' || t === 'event' || t === 'social' || t === 'party' || t === 'gala';
    })
    .slice(0, 3);

  return (
    <SafeAreaView edges={['left', 'right']} className="h-full w-full flex-1">
      <ScrollView
        className="w-full flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="flex flex-col justify-start gap-5 pb-safe-offset-30"
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} progressViewOffset={50} />
        }>
        <Header />
        <View className="flex flex-col gap-5 px-4">
          <EventsDigest presentations={presentations} socialEvents={other} />
          {pinnedArticles?.[0] && (
            <PinnedArticle
              {...pinnedArticles[0]}
              createdAt={format(pinnedArticles[0].createdAt, 'd. LLL', { locale: nb })}
            />
          )}
          <View className="flex flex-col gap-1">
            <Poll />
            <Link href="authed/(stacks)/polls" asChild>
              <Button variant="secondary" size="sm">
                <Typography>Vis alle</Typography>
                <Icon name="ArrowRight" className="text-surface-secondary-foreground" size={16} />
              </Button>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomePage;
