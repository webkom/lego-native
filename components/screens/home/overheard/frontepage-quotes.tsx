import { useRandomQuote } from '@/lib/hooks/useQuotes';
import QuoteCard from './quote';
import { View } from 'react-native';
import { Typography } from 'heroui-native';

const FrontpageQuote = () => {
  const { data: quote } = useRandomQuote();
  if (!quote) return null;
  return (
    <View className="gap-1">
      <Typography type="h4">Overhørt</Typography>
      <QuoteCard quote={quote.text} quotee={quote.source} reactions={quote.reactionsGrouped} />
    </View>
  );
};

export default FrontpageQuote;
