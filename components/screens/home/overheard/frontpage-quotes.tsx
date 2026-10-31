import { useEmojis } from '@/lib/hooks/useEmojis';
import { useRandomQuote } from '@/lib/hooks/useQuotes';
import { api } from '@/lib/services/api';
import { Reaction } from '@/lib/types/reactions';
import { components } from '@/lib/types/schema';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { Typography } from 'heroui-native';
import { View } from 'react-native';
import QuoteCard from './quote';

type QuotesPage = {
  next?: string | null;
  previous?: string | null;
  results: components['schemas']['Quote'][];
};

const FrontpageQuote = () => {
  const { queryKey: quoteQueryKey } = api.queryOptions('get', '/api/v1/quotes/', {
    params: { query: { approved: true } },
  });

  const { data: quote } = useRandomQuote();
  const { emojis } = useEmojis();
  const queryClient = useQueryClient();

  const { mutate: react } = api.useMutation('post', '/api/v1/reactions/', {
    onMutate: async (newReaction) => {
      await queryClient.cancelQueries({ queryKey: quoteQueryKey });

      const previousQuotes = queryClient.getQueryData<InfiniteData<QuotesPage>>(quoteQueryKey);
      const selectedEmoji = Object.values(emojis)
        .flat()
        .find(
          (e) =>
            e.shortCode === newReaction.body.emoji || e.unicodeString === newReaction.body.emoji
        );

      queryClient.setQueryData<InfiniteData<QuotesPage>>(quoteQueryKey, (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            results: page.results.map((q) => {
              if (q.contentTarget !== newReaction.body.contentTarget) return q;

              const reactions = (q.reactionsGrouped as unknown as Reaction[]) ?? [];
              const existingIndex = reactions.findIndex(
                (r) =>
                  r.emoji === newReaction.body.emoji || r.unicodeString === newReaction.body.emoji
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
                    emoji: selectedEmoji?.shortCode ?? newReaction.body.emoji,
                    hasReacted: true,
                    reactionId: null,
                    unicodeString: selectedEmoji?.unicodeString ?? newReaction.body.emoji,
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
    },
    onError: (_err, _newReaction, context) => {
      if (context?.previousQuotes) {
        queryClient.setQueryData(quoteQueryKey, context.previousQuotes);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: quoteQueryKey });
    },
  });

  if (!quote) return null;
  return (
    <View className="gap-1">
      <Typography type="h4">Overhørt</Typography>
      <QuoteCard
        emojis={emojis}
        quote={quote.text}
        quotee={quote.source}
        reactions={quote.reactionsGrouped as unknown as Reaction[]}
        onReactionSelect={(emoji) => {
          // Figure out if the user has already reacted to this emoji
          const hasReacted = quote.reactionsGrouped;

          react({
            body: {
              contentTarget: quote.contentTarget,
              emoji: emoji.shortCode,
            } as components['schemas']['Reaction'],
          });
        }}
      />
    </View>
  );
};

export default FrontpageQuote;
