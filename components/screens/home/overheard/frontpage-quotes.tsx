import { useEmojis } from '@/lib/hooks/useEmojis';
import { useRandomQuote } from '@/lib/hooks/useQuotes';
import { Reaction } from '@/lib/types/reactions';
import { Typography } from 'heroui-native';
import { View } from 'react-native';
import QuoteCard from './quote';
import { api } from '@/lib/services/api';
import { useQueryClient } from '@tanstack/react-query';
import { components } from '@/lib/types/schema';

const FrontpageQuote = () => {
  const { queryKey: quoteQueryKey } = api.queryOptions('get', '/api/v1/quotes/', {
    params: { query: { approved: true } },
  });

  const { data: quote } = useRandomQuote();
  const { emojis } = useEmojis();
  const queryClient = useQueryClient();
  const { mutate: react } = api.useMutation('post', '/api/v1/reactions/', {
    onMutate: (newReaction) => {
      // Optimistically update the quote's reactions
      queryClient.setQueryData(
        quoteQueryKey,
        (oldData: { pages: { results: components['schemas']['Quote'][] } }) => {
          console.log(oldData);
          // Insert the vote at the correct quote in the list
          const updatedData = oldData.pages.results.map((q) => {
            console.log('Reactions grouped: ', q.reactionsGrouped);
            if (q.contentTarget !== newReaction.body.contentTarget) return q;

            const reactions = q.reactionsGrouped as unknown as Reaction[];
            const updatedReactions = reactions.map((r) => {
              if (r.unicodeString !== newReaction.body.emoji) return r;

              return { ...r, count: r.count + 1, hasReacted: true };
            });

            return updatedReactions;
          });

          const newData = { ...oldData, pages: updatedData };

          console.log(newData);
          return newData;
        }
      );
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
        onReactionSelect={(code) => {
          console.log('Posting');
          react({ body: { contentTarget: quote.contentTarget, emoji: code } as any });
        }}
      />
    </View>
  );
};

export default FrontpageQuote;
