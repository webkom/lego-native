import { useReaction } from '@/lib/hooks/useReaction';
import { GroupedEmojis, Reaction } from '@/lib/types/reactions';
import { components } from '@/lib/types/schema';
import { InfiniteData, QueryClient } from '@tanstack/react-query';

type Quote = components['schemas']['Quote'];
type QuotesPage = {
  next?: string | null;
  previous?: string | null;
  results: Quote[];
};

// The backend schema is incomplete, so here is some basic documentation for what the quote data looks like from the paginated API endpoint
/*
EXAMPLE STRCUTRE OF oldData:

{
  "pageParams": [null],
  "pages": [
    {
      "actionGrant": [Array], 
      "next": "https://lego-staging.abakus.no/api/v1/quotes/?approved=true&cursor=cD0yMDI2LTA5LTIzKzA5JTNBMTElM0EyNi4yNzEyNDAlMkIwMCUzQTAw", 
      "previous": null, 
      "results": [Array]
    }
  ]
}
*/

/*
EXAMPLE STRUCTURE OF quote RESULT:
{
  "approved": true, 
  "contentTarget": "quotes.quote-2129", 
  "createdAt": "2026-10-30T12:31:32.258536Z", 
  "createdBy": null, 
  "id": 2129, 
  "reactionsGrouped": [], 
  "source": "Dufe-Djønne", 
  "tags": [], 
  "text": 
  "Hvis du banke mæ e det hate crime. Hvis æ banke dæ e det empowerment."
}
*/

const isMatchingEmoji = (reaction: Reaction, emoji: string) =>
  reaction.emoji === emoji || reaction.unicodeString === emoji;

/**
 * Traverses the InfiniteData pages in cache and updates `reactionsGrouped`
 * for any quote that matches `shouldUpdateQuote`.
 */
const updateCachedQuoteReactions = (
  queryClient: QueryClient,
  queryKey: readonly unknown[],
  shouldUpdateQuote: (quote: Quote, reactions: Reaction[]) => boolean,
  updateReactions: (reactions: Reaction[]) => Reaction[]
) => {
  queryClient.setQueryData<InfiniteData<QuotesPage>>(queryKey, (oldData) => {
    if (!oldData) return oldData;

    return {
      ...oldData,
      pages: oldData.pages.map((page) => ({
        ...page,
        results: page.results.map((quote) => {
          const reactions = (quote.reactionsGrouped as unknown as Reaction[]) ?? [];
          if (!shouldUpdateQuote(quote, reactions)) return quote;

          return {
            ...quote,
            reactionsGrouped: updateReactions(reactions) as unknown as Quote['reactionsGrouped'],
          };
        }),
      })),
    };
  });
};

const addOptimisticReaction = (
  reactions: Reaction[],
  emojiTarget: string,
  emojis: GroupedEmojis
): Reaction[] => {
  const existingIndex = reactions.findIndex((r) => isMatchingEmoji(r, emojiTarget));

  if (existingIndex !== -1) {
    return reactions.map((r, idx) =>
      idx === existingIndex ? { ...r, count: r.count + 1, hasReacted: true } : r
    );
  }

  const matchedEmoji = Object.values(emojis)
    .flat()
    .find((e) => e.shortCode === emojiTarget || e.unicodeString === emojiTarget);

  return [
    ...reactions,
    {
      count: 1,
      emoji: matchedEmoji?.shortCode ?? emojiTarget,
      unicodeString: matchedEmoji?.unicodeString ?? emojiTarget,
      hasReacted: true,
      reactionId: null,
    },
  ];
};

const removeOptimisticReaction = (reactions: Reaction[], reactionId: number): Reaction[] =>
  reactions
    .map((r) =>
      r.reactionId === reactionId
        ? { ...r, count: r.count - 1, hasReacted: false, reactionId: null }
        : r
    )
    .filter((r) => r.count > 0);

/**
 * Handles optimistic updates for reactions on quotes. It is passed to the useReaction hook
 * and immideately updates the react query store when the user reacts to a quote
 */
export const handleOptimisticReaction =
  (
    queryKey: readonly unknown[],
    emojis: GroupedEmojis
  ): NonNullable<Parameters<typeof useReaction>[0]['optimisticUpdateFn']> =>
  async (action, target, queryClient) => {
    await queryClient.cancelQueries({ queryKey });
    const previousQuotes = queryClient.getQueryData<InfiniteData<QuotesPage>>(queryKey);

    const rollback = () => {
      if (previousQuotes) {
        queryClient.setQueryData(queryKey, previousQuotes);
      }
    };

    if (action === 'post') {
      const isTargetQuote = (q: Quote) => q.contentTarget === target.contentTarget;

      updateCachedQuoteReactions(queryClient, queryKey, isTargetQuote, (reactions) =>
        addOptimisticReaction(reactions, target.emoji, emojis)
      );

      return {
        previousQuotes,
        rollback,
        onSuccess: (createdReaction) => {
          const reactionId =
            createdReaction.id ??
            (createdReaction as unknown as { reactionId?: number }).reactionId ??
            null;

          updateCachedQuoteReactions(queryClient, queryKey, isTargetQuote, (reactions) =>
            reactions.map((r) => (isMatchingEmoji(r, target.emoji) ? { ...r, reactionId } : r))
          );
        },
      };
    }

    // Action is delete
    updateCachedQuoteReactions(
      queryClient,
      queryKey,
      (_q, reactions) => reactions.some((r) => r.reactionId === target),
      (reactions) => removeOptimisticReaction(reactions, target)
    );

    return { previousQuotes, rollback };
  };
