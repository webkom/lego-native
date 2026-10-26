import env from '@/env';
import { Linking, View } from 'react-native';
import ArticleCard from './article-card';
import { Typography } from 'heroui-native';
import { components } from '@/lib/types/schema';

type PublicArticleItem = components['schemas']['PublicArticle'];

const PinnedArticle = ({ title, slug, cover, tags, createdAt }: PublicArticleItem) => {
  const handlePress = () => {
    Linking.openURL(`${env.EXPO_PUBLIC_FRONTEND_URL}/articles/${slug}`);
  };

  return (
    <View className="gap-1">
      <Typography type="h4">Festet oppslag</Typography>
      <ArticleCard
        cover={cover ?? ''}
        title={title}
        tags={(tags as unknown as string[]) ?? []}
        onPress={handlePress}
        date={createdAt}
      />
    </View>
  );
};

export default PinnedArticle;
