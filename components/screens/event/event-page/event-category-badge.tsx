import Icon from '@/components/icon';
import { EventTypeConfig } from '@/lib/types/eventColors';
import { components } from '@/lib/types/schema';
import { cn } from '@/lib/utils';
import { View } from 'react-native';

import { Chip } from 'heroui-native';

type EventTypeEnum = components['schemas']['EventTypeEnum'];

interface EventCategoryBadgeProps {
  eventType?: EventTypeEnum;
  isForeignLanguage?: boolean;
  isPriced?: boolean;
  className?: string;
}

export function EventCategoryBadge({
  eventType,
  isForeignLanguage,
  isPriced,
  className,
}: EventCategoryBadgeProps) {
  const config = eventType ? EventTypeConfig[eventType] : undefined;

  return (
    <View className={cn('flex-row flex-wrap items-center gap-2', className)}>
      {config && (
        <Chip
          style={{
            backgroundColor: config.color,
          }}>
          <Chip.Label
            style={{
              color: config.textColor,
            }}>
            {config.displayName.toLocaleUpperCase()}
          </Chip.Label>
        </Chip>
      )}

      {isForeignLanguage && (
        <Chip variant="soft" color="accent" size="sm">
          <Icon name="Globe" size={12} className="text-accent" />
          <Chip.Label>English</Chip.Label>
        </Chip>
      )}

      {isPriced && (
        <Chip variant="soft" color="warning" size="sm">
          <Icon name="Receipt" size={12} className="text-warning" />
          <Chip.Label>Betalt</Chip.Label>
        </Chip>
      )}
    </View>
  );
}

export default EventCategoryBadge;
