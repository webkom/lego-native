import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import Icon from '@/components/icon';
import { EventCategoryBadge } from './event-category-badge';
import { DetailedEvent } from '../types';
import { Typography } from 'heroui-native';

type TitleSectionProps = {
  event?: DetailedEvent;
  attendeesCount?: number;
  totalCapacity?: number;
  className?: string;
};

export function TitleSection({ event, className }: TitleSectionProps) {
  const responsibleGroupName = event?.responsibleGroup?.name;

  return (
    <View className={`gap-2.5 ${className ?? ''}`}>
      {/* Category & language badges */}
      <EventCategoryBadge
        eventType={event?.eventType}
        isForeignLanguage={event?.isForeignLanguage}
        isPriced={event?.isPriced}
      />

      {/* Main Title */}
      <Text className="text-foreground text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
        {event?.title}
      </Text>

      {/* Organizer Committee Subline */}
      {responsibleGroupName && (
        <View className="flex-row items-center gap-1.5">
          <Icon name="Shield" size={14} className="text-primary-foreground" />
          <Typography type="body-xs">
            I regi av{' '}
            <Typography type="body" className="font-semibold">
              {responsibleGroupName}
            </Typography>
          </Typography>
        </View>
      )}
    </View>
  );
}

export default TitleSection;
