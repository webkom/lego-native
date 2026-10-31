import Icon from '@/components/icon';
import { GroupedEmojis, SelectedEmoji } from '@/lib/types/reactions';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { BottomSheet, Surface, Typography } from 'heroui-native';
import { ComponentProps, memo, useCallback, useMemo, useState } from 'react';
import { Pressable, Text, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

type IconCategory =
  | 'people'
  | 'animals_and_nature'
  | 'food_and_drink'
  | 'activity'
  | 'travel_and_places'
  | 'objects'
  | 'symbols'
  | 'flags';

const mapCategoryNameToIconName = (name: IconCategory): ComponentProps<typeof Icon>['name'] => {
  switch (name) {
    case 'people':
      return 'Smile';

    case 'animals_and_nature':
      return 'Leaf';

    case 'food_and_drink':
      return 'Beer';

    case 'activity':
      return 'LandPlot';

    case 'travel_and_places':
      return 'Plane';

    case 'objects':
      return 'Lightbulb';

    case 'symbols':
      return 'Heart';

    case 'flags':
      return 'Flag';

    default:
      return 'CircleQuestionMark';
  }
};

const categoryNameToReadableName: Record<IconCategory, string> = {
  people: 'Folk',
  animals_and_nature: 'Dyr og natur',
  food_and_drink: 'Mat og drikke',
  activity: 'Aktivitet',
  travel_and_places: 'Reise og steder',
  objects: 'Objekter',
  symbols: 'Symboler',
  flags: 'Flagg',
};

const EmojiCell = memo(
  ({ emoji, onSelect }: { emoji: SelectedEmoji; onSelect?: (emoji: SelectedEmoji) => void }) => (
    <Pressable
      className="h-11 w-11 items-center justify-center active:opacity-50"
      onPress={() => onSelect?.(emoji)}>
      <Text className="text-3xl">{emoji.unicodeString}</Text>
    </Pressable>
  )
);

const CategoryTab = memo(
  ({
    category,
    isSelected,
    onSelect,
  }: {
    category: string;
    isSelected: boolean;
    onSelect: (category: string) => void;
  }) => (
    <TouchableOpacity onPress={() => onSelect(category)}>
      <Surface variant={isSelected ? 'default' : 'secondary'} className="mr-2 px-4 py-2">
        <Icon
          name={mapCategoryNameToIconName(category as IconCategory)}
          className="text-surface-secondary-foreground"
        />
      </Surface>
    </TouchableOpacity>
  )
);

const EMOJI_ROW_HEIGHT = 52; // h-11 (44px) + gap-2 (8px)

export type ReactionPickerProps = {
  children?: React.ReactNode;
  emojis?: GroupedEmojis;
  onReactionSelect?: (emoji: SelectedEmoji) => void;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
};

export const ReactionPicker = ({
  emojis,
  children,
  onReactionSelect,
  onOpenChange,
  open,
}: ReactionPickerProps) => {
  const categories = useMemo(() => {
    if (!emojis) return [];
    return Object.keys(emojis);
  }, [emojis]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(categories[0] ?? null);
  const activeCategory = selectedCategory ?? categories[0] ?? null;

  const renderCategoryItem = useCallback(
    ({ item }: { item: string }) => (
      <CategoryTab
        category={item}
        isSelected={activeCategory === item}
        onSelect={setSelectedCategory}
      />
    ),
    [activeCategory]
  );

  const renderEmojiItem = useCallback(
    ({ item }: { item: SelectedEmoji }) => <EmojiCell emoji={item} onSelect={onReactionSelect} />,
    [onReactionSelect]
  );

  const getEmojiItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: EMOJI_ROW_HEIGHT,
      offset: EMOJI_ROW_HEIGHT * index,
      index,
    }),
    []
  );

  return (
    <BottomSheet isOpen={open} onOpenChange={onOpenChange}>
      {children && <BottomSheet.Trigger>{children}</BottomSheet.Trigger>}
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content
          snapPoints={['50%', '85%']}
          enableDynamicSizing={false}
          enableOverDrag={false}
          contentContainerClassName="h-full gap-3">
          <BottomSheet.Title>Velg piktogram</BottomSheet.Title>
          {emojis && (
            <>
              <FlatList
                data={categories}
                horizontal
                className="grow-0"
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item}
                renderItem={renderCategoryItem}
              />

              <Typography>
                {categoryNameToReadableName[activeCategory as IconCategory] ?? 'Ukjent kategori'}
              </Typography>

              {activeCategory && (
                <BottomSheetFlatList
                  data={emojis[activeCategory]}
                  numColumns={6}
                  className="flex-1"
                  columnWrapperClassName="justify-between"
                  contentContainerClassName="gap-2 pb-6"
                  keyExtractor={(i) => i.shortCode}
                  renderItem={renderEmojiItem}
                  getItemLayout={getEmojiItemLayout}
                  initialNumToRender={6}
                  maxToRenderPerBatch={6}
                  windowSize={5}
                  removeClippedSubviews
                />
              )}
            </>
          )}
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
};

export default ReactionPicker;
