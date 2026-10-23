import EventItem from '@/components/eventItem';
import { components } from '@/lib/types/schema';
import { cn } from 'heroui-native';
import { ComponentProps } from 'react';
import { View } from 'react-native';
import { FlatList, RefreshControl } from 'react-native-gesture-handler';

type EventsDigestProps = {
  events?: components['schemas']['EventRead'][];
  onEndReached?: () => void;
  isRefetching?: boolean;
  onRefetch?: () => void;
} & ComponentProps<typeof View>;
const EventsDigest = ({
  events,
  className,
  onEndReached,
  isRefetching = false,
  onRefetch,
  ...props
}: EventsDigestProps) => {
  return (
    <View className={cn('flex w-full flex-col gap-2.5', className)} {...props}>
      <FlatList
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={onRefetch} />}
        contentContainerClassName="gap-2.5"
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <EventItem id={item.id} event={item} />}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

export default EventsDigest;
