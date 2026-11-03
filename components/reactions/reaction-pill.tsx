import { Reaction, SelectedEmoji } from '@/lib/types/reactions';
import { Typography } from 'heroui-native';
import { TouchableOpacity, View } from 'react-native';
import { ReactionSurface } from './reaction-surface';

export type ReactionPillProps = {
  reaction: Reaction;
  onReactionSelect?: (emoji: SelectedEmoji) => void;
};

export const ReactionPill = ({ reaction, onReactionSelect }: ReactionPillProps) => {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          overflow: 'hidden',
        },
      ]}>
      <View className="shrink-0">
        <TouchableOpacity
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
      </View>
    </View>
  );
};

export default ReactionPill;
