import { Image as ExpoImage } from 'expo-image';
import { Card, Chip } from 'heroui-native';
import { TouchableOpacity, View } from 'react-native';
import { withUniwind } from 'uniwind';

const Image = withUniwind(ExpoImage);

type ArticleCardProps = {
  title: string;
  description?: string | null;
  cover?: string;
  coverPlaceholder?: string;
  tags: string[];
  width: number;
  onPress?: () => void;
};

const ArticleCard = ({
  title,
  description,
  cover,
  coverPlaceholder,
  tags,
  width,
  onPress,
}: ArticleCardProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={{ width }}>
      <Card className="overflow-hidden p-0">
        <Image
          source={cover}
          placeholder={coverPlaceholder}
          className="bg-surface-secondary h-28 w-full"
          contentFit="cover"
          transition={200}
        />
        <Card.Body className="flex flex-col gap-2 p-3">
          <View className="flex flex-col gap-0.5">
            <Card.Title className="leading-tight" numberOfLines={2}>
              {title}
            </Card.Title>
            {description ? (
              <Card.Description numberOfLines={2}>{description}</Card.Description>
            ) : null}
          </View>
          {tags.length > 0 && (
            <View className="flex flex-row flex-wrap items-center gap-1">
              {tags.map((t, i) => (
                <Chip key={t + 'article-carousel-tag' + i} variant="secondary" size="sm">
                  <Chip.Label>{t}</Chip.Label>
                </Chip>
              ))}
            </View>
          )}
        </Card.Body>
      </Card>
    </TouchableOpacity>
  );
};

export default ArticleCard;
