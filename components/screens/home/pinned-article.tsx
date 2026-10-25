import env from '@/env';
import { components } from '@/lib/types/schema';
import { Linking } from 'react-native';
import ArticleCard from './article-card';
type PinnedArticleItem = Pick<
  components['schemas']['PublicArticle'],
  'id' | 'slug' | 'cover' | 'description' | 'tags' | 'createdAt'
>;
type PinnedArticleProps = {} & PinnedArticleItem;
const PinnedArticle = ({ id, tags, cover, description, slug, createdAt }: PinnedArticleProps) => {
  const handlePress = () => {
    Linking.openURL(`${env.EXPO_PUBLIC_FRONTEND_URL}/articles/${id}-${slug}`);
  };

  return (
    // Gotta cast the tags to string[] because the schema is incorrect.
    <ArticleCard
      cover={cover ?? ''}
      title={description ?? ''}
      tags={(tags as unknown as string[]) ?? []}
      onPress={handlePress}
      date={createdAt}
    />
  );
};

export default PinnedArticle;
