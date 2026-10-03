import Icon from '@/components/icon';
import { Text } from '@/components/ui/text';
import { components } from '@/lib/types/schema';
import { cn } from '@/lib/utils';
import { format, isAfter } from 'date-fns';
import { nb } from 'date-fns/locale';
import { Card, Surface, Typography } from 'heroui-native';
import { View } from 'react-native';
import SectionTitle from '../section-title';
import PoolCard from './pool-card';

export type RegistrationPool = components['schemas']['PoolRead'] & {
  registrations?: {
    id?: number;
    user?: {
      id?: number;
      fullName?: string;
      username?: string;
      grade?: string;
      abakusGroup?: { name?: string };
    };
  }[];
};

export type RegistrationPoolsProps = {
  pools?: RegistrationPool[];
  waitingRegistrationCount?: number | string;
  mergeTime?: string | null;
  className?: string;
};

export function RegistrationPools({
  pools = [],
  waitingRegistrationCount,
  mergeTime,
  className,
}: RegistrationPoolsProps) {
  const waitingCount =
    typeof waitingRegistrationCount === 'number'
      ? waitingRegistrationCount
      : parseInt(waitingRegistrationCount ?? '0', 10) || 0;

  if (!pools || pools.length === 0) {
    return null;
  }

  const totalCapacity = pools.reduce((acc, pool) => {
    return acc + (pool.capacity ? Number(pool.capacity) : 0);
  }, 0);

  const totalRegistered = pools.reduce((acc, pool) => {
    return acc + (pool.registrationCount ? Number(pool.registrationCount) : 0);
  }, 0);

  const formattedMergeTime = mergeTime ? new Date(mergeTime) : null;
  const isMergeTimeValid = formattedMergeTime && !isNaN(formattedMergeTime.getTime());
  const hasMerged = isMergeTimeValid && !isAfter(formattedMergeTime, new Date());

  return (
    <Surface>
      <View className={cn('flex flex-col gap-3', className)}>
        {/* Header Section */}
        <View className="flex-row items-baseline justify-between px-1">
          <SectionTitle icon="Users" title="Påmeldingsgrupper" />

          <Typography type="body-xs" className="text-accent-foreground font-medium">
            {totalRegistered} / {totalCapacity > 0 ? `${totalCapacity}` : '∞'} plasser
          </Typography>
        </View>

        {/* Pool Cards */}
        {!hasMerged &&
          pools.map((pool) => {
            return <PoolCard pool={pool} key={pool.id + 'pool'} />;
          })}

        {hasMerged && (
          <PoolCard
            pool={{
              id: 0,
              name: 'Deltakere',
              capacity: pools.reduce((acc, pool) => acc + (pool.capacity || 0), 0),
              registrationCount: String(
                pools.reduce((acc, pool) => acc + (Number(pool.registrationCount) || 0), 0)
              ),
              activationDate: pools[0]?.activationDate as string,
              permissionGroups: pools.flatMap((pool) => pool.permissionGroups || []),
              registrations: pools.flatMap((pool) => pool.registrations || []),
            }}
          />
        )}

        {/* Waitlist Card */}
      </View>
    </Surface>
  );
}

export default RegistrationPools;
