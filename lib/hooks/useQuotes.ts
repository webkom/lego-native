import { api } from '../services/api';
import { extractCursor } from '../utils';

export const useRandomQuote = () => {
  const { data, ...rest } = api.useInfiniteQuery(
    'get',
    '/api/v1/quotes/',
    {
      params: { query: { approved: true } },
    },
    {
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => extractCursor(lastPage.next),
      getPreviousPageParam: (firstPage) => extractCursor(firstPage.previous),
    }
  );

  const allQuotes = data?.pages.flatMap((page) => page.results) || [];
  const randomIndex = Math.floor(Math.random() * allQuotes.length);
  const randomQuote = allQuotes[randomIndex];

  return { data: allQuotes[10], ...rest };
};
