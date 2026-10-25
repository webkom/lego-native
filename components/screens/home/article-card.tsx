import Icon from '@/components/icon';
import { Image as ExpoImage } from 'expo-image';
import { Card, Chip } from 'heroui-native';
import { TouchableOpacity, View } from 'react-native';
import { withUniwind } from 'uniwind';

const Image = withUniwind(ExpoImage);

function capitalize(text: string): string {
  if (!text) return '';
  return text[0]?.toUpperCase() + text.slice(1);
}

type ArticleCardProps = {
  title: string;
  cover: string;
  tags: string[];
  date?: string;
  onPress?: () => void;
};
const ArticleCard = ({ cover, tags, title, onPress, date }: ArticleCardProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Card className="relative overflow-visible">
        <View className="bg-accent-hover rotate-35 absolute -right-2 -top-2 z-10 flex items-center justify-center rounded-full p-2 shadow-lg">
          <Icon name="MessageSquareText" className="text-accent-foreground" />
        </View>
        <Card.Body className="flex flex-row items-start gap-3">
          <Image
            source={cover}
            className="bg-surface-secondary h-20 w-20 rounded-md"
            contentFit="cover"
          />
          <View className="flex flex-1 flex-col gap-3">
            <View className="flex w-full flex-col gap-0">
              <Card.Title className="leading-tight">{title}</Card.Title>
              <Card.Description>{date}</Card.Description>
            </View>
            <View className="flex flex-row flex-wrap items-center gap-1">
              {tags.map((t, i) => (
                <Chip key={t + 'article-tag' + i} variant="secondary" size="sm">
                  <Chip.Label>{capitalize(t)}</Chip.Label>
                </Chip>
              ))}
            </View>
          </View>
        </Card.Body>
      </Card>
    </TouchableOpacity>
  );
};

export default ArticleCard;
