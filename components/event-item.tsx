import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { Link } from 'expo-router';
import { Card } from 'heroui-native';
import { TouchableOpacity } from 'react-native';
import { EventTypeConfig } from '../lib/types/eventColors';
import type { components } from '../lib/types/schema';

type Event = components['schemas']['EventRead'];

interface EventItemProps {
  id: number;
  event: Event;
}

export default function EventItem({ id, event }: EventItemProps) {
  const eventColor = EventTypeConfig[event.eventType].color;

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
  const formattedStartTime = format(new Date(event.startTime), 'eeeeee dd. MMM HH:mm', {
    locale: nb,
  });

  return (
    <Link href={`/authed/(stacks)/event/${id}`} asChild>
      <TouchableOpacity className="w-full">
        <Card
          className="flex-row gap-3 border-2 py-2"
          style={{
            borderColor: eventColor,
          }}>
          <Card.Body className="flex-1">
            <Card.Title numberOfLines={1} className="whitespace-break-spaces">
              {event.title}
            </Card.Title>
            <Card.Description>{formattedStartTime}</Card.Description>
          </Card.Body>
        </Card>
      </TouchableOpacity>
    </Link>
  );

  // return (
  //   <Link href={`/authed/(stacks)/event/${id}`} asChild>
  //     <Button variant={'outline'} className="r-5 h-16 w-full rounded-xl active:bg-neutral-200">
  //       <View className="flex-row items-center justify-between">
  //         <View className="rounded-lg px-1 py-8" style={{ backgroundColor: eventColor }} />
  //         <View className="mx-3 flex-1">
  //           <Text className="text-lg font-medium text-gray-900" numberOfLines={1}>
  //             {event.title}
  //           </Text>
  //           <Text className="text-sm text-gray-600">{formattedStartTime}</Text>
  //         </View>
  //         <View className="flex flex-col">
  //           <Text>{registrationStatus}</Text>
  //           <Text
  //             className={
  //               event.eventStatusType === 'INFINITE'
  //                 ? 'hidden'
  //                 : 'rounded-xl bg-gray-200 px-2 py-1 font-semibold'
  //             }>
  //             {capacity}
  //           </Text>
  //         </View>
  //       </View>
  //     </Button>
  //   </Link>
  // );
}
