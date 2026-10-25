import { api } from '@/lib/services/api';

export const useRegistrationEligibility = (eventId: string) => {
  return api.useQuery('get', `/api/v1/events/{id}/registration-eligibility/`, {
    params: {
      path: {
        id: eventId as unknown as number,
      },
    },
  });
};
