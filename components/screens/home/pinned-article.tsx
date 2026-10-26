import env from '@/env';
import { components } from '@/lib/types/schema';
import { Linking, View } from 'react-native';
import ArticleCard from './article-card';
import { Typography } from 'heroui-native';
type PinnedArticleItem = Pick<
  components['schemas']['PublicArticle'],
  'id' | 'slug' | 'cover' | 'description' | 'tags' | 'createdAt'
>;
type PinnedArticleProps = {} & PinnedArticleItem;
const PinnedArticle = ({ id, tags, cover, description, slug, createdAt }: PinnedArticleProps) => {
  const handlePress = () => {
    Linking.openURL(`${env.EXPO_PUBLIC_FRONTEND_URL}/articles/${slug}`);
  };

  return (
    <View className="gap-1">
      <Typography type="h4">Festet oppslag</Typography>
      <ArticleCard
        cover={cover ?? ''}
        title={description ?? ''}
        tags={(tags as unknown as string[]) ?? []}
        onPress={handlePress}
        date={createdAt}
      />
    </View>
  );
};

export default PinnedArticle;
