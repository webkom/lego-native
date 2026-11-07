import EventItem from '@/components/event-item';
import { cn, Skeleton, Typography } from 'heroui-native';
import { ComponentProps } from 'react';
import { View } from 'react-native';
import { EventDigestItem } from '../../event/types';

type EventsDigestProps = {
  socialEvents?: EventDigestItem[];
  presentations?: EventDigestItem[];
} & ComponentProps<typeof View>;

const EventsDigest = ({ socialEvents, presentations, className, ...props }: EventsDigestProps) => {
  const sections = [
    { title: 'Bedpres og kurs', data: presentations },
    { title: 'Sosialt', data: socialEvents },
  ];

  return (
    <View className={cn('flex w-full flex-col gap-4', className)} {...props}>
      {socialEvents === undefined && (
        <>
          <Skeleton className="w-30 h-5 rounded-lg" />
          <View className="flex w-full flex-col gap-1">
            <Skeleton className="h-17 w-full rounded-2xl" />
            <Skeleton className="h-17 w-full rounded-2xl" />
            <Skeleton className="h-17 w-full rounded-2xl" />
          </View>
        </>
      )}
      {presentations === undefined && (
        <>
          <Skeleton className="w-30 h-5 rounded-lg" />
          <View className="flex w-full flex-col gap-1">
            <Skeleton className="h-17 w-full rounded-2xl" />
            <Skeleton className="h-17 w-full rounded-2xl" />
            <Skeleton className="h-17 w-full rounded-2xl" />
          </View>
        </>
      )}
      {presentations !== undefined &&
        socialEvents !== undefined &&
        sections.map(({ title, data }) => (
          <View key={title} className="flex flex-col gap-1">
            <Typography type="h4">{title}</Typography>
            {data?.map((item) => (
              <EventItem key={item.id.toString()} {...item} />
            ))}
          </View>
        ))}
    </View>
  );
};

export default EventsDigest;
