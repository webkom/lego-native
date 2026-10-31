import Icon from '@/components/icon';
import { GroupedEmojis, Reaction, SelectedEmoji } from '@/lib/types/reactions';
import { Typography } from 'heroui-native';
import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ReactionPicker } from './reaction-picker';
import { ReactionSurface } from './reaction-surface';

export type ReactionsProps = {
  reactions: Reaction[];
  emojis?: GroupedEmojis;
  onReactionSelect?: (emoji: SelectedEmoji) => void;
};

export const Reactions = ({ reactions, emojis, onReactionSelect }: ReactionsProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <View className="flex flex-row flex-wrap gap-2">
      {reactions.map((reaction, index) => (
        <TouchableOpacity
          key={`${reaction.reactionId ?? reaction.emoji}${index}`}
          onPress={() =>
            onReactionSelect?.({
              shortCode: reaction.emoji,
              unicodeString: reaction.unicodeString,
            })
          }>
          <ReactionSurface hasReacted={reaction.hasReacted}>
            <Typography className="text-sm leading-none">{reaction.unicodeString}</Typography>
            <Typography className="text-sm leading-none">{reaction.count}</Typography>
          </ReactionSurface>
        </TouchableOpacity>
      ))}
      <ReactionPicker
        emojis={emojis}
        onReactionSelect={(emoji) => {
          onReactionSelect?.(emoji);
          setModalOpen(false);
        }}
        open={modalOpen}
        onOpenChange={setModalOpen}>
        <ReactionSurface hasReacted={false}>
          <Icon name="SmilePlus" size={16} className="text-surface-secondary-foreground/70" />
        </ReactionSurface>
      </ReactionPicker>
    </View>
  );
};

export default Reactions;
