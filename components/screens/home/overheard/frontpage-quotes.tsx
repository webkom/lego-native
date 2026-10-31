import { useEmojis } from '@/lib/hooks/useEmojis';
import { useRandomQuote } from '@/lib/hooks/useQuotes';
import { useReaction } from '@/lib/hooks/useReaction';
import { api } from '@/lib/services/api';
import { Reaction, SelectedEmoji } from '@/lib/types/reactions';
import { components } from '@/lib/types/schema';
import { Typography } from 'heroui-native';
import { View } from 'react-native';
import QuoteCard from './quote';
import { handleOptimisticReaction } from './utils';

const FrontpageQuote = () => {
  const { data: quote } = useRandomQuote();
  const { emojis } = useEmojis();

  const { queryKey: reactionQueryKey } = api.queryOptions('get', '/api/v1/quotes/', {
    params: { query: { approved: true } },
  });

  const reactions = useReaction({
    optimisticUpdateFn: handleOptimisticReaction(reactionQueryKey, reactionQueryKey, emojis),
  });

  if (!quote) return null;

  // Function for deciding what to do when the user reacts to a quote
  const handleReactionSelect = (emoji: SelectedEmoji) => {
    const quoteReactions = quote.reactionsGrouped as unknown as Reaction[];
    const hasReacted = quoteReactions.some(
      (r) => r.emoji === emoji.shortCode || r.unicodeString === emoji.unicodeString
    );

    alert('Has reacted: ' + hasReacted);

    // Create reaction if not reacted with emoji
    if (!hasReacted) {
      return reactions.postReaction.mutate({
        body: {
          contentTarget: quote.contentTarget,
          emoji: emoji.shortCode,
        } as components['schemas']['Reaction'],
      });
    }

    // Delete reaction if already reacted with emoji
    const existingReaction = (quote.reactionsGrouped as unknown as Reaction[]).find(
      (r) => r.emoji === emoji.shortCode || r.unicodeString === emoji.unicodeString
    );

    if (!existingReaction || existingReaction.reactionId === null) return;

    return reactions.deleteReaction.mutate({
      params: { path: { id: existingReaction.reactionId } },
    });
  };

  return (
    <View className="gap-1">
      <Typography type="h4">Overhørt</Typography>
      <QuoteCard
        emojis={emojis}
        quote={quote.text}
        quotee={quote.source}
        reactions={quote.reactionsGrouped as unknown as Reaction[]}
        onReactionSelect={handleReactionSelect}
      />
    </View>
  );
};

export default FrontpageQuote;
