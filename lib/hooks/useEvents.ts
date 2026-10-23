import { api } from '../services/api';
import { operations } from '../types/schema';

function extractCursor(url?: string | null): string | null {
  if (!url) return null;

  try {
    return new URL(url).searchParams.get('cursor');
  } catch {
    // Fallback in case `next` is a relative URL or raw cursor
    const match = url.match(/[?&]cursor=([^&]+)/);
    return match ? decodeURIComponent(match[1] ?? '') : url;
  }
}

/**
 * Paginated hook for fetching events from lego.
 * @param param0
 * @returns
 */
export function useEvents(query: operations['eventsList']['parameters']['query'] = {}) {
  const now = query.date_after ?? new Date().toISOString().split('T')[0];
  return api.useInfiniteQuery(
    'get',
    '/api/v1/events/',
    {
      params: { query: { date_after: now } },
    },
    {
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => extractCursor(lastPage.next),
      getPreviousPageParam: (firstPage) => extractCursor(firstPage.previous),
    }
  );
}
