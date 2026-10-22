import Icon from '@/components/icon';
import { Text } from '@/components/ui/text';
import { Chip } from 'heroui-native';
import { View } from 'react-native';
import { DetailedEvent } from '../types';
import { EventCategoryBadge } from './event-category-badge';
import { AnimatePresence, MotiView } from 'moti';

type TitleSectionProps = {
  event?: DetailedEvent;
  attendeesCount?: number;
  totalCapacity?: number;
  className?: string;
  isRegistered?: boolean;
};

export function TitleSection({ event, className, isRegistered }: TitleSectionProps) {
  const responsibleGroupName = event?.responsibleGroup?.name;

  return (
    <View className={`gap-2.5 ${className ?? ''}`}>
      {/* Category & language badges */}
      <View className="flex flex-row gap-1">
        <EventCategoryBadge
          eventType={event?.eventType}
          isForeignLanguage={event?.isForeignLanguage}
          isPriced={event?.isPriced}
        />

        <AnimatePresence>
          {isRegistered && (
            <MotiView
              from={{
                opacity: 0,
                top: 10,
              }}
              animate={{
                opacity: 1,
                top: 0,
              }}
              exit={{
                opacity: 0,
                top: 10,
              }}
              className="overflow-hidden">
              <Chip color="success">
                <Icon name="Check" size={16} />
                <Chip.Label>PÅMELDT</Chip.Label>
              </Chip>
            </MotiView>
          )}
        </AnimatePresence>
      </View>

      {/* Main Title */}
      <Text className="text-foreground text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
        {event?.title}
      </Text>

      {/* Organizer Committee Subline */}
      {responsibleGroupName && (
        <View className="flex-row items-center gap-1.5 pt-0.5">
          <Chip variant="soft" color="accent" size="sm">
            <Icon name="Shield" size={12} className="text-accent" />
            <Chip.Label className="font-semibold">I regi av {responsibleGroupName}</Chip.Label>
          </Chip>
        </View>
      )}
    </View>
  );
}

export default TitleSection;
