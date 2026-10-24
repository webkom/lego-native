import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { Typography } from 'heroui-native';
import InfoCard from './info-card';

type EventDatetimeProps = {
  startTime?: Date | null;
  endTime?: Date | null;
};

const EventDatetime = ({ startTime, endTime }: EventDatetimeProps) => {
  return (
    <InfoCard
      title="Tid"
      icon="Calendar"
      iconContainerClassName="bg-sky-500/15 dark:bg-sky-500/25"
      iconClassName="text-sky-600 dark:text-sky-400">
      <Typography type="body-sm" className="font-bold capitalize">
        {startTime ? format(startTime, 'EEEE d. MMM', { locale: nb }) : 'TBA'}
      </Typography>
      <Typography type="body-xs" className="text-default-soft-foreground" numberOfLines={1}>
        {startTime && endTime
          ? `kl. ${format(startTime, 'HH:mm')} - ${format(endTime, 'HH:mm')}`
          : 'Tid ikke satt'}
      </Typography>
    </InfoCard>
  );
};

export default EventDatetime;
