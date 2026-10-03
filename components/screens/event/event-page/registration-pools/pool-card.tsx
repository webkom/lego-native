import Icon from '@/components/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { format, isAfter } from 'date-fns';
import { nb } from 'date-fns/locale';
import { Alert, Chip, Surface, Typography } from 'heroui-native';
import { useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { RegistrationPool } from './registration-pools';

type PoolCardProps = {
  pool: RegistrationPool;
};
const PoolCard = ({ pool }: PoolCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const capacity = pool.capacity ? Number(pool.capacity) : 0;
  const registered = pool.registrationCount ? Number(pool.registrationCount) : 0;
  const isFull = capacity > 0 && registered >= capacity;
  const percentage = useMemo(() => {
    return capacity > 0 ? Math.min(100, Math.round((registered / capacity) * 100)) : 0;
  }, [capacity, registered]);

  const activationDateObj = pool.activationDate ? new Date(pool.activationDate) : null;
  const isFutureActivation =
    activationDateObj &&
    !isNaN(activationDateObj.getTime()) &&
    isAfter(activationDateObj, new Date());

  const hasRegistrations = (pool.registrations?.length ?? 0) > 0;

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={() => setExpanded((prev) => !prev)}>
      <Surface variant="transparent" className="px-0">
        {/* Always Visible Collapsed Header */}
        <View className="gap-2.5">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Text className="text-foreground text-base font-semibold">{pool.name}</Text>

              {isFull && (
                <View className="bg-destructive/15 rounded px-2 py-0.5">
                  <Text className="text-destructive text-xs font-medium">Fullt</Text>
                </View>
              )}
            </View>

            <View className="flex-row items-center gap-2">
              <Typography type="body-sm" className=" font-bold">
                {registered} / {capacity > 0 ? capacity : '∞'}
              </Typography>
              <Icon
                name={expanded ? 'ChevronUp' : 'ChevronDown'}
                size={18}
                className="text-default-soft-foreground"
              />
            </View>
          </View>

          {/* Progress Bar */}
          {capacity > 0 && (
            <View className="bg-surface-tertiary h-2 w-full overflow-hidden rounded-full">
              <View
                className={cn(
                  'h-full rounded-full',
                  isFull ? 'bg-destructive' : percentage >= 80 ? 'bg-warning' : 'bg-primary'
                )}
                style={{ width: `${percentage}%` }}
              />
            </View>
          )}
        </View>

        {/* Expanded Details Section */}
        {expanded && (
          <View className="mt-1 gap-3 pt-3">
            {/* Future Activation Info */}
            {!isFutureActivation && (
              <Alert status="warning" className="shadow-transparent! shadow-none!">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>Påmelding er ikke åpen</Alert.Title>
                  <Alert.Description>
                    {activationDateObj ? (
                      <>
                        Påmelding åpner{' '}
                        {format(activationDateObj, "EEEE d. MMMM 'kl.' HH:mm", { locale: nb })}.
                      </>
                    ) : (
                      'Åpner på et senere tidspunkt.'
                    )}
                  </Alert.Description>
                </Alert.Content>
              </Alert>
            )}

            {/* Group Access Badges (shown when expanded) */}
            {pool.permissionGroups && pool.permissionGroups.length > 0 && (
              <View className="gap-1.5">
                <Typography type="body-xs" className=" font-semibold uppercase">
                  Grupper
                </Typography>
                <View className="flex-row flex-wrap items-center gap-1.5">
                  {pool.permissionGroups.map((group) => (
                    <Chip key={group.id} size="sm" className="border-border" variant="soft">
                      <Chip.Label>{group.name}</Chip.Label>
                    </Chip>
                    // <View
                    //   key={group.id}
                    //   className="border-border bg-secondary flex-row items-center gap-1 rounded-full border px-2.5 py-0.5">
                    //   <Text className="text-secondary-foreground text-[11px] font-medium">
                    //     {group.name}
                    //   </Text>
                    // </View>
                  ))}
                </View>
              </View>
            )}

            {/* Signed Up Users List */}
            <View className="gap-1.5">
              <Typography type="body-xs" className="font-semibold uppercase">
                Påmeldte deltakere
              </Typography>

              {hasRegistrations ? (
                <View className="gap-1">
                  {pool.registrations?.map((reg, idx) => (
                    <View
                      key={reg.id ?? idx}
                      className="flex-row items-center justify-between py-1">
                      <Text className="text-foreground text-sm font-medium">
                        {reg.user?.fullName || reg.user?.username || 'Anonym bruker'}
                      </Text>
                      {reg.user?.grade || reg.user?.abakusGroup?.name ? (
                        <Text className="text-muted-foreground text-xs">
                          {reg.user?.grade || reg.user?.abakusGroup?.name}
                        </Text>
                      ) : null}
                    </View>
                  ))}
                </View>
              ) : registered === 0 ? (
                <Text className="text-muted-foreground text-xs italic">
                  Ingen påmeldte i denne poolen ennå.
                </Text>
              ) : (
                <Text className="text-muted-foreground text-xs">
                  {registered} {registered === 1 ? 'person' : 'personer'} påmeldt.
                </Text>
              )}
            </View>
          </View>
        )}
      </Surface>
    </TouchableOpacity>
  );
};

export default PoolCard;
