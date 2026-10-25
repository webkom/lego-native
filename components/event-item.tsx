import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { Link } from 'expo-router';
import { Card } from 'heroui-native';
import { TouchableOpacity, View } from 'react-native';
import { EventTypeConfig } from '../lib/types/eventColors';
import type { components } from '../lib/types/schema';
import { LinearGradient } from 'expo-linear-gradient';

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
        <Card className="flex-row gap-3 border-2 py-0">
          <LinearGradient
            className="absolute left-0 top-0 h-full w-4/5 opacity-30"
            colors={[eventColor, `${eventColor}00`]}
            dither
            end={{ x: 1, y: 0 }}
          />
          <Card.Body className="relative flex-1 flex-row gap-3 py-2">
            {/* <View
              className="absolute left-0 top-0 h-full w-1/2"
              style={{
                experimental_backgroundImage: `linear-gradient(to right, ${eventColor}, ${eventColor}00)`,
              }}
            /> */}
            <View
              className="h-full w-2 rounded-full"
              style={{
                backgroundColor: eventColor,
              }}
            />
            <View className="flex flex-col">
              <Card.Title numberOfLines={1} className="whitespace-break-spaces">
                {event.title}
              </Card.Title>
              <Card.Description className="text-foreground">{formattedStartTime}</Card.Description>
            </View>
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
