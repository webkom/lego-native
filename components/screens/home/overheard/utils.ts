import { useReaction } from '@/lib/hooks/useReaction';
import { Reaction } from '@/lib/types/reactions';
import { components } from '@/lib/types/schema';
import { InfiniteData } from '@tanstack/react-query';

type QuotesPage = {
  next?: string | null;
  previous?: string | null;
  results: components['schemas']['Quote'][];
};

export const handleOptimisticReaction =
  (
    postQueryKey: readonly unknown[],
    deleteQueryKey: readonly unknown[],
    emojis: Record<string, components['schemas']['Emoji'][]>
  ): NonNullable<Parameters<typeof useReaction>[0]['optimisticUpdateFn']> =>
  async (action, target, queryClient) => {
    if (action === 'post') {
      await queryClient.cancelQueries({ queryKey: [postQueryKey] });

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

      return { previousQuotes };
    }
    // Action is delete
  };
