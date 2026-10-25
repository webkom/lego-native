import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo } from 'react';

import { useEvent } from '@/lib/hooks/useEvent';
import { useUser } from '@/lib/hooks/useUser';
import { api } from '@/lib/services/api';
import { setupWebSocketServer } from '@/lib/services/websockets';
import { SocketEvent, SocketEventType } from '@/lib/types/websockets';
import { components } from '@/lib/types/schema';

type Registration = components['schemas']['RegistrationReadDetailed'];

const isActiveRegistration = (registration: Registration) =>
  registration.status !== 'PENDING_UNREGISTER' &&
  registration.status !== 'SUCCESS_UNREGISTER' &&
  registration.status !== 'FAILURE_REGISTER';

/**
 * Handles event registration, unregistration, registration status and websockets
 * @param id Event ID to register/unregister for
 * @returns
 */
export const useEventAttendance = ({ id }: { id: string }) => {
  const { data: event, isLoading, isError } = useEvent(id);
  const queryClient = useQueryClient();
  const user = useUser();
  const signOffMutation = api.useMutation('delete', '/api/v1/events/{eventPk}/registrations/{id}/');

  const invalidateEventData = useCallback(async () => {
    const eventIdNum = Number(id);
    if (isNaN(eventIdNum)) return;
    await Promise.all([
      queryClient.invalidateQueries(
        api.queryOptions('get', '/api/v1/events/{id}/', {
          params: { path: { id: eventIdNum } },
        })
      ),
      queryClient.invalidateQueries(
        api.queryOptions('get', '/api/v1/events/{id}/registration-eligibility/', {
          params: { path: { id: eventIdNum } },
        })
      ),
    ]);
  }, [id, queryClient]);

  const pools = event?.pools;
  const totalCapacity = useMemo(() => {
    if (!pools?.length) {
      return undefined;
    }

    return pools.reduce((sum, pool) => sum + (pool.capacity ?? 0), 0);
  }, [pools]);

  const attendees = useMemo(() => {
    if (!pools) return [];
    const poolList = pools as (components['schemas']['PoolRead'] & {
      registrations?: Registration[];
    })[];
    return poolList.flatMap(
      (pool) =>
        (pool.registrations ?? [])
          .filter(isActiveRegistration)
          .map((registration) => registration.user?.id?.toString())
          .filter(Boolean) as string[]
    );
  }, [pools]);

  const pendingRegistration = useMemo(() => {
    const raw = (event as any)?.pendingRegistration;
    if (raw && typeof raw === 'object' && 'id' in raw) {
      return raw as Registration;
    }
    return undefined;
  }, [event]);

  const userId = user?.id;
  const userRegistration = useMemo(() => {
    if (!userId) return undefined;

    if (pendingRegistration?.status === 'PENDING_UNREGISTER') {
      return undefined;
    }

    const poolList = (pools ?? []) as (components['schemas']['PoolRead'] & {
      registrations?: Registration[];
    })[];
    const poolRegistrations = poolList.flatMap((pool) => pool.registrations ?? []);
    const waitingRegistrations = ((event as any)?.waitingRegistrations ?? []) as Registration[];
    const allRegistrations = [...poolRegistrations, ...waitingRegistrations];
    const activeMatch = allRegistrations.find(
      (registration) =>
        registration.user?.id?.toString() === userId.toString() &&
        isActiveRegistration(registration)
    );

    if (activeMatch) {
      return activeMatch;
    }

    if (pendingRegistration && isActiveRegistration(pendingRegistration)) {
      return pendingRegistration;
    }

    return undefined;
  }, [pools, event, userId, pendingRegistration]);

  const isUserSignedUp = !!userRegistration;

  // Poll until backend Celery worker settles any PENDING_* registration state
  useEffect(() => {
    const status = pendingRegistration?.status;
    if (status !== 'PENDING_REGISTER' && status !== 'PENDING_UNREGISTER') {
      return;
    }

    const timer = setTimeout(() => {
      void invalidateEventData();
    }, 400);

    return () => clearTimeout(timer);
  }, [pendingRegistration, invalidateEventData]);

  // Do workaround because penalties is defined as a string in the openapi schema, but is actually an array of numbers
  let totalCurrentPenalties = 0;
  if (user?.penalties && Array.isArray(user.penalties)) {
    totalCurrentPenalties = user.penalties.reduce((sum, penalty) => sum + penalty.weight, 0);
  }

  // Set up and handle websocket client
  useEffect(() => {
    let isMounted = true;
    let ws: WebSocket | null = null;

    const callback = (message: SocketEvent) => {
      const targetEventId = event?.id?.toString();
      const messageEventId = message.meta?.eventId?.toString();

      if (
        (message.type === SocketEventType.RegistrationSuccess ||
          message.type === SocketEventType.UnregistrationSuccess) &&
        messageEventId === targetEventId
      ) {
        void invalidateEventData();
      }
    };

    const initializeWebSocket = async () => {
      const socket = await setupWebSocketServer(callback);
      if (!isMounted) {
        socket?.close();
        return;
      }
      ws = socket;
    };

    initializeWebSocket();

    return () => {
      isMounted = false;
      ws?.close();
    };
  }, [event?.id, invalidateEventData]);

  const signUp = api.useMutation('post', '/api/v1/events/{eventPk}/registrations/', {
    onSuccess: async () => {
      await invalidateEventData();
      setTimeout(() => {
        void invalidateEventData();
      }, 500);
    },
  });

  const signOffAsync = async () => {
    // Get the user's registration ID for this event
    const registrationId = userRegistration?.id;
    if (!registrationId) {
      throw new Error('User is not registered for this event');
    }

    await signOffMutation.mutateAsync({
      params: { path: { eventPk: id, id: registrationId } },
    });

    await invalidateEventData();
    setTimeout(() => {
      void invalidateEventData();
    }, 500);
  };

  return {
    signUp,
    signOffAsync,
    totalCapacity,
    isUserSignedUp,
    userRegistration,
    isLoading,
    isError,
    attendees,
    totalCurrentPenalties,
  };
};
