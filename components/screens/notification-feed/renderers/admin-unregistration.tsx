import type { ActivityRenderer } from '../types';
import { getEvents, joinValues } from './utils';
import { contextRender } from '../context-render';
import { Card, Typography } from 'heroui-native';
import Icon from '@/components/icon';

const AdminUnregistrationRenderer: ActivityRenderer = {
  Header: () => <Card.Title className="text-base">Fjernet av en administrator</Card.Title>,
  Content: ({ aggregatedActivity, tag: TagComponent }) => {
    const events = getEvents(aggregatedActivity);
    if (events.length === 0) return null;

    const eventTags = events
      .map((event) => {
        const render = event.contentType ? contextRender[event.contentType] : undefined;
        if (!render) return null;
        return <TagComponent key={event.id} {...render(event)} type="body-sm" />;
      })
      .filter(Boolean);

    if (eventTags.length === 0) return null;

    return (
      <Card.Body>
        <Typography type="body-sm">{joinValues(eventTags)}</Typography>
      </Card.Body>
    );
  },
  Icon: () => <Icon name="CalendarX" className="text-red-600" />,
  getNotificationUrl: (aggregatedActivity) => {
    const events = getEvents(aggregatedActivity);

    if (events.length !== 1) {
      return { link: '/authed/(tabs)/events', linkType: 'internal' };
    }

    const event = events[0];
    if (!event) {
      return { link: '/authed/(tabs)/events', linkType: 'internal' };
    }

    return { link: `/authed/(stacks)/event/${event.id}`, linkType: 'internal' };
  },
};

export default AdminUnregistrationRenderer;
