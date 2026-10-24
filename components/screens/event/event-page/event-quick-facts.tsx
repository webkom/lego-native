import Icon from '@/components/icon';
import { Text } from '@/components/ui/text';
import * as Linking from 'expo-linking';
import { Image, TouchableOpacity, View } from 'react-native';
import { DetailedEvent } from '../types';
import EventDatetime from './event-datetime';
import InfoCard from './info-card';
import SectionTitle from './section-title';
import { Chip } from 'heroui-native';

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

  const isFree = !event?.isPriced;
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
      <View className="flex-row gap-2.5">
        {/* 1. Tidspunkt */}
        <View className="flex-1">
          <EventDatetime startTime={startTime} endTime={endTime} />
        </View>
        {/* 2. Sted */}
        <TouchableOpacity
          className="flex-1"
          onPress={() => {
            if (event?.mazemapPoi) {
              openMazeMapLink(
                `https://use.mazemap.com/#v=1&sharepoitype=poi&sharepoi=${event?.mazemapPoi}`
              );
            }
          }}>
          <InfoCard
            icon={!event?.mazemapPoi ? 'MapPin' : undefined}
            iconContainerClassName="bg-emerald-500/15 dark:bg-emerald-500/25"
            iconClassName="text-emerald-600 dark:text-emerald-400"
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
                <Text className="text-xs font-semibold text-emerald-600 underline dark:text-emerald-400">
                  MazeMap
                </Text>
                <Icon
                  name="ArrowUpRight"
                  size={12}
                  className="text-emerald-600 dark:text-emerald-400"
                />
              </View>
            )}
          </InfoCard>
        </TouchableOpacity>
      </View>

      <View className="mt-2.5 flex-row gap-2.5">
        {/* 3. Pris */}
        <InfoCard
          title="Pris"
          icon="Ticket"
          iconContainerClassName={
            isFree
              ? 'bg-emerald-500/15 dark:bg-emerald-500/25'
              : 'bg-amber-500/15 dark:bg-amber-500/25'
          }
          iconClassName={
            isFree ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
          }>
          {isFree ? (
            <View className="flex-row items-center">
              <Chip size="sm" variant="soft" color="success">
                <Chip.Label className="font-bold">Gratis</Chip.Label>
              </Chip>
            </View>
          ) : (
            <Text className="text-foreground text-sm font-bold" numberOfLines={1}>
              {priceDisplay}
            </Text>
          )}
        </InfoCard>

        {/* 4. Kapasitet */}
        <InfoCard
          title="Kapasitet"
          icon="Users"
          iconContainerClassName="bg-violet-500/15 dark:bg-violet-500/25"
          iconClassName="text-violet-600 dark:text-violet-400">
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
