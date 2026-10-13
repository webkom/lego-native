import { components } from '@/lib/types/schema';
import { Typography } from 'heroui-native';
import type { ComponentProps, ComponentType, ReactElement } from 'react';

export type AggregatedFeedItem = components['schemas']['AggregatedMarkedFeed'];
export type FeedActivity = components['schemas']['FeedActivity'];

export type ContextValue = { contentType?: string; [key: string]: any };

export type TagProps = {
  link: string;
  text: string;
  linkableContent: boolean;
  profilePicture?: string;
  linkType?: 'internal' | 'external';
  type?: ComponentProps<typeof Typography>['type'];
};

export type TagComponent = (props: TagProps) => ReactElement;

export type NotificationUrl = {
  link: string;
  linkType: 'internal' | 'external';
};

export type ActivityRenderer = {
  Header: (props: {
    aggregatedActivity: AggregatedFeedItem;
    tag: TagComponent;
  }) => ReactElement | null;
  Content: (props: {
    aggregatedActivity: AggregatedFeedItem;
    tag: TagComponent;
  }) => ReactElement | null;
  Icon: ComponentType;
  getNotificationUrl?: (aggregatedActivity: AggregatedFeedItem) => NotificationUrl | undefined;
};
