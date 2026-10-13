import type { ActivityRenderer, AggregatedFeedItem, ContextValue, TagProps } from '../types';
import { contextRender } from '../context-render';
import { Card } from 'heroui-native';
import Icon from '@/components/icon';
import env from 'env';

const getActorAndObject = (aggregatedActivity: AggregatedFeedItem) => {
  const latestActivity = aggregatedActivity.lastActivity;
  const actorKey = latestActivity.actor;
  const objectKey = latestActivity.object;

  if (!actorKey) return { actor: undefined, object: undefined };

  const actor = aggregatedActivity.context[actorKey] as ContextValue | undefined;
  const object = aggregatedActivity.context[objectKey] as ContextValue | undefined;

  return { actor, object };
};

const AnnouncementRenderer: ActivityRenderer = {
  Header: ({ aggregatedActivity, tag: TagComponent }) => {
    const baseUrl = env.EXPO_PUBLIC_FRONTEND_URL;
    const { actor, object } = getActorAndObject(aggregatedActivity);
    if (!actor || !object) return null;

    let announcerTag: TagProps;

    if (object.fromGroup) {
      announcerTag = {
        link: `${baseUrl}/pages/komiteer/${object.fromGroup.id}/`,
        text: object.fromGroup.name,
        linkableContent: true,
        linkType: 'external',
      };
    } else {
      const actorRender = actor.contentType ? contextRender[actor.contentType] : undefined;
      if (!actorRender) return null;
      announcerTag = actorRender(actor);
    }

    return (
      <Card.Title>
        <TagComponent {...announcerTag} /> kunngjorde
      </Card.Title>
    );
  },
  Icon: () => <Icon name="Megaphone" className="text-red-600" />,
  Content: ({ aggregatedActivity, tag: TagComponent }) => {
    const { object } = getActorAndObject(aggregatedActivity);
    if (!object) return null;

    const objectRender = object.contentType ? contextRender[object.contentType] : undefined;
    if (!objectRender) return null;

    return (
      <Card.Body>
        <TagComponent {...objectRender(object)} />
      </Card.Body>
    );
  },
};

export default AnnouncementRenderer;
