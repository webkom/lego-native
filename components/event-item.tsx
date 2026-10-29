import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { Card } from 'heroui-native';
import { TouchableOpacity, View } from 'react-native';
import { EventTypeConfig } from '../lib/types/eventColors';
import { EventDigestItem } from './screens/event/types';

type EventItemProps = {} & EventDigestItem;

export default function EventItem({ id, eventType, startTime, title }: EventItemProps) {
  const eventColor = EventTypeConfig[eventType].color;

  // const isAdmitted = String(event.isAdmitted) === 'true';

  // const getRegistrationStatus = () => {
  //   if (event.eventStatusType === 'OPEN' || event.eventStatusType === 'INFINITE') {
  //     return 'Åpent for alle';
  //   }
  //   if (isAdmitted) {
  //     return 'Påmeldt';
  //   }
  //   if (event.userReg && event.eventStatusType === 'NORMAL') {
  //     return 'På venteliste';
  //   }
  //   if (event.activationTime) {
  //     if (new Date(event.activationTime) > new Date()) {
  //       return 'Snart åpent';
  //     }
  //     return 'Åpnet';
  //   }
  //   return 'Kan ikke melde på';
  // };

  // const getCapacity = () => {
  //   if (!Number(event.registrationCount)) {
  //     return `${event.totalCapacity} PLASSER`;
  //   }
  //   return `${event.registrationCount} / ${event.totalCapacity}`;
  // };

  // const registrationStatus = getRegistrationStatus();
  // const capacity = getCapacity();
  const formattedStartTime = format(new Date(startTime), 'eeeeee dd. MMM HH:mm', {
    locale: nb,
  });

  console.log('Event color: ' + eventColor);

  return (
    <Link href={`/authed/(stacks)/event/${id}`} asChild>
      <TouchableOpacity className="w-full">
        <Card className="flex-row gap-3 py-0">
          <LinearGradient
            className="absolute left-0 top-0 h-full w-4/5 opacity-30"
            colors={[eventColor, `${eventColor}00`]}
            dither
            end={{ x: 1, y: 0 }}
          />
          <Card.Body className="relative flex-1 flex-row gap-3 py-2">
            <View
              className="h-full w-2 rounded-full"
              style={{
                backgroundColor: eventColor,
              }}
            />
            <View className="flex flex-col">
              <Card.Title numberOfLines={1} className="whitespace-break-spaces">
                {title}
              </Card.Title>
              <Card.Description className="text-foreground">{formattedStartTime}</Card.Description>
            </View>
          </Card.Body>
        </Card>
      </TouchableOpacity>
    </Link>
  );
}
