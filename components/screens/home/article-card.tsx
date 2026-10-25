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
  onPress?: () => void;
};
const ArticleCard = ({ cover, tags, title, onPress }: ArticleCardProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Card>
        <Card.Body className="flex flex-row items-start gap-3">
          <Image
            source={cover}
            className="bg-surface-secondary h-20 w-20 rounded-md"
            contentFit="cover"
          />
          <View className="flex flex-1 flex-col gap-2">
            <Card.Title className="leading-tight">{title}</Card.Title>
            <View className="flex flex-row flex-wrap items-center gap-1">
              {tags.map((t, i) => (
                <Chip key={t + 'article-tag' + i} variant="secondary">
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
