import { useReaction } from '@/lib/hooks/useReaction';
import { Reaction } from '@/lib/types/reactions';
import { components } from '@/lib/types/schema';
import { InfiniteData } from '@tanstack/react-query';

type QuotesPage = {
  next?: string | null;
  previous?: string | null;
  results: components['schemas']['Quote'][];
};

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

/**
 * Handles optimistic updates for reactions on quotes. It is passed to the useReaction hook
 * and immideately updates the react query store when the user reacts to a quote
 */
export const handleOptimisticReaction =
  (
    postQueryKey: readonly unknown[],
    deleteQueryKey: readonly unknown[],
    emojis: Record<string, components['schemas']['Emoji'][]>
  ): NonNullable<Parameters<typeof useReaction>[0]['optimisticUpdateFn']> =>
  async (action, target, queryClient) => {
    console.log('OPTIMISTIC FUNCTION TRIGGERED: ', action, target);

    if (action === 'post') {
      await queryClient.cancelQueries({ queryKey: postQueryKey });

      const previousQuotes = queryClient.getQueryData<InfiniteData<QuotesPage>>(postQueryKey);
      const selectedEmoji = Object.values(emojis)
        .flat()
        .find((e) => e.shortCode === target.emoji || e.unicodeString === target.emoji);

      queryClient.setQueryData<InfiniteData<QuotesPage>>(postQueryKey, (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            results: page.results.map((q) => {
              if (q.contentTarget !== target.contentTarget) return q;

              const reactions = (q.reactionsGrouped as unknown as Reaction[]) ?? [];
              const existingIndex = reactions.findIndex(
                (r) => r.emoji === target.emoji || r.unicodeString === target.emoji
              );

              let updatedReactions: Reaction[];
              if (existingIndex !== -1) {
                updatedReactions = reactions.map((r, idx) =>
                  idx === existingIndex ? { ...r, count: r.count + 1, hasReacted: true } : r
                );
              } else {
                updatedReactions = [
                  ...reactions,
                  {
                    count: 1,
                    emoji: selectedEmoji?.shortCode ?? target.emoji,
                    hasReacted: true,
                    reactionId: null,
                    unicodeString: selectedEmoji?.unicodeString ?? target.emoji,
                  },
                ];
              }

              return {
                ...q,
                reactionsGrouped: updatedReactions as unknown as typeof q.reactionsGrouped,
              };
            }),
          })),
        };
      });

      return {
        previousQuotes,
        rollback: () => {
          if (previousQuotes) {
            queryClient.setQueryData(postQueryKey, previousQuotes);
          }
        },
        onSuccess: (createdReaction) => {
          const reactionId =
            createdReaction.id ??
            (createdReaction as unknown as { reactionId?: number }).reactionId ??
            null;

          queryClient.setQueryData<InfiniteData<QuotesPage>>(postQueryKey, (oldData) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                results: page.results.map((q) => {
                  if (q.contentTarget !== target.contentTarget) return q;

                  const reactions = (q.reactionsGrouped as unknown as Reaction[]) ?? [];
                  const updatedReactions = reactions.map((r) =>
                    r.emoji === target.emoji || r.unicodeString === target.emoji
                      ? { ...r, reactionId }
                      : r
                  );

                  return {
                    ...q,
                    reactionsGrouped: updatedReactions as unknown as typeof q.reactionsGrouped,
                  };
                }),
              })),
            };
          });
        },
      };
    }

    // Action is delete
    await queryClient.cancelQueries({ queryKey: deleteQueryKey });

    const previousQuotes = queryClient.getQueryData<InfiniteData<QuotesPage>>(deleteQueryKey);

    queryClient.setQueryData<InfiniteData<QuotesPage>>(deleteQueryKey, (oldData) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          results: page.results.map((q) => {
            const reactions = (q.reactionsGrouped as unknown as Reaction[]) ?? [];
            if (!reactions.some((r) => r.reactionId === target)) return q;

            const updatedReactions = reactions
              .map((r) =>
                r.reactionId === target
                  ? { ...r, count: r.count - 1, hasReacted: false, reactionId: null }
                  : r
              )
              .filter((r) => r.count > 0);

            return {
              ...q,
              reactionsGrouped: updatedReactions as unknown as typeof q.reactionsGrouped,
            };
          }),
        })),
      };
    });

    return {
      previousQuotes,
      rollback: () => {
        if (previousQuotes) {
          queryClient.setQueryData(deleteQueryKey, previousQuotes);
        }
      },
    };
  };
