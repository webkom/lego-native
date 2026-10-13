import { Pressable, View } from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import { nb } from 'date-fns/locale';
import type { ActivityRenderer, AggregatedFeedItem } from './types';
import { Tag, navigateToTag } from './tag';
import { Card, Typography } from 'heroui-native';

type ActivityProps = {
  aggregatedActivity: AggregatedFeedItem;
  activityRenderer: ActivityRenderer;
  isNew?: boolean;
};

const Activity = ({ aggregatedActivity, activityRenderer, isNew = false }: ActivityProps) => {
  const { Header, Content, Icon, getNotificationUrl } = activityRenderer;

  const destination = getNotificationUrl?.(aggregatedActivity);
  const isPressable = !!destination;

  const timeAgo = formatDistanceToNow(new Date(aggregatedActivity.lastActivity.time), {
    addSuffix: true,
    locale: nb,
  });

  return (
    <Pressable
      disabled={!isPressable}
      accessibilityRole={isPressable ? 'button' : undefined}
      onPress={() => destination && navigateToTag(destination)}>
      {({ pressed }) => (
        <Card
          className={`m-2 gap-2 overflow-hidden ${
            pressed && isPressable ? 'bg-gray-100' : isNew ? 'bg-red-50' : ''
          }`}>
          {isNew && <View className="absolute inset-y-1 left-0 w-1.5 bg-red-600" />}
          <Card.Header>
            <View className="flex-row items-center gap-3">
              {Icon && (
                <View className="size-9 items-center justify-center rounded-full bg-red-100">
                  <Icon />
                </View>
              )}
              <View className="flex-1">
                <Header aggregatedActivity={aggregatedActivity} tag={Tag} />
              </View>
            </View>
          </Card.Header>
          {Content && <Content aggregatedActivity={aggregatedActivity} tag={Tag} />}
          <Card.Footer>
            <Typography type="body-xs" className="text-gray-500">
              for {timeAgo}
            </Typography>
          </Card.Footer>
        </Card>
      )}
    </Pressable>
  );
};

export default Activity;
