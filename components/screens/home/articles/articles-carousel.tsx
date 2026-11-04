import Icon from '@/components/icon';
import env from '@/env';
import { components } from '@/lib/types/schema';
import { Typography } from 'heroui-native';
import { useState } from 'react';
import {
  LayoutChangeEvent,
  Linking,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import PaginationDots from '@/components/ui/pagination-dots';
import ArticleCard from './article-card';

type PublicArticleItem = components['schemas']['PublicArticle'];

const MAX_ARTICLES = 3;
const CARD_GAP = 12;

type ArticlesCarouselProps = {
  articles: PublicArticleItem[];
};

const ArticlesCarousel = ({ articles }: ArticlesCarouselProps) => {
  const [width, setWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const items = articles.filter((a) => !a.pinned).slice(0, MAX_ARTICLES);

  if (items.length === 0) return null;

  const snapInterval = width + CARD_GAP;

  const handleLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!snapInterval) return;
    const index = Math.max(
      0,
      Math.min(items.length - 1, Math.round(e.nativeEvent.contentOffset.x / snapInterval))
    );
    if (index !== activeIndex) setActiveIndex(index);
  };

  const handlePress = (slug: string) => {
    Linking.openURL(`${env.EXPO_PUBLIC_FRONTEND_URL}/articles/${slug}`);
  };

  return (
    <View className="gap-2">
      <View className="flex flex-row items-center justify-between">
        <Typography type="h4">Artikler</Typography>
        <Pressable
          onPress={() => handlePress('')}
          className="flex flex-row items-center gap-1 py-1 active:opacity-70">
          <Typography className="text-foreground text-sm">Se flere artikler</Typography>
          <Icon name="SquareArrowOutUpRight" size={14} className="text-foreground" />
        </Pressable>
      </View>
      <View onLayout={handleLayout}>
        {width > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={snapInterval}
            decelerationRate="fast"
            disableIntervalMomentum
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={{ flexGrow: 0 }}
            contentContainerStyle={{ gap: CARD_GAP, alignItems: 'flex-start' }}>
            {items.map((a) => (
              <ArticleCard
                key={a.id}
                width={width}
                title={a.title}
                description={a.description}
                cover={a.cover}
                coverPlaceholder={a.coverPlaceholder}
                tags={(a.tags as unknown as string[]) ?? []}
                onPress={() => handlePress(a.slug ?? '')}
              />
            ))}
          </ScrollView>
        )}
      </View>
      <PaginationDots count={items.length} activeIndex={activeIndex} />
    </View>
  );
};

export default ArticlesCarousel;
