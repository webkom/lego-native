import { Reactions } from '@/components/reactions';
import { GroupedEmojis, Reaction, SelectedEmoji } from '@/lib/types/reactions';
import { Card, Typography } from 'heroui-native';

export type OverheardProps = {
  quote: string;
  quotee: string;
  reactions: Reaction[];
  emojis?: GroupedEmojis;
  onReactionSelect?: (emoji: SelectedEmoji) => void;
};

const QuoteCard = ({ quote, quotee, reactions, emojis, onReactionSelect }: OverheardProps) => {
  return (
    <Card>
      <Card.Body className="gap-3">
        <Typography>{quote}</Typography>
        <Typography type="code">-{quotee}</Typography>
        <Reactions
          reactions={reactions}
          emojis={emojis}
          onReactionSelect={(emoji) => {
            onReactionSelect?.(emoji);
          }}
        />
      </Card.Body>
    </Card>
  );
};

export default QuoteCard;
