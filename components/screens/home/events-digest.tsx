import EventItem from '@/components/eventItem';
import { components } from '@/lib/types/schema';
import { cn, Typography } from 'heroui-native';
import { ComponentProps } from 'react';
import { SectionList, View } from 'react-native';
import { RefreshControl } from 'react-native-gesture-handler';

type EventsDigestProps = {
  socialEvents?: components['schemas']['EventRead'][];
  presentations?: components['schemas']['EventRead'][];
  onEndReached?: () => void;
  isRefetching?: boolean;
  onRefetch?: () => void;
} & ComponentProps<typeof View>;
const EventsDigest = ({
  socialEvents = [],
  presentations = [],
  className,
  onEndReached,
  isRefetching = false,
  onRefetch,
  ...props
}: EventsDigestProps) => {
  const sections = [
    { title: 'Bedpres og kurs', data: presentations },
    { title: 'Sosialt', data: socialEvents },
  ];

  return (
    <View className={cn('flex h-full w-full flex-1 flex-col', className)} {...props}>
      <SectionList
        className="w-full flex-1"
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        contentContainerClassName="gap-2.5 pb-4 py-safe-offset-4"
        stickySectionHeadersEnabled={false}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={onRefetch} />}
        renderSectionHeader={({ section: { title } }) => <Typography>{title}</Typography>}
        renderItem={({ item }) => <EventItem id={item.id} event={item} />}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

export default EventsDigest;
