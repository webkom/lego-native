import Icon from '@/components/icon';
import { Text } from '@/components/ui/text';
import * as Linking from 'expo-linking';
import { Image, TouchableOpacity, View } from 'react-native';
import { DetailedEvent } from '../types';
import EventDatetime from './event-datetime';
import InfoCard from './info-card';
import SectionTitle from './section-title';

const MazeMapLogo = require('@/assets/images/mazemaplogo.png');

interface EventQuickFactsProps {
  event?: DetailedEvent;
  attendeesCount: number;
  totalCapacity?: number;
  className?: string;
}

export function EventQuickFacts({
  event,
  attendeesCount,
  totalCapacity,
  className,
}: EventQuickFactsProps) {
  const startTime = event?.startTime ? new Date(event.startTime) : null;
  const endTime = event?.endTime ? new Date(event.endTime) : null;

  const openMazeMapLink = (link: string) => {
    // Open the MazeMap link in a web browser
    Linking.openURL(link).catch((err) => console.error('Failed to open MazeMap link: ', err));
  };

  const priceDisplay = event?.isPriced
    ? event.priceMember
      ? `${event.priceMember / 100} kr`
      : event.price
        ? `${event.price} kr`
        : 'Betalt'
    : 'Gratis';

  return (
    <View className={className}>
      <SectionTitle title="Fire kjappe" icon="BadgeInfo" className="mb-3" />
      <View className="shrink-0 flex-row gap-2.5">
        {/* 1. Tidspunkt */}
        <EventDatetime startTime={startTime} endTime={endTime} />
        {/* 2. Sted */}
        <TouchableOpacity
          className="flex-1 shrink-0"
          onPress={() => {
            if (event?.mazemapPoi) {
              openMazeMapLink(
                `https://use.mazemap.com/#v=1&sharepoitype=poi&sharepoi=${event?.mazemapPoi}`
              );
            }
          }}>
          <InfoCard
            icon={!event?.mazemapPoi ? 'MapPin' : undefined}
            iconComponent={
              event?.mazemapPoi ? (
                <Image source={MazeMapLogo} width={40} height={40} className="h-4 w-4" />
              ) : undefined
            }
            title="Sted">
            <Text className="text-foreground text-sm font-bold" numberOfLines={1}>
              {event?.location || 'TBA'}
            </Text>
            {event?.mazemapPoi && (
              <View className="flex-row items-center gap-1">
                <Text className="text-primary text-xs font-semibold underline">MazeMap</Text>
                <Icon name="ArrowUpRight" size={12} className="text-primary" />
              </View>
            )}
          </InfoCard>
        </TouchableOpacity>
      </View>

      <View className="mt-2.5 flex-row gap-2.5">
        {/* 3. Pris */}
        <InfoCard title="Pris" icon="Ticket">
          <Text className="text-foreground text-sm font-bold" numberOfLines={1}>
            {priceDisplay}
          </Text>
        </InfoCard>

        {/* 4. Kapasitet */}
        <InfoCard title="Kapasitet" icon="Users">
          <Text className="text-foreground text-sm font-bold" numberOfLines={1}>
            {totalCapacity !== undefined
              ? `${attendeesCount} / ${totalCapacity}`
              : 'Ingen påmelding'}
          </Text>
        </InfoCard>
      </View>
    </View>
  );
}

export default EventQuickFacts;
