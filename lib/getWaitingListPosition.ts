import { components } from '@/lib/types/schema';

type Registration = components['schemas']['RegistrationReadDetailed'];
type Pool = components['schemas']['EventReadUserDetailed']['pools'][number] & {
  allPermissionGroupIds?: number[];
  isWaitingList?: boolean;
};

export type WaitingListPosition =
  | number
  | {
      poolName: string;
      position: number;
    }[];

const isPermittedInPool = (user?: Registration['user'], pool?: Pool) => {
  console.log(user, pool);
  if (!user || !pool) return false;
  const permissionGroupIds: number[] =
    pool.allPermissionGroupIds ??
    pool.permissionGroups?.map((group) => (typeof group === 'number' ? group : group.id)) ??
    [];

  console.log("Pool's permission groups: ", permissionGroupIds);

  const userGroupIds: number[] =
    user.abakusGroups?.map((group: any) => (typeof group === 'number' ? group : group.id)) ?? [];

  return permissionGroupIds.some((permissionGroupId) => userGroupIds.includes(permissionGroupId));
};

/**
 * Pure helper function to compute a user's waiting list position.
 * Returns:
 * - undefined if the user is not on the waiting list or no valid pools
 * - number (1-based index) if there is only 1 non-waiting list pool
 * - array of { poolName, position } if there are multiple pools
 */
export function getWaitingListPosition(
  currentRegistration?: Registration,
  waitingRegistrationsOrEvent?: Registration[] | components['schemas']['EventReadUserDetailed'],
  pools?: Pool[]
): WaitingListPosition | undefined {
  if (!currentRegistration || !waitingRegistrationsOrEvent) return undefined;

  let waitingRegistrations: Registration[] | undefined;
  let resolvedPools: Pool[] | undefined = pools;

  if (Array.isArray(waitingRegistrationsOrEvent)) {
    waitingRegistrations = waitingRegistrationsOrEvent;
  } else if (typeof waitingRegistrationsOrEvent === 'object') {
    waitingRegistrations = (waitingRegistrationsOrEvent as any).waitingRegistrations;
    if (!resolvedPools) {
      resolvedPools = waitingRegistrationsOrEvent.pools as Pool[];
    }
  }

  if (!waitingRegistrations || !resolvedPools) return undefined;

  const registrationIndex = waitingRegistrations.findIndex(
    (registration) =>
      registration.id === currentRegistration.id ||
      (registration.user?.id && registration.user.id === currentRegistration.user?.id)
  );

  if (registrationIndex === -1) return undefined;

  const nonWaitingListPools = resolvedPools.filter((pool) => !pool.isWaitingList);

  const applicablePools = nonWaitingListPools.filter((pool) =>
    isPermittedInPool(currentRegistration.user, pool)
  );

  if (applicablePools.length === 0) return undefined;

  if (nonWaitingListPools.length === 1) {
    return registrationIndex + 1;
  }

  return applicablePools.map((pool) => {
    const applicableWaitingListRegistrations = waitingRegistrations.filter((registration) =>
      isPermittedInPool(registration.user, pool)
    );
    const position = applicableWaitingListRegistrations.findIndex(
      (registration) =>
        registration.id === currentRegistration.id ||
        (registration.user?.id && registration.user.id === currentRegistration.user?.id)
    );
    return {
      poolName: pool.name,
      position: position + 1,
    };
  });
}

export const getWaitingListPositions = getWaitingListPosition;
