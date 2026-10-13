import type { ActivityRenderer, AggregatedFeedItem } from '../types';
import { Card, Typography } from 'heroui-native';
import Icon from '@/components/icon';

const getExtraContext = (aggregatedActivity: AggregatedFeedItem) =>
  aggregatedActivity.lastActivity.extraContext as { weight?: number; reason?: string };

const PenaltyRenderer: ActivityRenderer = {
  Header: ({ aggregatedActivity }) => {
    const { weight } = getExtraContext(aggregatedActivity);
    if (weight === undefined) return null;

    return (
      <Card.Title className="text-base">
        {'Du har fått '}
        <Typography className="text-red-600">
          {weight} prikk{Number(weight) > 1 ? 'er' : ''}
        </Typography>
      </Card.Title>
    );
  },
  Icon: () => <Icon name="CircleAlert" className="text-red-600" />,
  Content: ({ aggregatedActivity }) => {
    const { reason } = getExtraContext(aggregatedActivity);
    if (!reason) return null;

    return (
      <Card.Body>
        <Typography type="body-sm">{reason}</Typography>
      </Card.Body>
    );
  },
};

export default PenaltyRenderer;
