import { useAtom } from 'jotai';
import { quoteSeedAtom } from '../atoms/quote-seed-atom';
import { api } from '../services/api';
import { extractCursor } from '../utils';
import { useRef } from 'react';

const MAX_RECURSION_DEPTH = 10;

export const useRandomQuote = () => {
  const [randomSeed, setRandomSeed] = useAtom(quoteSeedAtom);
  const recursionCount = useRef(0);

  const { data, dataUpdatedAt, ...rest } = api.useInfiniteQuery(
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

  const calculateRandomIndex = (randomSeed: number) => {
    return Math.floor(randomSeed * allQuotes.length);
  };

  const randomIndex = calculateRandomIndex(randomSeed);

  /**
   * Fetches a new random quote by generating a new random seed.
   * (Almost) Guarantees to not show the same quote as the previous one,
   * unless there's only one available quote.
   */
  const getNewQuote = () => {
    // eslint-disable-next-line react-hooks/purity
    const newRandomNumber = Math.random();
    const newRandomIndex = calculateRandomIndex(newRandomNumber);

    if (
      newRandomIndex === randomIndex &&
      allQuotes.length > 1 &&
      recursionCount.current < MAX_RECURSION_DEPTH
    ) {
      recursionCount.current += 1;
      getNewQuote();
    }

    setRandomSeed(newRandomNumber);
  };

  const randomQuote = allQuotes[randomIndex];

  return { data: randomQuote, getNewQuote, ...rest };
};
