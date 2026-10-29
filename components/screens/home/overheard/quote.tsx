import { Card, Typography } from 'heroui-native';

type OverheardProps = {
  quote: string;
  quotee: string;
  reactions: string;
};
const QuoteCard = ({ quote, quotee, reactions }: OverheardProps) => {
  return (
    <Card>
      <Card.Body className="gap-3">
        <Typography>{quote}</Typography>
        <Typography type="code">-{quotee}</Typography>
      </Card.Body>
    </Card>
  );
};

export default QuoteCard;
