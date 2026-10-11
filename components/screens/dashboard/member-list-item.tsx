import { cn } from '@/lib/cn';
import type { MemberWithWorkingStats } from '@/lib/types/dashboard';
import { Avatar, Card } from 'heroui-native';
import React, { ComponentProps } from 'react';
import { View } from 'react-native';
import { DurationBadge } from './presence-badge';
import { StatItem } from './stat-item';

type MemberListItemProps = {
  member: MemberWithWorkingStats;
} & ComponentProps<typeof Card>;

export const MemberListItem = ({ member, className, ...props }: MemberListItemProps) => {
  const fallbackInitials =
    member.name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase() || 'WK';

  return (
    <Card
      variant="default"
      className={cn(
        'flex-row items-center gap-3.5 p-3.5',
        member.isPresent && 'bg-success-soft border-success',
        className
      )}
      {...props}>
      <Avatar size="md">
        <Avatar.Image source={{ uri: member.avatar }} />
        <Avatar.Fallback>{fallbackInitials}</Avatar.Fallback>
      </Avatar>

      <Card.Body className="flex-1">
        <View className="flex-row items-center justify-between">
          <Card.Title className="text-base font-semibold">{member.name}</Card.Title>
          {member.isPresent && <DurationBadge duration={member.sessionDurationFormatted} />}
        </View>

        <View className="mt-1 flex-row items-center gap-4">
          <StatItem label="Totalt" value={member.totalHoursFormatted} />
        </View>
      </Card.Body>
    </Card>
  );
};
