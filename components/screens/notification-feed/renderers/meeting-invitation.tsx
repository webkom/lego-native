import type { ActivityRenderer, AggregatedFeedItem, ContextValue, FeedActivity } from '../types';
import { contextRender } from '../context-render';
import { joinValues } from './utils';
import { Card, Typography } from 'heroui-native';
import Icon from '@/components/icon';
import env from 'env';

const getContextValue = (aggregatedActivity: AggregatedFeedItem, key?: string | null) =>
  key ? (aggregatedActivity.context[key] as ContextValue | undefined) : undefined;

const getMeetingInvitations = (aggregatedActivity: AggregatedFeedItem): ContextValue[] =>
  aggregatedActivity.activities
    .map((activity: FeedActivity) => getContextValue(aggregatedActivity, activity.object))
    .filter((invitation: ContextValue | undefined): invitation is ContextValue =>
      Boolean(invitation)
    );

const getActor = (aggregatedActivity: AggregatedFeedItem) =>
  getContextValue(aggregatedActivity, aggregatedActivity.lastActivity.actor);

const MeetingInvitationRenderer: ActivityRenderer = {
  Header: ({ aggregatedActivity, tag: TagComponent }) => {
    const actor = getActor(aggregatedActivity);
    if (!actor) return null;

    const actorRender = actor.contentType ? contextRender[actor.contentType] : undefined;
    if (!actorRender) return null;

    const actorTag = actorRender(actor);

    return (
      <Card.Title className="text-base">
        <TagComponent {...actorTag} /> inviterte deg
      </Card.Title>
    );
  },
  Content: ({ aggregatedActivity, tag: TagComponent }) => {
    const meetingTags = getMeetingInvitations(aggregatedActivity)
      .map((invitation) => {
        const render = invitation.contentType ? contextRender[invitation.contentType] : undefined;
        if (!render) return null;
        return <TagComponent key={invitation.id} {...render(invitation)} type="body-sm" />;
      })
      .filter(Boolean);

    if (meetingTags.length === 0) return null;

    return (
      <Card.Body>
        <Typography>{joinValues(meetingTags)}</Typography>
      </Card.Body>
    );
  },
  Icon: () => <Icon name="CalendarPlus" className="text-red-600" />,
  getNotificationUrl: (aggregatedActivity) => {
    const baseUrl = env.EXPO_PUBLIC_FRONTEND_URL;
    const [invitation, ...rest] = getMeetingInvitations(aggregatedActivity);

    if (!invitation || rest.length > 0) {
      return { link: `${baseUrl}/meetings`, linkType: 'external' };
    }

    return {
      link: `${baseUrl}/meetings/${invitation.meeting.id}/`,
      linkType: 'external',
    };
  },
};

export default MeetingInvitationRenderer;
