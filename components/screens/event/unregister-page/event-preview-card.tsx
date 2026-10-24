import Icon from '@/components/icon';
import { EventTypeConfig } from '@/lib/types/eventColors';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { Card, Chip, Typography } from 'heroui-native';
import React from 'react';
import { Text, View } from 'react-native';

type UnregisterEventCardProps = {
  event: any;
  isWaitlisted: boolean;
};

export function UnregisterEventCard({ event, isWaitlisted }: UnregisterEventCardProps) {
  const config = event?.eventType
    ? EventTypeConfig[event.eventType as keyof typeof EventTypeConfig]
    : undefined;

  return (
    <Card className="border-border/80 bg-surface/70 w-full overflow-hidden border p-4 shadow-sm">
      <View className="flex-row items-center justify-between gap-2">
        {config && (
          <Chip size="sm" variant="soft" style={{ backgroundColor: `${config.color}25` }}>
            <Text style={{ color: config.color }} className="text-xs font-semibold">
              {config.displayName}
            </Text>
          </Chip>
        )}
        {isWaitlisted ? (
          <Chip size="sm" variant="secondary" color="warning">
            Venteliste
          </Chip>
        ) : (
          <Chip size="sm" variant="secondary" color="accent">
            Påmeldt
          </Chip>
        )}
      </View>

      <Typography type="h3" className="mt-2.5 font-bold" numberOfLines={2}>
        {event.title}
      </Typography>

      {event.startTime && (
        <View className="mt-2 flex-row items-center gap-1.5">
          <Icon name="CalendarDays" size={14} className="text-default-foreground" />
          <Typography type="body-xs" className="text-muted-foreground">
            {format(new Date(event.startTime), "EEEE d. MMMM 'kl.' HH:mm", {
              locale: nb,
            })}
          </Typography>
        </View>
      )}

      {event.location && (
        <View className="mt-1 flex-row items-center gap-1.5">
          <Icon name="MapPin" size={14} className="text-default-foreground" />
          <Typography type="body-xs" className="text-muted-foreground" numberOfLines={1}>
            {event.location}
          </Typography>
        </View>
      )}
    </Card>
  );
}
