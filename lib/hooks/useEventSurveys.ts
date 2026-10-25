import { useEvent } from '@/lib/hooks/useEvent';
import { useMemo } from 'react';

const EMPTY_SURVEYS: number[] = [];

/**
 * Feels goofy that unanswered surveys are fetched through the event endpoint, but this is how the backend is set up.
 * This hook is a wrapper around the useEvent hook that extracts the unansweredSurveys from the event data.
 * @param eventId The id of the event to fetch unanswered surveys for.
 * @returns An object containing the unanswered surveys and the loading state.
 */
export const useUnansweredEventSurveys = (eventId: string) => {
  const { data: event, isLoading, ...query } = useEvent(eventId);

  const unansweredSurveys = useMemo(() => {
    if (event && 'unansweredSurveys' in event && Array.isArray(event.unansweredSurveys)) {
      return event.unansweredSurveys as number[];
    }
    return EMPTY_SURVEYS;
  }, [event]);

  return {
    unansweredSurveys,
    isLoading,
    ...query,
  };
};
