import Icon from '@/components/icon';
import { GroupedEmojis, Reaction, SelectedEmoji } from '@/lib/types/reactions';
import { useState } from 'react';
import { View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { ReactionPicker } from './reaction-picker';
import { ReactionPill } from './reaction-pill';
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
      {reactions.map((reaction) => (
        <ReactionPill
          key={reaction.emoji}
          reaction={reaction}
          onReactionSelect={onReactionSelect}
        />
      ))}
      <Animated.View layout={LinearTransition.duration(200)}>
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
      </Animated.View>
    </View>
  );
};

export default Reactions;
